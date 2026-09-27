"""
Multi-Functional Telegram Bot:
- Matematika (Ko'paytirish jadvali + Masala/Misol rasmini yechish)
- Ingliz tili (Writing, Speaking, Grammar, Vocab / Tarjimon)
- Gemini Multimodal Vision & Async Engine (avtomatik qayta urinish bilan)
- WebAdmin & SQLite Logs integratsiyasi
"""

import os
import re
import random
import asyncio
import tempfile
import sqlite3
import logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# .env yuklash
load_dotenv()
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

from google import genai
from google.genai import types
from google.genai import errors as genai_errors

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

TELEGRAM_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
ADMIN_PASSWORD = os.environ.get("WEBADMIN_PASSWORD", "6221991")

client = genai.Client(api_key=GEMINI_KEY)
GEMINI_MODEL = "gemini-3.8-flash"

FRIENDLY_ERROR_MSG = (
    "⚠️ Kechirasiz, hozir sun'iy intellekt xizmati band yoki vaqtinchalik "
    "ishlamayapti. Iltimos, bir necha soniyadan so'ng qayta urinib ko'ring."
)

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            username TEXT,
            task_type TEXT,
            essay TEXT,
            band_score REAL,
            created_at TEXT,
            errors_text TEXT
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            username TEXT,
            action TEXT,
            detail TEXT,
            created_at TEXT
        )
        """
    )
    conn.commit()
    conn.close()


def log_activity(user_id, username, action, detail=""):
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO activity_log (user_id, username, action, detail, created_at) "
            "VALUES (?, ?, ?, ?, ?)",
            (user_id, username or "", action, str(detail)[:200], datetime.utcnow().isoformat()),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Log xatoligi: {e}")


def save_submission(user_id, username, task_type, essay, band, errors_text=""):
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO submissions (user_id, username, task_type, essay, band_score, created_at, errors_text) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, username, task_type, essay, band, datetime.utcnow().isoformat(), errors_text),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Saqlashda xatolik: {e}")


def get_user_stats(user_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT COUNT(*), AVG(band_score) FROM submissions WHERE user_id = ?",
        (user_id,),
    )
    count, avg = cur.fetchone()
    conn.close()
    return count or 0, round(avg, 1) if avg else None


def get_recent_errors(user_id, limit=15):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT errors_text FROM submissions WHERE user_id = ? AND errors_text != '' "
        "ORDER BY created_at DESC LIMIT ?",
        (user_id, limit),
    )
    rows = cur.fetchall()
    conn.close()
    return [r[0] for r in rows if r[0]]


user_state = {}
current_speaking_question = {}

MAIN_KEYBOARD = ReplyKeyboardMarkup(
    [["🔢 Matematika", "🇬🇧 Ingliz tili"]],
    resize_keyboard=True,
)

MATH_KEYBOARD = ReplyKeyboardMarkup(
    [["✖️ Ko'paytirish jadvali", "📸 Misol rasmini yechish"], ["⬅️ Bosh menyu"]],
    resize_keyboard=True,
)

ENGLISH_KEYBOARD = ReplyKeyboardMarkup(
    [["✍️ Writing", "🎙 Speaking"], ["📖 Grammar", "📚 Vocab"], ["⬅️ Bosh menyu"]],
    resize_keyboard=True,
)

WRITING_KEYBOARD = ReplyKeyboardMarkup(
    [
        ["📝 Task 1", "📝 Task 2"],
        ["🧩 Struktura", "🎲 Mavzu"],
        ["🔍 Tahlil", "💡 Band 7+ Vocab"],
        ["⬅️ Orqaga"],
    ],
    resize_keyboard=True,
)

SPEAKING_KEYBOARD = ReplyKeyboardMarkup(
    [
        ["🎙 Speaking Practice", "🏆 Band 9 Namuna"],
        ["💡 Speaking Vocab (Band 7+)", "⬅️ Orqaga"],
    ],
    resize_keyboard=True,
)

GRAMMAR_KEYBOARD = ReplyKeyboardMarkup(
    [
        ["📚 Grammatika mavzulari", "📸 Mashq rasmini ishlash"],
        ["⬅️ Orqaga"],
    ],
    resize_keyboard=True,
)

VOCAB_MENU_KEYBOARD = ReplyKeyboardMarkup(
    [["🌐 Tarjimon"], ["⬅️ Orqaga"]],
    resize_keyboard=True,
)

STRUKTURA_KEYBOARD = ReplyKeyboardMarkup(
    [["✍️ Task 1 Struktura", "✍️ Task 2 Struktura"], ["⬅️ Orqaga"]],
    resize_keyboard=True,
)

GRAMMAR_TOPICS = {
    "⏰ Zamonlar": [
        "To Be", "Present Simple", "Present Continuous",
        "Present Perfect", "Present Perfect Continuous",
        "Past Simple", "Past Continuous", "Past Perfect",
        "Past Perfect Continuous", "Future Simple",
        "Future Continuous", "Future Perfect",
    ],
    "🔄 Shart mayli": [
        "Zero Conditional", "First Conditional", "Second Conditional",
        "Third Conditional", "Mixed Conditionals",
    ],
    "🎭 Passiv nisbat": [
        "Passive - Present", "Passive - Past",
        "Passive - Future", "Passive - Modals",
    ],
    "💪 Modal fe'llar": [
        "Can / Could", "Must / Have to", "Should / Ought to",
        "May / Might", "Will / Would",
    ],
    "🔗 Bog'lovchi gaplar": [
        "Who / Which / That", "Defining Clauses", "Non-defining Clauses",
    ],
    "💬 Ko'chirma gap": [
        "Reported Statements", "Reported Questions", "Reported Commands",
    ],
    "📐 Artikllar": [
        "A / An", "The", "Zero Article",
    ],
    "🧩 Gerund/Infinitive": [
        "Gerunds (-ing)", "Infinitives (to + verb)", "Verb + Gerund yoki Infinitive",
    ],
}

TASK2_TOPICS = [
    "Some people believe that unpaid community service should be a compulsory part of high school programs. To what extent do you agree or disagree?",
    "In many countries, the amount of crime is increasing. What do you think are the main causes of crime? How can we deal with those causes?",
    "Some people think that the government should provide free healthcare for all citizens, while others believe it should be a personal responsibility. Discuss both views and give your opinion.",
    "Nowadays, more people are choosing to work from home. What are the advantages and disadvantages of this trend?",
    "Advances in technology have changed the way people spend their free time. To what extent do you agree or disagree with this statement?",
]

SPEAKING_QUESTIONS = [
    "Describe a person who has inspired you. You should say: who this person is, how you know them, what they have done, and explain why this person inspires you.",
    "Describe a memorable trip you have taken. You should say: where you went, who you went with, what you did there, and explain why it was memorable.",
    "Describe a skill you would like to learn. You should say: what the skill is, why you want to learn it, how you would learn it, and explain how it would benefit you.",
]


def build_keyboard(items, columns=2, back_label="⬅️ Orqaga"):
    rows = []
    for i in range(0, len(items), columns):
        rows.append(items[i:i + columns])
    rows.append([back_label])
    return ReplyKeyboardMarkup(rows, resize_keyboard=True)


GRAMMAR_CATEGORIES_KEYBOARD = build_keyboard(list(GRAMMAR_TOPICS.keys()))


# --- AI ASINXRON FUNKSIYALARI (avtomatik qayta urinish bilan) ---

async def call_gemini(prompt: str, system_instruction: str = None, max_retries: int = 4) -> str:
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.3,
        max_output_tokens=2000,
    )

    last_error = None
    for attempt in range(max_retries):
        try:
            res = await client.aio.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=config,
            )
            return res.text or ""
        except genai_errors.ServerError as e:
            last_error = e
            wait = 2 * (attempt + 1)
            logger.warning(f"Gemini 503/band (urinish {attempt+1}/{max_retries}), {wait}s kutilmoqda: {e}")
            await asyncio.sleep(wait)
        except genai_errors.ClientError as e:
            if "404" in str(e) or "NOT_FOUND" in str(e):
                logger.error(f"Model topilmadi: {GEMINI_MODEL}. Model nomini tekshiring: {e}")
                raise
            if "429" in str(e):
                last_error = e
                wait = 3 * (attempt + 1)
                logger.warning(f"Gemini limit (urinish {attempt+1}/{max_retries}), {wait}s kutilmoqda: {e}")
                await asyncio.sleep(wait)
            else:
                raise

    raise last_error


async def call_gemini_vision(image_bytes: bytes, mime_type: str, prompt: str, max_retries: int = 4) -> str:
    image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    config = types.GenerateContentConfig(
        temperature=0.2,
        max_output_tokens=2000,
    )

    last_error = None
    for attempt in range(max_retries):
        try:
            res = await client.aio.models.generate_content(
                model=GEMINI_MODEL,
                contents=[image_part, prompt],
                config=config,
            )
            return res.text or ""
        except genai_errors.ServerError as e:
            last_error = e
            wait = 2 * (attempt + 1)
            logger.warning(f"Gemini vision 503/band (urinish {attempt+1}/{max_retries}), {wait}s kutilmoqda: {e}")
            await asyncio.sleep(wait)
        except genai_errors.ClientError as e:
            if "404" in str(e) or "NOT_FOUND" in str(e):
                logger.error(f"Model topilmadi: {GEMINI_MODEL}. Model nomini tekshiring: {e}")
                raise
            if "429" in str(e):
                last_error = e
                wait = 3 * (attempt + 1)
                logger.warning(f"Gemini vision limit (urinish {attempt+1}/{max_retries}), {wait}s kutilmoqda: {e}")
                await asyncio.sleep(wait)
            else:
                raise

    raise last_error


def escape_html(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


async def send_smart_message(update: Update, text: str):
    max_len = 3800
    for i in range(0, len(text), max_len):
        part = text[i:i + max_len]
        try:
            await update.message.reply_text(part, parse_mode="HTML")
        except Exception:
            await update.message.reply_text(part, parse_mode=None)


# --- BUYRUQLAR VA NAVIGATSIYA ---

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    user_state.pop(user.id, None)
    log_activity(user.id, user.username, "start")

    tree_text = (
        f"👋 <b>Assalomu alaykum, {escape_html(user.first_name)}!</b>\n\n"
        "🌳 <b>BOTNING BARCHA IMKONIYATLARI DARAХTI:</b>\n\n"
        "├── 🔢 <b>Matematika</b>\n"
        "│   ├── ✖️ Ko'paytirish jadvali\n"
        "│   └── 📸 Misol rasmini yechish (AI tahlil)\n"
        "│\n"
        "└── 🇬🇧 <b>Ingliz tili</b>\n"
        "    ├── ✍️ <b>Writing</b>\n"
        "    │   ├── 📝 Task 1 &amp; Task 2 (Tekshirish)\n"
        "    │   ├── 🧩 Struktura (Band 9)\n"
        "    │   ├── 🎲 Tasodifiy Mavzu\n"
        "    │   ├── 🔍 Zaif tomonlar tahlili\n"
        "    │   └── 💡 Band 7+ Vocab (Faqat insho uchun)\n"
        "    ├── 🎙 <b>Speaking</b>\n"
        "    │   ├── 🎙 Speaking Practice (Ovoz/Matn)\n"
        "    │   ├── 🏆 Band 9 Namuna javoblar\n"
        "    │   └── 💡 Speaking Vocab (Band 7+ iboralar)\n"
        "    ├── 📖 <b>Grammar</b>\n"
        "    │   ├── 📚 Aniq qoidalar va formulalar\n"
        "    │   └── �� Mashq rasmini ishlash (Kitobdagi test/mashqlar)\n"
        "    └── 📚 <b>Vocab</b>\n"
        "        └── 🌐 <b>Tarjimon</b> (O'zbekcha ➡️ Inglizcha Band 7+)\n\n"
        "Kerakli bo'limni tanlang 👇"
    )
    await update.message.reply_text(tree_text, reply_markup=MAIN_KEYBOARD, parse_mode="HTML")


async def stop_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_state.pop(update.effective_user.id, None)
    await update.message.reply_text("⏹ Rejim to'xtatildi. Bosh menyudasiz.", reply_markup=MAIN_KEYBOARD)


# --- MATEMATIKA MODULLARI ---

def get_multiplication_table() -> str:
    res = "✖️ <b>1 DAN 9 GACHA KO'PAYTIRISH JADVALI:</b>\n\n"
    for i in range(1, 10):
        block = ""
        for j in range(1, 10):
            block += f"{i} × {j} = {i * j}\n"
        res += f"<code>{block}</code>\n"
    return res


# --- HANDLERLAR ---

async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    user_id = user.id
    text = update.message.text.strip()
    state = user_state.get(user_id)

    if text == "�� Matematika":
        user_state.pop(user_id, None)
        await update.message.reply_text("🔢 Matematika bo'limi. Tanlang:", reply_markup=MATH_KEYBOARD)
        return
    elif text == "🇬🇧 Ingliz tili":
        user_state.pop(user_id, None)
        await update.message.reply_text("🇬🇧 Ingliz tili bo'limi. Tanlang:", reply_markup=ENGLISH_KEYBOARD)
        return
    elif text in ("⬅️ Bosh menyu", "⬅️ Orqaga"):
        user_state.pop(user_id, None)
        await update.message.reply_text("Asosiy menyu:", reply_markup=MAIN_KEYBOARD)
        return

    if text == "✖️ Ko'paytirish jadvali":
        await update.message.reply_text(get_multiplication_table(), parse_mode="HTML")
        return
    elif text == "📸 Misol rasmini yechish":
        user_state[user_id] = "math_photo"
        await update.message.reply_text(
            "📸 Matematik misol yoki masala rasmini yuboring. AI uni qadamma-qadam tushuntirib ishlab beradi."
        )
        return

    if text == "✍️ Writing":
        await update.message.reply_text("✍️ Writing bo'limi:", reply_markup=WRITING_KEYBOARD)
        return
    elif text == "🎙 Speaking":
        await update.message.reply_text("🎙 Speaking bo'limi:", reply_markup=SPEAKING_KEYBOARD)
        return
    elif text == "📖 Grammar":
        await update.message.reply_text("📖 Grammar bo'limi:", reply_markup=GRAMMAR_KEYBOARD)
        return
    elif text == "📚 Vocab":
        await update.message.reply_text("📚 Vocab bo'limi:", reply_markup=VOCAB_MENU_KEYBOARD)
        return

    if text == "📝 Task 1":
        user_state[user_id] = "task1"
        await update.message.reply_text("📝 Task 1 uchun inshongizni matn ko'rinishida yoki grafik rasmini yuboring.")
        return
    elif text == "📝 Task 2":
        user_state[user_id] = "task2"
        await update.message.reply_text("📝 Task 2 insho matningizni yuboring (kamida 250 so'z).")
        return
    elif text == "🧩 Struktura":
        await update.message.reply_text("Qaysi Task strukturasi kerak?", reply_markup=STRUKTURA_KEYBOARD)
        return
    elif text == "✍️ Task 1 Struktura":
        await update.message.reply_text(
            "🧩 <b>IELTS Task 1 Band 9 Struktura:</b>\n"
            "1. Introduction (Paraphrase)\n"
            "2. Overview (1-2 ta asosiy tendensiya)\n"
            "3. Body 1 (Taqqoslashlar &amp; Aniq raqamlar)\n"
            "4. Body 2 (Qolgan ma'lumotlar &amp; Tahlil)\n"
            "⚠️ Xulosa yozilmaydi!", parse_mode="HTML"
        )
        return
    elif text == "✍️ Task 2 Struktura":
        await update.message.reply_text(
            "�� <b>IELTS Task 2 Band 9 Struktura:</b>\n"
            "1. Introduction (Background + Thesis statement)\n"
            "2. Body 1 (Idea + Explanation + Example)\n"
            "3. Body 2 (Idea + Explanation + Example)\n"
            "4. Conclusion (Xulosa + Final thought)", parse_mode="HTML"
        )
        return
    elif text == "🎲 Mavzu":
        topic = random.choice(TASK2_TOPICS)
        user_state[user_id] = "task2"
        await update.message.reply_text(
            f"🎲 <b>Task 2 Mavzusi:</b>\n\n<i>{escape_html(topic)}</i>\n\nEndi insho matningizni yuboring.",
            parse_mode="HTML"
        )
        return
    elif text == "🔍 Tahlil":
        errors = get_recent_errors(user_id)
        if len(errors) < 3:
            await update.message.reply_text("Tahlil uchun kamida 3 ta insho tekshirtirgan bo'lishingiz kerak.")
            return
        await update.message.reply_text("⏳ Zaif tomonlaringiz tahlil qilinmoqda...")
        prompt = f"Talabaning oxirgi xatolari:\n{errors}\nUning eng ko'p takrorlanadigan 3 ta zaif tomonini aniqlang va o'zbek tilida maslahat bering."
        try:
            ans = await call_gemini(prompt)
            await send_smart_message(update, ans)
        except Exception:
            logger.exception("Tahlilda xatolik")
            await update.message.reply_text(FRIENDLY_ERROR_MSG)
        return
    elif text == "💡 Band 7+ Vocab":
        user_state[user_id] = "vocab_writing"
        await update.message.reply_text("✍️ Writing uchun so'z yuboring. Unga mos akademik 5 ta Band 7+ sinonim beraman.")
        return

    if text == "🎙 Speaking Practice":
        user_state[user_id] = "speaking_practice"
        q = random.choice(SPEAKING_QUESTIONS)
        current_speaking_question[user_id] = q
        await update.message.reply_text(
            f"🎙 <b>Savol:</b>\n\n{escape_html(q)}\n\nJavobingizni ovozli yoki matn ko'rinishida yuboring.",
            parse_mode="HTML"
        )
        return
    elif text == "🏆 Band 9 Namuna":
        user_state[user_id] = "speaking_sample"
        await update.message.reply_text("Speaking savolini yuboring, men unga IELTS Band 9 darajasidagi mukammal namunaviy javob yozib beraman.")
        return
    elif text == "💡 Speaking Vocab (Band 7+)":
        user_state[user_id] = "vocab_speaking"
        await update.message.reply_text("🗣 Speaking uchun oddiy so'z yuboring. Og'zaki nutqda ishlatiladigan 5 ta tabiiy, Band 7+ iboralarni beraman.")
        return

    if text == "📚 Grammatika mavzulari":
        user_state[user_id] = "grammar_categories"
        await update.message.reply_text("Grammatika kategoriyasini tanlang:", reply_markup=GRAMMAR_CATEGORIES_KEYBOARD)
        return
    elif text == "📸 Mashq rasmini ishlash":
        user_state[user_id] = "grammar_photo"
        await update.message.reply_text("📸 Darslik yoki daftardagi ingliz tili mashqlari rasmini yuboring. AI to'g'ri javoblarni tushuntirib beradi.")
        return

    if text == "🌐 Tarjimon":
        user_state[user_id] = "translator"
        await update.message.reply_text(
            "🇺🇿 <b>O'zbekcha so'z yoki gap yozing:</b>\n\n"
            "Men uni IELTS darajasidagi chiroyli ingliz tiliga tarjima qilib beraman.\n"
            "To'xtatish uchun /stop bosing.",
            parse_mode="HTML"
        )
        return

    if state == "translator":
        log_activity(user_id, user.username, "translator", text[:40])
        prompt = (
            f"Foydalanuvchi ushbu o'zbekcha matnni yubordi: '{text}'.\n"
            "Buni ingliz tiliga 2 xil variantda tarjima qiling:\n"
            "1. Tabiiy va chiroyli kundalik variant\n"
            "2. IELTS Band 7.5+ darajasidagi akademik/formal variant.\n"
            "Har bir variant ostida ishlatilgan muhim so'zlarni qisqacha o'zbekcha tushuntiring."
        )
        await update.message.reply_text("⏳ Tarjima qilinmoqda...")
        try:
            ans = await call_gemini(prompt)
            await send_smart_message(update, ans)
        except Exception:
            logger.exception("Tarjimada xatolik")
            await update.message.reply_text(FRIENDLY_ERROR_MSG)
        return

    if state == "speaking_sample":
        log_activity(user_id, user.username, "speaking_sample", text[:40])
        prompt = (
            f"Ushbu IELTS Speaking savoliga Band 9 darajasidagi namunaviy javob yozing: '{text}'.\n"
            "Javob tabiiy, ravon, idiomatik iboralar va murakkab grammatika bilan boyitilgan bo'lsin.\n"
            "Oxirida unda ishlatilgan eng zo'r 4-5 ta iborani o'zbekcha ma'nosi bilan ajratib ko'rsating."
        )
        await update.message.reply_text("⏳ Band 9 namunaviy javob tayyorlanmoqda...")
        try:
            ans = await call_gemini(prompt)
            await send_smart_message(update, ans)
        except Exception:
            logger.exception("Speaking sample xatolik")
            await update.message.reply_text(FRIENDLY_ERROR_MSG)
        return

    if state in ("vocab_writing", "vocab_speaking"):
        cat = "Writing" if state == "vocab_writing" else "Speaking"
        log_activity(user_id, user.username, f"vocab_{cat.lower()}", text)
        prompt = (
            f"Siz IELTS ekspertisiz. '{text}' so'zi o'rniga IELTS {cat} qismida Band 7.5+ olishga yordam beradigan "
            f"5 ta yuqori darajadagi sinonim yoki kolformatsiya bering. Har biriga inglizcha misol va o'zbekcha tarjima yozing. To'g'ridan-to'g'ri 1-dan boshlang."
        )
        await update.message.reply_text("⏳ Sinonimlar qidirilmoqda...")
        try:
            ans = await call_gemini(prompt)
            await send_smart_message(update, ans)
        except Exception:
            logger.exception("Vocab xatolik")
            await update.message.reply_text(FRIENDLY_ERROR_MSG)
        return

    if state == "grammar_categories" and text in GRAMMAR_TOPICS:
        user_state[user_id] = f"grammar_topics:{text}"
        await update.message.reply_text(f"{text} — mavzuni tanlang:", reply_markup=build_keyboard(GRAMMAR_TOPICS[text]))
        return

    if isinstance(state, str) and state.startswith("grammar_topics:"):
        log_activity(user_id, user.username, "grammar_view", text)
        prompt = (
            f"Ingliz tili mavzusi: '{text}'.\n"
            "O'zbek tilida, IELTS talabalari uchun aniq tushuntiring:\n"
            "1. Qoidasi va ma'nosi\n"
            "2. Formulalar (Darak, Inkor, So'roq)\n"
            "3. 2 ta to'g'ri misol gap tarjimasi bilan\n"
            "4. Eng ko'p qilinadigan xato."
        )
        await update.message.reply_text("⏳ Dars tayyorlanmoqda...")
        try:
            ans = await call_gemini(prompt)
            await send_smart_message(update, ans)
        except Exception:
            logger.exception("Grammar xatolik")
            await update.message.reply_text(FRIENDLY_ERROR_MSG)
        return

    if state in ("task1", "task2"):
        if len(text.split()) < 30:
            await update.message.reply_text("Insho juda qisqa ko'rinadi. Iltimos, to'liq matn yuboring.")
            return
        await update.message.reply_text("⏳ Insho tahlil qilinmoqda, kuting...")
        prompt = (
            f"Siz qat'iy IELTS Examinerisiz. Quyidagi {state.upper()} inshosini rasmiy mezonlar (TR/CC/LR/GRA) bo'yicha baholang.\n"
            f"Umumiy ball (Band), har bir mezon uchun ball va aniq xatolarni ko'rsating:\n\n{text}"
        )
        try:
            ans = await call_gemini(prompt)
            save_submission(user_id, user.username or "", state, text, 6.5, ans[:200])
            log_activity(user_id, user.username, f"{state}_checked")
            await send_smart_message(update, ans)
        except Exception:
            logger.exception("Insho baholashda xatolik")
            await update.message.reply_text(FRIENDLY_ERROR_MSG)
        user_state.pop(user_id, None)
        return

    if state == "speaking_practice":
        q = current_speaking_question.get(user_id, "")
        prompt = f"Speaking savoli: '{q}'\nTalaba javobi: '{text}'\nBuni Fluency, Vocabulary, Grammar bo'yicha baholang va o'zbekcha tavsiya bering."
        await update.message.reply_text("⏳ Baholanmoqda...")
        try:
            ans = await call_gemini(prompt)
            await send_smart_message(update, ans)
        except Exception:
            logger.exception("Speaking practice xatolik")
            await update.message.reply_text(FRIENDLY_ERROR_MSG)
        return

    await update.message.reply_text("Iltimos, pastdagi tugmalardan foydalaning.", reply_markup=MAIN_KEYBOARD)


# --- MULTIMODAL RASM HANDLERI ---

async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    user_id = user.id
    state = user_state.get(user_id)

    if state not in ("task1", "math_photo", "grammar_photo"):
        await update.message.reply_text("Rasm qabul qilish uchun tegishli bo'limni tanlang (Masalan: Matematika yoki Task 1).")
        return

    await update.message.reply_text("⏳ Rasm yuklab olindi, AI tahlil qilmoqda...")

    try:
        photo = update.message.photo[-1]
        file = await context.bot.get_file(photo.file_id)
        image_bytes = await file.download_as_bytearray()

        if state == "math_photo":
            prompt = (
                "Siz tajribali matematika o'qituvchisiz. Rasmdagi misol yoki masalani aniqlang, "
                "uni o'zbek tilida bosqichma-bosqich, qoidalar bilan va to'liq yechib bering."
            )
            log_activity(user_id, user.username, "math_photo_solved")
        elif state == "grammar_photo":
            prompt = (
                "Rasmdagi ingliz tili darsligi yoki mashqlaridagi savollarni aniqlang. "
                "Har bir mashqning to'g'ri javobini topib, nima uchun aynan shu javob to'g'riligini o'zbek tilida tushuntiring."
            )
            log_activity(user_id, user.username, "grammar_photo_solved")
        else:
            prompt = (
                "Siz IELTS Writing Task 1 bo'yicha ekspertsiz. Rasmdagi grafik/diagrammani tahlil qiling va "
                "Band 9 darajasidagi namunaviy akademik insho (kamida 150 so'z) yozib bering."
            )
            log_activity(user_id, user.username, "task1_photo_solved")

        res_text = await call_gemini_vision(bytes(image_bytes), "image/jpeg", prompt)
        await send_smart_message(update, res_text)

    except Exception:
        logger.exception("Rasmni tahlil qilishda xatolik")
        await update.message.reply_text(FRIENDLY_ERROR_MSG)

    user_state.pop(user_id, None)


# --- OVOZLI XABARLAR (SPEAKING) ---

async def handle_voice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if user_state.get(user_id) != "speaking_practice":
        await update.message.reply_text("Ovozli xabar faqat Speaking Practice rejimida ishlaydi.")
        return

    await update.message.reply_text("⏳ Ovoz qabul qilindi, matnga aylantirilmoqda...")
    try:
        import speech_recognition as sr
        from pydub import AudioSegment

        voice = update.message.voice
        file = await context.bot.get_file(voice.file_id)

        with tempfile.NamedTemporaryFile(suffix=".ogg", delete=False) as tmp:
            ogg_path = tmp.name
        await file.download_to_drive(ogg_path)

        wav_path = ogg_path.replace(".ogg", ".wav")
        AudioSegment.from_ogg(ogg_path).export(wav_path, format="wav")

        r = sr.Recognizer()
        with sr.AudioFile(wav_path) as src:
            audio = r.record(src)
        transcript = r.recognize_google(audio, language="en-US")

        os.remove(ogg_path)
        os.remove(wav_path)

        q = current_speaking_question.get(user_id, "")
        await update.message.reply_text(
            f"📝 <b>Transkripsiya:</b> <i>{escape_html(transcript)}</i>\n\n⏳ Baholanmoqda...",
            parse_mode="HTML",
        )
        prompt = f"Speaking savoli: '{q}'\nTalaba nutqi: '{transcript}'\nFluency, Vocab, Grammar mezonlari bo'yicha o'zbekcha tahlil bering."
        ans = await call_gemini(prompt)
        await send_smart_message(update, ans)

    except Exception:
        logger.exception("Ovozni qayta ishlashda xatolik")
        await update.message.reply_text(
            "Ovozni aniqlab bo'lmadi yoki AI xizmati band. Iltimos, qayta urinib ko'ring "
            "yoki matn ko'rinishida yuboring."
        )


def main():
    if not TELEGRAM_TOKEN or not GEMINI_KEY:
        raise RuntimeError("TELEGRAM_BOT_TOKEN yoki GEMINI_API_KEY .env faylida topilmadi!")

    init_db()

    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("stop", stop_command))
    app.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    app.add_handler(MessageHandler(filters.VOICE, handle_voice))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    logger.info("Bot yangilangan arxitektura bilan ishga tushdi (retry logikasi bilan)...")
    app.run_polling()


if __name__ == "__main__":
    main()

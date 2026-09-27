# SPEC.md — IELTS Writing Bot loyihasi

## 1. Loyiha maqsadi

Telegram orqali ishlaydigan bot foydalanuvchilarga IELTS Writing (Task 1 va
Task 2) inshosini AI yordamida tekshirish, band ball berish va vaqt o'tishi
bilan progressni kuzatish imkonini beradi. Loyiha maqsadi — kiberxavfsizlik
o'quv markazi kabi, o'quvchilarni jalb qiladigan va ularni saqlab qoladigan
(retention) mahsulot yaratish.

## 2. Foydalanuvchi turlari

- **O'quvchi** — Telegram bot orqali insho yuboradi, natija oladi, o'z
  statistikasini ko'radi.
- **Admin/o'qituvchi** — veb admin panel orqali barcha o'quvchilarning
  natijalarini, faolligini va progressini kuzatadi.
- **Mehmon (landing page tashrifchisi)** — Instagram'dan kelib, botning
  imkoniyatlari bilan tanishadi va botni ishga tushiradi.

## 3. Asosiy foydalanuvchi yo'li (User Flow)

### Telegram bot tomoni
1. Foydalanuvchi `/start` bosadi → botning imkoniyatlari haqida xabar oladi
2. "Task 1" yoki "Task 2" tugmasini tanlaydi
3. Insho matnini yuboradi (kamida 40 so'z)
4. Bot AI orqali tahlil qiladi va natijani qaytaradi:
   - Umumiy band ball
   - 4 mezon bo'yicha alohida ball va izoh
   - 3 ta tuzatish tavsiyasi
5. Natija ma'lumotlar bazasiga saqlanadi
6. Foydalanuvchi "📊 Statistikam" tugmasi orqali umumiy progressini ko'radi

### Admin panel tomoni
1. Admin login qiladi (keyingi bosqichda qo'shiladi — hozircha ochiq)
2. Bosh sahifada barcha o'quvchilar ro'yxati va ularning: ismi, o'rtacha
   band balli, streak kunlari, jami yuborilgan insholar soni ko'rinadi
3. Har bir o'quvchini bosganda — uning band ball tarixi grafik ko'rinishida
   chiqadi

### Landing page tomoni
1. Instagram'dan kelgan foydalanuvchi sahifani ochadi
2. Botning nima qilishini tushunadi (qisqa tavsif + skrinshot/demo)
3. "Botni ishga tushirish" tugmasini bosib, Telegram botiga o'tadi

## 4. Ma'lumotlar bazasi sxemasi (backend, Claude tomonidan boshqariladi)

```
Table: submissions
- id            INTEGER PRIMARY KEY
- user_id       INTEGER      (Telegram user id)
- username      TEXT
- task_type     TEXT         ("task1" | "task2")
- essay         TEXT
- band_score    REAL
- created_at    TEXT (ISO format)
```

Kelajakda qo'shiladigan jadvallar: `users` (streak, ism), `payments`.

## 5. API kontrakt (Backend ↔ Admin Panel)

Bu qism hozircha **mock ma'lumot** bilan ishlanadi (`admin_panel/mock/`
papkasida). Backend tayyor bo'lgach, shu formatga mos haqiqiy API bilan
almashtiriladi.

### `GET /api/students`
O'quvchilar ro'yxatini qaytaradi.

```json
[
  {
    "id": 1,
    "name": "Ali Valiyev",
    "username": "ali_v",
    "avg_band": 6.5,
    "streak_days": 7,
    "submissions_count": 12,
    "last_active": "2026-09-20"
  }
]
```

### `GET /api/students/{id}/history`
Bitta o'quvchining band ball tarixini qaytaradi (grafik uchun).

```json
[
  { "date": "2026-09-01", "task_type": "task2", "band": 5.5 },
  { "date": "2026-09-10", "task_type": "task2", "band": 6.0 },
  { "date": "2026-09-18", "task_type": "task1", "band": 6.5 }
]
```

### `GET /api/students/{id}/submissions/{submission_id}`
Bitta inshoning to'liq tafsilotini qaytaradi (matn + AI izohi).

```json
{
  "id": 42,
  "task_type": "task2",
  "essay": "...",
  "band_score": 6.0,
  "feedback": "...",
  "created_at": "2026-09-10T14:23:00"
}
```

## 6. Frontend talablari (Antigravity vazifasi)

### Admin panel (`admin_panel/`)
- Texnologiya: React yoki Next.js + TypeScript + Tailwind CSS
- Sahifalar:
  - `/` — o'quvchilar ro'yxati (jadval: ism, o'rtacha ball, streak, oxirgi faollik)
  - `/students/[id]` — bitta o'quvchining band ball tarixi (line chart) va
    barcha insholari ro'yxati
- Grafik kutubxonasi: `recharts` yoki `chart.js` ishlatilishi mumkin
- Hozircha autentifikatsiya shart emas (keyinroq qo'shiladi)

### Landing page (`landing_page/`)
- Texnologiya: oddiy HTML/CSS/JS yoki Next.js (admin panel bilan bir xil
  stack tanlash tavsiya etiladi)
- Bo'limlar:
  1. Hero — bot nomi, qisqa tavsif, "Botni ishga tushirish" tugmasi
     (Telegram bot linkiga olib boradi — link keyinroq qo'shiladi)
  2. Qanday ishlaydi — 3 qadam (insho yubor → AI tahlil → natija ol)
  3. Afzalliklar — tezkor natija, 24/7 mavjud, IELTS mezonlariga mos
  4. CTA (yana bir marta "Boshlash" tugmasi)
- Dizayn: zamonaviy, minimal, mobil-do'st (ko'pchilik Instagram'dan
  telefon orqali kiradi)

## 7. Kod uslubi va papka chegaralari

- Backend (`bot/`) — faqat Claude tomonidan yoziladi/o'zgartiriladi
- `admin_panel/` va `landing_page/` — Antigravity tomonidan yoziladi
- Umumiy fayllar (`agent.md`, `SPEC.md`, `README.md`) — ikkala tomon ham
  o'qiydi, lekin faqat loyiha egasi (siz) yoki Claude tahrirlaydi
- Har bir katta o'zgarishdan keyin qisqa commit-uslubidagi izoh yozish
  tavsiya etiladi (masalan: "admin panel: o'quvchilar jadvali qo'shildi")

## 8. Keyingi bosqichlar (hozircha ishlanmaydi, faqat rejada)

- To'lov tizimi (Click/Payme) — bepul/pullik limitlar
- Admin panel autentifikatsiyasi
- Kunlik push-xabar orqali yangi mavzu yuborish
- Backend va frontend'ni haqiqiy API orqali ulash (mock o'rniga)

# IELTS Writing Bot — Antigravity Agent Qoidalari

## Loyiha haqida
Bu loyiha — Telegram orqali ishlaydigan IELTS Writing tekshiruv boti.
Backend (bot logikasi, AI baholash, ma'lumotlar bazasi) Claude tomonidan
Python (python-telegram-bot + Anthropic API + SQLite) da yozilgan.

Sizning (Antigravity agentining) vazifangiz — backend bilan ishlaydigan
**admin panel** va **landing page** qismini yasash.

## Sizning vazifangiz
1. **Admin panel** (React yoki Next.js, Tailwind bilan):
   - O'quvchilar ro'yxati jadvali
   - Har bir o'quvchining band ball tarixi (grafik)
   - Streak va faollik statistikasi
2. **Landing page** (Instagram'dan kelgan foydalanuvchilar uchun):
   - Botning imkoniyatlari haqida qisqa, chiroyli sahifa
   - "Botni ishga tushirish" tugmasi (Telegram bot linkiga olib boradi)

## Backend bilan bog'lanish (API kontrakt)
Backend quyidagi endpointlarni taqdim etadi (hozircha FAKE/mock ma'lumot bilan
ishlang, keyin haqiqiy backend'ga ulaymiz):


    GET /api/students
Javob: [
  { "id": 1, "name": "Ali", "avg_band": 6.5, "streak_days": 7, "submissions_count": 12 }
]

GET /api/students/{id}/history
Javob: [
  { "date": "2026-09-01", "band": 5.5 },
  { "date": "2026-09-10", "band": 6.0 }
]

## Kod uslubi qoidalari
- Til: TypeScript (agar React/Next.js ishlatilsa)
- Styling: Tailwind CSS
- Komponentlar kichik va qayta ishlatiladigan bo'lsin
- Har bir komponent uchun alohida fayl
- Fake ma'lumotni `mock/` papkasida saqlang, keyin backend ulanganda oson almashtirish uchun

## Cheklovlar
- Backend kodiga (Python fayllariga) tegmang — bu Claude tomonidan boshqariladi
- Faqat frontend (admin panel + landing page) papkalarida ishlang: `admin_panel/`, `landing_page/`
- Har bir yirik o'zgarishdan keyin qisqacha izoh yozing (nima qo'shildi)
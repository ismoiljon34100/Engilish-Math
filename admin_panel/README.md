# IELTS Writing Bot — Admin Panel

Bu admin panel o'qituvchilar va adminlar uchun Telegram bot orqali IELTS Writing insholarini yuborayotgan o'quvchilar natijalarini kuzatish, ularning band ball dinamikasi (line chart) va har bir yuborilgan inshoning tahlilini ko'rish imkonini beradi.

## Texnologiyalar
- **Frontend kutubxonasi**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (zamonaviy Indigo/Slate dizayn tizimi)
- **Grafik**: Recharts (Responsive Line Chart)
- **Ikonkalar**: Lucide React
- **Routing**: React Router DOM (`/` va `/students/:id`)

## Loyiha Strukturasi
```
admin_panel/
├── src/
│   ├── components/       # Qayta ishlatiladigan komponentlar
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ScoreBadge.tsx
│   │   └── SubmissionModal.tsx
│   ├── mock/             # SPEC.md bo'yicha mock ma'lumotlar
│   │   ├── students.json
│   │   ├── history.json
│   │   └── submissions.json
│   ├── pages/            # Asosiy sahifalar
│   │   ├── Dashboard.tsx    # O'quvchilar ro'yxati va KPI kartalari
│   │   └── StudentDetail.tsx# Bitta o'quvchi profili, grafik va insholari
│   ├── services/
│   │   └── api.ts        # Backend API bilan ishlash qatlami (USE_MOCK bayrog'i bilan)
│   ├── types/
│   │   └── index.ts      # TypeScript interfeyslari
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

## Ishga tushirish
```bash
cd admin_panel
npm install
npm run dev
```
Brauzerda: `http://localhost:3000`

## Backend bilan ulash
`src/services/api.ts` faylidagi `USE_MOCK = false` qilib, `API_BASE_URL` ni haqiqiy Python backend URL manziliga sozlash kifoya.

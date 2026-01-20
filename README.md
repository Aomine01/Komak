# KO'MAK LOYIHASI - Application Form

Production-grade, secure application form for collecting applicant data with enterprise-level security protocols.

![KO'MAK LOYIHASI](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Supabase](https://img.shields.io/badge/Supabase-Powered-green)

## 🚀 Live Demo

Deployed on Vercel: [Your deployment URL will appear here after deployment]

## 📋 Features

- ✅ **7 Form Fields** with strict validation (Uzbek interface)
- 🔒 **Multi-layer Security**: SQL injection prevention, XSS protection, error masking
- ⏱️ **60-Second Cooldown** to prevent spam submissions
- 📱 **Responsive Design** with professional Navy Blue (#0B0B45) branding
- 🌐 **All UI in Uzbek (Latin script)**

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS + Custom Design System
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Amin0001/Komak.git
cd Komak

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Supabase credentials

# Run development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard: Settings → API

## 🗄️ Database Setup

1. Go to your Supabase SQL Editor
2. Run the SQL from `create_table.sql`
3. Run the SQL from `fix_rls_policy.sql`
4. (Optional) Run `export_view.sql` for better CSV exports

See `SUPABASE_SETUP.md` for detailed instructions.

## 🚀 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Amin0001/Komak)

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Environment Variables in Vercel

Add these in your Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📊 Form Fields

| Field | Type | Validation |
|-------|------|------------|
| F.I.Sh. | Text | Required, min 3 chars, letters only |
| Yoshingiz | Number | Range: 14-35 |
| Telefon | Tel | +998 XX XXX XX XX format |
| Viloyat | Select | 14 Uzbek regions |
| Tuman/shahar | Text | Required, min 2 chars |
| O'quv markazi | Radio | Ha / Yo'q |
| Yo'nalishi | Checkbox | Multi-select (6 options) |

## 🔒 Security Features

- **SQL Injection Prevention**: Supabase SDK with parameterized queries only
- **XSS Protection**: React's built-in escaping, no dangerous HTML
- **Rate Limiting**: 60-second client-side cooldown
- **Error Masking**: Generic Uzbek errors shown to users
- **Input Validation**: Strict regex for phone, age range checking
- **Environment Security**: No hardcoded credentials

## 📁 Project Structure

```
Komak/
├── src/
│   ├── data/
│   │   └── options.js          # Regions & directions
│   ├── utils/
│   │   ├── validation.js       # Form validation logic
│   │   └── cooldown.js         # Anti-spam mechanism
│   ├── supabaseClient.js       # Database connection
│   ├── App.jsx                 # Main component
│   ├── index.css               # Styles + design system
│   └── main.jsx                # Entry point
├── public/
├── .env.example                # Environment template
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🧪 Local Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Documentation

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Complete database setup guide
- [CSV_EXPORT_FIX.md](CSV_EXPORT_FIX.md) - Fix CSV export formatting
- [SETUP_NOW.md](SETUP_NOW.md) - Quick database setup

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

© 2026 KO'MAK LOYIHASI. All rights reserved.

## 🙏 Acknowledgments

- Built with React + Vite
- Database powered by Supabase
- Deployed on Vercel
- Icons by Lucide React

---

**Need help?** Check the documentation files or open an issue.

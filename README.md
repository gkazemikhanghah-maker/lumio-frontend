# Lumio — Frontend

> **Your Career, Illuminated.**  
> Job Market Intelligence → Skill Gap Analysis → AI Resume Builder

![Lumio Dashboard](https://relaxed-kelpie-504b6d.netlify.app)

## 🌐 Live Demo

**[lumio.netlify.app](https://relaxed-kelpie-504b6d.netlify.app)**

---

## 🎯 What is Lumio?

Lumio is a Job Market Intelligence SaaS that helps job seekers understand what the market actually wants — before writing their resume.

**Unlike competitors (Jobscan, Teal, ResuMax) that start from your resume, Lumio starts from real market data.**

```
Search Job Title → Market Intelligence → Skill Gap Analysis → AI Resume Builder
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Market Intelligence** | Top skills, salary ranges, hiring companies & trends for any job title |
| 🎯 **Skill Gap Analysis** | Tick what you know → get a Market Fit Score out of 100 |
| 🏢 **Company Intel** | Deep-dive into any company's hiring patterns and culture signals |
| 📄 **AI Resume Builder** | Conversational resume builder based on real market data |
| 📋 **Resume Templates** | ATS-optimized templates for different roles |

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **Charts:** Recharts
- **Build:** Vite
- **Deployment:** Netlify

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/gkazemikhanghah-maker/lumio-frontend.git
cd lumio-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment

The frontend connects to the backend API. By default it points to the production backend:

```
https://lumio-backend-production.up.railway.app
```

To use a local backend, update `src/lib/api.ts`:

```ts
const API_BASE = "http://localhost:8000";
```

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui base components
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   └── Logo.tsx
├── pages/            # Route-level page components
│   ├── Landing.tsx   # Homepage
│   ├── Dashboard.tsx # Market Intelligence results
│   ├── SkillGap.tsx  # Skill Gap Analysis
│   ├── ResumeBuilder.tsx
│   ├── Templates.tsx
│   ├── CompanyIntel.tsx
│   ├── SignUp.tsx
│   ├── SignIn.tsx
│   └── Onboarding.tsx
├── lib/
│   ├── api.ts        # Backend API calls
│   └── mockData.ts   # Fallback mock data
└── hooks/            # Custom React hooks
```

---

## 🔌 Backend

This frontend connects to the [Lumio Backend](https://github.com/gkazemikhanghah-maker/lumio-backend) — a FastAPI service that uses Claude AI to generate job market intelligence.

**API Endpoint:**
```
POST /analyze
{
  "job_title": "Product Manager",
  "experience_level": "Senior",
  "work_type": "Remote",
  "country": "US",
  "max_jobs": 20
}
```

---

## 🗺️ Roadmap

- [ ] Connect live job scraping from Indeed & Glassdoor
- [ ] Real-time salary data from Glassdoor & Levels.fyi
- [ ] Resume PDF export
- [ ] LinkedIn profile import
- [ ] Stripe payments (Free / Pro $15/month)
- [ ] Supabase auth & user profiles

---

## 📸 Screenshots

### Market Intelligence Dashboard
Search any job title → get real-time skill demand, salary ranges, and hiring companies.

### Skill Gap Analysis
Tick your current skills → get a Market Fit Score and see your most impactful gaps.

### AI Resume Builder
Conversational resume building, section by section, with AI suggestions.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT

---

## 👤 Author

**Ghazal Kazemi**  
[LinkedIn](https://linkedin.com/in/gkazemikhanghah) · [GitHub](https://github.com/gkazemikhanghah-maker)

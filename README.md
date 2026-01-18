# Prepcell 🎯

A comprehensive placement preparation tracking platform built with Next.js, helping students organize their interview preparation journey.

## Features

- **📊 Skill Tracking** - Track progress across 9+ categories including DSA, Algorithms, Aptitude, and Web Development
- **🏢 Company Notes** - Maintain company-specific preparation notes, exam patterns, and important topics
- **✅ Daily Goals** - Set and track daily preparation goals with progress monitoring
- **📅 Calendar View** - Visualize interviews, important dates, and deadlines
- **📄 Resume Management** - Upload and manage your resume with Cloudinary integration
- **🤖 AI Assistant** - Get preparation tips and guidance using Groq AI
- **🎨 Neobrutalism UI** - Bold, high-contrast design for better focus

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components

**Backend:**
- Next.js API Routes
- NextAuth.js (GitHub OAuth)
- Prisma ORM
- PostgreSQL (Neon)

**Services:**
- Cloudinary (File Storage)
- Groq AI (AI Integration)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prepcell
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GITHUB_ID="your-github-oauth-id"
   GITHUB_SECRET="your-github-oauth-secret"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
   CLOUDINARY_API_KEY="your-cloudinary-key"
   CLOUDINARY_API_SECRET="your-cloudinary-secret"
   GROQ_API_KEY="your-groq-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

- **User** - Authentication and user data
- **SkillCategory** - Categories like DSA, Algorithms, etc.
- **Skill** - Individual skills within categories
- **Goal** - Daily preparation goals
- **Company** - Company-specific preparation notes
- **Interview** - Scheduled interviews
- **ImportantDate** - Important deadlines
- **Resume** - Resume storage metadata

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma db seed   # Seed database with default skills
```

## License

MIT

---

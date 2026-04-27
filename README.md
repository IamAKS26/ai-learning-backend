<p align="center">
  <img src="https://img.shields.io/badge/Node.js-≥20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-LLM-FF6600?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" />
</p>

# 🧠 AI Learning Backend

> **Intelligent, adaptive backend powering [EDUstream](https://ed-ustream.vercel.app)** — an AI-driven learning platform that generates personalized courses, quizzes, coding tasks, and curates YouTube tutorials in real time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Course Generation** | Generate complete courses (outline → modules → units) from a single topic using Groq LLMs |
| 📖 **Adaptive Learning Engine** | Dynamically decides the next unit type (lesson, quiz, video, task) based on user preferences and progress |
| 🎥 **Smart Video Curation** | Fetches and ranks YouTube tutorials, prioritizing trusted educational channels |
| 📝 **AI Code Review** | Submit code snippets for AI-powered review and feedback |
| 💬 **AI Chat** | Conversational AI assistant for learning help |
| 🏆 **Gamification** | XP, streaks, badges, and certificates tracking |
| 👥 **Community Hub** | Course publishing, ratings & reviews, trending courses, and public student profiles |
| 📓 **Notes System** | Create, sync, and manage personal learning notes |
| 🔐 **Auth** | JWT-based authentication with email/password and Google OAuth 2.0 |
| 📊 **Progress Tracking** | Real-time course progress, learning stats, and dashboard overview |
| 📄 **Swagger Docs** | Auto-generated interactive API documentation |

---

## 🏗️ Architecture

```
ai-learning-backend/
├── server.js                    # Entry point — connects DB & starts Express
├── src/
│   ├── app.js                   # Express app setup (middleware, routes, swagger)
│   ├── config/
│   │   ├── db.js                # MongoDB connection (singleton pattern)
│   │   └── swagger.js           # Swagger/OpenAPI configuration
│   ├── Middleware/
│   │   ├── authMiddleware.js    # JWT protect & optionalProtect guards
│   │   ├── errorMiddleware.js   # Global error handler
│   │   └── validate.js          # Zod schema validation middleware
│   ├── models/
│   │   ├── user.js              # User schema (XP, streak, badges, profile)
│   │   ├── course.js            # Course schema (ratings, publish state, ownership)
│   │   ├── module.js            # Module schema (belongs to a course)
│   │   ├── unit.js              # Unit schema (lesson, quiz, video, task)
│   │   ├── note.js              # User notes
│   │   ├── userInteraction.js   # Tracks unit completions per user
│   │   └── userPreference.js    # Learning style weights (read/quiz/video/task)
│   ├── controllers/             # Route handlers (business logic)
│   ├── routes/                  # Express route definitions
│   ├── services/
│   │   ├── courseGeneratorService.js  # Orchestrates full AI course creation
│   │   ├── learningEngine.js         # Adaptive next-unit decision engine
│   │   ├── preferenceService.js      # User preference management
│   │   ├── interactionService.js     # Interaction tracking
│   │   └── aiService.js              # AI service layer
│   ├── ai/
│   │   ├── aiClient.js               # Groq API client with rate limiting
│   │   ├── courseOutlineGenerator.js  # AI prompt → course outline JSON
│   │   ├── contentGenerator.js        # AI lesson content generation
│   │   ├── quizGenerator.js           # AI quiz generation
│   │   ├── taskGenerator.js           # AI coding task generation
│   │   ├── videoGenerator.js          # YouTube API search & ranking
│   │   ├── promptBuilder.js           # Reusable prompt templates
│   │   └── groqService.js             # Groq SDK wrapper
│   ├── validators/              # Zod schemas for request validation
│   └── utils/                   # Helpers (logger, JSON parser, rate limiter)
```

---

## 🚀 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register with name, email, password |
| `POST` | `/login` | ❌ | Login with email & password → JWT |
| `POST` | `/google` | ❌ | Google OAuth login → JWT |

### Courses — `/api/courses`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/generate` | ✅ | AI-generate a full course (topic + level) |
| `POST` | `/create` | ✅ | Manually create a course |
| `GET` | `/` | 🔓 | List published courses (+ own drafts if authed) |
| `GET` | `/:id` | 🔓 | Get course with modules & units |
| `PUT` | `/:id/publish` | ✅ | Publish a course (1 per user limit) |
| `PUT` | `/:id/unpublish` | ✅ | Unpublish a course |
| `DELETE` | `/:id` | ✅ | Delete course (cascade deletes modules & units) |

### Modules — `/api/modules`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:courseId` | ❌ | Get modules for a course |

### Units — `/api/units`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create` | ❌ | Create a unit manually |
| `GET` | `/single/:id` | ❌ | Get a single unit by ID |
| `GET` | `/:moduleId` | ❌ | Get units for a module |
| `POST` | `/generate` | ✅ | AI-generate a unit (lesson/quiz/video/task) |
| `POST` | `/generate-quiz` | ✅ | AI-generate a quiz unit |
| `POST` | `/next-unit` | ✅ | Adaptive engine: get the next best unit |
| `POST` | `/track-interaction` | ✅ | Track unit completion & interactions |

### Notes — `/api/notes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create a note |
| `POST` | `/sync` | ✅ | Bulk sync notes |
| `GET` | `/` | ✅ | Get all user notes |
| `PUT` | `/:id` | ✅ | Update a note |
| `DELETE` | `/:id` | ✅ | Delete a note |

### AI — `/api/ai`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/chat` | ✅ | Chat with AI assistant |

### Code Review — `/api/code`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/review` | ✅ | Submit code for AI review |

### Stats — `/api/stats`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/overview` | ✅ | Dashboard stats (XP, streak, courses, progress) |
| `GET` | `/progress/:courseId` | ✅ | Get completed unit IDs for a course |

### Community — `/api/community`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/feed` | 🔓 | Browse published courses (search, filter, sort, paginate) |
| `GET` | `/profile/:userId` | 🔓 | View public student profile |
| `GET` | `/trending` | 🔓 | Top 5 courses by views + top creators by XP |
| `POST` | `/view/:courseId` | 🔓 | Track course view |
| `POST` | `/rate/:courseId` | ✅ | Rate & review a course (1–5 stars) |
| `POST` | `/enroll/:courseId` | ✅ | Enroll in a course |

> **Legend:** ✅ = JWT required &nbsp;|&nbsp; 🔓 = optional JWT (enhanced results if authed) &nbsp;|&nbsp; ❌ = public

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js ≥ 20 (ES Modules) |
| **Framework** | Express 5 |
| **Database** | MongoDB Atlas via Mongoose 9 |
| **AI / LLM** | Groq SDK (LLaMA / Mixtral) |
| **Auth** | JWT + bcryptjs + Google OAuth 2.0 |
| **Validation** | Zod 4 |
| **Security** | Helmet, CORS, express-rate-limit |
| **Docs** | Swagger (swagger-jsdoc + swagger-ui-express) |
| **Logging** | Winston |
| **Rate Limiting** | Bottleneck (API call throttling) |
| **Deployment** | Vercel (Serverless) |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 20.0.0
- **MongoDB** Atlas cluster (or local instance)
- **Groq API Key** — [get one here](https://console.groq.com)
- **YouTube Data API Key** — [Google Cloud Console](https://console.cloud.google.com)
- **Google OAuth Client ID** — [Google Cloud Console](https://console.cloud.google.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/ai-learning-backend.git
cd ai-learning-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# ✏️ Fill in your actual credentials in .env (see below)

# Start development server
npm run dev

# Or start production server
npm start
```

The server will start on `http://localhost:3000` by default.

---

## 🔧 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=3000

# MongoDB connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ai-learning

# Groq API key for LLM-powered content generation
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# YouTube Data API v3 key for video curation
YOUTUBE_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXX

# JWT signing secret
JWT_SECRET=your-secure-random-secret

# Google OAuth 2.0 Client ID
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
```

---

## 🧪 API Documentation

Once the server is running, access the interactive Swagger docs at:

```
http://localhost:3000/api-docs
```

---

## 🧩 How the AI Learning Engine Works

```
User picks a topic
        │
        ▼
┌─────────────────────┐
│  Course Outline AI   │  ← Groq LLM generates title, description, modules, topics
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Course Generator    │  ← Creates Course + Modules + initial Units in MongoDB
│  Service             │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Adaptive Learning   │  ← Weighted random selection based on user preferences
│  Engine              │     (read / quiz / video / task weights)
└─────────┬───────────┘
          │
          ├── 📖 read  → AI lesson generation
          ├── ❓ quiz  → AI quiz generation
          ├── 🎥 video → YouTube API search + ranking
          └── 💻 task  → AI coding task generation
```

The engine penalizes back-to-back repetition of the same unit type and respects a per-module unit cap of 5 to keep modules focused.

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start with nodemon (hot reload) |
| **Start** | `npm start` | Production start |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ for the future of AI-powered education
</p>

# TaleWeaver AI Backend API

A robust, scalable, and secure backend API for TaleWeaver AI - an AI-powered platform where parents can generate illustrated storybooks for their children.

https://github.com/user-attachments/assets/2704a05e-0412-43bd-9c7d-d7b1434110a6

## 🚀 Features

* **User Authentication**: JWT-based authentication with secure password hashing
* **AI Story Generation**: Integration with Google Gemini AI for story and image generation
* **Story Management**: Create, save, share, and manage personalized storybooks
* **Public Gallery**: Share stories publicly and allow community interaction
* **Comment System**: Allow visitors to comment on public stories
* **AI Chatbot**: "Sparkle" chatbot for parenting advice and questions
* **Image Storage**: Cloudinary integration for secure image storage
* **Rate Limiting**: Built-in protection against abuse
* **Input Validation**: Comprehensive validation using Joi
* **Error Handling**: Centralized error handling with proper HTTP status codes

## 🛠 Technology Stack

* **Runtime**: Node.js with TypeScript
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Authentication**: JWT (jsonwebtoken)
* **Password Hashing**: bcryptjs
* **Validation**: Joi
* **AI Integration**: Google Generative AI (Gemini)
* **Image Storage**: Cloudinary
* **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

* Node.js (v18 or higher)
* Supabase account (for managed PostgreSQL database)
* Google Gemini API key
* Cloudinary account (for image storage)

## 🔧 Installation

1. **Clone the repository and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your actual values:

   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   JWT_SECRET="your-super-secret-jwt-key-here"
   GEMINI_API_KEY="your-gemini-api-key-here"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   PORT=3001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Set up Supabase database**

   * Create a Supabase project at [supabase.com](https://supabase.com)
   * Get your database connection string from Supabase dashboard
   * Update `DATABASE_URL` and `DIRECT_URL` in your `.env` file

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to Supabase database
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description              | Access  |
| ------ | ----------- | ------------------------ | ------- |
| POST   | `/register` | Register a new user      | Public  |
| POST   | `/login`    | Login user               | Public  |
| GET    | `/me`       | Get current user profile | Private |

### Story Management (`/api/stories`)

| Method | Endpoint            | Description                       | Access  |
| ------ | ------------------- | --------------------------------- | ------- |
| POST   | `/generate`         | Generate a new storybook using AI | Private |
| GET    | `/mine`             | Get all user's stories            | Private |
| GET    | `/:storyId`         | Get a specific story              | Private |
| PUT    | `/:storyId/share`   | Share story to public gallery     | Private |
| PUT    | `/:storyId/unshare` | Remove story from public gallery  | Private |
| DELETE | `/:storyId`         | Delete a story                    | Private |

### Public Gallery (`/api/public`)

| Method | Endpoint                     | Description                        | Access |
| ------ | ---------------------------- | ---------------------------------- | ------ |
| GET    | `/stories`                   | Get all public stories (paginated) | Public |
| GET    | `/stories/:storyId`          | Get a specific public story        | Public |
| GET    | `/stories/search`            | Search public stories by title     | Public |
| POST   | `/stories/:storyId/comments` | Add comment to public story        | Public |
| GET    | `/stories/:storyId/comments` | Get comments for a story           | Public |

### Chatbot (`/api/chatbot`)

| Method | Endpoint | Description                       | Access |
| ------ | -------- | --------------------------------- | ------ |
| POST   | `/`      | Get response from Sparkle chatbot | Public |

## 🔐 Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Request Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Generate Story

```bash
POST /api/stories/generate
Authorization: Bearer <token>
Content-Type: application/json
{
  "prompt": "A magical adventure with a brave little dragon",
  "interests": "dragons, magic, adventure",
  "age": 6
}
```

### Chatbot Query

```bash
POST /api/chatbot
Content-Type: application/json
{
  "query": "How can I help my 5-year-old with bedtime routines?"
}
```

## 🗄️ Database Schema

* **User**: id, email, name, password, subscriptionPlan, createdAt, updatedAt
* **StoryBook**: id, title, pages (JSON), isPublic, createdAt, updatedAt, ownerId
* **Comment**: id, text, authorName, createdAt, storyId

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

* `NODE_ENV=production`
* Strong `JWT_SECRET`
* `FRONTEND_URL` for CORS
* SSL certificates for HTTPS

## 🔒 Security Features

* Helmet headers, CORS, Rate Limiting, Input Validation (Joi), bcrypt password hashing, JWT expiration, SQL Injection protection, XSS protection

## 🧪 Testing

* Postman, curl, or Thunder Client
* Error handling and validation tested

## 📊 Monitoring

* Health check endpoint: `GET /health`
* Structured logging and request/response logging in development

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests if applicable
5. Submit PR

## 📄 License

MIT License


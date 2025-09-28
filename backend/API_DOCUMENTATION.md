# TaleWeaver AI Backend API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "subscriptionPlan": "SPROUT"
  }
}
```

### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "subscriptionPlan": "SPROUT"
  }
}
```

### GET /auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "clx123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "subscriptionPlan": "SPROUT"
  }
}
```

---

## 📚 Story Management Endpoints

### POST /stories/generate
Generate a new AI-powered storybook.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "prompt": "A magical adventure with a brave little dragon",
  "interests": "dragons, magic, adventure",
  "age": 6
}
```

**Response (201):**
```json
{
  "success": true,
  "storybook": {
    "id": "clx987654321",
    "title": "The Brave Little Dragon's Adventure",
    "pages": [
      {
        "pageNumber": 1,
        "text": "Once upon a time, there was a brave little dragon named Sparkle.",
        "imageUrl": "https://res.cloudinary.com/.../story-page-1.jpg"
      },
      {
        "pageNumber": 2,
        "text": "Sparkle lived in a magical forest filled with talking animals.",
        "imageUrl": "https://res.cloudinary.com/.../story-page-2.jpg"
      }
    ],
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "owner": {
      "id": "clx123456789",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### GET /stories/mine
Get all stories created by the current user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "stories": [
    {
      "id": "clx987654321",
      "title": "The Brave Little Dragon's Adventure",
      "pages": [...],
      "isPublic": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "_count": {
        "comments": 0
      }
    }
  ]
}
```

### GET /stories/:storyId
Get a specific story by ID (user must be the owner).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "story": {
    "id": "clx987654321",
    "title": "The Brave Little Dragon's Adventure",
    "pages": [...],
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "owner": {
      "id": "clx123456789",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "comments": []
  }
}
```

### PUT /stories/:storyId/share
Share a story to the public gallery.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "story": {
    "id": "clx987654321",
    "title": "The Brave Little Dragon's Adventure",
    "pages": [...],
    "isPublic": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:35:00Z",
    "owner": {
      "id": "clx123456789",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### PUT /stories/:storyId/unshare
Remove a story from the public gallery.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "story": {
    "id": "clx987654321",
    "title": "The Brave Little Dragon's Adventure",
    "pages": [...],
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:40:00Z",
    "owner": {
      "id": "clx123456789",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### DELETE /stories/:storyId
Delete a story permanently.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Story deleted successfully"
}
```

---

## 🌐 Public Gallery Endpoints

### GET /public/stories
Get all public stories with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 50)

**Example:** `GET /public/stories?page=1&limit=12`

**Response (200):**
```json
{
  "success": true,
  "stories": [
    {
      "id": "clx987654321",
      "title": "The Brave Little Dragon's Adventure",
      "pages": [...],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "owner": {
        "id": "clx123456789",
        "name": "John Doe"
      },
      "_count": {
        "comments": 5
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalStories": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET /public/stories/:storyId
Get a specific public story with comments.

**Response (200):**
```json
{
  "success": true,
  "story": {
    "id": "clx987654321",
    "title": "The Brave Little Dragon's Adventure",
    "pages": [...],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "owner": {
      "id": "clx123456789",
      "name": "John Doe"
    },
    "comments": [
      {
        "id": "clx111222333",
        "text": "My kids loved this story!",
        "authorName": "Sarah M.",
        "createdAt": "2024-01-16T14:20:00Z"
      }
    ]
  }
}
```

### GET /public/stories/search
Search public stories by title.

**Query Parameters:**
- `q` (required): Search query (min 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 50)

**Example:** `GET /public/stories/search?q=dragon&page=1&limit=12`

**Response (200):**
```json
{
  "success": true,
  "stories": [...],
  "query": "dragon",
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalStories": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### POST /public/stories/:storyId/comments
Add a comment to a public story.

**Request Body:**
```json
{
  "name": "Sarah M.",
  "text": "My kids loved this story! Thank you for sharing."
}
```

**Response (201):**
```json
{
  "success": true,
  "comment": {
    "id": "clx111222333",
    "text": "My kids loved this story! Thank you for sharing.",
    "authorName": "Sarah M.",
    "createdAt": "2024-01-16T14:20:00Z",
    "storyId": "clx987654321"
  }
}
```

### GET /public/stories/:storyId/comments
Get all comments for a public story with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)

**Response (200):**
```json
{
  "success": true,
  "comments": [
    {
      "id": "clx111222333",
      "text": "My kids loved this story!",
      "authorName": "Sarah M.",
      "createdAt": "2024-01-16T14:20:00Z",
      "storyId": "clx987654321"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalComments": 5,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

## 🤖 Chatbot Endpoints

### POST /chatbot
Get response from Sparkle chatbot for parenting questions.

**Request Body:**
```json
{
  "query": "How can I help my 5-year-old with bedtime routines?"
}
```

**Response (200):**
```json
{
  "success": true,
  "response": "Hi there! Establishing a consistent bedtime routine is so important for little ones. Here are some gentle strategies that work well for 5-year-olds:\n\n1. **Create a predictable sequence**: Start winding down 30-60 minutes before bedtime with calming activities like reading, gentle music, or quiet play.\n\n2. **Make it special**: Let your child choose their pajamas or a special bedtime story. This gives them a sense of control and makes bedtime feel less like a chore.\n\n3. **Use visual cues**: Consider a bedtime chart with pictures showing the routine - brush teeth, put on pajamas, read story, lights out.\n\nRemember, consistency is key! It might take a few weeks for the routine to feel natural. If you're still having challenges, don't hesitate to consult with your pediatrician for personalized advice.",
  "timestamp": "2024-01-15T15:30:00Z"
}
```

---

## ❌ Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Server Error"
}
```

---

## 🔧 Health Check

### GET /health
Check server health status.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T15:30:00Z",
  "environment": "development"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination is 1-indexed (page 1 is the first page)
- Image URLs are served from Cloudinary CDN
- JWT tokens expire after 7 days
- Rate limiting: 100 requests per 15 minutes per IP
- All text inputs are validated for length and content
- Database operations use Prisma ORM for type safety

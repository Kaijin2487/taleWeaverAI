# Frontend Integration Guide - TaleWeaver AI

## 🔄 **Where to Input the APIs - Complete Integration Guide**

This guide shows you exactly where and how to integrate your backend API with the frontend React application.

## 📋 **What Has Been Changed**

### ✅ **Files Created/Modified:**

1. **`services/apiService.ts`** - NEW: Complete API service layer
2. **`components/AuthModal.tsx`** - NEW: Authentication modal component
3. **`components/StoryGenerator.tsx`** - UPDATED: Now uses backend API
4. **`components/Chatbot.tsx`** - UPDATED: Now uses backend API
5. **`components/PublicStoriesPage.tsx`** - UPDATED: Now uses backend API
6. **`components/StoryViewerModal.tsx`** - UPDATED: Now uses backend API
7. **`components/Header.tsx`** - UPDATED: Added authentication features

## 🚀 **Setup Instructions**

### 1. **Start Your Backend Server**
```bash
cd backend
npm install
npm run dev
```
Your backend will run on `http://localhost:3001`

### 2. **Update Frontend Environment**
Create a `.env` file in your frontend root directory:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. **Update API Service Base URL**
In `services/apiService.ts`, update the base URL if needed:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 🔧 **Key Integration Points**

### **Authentication Flow**
- **Login/Register**: `components/AuthModal.tsx`
- **Token Storage**: Automatically handled in `services/apiService.ts`
- **Protected Routes**: Check `authAPI.isAuthenticated()` before API calls

### **Story Generation**
- **Before**: Direct Gemini API calls from frontend
- **After**: Calls to `POST /api/stories/generate` endpoint
- **Location**: `components/StoryGenerator.tsx` → `storyAPI.generate()`

### **Chatbot**
- **Before**: Direct Gemini API calls from frontend
- **After**: Calls to `POST /api/chatbot` endpoint
- **Location**: `components/Chatbot.tsx` → `chatbotAPI.getResponse()`

### **Public Gallery**
- **Before**: Local storage for public stories
- **After**: Calls to `GET /api/public/stories` endpoint
- **Location**: `components/PublicStoriesPage.tsx` → `publicAPI.getStories()`

### **Comments**
- **Before**: Local storage for comments
- **After**: Calls to `POST /api/public/stories/:id/comments` endpoint
- **Location**: `components/StoryViewerModal.tsx` → `publicAPI.addComment()`

## 📊 **API Endpoints Used**

| Component | Endpoint | Method | Purpose |
|-----------|----------|---------|---------|
| AuthModal | `/auth/register` | POST | User registration |
| AuthModal | `/auth/login` | POST | User login |
| Header | `/auth/me` | GET | Get user profile |
| StoryGenerator | `/stories/generate` | POST | Generate storybook |
| StoryGenerator | `/stories/:id/share` | PUT | Share story publicly |
| PublicStoriesPage | `/public/stories` | GET | Get public stories |
| StoryViewerModal | `/public/stories/:id/comments` | POST | Add comment |
| Chatbot | `/chatbot` | POST | Get AI response |

## 🔐 **Authentication Integration**

### **How Authentication Works:**
1. User clicks "Login" in header
2. `AuthModal` opens with login/register form
3. On successful auth, JWT token is stored in localStorage
4. Token is automatically included in all API requests
5. User state is managed in `Header` component

### **Protected Features:**
- Story generation requires authentication
- Story sharing requires authentication
- User profile access requires authentication

## 🎯 **Testing the Integration**

### **1. Test Authentication:**
```bash
# Register a new user
POST http://localhost:3001/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "testpassword123"
}
```

### **2. Test Story Generation:**
```bash
# Generate a story (requires authentication)
POST http://localhost:3001/api/stories/generate
Authorization: Bearer <your-jwt-token>
{
  "prompt": "A brave little dragon",
  "interests": "dragons, magic",
  "age": 6
}
```

### **3. Test Public Gallery:**
```bash
# Get public stories
GET http://localhost:3001/api/public/stories
```

## 🐛 **Common Issues & Solutions**

### **Issue 1: CORS Errors**
**Solution**: Make sure your backend CORS is configured for your frontend URL:
```typescript
// In backend/src/server.ts
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

### **Issue 2: Authentication Token Expired**
**Solution**: The API service automatically handles token refresh. If issues persist, check JWT_SECRET in backend .env file.

### **Issue 3: API Calls Failing**
**Solution**: 
1. Check if backend server is running on port 3001
2. Verify API_BASE_URL in apiService.ts
3. Check browser network tab for error details

### **Issue 4: Environment Variables**
**Solution**: Make sure all required environment variables are set in backend/.env:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-key"
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
```

## 📱 **Frontend Features Now Available**

### **✅ What Works:**
- User registration and login
- AI-powered story generation
- Story sharing to public gallery
- Public story browsing
- Comment system
- AI chatbot for parenting advice
- User authentication state management

### **🔄 What Changed:**
- All AI calls now go through your backend
- Stories are stored in PostgreSQL database
- Images are stored in Cloudinary
- Authentication is handled server-side
- Comments are persistent in database

## 🚀 **Next Steps**

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Test the integration:**
   - Register a new account
   - Generate a story
   - Share it to public gallery
   - View it in the gallery
   - Add comments
   - Test the chatbot

3. **Deploy:**
   - Deploy backend to your hosting service
   - Update API_BASE_URL in frontend
   - Deploy frontend

## 📞 **Support**

If you encounter any issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set
4. Ensure both servers are running

The integration is now complete! Your frontend will use the robust backend API instead of direct Gemini API calls.

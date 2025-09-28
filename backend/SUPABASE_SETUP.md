# Supabase Setup Guide for TaleWeaver AI

## 🚀 **Quick Setup Steps**

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign up/Login with GitHub, Google, or email
4. Click "New Project"
5. Fill in project details:
   - **Name**: `taleweaver-ai`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

### **Step 2: Get Database Connection String**

1. Once your project is created, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Copy the **URI** connection string
4. It will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### **Step 3: Update Your Environment**

1. Copy the example file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Edit `.env` with your actual Supabase connection string:
   ```env
   # Replace [YOUR-PASSWORD] and [PROJECT-REF] with actual values
   DATABASE_URL="postgresql://postgres:your-actual-password@db.your-project-ref.supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:your-actual-password@db.your-project-ref.supabase.co:5432/postgres"
   ```

### **Step 4: Install Dependencies and Set Up Database**

```bash
cd backend
npm install
npm run db:generate
npm run db:push
```

### **Step 5: Test the Connection**

```bash
npm run dev
```

You should see:
```
🚀 TaleWeaver AI Backend Server running on port 3001
📊 Environment: development
🔗 Health check: http://localhost:3001/health
```

### **Step 6: Verify Database Tables**

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. You should see your tables:
   - `users`
   - `story_books`
   - `comments`

## ✅ **What's Changed**

- **Environment variables**: Updated to use Supabase connection strings
- **Prisma schema**: Added `directUrl` for Supabase compatibility
- **Dependencies**: Added `@supabase/supabase-js` for future Supabase features
- **Database**: Now uses managed Supabase PostgreSQL instead of local PostgreSQL

## 🎯 **Benefits of Supabase**

- **Managed PostgreSQL**: No database setup needed
- **Real-time capabilities**: Live updates (can be added later)
- **Built-in dashboard**: Easy database management
- **Automatic backups**: Data safety
- **Scalability**: Handles growth automatically
- **Security**: Built-in security features

## 🔧 **Optional: Future Supabase Features**

### **Real-time Subscriptions**
```typescript
// For live updates when stories are added
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Listen to new stories
supabase
  .channel('public-stories')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'story_books' },
    (payload) => console.log('New story added!', payload.new)
  )
  .subscribe()
```

### **Supabase Storage (Alternative to Cloudinary)**
```typescript
// Store images in Supabase instead of Cloudinary
const { data, error } = await supabase.storage
  .from('story-images')
  .upload('story-page-1.jpg', imageFile)
```

### **Supabase Auth (Alternative to JWT)**
```typescript
// Use Supabase Auth instead of custom JWT
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

## 🚨 **Important Notes**

- Your existing API code works exactly the same
- Prisma handles the database connection seamlessly
- All endpoints remain unchanged
- Authentication still uses JWT (can be upgraded to Supabase Auth later)
- Images still use Cloudinary (can be upgraded to Supabase Storage later)

## 📞 **Troubleshooting**

### **Connection Issues**
- Verify your connection string is correct
- Check that your Supabase project is active
- Ensure your database password is correct

### **Migration Issues**
- Make sure `DIRECT_URL` is set in your `.env`
- Try running `npm run db:reset` if needed
- Check Supabase logs for any errors

### **Permission Issues**
- Ensure your database user has proper permissions
- Check Supabase project settings

Your backend is now ready to use Supabase! 🎉

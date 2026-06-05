# Swapna Sai Luxury Girls Hostel - Full Stack MVP Deployment

This project consists of a Next.js 14+ App Router frontend and an Express.js backend using a Supabase PostgreSQL database.

## Architecture
- **Frontend**: Next.js, Tailwind CSS, Framer Motion (Deployed on Vercel)
- **Backend**: Node.js, Express.js (Deployed on Render)
- **Database**: PostgreSQL (Hosted on Supabase)

---

## 1. Database Setup (Supabase)
1. Create a free account at [Supabase.com](https://supabase.com).
2. Create a new project.
3. Once created, go to the SQL Editor in the left sidebar.
4. Copy the contents of `swapna-sai-backend/database_schema.sql` and run it. This will create all necessary tables and a default admin user.
5. Go to Project Settings -> Database. Copy the **Connection String (URI)**. You will need this for the backend.

---

## 2. Backend Deployment (Render.com)
The backend is completely ready for a free deployment on Render.
1. Push the `swapna-sai-backend` folder to a GitHub repository.
2. Sign up / Log in to [Render.com](https://render.com).
3. Click "New" -> "Blueprint".
4. Connect your GitHub account and select the backend repository.
5. Render will detect the `render.yaml` file and set up a Web Service automatically.
6. Go to the newly created Web Service -> **Environment** tab and add:
   - `DATABASE_URL`: Your Supabase connection string.
   - `JWT_SECRET`: A secure random string for authentication.
   - `EMAIL_USER`: Your Gmail address to send email notifications.
   - `EMAIL_PASS`: Gmail App Password (16 characters).
   - `EMAIL_RECEIVER`: Recipient email (optional, defaults to `swapnasaigirlshostel@gmail.com`).
7. Once deployed, copy the Render URL (e.g., `https://swapna-sai-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)
1. Push the `swapna-sai-hostel` folder to a GitHub repository.
2. Sign up / Log in to [Vercel.com](https://vercel.com).
3. Click "Add New..." -> "Project".
4. Import your frontend repository.
5. In the "Environment Variables" section, add:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL + `/api` (e.g., `https://swapna-sai-api.onrender.com/api`).
6. Click **Deploy**.

## Testing Locally
**Backend**:
```bash
cd swapna-sai-backend
npm install
# Create .env with DATABASE_URL and JWT_SECRET
node server.js
```

**Frontend**:
```bash
cd swapna-sai-hostel
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

## Admin Access
The default admin login created by the database script is:
- **Email**: admin@swapnasai.com
- **Password**: admin123
*Please change this in the database for production!*

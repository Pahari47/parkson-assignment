# Deployment Guide

This guide will help you deploy your warehouse inventory application to Render (backend) and Vercel (frontend).

## Backend Deployment (Render)

### 1. Prepare Your Repository

Make sure your backend code is pushed to a Git repository (GitHub, GitLab, etc.).

### 2. Deploy to Render

1. **Sign up/Login to Render**: Go to [render.com](https://render.com) and create an account or login.

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the repository containing your backend code

3. **Configure the Web Service**:
   - **Name**: `warehouse-inventory-backend` (or your preferred name)
   - **Environment**: `Python 3.11`
   - **Build Command**: `./build.sh`
   - **Start Command**: `./start.sh`
   - **Root Directory**: Leave empty (use root directory)

4. **Environment Variables**:
   Add these environment variables in Render dashboard:
   ```
   SECRET_KEY=your-secure-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=localhost,127.0.0.1,your-app-name.onrender.com
   DATABASE_URL=your-postgresql-database-url
   CORS_ALLOW_ALL_ORIGINS=True
   PORT=8000
   ```

5. **Database Setup**:
   - Create a PostgreSQL database in Render
   - Copy the database URL and set it as `DATABASE_URL` environment variable

6. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Note the URL (e.g., `https://your-app-name.onrender.com`)

### 3. Test Your Backend

Once deployed, test your API endpoints:
- `https://your-app-name.onrender.com/api/`
- `https://your-app-name.onrender.com/admin/`

## Frontend Deployment (Vercel)

### 1. Prepare Your Repository

Make sure your frontend code is pushed to a Git repository.

### 2. Deploy to Vercel

1. **Sign up/Login to Vercel**: Go to [vercel.com](https://vercel.com) and create an account or login.

2. **Import Project**:
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing your frontend code

3. **Configure the Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (if your frontend is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   Add these environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   VITE_ENV=production
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Note the URL (e.g., `https://your-app-name.vercel.app`)

### 3. Update API URL

After getting your backend URL from Render, update the `VITE_API_URL` environment variable in Vercel to point to your backend API.

## Environment Variables Summary

### Backend (Render) Environment Variables:
```
SECRET_KEY=your-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-app-name.onrender.com
DATABASE_URL=your-postgresql-database-url
CORS_ALLOW_ALL_ORIGINS=True
PORT=8000
```

### Frontend (Vercel) Environment Variables:
```
VITE_API_URL=https://your-render-app.onrender.com/api
VITE_ENV=production
```

## Important Notes

1. **CORS Configuration**: The backend is configured to allow all origins in production. You may want to restrict this to your frontend domain for better security.

2. **Database**: Make sure to use a PostgreSQL database in production. SQLite is not suitable for production deployments.

3. **Static Files**: The backend is configured with WhiteNoise for serving static files in production.

4. **Port Configuration**: The backend will use the `PORT` environment variable provided by Render.

5. **Security**: 
   - Generate a strong `SECRET_KEY` for production
   - Set `DEBUG=False` in production
   - Consider restricting `ALLOWED_HOSTS` to your specific domains

## Troubleshooting

### Backend Issues:
- Check Render logs for build errors
- Ensure all environment variables are set correctly
- Verify database connection string format

### Frontend Issues:
- Check Vercel build logs
- Ensure `VITE_API_URL` points to your correct backend URL
- Verify all environment variables are set in Vercel dashboard

## Testing Your Deployment

1. **Backend API**: Test your API endpoints at `https://your-backend-url.onrender.com/api/`
2. **Frontend**: Visit your Vercel URL and test the application
3. **Integration**: Ensure the frontend can communicate with the backend API

## Next Steps

After successful deployment:
1. Set up a custom domain (optional)
2. Configure monitoring and logging
3. Set up CI/CD pipelines for automatic deployments
4. Implement proper security measures
5. Set up database backups 
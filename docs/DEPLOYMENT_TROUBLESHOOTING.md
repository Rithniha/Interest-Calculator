# Deployment Troubleshooting Guide

## Issue: Login/Registration Failing on Deployed Site

### What I Fixed:

1. **CORS Configuration (Backend)**
   - Updated `backend/server.js` to accept ALL Vercel deployments
   - Now accepts: localhost, vercel.app domains, and custom domains
   - Added better logging to see which origins are being blocked

2. **Error Handling (Frontend)**
   - Updated `Login.jsx` and `Register.jsx` with detailed error messages
   - Now shows specific errors for:
     - Network connection issues
     - Server not responding
     - Invalid credentials
     - CORS problems

### Steps to Deploy the Fixes:

#### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Fix CORS and add better error handling"
git push
```

#### Step 2: Redeploy Backend on Render
1. Go to your Render dashboard
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete (check logs for "✅ Connected to MongoDB")

#### Step 3: Redeploy Frontend on Vercel
- Vercel should automatically redeploy when you push to GitHub
- If not, go to Vercel dashboard and click "Redeploy"

### Verification Checklist:

#### Backend Health Check:
1. Open your backend URL in browser: `https://interest-calculator-j271.onrender.com`
2. You should see: "Interest Calculator API is running..."
3. If you see an error page, check Render logs

#### Frontend-Backend Connection:
1. Open browser console (F12) on your deployed frontend
2. Try to login
3. Check console for error messages
4. Look for:
   - `ERR_NETWORK` = Backend is down or URL is wrong
   - `CORS error` = Backend needs to allow your frontend URL
   - `401/400` = Backend is working, but credentials are wrong

### Common Issues and Solutions:

#### Issue: "Cannot connect to server"
**Solution:** 
- Check if backend is actually deployed on Render
- Verify the API URL in `frontend/src/utils/api.js` matches your Render URL
- Check Render logs for errors

#### Issue: "CORS error" in browser console
**Solution:**
- Make sure you deployed the latest backend code with updated CORS
- Check Render environment variables include `MONGODB_URI` and `JWT_SECRET`
- Look at Render logs to see what origin is being blocked

#### Issue: Backend shows "Application failed to respond"
**Solution:**
- Check Render environment variables:
  - `MONGODB_URI` should be your Atlas connection string
  - `JWT_SECRET` should be set
  - `PORT` is optional (Render provides it automatically)
- Check MongoDB Atlas:
  - Network Access allows 0.0.0.0/0
  - Database user exists with correct password

### Environment Variables Checklist:

#### Render (Backend):
- ✅ `MONGODB_URI`: `mongodb+srv://rithniha:rithni123@cluster0.f7tr4cj.mongodb.net/interest-calculator?retryWrites=true&w=majority`
- ✅ `JWT_SECRET`: `f7e2b1d3c5a6b7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v`

#### Vercel (Frontend):
- ✅ `VITE_API_URL`: `https://interest-calculator-j271.onrender.com/api`

### Testing Locally First:

Before deploying, test locally to ensure everything works:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

If it works locally but not in production:
1. The issue is deployment-specific (CORS, environment variables, or URLs)
2. Check browser console for exact error
3. Check Render logs for backend errors

### Next Steps After Fixing:

Once login/registration works:
1. Test creating an account
2. Test logging in
3. Test adding a transaction
4. Verify data appears in MongoDB Atlas
5. Then we can proceed with PWA setup!

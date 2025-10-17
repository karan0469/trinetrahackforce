# 📋 Good Citizen - Quick Setup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Install MongoDB
If you don't have MongoDB installed:

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Download from https://www.mongodb.com/try/download/community

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp ../.env.example .env
```

**Edit `.env` file** - Minimum required:
```env
MONGODB_URI=mongodb://localhost:27017/good-citizen
JWT_SECRET=my-super-secret-key-12345
PORT=5000
```

```bash
# Seed database with demo data
npm run seed

# Start backend server
npm run dev
```

✅ Backend should be running on http://localhost:5000

### Step 3: Setup Frontend

Open a **NEW terminal** window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

The default `.env` should work:
```env
REACT_APP_API_URL=http://localhost:5000
```

```bash
# Start frontend
npm start
```

✅ Frontend should open automatically at http://localhost:3000

### Step 4: Login & Test

Use these demo credentials:

**Admin Account:**
- Email: `admin@goodcitizen.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

## 🎯 Basic Functionality Test

1. **Login** with john@example.com
2. **Create a Report**:
   - Click "Create Report"
   - Select any category
   - Upload any image from your computer
   - Click "Use Current Location" or enter coordinates manually
   - Add description
   - Submit
3. **Switch to Admin**:
   - Logout
   - Login with admin@goodcitizen.com
   - Click "Admin" in navbar
   - You'll see the pending report
   - Click "Verify & Award Points"
4. **Switch back to User**:
   - Logout
   - Login with john@example.com
   - Check Dashboard - you should have 10 points!
   - Go to "Rewards" and redeem something

## 🔧 Optional: Setup Image Upload (Cloudinary)

For production-quality image storage:

1. **Sign up** at https://cloudinary.com (free tier)
2. **Get credentials** from Dashboard
3. **Update backend/.env**:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
4. **Restart backend** server

Without Cloudinary, images are stored in memory (works for testing).

## 📧 Optional: Setup Email Notifications

To send emails to authorities:

1. **Use Gmail App Password**:
   - Enable 2FA on Gmail
   - Generate app password: https://myaccount.google.com/apppasswords
   
2. **Update backend/.env**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

3. **Restart backend** server

## ❌ Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh

# If connection fails, start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Port 5000 already in use
Update `backend/.env`:
```env
PORT=5001
```

And `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5001
```

### Frontend shows connection error
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend/.env
- Check browser console for errors

### Images not uploading
- For testing, Cloudinary is optional
- Make sure you're selecting image files (JPEG, PNG)
- Check file size is under 5MB

## 🎓 Learning Path

1. **Day 1**: Run the app, test basic features
2. **Day 2**: Explore code structure, understand models
3. **Day 3**: Modify UI, add new categories
4. **Day 4**: Add new features (e.g., comments on reports)
5. **Day 5**: Deploy to production

## 📚 Next Steps

- Read full `README.md` for detailed documentation
- Explore API endpoints in backend/routes/
- Customize UI colors in frontend/tailwind.config.js
- Add more reward options in backend/controllers/rewardController.js

## 🆘 Need Help?

- Check the error messages in terminal
- Look at browser console (F12)
- Verify .env files are properly configured
- Ensure MongoDB is running
- Make sure ports 3000 and 5000 are available

---

**Happy Coding! 🚀**

# 🛡️ Good Citizen - Civic Violation Reporting Platform

A comprehensive web application that empowers citizens to report civic rule violations and earn rewards for their contributions to the community.

## 🌟 Features

### User Module
- **Authentication**: Email/password login with OTP support via Firebase
- **Dashboard**: Personal statistics, points, reputation score
- **Leaderboard**: See top reporters and your ranking
- **Profile Management**: Track your reports and activity

### Report Module
- **Create Reports**: Upload photos, auto-capture GPS location
- **Categories**: Helmet Violation, Littering, Illegal Parking, Traffic Violation, Others
- **Auto-Metadata**: Timestamp, location coordinates, device info
- **Track Status**: View real-time status of your reports (Pending/Verified/Rejected/Resolved)

### Verification Module
- **Admin Dashboard**: Review and verify pending reports
- **Approve/Reject**: Quick actions with reason tracking
- **Auto-Email**: Verified reports sent to respective authorities
- **Points Award**: Users get 10 points per verified report

### Reward System
- **Point Accumulation**: Earn 10 points per verified report
- **Redemption Options**: 
  - Shopping vouchers (₹50, ₹100)
  - Discount coupons (10%, 20%)
  - Donations to NGOs
  - Gift cards (Amazon, Flipkart)
- **Redemption History**: Track all your redeemed rewards

### Admin Panel
- **Statistics Dashboard**: Visual analytics with charts
- **Report Management**: Filter by status and category
- **CSV Export**: Download reports for analysis
- **Authority Management**: Manage notification recipients

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Nodemailer** - Email notifications
- **Firebase Admin** - OTP authentication (optional)
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp ../.env.example .env
```

4. Update `.env` with your credentials:
   - MongoDB connection string
   - JWT secret key
   - Cloudinary credentials (sign up at https://cloudinary.com)
   - Email credentials (Gmail app password recommended)

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` if needed (default: `REACT_APP_API_URL=http://localhost:5000`)

5. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 Demo Credentials

After running the seed script, you can use these credentials:

### Admin Account
- **Email**: admin@goodcitizen.com
- **Password**: admin123

### User Accounts
- **Email**: john@example.com | **Password**: password123
- **Email**: jane@example.com | **Password**: password123

## 📱 Usage Guide

### For Citizens

1. **Register/Login**: Create an account or login
2. **Create Report**:
   - Click "Create Report" in navigation
   - Select violation category
   - Upload a clear photo of the violation
   - Add description (10-500 characters)
   - Use GPS to capture location or enter manually
   - Submit the report
3. **Track Reports**: View all your reports in "My Reports"
4. **Earn Points**: Get 10 points when your report is verified
5. **Redeem Rewards**: Use points to get vouchers, discounts, or donate to NGOs
6. **Check Leaderboard**: See how you rank among other reporters

### For Admins

1. **Login**: Use admin credentials
2. **Access Admin Panel**: Click "Admin" in navigation
3. **Review Reports**:
   - View all pending reports
   - See reporter details and reputation
   - Click "Verify" to approve (awards 10 points to user)
   - Click "Reject" to deny with a reason
4. **Monitor Stats**: View analytics dashboard
5. **Export Data**: Download CSV reports for analysis

## 🗂️ Project Structure

```
good-citizen/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & validation
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.js       # Main component
│   │   └── index.js     # Entry point
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/firebase-login` - Firebase OTP login
- `GET /api/auth/me` - Get current user

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/my-reports` - Get user's reports
- `POST /api/reports` - Create new report
- `DELETE /api/reports/:id` - Delete report

### Admin
- `GET /api/admin/reports` - Get all reports (admin)
- `GET /api/admin/reports/pending` - Get pending reports
- `PUT /api/admin/reports/:id/verify` - Verify report
- `PUT /api/admin/reports/:id/reject` - Reject report
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/reports/export` - Export CSV

### Rewards
- `GET /api/rewards/available` - Get available rewards
- `POST /api/rewards/redeem` - Redeem a reward
- `GET /api/rewards/my-redemptions` - Get redemption history

### Users
- `GET /api/users/leaderboard` - Get top users
- `GET /api/users/stats` - Get user statistics

## 🛠️ Configuration

### Cloudinary Setup
1. Sign up at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret
3. Add to backend `.env` file

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `.env` file

### MongoDB Setup
- **Local**: Install MongoDB and run `mongod`
- **Cloud**: Use MongoDB Atlas (https://www.mongodb.com/cloud/atlas)

## 🎨 Design Features

- **Clean & Minimalistic**: White background with green accents
- **Mobile Responsive**: Works on all device sizes
- **Accessible**: ARIA labels and keyboard navigation
- **Modern UI**: Rounded corners, shadows, smooth transitions
- **Icons**: Lucide React icons throughout

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables in hosting platform
2. Deploy from Git repository
3. Update frontend API URL

### Frontend (Vercel/Netlify)
1. Connect Git repository
2. Set build command: `npm run build`
3. Set environment variable: `REACT_APP_API_URL`
4. Deploy

## 📝 Database Schema

### Users
- name, email, phone, password, points, reputation, role, timestamps

### Reports
- userId, category, description, photoUrl, location (GeoJSON), status, verifiedBy, timestamps

### Authorities
- name, email, contactNumber, department, jurisdiction, categories

### Redemptions
- userId, pointsUsed, rewardType, rewardCode, status, expiryDate, timestamps

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Icons by Lucide
- UI inspiration from modern SaaS platforms
- Built with ❤️ for civic engagement

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Made with 💚 to make our communities better, one report at a time!**

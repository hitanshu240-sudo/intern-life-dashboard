# Intern Life Dashboard 🚀

A simple weekly system that helps interns track growth, money, and work clarity. Built for interns and early professionals (0–2 years) in tech environments.

## 🎯 Core Features

### 1. Weekly Check-in

- Log learnings, tasks, wins, and struggles
- Rate yourself on learning, productivity, and discipline (0-10)
- Auto-calculated overall weekly score
- Track weekly progress over time

### 2. Money Tracker

- Track income vs expenses
- Categorize transactions
- Monthly and yearly financial overview
- Simple balance calculation

### 3. Weekly Score System

- Learning Score (0-10)
- Productivity Score (0-10)
- Discipline Score (0-10)
- Overall Score (average of all three)

### 4. Progress View

- Weekly trends visualization
- Historical check-in data
- Performance insights

### 5. Streak Tracking

- Current weekly check-in streak
- Longest streak record
- Gamification to maintain consistency

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API calls
- **Lucide React** for icons

### Backend

- **Node.js** with Express
- **TypeScript**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing

## 📁 Project Structure

```
intern-life-dashboard/
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── dashboard/       # Protected dashboard pages
│   ├── lib/
│   │   └── api.ts           # API client configuration
│   └── package.json
│
└── backend/                  # Express backend
    ├── src/
    │   ├── config/
    │   │   └── database.ts  # MongoDB connection
    │   ├── models/
    │   │   ├── User.ts      # User model
    │   │   ├── WeeklyCheckIn.ts
    │   │   └── MoneyTransaction.ts
    │   ├── controllers/     # Business logic
    │   ├── routes/          # API routes
    │   ├── middleware/
    │   │   └── auth.ts      # JWT authentication
    │   └── server.ts        # Express server
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd intern-life-dashboard/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intern-life-dashboard
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd intern-life-dashboard/frontend
```

2. Install dependencies:

```bash
npm install
```

3. The `.env.local` file is already configured to point to `http://localhost:5000/api`

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Database Setup

If using local MongoDB:

```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

Alternatively, use MongoDB Atlas (cloud):

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in backend `.env`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Weekly Check-ins

- `POST /api/weekly-checkins` - Create check-in
- `PUT /api/weekly-checkins/:id` - Update check-in
- `GET /api/weekly-checkins` - Get all check-ins
- `GET /api/weekly-checkins/current` - Get current week check-in
- `GET /api/weekly-checkins/stats` - Get weekly statistics

### Money Tracker

- `POST /api/money` - Create transaction
- `GET /api/money` - Get transactions (with filters)
- `PUT /api/money/:id` - Update transaction
- `DELETE /api/money/:id` - Delete transaction
- `GET /api/money/stats/monthly` - Get monthly stats
- `GET /api/money/stats/yearly` - Get yearly overview

## 🎨 Design Principles

### Addictive Elements

- **Streak Tracking**: Maintains engagement through consecutive weekly check-ins
- **Weekly Scores**: Provides immediate feedback and progress measurement
- **Progress Insights**: Visual feedback on improvement trends

### User Experience

- Clean, modern interface with Tailwind CSS
- Mobile-responsive design
- Intuitive navigation
- Real-time data updates

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Environment variable management

## 📈 Learning Outcomes

This project helps you learn:

- Full-stack TypeScript development
- Next.js App Router patterns
- RESTful API design
- MongoDB and Mongoose
- JWT authentication
- React state management
- Data visualization
- Product thinking and user behavior

## 🗺️ Roadmap

### MVP (Current)

- ✅ User authentication
- ✅ Weekly check-ins
- ✅ Money tracking
- ✅ Basic dashboard
- ✅ Streak system

### Future Features

- [ ] Google OAuth integration
- [ ] Email notifications
- [ ] Data export (CSV/PDF)
- [ ] Goal setting
- [ ] Social features (share progress)
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] AI-powered insights

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Built as a learning project to understand user behavior, product thinking, and rapid iteration.

## 🙏 Acknowledgments

- Inspired by habit tracking apps and productivity tools
- Built for the intern community
- Focus on simplicity and actionable insights

---

**Happy Tracking! 🎉**

Start your journey today and see how you grow week by week!

# Quick Setup Guide 🚀

## MongoDB Setup (Choose One Option)

### Option 1: Local MongoDB (Recommended for Development)

#### macOS

```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongosh
```

#### Windows

1. Download MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and run MongoDB as a service
3. Or manually start: `mongod --dbpath C:\data\db`

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account**: Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)

2. **Create Free Cluster**:
   - Choose "Shared" (Free tier)
   - Select a cloud provider and region
   - Create cluster (takes 1-3 minutes)

3. **Setup Database Access**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Save credentials!

4. **Setup Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Click Confirm

5. **Get Connection String**:
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Update Backend .env**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/intern-life-dashboard?retryWrites=true&w=majority
```

## Complete Setup Steps

### 1. Backend Setup

```bash
# Navigate to backend
cd intern-life-dashboard/backend

# Install dependencies (if not done)
npm install

# Make sure .env file exists with correct MongoDB URI
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/intern-life-dashboard

# Or for Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/intern-life-dashboard

# Start the backend server
npm run dev
```

You should see:

```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
```

### 2. Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend
cd intern-life-dashboard/frontend

# Install dependencies (if not done)
npm install

# Start the frontend
npm run dev
```

Visit: `http://localhost:3000`

## Troubleshooting

### "MongoDB connection error"

- **Local MongoDB**: Make sure MongoDB service is running

  ```bash
  # macOS
  brew services list  # Check if mongodb-community is started
  brew services start mongodb-community

  # Linux
  sudo systemctl status mongod
  sudo systemctl start mongod
  ```

- **MongoDB Atlas**:
  - Check connection string is correct
  - Verify password has no special characters that need URL encoding
  - Ensure IP whitelist includes your IP or "0.0.0.0/0"

### "Port already in use"

- Kill the process using the port:

  ```bash
  # Find process on port 5000
  lsof -ti:5000 | xargs kill -9

  # Find process on port 3000
  lsof -ti:3000 | xargs kill -9
  ```

### TypeScript/Node version issues

- Upgrade Node.js to v20+ for best compatibility:

  ```bash
  # Check current version
  node --version

  # Using nvm (Node Version Manager)
  nvm install 20
  nvm use 20
  ```

## Verify Setup

1. **Backend Health Check**:

   ```bash
   curl http://localhost:5000/api/health
   ```

   Should return: `{"status":"OK","message":"Server is running"}`

2. **Register a User**:
   - Go to `http://localhost:3000`
   - Click "Get Started"
   - Fill in registration form
   - You should be redirected to dashboard

3. **Create Check-in**:
   - Go to "Check-ins" tab
   - Click "New Check-in"
   - Fill in the form
   - Your streak should update!

## Quick Start Script

Create a file `start.sh` in project root:

```bash
#!/bin/bash

# Start MongoDB (macOS)
brew services start mongodb-community

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd ../frontend && npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
```

Make it executable: `chmod +x start.sh`
Run: `./start.sh`

## Next Steps

1. ✅ Setup complete? Register and create your profile
2. 📝 Make your first weekly check-in
3. 💰 Add some transactions to track your money
4. 📊 Check your progress after a few weeks
5. 🚀 Share with friends and gather feedback!

## Need Help?

Common issues and solutions:

- MongoDB not connecting → Use MongoDB Atlas cloud option
- Port conflicts → Change ports in .env files
- Dependencies issues → Delete node_modules and reinstall
- TypeScript errors → Ensure using Node.js v20+

---

**You're all set! Start tracking your intern life! 🎉**

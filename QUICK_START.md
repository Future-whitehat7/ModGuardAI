# 🚀 ModGuardAI - Quick Start Guide

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** and npm or yarn
- **Python 3.9+**
- **PostgreSQL 14+** (for backend)
- **iOS**: macOS with Xcode (for iOS development)
- **Android**: Android Studio with SDK (for Android development)
- **Expo CLI**: `npm install -g expo-cli` or `npm install -g @expo/cli`

## 🎯 Two Ways to Run the App

### Option 1: Mobile App Only (with Mock Data)
Run just the mobile app with simulated API responses - great for UI/UX testing.

### Option 2: Full Stack (Mobile + Backend)
Run both mobile app and backend API for complete functionality.

---

## 📱 Option 1: Mobile App Only (Fastest)

### Step 1: Install Dependencies
```bash
cd mobile
npm install
```

### Step 2: Start Expo Development Server
```bash
npm start
# or
expo start
```

### Step 3: Run on Device
You'll see a QR code in the terminal. Choose one option:

**A. iOS Simulator (macOS only):**
```bash
# Press 'i' in the terminal
# or
npm run ios
```

**B. Android Emulator:**
```bash
# Press 'a' in the terminal
# or
npm run android
```

**C. Physical Device:**
1. Install **Expo Go** app from App Store or Google Play
2. Scan the QR code with your camera (iOS) or Expo Go app (Android)

### Step 4: Explore the App!
- You'll see the Welcome screen
- Tap "Get Started" to try the onboarding tutorial
- Sign up with any email (no backend needed for UI testing)
- Explore all the screens!

> **Note**: Without the backend, the app will show mock data. Some features like actual verification won't work.

---

## 🔧 Option 2: Full Stack (Mobile + Backend)

### Part A: Setup Backend

#### Step 1: Navigate to Backend
```bash
cd backend
```

#### Step 2: Create Virtual Environment
```bash
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

#### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Setup PostgreSQL Database
```bash
# Create database
createdb modguardai

# Or using psql
psql -U postgres
CREATE DATABASE modguardai;
\q
```

#### Step 5: Configure Environment Variables
```bash
# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/modguardai
SECRET_KEY=your-secret-key-change-this-in-production
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=modguardai-media
STRIPE_API_KEY=
REDIS_URL=redis://localhost:6379
DEBUG=True
EOF
```

#### Step 6: Run Database Migrations (when implemented)
```bash
# alembic upgrade head
# (Not needed yet - models are defined but migrations not created)
```

#### Step 7: Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

#### Step 8: Test Backend
Open browser to: http://localhost:8000/docs
You'll see the Swagger API documentation.

### Part B: Setup Mobile App

#### Step 1: Open New Terminal & Navigate to Mobile
```bash
cd mobile
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure API Endpoint
The app is already configured to use `http://localhost:8000` in development.

Check `src/config/constants.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:8000'  // ✅ Already set for dev
    : 'https://api.modguardai.com',
};
```

> **iOS Simulator**: Use `http://localhost:8000`
> **Android Emulator**: Use `http://10.0.2.2:8000` (Android emulator host)
> **Physical Device**: Use your computer's IP (e.g., `http://192.168.1.100:8000`)

To find your IP:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr IPv4
```

Update `src/config/constants.ts` if needed:
```typescript
BASE_URL: __DEV__
  ? 'http://YOUR_IP_ADDRESS:8000'  // Replace with your IP
  : 'https://api.modguardai.com',
```

#### Step 4: Start Mobile App
```bash
npm start
```

#### Step 5: Run on Device (Choose One)
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Physical Device - Scan QR code with Expo Go
```

### Part C: Test End-to-End

1. **Welcome Screen** → Tap "Get Started"
2. **Onboarding** → Complete the tutorial
3. **Sign Up** → Create an account (will call backend API)
4. **Home** → See your dashboard
5. **Challenges** → Try a challenge (will fetch from backend)
6. **Scan** → Upload media for verification
7. **Labs** → Label media and earn
8. **Profile** → View your stats

---

## 🎨 What You'll See

### Screen Flow:
```
1. Welcome Screen
   ↓ [Get Started]
2. Onboarding Tutorial (3 sample challenges)
   ↓ [Complete]
3. Sign Up Screen
   ↓ [Create Account]
4. Home Dashboard
   ├─ [Tap Scan] → Scan Screen
   ├─ [Tap Challenges] → Challenges Screen
   ├─ [Tap Labs] → Labs Screen
   └─ [Tap Profile] → Profile Screen
```

### Bottom Tab Navigation:
- 🏠 **Home** - Dashboard with stats
- 🎯 **Challenges** - Daily deepfake detection challenges
- 📸 **Scan** - Upload and verify media
- 💰 **Labs** - Earn money by labeling
- 👤 **Profile** - Your stats and settings

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
```

#### 2. Metro bundler won't start
```bash
npm start -- --clear
# or
npx expo start -c
```

#### 3. iOS build fails
```bash
cd ios
pod install
cd ..
npm run ios
```

#### 4. Android emulator not found
```bash
# Start Android Studio
# Tools → AVD Manager → Create Virtual Device
# Then run:
npm run android
```

#### 5. Backend database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep modguardai

# Recreate if needed
dropdb modguardai
createdb modguardai
```

#### 6. API calls failing from mobile app
- Check backend is running: `curl http://localhost:8000/health`
- Check mobile config has correct IP address
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use your computer's local IP

#### 7. Expo Go connection issues
```bash
# Ensure phone and computer are on same WiFi network
# Disable VPN if enabled
# Try tunnel mode: expo start --tunnel
```

---

## 📊 Development Workflow

### Recommended Terminal Setup
```
Terminal 1: Backend Server
  cd backend
  source venv/bin/activate
  uvicorn app.main:app --reload

Terminal 2: Mobile App
  cd mobile
  npm start

Terminal 3: Logs/Commands
  # For iOS logs: npx react-native log-ios
  # For Android logs: npx react-native log-android
  # For git commands, testing, etc.
```

### Hot Reloading
- **Mobile**: Changes auto-reload in Expo
- **Backend**: FastAPI auto-reloads with `--reload` flag

### Debugging
```bash
# iOS
xcrun simctl erase all  # Reset simulator

# Android
adb logcat  # View Android logs

# React Native Debugger
npm install -g react-devtools
react-devtools
```

---

## 🎯 Next Steps

### To fully test the app, you need to implement:

**Backend (Priority):**
1. Authentication endpoints (`/v1/auth/register`, `/v1/auth/login`)
2. User creation and JWT token generation
3. Challenge endpoints (`/v1/challenges/daily`)
4. Verification endpoints (`/v1/verify`)
5. Labs endpoints (`/v1/labs/tasks`)

**Mobile (Enhancements):**
1. Error handling for API failures
2. Offline support
3. Push notifications
4. Biometric authentication
5. Better loading states

**ML Pipeline:**
1. Train deepfake detection models
2. Implement inference endpoints
3. Setup Celery for async processing

---

## 📱 Expo Go App

Download for testing on physical device:
- **iOS**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

---

## 🔗 Useful Links

- **Mobile App**: `http://localhost:19000` (Expo DevTools)
- **Backend API**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`
- **Alternative API Docs**: `http://localhost:8000/redoc`
- **Database**: `postgresql://localhost:5432/modguardai`

---

## 💡 Pro Tips

1. **Use Expo DevTools**: Press `d` in terminal to open developer menu on device
2. **Shake device**: Opens Expo menu for reload, debug, etc.
3. **Fast Refresh**: Shake device → Enable Fast Refresh for instant updates
4. **Network Inspector**: Use Reactotron or Flipper for API debugging
5. **Database GUI**: Use Postico (Mac) or pgAdmin for PostgreSQL visualization

---

## 📞 Need Help?

- Check `/mobile/README.md` for detailed mobile docs
- Check `/backend/README.md` for detailed backend docs
- Check `/MOBILE_APP_README.md` for architecture overview
- View screens preview: `/mobile/SCREENS_PREVIEW.md`

---

**Ready to build the future of deepfake detection! 🛡️**

# ModGuardAI Mobile App - Project Overview

Complete mobile application ecosystem for deepfake detection, media verification, and crowdsourced labeling.

## 📱 Project Structure

```
ModGuardAI/
├── mobile/              # React Native mobile app
│   ├── src/
│   │   ├── screens/     # App screens
│   │   ├── components/  # Reusable components
│   │   ├── navigation/  # Navigation setup
│   │   ├── store/       # State management (Zustand)
│   │   ├── api/         # API client
│   │   └── types/       # TypeScript types
│   ├── App.tsx          # Entry point
│   ├── package.json
│   └── README.md
│
├── backend/             # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   ├── ml/          # ML models
│   │   └── main.py      # FastAPI app
│   ├── requirements.txt
│   └── README.md
│
└── MOBILE_APP_README.md # This file
```

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
createdb modguardai
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

Backend will run at: http://localhost:8000

### 2. Setup Mobile App

```bash
cd mobile

# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🎯 Features Implemented

### ✅ MVP Features (Complete)

#### Authentication & Onboarding
- Welcome screen with feature highlights
- Interactive onboarding tutorial (spot the deepfake game)
- Email/password authentication
- JWT token management with auto-refresh
- Secure token storage with Expo SecureStore
- Biometric authentication ready (Face ID/Touch ID)

#### Home Dashboard
- User stats display (ELO, accuracy, streak, level)
- Quick action buttons (scan, challenges, labs, lessons)
- Recent activity feed
- Level progression bar with XP tracking

#### Daily Challenges
- Fetch and display 20 daily challenges
- Video, image, and audio challenge types
- Real-time answer submission
- Instant feedback with explanations
- Visual cues highlighting (eye movement, lighting, audio artifacts)
- ELO rating system (starts at 1000)
- XP rewards based on performance
- Challenge history tracking

#### Scan & Verify
- Media upload from camera or gallery
- Support for video, image, and audio files
- Upload progress indicator
- Real-time status polling
- Verdict display: Real / Fake / Inconclusive
- Confidence score (0-100%)
- Visual cues with explanations
- Detailed analysis breakdown
- Scan credit system (3 free/month, earn more via challenges)

#### ModGuard Labs (Crowdsourced Labeling)
- Earnings dashboard (total, weekly, available balance)
- Browse available labeling tasks
- Task details (media type, reward amount, difficulty)
- Labeling interface with Real/Fake classification
- Confidence slider
- Reasoning text input
- Quality control with gold standard checks
- Automatic reward calculation
- Payout request ($10 minimum)

#### Profile & Settings
- User profile with avatar and stats
- Achievements display
- Settings menu (edit profile, notifications, subscription, etc.)
- Subscription management (Free vs Premium)
- Sign out functionality

### 🔄 Coming Soon

#### Badge Analytics
- Digital twin creation (biometric fingerprint)
- C2PA badge issuance for content creators
- Badge verification tracking
- Analytics dashboard (verifications, trust score)
- Geographic distribution of verifications

#### Education Library
- Categorized lessons (beginner, intermediate, advanced)
- Video tutorials and interactive content
- Practice quizzes
- Personalized recommendations based on challenge mistakes
- Progress tracking and certificates

#### Advanced Features
- Real-time video stream analysis
- Browser extension integration
- Multi-language support
- Social features and global leaderboard
- WhatsApp/Telegram bot integration

## 🏗️ Architecture

### Mobile App (React Native + Expo)

**State Management:**
- Zustand for global state
- Separate stores for auth, challenges, scan, labs
- Persistent storage with Expo SecureStore

**Navigation:**
- React Navigation v6
- Stack Navigator for auth flow
- Bottom Tab Navigator for main app
- Deep linking ready

**API Integration:**
- Axios client with interceptors
- Automatic JWT token refresh
- Request/response error handling
- File upload with progress tracking

**UI/UX:**
- Custom component library (Button, Card, Input)
- Dark theme optimized for mobile
- Smooth animations with React Native Reanimated
- Haptic feedback for interactions

### Backend (FastAPI + PostgreSQL)

**API Design:**
- RESTful endpoints
- JWT authentication
- File upload handling
- WebSocket support for real-time updates

**Database:**
- PostgreSQL for relational data
- SQLAlchemy ORM
- Alembic migrations
- Indexed queries for performance

**ML Pipeline:**
- Video: Face tracking, eye movement, lighting analysis
- Audio: Spectral analysis, voice quality, prosody
- Image: Edge artifacts, GAN fingerprints, metadata
- Ensemble model for final verdict

**Background Jobs:**
- Celery for async tasks
- Redis as message broker
- ML model inference in worker processes
- Scheduled tasks (daily challenges, payout processing)

## 📊 Data Flow

### Challenge Flow
```
Mobile App → GET /challenges/daily
          ← 20 challenge objects
User answers → POST /challenges/submit
          ← Result (correct/incorrect, ELO change, XP)
Update local state
```

### Verification Flow
```
Mobile App → POST /verify (multipart/form-data)
Backend → Upload to S3
       → Create verification job
       → Queue ML task
Mobile App ← Job ID
Mobile App → Poll GET /verify/{job_id}
          ← Status: pending/processing
ML Worker → Analyze media
         → Update job with results
Mobile App → Poll GET /verify/{job_id}
          ← Status: completed, result object
Display result
```

### Labs Flow
```
Mobile App → GET /labs/tasks
          ← Available tasks
User labels → POST /labs/submit
Backend → Check against gold standard (10% of tasks)
       → Calculate reward
       → Update earnings
       → Update accuracy score
Mobile App ← Reward amount
Update earnings dashboard
```

## 🔐 Security

- JWT tokens with 7-day expiration
- Refresh tokens with 30-day expiration
- Secure token storage (Expo SecureStore uses Keychain/Keystore)
- Password hashing with bcrypt
- HTTPS only in production
- File upload validation (size, type)
- Rate limiting on API endpoints
- CORS configured for mobile app origins

## 🎨 Design System

### Colors
```typescript
primary: '#6366F1'     // Indigo
secondary: '#8B5CF6'   // Purple
accent: '#EC4899'      // Pink
background: '#0F172A'  // Dark blue
surface: '#1E293B'     // Lighter dark
text: '#F8FAFC'        // White
real: '#10B981'        // Green
fake: '#EF4444'        // Red
inconclusive: '#F59E0B' // Orange
```

### Typography
- Headers: Bold, 24-32px
- Body: Regular, 14-16px
- Captions: 12px
- System font stack (SF Pro on iOS, Roboto on Android)

### Spacing
- Base unit: 8px
- Padding: 16px, 24px, 32px
- Gaps: 8px, 12px, 16px
- Border radius: 12px, 16px, 24px

## 📈 Performance

### Mobile App
- Target: 60 FPS
- App launch: < 2 seconds
- Screen transitions: < 200ms
- Image loading: Progressive with placeholders
- List virtualization with FlatList

### Backend
- API response: p50 < 100ms, p95 < 500ms
- ML inference: p50 < 5s, p95 < 30s
- Database queries: < 50ms
- File uploads: Chunked for large files

## 🧪 Testing Strategy

### Mobile App
- Unit tests: Component logic
- Integration tests: Navigation, API calls
- E2E tests: Critical user flows
- Manual testing: Multiple devices (iOS/Android)

### Backend
- Unit tests: Business logic, utilities
- Integration tests: API endpoints
- ML tests: Model accuracy benchmarks
- Load tests: Concurrent users, ML throughput

## 📦 Deployment

### Mobile App
**iOS:**
1. Build with Expo EAS
2. Upload to App Store Connect
3. TestFlight beta testing
4. Submit for review

**Android:**
1. Build APK/AAB with EAS
2. Upload to Google Play Console
3. Internal testing track
4. Submit for review

### Backend
**Staging:**
- Deploy to AWS ECS/Fargate
- RDS PostgreSQL
- ElastiCache Redis
- S3 for media storage

**Production:**
- Auto-scaling ECS tasks
- RDS read replicas
- CloudFront CDN
- Route 53 DNS

## 🐛 Known Issues

- [ ] Navigation type errors on some screens
- [ ] Image picker permissions on Android 13+
- [ ] Background upload on iOS needs work
- [ ] Websocket connection drops on network change

## 🗺️ Roadmap

### Phase 1: MVP (Completed ✅)
- Authentication and onboarding
- Daily challenges with ELO
- Media scanning and verification
- Labs crowdsourcing platform
- Basic profile and stats

### Phase 2: Creator Tools (In Progress 🔄)
- Badge issuance (C2PA)
- Badge analytics dashboard
- Digital twin creation
- Verification marketplace

### Phase 3: Education (Q2 2024)
- Lesson library
- Interactive tutorials
- Personalized learning paths
- Certification system

### Phase 4: Social (Q3 2024)
- Global leaderboard
- Friend challenges
- Share verification results
- Community forums

### Phase 5: Enterprise (Q4 2024)
- API access for businesses
- White-label solution
- Admin dashboard
- Advanced analytics

## 💡 Tips & Tricks

### Development
```bash
# Clear Expo cache
expo start -c

# Reset Metro bundler
npx react-native start --reset-cache

# Clean build
cd ios && pod install && cd ..
```

### Debugging
```bash
# iOS logs
npx react-native log-ios

# Android logs
npx react-native log-android

# Redux DevTools
# Install Reactotron for state inspection
```

### Production
```bash
# Environment variables
cp .env.example .env.production

# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 📚 Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

Proprietary - All rights reserved © 2024 ModGuardAI

## 🆘 Support

- **Email**: support@modguardai.com
- **Documentation**: https://docs.modguardai.com
- **Status Page**: https://status.modguardai.com

---

**Built with ❤️ by the ModGuardAI team**

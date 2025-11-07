# ModGuardAI Mobile App

A React Native mobile app for detecting deepfakes, verifying media authenticity, and earning money through crowdsourced labeling.

## Features

### Core Features (MVP)
- ✅ **Authentication** - Email/password and social login
- ✅ **Onboarding Tutorial** - Interactive deepfake detection tutorial
- ✅ **Home Dashboard** - User stats, quick actions, activity feed
- ✅ **Daily Challenges** - Gamified deepfake detection with ELO rating
- ✅ **Scan & Verify** - Upload media for AI-powered deepfake detection
- ✅ **ModGuard Labs** - Label media and earn money
- ✅ **Profile** - Stats, achievements, settings

### Coming Soon
- 🔄 Badge Analytics (C2PA authenticity badges)
- 🔄 Education Library (lessons and tutorials)
- 🔄 Biometric Authentication
- 🔄 Real-time notifications
- 🔄 Social features and leaderboards

## Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **API Client**: Axios
- **UI**: Custom components with styled-system
- **Media**: Expo Image Picker, Camera, AV

## Project Structure

```
mobile/
├── App.tsx                 # Entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── src/
    ├── api/              # API client and services
    │   ├── client.ts     # Axios instance with interceptors
    │   └── services.ts   # API service functions
    ├── components/       # Reusable components
    │   ├── common/       # Button, Card, Input, etc.
    │   ├── challenges/   # Challenge-specific components
    │   ├── scan/         # Scan-specific components
    │   ├── labs/         # Labs-specific components
    │   └── profile/      # Profile-specific components
    ├── config/           # App configuration
    │   └── constants.ts  # Colors, endpoints, etc.
    ├── navigation/       # Navigation setup
    │   └── AppNavigator.tsx
    ├── screens/          # Screen components
    │   ├── auth/         # Welcome, Login, Signup, Onboarding
    │   ├── main/         # Home, Challenges, Scan, Labs, Profile
    │   └── secondary/    # Settings, Details, etc.
    ├── store/            # Zustand state management
    │   ├── authStore.ts
    │   ├── challengeStore.ts
    │   ├── scanStore.ts
    │   └── labsStore.ts
    ├── types/            # TypeScript type definitions
    │   └── index.ts
    └── utils/            # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- iOS: macOS with Xcode
- Android: Android Studio with SDK
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Navigate to mobile directory:**
```bash
cd mobile
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
API_BASE_URL=http://localhost:8000
```

4. **Start the development server:**
```bash
npm start
# or
expo start
```

5. **Run on device/simulator:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Running the App

### Development
```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser (limited functionality)
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Backend Setup

The mobile app requires the FastAPI backend to be running. See `/backend/README.md` for setup instructions.

Quick start:
```bash
cd ../backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## Configuration

### API Endpoints
Edit `src/config/constants.ts` to change the API base URL:
```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:8000'  // Development
    : 'https://api.modguardai.com',  // Production
};
```

### Theme Colors
Customize the app theme in `src/config/constants.ts`:
```typescript
export const COLORS = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  background: '#0F172A',
  // ... more colors
};
```

## State Management

The app uses Zustand for state management with the following stores:

- **authStore**: Authentication, user data, login/logout
- **challengeStore**: Daily challenges, submissions, results
- **scanStore**: Media uploads, verification status
- **labsStore**: Labeling tasks, earnings, payouts

Example usage:
```typescript
import { useAuthStore } from '@store/authStore';

const MyComponent = () => {
  const { user, login, logout } = useAuthStore();
  // ... use store
};
```

## Key Features Implementation

### Authentication Flow
1. User sees Welcome screen
2. Complete interactive Onboarding tutorial
3. Sign up with email/password
4. Auto-login on subsequent launches (secure token storage)

### Challenges
1. Fetch daily challenges (20 clips)
2. User classifies each as real/fake
3. Submit answer with confidence
4. Receive instant feedback with explanation
5. ELO rating updates based on accuracy

### Scan & Verify
1. User uploads media (camera, gallery, URL)
2. File uploads with progress indicator
3. Backend processes with ML models
4. Poll for results every 2 seconds
5. Display verdict, confidence, and visual cues

### Labs (Crowdsourcing)
1. User views available labeling tasks
2. Select task and classify media
3. Provide reasoning for classification
4. Submit label
5. Earn money based on accuracy
6. Request payout when balance ≥ $10

## Building for Production

### iOS
```bash
expo build:ios
```

Requirements:
- Apple Developer account
- Provisioning profile
- App signing certificate

### Android
```bash
expo build:android
```

Requirements:
- Keystore file for signing
- Google Play Developer account

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

## Deployment

### App Store (iOS)
1. Build app with `expo build:ios` or EAS
2. Upload to App Store Connect
3. Submit for review

### Google Play (Android)
1. Build APK/AAB with `expo build:android` or EAS
2. Upload to Google Play Console
3. Submit for review

## Testing

### Manual Testing
- Test all authentication flows
- Test challenge submission and feedback
- Test media upload and verification
- Test Labs labeling and payout flow
- Test on multiple devices (iOS/Android)

### Key Test Cases
- [ ] User can sign up with email
- [ ] User can login and logout
- [ ] Onboarding tutorial works
- [ ] Daily challenges load and submit
- [ ] Media upload shows progress
- [ ] Verification results display correctly
- [ ] Labs tasks load and submit
- [ ] Earnings update after labeling
- [ ] Profile displays correct stats

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npx expo start -c  # Clear cache
```

**TypeScript errors:**
```bash
npm run type-check
```

**Navigation issues:**
```bash
rm -rf node_modules
npm install
```

**iOS simulator issues:**
```bash
xcrun simctl erase all
```

**Android emulator issues:**
```bash
adb kill-server
adb start-server
```

## Performance Optimization

- Images are optimized with proper sizing
- Lists use FlatList with proper keys
- Heavy computations avoided on main thread
- API calls debounced where appropriate
- Assets lazy-loaded when possible

## Security Considerations

- Authentication tokens stored in Expo SecureStore
- All API calls use HTTPS in production
- Sensitive data never logged
- File uploads validated on client and server
- JWT tokens refreshed before expiration

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

Proprietary - All rights reserved

## Support

For issues and questions:
- Email: support@modguardai.com
- GitHub Issues: [github.com/modguardai/mobile/issues](https://github.com/modguardai/mobile/issues)

## Roadmap

See `/ROADMAP.md` for detailed feature roadmap and timeline.

### Q1 2024
- ✅ MVP Launch (Auth, Challenges, Scan, Labs)
- 🔄 Badge Analytics for content creators
- 🔄 Education Library with lessons

### Q2 2024
- 🔄 Browser extension integration
- 🔄 Real-time video stream analysis
- 🔄 Social features and leaderboards

### Q3 2024
- 🔄 Multi-language support
- 🔄 Desktop app (Electron)
- 🔄 Enterprise API access

## Credits

Built with ❤️ by the ModGuardAI team

# 🤖 Using Claude in Cursor with ModGuardAI

## 📂 Recommended Folder Structure in Cursor

Open the **root folder** (`/home/user/ModGuardAI`) to access both mobile and backend:

```
ModGuardAI/          ← Open this folder in Cursor
├── mobile/          ← React Native app
├── backend/         ← FastAPI backend
└── docs/            ← Documentation
```

## 💡 **How to Use Claude in Cursor**

### **1. Open Cursor Chat**
- Press `Cmd/Ctrl + L` to open Claude chat
- Or click the chat icon in the sidebar

### **2. Give Claude Context**

Start your conversation with:
```
I'm working on the ModGuardAI mobile app - a React Native deepfake detection app.
The structure is:
- /mobile - React Native app with Expo
- /backend - FastAPI backend
- Tech stack: TypeScript, Zustand, React Navigation, FastAPI, PostgreSQL

Currently working on: [describe what you want to do]
```

## 🎯 **Useful Claude Commands in Cursor**

### **For Mobile App Development**

**1. Implementing New Features**
```
@mobile/src/screens/main/HomeScreen.tsx
Can you add a feature that shows recent scan history on the home screen?
Include:
- Fetch from API
- Loading state
- Error handling
- Update the store
```

**2. Fixing Bugs**
```
@mobile/src/store/authStore.ts
The login function isn't handling network errors properly.
Can you add proper error handling and retry logic?
```

**3. Creating New Components**
```
Create a new component at mobile/src/components/common/Modal.tsx
Requirements:
- Animated modal that slides up from bottom
- Backdrop with blur
- Close button
- TypeScript types
- Matches our design system (colors from constants.ts)
```

**4. Styling Improvements**
```
@mobile/src/screens/auth/WelcomeScreen.tsx
The welcome screen needs better animations. Add:
- Fade-in animation for logo
- Slide-up animation for buttons
- Smooth transitions
Use React Native Reanimated
```

### **For Backend Development**

**1. Creating API Endpoints**
```
Create authentication endpoints in backend/app/api/auth/
Need:
- POST /v1/auth/register - Create user with bcrypt password
- POST /v1/auth/login - Return JWT token
- POST /v1/auth/refresh - Refresh token
- Use the User model from app/models/user.py
```

**2. Database Operations**
```
@backend/app/models/user.py
Add a new Challenge model with:
- id, user_id, challenge_id, answer, correct, timestamp
- Relationship to User model
- Create the Pydantic schema too
```

**3. ML Integration**
```
Create video deepfake detector at backend/app/ml/video_detector.py
Requirements:
- Load OpenCV model
- Accept video file path
- Return confidence score and cues
- Handle errors gracefully
```

## 🔥 **Best Prompts for This Project**

### **Quick Fixes**
```
Fix the type error in @mobile/src/navigation/AppNavigator.tsx line 42
```

### **Feature Implementation**
```
I need to implement the verification results screen.
Files to reference:
- @mobile/src/types/index.ts (for VerificationResult type)
- @mobile/src/screens/main/ScanScreen.tsx (for context)
- @mobile/src/store/scanStore.ts (for state)

Create a new screen at mobile/src/screens/secondary/VerificationResultScreen.tsx
```

### **Connecting Frontend to Backend**
```
Connect the challenge submission flow:
1. Update @mobile/src/store/challengeStore.ts to call the API
2. Create the backend endpoint @backend/app/api/challenges/submit.py
3. Make sure error handling works on both ends
```

### **State Management**
```
@mobile/src/store/authStore.ts
Add biometric authentication:
- Check if device supports it
- Prompt user to enable
- Store preference
- Use on login
```

### **Testing & Debugging**
```
@mobile/src/components/common/Button.tsx
Add proper TypeScript tests for all button variants
Use React Native Testing Library
```

## 📋 **Suggested Development Tasks**

Copy these into Claude chat to get started:

### **Priority 1: Backend API Implementation**

```
Task: Implement authentication endpoints

Files to create:
1. backend/app/api/auth/router.py
2. backend/app/services/auth_service.py
3. backend/app/schemas/auth.py

Requirements:
- Use existing User model (@backend/app/models/user.py)
- JWT tokens with 7-day expiry
- Bcrypt password hashing
- Return user object + token on success
- Proper error handling

Reference the config at @backend/app/core/config.py
```

### **Priority 2: Connect Mobile to Backend**

```
Task: Update mobile app to use real API

Files to update:
- @mobile/src/store/authStore.ts (login, signup functions)
- @mobile/src/api/services.ts (verify endpoints work)
- @mobile/src/config/constants.ts (check API URL)

Test the authentication flow end-to-end:
1. User signs up
2. Token is stored
3. Token is used for API calls
4. Token refreshes before expiry
```

### **Priority 3: Challenges Implementation**

```
Task: Build daily challenges feature

Backend:
- Create Challenge model
- Seed sample challenges
- GET /v1/challenges/daily endpoint
- POST /v1/challenges/submit endpoint
- ELO rating calculation

Frontend:
- Update challengeStore to fetch from API
- Handle loading states
- Display real challenges
- Submit and show results
```

### **Priority 4: Media Verification**

```
Task: Implement scan & verify feature

Backend:
1. File upload endpoint
2. Store file in S3 (or local for testing)
3. Queue ML processing job
4. Status polling endpoint

Frontend:
1. Image picker integration
2. Upload progress
3. Status polling
4. Results display

Start with stub ML responses, then add real models
```

## 🎨 **UI/UX Improvements**

```
Improve the home screen design:
- Add skeleton loaders for stats
- Smooth card animations
- Pull-to-refresh
- Empty states
- Better iconography

Reference: @mobile/src/screens/main/HomeScreen.tsx
Keep existing functionality, enhance visuals
```

## 🐛 **Common Issues & Fixes**

### **TypeScript Errors**
```
Fix all TypeScript errors in the mobile app
Start with navigation types, then screen props
```

### **Import Path Issues**
```
Update all imports in @mobile/src to use path aliases
Example: import { Button } from '@components/common'
```

### **State Persistence**
```
Add AsyncStorage persistence to all Zustand stores
Should survive app restarts
```

## 🚀 **Quick Start Commands**

### **Run the App**
```
Help me create a npm script to run both iOS and Android simultaneously
Add to mobile/package.json
```

### **Testing Setup**
```
Setup Jest and React Native Testing Library
Create example test for @mobile/src/components/common/Button.tsx
```

### **Linting & Formatting**
```
Setup ESLint and Prettier for the mobile app
Create .eslintrc.js with React Native best practices
```

## 📝 **Documentation with Claude**

```
Generate JSDoc comments for all functions in:
@mobile/src/api/services.ts

Include:
- Function description
- @param types and descriptions
- @returns description
- @throws error conditions
- @example usage
```

## 🔒 **Security Review**

```
Review security in authentication flow:
1. @mobile/src/store/authStore.ts
2. @mobile/src/api/client.ts
3. @backend/app/core/config.py

Check for:
- Token storage security
- API key exposure
- Input validation
- SQL injection prevention
```

## 💾 **Database Setup**

```
Create Alembic migration for initial schema:
- User model
- Add indexes for email, username
- Set up relationships

Location: backend/alembic/versions/
Reference: @backend/app/models/user.py
```

## 🎯 **Working Session Template**

Start each session with:
```
Session Goal: [What you want to accomplish]

Context:
- Working on: [mobile/backend/both]
- Feature: [feature name]
- Current status: [what's done, what's not]

Files in scope:
@[file1]
@[file2]

Let's start with: [first task]
```

## 🤝 **Tips for Best Results**

1. **Use @ to reference files** - Claude can read and understand context
2. **Be specific** - "Add loading state to button" vs "Make it better"
3. **Reference existing code** - Point to similar implementations
4. **Ask for explanations** - "Why did you use Zustand instead of Redux?"
5. **Iterate** - Build features step-by-step, not all at once
6. **Request tests** - Ask for tests with each feature

## 🎓 **Learning Mode**

```
Explain how authentication works in this app:
1. User enters credentials on @mobile/src/screens/auth/LoginScreen.tsx
2. What happens in the store?
3. How is the token stored?
4. How does the API client use it?
5. What happens when it expires?

Walk me through the flow step-by-step
```

---

**Happy Coding with Claude in Cursor! 🚀**

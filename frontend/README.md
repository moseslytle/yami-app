# Frontend Development Setup

## Overview
The frontend is a React Native Expo app using:
- **Expo Router** for navigation
- **Tamagui** for UI components
- **React Query** for API state management
- **AsyncStorage** for token persistence

## Project Structure
```
frontend/Yami/
├── app/                    # Expo Router pages
│   ├── index.tsx          # Entry point (auth check & redirect)
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   └── collections.tsx    # Main app screen
├── lib/
│   └── auth.ts           # Authentication service
└── components/           # Reusable components
```

## Authentication Flow

### 1. App Launch (`index.tsx`)
- Checks if user has valid token in AsyncStorage
- Redirects to `/collections` if authenticated
- Redirects to `/login` if not authenticated

### 2. Login Screen (`login.tsx`)
- Email/password form with validation
- Calls Rails API `/api/v1/auth/login`
- Stores JWT token in AsyncStorage
- Redirects to `/collections` on success

### 3. Register Screen (`register.tsx`)
- Registration form with validation
- Calls Rails API `/api/v1/auth/register`
- Shows success message to check email
- Redirects to login screen

## API Integration

The `authService` in `lib/auth.ts` handles:
- Token storage/retrieval from AsyncStorage
- Login API calls
- Registration API calls
- Authentication status checking

### Backend Endpoints Used:
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/user/profile` - Get current user (optional)

## Running the Frontend

1. **Start the Rails backend first:**
   ```bash
   cd /home/moseslytle/Project-6-Ruby-No-Fails
   rails server -p 3000
   ```

2. **Start the Expo development server:**
   ```bash
   cd /home/moseslytle/Project-6-Ruby-No-Fails/frontend/Yami
   npm start
   # or
   expo start
   ```

3. **Test the app:**
   - Use Expo Go app on your phone
   - Or run in iOS/Android simulator
   - Or use web browser (expo start --web)

## Next Steps

### TODO Items in the Code:
1. **Error Handling**: Better error types and handling
2. **Loading States**: Improved loading indicators
3. **Form Validation**: More comprehensive validation
4. **Token Refresh**: Handle token expiration
5. **Biometric Auth**: Add fingerprint/face ID support
6. **OTP Integration**: Add OTP verification screens

### Features to Add:
- [ ] Email verification screen (for OTP codes)
- [ ] Password reset functionality
- [ ] 2FA setup screens (TOTP)
- [ ] User profile management
- [ ] Push notifications setup
- [ ] Offline support

## Testing

### Manual Testing Checklist:
- [ ] App opens and redirects to login
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Registration with valid data works
- [ ] Registration with invalid data shows errors
- [ ] Token persists between app restarts
- [ ] Logout clears token and redirects to login

### Backend Integration Testing:
Make sure your Rails backend is running and accessible at `http://localhost:3000`

## Notes

- The TypeScript errors you see are normal during development
- The app uses Tamagui's design tokens (like `$color`, `$background`)
- All API calls use the standard fetch API
- Authentication state is managed through the authService singleton

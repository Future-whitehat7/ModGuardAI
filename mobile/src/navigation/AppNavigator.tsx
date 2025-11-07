import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '@store/authStore';
import { COLORS } from '@config/constants';

// Import screens (we'll create these next)
import WelcomeScreen from '@screens/auth/WelcomeScreen';
import OnboardingScreen from '@screens/auth/OnboardingScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import SignupScreen from '@screens/auth/SignupScreen';

import HomeScreen from '@screens/main/HomeScreen';
import ChallengesScreen from '@screens/main/ChallengesScreen';
import ScanScreen from '@screens/main/ScanScreen';
import LabsScreen from '@screens/main/LabsScreen';
import ProfileScreen from '@screens/main/ProfileScreen';

import type { RootStackParamList, MainTabParamList } from '@types/index';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab icons (using emoji for simplicity - can replace with proper icons)
const getTabBarIcon = (route: string, focused: boolean) => {
  const icons: { [key: string]: string } = {
    Home: focused ? '🏠' : '🏘️',
    Challenges: focused ? '🎯' : '⭕',
    Scan: focused ? '📸' : '📷',
    Labs: focused ? '💰' : '💵',
    Profile: focused ? '👤' : '👥',
  };
  return icons[route] || '•';
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ focused }) => {
          const icon = getTabBarIcon(route.name, focused);
          return <span style={{ fontSize: 24 }}>{icon}</span>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Challenges" component={ChallengesScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Labs" component={LabsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    // Show loading screen while checking auth
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            {/* Add other screens here like VerificationResult, LessonDetail, etc. */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

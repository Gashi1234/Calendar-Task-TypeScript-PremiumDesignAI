// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';

export type RootStackParamList = { Login: undefined; LoggedIn: undefined };
export type BottomTabParamList = { Calendar: undefined; Profile: undefined };

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabBarBackground(): JSX.Element {
  return (
    <LinearGradient
      colors={['#f36c21', '#ffd500']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    />
  );
}

// Build the options object first, then cast — this avoids false errors on certain versions
const tabScreenOptions = {
  tabBarStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
  },
  // Some @react-navigation/bottom-tabs type versions don't declare this prop even though it works.
  // Casting the whole object is the cleanest way to silence the bogus error.
  tabBarBackground: () => <TabBarBackground />,
  tabBarActiveTintColor: 'white',
  tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
  headerStyle: { backgroundColor: '#f36c21' },
  headerTintColor: 'white',
  headerTitleStyle: { fontWeight: 'bold' },
} as unknown as BottomTabNavigationOptions;

function BottomTabs(): JSX.Element {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }: { color?: string; size?: number }) => (
            <FontAwesome5 name="calendar-alt" size={size ?? 20} color={color ?? '#fff'} />
          ),
          headerTitle: 'My Calendar',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }: { color?: string; size?: number }) => (
            <FontAwesome5 name="user" size={size ?? 20} color={color ?? '#fff'} />
          ),
          headerTitle: 'My Profile',
          headerStyle: { backgroundColor: '#d71a28' },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animationTypeForReplace: 'pop' }}
        />
        <Stack.Screen name="LoggedIn" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

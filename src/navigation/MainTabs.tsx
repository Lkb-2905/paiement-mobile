import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Ticket, ScanLine, LayoutDashboard } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { TicketsScreen } from '../screens/TicketsScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#141C2F',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#E8EEFB',
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: 'Accueil',
        tabBarIcon: ({ color, size }) => (
          <Home color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Tickets"
      component={TicketsScreen}
      options={{
        title: 'Billets',
        tabBarIcon: ({ color, size }) => (
          <Ticket color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Scanner"
      component={ScannerScreen}
      options={{
        title: 'Scanner',
        tabBarIcon: ({ color, size }) => (
          <ScanLine color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Admin"
      component={AdminDashboardScreen}
      options={{
        title: 'Admin',
        tabBarIcon: ({ color, size }) => (
          <LayoutDashboard color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

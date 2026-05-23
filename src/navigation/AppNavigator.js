import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryRecordsScreen from '../screens/CategoryRecordsScreen';
import AddEditRecordScreen from '../screens/AddEditRecordScreen';
import RecordDetailScreen from '../screens/RecordDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#1E88E5' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Dashboard" component={HomeScreen} options={{ title: 'AdyayAvat' }} />
      <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
      <Stack.Screen name="AddEditRecord" component={AddEditRecordScreen} />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="CategoryRecords" component={CategoryRecordsScreen} />
      <Stack.Screen name="AddEditRecord" component={AddEditRecordScreen} />
      <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings & Sync' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#1E88E5',
          tabBarInactiveTintColor: '#9E9E9E',
          tabBarStyle: { paddingBottom: 4, height: 58 },
          tabBarSafeAreaInsets: { bottom: 0 },
          tabBarIcon: ({ color, size }) => {
            const icons = { Home: 'view-dashboard', Categories: 'shape', Settings: 'cog' };
            return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Categories" component={CategoriesStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

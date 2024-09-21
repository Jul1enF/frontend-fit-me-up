import { Platform } from 'react-native';

import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import user from './reducers/user'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useEffect, useRef, useState } from 'react';

import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/home/HomeScreen'
import RecipesScreen from './screens/recipes/RecipesScreen'
import ExercicesScreen from './screens/exercices/ExercicesScreen'
import EventsScreen from './screens/events/EventsScreen'
import BookmarksScreen from './screens/bookmarks/BookmarksScreen';


const store = configureStore({
  reducer: { user },
})



// Paramétrage navigation Tab

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Recettes" component={RecipesScreen} />
      <Tab.Screen name="Exercices" component={ExercicesScreen} />
      <Tab.Screen name="Événements" component={EventsScreen} />
      <Tab.Screen name="Favoris" component={BookmarksScreen} />
    </Tab.Navigator>
  )
}




export default function App() {


  // Paramétrage des notifications reçues

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });


  // Hooks pour l'écoute et l'enregistrement des notifications

  const [notification, setNotification] = useState('');

  const notificationListener = useRef('');
  const responseListener = useRef('');



  useEffect(() => {


    // Écoute et enregistrement des notifactions. Démontage des listeners

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])


  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}



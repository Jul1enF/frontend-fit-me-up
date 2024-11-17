import { Stack } from "expo-router";

import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { PersistGate } from 'redux-persist/integration/react'

import user from '../reducers/user'
import testArticle from '../reducers/testArticle'
import articles from '../reducers/articles'
import cronsNotifications from "../reducers/cronsNotifications";

import { LinearGradient } from "expo-linear-gradient";

import { useEffect, useRef, useState } from 'react';


// import { KeyboardProvider } from "react-native-keyboard-controller";


import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

import * as Notifications from 'expo-notifications';



const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const reducers = combineReducers({ user, testArticle, articles, cronsNotifications })


const store = configureStore({
    reducer: persistReducer(persistConfig, reducers),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

const persistor = persistStore(store)





export default function RootLayout() {

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
    console.log("NOTIFICATION DATA:", notification)

    const notificationListener = useRef('');
    const responseListener = useRef('');


    // Paramétrage des custom fonts
    const [loaded, error] = useFonts({
        'HandoTrial-Black': require('../assets/fonts/HandoTrial-Black.otf'),
        'HandoTrial-Bold': require('../assets/fonts/HandoTrial-Bold.otf'),
        'HandoTrial-Regular': require('../assets/fonts/HandoTrial-Regular.otf'),
    });

    useEffect(() => {
        // Custom Fonts
        if (loaded || error) {
            SplashScreen.hideAsync();
        }

        // Écoute et enregistrement des notifactions. Démontage des listeners

        notificationListener.current = Notifications.addNotificationReceivedListener(notif => {
            setNotification(notif);
        });

        console.log("NOTIFICATION LISTENER :",notificationListener.current)

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("RESPONSE :", response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [loaded, error])


    // Ne pas charger la page si les polices n'ont pas été chargées
    if (!loaded && !error) {
        return null;
    }




    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                {/* <KeyboardProvider> */}
                <Stack >
                    <Stack.Screen name="index" options={{
                        headerShown: false,
                        title: "Connexion",
                    }} />
                    <Stack.Screen name="(tabs)" options={{
                        headerShown: false,
                    }} />
                    <Stack.Screen name="legal-index" options={{
                        headerShown: true,
                        title: "CGU / Mentions Légales",
                        headerTintColor: 'white',
                        headerBackground: () => (
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={{ height: 150 }}
                            ></LinearGradient>
                        ),
                    }} />
                    <Stack.Screen name="contact-index" options={{
                        headerShown: true,
                        title: "Contact",
                        headerTintColor: 'white',
                        headerBackground: () => (
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={{ height: 150 }}
                            ></LinearGradient>
                        ),
                    }} />
                </Stack>
                {/* </KeyboardProvider> */}
            </PersistGate>
        </Provider>
    )
}
import { Stack } from "expo-router";

import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import user from '../reducers/user'

import { useEffect, useRef, useState } from 'react';

import * as Notifications from 'expo-notifications';

const store = configureStore({
    reducer: { user },
})

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
            <Stack >
                <Stack.Screen name="index" options={{
                    headerShown: false,
                }} />
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                }} />
            </Stack>
        </Provider>
    )
}
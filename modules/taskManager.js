
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo'

import { searchObjectKey } from './searchObjectKey';
import { AppState } from 'react-native';
const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

const BACKGROUND_NOTIFICATION_TASK = 'remote-notification';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
    console.log("DATA", data)

    const token = searchObjectKey(data, "userbddtoken")

    console.log("TOKEN :", token)

    let connected = false
    const dateFirstTryToConnect = new Date()
    console.log("DATE", dateFirstTryToConnect)

    // const fetchNotif = async ()=>{
    //     const response = await fetch(`${url}/notifications/get-notifications/${token}`)

    //         const result = await response.json()

    //         console.log("RESULT :", result)

    //         if (result.notifications.length > 0) {
    //             for (let notification of result.notifications) {
    //                 Notifications.scheduleNotificationAsync({
    //                     content: {
    //                         title: notification.title,
    //                         body: notification.message,
    //                         sound: "default",
    //                         priority: 'high',
    //                         channelId: 'boost-up',
    //                     },
    //                     trigger: null,
    //                 });
    //             }
    //         }
    // }

    // fetchNotif()

    // setTimeout(()=>{
    //     fetchNotif()
    // }, 5000)

    Notifications.scheduleNotificationAsync({
        content: {
            title: "test data message",
            body: "background notification / task manager",
            sound: "default",
            priority: 'high',
            ttl: 604800,
            autoDismiss : true,
            interruptionLevel : "timeSensitive",
        },
        trigger: null,
    });

    
    console.log("APP STATE", AppState.currentState)
    return
    do {
        const state = await NetInfo.fetch()
        if (state.isConnected) {
            connected = true
            console.log("Connected !!!")
            // const response = await fetch(`${url}/notifications/get-notifications/${token}`)
            // const result = await response.json()

            // console.log("RESULT :", result)

      
            const result = {notifications : [{title : "test background task", message : "test taskmanager"}]}

            console.log("RESULT :", result)

            if (result.notifications.length > 0) {
                for (let notification of result.notifications) {

                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: notification.title,
                            body: notification.message,
                            sound: "default",
                            priority: 'high',
                            ttl: 604800,
                            autoDismiss : true,
                            interruptionLevel : "timeSensitive",
                        },
                        trigger: null,
                    });
                }
            }
        } else {
            const actualTime = new Date()
            const connectionTime = (actualTime - dateFirstTryToConnect) / 1000

            if (connectionTime > 600) {
                break;
            }
        }
    } while (connected !== true)

        if (error){console.log("ERROR", error)}
    // Delete empty notification because of a bug in the expo-notifications library

    // Notifications.getPresentedNotificationsAsync().then(notifications => {
    //     notifications.forEach(notification => {
    //         if (notification.request.content.body == null && notification.request.content.title == null) {
    //             Notifications.dismissNotificationAsync(notification.request.identifier);
    //         }
    //     });
    // });


});

const bgNotifTask = async () => {
    const response = await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    return response
}

module.exports = { bgNotifTask }
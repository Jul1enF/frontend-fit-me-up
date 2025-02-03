
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo'

const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

const BACKGROUND_NOTIFICATION_TASK = 'remote-notification';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
    console.log("DATA", data)

    let token

    if (data.UIApplicationLaunchOptionsRemoteNotificationKey) {
        token = data.UIApplicationLaunchOptionsRemoteNotificationKey.body.token
    }
    if (data.body) {
        token = data.body.token
    }

    let connected = false
    const dateFirstTryToConnect = new Date()

    do {
        const state = await NetInfo.fetch()
        if (state.isConnected) {
            connected = true
            console.log("Connected !!!")
            const response = await fetch(`${url}/notifications/get-notifications/${token}`)

            const result = await response.json()

            console.log("RESULT :", result)

            if (result.notifications.length > 0) {
                for (let notification of result.notifications) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: notification.title,
                            body: notification.message,
                            sound: "default",
                            priority: 'high',
                            channelId: 'boost-up',
                        },
                        trigger: null,
                    });
                }
            }
        } else {
            const actualTime = new Date()
            const connectionTime = (actualTime - dateFirstTryToConnect) / 1000

            if (connectionTime > 600){
                break ;
            }
        }
    } while (connected !== true)

});

const bgNotifTask = async () => {
    const response = await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    return response
}

module.exports = { bgNotifTask }
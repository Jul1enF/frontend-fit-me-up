
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

const BACKGROUND_NOTIFICATION_TASK = 'remote-notification';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
    console.log("DATA", data)

    let token

    if (data.UIApplicationLaunchOptionsRemoteNotificationKey){
        token = data.UIApplicationLaunchOptionsRemoteNotificationKey.body.token
    }
    if (data.body){
        token = data.body.token
    }

    const fetchAndDisplayNotifications = async () => {
        const response = await fetch(`${url}/notifications/get-notifications/${token}`)

        const result = await response.json()
    
        if (result.notifications.length > 0){
            for (let notification of result.notifications){
                Notifications.scheduleNotificationAsync({
                    content: {
                      title: notification.title,
                      body: notification.message,
                    },
                    trigger: null,
                  });
            }
        }
    }

    // Délai en cas de coupure de réseau quand le portable se branche au wifi après s'être rallumé
    setTimeout(()=> {
        fetchAndDisplayNotifications()
    }, 7000)

});

const bgNotifTask = async () => {
    const response = await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    return response
}

module.exports = { bgNotifTask }
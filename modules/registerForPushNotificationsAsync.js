import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { Platform } from 'react-native';





async function registerForPushNotificationsAsync(userPushToken, userToken, newNotifications) {

  const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('boost-up', {
      name: 'boost-up',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    let toggleNewNotifications = false

    if (!newNotifications) {
      const response = await fetch(`${url}/userModifications/toggleNewNotifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwtToken: userToken,
        })
      })
      const data = await response.json()

      if (data.result) {
        toggleNewNotifications = true
      }
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      if (userPushToken) {
        const response = await fetch(`${url}/userModifications/changePushToken`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jwtToken: userToken,
            push_token: "",
          })
        })
        const data = await response.json()

        if (!data.result || data.err && data.err.name == "JsonWebTokenError") {
          return false
        }
        else {
          return { change: "", toggleNewNotifications }
        }
      }
      else { return { toggleNewNotifications } }
    }

    const projectId =
      Constants.expoConfig?.extra?.eas.projectId ?? Constants.easConfig?.projectId;

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;


      if (!userPushToken || userPushToken !== pushTokenString) {

        const response = await fetch(`${url}/userModifications/changePushToken`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jwtToken: userToken,
            push_token: pushTokenString,
          })
        })
        const data = await response.json()

        if (!data.result || data.err && data.err.name == "JsonWebTokenError") {
          return false
        }
        else {
          return { change: pushTokenString, toggleNewNotifications }
        }
      }
      return { toggleNewNotifications };

    } catch (e) {
      console.log(e);
    }
  }
  // Si sur emulator
  else {
    return true
  }
}

module.exports = { registerForPushNotificationsAsync }
import {View, Text, TextInput, Button, Platform} from 'react-native'
import { useState, useEffect, useRef } from 'react';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';



export default function BookmarksScreen ({navigation}) {
    const [firstname, setFirstname]= useState('')

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const [expoPushToken, setExpoPushToken] = useState('');

    // Paramétrage des notifications reçues

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });


    // Fonction pour récupérer le token de notification de l'utilisateur

    async function registerForPushNotificationsAsync() {

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('fit-me-up', {
            name: 'fit-me-up',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
            console.log(existingStatus)
          let finalStatus = existingStatus;

          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if (finalStatus !== 'granted') {
            // Rajouter route pour supprimer push token si il y a en un d'enregistré dans reducer / bdd.
            return;
          }

          const projectId =
            Constants.expoConfig?.extra?.eas.projectId ?? Constants.easConfig?.projectId;
     
          try {
            const pushTokenString = (
              await Notifications.getExpoPushTokenAsync({
                projectId,
              })
            ).data;
            console.log(pushTokenString);
            setExpoPushToken(pushTokenString);
          } catch (e) {
            console.log(e);
          }
        } 
      }


    // Hooks pour l'écoute et l'enregistrement des notifications

    const [notification, setNotification] = useState('');

    console.log("Notification Ju :",notification)

    const notificationListener = useRef('');
    const responseListener = useRef('');


    
    useEffect(()=>{
      registerForPushNotificationsAsync()

      // Écoute, enregistrement et démontage des notifications

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
    },[])


    const [answer2, setAnswer2]=useState('')
    const registerClick = async()=>{
        const response = await fetch(`${url}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname, push_token : expoPushToken })
            })
        const data = await response.json()
        console.log(data)
        const dataString = JSON.stringify(data)

      setAnswer2(dataString)
    }

    const [postMessage, setPostMessage]=useState('')
    const [answer, setAnswer]=useState('')
    console.log("answer : ", answer)

    const postClick=async()=>{
      const response = await fetch(`${url}/users/postNotif`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postMessage})
          })
      const data = await response.json()
      const dataString = JSON.stringify(data)

      setAnswer(dataString)
  }


    return (
        <View>
        <Text> HELLO IT'S BOOKMARKKS</Text>
        <TextInput style={{width : 200, backgroundColor: "red"}} onChangeText={(e)=>setFirstname(e)} value={firstname}></TextInput>
        <Button type='text' onPress={()=>registerClick()} title="REGISTER"></Button>
        <TextInput style={{width : 200, backgroundColor: "green"}} onChangeText={(e)=>setPostMessage(e)} value={postMessage}></TextInput>
        <Button type='text' onPress={()=>postClick()} title="POST"></Button>
        <Text>Answer POST : {answer}</Text>
        <Text>Answer REGISTER : {answer2}</Text>
        </View>
    )
}
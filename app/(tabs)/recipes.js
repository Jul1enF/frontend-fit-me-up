import { View, Text, StyleSheet } from 'react-native'
import { registerForPushNotificationsAsync } from "../../modules/registerForPushNotificationsAsync"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

import { router } from 'expo-router'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../../reducers/user'



export default function Recipes() {

    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()

    console.log(user)

    // Fonction pour gérer les potentiels changement de push token
    
    const checkPushTokenChanges = async () => {
 
        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.push('/')
        }
        if (pushTokenInfos.change || pushTokenInfos.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }

    useFocusEffect(useCallback(()=>{
        checkPushTokenChanges()
    },[user]))

    return (
        <View style={styles.body}>
            <Text> HELLO IT'S RECIPES</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body : {
        backgroundColor : "black",
        flex : 1,
    }

})
import { View, Text } from 'react-native'
import { registerForPushNotificationsAsync } from "../../modules/registerForPushNotificationsAsync"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../../reducers/user'



export default function RecipesScreen({ navigation }) {

    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()

    console.log(user)

    // Fonction pour gérer les potentiels changement de push token
    
    const checkPushTokenChanges = async () => {
 
        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token)

        console.log(pushTokenInfos)

        if (!pushTokenInfos) {
            dispatch(logout())
            navigation.navigate('Home')
        }
        if (pushTokenInfos.change || pushTokenInfos.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }

    useFocusEffect(useCallback(()=>{
        checkPushTokenChanges()
    },[user]))

    return (
        <View>
            <Text> HELLO IT'S RECIPES</Text>
        </View>
    )
}
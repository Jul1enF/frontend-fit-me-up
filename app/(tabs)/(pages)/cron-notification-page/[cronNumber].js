import { Text, View, StyleSheet} from 'react-native'

import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


export default function CronNotificationPage () {

const { cronNumber } = useLocalSearchParams()
const cronsNotifications = useSelector((state)=>state.cronsNotifications.value)


const [cronNotif, setCronNotif] = useState("")
console.log("cronNotif :",cronNotif)

// useEffect pour récupérer la cron notification passée en param

useEffect(()=>{
    cronsNotifications.map(e=> {
        if (e.cron_notification_number == cronNumber){
            setCronNotif(e)
        }
    })
},[])

    return (
        <View style={styles.body}>

        </View>
    )
}


const styles = StyleSheet.create({
    body : {
        flex : 1,
        backgroundColor : "black",
    }
})
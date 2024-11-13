import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"

import { RPH, RPW } from "../modules/dimensions"


export default function CronNotification(props) {

    let month = props.month.join(", ")

    month = month.replace("12", "Décembre").replace("11", "Novembre").replace("10", "Octobre").replace("9", "Septembre").replace("8", "Août").replace("7", "Juillet").replace("6", "Juin").replace("5", "Mai").replace("4", "Avril").replace("3", "Mars").replace("2", "Février").replace("1", "Janvier")

    month = month + ","

    let day = props.day.join(", ")

    let hour = props.hour[0]

    let minute = props.minute[0].toString()

    if (minute.length == 1){ minute = "0" + minute}

    let monthDesignation = ""

   if (props.month.length > 1){
        monthDesignation = "des mois de"
    }
    else {
        monthDesignation = "du mois de"
    }

    return (
        <LinearGradient
            colors={['#9dcb00', '#045400']}
            locations={[0.05, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientContainer}
        >
            <View style={styles.mainContainer}>
                <View style={styles.row1}>
                    <Text style={styles.text}>
                        Notif programmée n° {props.number}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text}>Statut : </Text>
                        <Text style={[styles.text, props.is_active ? { color: "rgba(0,182,14,0.8)" } : { color: "rgba(219,0,43,0.8)" }]}>
                            {props.is_active ? "Activée" : "Désactivée"}
                        </Text>
                    </View>
                </View>
                <View style={styles.row2}>
                    <Text style={styles.text2}>Titre  : </Text>
                    <Text style={styles.text3}>
                        {props.notification_title}
                    </Text>
                </View>
                <View style={styles.row2}>
                <Text style={styles.text2}>Message : </Text>
                    <Text style={styles.text3}>
                        {props.notification_message}
                    </Text>
                </View>
                <View style={styles.row2}>
                <Text style={styles.text2}>Envoyée : </Text>
                    <Text style={styles.text3}>
                        À {hour}:{minute} tous les {day} {monthDesignation} {month} tous les ans.
                    </Text>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={()=>router.push(`/cron-notification-page/${props._id}`)}>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.btnGradientContainer}
                    >
                        <Text style={styles.text4}>Modifier</Text>
                    </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    gradientContainer: {
        marginBottom: 20,
        borderRadius: 10,
        width: RPW(96)
    },
    mainContainer: {
        margin: 2,
        backgroundColor: "black",
        borderRadius: 10,
        paddingTop: 14,
        paddingBottom: 10,
        paddingLeft: RPW(3),
        paddingRight: RPW(3),
    },
    row1: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        paddingBottom: 10,
        marginBottom: 14,
    },
    text: {
        color: "#e0e0e0",
        fontSize: RPW(4.1),
        fontWeight: "700"
    },
    text2 : {
        color: "#e0e0e0",
        fontSize: RPW(4),
        fontWeight: "600"
    },
    row2: {
        marginBottom: 6,
        flexDirection: "row",
        width : "100%",

    },
    text3: {
        color: "#e0e0e0",
        fontSize: RPW(4),
        fontWeight: "400",
        flexWrap : "wrap",
        flexShrink : 1,
    },
    btnContainer: {
        width: "100%",
        alignItems: "center"
    },
    btnTouchable : {
        width: RPW(29),
        height: RPW(9),
        marginTop : 10
    },
    btnGradientContainer : {
        flex : 1,
        borderRadius : 10,
        alignItems : "center",
        justifyContent : "center"
    },
    text4 : {
        color: "#e0e0e0",
        fontSize: RPW(4.8),
        fontWeight: "600",
    },
})
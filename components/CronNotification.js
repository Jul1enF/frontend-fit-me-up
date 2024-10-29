import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"

import { RPH, RPW } from "../modules/dimensions"


export default function CronNotification(props) {

    let month = props.month.replace("12", "Décembre").replace("11", "Novembre").replace("10", "Octobre").replace("9", "Septembre").replace("8", "Août").replace("7", "Juillet").replace("6", "Juin").replace("5", "Mai").replace("4", "Avril").replace("3", "Mars").replace("2", "Février").replace("1", "Janvier").replace(",", ", ")

    month = month + "."

    let monthDesignation = ""

    if (!props.month || props.month === "*"){
        monthDesignation = "tous les mois."
        month = ""
    }
    else if (props.month.includes(",")){
        monthDesignation = "des mois de"
    }
    else {
        monthDesignation = "du mois de"
    }

    return (
        <LinearGradient
            colors={['#7700a4', '#0a0081']}
            locations={[0.05, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientContainer}
        >
            <View style={styles.mainContainer}>
                <View style={styles.row1}>
                    <Text style={styles.text}>
                        Notif programmée n° {props.cron_notification_number}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text}>Statut : </Text>
                        <Text style={[styles.text, props.is_active ? { color: "#00b60e" } : { color: "rgba(219,0,43,1)" }]}>
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
                        À {props.hour}:{props.minute.length==1 && "0"}{props.minute} tous les {props.day} {monthDesignation} {month}
                    </Text>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={()=>router.push(`/cron-notification-page/${props.cron_notification_number}`)}>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.btnGradientContainer}
                    >
                        <Text style={styles.text2}>Modifier</Text>
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
        width : RPW(26),
        height : RPW(8),
        marginTop : 8
    },
    btnGradientContainer : {
        flex : 1,
        borderRadius : 5,
        alignItems : "center",
        justifyContent : "center"
    }
})
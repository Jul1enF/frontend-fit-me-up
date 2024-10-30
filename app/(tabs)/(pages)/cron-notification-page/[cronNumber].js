import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'

import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RPH, RPW } from '../../../../modules/dimensions'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

import Days from '../../../../components/Days'
import Months from '../../../../components/Months'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export default function CronNotificationPage() {

    const { cronNumber } = useLocalSearchParams()
    const cronsNotifications = useSelector((state) => state.cronsNotifications.value)

    const [error, setError] = useState("")

    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [hour, setHour] = useState("")
    const [minute, setMinute] = useState("")
    const [isActive, setIsActive] = useState(false)
    const [daysSelected, setDaysSelected] = useState([])
    console.log("days selected :", daysSelected)

    const [monthsSelected, setMonthsSelected] = useState([])
    console.log("monts selected :", monthsSelected)

    const [originalCronNotif, setOriginalCronNotif] = useState("")
    console.log("cronNotif :", originalCronNotif)


    // Fonction et useEffect pour récupérer la cron notification passée en param et enregistrer les régagles de la cron notif dans des états

    const settleStates = (cron) => {
        if (cron.day.includes(",")) {
            setDaysSelected(cron.day.split(','))
        }
        else {
            setDaysSelected([cron.day])
        }

        if (cron.month.includes(",")) {
            setMonthsSelected(cron.month.split(','))
        }
        else {
            setMonthsSelected([cron.month])
        }

        setTitle(cron.notification_title)
        setMessage(cron.notification_message)
        setHour(cron.hour)
        setMinute(cron.minute.length == 1 ? "0" + cron.minute : cron.minute)
        setIsActive(cron.is_active)
    }

    useEffect(() => {
        let cronToDisplay

        cronsNotifications.map(e => {
            if (e.cron_notification_number == cronNumber) {
                setOriginalCronNotif(e)
                cronToDisplay = e
            }
        })

        settleStates(cronToDisplay)

    }, [])




    // Composant et IDF pour afficher les jours à sélectionner

    const addOneDay = (number) => {
        setDaysSelected([...daysSelected, number])
    }

    const removeOneDay = (number) => {
        setDaysSelected(daysSelected.filter(e => e !== number))
    }

    let days = []

    for (let i = 0; i < 31; i++) {
        days.push(<Days key={i} i={i} isSelected={daysSelected.includes(`${i + 1}`) ? true : false} addOneDay={addOneDay} removeOneDay={removeOneDay} />)
    }




    // Composant et IDF pour afficher les mois à sélectionner

    const addOneMonth = (number) => {
        setMonthsSelected([...monthsSelected, number])
    }

    const removeOneMonth = (number) => {
        setMonthsSelected(monthsSelected.filter(e => e !== number))
    }

    let months = []

    for (let i = 0; i < 12; i++) {
        months.push(<Months key={i} i={i} isSelected={monthsSelected.includes(`${i + 1}`) ? true : false} addOneMonth={addOneMonth} removeOneMonth={removeOneMonth} />)
    }



    // Fonction appelée en cliquant sur Enregistrer

    const [registerEnabled, setRegisterEnabled]= useState(true)

    const registerPress = () => {
        if (!title || !message ){
            setError("Erreur : Titre ou Message manquant !")
            return
        }
    }



    return (
        <View style={styles.body}>
            <LinearGradient
                colors={['#7700a4', '#0a0081']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.navigate('/notifications')}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPH(2.5)} style={styles.icon} />
                    <Text style={styles.headerText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerSection2} onPress={() => settleStates(originalCronNotif)}>
                    <Text style={styles.headerText} >Réglages d'origine</Text>
                    <FontAwesome5 name={"undo"} size={RPH(2.9)} color="white" style={styles.icon2} />
                </TouchableOpacity>
            </LinearGradient>


            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}>
                <Text style={styles.text1}>
                    Titre de la notification :
                </Text>
                <TextInput style={styles.input}
                    onChangeText={(value) => {
                        setTitle(value)
                        setError('')
                    }}
                    value={title}
                    placeholder="Titre"
                    placeholderTextColor='grey'
                    maxLength={28}>
                </TextInput>
                <Text style={styles.text1}>
                    Message de la notification :
                </Text>
                <TextInput style={[styles.input, { height: RPW(20), justifyContent: "flex-start" }]}
                    onChangeText={(value) => {
                        setError("")
                        setMessage(value)
                    }}
                    value={message}
                    placeholder="Message"
                    placeholderTextColor='grey'
                    maxLength={144}
                    multiline
                    blurOnSubmit
                >
                </TextInput>


                <Text style={styles.text1}>
                    Statut :
                </Text>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={[styles.btn, !isActive && { backgroundColor: "black" }]}
                        onPress={() => setIsActive(!isActive)} >
                        <Text style={styles.btnText}>{isActive ? "Activée" : "Désactivée"}</Text>
                    </TouchableOpacity>
                </LinearGradient>


                <Text style={styles.text1}>
                    Heure d'envoi :
                </Text>
                <View style={styles.timeInputsContainer}>
                    <TextInput style={styles.input2}
                        onChangeText={(value) => {
                            setError("")
                            setHour(value)
                        }}
                        value={hour}
                        placeholder="HH"
                        placeholderTextColor='grey'>
                    </TextInput>
                    <Text style={styles.text2}>H</Text>
                    <TextInput style={styles.input2}
                        onChangeText={(value) => {
                            setError("")
                            setMinute(value)
                        }}
                        value={minute}
                        placeholder="MM"
                        placeholderTextColor='grey'>
                    </TextInput>
                </View>


                <Text style={styles.text3}>
                    Jours d'envoi :
                </Text>
                <View style={styles.daysItemContainer}>
                    {days}
                </View>

                <Text style={styles.text3}>
                    Mois d'envoi :
                </Text>
                <View style={styles.monthsItemContainer}>
                    {months}
                </View>


                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.gradientBtn, error && {marginBottom : 10}]}
                >
                    <TouchableOpacity style={[styles.btn]}
                        onPress={() => registerPress()} >
                        <Text style={styles.btnText}>Enregistrer</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <Text style={[styles.text1, !error && {display : "none"}]}>
                    {error}
                </Text>

            </ScrollView>
        </View>

    )
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        height: RPH(6),
        width: RPW(100),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerSection: {
        width: RPW(45),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        marginRight: RPW(3)
    },
    headerText: {
        color: "white",
        fontWeight: "500",
        fontSize: RPH(2.3)
    },
    headerSection2: {
        width: RPW(45),
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    icon2: {
        marginLeft: RPW(3)
    },
    contentBody: {
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        paddingTop: RPW(4),
        paddingBottom: RPW(3),
        alignItems: "center",
    },
    text1: {
        color: "white",
        fontSize: RPW(5.3),
        fontWeight: "600",
        marginBottom: 13
    },
    input: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 5,
        marginBottom: 25,
        paddingLeft: 8,
        fontSize: RPW(5.3),
        paddingBottom: 7,
        paddingTop: 7,
    },
    gradientBtn: {
        height: RPW(13),
        width: RPW(38),
        borderRadius: 15,
        marginRight: RPW(1),
        marginLeft: RPW(1),
        marginTop: RPW(1),
        marginBottom: 30,
    },
    btn: {
        flex: 1,
        backgroundColor: "transparent",
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    btnText: {
        color: "white",
        fontSize: RPW(5),
        fontWeight: "800"
    },
    timeInputsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    input2: {
        width: RPW(10),
        backgroundColor: "white",
        textAlign: "center",
        borderRadius: 5,
        fontSize: RPW(5.3),
        paddingBottom: 6,
        paddingTop: 6,
    },
    text2: {
        color: "white",
        fontSize: RPW(5.3),
        fontWeight: "600",
        marginLeft: RPW(2),
        marginRight: RPW(2),
    },
    text3: {
        color: "white",
        fontSize: RPW(5.3),
        fontWeight: "600",
        marginBottom: 20
    },
    daysItemContainer: {
        width: RPW(84),
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginBottom: 25,
    },
    monthsItemContainer: {
        width: RPW(94),
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginBottom: 40,
    }
})
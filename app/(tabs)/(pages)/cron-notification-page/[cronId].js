import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'

import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { modifyCronNotification, addOneCronNotification, deleteCronNotification } from '../../../../reducers/cronsNotifications'

import { RPH, RPW } from '../../../../modules/dimensions'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

import Days from '../../../../components/Days'
import Months from '../../../../components/Months'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Modal from "react-native-modal"

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';


const statusHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0



export default function CronNotificationPage() {

    const { cronId } = useLocalSearchParams()
    const cronsNotifications = useSelector((state) => state.cronsNotifications.value)

    const user = useSelector((state) => state.user.value)

    const [error, setError] = useState("")
    const [modalVisible, setModalVisible] = useState(false)

    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [hour, setHour] = useState("")
    const [minute, setMinute] = useState("")
    const [isActive, setIsActive] = useState(false)
    const [daysSelected, setDaysSelected] = useState([])
    const [monthsSelected, setMonthsSelected] = useState([])

    const [originalCronNotif, setOriginalCronNotif] = useState("")


    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const dispatch = useDispatch()


    // Si la page est affichée pour modifier une cron notification, fonction et useEffect pour récupérer l'id passée en param et enregistrer les réglages de la cron notif à modifier au bon format dans des états

    const settleStates = (cron) => {
        if (!cron) { return }

        setDaysSelected(cron.day)

        setMonthsSelected(cron.month)

        setTitle(cron.notification_title)
        setMessage(cron.notification_message)
        setHour(cron.hour[0].toString())
        setMinute(cron.minute[0] < 10 ? "0" + cron.minute[0].toString() : cron.minute[0].toString())
        setIsActive(cron.is_active)
    }

    useEffect(() => {
        // À n'executer que pour modifier une cron notification, pas pour en créer une nouvelle
        if (cronId !== "new") {
            let cronToDisplay

            cronsNotifications.map(e => {
                if (e._id == cronId) {
                    setOriginalCronNotif(e)
                    cronToDisplay = e
                }
            })

            settleStates(cronToDisplay)
        }
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
        days.push(<Days key={i} i={i} isSelected={daysSelected.includes(i + 1) ? true : false} addOneDay={addOneDay} removeOneDay={removeOneDay} />)
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
        months.push(<Months key={i} i={i} isSelected={monthsSelected.includes(i + 1) ? true : false} addOneMonth={addOneMonth} removeOneMonth={removeOneMonth} />)
    }





    // Fonction appelée en cliquant sur Enregistrer

    const registerRef = useRef(true)

    const registerPress = async () => {

        // Vérification ques les inputs sont bien renseignés ou au bon format
        if (!title || !message) {
            setError("Erreur : Titre ou Message manquant !")
            setTimeout(() => setError(''), 3000)
            return
        }
        if (!hour || !minute) {
            setError("Erreur : Horaire incomplet !")
            setTimeout(() => setError(''), 3000)
            return
        }

        if (hour < 0 || hour > 23 || isNaN(hour) || minute < 0 || minute > 59 || isNaN(minute)) {
            setError("Erreur : format de l'heure incorrect !")
            setTimeout(() => setError(''), 3000)
            return
        }
        if (daysSelected.length == 0) {
            setError("Erreur : aucun jour sélectionné !")
            setTimeout(() => setError(''), 3000)
            return
        }
        if (monthsSelected.length == 0) {
            setError("Erreur : aucun mois sélectionné !")
            setTimeout(() => setError(''), 3000)
            return
        }

        // Vérification qu'il n'y a pas de jours sélectionné pour des mois où ils n'existent pas

        if (daysSelected.includes(31) && monthsSelected.some(e => e == 2 || e == 4 || e == 6 || e == 9 || e == 11)) {
            setError("Erreur : certain mois sélectionnés n'ont pas 31 jours !")
            setTimeout(() => setError(''), 5000)
            return
        }

        if (monthsSelected.includes(2) && daysSelected.some(e => e == 29 || e == 30)) {
            setError("Erreur : certain jours sélectionnés n'existent pas en Février")
            setTimeout(() => setError(''), 5000)
            return
        }

        // Mise au bon format des jours, des mois et de l'heure

        let day = daysSelected.sort((a, b) => a - b)

        let month = monthsSelected.sort((a, b) => a - b)

        const finalHour = [Number(hour)]
        const finalMinute = [Number(minute)]

        if (!registerRef.current) { return }
        registerRef.current = false


        // Si enregistrement d'une nouvelle cron notif

        if (cronId == "new") {
            const response = await fetch(`${url}/notifications/register-cron-notification`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notification_title: title,
                    notification_message: message,
                    is_active: isActive,
                    minute: finalMinute,
                    hour: finalHour,
                    day,
                    month,
                    jwtToken: user.token,
                })
            })

            const data = await response.json()

            if (!data.result && data.error) {
                setError(data.error)
                setTimeout(() => setError(''), 6000)
                registerRef.current = true
            }
            else if (!data.result) {
                setError("Erreur lors de la suppression. Merci de réessayer ou de contacter le webmaster.")
                setTimeout(() => setError(''), 6000)
                registerRef.current = true
            }
            else {
                dispatch(addOneCronNotification(data.cronSavedAgain))

                router.back('/notifications')
                registerRef.current = true
            }
        }

        // Si modification d'une cron notif

        else {
            const response = await fetch(`${url}/notifications/modify-cron-notification`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notification_title: title,
                    notification_message: message,
                    is_active: isActive,
                    minute: finalMinute,
                    hour: finalHour,
                    day,
                    month,
                    _id: originalCronNotif._id,
                    cron_id: originalCronNotif.cron_id,
                    jwtToken: user.token,
                })
            })

            const data = await response.json()

            if (!data.result && data.error) {
                setError(data.error)
                setTimeout(() => setError(''), 6000)
                registerRef.current = true
            }
            else if (!data.result) {
                setError("Erreur lors de la suppression. Merci de réessayer ou de contacter le webmaster.")
                setTimeout(() => setError(''), 6000)
                registerRef.current = true
            }
            else {
                dispatch(modifyCronNotification(data.cronSaved))

                router.back('/notifications')
                registerRef.current = true
            }
        }
    }



    // Fonction appelée en cliquant sur Supprimer (deuxième fois)

    const pressRef = useRef(true)

    const deletePress = async () => {

        if (pressRef.current == false) { return }
        pressRef.current = false

        const response = await fetch(`${url}/notifications/delete-cron-notification/${originalCronNotif.cron_id}/${user.token}`, { method: 'DELETE' })

        const data = await response.json()

        if (!data.result && data.error) {
            setError(data.error)
            setTimeout(() => setError(''), 5000)
            pressRef.current = true
        }
        else if (!data.result) {
            setError("Erreur lors de la suppression. Merci de réessayer ou de contacter le webmaster.")
            setTimeout(() => setError(''), 5000)
            pressRef.current = true
        }
        else {
            dispatch(deleteCronNotification(originalCronNotif._id))

            router.back('/notifications')
            pressRef.current = true
        }
    }



    // Fonction appelée en cliquant sur "réglages d'origine"

    const cancelPress = () => {
        if (cronId !== "new") { settleStates(originalCronNotif) }
        else {
            setTitle("")
            setMessage("")
            setHour("")
            setMinute("")
            setIsActive(false)
            setDaysSelected([])
            setMonthsSelected([])
        }
    }




    // Composant pour le sticky header de la scroll view

    function CronHeader() {
        return (
            <LinearGradient
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.back('/notifications')}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPH(2.5)} style={styles.icon} />
                    <Text style={styles.headerText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerSection2} onPress={() => cancelPress()}>
                    <Text style={styles.headerText} >Réglages d'origine</Text>
                    <FontAwesome5 name={"undo"} size={RPH(2.9)} color="white" style={styles.icon2} />
                </TouchableOpacity>
            </LinearGradient>
        )
    }








    return (<>
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.contentBody]}
            bottomOffset={RPH(3)}
            stickyHeaderIndices={[0]}
        >


            {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={RPH(14.5)} style={styles.body}>
            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody} stickyHeaderIndices={[0]} > */}

            <CronHeader />

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
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientBtn}
            >
                <TouchableOpacity style={[styles.btn, !isActive && { backgroundColor: "#f9fff4" }]}
                    onPress={() => setIsActive(!isActive)} >
                    <Text style={[styles.btnText, !isActive && { color: "#19290a" }]}>{isActive ? "Activée" : "Désactivée"}</Text>
                </TouchableOpacity>
            </LinearGradient>


            <Text style={styles.text1}>
                Heure d'envoi :
            </Text>
            <View style={styles.timeInputsContainer}>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setError("")
                        typeof value == "string" ? setHour(value) : setHour(value.toString())
                    }}
                    value={hour}
                    placeholder="HH"
                    maxLength={2}
                    placeholderTextColor='grey'>
                </TextInput>
                <Text style={styles.text2}>H</Text>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setError("")
                        typeof value == "string" ? setMinute(value) : setMinute(value.toString())
                    }}
                    value={minute}
                    maxLength={2}
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

            <Text style={[styles.error, !error && { display: "none" }]}>
                {error}
            </Text>

            <View style={[styles.row, cronId == "new" && { justifyContent: "center" }]}>
                {cronId !== "new" && <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.gradientBtn]}
                >
                    <TouchableOpacity style={[styles.btn]}
                        onPress={() => setModalVisible(true)} >
                        <Text style={styles.btnText}>Supprimer</Text>
                    </TouchableOpacity>
                </LinearGradient>}

                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.gradientBtn]}
                >
                    <TouchableOpacity style={[styles.btn]}
                        onPress={() => registerPress()} >
                        <Text style={styles.btnText}>Enregistrer</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>



            <Modal
                isVisible={modalVisible}
                style={styles.modal}
                backdropColor="rgba(0,0,0,0.9)"
                animationIn="slideInDown"
                animationOut="slideOutUp"
                statusBarTranslucent={true}
                onBackButtonPress={() => setModalVisible(!modalVisible)}
                onBackdropPress={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.modalBody}>
                    <Text style={styles.modalText}>Êtes vous sûr de vouloir supprimer cette notification programmée ?</Text>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientLine2}
                    >
                    </LinearGradient>
                    <View style={styles.btnContainer2}>
                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModalVisible(false)}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.modalText2}>Annuler</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => deletePress()}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.modalText2}>Supprimer</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* </ScrollView>
         </KeyboardAvoidingView> */}

        </KeyboardAwareScrollView>

    </>)

}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#f9fff4",
    },
    header: {
        height: RPH(6),
        width: RPW(100),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        marginBottom: 20,
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
        paddingBottom: RPW(3),
        alignItems: "center",
        backgroundColor: "#f9fff4",
    },
    text1: {
        color: "#19290a",
        fontSize: RPW(5.3),
        fontWeight: "600",
        marginBottom: 13
    },
    input: {
        width: "100%",
        backgroundColor: "#2e6017",
        color: "white",
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
        width: RPW(12),
        backgroundColor: "#2e6017",
        color: "white",
        textAlign: "center",
        borderRadius: 5,
        fontSize: RPW(5.3),
        paddingBottom: 6,
        paddingTop: 6,
    },
    text2: {
        color: "#19290a",
        fontSize: RPW(5.3),
        fontWeight: "600",
        marginLeft: RPW(2),
        marginRight: RPW(2),
    },
    text3: {
        color: "#19290a",
        fontSize: RPW(5.3),
        fontWeight: "600",
        marginBottom: 20
    },
    daysItemContainer: {
        width: RPW(86),
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
    },
    error: {
        color: "red",
        fontSize: RPW(4.5),
        fontWeight: "600",
        marginBottom: 13
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%"
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPH(45),
        width: RPW(96),
        borderRadius: 10,
        paddingTop: RPH(5),
        paddingBottom: RPH(5),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#e6eedd",
        position: "absolute",
        bottom: RPH(10),
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalText: {
        color: "#19290a",
        fontSize: RPW(6),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        lineHeight: RPH(4)
    },
    gradientLine2: {
        width: "90%",
        height: 4,
        marginTop: -6,
    },
    btnContainer2: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    btnTouchable: {
        width: RPW(37),
        height: RPW(13),
    },
    btnGradientContainer: {
        flex: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    modalText2: {
        color: "white",
        fontSize: RPW(5.4),
        fontWeight: "700",
        marginRight: RPW(2),
    },
})
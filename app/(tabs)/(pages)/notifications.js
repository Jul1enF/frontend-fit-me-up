import { Text, View, StyleSheet, FlatList, RefreshControl, TextInput, Keyboard, TouchableOpacity, StatusBar, Platform } from 'react-native'
import CronNotification from '../../../components/CronNotification'
import { LinearGradient } from 'expo-linear-gradient'
import Modal from "react-native-modal"
import { router } from 'expo-router'

import { useFocusEffect } from 'expo-router'
import { useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCronsNotifications } from '../../../reducers/cronsNotifications'

import { RPH, RPW } from '../../../modules/dimensions'

const statusHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0



export default function Notifications() {

    const dispatch = useDispatch()
    const user = useSelector((state)=>state.user.value)
    const cronsNotifications = useSelector((state) => state.cronsNotifications.value)

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    // États pour les inputs et la modal pour poster une notification

    const [title, setTitle] = useState("")
    const [message, setMessage] = useState('')
    const [modalVisible, setModalVisible] = useState(false)


    // Fonction pour télécharger la liste des notifications programmées depuis la bdd

    const loadCronsNotifications = async () => {
        const response = await fetch(`${url}/notifications/get-crons-notifications`)
        const data = await response.json()
 
        if (data.result) {
            dispatch(addCronsNotifications(data.cronsNotifications))
        }
    }

    // useFocusEffect pour loader les crons notifs à l'arrivée sur la page

    useFocusEffect(useCallback(() => {
        loadCronsNotifications()
    }, []))




    // Fonction appelée en cliquant sur le premier Poster et afficher la modal ou l'erreur

    const [error, setError]=useState("")

    const firstPostPress = async () => {
        await Keyboard.dismiss()
        if (!title || !message){
            setError('Erreur : titre ou message manquant.')
            return
        }
        else{
            setModalVisible(true)
        }
    }


    // Fonction appelée en cliquant sur Poster (définitif) et État pour la désactiver en attendant la validation

    const postRef = useRef(true)

    const finalPostPress = async () => {

        if (!postRef.current){ return }
        postRef.current = false

        const response = await fetch(`${url}/notifications/send-notification`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                message,
                jwtToken : user.token,
            })
        })
        const data = await response.json()

        if (data.result){
            setModalVisible(false)
            setTitle('')
            setMessage('')

            postRef.current = true

            setError("Message posté !")
            setTimeout(() => setError(''), 2000)
        }
        else if (data.error){
            setModalVisible(false)
            
            postRef.current = true

            setError(data.error)
            setTimeout(() => setError(''), 3000)
        }
        else{
            setModalVisible(false)
            
            postRef.current = true

            setError("Erreur lors de l'envoi de la notification. Contactez le webmaster")
            setTimeout(() => setError(''), 3000)
        }

    }




    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["white"]} progressBackgroundColor={"black"} tintColor={"white"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadCronsNotifications() 
    }} />


    // Composants au dessus de la FLatlist

    const topComponents = (
            <View style={styles.topContainer}>
                <Text style={styles.title}>Poster une notification :</Text>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
                <TextInput style={styles.input}
                    onChangeText={(value) => {
                        setTitle(value)
                        if (value !== ""){setError("")}
                    }}
                    value={title}
                    placeholder="Titre"
                    placeholderTextColor='grey'
                    maxLength={28}>
                </TextInput>
                <TextInput style={[styles.input, { height: RPW(20), justifyContent: "flex-start" }]}
                    onChangeText={(value) =>{
                        if (value !== ""){setError("")}
                        setMessage(value)}}
                    value={message}
                    placeholder="Message"
                    placeholderTextColor='grey'
                    maxLength={144}
                    multiline
                    blurOnSubmit
                    textAlignVertical='top'
                >
                </TextInput>
                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => firstPostPress()}>
                        <LinearGradient
                            colors={['#7700a4', '#0a0081']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.btnGradientContainer}
                        >
                            <Text style={styles.text1}>Poster</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[{marginTop : 10},styles.modalText2, !error && {display : "none"}]}>{error}</Text>
                </View>
                
                <Text style={styles.title}>Notifications programmées :</Text>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine3}
                >
                </LinearGradient>
                



                <Modal
                    isVisible={modalVisible}
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.7)"
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                    onBackButtonPress={() => setModalVisible(!modalVisible)}
                    onBackdropPress={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>Êtes vous sûr de vouloir poster cette notification ?</Text>
                        <LinearGradient
                            colors={['#7700a4', '#0a0081']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientLine2}
                        >
                        </LinearGradient>
                        <View style={styles.row}>
                            <Text style={styles.modalText2}>
                                Titre :
                            </Text>
                            <Text style={styles.modalText3}>
                                {title}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.modalText2}>
                                Message :
                            </Text>
                            <Text style={styles.modalText3}>
                                {message}
                            </Text>
                        </View>
                        <View style={styles.btnContainer2}>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModalVisible(false)}>
                                <LinearGradient
                                    colors={['#7700a4', '#0a0081']}
                                    locations={[0.05, 1]}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                    style={styles.btnGradientContainer}
                                >
                                    <Text style={styles.modalText2}>Annuler</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => finalPostPress()}>
                                <LinearGradient
                                    colors={['#7700a4', '#0a0081']}
                                    locations={[0.05, 1]}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                    style={styles.btnGradientContainer}
                                >
                                    <Text style={styles.modalText2}>Poster</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>

    )




    // Composants / Bouton à afficher en bas de la flatlist

    const bottomComponents =  <View style={styles.btnContainer3}>
    <TouchableOpacity style={styles.btnTouchable2} activeOpacity={0.8} onPress={() => router.push("/cron-notification-page/new")}>
        <LinearGradient
            colors={['#7700a4', '#0a0081']}
            locations={[0.05, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.btnGradientContainer2}
        >
            <Text style={styles.text2}>Ajouter une notification</Text>
            <Text style={styles.text2}>programmée</Text>
        </LinearGradient>
    </TouchableOpacity>
</View>



    return (

        <FlatList
            data={cronsNotifications}
            ListHeaderComponent={topComponents}
            ListFooterComponent={bottomComponents}
            refreshControl={refreshComponent}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => {
                if(cronsNotifications.length>0) {return <CronNotification {...item} number={index + 1} />}
            }}
            contentContainerStyle={{ alignItems: 'center' }}
            style={{ flex: 1, backgroundColor: "black" }}
        />
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "black",
    },
    topContainer: {
        width: RPW(100),
        backgroundColor: "black",
        paddingLeft: RPW(3),
        paddingRight: RPW(3),
        paddingTop: RPW(6),
        marginBottom: 9,
        justifyContent : "flex-start"
    },
    title: {
        color: "#e0e0e0",
        fontSize: 24,
        fontWeight: "450",
        marginBottom: 9,
    },
    gradientLine: {
        width: "90%",
        height: 4,
        marginBottom: 15,
    },
    input: {
        backgroundColor: "white",
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 8,
        fontSize: 20,
        paddingBottom: 7,
        paddingTop: 7,
    },
    btnContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 30,
    },
    btnTouchable: {
        width: RPW(30),
        height: RPW(10),
    },
    btnGradientContainer: {
        flex: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    text1: {
        color: "#e0e0e0",
        fontSize: RPW(5.4),
        fontWeight: "600",
    },
    gradientLine3: {
        width: "90%",
        height: 4,
        marginBottom: 20,
    },
    btnContainer3: {
        width: "100%",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 28,
    },
    btnTouchable2: {
        width: RPW(65),
        height: RPW(18),
    },
    btnGradientContainer2: {
        flex: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
   
    },
    text2: {
        color: "#e0e0e0",
        fontSize: RPW(5.4),
        fontWeight: "600",
        textAlign : "center"
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPH(60),
        width: RPW(96),
        borderRadius: 10,
        paddingTop: RPH(4),
        paddingBottom: RPH(4),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#222222",
        position: "absolute",
        top: RPH(14) - statusHeight,
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalText: {
        color: "#e0e0e0",
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
        marginTop : -6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%"
    },
    modalText2: {
        color: "#e0e0e0",
        fontSize: RPW(5),
        fontWeight: "700",
        marginRight: RPW(2),
    },
    modalText3: {
        color: "#e0e0e0",
        fontSize: RPW(4.5),
        fontWeight: "400",
        flexWrap: "wrap",
        flexShrink: 1
    },
    btnContainer2: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    
})
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RPH, RPW } from "../modules/dimensions"
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef } from "react";

import Modal from "react-native-modal"

import moment from 'moment/min/moment-with-locales'
moment.locale('fr')

export default function User(props) {

    const [modal1Visible, setModal1Visible] = useState(false)
    const [modal2Visible, setModal2Visible] = useState(false)
    const [error, setError] = useState("")

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS




    // Fonction appelée en cliquant pour changer le statut autorisé

    const allowedRef = useRef(true)

    const allowedPress = async () => {
        if (!allowedRef.current) { return }
        allowedRef.current = false

        const response = await fetch(`${url}/userModifications/toggle-allowed`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jwtToken: props.jwtToken,
                _id: props._id
            })
        })

        const data = await response.json()

        if (!data.result && data.error) {
            setError(data.error)
            setTimeout(() => setError(''), 6000)
            allowedRef.current = true
        }
        else if (!data.result) {
            setError("Erreur lors de la suppression. Merci de réessayer ou de contacter le webmaster.")
            setTimeout(() => setError(''), 6000)
            allowedRef.current = true
        }
        else {
            props.toggleAllowed(props._id)

            setModal1Visible(false)
            allowedRef.current = true
        }
    }




    // Fonction appelée en cliquant pour changer le statut d'admin

    const adminRef = useRef(true)

    const adminPress = async () => {
        if (!adminRef.current) { return }
        adminRef.current = false

        const response = await fetch(`${url}/userModifications/toggle-admin`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jwtToken: props.jwtToken,
                _id: props._id
            })
        })

        const data = await response.json()

        if (!data.result && data.error) {
            setError(data.error)
            setTimeout(() => setError(''), 6000)
            adminRef.current = true
        }
        else if (!data.result) {
            setError("Erreur lors de la suppression. Merci de réessayer ou de contacter le webmaster.")
            setTimeout(() => setError(''), 6000)
            adminRef.current = true
        }
        else {
            props.toggleAdmin(props._id)

            setModal2Visible(false)
            adminRef.current = true
        }
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
                    <View style={styles.sectionContainer}>
                        <View style={styles.underline}>
                            <Text style={styles.text1}>Nom :</Text>
                        </View>
                        <Text style={styles.text2}>{props.name}</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        <View style={styles.underline}>
                            <Text style={styles.text1}>Prénom :</Text>
                        </View>
                        <Text style={styles.text2}>{props.firstname}</Text>
                    </View>
                </View>
                <View style={styles.row1}>
                    <View style={styles.sectionContainer}>
                        <View style={styles.underline}>
                            <Text style={styles.text1}>Coach :</Text>
                        </View>
                        <Text style={styles.text2}>{props.coach}</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        <View style={styles.underline}>
                            <Text style={styles.text1}>Inscription :</Text>
                        </View>
                        <Text style={styles.text2}>{moment(props.inscription_date).format("DD/MM/YYYY")}</Text>
                    </View>
                </View>
                <View style={styles.row1}>
                    <View style={styles.sectionContainer}>
                        <View style={styles.underline}>
                            <Text style={styles.text1}>Email :</Text>
                        </View>
                        <Text style={styles.text2}>{props.email}</Text>
                    </View>
                </View>
                <View style={styles.row2}>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn}
                    >
                        <TouchableOpacity style={[styles.btn, !props.is_allowed && { backgroundColor: "black" }]}
                            onPress={() => setModal1Visible(true)} >
                            <Text style={styles.text1}>{props.is_allowed ? "Autorisé" : "Bloqué"}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn}
                    >
                        <TouchableOpacity style={[styles.btn, !props.is_admin && { backgroundColor: "black" }]}
                            onPress={() => setModal2Visible(true)} >
                            <Text style={styles.text1}>{props.is_admin ? "Admin" : "Client"}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>



                <Modal
                    isVisible={modal1Visible}
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.9)"
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                    onBackButtonPress={() => setModal1Visible(!modal1Visible)}
                    onBackdropPress={() => setModal1Visible(!modal1Visible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.text3}>Êtes vous sûr de vouloir {props.is_allowed ? "bloquer" : "autoriser"} l'utilisateur {props.email} ?</Text>
                        <LinearGradient
                            colors={['#9dcb00', '#045400']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientLine2}
                        >
                        </LinearGradient>
                        <View style={styles.row2}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.gradientBtn}
                            >
                                <TouchableOpacity style={[styles.btn]}
                                    onPress={() => setModal1Visible(false)} >
                                    <Text style={styles.text1}>Annuler</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.gradientBtn}
                            >
                                <TouchableOpacity style={[styles.btn]}
                                    onPress={() => allowedPress()} >
                                    <Text style={styles.text1}>{props.is_allowed ? "Bloquer" : "Autoriser"}</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                        </View>
                        <Text style={[styles.text1, !error && { display: "none" }]}>{error}</Text>
                    </View>
                </Modal>





                <Modal
                    isVisible={modal2Visible}
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.9)"
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                    onBackButtonPress={() => setModal1Visible(!modal2Visible)}
                    onBackdropPress={() => setModal1Visible(!modal2Visible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.text3}>Êtes vous sûr de vouloir {props.is_admin ? "retirer" : "ajouter"} le statut d'admin à l'utilisateur {props.email} ?</Text>
                        <LinearGradient
                            colors={['#9dcb00', '#045400']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientLine2}
                        >
                        </LinearGradient>
                        <View style={styles.row2}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.gradientBtn}
                            >
                                <TouchableOpacity style={[styles.btn]}
                                    onPress={() => setModal2Visible(false)} >
                                    <Text style={styles.text1}>Annuler</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.gradientBtn}
                            >
                                <TouchableOpacity style={[styles.btn]}
                                    onPress={() => adminPress()} >
                                    <Text style={styles.text1}>{props.is_admin ? "Retirer" : "Ajouter"}</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                        </View>
                        <Text style={[styles.text1, !error && { display: "none" }]}>{error}</Text>
                    </View>
                </Modal>



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
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    sectionContainer: {
        width: RPW(48),
        flexDirection: "row",
        alignItems: "center",
    },
    underline: {
        borderBottomWidth: 1,
        // borderBottomColor: "#e0e0e0",
        marginRight: RPW(3)
    },
    text1: {
        color: "#e0e0e0",
        fontSize: RPW(3.8),
        fontWeight: "700"
    },
    text2: {
        color: "#e0e0e0",
        fontSize: RPW(3.5),
        fontWeight: "500"
    },
    row2: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: 8,
    },
    gradientBtn: {
        height: RPW(9),
        width: RPW(26),
        borderRadius: 10,
        marginTop: RPW(3),
    },
    btn: {
        flex: 1,
        backgroundColor: "transparent",
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPH(30),
        width: RPW(90),
        borderRadius: 10,
        paddingTop: RPH(5),
        paddingBottom: RPH(5),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#222222",
        position: "absolute",
        bottom: RPH(35),
        justifyContent: "space-between",
        alignItems: "center"
    },
    text3: {
        color: "#e0e0e0",
        fontSize: RPW(4.2),
        fontWeight: "700",
        flexWrap: "wrap",
        flexShrink: 1,
        textAlign: "center",
        lineHeight: RPW(6)
    },
    gradientLine2: {
        width: "90%",
        height: 4,
    },


})
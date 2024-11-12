import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native'
import Signup from '../components/Signup'
import Signin from '../components/Signin';
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Modal2 from "react-native-modal"

import { useState, useCallback } from 'react';
import { router, useFocusEffect, Link } from 'expo-router'
import { useSelector } from 'react-redux'
import { RPH, RPW } from '../modules/dimensions'




export default function Index() {

    // Si user connecté, redirection vers 1ère page Tab

    const user = useSelector((state) => state.user.value)

    useFocusEffect(useCallback(() => {
        user.firstname && router.push('/home')

    }, []))



    // États pour voir ou non modals
    const [modal1Visible, setModal1VIsible] = useState(false)
    const [modal2Visible, setModal2VIsible] = useState(false)



    // Fonction envoyée en IDF à Signup et Signin pour fermer modal après login

    const closeModal1 = () => {
        setModal1VIsible(false)
    }

    const closeModal2 = () => {
        setModal2VIsible(false)
    }


    return (
        <View style={styles.body} >
            <StatusBar translucent={true} barStyle="light" />
            <LinearGradient style={styles.header}
                // colors={['#ffd500', '#fd8600']}
                //  colors={['#97002e', '#450150']}
                colors={['#7700a4', '#0a0081']}
                locations={[0, 0.9]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                <Text style={styles.title}>
                    FIT ME UP
                </Text>
            </LinearGradient>
            <View style={styles.headerLigne}></View>

            <View style={styles.mainContainer}>
                <View style={styles.signContainer}>
                    <LinearGradient
                        style={styles.gradientContainer}
                        colors={['#7700a4', '#0a0081']}
                        locations={[0, 0.9]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}>
                        <TouchableOpacity style={styles.iconContainer}
                            onPress={() => setModal1VIsible(true)}
                        >
                            <FontAwesome5 name="user-edit" style={styles.icon} size={RPH(4.5)} />
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn}
                    >
                        <TouchableOpacity style={styles.btn} onPress={() => setModal1VIsible(true)}>
                            <Text style={styles.signText}>Se connecter</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                <View style={styles.signContainer}>
                    <LinearGradient
                        style={styles.gradientContainer}
                        colors={['#7700a4', '#0a0081']}
                        locations={[0, 0.9]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}>
                        <TouchableOpacity style={styles.iconContainer}
                            onPress={() => setModal2VIsible(true)}
                        >
                            <FontAwesome5 name="user-plus" style={styles.icon} size={RPH(4.5)} />
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn}
                    >
                        <TouchableOpacity style={styles.btn} onPress={() => setModal2VIsible(true)}>
                            <Text style={styles.signText}>S'inscrire</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                <Link href="/home" style={styles.link}>Accéder à l'application sans se connecter (contenu limité)</Link>


            </View>


            <Modal2
                isVisible={modal1Visible}
                style={styles.modal}
                backdropColor="rgba(0,0,0,0.7)"
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackButtonPress={() => setModal1VIsible(!modal1Visible)}
                onBackdropPress={() => setModal1VIsible(!modal1Visible)}
            >
                <Signin closeModal1={closeModal1} />
            </Modal2>


                <Modal
                    visible={modal2Visible}
                    onRequestClose={() => setModal2VIsible(false)}
                    animationType='slide'
                    transparent={true}
                >
                    <Signup closeModal2={closeModal2} />
                </Modal>



                <View style={styles.legalContainer1}>
                <TouchableOpacity style={styles.legalBth} onPress={()=>router.push('/contact-index')}>
                    <Text style={styles.legalText}>
                        Contact
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legalBth} onPress={()=>router.push('/legal-index')}>
                    <Text style={styles.legalText}>
                        CGU
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        height: RPH(14),
        paddingTop: RPH(4),
        justifyContent: "center",
        alignItems: "center",
    },
    headerLigne: {
        borderBottomColor: "#878787",
        borderBottomWidth: RPH(0.1)
    },
    title: {
        fontSize: RPH(4.5),
        color: "white",
        letterSpacing: 2.5,
        fontWeight: "600",
    },
    mainContainer: {
        width: "100%",
        height: RPH(86),
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "black",
        paddingBottom: RPH(0),
        paddingTop: RPH(1)
    },
    signContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        height: RPH(21.5),
    },
    gradientContainer: {
        width: RPH(13),
        height: RPH(13),
        borderRadius: RPH(7),
    },
    iconContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: RPH(1.5),
    },
    icon: {
        color: "white",
    },
    gradientBtn: {
        width: RPH(26),
        height: RPH(6.5),
        borderRadius: 10,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "black",
        margin: 2,
        borderRadius: 10,
    },
    signText: {
        color: "white",
        fontSize: RPH(2.5),
        fontWeight: "500",
        letterSpacing: 1,
    },
    link : {
        color: "white",
        fontSize: RPW(3.5),
        fontWeight: "500",
        letterSpacing: 1,
        textAlign: "center",
        width:"100%",
        paddingLeft : RPW(2),
        paddingRight : RPW(2),
    },
    modal : {
      flex :1
    },
    legalContainer1: {
        position : "absolute",
        bottom : 10,
        paddingRight : RPW(8),
        paddingLeft : RPW(8),
        justifyContent : "space-between",
        flexDirection: "row",
        width: "100%",
    },
    legalBth: {
        borderBottomColor: "rgba(255,255,255,0.25)",
        borderBottomWidth: 1,
        paddingBottom : 2,
    },
    legalText: {
        color: "rgba(255,255,255,0.25)",
        fontSize : 12,
    },

})
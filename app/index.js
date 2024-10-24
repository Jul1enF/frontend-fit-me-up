import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native'
import Signup from '../components/Signup'
import Signin from '../components/Signin';
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router'
import { useSelector } from 'react-redux'


const screenHeight = Platform.OS === 'android' ? Dimensions.get('window').height + StatusBar.currentHeight : Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};



export default function Index() {


    // Si user connecté, redirection vers 1ère page Tab

    const user = useSelector((state) => state.user.value)

    useFocusEffect(useCallback(() => {
        user.firstname && router.push('/recipes')

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
            <StatusBar translucent={true} barStyle="light"/>
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
            </View>

            <Modal
                visible={modal1Visible}
                onRequestClose={() => setModal1VIsible(false)}
                style={styles.modal}
                animationType='slide'
                transparent={true}
            >
                <Signin closeModal1={closeModal1} />
            </Modal>
            <Modal
                visible={modal2Visible}
                onRequestClose={() => setModal2VIsible(false)}
                style={styles.modal}
                animationType='slide'
                transparent={true}
            >
                <Signup closeModal2={closeModal2} />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
       flex : 1,
        backgroundColor: "black"
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
    }

})
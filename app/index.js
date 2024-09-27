import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Signup from '../components/Signup'

import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
WebBrowser.maybeCompleteAuthSession()

import { useState, useEffect } from 'react';
import { router } from 'expo-router'
import { useSelector } from 'react-redux'


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};



export default function Index() {


    // Si user connecté avec push token, redirection vers 1ère page Tab

    const user = useSelector((state) => state.user.value)

    useEffect(() => {
        user.firstname && router.push('/recipes')

    }, [])



    // États pour voir ou non modals
    const [modal1Visible, setModal1VIsible] = useState(false)
    const [modal2Visible, setModal2VIsible] = useState(false)



    // Fonction envoyée en IDF à Signup et Signin pour fermer modal après login

    const closeModal1 = () => {
        setModal1VIsible(false)
    }

   

    return (
        <View style={styles.body}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Fit me up !
                </Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => setModal1VIsible(true)}>
                <Text>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => setModal2VIsible(true)}>
                <Text>Se connecter</Text>
            </TouchableOpacity>
            <Modal
                visible={modal1Visible}
                onRequestClose={() => setModal1VIsible(false)}
                style={styles.modal}
                animationType='slide'
                transparent={true}
            >
                <Signup closeModal1={closeModal1}/>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        height: RPH(100),
        width: RPW(100),
    },
    header : {
        height : 80,
        justifyContent : "center",
        alignItems : "center",
    },
    title : {
        fontSize : 30,
        fontWeight : "800"
    }

})
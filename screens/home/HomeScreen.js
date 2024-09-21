import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Signup from './Signup';

import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
WebBrowser.maybeCompleteAuthSession()

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};



export default function HomeScreen({ navigation }) {

    // Si user connecté avec push token, redirection vers 1ère page Tab
    // Et si response de Google Auth change, appel de la fonction pour enregistrer le googleUSer

    const user = useSelector((state) => state.user.value)

    useEffect(() => {
        user.firstname && navigation.navigate('TabNavigator')

        googleSignin()

    }, [response])


    // États pour voir ou non modals
    const [modal1Visible, setModal1VIsible] = useState(false)
    const [modal2Visible, setModal2VIsible] = useState(false)



    // Fonction envoyée en IDF à Signup et Signin pour fermer modal après login

    const closeModal1 = () => {
        setModal1VIsible(false)
    }


    // Connexion Google

    // Paramétrage de la requête google

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_GOOGLE_ID,
        scopes: ['openid', 'email'],
        prompt: 'consent',
    })

    const [googleResponse, setGoogleResponse] = useState('')

    const googleSignin = async () => {
        if (response?.type === "success") {
            try {
                const token = response.authentication.accessToken

                const answer = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const googleUser = await answer.json()
                console.log(googleUser)
                const string = JSON.stringify(googleUser)
                setGoogleResponse(string)

            } catch (err) { console.log(err) }
        }

    }

    return (
        <View style={styles.body}>
            <TouchableOpacity style={styles.btn} onPress={() => setModal1VIsible(true)}>
                <Text>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => setModal2VIsible(true)}>
                <Text>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity styke={styles.googleBtn} onPress={()=>promptAsync()}>
                <Text>Se connecter avec Google</Text>
            </TouchableOpacity>
            <Text>{googleResponse}</Text>
            <Modal
                visible={modal1Visible}
                onRequestClose={() => setModal1VIsible(false)}
                style={styles.modal}
                animationType='slide'
                transparent={true}
            >
                <Signup closeModal1={closeModal1} navigation={navigation} />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        height: RPH(100),
        width: RPW(100),
        paddingTop: 100,
    },

})
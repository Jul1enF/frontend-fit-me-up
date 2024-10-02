import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user'
import { router } from 'expo-router';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


export default function Signup(props) {

    const dispatch = useDispatch()

    // États pour erreur et inputs

    const [error, setError] = useState('')

    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')


    // Fonction appelée au click sur s'inscrire

    const registerClick = async () => {
        if (!firstname || !name || !email || !password || !password2) {
            setError("Merci de remplir tous les champs ci dessus !")
        }
        else if (password !== password2) {
            setError("Erreur de confirmation du mot de passe !")
        }
        else {
            const response = await fetch(`${url}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    firstname,
                    email,
                    password,
                })
            })
            const data = await response.json()

            if (!data.result) {
                setError(data.error)
            }
            else {
                dispatch(login({
                    firstname: data.firstname,
                    token: data.jwtToken,
                    push_token: "",
                }))
                props.closeModal2()
                router.push("/recipes")

            }
        }
    }


    return (
        <View style={styles.body}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={-RPH(12)} style={styles.body}>
                <View style={styles.contentBody}>
                    <View style={styles.closeContainer}>
                        <Text style={styles.cross} onPress={() => props.closeModal2()}>X</Text>
                    </View>

                    <LinearGradient
                        style={styles.input}
                        colors={['rgb(65,21,143)', '#0a0081']}
                        locations={[0, 0.9]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}></LinearGradient>
                    <TextInput style={styles.input} onChangeText={(e) => {
                        setFirstname(e)
                        setError('')
                    }} value={firstname}></TextInput>
                    <TextInput style={styles.input} onChangeText={(e) => {
                        setName(e)
                        setError('')
                    }} value={name}></TextInput>
                    <TextInput style={styles.input} onChangeText={(e) => {
                        setEmail(e)
                        setError('')
                    }} value={email}></TextInput>
                    <View style={styles.passwordContainer}>
                        <TextInput style={styles.password} onChangeText={(e) => {
                            setPassword(e)
                            setError('')
                        }} value={password}></TextInput>
                    </View>
                    <View style={styles.passwordContainer}>
                        <TextInput style={styles.password} onChangeText={(e) => {
                            setPassword2(e)
                            setError('')
                        }} value={password2}></TextInput>
                    </View>
                    <TouchableOpacity style={styles.registerBtn} onPress={() => registerClick()}>
                        <Text style={styles.registerSentence}>S'inscrire</Text>
                    </TouchableOpacity>
                    <Text style={styles.error}>{error}</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingTop: RPH(4)
    },
    contentBody: {
        width: RPW(80),
        height: RPH(75),
        backgroundColor: "#252525",
        alignItems: "center",
        borderRadius: 10,
    },
    closeContainer: {
        width: "90%",
        alignItems: "flex-end",
        paddingTop: RPH(1.5),
        paddingBottom: RPH(1.5)
    },
    cross: {
        color: "white",
        fontSize: RPH(2.8),
        fontWeight: "600",
    },
    input: {
        backgroundColor: "white",
        marginBottom: RPH(5),
        width: "90%",
        height: RPH(7),
        borderRadius: 10,
        backgroundColor: '#0a0081'
    },
    passwordContainer: {
        width: "90%",
        height: RPH(7),
        marginBottom: RPH(5),
        backgroundColor: '#0a0081',
        borderRadius: 10,
    },
    password: {
        width: "70%"
    }
})
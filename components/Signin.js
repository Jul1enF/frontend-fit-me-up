import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user'
import { router } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import {RPH, RPW} from "../modules/dimensions"


const url = process.env.EXPO_PUBLIC_BACK_ADDRESS



export default function Signin(props) {

    const dispatch = useDispatch()

    // États pour erreur, inputs, visibilité mots de passe et offset du KeyboardAvoidingView

    const [error, setError] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false)

    const [offsetKeyboard, setOffsetKeyboard] = useState(-RPH(2))



    // Fonction appelée au click sur se connecter

    const connectRef = useRef(true)

    const connectClick = async () => {
        Keyboard.dismiss()

        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

        if (!email || !password) {
            setError("Merci de remplir tous les champs ci dessous !")
        }
        else {
            if (!connectRef.current) { return }
            connectRef.current = false

            const response = await fetch(`${url}/users/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                })
            })
            const data = await response.json()

            if (!data.result) {
                setError(data.error)
                connectRef.current = true
            }
            else {
                dispatch(login({
                    firstname: data.firstname,
                    name : data.name,
                    email : data.email,
                    token: data.jwtToken,
                    is_admin: data.is_admin,
                    is_allowed : data.is_allowed,
                    push_token: data.push_token,
                    bookmarks: data.bookmarks
                }))
                connectRef.current = true
                props.closeModal1()
                router.push("/home")

            }
        }
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'} keyboardVerticalOffset={Platform.OS === "ios" ? RPH(6) : RPH(-8)} style={styles.body} >
                <View style={styles.contentBody}>



                    <View style={styles.closeContainer}>
                        <Icon name="close" onPress={() => props.closeModal1()} color="#19290a" size={RPH(4)} ></Icon>
                    </View>

                    <Text style={styles.error}>{error}</Text>
                    <LinearGradient
                        style={styles.gradientContainer}
                        colors={['#9dcb00', '#045400']}
                        locations={[0, 0.9]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                    >
                        <TextInput style={styles.input}
                            onChangeText={(e) => {
                                setEmail(e)
                                setError('')
                            }}
                            value={email}
                            autoCorrect={false}
                            placeholder='Email'
                            placeholderTextColor="#fbfff790"
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoComplete="email"
                            onFocus={() => setOffsetKeyboard(RPH(6))}>
                        </TextInput>
                    </LinearGradient>

                    <LinearGradient
                        style={styles.gradientContainer}
                        colors={['#9dcb00', '#045400']}
                        locations={[0, 0.9]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                    >
                        <TextInput style={styles.password}
                            onChangeText={(e) => {
                                setPassword(e)
                                setError('')
                            }}
                            value={password}
                            placeholder='Mot de passe'
                            autoComplete="current-password"
                            placeholderTextColor="#fbfff790"
                            secureTextEntry={!passwordVisible}
                            onFocus={() => setOffsetKeyboard(RPH(6))} >
                        </TextInput>
                        <FontAwesome
                            name={passwordVisible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setPasswordVisible(!passwordVisible)}>
                        </FontAwesome>
                    </LinearGradient>

                    <LinearGradient
                        style={styles.connectContainer}
                        colors={['#9dcb00', '#045400']}
                        locations={[0, 0.9]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                    >
                        <TouchableOpacity style={styles.connectBtn} onPress={() => connectClick()}>
                            <Text style={styles.connectSentence}>
                                Se connecter
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>



                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0)",
    },
    contentBody: {
        width: RPW(85),
        height: RPH(50),
        marginTop: RPH(16),
        paddingBottom: RPH(4),
        backgroundColor: "#e6eedd",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
    },
    closeContainer: {
        width: "90%",
        alignItems: "flex-end",
        paddingTop: RPH(1.5),
        paddingBottom: RPH(1.5)
    },
    cross: {
        color: "#19290a",
        fontSize: RPH(2.8),
        fontWeight: "400",
    },
    gradientContainer: {
        marginBottom: RPH(3),
        width: "90%",
        height: RPH(7),
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: RPW(4)
    },
    input: {
        flex: 1,
        paddingLeft: RPW(4),
        color: "white",
        fontSize: RPH(2.5)
    },
    password: {
        width: "85%",
        height: "100%",
        paddingLeft: RPW(4),
        color: "white",
        fontSize: RPH(2.5)
    },
    connectContainer: {
        width: "90%",
        height: RPH(7),
        borderRadius: 10,
        marginBottom: RPH(2)
    },
    connectBtn: {
        flex: 1,
        backgroundColor: "#e6eedd",
        margin: 2,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    connectSentence: {
        color: "#19290a",
        fontSize: RPH(2.5)
    },
    error: {
        color: "red",
        position: "absolute",
        marginTop: RPH(6),
        fontSize : RPW(3.5),
        fontWeight : "600"
    }
})
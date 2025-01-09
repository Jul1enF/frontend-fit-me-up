import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user'
import { router } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { RPH, RPW } from "../modules/dimensions"

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';



const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

export default function Signup(props) {

    const dispatch = useDispatch()

    // États pour erreur, inputs, visibilité mots de passe et offset du KeyboardAvoidingView

    const [error, setError] = useState('')

    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [coach, setCoach] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [password2Visible, setPassword2Visible] = useState(false)

    const [offsetKeyboard, setOffsetKeyboard] = useState(-RPH(2))


    // Fonction appelée au click sur s'inscrire

    const registerRef = useRef(true)

    const registerClick = async () => {
        Keyboard.dismiss()

        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

        if (!firstname || !name || !email || !password || !password2 ) {
            setError("Merci de remplir tous les champs ci dessus !")
        }
        else if (password !== password2) {
            setError("Erreur de confirmation du mot de passe !")
        }
        else if (!regexMail.test(email)) {
            setError("Adresse mail non valide !")
        }
        else {
            // Désactivation du bouton en cas de temps d'attente pour éviter double click / double post 
            if (!registerRef.current) { return }
            registerRef.current = false

            const response = await fetch(`${url}/users/signup`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    firstname,
                    email,
                    password,
                    coach,
                })
            })
            const data = await response.json()

            if (!data.result) {
                setError(data.error)
                registerRef.current = true
            }
            else {
                dispatch(login({
                    firstname: data.firstname,
                    name: data.name,
                    email: data.email,
                    token: data.jwtToken,
                    is_admin: data.is_admin,
                    coach,
                    push_token: "",
                    bookmarks: []
                }))
                props.closeModal2()
                router.push("/home")
                registerRef.current = true
            }
        }
    }


    return (<>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

            <KeyboardAwareScrollView
                style={{  width: RPW(85),
                    height: RPH(80), backgroundColor: "rgba(0,0,0,0)", }}
                contentContainerStyle={[styles.contentBody, Platform.OS === "android" && {marginTop : RPH(2)}]}
                bottomOffset={Platform.OS === 'ios' ? RPH(16) : RPH(14)}
                keyboardShouldPersistTaps={'handled'}
            >


                {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={offsetKeyboard} style={styles.body}>
                    <View style={styles.contentBody}> */}


                <View style={styles.closeContainer}>
                    <Icon name="close" onPress={() => props.closeModal2()} color="#19290a" size={RPH(4)} ></Icon>
                </View>

                <LinearGradient
                    style={styles.gradientContainer}
                    colors={['#9dcb00', '#045400']}
                    locations={[0, 0.9]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setFirstname(e)
                            setError('')
                        }}
                        value={firstname}
                        placeholder='Prénom'
                     placeholderTextColor="#fbfff790"
                        onFocus={() => setOffsetKeyboard(RPH(-16))}
                        onBlur={() => setOffsetKeyboard(0)}>
                    </TextInput>
                </LinearGradient>

                <LinearGradient
                    style={styles.gradientContainer}
                    colors={['#9dcb00', '#045400']}
                    locations={[0, 0.9]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setName(e)
                            setError('')
                        }}
                        value={name}
                        placeholder='Nom'
                     placeholderTextColor="#fbfff790"
                        onFocus={() => setOffsetKeyboard(RPH(-16))}
                        onBlur={() => setOffsetKeyboard(0)}>
                    </TextInput>
                </LinearGradient>

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
                        placeholder='Email'
                       placeholderTextColor="#fbfff790"
                        keyboardType='email-address'
                        autoCapitalize='none'
                        onFocus={() => setOffsetKeyboard(RPH(-2))}
                        onBlur={() => setOffsetKeyboard(0)}>
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
                       placeholderTextColor="#fbfff790"
                        secureTextEntry={!passwordVisible}
                        onFocus={() => setOffsetKeyboard(-RPH(2))}
                        onBlur={() => setOffsetKeyboard(0)} >
                    </TextInput>
                    <FontAwesome
                        name={passwordVisible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setPasswordVisible(!passwordVisible)}>
                    </FontAwesome>
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
                            setPassword2(e)
                            setError('')
                        }}
                        value={password2}
                        placeholder='Confirmation mot de passe'
                       placeholderTextColor="#fbfff790"
                        secureTextEntry={!password2Visible}
                        onFocus={() => setOffsetKeyboard(RPH(23))}
                        onBlur={() => setOffsetKeyboard(0)} >
                    </TextInput>
                    <FontAwesome
                        name={password2Visible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setPassword2Visible(!password2Visible)}>
                    </FontAwesome>
                </LinearGradient>

                <LinearGradient
                    style={styles.gradientContainer}
                    colors={['#9dcb00', '#045400']}
                    locations={[0, 0.9]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setCoach(e)
                            setError('')
                        }}
                        value={coach}
                        placeholder="Nom de votre coach (facultatif)"
                       placeholderTextColor="#fbfff790"
                        onFocus={() => setOffsetKeyboard(RPH(30))}
                        onBlur={() => setOffsetKeyboard(0)}
                    >
                    </TextInput>
                </LinearGradient>

                <LinearGradient
                    style={styles.registerContainer}
                    colors={['#9dcb00', '#045400']}
                    locations={[0, 0.9]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <TouchableOpacity style={styles.registerBtn} onPress={() => registerClick()}>
                        <Text style={styles.registerSentence}>
                            S'inscrire
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
                <Text style={styles.error}>{error}</Text>


                {/* </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback> */}



            </KeyboardAwareScrollView>
            
        </View>

        </>
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
        minHeight: RPH(80),
        marginTop: RPH(8.5),
        backgroundColor: "#e6eedd",
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
    registerContainer: {
        width: "90%",
        height: RPH(7),
        borderRadius: 10,
        marginBottom: RPH(2)
    },
    registerBtn: {
        flex: 1,
        backgroundColor: "#e6eedd",
        margin: 2,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    registerSentence: {
        color: "#19290a",
        fontSize: RPH(2.5)
    },
    error: {
        color: "red",
        fontSize: RPW(4),
        fontWeight: "600",
        marginBottom: RPH(2)
    }
})
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user'
import { router } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { RPH, RPW} from "../modules/dimensions"

// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';



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
    const [appCode, setAppCode] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [password2Visible, setPassword2Visible] = useState(false)

    const [offsetKeyboard, setOffsetKeyboard] = useState(-RPH(2))



    // Fonction appelée au click sur s'inscrire

    const registerRef = useRef(true)

    const registerClick = async () => {
        Keyboard.dismiss()

        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

        if (!firstname || !name || !email || !password || !password2) {
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
            if (!registerRef.current){ return}
            registerRef.current = false

            const response = await fetch(`${url}/users/signup`, {
                method: 'PUT',
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
                registerRef.current = true
            }
            else {
                dispatch(login({
                    firstname: data.firstname,
                    token: data.jwtToken,
                    is_admin: data.is_admin,
                    push_token: "",
                    appCode,
                    bookmarks: []
                }))
                props.closeModal2()
                router.push("/recipes")
                registerRef.current = true
            }
        }
    }


    return (
        // <KeyboardAwareScrollView
        //     style={{ flex: 1 }}
        //     contentContainerStyle={[styles.contentBody, { marginLeft: RPW(7.5), marginTop: RPH(15) }]}
        //     bottomOffset={RPH(3)}
        // >

            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={offsetKeyboard} style={styles.body}>
                <View style={styles.contentBody}>
            <View style={styles.closeContainer}>
                <Icon name="close" onPress={() => props.closeModal2()} color="white" size={RPH(4)} ></Icon>
            </View>

            <LinearGradient
                style={styles.gradientContainer}
                colors={['#49158f', '#0a0081']}
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
                    placeholderTextColor='rgba(255,255,255,0.4)'
                    onFocus={() => setOffsetKeyboard(RPH(3))}>
                </TextInput>
            </LinearGradient>

            <LinearGradient
                style={styles.gradientContainer}
                colors={['#49158f', '#0a0081']}
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
                    placeholderTextColor='rgba(255,255,255,0.4)'
                    onFocus={() => setOffsetKeyboard(-RPH(2))}>
                </TextInput>
            </LinearGradient>

            <LinearGradient
                style={styles.gradientContainer}
                colors={['#49158f', '#0a0081']}
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
                    placeholderTextColor='rgba(255,255,255,0.4)'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onFocus={() => setOffsetKeyboard(-RPH(2))}>
                </TextInput>
            </LinearGradient>

            <LinearGradient
                style={styles.gradientContainer}
                colors={['#49158f', '#0a0081']}
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
                    placeholderTextColor='rgba(255,255,255,0.4)'
                    secureTextEntry={!passwordVisible}
                    onFocus={() => setOffsetKeyboard(-RPH(2))} >
                </TextInput>
                <FontAwesome
                    name={passwordVisible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setPasswordVisible(!passwordVisible)}>
                </FontAwesome>
            </LinearGradient>

            <LinearGradient
                style={styles.gradientContainer}
                colors={['#49158f', '#0a0081']}
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
                    placeholderTextColor='rgba(255,255,255,0.4)'
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
                colors={['#49158f', '#0a0081']}
                locations={[0, 0.9]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                <TextInput style={styles.input}
                    onChangeText={(e) => {
                        setAppCode(e)
                        setError('')
                    }}
                    value={appCode}
                    placeholder="Code de l'application (optionnel)"
                    placeholderTextColor='rgba(255,255,255,0.4)'
                    onFocus={() => setOffsetKeyboard(RPH(30))}
                    onBlur={() => setOffsetKeyboard(0)}
                >
                </TextInput>
            </LinearGradient>

            <LinearGradient
                style={styles.registerContainer}
                colors={['#7700a4', '#0a0081']}
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
            </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        // </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    contentBody: {
        width: RPW(85),
        minHeight: RPH(80),
        marginTop: RPH(12),
        backgroundColor: "#1c1c1c",
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
        backgroundColor: "#1c1c1c",
        margin: 2,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    registerSentence: {
        color: "white",
        fontSize: RPH(2.5)
    },
    error: {
        color: "white",
        fontSize: RPW(3.5),
        fontWeight: "600"
    }
})
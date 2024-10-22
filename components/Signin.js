import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user'
import { router } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

const url = process.env.EXPO_PUBLIC_BACK_ADDRESS



export default function Signin(props) {

    const dispatch = useDispatch()

    // États pour erreur, inputs, visibilité mots de passe et offset du KeyboardAvoidingView

    const [error, setError] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [appCode, setAppCode] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false)

    const [offsetKeyboard, setOffsetKeyboard] = useState(-RPH(2))



    // Fonction appelée au click sur s'inscrire

    const connectClick = async () => {

        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

        if (!email || !password ) {
            setError("Merci de remplir tous les champs ci dessous !")
        }
        else {
            const response = await fetch(`${url}/users/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                })
            })
            const data = await response.json()
            console.log("data : ",data)

            if (!data.result) {
                setError(data.error)
            }
            else {
                dispatch(login({
                    firstname: data.firstname,
                    token: data.jwtToken,
                    is_admin: data.is_admin,
                    push_token: data.push_token,
                    appCode,
                    bookmarks : data.bookmarks
                }))
                props.closeModal1()
                router.push("/recipes")

            }
        }
    }


return (
    <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={offsetKeyboard} style={styles.body} >
            <View style={styles.contentBody}>
                <View style={styles.closeContainer}>
                    <Icon name="close" onPress={() => props.closeModal1()} color="white" size={RPH(4)} ></Icon>
                </View>

                <Text style={styles.error}>{error}</Text>
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
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setAppCode(e)
                            setError('')
                        }}
                        value={appCode}
                        placeholder="Code de l'application (optionnel)"
                        placeholderTextColor='rgba(255,255,255,0.4)'
                        onFocus={() => setOffsetKeyboard(RPH(5))}
                        onBlur={() => setOffsetKeyboard(0)}>
                    </TextInput>
                </LinearGradient>

                <LinearGradient
                    style={styles.connectContainer}
                    colors={['#7700a4', '#0a0081']}
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
    height : RPH(62),
    marginTop: RPH(12),
    paddingBottom : RPH(4),
    backgroundColor: "#1c1c1c",
    alignItems: "center",
    justifyContent : "space-between",
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
connectContainer: {
    width: "90%",
    height: RPH(7),
    borderRadius: 10,
    marginBottom: RPH(2)
},
connectBtn: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    margin: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
},
connectSentence: {
    color: "white",
    fontSize: RPH(2.5)
},
error: {
    color: "white",
    position : "absolute",
    marginTop : RPH(6)
}
})
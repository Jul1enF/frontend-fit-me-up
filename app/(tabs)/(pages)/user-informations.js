import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from "react-native";
import { RPH, RPW } from "../../../modules/dimensions"

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { LinearGradient } from "expo-linear-gradient";

import { useSelector, useDispatch } from "react-redux";
import { changeUserInfos, logout } from "../../../reducers/user";
import { useState, useEffect, useRef } from "react";

import { router } from "expo-router";

import Modal from "react-native-modal"


import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";




export default function UserInformations() {

    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()

    // UseEffect pour charger dans les états les valeurs des informations du user

    useEffect(() => {
        setFirstname(user.firstname)
        setName(user.name)
        setEmail(user.email)
        setCoach(user.coach)
        setOldPassword("")
        setPassword('')
        setPassword2('')
    }, [user])


    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [coach, setCoach] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [error, setError] = useState('')
    const [error2, setError2] = useState('')

    const [modal1Visible, setModal1Visible] = useState(false)
    const [modal2Visible, setModal2Visible] = useState(false)

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [password2Visible, setPassword2Visible] = useState(false)


    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // Fonction appelée en cliquant pour la première fois sur enregistrer

    const firstRegisterPress = () => {

        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g


        if (!firstname || !name || !email) {
            setError("Merci de ne pas laisser les trois premiers champs vides !")
        }
        else if (oldPassword && !password || password && !oldPassword) {
            setError("Merci de bien remplir l'ancien et le nouveau mot de passe !")
        }
        else if (password !== password2) {
            setError("Erreur de confirmation du mot de passe !")
        }
        else if (!regexMail.test(email)) {
            setError("Adresse mail non valide !")
        }
        else {
            setModal1Visible(true)
        }
    }




    // Fonction appelée en cliquant sur enregistrer pour la deuxième fois

    const registerRef = useRef(true)

    const finalRegisterPress = async () => {
        if (registerRef.current == false) { return }
        registerRef.current = false


        const response = await fetch(`${url}/userModifications/modify-user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                firstname,
                email,
                oldPassword,
                password,
                coach,
                jwtToken: user.token,
            })
        })
        const data = await response.json()

        if (data.result) {
            setModal1Visible(false)
            dispatch(changeUserInfos({
                name,
                firstname,
                email,
                coach,
            }))

            setOldPassword("")
            setPassword('')
            setPassword2('')

            registerRef.current = true

            setError2("Modifications enregistrées !")
            setTimeout(() => setError2(''), 4000)
        }
        else if (data.error) {
            setModal1Visible(false)

            registerRef.current = true

            setError2(data.error)
            setTimeout(() => setError2(''), 5000)
        }
        else {
            setModal1Visible(false)

            registerRef.current = true

            setError2("Problème d'autorisation. Essayez en quittant l'application et en vous reconnectant.")
            setTimeout(() => setError2(''), 5000)
        }
    }




    // Fonction appelée en se désincrivant
    const unsuscribeRef = useRef(true)


    const unsuscribePress = async () => {
        if (unsuscribeRef.current = false) { return }
        unsuscribeRef.current = false

        const response = await fetch(`${url}/userModifications/delete-user/${user.token}`, { method: 'DELETE' })

        const data = await response.json()

        if (!data.result && data.error) {
            setError2(data.error)
            setTimeout(() => setError2(''), 4000)
            unsuscribeRef.current = true
        }
        else if (!data.result) {
            setError2("Erreur : Merci de réessayez après vous être reconnecté ou de contacter l'Éditeur de l'application.")
            setTimeout(() => setError2(''), 4000)
            unsuscribeRef.current = true
        }
        else {
            setModal2Visible(false)
            dispatch(logout())
            router.push(`/`)
            unsuscribeRef.current = true
        }

    }





    if (Platform.OS === "android"){


    return (<>
        {/* <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.contentBody]}
            bottomOffset={RPH(14)}
        > */}


            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={RPH(14.5)} style={styles.body}>
            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}  >

            <View style={styles.topContainer}>
                <Text style={styles.title}>Mes informations</Text>
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
            </View>

            <Text style={styles.text1}>
                Changer mon prénom :
            </Text>
            <TextInput style={styles.input}
                onChangeText={(value) => {
                    setFirstname(value)
                    setError('')
                }}
                value={firstname}
                placeholder="Prénom"
                placeholderTextColor="#fbfff790"
                maxLength={28}>
            </TextInput>


            <Text style={styles.text1}>
                Changer mon nom :
            </Text>
            <TextInput style={styles.input}
                onChangeText={(value) => {
                    setName(value)
                    setError('')
                }}
                value={name}
                placeholder="Nom"
                placeholderTextColor="#fbfff790"
                maxLength={28}>
            </TextInput>


            <Text style={styles.text1}>
                Changer mon email :
            </Text>
            <TextInput style={[styles.input, { marginBottom: 40 }]}
                onChangeText={(value) => {
                    setEmail(value)
                    setError('')
                }}
                value={email}
                keyboardType='email-address'
                autoCapitalize='none'
                placeholder="Email"
                placeholderTextColor="#fbfff790"
                >
            </TextInput>


            <Text style={styles.text1}>
                Changer le nom de mon coach :
            </Text>
            <TextInput style={styles.input}
                onChangeText={(value) => {
                    setCoach(value)
                    setError('')
                }}
                value={coach}
                placeholder="Nom de votre coach (facultatif)"
                placeholderTextColor="#fbfff790"
                >
            </TextInput>


            <Text style={styles.text1}>
                Changer mon mot de passe :
            </Text>

            <View style={styles.passwordContainer}>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setOldPassword(value)
                        setError('')
                    }}
                    value={oldPassword}
                    placeholder="Ancien mot de passe"
                    placeholderTextColor="#fbfff790"
                    secureTextEntry={!oldPasswordVisible}
                    maxLength={28}>
                </TextInput>
                <FontAwesome
                    name={oldPasswordVisible ? "eye-slash" : "eye"} color="#f9fff4" size={RPH(3.8)} onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
                </FontAwesome>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setPassword(value)
                        setError('')
                    }}
                    value={password}
                    placeholder="Nouveau mot de passe"
                    placeholderTextColor="#fbfff790"
                    secureTextEntry={!passwordVisible}
                    maxLength={28}>
                </TextInput>
                <FontAwesome
                    name={passwordVisible ? "eye-slash" : "eye"} color="#f9fff4" size={RPH(3.8)} onPress={() => setPasswordVisible(!passwordVisible)}>
                </FontAwesome>
            </View>


            <View style={styles.passwordContainer}>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setPassword2(value)
                        setError('')
                    }}
                    value={password2}
                    placeholder="Confirmation mot de passe"
                    placeholderTextColor="#fbfff790"
                    secureTextEntry={!password2Visible}
                    maxLength={28}>
                </TextInput>
                <FontAwesome
                    name={password2Visible ? "eye-slash" : "eye"} color="#f9fff4" size={RPH(3.8)} onPress={() => setPassword2Visible(!password2Visible)}>
                </FontAwesome>
            </View>


            <Text style={[styles.text1, !error2 && { display: "none" }, error2 == "Modifications enregistrées !" ? { color: "green" } : { color: "red" }]}>{error2}</Text>

            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => firstRegisterPress()}>
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.btnGradientContainer}
                >
                    <Text style={styles.text2}>Enregistrer</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Text style={[styles.text1, !error && { display: "none" }, { color: "red" }]}>{error}</Text>


            <LinearGradient
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.btnGradientContainer2}
            >
                <TouchableOpacity style={[styles.btnTouchable2,]} activeOpacity={0.8} onPress={() => setModal2Visible(true)}>
                    <Text style={styles.text3}>Me désinscrire</Text>
                </TouchableOpacity>
            </LinearGradient>




            <Modal
                isVisible={modal1Visible}
                style={styles.modal}
                backdropColor="rgba(0,0,0,0.9)"
                animationIn="slideInDown"
                animationOut="slideOutUp"
                statusBarTranslucent={true}
                onBackButtonPress={() => setModal1Visible(!modal1Visible)}
                onBackdropPress={() => setModal1Visible(!modal1Visible)}
            >
                <View style={styles.modalBody}>
                    <Text style={styles.text3}>Êtes vous sûr de vouloir enregistrer ces informations ?</Text>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientLine2}
                    >
                    </LinearGradient>
                    <View style={styles.row1}>
                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal1Visible(false)}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Annuler</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => finalRegisterPress()}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Enregistrer</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>



            <Modal
                isVisible={modal2Visible}
                style={styles.modal}
                backdropColor="rgba(0,0,0,0.9)"
                animationIn="slideInDown"
                animationOut="slideOutUp"
                statusBarTranslucent={true}
                onBackButtonPress={() => setModal2Visible(!modal2Visible)}
                onBackdropPress={() => setModal2Visible(!modal2Visible)}
            >
                <View style={styles.modalBody}>
                    <Text style={styles.text3}>Êtes vous sûr de vouloir vous désinscrire ?</Text>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientLine2}
                    >
                    </LinearGradient>
                    <View style={styles.row1}>
                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal2Visible(false)}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Annuler</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => unsuscribePress()}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Confirmer</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>




            </ScrollView>
        </KeyboardAvoidingView>


        {/* </KeyboardAwareScrollView> */}

    </>
    )
    }









    return (<>
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.contentBody]}
            bottomOffset={RPH(14)}
        >


            {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={RPH(14.5)} style={styles.body}>
            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}  > */}

            <View style={styles.topContainer}>
                <Text style={styles.title}>Mes informations</Text>
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
            </View>

            <Text style={styles.text1}>
                Changer mon prénom :
            </Text>
            <TextInput style={styles.input}
                onChangeText={(value) => {
                    setFirstname(value)
                    setError('')
                }}
                value={firstname}
                placeholder="Prénom"
                placeholderTextColor="#fbfff790"
                maxLength={28}>
            </TextInput>


            <Text style={styles.text1}>
                Changer mon nom :
            </Text>
            <TextInput style={styles.input}
                onChangeText={(value) => {
                    setName(value)
                    setError('')
                }}
                value={name}
                placeholder="Nom"
                placeholderTextColor="#fbfff790"
                maxLength={28}>
            </TextInput>


            <Text style={styles.text1}>
                Changer mon email :
            </Text>
            <TextInput style={[styles.input, { marginBottom: 40 }]}
                onChangeText={(value) => {
                    setEmail(value)
                    setError('')
                }}
                value={email}
                keyboardType='email-address'
                autoCapitalize='none'
                placeholder="Email"
                placeholderTextColor="#fbfff790"
                >
            </TextInput>


            <Text style={styles.text1}>
                Changer le nom de mon coach :
            </Text>
            <TextInput style={styles.input}
                onChangeText={(value) => {
                    setCoach(value)
                    setError('')
                }}
                value={coach}
                placeholder="Nom de votre coach (facultatif)"
                placeholderTextColor="#fbfff790"
                >
            </TextInput>


            <Text style={styles.text1}>
                Changer mon mot de passe :
            </Text>

            <View style={styles.passwordContainer}>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setOldPassword(value)
                        setError('')
                    }}
                    value={oldPassword}
                    placeholder="Ancien mot de passe"
                    placeholderTextColor="#fbfff790"
                    secureTextEntry={!oldPasswordVisible}
                    maxLength={28}>
                </TextInput>
                <FontAwesome
                    name={oldPasswordVisible ? "eye-slash" : "eye"} color="#f9fff4" size={RPH(3.8)} onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
                </FontAwesome>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setPassword(value)
                        setError('')
                    }}
                    value={password}
                    placeholder="Nouveau mot de passe"
                    placeholderTextColor="#fbfff790"
                    secureTextEntry={!passwordVisible}
                    maxLength={28}>
                </TextInput>
                <FontAwesome
                    name={passwordVisible ? "eye-slash" : "eye"} color="#f9fff4" size={RPH(3.8)} onPress={() => setPasswordVisible(!passwordVisible)}>
                </FontAwesome>
            </View>


            <View style={styles.passwordContainer}>
                <TextInput style={styles.input2}
                    onChangeText={(value) => {
                        setPassword2(value)
                        setError('')
                    }}
                    value={password2}
                    placeholder="Confirmation mot de passe"
                    placeholderTextColor="#fbfff790"
                    secureTextEntry={!password2Visible}
                    maxLength={28}>
                </TextInput>
                <FontAwesome
                    name={password2Visible ? "eye-slash" : "eye"} color="#f9fff4" size={RPH(3.8)} onPress={() => setPassword2Visible(!password2Visible)}>
                </FontAwesome>
            </View>


            <Text style={[styles.text1, !error2 && { display: "none" }, error2 == "Modifications enregistrées !" ? { color: "green" } : { color: "red" }]}>{error2}</Text>

            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => firstRegisterPress()}>
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.btnGradientContainer}
                >
                    <Text style={styles.text2}>Enregistrer</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Text style={[styles.text1, !error && { display: "none" }, { color: "red" }]}>{error}</Text>


            <LinearGradient
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.btnGradientContainer2}
            >
                <TouchableOpacity style={[styles.btnTouchable2,]} activeOpacity={0.8} onPress={() => setModal2Visible(true)}>
                    <Text style={styles.text3}>Me désinscrire</Text>
                </TouchableOpacity>
            </LinearGradient>




            <Modal
                isVisible={modal1Visible}
                style={styles.modal}
                backdropColor="rgba(0,0,0,0.9)"
                animationIn="slideInDown"
                animationOut="slideOutUp"
                statusBarTranslucent={true}
                onBackButtonPress={() => setModal1Visible(!modal1Visible)}
                onBackdropPress={() => setModal1Visible(!modal1Visible)}
            >
                <View style={styles.modalBody}>
                    <Text style={styles.text3}>Êtes vous sûr de vouloir enregistrer ces informations ?</Text>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientLine2}
                    >
                    </LinearGradient>
                    <View style={styles.row1}>
                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal1Visible(false)}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Annuler</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => finalRegisterPress()}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Enregistrer</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>



            <Modal
                isVisible={modal2Visible}
                style={styles.modal}
                backdropColor="rgba(0,0,0,0.9)"
                animationIn="slideInDown"
                animationOut="slideOutUp"
                statusBarTranslucent={true}
                onBackButtonPress={() => setModal2Visible(!modal2Visible)}
                onBackdropPress={() => setModal2Visible(!modal2Visible)}
            >
                <View style={styles.modalBody}>
                    <Text style={styles.text3}>Êtes vous sûr de vouloir vous désinscrire ?</Text>
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientLine2}
                    >
                    </LinearGradient>
                    <View style={styles.row1}>
                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal2Visible(false)}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Annuler</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => unsuscribePress()}>
                            <LinearGradient
                                colors={['#9dcb00', '#045400']}
                                locations={[0.05, 1]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.btnGradientContainer}
                            >
                                <Text style={styles.text2}>Confirmer</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>




            {/* </ScrollView>
        </KeyboardAvoidingView> */}


        </KeyboardAwareScrollView>

    </>
    )


}



const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#f9fff4",
    },
    contentBody: {
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        paddingBottom: RPW(6),
        paddingTop: RPW(5),
        alignItems: "center",
        backgroundColor: "#f9fff4",
    },
    topContainer: {
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 25,
    },
    title: {
        color: "#19290a",
        fontSize: 24,
        fontWeight: "450",
        marginBottom: 9,
        marginLeft: 5
    },
    gradientLine: {
        width: "95%",
        height: 4,
        marginBottom: 15,
    },
    text1: {
        color: "#19290a",
        fontSize: RPW(5),
        fontWeight: "350",
        marginBottom: 13
    },
    input: {
        width: "100%",
        backgroundColor: "#2e6017",
        color: "white",
        borderRadius: 5,
        marginBottom: 25,
        paddingLeft: 8,
        fontSize: RPW(5.3),
        paddingBottom: 7,
        paddingTop: 7,
    },
    passwordContainer: {
        flexDirection: "row",
        width: "100%",
        height: RPW(10),
        paddingRight: RPW(2),
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2e6017",
        marginBottom: 20,
        borderRadius: 5,
    },
    input2: {
        width: "80%",
        backgroundColor: "#2e6017",
        borderRadius: 5,
        paddingLeft: 8,
        fontSize: RPW(5.3),
        paddingBottom: 7,
        paddingTop: 7,
    },
    btnTouchable: {
        height: RPW(12),
        marginTop: 10,
    },
    btnGradientContainer: {
        flex: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        minWidth: RPW(34)
    },
    btnTouchable2: {
        backgroundColor: "#f9fff4",
        flex: 1,
        margin: 2,
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    btnGradientContainer2: {
        borderRadius: 10,
        height: RPW(12),
        marginTop: 40,
    },
    text2: {
        color: "white",
        fontSize: RPW(5.4),
        fontWeight: "500",
        textAlign: "center"
    },
    text3: {
        color: "#19290a",
        fontSize: RPW(5.4),
        fontWeight: "500",
        textAlign: "center"
    },
    modal: {
        alignItems: "center",
    },
    modalBody: {
        height: RPH(35),
        width: RPW(90),
        borderRadius: 10,
        paddingTop: RPH(5),
        paddingBottom: RPH(5),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        backgroundColor: "#e6eedd",
        position: "absolute",
        bottom: RPH(20),
        justifyContent: "space-between",
        alignItems: "center"
    },
    gradientLine2: {
        width: "90%",
        height: 4,
    },
    row1: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
})
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal"

import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/user";
import { router, usePathname } from "expo-router";
import {RPH, RPW } from "../modules/dimensions"


const statusHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0

export default function Header() {

    const [menuVisible, setMenuVisible] = useState(false)
    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // useEffect et variables pour ajuster la taille de la modale si l'on est sur la page d'un article

    const pathName = usePathname()

    const [articlePage, setArticlePage] = useState(false)

    useEffect(() => {
        if (pathName.includes('-article') || pathName.includes('notification-page')) {
            setArticlePage(true)
        }
        else {
            setArticlePage(false)
        }
    }, [pathName])


    // États pour l'affichage et l'enregistrement de la recherche

    const [searchVisible, setSearchVisible] = useState(false)
    const [searchText, setSearchText] = useState('')


    // Fonction appelée en cliquant sur Se déconnecter

    const logoutPress = async () => {
        // Effacement du push token en bdd
        const response = await fetch(`${url}/userModifications/changePushToken`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jwtToken : user.token,
                push_token : "",
            })
        })
        const data = await response.json()
        console.log("DATA :", data)

        // Reducer logout, fermeture du menu et push vers page d'accueil
        setMenuVisible(false)
        dispatch(logout())
        router.navigate('/')
    }

    

    // Fonction appelée en soumettant une recherche

    const submitSearch = () => {
        router.push(`/searches/${searchText}`)
        setSearchText('')
        setSearchVisible(false)
    }



    return (
        <View style={styles.body}>
             <StatusBar translucent={true} barStyle="light"/>
            <LinearGradient style={styles.header}
                colors={['#7700a4', '#0a0081']}
                locations={[0, 0.9]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                <View style={styles.menuIconContainer}>
                    <FontAwesome name="navicon" style={styles.icon} size={RPW(7)} onPress={() => setMenuVisible(!menuVisible)} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        FIT ME UP
                    </Text>
                </View>
                <View style={styles.searchIconContainer}>
                    <FontAwesome6 name="magnifying-glass" style={styles.icon} size={RPW(6.5)} onPress={() => setSearchVisible(!searchVisible)} />
                </View>
            </LinearGradient>
            <View style={styles.headerLigne}></View>


            <Modal
                isVisible={searchVisible}
                style={styles.modal}
                backdropColor="transparent"
                animationIn="fadeInDown"
                animationOut="fadeOutUp"
                onBackButtonPress={() => setSearchVisible(!searchVisible)}
                onBackdropPress={() => setSearchVisible(!searchVisible)}
            >
                <LinearGradient style={styles.searchContainer}
                    colors={['#7700a4', '#0a0081']}
                    locations={[0, 0.9]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.search}
                            placeholder="Rechercher..."
                            onChangeText={(e) => setSearchText(e)}
                            value={searchText}
                            returnKeyType="send"
                            placeholderTextColor={"rgba(255,255,255,0.85)"}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onSubmitEditing={() => submitSearch()}
                        ></TextInput>
                         <FontAwesome6 name="magnifying-glass" style={styles.icon} size={RPH(1.9)} onPress={() => submitSearch()} />
                    </View>
                    <FontAwesome6 name="chevron-up" style={styles.icon} size={RPH(2.8)} onPress={() => setSearchVisible(!searchVisible)} />

                </LinearGradient>
            </Modal>


            <Modal
                isVisible={menuVisible}
                style={styles.modal}
                backdropColor="transparent"
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onBackButtonPress={() => setMenuVisible(!menuVisible)}
                onBackdropPress={() => setMenuVisible(!menuVisible)}
            >
                <View style={!articlePage ? styles.modalBody : styles.modalBody2}>
                <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={()=> {
                        setMenuVisible(false)
                        router.navigate('/home')
                        }}>
                        <Text style={styles.link}>Accueil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={()=> {
                        setMenuVisible(false)
                        router.navigate('/user-informations')
                        }}>
                        <Text style={styles.link}>Mes informations</Text>
                    </TouchableOpacity>
                    {user.is_admin &&
                        <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => {
                            setMenuVisible(false)
                            router.push('/redaction')
                        }}>
                            <Text style={styles.link}>Écrire / Modifier un article</Text>
                        </TouchableOpacity>
                    }
                     {user.is_admin &&
                        <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => {
                            setMenuVisible(false)
                            router.push('/notifications')
                        }}>
                            <Text style={styles.link}>Notifications</Text>
                        </TouchableOpacity>
                    }
                        {user.is_admin &&
                        <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => {
                            setMenuVisible(false)
                            router.push('/users')
                        }}>
                            <Text style={styles.link}>Utilisateurs</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => logoutPress()}>
                        <Text style={styles.link}>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        height: RPH(14),
        width: RPW(100),
    },
    header: {
       flex : 1,
        paddingTop: RPH(4) - (statusHeight/2),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    menuIconContainer: {
        width: "15%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: RPW(4),
    },
    titleContainer: {
        width: "70%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: RPW(8.5),
        color: "white",
        letterSpacing: 2.5,
        fontWeight: "600",
    },
    searchIconContainer: {
        width: "15%",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: RPW(4),
    },
    icon: {
        color: "white",
    },
    headerLigne: {
        borderBottomColor: "#878787",
        borderBottomWidth: RPH(0.2)
    },
    searchContainer: {
        position: "absolute",
        top: RPH(14) - statusHeight,
        height: RPH(6),
        width: RPW(100),
        backgroundColor: "#2e2e2e",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
    },
    searchInputContainer : {
        borderBottomColor: "white",
        borderBottomWidth: 0.5,
        width: RPW(50),
        paddingBottom: RPH(1),
        paddingRight : RPW(1),
        marginTop: RPH(0.5),
        flexDirection : 'row',
        justifyContent : "space-between",
        alignItems : "center",
    },
    search: {
        color: "white",
        fontSize: RPH(2.3),
        fontWeight: "500",
        width : "90%",
    },
    modal: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
    },
    modalBody: {
        height: RPH(75.6),
        width: RPW(80),
        backgroundColor: "#2e2e2e",
        position: "absolute",
        top: RPH(13.9) - statusHeight,
    },
    modalBody2: {
        height: RPH(69.5),
        width: RPW(80),
        backgroundColor: "#2e2e2e",
        position: "absolute",
        top: RPH(20) - statusHeight,
    },
    linkContainer: {
        height: RPH(11.5),
        borderTopWidth: 0.5,
        borderTopColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {
        color: "white",
        fontSize: RPW(6.3),
        fontWeight: "200"
    },
})
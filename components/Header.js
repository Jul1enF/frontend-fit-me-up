import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal"

import { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/user";
import { router } from "expo-router";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

export default function Header() {

    const [menuVisible, setMenuVisible] = useState(false)
    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // Fonction appelée en cliquant sur Se déconnecter

    const logoutPress = async ()=>{
        console.log('hello')
        // Effacement du push token en bdd
        const response = await fetch(`${url}/userModifications/changePushToken`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token : user.token,
              push_token : "",
            })
          })
          const data = await response.json()
          console.log(data)

          // Reducer logout, fermeture du menu et push vers page d'accueil
          dispatch(logout())
          setMenuVisible(false)
          router.push('/')
    }

    return (
        <View style={styles.body}>
            <LinearGradient style={styles.header}
                colors={['#7700a4', '#0a0081']}
                locations={[0, 0.9]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                <View style={styles.menuIconContainer}>
                    <FontAwesome name="navicon" style={styles.icon} size={RPH(3.8)} onPress={() => setMenuVisible(!menuVisible)} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        FIT ME UP
                    </Text>
                </View>
                <View style={styles.searchIconContainer}>
                    <FontAwesome6 name="magnifying-glass" style={styles.icon} size={RPH(3.5)} />
                </View>
            </LinearGradient>
            <View style={styles.headerLigne}></View>

            
            <Modal
                isVisible={menuVisible}
                backdropColor="transparent"
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onBackButtonPress={() => setMenuVisible(!menuVisible)}
                onBackdropPress={() => setMenuVisible(!menuVisible)}
            >
                <View style={styles.modalBody}>
                    <TouchableOpacity style={styles.linkContainer}>
                        <Text style={styles.link}>Mes informations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkContainer} onPress={()=>logoutPress()}>
                        <Text style={styles.link}>Se déconnecter</Text>
                    </TouchableOpacity>
                    {user.is_admin &&
                        <TouchableOpacity style={styles.linkContainer} onPress={() => {
                            setMenuVisible(false)
                            router.push('/redaction')
                        }}>
                            <Text style={styles.link}>Écrire un article</Text>
                        </TouchableOpacity>
                    }
                    {user.is_admin &&
                        <TouchableOpacity style={styles.linkContainer}>
                            <Text style={styles.link}>Poster un article</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.linkContainer}>
                        <Text style={styles.link}>Contacts</Text>
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
        flex: 1,
        paddingTop: RPH(4),
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
        fontSize: RPH(4.5),
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
        borderBottomWidth: RPH(0.05)
    },
    modalBody: {
        height: RPH(76),
        width: RPW(80),
        backgroundColor: "#2e2e2e",
        left: -RPW(5),
        top: RPH(2),
    },
    linkContainer: {
        height: RPH(13),
        width : RPW(80),
        borderTopWidth: 0.5,
        borderTopColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {
        color: "white",
        fontSize: RPH(3),
        fontWeight: "200"
    },
})
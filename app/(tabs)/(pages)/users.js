import { View, StyleSheet, Text, FlatList, RefreshControl, TextInput } from "react-native";

import { useState, useEffect } from "react";
import { RPH, RPW } from "../../../modules/dimensions"
import User from "../../../components/User"

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from "expo-linear-gradient";

import { useSelector } from "react-redux";



export default function Users() {

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const [allUsers, setAllUsers] = useState("")
    const [usersToDisplay, setUsersToDisplay] = useState("")
    const [searchText, setSearchText] = useState("")
    const [searching, setSearching] = useState(false)

    const user = useSelector((state) => state.user.value)
    const jwtToken = user.token



    // Fonction et useEffect pour charger les users

    const loadUsers = async () => {
        if (searching) { return }

        const response = await fetch(`${url}/users/all-users`)
        const data = await response.json()

        if (data.result) {
            setAllUsers(data.users)
            setUsersToDisplay(data.users)
        }
    }


    useEffect(() => {
        loadUsers()
    }, [])




    // Fonction en IDF pour changer is_allowed ici, si modifié dans bdd dans User

    const toggleAllowed = (_id) => {

        
        setAllUsers(allUsers.map(e => {

            if (e._id == _id) {
                newE = { ...e }
                if (newE.is_allowed === "false" || newE.is_allowed === "blocked") {
                    newE.is_allowed = "true"
                }
                else {
                    newE.is_allowed = "false"
                }
                return newE
            }
            return e
        }))

        setUsersToDisplay(usersToDisplay.map(e => {
          
            if (e._id == _id) {
                newE = { ...e }
                if (newE.is_allowed === "false" || newE.is_allowed === "blocked") {
                    newE.is_allowed = "true"
                }
                else {
                    newE.is_allowed = "false"
                }
                return newE
            }
            return e
        }))
    }



    // Fonction en IDF pour changer is_admin ici, si modifié dans bdd dans USer

    const toggleAdmin = (_id) => {

        setAllUsers(allUsers.map(e => {
            if (e._id == _id) {
                newE = { ...e }
                newE.is_admin = !newE.is_admin

                return newE
            }
            return e
        }))

        setUsersToDisplay(usersToDisplay.map(e => {
            if (e._id == _id) {
                newE = { ...e }
                newE.is_admin = !newE.is_admin

                return newE
            }
            return e
        }))
    }



    // Fonction appelée en cas de click sur recherche

    const submitSearch = () => {
        const regex = new RegExp(searchText, 'i')

        if (!searchText) {
            setUsersToDisplay(allUsers)
            setSearching(false)
            return
        }

        setSearching(true)

        setUsersToDisplay(allUsers.filter(e => regex.test(e.name) || regex.test(e.firstname) || regex.test(e.email) || regex.test(e.coach)))

    }



    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["#19290a"]} progressBackgroundColor={"white"} tintColor={"#19290a"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadUsers()
    }} />



    // Composants à afficher en haut

    const topComponents = (
        <View style={styles.topContainer}>
            <View style={styles.searchContainer}>
                <View style={styles.leftSectionContainer}>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.search}
                            placeholder="Rechercher un utilisateur ..."
                            onChangeText={(e) => setSearchText(e)}
                            value={searchText}
                            returnKeyType="send"
                            placeholderTextColor="#19290a90"
                            autoCapitalize="none"
                            onSubmitEditing={() => submitSearch()}
                            autoCorrect={false}
                        ></TextInput>
                        <FontAwesome6 name="magnifying-glass" style={styles.icon} size={RPW(4)} onPress={() => submitSearch()} />
                    </View>

                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientLine}
                    >
                    </LinearGradient>
                </View>
                <FontAwesome5 name="backspace" style={styles.icon} size={RPW(5)} onPress={() => {
                    setSearchText("")
                    setSearching(false)
                    setUsersToDisplay(allUsers)
                }} />
            </View>

            <Text style={styles.title}>Liste des {usersToDisplay.length.toString()} utilisateurs :</Text>
            <LinearGradient
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientLine2}
            >
            </LinearGradient>
        </View>
    )



    return (
        <FlatList
            data={usersToDisplay}
            refreshControl={refreshComponent}
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            ListHeaderComponent={topComponents}
            style={styles.body}
            contentContainerStyle={{ alignItems: 'center', paddingTop: RPH(3) }}
            renderItem={({ item }) => {
                if (usersToDisplay) { return <User {...item} jwtToken={jwtToken} toggleAdmin={toggleAdmin} toggleAllowed={toggleAllowed} /> }
            }}>

        </FlatList>
    )
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#f9fff4",
    },
    topContainer: {
        width: RPW(100),
        backgroundColor: "#f9fff4",
        paddingLeft: RPW(3),
        paddingRight: RPW(3),
        marginBottom: 15,
        justifyContent: "flex-start"
    },
    searchContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
    },
    leftSectionContainer: {
        width: RPW(64),
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    gradientLine: {
        width: "100%",
        height: 2,
    },
    search: {
        color: "#19290a",
        fontSize: RPW(4.2),
        fontWeight: "500",
        width: "90%",
    },
    icon: {
        color: "#19290a",
    },
    title: {
        color: "#19290a",
        fontSize: 24,
        fontWeight: "450",
        marginBottom: 9,
    },
    gradientLine2: {
        width: "95%",
        height: 4,
        marginBottom: 15,
    },
})
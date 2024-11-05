import { View, StyleSheet, Text, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { RPH, RPW } from "../../../modules/dimensions"
import User from "../../../components/User"

import { LinearGradient } from "expo-linear-gradient";

import { useSelector } from "react-redux";



export default function Users() {

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const [users, setUsers] = useState("")

    const user = useSelector((state) => state.user.value)
    const jwtToken = user.token


    // Fonction et useFocusEffect pour charger les users

    const loadUsers = async () => {

        const response = await fetch(`${url}/users/all-users`)
        const data = await response.json()

        if (data.result) {
            setUsers(data.users)
        }
    }

    useFocusEffect(useCallback(() => {
        loadUsers()
    }, []))


    // Fonction en IDF pour changer is_allowed ici, si modifié dans bdd

    const toggleAllowed = (_id) => {
        setUsers(users.map(e=>{
            if (e._id == _id){
                e.is_allowed = !e.is_allowed
            }
            return e
        }))
    }



    // Fonction en IDF pour changer is_admin ici, si modifié dans bdd

    const toggleAdmin = (_id) => {
        setUsers(users.map(e=>{
            if (e._id == _id){
                e.is_admin = !e.is_admin
            }
            return e
        }))
    }




    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["white"]} tintColor={"white"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadUsers()
    }} />



// Composants à afficher en haut

const topComponents  = (
    <View style={styles.topContainer}>
          <Text style={styles.title}>Liste des {users.length.toString()} utilisateurs :</Text>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
    </View>
)



    return (
        <FlatList
            data={users}
            refreshControl={refreshComponent}
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            ListHeaderComponent={topComponents}
            style={styles.body}
            contentContainerStyle={{ alignItems: 'center', paddingTop: RPH(3) }}
            renderItem={({ item }) => {
                if (users) { return <User {...item} jwtToken={jwtToken} toggleAdmin={toggleAdmin} toggleAllowed={toggleAllowed} /> }
            }}>

        </FlatList>
    )
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "black",
    },
    topContainer: {
        width: RPW(100),
        backgroundColor: "black",
        paddingLeft: RPW(3),
        paddingRight: RPW(3),
        marginBottom: 15,
        justifyContent : "flex-start"
    },
    title: {
        color: "#e0e0e0",
        fontSize: 24,
        fontWeight: "450",
        marginBottom: 9,
    },
    gradientLine: {
        width: "90%",
        height: 4,
        marginBottom: 15,
    },
})
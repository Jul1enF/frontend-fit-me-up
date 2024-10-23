import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar, Platform } from 'react-native'
import { registerForPushNotificationsAsync } from "../../../modules/registerForPushNotificationsAsync"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState, useEffect } from 'react'

import FirstArticle from '../../../components/FirstArticle'
import Article from '../../../components/Article'

import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../../../reducers/user'



const screenHeight = Platform.OS === 'android' ? Dimensions.get('window').height + StatusBar.currentHeight : Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};



export default function Bookmarks() {

    const user = useSelector((state) => state.user.value)
    const articles = useSelector((state) => state.articles.value)
    const dispatch = useDispatch()

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // Fonction pour gérer les potentiels changement de push token

    const checkPushTokenChanges = async () => {

        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.push('/')
        }
        if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }


    //  État et fonction pour charger les articles

    const [articlesInfos, setArticlesInfos] = useState("")

    const loadArticles = () => {
        let bookmarkedArticles = []

        for (let article of articles) {
            for (let bookmark of user.bookmarks) {
                if (article._id === bookmark) {
                    bookmarkedArticles.push(article)
                }
            }
        }

        bookmarkedArticles.reverse()

        bookmarkedArticles.length > 0 ? setArticlesInfos(bookmarkedArticles) : setArticlesInfos('')
    }


    // useFocusEffect

    useFocusEffect(useCallback(() => {
        checkPushTokenChanges()
        loadArticles()
    }, [user, articles]))


    // Fonction appelée en cliquant sur un article

    const articlePress = (_id) => {
        router.push(`/bookmark-article/${_id}`)
    }


    // Affichage conditionnel si pas de favoris

    if (!articlesInfos) {
        return (
            <View style={styles.body2} >
                <Text style={styles.title}>Aucun article enregistré.</Text>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
                <Text style={styles.title}>Cliquez sur un article pour l'afficher et pouvoir l'enregistrer !</Text>
            </View>
        )
    }



    return (
        <View style={styles.body} contentContainerStyle={styles.contentBody}>
            <FlatList
                data={articlesInfos}
                renderItem={({ item, index }) => {
                    if (index === 0) {
                        return <TouchableOpacity onPress={() => articlePress(item._id)} ><FirstArticle {...item} /></TouchableOpacity>
                    }
                    else {
                        return <TouchableOpacity onPress={() => articlePress(item._id)} ><Article {...item} /></TouchableOpacity>
                    }
                }}
                contentContainerStyle={{ alignItems: 'center' }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "black",
        flex: 1,
    },
    body2: {
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        paddingLeft : RPW(4),
        paddingRight : RPW(4),
        paddingTop : 10,
    },
    title: {
        color: "#e0e0e0",
        fontSize: 23,
        fontWeight: "300",
        textAlign: "center",
        marginTop : 15,
    },
    gradientLine: {
        width: "97%",
        height: 4,
        borderRadius: 15,
        marginTop : 15
    },
})
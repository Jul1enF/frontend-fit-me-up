import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, StatusBar, Platform } from "react-native";
import { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { fillWithArticles, suppressArticles } from "../../../reducers/articles";
import { addTestArticle } from "../../../reducers/testArticle";
import { logout, changePushToken, toggleNewNotifications } from "../../../reducers/user";

import { registerForPushNotificationsAsync } from "../../../modules/registerForPushNotificationsAsync"
import { RPH, RPW } from "../../../modules/dimensions"

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";


import YoutubePlayer from "react-native-youtube-iframe";

import NetInfo from '@react-native-community/netinfo'


export default function Article() {

    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state) => state.articles.value)
    const user = useSelector((state) => state.user.value)

    const [article, setArticle] = useState('')

    const [error, setError] = useState('')



    // Fonction pour charger le contenu de la page

    const loadContent = async () => {
        if (testArticle.length > 0 && testArticle[0]?.category === "home" && user?.is_admin) {
            setArticle(testArticle[0])
        }
        else {
            // Envoi d'un token ou non en fonction de si l'utilisateur en a un
            let token = "noToken"

            if (user.token) {
                token = user.token
            }

            const state = await NetInfo.fetch()

            // Le chargement du reducer avec les articles téléchargés ne sera effectif qu'au prochain refresh. Utilisation d'une variable pour setter les articles avec ceux téléchargés plutôt que le reducer pas encore actualisé.
            let downloadedArticles

            if (state.isConnected) {

                const response = await fetch(`${url}/articles/getArticles/${token}`)

                const data = await response.json()
    
                if (data.result) {
                    dispatch(fillWithArticles(data.articles))
                    downloadedArticles = data.articles
                }
                else if (!data.result || data.err) {
                    dispatch(logout())
                    router.navigate('/')
                    return
                }
            }

            // Tri des articles par catégorie
            if (articles.length !== 0 || downloadedArticles) {
                downloadedArticles ? downloadedArticles.map(e => {
                    if (e.category === "home") {
                        setArticle(e)
                    }
                }) : articles.map(e => {
                    if (e.category === "home") {
                        setArticle(e)
                    }
                })
            }
        }
    }

    // useEffect pour charger les infos de la page avec la fonction précédente
    useEffect(() => {
        loadContent()
    }, [testArticle])


    // Fonction pour gérer les potentiels changement de push token

    const checkPushTokenChanges = async (pushToken, token) => {
        const state = await NetInfo.fetch()

        // Si utilisateur pas inscrit ou connecté
        if (!user.token || !state.isConnected) { return }

        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token, user.new_notifications)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.navigate('/')
        }
        if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
        if (pushTokenInfos?.toggleNewNotifications){
            dispatch(toggleNewNotifications())
        }
    }


    // useFocusEffect pour vérifier si les notifs sont toujours autorisées

    useFocusEffect(useCallback(() => {
        checkPushTokenChanges()
    }, [user]))




    // Fonction appelée en cliquant sur modifier

    const modifyPress = () => {

        dispatch(addTestArticle({
            title: article.title,
            sub_title: article.sub_title,
            text: article.text,
            video_id: article.video_id,
            category: article.category,
            img_link: article.img_link,
            img_margin_top: article.img_margin_top,
            img_margin_left: article.img_margin_left,
            img_zoom: article.img_zoom,
            img_public_id: article.img_public_id,
            createdAt: article.createdAt,
            _id: article._id,
            author: article.author,
            // test : true => Un article déjà posté n'a pas un _id "testArticleId" mais peut être mis en test. C'est donc cet indicateur qui sert à savoir ensuite si l'on affiche la page détaillée d'un article en test ou en BDD
            test: true,
        }))

        router.push('/redaction')
    }




    // Boutons pour modifications si l'utilsateur est admin

    let modifications

    if (user.is_admin) {
        modifications = (
            <View style={styles.btnContainer}>
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={styles.btn} onPress={() => modifyPress()}>
                        <Text style={styles.btnText}>Modifier</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
    }


    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["#19290a"]} progressBackgroundColor={"white"} tintColor={"#19290a"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadContent()
    }} />

    if (!article) { return <ScrollView style={{ flex: 1, backgroundColor: "#f9fff4" }} refreshControl={refreshComponent}></ScrollView> }



    return (

        <ScrollView style={styles.body} contentContainerStyle={styles.contentBody} refreshControl={refreshComponent}>
            <StatusBar translucent={true} barStyle="light" />
            <Text style={styles.categoryTitle}>Accueil</Text>
            <Text style={styles.title}>{article.title}</Text>
            {article.sub_title && <Text style={styles.subTitle}>{article.sub_title}</Text>}
            <LinearGradient
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientLine}
            >
            </LinearGradient>

            <View style={[styles.youtubeContainer, !article.video_id && { display: "none" }, !article.author && { marginBottom: 20 }]}>
                <YoutubePlayer
                    height={RPW(54.5)}
                    width={RPW(96)}
                    videoId={article.video_id}
                    initialPlayerParams={{ modestbranding: false }}
                />
            </View>

            {!article.video_id &&
                <View style={[styles.imgContainer, !article.author && { marginBottom: 20 }]} >
                    <Image
                        style={[styles.image, {
                            width: RPW(98 * article.img_zoom),
                            marginTop: RPW(article.img_margin_top * 0.98),
                            marginLeft: RPW(article.img_margin_left * 0.98)
                        }]}
                        source={{ uri: article.img_link }}
                    />
                </View>}


            <View style={styles.lineContainer}>
                {article.author && <Text style={styles.author}>par {article.author}</Text>}
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine2}
                >
                </LinearGradient>
            </View>
            {article.text && <Text style={styles.text}>{article.text}</Text>}

            <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

            <View style={styles.legalContainer1}>
                <TouchableOpacity style={styles.legalBth} onPress={() => router.push('/contact')}>
                    <Text style={styles.legalText}>
                        Contact
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legalBth} onPress={() => router.push('/legal')}>
                    <Text style={styles.legalText}>
                        CGU / Mentions légales
                    </Text>
                </TouchableOpacity>
            </View>

            {modifications}
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#f9fff4",
    },
    contentBody: {
        paddingTop: RPH(2),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        paddingBottom: 10,
    },
    categoryTitle: {
        color: '#9dcb00',
        fontSize: 32,
        fontWeight: "600",
        marginBottom: 3,
    },
    title: {
        color: "#19290a",
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 18,
    },
    subTitle: {
        color: "#19290a",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 18,
    },
    gradientLine: {
        width: "83%",
        height: 4.5,
        marginBottom: 20,
        borderRadius: 15,
    },
    imgContainer: {
        width: RPW(98),
        height: RPW(54),
        overflow: "hidden",
        justifyContent: "center",
        marginBottom: 12,
    },
    image: {
        height: RPW(1000),
        resizeMode: "contain",
    },
    youtubeContainer: {
        marginBottom: 5,
    },
    lineContainer: {
        alignItems: "flex-end",
        width: "100%",
        marginBottom: 25,
    },
    author: {
        color: "#19290a",
        fontSize: 12,
        fontWeight: "450",
        marginBottom: 8,
    },
    gradientLine2: {
        width: "83%",
        height: 4,
        borderRadius: 15,
    },
    text: {
        color: "#19290a",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 25,
    },
    btnContainer: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "center"
    },
    gradientBtn: {
        width: "40%",
        height: 45,
        borderRadius: 10,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: "white",
        fontSize: RPW(4.8),
        fontWeight: "500",
    },
    legalContainer1: {
        paddingRight: RPW(7),
        paddingLeft: RPW(7),
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 30,
        marginTop: 30
    },
    legalBth: {
        borderBottomColor: "#19290a",
        borderBottomWidth: 1,
        paddingBottom: 2,
    },
    legalText: {
        color: "#19290a",
        fontSize: 12,
    },
})
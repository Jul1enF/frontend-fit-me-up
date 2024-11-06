import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { fillWithArticles, suppressArticles } from "../../../reducers/articles";
import { addTestArticle } from "../../../reducers/testArticle";
import { logout } from "../../../reducers/user";

import { registerForPushNotificationsAsync } from "../../../modules/registerForPushNotificationsAsync"
import { RPH, RPW } from "../../../modules/dimensions"

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";


import YoutubePlayer from "react-native-youtube-iframe";


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
        if (testArticle.length > 0 && testArticle[0].category === "home" && user.is_admin) {
            console.log("Hello")
            setArticle(testArticle[0])
        }
        else {
            const response = await fetch(`${url}/articles/getArticles/${user.token}`)

            const data = await response.json()

            if (data.result) {
                dispatch(fillWithArticles(data.articles))

                data.articles.map(e => {
                    if (e.category === "home") {
                        setArticle(e)
                    }
                })
            }
            else if (!data.result && data.error == "Utilisateur bloqué.") {
                dispatch(suppressArticles())
                setArticle("")
            }
        }
    }



    // useEffect pour charger les infos de la page avec la fonction précédente
    useEffect(() => {
        loadContent()
    }, [testArticle])




    // Fonction pour gérer les potentiels changement de push token

    const checkPushTokenChanges = async (pushToken, token) => {
        const pushTokenInfos = await registerForPushNotificationsAsync(pushToken, token)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.navigate('/')
        }
        if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }


    // useFocusEffect pour vérifier si les notifs sont toujours autorisées

    useFocusEffect(useCallback(() => {
        user.token && checkPushTokenChanges(user.push_token, user.token)
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
                    colors={['#7700a4', '#0a0081']}
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

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["white"]} tintColor={"white"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadContent()
    }} />

    if (!article) { return <ScrollView style={{ flex: 1, backgroundColor: "black" }} refreshControl={refreshComponent}></ScrollView> }



    return (

        <ScrollView style={styles.body} contentContainerStyle={styles.contentBody} refreshControl={refreshComponent}>
            <StatusBar translucent={true} barStyle="light" />
            <Text style={styles.categoryTitle}>Accueil</Text>
            <Text style={styles.title}>{article.title}</Text>
            {article.sub_title && <Text style={styles.subTitle}>{article.sub_title}</Text>}
            <LinearGradient
                colors={['#7700a4', '#0a0081']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientLine}
            >
            </LinearGradient>

            <View style={[styles.youtubeContainer, !article.video_id && { display: "none" }, !article.author && { marginBottom: 25 }]}>
                <YoutubePlayer
                    height={RPW(54.5)}
                    width={RPW(96)}
                    videoId={article.video_id}
                />
            </View>

            {!article.video_id &&
                <View style={[styles.imgContainer, !article.author && { marginBottom: 25 }]} >
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
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
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
                <TouchableOpacity style={styles.legalBth}>
                    <Text style={styles.legalText}>
                        Contacts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legalBth}>
                    <Text style={styles.legalText}>
                        Mentions légales
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legalBth}>
                    <Text style={styles.legalText}>
                        CGU
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
        backgroundColor: "black",
    },
    contentBody: {
        paddingTop: RPH(2),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        paddingBottom: 10,
    },
    categoryTitle: {
        color: '#7700a4',
        fontSize: 32,
        fontWeight: "600",
        marginBottom: 3,
    },
    title: {
        color: "#e0e0e0",
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 18,
    },
    subTitle: {
        color: "#e0e0e0",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 18,
    },
    gradientLine: {
        width: "83%",
        height: 4.5,
        marginBottom: 18,
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
        color: "#e0e0e0",
        fontSize: 12,
        fontWeight: "450",
        marginBottom: 15,
    },
    gradientLine2: {
        width: "83%",
        height: 4,
        borderRadius: 15,
    },
    text: {
        color: "#e0e0e0",
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
        paddingRight : RPW(7),
        paddingLeft : RPW(7),
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom : 30,
        marginTop : 30
    },
    legalBth: {
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        paddingBottom : 2,
    },
    legalText: {
        color: "grey",
    },
})
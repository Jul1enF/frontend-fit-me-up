import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { removeBookmark } from "../../../../reducers/user";

import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import YoutubePlayer from "react-native-youtube-iframe";
import moment from 'moment/min/moment-with-locales'

const screenHeight = Platform.OS === 'android' ? Dimensions.get('window').height + StatusBar.currentHeight : Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};


export default function BookmarkArticle() {

    const { bookmark } = useLocalSearchParams()
    const _id = bookmark[0]

    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const articles = useSelector((state) => state.articles.value)
    const user = useSelector((state) => state.user.value)

    const [article, setArticle] = useState('')
    const [isBookmarked, setIsBookmarked] = useState(true)

    const [error, setError] = useState('')


    // useFocusEffect pour rediriger si l'article n'est pas dans les favoris

    useFocusEffect(useCallback(() => {
        if (!user.bookmarks.includes(_id)) {
            router.navigate('/bookmarks')
            return
        }
    }, [user]))

    // useEffect pour charger les infos de l'article
    useEffect(() => {
        articles.map(e => {
            e._id === _id && setArticle(e)
        })
    }, [])

    // Affichage conditionnel du nom de la catégory
    let category

    if (article.category === "recipes") { category = "Recette" }
    else if (article.category === "exercices") { category = "Exercice" }
    else if (article.category === "events") { category = "Évènement" }


    // Fonction appelée en cliquant sur retirer des favoris
    const bookmarkPress = async () => {

        const response = await fetch(`${url}/userModifications/removeBookmark`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jwtToken: user.token,
                _id,
            })
        })
        const data = await response.json()

        if (!data.result) {
            setError(data.error)
            setTimeout(() => setError(''), "4000")
        }
        else {
            dispatch(removeBookmark(_id))
            router.navigate('/bookmarks')
        }
    }


    moment.locale('fr')
    const date = moment(article.createdAt).format('LL')
    const hour = moment(article.createdAt).format('LT')

    if (!article){return <View></View>}

    return (
        <View style={styles.body}>
            <StatusBar translucent={true} barStyle="light"/>
            <LinearGradient
                colors={['#7700a4', '#0a0081']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.navigate('/bookmarks')}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPH(2.5)} style={styles.icon} />
                    <Text style={styles.headerText} >Favoris</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerSection2} onPress={() => bookmarkPress()}>
                    <Text style={styles.headerText} >{isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}</Text>
                    <Icon name={isBookmarked ? "heart-remove" : "heart-plus"} size={RPH(2.9)} color={isBookmarked ? "#ff00e8" : "white"} style={styles.icon2} />
                </TouchableOpacity>
            </LinearGradient>

            <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}>
                <Text style={styles.categoryTitle}>{category}</Text>
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
                <Text style={styles.date}>Posté le {date} à {hour}</Text>

                <View style={[styles.imgContainer, !article.author && { marginBottom: 25 }]} >
                    <Image
                        style={[styles.image, {
                            width: RPW(98 * article.img_zoom),
                            marginTop: RPW(article.img_margin_top * 0.98),
                            marginLeft: RPW(article.img_margin_left * 0.98)
                        }]}
                        source={{ uri: article.img_link, }}
                    />
                </View>

                <View style={styles.lineContainer}>
                    {article.author && <Text style={styles.date}>par {article.author}</Text>}
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
                <YoutubePlayer
                    height={RPW(56)}
                    width={RPW(98)}
                    videoId={article.video_id}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        height: RPH(6),
        width: RPW(100),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerSection: {
        width: RPW(30),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        marginRight: RPW(3)
    },
    headerSection2: {
        width: RPW(55),
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    icon2: {
        marginLeft: RPW(3)
    },
    headerText: {
        color: "white",
        fontWeight: "500",
        fontSize: RPH(2.3)
    },
    contentBody: {
        paddingTop: RPH(1),
        paddingLeft: RPW(1),
        paddingRight: RPW(1),
        paddingBottom: 10,
    },
    categoryTitle: {
        color: '#7700a4',
        fontSize: 32,
        fontWeight: "600",
        marginBottom: 2,
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
    date: {
        color: "#e0e0e0",
        fontSize: 12,
        fontWeight: "450",
        marginBottom: 12,
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
})
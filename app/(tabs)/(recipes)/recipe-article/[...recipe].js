import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "../../../../reducers/user";
import { addTestArticle } from "../../../../reducers/testArticle";

import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import Modal from "react-native-modal"
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


export default function Article() {

    const { recipe } = useLocalSearchParams()
    const _id = recipe[0]

    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state) => state.articles.value)
    const user = useSelector((state) => state.user.value)

    const [article, setArticle] = useState('')
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const [error, setError] = useState('')


    // useEffect pour charger les infos de l'article
    useEffect(() => {
        if (_id === "testArticleId") {
            setArticle(testArticle[0])
        } else {
            articles.map(e => {
                e._id === _id && setArticle(e)
            })
        }
    }, [user])


    // useFocusEffect pour vérifier si l'article est en favoris, naviguer vers recette si l'article test a été supprimé ou si un nouveau a été mis en test

    useFocusEffect(useCallback(() => {
        user.bookmarks.includes(_id) ? setIsBookmarked(true) : setIsBookmarked(false)

        if (_id === "testArticleId" && testArticle.length === 0) { router.navigate('/recipes') }

        if (testArticle.length > 0 && _id !== "testArticleId") { router.navigate('/recipes') }
    }, [user, testArticle]))


    // Fonction appelée en cliquant sur l'icone favoris
    const bookmarkPress = async () => {
        if (_id === "testArticleId") {
            return
        }
        if (!isBookmarked) {
            const response = await fetch(`${url}/userModifications/addBookmark`, {
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
                setIsBookmarked(true)
                dispatch(addBookmark(_id))
            }
        }
        else {
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
                setIsBookmarked(false)
                dispatch(removeBookmark(_id))
            }
        }
    }


    // Fonction appelée en cliquant sur modifier

    const modifyPress = () => {

        dispatch(addTestArticle({
            title: article.title,
            sub_title: article.sub_title,
            text: article.text,
            video_id: article.video_id,
            category: article.category,
            img_link: article.img_link,
            img_margin_top : article.img_margin_top,
            img_margin_left : article.img_margin_left,
            img_zoom : article.img_zoom,
            img_public_id : article.img_public_id,
            createdAt: article.createdAt,
            _id: article._id,
            author: article.author,
            // test : true => Un article déjà posté n'a pas un _id "testArticleId" mais peut être mis en test. C'est donc cet indicateur qui sert à savoir ensuite si l'on affiche la page détaillée d'un article en test ou en BDD
            test: true,
        }))

        router.push('/redaction')
    }



    // Fonction appelée en cliquant sur Supprimer

    const deletePress = async () => {
        const response  = await fetch(`${url}/articles/delete-article/${user.token}/${article._id}`, { method: 'DELETE' })

        const data = await response.json()

        if (!data.result && data.error){
            setError(data.error)
            setTimeout(() => setError(''), "4000")
        }
        else if (!data.result){
            setError("Problème de connexion à la base de donnée, merci de contacter le webmaster.")
            setTimeout(() => setError(''), "4000")
        }
        else {
            setModalVisible(false)
            router.navigate('/recipes')
        }
    }


    // Boutons pour modifications si l'utilsateur est admin

    let modifications

    if (user.is_admin && _id !== "testArticleId") {
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
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                        <Text style={styles.btnText}>Supprimer</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
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
                <TouchableOpacity style={styles.headerSection} onPress={() => router.navigate('/recipes')}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPH(2.5)} style={styles.icon} />
                    <Text style={styles.headerText}>Recettes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerSection2} onPress={() => bookmarkPress()}>
                    <Text style={styles.headerText} >{isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}</Text>
                    <Icon name={isBookmarked ? "heart-remove" : "heart-plus"} size={RPH(2.9)} color={isBookmarked ? "#ff00e8" : "white"} style={styles.icon2} />
                </TouchableOpacity>
            </LinearGradient>

            <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}>
                <Text style={styles.categoryTitle}>Recette</Text>
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
                        source={{ uri: article.img_link }}
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
                <View style={[styles.youtubeContainer, !article.video_id && { display: "none" }]}>
                    <YoutubePlayer
                        height={RPW(56)}
                        width={RPW(98)}
                        videoId={article.video_id}
                    />
                </View>

                <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

                {modifications}
            </ScrollView>

            <Modal
                isVisible={modalVisible}
                style={styles.modal}
                backdropColor="transparent"
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackButtonPress={() => setModalVisible(!modalVisible)}
                onBackdropPress={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.modalBody}>
                    <Text style={styles.modalText}>Êtes vous sûr de vouloir supprimer cet article ?</Text>
                    <View style={styles.btnContainer}>
                        <LinearGradient
                            colors={['#7700a4', '#0a0081']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientBtn}
                        >
                            <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Annuler</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#7700a4', '#0a0081']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientBtn}
                        >
                            <TouchableOpacity style={styles.btn} onPress={() => deletePress()}>
                                <Text style={styles.btnText}>Supprimer</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>

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
    btnContainer: {
        marginTop: 35,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-evenly"
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
    modal : {
        alignItems : "center"
    },
    modalBody : {
        height: RPH(27),
        width: RPW(90),
        borderRadius : 10,
        paddingTop : RPH(4),
        paddingBottom : RPH(4),
        backgroundColor: "#2e2e2e",
        position: "absolute",
        bottom: RPH(11),
        justifyContent : "space-between"
    },
    modalText : {
        color : "white",
        fontSize : RPW(4.5),
        fontWeight : "600",
        textAlign : "center",
        paddingLeft : RPW(6),
        paddingRight : RPW(6),
        lineHeight : RPH(4)
    }
})
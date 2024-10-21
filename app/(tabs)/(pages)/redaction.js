import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Platform, ScrollView, PanResponder } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addTestArticle, deleteTestArticle } from "../../../reducers/testArticle";
import { router, useFocusEffect } from 'expo-router'

import * as ImagePicker from 'expo-image-picker'
import Slider from '@react-native-community/slider'

import JWT, { SupportedAlgorithms } from 'expo-jwt';
const jwtKey = process.env.EXPO_PUBLIC_JWT_KEY

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

export default function Redaction() {

    const dispatch = useDispatch()
    const testArticle = useSelector((state) => state.testArticle.value)
    const user = useSelector((state) => state.user.value)

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    // useFocusEffect pour ne pas avoir resizing true en revenant sur la page

    useFocusEffect(useCallback(() => {
        resizingRef.current = false
        setResizing(false)
    }, [resizing, resizingRef]))

    
    // useEffect pour charger dans les états un article test

    useEffect(() => {
        if (testArticle.length > 0) {
            setTitle(testArticle[0].title)
            testArticle[0].sub_title && setSubTitle(testArticle[0].sub_title)
            testArticle[0].text && setText(testArticle[0].text)
            testArticle[0].video_id && setVideoId(testArticle[0].video_id)
            setCategory(testArticle[0].category)
            setPictureUri(testArticle[0].img_link)
            setAuthor(testArticle[0].author)
            setImgPublicId(testArticle[0].img_public_id)
            setImgMarginTop(testArticle[0].img_margin_top)
            setImgMarginLeft(testArticle[0].img_margin_left)
            setImgZoom(testArticle[0].img_zoom)
        }
    }, [testArticle])


    // États pour les inputs et la photo choisie

    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [text, setText] = useState('')
    const [author, setAuthor] = useState('')
    const [videoId, setVideoId] = useState('')
    const [category, setCategory] = useState('')
    const [pictureUri, setPictureUri] = useState("")
    const [imgPublicId, setImgPublicId] = useState('')

    // États pour le racadrage de l'image
    const [imgMarginTop, setImgMarginTop] = useState(0)
    const [imgMarginLeft, setImgMarginLeft] = useState(0)
    const [imgZoom, setImgZoom] = useState(1)

    // useRef pour valeurs de départs de la marge de l'image et de son agrandissement

    const imgMarginTopRef = useRef(0)
    const imgMarginLeftRef = useRef(0)
    const fingerDistanceRef = useRef(0)
    const imgZoomRef = useRef(1)
    const finalImgZoomRef = useRef(1)


    // États / ref pour l'erreur, pouvoir recadrer, et arrêter défilement scrollview en cliquant sur la view de l'image pour la régler

    const [error, setError] = useState('')
    const resizingRef = useRef(false)
    const [resizing, setResizing] = useState(false)
    const [scrollable, setScrollable] = useState(true)




    // Fonction appelée en cliquant sur Choisir une image

    const choosePicture = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [1, 1],
            quality: 0.75,
        });

        if (!result.canceled) {
            setPictureUri(result.assets[0].uri);
            // Remise à zéro des états et ref pour recadrage
            imgMarginTopRef.current = 0
            imgMarginLeftRef.current = 0
            fingerDistanceRef.current = 0
            imgZoomRef.current = 1
            finalImgZoomRef.current = 1
            setImgMarginTop(0)
            setImgMarginLeft(0)
            setImgZoom(1)

            resizingRef.current = false
            setResizing(false)
        }
    };




    // PanResponder pour ajuster l'image

    const panResponder = useRef(
        PanResponder.create({
            // Engreistrement des pans que si resizing == true
            onMoveShouldSetPanResponder: () => resizingRef.current,
            onPanResponderGrant: (event, gesture) => {
                // Arrêt du scroll de ScrollView
                setScrollable(false)

                // Deux doigts sont utilisés
                if (event.nativeEvent.touches.length > 1) {
                    // Référence écartement des doigts pour le zoom
                    const [touch1, touch2] = event.nativeEvent.touches
                    fingerDistanceRef.current = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) +
                        Math.pow(touch2.pageY - touch1.pageY, 2)
                    )
                    // Nouvelle référence pour calcul du zoom (Pas possible de faire autrement qu'en utilisant une 2ème ref : Impossible d'accéder ici à la valeur d'un état et impossible d'accéder aux valeurs de calcul dans onRelease)
                    imgZoomRef.current = finalImgZoomRef.current
                }
            },
            onPanResponderMove: (event, gesture) => {
                // Deux doigts sont utilisés (zoom)
                if (event.nativeEvent.touches.length > 1) {
                    const [touch1, touch2] = event.nativeEvent.touches
                    const distance = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) +
                        Math.pow(touch2.pageY - touch1.pageY, 2)
                    )

                    setImgZoom(imgZoomRef.current - (1 - (distance / fingerDistanceRef.current)))

                    finalImgZoomRef.current = imgZoomRef.current - (1 - (distance / fingerDistanceRef.current))
                    return
                }
                // Un seul doigt est utilisé (recadrage)
                setImgMarginTop(imgMarginTopRef.current + gesture.dy)
                setImgMarginLeft(imgMarginLeftRef.current + gesture.dx / 2)
            },
            onPanResponderRelease: (event, gesture) => {
                // Reprise du scroll de ScrollView
                setScrollable(true)

                // Actualisation des refs de marge grâce aux données
                imgMarginTopRef.current += gesture.dy
                imgMarginLeftRef.current += gesture.dx / 2
            },
        }),
    ).current;




    // Fonction appelée en cliquant sur Annuler recadrage

    const cancelResizingPress = () => {
        resizingRef.current = false
        setResizing(false)
        imgMarginTopRef.current = 0
        imgMarginLeftRef.current = 0
        fingerDistanceRef.current = 0
        imgZoomRef.current = 1
        finalImgZoomRef.current = 1
        setImgMarginTop(0)
        setImgMarginLeft(0)
        setImgZoom(1)
    }



    // Fonction appelée en cliquant sur Tester

    const testPress = () => {
        if (!title || !category || !pictureUri) {
            setError('Erreur : titre, catégorie et photo obligatoires.')
            setTimeout(() => setError(''), "4000")
            return
        }

        const date = testArticle.length > 0 ? testArticle[0].createdAt : new Date()
        const _id = testArticle.length > 0 ? testArticle[0]._id : "testArticleId"

        dispatch(addTestArticle({
            title,
            sub_title: subTitle,
            text,
            video_id: videoId,
            category,
            img_link: pictureUri,
            img_margin_top: imgMarginTop,
            img_margin_left: imgMarginLeft,
            img_zoom: imgZoom,
            img_public_id: imgPublicId,
            createdAt: date,
            _id,
            author,
            // test : true => Un article déjà posté n'a pas un _id "testArticleId" mais peut être mis en test. C'est donc cet indicateur qui sert à savoir ensuite si l'on affiche la page détaillée d'un article en test ou en BDD
            test: true,
        }))

        setResizing(false)
        router.push(`/${category}`)
    }



    // Fonction appelée en cliquant sur Annuler (ou juste pour annuler)

    const cancelPress = () => {
        setTitle('')
        setSubTitle('')
        setText('')
        setCategory('')
        setPictureUri('')
        setVideoId('')
        setAuthor('')
        setImgPublicId('')
        imgMarginTopRef.current = 0
        imgMarginLeftRef.current = 0
        fingerDistanceRef.current = 0
        imgZoomRef.current = 1
        finalImgZoomRef.current = 1
        setImgMarginTop(0)
        setImgMarginLeft(0)
        setImgZoom(1)
        dispatch(deleteTestArticle())
        setResizing(false)

    }



    // Fonction appelée en cliquant sur Publier

    const publishPress = async () => {
        if (!title || !category || !pictureUri) {
            setError('Erreur : titre, catégorie et photo obligatoires.')
            setTimeout(() => setError(''), "4000")
            return
        }

        // Mise en forme des inputs pour leur envoi
        const _id = testArticle.length > 0 ? testArticle[0]._id : "testArticleId"
        const date = testArticle.length > 0 ? testArticle[0].createdAt : new Date()
        const uri = pictureUri

        const localPic = pictureUri.includes('https') ? false : true

        const formData = new FormData()

        formData.append('articlePicture', {
            uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        })

        // Encodage en jwt pour obtenir un string à passer en param, garder des types booléens etc... et gérer les cas où les inputs n'ont pas été remplis

        const articleData = JWT.encode({
            title,
            sub_title: subTitle,
            text,
            author,
            video_id: videoId,
            category,
            date,
            _id,
            jwtToken: user.token,
            localPic,
            img_link: pictureUri,
            img_public_id: imgPublicId,
            img_margin_top: imgMarginTop,
            img_margin_left: imgMarginLeft,
            img_zoom: imgZoom,
        }, jwtKey)

        const response = await fetch(`${url}/articles/save-article/${articleData}`, {
            method: 'POST',
            body: formData,
        })

        const data = await response.json()

        if (data.result) {
            cancelPress()
        }
        else if (data.error) {
            setError(data.error)
            setTimeout(() => setError(''), "4000")
        }
        else {
            setError("Problème de connexion, merci de voir avec le webmaster")
            setTimeout(() => setError(''), "4000")
        }
    }



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14.5)}  >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", paddingTop: RPH(2), paddingBottom: RPH(2) }} scrollEnabled={scrollable} >
                <TextInput style={styles.smallInput}
                    placeholder="Titre de l'article"
                    onChangeText={(e) => setTitle(e)}
                    value={title}>
                </TextInput>
                <TextInput multiline={true}
                    textAlignVertical="top"
                    style={styles.mediumInput}
                    placeholder="Sous-Titre de l'article"
                    onChangeText={(e) => setSubTitle(e)}
                    value={subTitle}
                    blurOnSubmit={true}>
                </TextInput>
                <TextInput multiline={true}
                    textAlignVertical="top"
                    style={styles.largeInput}
                    placeholder="Texte de l'article"
                    onChangeText={(e) => setText(e)}
                    value={text}
                    returnKeyType='next'>
                </TextInput>
                <TextInput style={styles.smallInput}
                    placeholder="Auteur"
                    onChangeText={(e) => setAuthor(e)}
                    value={author}>
                </TextInput>
                <TextInput style={styles.smallInput}
                    placeholder="ID Youtube de la vidéo"
                    onChangeText={(e) => setVideoId(e)}
                    value={videoId}
                >
                </TextInput>


                <View style={styles.row}>
                    <Text style={styles.categoryText}>Type :</Text>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn1}
                    >
                        <TouchableOpacity style={[styles.btn, category === "recipes" && { backgroundColor: "transparent" }]} onPress={() => setCategory("recipes")}>
                            <Text style={styles.categoryText}>Recette</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn1}
                    >
                        <TouchableOpacity style={[styles.btn, category === "exercices" && { backgroundColor: "transparent" }]} onPress={() => setCategory("exercices")}>
                            <Text style={styles.categoryText}>Exercice</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn1}
                    >
                        <TouchableOpacity style={[styles.btn, category === "events" && { backgroundColor: "transparent" }]} onPress={() => setCategory("events")}>
                            <Text style={styles.categoryText}>Évènement</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>


                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn2}
                >
                    <TouchableOpacity style={styles.btn2} onPress={() => choosePicture()}>
                        <Text style={styles.btnText}>Choisir une image</Text>
                    </TouchableOpacity>
                </LinearGradient>


                <View style={[styles.imgContainer, resizing && { borderColor: "white" }]} {...panResponder.panHandlers} >
                    {pictureUri &&
                        <Image
                            style={[styles.image, {
                                width: RPW(95 * imgZoom),
                                marginTop: RPW(imgMarginTop * 0.95),
                                marginLeft: RPW(imgMarginLeft * 0.95)
                            }]}
                            source={{ uri: pictureUri }}
                        />
                    }
                </View>

                <View style={styles.row}>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn4}
                    >
                        <TouchableOpacity style={resizing ? styles.btn2 : styles.btn} onPress={() => {
                            resizingRef.current = !resizingRef.current
                            setResizing(!resizing)
                        }}>
                            <Text style={styles.btn2Text}> Recadrer l'image</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn4}
                    >
                        <TouchableOpacity style={styles.btn} onPress={() => cancelResizingPress()}>
                            <Text style={styles.btn2Text}> Cadre original</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>


                <View style={styles.row}>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn3}
                    >
                        <TouchableOpacity style={styles.btn2} onPress={() => testPress()}>
                            <Text style={styles.btnText}>Tester</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn3}
                    >
                        <TouchableOpacity style={styles.btn2} onPress={() => publishPress()}>
                            <Text style={styles.btnText}>Publier</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn3}
                    >
                        <TouchableOpacity style={styles.btn2} onPress={() => cancelPress()}>
                            <Text style={styles.btnText}>Annuler</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>



                <Text style={{ color: 'red' }}>{error}</Text>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
    },
    smallInput: {
        backgroundColor: "white",
        width: RPW(90),
        height: 35,
        borderRadius: RPW(2.5),
        paddingLeft: RPW(2),
        fontSize: 19,
        marginBottom: 22
    },
    mediumInput: {
        backgroundColor: "white",
        width: RPW(90),
        height: 85,
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: 19,
        marginBottom: 22,
    },
    largeInput: {
        backgroundColor: "white",
        width: RPW(90),
        height: 145,
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: 19,
        marginBottom: 22,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: RPW(90),
        marginBottom: 18,
    },
    categoryText: {
        color: "white",
        fontSize: RPW(4.2),
        fontWeight: "500"
    },
    gradientBtn1: {
        width: "27%",
        height: 45,
        borderRadius: 10,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "black",
        margin: 2,
        borderRadius: 10,
    },
    btnText: {
        color: "white",
        fontSize: RPW(4.8),
        fontWeight: "500",
    },
    row2: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: RPW(100),
    },
    column: {
        width: RPW(43),
        height: 180,
        alignItems: "center",
        justifyContent: "space-between"
    },
    gradientBtn2: {
        width: "60%",
        height: 45,
        borderRadius: 10,
        marginBottom: 22,
    },
    btn2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientBtn3: {
        width: "30%",
        height: 45,
        borderRadius: 10,
        marginBottom: 20,
    },
    btn2Text: {
        color: "white",
        fontSize: RPW(4.5),
        fontWeight: "500",
    },
    gradientBtn4: {
        width: RPW(43),
        height: 45,
        borderRadius: 10,
        marginBottom: 10,
    },
    imgContainer: {
        width: RPW(95),
        height: RPW(52.25),
        borderWidth: 1.5,
        marginBottom: 20,
        overflow: "hidden",
        justifyContent: "center",
        backgroundColor : "#171717",
    },
    image: {
        height: RPW(600),
        resizeMode: "contain",
    },
})
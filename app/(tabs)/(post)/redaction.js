import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Platform, ScrollView, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addTestArticle, deleteTestArticle } from "../../../reducers/testArticle";

import * as ImagePicker from 'expo-image-picker'

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
    const testArticle = useSelector((state)=>state.testArticle.value)


    // useEffect pour charger dans les états un article test

    useEffect(()=>{
        if (testArticle.length>0){
            setTitle(testArticle[0].title)
            testArticle[0].sub_title && setSubTitle(testArticle[0].sub_title)
            testArticle[0].text && setText(testArticle[0].text)
            testArticle[0].video_id && setVideoId(testArticle[0].video_id)
            setCategory(testArticle[0].category)
            setPictureUri(testArticle[0].pictureUri)
        }
    }, [testArticle])


    // États pour les inputs et la photo choisie, ainsi que offset keyboard

    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [text, setText] = useState('')
    const [videoId, setVideoId] = useState('')
    const [category, setCategory] = useState('')

    const [pictureUri, setPictureUri] = useState("")

    const [offsetKeyboard, setOffsetKeyboard] = useState(0)
    const [toolbarVisible, setToolbarVisible] = useState(false)


    // Fonction appelée en cliquant sur Choisir une image

    const choosePicture = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.75,
        });

        if (!result.canceled) {
            setPictureUri(result.assets[0].uri);
        }
    };


    // Fonction appelée en cliquant sur Enregistrer

    const registerPress = () => {
        if (!title || !category || !pictureUri) { return }

        const date = testArticle.length>0 ? testArticle[0].createdAt : new Date()
        const _id = testArticle.length>0 ? testArticle[0]._id : "testArticleId"
        
        dispatch(addTestArticle({
            title,
            sub_title : subTitle,
            text,
            video_id : videoId,
            category,
            pictureUri,
            createdAt : date,
            _id,
            test : true,
        }))
    }


    // Fonction appelée en cliquant sur poster (RAJOUTER L'ID POUR MODIF SI PRÉSENTE DANS TESTARTICLE)


    // Fonction appelée en cliquant sur annuler

    const cancelPress = () => {
        setTitle('')
        setSubTitle('')
        setText('')
        setCategory('')
        setPictureUri('')
        setVideoId('')
        dispatch(deleteTestArticle())
    }

    // keyboardVerticalOffset={offsetKeyboard}

    return (
        <KeyboardAvoidingView
            behavior="height" style={styles.body} keyboardVerticalOffset={offsetKeyboard} >
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TextInput style={styles.smallInput}
                    placeholder="Titre de l'article"
                    onChangeText={(e) => setTitle(e)}
                    value={title}
                    onFocus={() => setOffsetKeyboard(-RPH(15))}
                    onBlur={() => setOffsetKeyboard(0)}>
                </TextInput>
                <TextInput multiline={true}
                    textAlignVertical="top"
                    style={styles.mediumInput}
                    placeholder="Sous-Titre de l'article"
                    onChangeText={(e) => setSubTitle(e)}
                    value={subTitle}
                    onFocus={() => setOffsetKeyboard(-RPH(15))}
                    onBlur={() => setOffsetKeyboard(0)}
                    blurOnSubmit={true}>
                </TextInput>
                <TextInput multiline={true}
                    textAlignVertical="top"
                    style={styles.largeInput}
                    placeholder="Texte de l'article"
                    onChangeText={(e) => setText(e)}
                    value={text}
                    onFocus={() => {
                        setOffsetKeyboard(RPH(8))
                        setToolbarVisible(true)
                    }}
                    onBlur={() => {
                        setOffsetKeyboard(0)
                        setToolbarVisible(false)
                    }}
                    returnKeyType='next'>
                </TextInput>
                <TextInput style={styles.smallInput}
                    placeholder="ID Youtube de la vidéo"
                    onChangeText={(e) => setVideoId(e)}
                    value={videoId}
                    onFocus={() => setOffsetKeyboard(-RPH(1))}
                    onBlur={() => setOffsetKeyboard(0)}
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


                <View style={styles.row2}>
                    <View style={styles.column}>
                        <LinearGradient
                            colors={['#7700a4', '#0a0081']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientBtn2}
                        >
                            <TouchableOpacity style={styles.btn} onPress={() => choosePicture()}>
                                <Text style={styles.btnText}>Choisir une image</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <View style={styles.imgContainer}>
                            {pictureUri &&
                                <Image
                                    style={styles.image}
                                    source={{ uri: pictureUri }}
                                />}
                        </View>
                    </View>

                    <View style={styles.column}>
                        <LinearGradient
                            colors={['#7700a4', '#0a0081']}
                            locations={[0.05, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientBtn2}
                        >
                            <TouchableOpacity style={styles.btn2} onPress={() => registerPress()}>
                                <Text style={styles.btnText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn2}
                    >
                        <TouchableOpacity style={styles.btn2}>
                            <Text style={styles.btnText}>Poster</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#7700a4', '#0a0081']}
                        locations={[0.05, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientBtn2}
                    >
                        <TouchableOpacity style={styles.btn2} onPress={()=>cancelPress()}>
                            <Text style={styles.btnText}>Annuler</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    </View>
                </View>

                {/* Keyboard Toolbar */}
                <KeyboardAvoidingView behavior='position' style={{ width: RPW(100) }} keyboardVerticalOffset={RPH(4)}>
                    <View style={[styles.toolbar, !toolbarVisible && { display: "none" }]}>
                        <Text style={styles.toolbarText}> Retour </Text>
                    </View>
                </KeyboardAvoidingView>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: RPH(2),
        paddingBottom: RPH(2)
    },
    smallInput: {
        backgroundColor: "white",
        width: RPW(90),
        height: RPH(5),
        borderRadius: RPW(2.5),
        paddingLeft: RPW(2),
        fontSize: RPH(2.5),
        marginBottom: RPH(2)
    },
    mediumInput: {
        backgroundColor: "white",
        width: RPW(90),
        height: RPH(10),
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: RPH(2.5),
        marginBottom: RPH(2),
    },
    largeInput: {
        backgroundColor: "white",
        width: RPW(90),
        height: RPH(17),
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: RPH(2.5),
        marginBottom: RPH(2),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: RPW(90),
        marginBottom: RPH(2),
    },
    categoryText: {
        color: "white",
        fontSize: RPW(4.2),
        fontWeight: "500"
    },
    gradientBtn1: {
        width: "27%",
        height: RPH(5.5),
        borderRadius: 10,
    },
    row2: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: RPW(90),
    },
    column : {
        width : RPW(43),
        height : RPH(19),
        alignItems : "center",
        justifyContent : "space-between"
    },
    gradientBtn2: {
        width: "100%",
        height: RPH(5.5),
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
    btn2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        width: "100%",
        height: RPH(12),
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        alignSelf: "center",
    },
    toolbar: {
        height: RPH(8),
        width: RPW(100),
        backgroundColor: '#eeeeee',
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    toolbarText: {
        fontSize: RPH(2.8),
        fontWeight: "600",
        color: "black",
        padding: RPH(2)
    }

})
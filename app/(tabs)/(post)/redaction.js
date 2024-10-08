import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from 'react'
import { useDispatch } from "react-redux";
import { addTestArticle } from "../../../reducers/testArticles";

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


    // États pour les inputs et la photo choisie

    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [text, setText] = useState('')
    const [videoId, setVideoId] = useState('')

    const [pictureUri, setPictureUri] = useState("")

    // Fonction appelée en cliquant sur Choisir une image

    const choosePicture = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPictureUri(result.assets[0].uri);
        }
    };



    return (
        <View style={styles.body}>
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
                value={subTitle}>
            </TextInput>
            <TextInput multiline={true}
                textAlignVertical="top"
                style={styles.largeInput}
                placeholder="Texte de l'article"
                onChangeText={(e) => setText(e)}
                value={text} >
            </TextInput>
            <TextInput style={styles.smallInput}
                placeholder="ID Youtube de la vidéo"
                onChangeText={(e) => setVideoId(e)}
                value={videoId}>
            </TextInput>
            <View style={styles.row}>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={styles.btn} onPress={() => choosePicture()}>
                        <Text style={styles.btnText}>Choisir une image</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={styles.btn2}>
                        <Text style={styles.btnText}>Enregistrer</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <View style={styles.row2}>
                <View style={styles.imgContainer}>
                    {pictureUri &&
                        <Image
                            style={styles.image}
                            source={{ uri: pictureUri }}
                        />}
                </View>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={styles.btn2}>
                        <Text style={styles.btnText}>Poster</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        paddingTop: RPH(2)
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
        height: RPH(28),
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: RPH(2.5),
        marginBottom: RPH(2),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: RPW(90),
        marginBottom: RPH(1),
    },
    gradientBtn: {
        width: "45%",
        height: RPH(6.5),
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
        fontSize: RPH(2.5),
        fontWeight: "500",
    },
    btn2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row2: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems : "center",
        width: RPW(90),
        height: RPH(8),
        marginBottom: RPH(1),
    },
    imgContainer: {
        width: "45%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        alignSelf: "center",
    },

})
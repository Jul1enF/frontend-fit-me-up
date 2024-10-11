import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";

import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import YoutubePlayer from "react-native-youtube-iframe";
import moment from 'moment/min/moment-with-locales'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};


export default function Article() {

    const { infos } = useLocalSearchParams()
    const _id = infos[0]

    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state)=>state.articles.value)

    const [article, setArticle] = useState('')


    // useEffect pour charger les infos de l'article
    useEffect(() => {
        if (_id === "test") {
            setArticle(testArticle[0])
        } else {
            articles.map(e=>{
                e._id === _id && setArticle(e)
            })
        }
    }, [infos])



    moment.locale('fr')
    const date = moment(article.createdAt).format('LL')
    const hour = moment(article.createdAt).format('LT')

    return (
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
            <View style={[styles.imgContainer, !article.author && { marginBottom: 25 }]}>
                <Image style={styles.image} source={{
                    uri: article.img_link,
                }}></Image>
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
            height={RPW(57)} 
            videoId={article.video_id} 
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "black",
    },
    contentBody: {
        paddingTop: 12,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom : 10,
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
        width: RPW(100),
        height: RPW(55),
        overflow: "hidden",
        marginBottom: 12,
    },
    image: {
        height: RPW(100),
        width: RPW(100),
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
    text : {
        color: "#e0e0e0",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 25,
    },
})
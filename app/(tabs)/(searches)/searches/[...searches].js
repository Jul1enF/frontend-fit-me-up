import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar, Platform} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { useState, useEffect } from 'react'

import FirstArticle from '../../../../components/FirstArticle'
import Article from '../../../../components/Article'
import { RPH, RPW } from "../../../../modules/dimensions"

import { router, useLocalSearchParams } from 'expo-router'

import { useSelector } from 'react-redux'



export default function Searches() {

    const { searches } = useLocalSearchParams()
    const searchText = searches[0]
    console.log(searchText)

    const articles = useSelector((state) => state.articles.value)


    //  État et fonction pour charger les articles

    const [articlesInfos, setArticlesInfos] = useState("")

    const loadArticles = () => {
        const regex = new RegExp(searchText, "i")

        const realArticles = articles.filter(e=> e.category !== "home")

        const searchedArticles = realArticles.filter(e => regex.test(e.title) || regex.test(e.sub_title) || regex.test(e.text))

        searchedArticles.reverse()

        searchedArticles.length > 0 && setArticlesInfos(searchedArticles)

    }


    // useEffect pour charger les articles

    useEffect(() => {
        loadArticles()
    }, [])


    // Affichage conditionnel du mot Résultat
    const result = articlesInfos.length > 1 ? "Résultats" : "Résultat"


    // Fonction appelée en cliquant sur un article

    const articlePress = (_id) => {
        router.push(`/search-article/${_id}/${searchText}`)
    }


    // Header de la flatlist

    const headerFlatlist = (
        <LinearGradient
            colors={['#7700a4', '#0a0081']}
            locations={[0.05, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{result} pour votre recherche : « {searchText} »
                </Text>
            </View>
        </LinearGradient>
    )


    // Affichage conditionnel si pas de résultats

    if (!articlesInfos) {
        return (
            <View style={styles.body2} >
                <StatusBar translucent={true} barStyle="light"/>
                <Text style={styles.title2}>Aucun résultat pour votre recherche « {searchText} ».</Text>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
                <Text style={styles.title2}>Essayez avec un autre mot clé !</Text>
                </View>
        )
    }


    return (
        <View style={styles.body} >
            <StatusBar translucent={true} barStyle="light"/>
            <FlatList
                data={articlesInfos}
                ListHeaderComponent={headerFlatlist}
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
        alignItems: "center"
    },
    title: {
        color: "#e0e0e0",
        fontSize: 25,
        fontWeight: "300",
        textAlign: "center",
    },
    gradient: {
        borderRadius: 10,
        marginBottom: 23,
        marginTop: 23,
        width: RPW(95)
    },
    titleContainer: {
        margin: 3,
        backgroundColor: "black",
        borderRadius: 10,
        paddingTop: 14,
        paddingBottom: 14,
    },
    body2: {
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        paddingLeft : RPW(4),
        paddingRight : RPW(4),
        paddingTop : 10,
    },
    title2: {
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
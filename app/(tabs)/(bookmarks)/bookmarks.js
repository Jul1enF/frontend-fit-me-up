import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar, Platform } from 'react-native'
import { registerForPushNotificationsAsync } from "../../../modules/registerForPushNotificationsAsync"
import { useFocusEffect } from 'expo-router'
import { useCallback, useState, useEffect } from 'react'
import { RPH, RPW } from "../../../modules/dimensions"

import FirstArticle from '../../../components/FirstArticle'
import Article from '../../../components/Article'

import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../../../reducers/user'




export default function Bookmarks() {

    const user = useSelector((state) => state.user.value)
    const articles = useSelector((state) => state.articles.value)
    const dispatch = useDispatch()

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // États pour enregistrer tous les articles, les différentes catégories et sous catégories

    const [allBookmarkedArticles, setAllBookmarkedArticles] = useState("")
    const [articlesToDisplay, setArticlesToDisplay] = useState("")

    const [chosenCategory, setChosenCategory] = useState("")
    const [categoriesList, setCategoriesList] = useState("")

    const [chosenSubcategory, setChosenSubcategory] = useState("")
    const [subcategoriesList, setSubcategoriesList] = useState("")


    // Fonction pour gérer les potentiels changement de push token

    const checkPushTokenChanges = async () => {
        // Si utilisateur pas connecté
        if (!user.token) { return }

        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.navigate('/')
        }
        if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }


    // Tableau de traduction des catégories en français

    const translation = [{ category: "recipes", name: "Recettes" }, { category: "exercices", name: "Exercices" }, { category: "news", name: "News" }]




    //  Fonction pour charger les articles

    const loadArticles = () => {
        if (!user.bookmarks) { return }

        let bookmarkedArticles = []

        for (let article of articles) {
            for (let bookmark of user.bookmarks) {
                if (article._id === bookmark) {
                    bookmarkedArticles.push(article)
                }
            }
        }

        bookmarkedArticles.reverse()

        bookmarkedArticles.length > 0 ? setAllBookmarkedArticles(bookmarkedArticles) : setAllBookmarkedArticles('')

        bookmarkedArticles.length > 0 ? setArticlesToDisplay(bookmarkedArticles) : setArticlesToDisplay('')


        // Tri des catégories
        let sortedCategories = [{ name: "Tous mes favoris", category: "Tous mes favoris" }]

        if (bookmarkedArticles.length > 0) {

            bookmarkedArticles.map(e => {
                let name

                translation.map(f => {
                    if (e.category === f.category) {
                        name = f.name
                    }
                })

                if (!sortedCategories.some(j => j.name === name)) {
                    sortedCategories.push({ name, category: e.category })
                }
            })
            setCategoriesList(sortedCategories)
            setChosenCategory("Tous mes favoris")

        }
    }


    // useFocusEffect pour charger les articles

    useFocusEffect(useCallback(() => {
        checkPushTokenChanges()
        loadArticles()
    }, [user, articles]))




    // Item à afficher dans la première flatlist horizontale pour choisir la catégorie

    const CategoryItem = (props) => {

        return (
            <LinearGradient
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientBtn1}
            >
                <TouchableOpacity style={[styles.btn, chosenCategory === props.category && { backgroundColor: "transparent" }]} onPress={() => categoryPress(props.category)}>
                    <Text style={[styles.btnText, chosenCategory !== props.category && { color: "#19290a" }]}>{props.name}</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }



    // Fonction appelée en cliquant sur une catégorie

    const categoryPress = (category) => {
        setChosenCategory(category)

        if (category === "Tous mes favoris") {
            setArticlesToDisplay(allBookmarkedArticles)
        }
        else {
            setArticlesToDisplay(allBookmarkedArticles.filter(e => e.category === category))

            let sortedSubcategories

            if (category === "recipes") {
                sortedSubcategories = [{ name: "Toutes mes recettes" }]
            }
            if (category === "exercices") {
                sortedSubcategories = [{ name: "Tous mes exercices" }]
            }
            if (category === "news") {
                sortedSubcategories = [{ name: "Toutes mes news" }]
            }


            allBookmarkedArticles.map(e => {
                if (e.sub_title && e.category === category && !sortedSubcategories.some(j => j.name === e.sub_title)) {
                    sortedSubcategories.push({ name: e.sub_title })
                }
            })

            setSubcategoriesList(sortedSubcategories)
            setChosenSubcategory(sortedSubcategories[0].name)
        }
    }




    // Item à afficher dans la deuxième flatlist horizontale pour choisir la sous catégorie

    const SubcategoryItem = (props) => {

        return (
            <LinearGradient
                colors={['#9dcb00', '#045400']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientBtn1}
            >
                <TouchableOpacity style={[styles.btn, chosenSubcategory === props.name && { backgroundColor: "transparent" }]} onPress={() => subcategoryPress(props.name)}>
                    <Text style={[styles.btnText, chosenSubcategory !== props.name && { color: "#19290a" }]}>{props.name}</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }



    // Fonction appelée au click sur une sous catégorie

    const subcategoryPress = (subcategory) => {
        setChosenSubcategory(subcategory)

        if (subcategory === subcategoriesList[0].name) {
            setArticlesToDisplay(allBookmarkedArticles.filter(e => e.category === chosenCategory))
        }
        else {
            setArticlesToDisplay(allBookmarkedArticles.filter(e => e.sub_title == subcategory && e.category === chosenCategory))
        }
    }




    // Fonction appelée en cliquant sur un article

    const articlePress = (_id) => {
        router.push(`/bookmark-article/${_id}`)
    }




    // Affichage conditionnel si pas connecté

    if (!user.token) {
        return (
            <View style={styles.body2} >
                <StatusBar translucent={true} barStyle="light" />
                <Text style={styles.title}>Aucun article enregistré.</Text>
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
                <Text style={styles.title}>Connectez-vous ou inscrivez-vous pour pouvoir enregistrer des articles en favoris.</Text>
            </View>
        )
    }





    // Affichage conditionnel si pas de favoris

    if (!allBookmarkedArticles) {
        return (
            <View style={styles.body2} >
                <StatusBar translucent={true} barStyle="light" />
                <Text style={styles.title}>Aucun article enregistré.</Text>
                <LinearGradient
                    colors={['#9dcb00', '#045400']}
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
        <View style={styles.body} >
            <StatusBar translucent={true} barStyle="light" />

            <FlatList
                data={categoriesList}
                horizontal={true}
                style={[{ minHeight: RPW(16), maxHeight: RPW(16), minWidth: RPW(100) }, chosenCategory === "Tous mes favoris" && { borderBottomColor: "#878787", borderBottomWidth: 0.5 }]}
                renderItem={({ item }) => {
                    return <CategoryItem {...item} />
                }}
                contentContainerStyle={{ alignItems: 'center', paddingLeft: RPW(2) }}
            />

            <FlatList
                data={subcategoriesList}
                horizontal={true}
                style={[{
                    height: RPW(12), maxHeight: RPW(12), margin: 0, width: RPW(100), minWidth: RPW(100), borderBottomColor: "#878787", borderBottomWidth: 0.5,
                }, chosenCategory === "Tous mes favoris" && { display: "none" }]}
                renderItem={({ item }) => {
                    return <SubcategoryItem {...item} />
                }}
                contentContainerStyle={{
                    alignItems: 'flex-start', paddingLeft: RPW(2),
                }}
            />

            <FlatList
                data={articlesToDisplay}
                style={{ flex: 1 }}
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
        backgroundColor: "#f9fff4",
        flex: 1,
    },
    body2: {
        backgroundColor: "#f9fff4",
        flex: 1,
        alignItems: "center",
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        paddingTop: 10,
    },
    title: {
        color: "#19290a",
        fontSize: 23,
        fontWeight: "300",
        textAlign: "center",
        marginTop: 15,
    },
    gradientLine: {
        width: "97%",
        height: 4,
        borderRadius: 15,
        marginTop: 15
    },
    gradientBtn1: {
        height: RPW(8.5),
        borderRadius: 10,
        marginRight: RPW(2.3)
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#d3dec8",
        margin: 0,
        borderRadius: 10,
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
    },
    btnText: {
        color: "white",
        fontSize: RPW(4),
        fontWeight: "500",
    },
})
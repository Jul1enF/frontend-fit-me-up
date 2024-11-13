import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, StatusBar } from 'react-native'
import { registerForPushNotificationsAsync } from "../../../modules/registerForPushNotificationsAsync"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState, useEffect } from 'react'

import { RPW, RPH } from "../../../modules/dimensions"

import FirstArticle from '../../../components/FirstArticle'
import Article from '../../../components/Article'

import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../../../reducers/user'
import { fillWithArticles, suppressArticles } from '../../../reducers/articles'



export default function Exercices() {

    const user = useSelector((state) => state.user.value)
    console.log(user)
    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state) => state.articles.value)
    const dispatch = useDispatch()

    const [thisCategoryArticles, setThisCategoryArticles] = useState("")
    const [articlesToDisplay, setArticlesToDisplay] = useState("")
    const [chosenSubcategory, setChosenSubcategory] = useState("")
    const [subcategoriesList, setSubcategoriesList] = useState("")

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS



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



    //  Fonction pour charger les articles et trier les sous catégories

    const loadArticles = async () => {

        // S'il y a un article test, chargement de celui ci
        if (user?.is_admin && testArticle[0]?.category === "exercices") {
            setArticlesToDisplay(testArticle)
        }

        // Sinon fetch des articles en bdd
        else {
            // Envoi d'un token ou non en fonction de si l'utilisateur en a un
            let token = "noToken"

            if (user.token) {
                token = user.token
            }


            const response = await fetch(`${url}/articles/getArticles/${token}`)

            const data = await response.json()


            if (data.result) {
                dispatch(fillWithArticles(data.articles))

                let exercicesArticles = data.articles.filter(e => e.category === 'exercices')

                exercicesArticles.reverse()


                setThisCategoryArticles(exercicesArticles)
                setArticlesToDisplay(exercicesArticles)


                // Tri pour les sous catégories
                let sortedSubcategories = [{ name: "Tous les exercices" }]

                exercicesArticles.map(e => {
                    if (e.sub_title && !sortedSubcategories.some(j => j.name === e.sub_title)) {
                        sortedSubcategories.push({ name: e.sub_title })
                    }
                })
                setSubcategoriesList(sortedSubcategories)
                setChosenSubcategory("Tous les exercices")

            }
            else if (!data.result) {
                // dispatch(suppressArticles())
                // setArticlesToDisplay("")
                return
            }
        }
    }


    // useFocusEffect pour vérifier si les notifs sont toujours autorisées

    useFocusEffect(useCallback(() => {
        checkPushTokenChanges()
    }, [user]))


    useEffect(() => {
        loadArticles()
    }, [testArticle])



    // Fonction appelée au click sur une sous catégorie

    const subcategoryPress = (subcategory) => {
        setChosenSubcategory(subcategory)

        if (subcategory === "Tous les exercices") {
            setArticlesToDisplay(thisCategoryArticles)
        }
        else {
            setArticlesToDisplay(thisCategoryArticles.filter(e => e.sub_title == subcategory))
        }
    }



    // Item à afficher dans la flatlist horizontale pour choisir la sous catégorie

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
                    <Text style={styles.btnText}>{props.name}</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }




    // Fonction appelée en cliquant sur un article

    const articlePress = (_id, test) => {
        test ? router.push(`/exercice-article/testArticleId`) : router.push(`/exercice-article/${_id}`)
    }



    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["white"]} progressBackgroundColor={"#fbfff7"} tintColor={"white"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadArticles()
    }} />




    return (
        <View style={styles.body} >
            <StatusBar translucent={true} barStyle="light" />
            <FlatList
                data={subcategoriesList}
                horizontal={true}
                style={{ minHeight: RPW(16), maxHeight: RPW(16), minWidth: RPW(100), borderBottomColor: "#878787", borderBottomWidth: 0.5 }}
                renderItem={({ item }) => {
                    return <SubcategoryItem {...item} />
                }}
                contentContainerStyle={{ alignItems: 'center', paddingLeft: RPW(2) }}
            />
            <FlatList
                data={articlesToDisplay}
                refreshControl={refreshComponent}
                renderItem={({ item, index }) => {
                    if (index === 0 || Number.isInteger((index) / 3)) {
                        return <TouchableOpacity onPress={() => articlePress(item._id, item.test)} ><FirstArticle {...item} chosenSubcategory={chosenSubcategory} /></TouchableOpacity>
                    }
                    else {
                        return <TouchableOpacity onPress={() => articlePress(item._id, item.test)} ><Article {...item} /></TouchableOpacity>
                    }
                }}
                contentContainerStyle={{ alignItems: 'center' }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#fbfff7",
        flex: 1,
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
        backgroundColor: "#2a2a2a",
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
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, StatusBar } from 'react-native'
import { registerForPushNotificationsAsync } from "../../../modules/registerForPushNotificationsAsync"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState, useEffect } from 'react'

import FirstArticle from '../../../components/FirstArticle'
import Article from '../../../components/Article'

import { router } from 'expo-router'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../../../reducers/user'
import { fillWithArticles, suppressArticles } from '../../../reducers/articles'



export default function Recipes() {

    const user = useSelector((state) => state.user.value)
    console.log(user)
    const testArticle = useSelector((state) => state.testArticle.value)
    const dispatch = useDispatch()

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // Fonction pour gérer les potentiels changement de push token

    const checkPushTokenChanges = async () => {

        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.navigate('/')
        }
        if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }

    //  État et fonction pour charger les articles

    const [articlesInfos, setArticlesInfos] = useState("")

    const loadArticles = async () => {
        if (user.is_admin && testArticle[0]?.category === "recipes") {
            setArticlesInfos(testArticle)
        }
        else {
            const response = await fetch(`${url}/articles/getArticles/${user.token}`)

            
            const data = await response.json()

            if (data.result) {
                dispatch(fillWithArticles(data.articles))

                let recipesArticles = data.articles.filter(e => e.category === 'recipes')

                recipesArticles.reverse()

                setArticlesInfos(recipesArticles)
            }
            else if (!data.result && data.error == "Utilisateur bloqué."){
                dispatch(suppressArticles())
                setArticlesInfos("")
            }
        }
    }


    // useFocusEffect

    useFocusEffect(useCallback(() => {
        // checkPushTokenChanges()
        loadArticles()
    }, [user, testArticle]))
    


    // Fonction appelée en cliquant sur un article

    const articlePress = (_id, test) => {
        test ? router.push(`/recipe-article/testArticleId`) : router.push(`/recipe-article/${_id}`)
    }



    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing]=useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["white"]} tintColor={"white"} onRefresh={()=>{
        setIsRefreshing(true)
        setTimeout(()=>setIsRefreshing(false), 1000)
        loadArticles()
    }} />


    return (
        <View style={styles.body} >
            <StatusBar translucent={true} barStyle="light"/>
            <FlatList
                data={articlesInfos}
                refreshControl={refreshComponent}
                renderItem={({ item, index }) => {
                    if (index === 0 || Number.isInteger((index)/3) ) {
                        return <TouchableOpacity onPress={() => articlePress(item._id, item.test)} ><FirstArticle {...item} /></TouchableOpacity>
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
        backgroundColor: "black",
        flex: 1,
    },
})
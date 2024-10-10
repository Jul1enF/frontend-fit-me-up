import { View, Text, StyleSheet, FlatList } from 'react-native'
import { registerForPushNotificationsAsync } from "../../modules/registerForPushNotificationsAsync"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import FirstArticle from '../../components/FirstArticle'
import Article from '../../components/Article'

import { router } from 'expo-router'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../../reducers/user'



export default function Recipes() {

    const user = useSelector((state) => state.user.value)
    const testArticle = useSelector((state) => state.testArticle.value)
    const dispatch = useDispatch()

    console.log(user)
    console.log("TEST ARTICLE : ", testArticle)

    // Fonction pour gérer les potentiels changement de push token

    const checkPushTokenChanges = async () => {

        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.push('/')
        }
        if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }

    //  État et fonction pour charger les articles

    const [articlesInfos, setArticlesInfos] = useState("")

    const loadArticles = () => {
        if (user.is_admin && testArticle[0]?.category === "recipes") {
            setArticlesInfos(testArticle)
        }
    } 

    // useFocusEffect

    useFocusEffect(useCallback(() => {
        // checkPushTokenChanges()
        loadArticles()
    }, [user, testArticle]))


    // Fonction appelée en cliquant sur un article

    const articlePress = (_id, test) =>{
        test ? router.push(`/article/test`) : router.push(`/article/${_id}`)
    }


    // Préparation des composants affichant les articles

    let articles

    if (articlesInfos) {
        articles = <FlatList
            data={articlesInfos}
            renderItem={({ item, index }) => {
            if (index === 0){
                return <FirstArticle {...item} onPress={()=>articlePress(item._id, item.test)} />
            }
            else {
                return <Article {...item} /> 
            }
        }}
            contentContainerStyle={{ alignItems: 'center'}}
        />  
    }

    return (
        <View style={styles.body}>
            {articles}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "black",
        flex: 1,
        // paddingTop : 10,
    }

})
import { View, Text, StyleSheet, Dimensions } from "react-native";

import { useLocalSearchParams } from "expo-router";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

export default function Article () {

    const { params } = useLocalSearchParams()
    const _id  = params[0]


    return (
        <View style={styles.body}>
            <Text>{_id}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body : {
        flex : 1,
        backgroundColor : "green",
    }
})
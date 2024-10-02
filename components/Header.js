import { View, Text, StyleSheet, Dimensions } from "react-native";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

export default function Header (){

    return(
        <View style={styles.body}>
            <Text>Header !!!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body : {
        height: RPH(14),
        paddingTop: RPH(3),
        width : "100%",
        backgroundColor : "red",
        padding:0,
        margin:0,
    }
})
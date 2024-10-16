import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import moment from 'moment/min/moment-with-locales'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

export default function Article(props) {

    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={styles.body}>
            <View style={styles.row}>
                <View style={styles.column1}>
                    <Text numberOfLines={4} style={styles.title}>{props.title}</Text>
                    <Text style={styles.date}>Posté {lastingTime}</Text>
                </View>
                <View style={styles.column2}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.image} source={{
                            uri: props.img_link,
                        }}></Image>
                    </View>
                </View>
            </View>
            <LinearGradient
                colors={['#7700a4', '#0a0081']}
                locations={[0.05, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientLine2}
            >
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: RPW(100),
        marginBottom: 14,
        paddingRight: RPW(3),
        paddingLeft: RPW(3),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    column1: {
        width: RPW(51),
        height: RPH(17),
        justifyContent : "space-evenly",
    },
    title: {
        color: "#e0e0e0",
        fontSize: 22,
        fontWeight: "450",
        marginBottom : 5
    },
    date: {
        color: "#e0e0e0",
        fontSize: 12,
        fontWeight: "300"
    },
    column2: {
        width: RPW(41),
        height: RPH(17),
        alignItems : "center",
        justifyContent : 'center',
    },
    imgContainer: {
        width: RPW(41),
        height: RPW(22.5),
        overflow : "hidden",
    },
    image: {
        width : RPW(41),
        height : RPW(41),
    },
    gradientLine2: {
        width: "100%",
        height: 1,
        borderRadius: 15,
    },
})
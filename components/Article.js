import { View, Text, StyleSheet, Dimensions, Image, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {RPH, RPW} from "../modules/dimensions"

import moment from 'moment/min/moment-with-locales'


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
                    <View style={styles.imgContainer} >
                        <Image
                            style={[styles.image, {
                                width: RPW(41 * props.img_zoom),
                                marginTop: RPW(props.img_margin_top * 0.41),
                                marginLeft: RPW(props.img_margin_left * 0.41)
                            }]}
                            source={{ uri: props.img_link, }}
                        />
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
        justifyContent: "space-evenly",
    },
    title: {
        color: "#e0e0e0",
        fontSize: 22,
        fontWeight: "450",
        marginBottom: 5
    },
    date: {
        color: "#e0e0e0",
        fontSize: 12,
        fontWeight: "300"
    },
    column2: {
        width: RPW(41),
        height: RPH(17),
        alignItems: "center",
        justifyContent: 'center',
    },
    imgContainer: {
        width: RPW(41),
        height: RPW(22.5),
        overflow: "hidden",
        justifyContent: "center",
    },
    image: {
        height: RPW(1000),
        resizeMode: "contain",
    },
    gradientLine2: {
        width: "100%",
        height: 1,
        borderRadius: 15,
    },
})
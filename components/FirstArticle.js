import { View, Text, StyleSheet, Dimensions, Image, Platform, StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import {RPH, RPW} from "../modules/dimensions"

import moment from 'moment/min/moment-with-locales'


export default function FirstArticle(props) {

    let optionnalSubTitle = ""
    if (!props.sub_title && props.text) {
        optionnalSubTitle = <Text numberOfLines={3} style={styles.subTitle}>{props.text}</Text>
    }

    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={styles.body}>
            <View style={styles.imgContainer} >
                <Image
                    style={[styles.image, {
                        width: RPW(100 * props.img_zoom),
                        marginTop: RPW(props.img_margin_top),
                        marginLeft: RPW(props.img_margin_left)
                    }]}
                    source={{ uri: props.img_link, }}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{props.title}</Text>
                <LinearGradient
                    colors={['#7700a4', '#0a0081']}
                    locations={[0.05, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
                {props.sub_title && <Text numberOfLines={3} style={styles.subTitle}>{props.sub_title}</Text>}
                {optionnalSubTitle}
            </View>
            <Text style={styles.date}>Posté {lastingTime}</Text>
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
    },
    imgContainer: {
        width: RPW(100),
        height: RPW(55),
        overflow: "hidden",
        justifyContent: "center"
    },
    image: {
        height: RPW(1000),
        resizeMode: "contain",
    },
    textContainer: {
        paddingLeft: RPW(3),
        paddingTop: RPW(3),
        paddingRight: RPW(3),
        maxHeight: 160,
        overflow: "hidden",
        marginBottom: 12,
    },
    title: {
        color: "#e0e0e0",
        fontSize: 27,
        fontWeight: "450",
        marginBottom: 12,
    },
    gradientLine: {
        width: "90%",
        height: 5,
        marginBottom: 15,
        borderRadius: 15,
    },
    subTitle: {
        color: "#e0e0e0",
        fontSize: 15,
        fontWeight: "300",
    },
    date: {
        color: "#e0e0e0",
        fontSize: 12,
        marginLeft: RPW(3),
        marginBottom: 18,
        fontWeight: "300"
    },
    gradientLine2: {
        width: "100%",
        height: 1,
        borderRadius: 15,
    },
})
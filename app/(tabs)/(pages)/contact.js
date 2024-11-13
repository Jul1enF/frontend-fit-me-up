import { View, Text, StyleSheet} from "react-native";

import { RPW, RPH } from "../../../modules/dimensions"


export default function Contact () {


    return (
        <View style={styles.body}>
              <Text style={styles.title}>
                Contact
            </Text>
            <Text style={styles.text}>
               Vous souhaitez nous contacter pour obtenir des précisions sur l'application ou parceque vous rencontrez des problèmes avec celle ci ?
            </Text>
            <Text style={styles.text2}>
               Écrivez nous à l'adresse : kevin.dumarche@gmail.com
            </Text>
        </View>
    )
}




const styles = StyleSheet.create({
    body : {
        flex : 1,
        backgroundColor : "#f9fff4",
        paddingTop: 30,
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        paddingBottom: 30,
    },
    title: {
        color: "#19290a",
        fontSize: 25,
        fontWeight: "700",
        paddingBottom : 30,
    },
    text: {
        color: "#19290a",
        fontSize: 15,
        fontWeight: "400",
        paddingBottom: 20,
    },
    text2: {
        color: "#19290a",
        fontSize: 15,
        fontWeight: "400",
        paddingBottom: 30,
    },
})
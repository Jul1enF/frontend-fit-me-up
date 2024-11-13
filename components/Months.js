import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { RPH, RPW } from '../modules/dimensions'

export default function Months(props) {

    const monthPress = () => {
        if (props.isSelected){
            props.removeOneMonth(props.i +1)
        }
        else{
            props.addOneMonth(props.i +1)
        }
    }

    const monthsNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]


    return (
        <LinearGradient
            colors={['#9dcb00', '#045400']}
            locations={[0.05, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.body}
        >
            <TouchableOpacity style={[styles.monthBody, props.isSelected && {backgroundColor : "transparent"}]}
            onPress={()=> monthPress() } >
                <Text style={[styles.text, !props.isSelected && { color: "#19290a" }]}>{monthsNames[props.i]}</Text>
            </TouchableOpacity>
        </LinearGradient>

    )
}


const styles = StyleSheet.create({
    body: {
        height: RPW(10),
        width: RPW(29),
        borderRadius : 15,
        marginRight : RPW(1),
        marginLeft : RPW(1),
        marginTop : RPW(1),
        marginBottom : RPW(1),
    },
    monthBody : {
        flex : 1,
        backgroundColor : "#f9fff4",
        margin : 2,
        justifyContent : "center",
        alignItems : "center",
        borderRadius : 15,
    },
    text : {
        color : "white",
        fontSize : RPW(4),
        fontWeight : "800"
    }
})

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { RPH, RPW } from '../modules/dimensions'

export default function Days(props) {

    const numberPress = () => {
        if (props.isSelected){
            props.removeOneDay(props.i +1)
        }
        else{
            props.addOneDay(props.i +1)
        }
    }


    return (
        <LinearGradient
            colors={['#9dcb00', '#045400']}
            locations={[0.05, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.body}
        >
            <TouchableOpacity style={[styles.numberBody, props.isSelected && {backgroundColor : "transparent"}]}
            onPress={()=> numberPress() } >
                <Text style={styles.text}>{props.i + 1}</Text>
            </TouchableOpacity>
        </LinearGradient>

    )
}


const styles = StyleSheet.create({
    body: {
        height: RPW(10),
        width: RPW(12),
        borderRadius : 15,
        marginRight : RPW(1),
        marginLeft : RPW(1),
        marginTop : RPW(1),
        marginBottom : RPW(1),
    },
    numberBody : {
        flex : 1,
        backgroundColor : "black",
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
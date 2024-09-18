import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Signup from './Signup';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};



export default function HomeScreen({ navigation }) {

    // Si user connecté avec push token, redirection vers 1ère page Tab
    const user = useSelector((state) => state.user.value)

    useEffect(()=>{
        user.firstname && navigation.navigate('TabNavigator')
    },[])


    // États pour voir ou non modals
    const [modal1Visible, setModal1VIsible] = useState(false)



    // Fonction envoyée en IDF à Signup et Signin
    
    const closeModal1 = ()=>{
        setModal1VIsible(false)
    }

    return (
        <View style={styles.body}>
            <TouchableOpacity style={styles.btn} onPress={() => setModal1VIsible(true)}>
                <Text>S'inscrire</Text>
            </TouchableOpacity>
            <Modal
                visible={modal1Visible}
                onRequestClose={() => setModal1VIsible(false)}
                style={styles.modal}
                animationType='slide'
                transparent={true}
            >
                <Signup  closeModal1={closeModal1} navigation={navigation}/>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        height: RPH(100),
        width: RPW(100),
        paddingTop: 100,
    },

})
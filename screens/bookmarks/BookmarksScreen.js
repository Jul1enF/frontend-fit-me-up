import {View, Text, TextInput, Button} from 'react-native'
import {useState} from 'react'

export default function BookmarksScreen ({navigation}) {
    const [firstname, setFirstname]= useState('')
    const [result, setResult]=useState('')
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const postClick = async()=>{
        const response = await fetch(`${url}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname })
            })
        const data = await response.json()
        console.log(data)
        if (!data.result){
            setResult(data)
        }
    }
    return (
        <View>
        <Text> HELLO IT'S BOOKMARKKS</Text>
        <TextInput style={{width : 200, backgroundColor: "red"}} onChangeText={(e)=>setFirstname(e)} value={firstname}></TextInput>
        <Button type='text' onPress={()=>postClick()} title="POST"></Button>
        <Text>{result}</Text>
        </View>
    )
}
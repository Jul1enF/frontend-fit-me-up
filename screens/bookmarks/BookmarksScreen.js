import {View, Text, TextInput, Button, Platform} from 'react-native'
import { useState } from 'react';


export default function BookmarksScreen ({navigation}) {

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const [postMessage, setPostMessage]=useState('')
    const [answer, setAnswer]=useState('')
    console.log("answer : ", answer)

    const postClick=async()=>{
      const response = await fetch(`${url}/users/postNotif`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postMessage})
          })
      const data = await response.json()
      const dataString = JSON.stringify(data)

      setAnswer(dataString)
  }


    return (
        <View>
        <Text> HELLO IT'S BOOKMARKKS</Text>
        <TextInput style={{width : 200, backgroundColor: "green"}} onChangeText={(e)=>setPostMessage(e)} value={postMessage}></TextInput>
        <Button type='text' onPress={()=>postClick()} title="POST"></Button>
        <Text>Answer POST : {answer}</Text>
        </View>
    )
}
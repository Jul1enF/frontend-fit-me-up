import { Tabs } from "expo-router";
import Header from "../../components/Header";

export default function TabsLayout (){
    return(
        <Tabs >
            <Tabs.Screen name="recipes" options={{
            header : (props)=> <Header {...props}/>,
        }}/>
            <Tabs.Screen name="exercices" options={{
            header : (props)=> <Header {...props}/>,
        }}/>
             <Tabs.Screen name="events" options={{
            header : (props)=> <Header {...props}/>,
        }}/>
             <Tabs.Screen name="bookmarks" options={{
            header : (props)=> <Header {...props}/>,
        }}/>
        </Tabs>
    )
}
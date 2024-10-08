import { Tabs } from "expo-router";
import Header from "../../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage) => {
    return (percentage / 100) * screenHeight;
};

const RPW = (percentage) => {
    return (percentage / 100) * screenWidth;
};

export default function TabsLayout() {
    return (
        <Tabs
        screenOptions={({ route }) => ({

            tabBarIcon: ({focused}) => {
              let iconName = '';
              let color = ""
              color = focused ? "#ff00e8" : "white"

              if (route.name === 'recipes') {
                iconName = 'pot-mix';
              } else if (route.name === 'exercices') {
                iconName = 'weight-lifter';
              }
              else if (route.name === 'events') {
                iconName = 'bell';
              }
              else if (route.name === 'bookmarks') {
                iconName = 'heart';
              }
              return <Icon name={iconName} size={RPH(3.8)} color={color} />;
            },

            tabBarActiveTintColor: '#ff00e8',
            tabBarInactiveTintColor: 'white',
            tabBarLabelStyle : { fontSize : RPH(1.7) },
            tabBarBackground : ()=>(
                <LinearGradient
                  colors={['#7700a4', '#0a0081']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{height : 150}}
                  ></LinearGradient>
              ),
              tabBarStyle: { height : RPH(10), paddingBottom : RPH(1), paddingTop : RPH(1), borderTopWidth : RPH(0.05) },
              header: (props) => <Header {...props} />,
          })}
        >
            <Tabs.Screen name="recipes" options={{
                title : "Recettes",
            }} />
            <Tabs.Screen name="exercices" options={{
                title : "Exercices",
            }} />
            <Tabs.Screen name="events" options={{
                title : "Évènements"
            }} />
            <Tabs.Screen name="bookmarks" options={{
                title : "Favoris"
            }} />
             <Tabs.Screen name="(post)" options={{
                tabBarItemStyle : { display : "none"}
            }}/>
        </Tabs>
    )
}
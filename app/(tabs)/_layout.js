import { Tabs } from "expo-router";
import Header from "../../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Platform, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { RPH, RPW, getNavigationHeight } from "../../modules/dimensions"

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        keyboardHidesTabBar: true,
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let color = ""
          // color = focused ? '#6d2100' : "white"
          color = focused ? '#758174' : "white"
          // color = focused ? '#610063' : "white"

          if (route.name === '(recipes)') {
            iconName = 'pot-mix';
          } else if (route.name === '(exercices)') {
            iconName = 'weight-lifter';
          }
          else if (route.name === '(news)') {
            iconName = 'bell';
          }
          else if (route.name === '(bookmarks)') {
            iconName = 'heart';
          }
          return <MaterialCommunityIcons name={iconName} size={RPH(3.8)} color={color} />;
        },
        tabBarIconStyle : {width : "100%", height : RPH(4.8)},
        tabBarActiveTintColor: '#758174',
        tabBarInactiveTintColor: 'white',
        tabBarLabelStyle: { fontSize: RPW(4.2), fontWeight : "500" },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#9dcb00', '#045400']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 150 }}
          ></LinearGradient>
        ),
        tabBarStyle: { height: RPH(10.5), paddingBottom: RPH(2), paddingTop: RPH(0.5), width : RPW(100) },
        tabBarHideOnKeyboard : Platform.OS === 'ios' ? true : false,
        // tabBarHideOnKeyboard: Platform.OS === 'android' ? true : false,
        header: (props) => <Header {...props} />,
      })}
    >
      <Tabs.Screen name="(news)" options={{
        title: "News"
      }} />
      <Tabs.Screen name="(recipes)" options={{
        title: "Recettes",
      }} />
      <Tabs.Screen name="(exercices)" options={{
        title: "Exercices",
      }} />
      <Tabs.Screen name="(bookmarks)" options={{
        title: "Favoris"
      }} />
      <Tabs.Screen name="(pages)" options={{
        tabBarItemStyle: { display: "none" },
      }} />
      <Tabs.Screen name="(searches)" options={{
        tabBarItemStyle: { display: "none" },
      }} />
    </Tabs>
  )
}

import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/home/HomeScreen'
import RecipesScreen from './screens/recipes/RecipesScreen'
import ExercicesScreen from './screens/exercices/ExercicesScreen'
import EventsScreen from './screens/events/EventsScreen'
import BookmarksScreen from './screens/bookmarks/BookmarksScreen';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Recettes" component={RecipesScreen} />
      <Tab.Screen name="Exercices" component={ExercicesScreen} />
      <Tab.Screen name="Événements" component={EventsScreen} />
      <Tab.Screen name="Favoris" component={BookmarksScreen} />
    </Tab.Navigator>
  )
}


export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown : false}}>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="Home" component={HomeScreen}/>
    </Stack.Navigator>
 </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

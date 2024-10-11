import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="recipes" options={{
                title : "Recettes",
            }} />
            <Stack.Screen name="recipe-article/[...infos]" options={{
            }}/>
        </Stack>
    )
}
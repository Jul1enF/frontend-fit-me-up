import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="exercices" options={{
                title : "Exercices",
            }} />
            <Stack.Screen name="exercice-article/[...exercice]" options={{
            }}/>
        </Stack>
    )
}
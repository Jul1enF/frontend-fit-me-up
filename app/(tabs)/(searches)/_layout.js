import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="searches/[...searches]" options={{
                title : "Recherche",
            }} />
            <Stack.Screen name="search-article/[...search]" options={{
            }}/>
        </Stack>
    )
}
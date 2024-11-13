import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="news" options={{
                title : "News",
            }} />
            <Stack.Screen name="news-article/[...news]" options={{
            }}/>
        </Stack>
    )
}
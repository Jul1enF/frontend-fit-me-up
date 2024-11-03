import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="redaction" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="cron-notification-page/[cronId]" />
            <Stack.Screen name="users" />
            <Stack.Screen name="user-informations" />
        </Stack>
    )
}
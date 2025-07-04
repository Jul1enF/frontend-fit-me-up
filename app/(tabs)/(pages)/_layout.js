import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { RPH, RPW } from "../../../modules/dimensions"
import { Platform } from "react-native";

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
            <Stack.Screen name="home" options={{
                title: "Accueil"
            }} />
            <Stack.Screen name="legal" options={{
                headerShown: Platform.OS === "ios" ? true : false,
                title: "CGU / Mentions Légales",
                headerTintColor: 'white',
                headerBackground: () => {
                    return Platform.OS === "android" ? null : (
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{ height: RPH(6) }}
                    ></LinearGradient>
                    )
                },
            }} />
            <Stack.Screen name="contact" options={{
                headerShown: Platform.OS === "ios" ? true : false,
                title: "Contact",
                headerTintColor: 'white',
                headerBackground: () => (
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{ height: RPH(6) }}
                    ></LinearGradient>
                ),
            }} />
        </Stack>
    )
}
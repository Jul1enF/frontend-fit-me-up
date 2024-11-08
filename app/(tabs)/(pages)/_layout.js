import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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
                title : "Accueil"
            }}/>
            <Stack.Screen name="legal" options={{
                headerShown : true,
                title : "CGU / Mentions Légales",
                headerTintColor: 'white',
                headerBackground: () => (
                    <LinearGradient
                      colors={['#7700a4', '#0a0081']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ height: 150 }}
                    ></LinearGradient>
                  ),
            }} />
            <Stack.Screen name="contact" options={{
                headerShown : true,
                title : "Contact",
                headerTintColor: 'white',
                headerBackground: () => (
                    <LinearGradient
                      colors={['#7700a4', '#0a0081']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ height: 150 }}
                    ></LinearGradient>
                  ),
            }}/>
        </Stack>
    )
}
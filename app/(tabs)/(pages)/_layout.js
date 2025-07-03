import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { RPH, RPW } from "../../../modules/dimensions"
import { Header } from "@react-navigation/elements"

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
                headerShown: true,
                title: "CGU / Mentions Légales",
                headerTintColor: 'black',
                headerStyle:{
                    backgroundColor : "red",
                },
                headerTopInsetEnabled : true,
                // headerStyle: {
                //     height: 80,
                // },
                // header: ({ options }) => (
                //     <Header
                //         {...options}
                //     />
                // ),
                // headerBackgroundContainerStyle : {height : 150, alignItems : "flex-start", justifyContent : "flex-start", padding : 0, margin : 0},
                // headerStatusBarHeight : 0,
                // headerBackground: () => (
                //     <LinearGradient
                //         colors={['#9dcb00', '#045400']}
                //         start={{ x: 0, y: 0.5 }}
                //         end={{ x: 1, y: 0.5 }}
                //         style={{ height: RPH(6) }}
                //     />
                // ),
            }} />
            <Stack.Screen name="contact" options={{
                headerShown: true,
                title: "Contact",
                headerTintColor: 'white',
                headerBackground: () => (
                    <LinearGradient
                        colors={['#9dcb00', '#045400']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{ height: 150 }}
                    ></LinearGradient>
                ),
            }} />
        </Stack>
    )
}
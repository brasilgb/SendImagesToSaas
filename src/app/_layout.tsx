import "@/styles/global.css";
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

import AppHeader from "@/components/app-header";

import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AuthProvider from "@/context/AuthContext";

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function doAsyncStuff() {
            try {
                // do something async here
            } catch (e) {
                console.warn(e);
            } finally {
                setIsReady(true);
            }
        }

        doAsyncStuff();
    }, []);

    useEffect(() => {
        if (isReady) {
            SplashScreen.hide();
        }
    }, [isReady]);

    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <SafeAreaProvider onLayout={onLayoutRootView}>
                <SafeAreaView edges={['top', 'bottom']} className='flex-1 bg-gray-800'>
                    <StatusBar style="light" translucent />
                    <Stack
                        initialRouteName="index"
                        screenOptions={{
                            headerShown: false,
                        }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen
                            name="home"
                            options={{
                                headerShown: true,
                                header: () => <AppHeader user logout />
                            }}
                        />
                        <Stack.Screen
                            name="images"
                            options={{
                                headerShown: true,
                                header: () => <AppHeader back close />
                            }}
                        />
                    </Stack>
                </SafeAreaView>
            </SafeAreaProvider>
        </AuthProvider>
    )
}
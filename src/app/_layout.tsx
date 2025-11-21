import "@/styles/global.css";
import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import {
    useFonts,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { StatusBar } from 'expo-status-bar';

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
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <SafeAreaView forceInset={{ top: 'always'}} className='flex-1 bg-gray-800'>
                <StatusBar style="light" translucent />
                <Stack
                    initialRouteName="index"
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="home" />
                    <Stack.Screen name="images" />
                </Stack>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
import { View, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { ChevronLeftIcon, LogOutIcon, UserCircleIcon, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
    back?: boolean;
    close?: boolean;
    logout?: boolean;
    user?: boolean;
}

const AppHeader = ({ back, close, logout, user }: AppHeaderProps) => {
    const { signOut } = useContext(AuthContext);
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-row items-center justify-between bg-[#15365f] px-5 border-b border-white/15"
            style={{ height: 74 + insets.top, paddingTop: insets.top }}
        >
            <View className='w-11 items-start'>
                {user && (
                    <TouchableOpacity
                        className="h-[38px] w-[38px] items-center justify-center rounded-lg bg-white/10 active:opacity-80"
                        onPress={() => router.replace('/home')}
                    >
                        <UserCircleIcon size={24} color={'#f5f4ef'} />
                    </TouchableOpacity>
                )}
                {back && (
                    <TouchableOpacity
                        className="h-[38px] w-[38px] items-center justify-center rounded-lg bg-white/10 active:opacity-80"
                        onPress={() => router.back()}
                    >
                        <ChevronLeftIcon color={'#f5f4ef'} size={24} />
                    </TouchableOpacity>
                )}
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-lg">
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={{ width: 34, height: 34 }}
                />
            </View>
            <View className='w-11 items-end'>
                {close && (
                    <TouchableOpacity
                        className="h-[38px] w-[38px] items-center justify-center rounded-lg bg-white/10 active:opacity-80"
                        onPress={() => router.replace('/home')}
                    >
                        <X size={24} color={'#f5f4ef'} />
                    </TouchableOpacity>
                )}
                {logout &&
                    <TouchableOpacity
                        className="h-[38px] w-[38px] items-center justify-center rounded-lg bg-white/10 active:opacity-80"
                        onPress={() => signOut()}
                    >
                        <LogOutIcon color={'#f5f4ef'} size={24} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default AppHeader;

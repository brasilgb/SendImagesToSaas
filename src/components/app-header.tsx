import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { ChevronLeftIcon, LogOutIcon, UserCircleIcon, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

interface AppHeaderProps {
    back?: boolean;
    close?: boolean;
    logout?: boolean;
    user?: boolean;
}

const AppHeader = ({ back, close, logout, user }: AppHeaderProps) => {
    const { signOut } = useContext(AuthContext);
    return (
        <View className="bg-gray-800 h-24 flex-row items-center justify-between px-4 border-b border-b-gray-900">
            <View className='w-8'>
                {user && (
                    <UserCircleIcon
                        size={30}
                        color={'white'}
                        onPress={() => router.replace('/home')}
                    />
                )}
                {back && (
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <ChevronLeftIcon color={'white'} size={30} />
                    </TouchableOpacity>
                )}
            </View>
            <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 40, height: 40 }}
            />
            <View className='w-8'>
                {close && (
                    <X
                        size={30}
                        color={'white'}
                        onPress={() => router.replace('/home')}
                    />
                )}
                {logout &&
                    <TouchableOpacity
                        onPress={() => signOut()}
                    >
                        <LogOutIcon color={'white'} size={30} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default AppHeader;
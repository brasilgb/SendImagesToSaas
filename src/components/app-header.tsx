import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ChevronLeftIcon, X } from 'lucide-react-native';
import { router } from 'expo-router';

interface AppHeaderProps {
    back: boolean;
    close?: boolean;
}

const AppHeader = ({ back, close }: AppHeaderProps) => {
    return (
        <View className="bg-gray-800 h-24 flex-row items-center justify-between px-2 border-b border-b-gray-900">
            <View className='w-8'>
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
            </View>
        </View>
    )
}

export default AppHeader;
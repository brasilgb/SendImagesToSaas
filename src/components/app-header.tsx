import { View, TouchableOpacity, Image } from 'react-native'
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
        <View className="bg-background h-20 flex-row items-center justify-between px-5 border-b border-border">
            <View className='w-11 items-start'>
                {user && (
                    <TouchableOpacity
                        className="h-11 w-11 items-center justify-center rounded-full bg-card border border-border active:opacity-80"
                        onPress={() => router.replace('/home')}
                    >
                        <UserCircleIcon size={24} color={'#f5f4ef'} />
                    </TouchableOpacity>
                )}
                {back && (
                    <TouchableOpacity
                        className="h-11 w-11 items-center justify-center rounded-full bg-card border border-border active:opacity-80"
                        onPress={() => router.back()}
                    >
                        <ChevronLeftIcon color={'#f5f4ef'} size={24} />
                    </TouchableOpacity>
                )}
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-card border border-border">
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={{ width: 34, height: 34 }}
                />
            </View>
            <View className='w-11 items-end'>
                {close && (
                    <TouchableOpacity
                        className="h-11 w-11 items-center justify-center rounded-full bg-card border border-border active:opacity-80"
                        onPress={() => router.replace('/home')}
                    >
                        <X size={24} color={'#f5f4ef'} />
                    </TouchableOpacity>
                )}
                {logout &&
                    <TouchableOpacity
                        className="h-11 w-11 items-center justify-center rounded-full bg-card border border-border active:opacity-80"
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

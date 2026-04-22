import { AuthContext } from '@/context/AuthContext'
import * as SecureStore from 'expo-secure-store'
import { Check, Eye, EyeOff } from 'lucide-react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Login = () => {
  const { signIn, loading, loginError } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberPassword, setRememberPassword] = useState(false)

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await SecureStore.getItemAsync('email')
        const savedPassword = await SecureStore.getItemAsync('password')
        if (savedEmail && savedPassword) {
          setEmail(savedEmail)
          setPassword(savedPassword)
          setRememberPassword(true)
        }
      } catch (error) {
        console.error('Error loading credentials:', error)
      }
    }
    loadCredentials()
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      return; // Impede o envio se os campos estiverem vazios
    }
    try {
      await signIn({ email, password });
      if (rememberPassword) {
        await SecureStore.setItemAsync('email', email)
        await SecureStore.setItemAsync('password', password)
      } else {
        await SecureStore.deleteItemAsync('email')
        await SecureStore.deleteItemAsync('password')
      }
    } catch (error) {
      // Error is handled in AuthContext
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-800 px-4">
      <View className='mb-8 -mt-24'>
        <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 120, height: 120 }}
      />
      </View>


      <View className="w-full flex-col gap-4">
        <TextInput
          className="w-full rounded-lg bg-gray-700 p-4 text-lg text-white h-[58px]"
          placeholder="E-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View className="relative">
          <TextInput
            className="w-full rounded-lg bg-gray-700 p-4 text-lg text-white h-[58px] pr-12"
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={24} color="#999" /> : <Eye size={24} color="#999" />}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-2">
          <TouchableOpacity onPress={() => setRememberPassword(!rememberPassword)}>
            <View className="w-5 h-5 border border-white rounded mr-2 items-center justify-center">
              {rememberPassword && <Check size={16} color="white" />}
            </View>
          </TouchableOpacity>
          <Text className="text-white">Lembrar senha</Text>
        </View>

        {loginError ? <Text className="text-red-400 text-center mt-2">{loginError}</Text> : null}

        <TouchableOpacity
          className="h-[58px] items-center justify-center rounded-lg bg-blue-600 mt-4 disabled:opacity-50"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-xl font-bold">Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login
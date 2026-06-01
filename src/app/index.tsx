import { AuthContext } from '@/context/AuthContext'
import * as SecureStore from 'expo-secure-store'
import { Check, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native'
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
    <View className="flex-1 justify-center bg-background px-5">
      <View className="items-center mb-10">
        <View className="h-28 w-28 items-center justify-center rounded-[28px] bg-card border border-border shadow-lg shadow-black/30">
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 82, height: 82 }}
          />
        </View>
        <Text className="text-foreground text-3xl font-bold mt-6">VetorOS Image</Text>
        <Text className="text-muted-foreground text-base mt-2 text-center">
          Acesse para anexar imagens às ordens de serviço.
        </Text>
      </View>

      <View className="w-full rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/30">
        <View className="h-[58px] flex-row items-center rounded-xl border border-input bg-muted px-4">
          <Mail size={21} color="#a8b3c7" />
          <TextInput
            className="flex-1 pl-3 text-lg text-foreground"
            placeholder="E-mail"
            placeholderTextColor="#a8b3c7"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="h-[58px] flex-row items-center rounded-xl border border-input bg-muted px-4 mt-4">
          <LockKeyhole size={21} color="#a8b3c7" />
          <TextInput
            className="flex-1 pl-3 pr-3 text-lg text-foreground"
            placeholder="Senha"
            placeholderTextColor="#a8b3c7"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full active:opacity-80"
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={24} color="#a8b3c7" /> : <Eye size={24} color="#a8b3c7" />}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-5">
          <TouchableOpacity onPress={() => setRememberPassword(!rememberPassword)}>
            <View className={`w-6 h-6 border rounded-md mr-3 items-center justify-center ${rememberPassword ? 'bg-ring border-ring' : 'border-border'}`}>
              {rememberPassword && <Check size={16} color="#0b1220" />}
            </View>
          </TouchableOpacity>
          <Text className="text-foreground">Lembrar senha</Text>
        </View>

        {loginError ? <Text className="text-destructive text-center mt-2">{loginError}</Text> : null}

        <TouchableOpacity
          className="h-[58px] items-center justify-center rounded-xl bg-primary mt-5 disabled:opacity-50 shadow-md shadow-primary/20"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0b1220" />
          ) : (
            <Text className="text-primary-foreground text-xl font-bold">Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login

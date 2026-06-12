import { AuthContext } from '@/context/AuthContext'
import * as SecureStore from 'expo-secure-store'
import { Check, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 18 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center gap-[18px] md:flex-row md:items-stretch">
          <View className="justify-center rounded-lg bg-[#15365f] p-6 md:flex-1">
            <View className="h-[84px] w-[84px] items-center justify-center rounded-lg border border-white/15 bg-white/10">
              <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 62, height: 62 }}
              />
            </View>
            <Text className="mt-[22px] text-xs font-black uppercase text-white/70">Imagens da OS</Text>
            <Text className="mt-1 text-[31px] font-black leading-[38px] text-white">VetorOS Imagem</Text>
            <Text className="mt-3 text-[15px] font-semibold leading-[22px] text-white/80">
              Busque ordens de serviço e anexe registros visuais com rapidez.
            </Text>
          </View>

          <View className="w-full justify-center gap-4 rounded-lg border border-border bg-card p-[18px] md:flex-1">
            <View>
              <Text className="text-[22px] font-black leading-7 text-foreground">Acesso de imagens</Text>
              <Text className="mt-1 text-sm leading-5 text-muted-foreground">Informe suas credenciais para anexar imagens às ordens.</Text>
            </View>

            <View>
              <Text className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">E-mail</Text>
              <View className="h-[58px] flex-row items-center rounded-lg border border-input bg-muted px-4">
                <Mail size={21} color="#637083" />
                <TextInput
                  className="flex-1 pl-3 text-base text-foreground"
                  placeholder="E-mail"
                  placeholderTextColor="#637083"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View>
              <Text className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">Senha</Text>
              <View className="h-[58px] flex-row items-center rounded-lg border border-input bg-muted px-4">
                <LockKeyhole size={21} color="#637083" />
                <TextInput
                  className="flex-1 pl-3 pr-3 text-base text-foreground"
                  placeholder="Senha"
                  placeholderTextColor="#637083"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  className="h-10 w-10 items-center justify-center rounded-lg active:opacity-80"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={24} color="#637083" /> : <Eye size={24} color="#637083" />}
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setRememberPassword(!rememberPassword)}>
                <View className={`w-6 h-6 border rounded-md mr-3 items-center justify-center ${rememberPassword ? 'bg-primary border-primary' : 'border-border'}`}>
                  {rememberPassword && <Check size={16} color="#ffffff" />}
                </View>
              </TouchableOpacity>
              <Text className="text-foreground">Lembrar senha</Text>
            </View>

            {loginError ? <Text className="text-destructive text-center">{loginError}</Text> : null}

            <TouchableOpacity
              className="h-[56px] items-center justify-center rounded-lg bg-primary disabled:opacity-50"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-primary-foreground text-base font-bold">Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login

import { AuthContext } from '@/context/AuthContext'
import React, { useContext, useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'

const Login = () => {
  const { signIn, loading, loginError } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      return; // Impede o envio se os campos estiverem vazios
    }
    await signIn({ email, password });
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

        <TextInput
          className="w-full rounded-lg bg-gray-700 p-4 text-lg text-white h-[58px]"
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

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
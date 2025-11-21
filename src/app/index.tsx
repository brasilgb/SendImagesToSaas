import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Login = () => {
  return (
    <View className='items-center'>
      <Text>Login</Text>
      <Link href="/home">
        <Text>Home</Text>
      </Link>
    </View>
  )
}

export default Login
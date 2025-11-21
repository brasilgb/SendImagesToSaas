import { CameraIcon, Search } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import apisos from '@/services/apisos'
import { Link, router } from 'expo-router'

// Define a interface para cada item do resultado
const Home = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [searchResult, setSearchResult] = useState<any>([]) // ← AGORA É ARRAY
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!orderNumber.trim()) return

    Keyboard.dismiss()
    setLoading(true)
    setSearchResult([])

    try {
      const response = await apisos.get(`order/${orderNumber}`)

      // Supondo que venha 1 resultado: transformamos em array
      const result = response.data.result

      setSearchResult(Array.isArray(result) ? result : [result]) // ← GARANTE ARRAY

    } catch (error) {
      console.error('Erro ao buscar ordem:', error)

      setSearchResult([
        {
          order_number: '',
          service_status: '',
          name: '',
          customer: '',
          equipment: '',
          error: 'Ordem de serviço não encontrada.',
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 items-center bg-gray-800 p-4">
      <Text className="text-white text-2xl font-bold mt-10 mb-6">
        Consultar
      </Text>

      <View className="w-full flex-row items-center">
        <TextInput
          className="flex-1 rounded-l-lg bg-gray-700 p-4 text-lg text-white h-[58px]"
          placeholder="Digite o número"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={orderNumber}
          onChangeText={setOrderNumber}
        />
        <TouchableOpacity
          className="h-[58px] items-center justify-center rounded-r-lg bg-blue-600 px-4"
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Search color="white" size={24} />
          )}
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#fff" className="mt-6" />}

      {!loading && searchResult.length > 0 && (
        <View className="mt-8 w-full space-y-4">
          {searchResult.map((item: any, index: number) => (
            item.error ? (
              <View key={index} className="bg-gray-600 p-6 rounded-lg">
                <Text className="text-red-400 text-center text-lg">
                  {item.error}
                </Text>
              </View>
            ) : (
              <View
                key={index}
                className="bg-gray-600 px-5 py-4 rounded-xl flex-row items-center justify-between shadow-md shadow-black/40"
              >
                {/* LADO ESQUERDO */}
                <View className="flex-1 mr-4">

                  <Text className="text-white text-lg">
                    <Text className="font-bold">OS:</Text> {item.order_number}
                  </Text>

                  <Text className="text-white text-lg">
                    <Text className="font-bold">Cliente:</Text> {item.customer?.name}
                  </Text>

                  <Text className="text-white text-lg">
                    <Text className="font-bold">Equipamento:</Text> {item.equipment?.equipment}
                  </Text>

                  <Text className="text-white text-lg mt-2">
                    <Text className="font-bold">Status:</Text> {item.service_status}
                  </Text>

                </View>

                {/* LADO DIREITO — ÍCONE */}
                <Link
                  href={{ pathname: "/images", params: { order: item.id } }}
                  asChild
                >
                  <TouchableOpacity className="p-3 bg-gray-700 rounded-xl active:opacity-80">
                    <CameraIcon size={48} color="#EEA917" />
                  </TouchableOpacity>
                </Link>
              </View>
            )
          ))}
        </View>
      )}
    </View>
  )
}

export default Home
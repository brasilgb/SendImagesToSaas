import { AuthContext } from '@/context/AuthContext'
import apisos from '@/services/apisos'
import { Link } from 'expo-router'
import { ImageUpIcon, Search } from 'lucide-react-native'
import React, { useContext, useState } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

interface SearchResultItem {
  id: number;
  order_number: string;
  service_status: string;
  customer?: {
    name: string;
  };
  equipment?: {
    equipment: string;
  };
}

const Home = () => {
  const { user } = useContext(AuthContext);
  const [orderNumber, setOrderNumber] = useState('')
  const [searchResult, setSearchResult] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [searchAttempted, setSearchAttempted] = useState(false)
  const normalizedOrderNumber = orderNumber.trim()

  const handleSearch = async () => {
    if (!normalizedOrderNumber) {
      setSearchResult([]);
      setSearchError('Digite um número de OS para buscar.');
      setSearchAttempted(true);
      return
    }

    Keyboard.dismiss()
    setLoading(true)
    setSearchError('')
    setSearchAttempted(true)
    setSearchResult([])

    try {
      const response = await apisos.get(`order/${normalizedOrderNumber}`)
      const result = response.data?.result ?? []
      const normalizedResult = Array.isArray(result) ? result : [result]
      setSearchResult(normalizedResult.filter(Boolean))

    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Não foi possível buscar essa ordem. Tente novamente.'
      setSearchError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-gray-800 px-4 pt-6">
      <View className="items-center">
        <Text className="text-yellow-400 text-sm">
          Você entrou como, {user?.name}
        </Text>
        <Text className="text-white text-2xl font-bold mt-5 mb-2 text-center">
          Buscar ordem para inserir imagem
        </Text>
        <Text className="text-gray-300 text-sm mb-6 text-center">
          Digite o número da OS e abra o cadastro de imagens.
        </Text>
      </View>

      <View className="w-full flex-row items-center">
        <TextInput
          className="flex-1 rounded-l-lg bg-gray-700 px-4 text-lg text-white h-[58px]"
          placeholder="Número da OS"
          placeholderTextColor="#999"
          keyboardType="numeric"
          returnKeyType="search"
          value={orderNumber}
          onChangeText={(value) => {
            setOrderNumber(value)
            if (searchError) setSearchError('')
          }}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          className={`h-[58px] items-center justify-center rounded-r-lg px-5 ${loading || !normalizedOrderNumber ? 'bg-gray-600' : 'bg-blue-600'}`}
          onPress={handleSearch}
          disabled={loading || !normalizedOrderNumber}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Search color="white" size={24} />
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="flex-row items-center gap-3 mt-5">
          <ActivityIndicator color="#fff" />
          <Text className="text-gray-200">Buscando ordem...</Text>
        </View>
      )}

      {!!searchError && (
        <View className="bg-red-950/70 border border-red-700 rounded-lg p-4 mt-5">
          <Text className="text-red-300 text-base">{searchError}</Text>
        </View>
      )}

      {!loading && searchAttempted && !searchError && searchResult.length === 0 && (
        <View className="bg-gray-700 rounded-lg p-4 mt-5">
          <Text className="text-gray-200 text-base">Nenhuma ordem encontrada para essa busca.</Text>
        </View>
      )}

      {!loading && searchResult.length > 0 && (
        <ScrollView
          className="mt-5"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-8"
        >
          <Text className="text-gray-300 mb-3">
            {searchResult.length} resultado(s) encontrado(s)
          </Text>
          <View className="w-full space-y-4">
            {searchResult.map((item) => (
              <View
                key={item.id}
                className="bg-gray-600 px-5 mb-2 py-4 rounded-xl flex-row items-center justify-between shadow-md shadow-black/40"
              >
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

                <Link
                  href={{ pathname: "/images", params: { order: item.id } }}
                  asChild
                >
                  <TouchableOpacity className="p-3 bg-gray-700 rounded-xl active:opacity-80">
                    <ImageUpIcon size={48} color="#EEA917" />
                  </TouchableOpacity>
                </Link>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default Home

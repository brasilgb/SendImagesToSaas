import { Search } from 'lucide-react-native'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

// Define a interface para o resultado da busca
interface SearchResult {
  number_order: string
  status: string
  error?: string
}

const Home = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      return // Impede a busca se o input estiver vazio
    }
    Keyboard.dismiss() // Fecha o teclado
    setLoading(true)
    setSearchResult(null)

    // Simulação de chamada a uma API.
    // Substitua este bloco pelo fetch à sua API real.
    setTimeout(() => {
      if (orderNumber === '12345') {
        setSearchResult({
          number_order: '12345',
          status: 'Em andamento',
        })
      } else {
        setSearchResult({
          number_order: '',
          status: '',
          error: 'Ordem de serviço não encontrada.',
        })
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <View className="flex-1 items-center bg-gray-800 p-4">
      <Text className="text-white text-2xl font-bold mt-10 mb-6">
        Consultar Ordem de Serviço
      </Text>
      <View className="w-full flex-row items-center">
        <TextInput
          className="flex-1 rounded-l-lg bg-gray-700 p-4 text-lg text-white h-[58px]"
          placeholder="Digite o número da OS"
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

      {searchResult && !loading && (
        <View className="mt-8 bg-gray-700 p-6 rounded-lg w-full">
          {searchResult.error ? (
            <Text className="text-red-400 text-center text-lg">
              {searchResult.error}
            </Text>
          ) : (
            <>
              <Text className="text-white text-lg">
                <Text className="font-bold">Entrada:</Text>{' '}
                {searchResult.number_order}
              </Text>
              <Text className="text-white text-lg mt-2">
                <Text className="font-bold">Status:</Text> {searchResult.status}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  )
}

export default Home
import { AuthContext } from '@/context/AuthContext'
import apisos from '@/services/apisos'
import { Link } from 'expo-router'
import { ClipboardList, ImageUpIcon, Search } from 'lucide-react-native'
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

  const sortByOrderNumber = (items: SearchResultItem[]) => {
    return [...items].sort((first, second) =>
      first.order_number.localeCompare(second.order_number, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    )
  }

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
      setSearchResult(sortByOrderNumber(normalizedResult.filter(Boolean)))

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
    <View className="flex-1 bg-background px-5 pt-5">
      <View className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/30">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent">
          <ClipboardList size={26} color="#00b4ff" />
        </View>
        <Text className="text-primary text-sm mt-5">
          Você entrou como, {user?.name}
        </Text>
        <Text className="text-foreground text-3xl font-bold mt-2">
          Buscar ordem
        </Text>
        <Text className="text-muted-foreground text-base mt-2">
          Digite o número da OS e abra o cadastro de imagens.
        </Text>

        <View className="w-full flex-row items-center mt-5">
          <TextInput
            className="flex-1 rounded-l-xl border border-input bg-muted px-4 text-lg text-foreground h-[60px]"
            placeholder="Número da OS"
            placeholderTextColor="#a8b3c7"
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
            className={`h-[60px] w-[62px] items-center justify-center rounded-r-xl ${loading || !normalizedOrderNumber ? 'bg-muted border border-l-0 border-input' : 'bg-primary'}`}
            onPress={handleSearch}
            disabled={loading || !normalizedOrderNumber}
          >
            {loading ? (
              <ActivityIndicator color="#0b1220" />
            ) : (
              <Search color={normalizedOrderNumber ? '#0b1220' : '#a8b3c7'} size={24} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View className="flex-row items-center gap-3 mt-5 rounded-xl border border-border bg-card p-4">
          <ActivityIndicator color="#00b4ff" />
          <Text className="text-foreground">Buscando ordem...</Text>
        </View>
      )}

      {!!searchError && (
        <View className="bg-destructive/15 border border-destructive rounded-xl p-4 mt-5">
          <Text className="text-destructive text-base">{searchError}</Text>
        </View>
      )}

      {!loading && searchAttempted && !searchError && searchResult.length === 0 && (
        <View className="bg-card rounded-xl border border-border p-5 mt-5 items-center">
          <Search color="#a8b3c7" size={28} />
          <Text className="text-foreground text-base font-semibold mt-3">Nenhuma ordem encontrada</Text>
          <Text className="text-muted-foreground text-sm text-center mt-1">Confira o número da OS e tente novamente.</Text>
        </View>
      )}

      {!loading && searchResult.length > 0 && (
        <ScrollView
          className="mt-5"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-8"
        >
          <Text className="text-muted-foreground mb-3">
            {searchResult.length} resultado(s) encontrado(s)
          </Text>
          <View className="w-full">
            {searchResult.map((item) => (
              <View
                key={item.order_number}
                className="bg-card px-5 mb-3 py-4 rounded-2xl border border-border shadow-md shadow-black/30"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-muted-foreground text-xs uppercase font-bold">Ordem de serviço</Text>
                    <Text className="text-card-foreground text-3xl font-bold mt-1">{item.order_number}</Text>
                  </View>
                  <View className="rounded-full bg-accent px-3 py-1">
                    <Text className="text-accent-foreground text-xs font-bold">{item.service_status}</Text>
                  </View>
                </View>

                <View className="h-px bg-border my-4" />

                <View className="gap-2">
                  <View>
                    <Text className="text-muted-foreground text-xs uppercase font-bold">Cliente</Text>
                    <Text className="text-card-foreground text-base mt-1">{item.customer?.name || 'Não informado'}</Text>
                  </View>

                  <View>
                    <Text className="text-muted-foreground text-xs uppercase font-bold">Equipamento</Text>
                    <Text className="text-card-foreground text-base mt-1">{item.equipment?.equipment || 'Não informado'}</Text>
                  </View>
                </View>

                <Link
                  href={{ pathname: "/images", params: { order: item.order_number } }}
                  asChild
                >
                  <TouchableOpacity className="mt-5 h-12 flex-row items-center justify-center gap-2 bg-primary rounded-xl active:opacity-80">
                    <ImageUpIcon size={22} color="#0b1220" />
                    <Text className="text-primary-foreground font-bold text-base">Inserir imagens</Text>
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

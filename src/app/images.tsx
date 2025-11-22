import { AuthContext } from '@/context/AuthContext';
import apisos from '@/services/apisos';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { BookImageIcon, CameraIcon } from 'lucide-react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StatusBar, Text, View } from "react-native";

interface ImageItem {
  id: number;
  filename: string;
}

const Images = () => {
  const { user } = useContext(AuthContext);
  const { order } = useLocalSearchParams<{ order: string }>();
  const height = StatusBar.currentHeight;
  const [loading, setLoading] = useState<boolean>(false);
  const [imageView, setImageView] = useState<ImageItem[]>([]);

  const getPermission = async () => {

    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      alert('Você precisa dar permissão!');
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  const selectImage = async (useLibrary: boolean) => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    // Save image if not cancelled
    if (result.assets && result.assets[0].base64) {
      uploadImage(result.assets[0].base64);
    }
  };

  const uploadImage = async (image: string) => {

    setLoading(true);
    await apisos.post('upload', {
      order_id: order,
      filename: image,
      tenant_id: user?.tenant_id
    }).then((res) => {
      getShowImages();
      Alert.alert(
        'Sucesso',
        'A imagem foi salva com sucesso!'
      )
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })
  }

  const deleteImg = async (id: number) => {
    setLoading(true);
    await apisos.delete(`deleteimage/${id}`)
      .then((res) => {
        getShowImages();
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id: number) => {

    Alert.alert(
      'Deletar imagem',
      'Têm certeza que quer deletar esta imagem?',
      [
        {
          text: 'Não',
        },
        { text: 'Sim', onPress: () => deleteImg(id) },
      ]
    )
  };

  const getShowImages = async () => {
    await apisos.get(`images/${order}`)
      .then((res) => {
        const { result } = res.data;
        setImageView(result);
      })
  };

  useFocusEffect(
    useCallback(() => {
      getShowImages();
    }, [])
  );

  const lockUpload = imageView.length === 6;

  return (
    <>
      <View className='flex-1 bg-gray-800' style={{ paddingTop: height }}>
        <View className='bg-megb-blue-secundary p-4'>
          <View className='flex-col items-center'>
            <Text className='text-xl uppercase font-bold text-white'>Uplod de arquivos para a ordem</Text>
            <View className='flex-row items-end'>
              <Text className='text-2xl font-bold text-gray-50 mr-2 pb-3'>Nº</Text>
              <Text className='text-6xl uppercase font-bold text-sky-700 mt-4'>{order}</Text>
            </View>
          </View>
        </View>
        <View className='flex-row items-center justify-center'>
          <Text className='text-red-400'>Máximo 6 imagens</Text>
        </View>
        <View className='flex-row items-center justify-around py-6'>
          <View>
            <Pressable
              disabled={lockUpload ? true : false}
              onPress={() => selectImage(true)}
              className={`w-36 gap-2 flex-row justify-center py-3 ${lockUpload ? 'bg-gray-400' : 'bg-sky-700'} rounded-lg shadow-lg shadow-black/40 active:opacity-80`}
            >
              <BookImageIcon size={24} color={`${lockUpload ? '#6b7280' : '#FFC436'}`} />
              <Text className={`text-lg font-bold ${lockUpload ? 'text-gray-500' : 'text-white'}`}>Galeria</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              disabled={lockUpload ? true : false}
              onPress={() => selectImage(false)}
              className={`w-36 gap-2 flex-row justify-center py-3 ${lockUpload ? 'bg-gray-400' : 'bg-sky-700'} rounded-lg shadow-lg shadow-black/40 active:opacity-80`}
            >
              <CameraIcon size={24} color={`${lockUpload ? '#6b7280' : '#FFC436'}`} />
              <Text className={`text-lg font-bold ${lockUpload ? 'text-gray-500' : 'text-white'}`}>Câmera</Text>
            </Pressable>
          </View>
        </View>
        <View className='flex-wrap flex-row items-start justify-start gap-3 mt-6 mx-3 w-full relative'>
          {imageView.map((img, idx) => (
            <View key={idx} className='bg-sky-700 border border-sky-500 rounded-md shadow-md shadow-gray-600/40 w-[30%]'>
              <View className='p-2 flex items-center'>
                <Ionicons name='trash' size={24} color="#FFC436" onPress={() => handleDelete(img.id)} />
              </View>
              <Image
                className="w-full h-24 border border-white rounded-md"
                source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_IP}/storage/orders/${order}/${img.filename}` }}
              />
            </View>
          ))}
        </View>
      </View>
      {loading && (
        <View className='absolute top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center'>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
    </>
  )
}

export default Images
import { AuthContext } from '@/context/AuthContext';
import apisos from '@/services/apisos';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { BookImageIcon, CameraIcon, ImageIcon, RotateCcw, Trash2, X, ZoomIn, ZoomOut } from 'lucide-react-native';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, Modal, PanResponder, Pressable, ScrollView, StatusBar, Text, View } from "react-native";

interface ImageItem {
  id: number;
  filename: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const MAX_IMAGES = 8;

function ZoomableImageModal({ uri, onClose }: { uri: string | null; onClose: () => void }) {
  const scale = useRef(new Animated.Value(MIN_ZOOM)).current;
  const currentScale = useRef(MIN_ZOOM);
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchScale = useRef(MIN_ZOOM);

  const setZoom = useCallback((nextScale: number, animated = true) => {
    const normalizedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextScale));
    currentScale.current = normalizedScale;

    if (animated) {
      Animated.spring(scale, {
        toValue: normalizedScale,
        useNativeDriver: true,
        friction: 8,
      }).start();
      return;
    }

    scale.setValue(normalizedScale);
  }, [scale]);

  useEffect(() => {
    if (uri) {
      setZoom(MIN_ZOOM, false);
    }
  }, [setZoom, uri]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (event) => event.nativeEvent.touches.length === 2,
    onMoveShouldSetPanResponder: (event) => event.nativeEvent.touches.length === 2,
    onPanResponderGrant: (event) => {
      const [firstTouch, secondTouch] = event.nativeEvent.touches;

      if (!firstTouch || !secondTouch) {
        return;
      }

      initialPinchDistance.current = Math.hypot(
        secondTouch.pageX - firstTouch.pageX,
        secondTouch.pageY - firstTouch.pageY,
      );
      initialPinchScale.current = currentScale.current;
    },
    onPanResponderMove: (event) => {
      const [firstTouch, secondTouch] = event.nativeEvent.touches;

      if (!firstTouch || !secondTouch || !initialPinchDistance.current) {
        return;
      }

      const distance = Math.hypot(
        secondTouch.pageX - firstTouch.pageX,
        secondTouch.pageY - firstTouch.pageY,
      );

      setZoom(initialPinchScale.current * (distance / initialPinchDistance.current), false);
    },
    onPanResponderRelease: () => {
      initialPinchDistance.current = null;
    },
    onPanResponderTerminate: () => {
      initialPinchDistance.current = null;
    },
  }), [setZoom]);

  return (
    <Modal
      visible={Boolean(uri)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <View className="absolute right-5 top-12 z-10">
          <Pressable
            accessibilityLabel="Fechar imagem"
            className="h-12 w-12 items-center justify-center rounded-full bg-white/15 active:opacity-70"
            onPress={onClose}
          >
            <X size={26} color="#ffffff" />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center overflow-hidden" {...panResponder.panHandlers}>
          {uri ? (
            <Animated.Image
              source={{ uri }}
              resizeMode="contain"
              className="h-full w-full"
              style={{ transform: [{ scale }] }}
            />
          ) : null}
        </View>

        <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-center gap-3">
          <Pressable
            accessibilityLabel="Diminuir zoom"
            className="h-12 w-12 items-center justify-center rounded-full bg-white/15 active:opacity-70"
            onPress={() => setZoom(currentScale.current - 0.5)}
          >
            <ZoomOut size={24} color="#ffffff" />
          </Pressable>
          <Pressable
            accessibilityLabel="Redefinir zoom"
            className="h-12 w-12 items-center justify-center rounded-full bg-white/15 active:opacity-70"
            onPress={() => setZoom(MIN_ZOOM)}
          >
            <RotateCcw size={22} color="#ffffff" />
          </Pressable>
          <Pressable
            accessibilityLabel="Aumentar zoom"
            className="h-12 w-12 items-center justify-center rounded-full bg-white/15 active:opacity-70"
            onPress={() => setZoom(currentScale.current + 0.5)}
          >
            <ZoomIn size={24} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const Images = () => {
  const { user } = useContext(AuthContext);
  const { order } = useLocalSearchParams<{ order: string }>();
  const height = StatusBar.currentHeight;
  const [loading, setLoading] = useState<boolean>(false);
  const [imageView, setImageView] = useState<ImageItem[]>([]);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

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
      order_number: order,
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
    try {
      const res = await apisos.get(`images/${order}`);
      const { result } = res.data;
      setImageView(result);
    } catch (err: any) {
      console.log('Erro ao carregar imagens:', err.response?.status, err.response?.data);
      Alert.alert('Erro', 'Não foi possível carregar as imagens. Verifique a conexão com o servidor.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      getShowImages();
    }, [order])
  );

  const lockUpload = imageView.length >= MAX_IMAGES;
  const uploadedCount = imageView.length;

  return (
    <>
      <View className='flex-1 bg-background' style={{ paddingTop: height }}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pt-5 pb-8"
        >
          <View className='bg-card border border-border rounded-2xl p-5 shadow-lg shadow-black/30'>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className='text-muted-foreground text-xs uppercase font-bold'>Upload de arquivos</Text>
                <Text className='text-foreground text-3xl font-bold mt-2'>OS {order}</Text>
                <Text className='text-muted-foreground text-base mt-2'>Anexe até oito imagens nesta ordem de serviço.</Text>
              </View>
              <View className='h-14 w-14 rounded-2xl bg-accent items-center justify-center'>
                <ImageIcon size={28} color="#00b4ff" />
              </View>
            </View>

            <View className="mt-5 h-2 rounded-full bg-muted overflow-hidden">
              <View
                className="h-full rounded-full bg-ring"
                style={{ width: `${(Math.min(uploadedCount, MAX_IMAGES) / MAX_IMAGES) * 100}%` }}
              />
            </View>
            <View className='mt-3 flex-row items-center justify-between'>
              <Text className='text-muted-foreground text-sm'>Limite de imagens</Text>
              <Text className='text-foreground text-sm font-bold'>{uploadedCount}/{MAX_IMAGES}</Text>
            </View>
          </View>

          <View className='flex-row items-center justify-between gap-3 py-6'>
            <Pressable
              disabled={lockUpload ? true : false}
              onPress={() => selectImage(true)}
              className={`flex-1 h-16 gap-2 flex-row items-center justify-center ${lockUpload ? 'bg-muted border border-border' : 'bg-primary'} rounded-2xl shadow-lg shadow-black/30 active:opacity-80`}
            >
              <BookImageIcon size={24} color={`${lockUpload ? '#a8b3c7' : '#0b1220'}`} />
              <Text className={`text-base font-bold ${lockUpload ? 'text-muted-foreground' : 'text-primary-foreground'}`}>Galeria</Text>
            </Pressable>

            <Pressable
              disabled={lockUpload ? true : false}
              onPress={() => selectImage(false)}
              className={`flex-1 h-16 gap-2 flex-row items-center justify-center ${lockUpload ? 'bg-muted border border-border' : 'bg-primary'} rounded-2xl shadow-lg shadow-black/30 active:opacity-80`}
            >
              <CameraIcon size={24} color={`${lockUpload ? '#a8b3c7' : '#0b1220'}`} />
              <Text className={`text-base font-bold ${lockUpload ? 'text-muted-foreground' : 'text-primary-foreground'}`}>Câmera</Text>
            </Pressable>
          </View>

          {imageView.length === 0 ? (
            <View className="bg-card border border-border rounded-2xl p-8 items-center">
              <ImageIcon size={34} color="#a8b3c7" />
              <Text className="text-foreground text-base font-semibold mt-4">Nenhuma imagem enviada</Text>
              <Text className="text-muted-foreground text-sm text-center mt-1">Use a câmera ou galeria para adicionar a primeira imagem.</Text>
            </View>
          ) : (
            <View>
              <Text className="text-muted-foreground mb-3">{uploadedCount} imagem(ns) enviada(s)</Text>
              <View className='flex-wrap flex-row items-start justify-between gap-y-4'>
                {imageView.map((img, idx) => (
                  <View key={idx} className='bg-card border border-border rounded-2xl shadow-md shadow-black/30 w-[48%] overflow-hidden'>
                    <Pressable
                      accessibilityLabel={`Ampliar imagem ${idx + 1}`}
                      onPress={() => setSelectedImageUri(`${process.env.EXPO_PUBLIC_SERVER_IP}/storage/orders/${order}/${img.filename}`)}
                    >
                      <Image
                        className="w-full h-36"
                        source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_IP}/storage/orders/${order}/${img.filename}` }}
                      />
                    </Pressable>
                    <View className="flex-row items-center justify-between p-3">
                      <Text className="text-muted-foreground text-xs font-bold">Imagem {idx + 1}</Text>
                      <Pressable
                        className="h-9 w-9 items-center justify-center rounded-full bg-destructive/15 active:opacity-80"
                        onPress={() => handleDelete(img.id)}
                      >
                        <Trash2 size={18} color="#e5484d" />
                      </Pressable>
                    </View>
                </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      {loading && (
        <View className='absolute top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center'>
          <ActivityIndicator color="#00b4ff" size="large" />
        </View>
      )}
      <ZoomableImageModal uri={selectedImageUri} onClose={() => setSelectedImageUri(null)} />
    </>
  )
}

export default Images

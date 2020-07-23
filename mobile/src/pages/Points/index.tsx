import React, { useCallback, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import {Feather as Icon} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, {Marker} from 'react-native-maps'
import * as Location from 'expo-location'
import {SvgUri} from 'react-native-svg'
import api from '../../services/api'

import {styles} from './styles'

interface ItemsData {
  id: number;
  title: string;
  image_url: string;
}

interface PointsData {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface RouteParams {
  uf: string;
  city: string
}

const Points = () => {
  const [items, setItems] = useState<ItemsData[]>([])
  const [points, setPoints] = useState<PointsData[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initialPositiion, setInitialPosition] = useState<[number, number]>([0,0])

  const navigation = useNavigation()
  const routes = useRoute()

  const { uf, city} = routes.params as RouteParams

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city,
        uf,
        items: selectedItems
      }
    }).then(response => {
      setPoints(response.data)
    })
  }, [selectedItems])

  useEffect(() => {
    async function useLocale() {
      const { status } = await Location.requestPermissionsAsync()

      if(status !== 'granted') {
        Alert.alert('ooooops...', 'Precisamos da sua permissão para obter a localização.')
        return;
      }
      const location = await Location.getCurrentPositionAsync()

      const {latitude, longitude} = location.coords;

      setInitialPosition([latitude, longitude])
    }
    useLocale()
  }, [])

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [])

  const handleNavigateToDetail = useCallback((id: number) => {
    navigation.navigate('Detail', { point_id: id})
  }, [])

  const handleSelectedItem = useCallback((id: number) => {
    const findItem = selectedItems.findIndex(item => item === id)

    if(findItem >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }, [])

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name='arrow-left' size={20}  color='#34cb79'/>
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa, um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          { initialPositiion[0] !== 0 && (
            <MapView 
            style={styles.map}
            initialRegion={{
              latitude: initialPositiion[0],
              longitude: initialPositiion[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014
            }}
          >
           {points.map(point => (
              <Marker
              key={String(point.id)}
              style={styles.mapMarker}
              onPress={() => handleNavigateToDetail(point.id)}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image 
                  style={styles.mapMarkerImage} 
                  source={{ uri: point.image_url }}
                />
                <Text style={styles.mapMarkerTitle}>{point.name}</Text>
              </View>
            </Marker>
           ))}
          </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator= {false}
          contentContainerStyle={{paddingHorizontal: 20}}
        >
          {items.map(item => (
             <TouchableOpacity 
              key={String(item.id)} 
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]} 
              onPress={() => handleSelectedItem(item.id)}
              activeOpacity={0.6} 
            >
              <SvgUri width={42} height={42} uri={item.image_url}/>
              <Text style={styles.itemTitle}>{item.title}</Text>
           </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default Points
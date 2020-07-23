import React, {useCallback, useEffect, useState} from 'react'
import { View, TouchableOpacity, Image, Text, Linking } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import {Feather as Icon, FontAwesome} from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer';

import { styles } from './styles'
import api from '../../services/api'

interface RouteParams {
  point_id: string
}

interface PointData {
  point: {
    name: string;
    image: string;
    image_url: string;
    email: string;
    whatsapp: string;
    uf: string;
    city: string;
  };
  items: {
    title: string
  }[];
}

const Detail = () => {
  const [data, setData] = useState<PointData>({} as PointData)

  const navigation = useNavigation()
  const route = useRoute()

  const {point_id} = route.params as RouteParams

  useEffect(() => {
    api.get(`/points/${point_id}`).then(response => {
      setData(response.data)
    })
  }, [])

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [])

  const handleWhatsApp = useCallback(() => {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre a coleta de resíduos`)
  }, [])

  const handleMailCompose = useCallback(() => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    })
  }, [])

  if(!data.point) {
    return null
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name='arrow-left' size={20}  color='#34cb79'/>
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data.point.image_url }}/>
        
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton 
          style={styles.button}
          onPress={handleWhatsApp}
        >
          <FontAwesome name='whatsapp' size={20} color='#fff'/>
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>
        <RectButton 
          style={styles.button}
          onPress={handleMailCompose}
        >
          <Icon name='mail' size={20} color='#fff'/>
          <Text style={styles.buttonText}>E-Mail</Text>
        </RectButton>
      </View>
    </>
  )
}

export default Detail
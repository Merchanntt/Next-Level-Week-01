import React, { useState, useCallback, useEffect, ChangeEvent } from 'react'
import { View, ImageBackground ,Image, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'
import {RectButton} from 'react-native-gesture-handler'
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import axios from 'axios'

import { styles } from './styles'

interface IBGEuFData {
  sigla: string;
}

interface IBGECityData {
  nome: string;
}

const Home = () => {
  const [uf, setuf] = useState<string[]>([])
  const [city, setcity] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  const navigation = useNavigation()

  useEffect(() => {
    axios.get<IBGEuFData[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitial = response.data.map(uf => uf.sigla)

      setuf(ufInitial)
    })
  }, [])

  useEffect(() => {
    if(selectedUf === '0') {
      return
    }

    axios.get<IBGECityData[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const citiesName = response.data.map(city => city.nome)

      setcity(citiesName)
    })
  }, [selectedUf])

  const handleNavigateToMap = useCallback(() => {
    if(selectedCity === '0') {
      return
    }

    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUf
    })
  }, [])

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        style={styles.container}
        source={require('../../assets/home-background.png')}
        imageStyle= {{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')}/>
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{label: `Estado (UF)`, value: null}}
            style={{viewContainer: styles.input }}
            onValueChange={setSelectedUf}
            items={
              uf.map(ufs => {
                return { label: `${ufs}`, value: `${ufs}`}
              })
            }
        />
          <RNPickerSelect
            placeholder={{label: `Cidade`, value: null}}
              style={{viewContainer: styles.input }}
              onValueChange={setSelectedCity}
              items={
                city.map(city => {
                  return { label: `${city}`, value: `${city}`}
                })
              }
          />
          
          <RectButton style={styles.button} onPress={handleNavigateToMap}>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
            <View style={styles.buttonIcon}>
            <Text>
              <Icon name='arrow-right' size={20} color='#fff'/>
            </Text>
            </View>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>  
  )
}

export default Home;
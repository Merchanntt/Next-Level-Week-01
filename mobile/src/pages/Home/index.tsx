import React, { useState, useCallback } from 'react'
import { View, ImageBackground ,Image, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'
import {RectButton, TextInput} from 'react-native-gesture-handler'

import { styles } from './styles'

const Home = () => {
  const [uf, setuf] = useState('')
  const [city, setcity] = useState('')

  const navigation = useNavigation()

  const handleNavigateToMap = useCallback(() => {
    navigation.navigate('Points', {
      city,
      uf
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
          <TextInput
            style={styles.input}
            placeholder='Selecionar Estado'
            autoCapitalize='characters'
            maxLength={2}
            autoCorrect={false}
            value={uf}
            onChangeText={setuf} 
          />
          <TextInput
            style={styles.input}
            placeholder='Selecionar Cidade' 
            autoCorrect={false}
            value={city}
            onChangeText={setcity}
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
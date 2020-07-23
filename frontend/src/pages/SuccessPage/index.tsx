import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Lottie from 'lottie-web'

import { Container, Description, Goback } from './styles'
import CheckAnimation from '../../assets/check.json'

const SuccessPage = () => {

  return (
    <Container>
        <FiCheckCircle size={100} color='#34CB79' />
        <Description>Seu ponto de coleta foi cadastrado com sucesso!</Description>
    <Goback>
      <Link to='/'>Voltar</Link>
    </Goback>
    </Container>
  )
}

export default SuccessPage
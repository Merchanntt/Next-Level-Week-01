import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Lottie from 'lottie-web'

import { Container, Description, Goback, Animation } from './styles'
import CheckAnimation from '../../assets/check.json'

const SuccessPage = () => {
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(element.current) {
      Lottie.loadAnimation({
        container: element.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: CheckAnimation
        });
    }
  }, [])

  return (
    <Container>
        <Animation ref={element}/>
        <Description>Seu ponto de coleta foi cadastrado com sucesso!</Description>
    <Goback>
      <Link to='/'>Voltar</Link>
    </Goback>
    </Container>
  )
}

export default SuccessPage
import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import {Map, TileLayer, Marker} from 'react-leaflet'
import { LeafletMouseEvent} from 'leaflet'
import axios from 'axios'
import api from '../../services/api'

import './style.css'
import DropZone from '../../components/dropzone'

import logo from '../../assets/logo.svg'

interface ItemsData {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEuFData {
  sigla: string;
}

interface IBGECityData {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<ItemsData[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [initialLocal, setInitialLocal] = useState<[number, number]>([0,0])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File>()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedLocal, setSelectedLocal] = useState<[number, number]>([0,0])

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;

      setInitialLocal([
        latitude,
        longitude
      ])
    })
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGEuFData[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const UfInitials = response.data.map(uf => uf.sigla)

      setUfs(UfInitials)
    })
  }, [])

  useEffect(() => {
    if(selectedUf === '0') {
      return
    }

    axios.get<IBGECityData[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const cityName = response.data.map(city => city.nome)

      setCities(cityName)
    })
  }, [selectedUf])

  const handleSubimitInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target

    setFormData({...formData, [name]: value})
  }, [formData])

  const handleSubimitUf = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const uf = event.target.value

    setSelectedUf(uf)
  }, [])

  const handleSubimitCity = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value

    setSelectedCity(city)
  }, [])

  const handleSubimitLocal = useCallback((event: LeafletMouseEvent ) => {
    setSelectedLocal([
      event.latlng.lat,
      event.latlng.lng
    ])
  }, [])

  const handleSelectedItems = useCallback((id: number ) => {
    const findItems = selectedItems.findIndex(item => item === id)

    if(findItems >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }, [selectedItems])

  const handleSubimitForm = useCallback( async (event: FormEvent ) => {
    event.preventDefault();

    const {name, email, whatsapp} = formData;
    const [latitude, longitude] = selectedLocal;
    const uf = selectedUf;
    const city = selectedCity;
    const items = selectedItems;

    const CreatePoint = new FormData()

   
      CreatePoint.append('name', name);
      CreatePoint.append('email', email);
      CreatePoint.append('whatsapp', whatsapp);
      CreatePoint.append('latitude', String(latitude));
      CreatePoint.append('longitude', String(longitude));
      CreatePoint.append('uf', uf);
      CreatePoint.append('city', city);
      CreatePoint.append('items', items.join(','));

      if (selectedFile) {
        CreatePoint.append('image', selectedFile);
      }
    

    await api.post('points', CreatePoint)

    alert('Ponto de Coleta cadastrado!')

    history.push('/success')

  }, [formData, selectedLocal, selectedUf, selectedCity, selectedItems, selectedFile, history])

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="ecoleta"/>

        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubimitForm}>

      <DropZone onUploadFile={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
            type="text"
            name="name"
            id="name"
            onChange={handleSubimitInput}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input 
              type="email"
              name="email"
              id="email"
              onChange={handleSubimitInput}

              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input 
              type="text"
              name="whatsapp"
              id="whatsapp"
              onChange={handleSubimitInput}
              />
            </div>
          </div>
        </fieldset>

        

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione um endereço no mapa</span>
          </legend>

          <Map center={initialLocal} zoom={15} onClick={handleSubimitLocal}>
          <TileLayer 
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedLocal}/>
        </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                name="uf" 
                id="uf" 
                value={selectedUf} 
                onChange={handleSubimitUf}
              >
                <option value="0">Selecione um UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf} >{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select 
                name="city" 
                id="city"
                value={selectedCity}
                onChange={handleSubimitCity}
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map(city => (
                  <option key={city} value={city} >{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
               <li 
                key={item.id}
                onClick={() => handleSelectedItems(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
               >
               <img src={item.image_url} alt={item.title}/>
               <span>{item.title}</span>
             </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint    
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {FiUpload} from 'react-icons/fi'

import './styles.css'

interface Props {
  onUploadFile: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({onUploadFile}) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    const image = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(image)

    setSelectedImageUrl(fileUrl)
    onUploadFile(image)
  }, [onUploadFile])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className='dropzone'{...getRootProps()}>
      <input {...getInputProps()} />

      { selectedImageUrl
        ? <img src={selectedImageUrl} alt="point"/>
        : (
            isDragActive ?
              <p>Arraste sua imagem aqui...</p> :
              <p>
                <FiUpload />
                Imagem do estabelecimento
              </p>
        )
      }
      
    </div>
  )
}

export default Dropzone;
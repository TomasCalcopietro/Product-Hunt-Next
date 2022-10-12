import React, {useState, useContext} from "react"
import { css } from '@emotion/react'
import Router, {useRouter} from "next/router"
import Layout from "../components/layout/Layout"
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario'

import { collection , addDoc } from 'firebase/firestore';
import firebase, { FirebaseContext } from "../firebase"
import { ref, getDownloadURL, uploadBytesResumable } from '@firebase/storage';
import Error404 from "../components/layout/404"

// Validaciones
import useValidacion from "../hooks/useValidacion"
import validarCrearProducto from "../validacion/validarCrearProducto"

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  image: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  const [ error, guardarError ] = useState(false)

  const { valores, errores, submitForm, handleSubmit, handleChange, handleBlur } = useValidacion
  (STATE_INICIAL, validarCrearProducto, crearProducto)

  const { nombre, empresa, image, url, descripcion } = valores;

  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext)

  // States para la subida de la imagen
  const [uploading, setUploading] = useState(false);
  const [URLImage, setURLImage] = useState('');

  const handleImageUpload = e => {
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const file = e.target.files[0];
    const imageRef = ref(firebase.storage, 'productos/' + file.name);

    // Se inicia la subida
    setUploading(true);
    const uploadTask = uploadBytesResumable(imageRef, file);

    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on('state_changed', 
        // Muestra progreso de la subida
        snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Subiendo imagen: ${progress}% terminado`);
        },
        // En caso de error
        error => {
            setUploading(false);
            console.error(error);
        },
        // Subida finalizada correctamente
        () => {
            setUploading(false);
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                console.log('Imagen disponible en:', url);
                setURLImage(url);
            });
        }
    );
};

  async function crearProducto() {
    if (!usuario) {
        return Router.push('/');
    }
 
    const producto = {
        nombre,
        empresa,
        url,
        URLImage,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(),
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName
        },
        haVotado: []
    }
 
    try {
        await addDoc(collection(firebase.db,"productos"), producto);
        return Router.push('/')
    } catch (error) {
        console.error(error)
    }
}

  return ( 
    <div>
      <Layout>
        {!usuario ? <Error404/> : 
          <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Nuevo Producto</h1>
          <Formulario
            onSubmit={handleSubmit}
          >
            <fieldset>
              <legend>Información General</legend>
            
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type='text'
                  id='nombre'
                  placeholder="Nombre del Producto"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>

              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type='text'
                  id='empresa'
                  placeholder="Nombre Empresa o Compañia"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>

              {errores.empresa && <Error>{errores.empresa}</Error>}

            <Campo>
                <label htmlFor="image">Imagen</label>
                <input
                  accept="image/*"
                  type="file"
                  id="image"
                  name="image"
                  value={image}
                  onChange={handleImageUpload}
                />
              </Campo>

              <Campo>
                <label htmlFor="url">URL</label>
                <input
                  type='url'
                  id='url'
                  name="url"
                  placeholder="URL de tu producto"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>

              {errores.url && <Error>{errores.url}</Error>}

            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>

              <Campo>
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id='descripcion'
                name="descripcion"
                value={descripcion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>

            {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>

            {error && <Error>{error}</Error>}

            <InputSubmit 
              type='submit' 
              value='Crear Producto'
            />

          </Formulario>
        </>
        }

      </Layout>
    </div>
  )
}

export default NuevoProducto
import React, { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { es } from 'date-fns/locale'

import Layout from '../../components/layout/Layout'
import {FirebaseContext} from '../../firebase'
import Error404 from '../../components/layout/404'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Campo, InputSubmit } from '../../components/ui/Formulario'
import Boton from '../../components/ui/Boton'

const ContenedorProducto = styled.div`
    @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Producto = () => {

    // State del componente
    const [ producto, guardarProducto ] = useState({})
    const [ error, guardarError ] = useState(false);
    const [ comentario, guardarComentario ] = useState({})

    // Routing para obtener el id actual
    const router = useRouter();
    const { query: { id }} = router;

    // Context de firebase
    const { firebase, usuario } = useContext(FirebaseContext)

    useEffect(() => {
        if(id) {
            const obtenerProducto = async () => {
                const productoQuery = doc(firebase.db, 'productos', id)
                const producto = await getDoc(productoQuery);
                if(producto.exists()) {
                    guardarProducto(producto.data() );
                } else {
                    guardarError(true)
                }
            }
            obtenerProducto()
        }
    }, [id, firebase.db, producto])

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...'

    const {comentarios, creado, descripcion, empresa, nombre, url, URLImage, votos, creador, haVotado} = producto;

    // Administrar y validar producto
    const votarProducto = () => {
        if(!usuario) {
            return router.push('/login')
        }

        // Verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return;

        // Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // guardar el ID del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid]
        
        // Actualizar en la BD
        const hola = doc(firebase.db, 'productos', id)
        updateDoc(hola, {votos: nuevoTotal, haVotado: nuevoHaVotado})

        // Actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })
    }

    // Funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    // Identifica si el comentario es del creador del producto
    const esCreador = id => {
        if(creador.id == id) {
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault()

        if(!usuario) {
            return router.push('/login')
        }

        // Informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        // Actualizar la BD
        const hola = doc(firebase.db, 'productos', id)
        updateDoc(hola, {comentarios: nuevosComentarios})

        // Actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

    }

    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true
        }
    }

    // elimina un producto de la bd
    const eliminarProducto = async () => {
        if(!usuario) {
            return router.push('/login')
        }

        if(creador.id !== usuario.uid) {
            return router.push('/login')
        }

        try {
            const hola = doc(firebase.db, 'productos', id)
            await deleteDoc(hola)
            router.push('/')
        
        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <Layout>
            <>
                {error ? <Error404/> : (
                    <div className='contenedor'>
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                    >{nombre}</h1>

                    <ContenedorProducto>
                        <div css={css`
                            margin-left: 15%;
                        `}                            
                        >
                            <p css={css`font-weight: bold;`}>Publicado hace: {formatDistanceToNow(new Date(creado), {locale:es} )}</p>

                            <p>Por: {creador.nombre} de {empresa} </p>

                            <img width='80%' height='400' src={URLImage} />
                            <p>{descripcion}</p>

                            { usuario && (
                                <>
                                    <h2>Agrega tu comentario</h2>
                                    <form 
                                        onSubmit={agregarComentario}
                                        css={css`width: 80%;`}
                                    >
                                        <Campo>
                                            <input
                                                type='text'
                                                name='mensaje'
                                                onChange={comentarioChange}
                                            />
                                        </Campo>
                                        <InputSubmit
                                            type='submit'
                                            value='Agregar Comentario'
                                        />
                                    </form>
                                </>                             
                            )}

                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comentarios</h2>

                            {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                <ul>    
                                {comentarios.map((comentario, i) => (
                                    <li
                                        key={`${comentario.usuarioId}-${i}`}
                                        css={css`
                                            border: 1px solid #e1e1e1;
                                            padding: 2rem;
                                            width: 80%;
                                        `}
                                    >
                                        <p>{comentario.mensaje}</p>
                                        <p>Escrito por: 
                                             <span
                                                css={css`font-weight: bold;`}
                                            >  {comentario.usuarioNombre}</span>
                                        </p>
                                        { esCreador( comentario.usuarioId ) && 
                                        <CreadorProducto>Es Creador</CreadorProducto>}
                                    </li>
                                ))}
                                </ul>
                            )}

                        </div>
                        <aside 
                        css={css`width: 70%;`}>
                            <Boton
                                target='_blank'
                                bgColor='true'
                                href={url}
                            >Visitar URL</Boton>

                            <div
                                css={css`margin-top: 5rem;`}
                            >
                                <p
                                    css={css`text-align: center;`}
                                >{votos} Votos</p>

                                { usuario && (<Boton onClick={votarProducto}>Votar</Boton>)}
                            </div>

                        </aside>
                    </ContenedorProducto>

                    { puedeBorrar() && 
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar Producto</Boton>
                    }
                </div>

                )}

                
            </>
        </Layout> 
    )
}

export default Producto;


import React, { useEffect, useState, useContext } from "react"
import Layout from "../components/layout/Layout"
import DetallesProducto from "../components/layout/DetallesProducto"

import { FirebaseContext } from "../firebase"
import {collection, getDocs, orderBy} from 'firebase/firestore'


const Populares = () => {

  const [ productos, guardarProductos ] = useState([])

  const { firebase } = useContext(FirebaseContext)

  useEffect( () => {
    const obtenerProductos = async () => {
      const querySnapshot = await getDocs(collection(firebase.db, "productos"));
      const productos = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
        ...doc.data()
      }
      });
      guardarProductos(productos)
       
    }
    obtenerProductos()
  }, [])

  

  return (
    <div>
      <Layout>
          <div className="listado-productos">
            <div className="contenedor">
              <ul className="bg-white">
                {productos.map(producto => (
                  <DetallesProducto
                    key={producto.id}
                    producto={producto}
                  />
                ))}
              </ul>
            </div>
          </div>
      </Layout>
    </div>
  )
}

export default Populares
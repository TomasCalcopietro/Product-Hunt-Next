import App from 'next/app';
import firebase, {FirebaseContext} from '../firebase';
import useAutenticacion from '../hooks/useAutenticacion';
import { useState } from 'react';
 
const MyApp = props => {

    // Component es el componente actual y los props son los props de la pagina.
    const { Component, pageProps } = props;

    const usuario = useAutenticacion();
    
    return (
        // hacemos disponible en el value firebase, por que va a contener todos los metodos
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    )
}
 
export default MyApp;



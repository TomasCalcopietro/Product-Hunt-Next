import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth'
import firebase from "../firebase";


function useAutenticacion() {
    const [ usuarioAutenticado, guardarUsuarioAutenticado ] = useState(null);

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(firebase.auth, (user) => {
            if (user) {
                guardarUsuarioAutenticado(user)
            } else {
                guardarUsuarioAutenticado(null)
            }
        })
        return () => unsuscribe()
    }, [])

    return usuarioAutenticado;    
}
export default useAutenticacion;
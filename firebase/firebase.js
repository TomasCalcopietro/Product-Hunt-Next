import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, updateProfile, signOut} from 'firebase/auth'
import firebaseConfig from "./config";
import 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from '@firebase/storage';

class Firebase {
    constructor() {
        const app = initializeApp( firebaseConfig );
        this.auth = getAuth();
        this.db = getFirestore(app);
        this.storage = getStorage(this.app);
    }

    // Registrar un usuario
    async registrar(nombre, email, password) {
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password);

        // Actualiza el usuario creado, añadiendo el nombre del usuario
        return await updateProfile( nuevoUsuario.user, {
            displayName: nombre
        }); 
    }

    // Inicia  sesión del usuario
    async login(email, password) {
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    // Cierra la sesión del usuario
    async cerrarSesion() {
        await signOut(this.auth)
    }
}


const firebase = new Firebase();

export default firebase;
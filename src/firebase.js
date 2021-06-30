import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDG_V-lTbZYCbXiUhKk-oiQEal8fqBLuPY",
    authDomain: "hikari-sushi-se-project.firebaseapp.com",
    projectId: "hikari-sushi-se-project",
    storageBucket: "hikari-sushi-se-project.appspot.com",
    messagingSenderId: "958010210444",
    appId: "1:958010210444:web:73d9a7dcd15126a80323a9"
  };

  firebase.initializeApp(firebaseConfig);
  
  export default firebase;
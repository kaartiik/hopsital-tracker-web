import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import ReduxSagaFirebase from 'redux-saga-firebase';

const config = {
  apiKey: 'AIzaSyCGNRea1QehdTlOuog1xXbsBUFdlouMvh8',
  authDomain: 'hospitaltracker-72ee8.firebaseapp.com',
  databaseURL: 'https://hospitaltracker-72ee8-default-rtdb.firebaseio.com',
  projectId: 'hospitaltracker-72ee8',
  storageBucket: 'hospitaltracker-72ee8.appspot.com',
  messagingSenderId: '447683948445',
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const f = firebase;
export const f2 = firebase.initializeApp(config, 'other2');
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

const rsf = new ReduxSagaFirebase(firebase);
export const rsf2 = new ReduxSagaFirebase(f2);
export default rsf;

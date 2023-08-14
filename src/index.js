import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';
import { BrowserRouter } from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyAFI5nC1yCwsVZEQcGEBKw0FOPMscFxawU",
  authDomain: "smoll-url.firebaseapp.com",
  projectId: "smoll-url",
  storageBucket: "smoll-url.appspot.com",
  messagingSenderId: "351740343951",
  appId: "1:351740343951:web:2fee270de3a8a856cae2fa",
  measurementId: "G-B3Z56XYWH1"
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


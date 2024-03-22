

<template>
    <div class="login">
      <div class="login-container">
        <h1>Login/Register</h1>
        <p>Please log in or register an account.</p>
        <div id="firebaseui-auth-container"></div>
      </div>
    </div>
  </template>
  
  <script>
import firebase from '@/uifire.js';
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

  export default {
    name: 'Login',

    mounted() {
        var ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        var uiConfig = {
            signInSuccessURL: '/',
            signInOptions : [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ]
        }
        ui.start("#firebaseui-auth-container", uiConfig)
    }
  };
  </script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white; 
  font-family: 'Oswakd', sans-serif; 
  width: 100%;
}

.login-container {
  padding: 2em;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  width: 100%; 
  max-width: 400px; 
}

h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 0.5em;
  font-family: 'Oswald', sans-serif;
}

p {
  font-size: 1em;
  color: #666;
  margin-bottom: 2em;
  font-family: 'Oswald', sans-serif;
}


#firebaseui-auth-container {
  margin-top: 50px;
  width: 100%;
}


.firebaseui-idp-button,
.firebaseui-id-submit,
.firebaseui-idp-google,
.firebaseui-id-idp-button {
  width: 100% !important; 
  margin: 10px 0 !important; 
}


.firebaseui-textfield.mdl-textfield .firebaseui-input {
  border: 1px solid #ddd !important; 
  border-radius: 4px !important; 
  padding: 10px !important; 
  height: auto !important; 
}
</style>
  
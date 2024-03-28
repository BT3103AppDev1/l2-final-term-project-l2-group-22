<template>
    <div class="register">
      <h1>Complete Your Registration</h1>
      <form @submit.prevent="registerUser">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="text" v-model="firstName" placeholder="First Name" required />
        <input type="text" v-model="lastName" placeholder="Last Name" required />
        <input type="tel" v-model="phoneNumber" placeholder="Phone Number" required />
        <input type="text" v-model="telegramHandle" placeholder="Telegram Handle" required />
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import firebase from '@/uifire.js';
  import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
  
  export default {
    name: 'Register',
    data() {
      return {
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        telegramHandle: '',
        user: null,
      };
    },
    created() {
      this.user = firebase.auth().currentUser;
    },
    methods: {
      async registerUser() {
        const db = getFirestore();
        const usernameRef = doc(db, 'usernames', this.username);
        const usernameSnapshot = await getDoc(usernameRef);
        if (usernameSnapshot.exists()) {
          alert('Username already taken. Please choose another one.');
          return;
        }
  
        await setDoc(doc(db, 'users', this.user.uid), {
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          telegramHandle: this.telegramHandle,
        });
  
        await setDoc(usernameRef, {
          uid: this.user.uid,
        });
  
        this.$router.push('/profile');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Your styles here */
  </style>
  
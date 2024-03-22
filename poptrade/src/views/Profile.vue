<template>
    <div>
      <h1>Profile</h1>
      <p>Welcome, {{ user.email }}</p>
      <button @click="signOut">Sign Out</button>
    </div>
  </template>
  
  <script>
  import firebase from '@/uifire.js';
  
  export default {
    data() {
      return {
        user: {},
      };
    },
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
        }
      });
    },
    methods: {
      signOut() {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.$router.push('/');
          });
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
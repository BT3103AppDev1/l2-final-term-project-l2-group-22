<template>
    <div>
      <h1>Profile</h1>
      <p>Welcome, {{ user.email }}</p>
      <button @click="emitSignOut">Sign Out</button>
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
      emitSignOut() {
        this.$emit('sign-out');
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  
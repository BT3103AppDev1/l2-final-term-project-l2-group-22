<template>
    <div>
      <h1>Profile</h1>
      <p>Welcome, {{ user.email }}</p>
      <!-- Emit an event to the parent component when clicked -->
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
        // Emit the signOut event instead of directly calling the sign out method
        this.$emit('sign-out');
      },
    },
  };
  </script>
  
  <style scoped>
    /* Your styles here */
  </style>
  
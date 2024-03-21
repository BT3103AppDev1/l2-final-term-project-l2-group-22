<template>
    <div class="home">
      <h1>Welcome to POPTRADE</h1>
      <p>Your one-stop marketplace for trading POPMARTS.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView',
  };
  </script>
  
  <style scoped>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
  }
  
  .home h1 {
    color: red;
    margin-bottom: 0.5em;
  }
  
  .home p {
    color: #000;
  }
  </style>
  
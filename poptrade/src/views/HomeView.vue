<template>
    <div class="home">
      <div class = "text">
        <h1>Welcome to POPTRADE</h1>
        <p>Your one-stop marketplace for trading POPMARTS</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView',
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');

  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    background-image: url('https://daoinsights.com/wp-content/uploads/2023/05/PopMart-Dream-Home.jpg');
    background-size: cover; /* Ensures the image covers the entire background */
    background-position: center; /* Centers the background image */
    background-repeat: no-repeat; /* Prevents the background image from repeating */
    width: 100vw; /* 100% of viewport width */
    height: 100vh; /* 100% of viewport height */
  }

  .text {
    background-color: rgba(255, 255, 255, 0.6);
    background-clip: border-box;
    padding: 10px;
    padding-top: 0;
    margin: 10px;
    border-radius: 10px;
  }
  
  .home h1 {
    color: red;
    font-size: 5em;
    font-family: "Oswald";
    margin: 0;
  }
  
  .home p {
    color: #000;
    font-family: "Oswald";
    font-size: 1.7em;
    margin: 0;
  }

  main {
    padding: 0px;
  }

  body {
    margin: 0px;
    padding: 0px;
  }
  
  </style>
  
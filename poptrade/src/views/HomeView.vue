<template>
    <div class="home">
      <div class = "text">
        <h1>Welcome to POPTRADE</h1>
        <button @click="showPopup = true">About us</button>
      </div>
      <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <p>
          At POPTRADE, our mission is to cultivate a thriving digital hub for Popmart collectors like you. 
            By revolutionizing the collectibles trading landscape, 
            we provide a seamless and intuitive environment where users can engage in trading activities with like-minded individuals. 
            Join us to be part of a vibrant community, where your passion for Popmart is celebrated and shared.
        </p>
        <button @click="closePopup">Close</button>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView',
    data() {
      return {
        showPopup: false
      };
    },
    methods: {
      closePopup() {
        this.showPopup = false;
      }
    }
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
    background-image: url('https://firebasestorage.googleapis.com/v0/b/poptrade-c2650.appspot.com/o/Images%2FPopMart-Dream-Home.jpg?alt=media&token=3164c2e3-f09e-4de6-845d-e4bd410e96cf');
    background-size: cover; /* Ensures the image covers the entire background */
    background-position: center; /* Centers the background image */
    background-repeat: no-repeat; /* Prevents the background image from repeating */
    width: 100vw;
    height: 100vh;
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
    font-size: 1em;
    margin: 0;
    padding-bottom: 10px;
  }

  main {
    padding: 0px;
  }

  body {
    margin: 0px;
    padding: 0px;
  }

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 70%; 
    max-height: 70%; 
    overflow: auto; 
  }

  button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 20px;
    font-family: "Oswald"
  }

  button:hover {
    background-color: #d32f2f;
  }
  
  </style>
  

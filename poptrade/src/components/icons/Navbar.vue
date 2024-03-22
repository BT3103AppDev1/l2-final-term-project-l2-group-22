<template>
    <nav class="navbar">
      <div class="logo">POPTRADE</div>
      <div class="menu">
        <a href="#marketplace">Marketplace</a>
        <a href="#offers">Offers</a>
        <a href="#login">Register/Login</a>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  
  .logo {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    color: red;
  }
  
  .menu {
    display: flex;
  }
  
  .menu a {
    font-family: 'Arial', sans-serif;
    margin: 0 15px;
    text-decoration: none;
    color: black;
    padding: 5px 10px;
  }
  
  .menu a:hover, .menu a.active {
    border-bottom: 2px solid red;
  }
  </style>
  
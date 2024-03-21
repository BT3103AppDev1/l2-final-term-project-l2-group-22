<template>
  <div id="app">
    <header class="navbar">
      <!-- Use 'router-link' for navigation -->
      <router-link to="/">POPTRADE</router-link>
      <router-link to="/marketplace">Marketplace</router-link>
      <router-link to="/offers">Offers</router-link>
      <router-link to="/login">Register/Login</router-link>
    </header>

    <!-- Content rendered by Vue Router -->
    <main>
      <router-view />
    </main>

    <footer class="footer">
      <p>Contact our support team anytime, anywhere</p>
      <p>(+65) 60000000</p>
      <p>support@poptrade.com</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  // Your component's logic here
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* This makes the navbar take up the full width */
  padding: 10px 20px; /* Adjust padding as needed */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Other styling as needed */
}

.navbar a {
  margin: 0 10px; /* Adjust spacing between links as needed */
  text-decoration: none;
  /* Other styling as needed */
}

main {
  flex: 1;
  width: 100%; /* This ensures that the content takes up the full width */
  /* Additional styling as needed */
}

.footer {
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #ccc; /* Style as per your screenshot */
}
</style>

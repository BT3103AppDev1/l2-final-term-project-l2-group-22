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
  justify-content: space-between; /* Add this to push the footer to the bottom */
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5%; /* Adjust padding as needed, use percentage for responsiveness */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar a {
  margin: 0 20px; /* Increase the spacing between the links */
  text-decoration: none;
  color: black; /* Set the color to black or as needed */
  font-weight: 500; /* Adjust the font weight as needed */
}

main {
  flex-grow: 1; /* Ensures that the content section grows to fill space */
  display: flex; /* Use flexbox to center and contain router-view content */
  justify-content: center; /* Centers content horizontally */
  align-items: center; /* Centers content vertically */
  padding: 2rem; /* Add padding around the content for spacing */
  text-align: center; /* Center-align the text for the router-view content */
}

.footer {
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #ccc;
  background-color: #f8f8f8; /* Match the footer background color to the image */
}

/* Add styles for the router-links to look more like buttons (if needed) */
.navbar a.router-link-exact-active, .navbar a:hover {
  text-decoration: underline; /* Add an underline on hover or when active */
}

/* Style adjustments for your router-view content */
.router-view {
  width: 100%; /* Full width */
  max-width: 600px; /* Set a max-width for larger screens */
  margin: auto; /* This will help center the content if it's smaller than max-width */
}

/* You might need additional styling specific to your content components */
</style>


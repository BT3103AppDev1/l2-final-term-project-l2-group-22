<template>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  <div id="app">
    <header class="navbar">
      <router-link to="/" class="poptrade-link">POPTRADE</router-link>
      <router-link to="/marketplace">Marketplace</router-link>
      <router-link to="/offers">Offers</router-link>
      <router-link to="/login">Register/Login</router-link>
      
    </header>

    <main>
      <router-view />
    </main>
=======
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
>>>>>>> Stashed changes

=======
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

>>>>>>> Stashed changes
		<footer class="footer">
			<p>Contact our support team anytime, anywhere</p>
			<p>(+65) 60000000</p>
			<p>support@poptrade.com</p>
		</footer>
	</div>
</template>

<script>
export default {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  name: 'App',
=======
	name: "App",
	// Your component's logic here
>>>>>>> Stashed changes
=======
	name: "App",
	// Your component's logic here
>>>>>>> Stashed changes
};
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

#app {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  height: 50px; /* Added height */
}

.navbar a {
  margin: 0 20px;
  text-decoration: none;
  color: black;
  font-weight: 500;
  font-size: 1.3em;
}

.poptrade-link { /* Added class for Poptrade */
  font-family: 'Oswald', sans-serif;
  color: red !important;
  font-size: 1.75em !important;
  font-weight: 900 !important;
}

.navbar a.router-link-exact-active, .navbar a:hover {
  text-decoration: underline;
}

main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items:center;
  padding: 2rem;
  text-align: center;
}

.router-view {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.footer {
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #ccc;
  background-color: #f8f8f8;
}

/* Responsive styles for smaller screens */
@media (max-width: 768px) {
  .navbar {
    padding: 10px 2%;
  }

  .navbar a {
    margin: 0 10px;
  }

  main {
    padding: 1rem;
  }
}
</style>
=======
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
>>>>>>> Stashed changes
=======
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
>>>>>>> Stashed changes

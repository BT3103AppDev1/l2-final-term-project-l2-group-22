<template>
	<div class="marketplace">
		<h1>Marketplace</h1>

		<!-- Placeholder content for Marketplace -->
		<h3>Newest Listings</h3>
		
		<!-- <div class="categories">
			<div v-for="(category, index) in categories" :key="index" class="category">
			<h2>{{ category.name }}</h2>
			<div class="listings-row">
				<div
					class="listing"
					v-for="(listing, index) in category.listings.slice(0, 5)"
					:key="listing.id"
					@click="goToViewListing(listing.id)"
				>
				<img :src="listing.imageSrc" :alt="listing.name" class="listing-image"/>
				</div>
			</div>
			</div>
		</div> -->

		<div class="newestListings">
			<button id="b1" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b2" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b3" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b4" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b5" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>
		</div>

		<h3>Listings by Collections</h3>

		<div class="collectionListings">
			<button id="b6" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b7" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b8" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b9" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b10" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>
		</div>

		<h3>Listings from Top Traders</h3>

		<div class="topTradersListings">
			<button id="b11" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b12" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b13" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b14" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>

			<button id="b15" @click="goToViewListing">
				<img src="https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755" alt="Button Image" />
			</button>
		</div>
		<!-- just to check what ViewListing -->
		<!-- <ViewListing /> -->
	</div>
</template>

<script>
import ViewListing from "../components/ViewListing.vue";
import OfferTrade from "../components/OfferTrade.vue";
export default {
	name: "Marketplace",
	components: {
		ViewListing,
	},
	// You might include component logic here later
	methods: {
		goToViewListing() {
			// Programmatic navigation to ViewListing.vue
			this.$router.push({ name: "ViewListing" }); // Assuming 'ViewListing' is the name of the route for ViewListing.vue
		},
	},
};
</script>

<style scoped>
/* Header styles */
.marketplace h1 {
  color: red; /* Color of the Marketplace header, change as needed */
  text-align: center;
  font-size: 2em; /* Size of the Marketplace header */
  margin: 0.5em 0;
}

/* Button styles */
button {
  display: block;
  margin: 10px 30px 30px 30px; /* Centers the button */
  padding: 5px; /* Padding inside the button */
  background-color: #000; /* Button background color */
  color: #fff; /* Button text color */
  border: none;
  border-radius: 5px; /* Rounded corners of the button */
  cursor: pointer;
  font-size: 1em;
}

button img {
	width: 180px;
	height: 225px;
}

button:hover {
  background-color: #555; /* Button hover state color */
}

/* Layout styles */
.marketplace {
	display: flex;
	flex-direction: column; /* Stacks items vertically */
	align-items: center; /* Centers items horizontally */
	align-self: flex-start;
	justify-content: center; /* Centers items vertically if there's extra space */
	padding: 20px;
}

.newestListings, .collectionListings, .topTradersListings {
	display: flex;
	flex-direction: row;
	align-items: center; /* Centers items horizontally */
	align-self: flex-start;
	justify-content: center; /* Centers items vertically if there's extra space */
}

</style>

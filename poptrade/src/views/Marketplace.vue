<template>
	<div class="marketplace">
		<h1>Marketplace</h1>
		<!-- Placeholder content for Marketplace -->
		<p>This is the marketplace page.</p>
		<!-- just to check what ViewListing -->
		<button @click="goToViewListing">Go to View Listing</button>
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
/* Marketplace specific styles */
.marketplace {
	align-items: start;
	justify-content: start;
}
</style>

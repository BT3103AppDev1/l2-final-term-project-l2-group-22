<template>

	<div class="marketplace">
		<h1>Marketplace</h1>
		<!-- Placeholder content for Marketplace -->
		<p>This is the marketplace page.</p>
		<!-- just to check what ViewListing -->
		<ViewListing />
	</div>
</template>

<script>
import ViewListing from "../components/ViewListing.vue";
export default {
	name: "Marketplace",
	components: {
		ViewListing,
	},
	// You might include component logic here later
};
</script>

<style scoped>
/* Marketplace specific styles */
</style>


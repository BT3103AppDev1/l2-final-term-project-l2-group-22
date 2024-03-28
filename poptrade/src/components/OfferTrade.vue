<script>
export default {
	name: "OfferTrade",
	data() {
		return {
			inventory: [
				{ id: 1, name: "Item 1" },
				{ id: 2, name: "Item 2" },
				{ id: 3, name: "Item 3" },
				// Add more items as needed
			],
			selectedItem: null,
		};
	},
	methods: {
		handleSubmit() {
			if (!this.confirmSelection) {
				alert("Please confirm selection");
			} else if (this.selectedItem == null) {
				alert("Please select an item to offer");
			} else {
			}
		},
	},
};
</script>

<template>
	<div class="trading-container">
		<h2>You are trading for:</h2>
		<div class="trading-for">
			<p>Batman</p>
			<p>DC Gotham City Series</p>
		</div>
		<h2>Their wishlist:</h2>
		<ul class="wishlist">
			<li>Dimoo Retro Series</li>
			<li>Pucky Flying Babies</li>
		</ul>
		<h2>Your Inventory:</h2>
		<ul>
			<li v-for="item in inventory" :key="item.id">
				<label>
					<input type="radio" v-model="selectedItem" :value="item.id" />
					{{ item.name }}
				</label>
			</li>
		</ul>
		<input
			type="checkbox"
			id="confirm-checkbox"
			name="confirm-checkbox"
			v-model="confirmSelection"
		/>
		<label for="confirm-checkbox">Confirm selection</label>
		<button class="make-offer-button" @click="handleSubmit">Make Offer</button>
	</div>
</template>

<style scoped>
.trading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.trading-for,
.wishlist,
.inventory {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

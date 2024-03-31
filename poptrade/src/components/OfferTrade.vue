<script>
export default {
	name: "OfferTrade",
	data() {
		return {
			imageSrc:
				"https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755",
			character: "Dimoo",
			series: "Dimoo Letters from Snowman Series",
			condition: "Mint",
			listerID: "abcdefg",
			location: "Singapore, Singapore",
			numberOfReviews: "22",
			numberOfTrade: "32",
			wishlistItems: [
				"https://popmart.sg/cdn/shop/files/1_20_45f620a8-a1d5-43df-aeff-84afdecad54b_1800x1800.jpg?v=1703232251",
				"https://popmart.sg/cdn/shop/files/TheMonsters-NaughtyPlantsVinylFaceBlindBox_1_1800x1800.jpg?v=1685354421",
				"https://popmart.sg/cdn/shop/files/PuckyForestPartySeries-VinylPlushPendantBlindBox_5_1800x1800.png.jpg?v=1696562315",
			],
			confirmSelection: false,
			selectedItems: null,
			inventory: [
				"https://popmart.sg/cdn/shop/files/DIMOOHolidayRabbitActionFigureDIMOO__Feed1_750x.jpg?v=1711092788",
				"https://popmart.sg/cdn/shop/files/DIMOOAnimalKingdomSeriesFiguresDIMOO__Feed2_750x.jpg?v=1711085552",
				"https://popmart.sg/cdn/shop/files/1_17_66802510-4a3c-47ae-8b75-ba14485416fb_750x.png.jpg?v=1685331433",
				"https://popmart.sg/cdn/shop/products/HironoLittleMischiefSeries_11_750x.jpg?v=1661411803",
				"https://popmart.sg/cdn/shop/products/1_2_377b6fcf-77de-4a61-afb0-49dd84f4229f_750x.jpg?v=1647526756",
				"https://popmart.sg/cdn/shop/products/MEGAReserveSeries1000SPACEMOLLYLittlePainter_5_750x.jpg?v=1669008093",
			],
		};
	},

	methods: {
		handleSubmit() {
			if (!this.confirmSelection) {
				alert("Please confirm selection");
			} else if (this.selectedItems == null) {
				alert("Please select an item to offer");
			} else {
			}
		},
	},
};
</script>

<template>
	<div class="trading-container">
		<div class="trading-section">
			<h2>You are trading for:</h2>
			<div class="item-card">
				<div class="item-image">
					<img :src="imageSrc" alt="Item Image" />
				</div>
				<div class="item-details">
					<h1 class="item-title">{{ character }}</h1>
					<h1 class="item-brand">{{ series }}</h1>
					<p class="item-condition">Condition: {{ condition }}</p>
					<div class="item-seller-box">
						<div class="seller-details"></div>
					</div>
					<p class="item-wishlist">{{ listerID }}'s wishlist:</p>
					<div class="wishlist-images">
						<img
							v-for="(item, index) in wishlistItems"
							:key="index"
							:src="item"
							alt="Wishlist Item"
						/>
					</div>

					<br />
				</div>
			</div>
		</div>
		<div class="inventory-section">
			<h2>Your Inventory:</h2>
			<ul class="inventory">
				<li v-for="(item, index) in inventory" :key="item">
					<label>
						<input
							type="checkbox"
							:value="index"
							v-model="selectedItems"
							@change="
								$event.target.checked
									? (selectedItems = [$event.target.value])
									: (selectedItems = null)
							"
						/>
						<img :src="item" alt="Inventory Item" />
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
			<br />
			<br />
			<button class="make-offer-button" @click="handleSubmit">
				Make Offer
			</button>
		</div>
	</div>
</template>

<style scoped>
.trading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.trading-for,
.wishlist {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.inventory {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	list-style: none;
	padding: 0;
}

.inventory ul {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
	margin: 0;
}

.inventory li {
	margin: 5px;
	width: calc(
		20% - 10px
	); /* Adjust the width dynamically for 5 items per row */
}

.inventory img {
	max-width: 85%;
	max-height: 85%;
	border-radius: 10px;
	object-fit: contain; /* Ensure images maintain aspect ratio */
}

.item-card {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	border-radius: 5px;
	margin-bottom: 0.5rem;
	text-align: left;
}

.item-card h1 {
	margin: 0;
	font-size: 21px;
}

.item-card .item-image {
	width: 275px;
	height: 275px;
	border-radius: 10px;
	overflow: hidden;
	margin-right: 1rem;
}

.item-card .item-image img {
	width: 100%;
}

.wishlist-images img {
	width: 100px;
	height: 120px;
	margin-right: 10px;
	border-radius: 5px;
}

.make-offer-button {
	background-color: red;
	border: none;
	color: white;
	padding: 12px 35px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 20px;
	cursor: pointer;
	border-radius: 10px;
}

.inventory label {
	position: relative;
	display: inline-block;
	cursor: pointer;
}
</style>

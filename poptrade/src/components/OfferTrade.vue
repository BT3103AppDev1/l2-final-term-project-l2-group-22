<script>
import ViewListing from "../components/ViewListing.vue";

export default {
	name: "OfferTrade",
	components: {
		ViewListing,
	},
	data() {
		return {
			imageSrc:
				"https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755",
			character: "Dimoo",
			series: "Letters from Snowman Series",
			figurine: "Merry Christmas",
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
			// imageSrc: this.imageSrc,
			// character: this.character,
			// series: this.series,
			// figurine: this.figurine,
			// condition: this.condition,
			// listerID: this.listerID,
			// wishlistItems: this.wishlistItems,
			confirmSelection: false,
			selectedItems: null,
			confirmSelection: false,
			selectedItems: null,
			inventory: [
				[
					"https://popmart.sg/cdn/shop/files/DIMOOHolidayRabbitActionFigureDIMOO__Feed1_750x.jpg?v=1711092788",
					"Dimoo",
					"Animal Kingdom",
					"Monkey Catches the Moon",
				],
				[
					"https://popmart.sg/cdn/shop/files/DIMOOAnimalKingdomSeriesFiguresDIMOO__Feed2_750x.jpg?v=1711085552",
					"Dimoo",
					"Letters from Snowman",
					"Tears of Eos",
				],
				[
					"https://popmart.sg/cdn/shop/files/1_17_66802510-4a3c-47ae-8b75-ba14485416fb_750x.png.jpg?v=1685331433",
					"Skull Panda",
					"The Warmth",
					"Taste From the Memory",
				],
				[
					"https://popmart.sg/cdn/shop/products/HironoLittleMischiefSeries_11_750x.jpg?v=1661411803",
					"Hironi",
					"Reshape",
					"Paradise Lost",
				],
				[
					"https://popmart.sg/cdn/shop/products/1_2_377b6fcf-77de-4a61-afb0-49dd84f4229f_750x.jpg?v=1647526756",
					"Hironi",
					"Reshape",
					"Burst",
				],
				[
					"https://popmart.sg/cdn/shop/products/MEGAReserveSeries1000SPACEMOLLYLittlePainter_5_750x.jpg?v=1669008093",
					"Dimoo",
					"Letters from Snowman",
					"Winter Dream",
				],
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
				this.successfulOffer();
			}
		},
		successfulOffer() {
			alert(
				"Offer successfully made. You will be redirected to the Dashboard."
			);
			this.$router.push({ name: "Dashboard" });
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
					<h1 class="item-character">{{ character }}</h1>
					<h1 class="item-series">{{ series }}</h1>
					<p class="item-figurine">Figurine: {{ figurine }}</p>
					<p class="item-condition">Condition: {{ condition }}</p>
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
				<li
					v-for="(item, index) in inventory"
					:key="index"
					class="inventory-item"
				>
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
						<div class="inventory-item-details">
							<p class="inventory-character-series">
								{{ item[1] }} - {{ item[2] }}
							</p>
							<p class="inventory-figurine">{{ item[3] }}</p>
						</div>
						<img :src="item[0]" alt="Inventory Item" />
					</label>
				</li>
			</ul>
			<div class="confirm-selection">
				<label for="confirm-checkbox">
					<input
						type="checkbox"
						id="confirm-checkbox"
						name="confirm-checkbox"
						v-model="confirmSelection"
					/>
					<span class="confirm-checkbox"> Confirm Selection</span>
				</label>
			</div>
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

.trading-section h2 {
	margin-top: 2px;
}

.inventory-section h2 {
	margin-bottom: 0px;
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

.item-figurine {
	margin-top: 4px;
	font-weight: bold;
	font-size: 15px;
	margin-bottom: 5px;
}

.item-condition {
	margin-top: 5px;
	margin-bottom: 5px;
	font-size: 15px;
}

.item-wishlist {
	margin-top: 5px;
	margin-bottom: 5px;
	font-size: 15px;
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
	padding: 15px 60px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 15px;
	cursor: pointer;
	border-radius: 20px;
}

.inventory label {
	position: relative;
	display: inline-block;
	cursor: pointer;
}

.inventory-item {
	display: flex;
	align-items: center;
}

.inventory-character-series {
	margin: 2px;
	font-weight: bold;
}

.inventory-figurine {
	margin: 2px;
	font-weight: bold;
	font-size: 13px;
}

.confirm-checkbox {
	font-weight: bold;
}
</style>

<template>
	<div class="viewlisting-container">
		<router-link to="/marketplace" class="back-button"
			>Back to Marketplace</router-link
		>
		<div class="header-body">
			<div class="item-card">
				<div class="item-image">
					<img :src="imageSrc" alt="Item Image" />
				</div>
				<div class="item-details">
					<h1 class="item-title">{{ character }}</h1>
					<h1 class="item-brand">{{ series }}</h1>
					<p class="item-condition">Condition: {{ condition }}</p>
					<div class="item-seller-box">
						<!-- <div class="seller-profile-pic">
							<img
								:src="profilePicSrc"
								alt="Profile Picture"
								class="profile-pic-inner"
							/>
						</div> -->
						<div class="seller-details">
							<p class="item-seller">
								Listed by:
								<span class="verified-seller">{{ listerID }}</span>
								<br />
								Location: {{ location }}
								<br />
								<span class="reviews-text">
									{{ numberOfReviews }} reviews, {{ numberOfTrade }} sold items
								</span>
							</p>
						</div>
					</div>
					<p class="item-wishlist">Their wishlist:</p>
					<div class="wishlist-images">
						<img
							v-for="(item, index) in wishlistItems"
							:key="index"
							:src="item"
							alt="Wishlist Item"
						/>
					</div>

					<br />

					<button id="make-offer-button">Make Offer</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			imageSrc:
				"https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries-40cmCottonDoll_2_1800x1800.jpg?v=1701427755",
			character: "Dimoo",
			series: "Dimoo Letters from Snowman Series",
			condition: "Brand New",
			listerID: "abcdefg",
			location: "Singapore, Singapore",
			numberOfReviews: "22",
			numberOfTrade: "32",
			profilePicSrc:
				"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
			wishlistItems: [
				"https://popmart.sg/cdn/shop/files/1_20_45f620a8-a1d5-43df-aeff-84afdecad54b_1800x1800.jpg?v=1703232251",
				"https://popmart.sg/cdn/shop/files/TheMonsters-NaughtyPlantsVinylFaceBlindBox_1_1800x1800.jpg?v=1685354421",
				"https://popmart.sg/cdn/shop/files/PuckyForestPartySeries-VinylPlushPendantBlindBox_5_1800x1800.png.jpg?v=1696562315",
			],
		};
	},
	methods: {
		goToViewListing() {
			// Navigate to ViewListing.vue
			this.$router.push({ name: "ViewListing" }); // Assuming 'ViewListing' is the name of the route for ViewListing.vue
		},
	},
};
</script>

<style scoped>
.viewlisting-container {
	min-height: 0vh;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.header-body {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	text-align: left;
}

.back-button {
	margin-bottom: 3rem;
	margin-top: 0;
	padding-top: 0;
}

.item-card {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	padding-left: 200px;
	border-radius: 5px;
	margin-bottom: 1rem;
	text-align: left;
}

.item-card h1 {
	margin: 0; /* Reset margin */
}

.item-card .item-image {
	width: 550px;
	height: 550px;
	border-radius: 5px;
	overflow: hidden;
	margin-right: 1rem;
}

.item-card .item-image img {
	width: 100%;
}

.item-card .verified-seller {
	color: #55a630;
	font-weight: bold;
}

#make-offer-button {
	color: white;
	background-color: red;
	border-radius: 10px;
	width: 50%;
	border-color: red;
	height: 35px;
	font-size: medium;
}

.item-seller-box {
	display: flex;
	flex-direction: row;
	margin-top: 0.5rem;
}

.seller-details {
	flex: 6;
}

/* .seller-profile-pic img {
	width: 80%;
	height: 80%;
	object-fit: cover;
} */

/* .seller-profile-pic {
	flex: 1;
	margin-top: 0.3rem;
} */

.wishlist-images {
	display: flex;
	justify-content: flex-start;
}

.wishlist-images img {
	width: 100px; /* Adjust width of each wishlist image */
	height: 120px; /* Adjust height of each wishlist image */
	margin-right: 10px; /* Add some margin between wishlist images */
	border-radius: 5px; /* Add border radius to wishlist images */
}
</style>

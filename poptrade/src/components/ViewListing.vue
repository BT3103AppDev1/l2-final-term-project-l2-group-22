<template>
	<div class="item-card">
		<div class="item-image">
			<img :src="imageSrc" alt="Item Image" />
		</div>
		<div class="item-details">
			<h1 class="item-title">{{ character }}</h1>
			<h1 class="item-brand">{{ series }}</h1>
			<p class="item-condition">Condition: {{ condition }}</p>
			<div class="item-seller-box">
				<div class="seller-profile-pic">
					<img
						:src="profilePicSrc"
						alt="Profile Picture"
						class="profile-pic-inner"
					/>
				</div>
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

			<br />

			<button id="make-offer-button">Make Offer</button>
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
			wishlistItems: [],
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
.item-card {
	display: flex;
	align-items: center;
	/* justify-content: space-between; */
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
	width: 400px;
	height: 400px;
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
}

.item-seller-box {
	display: flex;
	flex-direction: row;
	margin-top: 0.5rem;
}

.seller-details {
	flex: 6;
}

.seller-profile-pic img {
	width: 80%;
	height: 80%;
	object-fit: cover;
}

.seller-profile-pic {
	flex: 1;
	margin-top: 0.3rem;
}
</style>

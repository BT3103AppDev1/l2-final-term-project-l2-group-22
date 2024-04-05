<!-- <template>
	<div class="offers-container">
		<h2>Offers from other users:</h2>
		<ul class="offers-list">
			<li v-for="offer in offers" :key="offer.time" class="offer-item">
				<div class="offer-details">
					<div class="your-offer">
						<img :src="offer.yourImage" alt="Your Offer" />
					</div>
					<div class="their-offer">
						<div v-for="(image, index) in offer.offerImage" :key="index">
							<img :src="image" alt="Their Offer" />
						</div>
					</div>
					<div class="offer-meta">
						<p class="offer-time">{{ offer.time }}</p>
						<p class="offer-contact">{{ offer.contact }}</p>
					</div>
					<div class="offer-actions">
						<button class="accept-button" @click="acceptOffer(offer)">
							Accept Offer
						</button>
						<button class="reject-button" @click="rejectOffer(offer)">
							Reject Offer
						</button>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "Offers",
	props: {
		offers: {
			type: Array,
			required: true,
		},
		yourOfferImage: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			offers: [
				{
					yourImage:
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					offerImage: [
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					],
					time: "20 May 2022, 2pm",
					contact: "@abcdef",
				},
				{
					yourImage:
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					offerImage: [
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					],
					time: "20 May 2022, 2pm",
					contact: "@abcdef",
				},
			],
		};
	},
	methods: {
		acceptOffer(offer) {
			// Implement accept offer logic here
			console.log("Accept offer:", offer);
		},
		rejectOffer(offer) {
			// Implement reject offer logic here
			console.log("Reject offer:", offer);
		},
	},
};
</script>

<style scoped>
.offers-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	text-align: left;
	justify-content: flex-start;
}

.offer-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
	border-bottom: 1px solid #ccc;
	width: 100%;
}

.offer-details {
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;
}

.your-offer {
	width: 150px;
	height: 150px;
	border-radius: 5px;
	overflow: hidden;
	margin-right: 1rem;
}

.your-offer img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.their-offer {
	display: flex; /* Ensure images are in a row */
	flex-wrap: nowrap; /* Ensure they don't wrap to the next line */
}

.their-offer img {
	width: 150px; /* Match the size of your offer */
	height: 150px; /* Match the size of your offer */
	object-fit: cover;
	margin-right: 5px;
	border-radius: 5px;
}

.offer-meta {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 0;
	font-size: 14px;
	width: 20%;
}

.offer-time {
	margin-bottom: 5px;
}

.offer-contact {
	margin: 5px 0;
}

.offer-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 20%;
}

.accept-button,
.reject-button {
	background-color: red;
	border: none;
	color: white;
	padding: 5px 10px;
	text-align: center;
	border-radius: 5px;
	cursor: pointer;
	margin-left: 10px;
}
</style> -->

<template>
	<div class="offers-container">
		<h2>Offers from other users:</h2>
		<table class="offers-table">
			<thead>
				<tr>
					<th>Your Offer</th>
					<th>Their Offer</th>
					<th>Time of Offer</th>
					<th>Contact Information</th>
					<th>Accept/Reject</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="offer in offers" :key="offer.time">
					<td class="offer-image-cell">
						<img :src="offer.yourImage" alt="Your Offer" />
					</td>
					<td class="their-offer-images">
						<div v-for="(image, index) in offer.offerImage" :key="index">
							<img :src="image" alt="Their Offer" />
						</div>
					</td>
					<td>{{ offer.time }}</td>
					<td>{{ offer.contact }}</td>
					<td class="offer-actions-cell">
						<button class="accept-button" @click="acceptOffer(offer)">
							Accept Offer
						</button>
						<button class="reject-button" @click="rejectOffer(offer)">
							Reject Offer
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: "Offers",
	props: {
		offers: {
			type: Array,
			required: true,
		},
		yourOfferImage: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			offers: [
				{
					yourImage:
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					offerImage: [
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					],
					time: "20 May 2022, 2pm",
					contact: "@abcdef",
				},
				{
					yourImage:
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					offerImage: [
						"https://popmart.sg/cdn/shop/files/1_2_68f7e106-64f6-4915-9746-ff9fa58a9eb7_1800x1800.png.jpg?v=1695970262",
					],
					time: "20 May 2022, 2pm",
					contact: "@abcdef",
				},
			],
		};
	},
	methods: {
		acceptOffer(offer) {
			// Implement accept offer logic here
			console.log("Accept offer:", offer);
		},
		rejectOffer(offer) {
			// Implement reject offer logic here
			console.log("Reject offer:", offer);
		},
	},
};
</script>
<style scoped>
.offers-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	text-align: left;
	justify-content: flex-start;
}

.offers-table {
	width: 100%;
	border-collapse: collapse;
}

.offers-table th,
.offers-table td {
	padding: 8px;
	border-bottom: 1px solid #ccc;
	text-align: left;
	vertical-align: middle;
}

.offers-table th {
	background-color: #f2f2f2;
}

.offer-image-cell img,
.their-offer-images img {
	max-width: 150px;
	max-height: 150px;
	display: block;
	margin: auto;
}

.their-offer-images {
	display: flex;
}

.offer-actions-cell {
	text-align: center; /* Add margin to top and bottom */
}

.accept-button {
	margin: 2px;
	background-color: #45a049;
	color: white;
	padding: 10px 10px;
	border-radius: 15px;
	border-color: #45a049;
}
.reject-button {
	margin: 2px;
	background-color: red;
	color: white;
	padding: 10px 10px;
	border-radius: 15px;
	border-color: red;
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
</style>

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
	padding-left: 25px;
	padding-right: 25px;
	flex-direction: left;
	justify-content: flex-start;
}

.their-offer-images {
	display: flex;
}

.offer-actions-cell {
	text-align: center;
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
</style>

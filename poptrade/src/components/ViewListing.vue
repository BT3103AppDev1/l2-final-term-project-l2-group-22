<template>
	<div class="viewlisting-container">
		<button class="back-button" @click="goBack">Go Back</button>

		<div class="header-body">
			<div class="item-card">
				<div class="item-image">
					<img :src="imageSrc" alt="Item Image" />
				</div>
				<div class="item-details">
					<h1 class="item-title">{{ character }}</h1>
					<h1 class="item-brand">{{ series }}</h1>
					<p class="item-figurine">Figurine: {{ figurine }}</p>
					<p class="item-condition">Condition: {{ condition }}</p>
					<p class = "item-description">Description: {{ description }}</p>
					<div class="item-seller-box">
						<div class="seller-details">
							<p class="item-seller">
								Listed by:
								<span
									class="verified-seller"
									@click="goToDashboard(userId)"
									>{{ userName }}</span
								>
								<br />
								Location: {{ location }}
								<br />
								<span class="reviews-text">
									{{ averageRating.toFixed(1) }} / 5 stars,
									{{ reviews.length }} reviews
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
					<button
						id="make-offer-button"
						v-on:click="makeOffer"
						:disabled="disabled"
						:class="{
							'disabled-button': disabled,
							'enabled-button': !disabled,
						}"
					>
						{{ disabled ? "Unavailable" : "Make Offer" }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getFirestore,
	doc,
	getDoc,
	collection,
	getDocs,
} from "firebase/firestore";

export default {
	name: "ViewListing",
	props: {
		userId: String,
		listingId: String,
	},
	data() {
		return {
			character: "",
			series: "",
			imageSrc: "",
			figurine: "",
			condition: "",
			description: "",
			wishlistItems: [],
			disabled: false,
			location: "Loading...", // Default value indicating data is being fetched
			numberOfReviews: 0, // Default value, assuming it will be updated
			numberOfTrade: 0, // Default value, assuming it will be updated
			userName: "",
			reviews: [],
		};
	},
	created() {
		this.fetchListingDetails();
	},
	computed: {
		averageRating() {
			// Check if reviews array is not empty
			if (this.reviews.length > 0) {
				// Sum up all the ratings in the reviews array
				const sum = this.reviews.reduce((total, review) => total + review, 0);
				// Calculate the average rating
				return sum / this.reviews.length;
			} else {
				return 5; // Return 0 if there are no reviews
			}
		},
	},

	methods: {
		goToDashboard(userId) {
			this.$router.push({ name: "Dashboard", params: { userId } });
		},
		async fetchListingDetails() {
			const db = getFirestore();
			const listingRef = doc(
				db,
				"users",
				this.userId,
				"listings",
				this.listingId
			);

			try {
				const docSnap = await getDoc(listingRef);
				if (docSnap.exists()) {
					const listingData = docSnap.data();
					this.character = listingData.popmart;
					this.series = listingData.collection;
					this.imageSrc = listingData.imageURL;
					this.figurine = listingData.name;
					this.condition = listingData.condition;
					this.description = listingData.description;
					this.location = "Singapore";
					this.numberOfReviews = 10;
					this.numberOfTrade = 10;
					await this.fetchWishlistDetails(); // Fetch wishlist details after listing details
					await this.fetchUserDetails();
					await this.fetchReviews();
					await this.disableMakeOfferButton();
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.error("Error fetching listing details:", error);
			}
		},
		async disableMakeOfferButton() {
			const db = getFirestore();
			const listingRef = doc(
				db,
				"users",
				this.userId,
				"listings",
				this.listingId
			);
			try {
				const docSnap = await getDoc(listingRef);
				const listingData = docSnap.data();
				if (listingData.status === "Unavailable") {
					this.disabled = true;
				} else {
					this.disabled = false;
				}
			} catch (error) {
				console.error("Error fetching listing details:", error);
				this.disabled = false; // Default to disabled in case of error
			}
		},
		async fetchWishlistDetails() {
			const db = getFirestore();
			const wishlistRef = collection(db, "users", this.userId, "wishlist");

			try {
				const querySnapshot = await getDocs(wishlistRef);
				this.wishlistItems = querySnapshot.docs.map(
					(doc) => doc.data().imageURL
				);
			} catch (error) {
				console.error("Error fetching wishlist details:", error);
				this.wishlistItems = []; // Reset to empty array in case of error
			}
		},

		async fetchUserDetails() {
			const db = getFirestore();
			const userDocRef = doc(db, "users", this.userId);

			try {
				const docSnap = await getDoc(userDocRef);
				if (docSnap.exists()) {
					const { firstName, lastName } = docSnap.data();
					this.userName = `${firstName} ${lastName}`;
				} else {
					console.log("No such document!");
					this.userName = "";
				}
			} catch (error) {
				console.error("Error fetching user details:", error);
				this.userName = "";
			}
		},

		async fetchReviews() {
			const db = getFirestore();
			const userDocRef = doc(db, "users", this.userId);

			try {
				const docSnap = await getDoc(userDocRef);
				if (docSnap.exists()) {
					const { reviews } = docSnap.data();
					this.reviews = reviews;
				} else {
					console.log("No such document!");
					this.reviews = "";
				}
			} catch (error) {
				console.error("Error fetching user details:", error);
				this.reviews = "";
			}
		},

		makeOffer() {
			this.$router.push({
				name: "OfferTrade",
				params: { userId: this.userId, listingId: this.listingId },
			});
		},
		goBack() {
			this.$router.go(-1);
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
	margin-top: 20px;
	margin-left: 22px;
	padding: 10px 20px; /* Adjust padding to increase or decrease the button size */
	background-color: #f44336; /* Red background */
	color: white; /* White text */
	border: none; /* No border */
	border-radius: 5px; /* Rounded corners */
	cursor: pointer; /* Change mouse cursor to pointer when hovering over the button */
	transition: background-color 0.3s, transform 0.2s; /* Smooth background color change and transform effect */
	font-size: 16px; /* Text size */
	text-align: center; /* Center text */
	display: inline-block; /* Allows setting width and height */
	text-decoration: none; /* Remove underline from link */
}

.back-button:hover {
	background-color: #d32f2f; /* Darker shade of red on hover */
	transform: scale(1.05); /* Slightly increase the button size */
}

.back-button:focus {
	outline: none; /* Remove outline on focus for a cleaner look */
}

.item-card {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	border-radius: 5px;
	margin-bottom: 1rem;
	text-align: left;
}

.item-card h1 {
	margin: 0; /* Reset margin */
}

.item-card {
	display: flex;
	align-items: flex-start;
	justify-content: center; /* Changed to space-between */
	background-color: white;
	border-radius: 5px;
	padding: 20px; /* Adjust padding as needed */
	margin-bottom: 1rem;
	text-align: left;
}

.item-card .item-image {
	width: auto;
	max-width: 35%; /* Adjust the value to make the image smaller */
	height: auto;
	border-radius: 15px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-card .item-image img {
	width: 100%;
	height: auto;
	border-radius: 15px;
	object-fit: cover;
}


.verified-seller {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

#make-offer-button {
	width: 50%;
	height: 35px;
	font-size: medium;
}

.disabled-button {
	color: grey;
	background-color: lightgrey;
	border-radius: 10px;
	cursor: not-allowed;
}

.enabled-button {
	color: white;
	background-color: red;
	border-radius: 10px;
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

.wishlist-images {
	display: flex;
	justify-content: flex-start;
}

.wishlist-images img {
	width: 100px;
	height: 120px;
	margin-right: 10px;
	border-radius: 5px;
}

.item-figurine {
	margin-top: 2px;
	font-weight: bold;
}

.item-details {
	margin-left: 2rem;
}
/* .disabled-button {
	color: grey;
	background-color: lightgrey;
	cursor: not-allowed;
} */
</style>

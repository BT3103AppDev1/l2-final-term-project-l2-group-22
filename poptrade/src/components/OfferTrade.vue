<script>
import ViewListing from "../components/ViewListing.vue";
import {
	getFirestore,
	doc,
	getDoc,
	collection,
	getDocs,
	addDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
	name: "OfferTrade",
	props: {
		userId: String,
		listingId: String,
	},
	components: {
		ViewListing,
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
			location: "Loading...", // Default value indicating data is being fetched
			numberOfReviews: 0, // Default value, assuming it will be updated
			numberOfTrade: 0, // Default value, assuming it will be updated
			userName: "",
			inventory: [],
			confirmSelection: false,
			selectedItems: [],
		};
	},
	created() {
		this.fetchListingDetails();
	},

	methods: {
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
					await this.fetchInventory();
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.error("Error fetching listing details:", error);
			}
		},

		async fetchInventory() {
			const db = getFirestore();
			const auth = getAuth();
			const currentUserUid = auth.currentUser?.uid;
			console.log(currentUserUid);
			const inventoryRef = collection(db, "users", currentUserUid, "listings");
			try {
				const querySnapshot = await getDocs(inventoryRef);
				console.log("Trying to fetch inventory");
				this.inventory = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
			} catch (error) {
				console.error("Error fetching inventory details:", error);
				this.inventory = []; // Reset to empty array in case of error
			}
		},

		async fetchWishlistDetails() {
			const db = getFirestore();
			const wishlistRef = collection(db, "users", this.userId, "wishlist");
			// console.log(wishlistRef);
			try {
				const querySnapshot = await getDocs(wishlistRef);
				// console.log(querySnapshot);
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
				// console.log(docSnap);
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

		handleSubmit() {
			if (!this.confirmSelection) {
				alert("Please confirm selection");
			} else if (this.selectedItems == null) {
				alert("Please select an item to offer");
			} else if (this.selectedItems.length == 0) {
				alert("Please select an item to offer");
			} else {
				// this.successfulOffer();
				this.submitListing();
			}
		},

		async submitListing() {
			console.log(this.selectedItems);
			const firestore = getFirestore();
			const user = getAuth().currentUser;
			// add to user making offer - offer collection
			await addDoc(collection(firestore, "users", user.uid, "offer"), {
				type: "Make",
				yourListing: this.selectedItems[0],
				offeredBy: this.userId,
				offererListing: this.listingId,
			});
			// add to user with listing - offersReceived collection
			await addDoc(collection(firestore, "users", this.userId, "offers"), {
				type: "Receive",
				offeredBy: user.uid,
				offererListing: this.selectedItems[0],
				yourListing: this.listingId,
			});
			alert("Offer successfully made! You will be redirected to the Dashboard"); // User feedback
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
					<p class="item-wishlist">{{ userName }}'s wishlist:</p>
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
							:value="item.id"
							v-model="selectedItems"
							@change="
								$event.target.checked
									? (selectedItems = [$event.target.value])
									: (selectedItems = null)
							"
						/>

						<div class="inventory-item-details">
							<p class="inventory-character-series">
								{{ item.popmart }} - {{ item.collection }}
							</p>
							<p class="inventory-figurine">{{ item.name }}</p>
						</div>
						<img :src="item.imageURL" alt="Inventory Item" />
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

<template>
	<div class="review-form">
		<h2>Submit a Review for {{ this.userName }}</h2>
  </br></br>
		<form @submit.prevent="submitReview">
			<div class="star-rating">
				<label v-for="star in 5" :key="star" class="star">
					<input
						type="radio"
						:value="star"
						v-model="rating"
						style="display: none"
					/>
					<i
						class="fas fa-star"
						:class="{ filled: star <= rating }"
						@click="rating = star"
					></i>
				</label>
			</div>
			<br />
			<button type="submit" class="submit-button">Submit Review</button>
		</form>
		<button @click="exitForm" class="exit-button">I'll submit a review later</button>
	</div>
</template>

<script>
import Offers from "../views/OffersView.vue";
import {
	getFirestore,
	doc,
	getDoc,
	collection,
	getDocs,
	addDoc,
	setDoc,
	updateDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.css";

export default {
	name: "ReviewForm",
	props: {
		userId: String,
		listingId: String,
		offerId: String,
	},
	components: {
		Offers,
	},
	data() {
		return {
			rating: 0,
			review: "",
			userName: "",
		};
	},
	created() {
		this.fetchUserDetails();
	},
	methods: {
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

		async submitReview() {
			try {
				const db = getFirestore();
				const docRef = doc(db, "users", this.userId);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const docData = docSnap.data();
					const updatedReviews = [...docData.reviews, this.rating]; // Add the new rating to the existing reviews array

					// Update the document with the new reviews array
					await updateDoc(docRef, { ...docData, reviews: updatedReviews });

					// Optionally, you can perform additional actions after successfully updating the document
					console.log("Review submitted successfully!");

					const auth = getAuth();
					const currentUserUid = auth.currentUser?.uid;
					const offerDocRef = doc(
						db,
						"users",
						currentUserUid,
						"offers",
						this.offerId
					);
					await updateDoc(offerDocRef, { reviewed: true });

					this.$router.push({ name: "OffersView" });
				} else {
					console.log("Document does not exist");
				}
			} catch (error) {
				console.error("Error submitting review:", error);
			}
		},

    async exitForm() {
      this.$router.push({ name: "Offers" });
    },
	},
};
</script>

<style scoped>
.review-form {
	border: 1px solid #ccc;
	border-radius: 5px; /* Add rounded corners */
	padding: 40px;
	margin-top: 16px;
	background-color: #f5f5f5; /* Add subtle background color */
}

.review-form h2 {
	margin-top: 0;
}

.star-rating {
	display: flex;
	justify-content: center;
	margin-bottom: 0px;
}

.star {
	cursor: pointer;
	margin-right: 5px; /* Add spacing between stars */
}

.star i {
	font-size: 30px; /* Increase star size */
	font-family: "FontAwesome", sans-serif;
}

.star i.filled {
	color: #ffd700;
}

.star:hover i:not(.filled) {
	color: #ffd700; /* Add hover effect for unfilled stars */
}

.review-form button {
	margin-top: 10px;
	background-color: #f44336; /* Add button background color */
	color: white;
	padding: 10px 30px;
	border: none;
	border-radius: 5px; /* Add rounded corners to button */
	cursor: pointer;
}

.review-form .exit-button {
	background-color: #f5f5f5;
	margin-top: 16px;
	color: #007bff; /* Change text color to blue */
	text-decoration: underline; /* Add underline to text */
	cursor: pointer;
}
</style>

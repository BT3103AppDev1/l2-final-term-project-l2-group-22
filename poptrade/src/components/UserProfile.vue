<template>
	<div class="user-profile" v-if="userProfile">
		<div class="profile-container">
			<h1>User Profile</h1>
			<img
				:src="
					userProfile.photoUrl ||
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReYctZuBY4c58lgxVJqjssfyMmghW2aRr62Q&usqp=CAU'
				"
				alt="Profile Image"
				class="profile-image"
			/>
			<h2>{{ userProfile.fullname }}</h2>
			<div>
				<p>Telegram: {{ userProfile.telegram }}</p>
				<p class="reviews-text">
					{{ averageRating.toFixed(1) }} / 5 stars,
					{{ userProfile.reviews.length }} reviews
				</p>
			</div>
			<button @click="emitSignOut" v-if="isCurrentUser" class="signout-button">
				Sign Out
			</button>
		</div>
	</div>
	<div class="login" v-else>
		<p>You must be logged in to view this page.</p>
	</div>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
	name: "UserProfile",
	props: {
		userId: String, // Accept a user ID as a prop
	},
	computed: {
		averageRating() {
			// Check if reviews array is not empty
			if (this.userProfile.reviews.length > 0) {
				// Sum up all the ratings in the reviews array
				const sum = this.userProfile.reviews.reduce(
					(total, review) => total + review,
					0
				);
				// Calculate the average rating
				return sum / this.userProfile.reviews.length;
			} else {
				return 5; // Return 5 if there are no reviews
			}
		},
	},
	setup(props) {
		const currentUser = inject("currentUser", ref(null)); // Inject currentUser
		const userProfile = ref(null);
		const isCurrentUser = computed(
			() =>
				userProfile.value && userProfile.value.uid === currentUser.value?.uid
		);

		async function fetchUserData(uid) {
			const userDocRef = doc(db, "users", uid);
			const userDocSnapshot = await getDoc(userDocRef);
			if (userDocSnapshot.exists()) {
				const userData = userDocSnapshot.data();
				return {
					uid: uid,
					username: userData.username,
					fullname: userData.firstName + " " + userData.lastName,
					reviews: userData.reviews,
					phoneNo: userData.phoneNumber,
					telegram: userData.telegramHandle,
					email: userData.email,
				};
			}
			return null;
		}

		onMounted(async () => {
			const uid = props.userId || currentUser.value?.uid;
			if (uid && (!currentUser.value || uid !== currentUser.value.uid)) {
				userProfile.value = await fetchUserData(uid);
			} else {
				userProfile.value = currentUser.value; // Use injected currentUser if no userId prop or they match
			}
		});

		function emitSignOut() {
			auth.signOut();
		}

		return { userProfile, isCurrentUser, emitSignOut };
	},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

.user-profile {
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: "Oswald", sans-serif;
	width: 100%;
}

.profile-container {
	display: flex;
	align-items: center;
	gap: 20px; /* Space between elements */
	padding: 1em;
	text-align: left;
	max-width: 600px; /* Adjust based on your preference */
	border: 1px solid #ccc; /* Optional: adds a border around the profile */
	border-radius: 8px; /* Optional: rounds the corners of the border */
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
}

.profile-image {
	width: 80px; /* Smaller profile image */
	height: 80px; /* Maintain aspect ratio */
	border-radius: 50%;
	object-fit: cover; /* Ensures the image covers the space without stretching */
}

.profile-details {
	display: flex;
	flex-direction: column;
	gap: 4px; /* Space between text elements */
}

h1,
h2,
p {
	margin: 0; /* Removes default margins */
	font-family: "Oswald", sans-serif;
}

h1 {
	font-size: 1.5rem; /* Smaller heading */
	color: #333;
}

h2 {
	font-size: 1.25rem; /* Smaller subheading */
}

p {
	font-size: 0.9rem; /* Smaller paragraph text */
	color: #666;
}

.signout-button,
.button {
	/* This selector targets both your manage button and any other button */
	background-color: #ff4d4d;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 10px 15px;
	cursor: pointer;
	font-family: "Oswald", sans-serif; /* Oswald font for buttons */
}

.signout-button:hover,
.button:hover {
	/* Hover effects for both manage and other buttons */
	background-color: #e60000;
}
</style>

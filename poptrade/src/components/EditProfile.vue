<template>
	<div class="edit-profile">
		<h1>Edit Profile</h1>
		<div class="form-group">
			<label for="telegram">Telegram Handle:</label>
			<input type="text" id="telegram" v-model="telegram" />
		</div>
		<div class="form-group">
			<label for="phone">Phone Number:</label>
			<input type="text" id="phone" v-model="phone" />
		</div>
		<button @click="updateProfile">Save Changes</button>
	</div>
</template>

<script>
import { ref } from "vue";
import { db, auth } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
	name: "EditProfile",
	data() {
		return {
			telegram: "",
			phone: "",
		};
	},
	async created() {
		await this.fetchUserData();
	},
	methods: {
		async fetchUserData() {
			const currentUser = auth.currentUser;
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					this.telegram = userData.telegramHandle;
					this.phone = userData.phoneNumber;
				}
			}
		},
		async updateProfile() {
			const currentUser = auth.currentUser;
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				await updateDoc(userDocRef, {
					telegramHandle: this.telegram,
					phoneNumber: this.phone,
				});
				alert("Profile updated successfully!");
				await this.$router.push({ name: "Dashboard" });
				window.location.reload();
			}
		},
	},
};
</script>

<style scoped>
.edit-profile {
	width: 80%;
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-profile h1 {
	font-size: 1.5rem;
	margin-bottom: 20px;
	text-align: center;
}

.form-group {
	margin-bottom: 20px;
}

label {
	display: block;
	font-weight: bold;
	margin-bottom: 5px;
}

input {
	width: 95%;
	padding: 10px;
	font-size: 1rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button {
	display: block;
	width: 100%;
	padding: 10px;
	background-color: #f44336;
	color: #fff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	margin-bottom: 10px;
}

button:hover {
	background-color: #d32f2f;
}
</style>

<template>
    <Offers
        :receivedOffers="receivedOffers"
        :sentOffers="sentOffers"
        :completedOffers="completedOffers"
        @acceptOffer="acceptOffer"
        @rejectOffer="rejectOffer"
        @retractOffer="retractOffer"
        @reviewOffer="review"
        @goToListing="goToListing"
        @goToDashboard="goToDashboard"
    />
</template>

<script>
import { ref } from "vue";
import {
	getFirestore,
	collection,
	getDocs,
	getDoc,
	doc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
import Offers from "../components/Offers.vue";

export default {
	name: "OffersView",
    components: {
        Offers
    },
	setup() {
		const receivedOffers = ref([]); // Create a reactive variable to store received offers
		const sentOffers = ref([]); // Create a reactive variable to store sent offers
		const completedOffers = ref([]);

		const router = useRouter();

		const goToListing = (uid, listingId) => {
			router.push({
				name: "ViewListing",
				params: { userId: uid, listingId: listingId },
			});
		};

		async function getUser(uid) {
			const firestore = getFirestore();
			const userRef = doc(firestore, "users", uid);
			try {
				const docSnapshot = await getDoc(userRef);
				if (docSnapshot.exists()) {
					const userData = docSnapshot.data();
					return userData;
				} else {
					console.error("User with UID", uid, "not found.");
					return null;
				}
			} catch (error) {
				console.error("Error getting user:", error);
				return null;
			}
		}

		const getListing = async (listingId) => {
			const firestore = getFirestore();
			const auth = getAuth();
			const currentUserUid = auth.currentUser?.uid;
			try {
				// Get all user documents
				const usersSnapshot = await getDocs(collection(firestore, "users"));

				for (const userDoc of usersSnapshot.docs) {
					// Skip current user's listings

					// Get listings for this user
					const listingsSnapshot = await getDocs(
						collection(userDoc.ref, "listings")
					);

					// Search for the listing with the given ID
					for (const listingDoc of listingsSnapshot.docs) {
						if (listingDoc.id === listingId) {
							return listingDoc.data();
						}
					}
				}

				// Listing not found
				console.error("Listing not found", listingId);
				return null;
			} catch (error) {
				console.error("Error getting listing:", error);
				return null;
			}
		};

		const fetchReceivedOffers = async () => {
			const firestore = getFirestore();
			const auth = getAuth();
			const currentUserUid = auth.currentUser?.uid;
			const offersRef = collection(
				firestore,
				"users",
				currentUserUid,
				"offers"
			);

			try {
				const querySnapshot = await getDocs(offersRef);
				let offers = querySnapshot.docs
					.map((doc) => ({ id: doc.id, ...doc.data() }))
					.filter(
						(offer) =>
							offer.offerType === "Offer Received" &&
							offer.tradeStatus === "Pending"
					);
				let validReceivedOffers = []; // Temporary array to store valid offers

				for (let offer of offers) {
					const yourListing = await getListing(offer.yourListing);
					const theirListing = await getListing(offer.offererListing);
					const theirProfile = await getUser(offer.offeredBy);

					if (
						yourListing.status !== "Available" ||
						theirListing.status !== "Available"
					) {
						// If either listing is unavailable, mark the offer as "Unavailable"
						await updateDoc(
							doc(firestore, "users", currentUserUid, "offers", offer.id),
							{ tradeStatus: "Unavailable" }
						);
						await updateDoc(
							doc(firestore, "users", offer.offeredBy, "offers", offer.id),
							{ tradeStatus: "Unavailable" }
						);
					} else {
						// If both listings are available, add the offer to the validOffers array
						offer.yourImageURL = yourListing.imageURL;
						offer.yourId = currentUserUid;
						offer.theirImageURL = theirListing.imageURL;
						offer.telegramHandle = theirProfile.telegramHandle;
						offer.contactInfo = theirProfile.phoneNumber;
						validReceivedOffers.push(offer); // Only add offers that pass the availability check
					}
				}

				receivedOffers.value = validReceivedOffers; // Set receivedOffers to the filtered list of valid offers
			} catch (error) {
				console.error("Error fetching received offers:", error);
				receivedOffers.value = []; // Reset to empty array in case of error
			}
		};

		const fetchSentOffers = async () => {
			const firestore = getFirestore();
			const auth = getAuth();
			const currentUserUid = auth.currentUser?.uid;
			const offersRef = collection(
				firestore,
				"users",
				currentUserUid,
				"offers"
			);

			try {
				const querySnapshot = await getDocs(offersRef);
				let tempOffers = querySnapshot.docs
					.filter((doc) => doc.data().offerType === "Offer Sent")
					.filter((doc) => doc.data().tradeStatus === "Pending")
					.map((doc) => ({
						id: doc.id,
						...doc.data(),
						yourImageURL: null, // These will be populated later
						yourId: currentUserUid,
						telegramHandle: null,
						contactInfo: null,
					}));

				let validSentOffers = []; // Temporary array to store offers that pass availability check

				for (let offer of tempOffers) {
					const yourListing = await getListing(offer.yourListing);
					const theirListing = await getListing(offer.offererListing);
					const theirProfile = await getUser(offer.offeredBy);

					// Proceed only if both listings are available, otherwise update the offer to "Unavailable"
					if (
						yourListing.status !== "Available" ||
						theirListing.status !== "Available"
					) {
						await updateDoc(
							doc(firestore, "users", currentUserUid, "offers", offer.id),
							{ tradeStatus: "Unavailable" }
						);
						await updateDoc(
							doc(firestore, "users", offer.offeredBy, "offers", offer.id),
							{ tradeStatus: "Unavailable" }
						);
					} else {
						// Update offer details only for available listings
						offer.yourImageURL = yourListing.imageURL;
						offer.theirImageURL = theirListing.imageURL;
						offer.telegramHandle = theirProfile.telegramHandle;
						offer.contactInfo = theirProfile.phoneNumber;
						validSentOffers.push(offer); // Add offer to the list of valid offers
					}
				}

				sentOffers.value = validSentOffers; // Update the reactive property with the filtered list
				console.log("Filtered sent offers:", sentOffers);
			} catch (error) {
				console.error("Error fetching sent offers:", error);
				sentOffers.value = []; // Reset to empty array in case of error
			}
		};

		const fetchCompletedOffers = async () => {
			const firestore = getFirestore();
			const auth = getAuth();
			const currentUserUid = auth.currentUser?.uid;
			const offersRef = collection(
				firestore,
				"users",
				currentUserUid,
				"offers"
			);

			try {
				const querySnapshot = await getDocs(offersRef);
				let offers = querySnapshot.docs
					.filter((doc) => doc.data().tradeStatus !== "Pending") // Filter out offers of type "Offer Received"
					.map((doc) => {
						let offer = doc.data();
						offer.id = doc.id;
						// Initialize image URLs as null
						offer.yourImageURL = null;
						offer.yourId = currentUserUid;
						offer.tele = null;
						offer.theirImageURL = null;
						offer.contactInfo = null;
						return offer;
					});
				// Simultaneously fetch all listings for the 'yourImageUrl' field
				for (let offer of offers) {
					const yourListing = await getListing(offer.yourListing);
					const theirListing = await getListing(offer.offererListing);
					const theirProfile = await getUser(offer.offeredBy);
					offer.yourImageURL = yourListing.imageURL;
					offer.theirImageURL = theirListing.imageURL;
					offer.telegramHandle = theirProfile.telegramHandle;
					offer.contactInfo = theirProfile.phoneNumber;
				}

				completedOffers.value = offers;
				console.log("completed", completedOffers);
			} catch (error) {
				console.error("Error fetching completed offers:", error);
				completedOffers.value = []; // Reset to empty array in case of error
			}
		};

		// Call fetchReceivedOffers function when component is mounted
		fetchReceivedOffers();
		fetchSentOffers();
		fetchCompletedOffers();

		return { receivedOffers, goToListing, sentOffers, completedOffers }; // Expose receivedOffers reactive variable to template
	},

	methods: {
		goToDashboard(userId) {
			this.$router.push({ name: "Dashboard", params: { userId } });
		},
		async acceptOffer(offer) {
			const firestore = getFirestore();
			const auth = getAuth();
			// Assume offer includes IDs of both listings and a unique ID for the offer itself
			try {
				// Update the listing status to unavailable
				await updateDoc(
					doc(
						firestore,
						"users",
						auth.currentUser.uid,
						"listings",
						offer.yourListing
					),
					{
						status: "Unavailable",
					}
				);
				await updateDoc(
					doc(
						firestore,
						"users",
						offer.offeredBy,
						"listings",
						offer.offererListing
					),
					{
						status: "Unavailable",
					}
				);

				// Update the offer's status to 'Completed'
				await updateDoc(
					doc(firestore, "users", auth.currentUser.uid, "offers", offer.id),
					{
						tradeStatus: "Completed",
					}
				);

				// Optionally, if you also track offers in the offerer's document,
				// update the offer there as well
				await updateDoc(
					doc(firestore, "users", offer.offeredBy, "offers", offer.id),
					{
						tradeStatus: "Completed",
					}
				);

				console.log(
					"Trade accepted and listings removed. Offer marked as completed."
				);
				// window.location.reload();
				this.$router.push({
					name: "ReviewForm",
					params: {
						userId: offer.offeredBy,
						listingId: offer.offererListing,
						offerId: offer.id,
					},
				});
			} catch (error) {
				console.error("Error accepting trade:", error);
			}
		},

		async rejectOffer(offer) {
			const firestore = getFirestore();
			const auth = getAuth();
			// Assuming offer includes a unique ID for the offer itself and the ID of the user who made the offer (offer.offeredBy)
			try {
				// Update the offer's status to 'Rejected' in the current user's collection
				await updateDoc(
					doc(firestore, "users", auth.currentUser.uid, "offers", offer.id),
					{
						tradeStatus: "Rejected",
					}
				);

				// Update the offer's status to 'Rejected' in the offerer's collection
				await updateDoc(
					doc(firestore, "users", offer.offeredBy, "offers", offer.id),
					{
						tradeStatus: "Rejected",
					}
				);

				console.log(
					"Offer rejected. Status updated to 'Rejected' for both users."
				);
				window.location.reload();
			} catch (error) {
				console.error("Error rejecting offer:", error);
			}
		},

		async retractOffer(offer) {
			const firestore = getFirestore();
			const auth = getAuth();
			// Assuming offer includes a unique ID for the offer itself and the ID of the user who made the offer (offer.offeredBy)
			try {
				// Update the offer's status to 'Rejected' in the current user's collection
				await deleteDoc(
					doc(firestore, "users", auth.currentUser.uid, "offers", offer.id)
				);

				// Update the offer's status to 'Rejected' in the offerer's collection
				await deleteDoc(
					doc(firestore, "users", offer.offeredBy, "offers", offer.id)
				);

				console.log(
					"Offer retracted. Offer is removed from both users' offers collection"
				);
				window.location.reload();
			} catch (error) {
				console.error("Error retracting offer:", error);
			}
		},

		async review(offer) {
			// Navigate to reviewform.vue
			this.$router.push({
				name: "ReviewForm",
				params: {
					userId: offer.offeredBy,
					listingId: offer.offererListing,
					offerId: offer.id,
				},
			});
		},
	},
};
</script>

<style scoped>
.contactInfo {
	color: #007bff;
	cursor: pointer;
	text-decoration: underline;
}

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
	background-color: #f44336;
	color: white;
	padding: 10px 25px;
	border-radius: 15px;
	border-color: #f44336;
}
</style>

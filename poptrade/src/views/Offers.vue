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
        <tr v-for="offer in receivedOffers" :key="offer.time">
          <td class="offer-image-cell">
            <img :src="offer.yourImageURL" alt="Your Offer" @click="goToListing(offer.yourId, offer.yourListing)"/>
          </td>
          <td class="offer-image-cell">
            <img :src="offer.theirImageURL" alt="Their Offer" @click="goToListing(offer.offeredBy, offer.offererListing)"/>
          </td>
          <td>{{ offer.time }}</td>
          <td> {{ offer.telegramHandle }}
				<br>
				{{ offer.contactInfo }}
			</td>
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

	<!-- New table for offers you have sent -->
    <h2>Offers you have sent:</h2>
    <table class="offers-table">
      <thead>
        <tr>
          <th>Your Offer</th>
          <th>Their Offer</th>
          <th>Time of Offer</th>
          <th>Contact Information</th>
          <th>Status</th>
		  <th>Retract Offer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="offer in sentOffers" :key="offer.time">
          <td class="offer-image-cell">
            <img :src="offer.yourImageURL" alt="Your Offer" @click="goToListing(offer.yourId, offer.yourListing)"/>
          </td>
          <td class="offer-image-cell">
            <img :src="offer.theirImageURL" alt="Their Offer" @click="goToListing(offer.offeredBy, offer.offererListing)"/>
          </td>
          <td>{{ offer.time }}</td>
          <td> {{ offer.telegramHandle }}
            <br>
            {{ offer.contactInfo }}
          </td>
          <td>{{ offer.tradeStatus }}</td>
		  <td class="offer-actions-cell">
            <button class="reject-button" @click="rejectOffer(offer)">
              Retract Offer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { useRouter } from "vue-router";

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
      receivedOffers: [],
	  sentOffers : []
    };
  },
  
  setup() {
    const receivedOffers = ref([]); // Create a reactive variable to store received offers
	const sentOffers = ref([]); // Create a reactive variable to store sent offers
	const router = useRouter();
	const goToListing = (uid,listingId) => {
      router.push({
        name: "ViewListing",
        params: { userId: uid, listingId },
      });
    };

	async function getUser(uid) {
		const firestore = getFirestore();
		const userRef = doc(firestore, 'users', uid);
		try {
			const docSnapshot = await getDoc(userRef);
			if (docSnapshot.exists()) {
				const userData = docSnapshot.data();
				return userData;
			} else {
				console.error('User with UID', uid, 'not found.');
				return null;
			}
		} catch (error) {
				console.error('Error getting user:', error);
				return null;
		}
	}

	const getListing = async(listingId) => {
      const firestore = getFirestore();
      const auth = getAuth();
      const currentUserUid = auth.currentUser?.uid;
      try {
        // Get all user documents
        const usersSnapshot = await getDocs(collection(firestore, "users"));
        
        for (const userDoc of usersSnapshot.docs) {
          // Skip current user's listings

          // Get listings for this user
          const listingsSnapshot = await getDocs(collection(userDoc.ref, "listings"));
          
          // Search for the listing with the given ID
          for (const listingDoc of listingsSnapshot.docs) {
            if (listingDoc.id === listingId) {
				console.log(listingDoc.data().imageURL)
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
      const offersRef = collection(firestore, "users", currentUserUid, "offers");

      try {
        const querySnapshot = await getDocs(offersRef);
        let offers = querySnapshot.docs
			.filter(doc => doc.data().offerType === "Offer Received") // Filter out offers of type "Offer Received"
			.map(doc => {
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
			const yourListing = await getListing(offer.yourListing)
			const theirListing = await getListing(offer.offererListing)
			const theirProfile = await getUser(offer.offeredBy)
			offer.yourImageURL = yourListing.imageURL
			offer.theirImageURL = theirListing.imageURL
			offer.telegramHandle = theirProfile.telegramHandle
			offer.contactInfo = theirProfile.phoneNumber
        }

        receivedOffers.value = offers;
      } catch (error) {
        console.error("Error fetching received offers:", error);
        receivedOffers.value = []; // Reset to empty array in case of error
      }
    };

	const fetchSentOffers = async () => {
      const firestore = getFirestore();
      const auth = getAuth();
      const currentUserUid = auth.currentUser?.uid;
      const offersRef = collection(firestore, "users", currentUserUid, "offers");

      try {
        const querySnapshot = await getDocs(offersRef);
        let offers = querySnapshot.docs
          .filter(doc => doc.data().offerType === "Offer Sent")
          .map(doc => {
            let offer = doc.data();
            offer.id = doc.id;
            offer.yourImageURL = null;
            offer.yourId = currentUserUid;
            offer.telegramHandle = null;
            offer.contactInfo = null;
			return offer;
		  });
		
		  for (let offer of offers) {
			const yourListing = await getListing(offer.yourListing)
			const theirListing = await getListing(offer.offererListing)
			const theirProfile = await getUser(offer.offeredBy)
			offer.yourImageURL = yourListing.imageURL
			offer.theirImageURL = theirListing.imageURL
			offer.telegramHandle = theirProfile.telegramHandle
			offer.contactInfo = theirProfile.phoneNumber
        }

			sentOffers.value = offers;
			console.log("sent",sentOffers);
      } catch (error) {
        console.error("Error fetching sent offers:", error);
        sentOffers.value = [];
      }
    };

    // Call fetchReceivedOffers function when component is mounted
    fetchReceivedOffers();
	fetchSentOffers();

    return { receivedOffers, goToListing, sentOffers }; // Expose receivedOffers reactive variable to template
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

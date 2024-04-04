<template>
  <div class="marketplace">
    <h1>Marketplace</h1>
    <div class="listings-row">
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="listing"
        @click="goToViewListing(listing.id)"
      >
        <img
          :src="listing.imageURL"
          :alt="listing.name"
          class="listing-image"
        />
        <p>{{ listing.name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "vue-router"; // Import useRouter from 'vue-router
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

export default {
  name: "Marketplace",
  setup() {
    const listings = ref([]);
    const firestore = getFirestore();
    const router = useRouter(); // Use useRouter to access the router instance
    const auth = getAuth(); // Use getAuth to access the auth instance

    const fetchListings = async () => {
      const allListings = ref([]); // Moved inside function for reactivity on each call
      let currentUserUid = auth.currentUser ? auth.currentUser.uid : null;
      console.log("Current user UID:", currentUserUid); // Log current user UID

      // If the currentUserUid is not available yet, wait for onAuthStateChanged
      if (!currentUserUid) {
        console.log("Waiting for auth state change...");
        await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              currentUserUid = user.uid;
              console.log("User signed in:", currentUserUid); // Log the signed in user UID
              resolve();
            } else {
              console.log("No user signed in.");
              resolve();
            }
          });
        });
      }

      try {
        const usersRef = collection(firestore, "users");
        console.log("Fetching users...");
        const usersSnapshot = await getDocs(usersRef);
        console.log(`Found ${usersSnapshot.docs.length} users`);

        for (const userDoc of usersSnapshot.docs) {
          console.log("Checking user:", userDoc.id);
          if (allListings.value.length >= 5) {
            console.log("Collected 5 listings, breaking...");
            break;
          }

          if (userDoc.id === currentUserUid) {
            console.log("Skipping current user listings");
            continue;
          }

          const listingsRef = collection(
            firestore,
            "users",
            userDoc.id,
            "listings"
          );
          console.log(`Fetching listings for user ${userDoc.id}`);
          const listingsSnapshot = await getDocs(listingsRef);

          for (const listingDoc of listingsSnapshot.docs) {
            if (allListings.value.length < 5) {
              console.log("Adding listing:", listingDoc.id);
              allListings.value.push({
                id: listingDoc.id,
                ...listingDoc.data(),
              });
            } else {
              console.log("Reached 5 listings, breaking...");
              break;
            }
          }
        }

        console.log("Final listings:", allListings.value);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }

      return allListings; // Return the reactive listings reference
    };

    onMounted(async () => {
      const fetchedListings = await fetchListings(); // Use the returned reactive listings reference
      listings.value = fetchedListings.value.slice(0, 5); // Set the main reactive listings reference
    });

    const goToViewListing = (listingId) => {
      router.push({ name: "ViewListing", params: { id: listingId } });
    };

    return {
      listings,
      goToViewListing,
    };
  },
};
</script>

<style scoped>
/* Header styles */
.marketplace h1 {
  color: red;
  text-align: center;
  font-size: 2em;
  margin: 0.5em 0;
}

/* Adjusted button styles to class listings */
.listing {
  cursor: pointer;
}

.listing img {
  max-width: 100%;
  border-radius: 5px;
}

/* Layout styles for listings */
.listings-row {
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping by default */
  overflow-x: auto; /* Enable horizontal scrolling */
  gap: 10px; /* Spacing between listings */
  padding: 10px 0;
}

.listing {
  flex: 0 0 auto; /* Do not grow, do not shrink, and do not allow flex-basis to be auto-sized */
  margin: 0 5px; /* Horizontal margin for spacing */
  width: 180px; /* Fixed width */
  text-align: center; /* Center the text within each listing */
}

/* Responsive design adjustments */
@media (max-width: 768px) {
  .listing {
    width: 120px; /* Smaller width on small screens */
  }
}

/* Global layout adjustments */
.marketplace {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Remove button styles as they are not being used for listings */
</style>

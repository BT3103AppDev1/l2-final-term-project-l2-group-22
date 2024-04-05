<template>
  <div class="marketplace">
    <h1>Marketplace</h1>
    <div class="listings-row">
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="listing"
        @click="goToViewListing(listing)"
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
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "Marketplace",
  setup() {
    const listings = ref([]);
    const firestore = getFirestore();
    const router = useRouter();
    const auth = getAuth();

    const fetchListings = async () => {
      const fetchedListings = ref([]);
      let currentUserUid = auth.currentUser?.uid;

      if (!currentUserUid) {
        console.log("Waiting for auth state change...");
        currentUserUid = await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            resolve(user?.uid);
          });
        });
        console.log("Auth state changed:", currentUserUid);
      }

      if (!currentUserUid) {
        console.log("No user signed in.");
        return fetchedListings;
      }

      const usersSnapshot = await getDocs(collection(firestore, "users"));
      console.log(`Found ${usersSnapshot.docs.length} users`);

      for (const userDoc of usersSnapshot.docs) {
        if (fetchedListings.value.length >= 5) break;
        if (userDoc.id === currentUserUid) continue;

        const listingsSnapshot = await getDocs(
          collection(firestore, "users", userDoc.id, "listings")
        );
        listingsSnapshot.docs
          .slice(0, 5 - fetchedListings.value.length)
          .forEach((doc) => {
            fetchedListings.value.push({
              id: doc.id,
              userId: userDoc.id,
              ...doc.data(),
            });
          });
      }

      console.log("Final listings:", fetchedListings.value);
      return fetchedListings;
    };

    onMounted(async () => {
      listings.value = (await fetchListings()).value;
    });

    const goToViewListing = (listing) => {
      router.push({
        name: "ViewListing",
        params: { userId: listing.userId, listingId: listing.id },
      });
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

<template>
  <div class="search-results-container">
    <!-- Sidebar for filtering -->
    <aside class="sidebar">
      <h3>Sort by:</h3>
      <!-- Filtering options could be implemented here -->
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <div v-if="loading">
        <p>Loading...</p>
      </div>
      <div v-else-if="currentGroup">
        <h2>{{ currentGroup.name }}</h2>
        <img :src="currentGroup.imageURL" alt="Item Image" class="item-image" />
        <div
          v-for="result in currentGroup.listings"
          :key="result.id"
          class="listing-group"
        >
          <div class="listing-row">
            <div class="condition">{{ result.condition }}</div>
            <div class="wishlist">
              <img
                v-for="item in result.wishlistItems"
                :key="item"
                :src="item"
                class="wishlist-image"
              />
            </div>
            <div class="telegram-handle">{{ result.telegramHandle }}</div>
            <button class="view-listing-btn" @click="goToViewListing(result)">
              View Listing
            </button>
          </div>
        </div>
        <div class="pagination">
          <button class="prev-btn" @click="prevGroup" :disabled="!hasPrevGroup">
            Previous
          </button>
          <button class="next-btn" @click="nextGroup" :disabled="!hasNextGroup">
            Next
          </button>
        </div>
      </div>
      <div v-else>
        <p>No results found.</p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const firestore = getFirestore();
    const auth = getAuth();
    const currentUserUid = ref(auth.currentUser?.uid);
    const itemName = ref(route.query.itemName);
    const groupedResults = ref([]);
    const currentPageIndex = ref(0);
    const loading = ref(false);

    const fetchUserDetails = async (userId) => {
      const userDetails = {
        wishlistItems: [],
        telegramHandle: "",
      };
      const wishlistRef = collection(firestore, "users", userId, "wishlist");
      const wishlistSnapshot = await getDocs(wishlistRef);
      userDetails.wishlistItems = wishlistSnapshot.docs.map(
        (doc) => doc.data().imageURL
      );
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);
      userDetails.telegramHandle = userDoc.exists()
        ? userDoc.data().telegramHandle
        : "";
      return userDetails;
    };

    const fetchFilteredResults = async () => {
      loading.value = true;
      let tempResults = [];
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      for (const userDoc of usersSnapshot.docs) {
        if (userDoc.id === currentUserUid.value) continue;
        let baseQuery = collection(firestore, "users", userDoc.id, "listings");
        if (route.query.selectedPopmart) {
          baseQuery = query(
            baseQuery,
            where("popmart", "==", route.query.selectedPopmart)
          );
        }
        if (route.query.selectedCollection) {
          baseQuery = query(
            baseQuery,
            where("collection", "==", route.query.selectedCollection)
          );
        }
        let listingsQuery = itemName.value
          ? query(
              baseQuery,
              where("name", "==", itemName.value),
              where("status", "==", "Available")
            )
          : query(baseQuery, where("status", "==", "Available"));
        const listingsSnapshot = await getDocs(listingsQuery);
        tempResults.push(
          ...listingsSnapshot.docs.map((doc) => ({
            id: doc.id,
            userId: userDoc.id,
            ...doc.data(),
          }))
        );
      }
      tempResults = await Promise.all(
        tempResults.map(async (result) => {
          const userDetails = await fetchUserDetails(result.userId);
          return {
            ...result,
            wishlistItems: userDetails.wishlistItems,
            telegramHandle: userDetails.telegramHandle,
          };
        })
      );
      groupedResults.value = Object.entries(
        tempResults.reduce((acc, cur) => {
          if (!acc[cur.name]) acc[cur.name] = [];
          acc[cur.name].push(cur);
          return acc;
        }, {})
      ).map(([name, listings]) => ({
        name,
        imageURL: listings[0].imageURL,
        listings,
      }));
      currentPageIndex.value = 0;
      loading.value = false;
    };

    watch(
      [
        () => route.query.itemName,
        () => route.query.selectedPopmart,
        () => route.query.selectedCollection,
      ],
      fetchFilteredResults,
      { immediate: true }
    );

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        currentUserUid.value = user?.uid;
        fetchFilteredResults();
      });
    });

    const goToViewListing = (result) => {
      router.push({
        name: "ViewListing",
        params: { userId: result.userId, listingId: result.id },
      });
    };

    const prevGroup = () => {
      if (currentPageIndex.value > 0) currentPageIndex.value--;
    };

    const nextGroup = () => {
      if (currentPageIndex.value < groupedResults.value.length - 1)
        currentPageIndex.value++;
    };

    return {
      itemName,
      groupedResults,
      goToViewListing,
      currentPageIndex,
      prevGroup,
      nextGroup,
      hasPrevGroup: computed(() => currentPageIndex.value > 0),
      hasNextGroup: computed(
        () => currentPageIndex.value < groupedResults.value.length - 1
      ),
      loading,
      currentGroup: computed(
        () => groupedResults.value[currentPageIndex.value]
      ),
    };
  },
};
</script>

<style scoped>
.search-results-container {
  display: flex;
  background-color: #f9f9f9;
}

.sidebar {
  width: 250px;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.main-content {
  flex-grow: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}

.listing-group {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
}

.listing-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.condition,
.telegram-handle,
.view-listing-btn {
  flex-shrink: 0;
}

.wishlist {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  flex-grow: 1;
}

.wishlist img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
}

.wishlist img:hover {
  transform: scale(1.1);
}

.view-listing-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.view-listing-btn:hover {
  background-color: #0056b3;
}

.telegram-handle {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.item-image {
  max-width: 150px;
  max-height: 150px;
  width: auto;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
}

.prev-btn,
.next-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.prev-btn:hover,
.next-btn:hover {
  background-color: #0056b3;
}

.prev-btn {
  margin-right: 10px;
}

.next-btn {
  margin-left: 10px;
}

.prev-btn:disabled,
.next-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

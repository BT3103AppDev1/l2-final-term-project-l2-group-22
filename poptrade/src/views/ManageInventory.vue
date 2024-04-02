<template>
  <div class="page-container">
    <!-- Listings Section -->
    <div class="listings-container">
      <h2>Edit your Listings:</h2>
      <div class="listings">
        <div v-for="listing in listings" :key="listing.id" class="listing-card">
          <img :src="listing.imageURL" alt="Item Image" class="listing-image" />
          <div class="listing-details">
            <h3>{{ listing.name }}</h3>
            <p>{{ listing.collection }}</p>
          </div>
          <button @click="removeListing(listing.id)">Remove</button>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div class="form-container">
      <h2>List your item</h2>
      <form @submit.prevent="submitListing">
        <!-- Popmart Selector -->
        <div class="form-group">
          <label for="popmart">Popmart:</label>
          <select id="popmart" v-model="selectedPopmart" required>
            <option value="">Select a Popmart</option>
            <option v-for="popmart in popmarts" :value="popmart">
              {{ popmart }}
            </option>
          </select>
        </div>

        <!-- Collection Selector -->
        <div class="form-group">
          <label for="collection">Collection:</label>
          <select id="collection" v-model="selectedCollection" required>
            <option value="">Select a collection</option>
            <option v-for="collection in collections" :value="collection">
              {{ collection }}
            </option>
          </select>
        </div>

        <!-- Item Name Selector -->
        <div class="form-group">
          <label for="itemName">Item Name:</label>
          <select id="itemName" v-model="itemName" required>
            <option value="">Select an item</option>
            <option v-for="item in items" :value="item.name">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Condition Selector -->
        <div class="form-group">
          <label for="condition">Condition:</label>
          <select id="condition" v-model="itemCondition" required>
            <option value="">Select condition</option>
            <option value="Mint">Mint</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <!-- Item Description Input -->
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea
            id="description"
            v-model="itemDescription"
            placeholder="Describe your item..."
            required
          ></textarea>
        </div>

        <input type="submit" value="Upload now" class="submit-btn" />
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "ManageListings",
  setup() {
    const selectedPopmart = ref("");
    const selectedCollection = ref("");
    const itemName = ref("");
    const itemCondition = ref("");
    const itemDescription = ref("");

    const popmarts = ref([]);
    const collections = ref([]);
    const items = ref([]);
    const listings = ref([]);

    const firestore = getFirestore();
    const auth = getAuth();

    // Fetches Popmart names from Firestore
    const fetchPopmarts = async () => {
      try {
        const popmartsRef = collection(firestore, "Popmarts");
        const querySnapshot = await getDocs(popmartsRef);
        popmarts.value = querySnapshot.docs.map((doc) => doc.id);
      } catch (error) {
        console.error("Failed to fetch Popmarts:", error);
      }
    };

    // Fetches listings for the authenticated user
    const fetchListings = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const listingsRef = collection(
            firestore,
            "users",
            user.uid,
            "listings"
          );
          const querySnapshot = await getDocs(listingsRef);
          listings.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error("Failed to fetch listings:", error);
        }
      }
    };

    // Watches for changes in the selected Popmart and fetches corresponding collections
    watch(selectedPopmart, async (newPopmart) => {
      if (newPopmart) {
        try {
          const collectionsRef = collection(
            firestore,
            "Popmarts",
            newPopmart,
            "Collection"
          );
          const querySnapshot = await getDocs(collectionsRef);
          collections.value = querySnapshot.docs.map((doc) => doc.id);
          items.value = []; // Clears items when a new Popmart is selected
        } catch (error) {
          console.error(
            `Failed to fetch collections for ${newPopmart}:`,
            error
          );
          collections.value = [];
          items.value = [];
        }
      } else {
        collections.value = [];
        items.value = [];
      }
    });

    // Watches for changes in the selected collection and fetches corresponding items
    watch(
      [selectedPopmart, selectedCollection],
      async ([newPopmart, newCollection]) => {
        if (newCollection && newPopmart) {
          try {
            const figurinesRef = collection(
              firestore,
              "Popmarts",
              newPopmart,
              "Collection",
              newCollection,
              "Figurine"
            );
            const querySnapshot = await getDocs(figurinesRef);
            items.value = querySnapshot.docs.map((doc) => ({
              name: doc.id,
              imageURL: doc.data().imageURL,
            }));
          } catch (error) {
            console.error(
              `Failed to fetch items for ${newCollection} in ${newPopmart}:`,
              error
            );
            items.value = [];
          }
        } else {
          items.value = [];
        }
      }
    );

    // Submits a new listing to Firestore
    const submitListing = async () => {
      const user = auth.currentUser;
      if (
        user &&
        selectedPopmart.value &&
        selectedCollection.value &&
        itemName.value
      ) {
        try {
          const selectedFigurine = items.value.find(
            (item) => item.name === itemName.value
          );
          await addDoc(collection(firestore, "users", user.uid, "listings"), {
            popmart: selectedPopmart.value,
            collection: selectedCollection.value,
            name: itemName.value,
            condition: itemCondition.value,
            description: itemDescription.value,
            imageURL: selectedFigurine ? selectedFigurine.imageURL : "",
          });
          alert("New listing added!"); // User feedback
          selectedPopmart.value = ""; // Reset form fields
          selectedCollection.value = "";
          itemName.value = "";
          itemCondition.value = "";
          itemDescription.value = "";
          await fetchListings();
        } catch (error) {
          console.error("Error adding new listing:", error);
          alert("Failed to add listing. Please try again."); // User feedback
        }
      } else {
        alert("Please fill in all required fields."); // User feedback
      }
    };

    // Removes a listing from Firestore and the local state
    const removeListing = async (listingId) => {
      const user = auth.currentUser;
      if (user) {
        try {
          await deleteDoc(
            doc(firestore, "users", user.uid, "listings", listingId)
          );
          listings.value = listings.value.filter(
            (listing) => listing.id !== listingId
          );
          alert(`Listing with ID ${listingId} has been removed.`); // User feedback
        } catch (error) {
          console.error("Error removing listing:", error);
          alert("Failed to remove listing. Please try again."); // User feedback
        }
      } else {
        alert("User is not authenticated."); // User feedback
      }
    };

    onMounted(async () => {
      await fetchPopmarts();
      await fetchListings();
    });

    return {
      selectedPopmart,
      selectedCollection,
      itemName,
      itemCondition,
      itemDescription,
      popmarts,
      collections,
      items,
      listings,
      removeListing,
      submitListing,
    };
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.listings-container {
  width: 100%;
  max-width: 800px; /* Adjust as needed */
  margin-bottom: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.listing-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.listing-image {
  width: 100%;
  display: block;
}

.listing-details {
  padding: 10px;
  text-align: center;
}

.listing-details h3 {
  font-size: 1rem;
  margin: 5px 0;
}

.listing-details p {
  font-size: 0.8rem;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 20px;
  width: calc(100% - 20px);
  margin-top: 10px;
}

button:hover {
  background-color: #d32f2f;
}

.form-container {
  width: 100%;
  max-width: 800px; /* Adjust as needed */
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

select,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

textarea {
  height: 100px;
}

.submit-btn {
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>

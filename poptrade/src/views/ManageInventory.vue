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
        <!-- Collection Selector -->
        <div class="form-group">
          <label for="collection">Collection:</label>
          <select id="collection" v-model="selectedCollection" required>
            <option value="">Select a collection</option>
            <option value="Animal Kingdom">Animal Kingdom</option>
            <option value="Letters From Snowman">Letters From Snowman</option>
            <!-- Add more collections as needed -->
          </select>
        </div>

        <!-- Item Name Selector -->
        <div class="form-group">
          <label for="itemName">Item Name:</label>
          <select id="itemName" v-model="itemName" required>
            <option value="">Select an item</option>
            <option v-for="item in items" :value="item">{{ item }}</option>
            <!-- Dynamically add items based on the selected collection -->
          </select>
        </div>

        <!-- Condition Selector -->
        <div class="form-group">
          <label for="condition">Condition:</label>
          <select id="condition" v-model="itemCondition" required>
            <option value="">Select condition</option>
            <option value="Mint">Mint</option>
            <option value="Used">Used</option>
            <!-- Add more conditions as needed -->
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
    const selectedCollection = ref("");
    const itemName = ref("");
    const itemCondition = ref("");
    const itemDescription = ref("");
    const itemImageURL = ref("");
    const items = ref([]);

    const listings = ref([]);
    const firestore = getFirestore();
    const auth = getAuth();

    const collectionItemsWithImageURLs = {
      "Animal Kingdom": {
        "Foodie Giraffe": {
          imageUrl:
            "https://popmart.sg/cdn/shop/files/DIMOOAnimalKingdomSeriesFiguresDIMOO__Feed15_1800x1800.jpg?v=1711085552",
        },
        "Taichi Panda": {
          imageUrl:
            "https://popmart.sg/cdn/shop/files/DIMOOAnimalKingdomSeriesFiguresDIMOO__Feed10_1800x1800.jpg?v=1711085552",
        },
        // Add more items and their image URLs
      },
      "Letters From Snowman": {
        "Making Snowman": {
          imageUrl:
            "https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries_5_1800x1800.jpg?v=1701438768",
        },
        "Merry Christmas": {
          imageUrl:
            "https://popmart.sg/cdn/shop/files/DIMOOLettersfromSnowmanSeries_6_1800x1800.jpg?v=1701438768",
        },
        // Add more items and their image URLs
      },
      // Add more collections and their items with image URLs here
    };
    // Watch for changes in selectedCollection and update the items list accordingly
    watch(selectedCollection, (newValue) => {
      if (newValue && collectionItemsWithImageURLs[newValue]) {
        items.value = Object.keys(collectionItemsWithImageURLs[newValue]);
      } else {
        items.value = [];
      }
      itemName.value = ""; // Reset selected item when collection changes
    });
    const submitListing = async () => {
      const user = auth.currentUser;
      if (user) {
        // Retrieve the image URL based on selected collection and item name
        const imageURL =
          collectionItemsWithImageURLs[selectedCollection.value][itemName.value]
            ?.imageUrl || "";

        try {
          await addDoc(collection(firestore, "users", user.uid, "listings"), {
            collection: selectedCollection.value,
            name: itemName.value,
            condition: itemCondition.value,
            description: itemDescription.value,
            imageURL: imageURL, // Use the determined image URL
          });
          console.log("New listing added!");
          // After successful submission, clear the form by resetting the model values
          selectedCollection.value = "";
          itemName.value = "";
          itemCondition.value = "";
          itemDescription.value = "";
          await fetchListings();
        } catch (error) {
          console.error("Error adding new listing:", error);
        }
      } else {
        console.log("User is not authenticated");
      }
    };

    const fetchListings = async () => {
      const user = auth.currentUser;
      if (user) {
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
      }
    };
    console.log(listings);

    onMounted(fetchListings);

    const removeListing = async (listingId) => {
      const user = auth.currentUser;
      if (user) {
        const listingDocRef = doc(
          firestore,
          "users",
          user.uid,
          "listings",
          listingId
        );
        try {
          await deleteDoc(listingDocRef);
          // Remove the listing from the local state
          listings.value = listings.value.filter(
            (listing) => listing.id !== listingId
          );
          console.log(`Listing with ID ${listingId} has been removed.`);
        } catch (error) {
          console.error("Error removing listing:", error);
        }
      } else {
        console.log("User is not authenticated");
      }
    };

    return {
      listings,
      selectedCollection,
      itemName,
      items,
      itemCondition,
      itemDescription,
      itemImageURL,
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

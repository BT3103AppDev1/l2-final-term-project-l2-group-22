<template>
  <div class="container">
    <div class="listings-container">
      <h2>Edit your Listings:</h2>
      <div class="listings">
        <div v-for="listing in listings" :key="listing.id" class="listing-card">
          <img :src="listing.imageURL" alt="Item Image" class="listing-image" />
          <h3>{{ listing.name }}</h3>
          <p>{{ listing.collection }}</p>
          <button @click="removeListing(listing.id)">Remove</button>
        </div>
      </div>
    </div>

    <div class="form-container">
      <h2>List your item</h2>
      <form @submit.prevent="submitListing">
        <label for="collection">Collection:</label>
        <select
          id="collection"
          v-model="selectedCollection"
          @change="updateItems"
          required
        >
          <option value="">Select a collection</option>
          <option value="Animal Kingdom">Animal Kingdom</option>
          <option value="Letters From Snowman">Letters From Snowman</option>
          <!-- Add more collections as needed -->
        </select>

        <label for="itemName">Item Name:</label>
        <select id="itemName" v-model="itemName" required>
          <option value="">Select an item</option>
          <option v-for="item in items" :value="item">{{ item }}</option>
          <!-- Dynamically add items based on the selected collection -->
        </select>

        <label for="condition">Condition:</label>
        <select id="condition" v-model="itemCondition" required>
          <option value="">Select condition</option>
          <option value="Mint">Mint</option>
          <option value="Used">Used</option>
          <!-- Add more conditions as needed -->
        </select>

        <label for="description">Description:</label>
        <textarea
          id="description"
          v-model="itemDescription"
          placeholder="Describe your item..."
          required
        ></textarea>

        <input type="submit" value="Upload now" />
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
.container {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.listings-container {
  flex: 1;
  max-width: calc(50% - 10px);
  margin-right: 20px;
}

.listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.listing-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.listing-image {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #d32f2f;
}

.form-container {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.form-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-container form {
  display: flex;
  flex-direction: column;
}

.form-container label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-container input[type="text"],
.form-container select,
.form-container textarea {
  margin-bottom: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-container textarea {
  height: 100px;
  resize: vertical;
}

.form-container input[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.form-container input[type="submit"]:hover {
  background-color: #45a049;
}
</style>

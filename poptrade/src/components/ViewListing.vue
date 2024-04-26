<template>
  <div class="viewlisting-container">
    <GoBackButton></GoBackButton>

    <div class="header-body">
      <div class="item-card">
        <div class="item-image">
          <img :src="imageSrc" alt="Item Image" />
        </div>
        <div class="item-details">
          <h1 class="item-title">{{ character }}</h1>
          <h1 class="item-brand">{{ series }}</h1>
          <p class="item-figurine">Figurine: {{ figurine }}</p>
          <p class="item-condition">Condition: {{ condition }}</p>
          <p class="item-description">Description: {{ description }}</p>
          <div class="item-seller-box">
            <div class="seller-details">
              <p class="item-seller">
                Listed by:
                <span class="verified-seller" @click="goToDashboard(userId)">{{
                  userName
                }}</span>
                <br />
                Location: {{ location }}
                <br />
                <span class="reviews-text">
                  {{ averageRating.toFixed(1) }} / 5 stars,
                  {{ reviews.length }} reviews
                </span>
              </p>
            </div>
          </div>
          <p class="item-wishlist">{{ userName }}'s wishlist:</p>
          <div class="wishlist-images">
            <img
              v-for="(item, index) in wishlistItems"
              :key="index"
              :src="item.imageURL"
              :alt="'Wishlist Item ' + item.name"
              :class="{
                'matched-item': item.isMatch,
                'unmatched-item': !item.isMatch,
              }"
            />
          </div>

          <br />
          <button
            id="make-offer-button"
            v-on:click="makeOffer"
            :disabled="disabled"
            :class="{
              'disabled-button': disabled,
              'enabled-button': !disabled,
            }"
          >
            {{ disabled ? "Unavailable" : "Make Offer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import GoBackButton from "../components/GoBackButton.vue";

export default {
  name: "ViewListing",
  components: {
    GoBackButton,
  },

  props: {
    userId: String,
    listingId: String,
  },
  data() {
    return {
      character: "",
      series: "",
      imageSrc: "",
      figurine: "",
      condition: "",
      description: "",
      wishlistItems: [],
      disabled: false,
      location: "Loading...", // Default value indicating data is being fetched
      numberOfReviews: 0, // Default value, assuming it will be updated
      numberOfTrade: 0, // Default value, assuming it will be updated
      userName: "",
      reviews: [],
      currentUserInventory: [],
    };
  },
  created() {
    this.fetchListingDetails();
  },
  computed: {
    averageRating() {
      // Check if reviews array is not empty
      if (this.reviews.length > 0) {
        // Sum up all the ratings in the reviews array
        const sum = this.reviews.reduce((total, review) => total + review, 0);
        // Calculate the average rating
        return sum / this.reviews.length;
      } else {
        return 5; // Return 0 if there are no reviews
      }
    },
  },

  methods: {
    goToDashboard(userId) {
      this.$router.push({ name: "Dashboard", params: { userId } });
    },

    async fetchListingDetails() {
      const db = getFirestore();
      const listingRef = doc(
        db,
        "users",
        this.userId,
        "listings",
        this.listingId
      );

      try {
        const docSnap = await getDoc(listingRef);
        if (docSnap.exists()) {
          const listingData = docSnap.data();
          this.character = listingData.popmart;
          this.series = listingData.collection;
          this.imageSrc = listingData.imageURL;
          this.figurine = listingData.name;
          this.condition = listingData.condition;
          this.description = listingData.description;
          this.location = "Singapore";
          this.numberOfReviews = 10;
          this.numberOfTrade = 10;
          await this.fetchWishlistDetails(); // Fetch wishlist details after listing details
          await this.fetchUserDetails();
          await this.fetchReviews();
          await this.disableMakeOfferButton();
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    },
    async disableMakeOfferButton() {
      const db = getFirestore();
      const auth = getAuth();
      const currentUser = auth.currentUser.uid;
      console.log("Current user: " + currentUser);
      console.log("User id: " + this.userId);
      const listingRef = doc(
        db,
        "users",
        this.userId,
        "listings",
        this.listingId
      );
      try {
        const docSnap = await getDoc(listingRef);
        const listingData = docSnap.data();
        if (
          listingData.status === "Unavailable" ||
          this.userId === currentUser
        ) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
        this.disabled = false; // Default to disabled in case of error
      }
    },
    async fetchWishlistDetails() {
      const db = getFirestore();
      const wishlistRef = collection(db, "users", this.userId, "wishlist");

      const auth = getAuth();
      const currentUser = auth.currentUser;

      const currentUserInventoryRef = query(
        collection(db, "users", currentUser.uid, "listings"),
        where("status", "==", "Available") // Only fetch listings where status is "Available"
      );
      const currentUserInventorySnapshot = await getDocs(
        currentUserInventoryRef
      );
      const currentUserInventory = currentUserInventorySnapshot.docs.map(
        (doc) => doc.data().name
      );

      try {
        const querySnapshot = await getDocs(wishlistRef);
        this.wishlistItems = querySnapshot.docs.map((doc) => {
          const item = doc.data();
          return {
            ...item,
            imageURL: item.imageURL,
            isMatch: currentUserInventory.includes(item.name), // Check for matches
          };
        });
      } catch (error) {
        console.error("Error fetching wishlist details:", error);
        this.wishlistItems = [];
      }
    },

    async fetchUserDetails() {
      const db = getFirestore();
      const userDocRef = doc(db, "users", this.userId);

      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const { firstName, lastName } = docSnap.data();
          this.userName = `${firstName} ${lastName}`;
        } else {
          console.log("No such document!");
          this.userName = "";
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        this.userName = "";
      }
    },

    async fetchReviews() {
      const db = getFirestore();
      const userDocRef = doc(db, "users", this.userId);

      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const { reviews } = docSnap.data();
          this.reviews = reviews;
        } else {
          console.log("No such document!");
          this.reviews = "";
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        this.reviews = "";
      }
    },

    makeOffer() {
      this.$router.push({
        name: "OfferTrade",
        params: { userId: this.userId, listingId: this.listingId },
      });
    },
  },
};
</script>

<style scoped>
.viewlisting-container {
  min-height: 0vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}

.back-button {
  margin-top: 20px;
  margin-left: 22px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s; 
  font-size: 16px;
  text-align: center;
  display: inline-block;
  text-decoration: none;
}

.back-button:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}

.back-button:focus {
  outline: none;
}

.item-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: left;
}

.item-card h1 {
  margin: 0; /* Reset margin */
}

.item-card {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 1rem;
  text-align: left;
}

.item-card .item-image {
  width: auto;
  max-width: 35%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-card .item-image img {
  width: 100%;
  height: auto;
  border-radius: 15px;
  object-fit: cover;
}

.verified-seller {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

#make-offer-button {
  width: 8em;
  height: 35px;
  font-size: medium;
}

.disabled-button {
  color: grey;
  background-color: lightgrey;
  border-radius: 10px;
  cursor: not-allowed;
}

.enabled-button {
  color: white;
  background-color: red;
  border-radius: 10px;
  border-color: red;
  cursor: pointer;
}

.item-seller-box {
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;
}

.seller-details {
  flex: 6;
}

.wishlist-images {
  display: flex;
  justify-content: flex-start;
}

.wishlist-images img {
  width: 100px;
  height: 120px;
  margin-right: 10px;
  border-radius: 5px;
}
	
.matched-item {
  border: 5px solid #4caf50;
}

.unmatched-item {
  border: 5px solid #ff4d4d;
}

.item-figurine {
  margin-top: 2px;
  font-weight: bold;
}

.item-details {
  margin-left: 2rem;
}
</style>

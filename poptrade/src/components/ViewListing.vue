<template>
  <div class="viewlisting-container">
    <router-link to="/marketplace" class="back-button"
      >Back to Marketplace</router-link
    >
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
          <div class="item-seller-box">
            <div class="seller-details">
              <p class="item-seller">
                Listed by:
                <span class="verified-seller">{{ listingId }}</span>
                <br />
                Location: {{ location }}
                <br />
                <span class="reviews-text">
                  {{ numberOfReviews }} reviews, {{ numberOfTrade }} sold items
                </span>
              </p>
            </div>
          </div>
          <p class="item-wishlist">Their wishlist:</p>
          <div class="wishlist-images">
            <img
              v-for="(item, index) in wishlistItems"
              :key="index"
              :src="item"
              alt="Wishlist Item"
            />
          </div>

          <br />

          <button id="make-offer-button" v-on:click="makeOffer">
            Make Offer
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
} from "firebase/firestore";

export default {
  name: "ViewListing",
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
      location: "Loading...", // Default value indicating data is being fetched
      numberOfReviews: 0, // Default value, assuming it will be updated
      numberOfTrade: 0, // Default value, assuming it will be updated
    };
  },
  created() {
    this.fetchListingDetails();
  },
  methods: {
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
          console.log(this.imageSrc);
          this.figurine = listingData.name;
          this.condition = listingData.condition;
          this.description = listingData.description;
          this.location = "Singapore";
          this.numberOfReviews = 10;
          this.numberOfTrade = 10;
          await this.fetchWishlistDetails(); // Fetch wishlist details after listing details
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    },

    async fetchWishlistDetails() {
      const db = getFirestore();
      const wishlistRef = collection(db, "users", this.userId, "wishlist");

      try {
        const querySnapshot = await getDocs(wishlistRef);
        this.wishlistItems = querySnapshot.docs.map(
          (doc) => doc.data().imageURL
        );
      } catch (error) {
        console.error("Error fetching wishlist details:", error);
        this.wishlistItems = []; // Reset to empty array in case of error
      }
    },
    makeOffer() {
      this.$router.push({
        name: "OfferTrade",

        props: {
          imageSrc: this.imageSrc,
          character: this.character,
          series: this.series,
          figurine: this.figurine,
          condition: this.condition,
          wishlistItems: this.wishlistItems,
        },
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
  margin-bottom: 3rem;
  margin-top: 0;
  padding-top: 0;
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
  align-items: flex-start; /* Adjusted to align items to the start */
  justify-content: space-between; /* Adds space between the image and details */
  background-color: white;
  border-radius: 5px;
  padding: 20px; /* Add some padding around the content */
  margin-bottom: 1rem;
  text-align: left;
}

.item-card .item-image {
  width: auto; /* Adjust width to auto */
  max-width: 50%; /* Limit the image width to 50% of its container */
  height: auto; /* Set height to auto to maintain aspect ratio */
  border-radius: 15px; /* Adjust border-radius for rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: adds shadow for depth */
  margin-right: 20px; /* Add some margin to the right of the image */
}

.item-card .item-image img {
  width: 100%;
  height: auto; /* Maintain aspect ratio */
  border-radius: 15px; /* Ensure the img tag also has rounded corners */
  object-fit: cover; /* Cover the area, this will clip the image if not square */
}

.item-card .verified-seller {
  color: #55a630;
  font-weight: bold;
}

#make-offer-button {
  color: white;
  background-color: red;
  border-radius: 10px;
  width: 50%;
  border-color: red;
  height: 35px;
  font-size: medium;
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

.item-figurine {
  margin-top: 2px;
  font-weight: bold;
}
</style>

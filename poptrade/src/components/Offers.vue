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
          <td @click="$emit('goToListing', offer.yourId, offer.yourListing)">
            <div class="listing-card">
              <img
                :src="offer.yourImageURL"
                alt="Your Offer"
                class="listing-image"
              />
              <div class="listing-details">
                <h3>{{ offer.yourCollection }}</h3>
                <p>{{ offer.yourFigurine }}</p>
              </div>
            </div>
          </td>

          <td
            @click="$emit('goToListing', offer.offeredBy, offer.offererListing)"
          >
            <div class="listing-card">
              <img
                :src="offer.theirImageURL"
                alt="Their Offer"
                class="listing-image"
              />
              <div class="listing-details">
                <h3>{{ offer.theirCollection }}</h3>
                <p>{{ offer.theirFigurine }}</p>
              </div>
            </div>
          </td>

          <td>{{ offer.time }}</td>
          <td
            class="contactInfo"
            @click="$emit('goToDashboard', offer.offeredBy)"
          >
            {{ offer.telegramHandle }}<br />{{ offer.contactInfo }}
          </td>
          <td class="offer-actions-cell">
            <button class="accept-button" @click="$emit('acceptOffer', offer)">
              Accept Offer
            </button>
            <button class="reject-button" @click="$emit('rejectOffer', offer)">
              Reject Offer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Offers you have sent:</h2>
    <table class="offers-table">
      <thead>
        <tr>
          <th>Your Offer</th>
          <th>Their Offer</th>
          <th>Time of Offer</th>
          <th>Contact Information</th>
          <th>Retract Offer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="offer in sentOffers" :key="offer.time">
          <td @click="$emit('goToListing', offer.yourId, offer.yourListing)">
            <div class="listing-card">
              <img
                :src="offer.yourImageURL"
                alt="Your Offer"
                class="listing-image"
              />
              <div class="listing-details">
                <h3>{{ offer.yourCollection }}</h3>
                <p>{{ offer.yourFigurine }}</p>
              </div>
            </div>
          </td>

          <td
            @click="$emit('goToListing', offer.offeredBy, offer.offererListing)"
          >
            <div class="listing-card">
              <img
                :src="offer.theirImageURL"
                alt="Their Offer"
                class="listing-image"
              />
              <div class="listing-details">
                <h3>{{ offer.theirCollection }}</h3>
                <p>{{ offer.theirFigurine }}</p>
              </div>
            </div>
          </td>

          <td>{{ offer.time }}</td>
          <td
            class="contactInfo"
            @click="$emit('goToDashboard', offer.offeredBy)"
          >
            {{ offer.telegramHandle }}<br />{{ offer.contactInfo }}
          </td>
          <td class="offer-actions-cell">
            <button class="reject-button" @click="$emit('retractOffer', offer)">
              Retract Offer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Offers Completed:</h2>
    <table class="offers-table">
      <thead>
        <tr>
          <th>Your Offer</th>
          <th>Their Offer</th>
          <th>Time of Offer</th>
          <th>Contact Information</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="offer in completedOffers" :key="offer.id">
          <td @click="$emit('goToListing', offer.yourId, offer.yourListing)">
            <div class="listing-card">
              <img
                :src="offer.yourImageURL"
                alt="Your Offer"
                class="listing-image"
              />
              <div class="listing-details">
                <h3>{{ offer.yourCollection }}</h3>
                <p>{{ offer.yourFigurine }}</p>
              </div>
            </div>
          </td>

          <td
            @click="$emit('goToListing', offer.offeredBy, offer.offererListing)"
          >
            <div class="listing-card">
              <img
                :src="offer.theirImageURL"
                alt="Their Offer"
                class="listing-image"
              />
              <div class="listing-details">
                <h3>{{ offer.theirCollection }}</h3>
                <p>{{ offer.theirFigurine }}</p>
              </div>
            </div>
          </td>

          <td>{{ offer.time }}</td>
          <td
            class="contactInfo"
            @click="$emit('goToDashboard', offer.offeredBy)"
          >
            {{ offer.telegramHandle }}<br />{{ offer.contactInfo }}
          </td>
          <td>
            <span v-if="offer.tradeStatus === 'Unavailable'">Unavailable</span>
            <button
              v-else-if="!offer.reviewed && offer.tradeStatus === 'Completed'"
              @click="$emit('reviewOffer', offer)"
              class="reject-button"
            >
              Review
            </button>
            <span v-else> {{ offer.tradeStatus }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Offers",
  props: {
    receivedOffers: Array,
    sentOffers: Array,
    completedOffers: Array,
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
  object-fit: contain;
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

.listing-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  height: 17vw;
  width: 9vw;
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
  margin-top: 5px;
  margin-bottom: 1px;
}

.listing-details p {
  font-size: 0.8rem;
  margin-top: 2px;
  margin-bottom: 33px;
}
</style>

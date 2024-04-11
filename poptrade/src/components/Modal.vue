<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Search Listings</h2>
      <form @submit.prevent="submitSearch">
        <!-- Popmart Selector -->
        <div class="form-group">
          <label for="popmart">Popmart:</label>
          <select id="popmart" v-model="selectedPopmart" required>
            <option value="">Select a Popmart</option>
            <option v-for="popmart in popmarts" :value="popmart" :key="popmart">
              {{ popmart }}
            </option>
          </select>
        </div>

        <!-- Collection Selector -->
        <div class="form-group">
          <label for="collection">Collection:</label>
          <select id="collection" v-model="selectedCollection" required>
            <option value="">Select a collection</option>
            <option
              v-for="collection in collections"
              :value="collection"
              :key="collection"
            >
              {{ collection }}
            </option>
          </select>
        </div>

        <!-- Item Name Selector -->
        <div class="form-group">
          <label for="itemName">Item Name:</label>
          <select id="itemName" v-model="itemName" required>
            <option value="">Select an item</option>
            <option v-for="item in items" :value="item.name" :key="item.name">
              {{ item.name }}
            </option>
          </select>
        </div>

        <input type="submit" value="Search" class="submit-btn" />
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default {
  props: ["show"],
  emits: ["close", "searchSubmitted"], // Include "searchSubmitted" here
  setup(props, { emit }) {
    const selectedPopmart = ref("");
    const selectedCollection = ref("");
    const itemName = ref("");
    const popmarts = ref([]);
    const collections = ref([]);
    const items = ref([]);

    const firestore = getFirestore();

    // Watches for modal visibility to trigger initial data fetch
    watch(
      () => props.show,
      (newVal) => {
        if (newVal) fetchPopmarts();
      }
    );

    // Fetches Popmart names from Firestore
    async function fetchPopmarts() {
      try {
        const snapshot = await getDocs(collection(firestore, "Popmarts"));
        popmarts.value = snapshot.docs.map((doc) => doc.id);
      } catch (error) {
        console.error("Failed to fetch Popmarts:", error);
      }
    }

    // Updates collections based on selected Popmart
    watch(selectedPopmart, async (newPopmart) => {
      if (!newPopmart) return resetCollections();

      try {
        const snapshot = await getDocs(
          collection(firestore, "Popmarts", newPopmart, "Collection")
        );
        collections.value = snapshot.docs.map((doc) => doc.id);
      } catch (error) {
        console.error(`Failed to fetch collections for ${newPopmart}:`, error);
        resetCollections();
      }
    });

    // Updates items based on selected collection
    watch(
      [selectedPopmart, selectedCollection],
      async ([newPopmart, newCollection]) => {
        if (!newCollection) return resetItems();

        try {
          const snapshot = await getDocs(
            collection(
              firestore,
              "Popmarts",
              newPopmart,
              "Collection",
              newCollection,
              "Figurine"
            )
          );
          items.value = snapshot.docs.map((doc) => ({
            name: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error(
            `Failed to fetch items for ${newCollection} in ${newPopmart}:`,
            error
          );
          resetItems();
        }
      }
    );

    function resetCollections() {
      collections.value = [];
      resetItems();
    }

    function resetItems() {
      items.value = [];
    }

    function closeModal() {
      emit("close");
    }

    function submitSearch() {
      emit("searchSubmitted", {
        itemName: itemName.value,
      });
      closeModal();
    }

    return {
      selectedPopmart,
      selectedCollection,
      itemName,
      popmarts,
      collections,
      items,
      closeModal,
      submitSearch,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
}

.close {
  float: right;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>

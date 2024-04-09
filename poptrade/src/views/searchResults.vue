import { useRoute } from 'vue-router'; export default { setup() { const route =
useRoute(); const selectedPopmart = route.query.selectedPopmart; const
selectedCollection = route.query.selectedCollection; const itemName =
route.query.itemName; // Use these parameters to form your Firestore query... },
}; async function fetchFilteredResults() { const resultsRef =
collection(firestore, 'users', selectedPopmart, 'Collection',
selectedCollection, 'Figurine'); // Add query constraints based on itemName or
other criteria if necessary... const snapshot = await getDocs(resultsRef); //
Process and display your results... }

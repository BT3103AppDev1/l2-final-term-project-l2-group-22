import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Import your views and components
import HomeView from "@/views/HomeView.vue";
import Marketplace from "@/views/Marketplace.vue";
import OffersView from "@/views/OffersView.vue";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import ViewListing from "../components/ViewListing.vue";
import Register from "@/views/Register.vue";
import ManageInventory from "@/views/ManageInventory.vue";
import ManageWishlist from "@/views/ManageWishlist.vue";
import OfferTrade from "../components/OfferTrade.vue";
import ReviewForm from "../components/ReviewForm.vue";
import SearchResults from "@/views/SearchResults.vue";
import EditProfile from "../components/EditProfile.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  {
    path: "/marketplace",
    name: "Marketplace",
    component: Marketplace,
    meta: { requiresAuth: true, requiresCompleteProfile: true },
  },
  {
    path: "/offers",
    name: "OffersView",
    component: OffersView,
    meta: { requiresAuth: true, requiresCompleteProfile: true },
  },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/dashboard/:userId?",
    name: "Dashboard",
    component: Dashboard,
    props: true,
    meta: { requiresAuth: true, requiresCompleteProfile: true },
  },
  { path: "/editprofile", name: "EditProfile", component: EditProfile },
  {
    path: "/listing/:userId/:listingId",
    name: "ViewListing",
    component: ViewListing,
    props: true,
  },
  { path: "/register", name: "Register", component: Register },
  {
    path: "/offertrade/:userId/:listingId",
    name: "OfferTrade",
    component: OfferTrade,
    props: true,
  },
  {
    path: "/reviewform/:userId/:listingId/:offerId",
    name: "ReviewForm",
    component: ReviewForm,
    props: true,
  },
  {
    path: "/manage-inventory",
    name: "ManageInventory",
    component: ManageInventory,
  },
  {
    path: "/manage-wishlist",
    name: "ManageWishlist",
    component: ManageWishlist,
  },
  { path: "/search-results", name: "SearchResults", component: SearchResults },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const auth = getAuth();
const db = getFirestore();

async function isUserProfileComplete(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log("User document does not exist.");
    return false;
  }
  const userData = docSnap.data();
  const isComplete =
    userData.username &&
    userData.firstName &&
    userData.lastName &&
    userData.phoneNumber &&
    userData.telegramHandle;
  if (!isComplete) {
    console.log("Profile is incomplete:", userData);
  }
  return isComplete;
}

router.beforeEach(async (to, from, next) => {
  const { requiresAuth, requiresCompleteProfile } = to.meta;
  const user = auth.currentUser;
  console.log("Routing to:", to.path, "User logged in:", !!user);

  if (requiresAuth && !user) {
    console.log("Redirecting to Login, user not authenticated.");
    next("/login");
    return;
  }

  if (user) {
    console.log("User is authenticated, checking profile completeness.");
    const profileComplete = await isUserProfileComplete(user.uid);
    if (!profileComplete) {
      console.log("Profile incomplete.");
      // Check if the destination route is the registration page
      if (to.path !== "/register") {
        console.log("Redirecting to Register.");
        next("/register");
        return;
      } else {
        console.log("Proceeding to Register.");
      }
    }
  }

  console.log("No specific requirements, proceeding to:", to.path);
  next();
});

export default router;

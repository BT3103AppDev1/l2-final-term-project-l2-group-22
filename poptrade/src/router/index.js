import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";
import { ref, onUnmounted } from "vue";
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

// Centralized authentication check
async function isAuthenticated() {
  return !!auth.currentUser;
}

// Centralized profile completeness check
async function isUserProfileComplete(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return false;
  const userData = docSnap.data();
  return (
    userData.username &&
    userData.firstName &&
    userData.lastName &&
    userData.phoneNumber &&
    userData.telegramHandle
  );
}

router.beforeEach(async (to, from, next) => {
  const { requiresAuth, requiresCompleteProfile } = to.meta;
  const user = auth.currentUser;

  if (requiresAuth && !user) {
    next("/login");
    return;
  }

  if (requiresAuth && requiresCompleteProfile && user) {
    const profileComplete = await isUserProfileComplete(user.uid);
    if (!profileComplete) {
      next("/register");
      return;
    }
  }

  next();
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import HomeView from "@/views/HomeView.vue";
import Marketplace from "@/views/Marketplace.vue"; // Placeholder for your marketplace component
import Offers from "@/views/Offers.vue"; // Placeholder for your offers component
import Login from "@/views/Login.vue"; // Placeholder for your login component
import Profile from "@/views/Profile.vue";
import Dashboard from "@/views/Dashboard.vue";
import ViewListing from "../components/ViewListing.vue";
import Register from "@/views/Register.vue";
import ManageInventory from "@/views/ManageInventory.vue";
import ManageWishlist from "@/views/ManageWishlist.vue";
import OfferTrade from "../components/OfferTrade.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/marketplace",
    name: "Marketplace",
    component: Marketplace,
  },
  {
    path: "/offers",
    name: "Offers",
    component: Offers,
    meta: { requiresAuth: true }, // Requires authentication to access
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true }, // Requires authentication to access
  },
  {
    path: "/listing/:userId/:listingId",
    name: "ViewListing",
    component: ViewListing,
    props: true,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  // ...other routes as needed

  {
    path: "/offertrade/:userId/:listingId",
    name: "OfferTrade",
    component: OfferTrade,
    props: true,
  },

  {
    path: "/dashboard",
    name: "Dashboard", // This should match the name used in the $router.push method
    component: Dashboard,
    meta: { requiresAuth: true }, // Requires authentication to access
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const auth = getAuth();
const user = ref(null);

import { getFirestore, doc, getDoc } from "firebase/firestore";

// This function checks if the user's profile is complete
async function checkUserProfileComplete(userId) {
  const db = getFirestore();
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    // Check if all required fields are present and not empty
    return (
      userData.username &&
      userData.firstName &&
      userData.lastName &&
      userData.phoneNumber &&
      userData.telegramHandle
    );
  } else {
    // No user document found
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  let isProfileComplete = false;
  if (isAuthenticated) {
    isProfileComplete = await checkUserProfileComplete(auth.currentUser.uid);
  }

  if (to.path === "/") {
    if (!isAuthenticated) {
      // User is not authenticated, redirect to login or stay on home page
      next("/login"); // or `next();` if you want them to stay on the home page
    } else {
      // User is authenticated, check if profile is complete
      next(isProfileComplete ? "/dashboard" : "/register");
    }
  } else if (requiresAuth && !isAuthenticated) {
    // If the route requires auth and the user is not authenticated, redirect to login
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    // User is authenticated and tries to access login, redirect based on profile completion
    next(isProfileComplete ? "/dashboard" : "/register");
  } else if (to.path === "/register" && isAuthenticated && isProfileComplete) {
    // User is authenticated, has a complete profile, and tries to access register, redirect to dashboard
    next("/dashboard");
  } else {
    // In all other cases, allow the route transition
    next();
  }
});

export default router;

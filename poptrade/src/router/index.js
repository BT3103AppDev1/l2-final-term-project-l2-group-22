import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import HomeView from "@/views/HomeView.vue";
import Marketplace from "@/views/Marketplace.vue"; // Placeholder for your marketplace component
import Offers from "@/views/Offers.vue"; // Placeholder for your offers component
import Login from "@/views/Login.vue"; // Placeholder for your login component
import Profile from "@/views/Profile.vue";
import Dashboard from "@/views/Dashboard.vue";
import UserProfile from "@/components/UserProfile.vue";
import ViewListing from "../components/ViewListing.vue";
import Register from "@/views/Register.vue";
import ManageInventory from "@/views/ManageInventory.vue";
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
		path: "/viewlisting",
		name: "ViewListing", // This should match the name used in the $router.push method
		component: ViewListing,
	},
  {
		path: "/register",
		name: "Register", 
		component: Register,
	},
	// ...other routes as needed

	{
		path: "/offertrade",
		name: "OfferTrade",
		component: OfferTrade,
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
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

const auth = getAuth();
const user = ref(null);

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	const isAuthenticated = auth.currentUser;
	if (to.path === "/") {
		if (isAuthenticated) {
			// If the user is authenticated, redirect to the Dashboard
			next("/dashboard");
		} else {
			// If the user is not authenticated, allow them to proceed to the root page (e.g., HomeView)
			next();
		}
	} else if (requiresAuth && !isAuthenticated) {
		// If the user is not authenticated and tries to access a protected route, redirect to Login
		next("/login");
	} else if (to.path === "/login" && isAuthenticated) {
		// If the user is authenticated and tries to access the Login page, redirect to Dashboard
		next("/dashboard");
	} else {
		// In all other cases, allow the route transition
		next();
	}
});

export default router;

<template>
  <div class="register">
    <h1>Create Account</h1>
    <p>Join the community of POPMART traders!</p>
    <form @submit.prevent="registerUser">
      <input type="text" v-model="username" placeholder="Username" required />
      <input
        type="text"
        v-model="firstName"
        placeholder="First Name"
        required
      />
      <input type="text" v-model="lastName" placeholder="Last Name" required />
      <input
        type="tel"
        v-model="phoneNumber"
        placeholder="Phone Number"
        required
      />
      <input
        type="text"
        v-model="telegramHandle"
        placeholder="Telegram Handle"
        required
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { firebase, auth } from "@/firebase.js";
import { nextTick } from "vue";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      telegramHandle: "",
      user: null,
    };
  },
  created() {
    this.user = auth.currentUser;
  },
  methods: {
    async registerUser() {
      const db = getFirestore();
      const usernameRef = doc(db, "usernames", this.username);
      const usernameSnapshot = await getDoc(usernameRef);
      if (usernameSnapshot.exists()) {
        alert("Username already taken. Please choose another one.");
        return;
      }

      await setDoc(doc(db, "users", this.user.uid), {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        telegramHandle: this.telegramHandle,
        reviews: [],
      });

      await setDoc(usernameRef, {
        uid: this.user.uid,
      });

      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.register {
  text-align: center;
}

.register h1 {
  margin-bottom: 20px;
}

.register form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register input {
  margin-bottom: 10px;
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 20px;
}

.register button {
  margin-top: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 135px;
  cursor: pointer;
  margin-bottom: 10px;
}

.register button:hover {
  background-color: #d32f2f;
}
</style>

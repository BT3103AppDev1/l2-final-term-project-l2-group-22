<template>
  <button class="back-button" @click="goBack">Go Back</button>
</template>

<script>
export default {
  name: "GoBackButton",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.back-button {
  margin-top: 2em;
  margin-left: 0.5em;
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
  width: auto;
}

.back-button:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}

.back-button:focus {
  outline: none;
}
</style>

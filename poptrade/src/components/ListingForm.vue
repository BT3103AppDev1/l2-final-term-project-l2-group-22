<template>
    <form id="listingform" @submit.prevent="onSubmit">
      <div>
        <label for="collection">Collection:</label>
        <select id="collection" v-model="form.collection">
          <option disabled value="">Please select one</option>
          <!-- You would generate these options dynamically from your collections data -->
          <option>Marvel Collection</option>
          <!-- other options -->
        </select>
      </div>
  
      <div>
        <label for="item">Item:</label>
        <select id="item" v-model="form.item">
          <option disabled value="">Please select one</option>
          <!-- Options would be filtered based on the selected collection -->
          <option>Iron Man</option>
          <!-- other options -->
        </select>
      </div>
  
      <div>
        <label for="condition">Condition:</label>
        <select id="condition" v-model="form.condition">
          <option>As good as new</option>
          <!-- other options -->
        </select>
      </div>
  
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="form.description"></textarea>
      </div>
  
      <button type="submit">Upload now</button>
    </form>
</template>
  
<script>
  export default {
    data() {
      return {
        form: {
          collection: '',
          item: '',
          condition: '',
          description: ''
        }
      };
    },
    methods: {
      onSubmit() {
        // Here you would handle the form submission,
        // for example sending the data to your backend API
        console.log('Form submitted', this.form);
      }
    }
  };
</script>
  
<style scoped>
#listingform {
  max-width: 600px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

#listingform label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
}

#listingform select {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

#listingform textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 16px;
  height: 100px; /* Adjust the height as needed */
}

#listingform button {
  background-color: #e53e3e; /* A red tone, similar to the one in the image */
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#listingform button:hover {
  background-color: #c53030; /* A slightly darker shade for the hover state */
}

/* If you have additional elements that you need to style, like error messages or alerts, you can add them here. */

/* You may also want to include some global styles, for instance: */

body {
  font-family: 'Arial', sans-serif;
  background: #f7f7f7;
  color: #333;
  line-height: 1.6;
}

/* Styles for any container elements in which #listingform might be wrapped */
.container {
  padding: 20px;
}

</style>
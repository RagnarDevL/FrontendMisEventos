<script>

import { RouterView } from 'vue-router';
export default {
  name: 'MyComponent',
  components: {
    RouterView
  }
}
</script>

<template>
  <div>
    <img src="./assets/Logo.png" alt="logo" style="height: 340px; width: 800px; margin-top: -55px;">
    <RouterView/>
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

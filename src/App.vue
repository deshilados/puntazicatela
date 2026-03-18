<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
#app {
  min-height: 100vh;
}
.navbar.fixed-top {
  z-index: 1030;
}
</style>

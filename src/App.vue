<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
#app {
  min-height: 100vh;
  /* Compensar el `fixed-top` del navbar para que el contenido no quede tapado. */
  padding-top: 2rem;
}
.navbar.fixed-top {
  z-index: 1030;
}
</style>

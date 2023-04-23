<template>
  <img src="@/assets/Leto.svg" alt="" />
</template>

<style scoped>
img {
  width: 80px;
  margin: 30px;
  animation-name: spin;
  animation-duration: 2500ms;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier();
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

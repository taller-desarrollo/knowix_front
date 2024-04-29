<template>
  <div class="error-container">
    <div class="error-animation">
      <img src="@/assets/icon/404error.png" alt="Error 404" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
};
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.error-animation img {
  width: auto;
  height: 500px;
  transition: transform 1s ease;
  animation: bounce 2s infinite;
}

.error-animation img:hover {
  animation: rotate 1s forwards;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div>
    <Home />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize", "admin"],
});
</script>

<style lang="scss" scoped></style>

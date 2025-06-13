<template>
  <div>
    <Home />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize", "manager"],
});
</script>

<style lang="scss" scoped></style>

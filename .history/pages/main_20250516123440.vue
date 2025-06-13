<template>
  <div>
    <Home />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize"],
});
</script>

<style lang="scss" scoped></style>

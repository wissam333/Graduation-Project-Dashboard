<template>
  <div>
    <Home />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["authorize"],
});
</script>

<style lang="scss" scoped></style>

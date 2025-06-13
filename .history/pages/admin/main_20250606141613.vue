<template>
  <div>
    <Home />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize", "admin"],
});
definePageMeta({
  middleware: [""], // Uses admin.global.ts
});
</script>

<style lang="scss" scoped></style>

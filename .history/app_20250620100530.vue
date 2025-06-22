<template>
  <div @click="useOpenNav().value = false">
    <ElementsLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const {
  public: { api, apiBase },
} = useRuntimeConfig();


const { locale } = useI18n();

// Set the page title based on the locale
const titles = {
  en: "Restaurant",
  ar: "مطعم",
};

// Update the title dynamically
useHead({
  title: computed(() => titles[locale.value]),
});
</script>


<style lang="scss" scoped></style>

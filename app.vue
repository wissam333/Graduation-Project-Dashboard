<template>
  <div
    @click="
      useOpenNav().value = false;
      colseSidebar();
    "
  >
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

const mobile = ref(false);

const checkWindowSize = () => {
  mobile.value = window.matchMedia("(max-width: 1250px)").matches;
  if (mobile.value) {
    useSidebar().value = false;
  }
};

if (process.client) {
  onBeforeMount(() => {
    checkWindowSize();
  });

  onMounted(() => {
    window.addEventListener("resize", checkWindowSize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkWindowSize);
  });
}

const colseSidebar = () => {
  if (mobile.value) {
    useSidebar().value = false;
  }
};


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

<template>
  <div>
    <ClientOnly>
      <div :class="locale == 'ar' ? 'bodyAR' : 'bodyEN'">
        <SharedAdmin />
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>
<script setup>
const { locale } = useI18n();
useLang().value = locale;
</script>
<style lang="scss"></style>

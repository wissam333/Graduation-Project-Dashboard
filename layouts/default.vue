<template>
  <div>
    <ClientOnly>
      <div :class="locale == 'ar' ? 'bodyAR' : 'bodyEN'">
        <SharedAdminSidebar v-if="useUserInfo().value.role == '0'" />
        <SharedManagerSidebar v-if="useUserInfo().value.role == '2'" />
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

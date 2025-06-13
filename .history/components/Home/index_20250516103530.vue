<template>
  <div style="overflow: hidden" :class="$i18n.locale === 'en' ? 'en' : ''">
    <div class="mainImg" :class="useSidebar().value ? 'shrink' : ''">
      <img src="/logo/logo.png" alt="" />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.mainImg {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 150px;
  float: left;
  width: 100%;
  transition: all 0.3s linear;
  &.shrink {
    width: calc(100% - 260px); /* 100% + 260px(sidebar)*/
    @media (max-width: 600px) {
      width: 100%;
    }
  }
  @media (max-width: 600px) {
    padding-top: 150px;
  }
  img {
    margin-top: 40px;
    height: 60vh;
    object-fit: contain;
    @media (max-width: 991px) {
      height: auto;
      width: 90%;
    }
  }
}

.en {
  .mainImg {
    float: right !important;
  }
}
</style>

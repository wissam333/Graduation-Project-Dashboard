<template>
  <section id="wrapper" class="error-page">
    <div class="error-box">
      <div class="error-body text-center">
        <h1 class="mb-2 mb-dmd-3 mb-xl-5 gradient-text" style="">
          {{ error?.statusCode }}
        </h1>
        <h3 class="text-uppercase gradient-text" style="">{{ heading }}</h3>
        <p class="text-black m-t-30 m-b-30">{{ description }}</p>
        <button
          @click="handleError"
          class="btn background text-white px-15 btn-rounded waves-effect waves-light"
        >
          {{
            $i18n.locale === "ar" ? "الرجوع للصفحة الرئيسية" : "Back To Home"
          }}
        </button>
      </div>
      <footer class="footer text-center">
        Copyright @ {{ new Date().getFullYear() }}
        <span class="fw-bold gradient-text" style="">
          {{ $t("Baddar Furniture") }}
        </span>
      </footer>
    </div>
  </section>
</template>

<script setup>
const error = useError();
const i18e = useI18n();
// console.log('error : ', error.value.message, error.value.stack)
const heading = computed(() =>
  error.value?.statusCode == "404"
    ? i18e.t("page-not-found")
    : i18e.t("server-error")
);
const description = computed(() =>
  error.value?.statusCode === "404"
    ? i18e.t("could-not-find-page-msg")
    : i18e.t("error-occurred-msg")
);
const handleError = () => clearError({ redirect: "/" });
</script>

<style lang="scss" scoped>
.error-box {
  height: 100%;
  position: fixed;
  // background: url(/images/error-bg.jpg) center center no-repeat #fff !important;
  width: 100%;
}

.m-t-30 {
  margin-top: 30px !important;
}

.m-b-30 {
  margin-bottom: 30px !important;
}

.m-b-40 {
  margin-bottom: 40px !important;
}

.waves-effect {
  position: relative;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-rounded {
  border-radius: 60px;
}

.error-box .footer {
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  color: #58666e;
  left: 0;
  padding: 20px 30px;
  position: absolute;
  right: 0;
  background: #fff;
}

.error-body {
  padding-top: 5%;
}

.error-body h1 {
  font-size: fluid(100px, 210px);
  font-weight: 900;
  line-height: 210px;
}
button {
  background-color: $main !important;
}
</style>

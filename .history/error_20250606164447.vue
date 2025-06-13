<template>
  <section class="error-page">
    <div class="error-content">
      <div class="error-details text-center">
        <h1 class="error-code gradient-text">{{ error?.statusCode }}</h1>
        <h2 class="error-title">{{ heading }}</h2>
        <p class="error-description">{{ description }}</p>

        <!-- Debug details (dev only) -->
        <div v-if="isDev && error?.message" class="error-debug">
          <p class="debug-message">{{ error.message }}</p>
          <button @click="toggleStackTrace" class="debug-toggle">
            {{ showStackTrace ? "Hide Details" : "Show Details" }}
          </button>
          <pre v-if="showStackTrace" class="stack-trace">{{ error.stack }}</pre>
        </div>

        <button @click="handleError" class="home-button">
          {{
            $i18n.locale === "ar" ? "الرجوع للصفحة الرئيسية" : "Back to Home"
          }}
        </button>
      </div>
    </div>
    <footer class="error-footer">
      © {{ new Date().getFullYear() }}
      <span class="brand">{{ $t("TITLE") }}</span>
    </footer>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
const error = useError();
const i18n = useI18n();
const isDev = false;
const showStackTrace = ref(false);

const toggleStackTrace = () => {
  showStackTrace.value = !showStackTrace.value;
};

const heading = computed(() => {
  switch (error.value?.statusCode) {
    case 404:
      return i18n.t("page-not-found");
    case 403:
      return i18n.t("access-denied");
    case 500:
      return i18n.t("server-error");
    default:
      return i18n.t("something-went-wrong");
  }
});

const description = computed(() => {
  switch (error.value?.statusCode) {
    case 404:
      return i18n.t("could-not-find-page-msg");
    case 403:
      return i18n.t("you-dont-have-permission");
    case 500:
      return i18n.t("server-error-msg");
    default:
      return i18n.t("unexpected-error-msg");
  }
});

const handleError = () => clearError({ redirect: "/" });
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f9fa;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.error-content {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.error-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.error-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.home-button {
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.error-footer {
  margin-top: 3rem;
  padding: 1rem;
  color: #777;
  font-size: 0.9rem;

  .brand {
    font-weight: bold;
    color: #6a11cb;
  }
}

.error-debug {
  margin: 2rem 0;
  padding: 1rem;
  background: #f1f1f1;
  border-radius: 8px;
  text-align: left;

  .debug-message {
    color: #d32f2f;
    font-weight: bold;
  }

  .debug-toggle {
    background: #6a11cb;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    margin: 0.5rem 0;
    cursor: pointer;
  }

  .stack-trace {
    white-space: pre-wrap;
    font-family: monospace;
    color: #555;
    background: #fff;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
  }
}
</style>

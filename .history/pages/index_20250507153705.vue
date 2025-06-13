<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <NuxtIcon name="lock" class="login-icon" />
        <h1 class="login-title">{{ $t("Welcome Back") }}</h1>
        <p class="login-subtitle">{{ $t("Please enter your credentials") }}</p>
      </div>

      <VForm
        id=""
        class="w-auto"
        :validation-schema="schema"
        :initial-values="initialValues"
        v-slot="{ meta: formMeta }"
        @submit="handleSubmit"
      >
        <ElementsFormVTextInput
          astricts="true"
          border_color="6e31ee"
          color="00bcff"
          type="email"
          name="email"
          id="email"
          :label="$t('Email Address')"
          :placeholder="$t('Enter your email')"
        />

        <ElementsFormVTextInput
          astricts="true"
          border_color="6e31ee"
          color="00bcff"
          type="password"
          name="password"
          id="password"
          :label="$t('Password')"
          :placeholder="$t('Enter your password')"
          autocomplete="false"
          :activePasswordEye="true"
        />

        <div v-if="hasError" class="error-messages mb-3">
          <div class="alert alert-danger text-center">
            <ul class="list-unstyled mb-0">
              <li v-for="(error, index) in errorMessage" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>

        <div class="form-group">
          <button
            type="submit"
            value="Login"
            class="btn text-black text-uppercase specialbtn"
            :class="{ background: formMeta.valid }"
            :disabled="!formMeta.valid || isLoading"
          >
            <span class="" v-if="!isLoading">
              {{ $t("Sign In") }}
            </span>
            <span class="" v-else>{{ $t("Loading") }}</span>
          </button>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const { login } = useAuth();
const router = useRouter();

const handleLogin = async () => {
  try {
    if (await login(email.value, password.value)) {
      router.push("/dashboard");
    } else {
      // Show error toast or message
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>

<style lang="scss" scoped></style>

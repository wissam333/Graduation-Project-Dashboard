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
          color="333"
          type="username"
          name="username"
          id="username"
          :label="$t('Username')"
          :placeholder="$t('Username')"
        />

        <ElementsFormVTextInput
          astricts="true"
          border_color="6e31ee"
          color="333"
          type="password"
          name="password"
          id="password"
          :label="$t('Password')"
          :placeholder="$t('Enter your password')"
          autocomplete="false"
          :activePasswordEye="true"
        />

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
import { object, string, ref as yupRef } from "yup";
import { configure, validate } from "vee-validate";
// definePageMeta({
//   middleware: ["not-authorize"],
// });
const { locale } = useI18n();
const { $awn } = useNuxtApp();
const {
  public: { apiBase, api },
} = useRuntimeConfig();

const isLoading = ref(false);

// Handle Form Submit
const handleSubmit = async (values, actions) => {
  isLoading.value = true;
  const { data, error } = await useFetch(`${api.Login}`, {
    baseURL: apiBase,
    method: "POST",
    body: values,
  });

  isLoading.value = false;
  useAuth().value.isAuthenticated = true;
  useUserInfo().value = data.value.data;

  if (data.value.success) {
    $awn.success(
      locale.value === "ar"
        ? `اهلا بك ${values.username}`
        : `Welcome ${values.username}`
    );
  } else {
    $awn.alert(locale.value === "ar" ? "حدث خطأ" : "An error occurred");
  }
};
configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});
const schema = object({
  password: string()
    .required(
      locale.value === "ar" ? "كلمة المرور مطلوبة" : "Password is required"
    )
    .min(6),
  username: string().required(
    locale.value === "ar" ? "اسم المستخدم مطلوب" : "Username is required"
  ),
});
const initialValues = { username: "", password: "" };
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;

  .login-icon {
    font-size: 2.5rem;
    color: #6e31ee;
    margin-bottom: 1rem;
  }

  .login-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #212529;
  }

  .login-subtitle {
    color: #6c757d;
    font-size: 0.9rem;
  }
}

.error-messages {
  .alert-danger {
    background-color: #f8d7da;
    border-color: #f5c2c7;
    color: #842029;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
  }

  ul {
    padding-left: 0;
  }
}

.form-group {
  margin-top: 1.5rem;

  button.specialbtn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    font-size: 1rem;
    color: #fff;
    &:not([disabled]) {
      background-color: #6e31ee;
      color: white;

      &:hover {
        background-color: #5a25d6;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(110, 49, 238, 0.3);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(110, 49, 238, 0.3);
      }
    }

    &[disabled] {
      background-color: #e9ecef;
      color: #adb5bd;
      cursor: not-allowed;
    }
  }
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-header {
    .login-title {
      font-size: 1.5rem;
    }
  }
}

/* Animation for loading state */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

button.specialbtn span[disabled] {
  animation: pulse 1.5s infinite;
}
</style>

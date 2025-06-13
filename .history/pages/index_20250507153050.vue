<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <NuxtIcon name="lock" class="login-icon" />
        <h1 class="login-title">{{ $t("Welcome Back") }}</h1>
        <p class="login-subtitle">{{ $t("Please enter your credentials") }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">
            <NuxtIcon name="user" class="input-icon" />
            {{ $t("Email Address") }}
          </label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-control"
            :placeholder="$t('Enter your email')"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <NuxtIcon name="key" class="input-icon" />
            {{ $t("Password") }}
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control"
            :placeholder="$t('Enter your password')"
            required
          />
        </div>

        <div class="d-flex justify-content-between mb-4">
          <div class="form-check">
            <input
              v-model="rememberMe"
              type="checkbox"
              id="remember"
              class="form-check-input"
            />
          </div>
        </div>
      </form>
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

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $light;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;

  .login-icon {
    font-size: 2.5rem;
    color: $primary;
    margin-bottom: 1rem;
  }

  .login-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: $dark;
  }

  .login-subtitle {
    color: #6c757d;
    font-size: 0.9rem;
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;

    .form-label {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: $dark;

      .input-icon {
        margin-right: 0.5rem;
        color: $primary;
        font-size: 1.1rem;
      }
    }

    .form-control {
      padding: 0.75rem 1rem;
      border-radius: $border-radius;
      border: 1px solid #dee2e6;
      transition: all 0.3s;

      &:focus {
        border-color: $primary;
        box-shadow: 0 0 0 0.25rem rgba($primary, 0.25);
      }
    }
  }

  .forgot-password {
    color: $primary;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
      color: $primary; // Darker on hover
    }
  }

  .login-btn {
    padding: 0.75rem;
    border-radius: $border-radius;
    font-weight: 500;
    transition: all 0.3s;
    background-color: $primary;

    &:hover {
      background-color: $primary;
    }

    &:active {
      background-color: $primary; // Even darker
    }
  }

  .divider {
    display: flex;
    align-items: center;
    color: #6c757d;
    font-size: 0.875rem;

    &::before,
    &::after {
      content: "";
      flex: 1;
      border-bottom: 1px solid #dee2e6;
    }

    &::before {
      margin-right: 1rem;
    }

    &::after {
      margin-left: 1rem;
    }
  }

  .social-login {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .btn {
      border-radius: $border-radius;
      padding: 0.5rem;
      font-size: 0.875rem;
      border-color: #dee2e6;

      &:hover {
        background-color: white;
      }
    }
  }

  .signup-link {
    color: $primary;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
      color: $primary; // Darker on hover
    }
  }
}
</style>

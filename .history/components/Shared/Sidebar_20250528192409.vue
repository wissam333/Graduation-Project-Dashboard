<template>
  <div class="nav-container">
    <nav>
      <div class="left-section">
        <div class="logo">
          <img src="/logo/logo.png" alt="Logo" />
        </div>
        <div
          class="navbar-collapse-button"
          @click="useSidebar().value = !useSidebar().value"
        >
          <span :class="useSidebar().value ? 'open' : ''"></span>
          <span :class="useSidebar().value ? 'open' : ''"></span>
          <span :class="useSidebar().value ? 'open' : ''"></span>
        </div>
      </div>
      <div class="right-section">
        <!-- User section -->
        <div class="badge bg-success">{{ useUserInfo().value.username }}</div>
      </div>
    </nav>
  </div>

  <div class="sidebar box" :class="useSidebar().value ? '' : 'open'">
    <ul class="main-links">
      <!-- Dashboard link commented out -->

      <nuxt-link to="/restaurants">
        <li :class="activeLink == 'restaurants' ? 'sub-active' : ''">
          <Icon class="icon" name="fa6-solid:utensils" />
          <span>{{ $i18n.locale === "ar" ? "المطاعم" : "Restaurants" }}</span>
        </li>
      </nuxt-link>

      <nuxt-link to="/categories">
        <li :class="activeLink == 'Category' ? 'active' : ''">
          <Icon class="icon" name="fa6-solid:list" />
          <span>{{ $i18n.locale === "ar" ? "الفئات" : "Categories" }}</span>
        </li>
      </nuxt-link>

      <nuxt-link to="/users">
        <li :class="activeLink == 'Users' ? 'active' : ''">
          <Icon class="icon" name="fa6-solid:users" />
          <span>{{ $i18n.locale === "ar" ? "المستخدمين" : "Users" }}</span>
        </li>
      </nuxt-link>

      <nuxt-link to="/meals">
        <li :class="activeLink == 'Meals' ? 'active' : ''">
          <Icon class="icon" name="noto:pizza" />
          <span>
            {{ $i18n.locale === "ar" ? "قائمة الوجبات" : "Meals List" }}</span
          >
        </li>
      </nuxt-link>

      <a>
        <li class="d-flex align-items-end">
          <Icon class="icon" name="fa6-solid:language" />
          <ElementsLanguageToggle color="#333" />
        </li>
      </a>
    </ul>
  </div>
</template>

<script setup>
const {
  public: { api, apiBase },
} = useRuntimeConfig();

const activeLink = ref(useActiveLink().value);
const subActiveLink = ref(useSubActiveLink().value);
const productDropDown = ref(false);
const catDropDown = ref(false);
const orderDropDown = ref(false);
const pageDropDown = ref(false);
const mobile = ref(false);

const checkWindowSize = () => {
  mobile.value = window.matchMedia("(max-width: 1250px)").matches;
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
</script>

<style lang="scss" scoped>
.router-link-active {
  li {
    color: #fff !important;
    background: linear-gradient(118deg, #047751, #0dab77) !important;

    .icon {
      color: #fff !important;
    }
  }
}

.nav-container {
  position: fixed;
  z-index: 100;

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px 20px;
    width: 100vw;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);

    .left-section {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        width: 150px;
        height: 99px;
        margin: 2px;
        cursor: pointer;

        @media (max-width: 1250px) {
          width: 200px;
        }

        @media (max-width: 991px) {
          width: 130px;
          margin: 0px;
        }

        img {
          width: 100%;
        }
      }

      .navbar-collapse-button {
        margin-left: 20px;
        width: 34px;
        height: 34px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        cursor: pointer;

        @media (max-width: 600px) {
          width: 25px;
          height: 25px;
          margin-left: 8px;
        }

        span {
          display: block;
          background-color: #003d29;
          width: 100%;
          height: 4px;
          border-radius: 24px;
          transition: all 0.3s linear;

          &.open {
            &:nth-child(1) {
              transform: translateY(3px) rotate(-45deg);
              width: 16px;

              @media (max-width: 600px) {
                width: 10px;
                transform: translateY(4px) rotate(-45deg);
              }
            }

            &:nth-child(2) {
              transform: translateX(0px);
            }

            &:nth-child(3) {
              width: 16px;
              transform: translateY(-4px) rotate(45deg);

              @media (max-width: 600px) {
                transform: translateY(-4px) rotate(45deg);
                width: 10px;
              }
            }
          }
        }
      }
    }
  }
}

// Sidebar styles
.sidebar {
  background-color: #fff;
  width: 260px;
  position: fixed;
  overflow-y: auto;
  top: 105px;
  bottom: 0;
  inset-inline-start: 0;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
  transition: all 0.3s linear;
  z-index: 5;

  &.open {
    transform: translateX(-260px);
  }

  .main-links,
  .second-links {
    list-style: none;
    margin: 0;
    padding: 10px;

    li {
      font-weight: bold;
      background-color: #fff;
      color: #333;
      font-size: 16px;
      margin: 5px 0;
      padding: 10px 4px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s linear;

      &.active {
        color: #fff;
        background: linear-gradient(118deg, #047751, #0dab77);

        .icon {
          color: #fff;
        }
      }

      .icon {
        margin-inline-end: 10px;
        margin-inline-start: 10px;
        font-size: 20px;
        height: 20px;
        transition: all 0.3s linear;
        color: $main;

        &.caret {
          transform: rotate(90deg);

          &.active {
            transform: rotate(0deg);
          }
        }
      }
    }
  }

  .main-links {
    padding: 30px 10px !important;
  }

  .second-links {
    transition: all 0.3s linear;
    height: 0;
    overflow: hidden;
    padding: 0px 10px;

    &.four {
      transition: all 0.6s linear !important;
    }

    .router-link-active {
      .icon {
        color: #fff !important;
      }
    }

    li {
      font-weight: bold;

      &.sub-active {
        color: #fff;
        background: linear-gradient(118deg, #035d3f, #158862);
      }

      .icon {
        margin-inline-end: 10px;
        margin-inline-start: 10px;
        font-size: 20px;
        height: 20px;
        transition: all 0.3s linear;

        &.active {
          transform: rotate(90deg);
        }
      }
    }

    &.showLink {
      height: 110px;
      padding-top: 0px;

      &.four {
        height: 500px !important;
      }
    }
  }
}

.bodyAR {
  .navbar-collapse-button {
    margin-left: 0px !important;
    margin-right: 20px !important;

    span {
      &.open {
        &:nth-child(1) {
          transform: translateY(3px) rotate(45deg) !important;

          @media (max-width: 600px) {
            transform: translateY(4px) rotate(45deg) !important;
          }
        }

        &:nth-child(3) {
          transform: translateY(-4px) rotate(-45deg) !important;

          @media (max-width: 600px) {
            transform: translateY(-4px) rotate(-45deg) !important;
          }
        }
      }
    }
  }

  .sidebar {
    &.open {
      transform: translateX(260px) !important;
    }
  }
}

.right-section {
  .badge {
    position: relative;
  }
}
</style>

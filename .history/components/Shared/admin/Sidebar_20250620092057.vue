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
        <button class="btn btn-danger" @click="logout()">
          <Icon class="mx-1" name="mdi:logout" /> {{ $t("Logout") }}
        </button>
      </div>
    </nav>
  </div>

  <div class="sidebar box" :class="useSidebar().value ? '' : 'open'">
    <ul class="main-links">
      <nuxt-link to="/admin/main">
        <li :class="activeLink == 'dashboard' ? 'active' : ''">
          <Icon name="mdi:chart-areaspline" class="icon" />
          <span>{{ $i18n.locale === "ar" ? "لوحة التحكم" : "Dashboard" }}</span>
        </li>
      </nuxt-link>

      <nuxt-link to="/admin/restaurants">
        <li :class="activeLink == 'restaurants' ? 'active' : ''">
          <Icon class="icon" name="fa6-solid:utensils" />
          <span>{{ $i18n.locale === "ar" ? "المطاعم" : "Restaurants" }}</span>
        </li>
      </nuxt-link>

      <!-- Users Dropdown -->
      <li
        @click="toggleDropdown('users')"
        :class="[isUserLinkActive ? 'active' : '', 'dropdown-parent']"
      >
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <Icon class="icon" name="fa6-solid:users" />
            <span>{{
              $i18n.locale === "ar" ? "إدارة المستخدمين" : "User Management"
            }}</span>
          </div>
          <Icon
            class="icon caret"
            name="mdi:chevron-down"
            :class="openDropdowns.users ? 'open' : ''"
          />
        </div>

        <ul class="dropdown-menu" :class="openDropdowns.users ? 'show' : ''">
          <nuxt-link to="/admin/users/normal">
            <li :class="activeLink == 'Users' ? 'sub-active' : ''">
              <Icon class="icon" name="fa6-solid:user" />
              <span>{{ $i18n.locale === "ar" ? "المستخدمين" : "Users" }}</span>
            </li>
          </nuxt-link>

          <nuxt-link to="/admin/users/managers">
            <li :class="activeLink == 'Managers' ? 'sub-active' : ''">
              <Icon class="icon" name="fa6-solid:user-tie" />
              <span>{{ $i18n.locale === "ar" ? "المدراء" : "Managers" }}</span>
            </li>
          </nuxt-link>

          <nuxt-link to="/admin/users/drivers">
            <li :class="activeLink == 'Drivers' ? 'sub-active' : ''">
              <Icon class="icon" name="fa6-solid:user-gear" />
              <span>{{ $i18n.locale === "ar" ? "السائقين" : "Drivers" }}</span>
            </li>
          </nuxt-link>
        </ul>
      </li>

      <!-- Content Management Dropdown -->
      <li
        @click="toggleDropdown('content')"
        :class="[isContentLinkActive ? 'active' : '', 'dropdown-parent']"
      >
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <Icon class="icon" name="mdi:package-variant" />
            <span>{{
              $i18n.locale === "ar" ? "إدارة المحتوى" : "Content Management"
            }}</span>
          </div>
          <Icon
            class="icon caret"
            name="mdi:chevron-down"
            :class="openDropdowns.content ? 'open' : ''"
          />
        </div>

        <ul class="dropdown-menu" :class="openDropdowns.content ? 'show' : ''">
          <nuxt-link to="/admin/categories">
            <li :class="activeLink == 'Category' ? 'sub-active' : ''">
              <Icon class="icon" name="fa6-solid:list" />
              <span>{{ $i18n.locale === "ar" ? "الفئات" : "Categories" }}</span>
            </li>
          </nuxt-link>

          <nuxt-link to="/admin/meals">
            <li :class="activeLink == 'Meals' ? 'sub-active' : ''">
              <Icon class="icon" name="mdi:food" />
              <span>{{ $i18n.locale === "ar" ? "المنتجات" : "Products" }}</span>
            </li>
          </nuxt-link>

          <nuxt-link to="/admin/orders">
            <li :class="activeLink == 'Orders' ? 'sub-active' : ''">
              <Icon class="icon" name="mdi:cart" />
              <span>{{ $i18n.locale === "ar" ? "الطلبات" : "Orders" }}</span>
            </li>
          </nuxt-link>
        </ul>
      </li>

      <nuxt-link to="/admin/settings">
        <li :class="activeLink == 'Settings' ? 'active' : ''">
          <Icon class="icon" name="mdi:settings" />
          <span> {{ $i18n.locale === "ar" ? "الإعدادات" : "Settings" }}</span>
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
const mobile = ref(false);
const openDropdowns = ref({
  users: false,
  content: false,
});

const isUserLinkActive = computed(() => {
  return ["Users", "Managers", "Drivers"].includes(activeLink.value);
});

const isContentLinkActive = computed(() => {
  return ["Category", "Meals", "Orders"].includes(activeLink.value);
});

const toggleDropdown = (dropdown) => {
  openDropdowns.value[dropdown] = !openDropdowns.value[dropdown];
};

const checkWindowSize = () => {
  mobile.value = window.matchMedia("(max-width: 1250px)").matches;
};

// Auto close dropdowns when clicking outside (optional)
const handleClickOutside = (event) => {
  if (!event.target.closest(".dropdown-parent")) {
    openDropdowns.value.users = false;
    openDropdowns.value.content = false;
  }
};

if (process.client) {
  onBeforeMount(() => {
    checkWindowSize();
  });

  onMounted(() => {
    window.addEventListener("resize", checkWindowSize);
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkWindowSize);
    document.removeEventListener("click", handleClickOutside);
  });
}

// Watch route changes to update active link
watch(
  () => useRoute().path,
  (newPath) => {
    if (newPath.includes("/admin/users")) {
      if (newPath.includes("/normal")) activeLink.value = "Users";
      else if (newPath.includes("/managers")) activeLink.value = "Managers";
      else if (newPath.includes("/drivers")) activeLink.value = "Drivers";
    } else if (newPath.includes("/admin/categories")) {
      activeLink.value = "Category";
    } else if (newPath.includes("/admin/meals")) {
      activeLink.value = "Meals";
    } else if (newPath.includes("/admin/orders")) {
      activeLink.value = "Orders";
    } else if (newPath.includes("/admin/restaurants")) {
      activeLink.value = "restaurants";
    } else if (newPath.includes("/admin/main")) {
      activeLink.value = "dashboard";
    } else if (newPath.includes("/admin/settings")) {
      activeLink.value = "Settings";
    }
  },
  { immediate: true }
);

const { locale } = useI18n();
const { $awn } = useNuxtApp();
const logout = () => {
  useAuth().value.isAuthenticated = false;
  useUserInfo().value = null;
  localStorage.removeItem("userInfo");
  navigateTo("/");
  $awn.success(
    locale.value === "ar" ? "تم تسجيل الخروج" : "You are logged out"
  );
};
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
      }
    }
  }

  .main-links {
    padding: 30px 10px !important;
  }
}

/* Dropdown Styles */
.dropdown-parent {
  position: relative;
  cursor: pointer;

  .caret {
    transition: transform 0.3s ease;
    margin-left: auto;

    &.open {
      transform: rotate(180deg);
    }
  }

  .dropdown-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    background-color: #f8f9fa;
    border-radius: 0 0 6px 6px;
    margin-top: 5px;

    &.show {
      max-height: 500px;
      padding: 5px 0;
    }

    li {
      padding: 8px 15px 8px 40px;
      margin: 0;
      font-size: 14px;
      display: flex;
      align-items: center;
      border-radius: 4px;

      &:hover {
        background-color: #e9ecef;
      }

      &.sub-active {
        color: #fff;
        background: linear-gradient(118deg, #035d3f, #158862);

        .icon {
          color: #fff !important;
        }
      }

      .icon {
        font-size: 16px;
        margin-right: 10px;
      }
    }
  }
}

/* For RTL languages */
.bodyAR {
  .sidebar {
    &.open {
      transform: translateX(260px) !important;
    }
  }

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

  .dropdown-parent {
    .dropdown-menu {
      li {
        padding: 8px 40px 8px 15px;

        .icon {
          margin-right: 0;
          margin-left: 10px;
        }
      }
    }
  }
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  .badge {
    position: relative;
    padding: 14px;
    background: linear-gradient(to left, $main, $second);
  }
  .btn-danger {
    font-size: 14px;
    display: flex;
    align-items: center;
    @media (max-width: 991px) {
      font-size: 12px;
    }
  }
}
</style>

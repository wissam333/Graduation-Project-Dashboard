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
    <PanelMenu :model="items" class="custom-panelmenu" />
  </div>
</template>

<script setup>
import PanelMenu from "primevue/panelmenu";

const { locale } = useI18n();
const { $awn } = useNuxtApp();

const items = ref([
  {
    label: locale.value === "ar" ? "لوحة التحكم" : "Dashboard",
    icon: "mdi chart-areaspline",
    to: "/admin/main",
    command: () => {
      activeLink.value = "dashboard";
    },
  },
  {
    label: locale.value === "ar" ? "المطاعم" : "Restaurants",
    icon: "fa6-solid utensils",
    to: "/admin/restaurants",
    command: () => {
      activeLink.value = "restaurants";
    },
  },
  {
    label: locale.value === "ar" ? "الفئات" : "Categories",
    icon: "fa6-solid list",
    to: "/admin/categories",
    command: () => {
      activeLink.value = "Category";
    },
  },
  {
    label: locale.value === "ar" ? "المستخدمين" : "Users",
    icon: "fa6-solid users",
    items: [
      {
        label: locale.value === "ar" ? "المستخدمين العاديين" : "Normal Users",
        icon: "fa6-solid user",
        to: "/admin/users/normal",
        command: () => {
          activeLink.value = "Users";
        },
      },
      {
        label: locale.value === "ar" ? "المدراء" : "Managers",
        icon: "fa6-solid user-tie",
        to: "/admin/users/managers",
        command: () => {
          activeLink.value = "Managers";
        },
      },
      {
        label: locale.value === "ar" ? "السائقين" : "Drivers",
        icon: "fa6-solid user-helmet-safety",
        to: "/admin/users/drivers",
        command: () => {
          activeLink.value = "Drivers";
        },
      },
    ],
  },
  {
    label: locale.value === "ar" ? "قائمة الوجبات" : "Meals List",
    icon: "mdi chicken-leg",
    to: "/admin/meals",
    command: () => {
      activeLink.value = "Meals";
    },
  },
  {
    label: locale.value === "ar" ? "قائمة الطلبات" : "Orders List",
    icon: "mdi cart",
    to: "/admin/orders",
    command: () => {
      activeLink.value = "Orders";
    },
  },
  {
    label: locale.value === "ar" ? "الإعدادات" : "Settings",
    icon: "mdi settings",
    to: "/admin/settings",
    command: () => {
      activeLink.value = "Settings";
    },
  },
  {
    label: locale.value === "ar" ? "اللغة" : "Language",
    icon: "fa6-solid language",
    items: [
      {
        template: "languageToggle",
      },
    ],
  },
]);

const activeLink = ref(useActiveLink().value);
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

// Custom PanelMenu styles
:deep(.custom-panelmenu) {
  .p-panelmenu-header {
    a {
      padding: 0.75rem 1.25rem;
      border-radius: 6px;
      margin: 5px 0;

      .p-panelmenu-icon {
        margin-right: 0.5rem;
      }

      &:focus {
        box-shadow: none;
      }
    }

    &.p-highlight {
      > a {
        background: linear-gradient(118deg, #047751, #0dab77);
        color: white;

        .p-panelmenu-icon {
          color: white;
        }
      }
    }
  }

  .p-panelmenu-content {
    .p-menuitem {
      .p-menuitem-link {
        padding: 0.75rem 1.25rem 0.75rem 2.5rem;
        border-radius: 6px;

        &:focus {
          box-shadow: none;
        }

        .p-menuitem-icon {
          margin-right: 0.5rem;
        }
      }

      &.p-highlight {
        > .p-menuitem-link {
          background: linear-gradient(118deg, #035d3f, #158862);
          color: white;

          .p-menuitem-icon {
            color: white;
          }
        }
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
:deep(.p-panelmenu) {
  .p-panelmenu-panel {
    background-color: #fff !important;
    border: 1px solid #eee !important;
    padding: 0 !important;

    &:hover {
      background: linear-gradient(to left, $main, $second);

      .p-panelmenu-header-link,
      .p-panelmenu-header-icon {
        color: #fff !important;
      }
    }
    .p-panelmenu-header-content {
      &:hover {
        background: none !important;
      }
    }
    .p-panelmenu-content {
      background-color: $main !important;
      .p-panelmenu-submenu {
        padding: 0 !important;
      }
    }
    .p-panelmenu-header-link {
      color: #333 !important;
    }
  }
}
</style>

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

  <div class="sidebar box" :class="useSidebar().value ? 'open' : ''">
    <PanelMenu
      :model="items"
      class="custom-panelmenu"
      v-model:expandedKeys="expandedKeys"
    />
  </div>
</template>

<script setup>
import PanelMenu from "primevue/panelmenu";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const { $awn } = useNuxtApp();
const expandedKeys = ref({});

const items = ref([
  {
    key: "dashboard",
    label: locale.value === "ar" ? "لوحة التحكم" : "Dashboard",
    icon: "pi pi-chart-bar",
    to: "/admin/main",
    command: () => {
      activeLink.value = "dashboard";
    },
  },
  {
    key: "restaurants",
    label: locale.value === "ar" ? "المطاعم" : "Restaurants",
    icon: "pi pi-building",
    to: "/admin/restaurants",
    command: () => {
      activeLink.value = "restaurants";
    },
  },
  {
    key: "categories",
    label: locale.value === "ar" ? "الفئات" : "Categories",
    icon: "pi pi-list",
    to: "/admin/categories",
    command: () => {
      activeLink.value = "categories";
    },
  },
  {
    key: "users",
    label: locale.value === "ar" ? "المستخدمين" : "Users",
    icon: "pi pi-users",
    items: [
      {
        key: "normal_users",
        label: locale.value === "ar" ? "المستخدمين العاديين" : "Normal Users",
        icon: "pi pi-user",
        to: "/admin/users/normal",
        command: () => {
          activeLink.value = "normal_users";
        },
      },
      {
        key: "managers",
        label: locale.value === "ar" ? "المدراء" : "Managers",
        icon: "pi pi-user-plus",
        to: "/admin/users/managers",
        command: () => {
          activeLink.value = "managers";
        },
      },
      {
        key: "drivers",
        label: locale.value === "ar" ? "السائقين" : "Drivers",
        icon: "pi pi-user-edit",
        to: "/admin/users/drivers",
        command: () => {
          activeLink.value = "drivers";
        },
      },
    ],
  },
  {
    key: "meals",
    label: locale.value === "ar" ? "قائمة الوجبات" : "Meals List",
    icon: "pi pi-apple",
    to: "/admin/meals",
    command: () => {
      activeLink.value = "meals";
    },
  },
  {
    key: "orders",
    label: locale.value === "ar" ? "قائمة الطلبات" : "Orders List",
    icon: "pi pi-shopping-cart",
    to: "/admin/orders",
    command: () => {
      activeLink.value = "orders";
    },
  },
  {
    key: "settings",
    label: locale.value === "ar" ? "الإعدادات" : "Settings",
    icon: "pi pi-cog",
    to: "/admin/settings",
    command: () => {
      activeLink.value = "settings";
    },
  },
  {
    key: "language",
    label: locale.value === "ar" ? "اللغة" : "Language",
    icon: "pi pi-globe",
    items: [
      {
        template: "languageToggle",
      },
    ],
  },
]);

const activeLink = ref("dashboard"); // Set default active link

// Auto-expand the parent menu when child is active
watch(activeLink, (newVal) => {
  const parentKey = findParentKey(items.value, newVal);
  if (parentKey) {
    expandedKeys.value = { ...expandedKeys.value, [parentKey]: true };
  }
});

function findParentKey(items, key) {
  for (const item of items) {
    if (item.key === key) return null;
    if (item.items) {
      const found = item.items.some((child) => child.key === key);
      if (found) return item.key;
      const nestedParent = findParentKey(item.items, key);
      if (nestedParent) return item.key;
    }
  }
  return null;
}

const mobile = ref(false);

const checkWindowSize = () => {
  mobile.value = window.matchMedia("(max-width: 1250px)").matches;
  if (mobile.value) {
    useSidebar().value = false;
  }
};

if (process.client) {
  onBeforeMount(() => {
    checkWindowSize();
  });

  onMounted(() => {
    window.addEventListener("resize", checkWindowSize);
    // Initialize expanded keys based on current route
    const currentRoute = useRoute().path;
    const activeItem = findActiveItem(items.value, currentRoute);
    if (activeItem) {
      activeLink.value = activeItem.key;
      const parentKey = findParentKey(items.value, activeItem.key);
      if (parentKey) {
        expandedKeys.value = { ...expandedKeys.value, [parentKey]: true };
      }
    }
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkWindowSize);
  });
}

function findActiveItem(items, path) {
  for (const item of items) {
    if (item.to === path) return item;
    if (item.items) {
      const found = findActiveItem(item.items, path);
      if (found) return found;
    }
  }
  return null;
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
  top: 122px;
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
    .p-panelmenu-header-link {
      margin: 0 !important;
    }
    .p-panelmenu-header-active {
      background: linear-gradient(to left, $main, $second);
      .p-panelmenu-header-link,
      .p-panelmenu-header-icon {
        color: #fff !important;
      }
    }
    .p-panelmenu-content {
      background-color: #eee !important;
      color: #333 !important;
      .p-panelmenu-submenu {
        padding: 0 !important;
        .p-panelmenu-item-link {
          padding: 12px 20px !important;
          height: auto !important;
          color: #333 !important;
        }
      }
    }
    .p-panelmenu-header-link {
      color: #333 !important;
    }
  }
}
</style>

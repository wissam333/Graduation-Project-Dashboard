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

  <div class="sidebar box">
    <PanelMenu
      :model="items"
      class="custom-panelmenu"
      :expandedKeys="expandedKeys"
      @panel-open="onPanelOpen"
    >
      <template #item="{ item, hasSubmenu }">
        <div class="filterbox pointer d-flex justify-content-between">
          <nuxt-link
            :to="item.to"
            class="w-full"
            @click="setSelectedItem(item, hasSubmenu)"
          >
            <div
              class="d-flex align-items-center"
              :class="selectedId === item.key ? 'active' : ''"
            >
              <Icon
                :name="item.icon"
                class="icon mx-2"
                :class="selectedId === item.key ? 'text-white' : ''"
              />
              <span>{{
                locale === "ar" ? item.labelAr || item.label : item.label
              }}</span>
            </div>
          </nuxt-link>
          <span
            class="drop-down"
            v-if="hasSubmenu"
            :class="locale === 'ar' ? 'ar' : ''"
          >
            <span>
              <Icon
                :name="
                  locale === 'ar'
                    ? 'fa6-solid:chevron-left'
                    : 'fa6-solid:chevron-right'
                "
                class="mx-2 icon"
              />
            </span>
          </span>
        </div>
      </template>
    </PanelMenu>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const { $awn } = useNuxtApp();
const selectedId = ref("dashboard");
const expandedKeys = ref({});

const items = ref([
  {
    key: "dashboard",
    label: "Dashboard",
    labelAr: "لوحة التحكم",
    icon: "mdi:chart-areaspline",
    to: "/admin/main",
  },
  {
    key: "restaurants",
    label: "Restaurants",
    labelAr: "المطاعم",
    icon: "fa6-solid:utensils",
    to: "/admin/restaurants",
  },
  {
    key: "categories",
    label: "Categories",
    labelAr: "الفئات",
    icon: "fa6-solid:list",
    to: "/admin/categories",
  },
  {
    key: "users",
    label: "Users",
    labelAr: "المستخدمين",
    icon: "fa6-solid:users",
    items: [
      {
        key: "normal_users",
        label: "Normal Users",
        labelAr: "المستخدمين العاديين",
        icon: "fa6-solid:user",
        to: "/admin/users/normal",
      },
      {
        key: "managers",
        label: "Managers",
        labelAr: "المدراء",
        icon: "fa6-solid:user-tie",
        to: "/admin/users/managers",
      },
      {
        key: "drivers",
        label: "Drivers",
        labelAr: "السائقين",
        icon: "fa6-solid:user-helmet-safety",
        to: "/admin/users/drivers",
      },
    ],
  },
  {
    key: "meals",
    label: "Meals List",
    labelAr: "قائمة الوجبات",
    icon: "mdi:chicken-leg",
    to: "/admin/meals",
  },
  {
    key: "orders",
    label: "Orders List",
    labelAr: "قائمة الطلبات",
    icon: "mdi:cart",
    to: "/admin/orders",
  },
  {
    key: "settings",
    label: "Settings",
    labelAr: "الإعدادات",
    icon: "mdi:settings",
    to: "/admin/settings",
  },
]);

const setSelectedItem = (item, hasSubmenu) => {
  if (!hasSubmenu) {
    selectedId.value = item.key;
  }
};

const onPanelOpen = (event) => {
  expandedKeys.value = { ...expandedKeys.value, [event.key]: true };
};

// Initialize active link based on route
const route = useRoute();
onMounted(() => {
  const currentPath = route.path;
  const activeItem = findActiveItem(items.value, currentPath);
  if (activeItem) {
    selectedId.value = activeItem.key;
    const parentKey = findParentKey(items.value, activeItem.key);
    if (parentKey) {
      expandedKeys.value = { ...expandedKeys.value, [parentKey]: true };
    }
  }
});

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
  top: 125px;
  bottom: 0;
  inset-inline-start: 0;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
  transition: all 0.3s linear;
  z-index: 5;

  &.open {
    transform: translateX(-260px);
  }

  :deep(.p-panelmenu) {
    .p-panelmenu-panel {
      padding: 0 !important;
      border-radius: 0 !important;
    }
    .p-panelmenu-header-link {
      padding: 0;
      background: transparent;
      border: none;

      &:focus {
        box-shadow: none;
      }
    }

    .p-menuitem-link {
      padding: 0;
      background: transparent;

      &:focus {
        box-shadow: none;
      }
    }

    .filterbox {
      font-weight: bold;
      background-color: #fff;
      color: #333;
      font-size: 16px;
      padding: 10px 4px;
      cursor: pointer;
      transition: all 0.3s linear;

      &.active,
      .active {
        color: #fff;
        background: linear-gradient(118deg, #047751, #0dab77);

        .icon {
          color: #fff !important;
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

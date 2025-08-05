<template>
  <div class="nav-container">
    <nav>
      <div class="left-section">
        <div class="logo">
          <img src="/logo/logo.png" alt="Logo" />
        </div>
        <div
          class="navbar-collapse-button"
          @click.stop="useSidebar().value = !useSidebar().value"
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

  <div
    class="sidebar box"
    :class="useSidebar().value ? '' : 'open'"
    @click.stop="useSidebar().value = true"
  >
    <PanelMenu
      :model="items"
      class="custom-panelmenu"
      @panel-open="onPanelOpen"
    >
      <template #item="{ item, hasSubmenu, active }">
        <nuxt-link
          class="filterbox pointer d-flex justify-content-between"
          :class="[active ? 'active' : '', hasSubmenu ? 'hasSubmenu' : '']"
          :to="item.to"
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
        </nuxt-link>
      </template>
    </PanelMenu>
    <li class="d-flex align-items-center lang">
      <Icon class="icon" name="fa6-solid:language" />
      <ElementsLanguageToggle color="#333" />
    </li>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const { $awn } = useNuxtApp();
const selectedId = ref("dashboard");

const items = ref([
  {
    key: "orders",
    label: "Orders",
    labelAr: "الطلبات",
    icon: "mdi:package",
    to: "/driver/orders",
  },
  {
    key: "dues",
    label: "Dues",
    labelAr: "المستحقات",
    icon: "mdi:coin",
    to: "/driver/dues",
  },
]);

const setSelectedItem = (item, hasSubmenu) => {
  if (!hasSubmenu) {
    selectedId.value = item.key;
  }
};

const onPanelOpen = (event) => {};

// Initialize active link based on route
const route = useRoute();
onMounted(() => {
  const currentPath = route.path;
  const activeItem = findActiveItem(items.value, currentPath);
  if (activeItem) {
    selectedId.value = activeItem.key;
    const parentKey = findParentKey(items.value, activeItem.key);
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
      border: 1px solid #eee !important;
    }
    .p-panelmenu-submenu {
      padding: 0 !important;
      li {
        border-top: 1px solid #eee !important;
        a {
          font-size: 14px !important;
        }
      }
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

      &.active {
        color: #fff;
        background: linear-gradient(118deg, #047751, #0dab77);

        .icon {
          color: #fff !important;
        }
      }
      &.hasSubmenu.active {
        color: #333 !important;
        background: #fff !important;
        .icon {
          color: #333 !important;
        }
      }

      .icon {
        margin-inline-end: 10px;
        margin-inline-start: 10px;
        font-size: 18px;
        height: 18px;
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
.drop-down {
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    user-select: none;
    transition: all 0.3s ease-in-out;
    color: #fff;
  }
}
:deep(.p-panelmenu-header-active) {
  .drop-down {
    span {
      transform: rotate(45deg);
    }
  }
}
.lang {
  padding: 10px 4px !important;
  .icon {
    margin: 0px 8px;
    color: $main;
  }
}
</style>

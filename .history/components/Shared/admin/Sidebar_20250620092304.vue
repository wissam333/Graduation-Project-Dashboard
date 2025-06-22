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

  <div class="sidebar box" :class="sidebarOpen ? '' : 'open'">
    <Menu :model="menuItems" class="p-menu-custom" />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Menu from "primevue/menu";

const route = useRoute();

// Menu items structure
const menuItems = ref([
  {
    label: "Dashboard",
    icon: "pi pi-chart-bar",
    to: "/admin/main",
    command: () => setActive("dashboard"),
  },
  {
    label: "Restaurants",
    icon: "pi pi-utensils",
    to: "/admin/restaurants",
    command: () => setActive("restaurants"),
  },
  {
    label: "User Management",
    icon: "pi pi-users",
    items: [
      {
        label: "Users",
        icon: "pi pi-user",
        to: "/admin/users/normal",
        command: () => setActive("Users"),
      },
      {
        label: "Managers",
        icon: "pi pi-user-plus",
        to: "/admin/users/managers",
        command: () => setActive("Managers"),
      },
      {
        label: "Drivers",
        icon: "pi pi-car",
        to: "/admin/users/drivers",
        command: () => setActive("Drivers"),
      },
    ],
  },
  {
    label: "Content Management",
    icon: "pi pi-box",
    items: [
      {
        label: "Categories",
        icon: "pi pi-list",
        to: "/admin/categories",
        command: () => setActive("Category"),
      },
      {
        label: "Products",
        icon: "pi pi-shopping-bag",
        to: "/admin/meals",
        command: () => setActive("Meals"),
      },
      {
        label: "Orders",
        icon: "pi pi-shopping-cart",
        to: "/admin/orders",
        command: () => setActive("Orders"),
      },
    ],
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    to: "/admin/settings",
    command: () => setActive("Settings"),
  },
  {
    label: "Language",
    icon: "pi pi-language",
    component: ElementsLanguageToggle,
  },
]);

// Active state management
const activeItem = ref("dashboard");

const setActive = (item) => {
  activeItem.value = item;
};

// Check active route on navigation
watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes("/admin/users/normal")) activeItem.value = "Users";
    else if (newPath.includes("/admin/users/managers"))
      activeItem.value = "Managers";
    else if (newPath.includes("/admin/users/drivers"))
      activeItem.value = "Drivers";
    else if (newPath.includes("/admin/categories"))
      activeItem.value = "Category";
    else if (newPath.includes("/admin/meals")) activeItem.value = "Meals";
    else if (newPath.includes("/admin/orders")) activeItem.value = "Orders";
    else if (newPath.includes("/admin/restaurants"))
      activeItem.value = "restaurants";
    else if (newPath.includes("/admin/main")) activeItem.value = "dashboard";
    else if (newPath.includes("/admin/settings")) activeItem.value = "Settings";
  },
  { immediate: true }
);

// Rest of your script remains the same
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

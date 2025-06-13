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
         <div>{{ useUserInfo().value.name }}</div>
      </div>
    </nav>
  </div>

  <div class="sidebar box" :class="useSidebar().value ? '' : 'open'">
    <ul class="main-links">
      <!-- Dashboard link commented out -->

      <li
        @click="productDropDown = !productDropDown"
        class="d-flex align-items-center justify-content-between"
      >
        <div>
          <Icon class="icon" name="fa6-solid:seedling" />
          <span>{{ $i18n.locale === "ar" ? "النباتات" : "Plants" }}</span>
        </div>
        <Icon
          name="fa6-solid:caret-down"
          class="caret icon"
          :class="productDropDown ? 'active' : ''"
        />
      </li>

      <!-- Plants dropdown -->
      <ul class="second-links" :class="productDropDown ? 'showLink' : ''">
        <nuxt-link to="/admin/AddProduct">
          <li :class="subActiveLink == 'AddProducts' ? 'sub-active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "إضافة نبات" : "Add Plant"
            }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/ListProduct">
          <li :class="subActiveLink == 'ListProducts' ? 'sub-active' : ''">
            <span>{{ $i18n.locale === "ar" ? "النباتات" : "Plants" }}</span>
          </li>
        </nuxt-link>
      </ul>

      <li
        @click="catDropDown = !catDropDown"
        class="d-flex align-items-center justify-content-between"
      >
        <div>
          <Icon class="icon" name="fa6-solid:list" />
          <span>{{ $i18n.locale === "ar" ? "الفئات" : "Categories" }}</span>
        </div>
        <Icon
          name="fa6-solid:caret-down"
          class="caret icon"
          :class="catDropDown ? 'active' : ''"
        />
      </li>

      <!-- Categories dropdown -->
      <ul class="second-links" :class="catDropDown ? 'showLink' : ''">
        <nuxt-link to="/admin/Category">
          <li :class="activeLink == 'Category' ? 'active' : ''">
            <span>{{ $i18n.locale === "ar" ? "الفئات" : "Categories" }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/SubCategory">
          <li :class="activeLink == 'SubCategory' ? 'active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "الفئات الفرعية" : "Sub Categories"
            }}</span>
          </li>
        </nuxt-link>
      </ul>

      <nuxt-link to="/users">
        <li :class="activeLink == 'Users' ? 'active' : ''">
          <Icon class="icon" name="fa6-solid:users" />
          <span>{{ $i18n.locale === "ar" ? "المستخدمين" : "Users" }}</span>
        </li>
      </nuxt-link>

      <li
        @click="orderDropDown = !orderDropDown"
        class="d-flex align-items-center justify-content-between"
      >
        <div>
          <Icon class="icon" name="fa6-solid:truck" width="20" />
          <span>{{ $i18n.locale === "ar" ? "الطلبيات" : "Orders" }}</span>
        </div>
        <Icon
          name="fa6-solid:caret-down"
          class="caret icon"
          :class="orderDropDown ? 'active' : ''"
        />
      </li>

      <!-- Orders dropdown -->
      <ul class="second-links" :class="orderDropDown ? 'showLink' : ''">
        <nuxt-link to="/admin/Orders">
          <li :class="activeLink == 'Orders' ? 'active' : ''">
            <span>{{ $i18n.locale === "ar" ? "الطلبيات" : "Orders" }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/Locations">
          <li :class="activeLink == 'Orders' ? 'active' : ''">
            <span>{{ $i18n.locale === "ar" ? "التوصيل" : "Delivery" }}</span>
          </li>
        </nuxt-link>
      </ul>

      <li
        @click="pageDropDown = !pageDropDown"
        class="d-flex align-items-center justify-content-between"
      >
        <div>
          <Icon class="icon" name="fa6-solid:globe" />
          <span>{{
            $i18n.locale === "ar" ? "إدارة الموقع" : "Site Management"
          }}</span>
        </div>
        <Icon
          name="fa6-solid:caret-down"
          class="caret icon"
          :class="pageDropDown ? 'active' : ''"
        />
      </li>

      <!-- Site Management dropdown -->
      <ul class="second-links four" :class="pageDropDown ? 'showLink' : ''">
        <nuxt-link to="/admin/Website">
          <li :class="activeLink == 'Orders' ? 'active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "الصفحة الرئيسية" : "Home Page"
            }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/About">
          <li :class="activeLink == 'About' ? 'active' : ''">
            <span>{{ $i18n.locale === "ar" ? "من نحن" : "About Us" }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/ContactInfo">
          <li :class="activeLink == 'ContactInfo' ? 'active' : ''">
            <span>{{ $i18n.locale === "ar" ? "التواصل" : "Contact" }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/PrivacyPolicy">
          <li :class="activeLink == 'Privacy' ? 'active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"
            }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/Support">
          <li :class="activeLink == 'Support' ? 'active' : ''">
            <span>{{ $i18n.locale === "ar" ? "الدعم" : "Support" }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/Press">
          <li :class="activeLink == 'Press' ? 'active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "الصحافة النباتية" : "Plant Press"
            }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/Care">
          <li :class="activeLink == 'Care' ? 'active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "العناية بالنبات" : "Plant Care"
            }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/Talk">
          <li :class="activeLink == 'Talk' ? 'active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "الحديث عن النبات" : "Plant Talk"
            }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/Social">
          <li :class="activeLink == 'Social' ? 'active' : ''">
            <span>{{
              $i18n.locale === "ar" ? "وسائل التواصل الاجتماعي" : "Social Media"
            }}</span>
          </li>
        </nuxt-link>

        <nuxt-link to="/admin/Logo">
          <li :class="activeLink == 'Logo' ? 'active' : ''">
            <span>{{ $i18n.locale === "ar" ? "الشعار" : "Logo" }}</span>
          </li>
        </nuxt-link>
      </ul>

      <nuxt-link to="/admin/Messages">
        <li :class="activeLink == 'Messages' ? 'active' : ''">
          <Icon class="icon" name="fa6-solid:envelope" />
          <span>{{ $i18n.locale === "ar" ? "الرسائل" : "Messages" }}</span>
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
</style>

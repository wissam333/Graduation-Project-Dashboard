<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة الزبائن" : "Customers List" }}
        </h4>
      </div>
      <div class="options">
        <div class="d-flex flex-column-reverse mx-2">
          <input
            v-model="searchText"
            id="price"
            type="text"
            required
            :placeholder="$i18n.locale === 'ar' ? 'ابحث' : 'Search'"
          />
        </div>
        <div class="reload btn btn-success mx-2" @click="visible = true">
          <font-awesome :icon="['fas', 'plus']" />
          {{ $i18n.locale === "ar" ? "إضافة" : "Add" }}
        </div>
        <div class="reload btn btn-success" @click="getCustomers()">
          <font-awesome :icon="['fas', 'rotate-right']" />
          {{ $i18n.locale === "ar" ? "إعادة تحميل" : "Reload" }}
        </div>
        <div class="reload btn btn-success mx-1" @click="exportToExcel">
          <!-- <font-awesome :icon="['fas', 'rotate-right']" /> -->
          {{ $i18n.locale === "ar" ? "تصدير" : "Export" }}
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <div class="loading" v-if="loading">
        <img src="/loading/loadingnew2.svg" alt="" />
      </div>
      <div v-else class="product-tabel">
        <table>
          <thead>
            <tr>
              <th>{{ $i18n.locale === "ar" ? "الاسم" : "Name" }}</th>
              <th>
                {{ $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </th>

              <th>{{ $i18n.locale === "ar" ? "تعديل" : "Edit" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="rows"
              v-for="product in filteredArray"
              :key="product.id"
              v-show="!product.is_admin"
            >
              <td class="d-flex align-items-center">
                <div class="product-img">
                  <img
                    v-if="product.thumbnail"
                    :src="product.thumbnail"
                    alt=""
                  />
                  <img
                    v-else
                    src="/photos/2619fafceaedd791a39fd2a196ec0641.png"
                    alt=""
                  />
                </div>
                <div class="product-info d-flex flex-column align-items-start">
                  <h5>{{ product.firstName }}</h5>
                  <h5>{{ product.lastName }}</h5>
                </div>
              </td>
              <td class="fw-bold">{{ product.email }}</td>
              <td>
                <p class="badge rounded-pill bg-primary me-1">
                  {{ product.created_at?.slice(0, 10) }}
                </p>
              </td>

              <td>
                <span
                  class="delete"
                  @click="
                    deleteModal = true;
                    deleteCustomer = product;
                  "
                >
                  <font-awesome :icon="['fas', 'trash']" />
                </span>
                <!-- <nuxt-link :to="`/EditProduct/${product.id}`" class="edit-link">
                  <span class="edit">
                    <font-awesome :icon="['fas', 'pen-to-square']" />
                  </span>
                </nuxt-link> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- delete modal -->
  <ElementsAppModal :isOpen="deleteModal" @updateIsOpen="updateDeleteModal">
    <template #header>
      <h4>{{ $i18n.locale === "ar" ? "تأكيد الحذف" : "Confirm Delete" }}</h4>
    </template>
    <template #content>
      <p>
        {{
          $i18n.locale === "ar"
            ? "هل أنت متأكد من أنك تريد حذف"
            : "Are You Sure You Want To Delete"
        }}
        "{{ deleteCustomer.firstName + " " + deleteCustomer.lastName }}"{{
          $i18n.locale === "ar" ? "؟" : "?"
        }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="DeleteCat()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <Dialog v-model:visible="visible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <div class="dialog" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
        <h5 class="fw-bold mb-5">
          {{ $i18n.locale === "ar" ? "إضافة زبون" : "Add Customer" }}
        </h5>
        <div class="content">
          <div>
            <div class="d-flex flex-column-reverse mb-3">
              <input
                v-model="firstName"
                id="firstName"
                type="text"
                autocomplete="off"
                :placeholder="
                  $i18n.locale === 'ar' ? 'الاسم الاول' : 'First Name'
                "
                required
              />
              <label for="firstName"
                >{{
                  $i18n.locale === "ar" ? "الاسم الاول" : "First Name"
                }}
                *</label
              >
            </div>

            <div class="d-flex flex-column-reverse mb-3">
              <input
                v-model="lastName"
                id="lastName"
                type="text"
                autocomplete="off"
                :placeholder="
                  $i18n.locale === 'ar' ? 'الاسم الاخير' : 'Last Name'
                "
                title="Enter only letters and spaces"
                required
              />
              <label for="lastName"
                >{{
                  $i18n.locale === "ar" ? "الاسم الاخير" : "Last Name"
                }}
                *</label
              >
            </div>

            <div class="d-flex flex-column-reverse mb-3">
              <input
                v-model="email"
                id="email"
                type="email"
                autocomplete="off"
                :placeholder="
                  $i18n.locale === 'ar' ? 'البريد الإلكتروني' : 'Email'
                "
                title="Enter only letters and spaces"
                required
              />
              <label for="email"
                >{{
                  $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email"
                }}
                *</label
              >
            </div>
          </div>
        </div>
        <div class="mt-5 d-flex w-100 justify-content-end">
          <button class="btn btn-secondary" @click="closeCallback">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success mx-2" @click="addCustomer()" autofocus>
            {{ $t("Add") }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

let visible = ref(false);
// delete modal
let deleteCustomer = ref();
let deleteModal = ref(false);
const updateDeleteModal = (value) => {
  deleteModal.value = value;
};

let searchText = ref("");
const filteredArray = computed(() => {
  return customers.value?.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

let loading = ref(false);
let customers = ref();
const getCustomers = async () => {
  loading.value = true;
  if (locale.value === "ar") {
    const { data: customersData, pending } = await useFetch(
      `${api.GetAllCustomers}`,
      {
        credentials: "include",
        baseURL: apiBase,
        headers: {
          "accept-language": "ar",
        },
      }
    );
    watchEffect(() => {
      if (process.client) {
        if (customersData.value) {
          customers.value = customersData.value;
        }
      }
    });
  } else {
    const { data: customersData, pending } = await useFetch(
      `${api.GetAllCustomers}`,
      {
        credentials: "include",
        baseURL: apiBase,
        headers: {
          "accept-language": "en",
        },
      }
    );
    watchEffect(() => {
      if (process.client) {
        if (customersData.value) {
          customers.value = customersData.value;
        }
      }
    });
  }
  loading.value = false;
};
// init get product
getCustomers();

const DeleteCat = async () => {
  const { RemovePlant, error } = await useFetch(
    `${api.DeleteCustomer}/${deleteCustomer.value.id}`,
    {
      credentials: "include",
      baseURL: apiBase,
      method: "DELETE",
    }
  );

  // re get the product
  getCustomers();

  deleteModal.value = false;
  //message
  locale.value === "en"
    ? $awn.success("Customer Deleted Successfully", {
        durations: { global: 5000 },
      })
    : $awn.success("تم حذف الزبون بنجاح", {
        durations: { global: 5000 },
      });
};

let email = ref();
let firstName = ref();
let lastName = ref();
const addCustomer = async () => {
  const { data } = await useFetch(api.CreateCustomer, {
    baseURL: apiBase,
    credentials: "include",
    method: "POST",
    body: {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    },
  });

  firstName.value = "";
  lastName.value = "";
  email.value = "";
  visible.value = false;

  getCustomers();

  //message
  locale.value === "en"
    ? $awn.success("Added Successfully", {
        durations: { global: 5000 },
      })
    : $awn.success("تم الإضافة بنجاح", {
        durations: { global: 5000 },
      });
};

// export
import * as XLSX from "xlsx"; // Import XLSX for Excel export

// Method to handle exporting the table to Excel
const exportToExcel = () => {
  // Prepare data from filteredArray
  let filteredData = filteredArray.value.filter((e) => !e.is_admin);
  let data;
  if (locale.value === "en") {
    data = filteredData.map((product) => ({
      FirstName: product.firstName,
      LastName: product.lastName,
      Email: product.email,
      Created_at: product.created_at.slice(0, 10),
    }));
  } else {
    data = filteredData.map((product) => ({
      الاسم_الأول: product.firstName,
      الاسم_الأخير: product.lastName,
      البريد_الإلكتروني: product.email,
      تاريح_الإنشاء: product.created_at.slice(0, 10),
    }));
  }
  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

  // Export the workbook as an Excel file
  XLSX.writeFile(workbook, "Customers.xlsx");
};
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  overflow-x: hidden;
  min-height: calc(100vh - 77.6px);
  transition: all 0.3s linear;
  width: 100%;
  background-color: #f8f7fa;
  float: right;
  margin-top: 77.6px;
  padding: 16px;
  @media (max-width: 600px) {
    margin-top: 55px;
    min-height: calc(100vh - 55px);
  }

  &.shrink {
    width: calc(100% - 260px); /* 100% + 260px(sidebar)*/
    @media (max-width: 600px) {
      width: 100%;
    }
  }

  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0px;
    @media (max-width: 991px) {
      flex-direction: column;
      align-items: flex-start;
    }
    .head-title {
      p {
        font-size: 15px;
        color: #6d6a77;
        a {
          color: #19ad7b;
          text-decoration: underline;
        }
      }
    }
    .options {
      display: flex;
      align-items: center;
      .reload {
        background-color: #19ad7b;
        color: #fff;
        border: none;
      }
      @media (max-width: 991px) {
        margin-top: 10px;
      }
    }
  }
  .table-responsive {
    background-color: #fff;
    border-radius: 8px;
  }
  .product-tabel {
    height: calc(100vh - 274px);
    overflow-y: scroll;
    @media (max-width: 991px) {
      height: calc(100vh - 320px);
    }
  }
  .loading {
    img {
      width: 50px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  thead,
  tbody,
  tfoot,
  tr,
  td,
  th {
    padding: 8px 15px;
    white-space: nowrap;
  }
  table {
    width: 100%;
  }
  thead {
    background-color: #19ad7b;
    color: #fff;
  }
  td {
    color: #333;
    max-width: 300px;
    cursor: pointer;
  }
  .pagination {
    select {
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      color: #333;
      padding: 10px;
      &:focus,
      :focus-visible {
        outline: none;
      }
    }
    .page-item {
      .page-link {
        cursor: pointer;
        border: none !important;
        span {
          color: #6b7280;
          padding: 0.5rem 1rem;
          @media (max-width: 768px) {
            padding: 0;
          }
        }
        &.page-num {
          color: #19ad7b;
        }
      }
    }
    .show-info {
      @media (max-width: 520px) {
        display: none !important;
      }
    }
  }

  .rows {
    color: #000;
    &:nth-child(even) {
      background-color: #eee;
    }
    &:nth-child(odd) {
      background-color: #fff;
    }
    .product-img {
      img {
        width: 50px;
        height: 50px;
        margin-inline-end: 10px;
        object-fit: contain;
      }
    }
    .product-info {
      h5,
      p {
        max-width: 200px;
        /* will make [...] at the end */
        text-overflow: ellipsis;
        /* paragraph to one line */
        white-space: nowrap;
        /* older browsers */
        overflow: hidden;
        margin: 0;
      }
      p {
        font-size: 14px;
      }
    }
    .badge {
      font-size: 16px;
      padding: 8px 12px;
      margin: 0;
    }
    .circle {
      display: block;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 1px solid #cbc9c9;
    }
    .delete,
    .edit {
      padding: 6px;
      color: #333;
      svg {
        font-size: 20px;
      }
    }
  }
}
</style>

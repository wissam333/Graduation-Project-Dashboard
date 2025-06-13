<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة الطلبات" : "Orders List" }}
        </h4>
      </div>
      <div class="options">
        <div class="search-container">
          <input
            v-model="searchText"
            id="price"
            type="text"
            required
            :placeholder="$i18n.locale === 'ar' ? 'ابحث' : 'Search'"
            class="search-input"
          />
          <Icon name="mdi:search" class="search-icon icon" />
        </div>
        <button class="action-btn btn-success" @click="getOrders()">
          <Icon class="icon" name="mdi:refresh" />
          {{ $i18n.locale === "ar" ? "إعادة تحميل" : "Reload" }}
        </button>
        <button class="action-btn btn-success" @click="exportToExcel">
          <Icon class="icon" name="mdi:download" />
          {{ $i18n.locale === "ar" ? "تصدير" : "Export" }}
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <div class="loading" v-if="loading">
        <img src="/loading/loadingNew.svg" alt="Loading..." />
      </div>
      <div v-else class="user-table">
        <table>
          <thead>
            <tr>
              <th>{{ $i18n.locale === "ar" ? "العميل" : "Customer" }}</th>
              <th>
                {{ $i18n.locale === "ar" ? "سعر التوصيل" : "Delivery price" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "السعر الكلي" : "Total Amount" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "العنوان" : "Address" }}</th>
              <th>{{ $i18n.locale === "ar" ? "الحالة" : "Status" }}</th>
              <th>
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "تعديل" : "Edit" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              v-for="order in filteredArray"
              :key="order._id"
            >
              <td class="User-cell">
                <div class="User-info">
                  <h5>{{ order.name }}</h5>
                  <small>{{ order.email }}</small>
                </div>
              </td>
              <td class="amount-cell">
                {{ order.deliveryPrice }}
                {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
              </td>
              <td class="amount-cell">
                {{ order.amount }} {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
              </td>
              <td class="address-cell">
                {{ order.address }}
                <div v-if="addresses[order._id]">
                  <small>{{ addresses[order._id] }}</small>
                </div>
              </td>
              <td class="status-cell">
                <span class="badge" :class="statusClass(order.status)">
                  {{
                    $i18n.locale === "ar"
                      ? getStatusArabic(order.status)
                      : order.status
                  }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ order.createdAt.slice(0, 10) }}
                </span>
              </td>
              <td class="action-cell">
                <button
                  class="icon-btn edit-btn"
                  @click="openEditDialog(order)"
                >
                  <Icon class="icon" name="mdi:edit-outline" />
                </button>
                <button
                  class="icon-btn delete-btn"
                  @click="
                    deleteModal = true;
                    deleteOrder = order;
                  "
                >
                  <Icon class="icon" name="mdi:delete-outline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
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
        {{ $i18n.locale === "ar" ? "هذا الطلب" : "this order" }} (ID:
        {{ deleteOrder._id }}){{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="deleteOrderHandler()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Edit Order Dialog -->
  <Dialog v-model:visible="editVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="updateOrder()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "تعديل الطلب" : "Edit Order" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <label for="editStatus" class="form-label">
              {{ $i18n.locale === "ar" ? "الحالة" : "Status" }} *
            </label>
            <select
              v-model="editStatus"
              id="editStatus"
              required
              class="form-input"
            >
              <option value="pending">
                {{ $i18n.locale === "ar" ? "قيد الانتظار" : "Pending" }}
              </option>
              <option value="processing">
                {{ $i18n.locale === "ar" ? "قيد التجهيز" : "Processing" }}
              </option>
              <option value="shipped">
                {{ $i18n.locale === "ar" ? "تم الشحن" : "Shipped" }}
              </option>
              <option value="delivered">
                {{ $i18n.locale === "ar" ? "تم التوصيل" : "Delivered" }}
              </option>
              <option value="cancelled">
                {{ $i18n.locale === "ar" ? "ملغى" : "Cancelled" }}
              </option>
            </select>
          </div>

          <div class="input-group">
            <label for="editAddress" class="form-label">
              {{ $i18n.locale === "ar" ? "العنوان" : "Address" }} *
            </label>
            <input
              readOnly
              disabled
              v-model="editAddress"
              id="editAddress"
              type="text"
              required
              class="form-input"
            />
          </div>

          <!-- map -->
          <div style="height: 50vh; width: 100%; margin: auto">
            <ClientOnly>
              <LMap
                ref="editMap"
                :zoom="editZoom"
                :center="[editMarker.latitude, editMarker.longitude]"
                :use-global-leaflet="false"
              >
                <LTileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  layer-type="base"
                  name="OpenStreetMap"
                />

                <LMarker
                  :lat-lng="[editMarker.latitude, editMarker.longitude]"
                />
                <LMarker :lat-lng="[editMarker.latitude, editMarker.longitude]">
                  <LIcon :icon-size="[70, 28]">{{
                    $i18n.locale === "ar" ? "الموقع" : "Location"
                  }}</LIcon>
                </LMarker>

                <div v-for="(resta, index) in RestaLocations" :key="index">
                  <LMarker
                    :lat-lng="[
                      resta.product.restaurantId.location[1],
                      resta.product.restaurantId.location[0],
                    ]"
                  />
                  <LMarker
                    :lat-lng="[
                      resta.product.restaurantId.location[1],
                      resta.product.restaurantId.location[0],
                    ]"
                  >
                    <LIcon :icon-size="[70, 28]">{{
                      resta.product.restaurantId.name
                    }}</LIcon>
                  </LMarker>
                </div>
              </LMap>
            </ClientOnly>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.prevent="closeCallback">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success" autofocus>
            {{ $t("Update") }}
          </button>
        </div>
      </form>
    </template>
  </Dialog>
</template>

<script setup>
import * as XLSX from "xlsx"; // Import XLSX for Excel export
definePageMeta({
  middleware: ["not-authorize"],
});
const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

const deleteOrder = ref({});
const deleteModal = ref(false);
const searchText = ref("");
const loading = ref(false);
const orders = ref([]);

// Edit dialog refs
const editVisible = ref(false);
const editStatus = ref("pending");
const editAddress = ref("");
const editMarker = ref({
  latitude: 25.337820284408895,
  longitude: 55.42325219079596,
});
const editZoom = ref(10);
const currentOrderId = ref(null);
const editMap = ref(null);

// get address names
const addresses = ref({}); // Store addresses by order ID
const loadingAddresses = ref({}); // Track loading state per order

// Function to fetch address for a single order
const fetchAddress = async (order) => {
  if (!order.location || addresses.value[order._id]) return;

  loadingAddresses.value[order._id] = true;
  try {
    addresses.value[order._id] = await useGetAddressFromGeo(
      order.location[1],
      order.location[0],
      locale.value
    );
  } catch (error) {
    console.error("Error fetching address:", error);
    addresses.value[order._id] =
      locale.value === "ar" ? "فشل تحميل العنوان" : "Failed to load address";
  } finally {
    loadingAddresses.value[order._id] = false;
  }
};

const filteredArray = computed(() => {
  return orders.value?.filter(
    (order) =>
      order.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      order.email.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

// Fetch addresses when orders are loaded
watch(
  () => orders.value,
  (newOrders) => {
    if (newOrders) {
      newOrders.forEach(fetchAddress);
    }
  },
  { immediate: true }
);

const updateDeleteModal = (value) => {
  deleteModal.value = value;
};

const getOrders = async () => {
  loading.value = true;
  try {
    const { data: ordersData } = await useFetch(`${api.OrdersApi}`, {
      baseURL: apiBase,
      headers: {
        "accept-language": locale.value,
      },
    });

    if (ordersData.value) {
      orders.value = ordersData.value;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load orders"
        : "فشل تحميل قائمة الطلبات"
    );
  } finally {
    loading.value = false;
  }
};

// Initial data fetch
getOrders();

// delete
const deleteOrderHandler = async () => {
  try {
    await useFetch(`${api.OrdersApi}/${deleteOrder.value._id}`, {
      baseURL: apiBase,
      method: "DELETE",
    });

    await getOrders();
    deleteModal.value = false;

    $awn.success(
      locale.value === "en"
        ? "Order Deleted Successfully"
        : "تم حذف الطلب بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to delete order" : "فشل حذف الطلب"
    );
  }
};

let RestaLocations = ref();
// edit
const openEditDialog = (order) => {
  currentOrderId.value = order._id;
  editStatus.value = order.status;
  editAddress.value = order.address;
  if (order.location && order.location.length === 2) {
    editMarker.value = {
      latitude: order.location[1],
      longitude: order.location[0],
    };
  }
  RestaLocations.value = order.products;
  editVisible.value = true;
};

const updateOrder = async () => {
  try {
    await useFetch(`${api.OrdersApi}/${currentOrderId.value}`, {
      baseURL: apiBase,
      method: "PUT",
      body: {
        status: editStatus.value,
        address: editAddress.value,
        location: [editMarker.value.longitude, editMarker.value.latitude],
      },
    });

    // Reset form and close dialog
    editStatus.value = "pending";
    editAddress.value = "";
    editVisible.value = false;
    addresses.value = {};
    // Refresh order list
    await getOrders();

    $awn.success(
      locale.value === "en" ? "Updated Successfully" : "تم التحديث بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to update order" : "فشل تحديث الطلب"
    );
  }
};

// status helper functions
const statusClass = (status) => {
  switch (status) {
    case "pending":
      return "status-pending";
    case "processing":
      return "status-processing";
    case "shipped":
      return "status-shipped";
    case "delivered":
      return "status-delivered";
    case "cancelled":
      return "status-cancelled";
    default:
      return "";
  }
};

const getStatusArabic = (status) => {
  switch (status) {
    case "pending":
      return "قيد الانتظار";
    case "processing":
      return "قيد التجهيز";
    case "shipped":
      return "تم الشحن";
    case "delivered":
      return "تم التوصيل";
    case "cancelled":
      return "ملغى";
    default:
      return status;
  }
};

// export
const exportToExcel = () => {
  const dataToExport = filteredArray.value.map((order) => {
    // Common fields for both languages
    const baseData = {
      id: order._id,
      customer: order.name,
      email: order.email,
      products: order.products
        .map((p) => `${p.product?.title || p.productId} (x${p.quantity})`)
        .join(", "),
      amount: order.amount,
      address: order.address,
      status: order.status,
      createdAt: order.createdAt?.slice(0, 10) || "",
    };

    // Add language-specific fields
    if (locale.value === "ar") {
      return {
        "معرف الطلب": baseData.id,
        العميل: baseData.customer,
        "البريد الإلكتروني": baseData.email,
        المنتجات: baseData.products,
        المبلغ: baseData.amount,
        العنوان: baseData.address,
        الحالة: getStatusArabic(baseData.status),
        "تاريخ الإنشاء": baseData.createdAt,
      };
    } else {
      return {
        "Order ID": baseData.id,
        Customer: baseData.customer,
        Email: baseData.email,
        Products: baseData.products,
        Amount: baseData.amount,
        Address: baseData.address,
        Status: baseData.status,
        "Created At": baseData.createdAt,
      };
    }
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    locale.value === "ar" ? "الطلبات" : "Orders"
  );

  // Generate file name with current date
  const date = new Date().toISOString().slice(0, 10);
  const fileName = `Orders_${date}.xlsx`;

  // Export the file
  XLSX.writeFile(workbook, fileName);
};
</script>

<style lang="scss" scoped>
.contain {
  position: relative;
  overflow-x: hidden;
  min-height: calc(100vh - 77.6px);
  transition: all 0.3s ease;
  width: 100%;
  background-color: #f8f7fa;
  float: right;
  margin-top: 77.6px;
  padding: 1.5rem;

  @media (max-width: 600px) {
    margin-top: 55px;
    min-height: calc(100vh - 55px);
    padding: 1rem;
  }

  &.shrink {
    width: calc(100% - 260px);

    @media (max-width: 600px) {
      width: 100%;
    }
  }
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  .head-title {
    h4 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }
  }

  .options {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;

    .search-container {
      position: relative;
      display: flex;
      align-items: center;

      .search-input {
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        background-color: #fff;
        transition: border-color 0.2s;
        width: 200px;

        &:focus {
          outline: none;
          border-color: #19ad7b;
          box-shadow: 0 0 0 2px rgba(25, 173, 123, 0.1);
        }
      }

      .search-icon {
        position: absolute;
        left: 0.75rem;
        color: #64748b;
        font-size: 1.25rem;
      }
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: all 0.2s;
      border: none;
      cursor: pointer;

      &.btn-success {
        background-color: #19ad7b;
        color: #fff;

        &:hover {
          background-color: #158c65;
        }
      }

      .icon {
        font-size: 1.25rem;
      }
    }
  }
}

.table-responsive {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;

  img {
    width: 50px;
    height: 50px;
  }
}

.user-table {
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: #19ad7b;
    color: #fff;

    th {
      padding: 1rem;
      font-weight: 600;
    }
  }

  tbody {
    tr {
      &:nth-child(even) {
        background-color: #f9fafb;
      }

      &:hover {
        background-color: #f1f5f9;
      }
    }
  }
}

.table-row {
  td {
    padding: 1rem;
    color: #334155;
    border-bottom: 1px solid #e2e8f0;
  }
}

.User-cell {
  display: flex;
  align-items: center;
  gap: 1rem;

  .User-info {
    h5 {
      margin: 0;
      font-weight: 500;
      color: #1e293b;
    }
    small {
      color: #64748b;
      font-size: 0.8rem;
    }
  }
}

.products-cell {
  .product-item {
    margin-bottom: 0.25rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.amount-cell {
  font-weight: 600;
  color: #1e293b;
}

.address-cell {
  small {
    color: #64748b;
    font-size: 0.8rem;
  }
}

.status-cell {
  .badge {
    display: inline-block;
    padding: 0.35rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;

    &.status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    &.status-processing {
      background-color: #dbeafe;
      color: #1e40af;
    }
    &.status-shipped {
      background-color: #e0f2fe;
      color: #0369a1;
    }
    &.status-delivered {
      background-color: #dcfce7;
      color: #166534;
    }
    &.status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }
  }
}

.date-cell {
  .badge {
    display: inline-block;
    padding: 0.35rem 0.75rem;
    border-radius: 9999px;
    background-color: #e0f2fe;
    color: #0369a1;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.action-cell {
  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    color: #64748b;

    &:hover {
      background-color: #f1f5f9;
      color: #ef4444;
    }

    .icon {
      font-size: 1.25rem;
    }
  }
  .edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    color: #64748b;
    margin-right: 0.5rem;

    &:hover {
      background-color: #f1f5f9;
      color: #19ad7b;
    }

    .icon {
      font-size: 1.25rem;
    }
  }
}

.dialog {
  padding: 1.5rem;

  .dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1.5rem;
  }

  .input-group {
    margin-bottom: 1.25rem;
    position: relative;

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #334155;
    }

    .form-input {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background-color: #fff;
      transition: border-color 0.2s;
      color: #333;

      &:focus {
        outline: none;
        border-color: #19ad7b;
        box-shadow: 0 0 0 2px rgba(25, 173, 123, 0.1);
      }
    }

    select.form-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 16px 12px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      border: none;

      &.btn-secondary {
        background-color: #e2e8f0;
        color: #334155;

        &:hover {
          background-color: #cbd5e1;
        }
      }

      &.btn-success {
        background-color: #19ad7b;
        color: #fff;

        &:hover {
          background-color: #158c65;
        }
      }
    }
  }
}
</style>

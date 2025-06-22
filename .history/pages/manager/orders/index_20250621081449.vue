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

        <Select
          v-model="clientsFilter"
          :options="clientsWithAllOption"
          :placeholder="
            $i18n.locale === 'ar' ? 'اختار عميل' : 'Select A Client'
          "
          class=""
        >
          <template #option="slotProps">
            <div
              class="d-flex align-items-center"
              :class="$i18n.locale === 'ar' ? 'selectAr' : ''"
            >
              <div>
                {{
                  $i18n.locale === "ar"
                    ? slotProps.option.username
                    : slotProps.option.username
                }}
              </div>
            </div>
          </template>
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div
                class="d-flex align-items-center"
                :class="$i18n.locale === 'ar' ? 'selectAr' : ''"
              >
                <div>
                  {{
                    $i18n.locale === "ar"
                      ? slotProps.value.username
                      : slotProps.value.username
                  }}
                </div>
              </div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Select>

        <button class="action-btn btn-success" @click="addVisible = true">
          <Icon class="icon" name="mdi:plus" />
          {{ $i18n.locale === "ar" ? "إضافة طلب" : "Add Order" }}
        </button>

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
              <th>{{ $i18n.locale === "ar" ? "العمليات" : "Actions" }}</th>
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
                <div class="d-flex">
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
                </div>
                <div class="d-flex">
                  <nuxt-link
                    :to="`/admin/orders/${order._id}`"
                    class="edit-btn delete-btn"
                  >
                    <Icon class="icon" name="mdi:visibility" />
                  </nuxt-link>

                  <button
                    v-if="order.status == 'Pending'"
                    class="edit-btn delete-btn"
                    @click="updateOrderStatusToProcessing(order._id)"
                    v-tooltip.left="$i18n.locale === 'ar' ? 'قبول' : 'Accept'"
                  >
                    <Icon class="icon" name="mdi:checkbox-marked" />
                  </button>
                </div>
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
              <option value="Pending">
                {{ $i18n.locale === "ar" ? "قيد الانتظار" : "Pending" }}
              </option>
              <option value="Processing">
                {{ $i18n.locale === "ar" ? "قيد التجهيز" : "Processing" }}
              </option>
              <option value="Shipping">
                {{ $i18n.locale === "ar" ? "يتم الشحن" : "Shipping" }}
              </option>
              <option value="Delivered">
                {{ $i18n.locale === "ar" ? "تم التوصيل" : "Delivered" }}
              </option>
              <option value="Cancelled">
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

                  <LPolyline
                    :lat-lngs="[
                      [editMarker.latitude, editMarker.longitude],
                      [
                        resta.product.restaurantId.location[1],
                        resta.product.restaurantId.location[0],
                      ],
                    ]"
                    :options="{ color: '#4798d0', dashArray: '10, 10' }"
                  />
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

  <!-- Add Order Modal -->
  <Dialog v-model:visible="addVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="createOrder"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "إضافة طلب جديد" : "Add New Order" }}
        </h5>
        <div class="dialog-content">
          <!-- Customer Selection -->
          <div class="input-group">
            <label for="customer" class="form-label">
              {{ $i18n.locale === "ar" ? "العميل" : "Customer" }} *
            </label>
            <Select
              v-model="newOrder.userId"
              :options="clients"
              optionLabel="username"
              optionValue="_id"
              :placeholder="
                $i18n.locale === 'ar' ? 'اختر العميل' : 'Select Customer'
              "
              required
              class="w-full"
              @update:modelValue="handleCustomerSelect"
            >
              <template #option="slotProps">
                <div class="flex items-center">
                  <div>{{ slotProps.option.username }}</div>
                </div>
              </template>
            </Select>
          </div>

          <!-- Customer Info (auto-filled) -->
          <div class="input-group" v-if="selectedCustomer">
            <label class="form-label">
              {{ $i18n.locale === "ar" ? "معلومات العميل" : "Customer Info" }}
            </label>
            <div class="customer-info">
              <div>
                <strong>{{
                  $i18n.locale === "ar" ? "الاسم:" : "Name:"
                }}</strong>
                {{ selectedCustomer.username }}
              </div>
              <div>
                <strong>{{
                  $i18n.locale === "ar" ? "البريد:" : "Email:"
                }}</strong>
                {{ selectedCustomer.email }}
              </div>
            </div>
          </div>

          <!-- Products Selection -->
          <div class="input-group">
            <label class="form-label">
              {{ $i18n.locale === "ar" ? "المنتجات" : "Products" }} *
            </label>
            <div class="products-container">
              <div
                v-for="(product, index) in newOrder.products"
                :key="index"
                class="product-item"
              >
                <Select
                  v-model="product.productId"
                  :options="availableProducts"
                  optionLabel="title"
                  optionValue="_id"
                  :placeholder="
                    $i18n.locale === 'ar' ? 'اختر المنتج' : 'Select Product'
                  "
                  required
                  class="product-select"
                >
                  <template #option="slotProps">
                    <div class="flex items-center">
                      <div>{{ slotProps.option.title }}</div>
                      <div class="product-price">
                        {{ slotProps.option.price }}
                        {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
                      </div>
                    </div>
                  </template>
                </Select>
                <input
                  v-model.number="product.quantity"
                  type="number"
                  min="1"
                  :placeholder="$i18n.locale === 'ar' ? 'الكمية' : 'Quantity'"
                  class="quantity-input"
                  required
                />
                <button
                  type="button"
                  class="remove-btn"
                  @click="removeProduct(index)"
                  v-if="newOrder.products.length > 1"
                >
                  <Icon name="mdi:close" />
                </button>
              </div>
              <button type="button" class="add-product-btn" @click="addProduct">
                <Icon name="mdi:plus" />
                {{ $i18n.locale === "ar" ? "إضافة منتج" : "Add Product" }}
              </button>
            </div>
          </div>

          <!-- Address -->
          <div class="input-group">
            <label for="address" class="form-label">
              {{ $i18n.locale === "ar" ? "العنوان" : "Address" }} *
            </label>
            <input
              v-model="newOrder.address"
              id="address"
              type="text"
              required
              class="form-input"
              :placeholder="
                $i18n.locale === 'ar' ? 'أدخل العنوان' : 'Enter address'
              "
            />
          </div>

          <!-- Map for Location Selection -->
          <div class="input-group">
            <label class="form-label">
              {{ $i18n.locale === "ar" ? "حدد الموقع" : "Select Location" }} *
            </label>
            <div style="height: 400px; width: 100%; margin: auto">
              <ClientOnly>
                <LMap
                  ref="addMap"
                  :zoom="zoom"
                  :center="center"
                  :use-global-leaflet="false"
                  @click="handleMapClick"
                >
                  <LTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    layer-type="base"
                    name="OpenStreetMap"
                  />
                  <LMarker
                    v-if="markerPosition"
                    :lat-lng="markerPosition"
                    draggable
                    @move="handleMarkerMove"
                  >
                    <LPopup>
                      {{
                        $i18n.locale === "ar"
                          ? "موقع التوصيل"
                          : "Delivery location"
                      }}
                    </LPopup>
                  </LMarker>
                </LMap>
              </ClientOnly>
            </div>
            <div class="coordinates" v-if="markerPosition">
              <span>Lat: {{ markerPosition.lat.toFixed(6) }}</span>
              <span>Lng: {{ markerPosition.lng.toFixed(6) }}</span>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.prevent="closeCallback">
            {{ $t("Close") }}
          </button>
          <button
            class="btn btn-success"
            type="submit"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">
              <Icon name="eos-icons:loading" />
              {{ $i18n.locale === "ar" ? "جاري الإرسال..." : "Submitting..." }}
            </span>
            <span v-else>
              {{ $i18n.locale === "ar" ? "إضافة الطلب" : "Add Order" }}
            </span>
          </button>
        </div>
      </form>
    </template>
  </Dialog>
</template>

<script setup>
import * as XLSX from "xlsx"; // Import XLSX for Excel export
definePageMeta({
  middleware: ["not-authorize", "manager"],
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

// filter
const clientsFilter = ref();

const { data: clients } = await useFetch(`${api.UsersApi}`, {
  baseURL: apiBase,
});

const clientsWithAllOption = computed(() => {
  if (clients.value) {
    return [
      { _id: null, username: locale.value === "ar" ? "الكل" : "All" },
      ...clients.value,
    ];
  }
});

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
  let filtered = orders.value;

  // Apply search filter
  if (searchText.value) {
    filtered = filtered.filter(
      (order) =>
        order.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
        order.email.toLowerCase().includes(searchText.value.toLowerCase())
    );
  }

  // Apply clients filter
  if (clientsFilter.value && clientsFilter.value._id) {
    filtered = filtered.filter(
      (order) => order.userId === clientsFilter.value._id
    );
  }

  return filtered;
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
    const { data: ordersData } = await useFetch(
      `${api.OrdersApi}?restaurantId=${useUserInfo().value.restaurantId}`,
      {
        baseURL: apiBase,
        headers: {
          "accept-language": locale.value,
        },
      }
    );

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

const updateOrderStatusToProcessing = async (currentOrderId) => {
  try {
    await useFetch(`${api.OrdersApi}/${currentOrderId}`, {
      baseURL: apiBase,
      method: "PUT",
      body: {
        status: "Processing",
      },
    });

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
    case "Pending":
      return "status-pending";
    case "Processing":
      return "status-processing";
    case "Shipping":
      return "status-shipped";
    case "Delivered":
      return "status-delivered";
    case "Cancelled":
      return "status-cancelled";
    default:
      return "";
  }
};

const getStatusArabic = (status) => {
  switch (status) {
    case "Pending":
      return "قيد الانتظار";
    case "Processing":
      return "قيد التجهيز";
    case "Shipping":
      return "يتم الشحن";
    case "Delivered":
      return "تم التوصيل";
    case "Cancelled":
      return "ملغى";
    default:
      return status;
  }
};

// Modal state
const addVisible = ref(false);
const isSubmitting = ref(false);

// Map references
const addMap = ref(null);
const zoom = ref(12);
const center = ref([33.510414, 36.278336]); // Default center (Damascus)
const markerPosition = ref(null);

// Form data
const newOrder = ref({
  userId: "",
  name: "",
  email: "",
  products: [
    {
      productId: "",
      quantity: 1,
    },
  ],
  address: "",
  location: [],
});

// Data from API
const availableProducts = ref([]);
const selectedCustomer = ref(null);

// Fetch clients and products when modal opens
watch(addVisible, async (visible) => {
  if (visible) {
    try {
      const [{ data: clientsData }, { data: productsData }] = await Promise.all(
        [
          useFetch(`${api.UsersApi}`, { baseURL: apiBase }),
          useFetch(
            `${api.MealsApi}?restaurantId=${useUserInfo().value.restaurantId}`,
            {
              baseURL: apiBase,
            }
          ),
        ]
      );

      clients.value = clientsData.value || [];
      availableProducts.value = productsData.value.products || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      $awn.alert(
        locale.value === "ar" ? "فشل تحميل البيانات" : "Failed to load data"
      );
    }
  } else {
    // Reset form when modal closes
    resetForm();
  }
});

// Handle customer selection
const handleCustomerSelect = (userId) => {
  const customer = clients.value.find((c) => c._id === userId);
  if (customer) {
    selectedCustomer.value = customer;
    newOrder.value.name = customer.username;
    newOrder.value.email = customer.email;
  } else {
    selectedCustomer.value = null;
    newOrder.value.name = "";
    newOrder.value.email = "";
  }
};

// Map interaction handlers
const handleMapClick = (e) => {
  markerPosition.value = e.latlng;
  newOrder.value.location = [e.latlng.lng, e.latlng.lat];
};

const handleMarkerMove = (e) => {
  markerPosition.value = e.target.getLatLng();
  newOrder.value.location = [
    e.target.getLatLng().lng,
    e.target.getLatLng().lat,
  ];
};

// Product management
const addProduct = () => {
  newOrder.value.products.push({
    productId: "",
    quantity: 1,
  });
};

const removeProduct = (index) => {
  newOrder.value.products.splice(index, 1);
};

// Form submission
const createOrder = async () => {
  // Validate form
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    // Prepare the request body
    const requestBody = {
      ...newOrder.value,
      restaurantId: useUserInfo().value.restaurantId,
    };

    // Make the API call
    const { data, error } = await useFetch(api.OrdersApi, {
      baseURL: apiBase,
      method: "POST",
      body: requestBody,
    });

    if (error.value) {
      throw error.value;
    }

    // Success
    $awn.success(
      locale.value === "ar"
        ? "تم إضافة الطلب بنجاح"
        : "Order added successfully"
    );
    addVisible.value = false;
    // Refresh orders list
    getOrders();
  } catch (error) {
    console.error("Error creating order:", error);
    $awn.alert(
      locale.value === "ar" ? "فشل إضافة الطلب" : "Failed to add order"
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Form validation
const validateForm = () => {
  // Check customer selected
  if (!newOrder.value.userId) {
    $awn.alert(
      locale.value === "ar" ? "الرجاء اختيار عميل" : "Please select a customer"
    );
    return false;
  }

  // Check products
  for (const product of newOrder.value.products) {
    if (!product.productId || product.quantity < 1) {
      $awn.alert(
        locale.value === "ar"
          ? "الرجاء اختيار جميع المنتجات وإدخال كميات صحيحة"
          : "Please select all products and enter valid quantities"
      );
      return false;
    }
  }

  // Check address
  if (!newOrder.value.address || newOrder.value.address.trim() === "") {
    $awn.alert(
      locale.value === "ar" ? "الرجاء إدخال العنوان" : "Please enter an address"
    );
    return false;
  }

  // Check location
  if (!newOrder.value.location || newOrder.value.location.length !== 2) {
    $awn.alert(
      locale.value === "ar"
        ? "الرجاء تحديد الموقع على الخريطة"
        : "Please select a location on the map"
    );
    return false;
  }

  return true;
};

// Reset form
const resetForm = () => {
  newOrder.value = {
    userId: "",
    name: "",
    email: "",
    products: [
      {
        productId: "",
        quantity: 1,
      },
    ],
    address: "",
    location: [],
  };
  selectedCustomer.value = null;
  markerPosition.value = null;
  isSubmitting.value = false;
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
    margin-right: 0.5rem;
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

      &:focus {
        outline: none;
        border-color: #19ad7b;
        box-shadow: 0 0 0 2px rgba(25, 173, 123, 0.1);
      }
    }

    .customer-info {
      padding: 0.75rem;
      background-color: #f8fafc;
      border-radius: 0.375rem;
      border: 1px solid #e2e8f0;

      div {
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .products-container {
      .product-item {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        align-items: center;

        .product-select {
          flex: 1;
        }

        .quantity-input {
          width: 100px;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
        }

        .remove-btn {
          background: #fee2e2;
          color: #b91c1c;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #fecaca;
          }
        }
      }

      .add-product-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #e0f2fe;
        color: #0369a1;
        border: none;
        border-radius: 0.375rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 0.5rem;

        &:hover {
          background: #bae6fd;
        }
      }
    }

    .coordinates {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #64748b;
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

        &:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
      }
    }
  }
}

.product-price {
  margin-left: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}
</style>

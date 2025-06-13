<template>
  <!-- Add this button to your options div -->
  <button class="action-btn btn-success" @click="addVisible = true">
    <Icon class="icon" name="mdi:plus" />
    {{ $i18n.locale === "ar" ? "إضافة طلب" : "Add Order" }}
  </button>

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
const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

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
const clients = ref([]);
const availableProducts = ref([]);
const selectedCustomer = ref(null);

// Fetch clients and products when modal opens
watch(addVisible, async (visible) => {
  if (visible) {
    try {
      const [{ data: clientsData }, { data: productsData }] = await Promise.all(
        [
          useFetch(`${api.UsersApi}/temp`, { baseURL: apiBase }),
          useFetch(
            `${api.ProductsApi}?restaurantId=${
              useUserInfo().value.restaurantId
            }`,
            {
              baseURL: apiBase,
            }
          ),
        ]
      );

      clients.value = clientsData.value || [];
      availableProducts.value = productsData.value || [];
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
</script>

<style lang="scss" scoped>
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

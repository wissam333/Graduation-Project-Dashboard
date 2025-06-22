<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "تفاصيل الطلب" : "Order Details" }}
        </h4>
      </div>
      <div class="options">
        <button class="action-btn btn-secondary" @click="$router.go(-1)">
          <Icon class="icon" name="mdi:arrow-left" />
          {{ $i18n.locale === "ar" ? "رجوع" : "Back" }}
        </button>
        <button class="action-btn btn-success" @click="printOrder" v-if="order">
          <Icon class="icon" name="mdi:printer" />
          {{ $i18n.locale === "ar" ? "طباعة" : "Print" }}
        </button>
      </div>
    </div>

    <div class="order-detail-container" v-if="order">
      <!-- Order Summary -->
      <div class="order-summary">
        <div class="summary-card">
          <h5>
            {{ $i18n.locale === "ar" ? "معلومات الطلب" : "Order Information" }}
          </h5>

          <div class="summary-row">
            <span class="label"
              >{{ $i18n.locale === "ar" ? "التاريخ" : "Date" }}:</span
            >
            <span class="value">{{ formatDate(order.createdAt) }}</span>
          </div>

          <div class="summary-row">
            <span class="label"
              >{{ $i18n.locale === "ar" ? "الحالة" : "Status" }}:</span
            >
            <span class="value badge" :class="statusClass(order.status)">
              {{
                $i18n.locale === "ar"
                  ? getStatusArabic(order.status)
                  : order.status
              }}
            </span>
          </div>
          <div class="summary-row">
            <span class="label"
              >{{
                $i18n.locale === "ar" ? "سعر المنتجات" : "Product Price"
              }}:</span
            >
            <span class="value"
              >{{ order.amount - order.deliveryPrice }}
              {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}</span
            >
          </div>

          <div class="summary-row">
            <span class="label"
              >{{
                $i18n.locale === "ar" ? "المبلغ الإجمالي" : "Total Amount"
              }}:</span
            >
            <span class="value"
              >{{ order.amount }}
              {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}</span
            >
          </div>
        </div>

        <div class="summary-card">
          <h5>
            {{
              $i18n.locale === "ar" ? "معلومات العميل" : "Customer Information"
            }}
          </h5>
          <div class="summary-row">
            <span class="label"
              >{{ $i18n.locale === "ar" ? "الاسم" : "Name" }}:</span
            >
            <span class="value">{{ order.name }}</span>
          </div>
          <div class="summary-row">
            <span class="label"
              >{{
                $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email"
              }}:</span
            >
            <span class="value">{{ order.email }}</span>
          </div>
        </div>

        <div class="summary-card">
          <h5>
            {{
              $i18n.locale === "ar" ? "معلومات التوصيل" : "Delivery Information"
            }}
          </h5>
          <div class="summary-row">
            <span class="label"
              >{{ $i18n.locale === "ar" ? "العنوان" : "Address" }}:</span
            >
            <span class="value">{{ order.address }}</span>
          </div>
          <div class="summary-row">
            <span class="label"
              >{{
                $i18n.locale === "ar" ? "موقع التوصيل" : "Delivery Location"
              }}:</span
            >
            <span class="value">{{ address }}</span>
          </div>
          <div class="summary-row">
            <span class="label"
              >{{
                $i18n.locale === "ar" ? "تكلفة التوصيل" : "Delivery Price"
              }}:</span
            >
            <span class="value"
              >{{ order.deliveryPrice }}
              {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}</span
            >
          </div>
        </div>
      </div>

      <!-- Order Products -->
      <div class="products-section">
        <h5>{{ $i18n.locale === "ar" ? "المنتجات" : "Products" }}</h5>
        <div class="products-table">
          <table>
            <thead>
              <tr>
                <th>{{ $i18n.locale === "ar" ? "الصورة" : "Image" }}</th>
                <th>{{ $i18n.locale === "ar" ? "المنتج" : "Product" }}</th>
                <th>{{ $i18n.locale === "ar" ? "المطعم" : "Restaurant" }}</th>
                <th>{{ $i18n.locale === "ar" ? "السعر" : "Price" }}</th>
                <th>{{ $i18n.locale === "ar" ? "الكمية" : "Quantity" }}</th>
                <th>{{ $i18n.locale === "ar" ? "المجموع" : "Total" }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.products" :key="item.productId">
                <td class="product-image">
                  <img
                    v-if="item.product?.img"
                    :src="item.product.img"
                    :alt="item.product.title"
                  />
                  <img v-else src="/logo/logo.png" alt="Product" />
                </td>
                <td class="product-name">
                  {{ item.product?.title || item.productId }}
                  <small v-if="item.product?.desc">{{
                    item.product.desc
                  }}</small>
                </td>
                <td class="restaurant-name">
                  <span v-if="item.product?.restaurantId">
                    {{ item.product.restaurant.name }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td class="product-name">
                  {{ item.product?.price || 0 }}
                  {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
                </td>
                <td class="product-name">
                  {{ item.quantity }}
                </td>
                <td class="product-name">
                  {{ (item.product?.price || 0) * item.quantity }}
                  {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Order Location Map -->
      <div class="map-section">
        <h5>
          {{ $i18n.locale === "ar" ? "موقع التوصيل" : "Delivery Location" }}
        </h5>
        <div class="map-container" v-if="order">
          <ClientOnly>
            <LMap
              ref="editMap"
              :zoom="zoom"
              :center="[marker.latitude, marker.longitude]"
              :use-global-leaflet="false"
            >
              <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                layer-type="base"
                name="OpenStreetMap"
              />

              <LMarker :lat-lng="[marker.latitude, marker.longitude]" />
              <LMarker :lat-lng="[marker.latitude, marker.longitude]">
                <LIcon :icon-size="[70, 28]">{{
                  $i18n.locale === "ar" ? "الموقع" : "Location"
                }}</LIcon>
              </LMarker>

              <div v-for="(resta, index) in order.products" :key="index">
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
                    [marker.latitude, marker.longitude],
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
    </div>

    <div class="loading" v-else>
      <img src="/loading/loadingNew.svg" alt="Loading..." />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize", "manager"],
});

const { locale } = useI18n();
const route = useRoute();
const { $awn } = useNuxtApp();
const {
  public: { api, apiBase },
} = useRuntimeConfig();

const order = ref(null);
const loading = ref(true);
const address = ref("");
const restaurants = ref([]);

// Map variables
const marker = ref({
  latitude: 25.337820284408895,
  longitude: 55.42325219079596,
});
const zoom = ref(12);

// Fetch order details
const fetchOrder = async () => {
  try {
    const { data: orderData } = await useFetch(
      `${api.OrdersApi}/${route.params.id}`,
      {
        baseURL: apiBase,
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    if (orderData.value) {
      order.value = orderData.value;

      // Set map location
      if (order.value.location && order.value.location.length === 2) {
        marker.value = {
          latitude: order.value.location[1],
          longitude: order.value.location[0],
        };
      }

      // Get address from coordinates
      if (order.value.location) {
        address.value = await useGetAddressFromGeo(
          order.value.location[1],
          order.value.location[0],
          locale.value
        );
      }
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load order details"
        : "فشل تحميل تفاصيل الطلب"
    );
  } finally {
    loading.value = false;
  }
};

// Fetch all restaurants for product mapping
const fetchRestaurants = async () => {
  try {
    const { data: restaurantsData } = await useFetch(`${api.RestaurantsApi}`, {
      baseURL: apiBase,
    });

    if (restaurantsData.value) {
      restaurants.value = restaurantsData.value;
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

// Print order
const printOrder = () => {
  window.print();
};

// Initialize
onMounted(async () => {
  await fetchRestaurants();
  await fetchOrder();
});
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

      .icon {
        font-size: 1.25rem;
      }
    }
  }
}

.order-detail-container {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
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

.order-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  .summary-card {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    h5 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;

      .label {
        font-weight: 500;
        color: #64748b;
      }

      .value {
        font-weight: 500;
        color: #1e293b;

        &.badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;

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
    }
  }
}

.products-section {
  margin-bottom: 2rem;

  h5 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .products-table {
    overflow-x: auto;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

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

  .product-image {
    width: 80px;
    padding: 0.5rem;

    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 0.25rem;
    }
  }

  .product-name {
    padding: 0.5rem 1rem;

    small {
      display: block;
      color: #64748b;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
  }

  .restaurant-name {
    padding: 0.5rem 1rem;
    font-weight: 500;
  }

  .product-price,
  .product-quantity,
  .product-total {
    padding: 0.5rem 1rem;
    text-align: center;
    font-weight: 500;
  }

  .product-total {
    color: #19ad7b;
    font-weight: 600;
  }
}

.map-section {
  margin-bottom: 2rem;

  h5 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .map-container {
    height: 400px;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.actions-section {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  .btn {
    padding: 0.5rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;

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

    .icon {
      font-size: 1.25rem;
    }
  }
}

@media print {
  .title-container .options,
  .actions-section {
    display: none;
  }

  .order-detail-container {
    box-shadow: none;
    padding: 0;
  }

  .summary-card {
    page-break-inside: avoid;
  }

  .products-table {
    page-break-inside: avoid;
  }
}
</style>

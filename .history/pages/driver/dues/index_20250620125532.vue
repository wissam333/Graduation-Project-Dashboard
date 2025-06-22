<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{
            $i18n.locale === "ar"
              ? "مستحقاتي"
              : "My Dues"
          }}
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
                {{ $i18n.locale === "ar" ? "مستحقاتي" : "My Dues" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "حالة الدفع" : "Payments Status" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "السعر الكلي" : "Total Amount" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "العنوان" : "Address" }}</th>

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
                  <h5>{{ order.order.customerName }}</h5>
                  <small>{{ order.order.customerEmail }}</small>
                </div>
              </td>
              <td class="amount-cell">
                {{ order.order.deliveryPrice }}
                {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
              </td>
              <td class="amount-cell">
                {{ order.amount }}
                {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
              </td>
              <td class="amount-cell">
                {{ order.status }}
              </td>
              <td class="amount-cell">
                {{ order.order.amount }}
                {{ $i18n.locale === "ar" ? "ل.س" : "SYP" }}
              </td>
              <td class="address-cell">
                {{ order.order.address }}
              </td>
              <td class="action-cell">
                <div class="d-flex">
                  <nuxt-link
                    :to="`/driver/dues/${order.order._id}`"
                    class="edit-btn delete-btn"
                  >
                    <Icon class="icon" name="mdi:visibility" />
                  </nuxt-link>

                  <button
                    class="edit-btn delete-btn"
                    @click="updateOrderStatusToDelivered(order.order._id)"
                    v-tooltip.left="
                      $i18n.locale === 'ar' ? 'تم التوصيل' : 'Delivered'
                    "
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
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize", "driver"], // Changed to driver middleware
});

const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

const searchText = ref("");
const loading = ref(false);
const orders = ref([]);

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

  return filtered;
});

const getOrders = async () => {
  loading.value = true;
  try {
    const { data: ordersData } = await useFetch(
      `${api.OrdersApi}/getDriverDues?driverId=${useUserInfo().value._id}`, // Only fetch Processing orders
      {
        baseURL: apiBase,
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    if (ordersData.value) {
      orders.value = ordersData.value.data;
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

const updateOrderStatusToDelivered = async (currentOrderId) => {
  try {
    await useFetch(`${api.OrdersApi}/${currentOrderId}`, {
      baseURL: apiBase,
      method: "PUT",
      body: {
        status: "Delivered",
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
</style>

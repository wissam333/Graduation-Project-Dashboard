<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h1>Restaurant Dashboard</h1>
        <p class="subtitle">Overview of your restaurant performance</p>
      </div>
      <div class="time-period-selector">
        <Dropdown
          v-model="selectedPeriod"
          :options="periodOptions"
          optionLabel="name"
          placeholder="Select Time Period"
          class="w-full md:w-14rem"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <Card class="summary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:currency-dollar" size="20" />
            <span>Total Revenue</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ formatCurrency(dashboardData.totalRevenue) }}</h2>
            <span
              :class="['trend', revenueTrend > 0 ? 'positive' : 'negative']"
            >
              <Icon
                :name="revenueTrend > 0 ? 'ph:trend-up' : 'ph:trend-down'"
                size="16"
              />
              {{ Math.abs(revenueTrend) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:shopping-cart" size="20" />
            <span>Total Orders</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ dashboardData.ordersCount }}</h2>
            <span :class="['trend', ordersTrend > 0 ? 'positive' : 'negative']">
              <Icon
                :name="ordersTrend > 0 ? 'ph:trend-up' : 'ph:trend-down'"
                size="16"
              />
              {{ Math.abs(ordersTrend) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:receipt" size="20" />
            <span>Average Order Value</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ formatCurrency(dashboardData.avgOrderValue) }}</h2>
            <span :class="['trend', aovTrend > 0 ? 'positive' : 'negative']">
              <Icon
                :name="aovTrend > 0 ? 'ph:trend-up' : 'ph:trend-down'"
                size="16"
              />
              {{ Math.abs(aovTrend) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:users" size="20" />
            <span>Active Managers</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ dashboardData.activeManagers }}</h2>
            <div class="comparison">
              <Icon name="ph:buildings" size="16" />
              Across all locations
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Main Charts Section -->
    <div class="charts-section">
      <!-- Sales Chart -->
      <Card class="chart-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:chart-line-up" size="20" />
            <span>Sales Analytics</span>
          </div>
        </template>
        <template #content>
          <Chart
            type="line"
            :data="salesChartData"
            :options="chartOptions"
            class="chart"
          />
        </template>
      </Card>

      <!-- Product Performance -->
      <Card class="chart-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:package" size="20" />
            <span>Top Performing Products</span>
          </div>
        </template>
        <template #content>
          <Chart
            type="bar"
            :data="productsChartData"
            :options="chartOptions"
            class="chart"
          />
        </template>
      </Card>
    </div>

    <!-- Secondary Charts Section -->
    <div class="secondary-section">
      <!-- Order Status Distribution -->
      <Card class="secondary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:list-checks" size="20" />
            <span>Order Status Distribution</span>
          </div>
        </template>
        <template #content>
          <Chart
            type="pie"
            :data="orderStatusData"
            :options="pieChartOptions"
            class="small-chart"
          />
        </template>
      </Card>

      <!-- Popular Categories -->
      <Card class="secondary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:tag" size="20" />
            <span>Popular Categories</span>
          </div>
        </template>
        <template #content>
          <Chart
            type="doughnut"
            :data="categoriesData"
            :options="pieChartOptions"
            class="small-chart"
          />
        </template>
      </Card>
    </div>

    <!-- Customer Analytics -->
    <Card class="full-width-card">
      <template #title>
        <div class="card-title">
          <Icon name="ph:users-four" size="20" />
          <span>Customer Analytics</span>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="customerData"
          :paginator="true"
          :rows="5"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
        >
          <Column field="username" header="Name">
            <template #body="{ data }">
              <div class="customer-cell">
                <Icon name="ph:user" size="16" />
                <span>{{ data.username }}</span>
              </div>
            </template>
          </Column>
          <Column field="email" header="Email">
            <template #body="{ data }">
              <div class="customer-cell">
                <Icon name="ph:envelope" size="16" />
                <span>{{ data.email }}</span>
              </div>
            </template>
          </Column>
          <Column field="orderCount" header="Orders">
            <template #body="{ data }">
              <div class="customer-cell">
                <Icon name="ph:shopping-cart" size="16" />
                <span>{{ data.orderCount }}</span>
              </div>
            </template>
          </Column>
          <Column field="totalSpent" header="Total Spent">
            <template #body="{ data }">
              <div class="customer-cell">
                <Icon name="ph:currency-dollar" size="16" />
                <span>{{ formatCurrency(data.totalSpent) }}</span>
              </div>
            </template>
          </Column>
          <Column field="lastOrder" header="Last Order">
            <template #body="{ data }">
              <div class="customer-cell">
                <Icon name="ph:calendar" size="16" />
                <span>{{ formatDate(data.lastOrder) }}</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
// PrimeVue components
import Card from "primevue/card";
import Chart from "primevue/chart";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const {
  public: { apiBase },
} = useRuntimeConfig();

// Chart colors
const greenPalette = [
  "#2e7d32",
  "#388e3c",
  "#43a047",
  "#4caf50",
  "#66bb6a",
  "#81c784",
  "#a5d6a7",
  "#c8e6c9",
  "#e8f5e9",
];

// Time period options
const selectedPeriod = ref({ name: "This Month", value: "month" });
const periodOptions = ref([
  { name: "Today", value: "today" },
  { name: "This Week", value: "week" },
  { name: "This Month", value: "month" },
  { name: "This Year", value: "year" },
]);

// Dashboard data
const dashboardData = ref({
  ordersCount: 0,
  totalRevenue: 0,
  avgOrderValue: 0,
  activeManagers: 0,
  revenueTrend: 0,
  ordersTrend: 0,
  aovTrend: 0,
  popularCategories: [],
});

// Chart data refs
const salesChartData = ref({});
const productsChartData = ref({});
const orderStatusData = ref({});
const categoriesData = ref({});
const customerData = ref([]);

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#495057",
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#495057",
      },
      grid: {
        color: "#ebedef",
      },
    },
    y: {
      ticks: {
        color: "#495057",
        callback: function (value) {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(value);
        },
      },
      grid: {
        color: "#ebedef",
      },
    },
  },
});

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "#495057",
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
});

// Fetch all dashboard data
const fetchDashboardData = async (period) => {
  try {
    const { data: statsData } = await useFetch(
      `/api/dashboard/stats?period=${period}`,
      {
        baseURL: apiBase,
        headers: {
          token: `Bearer ${useUserInfo().value.accessToken}`,
        },
      }
    );

    if (statsData.value) {
      dashboardData.value = statsData.value;
      setCategoriesData(statsData.value.popularCategories);
    }

    // Fetch additional data in parallel
    const [productsRes, statusRes, customersRes] = await Promise.all([
      useFetch("/api/dashboard/product-performance", {
        baseURL: apiBase,
        headers: {
          token: `Bearer ${useUserInfo().value.accessToken}`,
        },
      }),
      useFetch("/api/dashboard/order-status", {
        baseURL: apiBase,
        headers: {
          token: `Bearer ${useUserInfo().value.accessToken}`,
        },
      }),
      useFetch("/api/dashboard/customer-analytics", {
        baseURL: apiBase,
        headers: {
          token: `Bearer ${useUserInfo().value.accessToken}`,
        },
      }),
    ]);

    if (productsRes.data.value) setProductsChartData(productsRes.data.value);
    if (statusRes.data.value) setOrderStatusData(statusRes.data.value);
    if (customersRes.data.value) customerData.value = customersRes.data.value;

    // Fetch sales data for the chart
    const { data: salesData } = await useFetch(
      `/api/dashboard/sales-analytics?period=${period}`,
      {
        baseURL: apiBase,
        headers: {
          token: `Bearer ${useUserInfo().value.accessToken}`,
        },
      }
    );

    if (salesData.value) setSalesChartData(salesData.value);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

// Watch for period changes
watch(
  selectedPeriod,
  async (newPeriod) => {
    await fetchDashboardData(newPeriod.value);
  },
  { immediate: true }
);

// Chart data setters
const setSalesChartData = (salesData) => {
  salesChartData.value = {
    labels: salesData.map((item) =>
      formatChartLabel(item.date, selectedPeriod.value.value)
    ),
    datasets: [
      {
        label: "Sales",
        data: salesData.map((item) => item.totalSales),
        fill: true,
        borderColor: greenPalette[3],
        backgroundColor: "rgba(46, 125, 50, 0.1)",
        tension: 0.3,
        pointBackgroundColor: greenPalette[3],
        pointBorderColor: "#fff",
        pointHoverRadius: 5,
      },
      {
        label: "Orders",
        data: salesData.map((item) => item.orderCount),
        borderColor: "#9c27b0",
        backgroundColor: "rgba(156, 39, 176, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "#9c27b0",
        pointBorderColor: "#fff",
        pointHoverRadius: 5,
        hidden: true, // Hidden by default
      },
    ],
  };
};

const setProductsChartData = (productsData) => {
  productsChartData.value = {
    labels: productsData.map((item) => item.name),
    datasets: [
      {
        label: "Revenue",
        data: productsData.map((item) => item.totalRevenue),
        backgroundColor: greenPalette.slice(0, productsData.length),
        borderColor: "#fff",
        borderWidth: 1,
      },
      {
        label: "Units Sold",
        data: productsData.map((item) => item.totalSold),
        backgroundColor: "#9c27b0",
        borderColor: "#fff",
        borderWidth: 1,
        hidden: true, // Hidden by default
      },
    ],
  };
};

const setOrderStatusData = (statusData) => {
  orderStatusData.value = {
    labels: statusData.map((item) => item.status),
    datasets: [
      {
        data: statusData.map((item) => item.count),
        backgroundColor: [
          greenPalette[0],
          greenPalette[2],
          greenPalette[4],
          greenPalette[6],
          "#9c27b0",
          "#673ab7",
        ].slice(0, statusData.length),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };
};

const setCategoriesData = (categories) => {
  categoriesData.value = {
    labels: categories.map((item) => item.name),
    datasets: [
      {
        data: categories.map((item) => item.count),
        backgroundColor: greenPalette.slice(0, categories.length),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };
};

// Formatting functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatChartLabel = (label, period) => {
  if (period === "today") {
    return new Date(label).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (period === "week") {
    return new Date(label).toLocaleDateString([], { weekday: "short" });
  } else if (period === "month") {
    return new Date(label).toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  } else if (period === "year") {
    return new Date(label).toLocaleDateString([], { month: "short" });
  }
  return label;
};

// Computed properties for trends
const revenueTrend = computed(() => dashboardData.value.summary.revenueTrend || 0);
const ordersTrend = computed(() => dashboardData.value.summary.ordersTrend || 0);
const aovTrend = computed(() => dashboardData.value.summary.aovTrend || 0);
</script>

<style scoped>
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left h1 {
  color: #2e7d32;
  margin: 0 0 0.25rem 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid #4caf50;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-weight: 600;
}

.card-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.card-content h2 {
  margin: 0.5rem 0;
  font-size: 1.8rem;
  color: #2e7d32;
  font-weight: 700;
}

.trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.positive {
  color: #2e7d32;
}

.negative {
  color: #d32f2f;
}

.comparison {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #757575;
  margin-top: 0.25rem;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 992px) {
  .charts-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

.chart-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 400px;
  transition: box-shadow 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.chart {
  height: 350px;
}

.secondary-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .secondary-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

.secondary-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 350px;
  transition: box-shadow 0.3s ease;
}

.secondary-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.small-chart {
  height: 300px;
}

.full-width-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.full-width-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.time-period-selector {
  width: 200px;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.p-card-title) {
  color: #333 !important;
  font-size: 1.1rem !important;
}

:deep(.p-card-content) {
  padding: 0 !important;
}

:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #f5f5f5 !important;
  font-weight: 600;
}
</style>

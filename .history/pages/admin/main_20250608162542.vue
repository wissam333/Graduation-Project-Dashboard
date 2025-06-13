<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h1>{{ $t("Restaurant Dashboard") }}</h1>
        <p class="subtitle">
          {{ $t("Overview of your restaurant performance") }}
        </p>
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
            <span>{{ $t("Total Revenue") }}</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ formatCurrency(dashboardData.summary?.totalRevenue) }}</h2>
            <span
              :class="[
                'trend',
                dashboardData.summary?.revenueTrend > 0
                  ? 'positive'
                  : 'negative',
              ]"
            >
              <Icon
                :name="
                  dashboardData.summary?.revenueTrend > 0
                    ? 'ph:trend-up'
                    : 'ph:trend-down'
                "
                size="16"
              />
              {{ Math.abs(dashboardData.summary?.revenueTrend || 0) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:shopping-cart" size="20" />
            <span>{{ $t("Total Orders") }}</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ dashboardData.summary?.ordersCount }}</h2>
            <span
              :class="[
                'trend',
                dashboardData.summary?.ordersTrend > 0
                  ? 'positive'
                  : 'negative',
              ]"
            >
              <Icon
                :name="
                  dashboardData.summary?.ordersTrend > 0
                    ? 'ph:trend-up'
                    : 'ph:trend-down'
                "
                size="16"
              />
              {{ Math.abs(dashboardData.summary?.ordersTrend || 0) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:receipt" size="20" />
            <span>{{ $t("Average Order Value") }}</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ formatCurrency(dashboardData.summary?.avgOrderValue) }}</h2>
            <span
              :class="[
                'trend',
                dashboardData.summary?.aovTrend > 0 ? 'positive' : 'negative',
              ]"
            >
              <Icon
                :name="
                  dashboardData.summary?.aovTrend > 0
                    ? 'ph:trend-up'
                    : 'ph:trend-down'
                "
                size="16"
              />
              {{ Math.abs(dashboardData.summary?.aovTrend || 0) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:users" size="20" />
            <span>{{ $t("Active Managers") }}</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ dashboardData.summary?.activeManagers }}</h2>
            <div class="comparison">
              <Icon name="ph:buildings" size="16" />
              {{ $t("Across all locations") }}
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Main Content Section -->
    <div class="content-section">
      <!-- Sales Trend Card -->
      <Card class="content-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:chart-line-up" size="20" />
            <span>{{ $t("Sales Trends") }}</span>
            <span
              class="trend-indicator"
              :class="
                dashboardData.summary.revenueTrend >= 0
                  ? 'positive'
                  : 'negative'
              "
            >
              {{ Math.abs(dashboardData.summary.revenueTrend) }}%
              <Icon
                :name="
                  dashboardData.summary.revenueTrend >= 0
                    ? 'ph:trend-up'
                    : 'ph:trend-down'
                "
                size="16"
              />
            </span>
          </div>
        </template>
        <template #content>
          <div class="sales-trend-content">
            <Chart
              type="line"
              :data="salesTrendChartData"
              :options="salesTrendChartOptions"
              class="chart"
            />

            <div class="trend-metrics">
              <div class="trend-metric">
                <div class="metric-label">
                  <Icon name="ph:currency-dollar" size="16" />
                  <span>{{ $t("Total Revenue") }}</span>
                </div>
                <div class="metric-value">
                  {{ formatCurrency(dashboardData.summary.totalRevenue) }}
                </div>
                <div
                  class="metric-trend"
                  :class="
                    dashboardData.summary.revenueTrend >= 0
                      ? 'positive'
                      : 'negative'
                  "
                >
                  {{ dashboardData.summary.revenueTrend }}%
                </div>
              </div>

              <div class="trend-metric">
                <div class="metric-label">
                  <Icon name="ph:shopping-cart" size="16" />
                  <span>{{ $t("Orders") }}</span>
                </div>
                <div class="metric-value">
                  {{ dashboardData.summary.ordersCount }}
                </div>
                <div
                  class="metric-trend"
                  :class="
                    dashboardData.summary.ordersTrend >= 0
                      ? 'positive'
                      : 'negative'
                  "
                >
                  {{ dashboardData.summary.ordersTrend }}%
                </div>
              </div>

              <div class="trend-metric">
                <div class="metric-label">
                  <Icon name="ph:receipt" size="16" />
                  <span>{{ $t("Avg. Order") }}</span>
                </div>
                <div class="metric-value">
                  {{ formatCurrency(dashboardData.summary.avgOrderValue) }}
                </div>
                <div
                  class="metric-trend"
                  :class="
                    dashboardData.summary.aovTrend >= 0
                      ? 'positive'
                      : 'negative'
                  "
                >
                  {{ dashboardData.summary.aovTrend }}%
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Popular Categories Chart -->
      <Card class="content-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:tag" size="20" />
            <span>{{ $t("Popular Categories") }}</span>
          </div>
        </template>
        <template #content>
          <Chart
            type="bar"
            :data="categoriesChartData"
            :options="barChartOptions"
            class="chart"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
// PrimeVue components
import Card from "primevue/card";
import Chart from "primevue/chart";
import Dropdown from "primevue/dropdown";

const {
  public: { apiBase },
} = useRuntimeConfig();

// Chart data refs
const salesTrendChartData = ref({});
const salesTrendChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
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
          if (context.dataset.label === "Revenue") {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(context.raw);
          } else {
            label += context.raw;
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
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "Revenue ($)",
        color: "#4caf50",
      },
      ticks: {
        color: "#4caf50",
        callback: function (value) {
          return "$" + value;
        },
      },
      grid: {
        color: "#ebedef",
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "Orders",
        color: "#9c27b0",
      },
      ticks: {
        color: "#9c27b0",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
});

// In your fetchDashboardData function, after setting categories chart data:
const setSalesTrendChartData = (salesTrend) => {
  salesTrendChartData.value = {
    labels: salesTrend.map((item) => formatShortDate(item.date)),
    datasets: [
      {
        label: "Revenue",
        data: salesTrend.map((item) => item.total),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: salesTrend.map((item) => item.count),
        borderColor: "#9c27b0",
        backgroundColor: "rgba(156, 39, 176, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };
};

setSalesTrendChartData();

// Update your formatShortDate function to be more compact:
const formatShortDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
};

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
const selectedPeriod = ref({ name: "This Year", value: "year" });
const periodOptions = ref([
  { name: "Today", value: "today" },
  { name: "This Week", value: "week" },
  { name: "This Month", value: "month" },
  { name: "This Year", value: "year" },
]);

// Dashboard data
const dashboardData = ref({
  summary: {
    totalRevenue: 0,
    ordersCount: 0,
    avgOrderValue: 0,
    productsCount: 0,
    categoriesCount: 0,
    activeManagers: 0,
    revenueTrend: 0,
    ordersTrend: 0,
    aovTrend: 0,
  },
  charts: {
    salesTrend: [],
    popularCategories: [],
  },
});

// Chart data refs
const categoriesChartData = ref({});

// Chart options
const barChartOptions = ref({
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
          const label = context.label || "";
          const value = context.raw || 0;
          return `${label}: ${value}`;
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
      },
      grid: {
        color: "#ebedef",
      },
    },
  },
});

// Fetch dashboard data
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
      setCategoriesChartData(statsData.value.charts.popularCategories);
    }
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

const setCategoriesChartData = (categories) => {
  categoriesChartData.value = {
    labels: categories.map((item) => item.name),
    datasets: [
      {
        label: "Orders Count",
        data: categories.map((item) => item.count),
        backgroundColor: greenPalette.slice(0, categories.length),
        borderColor: "#fff",
        borderWidth: 1,
      },
      {
        label: "Revenue",
        data: categories.map((item) => item.revenue),
        backgroundColor: "#9c27b0",
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
  }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

.content-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 992px) {
  .content-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

.content-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.sales-summary-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.sales-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.sales-metric:last-child {
  border-bottom: none;
}

.metric-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

.metric-value {
  font-weight: 600;
  color: #2e7d32;
  font-size: 1.1rem;
}

.chart {
  height: 350px;
}

.time-period-selector {
  width: 200px;
}

:deep(.p-card-title) {
  color: #333 !important;
  font-size: 1.1rem !important;
}

:deep(.p-card-content) {
  padding: 0 !important;
}

.sales-trend-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart {
  height: 300px;
}

.trend-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.trend-metric {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-weight: 600;
  color: #2e7d32;
  font-size: 1.1rem;
  margin: 0.25rem 0;
}

.metric-trend {
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.metric-trend.positive {
  color: $main;
}

.metric-trend.negative {
  color: red;
}

.trend-indicator {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.trend-indicator.positive {
  color: $main;
}

.trend-indicator.negative {
  color: red;
}
</style>

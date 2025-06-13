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
            <span>Total Orders</span>
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
            <span>Average Order Value</span>
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
            <span>Active Managers</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h2>{{ dashboardData.summary?.activeManagers }}</h2>
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
            <span>Sales Trend</span>
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

      <!-- Popular Categories -->
      <Card class="chart-card">
        <template #title>
          <div class="card-title">
            <Icon name="ph:tag" size="20" />
            <span>Popular Categories</span>
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
const salesChartData = ref({});
const categoriesChartData = ref({});

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
      setSalesChartData(statsData.value.charts.salesTrend);
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

// Chart data setters
const setSalesChartData = (salesData) => {
  salesChartData.value = {
    labels: salesData.map((item) => item.date),
    datasets: [
      {
        label: "Revenue",
        data: salesData.map((item) => item.total),
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
        data: salesData.map((item) => item.count),
        borderColor: "#9c27b0",
        backgroundColor: "rgba(156, 39, 176, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "#9c27b0",
        pointBorderColor: "#fff",
        pointHoverRadius: 5,
      },
    ],
  };
};

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

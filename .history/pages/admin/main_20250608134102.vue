<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="header">
      <h1>Restaurant Dashboard</h1>
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
        <template #title>Total Revenue</template>
        <template #content>
          <div class="card-content">
            <h2>{{ formatCurrency(summaryData.totalRevenue) }}</h2>
            <span
              :class="['trend', revenueTrend > 0 ? 'positive' : 'negative']"
            >
              <i
                :class="
                  revenueTrend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
                "
              ></i>
              {{ Math.abs(revenueTrend) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>Total Orders</template>
        <template #content>
          <div class="card-content">
            <h2>{{ summaryData.ordersCount }}</h2>
            <span :class="['trend', ordersTrend > 0 ? 'positive' : 'negative']">
              <i
                :class="ordersTrend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              ></i>
              {{ Math.abs(ordersTrend) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>Average Order Value</template>
        <template #content>
          <div class="card-content">
            <h2>{{ formatCurrency(summaryData.avgOrderValue) }}</h2>
            <span :class="['trend', aovTrend > 0 ? 'positive' : 'negative']">
              <i
                :class="aovTrend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              ></i>
              {{ Math.abs(aovTrend) }}%
            </span>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #title>Active Managers</template>
        <template #content>
          <div class="card-content">
            <h2>{{ summaryData.activeManagers }}</h2>
            <div class="comparison">Across all locations</div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Main Charts Section -->
    <div class="charts-section">
      <!-- Sales Chart -->
      <Card class="chart-card">
        <template #title>Sales Analytics</template>
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
        <template #title>Top Performing Products</template>
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
        <template #title>Order Status Distribution</template>
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
        <template #title>Popular Categories</template>
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
      <template #title>Customer Analytics</template>
      <template #content>
        <DataTable
          :value="customerData"
          :paginator="true"
          :rows="5"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
        >
          <Column field="username" header="Name"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="orderCount" header="Orders"></Column>
          <Column field="totalSpent" header="Total Spent">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.totalSpent) }}
            </template>
          </Column>
          <Column field="lastOrder" header="Last Order">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.lastOrder) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
// // PrimeVue components
// import Card from "primevue/card";
// import Chart from "primevue/chart";
// import Dropdown from "primevue/dropdown";
// import DataTable from "primevue/datatable";
// import Column from "primevue/column";
const {
  public: { api, apiBase },
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

// Summary data
const summaryData = ref({
  totalRevenue: 0,
  ordersCount: 0,
  avgOrderValue: 0,
  activeManagers: 0,
});

// Trend data
const revenueTrend = ref(0);
const ordersTrend = ref(0);
const aovTrend = ref(0);

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
  },
});

// Fetch data function
const fetchDashboardData = async () => {
  const { data, error } = await useFetch("/api/dashboard/stats", {
    baseURL: apiBase,
  });
  if (data.value) {
    summaryData.value = data.value;
  }

  const salesRes = await useFetch(
    `/api/dashboard/sales-analytics?period=${selectedPeriod.value.value}`,
    {
      baseURL: apiBase,
    }
  );
  if (salesRes.data.value) {
    setSalesChartData(salesRes.data.value);
  }

  const productsRes = await useFetch("/api/dashboard/product-performance", {
    baseURL: apiBase,
  });
  if (productsRes.data.value) {
    setProductsChartData(productsRes.data.value);
  }

  const statusRes = await useFetch("/api/dashboard/order-status", {
    baseURL: apiBase,
  });
  if (statusRes.data.value) {
    setOrderStatusData(statusRes.data.value);
  }

  const categoriesRes = await useFetch("/api/dashboard/customer-analytics", {
    baseURL: apiBase,
  });
  if (categoriesRes.data.value) {
    customerData.value = categoriesRes.data.value;
  }

  const comparisonRes = await useFetch("/api/dashboard/comparison?type=month", {
    baseURL: apiBase,
  });
  if (comparisonRes.data.value) {
    revenueTrend.value = comparisonRes.data.value.totalSales.change;
    ordersTrend.value = comparisonRes.data.value.orderCount.change;
    aovTrend.value = comparisonRes.data.value.avgOrderValue.change;
  }
};

// Chart data setters
const setSalesChartData = (salesData) => {
  salesChartData.value = {
    labels: salesData.map((item) => item._id),
    datasets: [
      {
        label: "Sales",
        data: salesData.map((item) => item.totalSales),
        fill: false,
        borderColor: greenPalette[3],
        tension: 0.4,
        backgroundColor: "rgba(46, 125, 50, 0.2)",
      },
      {
        label: "Delivery Fees",
        data: salesData.map((item) => item.deliveryFees),
        fill: false,
        borderColor: greenPalette[5],
        tension: 0.4,
        backgroundColor: "rgba(76, 175, 80, 0.2)",
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
      },
    ],
  };
};

const setOrderStatusData = (statusData) => {
  orderStatusData.value = {
    labels: statusData.map((item) => item._id),
    datasets: [
      {
        data: statusData.map((item) => item.count),
        backgroundColor: greenPalette.slice(0, statusData.length),
      },
    ],
  };
};

// Formatting functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Lifecycle hook
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  color: #2e7d32;
  margin: 0;
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
  transition: transform 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
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
}

.trend {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.trend i {
  margin-right: 0.3rem;
}

.positive {
  color: #2e7d32;
}

.negative {
  color: #d32f2f;
}

.comparison {
  font-size: 0.8rem;
  color: #757575;
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
}

.small-chart {
  height: 300px;
}

.full-width-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.time-period-selector {
  width: 200px;
}
</style>

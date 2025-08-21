<template>
  <div class="route-map-container">
    <div class="map-header">
      <h3>
        {{
          $i18n.locale === "ar"
            ? "مسار التوصيل المقترح"
            : "Suggested Delivery Route"
        }}
      </h3>
      <button @click="closeMap" class="close-btn">
        <Icon name="mdi:close" />
      </button>
    </div>

    <div class="map-stats">
      <div class="stat-item">
        <span>{{
          $i18n.locale === "ar" ? "عدد الطلبات" : "Total Orders"
        }}</span>
        <strong>{{ grouping.totalOrders }}</strong>
      </div>
      <div class="stat-item">
        <span>{{
          $i18n.locale === "ar" ? "المسافة الكلية" : "Total Distance"
        }}</span>
        <strong>{{ grouping.totalDistance }}</strong>
      </div>
      <div class="stat-item">
        <span>{{
          $i18n.locale === "ar" ? "الوقت المقدر" : "Estimated Time"
        }}</span>
        <strong>{{ grouping.estimatedDeliveryTime }}</strong>
      </div>
    </div>

    <div class="map-wrapper">
      <ClientOnly>
        <LMap
          ref="map"
          :zoom="zoom"
          :center="restaurantLocation"
          :use-global-leaflet="false"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <!-- Restaurant Marker -->
          <LMarker :lat-lng="restaurantLocation">
            <LIcon
              style="object-fit: contain"
              icon-url="/rest.png"
              :icon-size="[32, 32]"
            />
            <LPopup>
              <div class="popup-content">
                <h4>{{ restaurant.name }}</h4>
                <p>
                  {{
                    $i18n.locale === "ar" ? "نقطة البداية" : "Starting Point"
                  }}
                </p>
              </div>
            </LPopup>
          </LMarker>

          <!-- Order Markers -->
          <LMarker
            v-for="(stop, index) in grouping.orders"
            :key="stop.order._id"
            :lat-lng="[stop.order.coords[1], stop.order.coords[0]]"
          >
            <LIcon icon-url="/box.png" :icon-size="[28, 28]" />
            <LPopup>
              <div class="popup-content">
                <h4>{{ stop.order.name }}</h4>
                <p>{{ stop.order.address }}</p>
                <p>
                  <strong>{{
                    $i18n.locale === "ar"
                      ? "المسافة من المطعم:"
                      : "Distance from restaurant:"
                  }}</strong>
                  {{ stop.order.distanceFromRestaurant.toFixed(2) }} km
                </p>
                <p>
                  <strong>{{
                    $i18n.locale === "ar" ? "المنتجات:" : "Products:"
                  }}</strong>
                </p>
                <ul>
                  <li
                    v-for="product in stop.order.products"
                    :key="product.productId._id"
                  >
                    {{ product.productId.title }} (x{{ product.quantity }})
                  </li>
                </ul>
              </div>
            </LPopup>
          </LMarker>

          <!-- Route Polyline -->
          <LPolyline
            :lat-lngs="routePath"
            color="#19ad7b"
            :weight="5"
            :opacity="0.7"
          />
          <!-- Step number markers placed at midpoints -->
          <LMarker
            v-for="(midpoint, index) in routeMidpoints"
            :key="index"
            :lat-lng="midpoint.position"
            :icon="midpoint.icon"
          />
        </LMap>
      </ClientOnly>
    </div>

    <div class="order-list">
      <h4>{{ $i18n.locale === "ar" ? "تفاصيل الطريق" : "Route Details" }}</h4>
      <div class="route-stops">
        <div
          class="route-stop"
          v-for="(stop, index) in routeStops"
          :key="stop.order._id"
        >
          <div class="stop-marker">
            <span v-if="index === 0">R</span>
            <span v-else>{{ index }}</span>
          </div>
          <div class="stop-info">
            <h5>{{ stop.order.name }}</h5>
            <p>{{ stop.order.address }}</p>
            <p class="distance-info">
              <span v-if="index > 1">
                {{
                  $i18n.locale === "ar"
                    ? "من المحطة السابقة:"
                    : "From previous:"
                }}
                {{ stop.distanceFromPrev }}
              </span>
              <span v-if="index > 0">
                {{ $i18n.locale === "ar" ? "من المطعم:" : "From restaurant:" }}
                {{ stop.order.distanceFromRestaurant.toFixed(2) }} km
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn-accept" @click="acceptRoute">
        {{ $i18n.locale === "ar" ? "قبول المسار" : "Accept Route" }}
      </button>
      <button class="btn-cancel" @click="closeMap">
        {{ $i18n.locale === "ar" ? "إلغاء" : "Cancel" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import L from "leaflet";

const props = defineProps({
  grouping: {
    type: Object,
    required: true,
  },
  restaurant: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "accept"]);

const zoom = ref(12);
const map = ref(null);

// Convert restaurant location to [lat, lng] format
const restaurantLocation = computed(() => {
  return [props.restaurant.location[1], props.restaurant.location[0]];
});

// Prepare route path for polyline
const routePath = computed(() => {
  const path = [];

  // Start with restaurant location
  path.push(restaurantLocation.value);

  // Add each order location
  props.grouping.orders.forEach((stop) => {
    path.push([stop.order.coords[1], stop.order.coords[0]]);
  });

  // Return to restaurant
  path.push(restaurantLocation.value);

  return path;
});

// Prepare route stops with restaurant as first stop
const routeStops = computed(() => {
  return [
    {
      order: {
        _id: props.restaurant._id,
        name: props.restaurant.name,
        coords: props.restaurant.location,
        address: props.restaurant.name,
        distanceFromRestaurant: 0,
        products: [],
      },
      distanceFromPrev: "0 km",
    },
    ...props.grouping.orders,
  ];
});

const closeMap = () => {
  emit("close");
};

const acceptRoute = () => {
  emit("accept", props.grouping);
};

// Compute midpoints between each pair of coordinates for step numbers
const routeMidpoints = computed(() => {
  if (process.client) {
    const midpoints = [];

    // Start from index 1 to skip the restaurant-to-first-stop segment
    for (let i = 0; i < routePath.value.length - 1; i++) {
      const start = routePath.value[i];
      const end = routePath.value[i + 1];

      // Calculate midpoint
      const midLat = (start[0] + end[0]) / 2;
      const midLng = (start[1] + end[1]) / 2;

      midpoints.push({
        position: [midLat, midLng],
        icon: L.divIcon({
          html: `<div style="
          background: white;
          border: 2px solid #19ad7b;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #19ad7b;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${i + 1}</div>`,
          className: "",
          iconSize: [24, 24],
        }),
      });
    }

    return midpoints;
  }
});

// Fit map to bounds when component is mounted
onMounted(() => {
  if (process.client) {
    nextTick(() => {
      if (map.value?.leafletObject && process.client) {
        const leafletMap = map.value.leafletObject;
        const bounds = L.latLngBounds(routePath.value);
        leafletMap.fitBounds(bounds, { padding: [50, 50] });
      }
    });
  }
});
</script>

<style lang="scss" scoped>
.route-map-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    color: #2d3748;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    font-size: 1.5rem;
    padding: 0.5rem;

    &:hover {
      color: #ef4444;
    }
  }
}

.map-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;

  .stat-item {
    flex: 1;
    text-align: center;
    padding: 0.5rem;
    border-right: 1px solid #e2e8f0;

    &:last-child {
      border-right: none;
    }

    span {
      display: block;
      font-size: 0.875rem;
      color: #64748b;
    }

    strong {
      display: block;
      font-size: 1.25rem;
      color: #1e293b;
    }
  }
}

.map-wrapper {
  flex: 1;
  min-height: 400px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.popup-content {
  h4 {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
  }

  p,
  ul {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #475569;
  }

  ul {
    padding-left: 1rem;
  }
}

.order-list {
  margin-top: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;

  h4 {
    margin: 0 0 1rem 0;
    color: #2d3748;
  }
}

.route-stops {
  .route-stop {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #e2e8f0;

    &:last-child {
      border-bottom: none;
    }

    .stop-marker {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #19ad7b;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: bold;
    }

    .stop-info {
      flex: 1;

      h5 {
        margin: 0 0 0.25rem 0;
        color: #1e293b;
      }

      p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
        color: #475569;
      }

      .distance-info {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;

        span {
          background: #e2e8f0;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;

    &.btn-accept {
      background: #19ad7b;
      color: white;

      &:hover {
        background: #158c65;
      }
    }

    &.btn-cancel {
      background: #f1f5f9;
      color: #64748b;

      &:hover {
        background: #e2e8f0;
      }
    }
  }
}
</style>

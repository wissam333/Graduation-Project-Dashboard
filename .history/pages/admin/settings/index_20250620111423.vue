<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة الإعدادات" : "Settings List" }}
        </h4>
      </div>
      <div class="options">
        <button class="action-btn btn-success" @click="fetchSittings()">
          <Icon class="icon" name="mdi:refresh" />
          {{ $i18n.locale === "ar" ? "إعادة تحميل" : "Reload" }}
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <div class="loading" v-if="loading">
        <img src="/loading/loadingNew.svg" alt="Loading..." />
      </div>
      <div v-else class="cat-table">
        <table>
          <thead>
            <tr>
              <th>
                {{ $i18n.locale === "ar" ? "السعر لكل كم" : "Price Per Km" }}
              </th>

              <th>
                {{
                  $i18n.locale === "ar" ? "نسبة السائق" : "Driver Percentage"
                }}
              </th>

              <th>
                {{ $i18n.locale === "ar" ? "تاريخ التعديل" : "Updated At" }}
              </th>

              <th>{{ $i18n.locale === "ar" ? "العمليات" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              v-for="sitting in filteredSittings"
              :key="sitting._id"
            >
              <td class="date-cell">
                <span class="badge">
                  {{ sitting.pricePerKm }}
                  {{ $i18n.locale === "ar" ? "ل.س" : "SP" }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ sitting?.driverPercentage }}
                  {{ $i18n.locale === "ar" ? "ل.س" : "SP" }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ formatDate(sitting.updatedAt) }}
                </span>
              </td>

              <td class="action-cell">
                <button
                  class="icon-btn edit-btn"
                  @click="openEditDialog(sitting)"
                >
                  <Icon class="icon" name="mdi:edit" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Edit Sitting Dialog -->
  <Dialog v-model:visible="editDialogVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="updateSitting()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "تعديل الجلسة" : "Edit Sitting" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="editSitting.pricePerKm"
              id="editPrice"
              type="number"
              autocomplete="off"
              :placeholder="
                $i18n.locale === 'ar' ? 'السعر لكل كم' : 'Price Per Km'
              "
              required
              class="form-input"
            />
            <label for="editPrice" class="form-label">
              {{ $i18n.locale === "ar" ? "السعر لكل كم" : "Price Per Km" }} *
            </label>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.prevent="closeEditDialog">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success" type="submit">
            {{ $t("Update") }}
          </button>
        </div>
      </form>
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize", "admin"],
});

const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

// State
const loading = ref(false);
const searchText = ref("");
const sittings = ref([]);

// Dialog states
const editDialogVisible = ref(false);

// Form data
const editSitting = ref({
  _id: "",
  pricePerKm: 0,
});

const filteredSittings = computed(() => {
  let filtered = [sittings.value];

  // Apply search filter
  if (searchText.value) {
    filtered = filtered.filter((sitting) =>
      sitting.pricePerKm.toString().includes(searchText.value)
    );
  }

  return filtered;
});

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const fetchSittings = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch(`${api.SittingsApi}`, {
      baseURL: apiBase,
      headers: {
        "accept-language": locale.value,
      },
    });
    sittings.value = data.value || [];
  } catch (error) {
    console.error("Error fetching sittings:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load sittings"
        : "فشل تحميل قائمة الجلسات"
    );
  } finally {
    loading.value = false;
  }
};

fetchSittings();

const closeEditDialog = () => {
  editDialogVisible.value = false;
};

const openEditDialog = (sitting) => {
  editSitting.value = {
    _id: sitting._id,
    pricePerKm: sitting.pricePerKm,
  };
  editDialogVisible.value = true;
};

const updateSitting = async () => {
  try {
    await useFetch(`${api.SittingsApi}`, {
      baseURL: apiBase,
      method: "PUT",
      body: {
        pricePerKm: editSitting.value.pricePerKm,
      },
    });

    $awn.success(
      locale.value === "en" ? "Updated successfully" : "تم التحديث بنجاح",
      { durations: { global: 5000 } }
    );

    closeEditDialog();
    await fetchSittings();
  } catch (error) {
    console.error("Error updating sitting:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to update sitting" : "فشل تحديث الجلسة"
    );
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

.cat-table {
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
    white-space: nowrap;
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
  display: flex;
  gap: 0.5rem;

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 1.25rem;
    }

    &.edit-btn {
      color: #64748b;

      &:hover {
        background-color: #f1f5f9;
        color: #19ad7b;
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

  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .input-group {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;

    .form-input {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #19ad7b;
      }
    }

    .form-label {
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
      }
    }
  }
}
</style>

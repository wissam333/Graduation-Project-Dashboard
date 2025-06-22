<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة المدراء" : "Managers List" }}
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
        <button class="action-btn btn-success" @click="visible = true">
          <Icon class="icon" name="mdi:add" />
          {{
            $i18n.locale === "ar" ? "إضافة مدير مطعم" : "Add Restaurant Manager"
          }}
        </button>
        <button class="action-btn btn-success" @click="getManagers()">
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
              <th>{{ $i18n.locale === "ar" ? "الاسم" : "Name" }}</th>
              <th>
                {{ $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "حالة الحساب" : "Account Status" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "يدير" : "Manages" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "تعديل" : "Edit" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              v-for="manager in filteredArray"
              :key="manager._id"
            >
              <td class="User-cell">
                <div class="User-avatar">
                  <img v-if="manager.img" :src="manager.img" />
                  <img v-else src="/logo/logo.png" alt="Default avatar" />
                </div>
                <div class="User-info">
                  <h5>{{ manager.username }}</h5>
                </div>
              </td>
              <td class="email-cell">{{ manager.email }}</td>
              <td class="status-cell">
                <span
                  :class="`status-badge ${
                    manager.is_active ? 'active' : 'inactive'
                  }`"
                >
                  {{
                    manager.is_active
                      ? $i18n.locale === "ar"
                        ? "نشط"
                        : "Active"
                      : $i18n.locale === "ar"
                      ? "غير نشط"
                      : "Inactive"
                  }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ manager?.restaurant ? manager.restaurant.name : "----" }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ manager.createdAt.slice(0, 10) }}
                </span>
              </td>
              <td class="action-cell">
                <button class="edit-btn" @click="openEditDialog(manager)">
                  <Icon class="icon" name="mdi:edit" />
                </button>

                <button
                  class="icon-btn delete-btn"
                  @click="
                    deleteModal = true;
                    deletedManager = manager;
                  "
                >
                  <Icon class="icon" name="mdi:delete-outline" />
                </button>

                <button
                  v-if="manager.restaurant"
                  class="icon-btn remove-btn"
                  @click="
                    removeRestaurantModal = true;
                    selectedManager = manager;
                  "
                  :title="
                    $i18n.locale === 'ar' ? 'إزالة المطعم' : 'Remove Restaurant'
                  "
                >
                  <Icon class="icon" name="mdi:link-off" />
                </button>

                <button
                  class="icon-btn status-btn"
                  @click="toggleManagerStatus(manager)"
                  :title="
                    manager.is_active
                      ? $i18n.locale === 'ar'
                        ? 'تعطيل الحساب'
                        : 'Deactivate'
                      : $i18n.locale === 'ar'
                      ? 'تفعيل الحساب'
                      : 'Activate'
                  "
                >
                  <Icon
                    class="icon"
                    :name="
                      manager.is_active
                        ? 'mdi:account-cancel'
                        : 'mdi:account-check'
                    "
                  />
                </button>
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
        "{{ deletedManager.username }}"{{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="deleteManager()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Remove Restaurant Confirmation Modal -->
  <ElementsAppModal
    :isOpen="removeRestaurantModal"
    @updateIsOpen="updateRemoveRestaurantModal"
  >
    <template #header>
      <h4>
        {{ $i18n.locale === "ar" ? "إزالة المطعم" : "Remove Restaurant" }}
      </h4>
    </template>
    <template #content>
      <p>
        {{
          $i18n.locale === "ar"
            ? "هل أنت متأكد من أنك تريد إزالة المطعم من"
            : "Are you sure you want to remove the restaurant from"
        }}
        "{{ selectedManager.username }}"{{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="removeRestaurantModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="removeRestaurantFromManager()">
        {{ $t("Remove") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Add Manager Dialog -->
  <Dialog v-model:visible="visible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="addManager()"
      >
        <h5 class="dialog-title">
          {{
            $i18n.locale === "ar" ? "إضافة مدير مطعم" : "Add Restaurant Manager"
          }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="username"
              id="username"
              type="text"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'الاسم' : 'Username'"
              required
              class="form-input"
            />
            <label for="username" class="form-label">
              {{ $i18n.locale === "ar" ? "الاسم" : "Username" }} *
            </label>
          </div>

          <div class="input-group">
            <input
              v-model="email"
              id="email"
              type="email"
              autocomplete="off"
              :placeholder="
                $i18n.locale === 'ar' ? 'البريد الإلكتروني' : 'Email'
              "
              title="Enter only letters and spaces"
              required
              class="form-input"
            />
            <label for="email" class="form-label">
              {{ $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email" }} *
            </label>
          </div>

          <div class="input-group">
            <input
              v-model="password"
              id="password"
              type="password"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'كلمة السر' : 'Password'"
              required
              class="form-input"
            />
            <label for="password" class="form-label">
              {{ $i18n.locale === "ar" ? "كلمة السر" : "Password" }} *
            </label>
          </div>

          <div class="input-group">
            <label class="form-label">
              {{ $i18n.locale === "ar" ? "المطعم" : "Restaurant" }} *
            </label>
            <Select
              v-model="selectedResta"
              :options="restaurants"
              :placeholder="
                $i18n.locale === 'ar' ? 'اختار مطعم' : 'Select A Restaurant'
              "
              class="w-full md:w-56 select"
              required
            >
              <template #option="slotProps">
                <div
                  class="d-flex align-items-center"
                  :class="$i18n.locale === 'ar' ? 'selectAr' : ''"
                >
                  <div>
                    {{
                      $i18n.locale === "ar"
                        ? slotProps.option.name
                        : slotProps.option.name
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
                          ? slotProps.value.name
                          : slotProps.value.name
                      }}
                    </div>
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Select>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.prevent="closeCallback">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success" autofocus>
            {{ $t("Add") }}
          </button>
        </div>
      </form>
    </template>
  </Dialog>

  <!-- Edit Manager Dialog -->
  <Dialog v-model:visible="editVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="updateManager()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "تعديل مدير" : "Edit Manager" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="editUsername"
              id="editUsername"
              type="text"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'الاسم' : 'Username'"
              required
              class="form-input"
            />
            <label for="editUsername" class="form-label">
              {{ $i18n.locale === "ar" ? "الاسم" : "Username" }} *
            </label>
          </div>

          <div class="input-group">
            <input
              v-model="editEmail"
              id="editEmail"
              type="email"
              autocomplete="off"
              :placeholder="
                $i18n.locale === 'ar' ? 'البريد الإلكتروني' : 'Email'
              "
              title="Enter only letters and spaces"
              required
              class="form-input"
            />
            <label for="editEmail" class="form-label">
              {{ $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email" }} *
            </label>
          </div>

          <div class="input-group">
            <input
              v-model="editPassword"
              id="editPassword"
              type="password"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'كلمة السر' : 'Password'"
              class="form-input"
            />
            <label for="editPassword" class="form-label">
              {{ $i18n.locale === "ar" ? "كلمة السر" : "Password" }}
              ({{ $i18n.locale === "ar" ? "اختياري" : "Optional" }})
            </label>
          </div>

          <div class="input-group">
            <label class="form-label">
              {{ $i18n.locale === "ar" ? "المطعم" : "Restaurant" }}
            </label>
            <Select
              v-model="editSelectedResta"
              :options="restaurants"
              :placeholder="
                $i18n.locale === 'ar' ? 'اختار مطعم' : 'Select A Restaurant'
              "
              class="w-full md:w-56 select"
            >
              <template #option="slotProps">
                <div
                  class="d-flex align-items-center"
                  :class="$i18n.locale === 'ar' ? 'selectAr' : ''"
                >
                  <div>
                    {{
                      $i18n.locale === "ar"
                        ? slotProps.option.name
                        : slotProps.option.name
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
                          ? slotProps.value.name
                          : slotProps.value.name
                      }}
                    </div>
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Select>
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
</template>

<script setup>
import * as XLSX from "xlsx";
const {
  public: { api, apiBase },
} = useRuntimeConfig();
definePageMeta({
  middleware: ["not-authorize", "admin"],
});
const { locale } = useI18n();
const { $awn } = useNuxtApp();

const visible = ref(false);
const deletedManager = ref({});
const deleteModal = ref(false);
const searchText = ref("");
const loading = ref(false);
const managers = ref([]);
const email = ref("");
const username = ref("");
const password = ref("");
let selectedResta = ref();
let editSelectedResta = ref();

const updateDeleteModal = (value) => {
  deleteModal.value = value;
};
const { data: restaurants } = await useFetch(`${api.RestaurantsApi}`, {
  baseURL: apiBase,
});

const filteredArray = computed(() => {
  return managers.value?.filter((manager) =>
    manager.username.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const getManagers = async () => {
  loading.value = true;
  try {
    const { data: managersData } = await useFetch(`${api.UsersApi}?role=2`, {
      baseURL: apiBase,
      headers: {
        "accept-language": locale.value,
      },
    });

    if (managersData.value) {
      managers.value = managersData.value;
    }
  } catch (error) {
    console.error("Error fetching managers:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load managers"
        : "فشل تحميل قائمة المدراء"
    );
  } finally {
    loading.value = false;
  }
};

// Initial data fetch
getManagers();

const deleteManager = async () => {
  try {
    await useFetch(`${api.UsersApi}/${deletedManager.value._id}`, {
      baseURL: apiBase,
      method: "DELETE",
    });

    await getManagers();
    deleteModal.value = false;

    $awn.success(
      locale.value === "en"
        ? "Manager Deleted Successfully"
        : "تم حذف المدير بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error deleting manager:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to delete manager" : "فشل حذف المدير"
    );
  }
};

const addManager = async () => {
  try {
    await useFetch(api.CreateManager, {
      baseURL: apiBase,
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
        email: email.value,
        restaurantId: selectedResta.value._id,
      },
    });

    // Reset form
    username.value = "";
    password.value = "";
    email.value = "";
    visible.value = false;
    selectedResta.value = null;

    await getManagers();

    $awn.success(
      locale.value === "en" ? "Added Successfully" : "تم الإضافة بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error adding manager:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to add restaurant manager"
        : "فشل إضافة مدير المطعم"
    );
  }
};

// Add these to your existing refs
const removeRestaurantModal = ref(false);
const selectedManager = ref({});

const updateRemoveRestaurantModal = (value) => {
  removeRestaurantModal.value = value;
};

const removeRestaurantFromManager = async () => {
  try {
    await useFetch(
      `/api/restaurant/removeRestaurantFromManager/${selectedManager.value._id}`,
      {
        baseURL: apiBase,
        method: "Delete",
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    await getManagers();
    removeRestaurantModal.value = false;

    $awn.success(
      locale.value === "en"
        ? "Restaurant removed successfully"
        : "تمت إزالة المطعم بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error removing restaurant:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to remove restaurant" : "فشل إزالة المطعم"
    );
  }
};

// Edit functionality
const editVisible = ref(false);
const editUsername = ref("");
const editEmail = ref("");
const editPassword = ref("");
const currentManagerId = ref("");

const openEditDialog = (manager) => {
  currentManagerId.value = manager._id;
  editUsername.value = manager.username;
  editEmail.value = manager.email;
  editPassword.value = "";
  editSelectedResta.value = manager.restaurant || null;
  editVisible.value = true;
};

const updateManager = async () => {
  try {
    const body = {
      username: editUsername.value,
      email: editEmail.value,
    };

    // Only include password if it's provided
    if (editPassword.value) {
      body.password = editPassword.value;
    }

    // Only include restaurant if it's provided
    if (editSelectedResta.value) {
      body.restaurantId = editSelectedResta.value._id;
    }

    await useFetch(`${api.UsersApi}/${currentManagerId.value}`, {
      baseURL: apiBase,
      method: "PUT",
      body: body,
      headers: {
        token: `Bearer ${useUserInfo().value.accessToken}`,
      },
    });

    // Reset form
    editUsername.value = "";
    editEmail.value = "";
    editPassword.value = "";
    editVisible.value = false;
    editSelectedResta.value = null;

    await getManagers();

    $awn.success(
      locale.value === "en" ? "Updated Successfully" : "تم التحديث بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error updating manager:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to update manager" : "فشل تحديث المدير"
    );
  }
};

const toggleManagerStatus = async (manager) => {
  try {
    await useFetch(`${api.UsersApi}/toggle-status/${manager._id}`, {
      baseURL: apiBase,
      method: "PUT",
      headers: {
        "accept-language": locale.value,
      },
    });

    await getManagers();

    $awn.success(
      locale.value === "en"
        ? "Status updated successfully"
        : "تم تحديث الحالة بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error toggling manager status:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to update status"
        : "فشل تحديث حالة المدير"
    );
  }
};

const exportToExcel = () => {
  const filteredData = filteredArray.value;
  const data =
    locale.value === "en"
      ? filteredData.map((manager) => ({
          username: manager.username,
          Email: manager.email,
          Status: manager.is_active ? "Active" : "Inactive",
          Restaurant: manager?.restaurant?.name || "Not assigned",
          Created_at: manager.createdAt?.slice(0, 10) || "",
        }))
      : filteredData.map((manager) => ({
          اسم_المستخدم: manager.username,
          البريد_الإلكتروني: manager.email,
          الحالة: manager.is_active ? "نشط" : "غير نشط",
          المطعم: manager?.restaurant?.name || "غير معين",
          تاريح_الإنشاء: manager.createdAt?.slice(0, 10) || "",
        }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Managers");
  XLSX.writeFile(workbook, "Managers.xlsx");
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
    white-space: nowrap;
  }
}

.User-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.User-avatar {
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.User-info {
  h5 {
    margin: 0;
    font-weight: 500;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
}

.email-cell {
  font-weight: 500;
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
  .remove-btn {
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
      color: #f97316;
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
  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    color: #64748b;

    &:hover {
      background-color: #f1f5f9;
      color: #ef4444;
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
    display: flex;
    flex-direction: column-reverse;
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

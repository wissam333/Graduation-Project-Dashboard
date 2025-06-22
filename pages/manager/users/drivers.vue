<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة السائقين" : "Drivers List" }}
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
          {{ $i18n.locale === "ar" ? "إضافة سائق" : "Add Driver" }}
        </button>
        <button class="action-btn btn-success" @click="getDrivers()">
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
                {{ $i18n.locale === "ar" ? "المطعم" : "Restaurant" }}
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
              v-for="driver in filteredDrivers"
              :key="driver._id"
            >
              <td class="User-cell">
                <div class="User-avatar">
                  <img v-if="driver.img" :src="driver.img" />
                  <img v-else src="/logo/logo.png" alt="Default avatar" />
                </div>
                <div class="User-info">
                  <h5>{{ driver.username }}</h5>
                </div>
              </td>
              <td class="email-cell">{{ driver.email }}</td>
              <td class="date-cell">
                <span class="badge">
                  {{ driver?.restaurant ? driver.restaurant.name : "----" }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ driver.createdAt.slice(0, 10) }}
                </span>
              </td>
              <td class="action-cell">
                <button class="edit-btn" @click="openEditDialog(driver)">
                  <Icon class="icon" name="mdi:edit" />
                </button>

                <button
                  v-if="driver.restaurant"
                  class="icon-btn remove-btn"
                  @click="
                    removeRestaurantModal = true;
                    selectedDriver = driver;
                  "
                  :title="
                    $i18n.locale === 'ar'
                      ? 'إزالة من المطعم'
                      : 'Remove From Restaurants'
                  "
                >
                  <Icon class="icon" name="mdi:link-off" />
                </button>

                <button
                  class="icon-btn delete-btn"
                  @click="
                    deleteModal = true;
                    deletedDriver = driver;
                  "
                >
                  <Icon class="icon" name="mdi:delete-outline" />
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
        "{{ deletedDriver.username }}"{{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="deleteDriver()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Add Driver Dialog -->
  <Dialog v-model:visible="visible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="addDriver()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "إضافة سائق" : "Add Driver" }}
        </h5>

        <!-- Radio button toggle -->
        <div class="toggle-container">
          <label class="toggle-option">
            <input
              type="radio"
              v-model="driverOption"
              value="new"
              class="toggle-input"
            />
            <span class="toggle-label">
              {{ $i18n.locale === "ar" ? "سائق جديد" : "New Driver" }}
            </span>
          </label>
          <label class="toggle-option">
            <input
              type="radio"
              v-model="driverOption"
              value="existing"
              class="toggle-input"
            />
            <span class="toggle-label">
              {{ $i18n.locale === "ar" ? "مستخدم موجود" : "Existing User" }}
            </span>
          </label>
        </div>

        <!-- New Driver Form (shown when driverOption === 'new') -->
        <div class="dialog-content" v-if="driverOption === 'new'">
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
        </div>

        <!-- Existing User Form (shown when driverOption === 'existing') -->
        <div class="dialog-content" v-else>
          <div class="input-group">
            <input
              v-model="searchUser"
              id="searchUser"
              type="text"
              autocomplete="off"
              :placeholder="
                $i18n.locale === 'ar' ? 'ابحث عن مستخدم' : 'Search user'
              "
              class="form-input"
              @input="searchExistingUsers"
            />
            <label for="searchUser" class="form-label">
              {{ $i18n.locale === "ar" ? "البحث عن مستخدم" : "Search user" }} *
            </label>
          </div>

          <div class="user-list" v-if="filteredUsers.length > 0">
            <div
              class="user-item"
              v-for="user in filteredUsers"
              :key="user._id"
              @click="selectUser(user)"
              :class="{ selected: selectedUser?._id === user._id }"
            >
              <div class="user-info">
                <h6>{{ user.username }}</h6>
                <p>{{ user.email }}</p>
              </div>
            </div>
          </div>
          <div class="no-results" v-else>
            {{ $i18n.locale === "ar" ? "لا توجد نتائج" : "No results found" }}
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.prevent="closeCallback">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success" autofocus>
            {{ driverOption === "new" ? $t("Add") : $t("Assign") }}
          </button>
        </div>
      </form>
    </template>
  </Dialog>

  <!-- Edit Driver Dialog -->
  <Dialog v-model:visible="editVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="updateDriver()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "تعديل سائق" : "Edit Driver" }}
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
        "{{ selectedDriver.username }}"{{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="removeRestaurantModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="removeRestaurantFromDriver()">
        {{ $t("Remove") }}
      </button>
    </template>
  </ElementsAppModal>
</template>

<script setup>
import * as XLSX from "xlsx";
const {
  public: { api, apiBase },
} = useRuntimeConfig();
definePageMeta({
  middleware: ["not-authorize", "manager"],
});
const { locale } = useI18n();
const { $awn } = useNuxtApp();

const visible = ref(false);
const deletedDriver = ref({});
const deleteModal = ref(false);
const searchText = ref("");
const loading = ref(false);
const Drivers = ref([]);
const email = ref("");
const username = ref("");
const password = ref("");

// Add these new refs
const driverOption = ref("new"); // 'new' or 'existing'
const searchUser = ref("");
const filteredUsers = ref([]);
const selectedUser = ref(null);
const allUsers = ref([]);

const { data: restaurants } = await useFetch(`${api.RestaurantsApi}`, {
  baseURL: apiBase,
});

const filteredDrivers = computed(() => {
  return Drivers.value?.filter((driver) =>
    driver.username.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

// Add this method to search existing users
const searchExistingUsers = async () => {
  if (searchUser.value.length < 2) {
    filteredUsers.value = [];
    return;
  }

  try {
    const { data } = await useFetch(
      `${api.UsersApi}?search=${searchUser.value}`,
      {
        baseURL: apiBase,
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    if (data.value) {
      // Filter out users who are already drivers
      filteredUsers.value = data.value.filter(
        (user) => user.role !== "3" || !user.restaurantId
      );
    }
  } catch (error) {
    console.error("Error searching users:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to search users"
        : "فشل البحث عن المستخدمين"
    );
  }
};

// Add this method to select a user from the list
const selectUser = (user) => {
  selectedUser.value = user;
};

const updateDeleteModal = (value) => {
  deleteModal.value = value;
};

const removeRestaurantModal = ref(false);
const selectedDriver = ref({});

const updateRemoveRestaurantModal = (value) => {
  removeRestaurantModal.value = value;
};

const getDrivers = async () => {
  loading.value = true;
  try {
    const { data: UsersData } = await useFetch(
      `${api.UsersApi}?role=3&restaurantId=${useUserInfo().value.restaurantId}`,
      {
        baseURL: apiBase,
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    if (UsersData.value) {
      Drivers.value = UsersData.value;
    }
  } catch (error) {
    console.error("Error fetching Drivers:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load Drivers"
        : "فشل تحميل قائمة السائقين"
    );
  } finally {
    loading.value = false;
  }
};

getDrivers();

const removeRestaurantFromDriver = async () => {
  try {
    await useFetch(
      `${apiBase}/api/restaurant/removeRestaurantFromDriver/${selectedDriver.value._id}`,
      {
        method: "Delete",
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    await getDrivers();
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

const deleteDriver = async () => {
  try {
    await useFetch(`${api.UsersApi}/${deletedDriver.value._id}`, {
      baseURL: apiBase,
      method: "DELETE",
    });

    await getDrivers();
    deleteModal.value = false;

    $awn.success(
      locale.value === "en"
        ? "Driver Deleted Successfully"
        : "تم حذف السائق بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error deleting Driver:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to delete Driver" : "فشل حذف السائق"
    );
  }
};

// Update the addDriver function to handle both cases
const addDriver = async () => {
  try {
    const restaurantId = useUserInfo().value.restaurantId;

    if (driverOption.value === "new") {
      // Existing new driver creation logic
      await useFetch(api.CreateDriver, {
        baseURL: apiBase,
        method: "POST",
        body: {
          username: username.value,
          password: password.value,
          email: email.value,
          restaurantId: restaurantId,
        },
      });
    } else {
      // Assign existing user as driver
      if (!selectedUser.value) {
        throw new Error(
          locale.value === "en"
            ? "Please select a user"
            : "الرجاء اختيار مستخدم"
        );
      }

      await useFetch(`${api.RestaurantsApi}/assignDriverToRestaurant`, {
        method: "POST",
        baseURL: apiBase,
        body: {
          restaurantId: restaurantId,
          userId: selectedUser.value._id,
        },
        headers: {
          "accept-language": locale.value,
        },
      });
    }

    // Reset form
    username.value = "";
    password.value = "";
    email.value = "";
    searchUser.value = "";
    selectedUser.value = null;
    filteredUsers.value = [];
    visible.value = false;

    await getDrivers();

    $awn.success(
      locale.value === "en"
        ? "Operation completed successfully"
        : "تمت العملية بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error:", error);
    $awn.alert(
      locale.value === "en"
        ? error.message || "Failed to complete operation"
        : error.message || "فشل إتمام العملية"
    );
  }
};

// Edit functionality
const editVisible = ref(false);
const editUsername = ref("");
const editEmail = ref("");
const editPassword = ref("");
const currentDriverId = ref("");

const openEditDialog = (driver) => {
  currentDriverId.value = driver._id;
  editUsername.value = driver.username;
  editEmail.value = driver.email;
  editPassword.value = "";
  editVisible.value = true;
};

const updateDriver = async () => {
  try {
    const body = {
      username: editUsername.value,
      email: editEmail.value,
    };

    if (editPassword.value) {
      body.password = editPassword.value;
    }

    await useFetch(`${api.UsersApi}/${currentDriverId.value}`, {
      baseURL: apiBase,
      method: "PUT",
      body: body,
      headers: {
        token: `Bearer ${useUserInfo().value.accessToken}`,
      },
    });

    editUsername.value = "";
    editEmail.value = "";
    editPassword.value = "";
    editVisible.value = false;

    await getDrivers();

    $awn.success(
      locale.value === "en" ? "Updated Successfully" : "تم التحديث بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error updating driver:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to update driver" : "فشل تحديث السائق"
    );
  }
};

const exportToExcel = () => {
  const filteredData = filteredDrivers.value;
  const data =
    locale.value === "en"
      ? filteredData.map((driver) => ({
          username: driver.username,
          Email: driver.email,
          role: "Driver",
          Created_at: driver.createdAt?.slice(0, 10) || "",
        }))
      : filteredData.map((driver) => ({
          اسم_المستخدم: driver.username,
          البريد_الإلكتروني: driver.email,
          الصلاحية: "سائق",
          تاريح_الإنشاء: driver.createdAt?.slice(0, 10) || "",
        }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
  XLSX.writeFile(workbook, "Drivers.xlsx");
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

.toggle-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }

  .toggle-input {
    margin: 0;
  }

  .toggle-label {
    font-weight: 500;
    color: #334155;
  }
}

.user-list {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;

  &:hover {
    background-color: #f8fafc;
  }

  &.selected {
    background-color: #e0f2fe;
  }

  &:last-child {
    border-bottom: none;
  }
}

.user-info {
  h6 {
    margin: 0;
    font-weight: 500;
    color: #1e293b;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #64748b;
  }
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: #64748b;
  font-style: italic;
}
</style>

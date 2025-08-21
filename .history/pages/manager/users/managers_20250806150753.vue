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

        <button class="action-btn btn-success" @click="visible2 = true">
          <Icon class="icon" name="mdi:add" />
          {{
            $i18n.locale === "ar" ? "إضافة مدير مطعم" : "Add Restaurant Manager"
          }}
        </button>

        <button class="action-btn btn-success" @click="getUsers()">
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
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "تعديل" : "Edit" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              v-for="(user, index) in filteredArray"
              :key="user._id"
            >
              <td class="User-cell">
                <div class="User-avatar">
                  <img v-if="user.img" :src="user.img" />
                  <img v-else src="/logo/logo.png" alt="Default avatar" />
                </div>
                <div class="User-info">
                  <h5>{{ user.username }}</h5>
                </div>
              </td>
              <td class="email-cell">{{ user.email }}</td>

              <td class="date-cell">
                <span class="badge">
                  {{ user.createdAt.slice(0, 10) }}
                </span>
              </td>
              <td class="action-cell">
                <button class="edit-btn" @click="openEditDialog(user)">
                  <Icon class="icon" name="mdi:edit" />
                </button>

                <button
                  v-if="user.restaurant && user._id != useUserInfo().value._id"
                  class="icon-btn remove-btn"
                  @click="
                    removeRestaurantModal = true;
                    selectedManager = user;
                  "
                  :title="
                    $i18n.locale === 'ar'
                      ? 'إزالة المطعم'
                      : 'Remove Restaurants'
                  "
                >
                  <Icon class="icon" name="mdi:link-off" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

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

  <!-- Add Driver Dialog -->
  <Dialog v-model:visible="visible3" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="addDriver()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "إضافة سائق" : "Add Driver" }}
        </h5>
        <div class="dialog-content">
          <!-- Same fields as manager dialog -->
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

          <!-- Add any driver-specific fields here if needed -->
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

  <!-- Add Manager Dialog -->
  <Dialog v-model:visible="visible2" modal :style="{ width: '50rem' }">
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

        <!-- Radio button toggle -->
        <div class="toggle-container">
          <label class="toggle-option">
            <input
              type="radio"
              v-model="managerOption"
              value="new"
              class="toggle-input"
            />
            <span class="toggle-label">
              {{ $i18n.locale === "ar" ? "مدير جديد" : "New Manager" }}
            </span>
          </label>
          <label class="toggle-option">
            <input
              type="radio"
              v-model="managerOption"
              value="existing"
              class="toggle-input"
            />
            <span class="toggle-label">
              {{ $i18n.locale === "ar" ? "مستخدم موجود" : "Existing User" }}
            </span>
          </label>
        </div>

        <!-- New Manager Form (shown when managerOption === 'new') -->
        <div class="dialog-content" v-if="managerOption === 'new'">
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

        <!-- Existing User Form (shown when managerOption === 'existing') -->
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
            {{ managerOption === "new" ? $t("Add") : $t("Assign") }}
          </button>
        </div>
      </form>
    </template>
  </Dialog>

  <!-- Edit User Dialog -->
  <Dialog v-model:visible="editVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="updateUser()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "تعديل مستخدم" : "Edit User" }}
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
</template>

<script setup>
import * as XLSX from "xlsx"; // Import XLSX for Excel export
definePageMeta({
  middleware: ["not-authorize", "manager"],
});
const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

const visible2 = ref(false);
const visible3 = ref(false);
const searchText = ref("");
const loading = ref(false);
const Users = ref([]);
const email = ref("");
const username = ref("");
const password = ref("");

const filteredArray = computed(() => {
  return Users.value?.filter((item) =>
    item.username.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const getUsers = async () => {
  loading.value = true;
  try {
    const { data: UsersData } = await useFetch(
      `${api.UsersApi}?restaurantId=${useUserInfo().value.restaurantId}&role=2`,
      {
        baseURL: apiBase,
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    if (UsersData.value) {
      Users.value = UsersData.value;
    }
  } catch (error) {
    console.error("Error fetching Users:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to load Users" : "فشل تحميل قائمة الزبائن"
    );
  } finally {
    loading.value = false;
  }
};

// Initial data fetch
getUsers();

// Add these new refs
const managerOption = ref("new"); // 'new' or 'existing'
const searchUser = ref("");
const filteredUsers = ref([]);
const selectedUser = ref(null);
const allUsers = ref([]);

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
      // Filter out users who are already managers
      filteredUsers.value = data.value.filter(
        (user) => user.role !== "2" || !user.restaurantId
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

// Modify your addManager function to handle both cases
const addManager = async () => {
  try {
    const restaurantId = useUserInfo().value.restaurantId;

    if (managerOption.value === "new") {
      // Existing new manager creation logic
      await useFetch(api.CreateManager, {
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
      // Assign existing user as manager
      if (!selectedUser.value) {
        throw new Error(
          locale.value === "en"
            ? "Please select a user"
            : "الرجاء اختيار مستخدم"
        );
      }

      await useFetch(`${api.RestaurantsApi}/assignManagerToRestaurant`, {
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
    visible2.value = false;

    await getUsers();

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

const addDriver = async () => {
  try {
    await useFetch(api.CreateDriver, {
      // Make sure to add this to your API config
      baseURL: apiBase,
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
        email: email.value,
        // Add any driver-specific fields here
      },
    });

    // Reset form
    username.value = "";
    password.value = "";
    email.value = "";
    visible3.value = false;

    await getUsers();

    $awn.success(
      locale.value === "en"
        ? "Driver Added Successfully"
        : "تم إضافة السائق بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error adding driver:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to add driver" : "فشل إضافة السائق"
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
      `${apiBase}/api/restaurant/removeRestaurantFromManager/${selectedManager.value._id}`,
      {
        method: "Delete",
        headers: {
          "accept-language": locale.value,
        },
      }
    );

    await getUsers();
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

// edit
// Add these new refs for edit functionality
const editVisible = ref(false);
const editUsername = ref("");
const editEmail = ref("");
const editPassword = ref("");
const currentUserId = ref("");

// Add this method to open the edit dialog
const openEditDialog = (user) => {
  currentUserId.value = user._id;
  editUsername.value = user.username;
  editEmail.value = user.email;
  editPassword.value = "";
  editVisible.value = true;
};

// Add this method to update the user
const updateUser = async () => {
  try {
    const body = {
      username: editUsername.value,
      email: editEmail.value,
    };

    // Only include password if it's provided
    if (editPassword.value) {
      body.password = editPassword.value;
    }

    // Only include restaurants if it's provided
    if (editSelectedResta.value) {
      body.restaurantId = editSelectedResta.value._id;
    }

    await useFetch(`${api.UsersApi}/${currentUserId.value}`, {
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
    editSelectedResta.value = "";

    await getUsers();

    $awn.success(
      locale.value === "en" ? "Updated Successfully" : "تم التحديث بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to update user" : "فشل تحديث المستخدم"
    );
  }
};

const exportToExcel = () => {
  const filteredData = filteredArray.value.filter((e) => !e.is_admin);
  const data =
    locale.value === "en"
      ? filteredData.map((user) => ({
          username: user.username,
          Email: user.email,
          Created_at: user.createdAt?.slice(0, 10) || "",
        }))
      : filteredData.map((user) => ({
          اسم_المستخدم: user.username,
          البريد_الإلكتروني: user.email,
          تاريح_الإنشاء: user.createdAt?.slice(0, 10) || "",
        }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  XLSX.writeFile(workbook, "Users.xlsx");
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

.user-avatar {
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
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

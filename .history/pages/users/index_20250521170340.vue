<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة المستخدمين" : "Users List" }}
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
          <Icon name="material-symbols:search" class="search-icon icon" />
        </div>
        <button class="action-btn btn-success" @click="visible = true">
          <Icon class="icon" name="material-symbols:add" />
          {{ $i18n.locale === "ar" ? "إضافة مستخدم" : "Add User" }}
        </button>
        <button class="action-btn btn-success" @click="visible2 = true">
          <Icon class="icon" name="material-symbols:add" />
          {{
            $i18n.locale === "ar" ? "إضافة مدير مطعم" : "Add Restaurant Manager"
          }}
        </button>
        <button class="action-btn btn-success" @click="getUsers()">
          <Icon class="icon" name="material-symbols:refresh" />
          {{ $i18n.locale === "ar" ? "إعادة تحميل" : "Reload" }}
        </button>
        <button class="action-btn btn-success" @click="exportToExcel">
          <Icon class="icon" name="material-symbols:download" />
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
                {{ $i18n.locale === "ar" ? "الصلاحية" : "Role" }}
              </th>
              <th>
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "تعديل" : "Edit" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-row" v-for="user in filteredArray" :key="user._id">
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
              <td class="email-cell">{{ user.role }}</td>
              <td class="date-cell">
                <span class="badge">
                  {{ user.createdAt.slice(0, 10) }}
                </span>
              </td>
              <td class="action-cell">
                <button
                  class="icon-btn delete-btn"
                  @click="
                    deleteModal = true;
                    deleteUser = user;
                  "
                >
                  <Icon class="icon" name="material-symbols:delete-outline" />
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
        "{{ deleteUser.username }}"{{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="DeleteUser()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Add User Dialog -->
  <Dialog v-model:visible="visible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="addUser()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "إضافة مستخدم" : "Add User" }}
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
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.stop="closeCallback">
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

          <Select
            v-model="selectedResta"
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
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.stop="closeCallback">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success" autofocus>
            {{ $t("Add") }}
          </button>
        </div>
      </form>
    </template>
  </Dialog>
</template>

<script setup>
import * as XLSX from "xlsx"; // Import XLSX for Excel export
const {
  public: { api, apiBase },
} = useRuntimeConfig();
definePageMeta({
  middleware: ["not-authorize"],
});

const { locale } = useI18n();
const { $awn } = useNuxtApp();

const visible = ref(false);
const visible2 = ref(false);
const deleteUser = ref({});
const deleteModal = ref(false);
const searchText = ref("");
const loading = ref(false);
const Users = ref([]);
const email = ref("");
const username = ref("");
const password = ref("");
let selectedResta = ref();

const updateDeleteModal = (value) => {
  deleteModal.value = value;
};
const { data: restaurants } = await useFetch(`${api.RestaurantsApi}`, {
  baseURL: apiBase,
});

const filteredArray = computed(() => {
  return Users.value?.filter((item) =>
    item.username.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const getUsers = async () => {
  loading.value = true;
  try {
    const { data: UsersData } = await useFetch(`${api.UsersApi}`, {
      baseURL: apiBase,
      headers: {
        "accept-language": locale.value,
      },
    });

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

const DeleteUser = async () => {
  try {
    await useFetch(`${api.UsersApi}/${deleteUser.value._id}`, {
      baseURL: apiBase,
      method: "DELETE",
    });

    await getUsers();
    deleteModal.value = false;

    $awn.success(
      locale.value === "en"
        ? "User Deleted Successfully"
        : "تم حذف المستخدم بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error deleting User:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to delete User" : "فشل حذف المستخدم"
    );
  }
};

const addUser = async () => {
  try {
    await useFetch(api.CreateUser, {
      baseURL: apiBase,
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
        email: email.value,
      },
    });

    // Reset form
    username.value = "";
    password.value = "";
    email.value = "";
    visible.value = false;

    await getUsers();

    $awn.success(
      locale.value === "en" ? "Added Successfully" : "تم الإضافة بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error adding User:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to add User" : "فشل إضافة المستخدم"
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
    visible2.value = false;
    selectedResta.value = null;

    await getUsers();

    $awn.success(
      locale.value === "en" ? "Added Successfully" : "تم الإضافة بنجاح",
      { durations: { global: 5000 } }
    );
  } catch (error) {
    console.error("Error adding User:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to add restaurant manager"
        : "فشل إضافة مدير المطعم"
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
          role:
            user.role == 0
              ? "Admin"
              : user.role == 1
              ? "User"
              : "Restaurant Manager",
          Created_at: user.createdAt?.slice(0, 10) || "",
        }))
      : filteredData.map((user) => ({
          اسم_المستخدم: user.username,
          البريد_الإلكتروني: user.email,
          الصلاحية:
            user.role == 0 ? "ادمن" : user.role == 1 ? "مستخدم" : "مدير مطعم",
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

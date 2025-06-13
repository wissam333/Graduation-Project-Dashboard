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
          <Icon name="material-symbols:search" class="search-icon" />
        </div>
        <button class="action-btn btn-success" @click="visible = true">
          <Icon name="material-symbols:add" />
          {{ $i18n.locale === "ar" ? "إضافة" : "Add" }}
        </button>
        <button class="action-btn btn-success" @click="getUsers()">
          <Icon name="material-symbols:refresh" />
          {{ $i18n.locale === "ar" ? "إعادة تحميل" : "Reload" }}
        </button>
        <button class="action-btn btn-success" @click="exportToExcel">
          <Icon name="material-symbols:download" />
          {{ $i18n.locale === "ar" ? "تصدير" : "Export" }}
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <div class="loading" v-if="loading">
        <img src="/loading/loadingNew.svg" alt="Loading..." />
      </div>
      <div v-else class="product-table">
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
              v-for="product in filteredArray"
              :key="product.id"
              v-show="!product.is_admin"
            >
              <td class="User-cell">
                <div class="User-avatar">
                  <img
                    v-if="product.thumbnail"
                    :src="product.thumbnail"
                    :alt="product.firstName"
                  />
                  <img v-else src="/logo/logo.png" alt="Default avatar" />
                </div>
                <div class="User-info">
                  <h5>{{ product.firstName }}</h5>
                  <h5>{{ product.lastName }}</h5>
                </div>
              </td>
              <td class="email-cell">{{ product.email }}</td>
              <td class="date-cell">
                <span class="badge">
                  {{ product.created_at?.slice(0, 10) }}
                </span>
              </td>
              <td class="action-cell">
                <button
                  class="icon-btn delete-btn"
                  @click="
                    deleteModal = true;
                    deleteUser = product;
                  "
                >
                  <Icon name="material-symbols:delete-outline" />
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
        "{{ deleteUser.firstName + " " + deleteUser.lastName }}"{{
          $i18n.locale === "ar" ? "؟" : "?"
        }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="DeleteCat()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Add User Dialog -->
  <Dialog v-model:visible="visible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <div class="dialog" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "إضافة زبون" : "Add User" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="firstName"
              id="firstName"
              type="text"
              autocomplete="off"
              :placeholder="
                $i18n.locale === 'ar' ? 'الاسم الاول' : 'First Name'
              "
              required
              class="form-input"
            />
            <label for="firstName" class="form-label">
              {{ $i18n.locale === "ar" ? "الاسم الاول" : "First Name" }} *
            </label>
          </div>

          <div class="input-group">
            <input
              v-model="lastName"
              id="lastName"
              type="text"
              autocomplete="off"
              :placeholder="
                $i18n.locale === 'ar' ? 'الاسم الاخير' : 'Last Name'
              "
              title="Enter only letters and spaces"
              required
              class="form-input"
            />
            <label for="lastName" class="form-label">
              {{ $i18n.locale === "ar" ? "الاسم الاخير" : "Last Name" }} *
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
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="closeCallback">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success" @click="addUser()" autofocus>
            {{ $t("Add") }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

const visible = ref(false);
const deleteUser = ref({});
const deleteModal = ref(false);
const searchText = ref("");
const loading = ref(false);
const Users = ref([]);
const email = ref("");
const firstName = ref("");
const lastName = ref("");

const updateDeleteModal = (value) => {
  deleteModal.value = value;
};

const filteredArray = computed(() => {
  return Users.value?.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const getUsers = async () => {
  loading.value = true;
  try {
    const { data: UsersData } = await useFetch(`${api.GetAllUsers}`, {
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
onMounted(() => {
  getUsers();
});

const DeleteCat = async () => {
  try {
    await useFetch(`${api.DeleteUser}/${deleteUser.value.id}`, {
      credentials: "include",
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
      credentials: "include",
      method: "POST",
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      },
    });

    // Reset form
    firstName.value = "";
    lastName.value = "";
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

const exportToExcel = () => {
  const filteredData = filteredArray.value.filter((e) => !e.is_admin);
  const data =
    locale.value === "en"
      ? filteredData.map((product) => ({
          FirstName: product.firstName,
          LastName: product.lastName,
          Email: product.email,
          Created_at: product.created_at?.slice(0, 10) || "",
        }))
      : filteredData.map((product) => ({
          الاسم_الأول: product.firstName,
          الاسم_الأخير: product.lastName,
          البريد_الإلكتروني: product.email,
          تاريح_الإنشاء: product.created_at?.slice(0, 10) || "",
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

.product-table {
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
      text-align: left;
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

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #19ad7b;
        box-shadow: 0 0 0 2px rgba(25, 173, 123, 0.1);
      }
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569;
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

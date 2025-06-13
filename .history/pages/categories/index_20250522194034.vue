<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة الفئات" : "Categories List" }}
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
        <button class="action-btn btn-success" @click="addDialogVisible = true">
          <Icon class="icon" name="material-symbols:add" />
          {{ $i18n.locale === "ar" ? "إضافة فئة" : "Add Category" }}
        </button>
        <button class="action-btn btn-success" @click="fetchCategories()">
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
      <div v-else class="cat-table">
        <table>
          <thead>
            <tr>
              <th>{{ $i18n.locale === "ar" ? "الاسم" : "Name" }}</th>
              <th>{{ $i18n.locale === "ar" ? "المطعم" : "Restaurant" }}</th>
              <th>
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "العمليات" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              v-for="cat in filteredCategories"
              :key="cat._id"
            >
              <td class="cat-cell">
                <div class="cat-avatar">
                  <img v-if="cat.img" :src="cat.img" />
                  <img v-else src="/logo/logo.png" alt="Default avatar" />
                </div>
                <div class="cat-info">
                  <h5>{{ cat.name }}</h5>
                </div>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ cat?.restaurant?.name }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ formatDate(cat.createdAt) }}
                </span>
              </td>
              <td class="action-cell">
                <button class="icon-btn edit-btn" @click="openEditDialog(cat)">
                  <Icon class="icon" name="material-symbols:edit" />
                </button>
                <button
                  class="icon-btn delete-btn"
                  @click="openDeleteDialog(cat)"
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
        "{{ categoryToDelete?.name }}"{{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="deleteCategory()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Add Category Dialog -->
  <Dialog v-model:visible="addDialogVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="addCategory()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "إضافة فئة" : "Add Category" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="newCategory.name"
              id="name"
              type="text"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'الاسم' : 'Name'"
              required
              class="form-input"
            />
            <label for="name" class="form-label">
              {{ $i18n.locale === "ar" ? "الاسم" : "Name" }} *
            </label>
          </div>

          <Select
            v-model="newCategory.restaurantId"
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

          <!-- Image Upload for Add -->
          <div class="drop-area my-4">
            <div class="upload-box">
              <FileUpload
                mode="basic"
                @select="onFileSelect"
                name="addImage"
                customUpload
                :maxFileSize="1000000"
                accept="image/*"
                auto
                class="form-control p-button-outlined"
                :chooseLabel="
                  $i18n.locale === 'ar' ? 'اختر صورة' : 'Choose Image'
                "
              />
              <img
                v-if="newCategory.imagePreview"
                :src="newCategory.imagePreview"
                alt="Category Image"
                class="shadow-md w-100 h-100 sm:w-64"
              />
              <button
                class="btn btn-danger clear"
                @click.prevent="clearImage('add')"
                v-if="newCategory.imagePreview || newCategory.imageFile"
              >
                <Icon name="material-symbols:close" class="xmark" />
              </button>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click.prevent="closeAddDialog">
            {{ $t("Close") }}
          </button>
          <button class="btn btn-success" type="submit">
            {{ $t("Add") }}
          </button>
        </div>
      </form>
    </template>
  </Dialog>

  <!-- Edit Category Dialog -->
  <Dialog v-model:visible="editDialogVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="updateCategory()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "تعديل الفئة" : "Edit Category" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="editCategory.name"
              id="editName"
              type="text"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'الاسم' : 'Name'"
              required
              class="form-input"
            />
            <label for="editName" class="form-label">
              {{ $i18n.locale === "ar" ? "الاسم" : "Name" }} *
            </label>
          </div>

          <Select
            v-model="editCategory.restaurant"
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

          <!-- Image Upload for Edit -->
          <div class="drop-area my-4">
            <div class="upload-box">
              <FileUpload
                mode="basic"
                @select="onEditFileSelect"
                name="editImage"
                customUpload
                :maxFileSize="1000000"
                accept="image/*"
                auto
                class="form-control p-button-outlined"
                :chooseLabel="
                  $i18n.locale === 'ar' ? 'اختر صورة' : 'Choose Image'
                "
              />
              <img
                v-if="editCategory.imagePreview || editCategory.img"
                :src="editCategory.imagePreview || editCategory.img"
                alt="Category Image"
                class="shadow-md w-100 h-100 sm:w-64"
              />
              <button
                class="btn btn-danger clear"
                @click.prevent="clearImage('edit')"
                v-if="editCategory.imagePreview || editCategory.imageFile"
              >
                <Icon name="material-symbols:close" class="xmark" />
              </button>
            </div>
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
import * as XLSX from "xlsx";

definePageMeta({
  middleware: ["not-authorize"],
});

const {
  public: { api, apiBase },
} = useRuntimeConfig();
const { locale } = useI18n();
const { $awn } = useNuxtApp();

// State
const loading = ref(false);
const searchText = ref("");
const categories = ref([]);

// Dialog states
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const deleteModal = ref(false);

// Form data
const newCategory = ref({
  name: "",
  restaurantId: null,
});

const editCategory = ref({
  _id: "",
  name: "",
  restaurantId: null,
});

const categoryToDelete = ref(null);

// Computed
const filteredCategories = computed(() => {
  if (!searchText.value) return categories.value;
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const fetchCategories = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch(`${api.CategoriesApi}`, {
      baseURL: apiBase,
      headers: {
        "accept-language": locale.value,
      },
    });
    categories.value = data.value || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load categories"
        : "فشل تحميل قائمة الفئات"
    );
  } finally {
    loading.value = false;
  }
};

const { data: restaurants } = await useFetch(`${api.RestaurantsApi}`, {
  baseURL: apiBase,
});

const getRestaurantName = (id) => {
  const restaurant = restaurants.value.find((r) => r._id === id);
  return restaurant ? restaurant.name : "";
};

const onFileSelect = (event) => {
  const file = event.files[0];
  if (file) {
    newCategory.value.imageFile = file;
    newCategory.value.imagePreview = URL.createObjectURL(file);
  }
};

const onEditFileSelect = (event) => {
  const file = event.files[0];
  if (file) {
    editCategory.value.imageFile = file;
    editCategory.value.imagePreview = URL.createObjectURL(file);
  }
};

const clearImage = (type) => {
  if (type === "add") {
    newCategory.value.imageFile = null;
    newCategory.value.imagePreview = null;
  } else {
    editCategory.value.imageFile = null;
    editCategory.value.imagePreview = null;
  }
};

const closeAddDialog = () => {
  addDialogVisible.value = false;
  resetNewCategory();
};

const closeEditDialog = () => {
  editDialogVisible.value = false;
};

const addCategory = async () => {
  try {
    const formData = new FormData();
    formData.append("name", newCategory.value.name);
    formData.append("restaurantId", newCategory.value.restaurantId);
    if (newCategory.value.imageFile) {
      formData.append("image", newCategory.value.imageFile);
    }

    await useFetch(api.CategoriesApi, {
      baseURL: apiBase,
      method: "POST",
      body: formData,
    });

    $awn.success(
      locale.value === "en" ? "Added successfully" : "تم الإضافة بنجاح",
      { durations: { global: 5000 } }
    );

    closeAddDialog();
    await fetchCategories();
  } catch (error) {
    console.error("Error adding category:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to add category" : "فشل إضافة الفئة"
    );
  }
};

const openEditDialog = (category) => {
  editCategory.value = {
    _id: category._id,
    name: category.name,
    restaurantId: category.restaurantId?._id || category.restaurantId,
    restaurant: category.restaurant,
    img: category.img || "",
  };
  editDialogVisible.value = true;
};

const updateCategory = async () => {
  try {
    const formData = new FormData();
    formData.append("name", editCategory.value.name);
    if (editCategory.value.imageFile) {
      formData.append("image", editCategory.value.imageFile);
    }

    await useFetch(`${api.CategoriesApi}/${editCategory.value._id}`, {
      baseURL: apiBase,
      method: "PUT",
      body: formData,
    });

    $awn.success(
      locale.value === "en" ? "Updated successfully" : "تم التحديث بنجاح",
      { durations: { global: 5000 } }
    );

    closeEditDialog();
    await fetchCategories();
  } catch (error) {
    console.error("Error updating category:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to update category" : "فشل تحديث الفئة"
    );
  }
};

const openDeleteDialog = (category) => {
  categoryToDelete.value = category;
  deleteModal.value = true;
};

const deleteCategory = async () => {
  try {
    await useFetch(`${api.CategoriesApi}/${categoryToDelete.value._id}`, {
      baseURL: apiBase,
      method: "DELETE",
    });

    $awn.success(
      locale.value === "en" ? "Deleted successfully" : "تم الحذف بنجاح",
      { durations: { global: 5000 } }
    );

    deleteModal.value = false;
    await fetchCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to delete category" : "فشل حذف الفئة"
    );
  }
};

const resetNewCategory = () => {
  newCategory.value = {
    name: "",
    restaurantId: null,
  };
};

const exportToExcel = () => {
  const data = filteredCategories.value.map((cat) => ({
    [locale.value === "en" ? "Name" : "الاسم"]: cat.name,
    [locale.value === "en" ? "Created At" : "تاريخ الإنشاء"]: formatDate(
      cat.createdAt
    ),
    [locale.value === "en" ? "Restaurant" : "المطعم"]:
      cat.restaurantId?.name || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
  XLSX.writeFile(workbook, "Categories.xlsx");
};

const updateDeleteModal = (value) => {
  deleteModal.value = value;
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
  }
}

.cat-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cat-avatar {
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.cat-info {
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

    &.delete-btn {
      color: #64748b;

      &:hover {
        background-color: #f1f5f9;
        color: #ef4444;
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

.select {
  width: 100%;
}
</style>

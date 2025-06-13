<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "قائمة الوجبات" : "Meals List" }}
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

        <Select
          v-model="restaurantFilter"
          :options="restaurantsWithAllOption"
          :placeholder="
            $i18n.locale === 'ar' ? 'اختار مطعم' : 'Select A Restaurant'
          "
          class=""
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

        <button class="action-btn btn-success" @click="addDialogVisible = true">
          <Icon class="icon" name="material-symbols:add" />
          {{ $i18n.locale === "ar" ? "إضافة وجبة" : "Add Meal" }}
        </button>
        <button class="action-btn btn-success" @click="fetchMeals()">
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
      <div v-else class="meal-table">
        <table>
          <thead>
            <tr>
              <th>{{ $i18n.locale === "ar" ? "الاسم" : "Name" }}</th>
              <th>{{ $i18n.locale === "ar" ? "السعر" : "Price" }}</th>
              <th>{{ $i18n.locale === "ar" ? "المطعم" : "Restaurant" }}</th>
              <th>{{ $i18n.locale === "ar" ? "الفئة" : "Category" }}</th>
              <th>
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </th>
              <th>{{ $i18n.locale === "ar" ? "العمليات" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-row" v-for="meal in filteredMeals" :key="meal._id">
              <td class="image-cell">
                <div class="meal-avatar">
                  <img v-if="meal.img" :src="meal.img" />
                  <img v-else src="/logo/logo.png" alt="Default avatar" />
                </div>
                <div class="meal-info">
                  <h5>{{ meal.title }}</h5>
                </div>
              </td>
              <td>{{ meal.price }}</td>
              <td class="date-cell">
                <span class="badge">
                  {{ meal?.restaurant?.name }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ meal?.category?.name }}
                </span>
              </td>
              <td class="date-cell">
                <span class="badge">
                  {{ formatDate(meal.createdAt) }}
                </span>
              </td>
              <td class="action-cell">
                <button class="icon-btn edit-btn" @click="openEditDialog(meal)">
                  <Icon class="icon" name="material-symbols:edit" />
                </button>
                <button
                  class="icon-btn delete-btn"
                  @click="openDeleteDialog(meal)"
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
        "{{ mealToDelete?.title }}"{{ $i18n.locale === "ar" ? "؟" : "?" }}
      </p>
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="deleteModal = false">
        {{ $t("Close") }}
      </button>
      <button class="btn btn-danger" @click="deleteMeal()">
        {{ $t("Delete") }}
      </button>
    </template>
  </ElementsAppModal>

  <!-- Add Meal Dialog -->
  <Dialog v-model:visible="addDialogVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="addMeal()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "إضافة وجبة" : "Add Meal" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="newMeal.title"
              id="title"
              type="text"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'العنوان' : 'Title'"
              required
              class="form-input"
            />
            <label for="title" class="form-label">
              {{ $i18n.locale === "ar" ? "العنوان" : "Title" }} *
            </label>
          </div>

          <div class="input-group">
            <textarea
              v-model="newMeal.desc"
              id="desc"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'الوصف' : 'Description'"
              required
              class="form-input"
              rows="3"
            ></textarea>
            <label for="desc" class="form-label">
              {{ $i18n.locale === "ar" ? "الوصف" : "Description" }} *
            </label>
          </div>

          <div class="input-group">
            <input
              v-model="newMeal.price"
              id="price"
              type="number"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'السعر' : 'Price'"
              required
              class="form-input"
            />
            <label for="price" class="form-label">
              {{ $i18n.locale === "ar" ? "السعر" : "Price" }} *
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              v-model="newMeal.restaurant"
              :options="restaurants"
              :placeholder="
                $i18n.locale === 'ar' ? 'اختار مطعم' : 'Select A Restaurant'
              "
              class="w-full"
              @change="fetchCategoriesByRestaurant(newMeal.restaurant?._id)"
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

            <Select
              v-model="newMeal.category"
              :options="categories"
              :placeholder="
                $i18n.locale === 'ar' ? 'اختار فئة' : 'Select A Category'
              "
              class="w-full mx-2"
              :disabled="!newMeal.restaurant"
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
                v-if="newMeal.imagePreview"
                :src="newMeal.imagePreview"
                alt="Meal Image"
                class="shadow-md w-100 h-100 sm:w-64"
              />
              <button
                class="btn btn-danger clear"
                @click.prevent="clearImage('add')"
                v-if="newMeal.imagePreview || newMeal.imageFile"
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

  <!-- Edit Meal Dialog -->
  <Dialog v-model:visible="editDialogVisible" modal :style="{ width: '50rem' }">
    <template #container="{ closeCallback }">
      <form
        class="dialog"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        @submit.prevent="updateMeal()"
      >
        <h5 class="dialog-title">
          {{ $i18n.locale === "ar" ? "تعديل الوجبة" : "Edit Meal" }}
        </h5>
        <div class="dialog-content">
          <div class="input-group">
            <input
              v-model="editMeal.title"
              id="editTitle"
              type="text"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'العنوان' : 'Title'"
              required
              class="form-input"
            />
            <label for="editTitle" class="form-label">
              {{ $i18n.locale === "ar" ? "العنوان" : "Title" }} *
            </label>
          </div>

          <div class="input-group">
            <textarea
              v-model="editMeal.desc"
              id="editDesc"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'الوصف' : 'Description'"
              required
              class="form-input"
              rows="3"
            ></textarea>
            <label for="editDesc" class="form-label">
              {{ $i18n.locale === "ar" ? "الوصف" : "Description" }} *
            </label>
          </div>

          <div class="input-group">
            <input
              v-model="editMeal.price"
              id="editPrice"
              type="number"
              autocomplete="off"
              :placeholder="$i18n.locale === 'ar' ? 'السعر' : 'Price'"
              required
              class="form-input"
            />
            <label for="editPrice" class="form-label">
              {{ $i18n.locale === "ar" ? "السعر" : "Price" }} *
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              v-model="editMeal.restaurant"
              :options="restaurants"
              :placeholder="
                $i18n.locale === 'ar' ? 'اختار مطعم' : 'Select A Restaurant'
              "
              class="w-full"
              @change="fetchCategoriesByRestaurant(editMeal.restaurant?._id)"
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

            <Select
              v-model="editMeal.category"
              :options="categories"
              :placeholder="
                $i18n.locale === 'ar' ? 'اختار فئة' : 'Select A Category'
              "
              class="w-full mx-2"
              :disabled="!editMeal.restaurant"
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
                v-if="editMeal.imagePreview || editMeal.img"
                :src="editMeal.imagePreview || editMeal.img"
                alt="Meal Image"
                class="shadow-md w-100 h-100 sm:w-64"
              />
              <button
                class="btn btn-danger clear"
                @click.prevent="clearImage('edit')"
                v-if="editMeal.imagePreview || editMeal.imageFile"
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
const meals = ref([]);
const restaurantFilter = ref();
const categories = ref([]);

// Dialog states
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const deleteModal = ref(false);

// Form data
const newMeal = ref({
  title: "",
  desc: "",
  price: 0,
  restaurant: null,
  category: null,
  imageFile: null,
  imagePreview: null,
});

const editMeal = ref({
  _id: "",
  title: "",
  desc: "",
  price: 0,
  restaurant: null,
  category: null,
  img: "",
  imageFile: null,
  imagePreview: null,
});

const mealToDelete = ref(null);

const restaurantsWithAllOption = computed(() => {
  if (restaurants.value) {
    return [
      { _id: null, name: locale.value === "ar" ? "الكل" : "All" },
      ...restaurants.value,
    ];
  }
});

const filteredMeals = computed(() => {
  let filtered = meals.value;

  // Apply search filter
  if (searchText.value) {
    filtered = filtered.filter((meal) =>
      meal.title.toLowerCase().includes(searchText.value.toLowerCase())
    );
  }

  // Apply restaurant filter
  if (restaurantFilter.value && restaurantFilter.value._id) {
    filtered = filtered.filter(
      (meal) => meal.restaurant?._id === restaurantFilter.value._id
    );
  }

  return filtered;
});

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const fetchMeals = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch(`${api.MealsApi}`, {
      baseURL: apiBase,
      headers: {
        "accept-language": locale.value,
      },
    });
    watchEffect(() => {
      if (process.client && data.value) {
        meals.value = data.value.products || [];
      }
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to load meals" : "فشل تحميل قائمة الوجبات"
    );
  } finally {
    loading.value = false;
  }
};

fetchMeals();

const fetchCategoriesByRestaurant = async (restaurantId) => {
  if (!restaurantId) {
    categories.value = [];
    return;
  }

  try {
    const { data } = await useFetch(
      `${api.CategoriesApi}?restaurantId=${restaurantId}`,
      {
        baseURL: apiBase,
      }
    );
    categories.value = data.value || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load categories"
        : "فشل تحميل قائمة الفئات"
    );
  }
};

const { data: restaurants } = await useFetch(`${api.RestaurantsApi}`, {
  baseURL: apiBase,
});

const onFileSelect = (event) => {
  const file = event.files[0];
  if (file) {
    newMeal.value.imageFile = file;
    newMeal.value.imagePreview = URL.createObjectURL(file);
  }
};

const onEditFileSelect = (event) => {
  const file = event.files[0];
  if (file) {
    editMeal.value.imageFile = file;
    editMeal.value.imagePreview = URL.createObjectURL(file);
  }
};

const clearImage = (type) => {
  if (type === "add") {
    newMeal.value.imageFile = null;
    newMeal.value.imagePreview = null;
  } else {
    editMeal.value.imageFile = null;
    editMeal.value.imagePreview = null;
  }
};

const closeAddDialog = () => {
  addDialogVisible.value = false;
  resetNewMeal();
};

const closeEditDialog = () => {
  editDialogVisible.value = false;
};

const addMeal = async () => {
  try {
    const formData = new FormData();
    formData.append("title", newMeal.value.title);
    formData.append("desc", newMeal.value.desc);
    formData.append("price", newMeal.value.price);
    formData.append("restaurantId", newMeal.value.restaurant._id);
    formData.append("categoryId", newMeal.value.category._id);
    if (newMeal.value.imageFile) {
      formData.append("img", newMeal.value.imageFile);
    }

    await useFetch(api.MealsApi, {
      baseURL: apiBase,
      method: "POST",
      body: formData,
    });

    $awn.success(
      locale.value === "en" ? "Added successfully" : "تم الإضافة بنجاح",
      { durations: { global: 5000 } }
    );

    closeAddDialog();
    await fetchMeals();
  } catch (error) {
    console.error("Error adding meal:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to add meal" : "فشل إضافة الوجبة"
    );
  }
};

const openEditDialog = (meal) => {
  editMeal.value = {
    _id: meal._id,
    title: meal.title,
    desc: meal.desc,
    price: meal.price,
    restaurant: meal.restaurant,
    category: meal.category,
    img: meal.img || "",
  };

  // Fetch categories for the selected restaurant
  if (meal.restaurant?._id) {
    fetchCategoriesByRestaurant(meal.restaurant._id);
  }

  editDialogVisible.value = true;
};

const updateMeal = async () => {
  try {
    const formData = new FormData();
    formData.append("title", editMeal.value.title);
    formData.append("desc", editMeal.value.desc);
    formData.append("price", editMeal.value.price);
    formData.append("restaurantId", editMeal.value.restaurant._id);
    formData.append("categoryId", editMeal.value.category._id);
    if (editMeal.value.imageFile) {
      formData.append("img", editMeal.value.imageFile);
    }

    await useFetch(`${api.MealsApi}/${editMeal.value._id}`, {
      baseURL: apiBase,
      method: "PUT",
      body: formData,
    });

    $awn.success(
      locale.value === "en" ? "Updated successfully" : "تم التحديث بنجاح",
      { durations: { global: 5000 } }
    );

    closeEditDialog();
    await fetchMeals();
  } catch (error) {
    console.error("Error updating meal:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to update meal" : "فشل تحديث الوجبة"
    );
  }
};

const openDeleteDialog = (meal) => {
  mealToDelete.value = meal;
  deleteModal.value = true;
};

const deleteMeal = async () => {
  try {
    await useFetch(`${api.MealsApi}/${mealToDelete.value._id}`, {
      baseURL: apiBase,
      method: "DELETE",
    });

    $awn.success(
      locale.value === "en" ? "Deleted successfully" : "تم الحذف بنجاح",
      { durations: { global: 5000 } }
    );

    deleteModal.value = false;
    await fetchMeals();
  } catch (error) {
    console.error("Error deleting meal:", error);
    $awn.alert(
      locale.value === "en" ? "Failed to delete meal" : "فشل حذف الوجبة"
    );
  }
};

const resetNewMeal = () => {
  newMeal.value = {
    title: "",
    desc: "",
    price: 0,
    restaurant: null,
    category: null,
    imageFile: null,
    imagePreview: null,
  };
};

const exportToExcel = () => {
  const data = filteredMeals.value.map((meal) => ({
    [locale.value === "en" ? "Title" : "العنوان"]: meal.title,
    [locale.value === "en" ? "Description" : "الوصف"]: meal.desc,
    [locale.value === "en" ? "Price" : "السعر"]: meal.price,
    [locale.value === "en" ? "Restaurant" : "المطعم"]:
      meal.restaurant?.name || "",
    [locale.value === "en" ? "Category" : "الفئة"]: meal.category?.name || "",
    [locale.value === "en" ? "Created At" : "تاريخ الإنشاء"]: formatDate(
      meal.createdAt
    ),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Meals");
  XLSX.writeFile(workbook, "Meals.xlsx");
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

.meal-table {
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
    vertical-align: middle;
  }
}

.image-cell {
  display: flex;
  align-items: center;
  .meal-avatar {
    img {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      object-fit: cover;
    }
    margin-inline-end: 10px;
  }
  .meal-info {
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
}

.desc-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
      width: 100%;

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

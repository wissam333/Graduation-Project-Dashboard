<template>
  <div class="contain" :class="useSidebar().value ? 'shrink' : ''">
    <div class="title-container">
      <div class="head-title">
        <h4 class="header4">
          {{ $i18n.locale === "ar" ? "الملف الشخصي" : "Profile" }}
        </h4>
      </div>
    </div>

    <div class="profile-container">
      <div class="loading" v-if="loading">
        <img src="/loading/loadingNew.svg" alt="Loading..." />
      </div>
      <div v-else class="profile-content">
        <div class="profile-header">
          <div class="avatar-container">
            <img
              v-if="adminData.img"
              :src="adminData.img"
              class="profile-avatar"
            />
            <img v-else src="/logo/logo.png" class="profile-avatar" />
            <button class="edit-avatar-btn" @click="editAvatarDialog = true">
              <Icon name="mdi:camera" class="icon" />
            </button>
          </div>
          <div class="profile-info">
            <h2>{{ adminData.username }}</h2>
            <p class="email">{{ adminData.email }}</p>
            <p class="role">
              {{ $i18n.locale === "ar" ? "مدير النظام" : "System Admin" }}
            </p>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-card">
            <h3 class="detail-title">
              {{
                $i18n.locale === "ar" ? "معلومات الحساب" : "Account Information"
              }}
            </h3>
            <div class="detail-item">
              <span class="detail-label">
                {{ $i18n.locale === "ar" ? "اسم المستخدم" : "Username" }}
              </span>
              <span class="detail-value">{{ adminData.username }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">
                {{ $i18n.locale === "ar" ? "البريد الإلكتروني" : "Email" }}
              </span>
              <span class="detail-value">{{ adminData.email }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">
                {{ $i18n.locale === "ar" ? "تاريخ الإنشاء" : "Created At" }}
              </span>
              <span class="detail-value">{{
                formatDate(adminData.createdAt)
              }}</span>
            </div>
          </div>

          <div class="detail-card">
            <h3 class="detail-title">
              {{ $i18n.locale === "ar" ? "الأمان" : "Security" }}
            </h3>
            <div class="detail-item">
              <span class="detail-label">
                {{
                  $i18n.locale === "ar"
                    ? "آخر تحديث لكلمة السر"
                    : "Last Password Update"
                }}
              </span>
              <span class="detail-value">
                {{
                  adminData.updatedAt
                    ? formatDate(adminData.updatedAt)
                    : $i18n.locale === "ar"
                    ? "غير معروف"
                    : "Unknown"
                }}
              </span>
            </div>
            <button
              class="change-password-btn"
              @click="changePasswordDialog = true"
            >
              {{
                $i18n.locale === "ar" ? "تغيير كلمة السر" : "Change Password"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit Profile Dialog -->
    <Dialog
      v-model:visible="editProfileDialog"
      modal
      :style="{ width: '50rem' }"
    >
      <template #container="{ closeCallback }">
        <form
          class="dialog"
          :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          @submit.prevent="updateProfile()"
        >
          <h5 class="dialog-title">
            {{ $i18n.locale === "ar" ? "تعديل الملف الشخصي" : "Edit Profile" }}
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

    <!-- Change Password Dialog -->
    <Dialog
      v-model:visible="changePasswordDialog"
      modal
      :style="{ width: '50rem' }"
    >
      <template #container="{ closeCallback }">
        <form
          class="dialog"
          :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          @submit.prevent="updatePassword()"
        >
          <h5 class="dialog-title">
            {{ $i18n.locale === "ar" ? "تغيير كلمة السر" : "Change Password" }}
          </h5>
          <div class="dialog-content">
            <div class="input-group">
              <input
                v-model="currentPassword"
                id="currentPassword"
                type="password"
                autocomplete="off"
                :placeholder="
                  $i18n.locale === 'ar'
                    ? 'كلمة السر الحالية'
                    : 'Current Password'
                "
                required
                class="form-input"
              />
              <label for="currentPassword" class="form-label">
                {{
                  $i18n.locale === "ar"
                    ? "كلمة السر الحالية"
                    : "Current Password"
                }}
                *
              </label>
            </div>

            <div class="input-group">
              <input
                v-model="newPassword"
                id="newPassword"
                type="password"
                autocomplete="off"
                :placeholder="
                  $i18n.locale === 'ar' ? 'كلمة السر الجديدة' : 'New Password'
                "
                required
                class="form-input"
              />
              <label for="newPassword" class="form-label">
                {{
                  $i18n.locale === "ar" ? "كلمة السر الجديدة" : "New Password"
                }}
                *
              </label>
            </div>

            <div class="input-group">
              <input
                v-model="confirmPassword"
                id="confirmPassword"
                type="password"
                autocomplete="off"
                :placeholder="
                  $i18n.locale === 'ar' ? 'تأكيد كلمة السر' : 'Confirm Password'
                "
                required
                class="form-input"
              />
              <label for="confirmPassword" class="form-label">
                {{
                  $i18n.locale === "ar" ? "تأكيد كلمة السر" : "Confirm Password"
                }}
                *
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

    <!-- Edit Avatar Dialog -->
    <Dialog
      v-model:visible="editAvatarDialog"
      modal
      :style="{ width: '30rem' }"
    >
      <template #container="{ closeCallback }">
        <form
          class="dialog"
          :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          @submit.prevent="updateAvatar()"
        >
          <h5 class="dialog-title">
            {{
              $i18n.locale === "ar"
                ? "تغيير الصورة الشخصية"
                : "Change Profile Picture"
            }}
          </h5>
          <div class="dialog-content">
            <div class="avatar-upload">
              <div class="preview-container">
                <img
                  v-if="avatarPreview"
                  :src="avatarPreview"
                  class="avatar-preview"
                />
                <img
                  v-else
                  :src="adminData.img || '/logo/logo.png'"
                  class="avatar-preview"
                />
              </div>
              <input
                type="file"
                id="avatarInput"
                ref="avatarInput"
                accept="image/*"
                @change="handleAvatarUpload"
                style="display: none"
              />
              <button
                type="button"
                class="upload-btn"
                @click="$refs.avatarInput.click()"
              >
                {{ $i18n.locale === "ar" ? "اختر صورة" : "Choose Image" }}
              </button>
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
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["not-authorize", "admin"],
});

const { locale } = useI18n();
const { $awn } = useNuxtApp();

const loading = ref(false);
const adminData = ref({});
const editProfileDialog = ref(false);
const changePasswordDialog = ref(false);
const editAvatarDialog = ref(false);

// Edit profile fields
const editUsername = ref("");
const editEmail = ref("");

// Change password fields
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Avatar upload
const avatarFile = ref(null);
const avatarPreview = ref(null);

const getUserData = () => {
  loading.value = true;
  try {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      adminData.value = user;
      editUsername.value = user.username;
      editEmail.value = user.email;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to load profile"
        : "فشل تحميل الملف الشخصي"
    );
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(locale.value === "ar" ? "ar-EG" : "en-US");
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatarFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const updateProfile = async () => {
  try {
    // Here you would typically make an API call to update the profile
    // For now, we'll just update the localStorage
    const updatedUser = {
      ...adminData.value,
      username: editUsername.value,
      email: editEmail.value,
    };

    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    adminData.value = updatedUser;

    editProfileDialog.value = false;
    $awn.success(
      locale.value === "en"
        ? "Profile updated successfully"
        : "تم تحديث الملف الشخصي بنجاح"
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to update profile"
        : "فشل تحديث الملف الشخصي"
    );
  }
};

const updatePassword = async () => {
  try {
    if (newPassword.value !== confirmPassword.value) {
      $awn.alert(
        locale.value === "en"
          ? "New password and confirmation don't match"
          : "كلمة السر الجديدة وتأكيدها غير متطابقين"
      );
      return;
    }

    // Here you would typically make an API call to change the password
    // For now, we'll just show a success message
    changePasswordDialog.value = false;
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

    $awn.success(
      locale.value === "en"
        ? "Password updated successfully"
        : "تم تحديث كلمة السر بنجاح"
    );
  } catch (error) {
    console.error("Error changing password:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to change password"
        : "فشل تغيير كلمة السر"
    );
  }
};

const updateAvatar = async () => {
  try {
    if (!avatarFile.value) {
      $awn.alert(
        locale.value === "en" ? "Please select an image" : "الرجاء اختيار صورة"
      );
      return;
    }

    // Here you would typically upload the image to your server
    // For now, we'll just update the preview and localStorage
    const updatedUser = {
      ...adminData.value,
      img: avatarPreview.value,
    };

    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    adminData.value = updatedUser;

    editAvatarDialog.value = false;
    avatarFile.value = null;
    avatarPreview.value = null;

    $awn.success(
      locale.value === "en"
        ? "Profile picture updated successfully"
        : "تم تحديث الصورة الشخصية بنجاح"
    );
  } catch (error) {
    console.error("Error updating avatar:", error);
    $awn.alert(
      locale.value === "en"
        ? "Failed to update profile picture"
        : "فشل تحديث الصورة الشخصية"
    );
  }
};

onMounted(() => {
  getUserData();
});
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
}

.profile-container {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
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

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
}

.avatar-container {
  position: relative;
  .profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #19ad7b;
  }
  .edit-avatar-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #19ad7b;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      background-color: #158c65;
    }
    .icon {
      font-size: 1rem;
    }
  }
}

.profile-info {
  h2 {
    margin: 0;
    font-size: 1.75rem;
    color: #1e293b;
  }
  .email {
    margin: 0.5rem 0;
    color: #64748b;
  }
  .role {
    margin: 0;
    padding: 0.25rem 0.75rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 9999px;
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.detail-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
}

.detail-label {
  font-weight: 500;
  color: #64748b;
}

.detail-value {
  font-weight: 600;
  color: #1e293b;
}

.change-password-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #19ad7b;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  &:hover {
    background-color: #158c65;
  }
}

.edit-profile-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  &:hover {
    background-color: #2563eb;
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

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preview-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e2e8f0;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #2563eb;
  }
}
</style>

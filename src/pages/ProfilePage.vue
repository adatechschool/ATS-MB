<!-- src/pages/ProfilePage.vue -->

<template>
  <main class="container mx-auto flex flex-1 flex-col p-8">
    <div class="bg-surface-0 p-10 md:p-20 dark:bg-surface-950">
      <div class="bg-surface-0 dark:bg-surface-950">
        <div
          class="mb-4 text-3xl font-medium text-surface-900 dark:text-surface-0"
        >
          Account Information
        </div>
        <div class="flex w-full items-center gap-4">
          <div class="group relative">
            <template v-if="userStore.profilePicture">
              <PrimeAvatar
                :image="userStore.profilePicture"
                class="mr-2 cursor-pointer"
                size="xlarge"
                shape="circle"
                @click="triggerFileInput"
              />
            </template>
            <template v-else>
              <PrimeAvatar
                :label="userStore.avatarLetter"
                class="mr-2 cursor-pointer"
                size="xlarge"
                shape="circle"
                @click="triggerFileInput"
              />
            </template>
            <div
              class="bg-opacity-50 absolute inset-0 flex cursor-pointer items-center justify-center rounded-4xl opacity-0 transition-opacity group-hover:opacity-70"
              @click="triggerFileInput"
            >
              <i class="pi pi-pencil text-2xl"></i>
            </div>
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept="image/*"
              @change="onProfilePictureSelected"
            />
          </div>
          <div class="flex flex-1 flex-col gap-0.5">
            <h1 class="text-xl font-bold">{{ userStore.username }}</h1>
          </div>
        </div>

        <div class="mt-2 mb-8 text-surface-500 dark:text-surface-300">
          Joined on {{ formatDate(userStore.joinDate) }}
        </div>
        <ul class="m-0 list-none p-0">
          <li
            class="flex flex-wrap items-center border-t border-surface px-2 py-4"
          >
            <div
              class="w-6/12 font-medium text-surface-500 md:w-2/12 dark:text-surface-300"
            >
              Email
            </div>
            <div
              class="order-1 w-full text-surface-900 md:order-none md:w-8/12 dark:text-surface-0"
            >
              <template v-if="isEditingEmail">
                <PrimeInputText
                  v-model="editableEmail"
                  placeholder="Email"
                  type="text"
                />
              </template>
              <template v-else>
                {{ userStore.email }}
              </template>
            </div>
            <div class="flex w-6/12 justify-end md:w-2/12">
              <template v-if="isEditingEmail">
                <PrimeButton
                  label="Save"
                  icon="pi pi-check"
                  text
                  @click="saveEmail"
                />
              </template>
              <template v-else>
                <PrimeButton
                  label="Edit"
                  icon="pi pi-pencil"
                  text
                  @click="startEditEmail"
                />
              </template>
            </div>
          </li>
          <li
            class="flex flex-wrap items-center border-t border-b border-surface px-2 py-4"
          >
            <div
              class="w-6/12 font-medium text-surface-500 md:w-2/12 dark:text-surface-300"
            >
              Bio
            </div>
            <div
              class="order-1 w-full leading-normal text-surface-900 md:order-none md:w-8/12 dark:text-surface-0"
            >
              <template v-if="isEditingBio">
                <PrimeTextarea
                  v-model="editableBio"
                  autoResize
                  placeholder="Bio"
                  rows="3"
                  class="w-full"
                />
              </template>
              <template v-else>
                {{ userStore.bio }}
              </template>
            </div>
            <div class="flex w-6/12 justify-end md:w-2/12">
              <template v-if="isEditingBio">
                <PrimeButton
                  label="Save"
                  icon="pi pi-check"
                  text
                  @click="saveBio"
                />
              </template>
              <template v-else>
                <PrimeButton
                  label="Edit"
                  icon="pi pi-pencil"
                  text
                  @click="startEditBio"
                />
              </template>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-8 flex justify-end">
      <PrimeButton
        label="Delete Account"
        severity="danger"
        icon="pi pi-trash"
        @click="confirmDeletion"
      />
    </div>

    <PrimeDialog
      v-model:visible="isDeletionDialogVisible"
      header="Confirm Account Deletion"
      :modal="true"
      class="w-1/3"
    >
      <p class="mb-4">
        Are you sure you want to permanently delete your account? This action
        cannot be undone.
      </p>
      <div class="flex justify-end gap-2">
        <PrimeButton
          label="Cancel"
          text
          @click="isDeletionDialogVisible = false"
        />
        <PrimeButton label="Confirm" severity="danger" @click="deleteAccount" />
      </div>
    </PrimeDialog>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../axios-instance";
import { useToast } from "primevue/usetoast";
import formatDate from "../helpers/dateFormatting";
import router from "../router";
import { useUserStore } from "../stores/userStore";

const toast = useToast();
const userStore = useUserStore();

const isEditingEmail = ref(false);
const isEditingBio = ref(false);
const isDeletionDialogVisible = ref(false);

const editableEmail = ref("");
const editableBio = ref("");

const fileInput = ref<HTMLInputElement | null>(null);

async function loadAccount() {
  try {
    const { data } = await api.get("/api/accounts/get/account/");
    userStore.setUser({
      username: data.username,
      email: data.email,
      bio: data.bio,
      profilePicture: data.profile_picture,
      joinDate: data.created_at?.substring(0, 10),
    });
  } catch (err: unknown) {
    router.push("/login");
    toast.add({
      severity: "error",
      summary: "Account loading failed.",
      detail: api.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Account loading failed.",
      life: 3000,
    });
  }
}

onMounted(loadAccount);

function startEditEmail() {
  editableEmail.value = userStore.email;
  isEditingEmail.value = true;
}
function startEditBio() {
  editableBio.value = userStore.bio;
  isEditingBio.value = true;
}

const updateAccount = async () => {
  try {
    await api.put("/api/accounts/update/account/", {
      username: userStore.username,
      email: userStore.email,
      bio: userStore.bio,
      profile_picture: userStore.rawProfilePicture ?? null,
    });
    toast.add({
      severity: "success",
      summary: "Account Updated",
      detail: "Saved!",
    });
    await loadAccount();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Update Failed",
      detail: (error as Error).message,
    });
  }
};

const saveEmail = async () => {
  try {
    await api.put("/api/accounts/update/account/", {
      username: userStore.username,
      email: editableEmail.value,
      bio: userStore.bio,
      profile_picture: userStore.rawProfilePicture ?? null,
    });
    toast.add({
      severity: "success",
      summary: "Email Updated",
      detail: "Saved!",
      life: 3000,
    });
    isEditingEmail.value = false;
    await loadAccount();
  } catch (err: unknown) {
    toast.add({
      severity: "error",
      summary: "Update Failed",
      detail: err.message,
      life: 3000,
    });
  }
};

const saveBio = async () => {
  try {
    await api.put("/api/accounts/update/account/", {
      username: userStore.username,
      email: userStore.email,
      bio: editableBio.value,
      profile_picture: userStore.rawProfilePicture ?? null,
    });
    toast.add({
      severity: "success",
      summary: "Bio Updated",
      detail: "Saved!",
      life: 3000,
    });
    isEditingBio.value = false;
    await loadAccount();
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Update Failed",
      detail: err.message,
      life: 3000,
    });
  }
};

function triggerFileInput() {
  fileInput.value?.click();
}

function onProfilePictureSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const full = e.target?.result as string;
      const [, raw] = full.split(",", 2);
      userStore.setRawProfilePicture(raw);
      try {
        await api.put("/api/accounts/update/account/", {
          profile_picture: raw,
        });
        toast.add({
          severity: "success",
          summary: "Profile picture updated",
          detail: "Saved!",
          life: 3000,
        });
        await loadAccount();
      } catch (error: unknown) {
        toast.add({
          severity: "error",
          summary: "Update Failed",
          detail: (error as Error).message,
          life: 3000,
        });
      }
    };
    reader.readAsDataURL(file);
  }
}

function confirmDeletion() {
  isDeletionDialogVisible.value = true;
}

async function deleteAccount() {
  try {
    await api.delete("/api/accounts/delete/account/");
    toast.add({ severity: "success", summary: "Deleted", detail: "Bye!" });
    router.push("/register");
  } catch (error: unknown) {
    toast.add({
      severity: "error",
      summary: "Deletion Failed",
      detail: error.message,
    });
  } finally {
    isDeletionDialogVisible.value = false;
  }
}
</script>

<style scoped>
/* Additional styling can be added if needed */
</style>

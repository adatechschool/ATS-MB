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
              class="bg-opacity-50 absolute inset-0 flex cursor-pointer items-center justify-center rounded-4xl bg-black opacity-0 transition-opacity group-hover:opacity-70"
              @click="triggerFileInput"
            >
              <i class="pi pi-pencil text-2xl text-white"></i>
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
                  v-model="userStore.email"
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
                  @click="isEditingEmail = true"
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
                  v-model="userStore.bio"
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
                  @click="isEditingBio = true"
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
import axios from "axios";
import { useToast } from "primevue/usetoast";
import formatDate from "../helpers/dateFormatting";
import router from "../router";
import { useUserStore } from "../stores/userStore";

const toast = useToast();
const userStore = useUserStore();

const isEditingEmail = ref(false);
const isEditingBio = ref(false);
const isDeletionDialogVisible = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

const fetchAccountInfo = async () => {
  try {
    const { data } = await axios.get(`/api/accounts/get/account/`);
    userStore.setUser({
      username: data.username,
      email: data.email,
      bio: data.bio,
      profilePicture: data.profile_picture,
      joinDate: data.created_at?.substring(0, 10),
    });
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      error.response?.data?.code === "token_not_valid"
    ) {
      router.push("/login");
      return;
    }
    console.error("Error fetching account info:", error);
  }
};

const updateAccount = async () => {
  try {
    const response = await axios.put(`/api/accounts/update/account/`, {
      username: userStore.username,
      email: userStore.email,
      bio: userStore.bio,
      profile_picture: userStore.rawProfilePicture ?? null,
    });
    userStore.setUser(response.data);
    toast.add({
      severity: "success",
      summary: "Account Updated",
      detail: "Your account information has been updated successfully.",
      life: 3000,
    });
  } catch (error: unknown) {
    toast.add({
      severity: "error",
      summary: "Update Failed",
      detail: axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Update failed.",
      life: 3000,
    });
  }
};

const saveEmail = async () => {
  await updateAccount();
  isEditingEmail.value = false;
};

const saveBio = async () => {
  await updateAccount();
  isEditingBio.value = false;
};

function triggerFileInput() {
  fileInput.value?.click();
}

function onProfilePictureSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const full = e.target?.result as string;
      const [, raw] = full.split(",", 2);
      userStore.setRawProfilePicture(raw);
    };
    reader.readAsDataURL(file);
  }
}

function confirmDeletion() {
  isDeletionDialogVisible.value = true;
}

async function deleteAccount() {
  try {
    await axios.delete(`/api/accounts/delete/account/`, {
      withCredentials: true,
    });

    toast.add({
      severity: "success",
      summary: "Account Deleted",
      detail: "Your account has been successfully deleted.",
      life: 3000,
    });

    router.push("/register");
  } catch (error: unknown) {
    let errorMessage = "Account deletion failed.";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.error || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.add({
      severity: "error",
      summary: "Deletion Failed",
      detail: errorMessage,
      life: 3000,
    });
  } finally {
    isDeletionDialogVisible.value = false;
  }
}

onMounted(() => {
  fetchAccountInfo();
});
</script>

<style scoped>
/* Additional styling can be added if needed */
</style>

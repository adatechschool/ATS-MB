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
            <template v-if="profilePicture">
              <PrimeAvatar
                :image="profilePicture"
                class="mr-2 cursor-pointer"
                size="xlarge"
                shape="circle"
                @click="triggerFileInput"
              />
            </template>
            <template v-else>
              <PrimeAvatar
                :label="avatarLetter"
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
            <h1 class="text-xl font-bold">{{ username }}</h1>
            <div class="flex gap-8">
              <div class="gap-0.0625 flex flex-col text-sm">
                <p class="font-bold">Followers</p>
                <p>100</p>
              </div>
              <div class="gap-0.0625 flex flex-col text-sm">
                <p class="font-bold">Followings</p>
                <p>100</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 mb-8 text-surface-500 dark:text-surface-300">
          Joined on {{ formattedJoinDate }}
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
                  v-model="email"
                  placeholder="Email"
                  type="text"
                />
              </template>
              <template v-else>
                {{ email }}
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
                  v-model="bio"
                  autoResize
                  placeholder="Bio"
                  rows="3"
                  class="w-full"
                />
              </template>
              <template v-else>
                {{ bio }}
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import formatDate from "../helpers/dateFormatting";
import router from "../router";

const email = ref("");
const bio = ref("");
const username = ref("");
const joinDate = ref("");
const profilePicture = ref("");
const isEditingEmail = ref(false);
const isEditingBio = ref(false);
const avatarLetter = computed(() => username.value.charAt(0).toUpperCase());

const fileInput = ref<HTMLInputElement | null>(null);

const toast = useToast();

const apiBaseUrl = `${import.meta.env.VITE_DJANGO_API_BASE_URL}`;
const accountServicePort = `${import.meta.env.VITE_ACCOUNT_SERVICE_PORT}`;
const accountApiBaseUrl = `${apiBaseUrl}:${accountServicePort}`;

const isDeletionDialogVisible = ref(false);

function confirmDeletion() {
  isDeletionDialogVisible.value = true;
}

async function deleteAccount() {
  try {
    const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;
    const accountServicePort = import.meta.env.VITE_ACCOUNT_SERVICE_PORT;
    const accountApiBaseUrl = `${apiBaseUrl}:${accountServicePort}`;

    await axios.delete(`${accountApiBaseUrl}/api/accounts/delete/account/`, {
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

const formattedJoinDate = computed(() => {
  return joinDate.value ? formatDate(joinDate.value) : "";
});

const fetchAccountInfo = async () => {
  try {
    const response = await axios.get(
      `${accountApiBaseUrl}/api/accounts/get/account/`,
    );
    const accountInfo = response.data;
    email.value = accountInfo.email;
    bio.value = accountInfo.bio;
    username.value = accountInfo.username;
    profilePicture.value = accountInfo.profile_picture || "";
    joinDate.value = accountInfo.created_at?.substring(0, 10) || "";
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
    const response = await axios.put(
      `${apiBaseUrl}:${accountServicePort}/api/accounts/update/account/`,
      {
        username: username.value,
        email: email.value,
        bio: bio.value,
        profile_picture: profilePicture.value,
      },
    );
    const updatedAccount = response.data;
    email.value = updatedAccount.email;
    bio.value = updatedAccount.bio;
    username.value = updatedAccount.username;
    profilePicture.value = updatedAccount.profile_picture || "";
    toast.add({
      severity: "success",
      summary: "Account Updated",
      detail: "Your account information has been updated successfully.",
      life: 3000,
    });
  } catch (error: unknown) {
    let errorMessage = "Update failed.";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.add({
      severity: "error",
      summary: "Update Failed",
      detail: errorMessage,
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
      profilePicture.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

onMounted(() => {
  fetchAccountInfo();
});
</script>

<style scoped>
/* Additional styling can be added if needed */
</style>

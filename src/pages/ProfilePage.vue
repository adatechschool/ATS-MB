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
        <!-- Avatar Section with file upload and hover overlay -->
        <div class="flex w-full items-center gap-4">
          <div class="group relative">
            <!-- Display avatar with image if available, otherwise fallback to label -->
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
                label="P"
                class="mr-2 cursor-pointer"
                size="xlarge"
                shape="circle"
                @click="triggerFileInput"
              />
            </template>
            <!-- Hover overlay with pencil icon -->
            <div
              class="bg-opacity-50 absolute inset-0 flex cursor-pointer items-center justify-center rounded-4xl bg-black opacity-0 transition-opacity group-hover:opacity-70"
              @click="triggerFileInput"
            >
              <i class="pi pi-pencil text-2xl text-white"></i>
            </div>
            <!-- Hidden file input -->
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
          Joined on {{ joinDate }}
        </div>
        <ul class="m-0 list-none p-0">
          <!-- Email Row -->
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
          <!-- Bio Row -->
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
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";

// Helper function to decode a JWT token
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

// Retrieve the access token from localStorage.
const accessToken = localStorage.getItem("accessToken") || "";

// Decode the token to extract the user ID.
// Adjust the property name if your token uses "sub" or a different key.
let userId = "";
if (accessToken) {
  const payload = parseJwt(accessToken);
  if (payload) {
    userId = payload.user_id || payload.sub || "";
  }
}
if (!userId) {
  // Optionally: redirect the user to login if userId could not be derived.
  console.error("User ID not found in access token.");
  // router.push("/login"); // Uncomment if router is imported and desired.
}

// Define reactive variables for account information.
const email = ref("");
const bio = ref("");
const username = ref("");
const joinDate = ref("");
const profilePicture = ref("");
const isEditingEmail = ref(false);
const isEditingBio = ref(false);

// Reference for the hidden file input.
const fileInput = ref<HTMLInputElement | null>(null);

const toast = useToast();
const apiBaseUrl = `${import.meta.env.VITE_DJANGO_API_BASE_URL}`;
const accountServicePort = `${import.meta.env.VITE_ACCOUNT_SERVICE_PORT}`;

// Fetch account info from the API on component mount.
const fetchAccountInfo = async () => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}:${accountServicePort}/api/accounts/get/${userId}/`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const accountInfo = response.data;
    email.value = accountInfo.email;
    bio.value = accountInfo.bio;
    username.value = accountInfo.username;
    profilePicture.value = accountInfo.profile_picture || "";
    joinDate.value = accountInfo.created_at
      ? accountInfo.created_at.substring(0, 10)
      : "";
  } catch (error: unknown) {
    console.error("Error fetching account info:", error);
  }
};

// Function to update account info via the API.
const updateAccount = async () => {
  try {
    const response = await axios.put(
      `${apiBaseUrl}:${accountServicePort}/api/accounts/update/${userId}/`,
      {
        username: username.value,
        email: email.value,
        bio: bio.value,
        profile_picture: profilePicture.value, // Ensure proper encoding if needed.
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const updatedAccount = response.data;
    // Update reactive properties with the returned data.
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

// Functions to save changes and exit edit mode.
const saveEmail = async () => {
  await updateAccount();
  isEditingEmail.value = false;
};

const saveBio = async () => {
  await updateAccount();
  isEditingBio.value = false;
};

// Function to trigger the file input click.
function triggerFileInput() {
  fileInput.value?.click();
}

// Handler for file selection: update profile picture preview.
function onProfilePictureSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      // e.target.result will be a base64 encoded string like "data:image/png;base64,...."
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

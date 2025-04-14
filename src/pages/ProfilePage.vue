<!-- src\pages\ProfilePage.vue -->

<template>
  <main class="container mx-auto flex flex-1 flex-col p-8">
    <div class="bg-surface-0 dark:bg-surface-950 p-10 md:p-20">
      <div class="bg-surface-0 dark:bg-surface-950">
        <div
          class="text-surface-900 dark:text-surface-0 mb-4 text-3xl font-medium"
        >
          Account Information
        </div>
        <!-- Avatar Section with file upload -->
        <div class="flex w-full items-center gap-4">
          <div class="relative">
            <!-- Display avatar with image if a profile picture has been uploaded, otherwise fallback to label -->
            <PrimeAvatar
              v-if="profilePicture"
              :image="profilePicture"
              class="mr-2 cursor-pointer"
              size="xlarge"
              shape="circle"
              @click="triggerFileInput"
            />
            <PrimeAvatar
              v-else
              label="P"
              class="mr-2 cursor-pointer"
              size="xlarge"
              shape="circle"
              @click="triggerFileInput"
            />
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
            <h1 class="text-xl font-bold">Phil</h1>
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

        <div class="text-surface-500 dark:text-surface-300 mt-2 mb-8">
          Joined on 2022-01-01
        </div>
        <ul class="m-0 list-none p-0">
          <!-- Email Row -->
          <li
            class="border-surface flex flex-wrap items-center border-t px-2 py-4"
          >
            <div
              class="text-surface-500 dark:text-surface-300 w-6/12 font-medium md:w-2/12"
            >
              Email
            </div>
            <div
              class="text-surface-900 dark:text-surface-0 order-1 w-full md:order-none md:w-8/12"
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
                  @click="isEditingEmail = false"
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
            class="border-surface flex flex-wrap items-center border-t border-b px-2 py-4"
          >
            <div
              class="text-surface-500 dark:text-surface-300 w-6/12 font-medium md:w-2/12"
            >
              Bio
            </div>
            <div
              class="text-surface-900 dark:text-surface-0 order-1 w-full leading-normal md:order-none md:w-8/12"
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
                  @click="isEditingBio = false"
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
import { ref } from "vue";

// Reactive values for email and bio.
const email = ref("guy@example.com");
const bio = ref(
  "A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.",
);

// Reactive flags to control edit modes.
const isEditingEmail = ref(false);
const isEditingBio = ref(false);

// Reactive value for profile picture URL.
const profilePicture = ref("");

// Reference for the hidden file input.
const fileInput = ref<HTMLInputElement | null>(null);

// Function to trigger the click event of the hidden file input.
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

// Handler for file selection event.
function onProfilePictureSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // Create a temporary URL for previewing the image.
    profilePicture.value = URL.createObjectURL(file);
    // Optionally, upload the file to your server here.
  }
}
</script>

<style scoped>
/* Add any additional styling if needed */
</style>

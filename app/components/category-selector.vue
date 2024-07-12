<script setup lang="ts">
const emits = defineEmits<{
  'categorySelected': [string];
}>();

defineProps<{
  'selectedCategory': string
}>();

import { categories } from "~~/lib/nuxt-modules/categories";

const categorySelected = (c: string) => {
  emits('categorySelected', c);
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-sm rounded btn-ghost btn-outline m-1">Filter By Category<Icon name="mingcute:down-fill"/></div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-1 shadow border border-zinc-700">
      <li :class="selectedCategory == 'All' ? 'font-bold text-green-500' : ''"><button
          @click="categorySelected('All')">{{ "All" }}</button></li>
      <li :class="selectedCategory == category ? 'font-bold text-green-500' : ''" v-for="category in categories"><button
          @click="categorySelected(category)">{{ category }}</button></li>
    </ul>
  </div>
</template>
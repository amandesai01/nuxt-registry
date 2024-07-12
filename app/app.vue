<script setup lang="ts">
import type { ModuleInfo } from "~~/lib/nuxt-modules/types";
import { getAllModules } from "~~/lib";
import { categories } from "~~/lib/nuxt-modules/categories";

const { data: modulesData } = useAsyncData<ModuleInfo[]>('all-modules', () => getAllModules());

const modulesByCategory: Record<string, ModuleInfo[]> = {};
const modules = ref<ModuleInfo[]>([]);

watchEffect(() => {
  if (modulesData.value != null) {
    modules.value = modulesData.value;
    categories.forEach(c => {
      modulesByCategory[c] = [];
      modulesData.value?.forEach(m => {
        if (m.category == c) {
          modulesByCategory[c].push(m);
        }
      })
    })
  }
})

const selectedCategory = ref("All");
watch(selectedCategory, (s) => {
  if (modulesByCategory[s]) {
    modules.value = modulesByCategory[s];
  } else {
    modules.value = modulesData.value ? modulesData.value : [];
  }
})
</script>

<template>
  <section class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">
        <Icon name="logos:nuxt-icon" />Nuxt Registry<div class="badge badge-neutral">community</div>
      </a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <a class="flex" href="https://twitter.com/aman_desai_">
            <Icon name="mdi:twitter" class=" w-4 h-4" /> Follow me on Twitter!
          </a>
        </li>
      </ul>
    </div>
  </section>
  <div class="hero mt-3">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <span class="text-xl font-bold">A community-driven registry of Nuxt modules.</span>
        <button class="btn btn-sm btn-primary mt-3">
          <Icon name="mdi:github" class=" w-6 h-6" /> Star on Github
        </button>
      </div>
    </div>
  </div>
  <section class="flex w-full justify-center">
    <div class="flex space-x-2 w-2/3 items-center">
      <!-- TODO: add search functionality -->
      <!-- <label class="input input-bordered flex items-center gap-2 w-1/2">
        <input type="text" class="grow" placeholder="Search" v-model="searchQuery" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
          <path fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd" />
        </svg>
      </label> -->
      <CategorySelector :selected-category="selectedCategory" @category-selected="(s) => selectedCategory = s" />
    </div>
  </section>
  <section class="flex w-full justify-center">
    <div class="grid grid-cols-12 w-2/3">
      <div class="col-span-4 flex justify-center m-2" v-for="mod in modules" :key="mod.npm">
        <ModuleCard class="col-span-4" :module="mod" />
      </div>
    </div>
  </section>
</template>
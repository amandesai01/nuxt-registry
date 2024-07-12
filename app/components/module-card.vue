<script setup lang="ts">
import type { ModuleInfo } from "~~/lib/nuxt-modules/types";
defineProps<{
  module: ModuleInfo;
}>();
</script>

<template>
  <a class="card w-96 shadow-xl border border-zinc-700 hover:border-green-500 bg-zinc-800"
    :href="module.source == 'official-registry' ? 'https://nuxt.com/modules/' + module.name : 'https://npmjs.com/package/' + module.npm">
    <div class="card-body p-4">
      <h2 class="card-title font-primary font-extrabold text-xl">{{ module.name }}
        <Icon name="ic:outline-verified" class="text-green-500" v-if="module.source == 'official-registry'" />
      </h2>
      <p class="font-secondary text-md h-12 overflow-auto">{{ module.description }}</p>
      <div class="card-actions justify-end">
        <a :href="'https://npmjs.com/package/' + module.npm" class="btn btn-sm border border-zinc-800">
          <Icon name="el:download" />{{ module.downloads }}
        </a>
        <a :href="module.github" class="btn btn-sm border border-zinc-800">
          <Icon name="ic:outline-star" />{{ module.stars }}
        </a>
      </div>
    </div>
  </a>
</template>
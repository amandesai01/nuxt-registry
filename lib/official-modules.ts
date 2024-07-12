import { ofetch } from "ofetch";
import { ModuleInfo } from "./nuxt-modules/types";

export async function getNuxtPublishedModules() {
  const updatedModules = await ofetch<ModuleInfo[]>("https://unpkg.com/@nuxt/modules@latest/modules.json");

  return updatedModules.map(m => {
    m.approvedBy = 'nuxt-community';
    m.source = 'official-registry';
    return m;
  })
}
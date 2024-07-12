import * as yml from 'js-yaml';

import type { ModuleInfo } from './nuxt-modules/types';
import defu from 'defu';
import { fetchGithubPkg } from './nuxt-modules/utils';
import { categories } from './nuxt-modules/categories';

export async function generateModuleInfo(rawYmlContents: string, prNumber: number) {
  let ymlContents: object;
  try {
    ymlContents = yml.load(rawYmlContents) as object;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid YML Contents. YML Contents: ' + rawYmlContents);
  }

  let defuMod: ModuleInfo = {
    name: '',
    description: '',
    repo: '', // nuxt/example
    npm: '', // @nuxt/core
    icon: '', // url or filename from /public/icons
    github: '', // github link
    website: '',
    learn_more: '',
    category: 'Devtools', // see modules/_categories.json
    type: '3rd-party', // official, community, 3rd-party
    maintainers: [],
    compatibility: {
      nuxt: '^2.0.0',
      requires: {},
    },
    downloads: 0,
    stars: 0,
    source: 'community-registry',
    approvedBy: approver,
  };

  const mod = defu(ymlContents, defuMod);

  if (!mod.repo) {
    throw new Error(
      'Module repo not found. YML Contents: ' +
        rawYmlContents +
        ' PR Number: ' +
        prNumber,
    );
  }

  mod.source = 'community-registry';

  const pkg = await fetchGithubPkg(mod.repo);

  try {
    // Takes care of case: amandesai01/nuxt-registry#main/module
    const repoDetails = mod.repo.includes('#')
      ? mod.repo.split('#')[0].split('/')
      : mod.repo.split('/');
    const stars = await getStars(repoDetails[1], repoDetails[0]);
    mod.stars = stars;
  } catch (error) {
    console.error(
      'Module stars cannot be fetched. YML Contents: ' +
        rawYmlContents +
        ' PR Number: ' +
        prNumber,
      error,
    );
  }

  try {
    const downloads = await fetchNPMDownloads(mod.npm);
    mod.downloads = downloads;
  } catch (error) {
    console.error(
      'Module downloads cannot be fetched. YML Contents: ' +
        rawYmlContents +
        ' PR Number: ' +
        prNumber,
      error,
    );
  }

  // Auto name
  if (!mod.name) {
    mod.name = (pkg.name.startsWith('@') ? pkg.name.split('/')[1] : pkg.name)
      .replace('nuxt-', '')
      .replace('-module', '');
  }

  if (!mod.github) {
    mod.github = `https://github.com/${mod.repo.replace('#', '/tree/')}`;
  }
  if (!mod.website) {
    mod.website = mod.github;
  }

  mod.npm = pkg.name || mod.npm;

  // Type
  if (
    mod.repo.startsWith('nuxt-community/') ||
    mod.repo.startsWith('nuxt-modules/')
  ) {
    mod.type = 'community';
  } else if (mod.repo.startsWith('nuxt/')) {
    mod.type = 'official';
  } else {
    mod.type = '3rd-party';
  }

  // Category
  if (!mod.category) {
    throw new Error(
      'Module category not found. YML Contents: ' +
        rawYmlContents +
        ' PR Number: ' +
        prNumber,
    );
  } else if (!categories.includes(mod.category)) {
    let newCat = mod.category[0].toUpperCase() + mod.category.substr(1);
    if (newCat.length <= 3) {
      newCat = newCat.toUpperCase();
    }
    if (categories.includes(newCat)) {
      mod.category = newCat;
    } else {
      throw new Error(
        'Module category invalid. YML Contents: ' +
          rawYmlContents +
          ' PR Number: ' +
          prNumber,
      );
    }
  }

  // Default description
  if (!mod.description) {
    mod.description = pkg.description
  }

  return mod;
}

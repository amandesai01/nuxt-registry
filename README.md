<div align="center">
  <h1 align="center">Nuxt Registry</h1>
  <h3 align="center">A community driven registry of Nuxt Modules.</h3>

  <p align="center">
    Due to ever increasing PRs on official Nuxt module registry, it is becoming difficult for maintainers to review each and every PR. Problem? A lot of amazing modules are going undiscovered. Solution? A community driven registry of modules.
    <br />
    <a href="https://nuxt-registry.vercel.app"><strong>Explore modules »</strong></a>
  </p>
</div>

### How does it work?
1. Repo scans for open PRs in [nuxt/modules](https://github.com/nuxt/modules/pulls).
2. For each open PR, it looks for comment with approval message "LGTM" from verified approvers.
3. If approval comment found, it publishes the module in the registry without a verification badge (green tick).
4. All the modules published officially by Nuxt community get a verfied badge (green tick).

### Reporting Spams [WIP]
Create a PR updating the [list of blocked NPM packages](https://github.com/amandesai01/nuxt-registry/tree/main/lib/etc/blacklist.ts). Once verified by admins, the corresponding module will be banned.

### Becoming an approver
Create a PR adding your Github ID in [approvers list](https://github.com/amandesai01/nuxt-registry/tree/main/lib/etc/approvers.ts). If you have already published modules / have Nuxter badge or just a convincing Github profile, you will be added as approvers.

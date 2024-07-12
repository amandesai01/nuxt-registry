import { ofetch } from 'ofetch'

export function fetchPKG(name) {
  return ofetch('http://registry.npmjs.org/' + name)
}

export async function fetchNPMDownloads(name: string, period: string = 'last-month') {
  return (await ofetch(`https://api.npmjs.org/downloads/point/${period}/${name}`)).downloads as number;
}

export function fetchRawGithub(path) {
  return ofetch('https://raw.githubusercontent.com/' + path, { responseType: 'json' })
}

export function fetchGithubPkg(repo) {
  let path: string
  // HEAD will be the default branch
  [repo, path = 'HEAD'] = repo.split('#')

  return fetchRawGithub(repo + '/' + path + '/' + 'package.json')
}

export function uniq<T>(items: T[]) {
  return Array.from(new Set(items))
}
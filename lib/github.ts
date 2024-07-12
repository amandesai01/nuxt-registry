import { Octokit } from '@octokit/rest';
import { ofetch } from 'ofetch';

const GITHUB_PAT = process.env.GITHUB_PAT;

if (!GITHUB_PAT) {
  throw new Error('Missing github pat');
}

const gh = new Octokit({
  auth: GITHUB_PAT,
});

export const APPROVAL_MESSAGE = 'LGTM';

export async function getApprovedPRs(approverList: string[]) {
  const approverSet = new Set(approverList);

  const openPRs = (
    await gh.pulls.list({
      owner: 'nuxt',
      repo: 'modules',
      state: 'open',
    })
  ).data;

  const openPRCommentsList: any[] = await Promise.all(
    openPRs.map(n =>
      ofetch(n.comments_url, {
        headers: {
          Authorization: `Bearer ${GITHUB_PAT}`,
        },
      }),
    ),
  );

  const approvedPRs: [(typeof openPRs)[0], string][] = [];

  for (let index = 0; index < openPRCommentsList.length; index++) {
    const openPRComments = openPRCommentsList[index];
    const approvalIndex = openPRComments.findIndex(
      // @ts-ignore
      openPRComment =>
        approverSet.has(openPRComment.user.login) &&
        openPRComment.body.includes(APPROVAL_MESSAGE),
    );

    if (approvalIndex != -1) {
      approvedPRs.push([
        openPRs[index],
        openPRComments[approvalIndex].user.login as string,
      ]);
    }
  }

  return approvedPRs;
}

export function getPRDiff(diffURL: string) {
  return ofetch<string>(diffURL);
}

export async function getStars(repo: string, owner: string) {
  return (
    await gh.repos.get({
      repo,
      owner,
    })
  ).data.stargazers_count;
}

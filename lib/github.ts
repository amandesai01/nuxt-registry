import { Octokit } from '@octokit/rest';
import { ofetch } from 'ofetch';

const GITHUB_PAT = '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'

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
    openPRs.map(n => ofetch(n.comments_url, {
      headers: {
        Authorization: `Bearer ${GITHUB_PAT}`
      }
    })),
  );

  const approvedPRs: typeof openPRs = [];

  for (let index = 0; index < openPRCommentsList.length; index++) {
    const openPRComments = openPRCommentsList[index];
    const approvalIndex = openPRComments.findIndex(
      openPRComment => approverSet.has(openPRComment.user.login),
      // openPRComment.body.includes(APPROVAL_MESSAGE),
    );

    if (approvalIndex != -1) {
      approvedPRs.push(openPRs[index]);
    }
  }

  return approvedPRs;
}

export function getPRDiff(diffURL: string) {
  return ofetch<string>(diffURL);
}

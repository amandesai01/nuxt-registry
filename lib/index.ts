import { getApprovedPRs, getPRDiff } from './github';
import { getAddedFile } from "./diff-analysis";
import approvers from './etc/approvers';
import { ModuleInfo } from './nuxt-modules/types';
import { generateModuleInfo } from './module-resolver';

async function run() {
  const approvedPRs = await getApprovedPRs(approvers);

  console.log(`Found ${approvedPRs.length} approved PRs`);

  const approvedPRDiffs = await Promise.all(
    approvedPRs.map(pr => getPRDiff(pr.diff_url)),
  );

  const addedFiles = await Promise.all(approvedPRDiffs.map(d => getAddedFile(d, ".yml")))

  const modules: ModuleInfo[] = [];

  for (let index = 0; index < approvedPRs.length; index++) {
    const approvedPR = approvedPRs[index];
    const ymlFile = addedFiles[index];

    if (ymlFile == null) {
      console.log(`YML File for PR ${approvedPR.number} is missing. Skipping..`);
      continue;
    }

    try {
      const module = await generateModuleInfo(ymlFile, approvedPR.number);
      modules.push(module);
    } catch (error) {
      console.error(`######### Error Generating Module For #${approvedPR.number} #########`)
      console.error(error);
      console.error('#########');
    }
  }

  console.log(modules);
}

run();
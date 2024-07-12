import { getApprovedPRs, getPRDiff } from './github';
import { getAddedFile } from "./diff-analysis";
import approvers from './etc/approvers';
import { ModuleInfo } from './nuxt-modules/types';
import { generateModuleInfo, mergeModules } from './module-resolver';
import { getNuxtPublishedModules } from './official-modules';

async function run() {
  const approvedPRs = await getApprovedPRs(approvers);

  console.log(`Found ${approvedPRs.length} approved PRs`);

  const approvedPRDiffs = await Promise.all(
    approvedPRs.map(pr => getPRDiff(pr[0].diff_url)),
  );

  const addedFiles = await Promise.all(approvedPRDiffs.map(d => getAddedFile(d, ".yml")))

  const modules: ModuleInfo[] = [];

  for (let index = 0; index < approvedPRs.length; index++) {
    const approvedPR = approvedPRs[index];
    const ymlFile = addedFiles[index];

    if (ymlFile == null) {
      console.log(`YML File for PR ${approvedPR[0].number} is missing. Skipping..`);
      continue;
    }

    try {
      const module = await generateModuleInfo(ymlFile, approvedPR[0].number, approvedPR[1]);
      modules.push(module);
    } catch (error) {
      console.error(`######### Error Generating Module For #${approvedPR[0].number} #########`)
      console.error(error);
      console.error('#########');
    }
  }

  const officiallyApprovedModulesRaw = await getNuxtPublishedModules();

  const finalModuleList = await mergeModules(modules, officiallyApprovedModulesRaw);

  console.log(finalModuleList);

  return finalModuleList;
}

run();
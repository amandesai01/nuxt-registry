import parseGitDiff from 'parse-git-diff';

export async function getAddedFile(
  rawDiff: string,
  extension: string,
): Promise<string | null> {
  try {
    const result = parseGitDiff(rawDiff);
    // @ts-expect-error
    const file = result.files.find(f => f.path.endsWith(extension));

    if (!file) return null;

    if (file.type != 'AddedFile') return null;

    // @ts-expect-error
    const lines = file.chunks[0].changes.map(c => c.content);

    const stitchedContents = lines.join('\n');

    return stitchedContents;
  } catch (error) {}
  return null;
}

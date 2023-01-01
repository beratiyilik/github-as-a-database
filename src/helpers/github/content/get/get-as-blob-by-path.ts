import createGetTreeByBranch from '../../tree/get-by-branch';
import { GetContentAsBlobByPath, GitHubReturnAsBlob } from '../../types';
import createGetContentAsBlob from './get-as-blob';

const getContentAsBlobByPath = async (config: any, branch: string, path: string): Promise<GitHubReturnAsBlob> => {
  try {
    const getTreeByBranch = createGetTreeByBranch(config);
    const getContentAsBlob = createGetContentAsBlob(config);

    const { tree } = await getTreeByBranch(branch);

    const branchOfTree = tree.find((item: any) => item.path === path);

    const content = await getContentAsBlob(branchOfTree.sha);

    return content;
  } catch (error) {
    const message = `Error in getContentAsBlobByPath: ${error.message}`;
    console.error(message);
    // TODO: apply error handling
    // throw new Error(message, { cause: error });
    throw error;
  }
};

const createGetContentAsBlobByPath =
  (config: any): GetContentAsBlobByPath =>
  async (branch: string, path: string): Promise<GitHubReturnAsBlob> =>
    getContentAsBlobByPath(config, branch, path);

export default createGetContentAsBlobByPath;

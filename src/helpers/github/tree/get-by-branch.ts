import createGetRefByBranch from '../ref/get-by-branch';
import { GetTreeByBranch, GitHubTree } from '../types';
import createGetTree from './get';

const getTreeByBranch = async (config: any, branch: string, recursive = false): Promise<GitHubTree> => {
  try {
    const getRefByBranch = createGetRefByBranch(config);
    const getTree = createGetTree(config);

    const { ref, node_id, url, object } = await getRefByBranch(branch);

    const { sha, type, url: objectUrl } = object;

    const body = await getTree(sha, recursive);

    return body;
  } catch (error: any | { message: string }) {
    console.error(`Error getting tree: ${error.message}`);
    throw error;
  }
};

const createGetTreeByBranch =
  (config: any): GetTreeByBranch =>
  async (branch: string, recursive = false): Promise<GitHubTree> =>
    getTreeByBranch(config, branch, recursive);

export default createGetTreeByBranch;

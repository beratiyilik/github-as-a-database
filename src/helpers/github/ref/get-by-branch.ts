import { httpGet } from '@helpers/http';
import { GitHubEndpointBuilder, GitHubHeadersBuilder } from '../utils';
import { GetRefByBranch, GitHubRef } from '../types';

const getRefByBranch = async (config: any, branch: string): Promise<GitHubRef> => {
  try {
    const { accessToken, owner, repo } = config;
    const endpointBuilder = new GitHubEndpointBuilder(owner, repo);
    const endpoint = endpointBuilder.buildGetRefByBranchEndpoint(branch);
    const url = new URL(endpoint);
    const headersBuilder = new GitHubHeadersBuilder();

    const options = {
      host: url.host,
      path: endpoint,
      headers: headersBuilder.setUserAgent('github-as-a-database-app').setAuth(`token ${accessToken}`).build(),
    };

    const { statusCode, headers, body } = await httpGet<GitHubRef>(options);

    return body;
  } catch (error: any | { message: string }) {
    console.error(`Error getting ref by branch: ${error.message}`);
    throw error;
  }
};

const createGetRefByBranch =
  (config: any): GetRefByBranch =>
  async (branch: string): Promise<GitHubRef> =>
    getRefByBranch(config, branch);

export default createGetRefByBranch;

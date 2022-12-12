import { httpGet } from '@helpers/http';
import { GitHubEndpointBuilder, GitHubHeadersBuilder } from '../utils';
import { GetTree, GitHubTree } from '../types';

const getTree = async (config: any, sha: string, recursive = false): Promise<GitHubTree> => {
  try {
    const { accessToken, owner, repo } = config;
    const endpointBuilder = new GitHubEndpointBuilder(owner, repo);
    const endpoint = endpointBuilder.buildGetTreeEndpoint(sha, recursive);
    const url = new URL(endpoint);
    const headersBuilder = new GitHubHeadersBuilder();

    const options = {
      host: url.host,
      path: endpoint,
      headers: headersBuilder.setUserAgent('github-as-a-database-app').setAuth(`token ${accessToken}`).build(),
    };

    const { statusCode, headers, body } = await httpGet<GitHubTree>(options);

    return body;
  } catch (error: any | { message: string }) {
    console.error(`Error getting tree: ${error.message}`);
    throw error;
  }
};

const createGetTree =
  (config: any): GetTree =>
  async (sha: string, recursive = false): Promise<GitHubTree> =>
    getTree(config, sha, recursive);

export default createGetTree;

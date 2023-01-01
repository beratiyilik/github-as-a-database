import { httpGet } from '@helpers/http';
import { GitHubEndpointBuilder, GitHubHeadersBuilder } from '../../utils';
import { GitHubReturnContent, TryGetContent } from '../../types';

const tryGetContent = async (config: any, branch: string, path: string): Promise<GitHubReturnContent> => {
  try {
    const { owner, repo, accessToken } = config;
    const endpointBuilder = new GitHubEndpointBuilder(owner, repo);
    const endpoint = endpointBuilder.buildGetContentEndpoint(branch, path);
    const url = new URL(endpoint);
    const headersBuilder = new GitHubHeadersBuilder();

    const options = {
      host: url.host,
      path: endpoint,
      headers: headersBuilder.setUserAgent('github-as-a-database-app').setAuth(`token ${accessToken}`).build(),
    };

    const { statusCode, headers, body } = await httpGet<GitHubReturnContent>(options);

    return body;
  } catch (error) {
    const message = `Error in tryGetContent: ${error.message}`;
    console.error(message);
    // TODO: apply error handling
    // throw new Error(message, { cause: error });
    throw error;
  }
};

const createTryGet =
  (config: any): TryGetContent =>
  async (branch: string, path: string): Promise<GitHubReturnContent> =>
    tryGetContent(config, branch, path);

export default createTryGet;

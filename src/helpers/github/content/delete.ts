import { httpDelete } from '@helpers/http';
import { GitHubDeleteContent, Author, DeleteContent } from '../types';
import { GitHubEndpointBuilder, GitHubHeadersBuilder } from '../utils';

const deleteContent = async (config: any, branch: string, path: string, user: Author, message: string, sha: string): Promise<void> => {
  try {
    const { accessToken, owner, repo } = config;
    const endpointBuilder = new GitHubEndpointBuilder(owner, repo);
    const endpoint = endpointBuilder.buildDeleteContentEndpoint(path);
    const url = new URL(endpoint);
    const headersBuilder = new GitHubHeadersBuilder();

    const options = {
      host: url.host,
      path: endpoint,
      headers: headersBuilder.setUserAgent('github-as-a-database-app').setAuth(`token ${accessToken}`).build(),
    };

    const body = { branch, committer: user, message, sha };

    await httpDelete<GitHubDeleteContent>(options, body);
  } catch (error) {
    const message = `Error in deleteContent: ${error.message}`;
    console.error(message);
    // TODO: apply error handling
    // throw new Error(message, { cause: error });
    throw error;
  }
};

const createDeleteContent =
  (config: any): DeleteContent =>
  async (branch: string, path: string, user: Author, message: string, sha: string): Promise<void> =>
    deleteContent(config, branch, path, user, message, sha);

export default createDeleteContent;

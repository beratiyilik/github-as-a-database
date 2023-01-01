import { httpPut } from '@helpers/http';
import { GitHubCreateOrUpdateContent, Author, CreateOrUpdateContent } from '../types';
import { GitHubEndpointBuilder, GitHubHeadersBuilder } from '../utils';
import { toJSON } from '@/utils/json';
import { encode } from '@/utils/security';

const createOrUpdateContent = async (
  config: any,
  branch: string,
  path: string,
  content: any | string,
  user: Author,
  message: string,
  sha?: string | null,
): Promise<string> => {
  try {
    const { owner, repo, accessToken } = config;
    const endpointBuilder = new GitHubEndpointBuilder(owner, repo);
    const endpoint = endpointBuilder.buildCreateOrUpdateContentEndpoint(path);
    const url = new URL(endpoint);
    const headersBuilder = new GitHubHeadersBuilder();

    const options = {
      host: url.host,
      path: endpoint,
      headers: headersBuilder.setUserAgent('github-as-a-database-app').setAuth(`token ${accessToken}`).build(),
    };

    const body = {
      branch,
      committer: user,
      author: user,
      message,
      content: encode(toJSON(content)),
      sha,
    };

    const { statusCode, headers, body: returnBody } = await httpPut<GitHubCreateOrUpdateContent>(options, body);

    return returnBody.content.sha;
  } catch (error) {
    const message = `Error in createOrUpdateContent: ${error.message}`;
    console.error(message);
    // TODO: apply error handling
    // throw new Error(message, { cause: error });
    throw error;
  }
};

const createCreateOrUpdateContent =
  (config: any): CreateOrUpdateContent =>
  async (branch: string, path: string, content: any | string, user: Author, message: string, sha?: string | null): Promise<string> =>
    createOrUpdateContent(config, branch, path, content, user, message, sha);

export default createCreateOrUpdateContent;

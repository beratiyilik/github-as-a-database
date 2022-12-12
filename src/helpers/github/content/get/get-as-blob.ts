import { httpGet } from '@helpers/http';
import { GitHubEndpointBuilder, GitHubHeadersBuilder } from '../../utils';
import { GetContentAsBlob, GitHubReturnAsBlob } from '../../types';

const getContentAsBlob = async (config: any, sha: string): Promise<GitHubReturnAsBlob> => {
  try {
    const { owner, repo, accessToken } = config;
    const endpointBuilder = new GitHubEndpointBuilder(owner, repo);
    const endpoint = endpointBuilder.buildGetContentAsBlobEndpoint(sha);
    const url = new URL(endpoint);
    const headersBuilder = new GitHubHeadersBuilder();

    const options = {
      host: url.host,
      path: endpoint,
      headers: headersBuilder.setUserAgent('github-as-a-database-app').setAuth(`token ${accessToken}`).build(),
    };

    const { statusCode, headers, body } = await httpGet<GitHubReturnAsBlob>(options);

    return body;
  } catch (error) {
    console.error(`Error getting content as blob: ${error.message}`);
    throw error;
  }
};

const createGetContentAsBlob =
  (config: any): GetContentAsBlob =>
  async (sha: string): Promise<GitHubReturnAsBlob> =>
    getContentAsBlob(config, sha);

export default createGetContentAsBlob;

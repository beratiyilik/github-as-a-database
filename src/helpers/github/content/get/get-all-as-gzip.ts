import { httpGet } from '@/helpers/http';
import { GitHubEndpointBuilder, GitHubHeadersBuilder } from '../../utils';
import { GetAllContentAsGzip, GitHubReturnAsGzip } from '../../types';

const parseETag = etag => etag.replace(/^W\//, '').replace(/"/g, '');
const getETag = (headers: { [key: string]: string }): string | undefined => headers['etag'] || headers['ETag'];
const isWeakETag = etag => etag.startsWith('W/');

const getAllContentAsGzip = async (config: any, branch: string): Promise<GitHubReturnAsGzip> => {
  try {
    const { owner, repo, accessToken } = config;
    const endpointBuilder = new GitHubEndpointBuilder(owner, repo);
    const endpoint = endpointBuilder.buildGetAllContentAsGzipEndpoint(branch);
    const url = new URL(endpoint);
    const headersBuilder = new GitHubHeadersBuilder();

    const options = {
      host: url.host,
      path: endpoint,
      headers: headersBuilder
        .setAuth(`token ${accessToken}`)
        .setUserAgent('github-as-a-database-app')
        .setAccept('application/vnd.github.v3.raw; charset=utf-8')
        .setAcceptEncoding('gzip')
        .build(),
    };

    const { statusCode, headers, body = [] } = await httpGet<any[]>(options);

    const etag = getETag(headers);

    const filterOnlyJsonAndNotEmpty = ({ getFileExtension, chunks }) => getFileExtension() === 'json' && chunks.length > 0;

    const mapTo = ({ chunks, getPath, getContentAsObject, ...rest }) => ({
      ...rest,
      path: getPath(),
      content: getContentAsObject(),
    });

    return {
      etag,
      content: body.filter(filterOnlyJsonAndNotEmpty).map(mapTo),
    };
  } catch (error) {
    console.error(`error in getAllAsGzip: ${error.message}`);
    throw error;
  }
};

const createGetAllContentAsGzip =
  (config: any): GetAllContentAsGzip =>
  async (branch: string): Promise<GitHubReturnAsGzip> =>
    getAllContentAsGzip(config, branch);

export default createGetAllContentAsGzip;

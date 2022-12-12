import createGetAllContentAsGzip from './get-all-as-gzip';
import createGetContentAsBlobByPath from './get-as-blob-by-path';
import createGetContentAsBlob from './get-as-blob';
import createTryGetContent from './try-get';
import { GetContent, GitHubContentAndSha } from '../../types';
import { toObject } from '@/utils/json';
import { decode } from '@/utils/security';

const getContent = async <T = any>(config: any, branch: string, path: string): Promise<GitHubContentAndSha<T>> => {
  try {
    const tryGetContent = createTryGetContent(config);
    const getContentAsBlob = createGetContentAsBlob(config);

    const { content, sha } = await tryGetContent(branch, path);
    if (content)
      return {
        content: <T>toObject(decode(content)),
        sha,
      };

    const { content: contentAsBlob, sha: shaAsBlob } = await getContentAsBlob(sha);

    return {
      content: <T>toObject(decode(contentAsBlob)),
      sha: shaAsBlob,
    };
  } catch (error) {
    console.error(`Error getting content: ${error.message}`);
    throw error;
  }
};

const createGetContent =
  (config: any): GetContent =>
  async (branch: string, path: string): Promise<GitHubContentAndSha> =>
    getContent(config, branch, path);

export default createGetContent;

export { createGetAllContentAsGzip, createGetContentAsBlobByPath, createGetContentAsBlob, createTryGetContent };

import { GithubDB } from '@/helpers/github';
import { GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO } from '@/config';

const ARTICLE_ROOT_PATH = 'database/articles';
const ARTICLE_PATH = `${ARTICLE_ROOT_PATH}/index.json`;

class ArticleService {
  public async get(branch: string): Promise<any> {
    const githubDB = new GithubDB(GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch);
    const { content, sha } = await githubDB.get(ARTICLE_PATH);
    return {
      etag: sha,
      content,
    };
  }

  public async getById(branch: string, id: string): Promise<any> {
    const githubDB = new GithubDB(GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch);
    const { content, sha } = await githubDB.get(`${ARTICLE_ROOT_PATH}/${id}/index.json`);
    return {
      etag: sha,
      content,
    };
  }

  public async update(
    branch: string,
    id: string,
    data: any,
  ): Promise<{
    etag: string;
    location: string;
  }> {
    if (data.id !== id) throw new Error('Article id in path and body must be the same!');

    const githubDB = new GithubDB(GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch);
    await githubDB.init();
    const { content: originalArticle, sha: originalSha } = await githubDB.get(`${ARTICLE_ROOT_PATH}/${id}/index.json`);
    const { content: articleList, sha: articleListSha } = await githubDB.get(ARTICLE_PATH);

    const { id: orginalId, ...rest } = data;

    const newArticle = { ...originalArticle, ...rest };
    const commitMessage = `Update article detail ${id}`;
    const newSha = await githubDB.update(`${ARTICLE_ROOT_PATH}/${id}/index.json`, newArticle, originalSha, commitMessage);

    const articleInList = articleList.find((article: any) => article.id === id);
    articleInList.name = newArticle.name;

    await githubDB.update(ARTICLE_PATH, articleList, articleListSha, `Update article list item ${id}`);

    const location = `http://localhost:3000/api/v1/article/${id}`;
    return { etag: newSha, location };
  }
}

export default ArticleService;

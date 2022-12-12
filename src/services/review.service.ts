import { GithubDB } from '@/helpers/github';
import { GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO } from '@/config';
import { v4 as uuidv4 } from 'uuid';

const REVIEW_PATH = 'database/relationships/reviews.json';

class ReviewService {
  public async get(branch: string): Promise<any> {
    const githubDB = new GithubDB(GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch);
    const { content, sha } = await githubDB.get(REVIEW_PATH);
    return {
      etag: sha,
      content,
    };
  }

  public async create(branch: string, data: any): Promise<any> {
    const githubDB = new GithubDB(GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch);
    const { content, sha } = await githubDB.get(REVIEW_PATH);
    data.id = uuidv4();
    content.push(data);
    const newSha = await githubDB.update(REVIEW_PATH, content, sha, `Add review ${data.id}`);
    return {
      etag: newSha,
      content,
      location: 'http://localhost:3000/api/v1/review',
    };
  }

  public async delete(branch: string, id: string): Promise<any> {
    const githubDB = new GithubDB(GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch);
    const { content, sha } = await githubDB.get(REVIEW_PATH);
    const index = content.findIndex((review: any) => review.id === id);
    if (index === -1) {
      throw new Error('Review not found');
    }
    content.splice(index, 1);
    const newSha = await githubDB.update(REVIEW_PATH, content, sha, `Delete review ${id}`);
    return {
      etag: newSha,
      content,
      location: 'http://localhost:3000/api/v1/review',
    };
  }
}

export default ReviewService;

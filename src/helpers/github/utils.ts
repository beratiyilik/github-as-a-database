import { GITHUB_API_URL } from '@/constants';

export class GitHubEndpointBuilder {
  private readonly owner: string;
  private readonly repo: string;

  constructor(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
  }

  buildGetContentEndpoint = (branch: string, path: string): string =>
    `${GITHUB_API_URL}/repos/${this.owner}/${this.repo}/contents/${path}?ref=${branch}`;

  buildGetContentAsBlobEndpoint = (sha: string): string => `${GITHUB_API_URL}/repos/${this.owner}/${this.repo}/git/blobs/${sha}`;

  buildCreateOrUpdateContentEndpoint = (path: string): string => `${GITHUB_API_URL}/repos/${this.owner}/${this.repo}/contents/${path}`;

  buildDeleteContentEndpoint = (path: string): string => `${GITHUB_API_URL}/repos/${this.owner}/${this.repo}/contents/${path}`;

  buildGetTreeEndpoint = (sha: string, recursive: boolean): string =>
    `${GITHUB_API_URL}/repos/${this.owner}/${this.repo}/git/trees/${sha}?recursive=${recursive}`;

  buildGetRefByBranchEndpoint = (branch: string): string => `${GITHUB_API_URL}/repos/${this.owner}/${this.repo}/git/ref/heads/${branch}`;

  buildGetAllContentAsGzipEndpoint = (branch: string): string => `${GITHUB_API_URL}/repos/${this.owner}/${this.repo}/tarball/${branch}`;
}

export class GitHubHeadersBuilder {
  private readonly _headers: { [key: string]: string };

  constructor() {
    const url = new URL(GITHUB_API_URL);
    this._headers = {
      Host: url.hostname,
      Authorization: '',
      'User-Agent': '',
      Accept: 'application/vnd.github.v3.json; charset=utf-8',
      // 'Accept-Encoding': 'gzip, deflate, br',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  setHost(host: string): GitHubHeadersBuilder {
    this._headers.Host = host;
    return this;
  }

  setAuth(auth: string): GitHubHeadersBuilder {
    this._headers.Authorization = auth;
    return this;
  }

  setUserAgent(userAgent: string): GitHubHeadersBuilder {
    this._headers['User-Agent'] = userAgent;
    return this;
  }

  setAccept(accept: string): GitHubHeadersBuilder {
    this._headers.Accept = accept;
    return this;
  }

  setAcceptEncoding(acceptEncoding: string): GitHubHeadersBuilder {
    this._headers['Accept-Encoding'] = acceptEncoding;
    return this;
  }

  setGitHubApiVersion(gitHubApiVersion: string): GitHubHeadersBuilder {
    this._headers['X-GitHub-Api-Version'] = gitHubApiVersion;
    return this;
  }

  build(): { [key: string]: string } | undefined {
    return this._headers as { [key: string]: string } | undefined;
  }
}

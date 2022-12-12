export interface GitHubDeleteContent {
  content: null;
  commit: Commit;
}

export interface GitHubCreateOrUpdateContent {
  content: GitHubReturnContent | null;
  commit: Commit;
}

export interface Commit {
  sha: string;
  node_id: string;
  url: string;
  html_url: string;
  author: Author;
  committer: Author;
  message: string;
  tree: CommitTree;
  parents: Parent[];
  verification: Verification;
}

export interface Author {
  date?: Date;
  name: string;
  email: string;
}

export interface Parent {
  url: string;
  html_url: string;
  sha: string;
}

export interface CommitTree {
  url: string;
  sha: string;
}

export interface Verification {
  verified: boolean;
  reason: string;
  signature: null;
  payload: null;
}

export interface GitHubReturnContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: Links;
  encoding?: string;
  content?: string;
}

export interface Links {
  self: string;
  git: string;
  html: string;
}

export interface GitHubReturnAsBlob {
  content: string;
  encoding: string;
  url: string;
  sha: string;
  size: number;
  node_id: string;
}

export interface GitHubTree {
  sha: string;
  url: string;
  tree: TreeElement[];
  truncated: boolean;
}

export interface TreeElement {
  path: string;
  mode: string;
  type: string;
  size?: number;
  sha: string;
  url: string;
}

export interface GitHubRef {
  ref: string;
  node_id: string;
  url: string;
  object: Object;
}

export interface Object {
  type: string;
  sha: string;
  url: string;
}

export interface GitHubReturnAsGzip {
  etag: string;
  content: any[];
}

export interface GitHubContentAndSha<T = any> {
  content: T;
  sha: string;
}

export type GetRefByBranch = (branch: string) => Promise<GitHubRef>;

export type GetTreeByBranch = (branch: string, recursive?: boolean) => Promise<GitHubTree>;

export type GetTree = (sha: string, recursive?: boolean) => Promise<GitHubTree>;

export type GetContentAsBlob = (sha: string) => Promise<GitHubReturnAsBlob>;

export type GetContentAsBlobByPath = (branch: string, path: string) => Promise<GitHubReturnAsBlob>;

export type TryGetContent = (branch: string, path: string) => Promise<GitHubReturnContent>;

export type GetContent<T = any> = (branch: string, path: string) => Promise<GitHubContentAndSha<T>>;

export type GetAllContentAsGzip = (branch: string) => Promise<GitHubReturnAsGzip>;

export type CreateOrUpdateContent = (
  branch: string,
  path: string,
  content: any | string,
  user: Author,
  message: string,
  sha?: string | null,
) => Promise<string>;

export type DeleteContent = (branch: string, path: string, user: Author, message: string, sha: string) => Promise<void>;

import createGetRefByBranch from '../ref/get-by-branch';
import {
  createCreateOrUpdateContent,
  createDeleteContent,
  createGetAllContentAsGzip,
  createGetContent,
  createGetContentAsBlob,
  createGetContentAsBlobByPath,
  createTryGetContent,
} from '../content';
import { createGetTree, createGetTreeByBranch } from '../tree';
import { Author, GetAllContentAsGzip, GetContent, GetContentAsBlobByPath, GetRefByBranch, GetTree, GetTreeByBranch, TryGetContent } from '../types';

class GithubDB {
  public accessToken: string;
  public owner: string;
  public repo: string;
  public branch: string;
  public author: Author;

  public files: any[] = [];
  public tree: any;
  public branches: any[] = [];

  private _getRefByBranch: GetRefByBranch;
  private _getTree: GetTree;
  private _getTreeByBranch: GetTreeByBranch;
  private _getAllContentAsGzip: GetAllContentAsGzip;
  private _getContentAsBlobByPath: GetContentAsBlobByPath;
  private _getContentAsBlob: GetContentAsBlobByPath;
  private _getContent: GetContent;
  private _tryGetContent: TryGetContent;

  private _createOrUpdateContent;
  private _deleteContent;

  constructor(accessToken: string, owner: string, repo: string, branch: string, author?: Author) {
    this.branch = branch;
    this.accessToken = accessToken;
    this.owner = owner;
    this.repo = repo;
    this.author = author;

    const config = { accessToken, owner, repo };

    this._getRefByBranch = createGetRefByBranch(config);
    this._getTree = createGetTree(config);
    this._getTreeByBranch = createGetTreeByBranch(config);

    this._getAllContentAsGzip = createGetAllContentAsGzip(config);
    this._getContentAsBlobByPath = createGetContentAsBlobByPath(config);
    this._getContentAsBlob = createGetContentAsBlob(config);
    this._getContent = createGetContent(config);
    this._tryGetContent = createTryGetContent(config);

    this._createOrUpdateContent = createCreateOrUpdateContent(config);
    this._deleteContent = createDeleteContent(config);
  }

  private filterOnlyDatabaseFolder = ({ path }) => path.startsWith('database');

  private addShaProp = file => ({ ...file, sha: null });

  public async init() {
    try {
      console.log('GithubDb initialization has been started');
      const startTime = Date.now();
      await this.getAllContent();

      const { sha, tree } = await this.getTree();
      const list = tree.filter(this.filterOnlyDatabaseFolder);

      this.files = this.files.map(file => {
        const { sha } = list.find(({ path }) => path === file.path);
        return { ...file, sha };
      });

      const endTime = Date.now();
      console.log('GithubDb initialization has been finished');
      console.log(`GithubDb initialization took ${endTime - startTime} ms 📣`);
    } catch (error) {
      console.error(`Error initializing GithubDb: ${error.message}`);
      throw error;
    }
  }

  private getAllContent = async () => {
    const { etag, content = [] } = await this._getAllContentAsGzip(this.branch);

    this.files = content.filter(this.filterOnlyDatabaseFolder).map(this.addShaProp);
  };

  private getTree = async () => {
    const { sha, tree } = await this._getTreeByBranch(this.branch, true);
    this.tree = tree;
    return { sha, tree };
  };

  public get = async (path: string) => {
    const file = this.files.find(({ path: filePath }) => filePath === path);
    if (file)
      return {
        sha: file.sha,
        content: file.content,
      };

    const res = await this._getContent(this.branch, path);
    return res;
  };

  public create = async (path: string, content: any, message: string) => {
    const sha = await this._createOrUpdateContent(this.branch, path, content, this.author, message);
    this.files.push({ path, sha, content });
    return sha;
  };

  public update = async (path: string, content: any, sha: string, message: string) => {
    const newSha = await this._createOrUpdateContent(this.branch, path, content, this.author, message, sha);
    const file = this.files.find(({ path: filePath }) => filePath === path);
    if (file) {
      file.sha = newSha;
      file.content = content;
    } else this.files.push({ path, sha: newSha, content });
    return newSha;
  };

  public createOrUpdate = async (path: string, content: any, message: string, sha?: string) =>
    sha ? this.update(path, content, sha, message) : this.create(path, content, message);

  public delete = async (path: string, sha: string, message: string) => {
    await this._deleteContent(this.branch, path, this.author, message, sha);
    this.files = this.files.filter(({ path: filePath }) => filePath !== path);
  };
}

export default GithubDB;

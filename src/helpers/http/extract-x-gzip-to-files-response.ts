import { https } from 'follow-redirects';
import zlib from 'zlib';
import fs from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { v4 as uuidv4 } from 'uuid';
import { IFileOptions, IFile } from './types';
import { toObject } from '@/utils/json';
import { RejectError } from './http.errors';

const ROOT_DIR = process.cwd();
const TEMP_DIR = `${ROOT_DIR}/tmp`;

class File implements IFile {
  name: string;
  size: number;
  type: string;
  mode: number;
  mtime: number;
  chunks: Array<any>;
  constructor({ name, size, type, mode, mtime }: IFileOptions) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.mode = mode;
    this.mtime = mtime;
    this.chunks = [];
  }
  getFileExtension = () => this.name.split('.').pop();
  getPath = () => this.name.split('/').slice(1).join('/'); // strip repo name and HEAD id
  addChunk = (chunk: any) => this.chunks.push(chunk);
  getContentAsBinary = () => Buffer.concat(this.chunks);
  getContentAsText = () => this.getContentAsBinary().toString('utf8');
  getContentAsObject = () => toObject(this.getContentAsText());
}

const generateFilename = (): string => `${TEMP_DIR}/${uuidv4()}.tar.gz`;

const checkDirectoryExists = (dirname: string) => fs.existsSync(dirname);

const createDirectory = (dirname: string) => {
  if (checkDirectoryExists(dirname)) return;
  createDirectory(path.dirname(dirname));
  fs.mkdirSync(dirname);
};

const createDirectoryIfNotExists = (filename: string) => createDirectory(path.dirname(filename));

const downloadFile = async (response: https.IncomingMessage, filename: string): Promise<void> =>
  new Promise((resolve: Function, reject: Function) => {
    const stream = fs.createWriteStream(filename);
    stream.on('error', (error: Error) => reject(error));
    stream.on('finish', () => {
      stream.close();
      resolve();
    });
    response.pipe(stream);
  });

const readFile = async (filename: string): Promise<IFile[]> =>
  new Promise((resolve: Function, reject: Function) => {
    const readStream = fs.createReadStream(filename);
    const extract = tar.extract();
    const files: IFile[] = [];

    readStream.on('error', (error: Error) => reject(error));

    extract.on('entry', function (header: any, stream: any, next: any) {
      const file = new File(header);

      files.push(file);

      stream.on('data', function (chunk: any) {
        file.addChunk(chunk);
      });

      stream.on('end', function () {
        next();
      });

      stream.on('error', reject);

      stream.resume();
    });

    extract.on('finish', function () {
      resolve(files);
    });

    extract.on('error', reject);

    readStream.pipe(zlib.createGunzip()).pipe(extract);
  });

const removeFile = async (filename: string): Promise<void> => unlink(filename);

const extractXGzipToFilesResponse = async (response: https.IncomingMessage, resolve: Function, reject: Function): Promise<any> => {
  const { statusCode, statusMessage, headers } = response;
  try {
    const filename = generateFilename();
    createDirectoryIfNotExists(filename);
    await downloadFile(response, filename);
    const files = await readFile(filename);
    await removeFile(filename);
    resolve({
      statusCode,
      statusMessage,
      headers,
      body: files,
    });
  } catch (error) {
    // new Error('Error in extractXGzipToFilesResponse', { cause: error })
    reject(
      new RejectError<any>(`Error in extractXGzipToFilesResponse: ${error?.message}`, {
        statusCode,
        statusMessage,
        headers,
        error,
      }),
    );
  }
};

export default extractXGzipToFilesResponse;

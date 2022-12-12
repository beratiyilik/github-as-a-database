import { https } from 'follow-redirects';
import zlib from 'zlib';
import fs from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from './types';
import { toObject } from '@/utils/json';

const ROOT_DIR = process.cwd();
const TEMP_DIR = `${ROOT_DIR}/tmp`;

class File implements IFile {
  name: string;
  size: number;
  type: string;
  mode: number;
  mtime: number;
  chunks: Array<any>;
  constructor({ name, size, type, mode, mtime }) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.mode = mode;
    this.mtime = mtime;
    this.chunks = [];
  }
  getFileExtension = () => this.name.split('.').pop();
  getPath = () => this.name.split('/').slice(1).join('/'); // strip repo name and HEAD id
  addChunk = chunk => this.chunks.push(chunk);
  getContentAsBinary = () => Buffer.concat(this.chunks);
  getContentAsText = () => this.getContentAsBinary().toString('utf8');
  getContentAsObject = () => toObject(this.getContentAsText());
}

const generateFilename = (): string => `${TEMP_DIR}/${uuidv4()}.tar.gz`;

const ensureDirectoryExistence = (filename: string) => {
  const dirname = path.dirname(filename);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const downloadFile = async (response: https.IncomingMessage, filename: string): Promise<void> =>
  new Promise((resolve: Function, reject: Function) => {
    const stream = fs.createWriteStream(filename);
    response.on('end', () => resolve());
    response.on('error', error => reject(error));
    stream.on('finish', () => stream.close());
    response.pipe(stream);
  });

const readFile = async (filename: string): Promise<IFile[]> =>
  new Promise((resolve: Function, reject: Function) => {
    const readStream = fs.createReadStream(filename);
    const extract = tar.extract();
    const files: IFile[] = [];

    extract.on('entry', function (header, stream, next) {
      // header is the tar header
      // stream is the content body (might be an empty stream)
      // call next when you are done with this entry

      files.push(new File(header));

      stream.on('data', function (chunk) {
        // decompression chunk as it is generated

        const file = files.find(({ name }) => name === header.name);
        file.addChunk(chunk);
      });

      stream.on('end', function () {
        next(); // ready for next entry
      });

      stream.resume(); // just auto drain the stream
    });

    extract.on('finish', function () {
      // all entries read
      resolve(files);
    });

    readStream.pipe(zlib.createGunzip()).pipe(extract);
  });

const removeFile = async (filename: string): Promise<void> => unlink(filename);

const extractGzipToFilesResponse = async (response: https.IncomingMessage, resolve: Function, reject: Function): Promise<any> => {
  try {
    const { statusCode, statusMessage, headers } = response;
    const filename = generateFilename();
    ensureDirectoryExistence(filename);
    await downloadFile(response, filename);
    const files = await readFile(filename);
    resolve({
      statusCode,
      statusMessage,
      headers,
      body: files,
    });
    removeFile(filename);
  } catch (error) {
    reject(error);
  }
};

export default extractGzipToFilesResponse;

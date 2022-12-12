import { https } from 'follow-redirects';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH';

export type Headers =
  | {
      [key: string]: string;
    }
  | https.OutgoingHttpHeaders
  | https.IncomingHttpHeaders;

export interface IResponse<Type = string> {
  statusCode: number;
  statusMessage?: string;
  headers: Headers;
  body?: Type;
}

export type HttpGet = <Type>(options: https.RequestOptions) => Promise<IResponse<Type>>;
export type HttpPost = <Type>(options: https.RequestOptions, body: any) => Promise<IResponse<Type>>;
export type HttpPut = <Type>(options: https.RequestOptions, body: any) => Promise<IResponse<Type>>;
export type HttpDelete = <Type>(options: https.RequestOptions, body?: any) => Promise<IResponse<Type>>;
export type HttpHead = <Type>(options: https.RequestOptions) => Promise<IResponse<Type>>;
export type HttpOptions = <Type>(options: https.RequestOptions) => Promise<IResponse<Type>>;
export type HttpPatch = <Type>(options: https.RequestOptions, body: any) => Promise<IResponse<Type>>;

export interface IHttpError extends Error {
  statusCode: number;
  statusMessage?: string;
  mapToError: (originalErrorBody?: any) => Error;
}

export interface IFile {
  name: string;
  size: number;
  type: string;
  mode: number;
  mtime: number;
  chunks: Array<any>;
  getFileExtension: () => string;
  getPath: () => string;
  addChunk: (chunk: any) => void;
  getContentAsBinary: () => Buffer;
  getContentAsText: () => string;
  getContentAsObject: () => any;
}

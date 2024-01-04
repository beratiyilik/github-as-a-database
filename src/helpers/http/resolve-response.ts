import { https } from 'follow-redirects';
import zlib from 'zlib';
import extractXGzipToFilesResponse from './extract-x-gzip-to-files-response';
import {
  hasBody,
  isContentEncodingGzip,
  isContentEncodingDeflate,
  isContentEncodingBr,
  isContentTypeJSON,
  isContentTypeXGzip,
  isContentTypeOctetStream,
} from './utils';
import { toObject } from '@/utils/json';
import { RejectError } from './http.errors';

const extract = <Type = string>(response: https.IncomingMessage, resolve: Function, reject: Function) => {
  const { statusCode, statusMessage, headers } = response;
  try {
    const chunks: Buffer[] = [];
    response.on('data', (chunk: any) => chunks.push(chunk));
    response.on('end', () => {
      const buffer: Buffer = Buffer.concat(chunks);
      let body: string | Type | Buffer = '';
      if (isContentTypeJSON(headers)) body = toObject<Type>(buffer.toString('utf8'));
      else if (isContentTypeOctetStream(headers)) body = buffer;
      else body = buffer.toString('utf8');
      resolve({
        statusCode,
        statusMessage,
        headers,
        body,
      });
    });
  } catch (error) {
    // new Error('Error in extract', { cause: error })
    reject(
      new RejectError<Type>(`Error in extract: ${error?.message}`, {
        statusCode,
        statusMessage,
        headers,
        error,
      }),
    );
  }
};

const resolveResponse = <Type = string>(response: https.IncomingMessage, resolve: Function, reject: Function) => {
  const { statusCode, statusMessage, headers, method } = response;

  if (!hasBody(statusCode, method)) return resolve({ statusCode, statusMessage, headers });

  if (isContentEncodingGzip(headers)) response.pipe(zlib.createGunzip());
  if (isContentEncodingDeflate(headers)) response.pipe(zlib.createInflate());
  if (isContentEncodingBr(headers)) response.pipe(zlib.createBrotliDecompress());

  // x-gzip is not a standard as per RFC 6713, but it is used in practice
  if (isContentTypeXGzip(headers)) return extractXGzipToFilesResponse(response, resolve, reject);

  return extract<Type>(response, resolve, reject);
};

export default resolveResponse;

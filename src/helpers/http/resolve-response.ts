import { https } from 'follow-redirects';
import zlib from 'zlib';
import extractGzipToFilesResponse from './extract-gzip-to-files-response';
import { hasBody, isContentEncodingGzip, isContentTypeJSON, isContentTypeXGzip } from './utils';
import { toObject } from '@/utils/json';

const extract = <Type = string>(response: https.IncomingMessage, resolve: Function, reject: Function) => {
  const { statusCode, statusMessage, headers } = response;
  const chunks = [];
  response.on('data', chunk => chunks.push(chunk));
  response.on('end', () => {
    let data: string | Type = '';
    try {
      data = Buffer.concat(chunks).toString('utf8');
      if (isContentTypeJSON(headers)) data = toObject<Type>(data);
    } catch (err) {
      reject(err);
    }
    resolve({
      statusCode,
      statusMessage,
      headers,
      body: data,
    });
  });
  response.on('error', reject);
};

const resolveResponse = <Type = string>(response: https.IncomingMessage, resolve: Function, reject: Function) => {
  const { statusCode, statusMessage, headers } = response;

  if (!hasBody(statusCode)) return resolve({ statusCode, statusMessage, headers });

  if (isContentTypeXGzip(headers)) return extractGzipToFilesResponse(response, resolve, reject);

  if (isContentEncodingGzip(headers)) {
    const gunzip = zlib.createGunzip();
    response.pipe(gunzip);
    return extract<Type>(gunzip, resolve, reject);
  }

  return extract<Type>(response, resolve, reject);
};

export default resolveResponse;

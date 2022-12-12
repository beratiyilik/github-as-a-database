import { https } from 'follow-redirects';
import { hasBody, hasError } from './utils';
import resolveResponse from './resolve-response';
import { HttpGet, IResponse } from './types';

const httpGet: HttpGet = async <Type = string>(options: https.RequestOptions): Promise<IResponse<Type>> =>
  new Promise((resolve: Function, reject: Function) => {
    const request = https.get(options, (response: https.IncomingMessage) => {
      const { statusCode, statusMessage, headers } = response;

      // TODO: replace with more sophisticated error handling (e.g. checkError)
      if (hasError(statusCode)) return reject(new Error(`Request Failed: ${options.path} ${statusCode} ${statusMessage}`));

      if (!hasBody(statusCode)) return resolve({ statusCode, statusMessage, headers });

      return resolveResponse<Type>(response, resolve, reject);
    });
    request.on('error', reject);
    request.end();
  });

export default httpGet;

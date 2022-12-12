import { https } from 'follow-redirects';
import { hasBody, hasError } from './utils';
import resolveResponse from './resolve-response';
import { IResponse } from './types';
import { toJSON } from '@/utils/json';

const httpRequest = async <Type>(options: https.RequestOptions, data: any): Promise<IResponse<Type>> =>
  new Promise((resolve: Function, reject: Function) => {
    const dataAsString = data ? toJSON(data) : '';
    if (data) options.headers['Content-Length'] = dataAsString.length;
    const request = https.request(options, (response: https.IncomingMessage) => {
      const { statusCode, statusMessage, headers } = response;

      // TODO: replace with more sophisticated error handling (e.g. checkError)
      if (hasError(statusCode)) return reject(new Error(`Request Failed: ${options.path} ${statusCode} ${statusMessage}`));

      if (!hasBody(statusCode, options.method)) return resolve({ statusCode, statusMessage, headers });

      return resolveResponse<Type>(response, resolve, reject);
    });
    if (data) request.write(dataAsString);
    request.on('error', reject);
    request.end();
  });

export default httpRequest;

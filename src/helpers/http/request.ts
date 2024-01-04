import { https } from 'follow-redirects';
import { hasBody, hasError } from './utils';
import resolveResponse from './resolve-response';
import { IResponse } from './types';
import { toJSON } from '@/utils/json';
import { RejectError } from './http.errors';

const _httpRequest = async <Type>(options: https.RequestOptions, body?: any): Promise<IResponse<Type>> =>
  new Promise((resolve: Function, reject: Function) => {
    // TODO: handle body stringify method json or another one
    let dataAsString = '';
    if (body) {
      dataAsString = toJSON(body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = dataAsString.length;
    }
    // TODO: handle default headers
    // options.headers['Accept'] = 'application/json, 'application/octet-stream', 'application/x-gzip';
    // options.headers['Accept-Encoding'] = 'gzip, deflate, br';
    const request = https.request(options, (response: https.IncomingMessage) => {
      const { statusCode, statusMessage, headers, method } = response;
      response.on('error', (error: Error) => {
        reject(
          new RejectError<Type>(`response.on error: ${error?.message}`, {
            statusCode,
            statusMessage,
            headers,
            error,
          }),
        );
      });
      if (!hasBody(statusCode, method) || hasError(statusCode)) return resolve({ statusCode, statusMessage, headers });
      return resolveResponse<Type>(response, resolve, reject);
    });
    if (body) request.write(dataAsString);
    request.on('error', reject);
    request.end();
  });

const httpRequest = async <Type>(options: https.RequestOptions, body?: any): Promise<IResponse<Type>> => {
  try {
    const result = await _httpRequest<Type>(options, body);
    return result;
  } catch (error) {
    if (error instanceof RejectError) return error.response;
    // throw new Error("httpRequest error", { cause: error });
    error.message = `httpRequest error: ${error?.message}`;
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      headers: {},
      error,
    };
  }
};

export default httpRequest;

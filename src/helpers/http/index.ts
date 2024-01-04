import { https } from 'follow-redirects';
import httpRequest from './request';
import { HttpDelete, HttpHead, HttpPatch, HttpPost, HttpPut, IResponse } from './types';

const httpGet = async <Type>(options: https.RequestOptions, body?: any): Promise<IResponse<Type>> =>
  httpRequest<Type>({ ...options, method: 'GET' }, body);

const httpPost: HttpPost = async <Type>(options: https.RequestOptions, body: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'POST',
    },
    body,
  );

const httpPut: HttpPut = async <Type>(options: https.RequestOptions, body: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'PUT',
    },
    body,
  );

const httpPatch: HttpPatch = async <Type>(options: https.RequestOptions, body: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'PATCH',
    },
    body,
  );

const httpDelete: HttpDelete = async <Type>(options: https.RequestOptions, body?: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'DELETE',
    },
    body,
  );

const httpHead: HttpHead = async <Type>(options: https.RequestOptions): Promise<IResponse<Type>> =>
  httpRequest({
    ...options,
    method: 'HEAD',
  });

export { httpGet, httpPost, httpPut, httpPatch, httpDelete, httpHead };

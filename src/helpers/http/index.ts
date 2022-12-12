import { https } from 'follow-redirects';
import httpGet from './get';
import httpRequest from './request';
import { HttpDelete, HttpHead, HttpPatch, HttpPost, HttpPut, IResponse } from './types';

const httpPost: HttpPost = async <Type>(options: https.RequestOptions, data: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'POST',
    },
    data,
  );

const httpPut: HttpPut = async <Type>(options: https.RequestOptions, data: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'PUT',
    },
    data,
  );

const httpPatch: HttpPatch = async <Type>(options: https.RequestOptions, data: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'PATCH',
    },
    data,
  );

const httpDelete: HttpDelete = async <Type>(options: https.RequestOptions, data?: any): Promise<IResponse<Type>> =>
  httpRequest(
    {
      ...options,
      method: 'DELETE',
    },
    data,
  );

const httpHead: HttpHead = async <Type>(options: https.RequestOptions): Promise<IResponse<Type>> =>
  httpGet({
    ...options,
    method: 'HEAD',
  });

export { httpGet, httpPost, httpPut, httpPatch, httpDelete, httpHead };

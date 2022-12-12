/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const encode = (data: any): string => Buffer.from(data).toString('base64');

export const decode = (data: any): string => Buffer.from(data, 'base64').toString('utf-8');

export const getSHA = (etag: string): string => etag.substring(1, etag.length - 1);

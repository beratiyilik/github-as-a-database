import { Headers } from './types';

class HeadersBuilder {
  private readonly _headers: Headers;

  constructor() {
    this._headers = {
      Authorization: '',
      Host: '',
      Accept: '',
    };
  }

  setAuth(auth: string): HeadersBuilder {
    this._headers.Authorization = auth;
    return this;
  }

  setHost(host: string): HeadersBuilder {
    this._headers.Host = host;
    return this;
  }

  setAccept(accept: string): HeadersBuilder {
    this._headers.Accept = accept;
    return this;
  }

  build(): Headers | undefined {
    return this._headers as Headers | undefined;
  }
}

export default HeadersBuilder;

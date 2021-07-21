import { NextApiRequest } from 'next';

export type Params = { [key: string]: string | string[] };

interface BaseApiRequest<TBody, TParams extends Params> extends NextApiRequest {
  body: TBody;
  query: TParams;
}

export interface ApiPutRequest<TBody, TParams extends Params = {}>
  extends BaseApiRequest<TBody, TParams> {
  method: 'PUT';
}
export interface ApiPostRequest<TBody, TParams extends Params = {}>
  extends BaseApiRequest<TBody, TParams> {
  method: 'POST';
}
export interface ApiGetRequest<TParams extends Params = {}>
  extends BaseApiRequest<undefined, TParams> {
  method: 'GET';
}

export interface ApiDeleteRequest<TParams extends Params = {}>
  extends BaseApiRequest<undefined, TParams> {
  method: 'DELETE';
}

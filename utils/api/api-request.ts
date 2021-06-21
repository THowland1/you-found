import { NextApiRequest } from 'next';

export interface ApiRequest<TBody> extends NextApiRequest {
  body: TBody;
}

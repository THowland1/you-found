import { Api } from 'models/api';
import { NextApiResponse } from 'next';
import { ApiGetRequest, ApiPutRequest } from 'utils/api/api-request';
import connectDB from '../../../middleware/mongodb';
import { get } from './contact-methods.get';
import { put } from './contact-methods.put';

type IRouteParams = Api.ContactMethods.IRouteParams;
type IGetResponse = Api.ContactMethods.Get.IResponse;
type IUpdateRequest = Api.ContactMethods.Update.IRequest;

const CONTACT_METHODS_PATH = '/api/[userId]/contact-methods';
export function contactMethodsApiPath(params: IRouteParams) {
  return CONTACT_METHODS_PATH.replace('[userId]', params.userId);
}

const contactMethods = async (
  req:
    | ApiPutRequest<IUpdateRequest, IRouteParams>
    | ApiGetRequest<IRouteParams>,
  res: NextApiResponse | NextApiResponse<IGetResponse>
) => {
  try {
    await connectDB();
    switch (req.method) {
      case 'GET':
        return await get(req, res);
      case 'PUT':
        return await put(req, res);
      default:
        res.status(404);
        return;
    }
  } catch (e) {
    res.status(500);
  }
};

export default contactMethods;

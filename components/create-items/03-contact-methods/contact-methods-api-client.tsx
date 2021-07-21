import axios, { AxiosError } from 'axios';
import { Api } from 'models/api';
import { contactMethodsApiPath } from 'pages/api/[userId]/contact-methods';

export module ContactMethodsApiClient {
  type IRouteParams = Api.ContactMethods.IRouteParams;
  type IGetResponse = Api.ContactMethods.Get.IResponse;
  type IUpdateRequest = Api.ContactMethods.Update.IRequest;

  export async function get(
    routeParams: IRouteParams,
    onAxiosError?: React.Dispatch<any>
  ) {
    try {
      const successResponse = await axios.get<IGetResponse>(
        contactMethodsApiPath(routeParams)
      );
      return successResponse.data;
    } catch (e) {
      const error: AxiosError<any> = e;
      if (error.isAxiosError && onAxiosError) {
        onAxiosError(error.response?.data);
      }
      throw e;
    }
  }

  export async function update(
    routeParams: IRouteParams,
    body: IUpdateRequest,
    onAxiosError?: React.Dispatch<any>
  ) {
    try {
      const successResponse = await axios.put<void>(
        contactMethodsApiPath(routeParams),
        body
      );
      return successResponse.data;
    } catch (e) {
      const error: AxiosError<any> = e;
      if (error.isAxiosError && onAxiosError) {
        onAxiosError(error.response?.data);
      } else {
        throw e;
      }
    }
  }
}

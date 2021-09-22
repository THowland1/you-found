import axios, { AxiosError } from 'axios';
import { LogIn } from 'models/api';
import { LOG_IN_PATH } from 'pages/api/log-in';
import { HandledError } from 'utils/handled-error';

export module UserApiClient {
  export async function logIn(
    body: LogIn.IRequest,
    onAxiosError?: React.Dispatch<any>
  ) {
    return post<LogIn.IResponse, LogIn.IRequest>(
      LOG_IN_PATH,
      body,
      onAxiosError
    );
  }
}

type IErrorResponse = {
  doo: '';
};

async function post<TResponse, TRequest>(
  url: string,
  body: TRequest,
  onAxiosError?: React.Dispatch<IErrorResponse>
) {
  try {
    const successResponse = await axios.post<TResponse>(url, body);
    return successResponse.data;
  } catch (e) {
    const error = e as AxiosError<any>;
    if (error.isAxiosError && onAxiosError) {
      onAxiosError(error.response?.data);
      throw new HandledError(error);
    }
    throw e;
  }
}

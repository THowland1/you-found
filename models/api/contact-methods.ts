import { Params } from 'utils/api/api-request';

export namespace ContactMethods {
  export interface IRouteParams extends Params {
    userId: string;
  }

  export namespace Get {
    export interface IResponse {
      phoneNumbers: IResponsePhoneNumber[];
      emailAddresses: IResponseEmailAddress[];
      userFullName: string;
    }

    export interface IResponsePhoneNumber {
      phoneNumberId: string;
      phoneNumber: string;
    }

    export interface IResponseEmailAddress {
      emailAddressId: string;
      emailAddress: string;
    }
  }

  export namespace Update {
    export interface IRequest {
      phoneNumbers: IRequestPhoneNumber[];
      emailAddresses: IRequestEmailAddress[];
      userFullName: string;
    }

    export interface IRequestPhoneNumber {
      phoneNumberId: string;
      phoneNumber: string;
    }

    export interface IRequestEmailAddress {
      emailAddressId: string;
      emailAddress: string;
    }
  }
}

export namespace LogIn {
  export interface IRequest {
    emailAddress: string;
    password: string;
  }
  export interface IResponse {
    userId: string;
    userJwt: string;
  }
}

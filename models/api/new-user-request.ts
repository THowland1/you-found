import { copyProperties } from '../../utils/copy-properties';

export interface INewUserRequest {
  userEmailAddress: string;
  userFullName: string;
  userHandle: string;
}

const defaultData: INewUserRequest = {
  userEmailAddress: '',
  userFullName: '',
  userHandle: '',
};

export class NewUserRequest implements INewUserRequest {
  constructor(data: INewUserRequest = defaultData) {
    copyProperties({ from: data, to: this });
  }
  userEmailAddress: string;
  userFullName: string;
  userHandle: string;
}

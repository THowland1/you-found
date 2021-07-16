export enum NewOrExisting {
  New,
  Existing,
}

export class UserSubform {
  newOrExisting = NewOrExisting.New;
  emailAddress = '';
  password = '';
}

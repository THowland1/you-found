import { v4 } from 'uuid';

export class PhoneNumber {
  phoneNumberId = v4();
  number = '';
}

export class EmailAddress {
  emailAddressId = v4();
  emailAddress = '';
}

export class ContactMethodsSubform {
  fullName = '';
  phoneNumbers: PhoneNumber[] = [];
  emailAddresses: EmailAddress[] = [];
}

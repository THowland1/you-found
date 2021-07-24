import * as ApiModels from 'models/api';
import {
  ContactMethodsSubform,
  EmailAddress,
  PhoneNumber,
} from './contact-methods-subform';

export module MapContactMethods {
  type Dto = ApiModels.ContactMethods.Get.IResponse;
  type Subform = ContactMethodsSubform;

  export function dtoToSubform(contactMethods: Dto): Subform {
    return {
      emailAddresses: contactMethods.emailAddresses.map(
        MapEmailAddress.dtoToSubform
      ),
      fullName: contactMethods.userFullName,
      phoneNumbers: contactMethods.phoneNumbers.map(
        MapPhoneNumber.dtoToSubform
      ),
    };
  }

  export function subformToDto(contactMethods: Subform): Dto {
    return {
      emailAddresses: contactMethods.emailAddresses.map(
        MapEmailAddress.subformToDto
      ),
      userFullName: contactMethods.fullName,
      phoneNumbers: contactMethods.phoneNumbers.map(
        MapPhoneNumber.subformToDto
      ),
    };
  }
}

export module MapPhoneNumber {
  type Dto = ApiModels.ContactMethods.Get.IResponsePhoneNumber;
  type Subform = PhoneNumber;

  export function dtoToSubform(phoneNumber: Dto): Subform {
    return {
      phoneNumberId: phoneNumber.phoneNumberId,
      number: phoneNumber.phoneNumber,
    };
  }

  export function subformToDto(phoneNumber: Subform): Dto {
    return {
      phoneNumberId: phoneNumber.phoneNumberId,
      phoneNumber: phoneNumber.number,
    };
  }
}

export module MapEmailAddress {
  type Dto = ApiModels.ContactMethods.Get.IResponseEmailAddress;
  type Subform = EmailAddress;

  export function dtoToSubform(emailAddress: Dto): Subform {
    return {
      emailAddressId: emailAddress.emailAddressId,
      emailAddress: emailAddress.emailAddress,
    };
  }

  export function subformToDto(emailAddress: Subform): Dto {
    return {
      emailAddressId: emailAddress.emailAddressId,
      emailAddress: emailAddress.emailAddress,
    };
  }
}

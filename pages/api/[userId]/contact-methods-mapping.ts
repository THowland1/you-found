import * as ApiModels from 'models/api';
import {
  IUserDocument,
  IUserEmailAddress,
  IUserPhoneNumber,
} from 'models/schema/user';
import { Types } from 'mongoose';

export namespace MapContactMethods {
  type Dto = ApiModels.ContactMethods.Get.IResponse;
  type Entity = IUserDocument;

  export function dtoToPartialEntity(contactMethods: Dto): Partial<Entity> {
    return {
      userFullName: contactMethods.userFullName,
      userEmailAddresses: contactMethods.emailAddresses.map(
        MapEmailAddress.dtoToEntity
      ),
      userPhoneNumbers: contactMethods.phoneNumbers.map(
        MapPhoneNumber.dtoToEntity
      ),
    };
  }

  export function entityToDto(contactMethods: Entity): Dto {
    return {
      userFullName: contactMethods.userFullName,
      emailAddresses: contactMethods.userEmailAddresses.map(
        MapEmailAddress.entityToDto
      ),
      phoneNumbers: contactMethods.userPhoneNumbers.map(
        MapPhoneNumber.entityToDto
      ),
    };
  }
}

export namespace MapEmailAddress {
  type Dto = ApiModels.ContactMethods.Get.IResponseEmailAddress;
  type Entity = IUserEmailAddress;
  export function dtoToEntity(emailAddress: Dto): Entity {
    return {
      emailAddress: emailAddress.emailAddress,
      emailAddressId: emailAddress.emailAddressId,
    };
  }
  export function entityToDto(emailAddress: Entity): Dto {
    return {
      emailAddress: emailAddress.emailAddress,
      emailAddressId: emailAddress.emailAddressId,
    };
  }
}

export namespace MapPhoneNumber {
  type Dto = ApiModels.ContactMethods.Get.IResponsePhoneNumber;
  type Entity = IUserPhoneNumber;

  export function dtoToEntity(phoneNumber: Dto): Entity {
    return {
      phoneNumber: phoneNumber.phoneNumber,
      phoneNumberId: phoneNumber.phoneNumberId,
    };
  }

  export function entityToDto(phoneNumber: Entity): Dto {
    return {
      phoneNumber: phoneNumber.phoneNumber,
      phoneNumberId: phoneNumber.phoneNumberId,
    };
  }
}

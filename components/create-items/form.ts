import { NamesSubform } from './01-names/names-subform';
import { UserSubform } from './02-user/user-subform';
import { ContactMethodsSubform } from './03-contact-methods/contact-methods-subform';
import { LinkType } from './04-page-designers/page-designer/page-designer-subform';
import { PageDesignersSubform } from './04-page-designers/page-designers-subform';
import { ConfirmSubform } from './05-confirm/confirm-subform';
import { SuccessSubform } from './06-success/success-subform';
import { Step } from './step';

export class Form {
  /**
   *
   */
  constructor() {
    this.step = Step.Confirm;
    this[Step.Names] = {
      items: [
        {
          id: '38400866-62c7-4e76-804f-9dcfcea1dbc6',
          name: 'Headphones',
          placeholder: 'e.g. Headphones',
        },
        {
          id: '9dcfcea1-dbc7-4e76-804f-3840086662c7',
          name: 'Bike',
          placeholder: 'e.g. Headphones',
        },
      ],
    };
    this[Step.User] = {
      userId: '60b94a974922b5e9f066ae53',
      newOrExisting: 0,
      emailAddress: 'fdf',
      password: 'fedf',
    };
    this[Step.ContactMethods] = {
      fullName: 'frefsd',
      phoneNumbers: [
        {
          phoneNumberId: 'fd4c828f-daea-4d90-bc86-a3844adc8405',
          number: '03343',
        },
        {
          phoneNumberId: '0895827f-464a-48a4-81ca-dae5c946b1cc',
          number: '0355555',
        },
      ],
      emailAddresses: [
        {
          emailAddressId: 'd61e7c75-2271-4fe5-b088-b317453f725c',
          emailAddress: 'gresfgvefd',
        },
        {
          emailAddressId: '4c340beb-b9d6-43bc-ae2e-3f2a2d38030e',
          emailAddress: '4444',
        },
      ],
    };
    this[Step.PageDesigners] = {
      currentItemId: '38400866-62c7-4e76-804f-9dcfcea1dbc6',
      pages: {
        '38400866-62c7-4e76-804f-9dcfcea1dbc6': {
          message: 'Yo',
          links: [
            {
              type: LinkType.SMS,
              linkId: 'ae6a8a74-3b1b-4328-9f9e-b101358f1c58',
              phoneNumber: this[Step.ContactMethods].phoneNumbers[0],
              text: 'Reach out via text',
            },
            {
              type: LinkType.WhatsApp,
              linkId: '4655564e-ab8a-41bb-b5d4-11131fddd883',
              phoneNumber: this[Step.ContactMethods].phoneNumbers[1],
              text: 'Reach out via WhatsApp',
            },
            {
              type: LinkType.Email,
              linkId: '4655564e-ab8a-41bb-b5d4-11131fddd883',
              emailAddress: this[Step.ContactMethods].emailAddresses[0],
              text: 'Reach out via WhatsApp',
            },
          ],
        },
        '9dcfcea1-dbc7-4e76-804f-3840086662c7': {
          message: 'Yo',
          links: [
            {
              type: LinkType.SMS,
              linkId: 'ae6a8a74-3b1b-4328-9f9e-b101358f1c58',
              phoneNumber: this[Step.ContactMethods].phoneNumbers[0],
              text: 'Reach out via text',
            },
            {
              type: LinkType.WhatsApp,
              linkId: '4655564e-ab8a-41bb-b5d4-11131fddd883',
              phoneNumber: this[Step.ContactMethods].phoneNumbers[1],
              text: 'Reach out via WhatsApp',
            },
            {
              type: LinkType.Email,
              linkId: '4655564e-ab8a-41bb-b5d4-11131fddd883',
              emailAddress: this[Step.ContactMethods].emailAddresses[0],
              text: 'Reach out via WhatsApp',
            },
          ],
        },
      },
    };
  }
  step = Step.Names;

  [Step.Names] = new NamesSubform();
  [Step.User] = new UserSubform();
  [Step.ContactMethods] = new ContactMethodsSubform();
  [Step.PageDesigners] = new PageDesignersSubform();
  [Step.Confirm] = new ConfirmSubform();
  [Step.Success] = new SuccessSubform();
}

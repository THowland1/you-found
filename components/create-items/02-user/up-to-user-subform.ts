import { NamesSubform } from '../01-names/names-subform';
import { UpToNamesSubform } from '../01-names/up-to-names-subform';

export type UpToUserSubform = UpToNamesSubform & {
  namesSubform: NamesSubform;
};

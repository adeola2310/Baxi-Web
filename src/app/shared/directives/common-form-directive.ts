import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormControl
} from '@angular/forms';
import {Subscription} from 'rxjs/index';

@Directive({
  selector: '[appMatchValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MatchValueDirective, multi: true }
  ]
})
export class MatchValueDirective implements Validators {
  @Input('compare') controlNameToCompare: string;

  validate(c: AbstractControl): ValidationErrors | null {
    if (c.value === null || c.value.length === 0) {
      return null;
    }
    const controlValueToCompare = c.root.get(this.controlNameToCompare);
    if (controlValueToCompare) {
      const subscription: Subscription = controlValueToCompare.valueChanges.subscribe(
        () => {
          c.updateValueAndValidity();
          subscription.unsubscribe();
        }
      );
    }
    return controlValueToCompare && controlValueToCompare.value !== c.value
      ? { compare: true }
      : null;
  }
}

/**
 * VALIDATOR FUNCTION FOR REACTIVE FORMS
 * @param {string} controlNameToCompare
 * @returns {ValidatorFn}
 */
export function compareValidator(controlNameToCompare: string): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value === null || c.value.length === 0) {
      return null; // DON'T VALIDATE AN EMPTY VALUE
    }
    const controlValueToCompare = c.root.get(controlNameToCompare);
    if (controlValueToCompare) {
      const subscription: Subscription = controlValueToCompare.valueChanges.subscribe(
        () => {
          c.updateValueAndValidity();
          subscription.unsubscribe();
        }
      );
    }
    return controlValueToCompare && controlValueToCompare.value !== c.value
      ? { compare: true }
      : null;
  };
}

// Remove/ Flag error in the forms
export function removeSpaces(control: any) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}




@Directive({
  selector: '[myNoSpaces]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NoWhitespaceDirective, multi: true }]
})
export class NoWhitespaceDirective implements Validators {

  validate(control: AbstractControl): { [key: string]: any } {
    return removeSpaces(control);
  }
}

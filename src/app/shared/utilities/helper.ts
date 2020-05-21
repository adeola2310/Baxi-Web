import {HttpErrorResponse} from '@angular/common/http';
import {AbstractControl, FormControl, FormGroup, ValidatorFn} from '@angular/forms';

declare const $: any;


/**************** MODAL TRIGGER METHOD ************/
/**
 * @param {string} action
 * @param {string} modalId
 * @param {string} type
 */
export const triggerModalOrOverlay = (action: string, modalId: string, type?: string) => {
  if (type === 'STATIC') {
    $(`#${modalId}`).modal({
      backdrop: 'static',
      keyboard: false
    });
  }

  (action === 'SHOW') ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
};

/**
 *
 * @param {string} elementId
 * @param {number} timeOut
 */
export const scrollToDiv = (elementId: string, timeOut = 0) => {
  const page = document.getElementById(elementId);
  setTimeout(() => {
    page.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
  }, timeOut);
};

/******* this is used basically for mobile view when you hide the right payment section on mobile ------ it van also be used for any thing you wanna hide *************/
/**
 *
 * @param {string} element
 * @param type
 * @return {any}
 */
export const elementShowHide = (element: string, type) => {
 return type === 'HIDE' ? $(element).hide() : $(element).show();
};


/**
 *
 * @param errorMessage If there exists a string
 * @param error or an object
 * @returns Formatted error message
 */
export const errorHelper = (errorMessage: string, error: any | Array<string> | Array<object>): string => {
  let response = errorMessage;
  // first condition is to check if its an error instance
  if (error instanceof HttpErrorResponse) {
    // check if no response in connection
    if (error.status === 0) {
      response = 'Can\'t connect to the server...';
    }

    if (error.status !== 0 && error.error) {
      response = `${error.error.message}` || errorMessage;
    }

    if (error.status === 511) {
      // TODO if session expired
      response = error.error.message;
    }
    if (error.status === 422) {
      let entityErr = '';
      if (error.error.errors) {
        console.log('Yes inside');
        for (const err in error.error.errors) {
          if (error.error.errors.hasOwnProperty(err)) {
            console.log(err);
            error.error.errors[err].forEach((e) => {
              entityErr += e + '<br>';
            });
          }
        }
        // error.error.errors.forEach((e) => {
        //   console.log(e)
        //   entityErr += e.message + '<br>';
        // });
        response = entityErr;
      }
    }

    if (error.status === 400) {
      // TODO if bad request
      if (error.error) {
        response = error.error.message || error.error.description;
      }
    }

    if (error.status === 409) {
      // TODO if conflict request
      if (error.error) {
        response = error.error.message || error.error.description;
      }
    }

    if (error.status === 403) {
      if (error.error) {
        response = error.error.message || error.error.description;
      }
    }

    if (error.status === 401) {
      if (error.error) {
        response = error.error.message || error.error.description;
      }
    }
  }

  return response;
};

/**
 *
 * @param {string} elementId
 */
export const passwordPreview = (elementId): void => {
  const PASSWORD =   document.getElementById(elementId);
  if (PASSWORD.getAttribute('type') === 'password') {
      PASSWORD.setAttribute('type', 'text');
  } else {
    PASSWORD.setAttribute('type', 'password');
  }
};

/**
 *
 * @param evt
 */
export const isNumberKey = (evt) => {
  // const charCode = (evt.which) ? evt.which : evt.keyCode;
  // if (charCode > 31 && (charCode < 48 || charCode > 57))
  //   return false;
  //
  // return true;
  const theEvent = evt || window.event;
  let key;

  // Handle paste
  if (theEvent.type === 'paste') {
    key = evt.clipboardData.getData('text/plain');
  } else {
    // Handle key press
    key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }
  const regex = /[0-9]|\./;
  if ( !regex.test(key) ) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) {
      theEvent.preventDefault();
    }
  }
};

/**
 *
 * @param text
 * @param {string} element_id
 * @return {any}
 */
export const specify = (text: string, element_id?: string) => {
  const value = text.replace(/,/g, '');
  const matches = /^(?:(\d{1,3})?((?:\d{3})*))((?:,\d*)?)$/.exec(value);
  if (!matches) {
    return;
  }

  // add a comma before every group of three digits
  const modified = matches[2].replace(/(\d{3})/g, ',$1');

  // now splice it all back together
  const result = [matches[1], modified, matches[3]].join('');
  if (element_id) {
    const amountElement = document.getElementById(element_id);
    const cursorPosition = amountElement['selectionStart'];
    // console.log(cursorPosition);
    amountElement['value'] = result;
    // setCaretPosition(amountElement, cursorPosition);
  }
  return result;
};

/**
 *
 * @param arr
 * @param value
 */
export const isArrayObjectSelected = (arr: Array<[]>, value: string) => {
  for (const provider of arr) {
    if (provider.hasOwnProperty(value)) {
      provider[value] = false;
    }
  }
};

/**
 *
 * @param str
 * @param strCase
 */
export const trimStringToCase = (str: string, strCase: string): string => {
  return strCase === 'UPPER' ? str.replace(/[^a-zA-Z0-9]/ig, '').toUpperCase() : str.replace(/[^a-zA-Z0-9]/ig, '').toLowerCase();
};

/**
 *
 * @param {FormGroup} formGroup
 */
export const validateAllFormFields = (formGroup: FormGroup) => {         // {1}
  Object.keys(formGroup.controls).forEach(field => {  // {2}
    const control = formGroup.get(field);             // {3}
    if (control instanceof FormControl) {             // {4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        // {5}
      validateAllFormFields(control);            // {6}
    }
  });
};

/**
 *
 * @param max
 * @param type
 */
export function minMaxValue(max: number, type?): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    // tslint:disable-next-line:one-variable-per-declaration
    const input = control.value,
      isValid = type === 'MAX' ? input > max : input < max;
    if (isValid) {
      return { minMaxValue: {max} };
    }
    return null;
  };
}

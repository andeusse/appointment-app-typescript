import { FormFieldsType } from '../types/formFields';
import validateEmail from './validateEmail';

const validateForm = (event: React.FormEvent<HTMLFormElement>) => {
  const data = new FormData(event.currentTarget);
  const errors: FormFieldsType = {};

  const email = data.get('email');
  const password = data.get('password');
  const firstName = data.get('firstName');
  const lastName = data.get('lastName');

  if (email !== null) {
    if (email === '') {
      errors.email = 'You must enter an email';
    } else {
      if (!validateEmail(email.toString())) {
        errors.email = 'Email must have the correct format';
      }
    }
  }

  if (password !== null) {
    if (password === '') {
      errors.password = 'You must enter the password';
    }
  }

  if (firstName !== null) {
    if (firstName === '') {
      errors.firstName = 'You must enter your first name';
    }
  }

  if (lastName !== null) {
    if (firstName === '') {
      errors.lastName = 'You must enter your last name';
    }
  }
  return errors;
};

export default validateForm;

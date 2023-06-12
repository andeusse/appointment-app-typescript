import { FormFieldsType } from '../types/formFields';
import validateEmail from './validateEmail';

const validateForm = (
  event: React.FormEvent<HTMLFormElement>,
  passwordEvaluation: boolean = false
) => {
  const data = new FormData(event.currentTarget);
  const errors: FormFieldsType = {};

  const email = data.get('email');
  const password = data.get('password');
  const confirmPassword = data.get('confirmPassword');
  const firstName = data.get('firstName');
  const lastName = data.get('lastName');
  const name = data.get('name');

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
    if (password === '' && !passwordEvaluation) {
      errors.password = 'You must enter the password';
    }
  }

  if (passwordEvaluation) {
    if (password !== null) {
      if (password === '' && confirmPassword !== '') {
        errors.password = 'You must enter the password';
      }
    }

    if (confirmPassword !== null) {
      if (confirmPassword === '' && password !== '') {
        errors.confirmPassword = 'You must enter the password';
      }
    }

    if (password !== null && confirmPassword !== null) {
      if (password !== '' || confirmPassword !== '') {
        if (password !== confirmPassword) {
          errors.passwordComparison = 'Password must be the same';
        }
      }
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

  if (name !== null) {
    if (name === '') {
      errors.name = 'You must enter your name';
    }
    if (name.toString().split(' ').length === 1) {
      errors.name = 'Your name must containt your firstname and lastname';
    }
  }

  return {
    email: email?.toString(),
    password: password?.toString(),
    confirmPassword: confirmPassword?.toString(),
    firstName: firstName?.toString(),
    lastName: lastName?.toString(),
    name: name?.toString(),
    errors,
  };
};

export default validateForm;

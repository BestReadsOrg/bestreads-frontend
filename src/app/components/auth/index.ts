/**
 * Auth Components Barrel Export
 * Configuration-driven authentication forms
 */

export { AuthForm, default } from './auth.component';
export type { 
  AuthFormConfig, 
  AuthFormProps, 
  FormField, 
  ActionButton, 
  AuthHeader,
  AuthFooter,
  PasswordRequirement
} from './auth.types';
export { defaultLoginData, fetchLoginData, getLoginDataVariant } from './login.datasource';
export { defaultRegisterData, fetchRegisterData, passwordRequirements } from './register.datasource';
export { default as authConfig } from './auth.configuration.json';

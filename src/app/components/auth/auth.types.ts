/**
 * Authentication Component Types
 * Defines the structure for configuration-driven auth components
 */

export interface FormField {
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  autoComplete?: string;
  disabled?: boolean;
}

export interface ActionButton {
  label: string;
  actionId: string;
  type: 'submit' | 'button' | 'link';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  visible?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface AuthHeader {
  title: string;
  subtitle?: string;
  logo?: string;
}

export interface AuthFooter {
  links?: Array<{
    label: string;
    href: string;
    actionId?: string;
  }>;
  text?: string;
}

export interface FeaturePreview {
  icon: string;
  label: string;
}

export interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

export interface AuthFormConfig {
  id: string;
  header: AuthHeader;
  fields: FormField[];
  actions: ActionButton[];
  footer?: AuthFooter;
  features?: FeaturePreview[];
  passwordRequirements?: PasswordRequirement[];
  styles?: {
    containerClass?: string;
    formClass?: string;
    headerClass?: string;
    titleClass?: string;
    subtitleClass?: string;
    fieldContainerClass?: string;
    actionsClass?: string;
    footerClass?: string;
  };
}

export interface AuthFormProps extends AuthFormConfig {
  onAction: (actionId: string, data?: Record<string, unknown>) => void | Promise<void>;
  onFieldChange?: (fieldName: string, value: string) => void;
  formData?: Record<string, string>;
  errors?: Record<string, string>;
  loading?: boolean;
  className?: string;
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/packages/shared/components/input';
import { Button } from '@/packages/shared/components/button';
import { ErrorDisplay } from '@/packages/shared/components/error/error.component';
import Link from 'next/link';
import { AuthFormProps } from './auth.types';

/**
 * Configuration-Driven Authentication Form Component
 * 
 * Renders login, register, or any auth form based on JSON configuration
 * 
 * @example
 * <AuthForm
 *   {...loginConfig}
 *   onAction={handleAction}
 *   formData={formData}
 *   errors={errors}
 * />
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  id,
  header,
  fields,
  actions,
  footer,
  features,
  passwordRequirements,
  styles,
  onAction,
  onFieldChange,
  formData = {},
  errors = {},
  loading = false,
  className = ''
}) => {
  const [internalFormData, setInternalFormData] = useState<Record<string, string>>(formData);
  const currentFormData = formData || internalFormData;

  const handleFieldChange = (fieldName: string) => (value: string) => {
    if (onFieldChange) {
      onFieldChange(fieldName, value);
    } else {
      setInternalFormData(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitAction = actions.find(action => action.type === 'submit');
    if (submitAction) {
      await onAction(submitAction.actionId, currentFormData);
    }
  };

  const handleButtonClick = async (actionId: string, href?: string) => {
    if (href) {
      // Link actions are handled by Link component
      return;
    }
    await onAction(actionId, currentFormData);
  };

  const containerClass = styles?.containerClass || 'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8';
  const formClass = styles?.formClass || 'bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full';
  const headerClass = styles?.headerClass || 'text-center mb-8';
  const titleClass = styles?.titleClass || 'text-4xl font-bold text-gray-900 mb-2';
  const subtitleClass = styles?.subtitleClass || 'text-gray-600';
  const fieldContainerClass = styles?.fieldContainerClass || 'space-y-6';
  const actionsClass = styles?.actionsClass || 'space-y-4 mt-6';

  const visibleActions = actions.filter(action => action.visible !== false);

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="max-w-md w-full">
        <div className={formClass}>
          {/* Header Section */}
          <div className={headerClass}>
            {header.logo && (
              <div className="mb-4">
                <Image src={header.logo} alt="Logo" width={48} height={48} className="mx-auto" />
              </div>
            )}
            <h1 className={titleClass}>
              {header.title}
            </h1>
            {header.subtitle && (
              <p className={subtitleClass}>
                {header.subtitle}
              </p>
            )}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6">
              <ErrorDisplay 
                error={errors.general} 
                variant="inline"
              />
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} id={id}>
            <div className={fieldContainerClass}>
              {fields.map((field) => (
                <Input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={currentFormData[field.name] || ''}
                  onChange={handleFieldChange(field.name)}
                  error={errors[field.name]}
                  required={field.required}
                  disabled={field.disabled || loading}
                  autoComplete={field.autoComplete}
                />
              ))}
            </div>

            {/* Password Requirements (if applicable) */}
            {passwordRequirements && passwordRequirements.length > 0 && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Password Requirements:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  {passwordRequirements.map((req) => {
                    const password = currentFormData.password || '';
                    const isValid = req.validator(password);
                    return (
                      <li key={req.id} className="flex items-center">
                        <span className="mr-2">{isValid ? '✅' : '⭕'}</span>
                        {req.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Actions Section */}
            <div className={actionsClass}>
              {visibleActions.map((action, index) => {
                if (action.type === 'link' && action.href) {
                  return (
                    <Link key={`${action.actionId}-${index}`} href={action.href}>
                      <Button
                        label={action.label}
                        action={action.actionId}
                        variant={action.variant || 'outline'}
                        size={action.size || 'lg'}
                        fullWidth
                        disabled={action.disabled}
                        icon={action.icon}
                      />
                    </Link>
                  );
                }

                return (
                  <Button
                    key={`${action.actionId}-${index}`}
                    label={action.label}
                    action={action.actionId}
                    variant={action.variant || 'primary'}
                    size={action.size || 'lg'}
                    fullWidth
                    loading={action.type === 'submit' ? loading : action.loading}
                    disabled={action.disabled || loading}
                    type={action.type === 'submit' ? 'submit' : 'button'}
                    icon={action.icon}
                    onClick={() => action.type === 'button' && handleButtonClick(action.actionId, action.href)}
                  />
                );
              })}
            </div>
          </form>

          {/* Footer Section */}
          {footer && (
            <div className="mt-8">
              {footer.text && (
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      {footer.text}
                    </span>
                  </div>
                </div>
              )}

              {footer.links && footer.links.length > 0 && (
                <div className="text-center space-y-2">
                  {footer.links.map((link, index) => (
                    <div key={index}>
                      {link.actionId ? (
                        <button
                          onClick={() => onAction(link.actionId!, currentFormData)}
                          className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Preview */}
        {features && features.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur rounded-lg p-4"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="text-xs text-gray-600">{feature.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;

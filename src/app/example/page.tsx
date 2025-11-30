/**
 * Example Usage Page
 * Demonstrates the configuration-driven UI system with proper separation of:
 * - Configuration (structure/schema in .configuration.json)
 * - Data (actual values in .datasource.ts)
 * - Components (rendering logic in .component.tsx)
 */

'use client';

import React from 'react';
import { Header } from '@/packages/shared/components/header/header.component';
import { Footer } from '@/packages/shared/components/footer/footer.component';
import { AuthForm } from '@/app/auth';

// Import DATA SOURCES (actual values, not configuration)
import { headerData } from '@/packages/shared/components/header/header.datasource';
import { footerData } from '@/packages/shared/components/footer/footer.datasource';
import { defaultLoginData } from '@/app/auth/login.datasource';

export default function ExamplePage() {
  // Example: Handler for Login actions
  const handleLoginAction = async (actionId: string, data?: Record<string, unknown>) => {
    console.log('Login action triggered:', actionId, data);
    
    switch (actionId) {
      case 'auth.login.submit':
        alert('Login submitted: ' + JSON.stringify(data));
        break;
      case 'auth.navigate.register':
        alert('Navigate to register');
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  // Example form data state
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 
        Header Component
        - Configuration (header.configuration.json) defines: schema, behavior, styling
        - Data Source (header.datasource.ts) provides: actual title and actions
      */}
      <Header {...headerData} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="space-y-8">
          
          {/* Page Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Configuration-Driven UI System
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              This example demonstrates the <strong>separation of concerns</strong>: 
              Configuration defines <em>structure and rules</em>, while data sources provide <em>actual values</em>.
            </p>
          </div>

          {/* Key Concept Card */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">
              🎯 Architecture Overview
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">📋 Configuration</h4>
                <p className="text-blue-800 mb-2">Defines structure:</p>
                <ul className="text-blue-700 text-xs space-y-1">
                  <li>• Field schemas & types</li>
                  <li>• Behavior rules</li>
                  <li>• Styling classes</li>
                  <li>• Validation rules</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">💾 Data Source</h4>
                <p className="text-blue-800 mb-2">Provides values:</p>
                <ul className="text-blue-700 text-xs space-y-1">
                  <li>• Actual text content</li>
                  <li>• Button labels</li>
                  <li>• API/CMS data</li>
                  <li>• User-specific data</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">🎨 Component</h4>
                <p className="text-blue-800 mb-2">Renders UI:</p>
                <ul className="text-blue-700 text-xs space-y-1">
                  <li>• Receives data props</li>
                  <li>• Applies config rules</li>
                  <li>• Handles interactions</li>
                  <li>• Renders output</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AuthForm Component Examples */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              AuthForm Component (Login)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Data comes from <code className="bg-gray-100 px-1 rounded">auth/login.datasource.ts</code>, 
              structure from <code className="bg-gray-100 px-1 rounded">auth/auth.configuration.json</code>
            </p>
            <AuthForm 
              {...defaultLoginData} 
              onAction={handleLoginAction}
              onFieldChange={handleFieldChange}
              formData={formData}
              errors={errors}
            />
          </div>

          {/* Code Examples */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              💻 Usage Patterns
            </h3>
            
            <div className="space-y-6">
              {/* Example 1 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Basic Usage (Static Data)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{`import { AuthForm, defaultLoginData } from '@/app/auth';

<AuthForm 
  {...defaultLoginData} 
  onAction={handleAction}
  onFieldChange={handleFieldChange}
  formData={formData}
  errors={errors}
/>`}</code>
                </pre>
              </div>
              
              {/* Example 2 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Dynamic Data (From API)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{`import { fetchLoginData } from '@/app/auth';

const loginData = await fetchLoginData(); // Fetches from API/CMS
<AuthForm {...loginData} onAction={handleAction} />`}</code>
                </pre>
              </div>

              {/* Example 3 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Configuration Structure (JSON)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{`{
  "componentId": "AuthForm",
  "schema": {
    "fields": { "type": "array", "required": true },
    "actions": { "type": "array", "required": true }
  },
  "behavior": { "validateOnBlur": true },
  "styling": { "containerClass": "min-h-screen..." }
}`}</code>
                </pre>
              </div>

              {/* Example 4 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Data Source (TypeScript)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{`export const defaultLoginData = {
  id: "login-form",
  header: { title: "Welcome Back" },
  fields: [
    { name: "email", type: "email", label: "Email" },
    { name: "password", type: "password", label: "Password" }
  ],
  actions: [
    { label: "Sign In", actionId: "auth.login.submit" }
  ]
};`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* File Structure Info */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-green-900">
              📁 File Organization
            </h3>
            <pre className="bg-green-100 p-4 rounded text-sm text-green-900 overflow-x-auto">
              <code>{`app/
├── auth/
│   ├── auth.component.tsx         # React component (AuthForm)
│   ├── auth.configuration.json    # Structure definition (schema)
│   ├── login.datasource.ts        # Login data provider
│   ├── register.datasource.ts     # Register data provider
│   ├── auth.types.ts              # TypeScript types
│   └── index.ts                   # Exports
├── login/
│   └── page.tsx                   # Login page using AuthForm
└── register/
    └── page.tsx                   # Register page using AuthForm`}</code>
            </pre>
          </div>

          {/* Benefits Section */}
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-purple-900">
              ✨ Benefits of This Architecture
            </h3>
            <ul className="grid md:grid-cols-2 gap-3 text-purple-800">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span><strong>Separation of Concerns:</strong> Config, data, and UI are independent</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span><strong>Reusability:</strong> Same component works with different data</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span><strong>Flexibility:</strong> Data can come from API, CMS, or static files</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span><strong>Type Safety:</strong> TypeScript ensures data matches schema</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span><strong>Testability:</strong> Easy to test with mock data sources</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span><strong>Maintainability:</strong> Change data without touching components</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* 
        Footer Component
        - Configuration (footer.configuration.json) defines: schema, behavior, styling
        - Data Source (footer.datasource.ts) provides: copyright text and links
      */}
      <Footer {...footerData} />
    </div>
  );
}

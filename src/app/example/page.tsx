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
import { Login } from '@/app/components/login-component/login.component';

// Import DATA SOURCES (actual values, not configuration)
import { headerData } from '@/packages/shared/components/header/header.datasource';
import { footerData } from '@/packages/shared/components/footer/footer.datasource';
import { defaultLoginData } from '@/app/components/login-component/login.datasource';

export default function ExamplePage() {
  // Example: Handler for Login actions
  const handleLoginAction = (action: string, data?: Record<string, unknown>) => {
    console.log('Login action triggered:', action, data);
    
    switch (action) {
      case 'signInEmail':
        alert('Email sign-in clicked');
        break;
      case 'signInGoogle':
        alert('Google sign-in clicked');
        break;
      case 'createAccount':
        alert('Create account clicked');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Example user data (would come from auth context in real app)
  const currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
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

          {/* Login Component Examples */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Login Component (Default Data)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Data comes from <code className="bg-gray-100 px-1 rounded">login.datasource.ts</code>, 
              structure from <code className="bg-gray-100 px-1 rounded">login.configuration.json</code>
            </p>
            <Login {...defaultLoginData} onAction={handleLoginAction} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Login Component (With User Context)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Same component, different data — demonstrates reusability
            </p>
            <Login 
              {...defaultLoginData}
              user={currentUser}
              onAction={handleLoginAction}
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
                  <code>{`import { Login } from '@/components/login';
import { defaultLoginData } from './login.datasource';

<Login {...defaultLoginData} onAction={handleAction} />`}</code>
                </pre>
              </div>
              
              {/* Example 2 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Dynamic Data (From API)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{`import { fetchLoginData } from './login.datasource';

const loginData = await fetchLoginData(); // Fetches from API/CMS
<Login {...loginData} onAction={handleAction} />`}</code>
                </pre>
              </div>

              {/* Example 3 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Configuration Structure (JSON)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{`{
  "componentId": "Login",
  "schema": {
    "title": { "type": "string", "required": true },
    "description": { "type": "string", "required": false },
    "actions": { "type": "array", "required": true }
  },
  "behavior": { "filterInvisibleActions": true },
  "styling": { "containerClass": "max-w-md mx-auto..." }
}`}</code>
                </pre>
              </div>

              {/* Example 4 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Data Source (TypeScript)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{`export const defaultLoginData = {
  title: "Welcome to BestReads",
  description: "Sign in to continue",
  actions: [
    { label: "Sign In", action: "signIn", visible: true },
    // ... more actions
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
              <code>{`components/
├── login/
│   ├── login.component.tsx        # React component (rendering)
│   ├── login.configuration.json   # Structure definition (schema)
│   ├── login.datasource.ts        # Data provider (values)
│   ├── login.types.ts             # TypeScript types
│   └── index.ts                   # Exports`}</code>
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

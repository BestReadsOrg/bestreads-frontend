# Complete Guide - Configuration-Driven UI System

> **BestReads Frontend - Dynamic Component Configuration System**  
> A comprehensive guide for creating, managing, and deploying configuration-driven UI components in Next.js + TypeScript.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Creating New Components](#creating-new-components)
4. [Editing Configurations](#editing-configurations)
5. [Using Components](#using-components)
6. [Component Registry Management](#component-registry-management)
7. [Configuration Schema Reference](#configuration-schema-reference)
8. [Advanced Patterns](#advanced-patterns)
9. [Environment & Deployment](#environment--deployment)
10. [Troubleshooting](#troubleshooting)
11. [Complete Examples](#complete-examples)

---

## System Overview

### What is This System?

A dynamic, configuration-driven UI system that **separates structure from data**:

- **Configuration** (`.configuration.json`) = Structure, schema, behavior rules, styling
- **Data Source** (`.datasource.ts`) = Actual content values (text, labels, etc.)
- **Component** (`.component.tsx`) = Rendering logic and UI implementation

This enables:

- ✅ Update content without changing code or configuration
- ✅ Configuration defines **what** can be configured, data provides **actual values**
- ✅ Data can come from CMS, API, database, or static files
- ✅ Different data per environment while keeping same structure
- ✅ Type-safe with TypeScript
- ✅ True separation of concerns

### Architecture

```
┌─────────────────────────────────────────────────┐
│  Page/Component Usage                           │
│  import { Login } from './login.component'      │
│  import { defaultLoginData } from './datasource'│
│  <Login {...defaultLoginData} />               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Component (Rendering Logic)                    │
│  - Receives data as props                       │
│  - Applies configuration rules                  │
│  - Renders UI based on data                     │
└────────┬───────────────────┬────────────────────┘
         │                   │
         ▼                   ▼
┌──────────────────┐  ┌──────────────────────────┐
│  Configuration   │  │  Data Source             │
│  (Structure)     │  │  (Actual Values)         │
│                  │  │                          │
│  {               │  │  export const data = {   │
│    "schema": {   │  │    title: "Welcome",     │
│      "title": {  │  │    description: "...",   │
│        "type":   │  │    actions: [...]        │
│        "string"  │  │  }                       │
│      }           │  │                          │
│    },            │  │  // From API/CMS:        │
│    "styling": {  │  │  export async function   │
│      ...         │  │  fetchData() { ... }     │
│    }             │  │                          │
│  }               │  │                          │
└──────────────────┘  └──────────────────────────┘
```

### Key Principles

**1. Configuration = Structure**
- Defines field schemas (type, required, default)
- Defines behavior rules (filters, validations)
- Defines styling classes
- Does NOT contain actual content

**2. Data Source = Content**
- Provides actual text, labels, URLs
- Can be static or dynamic (API/CMS)
- Can vary by user, locale, A/B test
- Separate from structure definition

**3. Component = Presentation**
- Receives data as props
- Applies configuration rules
- Handles user interactions
- Pure rendering logic

### File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # App-specific components
│   │   │   └── login-component/
│   │   │       ├── login.component.tsx      # React component
│   │   │       ├── login.configuration.json # Structure/schema
│   │   │       ├── login.datasource.ts      # Data provider
│   │   │       ├── login.types.ts           # TypeScript types
│   │   │       └── index.ts                 # Exports
│   │   └── example/
│   │       └── page.tsx         # Demo page
│   │
│   ├── packages/
│   │   └── shared/
│   │       └── components/      # Shared components
│   │           ├── header/
│   │           │   ├── header.component.tsx
│   │           │   ├── header.configuration.json
│   │           │   ├── header.datasource.ts
│   │           │   ├── header.types.ts
│   │           │   └── index.ts
│   │           └── footer/
│   │               ├── footer.component.tsx
│   │               ├── footer.configuration.json
│   │               ├── footer.datasource.ts
│   │               ├── footer.types.ts
│   │               └── index.ts
│   │
│   ├── components/
│   │   └── RenderComponent.tsx  # Dynamic renderer (optional)
│   │
│   ├── registry/
│   │   └── componentsRegistry.ts  # Component registry
│   │
│   ├── utils/
│   │   └── getConfig.ts         # Config loader utility
│   │
│   └── types/
│       └── config.types.ts      # Type definitions
│
└── GUIDE.md                     # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Next.js 16+ project
- TypeScript configured

### Initial Setup

1. **Verify the system is installed**
   ```bash
   # Check key files exist
   ls src/registry/componentsRegistry.ts
   ls src/utils/getConfig.ts
   ls src/components/RenderComponent.tsx
   ls src/types/config.types.ts
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Visit the demo page**
   ```
   http://localhost:3000/example
   ```

4. **Explore existing components**
   - Login: `src/app/components/login-component/`
   - Header: `src/packages/shared/components/header/`
   - Footer: `src/packages/shared/components/footer/`

---

## Creating New Components

### Understanding the Three-File Pattern

Every component consists of **three distinct files**:

```
component-name/
├── component-name.component.tsx        # React component (rendering)
├── component-name.configuration.json   # Structure definition (schema)
├── component-name.datasource.ts        # Data provider (values)
├── component-name.types.ts             # TypeScript types
└── index.ts                            # Exports
```

**Important:** Configuration contains **structure**, NOT **data**!

### Step-by-Step Component Creation

Let's create a `ProductCard` component as an example.

#### Step 1: Choose Component Location

| Type | Location | Use Case |
|------|----------|----------|
| App-specific | `src/app/components/` | Page-specific, not reused |
| Shared | `src/packages/shared/components/` | Used across multiple pages |

```bash
# For shared component
mkdir -p src/packages/shared/components/product-card
cd src/packages/shared/components/product-card
```

#### Step 2: Create Configuration File (Structure Only!)

**File:** `product-card.configuration.json`

```json
{
  "componentId": "ProductCard",
  "schema": {
    "title": {
      "type": "string",
      "required": true,
      "description": "Product name/title"
    },
    "description": {
      "type": "string",
      "required": false,
      "description": "Product description"
    },
    "price": {
      "type": "string",
      "required": true,
      "description": "Product price (formatted)"
    },
    "imageUrl": {
      "type": "string",
      "required": false,
      "description": "Product image URL"
    },
    "rating": {
      "type": "number",
      "required": false,
      "description": "Product rating (0-5)"
    },
    "actions": {
      "type": "array",
      "required": false,
      "description": "Product action buttons",
      "itemSchema": {
        "label": { "type": "string", "required": true },
        "action": { "type": "string", "required": true },
        "visible": { "type": "boolean", "required": false, "default": true },
        "variant": { 
          "type": "string", 
          "enum": ["primary", "secondary", "danger", "ghost"],
          "required": false,
          "default": "primary"
        }
      }
    }
  },
  "behavior": {
    "filterInvisibleActions": true,
    "showRatingStars": true
  },
  "styling": {
    "containerClass": "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow",
    "titleClass": "text-lg font-bold text-gray-900 mb-2",
    "descriptionClass": "text-gray-600 text-sm mb-3",
    "priceClass": "text-xl font-semibold text-green-600 mb-4",
    "imageClass": "w-full h-48 object-cover rounded-md mb-4"
  },
  "variants": {
    "primary": "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium",
    "secondary": "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium",
    "danger": "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium",
    "ghost": "bg-transparent hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-md border border-blue-600 font-medium"
  }
}
```

**Key points:**
- ❌ NO actual data (no "Add to Cart", no "$29.99")
- ✅ Only structure: field types, requirements, defaults
- ✅ Behavior rules and styling definitions
- ✅ Button variant definitions

#### Step 3: Create Data Source File (Actual Values!)

**File:** `product-card.datasource.ts`

```typescript
/**
 * ProductCard Data Source
 * Provides actual data for ProductCard component
 * Separates data from structure/configuration
 */

export interface ProductData {
  title: string;
  description?: string;
  price: string;
  imageUrl?: string;
  rating?: number;
  actions?: Array<{
    label: string;
    action: string;
    visible: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  }>;
}

/**
 * Default product data (example/fallback)
 */
export const defaultProductData: ProductData = {
  title: 'Sample Product',
  description: 'This is a sample product description',
  price: '$29.99',
  rating: 4.5,
  actions: [
    {
      label: 'Add to Cart',
      action: 'addToCart',
      visible: true,
      variant: 'primary',
    },
    {
      label: 'View Details',
      action: 'viewDetails',
      visible: true,
      variant: 'secondary',
    },
    {
      label: 'Add to Wishlist',
      action: 'addToWishlist',
      visible: false, // Hidden unless user is logged in
      variant: 'ghost',
    },
  ],
};

/**
 * Fetch product data from API
 * @param productId - Product ID to fetch
 */
export async function fetchProductData(productId: string): Promise<ProductData> {
  // In production, fetch from your backend API
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
}

/**
 * Get product data with user-specific customization
 * @param productId - Product ID
 * @param userId - User ID for personalization
 */
export async function getProductDataForUser(
  productId: string, 
  userId?: string
): Promise<ProductData> {
  const data = await fetchProductData(productId);
  
  // Show wishlist action only for logged-in users
  if (userId && data.actions) {
    data.actions = data.actions.map(action =>
      action.action === 'addToWishlist' 
        ? { ...action, visible: true }
        : action
    );
  }
  
  return data;
}

/**
 * Get multiple products (for lists)
 */
export async function fetchProductList(category?: string): Promise<ProductData[]> {
  const url = category 
    ? `/api/products?category=${category}`
    : '/api/products';
    
  const response = await fetch(url);
  return response.json();
}
```

**Key points:**
- ✅ Contains actual values (titles, prices, labels)
- ✅ Can fetch from API, CMS, or database
- ✅ Supports static defaults for development
- ✅ Can be personalized per user

#### Step 4: Create Types File

**File:** `product-card.types.ts`

```typescript
/**
 * ProductCard Types
 * Defines the DATA structure (not configuration structure)
 */

export interface ProductAction {
  label: string;
  action: string;
  visible: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

/**
 * ProductCard data interface (props passed to component)
 */
export interface ProductCardProps {
  title: string;
  description?: string;
  price: string;
  imageUrl?: string;
  rating?: number;
  actions?: ProductAction[];
  productId?: string;
  onAction?: (action: string, data?: Record<string, unknown>) => void;
  className?: string;
}
```

**Key points:**
- ✅ Defines data shape (what component receives)
- ✅ Does NOT include `componentId` or `schema`
- ✅ Focused on actual prop types

#### Step 5: Create Component File

**File:** `product-card.component.tsx`

```tsx
/**
 * ProductCard Component
 * A configuration-driven product card component
 */

'use client';

import React from 'react';
import { ProductCardProps } from './product-card.types';

// Load configuration for styling (optional - can also be imported directly)
// In production, you might load this to apply theme variations
import config from './product-card.configuration.json';

/**
 * ProductCard Component
 * 
 * Renders a product card based on data received as props
 * Structure and styling defined in configuration
 * 
 * @example
 * ```tsx
 * import { ProductCard } from './product-card.component';
 * import { fetchProductData } from './product-card.datasource';
 * 
 * const data = await fetchProductData('product-123');
 * <ProductCard {...data} onAction={handleAction} />
 * ```
 */
export function ProductCard({
  title,
  description,
  price,
  imageUrl,
  rating,
  actions = [],
  productId,
  onAction,
  className = '',
}: ProductCardProps): React.ReactElement {
  
  /**
   * Handle action button clicks
   */
  const handleActionClick = (actionName: string) => {
    if (onAction) {
      onAction(actionName, { productId, title, price });
    } else {
      console.log(`Action: ${actionName}`, { productId });
    }
  };

  // Filter visible actions based on configuration behavior
  const visibleActions = config.behavior.filterInvisibleActions
    ? actions.filter(action => action.visible)
    : actions;

  // Get styling from configuration
  const styles = config.styling;

  return (
    <div className={`${styles.containerClass} ${className}`}>
      {/* Product Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className={styles.imageClass}
        />
      )}

      {/* Product Title */}
      <h3 className={styles.titleClass}>
        {title}
      </h3>

      {/* Product Description */}
      {description && (
        <p className={styles.descriptionClass}>
          {description}
        </p>
      )}

      {/* Rating */}
      {rating && config.behavior.showRatingStars && (
        <div className="flex items-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating.toFixed(1)}
          </span>
        </div>
      )}

      {/* Price */}
      <p className={styles.priceClass}>
        {price}
      </p>

      {/* Action Buttons */}
      {visibleActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visibleActions.map((action, index) => {
            const variantClass = config.variants[action.variant || 'primary'];
            
            return (
              <button
                key={`${action.action}-${index}`}
                onClick={() => handleActionClick(action.action)}
                className={variantClass}
                type="button"
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
```

**Key points:**
- ✅ Receives data as props
- ✅ Applies configuration rules (styling, behavior)
- ✅ Pure rendering logic
- ✅ No hardcoded content

#### Step 6: Create Index File

**File:** `index.ts`

```typescript
export { ProductCard } from './product-card.component';
export type { ProductCardProps } from './product-card.types';
export { defaultProductData, fetchProductData } from './product-card.datasource';
```

#### Step 7: Use the Component

**In any page or component:**

```tsx
'use client';

import { ProductCard } from '@/packages/shared/components/product-card';
import { fetchProductData } from '@/packages/shared/components/product-card';
import { useState, useEffect } from 'react';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    fetchProductData(params.id).then(setProductData);
  }, [params.id]);

  const handleAction = (action: string, data?: Record<string, unknown>) => {
    console.log('Product action:', action, data);
    
    if (action === 'addToCart') {
      // Add to cart logic
    } else if (action === 'viewDetails') {
      // Navigate to details
    }
  };

  if (!productData) return <div>Loading...</div>;

  return (
    <ProductCard 
      {...productData} 
      onAction={handleAction}
    />
  );
}
```

### Component Creation Checklist

When creating a new component, ensure you have:

- [ ] **Configuration file** (`.configuration.json`)
  - [ ] Contains only structure/schema
  - [ ] No actual data values
  - [ ] Defines field types and requirements
  - [ ] Includes behavior rules
  - [ ] Includes styling classes
  
- [ ] **Data source file** (`.datasource.ts`)
  - [ ] Provides default data
  - [ ] Has fetch function for API data
  - [ ] Exports clearly named functions
  - [ ] Supports personalization if needed

- [ ] **Types file** (`.types.ts`)
  - [ ] Defines prop interface
  - [ ] Does NOT extend BaseComponentConfig
  - [ ] Includes all data fields
  - [ ] Well-documented with JSDoc

- [ ] **Component file** (`.component.tsx`)
  - [ ] Receives data as props
  - [ ] Applies config rules
  - [ ] Handles events
  - [ ] No hardcoded content

- [ ] **Index file** (`index.ts`)
  - [ ] Exports component
  - [ ] Exports types
  - [ ] Exports data functions

- [ ] **Registration** (if using RenderComponent)
  - [ ] Added to `componentsRegistry.ts`

---

## Editing Configurations

### What to Edit Where

| Want to change... | Edit this file... | Example |
|-------------------|-------------------|---------|
| Button styling | `.configuration.json` → `variants` | Change button colors |
| Field structure | `.configuration.json` → `schema` | Add new required field |
| Behavior rules | `.configuration.json` → `behavior` | Toggle feature on/off |
| Actual text/labels | `.datasource.ts` | Change "Add to Cart" to "Buy Now" |
| API endpoint | `.datasource.ts` → fetch function | Change `/api/products` |
| Default values | `.datasource.ts` → default export | Change fallback data |

### Example: Changing Button Text

**WRONG** - Don't edit configuration:
```json
// ❌ product-card.configuration.json
{
  "actions": [
    { "label": "Buy Now" }  // Don't put data in config!
  ]
}
```

**RIGHT** - Edit data source:
```typescript
// ✅ product-card.datasource.ts
export const defaultProductData = {
  actions: [
    {
      label: 'Buy Now',  // Change text here!
      action: 'addToCart',
      visible: true,
      variant: 'primary',
    }
  ]
};
```

### Example: Adding New Field to Schema

**Configuration:**
```json
// product-card.configuration.json
{
  "schema": {
    // ... existing fields ...
    "stock": {
      "type": "number",
      "required": false,
      "description": "Items in stock",
      "default": 0
    }
  }
}
```

**Data Source:**
```typescript
// product-card.datasource.ts
export interface ProductData {
  // ... existing fields ...
  stock?: number;
}

export const defaultProductData: ProductData = {
  // ... existing data ...
  stock: 10,
};
```

**Component:**
```tsx
// product-card.component.tsx
export function ProductCard({ 
  // ... existing props ...
  stock,
}: ProductCardProps) {
  return (
    <div>
      {/* ... existing JSX ... */}
      {stock !== undefined && (
        <p className="text-sm text-gray-600">
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </p>
      )}
    </div>
  );
}
```

---

## Using Components

### Pattern 1: Direct Import (Recommended)

```tsx
import { ProductCard } from '@/components/product-card';
import { defaultProductData } from '@/components/product-card';

<ProductCard {...defaultProductData} onAction={handleAction} />
```

**Pros:**
- ✅ Type-safe
- ✅ Tree-shakeable
- ✅ Clear imports
- ✅ Better IDE support

### Pattern 2: Dynamic with RenderComponent

```tsx
import { RenderComponent } from '@/components/RenderComponent';

<RenderComponent id="ProductCard" props={{ productId: '123' }} />
```

**Pros:**
- ✅ Loads config automatically
- ✅ Useful for CMS-driven layouts
- ✅ Runtime component selection

### Pattern 3: API-Driven Data

```tsx
'use client';

import { ProductCard } from '@/components/product-card';
import { fetchProductData } from '@/components/product-card';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchProductData('product-123').then(setData);
  }, []);
  
  if (!data) return <div>Loading...</div>;
  
  return <ProductCard {...data} />;
}
```

---

## Configuration Schema Reference

### Schema Field Types

```json
{
  "schema": {
    "fieldName": {
      "type": "string" | "number" | "boolean" | "array" | "object",
      "required": true | false,
      "description": "Field description",
      "default": "default value",
      "enum": ["option1", "option2"],  // For string fields
      "itemSchema": { /* for array items */ },
      "properties": { /* for objects */ }
    }
  }
}
```

### Behavior Configuration

```json
{
  "behavior": {
    "filterInvisibleActions": true,
    "showRatingStars": true,
    "enableAnimations": false,
    "customRule": "value"
  }
}
```

### Styling Configuration

```json
{
  "styling": {
    "containerClass": "...",
    "headerClass": "...",
    "customClass": "..."
  }
}
```

### Variants Configuration

```json
{
  "variants": {
    "primary": "bg-blue-600 hover:bg-blue-700...",
    "secondary": "bg-gray-200 hover:bg-gray-300...",
    "custom": "..."
  }
}
```
      console.log(`Action: ${actionName}`, { productId, title, price });
    }
  };

  // Filter visible actions
  const visibleActions = actions.filter(action => action.visible);

  return (
    <div className={`${styles.containerClass || 'bg-white rounded-lg shadow-md p-4'} ${className}`}>
      {/* Product Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}

      {/* Product Title */}
      <h3 className={styles.titleClass || 'text-lg font-bold text-gray-900'}>
        {title}
      </h3>

      {/* Product Description */}
      <p className="text-gray-600 text-sm mt-2">
        {description}
      </p>

      {/* Rating (if provided) */}
      {rating !== undefined && (
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
        </div>
      )}

      {/* Price */}
      <p className={`mt-3 ${styles.priceClass || 'text-xl font-semibold text-green-600'}`}>
        {price}
      </p>

      {/* Action Buttons */}
      {visibleActions.length > 0 && (
        <div className="mt-4 space-y-2">
          {visibleActions.map((action, index) => {
            const buttonClass = buttonVariants[action.variant || 'primary'];
            
            return (
              <button
                key={`${action.action}-${index}`}
                onClick={() => handleActionClick(action.action)}
                className={`w-full ${buttonClass}`}
                type="button"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
```

**Component implementation best practices:**
- ✅ Add 'use client' directive for interactive components
- ✅ Implement proper TypeScript typing
- ✅ Filter visible actions before rendering
- ✅ Provide default styles via config
- ✅ Pass meaningful data to action handlers
- ✅ Use semantic HTML
- ✅ Add JSDoc comments

#### Step 6: Create Index File

**File:** `index.ts`

```typescript
/**
 * ProductCard Component Index
 * Exports the ProductCard component and its types
 */

export { ProductCard, default } from './product-card.component';
export type { ProductCardProps, ProductCardConfig } from './product-card.types';
```

#### Step 7: Register in Component Registry

**File:** `src/registry/componentsRegistry.ts`

```typescript
// Add import at top
import { ProductCard } from '@/app/components/product-card';
// or for shared component:
// import { ProductCard } from '@/packages/shared/components/product-card';

// Add to registry object
export const componentsRegistry: Record<string, ComponentRegistryEntry> = {
  // ... existing components
  ProductCard: {
    component: ProductCard,
    configPath: 'app/components/product-card/product-card.configuration.json',
  },
};
```

**⚠️ Important:**
- Component ID in registry MUST match `componentId` in configuration
- Use PascalCase for component IDs
- Path should be relative to component location

#### Step 8: Test Your Component

Create a test page or add to existing page:

```tsx
// In any page.tsx file
import { RenderComponent } from '@/components/RenderComponent';

export default function TestPage() {
  const handleProductAction = (action: string, data?: Record<string, unknown>) => {
    console.log('Product action:', action, data);
    
    if (action === 'addToCart') {
      // Add to cart logic
      alert(`Added ${data?.title} to cart!`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product Test</h1>
      
      {/* Basic usage */}
      <RenderComponent id="ProductCard" />
      
      {/* With custom props */}
      <div className="mt-8">
        <RenderComponent 
          id="ProductCard" 
          props={{
            productId: 'prod-123',
            onAction: handleProductAction,
            imageUrl: 'https://via.placeholder.com/300',
            rating: 4.5,
          }}
        />
      </div>
    </div>
  );
}
```

---

## Editing Configurations

### When to Edit Configuration vs Code

| Change Type | Edit Location | Requires Code Deploy? |
|-------------|---------------|----------------------|
| Button text | Configuration JSON | No (in production) |
| Add/remove button | Configuration JSON | No (in production) |
| Button visibility | Configuration JSON | No (in production) |
| Title/description | Configuration JSON | No (in production) |
| Styling classes | Configuration JSON | No (in production) |
| New UI element | Component TSX | Yes |
| New prop/behavior | Component TSX + Types | Yes |
| Action handler logic | Component TSX | Yes |

### Editing Configuration Files (3 Places to Update)

When you edit a configuration, you may need to update **up to 3 locations**:

#### 1. Local Configuration File (Always Required)

**Location:** `src/app/components/[component-name]/[component-name].configuration.json`

**Example - Changing Login button text:**

```json
{
  "componentId": "Login",
  "title": "Welcome Back!",  // ← Changed from "Welcome to BestReads"
  "description": "Please sign in to continue",
  "actions": [
    {
      "label": "Sign In Now",  // ← Changed from "Sign In with Email"
      "action": "signInEmail",
      "visible": true,
      "variant": "primary"
    }
  ]
}
```

**When you need this:**
- ✅ Always (for development and as source of truth)

#### 2. Remote Configuration Repository (Production Only)

**Location:** External git repository (e.g., `bestreads-configs` repo)

**Setup:**
1. Create a separate repository for configs
2. Upload your `.configuration.json` files
3. Ensure files are accessible via raw URL

**Example structure:**
```
bestreads-configs/
├── login.configuration.json
├── header.configuration.json
├── footer.configuration.json
└── product-card.configuration.json
```

**Example URL:**
```
https://raw.githubusercontent.com/BestReadsOrg/bestreads-configs/main/login.configuration.json
```

**When you need this:**
- ✅ For production deployments
- ✅ When you want to update configs without redeploying

#### 3. Component Type Definitions (When Adding New Properties)

**Location:** `src/app/components/[component-name]/[component-name].types.ts`

**Example - Adding a new subtitle property:**

```typescript
export interface LoginConfig extends BaseComponentConfig {
  title: string;
  subtitle?: string;  // ← NEW property
  description: string;
}
```

**Then update configuration:**
```json
{
  "componentId": "Login",
  "title": "Welcome Back!",
  "subtitle": "We missed you!",  // ← NEW property
  "description": "Please sign in to continue"
}
```

**Then update component:**
```tsx
export function Login({ title, subtitle, description }: LoginProps) {
  return (
    <div>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}  {/* ← Use new property */}
      <p>{description}</p>
    </div>
  );
}
```

**When you need this:**
- ✅ When adding new configuration properties
- ✅ When changing property types
- ✅ When making optional properties required (or vice versa)

### Step-by-Step: Editing Existing Component Configuration

#### Scenario: Update Login Component Button Labels

**Step 1: Edit local configuration**

```bash
# Open the configuration file
code src/app/components/login-component/login.configuration.json
```

**Make changes:**
```json
{
  "componentId": "Login",
  "title": "Welcome Back, Reader!",
  "description": "Sign in to continue your reading journey",
  "actions": [
    {
      "label": "Sign In with Email",
      "action": "signInEmail",
      "visible": true,
      "variant": "primary"
    },
    {
      "label": "Continue with Google",  // ← Changed
      "action": "signInGoogle",
      "visible": true,
      "variant": "secondary"
    },
    {
      "label": "New User? Create Account",  // ← Changed
      "action": "createAccount",
      "visible": true,
      "variant": "ghost"
    }
  ]
}
```

**Step 2: Test locally**

```bash
npm run dev
# Visit http://localhost:3000/example
```

**Step 3: Commit to version control**

```bash
git add src/app/components/login-component/login.configuration.json
git commit -m "Update login button labels for better UX"
git push
```

**Step 4: Update remote config repository (if using)**

```bash
# In your bestreads-configs repository
cp ../bestreads-frontend/src/app/components/login-component/login.configuration.json ./login.configuration.json
git add login.configuration.json
git commit -m "Update login button labels"
git push
```

**Step 5: Verify in production** (after deploy)

The changes will appear immediately in production if using remote configs, or after next deployment if using local configs only.

### Adding New Actions to Configuration

**Example: Add a "Forgot Password" button to Login**

**Step 1: Update configuration**

```json
{
  "actions": [
    {
      "label": "Sign In",
      "action": "signIn",
      "visible": true,
      "variant": "primary"
    },
    {
      "label": "Forgot Password?",  // ← NEW action
      "action": "forgotPassword",
      "visible": true,
      "variant": "ghost"
    }
  ]
}
```

**Step 2: Handle the new action in your page/component usage**

```tsx
const handleLoginAction = (action: string, data?: Record<string, unknown>) => {
  switch (action) {
    case 'signIn':
      // Handle sign in
      break;
    case 'forgotPassword':  // ← NEW handler
      router.push('/forgot-password');
      break;
    default:
      console.log('Unknown action:', action);
  }
};

<RenderComponent 
  id="Login" 
  props={{ onAction: handleLoginAction }} 
/>
```

**No component code changes needed!** The button will automatically appear.

### Hiding/Showing Actions Dynamically

**Use the `visible` property:**

```json
{
  "actions": [
    {
      "label": "Admin Panel",
      "action": "openAdmin",
      "visible": false  // ← Hidden by default
    }
  ]
}
```

**Or control via props:**

```tsx
<RenderComponent 
  id="Navigation" 
  props={{
    actions: [
      ...config.actions,
      { 
        label: "Admin", 
        action: "admin", 
        visible: isAdmin,  // ← Dynamic visibility
        variant: "primary" 
      }
    ]
  }}
/>
```

---

## Using Components

### Basic Usage

```tsx
import { RenderComponent } from '@/components/RenderComponent';

export default function MyPage() {
  return (
    <div>
      <RenderComponent id="Header" />
      <RenderComponent id="ProductCard" />
      <RenderComponent id="Footer" />
    </div>
  );
}
```

### With Props

```tsx
<RenderComponent 
  id="ProductCard" 
  props={{
    productId: 'prod-123',
    imageUrl: '/images/product.jpg',
    rating: 4.5,
    onAction: handleProductAction
  }}
/>
```

### With Action Handlers

```tsx
const handleAction = (action: string, data?: Record<string, unknown>) => {
  console.log('Action triggered:', action, data);
  
  switch (action) {
    case 'addToCart':
      addToCart(data?.productId);
      break;
    case 'viewDetails':
      router.push(`/product/${data?.productId}`);
      break;
  }
};

<RenderComponent 
  id="ProductCard" 
  props={{ onAction: handleAction }}
/>
```

### With Custom Loading State

```tsx
<RenderComponent 
  id="ProductCard"
  fallback={
    <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
  }
/>
```

### Batch Rendering Multiple Components

```tsx
import { renderComponents } from '@/components/RenderComponent';

export default function DashboardPage() {
  return (
    <div>
      {renderComponents(
        ['Header', 'StatsWidget', 'ChartWidget', 'Footer'],
        {
          StatsWidget: { userId: 'user-123' },
          ChartWidget: { period: 'monthly' }
        }
      )}
    </div>
  );
}
```

### Higher-Order Component Pattern

```tsx
import { withConfig } from '@/components/RenderComponent';

// Create a pre-configured component
const DarkModeLogin = withConfig('Login', { 
  theme: 'dark',
  styles: {
    containerClass: 'bg-gray-900 text-white'
  }
});

// Use it
<DarkModeLogin user={currentUser} />
```

### Programmatic Config Loading

```tsx
import { getConfig } from '@/utils/getConfig';

async function loadComponentConfig() {
  try {
    const config = await getConfig('ProductCard');
    console.log('Config loaded:', config);
    
    // Use config data
    setTitle(config.title);
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}
```

---

## Component Registry Management

### Understanding the Registry

The component registry (`src/registry/componentsRegistry.ts`) is the **central mapping** between component IDs and their React implementations.

### Registry Structure

```typescript
export const componentsRegistry: Record<string, ComponentRegistryEntry> = {
  ComponentID: {
    component: ComponentReference,
    configPath: 'path/to/config.json',
  },
};
```

### Adding a Component to Registry

**Step 1: Import the component**

```typescript
// At the top of componentsRegistry.ts
import { ProductCard } from '@/app/components/product-card';
```

**Step 2: Add to registry object**

```typescript
export const componentsRegistry = {
  // ... existing components
  
  ProductCard: {
    component: ProductCard,
    configPath: 'app/components/product-card/product-card.configuration.json',
  },
};
```

### Removing a Component from Registry

**Step 1: Remove the entry**

```typescript
export const componentsRegistry = {
  Header: { ... },
  Footer: { ... },
  // ProductCard: { ... },  ← Remove or comment out
};
```

**Step 2: Remove the import**

```typescript
// import { ProductCard } from '@/app/components/product-card';  ← Remove
```

**Step 3: Handle removal in code**

Ensure no pages are still trying to render the removed component:

```tsx
// Before removal, find and update all usages:
// <RenderComponent id="ProductCard" />  ← Will error after removal
```

### Renaming a Component

**To rename from `OldName` to `NewName`:**

**Step 1: Update configuration file**

```json
{
  "componentId": "NewName",  // ← Changed from "OldName"
  ...
}
```

**Step 2: Update registry**

```typescript
export const componentsRegistry = {
  NewName: {  // ← Changed from OldName
    component: ProductCard,
    configPath: 'app/components/product-card/product-card.configuration.json',
  },
};
```

**Step 3: Update all usages**

```tsx
// Find all instances and update:
<RenderComponent id="NewName" />  // ← Changed from "OldName"
```

### Dynamic Component Registration

Register components at runtime:

```typescript
import { registerComponent } from '@/registry/componentsRegistry';
import { CustomWidget } from './CustomWidget';

// Register on-the-fly
registerComponent('CustomWidget', {
  component: CustomWidget,
  configPath: 'custom/widget.configuration.json',
});

// Now usable
<RenderComponent id="CustomWidget" />
```

### Checking Component Existence

```typescript
import { hasComponent } from '@/registry/componentsRegistry';

if (hasComponent('ProductCard')) {
  // Safe to render
  return <RenderComponent id="ProductCard" />;
} else {
  // Show fallback
  return <div>Component not available</div>;
}
```

### Getting All Registered Components

```typescript
import { getAllComponentIds } from '@/registry/componentsRegistry';

const componentIds = getAllComponentIds();
console.log('Available components:', componentIds);
// ['Header', 'Footer', 'Login', 'ProductCard']
```

---

## Configuration Schema Reference

### Base Configuration Interface

All configurations extend this base:

```typescript
interface BaseComponentConfig {
  componentId: string;          // REQUIRED - Component identifier
  headerKey?: string;            // Optional - Key for header text
  bodyKey?: string;              // Optional - Key for body text
  actions?: ActionConfig[];      // Optional - Array of actions
  [key: string]: unknown;        // Any additional properties
}
```

### Action Configuration

```typescript
interface ActionConfig {
  label: string;                 // REQUIRED - Button text
  action: string;                // REQUIRED - Action identifier
  visible: boolean;              // REQUIRED - Show/hide button
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: string;                 // Optional - Icon identifier
}
```

### Action Variants

| Variant | Style | Use Case |
|---------|-------|----------|
| `primary` | Blue, bold | Main actions (Submit, Save, Sign In) |
| `secondary` | Gray, subtle | Alternative actions (Cancel, Back) |
| `danger` | Red, warning | Destructive actions (Delete, Remove) |
| `ghost` | Transparent, bordered | Tertiary actions (More Info, Skip) |

### Common Configuration Patterns

#### Pattern 1: Simple Text Component

```json
{
  "componentId": "Banner",
  "title": "Welcome to BestReads",
  "message": "Discover your next favorite book"
}
```

#### Pattern 2: Component with Actions

```json
{
  "componentId": "Subscription",
  "title": "Premium Membership",
  "price": "$9.99/month",
  "actions": [
    {
      "label": "Subscribe Now",
      "action": "subscribe",
      "visible": true,
      "variant": "primary"
    },
    {
      "label": "Learn More",
      "action": "learnMore",
      "visible": true,
      "variant": "ghost"
    }
  ]
}
```

#### Pattern 3: Component with Custom Styles

```json
{
  "componentId": "Alert",
  "type": "warning",
  "message": "Your session will expire soon",
  "styles": {
    "containerClass": "bg-yellow-50 border-l-4 border-yellow-400 p-4",
    "iconClass": "text-yellow-400",
    "textClass": "text-yellow-800"
  }
}
```

#### Pattern 4: Component with Nested Data

```json
{
  "componentId": "ProductList",
  "title": "Featured Products",
  "products": [
    {
      "id": "1",
      "name": "Book Title",
      "price": "$19.99"
    },
    {
      "id": "2",
      "name": "Another Book",
      "price": "$24.99"
    }
  ]
}
```

---

## Advanced Patterns

### Pattern 1: Conditional Configuration Loading

```tsx
import { getConfig } from '@/utils/getConfig';

async function loadUserSpecificConfig(userRole: string) {
  const baseConfig = await getConfig('Dashboard');
  
  // Modify config based on user role
  if (userRole === 'admin') {
    baseConfig.actions.push({
      label: 'Admin Panel',
      action: 'openAdmin',
      visible: true,
      variant: 'danger',
    });
  }
  
  return baseConfig;
}
```

### Pattern 2: Config Merging

```tsx
const baseConfig = await getConfig('ProductCard');
const customConfig = {
  imageUrl: product.image,
  rating: product.rating,
  price: `$${product.price}`,
};

<RenderComponent 
  id="ProductCard"
  props={{ ...baseConfig, ...customConfig }}
/>
```

### Pattern 3: Config Preloading for Performance

```tsx
import { preloadConfigs } from '@/utils/getConfig';

export default function App() {
  useEffect(() => {
    // Preload configs on app mount
    preloadConfigs(['Header', 'Footer', 'Navigation']);
  }, []);
  
  return <Layout />;
}
```

### Pattern 4: Environment-Specific Configurations

```typescript
// In getConfig.ts
const getConfigUrl = (componentId: string) => {
  const env = process.env.NEXT_PUBLIC_ENV || 'production';
  
  const urls = {
    development: 'http://localhost:3001/configs',
    staging: 'https://staging-configs.example.com',
    production: 'https://configs.example.com',
  };
  
  return `${urls[env]}/${componentId}.configuration.json`;
};
```

### Pattern 5: A/B Testing with Configurations

```tsx
import { getConfig } from '@/utils/getConfig';

async function loadVariantConfig(componentId: string, variant: 'A' | 'B') {
  const config = await getConfig(componentId);
  
  // Apply A/B test modifications
  if (variant === 'B') {
    config.actions[0].label = 'Try Now - Limited Offer!';
    config.title = 'Special Deal for You!';
  }
  
  return config;
}
```

---

## Environment & Deployment

### Development Environment

**Behavior:**
- Loads configs from local JSON files
- Uses dynamic imports
- Hot-reload supported
- No network requests

**Configuration location:**
```
src/app/components/[component]/[component].configuration.json
```

**How it works:**
```typescript
// In getConfig.ts
const config = await import(
  `@/app/components/${componentId.toLowerCase()}-component/${componentId.toLowerCase()}.configuration.json`
);
```

### Production Environment

**Behavior:**
- Fetches configs from remote URL
- Uses fetch API
- Configs cached for performance
- Enables config updates without redeploy

**Setup Steps:**

#### Step 1: Create Config Repository

```bash
# Create a new repository
mkdir bestreads-configs
cd bestreads-configs
git init

# Copy config files
cp ../bestreads-frontend/src/app/components/*/\*.configuration.json .

# Commit and push
git add .
git commit -m "Initial configs"
git remote add origin https://github.com/BestReadsOrg/bestreads-configs.git
git push -u origin main
```

#### Step 2: Update Remote URL

**File:** `src/utils/getConfig.ts`

```typescript
const DEFAULT_REMOTE_BASE_URL = 
  'https://raw.githubusercontent.com/BestReadsOrg/bestreads-configs/main';
```

Replace with your repository URL.

#### Step 3: Use Environment Variables (Recommended)

**File:** `.env.production`

```env
NEXT_PUBLIC_CONFIG_BASE_URL=https://raw.githubusercontent.com/BestReadsOrg/bestreads-configs/main
```

**File:** `src/utils/getConfig.ts`

```typescript
const DEFAULT_REMOTE_BASE_URL = 
  process.env.NEXT_PUBLIC_CONFIG_BASE_URL || 
  'https://raw.githubusercontent.com/BestReadsOrg/bestreads-configs/main';
```

#### Step 4: Configure CORS (if using custom server)

Ensure your config server allows CORS requests:

```javascript
// Example Express.js CORS setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});
```

GitHub raw URLs have CORS enabled by default.

### Deployment Workflow

#### Option 1: Deploy Code Only (Configs Bundled)

```bash
# Configs are part of the Next.js build
npm run build
npm run start
```

**Pros:** Simple, no external dependencies  
**Cons:** Need to redeploy for config changes

#### Option 2: Deploy Code + Remote Configs

```bash
# 1. Update configs in remote repository
cd bestreads-configs
git pull
# Make config changes
git add .
git commit -m "Update login button text"
git push

# 2. Configs update automatically in production (no redeploy needed!)
```

**Pros:** Update configs without redeploying  
**Cons:** Additional repository to manage

#### Option 3: CDN-Hosted Configs

```bash
# Upload configs to CDN
aws s3 sync ./configs s3://my-bucket/configs --acl public-read

# Update .env
NEXT_PUBLIC_CONFIG_BASE_URL=https://cdn.example.com/configs
```

**Pros:** Fast, scalable, globally distributed  
**Cons:** CDN costs, more infrastructure

### Cache Management

#### Clear Cache in Production

```typescript
import { clearConfigCache } from '@/utils/getConfig';

// Clear cache after config update
clearConfigCache();
```

#### Cache Busting with Versioning

**Update remote URL with version:**

```typescript
const configUrl = `${remoteBaseUrl}/${componentId}.configuration.json?v=${Date.now()}`;
```

Or use proper versioning:

```typescript
const CONFIG_VERSION = '1.2.0';
const configUrl = `${remoteBaseUrl}/${componentId}.configuration.json?v=${CONFIG_VERSION}`;
```

---

## Troubleshooting

### Component Not Rendering

**Symptoms:** Nothing appears or error message shows

**Solutions:**

1. **Check component is registered**
   ```typescript
   // In src/registry/componentsRegistry.ts
   // Ensure entry exists with correct ID
   ```

2. **Verify configuration file exists**
   ```bash
   # Check file exists
   ls src/app/components/my-component/my-component.configuration.json
   ```

3. **Check componentId matches**
   ```json
   // In config file
   {
     "componentId": "MyComponent"  // Must match registry key
   }
   ```

4. **Check console for errors**
   ```
   Open browser DevTools → Console tab
   Look for error messages
   ```

### Configuration Not Loading

**Symptoms:** Component renders with default/missing data

**Solutions:**

1. **Verify JSON syntax**
   ```bash
   # Use a JSON validator
   cat my-component.configuration.json | jq .
   ```

2. **Check file path in development**
   ```typescript
   // Path must match actual file location
   // Case-sensitive!
   ```

3. **Check remote URL in production**
   ```bash
   # Test URL directly
   curl https://raw.githubusercontent.com/.../config.json
   ```

4. **Clear cache**
   ```typescript
   import { clearConfigCache } from '@/utils/getConfig';
   clearConfigCache();
   ```

### Type Errors

**Symptoms:** TypeScript compilation errors

**Solutions:**

1. **Ensure types extend BaseComponentConfig**
   ```typescript
   export interface MyConfig extends BaseComponentConfig {
     // ...
   }
   ```

2. **Check all required props are defined**
   ```typescript
   // Mark optional props with ?
   export interface MyConfig {
     required: string;
     optional?: string;
   }
   ```

3. **Verify imports are correct**
   ```typescript
   import { BaseComponentConfig } from '@/types/config.types';
   ```

### Actions Not Working

**Symptoms:** Buttons appear but don't do anything

**Solutions:**

1. **Pass onAction handler**
   ```tsx
   <RenderComponent 
     id="MyComponent"
     props={{ onAction: handleAction }}
   />
   ```

2. **Check action names match**
   ```json
   // Config
   { "action": "submitForm" }
   ```
   ```tsx
   // Handler
   case 'submitForm':  // Must match exactly
   ```

3. **Check visible property**
   ```json
   {
     "visible": true  // Must be true to show
   }
   ```

### Import Errors

**Symptoms:** Cannot find module errors

**Solutions:**

1. **Check path aliases in tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Ensure index.ts exports correctly**
   ```typescript
   export { MyComponent, default } from './my-component.component';
   ```

3. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

---

## Complete Examples

### Example 1: User Profile Card

**Configuration:** `user-profile.configuration.json`

```json
{
  "componentId": "UserProfile",
  "defaultAvatar": "/images/default-avatar.png",
  "actions": [
    {
      "label": "Edit Profile",
      "action": "editProfile",
      "visible": true,
      "variant": "primary"
    },
    {
      "label": "View Activity",
      "action": "viewActivity",
      "visible": true,
      "variant": "secondary"
    },
    {
      "label": "Logout",
      "action": "logout",
      "visible": true,
      "variant": "danger"
    }
  ],
  "styles": {
    "containerClass": "bg-white rounded-lg shadow-lg p-6 max-w-sm",
    "avatarClass": "w-24 h-24 rounded-full mx-auto",
    "nameClass": "text-xl font-bold text-center mt-4"
  }
}
```

**Types:** `user-profile.types.ts`

```typescript
import { BaseComponentConfig } from '@/types/config.types';

export interface UserProfileConfig extends BaseComponentConfig {
  defaultAvatar: string;
  styles?: {
    containerClass?: string;
    avatarClass?: string;
    nameClass?: string;
  };
}

export interface UserProfileProps extends UserProfileConfig {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    memberSince?: string;
  };
  onAction?: (action: string, data?: Record<string, unknown>) => void;
  className?: string;
}
```

**Component:** `user-profile.component.tsx`

```tsx
'use client';

import React from 'react';
import { UserProfileProps } from './user-profile.types';

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md',
  danger: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md',
  ghost: 'bg-transparent hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-md border',
};

export function UserProfile({
  user,
  defaultAvatar,
  actions = [],
  styles = {},
  onAction,
  className = '',
}: UserProfileProps): React.ReactElement {
  
  const handleActionClick = (actionName: string) => {
    if (onAction) {
      onAction(actionName, { user });
    } else {
      console.log(`Action: ${actionName}`, user);
    }
  };

  const visibleActions = actions.filter(a => a.visible);
  const avatarUrl = user?.avatar || defaultAvatar;

  return (
    <div className={`${styles.containerClass || 'bg-white rounded-lg shadow-lg p-6 max-w-sm'} ${className}`}>
      {/* Avatar */}
      <img 
        src={avatarUrl}
        alt={user?.name || 'User'}
        className={styles.avatarClass || 'w-24 h-24 rounded-full mx-auto'}
      />

      {/* User Info */}
      {user && (
        <>
          <h2 className={styles.nameClass || 'text-xl font-bold text-center mt-4'}>
            {user.name}
          </h2>
          <p className="text-gray-600 text-center text-sm mt-1">
            {user.email}
          </p>
          {user.memberSince && (
            <p className="text-gray-500 text-center text-xs mt-2">
              Member since {user.memberSince}
            </p>
          )}
        </>
      )}

      {/* Actions */}
      {visibleActions.length > 0 && (
        <div className="mt-6 space-y-2">
          {visibleActions.map((action, index) => {
            const buttonClass = buttonVariants[action.variant || 'primary'];
            return (
              <button
                key={`${action.action}-${index}`}
                onClick={() => handleActionClick(action.action)}
                className={`w-full ${buttonClass}`}
                type="button"
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
```

**Index:** `index.ts`

```typescript
export { UserProfile, default } from './user-profile.component';
export type { UserProfileProps, UserProfileConfig } from './user-profile.types';
```

**Registry:** Add to `componentsRegistry.ts`

```typescript
import { UserProfile } from '@/app/components/user-profile';

export const componentsRegistry = {
  // ... other components
  UserProfile: {
    component: UserProfile,
    configPath: 'app/components/user-profile/user-profile.configuration.json',
  },
};
```

**Usage:**

```tsx
import { RenderComponent } from '@/components/RenderComponent';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  
  const currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/images/john-avatar.jpg',
    memberSince: '2024',
  };

  const handleProfileAction = (action: string, data?: Record<string, unknown>) => {
    switch (action) {
      case 'editProfile':
        router.push('/profile/edit');
        break;
      case 'viewActivity':
        router.push('/activity');
        break;
      case 'logout':
        // Logout logic
        router.push('/logout');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <RenderComponent 
        id="UserProfile"
        props={{
          user: currentUser,
          onAction: handleProfileAction,
        }}
      />
    </div>
  );
}
```

---

### Example 2: Notification Banner

**Full implementation showing configuration changes without code changes**

**Initial Configuration:** `notification-banner.configuration.json`

```json
{
  "componentId": "NotificationBanner",
  "type": "info",
  "message": "Welcome to BestReads!",
  "dismissible": true,
  "actions": [
    {
      "label": "Get Started",
      "action": "getStarted",
      "visible": true,
      "variant": "primary"
    }
  ]
}
```

**Updated Configuration (no code changes):**

```json
{
  "componentId": "NotificationBanner",
  "type": "warning",
  "message": "System maintenance scheduled for tonight at 10 PM EST.",
  "dismissible": true,
  "actions": [
    {
      "label": "Learn More",
      "action": "learnMore",
      "visible": true,
      "variant": "secondary"
    },
    {
      "label": "Dismiss",
      "action": "dismiss",
      "visible": true,
      "variant": "ghost"
    }
  ]
}
```

The component automatically updates to show the new message and actions!

---

## Quick Reference Cheatsheet

### Component Creation Checklist

- [ ] Choose location (app/shared)
- [ ] Create directory with kebab-case name
- [ ] Create `.configuration.json` file
- [ ] Create `.types.ts` file
- [ ] Create `.component.tsx` file
- [ ] Create `index.ts` file
- [ ] Add to `componentsRegistry.ts`
- [ ] Test in dev environment
- [ ] Update remote config repository (if using)

### Files to Update When...

| Task | Files to Update |
|------|-----------------|
| Change button text | Configuration JSON only |
| Add new button | Configuration JSON only |
| Add new prop | Types, Configuration, Component |
| Rename component | Configuration, Registry, All usages |
| Change styling | Configuration JSON (if using styles prop) |
| Add new feature | Component TSX, Types |

### Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Type check
npm run type-check

# Lint
npm run lint

# Test configuration JSON syntax
cat path/to/config.json | jq .
```

### Key Imports

```typescript
// Rendering
import { RenderComponent } from '@/components/RenderComponent';

// Config loading
import { getConfig, clearConfigCache, preloadConfigs } from '@/utils/getConfig';

// Registry
import { getComponent, hasComponent, registerComponent, getAllComponentIds } from '@/registry/componentsRegistry';

// Types
import { BaseComponentConfig, ActionConfig } from '@/types/config.types';
```

---

## Summary

This configuration-driven UI system provides:

✅ **Separation of Concerns** - Content (config) separate from behavior (code)  
✅ **Flexibility** - Update UI without code changes in production  
✅ **Type Safety** - Full TypeScript support  
✅ **Developer Experience** - Clear patterns and conventions  
✅ **Scalability** - Easy to add new components  
✅ **Maintainability** - Centralized configuration management

For live examples, visit `/example` in your running application.

For questions or issues, consult the troubleshooting section or review the example components in `src/app/components/` and `src/packages/shared/components/`.

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0  
**System:** BestReads Frontend - Configuration-Driven UI

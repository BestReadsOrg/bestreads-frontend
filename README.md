# BestReads Frontend

> A Next.js + TypeScript application with a configuration-driven UI system

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## 📚 Documentation

**[→ Complete Guide (GUIDE.md)](./GUIDE.md)** - Comprehensive documentation for the configuration-driven UI system

**[→ Configuration Guide (CONFIGURATION_GUIDE.md)](./CONFIGURATION_GUIDE.md)** - Complete guide to page and component configuration system

**[→ Quick Reference (CONFIG_QUICK_REFERENCE.md)](./CONFIG_QUICK_REFERENCE.md)** - Quick lookup for configuration routes and patterns

**[→ Architecture Diagrams (ARCHITECTURE_DIAGRAMS.md)](./ARCHITECTURE_DIAGRAMS.md)** - Visual system architecture

**[→ Implementation Summary (CONFIGURATION_IMPLEMENTATION_SUMMARY.md)](./CONFIGURATION_IMPLEMENTATION_SUMMARY.md)** - Detailed implementation overview

### What's in the Guide?

- ✅ **Creating New Components** - Step-by-step instructions
- ✅ **Editing Configurations** - How to update component configs (3 places to check!)
- ✅ **Component Registry** - Managing the component registry
- ✅ **Usage Patterns** - Common patterns and advanced techniques
- ✅ **Deployment** - Environment setup and production deployment
- ✅ **Troubleshooting** - Common issues and solutions
- ✅ **Complete Examples** - Real-world component implementations

### Configuration System Features

- ✅ **Page Configurations** - Define entire page layouts in JSON
- ✅ **Route-Based IDs** - Access configs via `header.route`, `landing.page`
- ✅ **Dynamic Rendering** - `PageRenderer` component for automatic page building
- ✅ **Type Safety** - Full TypeScript support with type guards
- ✅ **Caching** - Built-in configuration caching for performance
- ✅ **Environment Aware** - Local files in dev, remote CDN in production

## 🎯 Key Features

### Configuration-Driven Components

Components load their content and behavior from JSON configuration files:

```tsx
// Just specify the component ID
<RenderComponent id="Login" />

// Components automatically load configuration
// Update content without changing code!
```

### Development vs Production

- **Development**: Loads configs from local JSON files
- **Production**: Fetches configs from remote repository

**Update configurations in production without redeploying code!**

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # App-specific components
│   │   └── login-component/
│   └── example/            # Demo page (visit /example)
│
├── packages/
│   └── shared/
│       └── components/      # Shared components
│           ├── header/
│           └── footer/
│
├── components/
│   └── RenderComponent.tsx  # Dynamic renderer
│
├── registry/
│   └── componentsRegistry.ts  # Component registry
│
├── utils/
│   └── getConfig.ts         # Config loader
│
└── types/
    └── config.types.ts      # Type definitions
```

## 🎨 Example Components

Visit `/example` to see live examples of:

- **Login Component** - Email/Google sign-in with configurable buttons
- **Header Component** - Navigation with dynamic links
- **Footer Component** - Footer with copyright and links

## 🛠️ Common Tasks

### Using the Configuration System

```typescript
// Load a page configuration
import { getConfig, isPageConfig } from '@/utils/getConfig';
import { PageRenderer } from '@/components/PageRenderer';

const pageConfig = await getConfig('landing.page');

if (isPageConfig(pageConfig)) {
  return <PageRenderer pageConfig={pageConfig} componentData={data} />;
}

// Load a component configuration
const headerConfig = await getConfig('header.route');
```

### Available Configuration Routes

**Components**: `header.route`, `hero.route`, `features.route`, `how-it-works.route`, `testimonials.route`, `integrations.route`, `newsletter.route`, `footer.route`, `auth.route`

**Pages**: `landing.page`, `login.page`, `register.page`, `dashboard.page`

### Create a New Component

See [GUIDE.md - Creating New Components](./GUIDE.md#creating-new-components)

### Edit Component Configuration

See [GUIDE.md - Editing Configurations](./GUIDE.md#editing-configurations)

### Deploy to Production

See [GUIDE.md - Environment & Deployment](./GUIDE.md#environment--deployment)

## 📝 Configuration Example

```json
{
  "componentId": "Login",
  "title": "Welcome to BestReads",
  "description": "Sign in to continue",
  "actions": [
    {
      "label": "Sign In",
      "action": "signIn",
      "visible": true,
      "variant": "primary"
    }
  ]
}
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🆘 Need Help?

1. Check the **[Complete Guide (GUIDE.md)](./GUIDE.md)**
2. Visit the `/example` page for live demos
3. Review existing components in `src/app/components/` and `src/packages/shared/components/`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

[Your License Here]

---

**Built with ❤️ using Next.js 16, TypeScript, and Tailwind CSS**

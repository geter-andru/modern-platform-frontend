# H&S Platform - Frontend

## Overview
Modern Next.js frontend for the H&S Revenue Intelligence Platform with comprehensive features for customer management, ICP analysis, cost calculation, and business case generation.

## 🎯 Status: PRODUCTION READY ✅
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state
- **Authentication**: Supabase integration
- **Testing**: Jest with comprehensive test coverage

## Key Features

### ✅ Core Functionality
- **Customer Dashboard**: Comprehensive customer management interface
- **ICP Analysis**: AI-powered customer profiling and analysis
- **Cost Calculator**: Financial impact analysis with scenario modeling
- **Business Case Builder**: Document generation and template management
- **Resources Library**: Three-tier progressive resource system
- **Export Engine**: Multi-format export capabilities

### ✅ Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Reusable UI components with TypeScript
- **Dark Mode**: Complete dark/light theme support
- **Accessibility**: WCAG 2.1 compliant components
- **Performance**: Optimized for 50-75 concurrent users

### ✅ Enterprise Features
- **Authentication**: Supabase-based user management
- **Real-time Updates**: Live data synchronization
- **Progressive Enhancement**: Works without JavaScript
- **Error Boundaries**: Graceful error handling
- **Loading States**: Comprehensive loading and error states

## Tech Stack
- **Framework**: Next.js 15
- **React**: React 19
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Authentication**: Supabase
- **TypeScript**: Full type safety
- **Testing**: Jest with React Testing Library

## Development

### Prerequisites
```bash
Node.js 18+
npm or yarn
Supabase account
```

### Environment Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values**:
   - Get Supabase keys from [Supabase Dashboard](https://supabase.com/dashboard)
   - Get Airtable API key from [Airtable Account](https://airtable.com/account)
   - Get Anthropic API key from [Anthropic Console](https://console.anthropic.com)

3. **Never commit .env.local to git**

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Testing
```bash
npm test
npm run test:coverage
```

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL

### Optional Variables
- `NEXT_PUBLIC_AIRTABLE_API_KEY`: For Airtable integration
- `NEXT_PUBLIC_ANTHROPIC_API_KEY`: For AI features
- `NEXT_PUBLIC_DEBUG_MODE`: Enable debug logging

## Project Structure
```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── lib/              # Utilities and services
│   └── page.tsx          # Main page
├── src/                   # Source code
│   ├── features/         # Feature-based modules
│   └── shared/           # Shared components and utilities
├── public/               # Static assets
└── tests/               # Test files
```

## Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables in Netlify dashboard

### Vercel
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## Security Notes

⚠️ **Important Security Guidelines**:
- Never commit `.env.local` or `.env` files
- Use `.env.example` as a template
- All `NEXT_PUBLIC_` variables are exposed to the browser
- Keep sensitive secrets server-side only
- Regularly rotate API keys

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

For issues and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [Documentation](https://docs.your-platform.com)
- Contact the development team

---

**Last Updated**: January 2025
**Version**: 1.0.0

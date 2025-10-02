# H&S Revenue Intelligence Platform

AI-powered revenue optimization and business intelligence platform for technical founders and revenue teams.

## Overview

The H&S Platform is a comprehensive revenue intelligence solution that combines:
- **ICP Analysis**: AI-powered ideal customer profiling and segmentation
- **Cost Calculator**: Financial impact analysis of delayed decision-making
- **Business Case Builder**: Automated proposal and ROI documentation
- **Progress Tracking**: Real-time milestone and achievement monitoring
- **Export Capabilities**: Professional reports and presentations

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Query**: State management and caching
- **React Hook Form**: Form handling and validation

### Backend API
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Airtable SDK**: Database integration
- **JWT**: Authentication
- **Make.com**: Automation workflows
- **Claude API**: AI-powered insights

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Airtable account and API key
- Claude API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/geter-andru/hs-andru-v1.git
   cd hs-andru-v1
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../hs-platform-api
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   
   # Backend (.env)
   AIRTABLE_API_KEY=your_airtable_api_key
   AIRTABLE_BASE_ID=your_base_id
   JWT_SECRET=your_jwt_secret
   CLAUDE_API_KEY=your_claude_api_key (optional)
   MAKE_API_TOKEN=your_make_token (optional)
   ```

### Development

1. **Start the backend server**
   ```bash
   cd hs-platform-api
   npm start
   # Server runs on http://localhost:3001
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:3001/api/docs
   - Health Check: http://localhost:3001/health

### Demo Credentials
- Customer ID: `CUST_2`

## Features

### 🎯 ICP Analysis
- Multi-step customer profiling form
- AI-enhanced segment scoring
- Visual results with recommendations
- Historical analysis tracking

### 💰 Cost Calculator
- Revenue impact assessment
- Operational efficiency analysis
- Competitive disadvantage modeling
- Scenario-based projections

### 📊 Dashboard
- Real-time progress overview
- Milestone tracking
- AI-powered insights
- Quick action navigation

### 🚀 Progress Tracking
- Automated milestone detection
- Achievement notifications
- Performance analytics
- Goal setting and monitoring

## API Endpoints

### Authentication
- `POST /api/auth/token` - Generate access token
- `POST /api/auth/refresh` - Refresh token

### Customer Management
- `GET /api/customer/:id` - Get customer details
- `GET /api/customer/:id/icp` - Get ICP analysis
- `POST /api/customer/:id/generate-icp` - Generate AI ICP

### Cost Calculator
- `POST /api/cost-calculator/calculate` - Basic calculation
- `POST /api/cost-calculator/calculate-ai` - AI-enhanced calculation
- `GET /api/cost-calculator/history/:id` - Calculation history

### Business Case
- `POST /api/business-case/generate` - Generate business case
- `GET /api/business-case/templates` - Get templates
- `GET /api/business-case/:id/history` - Case history

### Progress Tracking
- `GET /api/progress/:id` - Get progress data
- `POST /api/progress/:id/track` - Track action
- `GET /api/progress/:id/milestones` - Get milestones

### Export
- `POST /api/export/icp` - Export ICP analysis
- `POST /api/export/cost-calculator` - Export calculations
- `POST /api/export/comprehensive` - Export full report

## Validation System

The platform includes a comprehensive validation pipeline to ensure code quality, security, and compatibility.

### Validation Pipeline

Run the complete validation suite:
```bash
npm run validate
```

### Validation Components

#### 🔒 Security Validation
- **Secret Detection**: Scans for exposed API keys and sensitive data
- **Next.js Security**: Validates security best practices
- **Environment Variables**: Ensures proper configuration

#### 🔧 Compatibility Validation
- **Next.js 15**: Framework compatibility checks
- **React 19**: Component structure validation
- **TypeScript**: Type safety verification
- **App Router**: Routing structure validation

#### 🌐 Deployment Validation
- **Netlify**: Deployment configuration checks
- **Environment**: Production environment validation
- **Build Artifacts**: Build output verification

#### 🌪️ Chaos Testing
- **Load Testing**: 75 concurrent user simulation
- **Memory Leaks**: Resource usage monitoring
- **Error Handling**: Stress testing and graceful degradation
- **Performance**: Response time and throughput analysis

### Validation Agents

The system includes specialized validation agents:

- **Security Scanner** (`lib/validation/agents/security/`)
- **Build Validator** (`lib/validation/agents/build/`)
- **Compatibility Checker** (`lib/validation/agents/compatibility/`)
- **Netlify Deployer** (`lib/validation/agents/netlify/`)

### Validation Context

The platform maintains a validation context file (`H_S_VALIDATION_CONTEXT.json`) that tracks:
- Current validation status
- Feature implementation state
- Integration points
- Deployment readiness

## Deployment

### Production Build
```bash
# Frontend
npm run build
npm start

# Backend
npm run build (if applicable)
npm start
```

### Pre-Deployment Validation
```bash
# Run full validation before deployment
npm run validate

# Check specific components
npm run validate:security
npm run validate:compatibility
npm run validate:netlify
```

### Environment Variables
Ensure all production environment variables are configured:
- Database credentials
- API keys
- JWT secrets
- External service tokens

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:
- Documentation: See inline code comments
- Issues: GitHub Issues tab
- Contact: [Your contact information]

# 🗄️ Supabase Setup Guide - Complete Database Migration

## **OVERVIEW**
This guide replaces Airtable integration with Supabase for the Customer Assets and Assessment Results tables, enabling new user access to the platform.

## **MIGRATION FILES CREATED**
✅ **001_create_customer_assets.sql** - Customer data table with 32+ fields
✅ **002_create_assessment_results.sql** - Assessment tracking and competency progression  
✅ **003_create_customer_actions.sql** - Gamification and professional activity tracking
✅ **004_create_rls_policies.sql** - Row Level Security and automatic functions
✅ **005_insert_sample_data.sql** - Sample data for CUST_02 and admin users

## **SETUP INSTRUCTIONS**

### **Step 1: Run Migrations in Supabase**
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run each migration file in order:
   ```sql
   -- Copy and paste each migration file content in order:
   -- 001_create_customer_assets.sql
   -- 002_create_assessment_results.sql  
   -- 003_create_customer_actions.sql
   -- 004_create_rls_policies.sql
   -- 005_insert_sample_data.sql
   ```

### **Step 2: Update Environment Variables**
Add these to your `.env.local`:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Keep Airtable as backup during transition
AIRTABLE_API_KEY=pat5kFmJsBxfL5Yqr.f44840b8b82995ec43ac998191c43f19d0471c9550d0fea9e0327cc4f4aa4815
AIRTABLE_BASE_ID=app0jJkgTCqn46vp9
```

### **Step 3: Install Supabase Dependencies**
```bash
npm install @supabase/supabase-js
```

### **Step 4: Update Service Imports**
Replace Airtable service imports with Supabase:
```typescript
// Old
import airtableService from './airtableService';

// New  
import supabaseService from './supabaseService';
```

## **DATABASE SCHEMA OVERVIEW**

### **customer_assets Table (32+ fields)**
**Core Fields:**
- `customer_id` (Primary Key) - dru... format
- `email` (Unique) - Customer email address
- `access_token` - Authentication token
- `payment_status` - Payment verification
- `content_status` - Content generation status

**Content Storage:**
- `icp_content` (JSONB) - ICP Analysis data
- `cost_calculator_content` (JSONB) - Cost calculations
- `business_case_content` (JSONB) - Business case data

**Revolutionary Features:**
- `technical_translation_data` (JSONB) - Translation templates and history
- `stakeholder_arsenal_data` (JSONB) - Stakeholder profiles and communication templates
- `resources_library_data` (JSONB) - Generated resources and custom templates
- `gamification_state` (JSONB) - Points, achievements, milestone progress

### **assessment_results Table**
**Assessment Tracking:**
- `customer_analysis_score` - Buyer understanding competency
- `value_communication_score` - Value translation skills
- `sales_execution_score` - Sales methodology execution
- `competency_level` - Current professional level
- `assessment_type` - baseline/progress/retake/milestone

### **customer_actions Table**
**Professional Activity Tracking:**
- `action_type` - 8 professional action categories
- `points_awarded` - Gamification point system
- `impact_level` - low/medium/high/critical
- `evidence_link` - Verification documentation
- `skills_demonstrated` - Competency development tracking

## **SAMPLE DATA INCLUDED**

### **Admin User (dru78DR9789SDF862)**
- **Access**: `admin-demo-token-2025`
- **Level**: Revenue Intelligence Expert
- **Content**: Complete ICP, Cost Calculator, Business Case data
- **Actions**: 2 high-impact activities (deal closure, referral generation)

### **Test User (CUST_02)**  
- **Access**: `test-token-123456`
- **Level**: Systematic Buyer Understanding (1,850 points)
- **Content**: Comprehensive test data across all tools
- **Actions**: 3 progressive activities (meeting → demo → proposal)
- **Revolutionary Features**: Full technical translation, stakeholder arsenal, resources library data

## **AUTHENTICATION COMPATIBILITY**

### **Current URL Format Supported:**
- **Admin**: `/customer/dru78DR9789SDF862/dashboard?token=admin-demo-token-2025`
- **Test User**: `/customer/CUST_02/dashboard?token=test-token-123456`
- **New Users**: Will get `dru{timestamp}{random}` format IDs

### **Features Enabled:**
✅ **Complete Platform Access** - All tools unlocked for testing
✅ **Professional Development Tracking** - Competency progression system
✅ **Gamification System** - Points, achievements, milestone progression
✅ **Revolutionary Features** - Technical translation, stakeholder arsenal, resources library
✅ **Assessment System** - Baseline and progress assessment tracking

## **TESTING CHECKLIST**

After running migrations:

### **Database Verification:**
- [ ] `customer_assets` table created with 32+ fields
- [ ] `assessment_results` table created with assessment tracking
- [ ] `customer_actions` table created with gamification support
- [ ] Row Level Security policies active
- [ ] Sample data inserted for both test users

### **Application Testing:**
- [ ] Admin user can access dashboard: `dru78DR9789SDF862`
- [ ] Test user can access tools: `CUST_02` 
- [ ] New user registration creates Supabase records
- [ ] Assessment system records results properly
- [ ] Gamification system tracks actions and points
- [ ] All revolutionary features accessible

### **Service Integration:**
- [ ] `supabaseService.ts` handles all CRUD operations
- [ ] Authentication flow works with token validation
- [ ] Content updates save to correct JSON fields
- [ ] Assessment results record competency progression
- [ ] Action tracking updates gamification state

## **MIGRATION BENEFITS**

### **Problem Solved:**
❌ **Before**: New users couldn't access platform (missing Airtable tables)
✅ **After**: Complete Supabase schema with full feature support

### **Enhanced Capabilities:**
- **Better Performance**: Native SQL queries vs Airtable API limitations
- **Enhanced Security**: Row Level Security vs API token exposure
- **Scalability**: Supports unlimited users vs Airtable rate limits
- **Rich Data Types**: JSONB support for complex revolutionary feature data
- **Professional Development**: Complete assessment and competency tracking system

## **NEXT STEPS**
1. Run all 5 migration scripts in Supabase
2. Update environment variables
3. Test admin and test user access
4. Verify all revolutionary features work
5. Begin onboarding new users with full platform access
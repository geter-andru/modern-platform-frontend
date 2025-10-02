# Data Bridge Configuration

## Environment Variables Required

### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Airtable Configuration (for Data Bridge)
```bash
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_TABLE_NAME=your_airtable_table_name
AIRTABLE_API_KEY=your_airtable_api_key
```

### Platform Configuration
```bash
NEXT_PUBLIC_PLATFORM_URL=https://platform.andruai.com
MODERN_PLATFORM_API_URL=https://platform.andruai.com
MODERN_PLATFORM_API_KEY=your_platform_api_key
```

### Assessment Configuration
```bash
NEXT_PUBLIC_ASSESSMENT_URL=https://andru-ai.com
```

## Database Schema

### Supabase Table: `assessment_sessions`
```sql
CREATE TABLE assessment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  company_name TEXT,
  overall_score INTEGER,
  buyer_score INTEGER,
  tech_score INTEGER,
  performance_level TEXT,
  assessment_data JSONB,
  user_info JSONB,
  product_info JSONB,
  question_timings JSONB,
  generated_content JSONB,
  status TEXT DEFAULT 'completed',
  airtable_record_id TEXT,
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_assessment_sessions_session_id ON assessment_sessions(session_id);
CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_airtable_record_id ON assessment_sessions(airtable_record_id);
```

## API Endpoints

### Data Bridge Sync
- **POST** `/api/bridge/sync` - Sync data between Airtable and Supabase
- **GET** `/api/bridge/sync?sessionId={id}` - Get assessment data by session ID

### Data Bridge Assessment
- **POST** `/api/bridge/assessment` - Get assessment data with various actions
- **GET** `/api/bridge/assessment?sessionId={id}` - Get assessment by session ID

## Data Flow

1. **Assessment Completion** (andru-assessment)
   - User completes assessment
   - Data stored in Airtable
   - `syncToModernPlatform()` called

2. **Data Bridge Sync** (modern-platform)
   - Receives sync request from andru-assessment
   - Creates record in both Airtable and Supabase
   - Returns Supabase record ID

3. **Platform Redirect** (andru-assessment)
   - Redirects user to modern-platform
   - Includes session ID and bridge ID in URL

4. **Data Retrieval** (modern-platform)
   - Assessment page loads
   - Uses data bridge to get assessment data
   - Displays results using existing widgets

## Testing the Data Bridge

### 1. Test Sync Endpoint
```bash
curl -X POST https://platform.andruai.com/api/bridge/sync \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sync_all"
  }'
```

### 2. Test Assessment Retrieval
```bash
curl -X GET "https://platform.andruai.com/api/bridge/assessment?sessionId=test_session_123"
```

### 3. Test User Linking
```bash
curl -X POST https://platform.andruai.com/api/bridge/sync \
  -H "Content-Type: application/json" \
  -d '{
    "action": "link_user",
    "airtableRecordId": "rec123",
    "supabaseUserId": "user-uuid"
  }'
```

## Error Handling

The data bridge includes comprehensive error handling:
- Graceful fallbacks when Supabase is unavailable
- Retry logic for failed syncs
- Detailed error logging
- User-friendly error messages

## Monitoring

Monitor the data bridge through:
- Console logs with emoji indicators
- API response status codes
- Database sync timestamps
- Error tracking in both systems

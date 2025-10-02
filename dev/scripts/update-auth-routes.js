/**
 * Script to update remaining API routes to use standardized authentication middleware
 * This script helps automate the conversion of old auth patterns to new middleware
 */

const fs = require('fs');
const path = require('path');

// List of files that need to be updated
const filesToUpdate = [
  'app/api/behavioral-intelligence/[founderId]/route.ts',
  'app/api/customer/[customerId]/icp/route.ts',
  'app/api/orchestrator/scaling-status/[founderId]/route.ts',
  'app/api/supabase-management/route.ts',
  'app/api/orchestrator/founder-profile/route.ts',
  'app/api/orchestrator/systematic-action/route.ts',
  'app/api/orchestrator/recommendations/route.ts',
  'app/api/orchestrator/tool-usage/route.ts',
  'app/api/assessment/status/route.ts',
  'app/api/orchestrator/scaling-plan/route.ts',
  'app/api/export/assessment/route.ts'
];

// Patterns to replace
const patterns = {
  // Import statements
  imports: {
    old: /import { createServerClient } from '@supabase\/ssr';\nimport { cookies } from 'next\/headers';/g,
    new: `import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';`
  },
  
  // Function declarations
  functionDecl: {
    old: /export async function (GET|POST|PUT|DELETE)\(/g,
    new: 'export const $1 = requireAuth(async ('
  },
  
  // Authentication code block
  authBlock: {
    old: /const cookieStore = await cookies\(\);\s*const supabase = createServerClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\s*\{\s*cookies: \{\s*get\(name: string\) \{\s*return cookieStore\.get\(name\)\?\.value;\s*\},\s*\},\s*\}\);\s*const \{ data: \{ user \}, error: authError \} = await supabase\.auth\.getUser\(\);\s*if \(authError \|\| !user\) \{\s*return NextResponse\.json\(\s*\{ error: 'Unauthorized' \},\s*\{ status: 401 \}\s*\);\s*\}/g,
    new: 'const supabase = createClient();'
  },
  
  // User references
  userRef: {
    old: /user\.id/g,
    new: 'auth.user.id'
  },
  
  // Function closing
  functionClose: {
    old: /^\s*\}\s*$/gm,
    new: '});'
  }
};

function updateFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // Apply pattern replacements
    Object.entries(patterns).forEach(([name, pattern]) => {
      if (pattern.old.test(content)) {
        content = content.replace(pattern.old, pattern.new);
        updated = true;
        console.log(`✅ Updated ${name} in ${filePath}`);
      }
    });
    
    if (updated) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Successfully updated: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting authentication middleware update...\n');
  
  let updatedCount = 0;
  
  filesToUpdate.forEach(filePath => {
    if (updateFile(filePath)) {
      updatedCount++;
    }
    console.log(''); // Add spacing
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Files updated: ${updatedCount}`);
  console.log(`ℹ️  Files checked: ${filesToUpdate.length}`);
  console.log(`\n🎯 Next steps:`);
  console.log(`1. Review the updated files for any manual adjustments needed`);
  console.log(`2. Test the authentication flow`);
  console.log(`3. Check for any linting errors`);
}

if (require.main === module) {
  main();
}

module.exports = { updateFile, patterns };

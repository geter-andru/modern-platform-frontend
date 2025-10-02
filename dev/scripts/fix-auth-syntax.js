/**
 * Script to fix syntax errors in API routes after authentication middleware update
 */

const fs = require('fs');
const path = require('path');

// List of files that need syntax fixes
const filesToFix = [
  'app/api/assessment/status/route.ts',
  'app/api/export/assessment/route.ts',
  'app/api/orchestrator/founder-profile/route.ts',
  'app/api/orchestrator/recommendations/route.ts',
  'app/api/orchestrator/scaling-plan/route.ts',
  'app/api/orchestrator/systematic-action/route.ts',
  'app/api/orchestrator/tool-usage/route.ts',
  'app/api/orchestrator/scaling-status/[founderId]/route.ts',
  'app/api/supabase-management/route.ts'
];

function fixFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // Fix 1: Add missing arrow function syntax
    const arrowFunctionFix = /export const (GET|POST|PUT|DELETE) = requireAuth\(async \(request: NextRequest\) \{/g;
    if (arrowFunctionFix.test(content)) {
      content = content.replace(arrowFunctionFix, 'export const $1 = requireAuth(async (request: NextRequest, auth: AuthContext) => {');
      updated = true;
      console.log(`✅ Fixed arrow function syntax in ${filePath}`);
    }
    
    // Fix 2: Remove old authentication code
    const oldAuthCode = /const cookieStore = await cookies\(\);\s*const supabase = createServerClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\s*\{\s*cookies: \{\s*get\(name: string\) \{\s*return cookieStore\.get\(name\)\?\.value;\s*\},\s*\},\s*\}\);\s*const \{ data: \{ user \}, error: authError \} = await supabase\.auth\.getUser\(\);\s*if \(authError \|\| !user\) \{\s*return NextResponse\.json\(\s*\{ error: 'Unauthorized' \},\s*\{ status: 401 \}\s*\);\s*\}/g;
    if (oldAuthCode.test(content)) {
      content = content.replace(oldAuthCode, 'const supabase = createClient();');
      updated = true;
      console.log(`✅ Removed old auth code in ${filePath}`);
    }
    
    // Fix 3: Replace user.id with auth.user.id
    const userRefFix = /user\.id/g;
    if (userRefFix.test(content)) {
      content = content.replace(userRefFix, 'auth.user.id');
      updated = true;
      console.log(`✅ Fixed user references in ${filePath}`);
    }
    
    // Fix 4: Fix interface syntax errors
    const interfaceFix = /\}\);/g;
    if (interfaceFix.test(content)) {
      content = content.replace(interfaceFix, '};');
      updated = true;
      console.log(`✅ Fixed interface syntax in ${filePath}`);
    }
    
    // Fix 5: Fix function closing syntax
    const functionCloseFix = /^\s*\}\s*$/gm;
    if (functionCloseFix.test(content)) {
      content = content.replace(functionCloseFix, '});');
      updated = true;
      console.log(`✅ Fixed function closing in ${filePath}`);
    }
    
    if (updated) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Successfully fixed: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No fixes needed: ${filePath}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Starting syntax fixes for authentication middleware...\n');
  
  let fixedCount = 0;
  
  filesToFix.forEach(filePath => {
    if (fixFile(filePath)) {
      fixedCount++;
    }
    console.log(''); // Add spacing
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`ℹ️  Files checked: ${filesToFix.length}`);
  console.log(`\n🎯 Next steps:`);
  console.log(`1. Run npm run build to verify fixes`);
  console.log(`2. Test the authentication flow`);
  console.log(`3. Check for any remaining linting errors`);
}

if (require.main === module) {
  main();
}

module.exports = { fixFile };

#!/bin/bash
#
# Automated Research Workflow with Validation Enforcement
# Ensures ZERO fields are missed through systematic checks
#

set -e  # Exit on any error

COMPANY_FILE="/tmp/current_research_company.json"
RESEARCH_OUTPUT="/tmp/current_research_data.json"
CHECKLIST="scripts/research-checklist.json"
VALIDATOR="scripts/validate-research-complete.py"

echo "=============================================================================="
echo "🔬 AUTOMATED RESEARCH WORKFLOW"
echo "=============================================================================="

# Check if company file exists
if [ ! -f "$COMPANY_FILE" ]; then
    echo "❌ No company file found at $COMPANY_FILE"
    echo "   Run research-companies.py first to generate company file"
    exit 1
fi

# Load company data
COMPANY_NAME=$(jq -r '.company_name' "$COMPANY_FILE")
WEBSITE=$(jq -r '.website' "$COMPANY_FILE")
LINKEDIN=$(jq -r '.linkedin' "$COMPANY_FILE")

echo ""
echo "📍 Company: $COMPANY_NAME"
echo "   Website: $WEBSITE"
echo "   LinkedIn: $LINKEDIN"
echo ""

# Initialize research data structure
cat > "$RESEARCH_OUTPUT" << EOF
{
  "company_name": "$COMPANY_NAME",
  "website_product_description": "",
  "website_value_prop": "",
  "website_target_customer": "",
  "website_key_features": "",
  "website_pricing_model": "",
  "linkedin_recent_posts": "",
  "linkedin_background": "",
  "linkedin_company_description": "",
  "linkedin_personality_signals": "",
  "linkedin_hiring_signals": "",
  "linkedin_product_signals": "",
  "research_status": "in_progress",
  "research_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ Initialized research data structure"
echo ""
echo "=============================================================================="
echo "STEP 1: WEBSITE RESEARCH"
echo "=============================================================================="
echo ""
echo "📋 Required Fields (from checklist):"
echo ""

# Show website research checklist
jq -r '.research_checklist.website_research.required_fields[] | "   • \(.field)\n     What: \(.description)\n     Where: \(.where_to_find)\n"' "$CHECKLIST"

echo ""
echo "⏸️  MANUAL RESEARCH REQUIRED"
echo "   1. Visit: $WEBSITE"
echo "   2. Fill in all website fields in: $RESEARCH_OUTPUT"
echo "   3. Run validation: python3 $VALIDATOR $RESEARCH_OUTPUT"
echo "   4. Continue when validation passes"
echo ""
echo "Press ENTER when website research is complete..."
read

# Validate website research
echo ""
echo "🔍 Validating website research..."
if python3 "$VALIDATOR" "$RESEARCH_OUTPUT"; then
    echo "✅ Website research validated"
else
    echo "❌ Website research incomplete - fix issues and re-run validation"
    exit 1
fi

echo ""
echo "=============================================================================="
echo "STEP 2: LINKEDIN RESEARCH"
echo "=============================================================================="
echo ""
echo "📋 Required Fields (from checklist):"
echo ""

# Show LinkedIn research checklist
jq -r '.research_checklist.linkedin_research.required_fields[] | "   • \(.field)\n     What: \(.description)\n     Where: \(.where_to_find)\n"' "$CHECKLIST"

echo ""
echo "⏸️  MANUAL RESEARCH REQUIRED"
echo "   1. Visit: $LINKEDIN (using session cookie)"
echo "   2. Fill in all LinkedIn fields in: $RESEARCH_OUTPUT"
echo "   3. Run validation: python3 $VALIDATOR $RESEARCH_OUTPUT"
echo "   4. Continue when validation passes"
echo ""
echo "Press ENTER when LinkedIn research is complete..."
read

# Validate complete research
echo ""
echo "🔍 Validating complete research..."
if python3 "$VALIDATOR" "$RESEARCH_OUTPUT"; then
    # Update status to complete
    jq '.research_status = "complete"' "$RESEARCH_OUTPUT" > "$RESEARCH_OUTPUT.tmp"
    mv "$RESEARCH_OUTPUT.tmp" "$RESEARCH_OUTPUT"

    echo ""
    echo "=============================================================================="
    echo "✅ RESEARCH COMPLETE: $COMPANY_NAME"
    echo "=============================================================================="
    echo ""
    echo "📄 Research data saved to: $RESEARCH_OUTPUT"
    echo ""
    echo "Next: Append to enriched leads CSV"
else
    echo "❌ Research incomplete - fix issues and re-run validation"
    exit 1
fi

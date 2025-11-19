#!/usr/bin/env python3
"""
Research Validation Script - Ensures ZERO FIELDS MISSED
Enforces checklist completion before marking research as done
"""

import json
import sys

CHECKLIST_FILE = 'scripts/research-checklist.json'

# Load checklist
with open(CHECKLIST_FILE, 'r') as f:
    checklist = json.load(f)

def validate_research_data(research_data):
    """
    Validates that ALL required fields are present and meet quality standards.
    Returns: (is_valid, missing_fields, quality_issues)
    """
    missing_fields = []
    quality_issues = []

    # Check Website Research Fields
    website_required = checklist['research_checklist']['website_research']['required_fields']
    for field_spec in website_required:
        field_name = field_spec['field']
        value = research_data.get(field_name, '').strip()

        if not value:
            missing_fields.append({
                'field': field_name,
                'description': field_spec['description'],
                'where_to_find': field_spec['where_to_find']
            })
        else:
            # Check quality standard
            min_length = 20 if 'description' in field_name else 10
            if len(value) < min_length:
                quality_issues.append({
                    'field': field_name,
                    'issue': f'Too short ({len(value)} chars) - needs specific details',
                    'standard': field_spec['quality_standard'],
                    'example': field_spec['example']
                })

    # Check LinkedIn Research Fields
    linkedin_required = checklist['research_checklist']['linkedin_research']['required_fields']
    for field_spec in linkedin_required:
        field_name = field_spec['field']
        value = research_data.get(field_name, '').strip()

        if not value:
            missing_fields.append({
                'field': field_name,
                'description': field_spec['description'],
                'where_to_find': field_spec['where_to_find']
            })
        else:
            # Check quality for posts/background (should have substance)
            if 'posts' in field_name or 'background' in field_name:
                if len(value) < 30:
                    quality_issues.append({
                        'field': field_name,
                        'issue': f'Insufficient detail ({len(value)} chars)',
                        'standard': field_spec['quality_standard'],
                        'example': field_spec['example']
                    })

    is_valid = len(missing_fields) == 0 and len(quality_issues) == 0

    return is_valid, missing_fields, quality_issues

def print_validation_report(company_name, is_valid, missing_fields, quality_issues):
    """Print detailed validation report"""
    print("\n" + "=" * 80)
    print(f"RESEARCH VALIDATION: {company_name}")
    print("=" * 80)

    if is_valid:
        print("\n✅ ALL FIELDS COMPLETE - VALIDATION PASSED")
        print("   • All required website fields filled")
        print("   • All required LinkedIn fields filled")
        print("   • Quality standards met")
        return True
    else:
        print("\n❌ VALIDATION FAILED - INCOMPLETE RESEARCH")

        if missing_fields:
            print(f"\n🔴 MISSING FIELDS ({len(missing_fields)}):")
            for i, field in enumerate(missing_fields, 1):
                print(f"\n   {i}. {field['field']}")
                print(f"      What: {field['description']}")
                print(f"      Where: {field['where_to_find']}")

        if quality_issues:
            print(f"\n⚠️  QUALITY ISSUES ({len(quality_issues)}):")
            for i, issue in enumerate(quality_issues, 1):
                print(f"\n   {i}. {issue['field']}")
                print(f"      Issue: {issue['issue']}")
                print(f"      Standard: {issue['standard']}")
                print(f"      Example: {issue['example']}")

        print("\n" + "=" * 80)
        print("❌ CANNOT MARK AS COMPLETE - FIX ISSUES ABOVE")
        print("=" * 80)
        return False

def main():
    """
    Validate research data from stdin or file
    Usage: python validate-research-complete.py < research_data.json
    """
    if len(sys.argv) > 1:
        # Load from file
        with open(sys.argv[1], 'r') as f:
            research_data = json.load(f)
    else:
        # Load from stdin
        research_data = json.load(sys.stdin)

    company_name = research_data.get('company_name', 'Unknown')

    is_valid, missing_fields, quality_issues = validate_research_data(research_data)
    passed = print_validation_report(company_name, is_valid, missing_fields, quality_issues)

    # Exit code: 0 = valid, 1 = invalid
    sys.exit(0 if passed else 1)

if __name__ == '__main__':
    main()

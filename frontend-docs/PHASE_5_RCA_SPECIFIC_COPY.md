# Phase 5 RCA: Information Density - Specific Copy
**Date:** 2025-10-30  
**Component:** ICP Tool Pages - Copy & Microcopy  
**Phase:** 5 - Information Density - Specific Copy (Expert Requirement)

---

## Problem Statement

Generic, vague copy throughout ICP tool pages. Text lacks specificity and actionable guidance for technical founders. Expert audit: Replace generic with actionable, technical language.

---

## Root Cause Analysis

### 1. Symptom Identification

**Current Issues:**
- Generic placeholders (e.g., "Enter company name (e.g., TechCorp Solutions)")
- Vague descriptions ("Use this ICP to personalize your sales approach...")
- Generic pro tips ("Use this comprehensive analysis to guide...")
- "When to Use This" scenarios with generic language
- Lack of technical specificity
- Missing actionable guidance

**Expected (Expert Specification):**
- Specific, actionable copy
- Technical language appropriate for founders
- Clear next steps
- Concrete examples
- Technical precision

### 2. Root Cause Identification

**Root Cause:**
1. **Generic Placeholders:** Placeholder text uses generic examples
2. **Vague Descriptions:** Descriptions lack specificity and actionability
3. **Generic Pro Tips:** Tips are too general, not actionable
4. **Missing Technical Context:** Copy doesn't speak to technical founders

**Evidence:**
- Current: "Use this ICP to personalize your sales approach..."
- Expert: Needs specific, actionable guidance
- Current: Generic placeholders
- Expert: Needs technical, specific examples

### 3. Impact Assessment

**Functional Impact:**
- ✅ **NO FUNCTIONAL IMPACT** - Only text/copy changes
- ✅ All existing functionality preserved
- ✅ No logic changes
- ✅ No state changes

**User Impact:**
- ⚠️ Copy doesn't provide actionable guidance
- ⚠️ Technical founders need more specific language
- ⚠️ Missing clarity on next steps

### 4. Resolution Strategy

**Approach:** Replace generic copy with specific, actionable, technical language

**Changes Required:**
1. **Placeholders** (TEXT ONLY)
   - Replace generic examples with technical, specific examples
   - Make placeholders more actionable

2. **Descriptions** (TEXT ONLY)
   - Replace vague descriptions with specific, actionable guidance
   - Add technical context where appropriate

3. **Pro Tips** (TEXT ONLY)
   - Replace generic tips with specific, actionable advice
   - Focus on technical founders' needs

4. **When to Use Scenarios** (TEXT ONLY)
   - Make scenarios more specific and actionable
   - Add technical context

**Safety:**
- ✅ No logic changes
- ✅ No state changes
- ✅ No data fetching changes
- ✅ Only text/copy changes
- ✅ Only JSX text content changes

### 5. Validation Plan

**Before Changes:**
- [ ] Document current copy
- [ ] Identify all generic text
- [ ] Capture screenshots

**After Changes:**
- [ ] Copy is specific and actionable
- [ ] Technical language appropriate
- [ ] All functionality preserved
- [ ] Tests pass
- [ ] Build succeeds

### 6. Success Criteria

- ✅ Generic copy replaced with specific, actionable language
- ✅ Technical language appropriate for founders
- ✅ Clear next steps provided
- ✅ All existing functionality preserved
- ✅ Tests pass
- ✅ Build succeeds

---

## Implementation Plan

### Step 1: Replace Generic Placeholders (TEXT ONLY)
- Replace "Enter company name (e.g., TechCorp Solutions)" with specific technical example
- Replace "Describe what your product does..." with actionable guidance

### Step 2: Replace Generic Descriptions (TEXT ONLY)
- Replace "Use this ICP to personalize..." with specific, actionable guidance
- Add technical context where appropriate

### Step 3: Replace Generic Pro Tips (TEXT ONLY)
- Replace generic tips with specific, actionable advice
- Focus on technical founders' needs

### Step 4: Replace Generic Scenarios (TEXT ONLY)
- Make "When to Use This" scenarios more specific and actionable
- Add technical context

### Step 5: Validation
- Test all functionality still works
- Verify copy is specific and actionable
- Ensure technical language appropriate
- Check tests pass
- Check build succeeds

---

## Rollback Plan

If any validation fails:
1. Revert to backup branch: `git reset --hard backup/before-phase-5-specific-copy`
2. Document what went wrong
3. Review changes for accidental logic modifications
4. Fix and retry

---

## Expert Specification Reference

**Specific Copy Requirements:**
- Replace generic with actionable, technical language
- Make instructions specific and concrete
- Add technical context for founders
- Provide clear next steps
- Use technical precision

**Visual Requirements:**
- Clear, actionable guidance
- Technical language appropriate
- Specific examples
- Concrete next steps


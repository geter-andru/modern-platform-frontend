# Microcopy Philosophical Voice Guide
**Humus & Shore → Pure Signal Integration**
**Date:** November 3, 2025
**Status:** Priority 1.3 Implementation
**Purpose:** Rewrite all platform microcopy to embody and teach Humus & Shore philosophy

---

## Executive Summary

This document provides:
1. **Current vs Recommended** microcopy rewrites
2. **Voice & Tone Principles** for Humus & Shore
3. **Microcopy Patterns** for common UI scenarios
4. **Implementation Priority** by impact

**Core Philosophy:**
Every word on the platform should teach users that:
- **Humus** = Let contaminated assumptions die → transformation
- **Shore** = Build systematic infrastructure → stability
- **Pure Signal** = First-principles thinking about value delivery

---

## Voice & Tone Principles

### What Humus & Shore Voice IS:
✅ **Clear & Direct**: "Let go of customer accidents. Engineer pure signal."
✅ **Transformative**: "Your historical data must die so true understanding can grow."
✅ **Systematic**: "Repeatable methodology, not guesswork."
✅ **Confident**: "This is how revenue infrastructure works."
✅ **Educational**: Teaching philosophy through every interaction

### What Humus & Shore Voice IS NOT:
❌ **Generic SaaS**: "Get started", "Create now", "Try it free"
❌ **Vague**: "Transform your business", "Unlock potential"
❌ **Overly Cute**: "Let's do this!", "Yay! Success!"
❌ **Passive**: "You might want to...", "Consider trying..."

---

## Priority 1: Critical User Paths

### Homepage CTAs

#### Current (Generic):
```
"Join Free Beta"
"Go to Dashboard"
"See Live Demo"
```

#### Recommended (Philosophical):
```
"Start with Signal, Not Noise"
"Enter Your Revenue Intelligence Infrastructure"
"See Pure Signal in Action"
```

**Rationale:** Homepage is first impression. Must immediately teach noise → signal philosophy.

---

### ICP Tool Widget Descriptions

#### Current (Generic):
```tsx
const WIDGETS: Widget[] = [
  {
    id: 'product-details',
    title: 'Product Details',
    description: 'Core ICP analysis workflow',
    icon: Brain,
  },
  {
    id: 'rating-system',
    title: 'Rating System',
    description: 'Rate and evaluate ICP framework',
    icon: Target,
  },
  {
    id: 'personas',
    title: 'Personas',
    description: 'Generate buyer personas',
    icon: Users,
  },
  {
    id: 'overview',
    title: 'My ICP Overview',
    description: 'Summary of your ICPs',
    icon: BarChart3,
  },
  {
    id: 'rate-company',
    title: 'Rate a Company',
    description: 'Evaluate a company against your ICP',
    icon: FileText,
  }
];
```

#### Recommended (Philosophical):
```tsx
const WIDGETS: Widget[] = [
  {
    id: 'product-details',
    title: 'Product Capabilities',
    description: 'Engineer pure signal from intrinsic capabilities, not customer accidents',
    icon: Brain,
  },
  {
    id: 'rating-system',
    title: 'Value Alignment Framework',
    description: 'Measure mathematical fit between capabilities and buyer needs',
    icon: Target,
  },
  {
    id: 'personas',
    title: 'Maximum Value Buyers',
    description: 'Identify buyers who achieve maximum (not minimum) value realization',
    icon: Users,
  },
  {
    id: 'overview',
    title: 'Your Desert: Where You\'re Essential',
    description: 'See the markets where your product creates desperate need, not optional interest',
    icon: BarChart3,
  },
  {
    id: 'rate-company',
    title: 'Validate Signal Strength',
    description: 'Test if a company matches your pure signal or represents noise',
    icon: FileText,
  }
];
```

**Impact:** Every widget teaches:
- Product capabilities → Signal
- Customer accidents → Noise
- Mathematical fit → Engineering approach
- Desert metaphor → Essential vs Optional
- Value realization → Transformation outcome

---

### Export Modal

#### Current (Generic):
```
Modal Title: "Export ICP Analysis"
Headline: "Choose Export Format"
Description: "Export X buyer personas as ready-to-use sales materials"
Subtext: "Create sales materials, AI research prompts, or spreadsheet data in one click"
```

#### Recommended (Philosophical):
```
Modal Title: "Share Your Pure Signal"
Headline: "Export Your Desert Map"
Description: "Share the markets where you're essential with X engineered buyer profiles"
Subtext: "Transform your signal into sales materials, AI-powered research, or systematic prospecting data"
```

**Rationale:** Export = sharing transformation. Use "desert map" metaphor to reinforce essential vs optional positioning.

---

### Export Button Labels

#### Current (Generic):
```
"Export PDF" → "Export PDF"
"Export Markdown" → "Export Markdown"
"Export CSV" → "Export CSV"
"Export ChatGPT Prompt" → "Copy ChatGPT Prompt"
"Export Claude Prompt" → "Copy Claude Prompt"
"Export Gemini Prompt" → "Copy Gemini Prompt"
```

#### Recommended (Philosophical):
```
"Export PDF" → "Generate Signal Report (PDF)"
"Export Markdown" → "Copy to Notion (Markdown)"
"Export CSV" → "Download Systematic Data (CSV)"
"Export ChatGPT Prompt" → "Extend Research with ChatGPT"
"Export Claude Prompt" → "Deepen Analysis with Claude"
"Export Gemini Prompt" → "Amplify Insights with Gemini"
```

**Rationale:**
- "Signal Report" = not just data export
- "Systematic Data" = engineered, not raw
- "Extend/Deepen/Amplify" = AI as enhancement, not replacement

---

## Priority 2: Feedback & States

### Error Messages

#### Current (Generic):
```
"No personas available to export. Please generate your ICP first."
"Failed to export PDF. Please try again."
"No data found."
"Something went wrong."
"Invalid input."
```

#### Recommended (Philosophical):
```
"No pure signal generated yet. Engineer your ICP from product capabilities first."
"Signal report generation failed. Retry to complete transformation."
"No signal detected. Start with product capabilities to create your desert map."
"Transformation interrupted. This happens when contaminated data blocks pure signal generation."
"Invalid input detected. Pure signal requires clean, first-principles data."
```

**Pattern:** Error = obstacle to transformation. Explain WHY and teach philosophy.

---

### Loading States

#### Current (Generic):
```
"Loading..."
"Generating PDF..."
"Processing..."
"Please wait..."
"Copying to clipboard..."
```

#### Recommended (Philosophical):
```
"Engineering your pure signal..."
"Building signal report (PDF)..."
"Transforming noise into systematic intelligence..."
"Letting contaminated assumptions die, richer understanding emerging..."
"Preparing signal for export..."
```

**Pattern:** Loading = transformation in progress. Use Humus metaphor (death → growth).

---

### Success Messages

#### Current (Generic):
```
"PDF exported successfully!"
"Markdown copied to clipboard! Paste into Notion."
"CSV downloaded successfully."
"Data saved."
"Changes applied."
```

#### Recommended (Philosophical):
```
"Signal report ready! Your desert map has been exported."
"Pure signal copied to clipboard. Paste into Notion to preserve systematic intelligence."
"Systematic prospecting data downloaded. Use for engineered outreach."
"Pure signal preserved. Your revenue infrastructure is growing."
"Changes applied. Your signal clarity improves."
```

**Pattern:** Success = transformation complete + next action in philosophical language.

---

### Empty States

#### Current (Generic):
```
"No data yet. Get started by creating your first ICP."
"Nothing here. Add your first item."
"No results found."
```

#### Recommended (Philosophical):
```
"Your desert awaits discovery. Start by cataloging your product's intrinsic capabilities—not who bought, but what you built."

"No pure signal generated yet. Let go of customer accidents and build from first principles."

"No matches found. This might mean your signal is pure—these prospects represent noise, not genuine value fit."
```

**Pattern:** Empty state = opportunity to teach. Explain the philosophy of starting fresh.

---

## Priority 3: Form & Input Labels

### Common Form Fields

#### Current (Generic):
```
Label: "Company Name"
Placeholder: "Enter your company name"

Label: "Product Description"
Placeholder: "Describe your product"

Label: "Target Market"
Placeholder: "Who is your target market?"

Label: "Customer Pain Points"
Placeholder: "What problems do you solve?"
```

#### Recommended (Philosophical):
```
Label: "Your Company"
Placeholder: "The organization building revenue infrastructure"

Label: "Product Capabilities"
Placeholder: "What you built—not who bought it"

Label: "Your Desert (Where You're Essential)"
Placeholder: "Markets where your capabilities create desperate need"

Label: "Intrinsic Problem-Solution Fit"
Placeholder: "Problems your capabilities inherently solve, not pain you've heard"
```

**Pattern:** Labels teach philosophy. Placeholders provide examples of first-principles thinking.

---

### Button States & Variants

#### Current (Generic):
```
Default: "Submit"
Disabled: "Submit" (grayed out)
Loading: "Submitting..."
Success: ✓ "Submitted"

Default: "Create"
Disabled: "Create" (grayed out)
Loading: "Creating..."
Success: ✓ "Created"
```

#### Recommended (Philosophical):
```
Default: "Engineer Pure Signal"
Disabled: "Complete Capabilities First" (educational, not just grayed)
Loading: "Transforming Noise → Signal..."
Success: ✓ "Signal Generated"

Default: "Discover Your Desert"
Disabled: "Product Capabilities Required"
Loading: "Analyzing Value Fit..."
Success: ✓ "Essential Markets Identified"
```

**Pattern:** Every state teaches. Disabled = why blocked + what's needed. Loading = transformation metaphor.

---

## Microcopy Patterns Library

### Pattern 1: Action Buttons

**Format:** `[Verb] [Philosophical Object]`

✅ Good Examples:
- "Engineer Pure Signal"
- "Discover Your Desert"
- "Map Value Alignment"
- "Validate Signal Strength"
- "Build Systematic Intelligence"

❌ Bad Examples:
- "Get Started" (generic)
- "Create ICP" (technical, not philosophical)
- "Generate Report" (transactional)
- "Try Now" (weak call-to-action)

---

### Pattern 2: Educational Microcopy

**Format:** `[What Dies] → [What Grows]`

✅ Good Examples:
- "Let customer accidents die. Engineer pure signal."
- "Historical patterns → Systematic methodology"
- "Relationship noise → Mathematical value fit"
- "Guesswork → Infrastructure"
- "Optional interest → Desperate need"

---

### Pattern 3: Error Recovery Guidance

**Format:** `[What went wrong] + [Why] + [How to proceed]`

✅ Good Example:
```
"Transformation blocked by contaminated data.
Pure Signal requires clean, first-principles input about your product capabilities—not assumptions from customer accidents.
Start with what you built, not who bought."
```

❌ Bad Example:
```
"Error 500. Please try again."
```

---

### Pattern 4: Help Text / Tooltips

**Format:** `[Feature] helps you [Philosophical Outcome]`

✅ Good Examples:
- "Value Alignment Framework helps you measure mathematical fit between what you do best and who needs it most—not just who bought."
- "Signal Validation helps you distinguish desperate buyers (signal) from optional interest (noise)."
- "Desert Map shows you markets where you're essential, not just viable."

---

## Implementation Checklist

### Phase 1: Critical Path (Week 1)
- [ ] Homepage CTAs (3 locations)
- [ ] ICP Tool widget descriptions (5 widgets)
- [ ] Export modal (1 modal, 7 export options)
- [ ] Primary action buttons (10-15 buttons)

### Phase 2: Feedback States (Week 1-2)
- [ ] Error messages (15-20 messages)
- [ ] Loading states (10-15 states)
- [ ] Success messages (10-15 messages)
- [ ] Empty states (5-10 states)

### Phase 3: Forms & Inputs (Week 2)
- [ ] Form field labels (20-30 labels)
- [ ] Placeholder text (20-30 placeholders)
- [ ] Help text / tooltips (10-15 tooltips)
- [ ] Validation messages (10-15 messages)

### Phase 4: Navigation & Wayfinding (Week 2)
- [ ] Navigation menu items (5-10 items)
- [ ] Breadcrumbs (system-wide)
- [ ] Section headings (throughout platform)
- [ ] Tab labels (5-10 tabs)

---

## File Locations for Implementation

### Files Requiring Updates (Priority Order):

1. **`/app/page.tsx`** (Lines 144-146, 161-163)
   - Homepage CTAs
   - Platform status badge text

2. **`/app/icp/page.tsx`** (Lines 39-87)
   - Widget descriptions
   - Export modal title/copy
   - Button labels
   - Toast messages (lines 170-249)

3. **`/src/shared/components/ui/GradientButton.tsx`**
   - Default button text patterns

4. **`/src/shared/components/ui/FeatureCard.tsx`**
   - Feature card CTA text

5. **`/src/shared/components/icp/ICPAnalysisForm.tsx`**
   - Form labels and placeholders
   - Submit button text
   - Validation messages

6. **`/src/shared/components/icp/ICPResults.tsx`**
   - Results empty state
   - Export button labels
   - Success messages

7. **`/app/lib/constants/brand-identity.ts`**
   - Brand voice constants
   - Microcopy templates

---

## Testing Microcopy Quality

### Quality Checklist

For every piece of microcopy, ask:

1. **Does it teach Humus & Shore philosophy?**
   - ✅ Mentions transformation (death → growth)
   - ✅ Emphasizes systematic approach (Shore stability)
   - ✅ References Pure Signal concepts

2. **Does it avoid generic SaaS language?**
   - ❌ No "Get Started", "Try Now", "Sign Up"
   - ❌ No "Unlock", "Discover", "Transform" without context
   - ❌ No vague benefits without philosophical grounding

3. **Does it provide clear next action?**
   - ✅ User knows exactly what to do
   - ✅ Why they should do it (philosophical reason)
   - ✅ What transformation occurs when they do

4. **Does it maintain consistent voice?**
   - ✅ Aligns with Humus & Shore values (Empathy, Clarity, Authenticity, Focus, Accountability, Alignment)
   - ✅ Uses established metaphors (desert, signal/noise, engineering)
   - ✅ Sounds like same author wrote entire platform

---

## Examples: Before & After Comparison

### Example 1: ICP Generation Flow

**BEFORE:**
```
[Empty State]
"No ICP yet. Get started by entering your product details."

[Button]
"Generate ICP"

[Loading]
"Generating..."

[Success]
"ICP generated successfully!"
```

**AFTER:**
```
[Empty State]
"Your desert awaits discovery. Start with what you built—your product's intrinsic capabilities—not who happened to buy."

[Button]
"Engineer Pure Signal from Capabilities"

[Loading]
"Transforming noise into pure signal... Letting customer accidents die so true understanding can grow."

[Success]
"Your desert revealed! See where you're essential, not optional."
```

---

### Example 2: Export Decision Point

**BEFORE:**
```
[Modal]
"Export Options
Choose how you want to export your ICP analysis."

[Button]
"Export PDF"
[Button]
"Export CSV"
[Button]
"Copy to ChatGPT"
```

**AFTER:**
```
[Modal]
"Share Your Pure Signal
Your desert map is ready. Choose how to transform this systematic intelligence into action."

[Button]
"Generate Signal Report (PDF) → Professional presentation of your essential markets"

[Button]
"Download Systematic Data (CSV) → Engineered prospecting infrastructure"

[Button]
"Extend Research with ChatGPT → Deepen understanding with AI-powered analysis"
```

---

## Voice Variants by Context

### Executive/Strategic Contexts
**Tone:** Confident, systematic, infrastructure-focused
**Example:** "Build revenue where you're essential through systematic intelligence infrastructure."

### Tactical/Action Contexts
**Tone:** Clear, directive, transformation-focused
**Example:** "Engineer pure signal from capabilities. Let customer accidents die."

### Educational/Onboarding Contexts
**Tone:** Teaching, patient, metaphor-rich
**Example:** "Like Humus enriches soil through decay, your contaminated customer data must decompose to create the fertile ground for Pure Signal methodology."

### Error/Problem Contexts
**Tone:** Understanding, solution-oriented, philosophical
**Example:** "Transformation blocked by contaminated data. Pure Signal requires first-principles thinking—start with what you built, not who bought."

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Buzzword Bingo
**Bad:** "Leverage AI to unlock transformative insights and disrupt your market."
**Why Bad:** Generic SaaS nonsense with no philosophical grounding
**Good:** "Engineer pure signal from product capabilities using AI-powered systematic analysis."

### ❌ Anti-Pattern 2: False Confidence
**Bad:** "You're going to love this feature!"
**Why Bad:** Overpromising, sounds desperate
**Good:** "This reveals where you're essential—expect clarity, not comfort."

### ❌ Anti-Pattern 3: Passive Voice
**Bad:** "Your ICP can be generated from the product details."
**Why Bad:** Weak, academic, no agency
**Good:** "Engineer your ICP from product capabilities."

### ❌ Anti-Pattern 4: Feature-Focused
**Bad:** "Our AI analyzes 50+ data points to create buyer personas."
**Why Bad:** Focuses on mechanics, not philosophy or outcome
**Good:** "Pure Signal methodology identifies buyers who achieve maximum value realization—not just who bought before."

---

## Related Documentation

- **HUMUS_SHORE_PURE_SIGNAL_INTEGRATION.md** - Core philosophy reference
- **DESIGN_SYSTEM_PHILOSOPHICAL_AUDIT.md** - Full audit with implementation roadmap
- **LAYER_2_POSITIONING_ADDED.md** - Layer 1 (sophistication) + Layer 2 (simplicity) messaging approach
- **ABOUT_THE_FOUNDER.md** - Brandon's desert philosophy origin story

---

**Last Updated:** November 3, 2025
**Status:** ✅ Guide Complete - Ready for Implementation
**Owner:** Senior Product Designer
**Next Step:** Begin Phase 1 implementation (Homepage CTAs + ICP Tool widgets)

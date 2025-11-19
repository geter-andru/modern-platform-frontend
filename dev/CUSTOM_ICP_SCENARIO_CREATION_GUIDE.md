# Custom ICP Scenario Creation Guide

## Overview

This guide documents the complete end-to-end process for creating custom ICP scenarios for founder outreach campaigns. The workflow has been proven across 20 scenarios (2 batches of 10) with high-quality, personalized content.

## Table of Contents

1. [Input Data & Campaign Structure](#input-data--campaign-structure)
2. [Research Process](#research-process)
3. [Scenario Creation Standards](#scenario-creation-standards)
4. [Technical Implementation](#technical-implementation)
5. [Email Campaign Execution](#email-campaign-execution)
6. [Quality Checklist](#quality-checklist)

---

## Input Data & Campaign Structure

### Source File
- **Location**: `data/MATCHED_LEADS_FOR_CAMPAIGN.csv`
- **Total Leads**: 60 (rows 2-61, header in row 1)
- **Batch Size**: 10 leads per batch
- **Total Batches**: 6

### Campaign Batches

| Batch | Rows   | Status | Companies |
|-------|--------|--------|-----------|
| 1     | 2-11   | ✅ Sent | ANAFLASH through D3 |
| 2     | 12-21  | ✅ Sent | DOSS through Leapfin |
| 3     | 22-31  | ⏳ Pending | Next batch |
| 4     | 32-41  | ⏳ Pending | |
| 5     | 42-51  | ⏳ Pending | |
| 6     | 52-61  | ⏳ Pending | |

### CSV Structure
```csv
Company Name,Company Slug,Founder Name,Founder Title,Email,LinkedIn,Notes
DOSS.COM,doss,Arnav Mishra,Co-Founder CTO,arnav@doss.com,https://linkedin.com/in/...,
```

---

## Research Process

### Step 1: Read Batch Data from CSV

For batch 3 (rows 22-31):
```bash
cat data/MATCHED_LEADS_FOR_CAMPAIGN.csv | tail -n +22 | head -10
```

### Step 2: Deep Company Research

For each company, gather:

#### A. Product/Service Understanding
- **Primary offering**: What problem do they solve?
- **Target market**: Who are their customers?
- **Technology stack**: What technology do they use/provide?
- **Unique value prop**: What makes them different?

**Research Sources:**
- Company website (homepage, about, product pages)
- LinkedIn company page  
- Crunchbase/PitchBook
- Tech blogs/press releases
- Y Combinator company page (if applicable)

**Example Research:**
```
WebSearch query: "DOSS.COM manufacturing operations what do they do"
WebFetch: https://doss.com (homepage, product pages)
```

#### B. Persona Identification

**Common B2B SaaS Personas:**
- **VP Operations**: Process efficiency, system integration
- **CTO**: Technical infrastructure, modernization
- **COO**: Operational scaling, compliance
- **Controller/CFO**: Financial operations, close processes
- **VP Product**: Product development, customer feedback
- **Managing Partner**: Professional services, client delivery

**Persona Selection Criteria:**
1. Who has the pain point this company solves?
2. What role would be "in crisis" without this solution?
3. Match to founder's likely industry connections

#### C. Crisis Scenario Research

**Find the "moment of crisis" where the company's solution is critical:**

- **Regulatory deadline**: SOC 2 audit, FDA compliance, financial reporting
- **Revenue risk**: Customer contract at risk, pipeline loss
- **Operational breakdown**: Process failures, team burnout
- **Competitive pressure**: Falling behind competitors
- **Scaling crisis**: Manual process can't handle growth

**Research Approach:**
- Read case studies on company website
- Identify industry-specific pain points
- Look for metrics/stats showing crisis severity
- Find real-world examples of "what happens without this tool"


---

## Scenario Creation Standards

### Scenario JSON Structure

```json
{
  "company": "Company Name",
  "slug": "company-slug",
  "title": "Persona Avoiding the [Specific Crisis]",
  "persona": "Job Title",
  "scenario": "Opening paragraph with specific crisis context",
  "worstCase": "What happens if crisis isn't resolved",
  "timestamps": [
    {
      "time": "8:47 AM - The Crisis Point",
      "narrative": "Detailed crisis description with specific metrics",
      "thinking": "Internal analysis of root causes and constraints",
      "feeling": "Specific emotional state tied to stakes",
      "action": "",
      "momentOfValue": ""
    },
    {
      "time": "10:23 AM - The Discovery",
      "narrative": "How they find the solution",
      "thinking": "Evaluation of the solution's fit",
      "feeling": "Cautious optimism",
      "action": "Specific steps to try the solution",
      "momentOfValue": ""
    },
    {
      "time": "X Months Later - The Transformation",
      "narrative": "Complete before/after with metrics",
      "thinking": "Strategic value realized",
      "feeling": "Relief and satisfaction",
      "action": "Next steps and expansion",
      "momentOfValue": "Complete summary with all metrics"
    }
  ]
}
```

### Writing Standards: "Surgical" Approach

#### 1. Specificity Over Generic

❌ **Bad**: "The company needs better software to manage operations."

✅ **Good**: "It's 8:47 AM on Tuesday, and Marcus, CTO of a $340M regional bank with 1.2M customer accounts, walks into an emergency executive meeting. The agenda: 'Core banking system migration timeline and cost overrun.' Original estimate: $8.2M and 24 months. Current status at month 18: $14.7M spent, only 42% complete, projected final cost: $22-26M."

**Key specificity elements:**
- Exact time (8:47 AM on Tuesday)
- Named protagonist with full context (Marcus, CTO, $340M bank, 1.2M accounts)
- Precise metrics ($8.2M vs $22-26M, 42% complete, month 18)
- Specific meeting context (emergency executive meeting with clear agenda)

#### 2. Crisis Narrative Arc

**Timestamp 1 - The Crisis (Early Morning)**

Show the protagonist in the middle of an urgent crisis.

**Required elements:**
- Specific time (creates urgency)
- Protagonist details (title, company size, context)
- Quantified problem (hours, dollars, risk)
- Deadline or constraint
- What they've already tried

**Example:**
```
It's 6:18 AM on the 3rd business day of the month, and Sarah, Controller at a 
$180M ARR SaaS company with 12,400 customers across 47 countries, is already 
at her desk staring at the month-end close dashboard. Day 3 of a target 5-day 
close. Progress: revenue recognition complete for 34% of customer contracts 
(4,200 of 12,400), projected completion at current pace: 11 days (6 days past 
deadline).
```

**Timestamp 2 - The Discovery (Mid-Day)**

Protagonist searches and finds the solution.

**Required elements:**
- Search query showing desperation
- Landing page discovery moment
- Specific features that match their pain
- Skepticism balanced with hope
- Decision to try with questions

**Example:**
```
Sarah searches during a 10-minute coffee break: 'SaaS revenue recognition 
automation ASC 606 fast close.' Then she sees: 'Leapfin - AI-Powered Revenue 
Recognition & Reconciliation. Automate 70% of accounting work. Close in 5 
days, not weeks.' The customer testimonial jumps out: 'Close took 90 days. 
Now we close in 5.'
```

**Timestamp 3 - The Transformation (Months Later)**

Complete before/after with quantified results.

**Required elements:**
- Specific timeframe (4 months later, 13 months later)
- Completion of what was failing before
- Detailed metrics comparison
- Team/operational impact
- Strategic value unlocked

**Example:**
```
4 months later - Month-End Close Day 4 (Early Completion)

Sarah walks into the office at 8:30 AM. No 6 AM arrival. No overnight session. 
Leapfin dashboard shows: 100% complete (12,847 contracts processed overnight). 
Close time reduced 64% (11 days to 4 days), accounting hours reduced 74% (680 
to 180 monthly), edge cases reduced 86% (280 to 38), team turnover: 18% to 0%.
```

#### 3. Metrics Requirements

Every scenario MUST include:

**Crisis Metrics:**
- Time pressure (days/hours until deadline)
- Financial impact ($ at risk, $ over budget)
- Scale (number of transactions, customers, records)
- Team impact (hours worked, people burning out)

**Transformation Metrics:**
- % time reduction
- % cost savings  
- % accuracy improvement
- Hours saved per period
- Revenue protected/gained

**Example Before/After:**
```
Before:
- Close time: 11 days
- Team hours: 680 monthly
- Edge cases: 280 monthly
- Burnout: 70+ hour weeks, 18% turnover

After:
- Close time: 4 days (64% reduction)
- Team hours: 180 monthly (74% reduction)
- Edge cases: 38 monthly (86% reduction)
- Turnover: 0% (sustainable pace)
```

#### 4. "Thinking" Section Standards

Captures internal analysis. Must include:

- **Problem diagnosis**: Why is this happening?
- **Root cause**: Underlying systemic issue
- **Failed solutions**: What they've tried
- **Constraints**: Why obvious solutions don't work
- **Stakes**: What happens if unsolved

**Example:**
```
"We're trapped in the classic legacy modernization nightmare: the COBOL 
system works perfectly (processed billions over 25 years), but it's impossible 
to modify and we're losing COBOL developers to retirement. The migration 
seemed straightforward—'just' rewrite the logic. Reality: every module reveals 
hidden complexity, undocumented edge cases, and business rules that made sense 
in 1998 but are incomprehensible today."
```

#### 5. "Feeling" Section Standards

Emotional state must be:
- **Specific** (not "stressed" but "crushing pressure of...")
- **Multi-layered** (2-3 different emotions)
- **Tied to consequences** (why it matters emotionally)

❌ **Bad**: "Feeling stressed and worried."

✅ **Good**: "The crushing pressure of an impossible timeline (14 months to 
complete 58% of work that took 18 months to do 42%), combined with existential 
dread of regulatory enforcement, financial stress of budget overruns from $8.2M 
to $26M, and competitive anxiety from 3-year feature freeze while competitors 
innovate."

#### 6. "Moment of Value" (Final Timestamp Only)

Comprehensive one-paragraph summary of complete transformation.

**Required elements:**
1. Company/product name
2. Specific capabilities used
3. Before metrics
4. After metrics  
5. % improvements
6. Timeline
7. Strategic outcome

**Format:**
```
"[Company]'s [feature] transformed [failing process with metrics] into 
[successful outcome with metrics]—reducing [X] by Y%, [A] by B%, while 
[benefit], enabling [strategic outcome] without [previous constraint]."
```

**Example:**
```
"Leapfin's AI-powered revenue recognition automation transformed a failing 
month-end close (11+ days, 680 hours, 70-hour weeks, 12,400 contracts in 
Excel) into a 4-day automated close with 180 hours at sustainable pace—
reducing close time 64%, hours 74%, edge cases 86% while scaling from 12,400 
to 12,847 customers, eliminating burnout (18% to 0% turnover), achieving SOC 1 
compliance, and enabling $180M to $500M ARR growth without proportional 
headcount."
```


---

## Technical Implementation

### Step 1: Create Individual Scenario Files

Save each scenario to `/tmp/batch[N]_[slug]_scenario.json`

```bash
# Example for batch 3, company "acme"
/tmp/batch3_acme_scenario.json
```

**Why individual files:**
- Easier to debug JSON errors
- Review each before combining
- Version control friendly

### Step 2: Add Scenarios to scenarios.json

#### Method 1: Python (Recommended)

```python
import json

# Read existing scenarios
with open('data/scenarios.json', 'r') as f:
    scenarios = json.load(f)

# Add each new scenario
new_files = [
    '/tmp/batch3_acme_scenario.json',
    '/tmp/batch3_other_scenario.json',
    # ... all 10
]

for filepath in new_files:
    with open(filepath, 'r') as f:
        scenario = json.load(f)
        scenarios.append(scenario)

# Write updated file
with open('data/scenarios.json', 'w') as f:
    json.dump(scenarios, f, indent=2)

print(f"Total scenarios: {len(scenarios)}")
```

#### Method 2: jq (Alternative)

```bash
# Combine all batch 3 scenarios
jq -s '.[0] + .[1]' data/scenarios.json /tmp/batch3_combined.json > \
  /tmp/scenarios_updated.json
cp /tmp/scenarios_updated.json data/scenarios.json
```

**⚠️ Common Error: Control Characters**

If you see:
```
jq: parse error: Invalid string: control characters from U+0000 
through U+001F must be escaped
```

**Solutions:**
1. Replace em-dashes (—) with hyphens (-)
2. Replace curly quotes (" ") with straight quotes (" ")
3. Use Python method instead (more forgiving)

### Step 3: Verify Scenario Count

```bash
# Count total scenarios
cat data/scenarios.json | jq '. | length'

# Should increase by 10 after each batch:
# Batch 1: 102 → 112
# Batch 2: 112 → 122
# Batch 3: 122 → 132
```

### Step 4: Git Commit & Deploy

```bash
# Stage changes
git add data/scenarios.json

# Commit with descriptive message
git commit -m "feat: Add 10 custom ICP scenarios for batch 3

- Companies: [list company names]
- Rows: 22-31 from MATCHED_LEADS_FOR_CAMPAIGN.csv
- Total scenarios: 132 (was 122)
- Deep research applied to each
- Surgical narrative approach"

# Push to trigger Netlify deployment
git push frontend HEAD:main
```

### Step 5: Wait for Deployment

```bash
# Wait 3 minutes for Netlify build
echo "Waiting for Netlify deployment..."
sleep 180
```

### Step 6: Verify Deployment

Create verification script `/tmp/verify_batch3_scenarios.sh`:

```bash
#!/bin/bash
echo "Testing batch 3 scenario deployment..."
echo "======================================"

scenarios=(
  "acme:Acme Corp"
  "other:Other Company"
  # ... add all 10
)

for scenario in "${scenarios[@]}"; do
  IFS=':' read -r slug name <<< "$scenario"
  echo -n "$name ($slug): "
  
  response=$(curl -s "https://platform.andru-ai.com/icp/$slug")
  
  if echo "$response" | grep -qi "$name"; then
    echo "✅"
  else
    echo "❌"
  fi
done

echo ""
echo "Verification complete!"
```

Run verification:
```bash
chmod +x /tmp/verify_batch3_scenarios.sh
/tmp/verify_batch3_scenarios.sh
```

**Expected output:**
```
Acme Corp (acme): ✅
Other Company (other): ✅
...
Verification complete!
```


---

## Email Campaign Execution

### Step 1: Prepare Email Data

Create `/tmp/batch3_emails.json`:

```json
[
  {
    "company": "Acme Corp",
    "founder_name": "Jane Smith",
    "founder_title": "Co-Founder, CEO",
    "email": "jane@acme.com",
    "scenario_slug": "acme",
    "icp_url": "https://platform.andru-ai.com/icp/acme",
    "first_name": "Jane"
  }
  // ... 9 more companies
]
```

### Step 2: Email Template (CORRECTED VERSION)

**⚠️ Use this template for Batches 3-6:**

```
Subject: Built this for {Company}

{FirstName},

I built something specifically for {Company}.

{ICP_URL}

Did we nail it?

Brandon
```

**❌ DO NOT USE (Batches 1-2 had error):**
```
I built something for {Company} founders specifically.
```
*Grammatically incorrect when addressing single founder*

### Step 3: Send Emails via Google Workspace MCP

Send all 10 emails in parallel using Claude Code:

```
# Example for first company
mcp__google-workspace__send_gmail_message:
  user_google_email: geter@humusnshore.org
  to: jane@acme.com
  subject: Built this for Acme Corp
  body: |
    Jane,
    
    I built something specifically for Acme Corp.
    
    https://platform.andru-ai.com/icp/acme
    
    Did we nail it?
    
    Brandon
```

Repeat for all 10 companies in a single parallel call.

**Email checklist before sending:**
- [ ] All 10 scenarios deployed and verified live
- [ ] Email data JSON created with correct info
- [ ] Using CORRECTED template (not "founders" version)
- [ ] First names extracted correctly
- [ ] ICP URLs match scenario slugs
- [ ] Company names match exactly

### Step 4: Update Google Sheet Tracker

After emails sent successfully:

**Spreadsheet**: "Founder Outreach Campaign Tracker - Nov 2025"
**ID**: `1f92UXFvzjlcWdpcsvJitxuXtQ8h_QtSvId0jJmU86iM`

Update for rows corresponding to batch (e.g., rows 22-31 for batch 3):

```
Column H (Status): "Email 1 Sent"
Column I (Email 1 Sent): Today's date (YYYY-MM-DD)
```

Use `mcp__google-workspace__modify_sheet_values` to update.

---

## Quality Checklist

### Before Starting Batch

- [ ] Read correct rows from CSV (verify row numbers)
- [ ] Understand the batch number and which companies
- [ ] Have /tmp directory ready for scenario files
- [ ] Review email template (use corrected version)

### During Research (Per Company)

- [ ] WebSearch for company overview
- [ ] WebFetch company homepage
- [ ] Understand product/service clearly
- [ ] Identify correct persona (matches pain point)
- [ ] Find specific crisis scenario (not generic)
- [ ] Gather metrics for crisis severity
- [ ] Research company's solution benefits

### During Scenario Creation (Per Company)

- [ ] Specific time in timestamp 1 (e.g., "6:18 AM")
- [ ] Named protagonist with full context
- [ ] Quantified crisis (dollars, hours, risk)
- [ ] Deadline or constraint explained
- [ ] Search query in timestamp 2
- [ ] Product features match protagonist's pain
- [ ] Before/after metrics in timestamp 3
- [ ] "Moment of value" paragraph complete
- [ ] All metrics are specific numbers (not ranges)
- [ ] Narrative flows chronologically
- [ ] No generic business jargon
- [ ] Save to /tmp/batch[N]_[slug]_scenario.json

### Before Deployment

- [ ] All 10 scenarios created
- [ ] JSON valid (test with `jq` or Python)
- [ ] No control characters or encoding issues
- [ ] Scenarios added to scenarios.json
- [ ] Total count increased by 10
- [ ] Git commit with descriptive message

### Before Sending Emails

- [ ] All scenarios deployed to Netlify
- [ ] All 10 URLs verified live
- [ ] Email data JSON created
- [ ] Using CORRECTED template
- [ ] First names correct
- [ ] Company names match exactly
- [ ] ICP URLs match slugs

### After Sending Emails

- [ ] All 10 emails sent successfully
- [ ] Google Sheet tracker updated
- [ ] Document any bounces or errors
- [ ] Save email data for records

---

## Common Issues & Solutions

### Issue 1: JSON Control Character Error

**Error**: `control characters from U+0000 through U+001F must be escaped`

**Solution**:
- Use Python instead of jq
- Replace em-dashes with regular dashes
- Replace curly quotes with straight quotes
- Or create simplified version without special characters

### Issue 2: Scenario Not Found After Deployment

**Possible causes**:
- Netlify build still in progress (wait full 3 minutes)
- Slug mismatch (check scenarios.json slug matches URL)
- Build error (check Netlify deployment logs)

**Solution**:
```bash
# Wait longer
sleep 180

# Verify slug in scenarios.json
cat data/scenarios.json | jq '.[] | select(.company == "Acme Corp") | .slug'

# Check if it matches URL
curl -s https://platform.andru-ai.com/icp/[slug] | grep -i "acme"
```

### Issue 3: Generic/Weak Scenario

**Symptoms**:
- Crisis doesn't feel urgent
- Protagonist not well-defined
- Metrics missing or vague
- Transformation not compelling

**Solution**: Re-research with focus on:
- Specific moment in time crisis occurs
- Real-world example of this pain point
- Industry-specific metrics and benchmarks
- Before/after comparison with exact numbers

### Issue 4: Email Template Error

**Error**: Used "founders" version instead of corrected template

**Solution**: 
- Don't send follow-up corrections
- Fix template for next batch
- Document in session notes

---

## Example: Complete Batch 3 Workflow

```bash
# 1. Read batch 3 data
cat data/MATCHED_LEADS_FOR_CAMPAIGN.csv | tail -n +22 | head -10

# 2. Research each company (10x WebSearch + WebFetch)

# 3. Create 10 scenarios in /tmp/batch3_*.json

# 4. Combine into scenarios.json
python3 << 'EOF'
import json

with open('data/scenarios.json', 'r') as f:
    scenarios = json.load(f)

batch3_files = [
    '/tmp/batch3_acme_scenario.json',
    # ... 9 more
]

for filepath in batch3_files:
    with open(filepath, 'r') as f:
        scenarios.append(json.load(f))

with open('data/scenarios.json', 'w') as f:
    json.dump(scenarios, f, indent=2)

print(f"Total: {len(scenarios)}")
EOF

# 5. Deploy
git add data/scenarios.json
git commit -m "feat: Add batch 3 custom scenarios (132 total)"
git push frontend HEAD:main

# 6. Wait and verify
sleep 180
/tmp/verify_batch3_scenarios.sh

# 7. Send emails (all 10 in parallel via Claude Code MCP)

# 8. Update tracker
# Use Google Workspace MCP to update sheet rows 22-31
```

---

## Reference Files

- **Campaign source**: `data/MATCHED_LEADS_FOR_CAMPAIGN.csv`
- **Scenarios data**: `data/scenarios.json`
- **Email template**: `/tmp/CORRECTED_EMAIL_TEMPLATE.md`
- **Tracking sheet**: Google Sheet ID `1f92UXFvzjlcWdpcsvJitxuXtQ8h_QtSvId0jJmU86iM`

---

## Batch Progress Tracking

| Batch | Rows   | Companies | Research | Scenarios | Deployed | Emails | Updated |
|-------|--------|-----------|----------|-----------|----------|--------|---------|
| 1     | 2-11   | 10        | ✅       | ✅        | ✅       | ✅     | ✅      |
| 2     | 12-21  | 10        | ✅       | ✅        | ✅       | ✅     | ⏳      |
| 3     | 22-31  | 10        | ⏳       | ⏳        | ⏳       | ⏳     | ⏳      |
| 4     | 32-41  | 10        | ⏳       | ⏳        | ⏳       | ⏳     | ⏳      |
| 5     | 42-51  | 10        | ⏳       | ⏳        | ⏳       | ⏳     | ⏳      |
| 6     | 52-61  | 10        | ⏳       | ⏳        | ⏳       | ⏳     | ⏳      |

**Total**: 60 leads across 6 batches

---

*Guide created: 2025-11-18*
*Last updated: 2025-11-18*
*Proven workflow across batches 1-2 (20 scenarios, 20 emails sent)*


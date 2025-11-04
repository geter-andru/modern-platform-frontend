-- ============================================================================
-- TEST ASSESSMENT TOKEN
-- ============================================================================
-- Run this in Supabase SQL Editor to create a test assessment token
-- Then navigate to: http://localhost:3000/assessment?token=12345678-1234-4123-8123-123456789abc
-- ============================================================================

INSERT INTO public.assessment_tokens (
  token,
  assessment_data,
  expires_at,
  source
) VALUES (
  '12345678-1234-4123-8123-123456789abc'::uuid,
  '{
    "overall": {
      "score": 85,
      "level": "advanced",
      "percentile": 82
    },
    "categories": {
      "buyer-understanding": {
        "score": 78,
        "weight": "60%"
      },
      "tech-to-value": {
        "score": 92,
        "weight": "40%"
      }
    },
    "insights": [
      "Strong technical foundation but underutilized in buyer conversations",
      "Messaging clarity at 85% - above industry average",
      "Deep understanding of technical features",
      "Room for improvement in translating features to business value"
    ],
    "challenges": {
      "challenges": [
        {
          "id": "buyer_conversations",
          "category": "Buyer Understanding",
          "severity": "High",
          "title": "Difficulty with Enterprise Buyer Conversations",
          "description": "You struggle to have productive conversations with enterprise buyers about their business challenges. This limits your ability to position your product as a solution to their pain points.",
          "impact": "Lost deals due to inability to connect technical features to business outcomes",
          "evidence": ["Conversation confidence: 3/10", "Objection handling: Unpredictable", "Stakeholder awareness: Limited"]
        },
        {
          "id": "value_articulation",
          "category": "Tech-to-Value Translation",
          "severity": "Medium",
          "title": "Inconsistent Value Articulation",
          "description": "While you understand your technical features deeply, you struggle to consistently articulate their business value in terms buyers care about.",
          "impact": "Longer sales cycles and reduced win rates",
          "evidence": ["Value prop clarity: 6/10", "ROI discussion frequency: Low"]
        },
        {
          "id": "stakeholder_mapping",
          "category": "Buyer Understanding",
          "severity": "Critical",
          "title": "Limited Stakeholder Mapping",
          "description": "You focus primarily on technical champions but struggle to identify and engage economic buyers and other key decision makers.",
          "impact": "Deals stall in late stages when you haven''t built relationships with true decision makers",
          "evidence": ["C-level engagement: Minimal", "Multi-threaded deals: 2/10"]
        }
      ],
      "summary": {
        "totalChallenges": 3,
        "criticalChallenges": 1,
        "highChallenges": 1,
        "overallRisk": "High",
        "focusArea": "Buyer Understanding",
        "description": "3 optimization opportunities identified with focus on stakeholder engagement and value communication"
      }
    },
    "recommendations": [
      {
        "id": "buyer_framework",
        "category": "Buyer Understanding",
        "priority": "High",
        "title": "Enterprise Buyer Psychology Framework",
        "description": "Master the systematic approach to understanding how enterprise buyers think, make decisions, and evaluate vendors.",
        "benefits": [
          "Predict buyer objections before they happen",
          "Identify key stakeholders and their motivations",
          "Navigate complex buying processes with confidence"
        ],
        "implementation": "15-minute framework setup + 3 practice scenarios",
        "timeToImpact": "1-2 weeks"
      },
      {
        "id": "value_translation",
        "category": "Tech-to-Value Translation",
        "priority": "Medium",
        "title": "Feature-to-Value Translation Template",
        "description": "Learn to systematically translate technical features into business outcomes that resonate with different stakeholder types.",
        "benefits": [
          "Shorten sales cycles by 30%",
          "Increase proposal acceptance rates",
          "Build stronger executive relationships"
        ],
        "implementation": "Complete ICP analysis + stakeholder mapping",
        "timeToImpact": "2-3 weeks"
      },
      {
        "id": "stakeholder_strategy",
        "category": "Buyer Understanding",
        "priority": "High",
        "title": "Multi-Threading Strategy",
        "description": "Develop relationships across the entire buying committee, not just your technical champion.",
        "benefits": [
          "Reduce deal risk by 60%",
          "Accelerate decision-making timelines",
          "Gain early access to budget discussions"
        ],
        "implementation": "Stakeholder mapping template + outreach playbook",
        "timeToImpact": "1 week"
      }
    ],
    "userInfo": {
      "company": "Test SaaS Company",
      "email": "test@example.com",
      "name": "Test User"
    },
    "productInfo": {
      "name": "CloudSync Pro",
      "description": "Enterprise data synchronization platform"
    }
  }'::jsonb,
  NOW() + INTERVAL '7 days',
  'test_data'
)
RETURNING token, expires_at;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running the above, verify the token was created:

SELECT
  token,
  expires_at,
  created_at,
  is_used,
  assessment_data->>'overall' as overall_info
FROM public.assessment_tokens
WHERE token = '12345678-1234-4123-8123-123456789abc';

-- ============================================================================
-- TEST URL
-- ============================================================================
-- Navigate to this URL in your browser:
-- http://localhost:3000/assessment?token=12345678-1234-4123-8123-123456789abc
-- ============================================================================

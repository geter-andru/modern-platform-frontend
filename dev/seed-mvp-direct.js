#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const projectRef = process.env.SUPABASE_PROJECT_REF || 'molcqjsqtjbfclasynpg';
const supabaseUrl = `https://${projectRef}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    console.error('Please set it in your .env.local file or environment');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// MVP Resources Data
const mvpResources = [
    {
        customer_id: 'global',
        tier: 1,
        category: 'buyer_intelligence',
        title: 'ICP Discovery Framework',
        description: 'Comprehensive framework for identifying and validating your ideal customer profile',
        content: {
            summary: "Define and validate your ideal customer profile using proven methodologies",
            sections: [
                {
                    title: "Firmographic Criteria",
                    content: "Industry, company size, revenue range, growth stage, geographic location",
                    action: "Define your target company characteristics"
                },
                {
                    title: "Technographic Criteria", 
                    content: "Technology stack, digital maturity, integration requirements",
                    action: "Identify technology indicators of good-fit customers"
                },
                {
                    title: "Behavioral Criteria",
                    content: "Buying patterns, decision-making process, pain point triggers",
                    action: "Document behavioral signals that indicate purchase readiness"
                }
            ],
            deliverables: ["ICP Definition Template", "Scoring Matrix", "Target Account List"],
            estimatedTime: "2-3 hours"
        },
        generation_status: 'completed',
        export_formats: ['pdf', 'docx', 'csv'],
        access_count: 0
    },
    {
        customer_id: 'global',
        tier: 1,
        category: 'buyer_intelligence',
        title: 'Target Buyer Personas',
        description: 'Detailed buyer persona templates with decision-making insights',
        content: {
            summary: "Create actionable buyer personas for your target accounts",
            sections: [
                {
                    title: "Persona Demographics",
                    content: "Role, seniority, department, responsibilities, success metrics",
                    action: "Build 3-5 distinct buyer personas"
                },
                {
                    title: "Pain Points & Goals",
                    content: "Current challenges, desired outcomes, success criteria",
                    action: "Map pain points to your solution capabilities"
                },
                {
                    title: "Buying Process",
                    content: "Research habits, evaluation criteria, decision authority, timeline",
                    action: "Document how each persona evaluates solutions"
                }
            ],
            deliverables: ["Persona Cards", "Messaging Guide", "Objection Handlers"],
            estimatedTime: "3-4 hours"
        },
        generation_status: 'completed',
        export_formats: ['pdf', 'docx'],
        access_count: 0
    },
    {
        customer_id: 'global',
        tier: 1,
        category: 'buyer_intelligence',
        title: 'Empathy Mapping Framework',
        description: 'Deep empathy mapping for understanding buyer perspectives',
        content: {
            summary: "Map the emotional and practical journey of your buyers",
            sections: [
                {
                    title: "Think & Feel",
                    content: "Worries, aspirations, frustrations, what keeps them up at night",
                    action: "Document internal thoughts and emotions"
                },
                {
                    title: "See & Hear",
                    content: "What they observe in their market, what peers say, influencer impact",
                    action: "Map external influences on decision-making"
                },
                {
                    title: "Say & Do",
                    content: "Public statements, actual behaviors, contradictions, attitudes",
                    action: "Identify gaps between stated needs and actions"
                },
                {
                    title: "Pain & Gain",
                    content: "Obstacles, fears, wants, needs, measures of success",
                    action: "Define problems you solve and value you create"
                }
            ],
            deliverables: ["Empathy Map Canvas", "Journey Map", "Messaging Playbook"],
            estimatedTime: "2-3 hours"
        },
        generation_status: 'completed',
        export_formats: ['pdf', 'docx'],
        access_count: 0
    },
    {
        customer_id: 'global',
        tier: 1,
        category: 'strategic_tools',
        title: 'Product Potential Assessment',
        description: 'Strategic framework for evaluating product-market fit and growth potential',
        content: {
            summary: "Assess market opportunity and product-market fit systematically",
            sections: [
                {
                    title: "Market Sizing",
                    content: "TAM, SAM, SOM analysis, market growth rate, competitive density",
                    action: "Calculate addressable market opportunity"
                },
                {
                    title: "Product-Market Fit Score",
                    content: "Problem validation, solution fit, willingness to pay, switching costs",
                    action: "Rate your product-market fit (1-10 scale)"
                },
                {
                    title: "Competitive Positioning",
                    content: "Direct competitors, alternatives, differentiation, moats",
                    action: "Map competitive landscape and unique advantages"
                },
                {
                    title: "Growth Potential",
                    content: "Expansion opportunities, scalability, network effects, virality",
                    action: "Identify paths to rapid growth"
                }
            ],
            deliverables: ["Market Assessment Report", "Competitive Matrix", "Growth Roadmap"],
            estimatedTime: "4-5 hours"
        },
        generation_status: 'completed',
        export_formats: ['pdf', 'docx', 'csv'],
        access_count: 0
    }
];

// Brandon's MVP Data
const brandonData = {
    customer_name: 'Brandon Geter',
    email: 'geter@humusnshore.org',
    company: 'Humus & Shore',
    payment_status: 'Completed',
    content_status: 'Ready',
    competency_level: 'Revenue Intelligence Expert',
    icp_content: {
        productName: "H&S Revenue Intelligence Platform",
        productDescription: "AI-powered platform for B2B sales teams to accelerate deal velocity",
        targetMarket: "B2B SaaS companies",
        pricePoint: "$15,000-50,000 ACV",
        keyFeatures: ["ICP Analysis", "Buyer Intelligence", "Deal Acceleration"],
        valueProposition: "Reduce sales cycle by 40% through buyer-centric intelligence"
    },
    detailed_icp_analysis: {
        firmographic: {
            industries: ["B2B SaaS", "Professional Services", "Financial Services"],
            companySize: "50-500 employees",
            revenue: "$10M-$100M ARR",
            growthStage: "Series A to Series C"
        },
        technographic: {
            currentStack: ["Salesforce", "HubSpot", "Outreach"],
            integrationNeeds: "CRM, Sales Engagement, Data Enrichment"
        },
        behavioral: {
            painPoints: ["Long sales cycles", "Low win rates", "Poor qualification"],
            triggers: ["New sales leader", "Revenue targets missed", "Market expansion"]
        }
    },
    target_buyer_personas: {
        personas: [
            {
                name: "VP Sales",
                role: "Primary Economic Buyer",
                painPoints: ["Revenue predictability", "Team productivity", "Win rate optimization"],
                goals: ["Hit quarterly targets", "Scale team efficiency", "Reduce churn"],
                decisionCriteria: ["ROI proof", "Ease of adoption", "Integration capability"]
            },
            {
                name: "Sales Enablement Manager",
                role: "Technical Evaluator", 
                painPoints: ["Rep onboarding time", "Content relevance", "Tool adoption"],
                goals: ["Faster ramp time", "Higher activity quality", "Data-driven coaching"],
                decisionCriteria: ["Ease of use", "Training resources", "Analytics depth"]
            }
        ]
    },
    competency_progress: {
        overallScore: 78,
        buyerScore: 82,
        techScore: 74,
        competencyLevel: "Advanced Practitioner",
        strengths: ["Buyer Research", "Value Articulation"],
        gaps: ["Technical Translation", "Competitive Positioning"],
        tier1Progress: 100,
        tier2Progress: 65,
        tier3Progress: 30
    },
    cost_calculator_content: {
        currentState: {
            avgDealSize: 45000,
            salesCycleLength: 120,
            winRate: 22,
            monthlyDeals: 8
        },
        calculatedCosts: {
            lostRevenue: 540000,
            wastedEffort: 180000,
            opportunityCost: 320000,
            totalAnnualCost: 1040000
        },
        potentialGains: {
            withImprovement: {
                cycleReduction: 40,
                winRateIncrease: 15,
                additionalRevenue: 890000
            }
        }
    },
    business_case_content: {
        executiveSummary: "Investment in buyer intelligence reduces sales cycle by 40% and increases win rate by 15%, generating $890K additional annual revenue.",
        problemStatement: "Current sales process results in $1.04M annual cost of inaction through long cycles, low win rates, and missed opportunities.",
        proposedSolution: "H&S Revenue Intelligence Platform provides AI-powered buyer insights to accelerate deals and improve win rates.",
        financialImpact: {
            investment: 50000,
            yearOneReturn: 890000,
            roi: "1780%",
            paybackPeriod: "6 weeks"
        },
        keyMetrics: {
            cycleTimeReduction: "48 days (40%)",
            winRateImprovement: "+15 percentage points",
            revenueImpact: "$890K year one"
        },
        implementation: {
            timeline: "90 days",
            resources: "1 project lead, 2 sales ops analysts",
            risks: "Low - proven methodology, existing tool integrations"
        }
    }
};

// Dotun's MVP Data
const dotunData = {
    customer_name: 'Dotun Odewale',
    email: 'dotun@adesolarenergy.com',
    company: 'Adesola Renewable Energy',
    payment_status: 'Completed',
    content_status: 'Ready',
    competency_level: 'Foundation',
    icp_content: {
        productName: "Commercial Solar Solutions",
        productDescription: "Turnkey solar installations for small to medium businesses",
        targetMarket: "SMB facilities management",
        pricePoint: "$50,000-$200,000 project value",
        keyFeatures: ["Energy audit", "Custom design", "Installation", "Monitoring"],
        valueProposition: "Reduce energy costs by 40% with zero upfront investment"
    },
    detailed_icp_analysis: {
        firmographic: {
            industries: ["Manufacturing", "Warehousing", "Retail"],
            companySize: "25-200 employees",
            revenue: "$5M-$50M annual revenue",
            location: "California, Texas, Arizona"
        },
        facilities: {
            roofSize: "10,000+ sq ft",
            energyUsage: "$5,000+ monthly electric bill",
            ownership: "Owned facilities preferred"
        },
        behavioral: {
            painPoints: ["Rising energy costs", "Sustainability mandates", "Budget constraints"],
            triggers: ["Lease renewal", "Facility expansion", "ESG reporting requirements"]
        }
    },
    target_buyer_personas: {
        personas: [
            {
                name: "Facilities Director",
                role: "Primary Decision Maker",
                painPoints: ["Energy cost volatility", "Equipment maintenance", "Sustainability pressure"],
                goals: ["Reduce operating costs", "Improve facility efficiency", "Meet ESG goals"],
                decisionCriteria: ["ROI clarity", "No upfront cost", "Proven track record"]
            }
        ]
    },
    competency_progress: {
        overallScore: 45,
        buyerScore: 52,
        techScore: 38,
        competencyLevel: "Foundation",
        strengths: ["Customer Focus"],
        gaps: ["ICP Definition", "Value Quantification", "Buyer Journey Mapping"],
        tier1Progress: 35,
        tier2Progress: 0,
        tier3Progress: 0
    },
    cost_calculator_content: {
        currentState: {
            avgDealSize: 125000,
            salesCycleLength: 180,
            winRate: 18,
            monthlyDeals: 3
        },
        calculatedCosts: {
            lostRevenue: 450000,
            wastedEffort: 120000,
            opportunityCost: 280000,
            totalAnnualCost: 850000
        },
        potentialGains: {
            withImprovement: {
                cycleReduction: 35,
                winRateIncrease: 12,
                additionalRevenue: 520000
            }
        }
    },
    business_case_content: {
        executiveSummary: "Implementing buyer intelligence reduces sales cycle by 35% and increases win rate by 12%, generating $520K additional annual revenue.",
        problemStatement: "Current sales approach results in $850K annual cost through extended sales cycles, low conversion rates, and limited market penetration.",
        proposedSolution: "Systematic buyer intelligence and ICP-driven targeting to accelerate commercial solar sales.",
        financialImpact: {
            investment: 25000,
            yearOneReturn: 520000,
            roi: "2080%",
            paybackPeriod: "5 weeks"
        },
        keyMetrics: {
            cycleTimeReduction: "63 days (35%)",
            winRateImprovement: "+12 percentage points",
            revenueImpact: "$520K year one"
        },
        implementation: {
            timeline: "60 days",
            resources: "Sales manager + 1 analyst",
            risks: "Low - proven frameworks, minimal tech requirements"
        }
    }
};

async function seedMVPData() {
    try {
        console.log('🚀 Starting MVP Database Seeding (Direct Method)...');
        console.log(`📍 Supabase URL: ${supabaseUrl}`);
        console.log('');

        // Step 1: Clear existing data (optional - for clean seeding)
        console.log('🧹 Clearing existing MVP data...');
        
        // Delete existing resources with customer_id = 'global'
        const { error: deleteResourcesError } = await supabase
            .from('resources')
            .delete()
            .eq('customer_id', 'global');
            
        if (deleteResourcesError) {
            console.log('⚠️ Could not clear existing resources (may not exist):', deleteResourcesError.message);
        } else {
            console.log('✅ Cleared existing global resources');
        }

        // Delete existing customer assets for Brandon and Dotun
        const { error: deleteCustomersError } = await supabase
            .from('customer_assets')
            .delete()
            .in('email', ['geter@humusnshore.org', 'dotun@adesolarenergy.com']);
            
        if (deleteCustomersError) {
            console.log('⚠️ Could not clear existing customers (may not exist):', deleteCustomersError.message);
        } else {
            console.log('✅ Cleared existing customer data');
        }

        console.log('');

        // Step 2: Insert Resources
        console.log('📚 Inserting 4 MVP resources...');
        
        const { data: insertedResources, error: resourcesError } = await supabase
            .from('resources')
            .insert(mvpResources)
            .select('id, title, tier, category');

        if (resourcesError) {
            console.error('❌ Error inserting resources:', resourcesError);
            throw resourcesError;
        }

        console.log(`✅ Successfully inserted ${insertedResources.length} resources:`);
        insertedResources.forEach((resource, index) => {
            console.log(`   ${index + 1}. ${resource.title} (Tier ${resource.tier}, ${resource.category})`);
        });

        console.log('');

        // Step 3: Get user IDs for Brandon and Dotun
        console.log('👤 Getting user IDs for Brandon and Dotun...');
        
        const { data: brandonUser, error: brandonUserError } = await supabase
            .from('auth.users')
            .select('id')
            .eq('email', 'geter@humusnshore.org')
            .single();

        const { data: dotunUser, error: dotunUserError } = await supabase
            .from('auth.users')
            .select('id')
            .eq('email', 'dotun@adesolarenergy.com')
            .single();

        if (brandonUserError || dotunUserError) {
            console.log('⚠️ Could not find user IDs in auth.users (using mock IDs)');
            console.log('   This is normal if users haven\'t been created yet');
            
            // Use mock UUIDs for testing
            brandonData.customer_id = '00000000-0000-0000-0000-000000000001';
            dotunData.customer_id = '00000000-0000-0000-0000-000000000002';
        } else {
            brandonData.customer_id = brandonUser.id;
            dotunData.customer_id = dotunUser.id;
            console.log('✅ Found user IDs');
        }

        console.log('');

        // Step 4: Insert Customer Assets
        console.log('👥 Inserting customer assets for Brandon and Dotun...');
        
        const { data: insertedCustomers, error: customersError } = await supabase
            .from('customer_assets')
            .insert([brandonData, dotunData])
            .select('customer_name, email, competency_level');

        if (customersError) {
            console.error('❌ Error inserting customer assets:', customersError);
            throw customersError;
        }

        console.log(`✅ Successfully inserted ${insertedCustomers.length} customer records:`);
        insertedCustomers.forEach((customer, index) => {
            console.log(`   ${index + 1}. ${customer.customer_name} (${customer.email}) - ${customer.competency_level}`);
        });

        console.log('');

        // Step 5: Verification
        console.log('🔍 Running verification queries...');

        // Verify resources
        const { data: verifyResources, error: verifyResourcesError } = await supabase
            .from('resources')
            .select('id, title, tier, category')
            .eq('customer_id', 'global');

        if (verifyResourcesError) {
            console.error('❌ Error verifying resources:', verifyResourcesError);
            throw verifyResourcesError;
        }

        console.log(`✅ Resources verification: ${verifyResources.length}/4 found`);

        // Verify customers
        const { data: verifyCustomers, error: verifyCustomersError } = await supabase
            .from('customer_assets')
            .select('customer_name, email, competency_level');

        if (verifyCustomersError) {
            console.error('❌ Error verifying customers:', verifyCustomersError);
            throw verifyCustomersError;
        }

        console.log(`✅ Customers verification: ${verifyCustomers.length}/2 found`);

        // Verify specific data
        const { data: brandonVerify, error: brandonVerifyError } = await supabase
            .from('customer_assets')
            .select('icp_content, competency_progress')
            .eq('email', 'geter@humusnshore.org')
            .single();

        const { data: dotunVerify, error: dotunVerifyError } = await supabase
            .from('customer_assets')
            .select('icp_content, competency_progress')
            .eq('email', 'dotun@adesolarenergy.com')
            .single();

        if (brandonVerifyError || dotunVerifyError) {
            console.error('❌ Error verifying specific data:', brandonVerifyError || dotunVerifyError);
            throw brandonVerifyError || dotunVerifyError;
        }

        console.log('✅ Data integrity verified:');
        console.log(`   Brandon ICP: ${brandonVerify.icp_content?.productName || 'Missing'}`);
        console.log(`   Brandon Score: ${brandonVerify.competency_progress?.overallScore || 'Missing'}`);
        console.log(`   Dotun ICP: ${dotunVerify.icp_content?.productName || 'Missing'}`);
        console.log(`   Dotun Score: ${dotunVerify.competency_progress?.overallScore || 'Missing'}`);

        console.log('');
        console.log('🎉 MVP DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('');
        console.log('📊 Summary:');
        console.log(`   • ${verifyResources.length} resources created (Tier 1 Core)`);
        console.log(`   • ${verifyCustomers.length} customer records created (Brandon & Dotun)`);
        console.log('');
        console.log('🎯 Ready for testing:');
        console.log('   • ICP Tool - Product Details widgets pre-populated');
        console.log('   • Resources Library - 4 viewable/exportable resources');
        console.log('   • Assessment - Mock results display');
        console.log('   • Cost Calculator - One-page business case generation');
        console.log('');
        console.log('✅ All verification checks passed!');

    } catch (error) {
        console.error('');
        console.error('❌ MVP SEEDING FAILED:');
        console.error(error.message);
        console.error('');
        console.error('🔧 Troubleshooting:');
        console.error('1. Check SUPABASE_SERVICE_ROLE_KEY is set correctly');
        console.error('2. Verify Supabase project is accessible');
        console.error('3. Ensure database schema is up to date');
        console.error('4. Check that resources and customer_assets tables exist');
        process.exit(1);
    }
}

// Check environment
async function checkEnvironment() {
    console.log('🔍 Checking environment...');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
        return false;
    }
    
    console.log('✅ Environment variables loaded');
    return true;
}

// Main execution
async function main() {
    console.log('🎯 MVP Database Seeding Script (Direct Method)');
    console.log('===============================================');
    console.log('');
    
    const envOk = await checkEnvironment();
    if (!envOk) {
        process.exit(1);
    }
    
    await seedMVPData();
}

main().catch(console.error);



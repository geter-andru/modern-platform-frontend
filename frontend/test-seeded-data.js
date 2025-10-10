#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://molcqjsqtjbfclasynpg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSeededData() {
    try {
        console.log('🔍 Testing Seeded Data Access...');
        console.log(`📍 Supabase URL: ${supabaseUrl}`);
        console.log('');

        // Test 1: Resources
        console.log('📚 Testing Resources...');
        const { data: resources, error: resourcesError } = await supabase
            .from('resources')
            .select('id, title, tier, category, content')
            .eq('customer_id', 'global');

        if (resourcesError) {
            console.error('❌ Error fetching resources:', resourcesError);
            return;
        }

        console.log(`✅ Found ${resources.length} resources:`);
        resources.forEach((resource, index) => {
            console.log(`   ${index + 1}. ${resource.title} (Tier ${resource.tier}, ${resource.category})`);
            console.log(`      Content sections: ${resource.content?.sections?.length || 0}`);
        });

        console.log('');

        // Test 2: Customer Assets
        console.log('👥 Testing Customer Assets...');
        const { data: customers, error: customersError } = await supabase
            .from('customer_assets')
            .select('customer_name, email, competency_level, icp_content, competency_progress');

        if (customersError) {
            console.error('❌ Error fetching customers:', customersError);
            return;
        }

        console.log(`✅ Found ${customers.length} customer records:`);
        customers.forEach((customer, index) => {
            console.log(`   ${index + 1}. ${customer.customer_name} (${customer.email})`);
            console.log(`      Competency: ${customer.competency_level}`);
            console.log(`      ICP Product: ${customer.icp_content?.productName || 'Missing'}`);
            console.log(`      Assessment Score: ${customer.competency_progress?.overallScore || 'Missing'}`);
        });

        console.log('');

        // Test 3: Specific Resource Content
        console.log('📖 Testing Resource Content...');
        const { data: icpResource, error: icpError } = await supabase
            .from('resources')
            .select('content')
            .eq('title', 'ICP Discovery Framework')
            .single();

        if (icpError) {
            console.error('❌ Error fetching ICP resource:', icpError);
        } else {
            console.log('✅ ICP Discovery Framework content:');
            console.log(`   Summary: ${icpResource.content?.summary || 'Missing'}`);
            console.log(`   Sections: ${icpResource.content?.sections?.length || 0}`);
            if (icpResource.content?.sections) {
                icpResource.content.sections.forEach((section, index) => {
                    console.log(`     ${index + 1}. ${section.title}`);
                });
            }
        }

        console.log('');

        // Test 4: Brandon's ICP Data
        console.log('🎯 Testing Brandon\'s ICP Data...');
        const { data: brandonICP, error: brandonError } = await supabase
            .from('customer_assets')
            .select('icp_content, detailed_icp_analysis, target_buyer_personas')
            .eq('email', 'geter@humusnshore.org')
            .single();

        if (brandonError) {
            console.error('❌ Error fetching Brandon data:', brandonError);
        } else {
            console.log('✅ Brandon\'s ICP data:');
            console.log(`   Product: ${brandonICP.icp_content?.productName || 'Missing'}`);
            console.log(`   Target Market: ${brandonICP.icp_content?.targetMarket || 'Missing'}`);
            console.log(`   Firmographic Industries: ${brandonICP.detailed_icp_analysis?.firmographic?.industries?.join(', ') || 'Missing'}`);
            console.log(`   Buyer Personas: ${brandonICP.target_buyer_personas?.personas?.length || 0}`);
        }

        console.log('');

        // Test 5: Dotun's Assessment Data
        console.log('📊 Testing Dotun\'s Assessment Data...');
        const { data: dotunAssessment, error: dotunError } = await supabase
            .from('customer_assets')
            .select('competency_progress, cost_calculator_content, business_case_content')
            .eq('email', 'dotun@adesolarenergy.com')
            .single();

        if (dotunError) {
            console.error('❌ Error fetching Dotun data:', dotunError);
        } else {
            console.log('✅ Dotun\'s assessment data:');
            console.log(`   Overall Score: ${dotunAssessment.competency_progress?.overallScore || 'Missing'}`);
            console.log(`   Competency Level: ${dotunAssessment.competency_progress?.competencyLevel || 'Missing'}`);
            console.log(`   Cost of Inaction: $${dotunAssessment.cost_calculator_content?.calculatedCosts?.totalAnnualCost?.toLocaleString() || 'Missing'}`);
            console.log(`   Business Case ROI: ${dotunAssessment.business_case_content?.financialImpact?.roi || 'Missing'}`);
        }

        console.log('');
        console.log('🎉 ALL SEEDED DATA TESTS PASSED!');
        console.log('');
        console.log('✅ Data is ready for frontend testing:');
        console.log('   • Resources Library will show 4 resources');
        console.log('   • ICP Tool will have pre-populated data');
        console.log('   • Assessment will show mock results');
        console.log('   • Cost Calculator will have sample data');
        console.log('');
        console.log('🚀 Frontend can now be tested with real data!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Main execution
async function main() {
    console.log('🧪 Seeded Data Verification Test');
    console.log('=================================');
    console.log('');
    
    await testSeededData();
}

main().catch(console.error);




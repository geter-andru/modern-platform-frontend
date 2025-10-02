-- ===============================================
-- SUPABASE SCHEMA MIGRATION FROM AIRTABLE
-- H&S Revenue Intelligence Platform
-- Date: August 27, 2025
-- ===============================================

-- Enable RLS by default for security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO authenticated;

-- ===============================================
-- CORE SYSTEM MANAGEMENT TABLES (9 TABLES)
-- ===============================================

-- 1. AI_Resource_Generations (Primary Hub)
CREATE TABLE public.ai_resource_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT NOT NULL,
    generation_job_id TEXT UNIQUE NOT NULL,
    product_name TEXT,
    target_market TEXT,
    product_description TEXT,
    key_features TEXT,
    generation_status TEXT CHECK (generation_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    total_resources_generated INTEGER DEFAULT 0,
    cost_usd DECIMAL(10,4),
    processing_time_seconds INTEGER,
    webhook_data JSONB,
    error_details TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Resource_Generation_Summary
CREATE TABLE public.resource_generation_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    generation_id UUID REFERENCES ai_resource_generations(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('icp_analysis', 'buyer_personas', 'empathy_map', 'market_potential', 'value_messaging', 'competitive_analysis')),
    resource_name TEXT NOT NULL,
    content TEXT,
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high', 'excellent')),
    word_count INTEGER,
    generation_time_seconds INTEGER,
    status TEXT CHECK (status IN ('pending', 'generated', 'approved', 'rejected')),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Generation_Error_Logs
CREATE TABLE public.generation_error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    generation_id UUID REFERENCES ai_resource_generations(id) ON DELETE CASCADE,
    error_type TEXT CHECK (error_type IN ('api_timeout', 'rate_limit', 'parsing_error', 'system_failure', 'validation_error')),
    error_message TEXT NOT NULL,
    error_details JSONB,
    severity_level TEXT CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
    resolution_status TEXT CHECK (resolution_status IN ('open', 'investigating', 'resolved', 'escalated')),
    resolution_notes TEXT,
    retry_attempted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. Customer_Profiles
CREATE TABLE public.customer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT,
    phone TEXT,
    industry TEXT,
    company_size TEXT,
    annual_revenue_range TEXT,
    purchase_history JSONB,
    satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 10),
    lifecycle_stage TEXT CHECK (lifecycle_stage IN ('lead', 'trial', 'active', 'churned', 'enterprise')),
    subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'professional', 'enterprise')),
    last_login_at TIMESTAMP WITH TIME ZONE,
    total_sessions INTEGER DEFAULT 0,
    preferred_communication TEXT,
    timezone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Product_Configurations
CREATE TABLE public.product_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name TEXT NOT NULL,
    product_description TEXT,
    pricing_tier TEXT CHECK (pricing_tier IN ('basic', 'professional', 'enterprise')),
    resource_bundle_definition JSONB,
    included_resource_types TEXT[],
    max_generations_per_month INTEGER,
    usage_tracking JSONB,
    success_rate_threshold DECIMAL(5,4),
    quality_requirements JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Performance_Metrics
CREATE TABLE public.performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    total_revenue DECIMAL(12,2),
    new_customers INTEGER DEFAULT 0,
    active_customers INTEGER DEFAULT 0,
    churned_customers INTEGER DEFAULT 0,
    total_generations INTEGER DEFAULT 0,
    successful_generations INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,4),
    average_quality_score DECIMAL(5,2),
    total_api_costs DECIMAL(10,4),
    average_processing_time_seconds INTEGER,
    error_rate DECIMAL(5,4),
    customer_satisfaction_avg DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Support_Tickets
CREATE TABLE public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    subject TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('technical', 'billing', 'feature_request', 'bug_report', 'general')),
    priority_level TEXT CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    status TEXT CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
    assigned_to TEXT,
    resolution_details TEXT,
    customer_satisfaction INTEGER CHECK (customer_satisfaction >= 1 AND customer_satisfaction <= 5),
    response_time_hours INTEGER,
    resolution_time_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 8. Admin_Dashboard_Metrics
CREATE TABLE public.admin_dashboard_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit TEXT,
    dashboard_section TEXT,
    alert_threshold_low DECIMAL(15,4),
    alert_threshold_high DECIMAL(15,4),
    current_status TEXT CHECK (current_status IN ('normal', 'warning', 'critical')),
    last_alert_sent_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Quality_Benchmarks
CREATE TABLE public.quality_benchmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_type TEXT NOT NULL,
    benchmark_name TEXT NOT NULL,
    minimum_score INTEGER,
    target_score INTEGER,
    excellent_score INTEGER,
    measurement_criteria JSONB,
    improvement_triggers JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource_type, benchmark_name)
);

-- ===============================================
-- CUSTOMER PSYCHOLOGY & INSIGHTS TABLES (2 TABLES)
-- ===============================================

-- 10. Moment_in_Life_Descriptions
CREATE TABLE public.moment_in_life_descriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    trigger_event TEXT NOT NULL,
    emotional_state TEXT,
    decision_context TEXT,
    urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
    success_definition TEXT,
    failure_definition TEXT,
    time_pressure TEXT,
    stakeholders_involved TEXT[],
    budget_constraints TEXT,
    decision_timeline TEXT,
    competing_priorities TEXT,
    moment_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Empathy_Maps
CREATE TABLE public.empathy_maps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    persona_name TEXT NOT NULL,
    what_they_think TEXT,
    what_they_feel TEXT,
    what_they_see TEXT,
    what_they_say TEXT,
    what_they_do TEXT,
    what_they_hear TEXT,
    pains JSONB,
    gains JSONB,
    motivations TEXT[],
    goals TEXT[],
    fears TEXT[],
    aspirations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- ADVANCED SALES RESOURCES TABLES (10 TABLES)
-- ===============================================

-- 12. Advanced_Sales_Tasks
CREATE TABLE public.advanced_sales_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    task_name TEXT NOT NULL,
    task_description TEXT,
    sales_methodology TEXT,
    task_category TEXT CHECK (task_category IN ('prospecting', 'discovery', 'demo', 'proposal', 'negotiation', 'closing')),
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_time_hours INTEGER,
    success_criteria TEXT,
    required_tools TEXT[],
    deliverables TEXT[],
    optimization_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Buyer_UX_Considerations
CREATE TABLE public.buyer_ux_considerations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    consideration_name TEXT NOT NULL,
    ux_element TEXT,
    buyer_impact TEXT,
    friction_points TEXT[],
    optimization_suggestions TEXT[],
    priority_level TEXT CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    implementation_effort TEXT CHECK (implementation_effort IN ('low', 'medium', 'high')),
    expected_impact TEXT CHECK (expected_impact IN ('low', 'medium', 'high')),
    test_criteria TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Product_Usage_Assessments
CREATE TABLE public.product_usage_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    product_feature TEXT NOT NULL,
    usage_frequency TEXT CHECK (usage_frequency IN ('daily', 'weekly', 'monthly', 'rarely', 'never')),
    user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 10),
    adoption_barriers TEXT[],
    usage_patterns JSONB,
    feature_requests TEXT[],
    competitive_alternatives TEXT[],
    retention_risk TEXT CHECK (retention_risk IN ('low', 'medium', 'high')),
    expansion_opportunities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Day_in_Life_Descriptions
CREATE TABLE public.day_in_life_descriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    persona_name TEXT NOT NULL,
    time_slot TIME,
    activity_description TEXT,
    tools_used TEXT[],
    pain_points TEXT[],
    product_interaction TEXT,
    context_details TEXT,
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'occasionally')),
    importance_level TEXT CHECK (importance_level IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Month_in_Life_Descriptions
CREATE TABLE public.month_in_life_descriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    month_phase TEXT NOT NULL,
    key_objectives TEXT[],
    seasonal_patterns TEXT,
    budget_cycles TEXT,
    team_changes TEXT,
    product_usage_evolution TEXT,
    success_metrics TEXT[],
    challenges TEXT[],
    strategic_priorities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. User_Journey_Maps
CREATE TABLE public.user_journey_maps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    journey_name TEXT NOT NULL,
    stage_name TEXT NOT NULL,
    stage_order INTEGER,
    touchpoints TEXT[],
    customer_actions TEXT[],
    emotions TEXT[],
    pain_points TEXT[],
    opportunities TEXT[],
    channels TEXT[],
    metrics TEXT[],
    duration_estimate TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Service_Blueprints
CREATE TABLE public.service_blueprints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    service_name TEXT NOT NULL,
    customer_actions TEXT[],
    frontstage_actions TEXT[],
    backstage_actions TEXT[],
    support_processes TEXT[],
    physical_evidence TEXT[],
    pain_points TEXT[],
    fail_points TEXT[],
    wait_times TEXT[],
    improvement_opportunities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Jobs_to_be_Done
CREATE TABLE public.jobs_to_be_done (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    job_statement TEXT NOT NULL,
    job_category TEXT CHECK (job_category IN ('functional', 'emotional', 'social')),
    job_importance INTEGER CHECK (job_importance >= 1 AND job_importance <= 10),
    current_satisfaction INTEGER CHECK (current_satisfaction >= 1 AND current_satisfaction <= 10),
    opportunity_score INTEGER GENERATED ALWAYS AS (job_importance + (10 - current_satisfaction)) STORED,
    context_description TEXT,
    desired_outcomes TEXT[],
    success_criteria TEXT[],
    current_solutions TEXT[],
    solution_gaps TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. Compelling_Events
CREATE TABLE public.compelling_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    event_name TEXT NOT NULL,
    event_description TEXT,
    trigger_type TEXT CHECK (trigger_type IN ('external', 'internal', 'competitive', 'regulatory', 'financial')),
    urgency_factor INTEGER CHECK (urgency_factor >= 1 AND urgency_factor <= 10),
    impact_assessment TEXT,
    decision_timeline TEXT,
    key_stakeholders TEXT[],
    budget_impact TEXT,
    risk_factors TEXT[],
    sales_acceleration_potential TEXT CHECK (sales_acceleration_potential IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. Scenario_Planning
CREATE TABLE public.scenario_planning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT REFERENCES customer_profiles(customer_id),
    scenario_name TEXT NOT NULL,
    scenario_type TEXT CHECK (scenario_type IN ('best_case', 'worst_case', 'most_likely', 'contingency')),
    probability_percentage INTEGER CHECK (probability_percentage >= 0 AND probability_percentage <= 100),
    scenario_description TEXT,
    key_assumptions TEXT[],
    potential_outcomes TEXT[],
    required_actions TEXT[],
    success_metrics TEXT[],
    risk_factors TEXT[],
    mitigation_strategies TEXT[],
    resource_requirements TEXT,
    timeline_estimate TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ===============================================

-- Core indexes for frequently queried fields
CREATE INDEX idx_ai_resource_generations_customer_id ON ai_resource_generations(customer_id);
CREATE INDEX idx_ai_resource_generations_status ON ai_resource_generations(generation_status);
CREATE INDEX idx_ai_resource_generations_created_at ON ai_resource_generations(created_at DESC);

CREATE INDEX idx_resource_generation_summary_generation_id ON resource_generation_summary(generation_id);
CREATE INDEX idx_resource_generation_summary_type ON resource_generation_summary(resource_type);
CREATE INDEX idx_resource_generation_summary_status ON resource_generation_summary(status);

CREATE INDEX idx_generation_error_logs_generation_id ON generation_error_logs(generation_id);
CREATE INDEX idx_generation_error_logs_severity ON generation_error_logs(severity_level);
CREATE INDEX idx_generation_error_logs_created_at ON generation_error_logs(created_at DESC);

CREATE INDEX idx_customer_profiles_customer_id ON customer_profiles(customer_id);
CREATE INDEX idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX idx_customer_profiles_lifecycle_stage ON customer_profiles(lifecycle_stage);

CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority_level);

-- ===============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE ai_resource_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_generation_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_in_life_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE empathy_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE advanced_sales_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_ux_considerations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_usage_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_in_life_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE month_in_life_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs_to_be_done ENABLE ROW LEVEL SECURITY;
ALTER TABLE compelling_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_planning ENABLE ROW LEVEL SECURITY;

-- Customer-specific data access policies
CREATE POLICY "Users can only access their own data" ON customer_profiles
    FOR ALL USING (auth.jwt() ->> 'user_id' = customer_id::text OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can only access their own resources" ON ai_resource_generations
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can only access their own resource summaries" ON resource_generation_summary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM ai_resource_generations 
            WHERE id = generation_id 
            AND (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin')
        )
    );

-- Admin-only access policies
CREATE POLICY "Admin access only" ON performance_metrics
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin access only" ON admin_dashboard_metrics
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin access only" ON quality_benchmarks
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Support tickets - users can see their own, admins can see all
CREATE POLICY "Support ticket access" ON support_tickets
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

-- Psychology and sales tables - customer-specific access
CREATE POLICY "Customer data access" ON moment_in_life_descriptions
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON empathy_maps
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON advanced_sales_tasks
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON buyer_ux_considerations
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON product_usage_assessments
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON day_in_life_descriptions
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON month_in_life_descriptions
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON user_journey_maps
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON service_blueprints
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON jobs_to_be_done
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON compelling_events
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Customer data access" ON scenario_planning
    FOR ALL USING (customer_id = (auth.jwt() ->> 'user_id') OR auth.jwt() ->> 'role' = 'admin');

-- ===============================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ===============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_ai_resource_generations_updated_at
    BEFORE UPDATE ON ai_resource_generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_generation_summary_updated_at
    BEFORE UPDATE ON resource_generation_summary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_configurations_updated_at
    BEFORE UPDATE ON product_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_dashboard_metrics_updated_at
    BEFORE UPDATE ON admin_dashboard_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_benchmarks_updated_at
    BEFORE UPDATE ON quality_benchmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moment_in_life_descriptions_updated_at
    BEFORE UPDATE ON moment_in_life_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_empathy_maps_updated_at
    BEFORE UPDATE ON empathy_maps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advanced_sales_tasks_updated_at
    BEFORE UPDATE ON advanced_sales_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_ux_considerations_updated_at
    BEFORE UPDATE ON buyer_ux_considerations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_usage_assessments_updated_at
    BEFORE UPDATE ON product_usage_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_day_in_life_descriptions_updated_at
    BEFORE UPDATE ON day_in_life_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_month_in_life_descriptions_updated_at
    BEFORE UPDATE ON month_in_life_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_journey_maps_updated_at
    BEFORE UPDATE ON user_journey_maps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_blueprints_updated_at
    BEFORE UPDATE ON service_blueprints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_to_be_done_updated_at
    BEFORE UPDATE ON jobs_to_be_done
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compelling_events_updated_at
    BEFORE UPDATE ON compelling_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenario_planning_updated_at
    BEFORE UPDATE ON scenario_planning
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- COMMENTS FOR DOCUMENTATION
-- ===============================================

COMMENT ON TABLE ai_resource_generations IS 'Master tracking for all AI resource generation processes';
COMMENT ON TABLE resource_generation_summary IS 'Individual resource tracking within generation jobs';
COMMENT ON TABLE generation_error_logs IS 'Comprehensive error tracking and resolution management';
COMMENT ON TABLE customer_profiles IS 'Enhanced customer relationship management and lifecycle tracking';
COMMENT ON TABLE product_configurations IS 'Product catalog and pricing management';
COMMENT ON TABLE performance_metrics IS 'Daily system performance and analytics tracking';
COMMENT ON TABLE support_tickets IS 'Customer support ticket management and resolution';
COMMENT ON TABLE admin_dashboard_metrics IS 'Real-time system health and operational monitoring';
COMMENT ON TABLE quality_benchmarks IS 'Quality standards and thresholds for resource generation';
COMMENT ON TABLE moment_in_life_descriptions IS 'Detailed trigger event and emotional state analysis';
COMMENT ON TABLE empathy_maps IS 'Comprehensive customer psychology mapping';
COMMENT ON TABLE advanced_sales_tasks IS 'Comprehensive sales methodology optimization';
COMMENT ON TABLE buyer_ux_considerations IS 'Buyer-centric user experience design';
COMMENT ON TABLE product_usage_assessments IS 'Product adoption and usage patterns';
COMMENT ON TABLE day_in_life_descriptions IS 'Daily workflow and product interaction scenarios';
COMMENT ON TABLE month_in_life_descriptions IS 'Long-term patterns and evolutionary tracking';
COMMENT ON TABLE user_journey_maps IS 'Stage-based customer journey analysis';
COMMENT ON TABLE service_blueprints IS 'Service delivery process mapping';
COMMENT ON TABLE jobs_to_be_done IS 'JTBD framework analysis';
COMMENT ON TABLE compelling_events IS 'Sales acceleration trigger identification';
COMMENT ON TABLE scenario_planning IS 'Strategic scenario analysis and contingency planning';
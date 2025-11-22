'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative" style={{
      background: 'transparent',
      color: '#ffffff',
      fontFamily: '"Red Hat Display", sans-serif'
    }}>
      <MotionBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-blue-400"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="prose prose-invert prose-lg max-w-none"
          style={{
            '--tw-prose-body': 'rgba(255, 255, 255, 0.8)',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-links': '#3b82f6',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': 'rgba(255, 255, 255, 0.5)',
            '--tw-prose-bullets': 'rgba(255, 255, 255, 0.5)',
            '--tw-prose-hr': 'rgba(255, 255, 255, 0.1)',
          } as React.CSSProperties}
        >
          <h1>Andru Platform Privacy Policy</h1>

          <p><strong>Last Updated:</strong> November 14, 2025<br />
          <strong>Effective Date:</strong> November 1, 2025</p>

          <hr />

          <h2>Plain Language Summary</h2>

          <p><strong>What you need to know about your data:</strong></p>

          <p>We built Andru for technical founders who value authenticity and transparency. This Privacy Policy reflects those values by being honest about what data we collect, why we collect it, and how we protect it.</p>

          <p><strong>The essentials:</strong></p>

          <ul>
            <li><strong>We collect what we need:</strong> Assessment responses, business context, and usage data to provide personalized recommendations</li>
            <li><strong>Your data stays yours:</strong> We never sell your individual business data to anyone, period</li>
            <li><strong>Security matters:</strong> We implement industry-standard security measures to protect your confidential information</li>
            <li><strong>You have control:</strong> Access, export, or delete your data at any time</li>
            <li><strong>Transparency commitment:</strong> If our practices change materially, we&apos;ll tell you clearly and directly</li>
          </ul>

          <p><strong>Our values-driven approach:</strong></p>

          <p>Unlike platforms that monetize user data, we make money by actually helping you succeed. Your transformation is our business model, not your data.</p>

          <hr />

          <h2>1. Introduction</h2>

          <h3>1.1 Who We Are</h3>

          <p>This Privacy Policy is provided by Humus &amp; Shore LLC (&quot;H&amp;S,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), the company behind the Andru revenue acceleration platform (&quot;Platform&quot;).</p>

          <p><strong>Our Commitment:</strong></p>

          <p>We built the Platform with Empathy as a core value—people before profits. This extends to data practices. We collect only what serves your success, protect it carefully, and never exploit it for revenue beyond our subscription model.</p>

          <h3>1.2 Scope of This Policy</h3>

          <p>This Privacy Policy applies to:</p>

          <ul>
            <li>Information collected through the Andru Platform (web-based interface)</li>
            <li>Information collected through related communications (email, support)</li>
            <li>Information processed when you use Platform features (assessments, recommendations, tools)</li>
          </ul>

          <h3>1.3 Your Consent</h3>

          <p>By using the Platform, you consent to the data practices described in this Privacy Policy. If you do not agree, please do not use the Platform.</p>

          <hr />

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide Directly</h3>

          <p><strong>Account Information:</strong></p>
          <ul>
            <li>Name and email address</li>
            <li>Company name and website</li>
            <li>Job title and role</li>
            <li>Payment information (processed by third-party payment processor)</li>
            <li>Contact preferences</li>
          </ul>

          <p><strong>Assessment Responses:</strong></p>
          <ul>
            <li>Revenue readiness evaluation answers</li>
            <li>ICP (Ideal Customer Profile) definition data</li>
            <li>Buyer persona information</li>
            <li>Go-to-market strategy details</li>
            <li>Financial data (ARR, pricing, customer metrics)</li>
            <li>Product capability descriptions</li>
            <li>Market positioning information</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>

          <p><strong>Usage Data:</strong></p>
          <ul>
            <li>Pages visited and features accessed</li>
            <li>Time spent on Platform sections</li>
            <li>Assessment completion rates</li>
            <li>Click patterns and navigation flow</li>
            <li>Session duration and frequency</li>
          </ul>

          <p><strong>Technical Information:</strong></p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Device type (desktop, tablet, mobile)</li>
          </ul>

          <hr />

          <h2>3. How We Use Your Information</h2>

          <h3>3.1 Primary Uses: Providing Platform Services</h3>

          <p>We use your information to:</p>

          <p><strong>Personalize Your Experience:</strong></p>
          <ul>
            <li>Generate customized recommendations based on your business context</li>
            <li>Tailor framework guidance to your funding stage and growth trajectory</li>
            <li>Prioritize relevant content and resources</li>
            <li>Create business cases and analysis specific to your situation</li>
          </ul>

          <p><strong>Operate Core Platform Features:</strong></p>
          <ul>
            <li>Process assessments and calculate scores</li>
            <li>Provide comparative benchmarking (using anonymized aggregate data)</li>
            <li>Generate reports and visualizations</li>
            <li>Enable export and integration functionality</li>
          </ul>

          <h3>3.2 Aggregated and Anonymized Data</h3>

          <p>We may use aggregated, anonymized data to:</p>

          <ul>
            <li>Create industry benchmarks (e.g., &quot;Companies at your stage typically have X&quot;)</li>
            <li>Develop case studies and success patterns (with all identifying information removed)</li>
            <li>Produce research reports on revenue strategy trends</li>
            <li>Improve AI/ML recommendation algorithms</li>
          </ul>

          <p><strong>What &quot;anonymized&quot; means:</strong></p>

          <p>Data is stripped of all identifying information—company names, individual names, specific financial figures, unique circumstances—making it impossible to trace back to you.</p>

          <hr />

          <h2>4. How We Share Your Information</h2>

          <h3>4.1 We Do NOT Sell Your Data</h3>

          <p><strong>Clear commitment:</strong> We do not and will never sell your individual business data to third parties. Period.</p>

          <p>Our business model is subscription revenue from helping you succeed, not monetizing your information.</p>

          <h3>4.2 Service Providers and Processors</h3>

          <p>We share information with trusted third-party service providers who help us operate the Platform:</p>

          <ul>
            <li><strong>Payment Processing:</strong> Stripe or similar payment processors</li>
            <li><strong>Cloud Infrastructure:</strong> AWS, Google Cloud, or similar providers</li>
            <li><strong>Analytics and Monitoring:</strong> Google Analytics or similar tools (anonymized usage data only)</li>
            <li><strong>Customer Support Tools:</strong> For providing responsive support</li>
            <li><strong>Email Service Providers:</strong> For delivering Platform notifications</li>
          </ul>

          <p><strong>All service providers:</strong></p>
          <ul>
            <li>Are contractually obligated to protect your data</li>
            <li>May only use data to provide services to us</li>
            <li>Must comply with applicable privacy laws</li>
          </ul>

          <hr />

          <h2>5. Data Security</h2>

          <h3>5.1 Our Security Approach</h3>

          <p>Given that you entrust us with confidential business information, we implement comprehensive security measures:</p>

          <p><strong>Encryption:</strong></p>
          <ul>
            <li>Data in transit: TLS 1.3 or higher for all connections</li>
            <li>Data at rest: AES-256 encryption for stored data</li>
            <li>Database encryption: All assessment responses and business data encrypted</li>
          </ul>

          <p><strong>Access Controls:</strong></p>
          <ul>
            <li>Multi-factor authentication required for all H&amp;S team access</li>
            <li>Role-based access: Team members access only data necessary for their role</li>
            <li>Regular access reviews: Quarterly audits of who has access to what</li>
          </ul>

          <hr />

          <h2>6. Your Privacy Rights and Choices</h2>

          <h3>6.1 Access Your Data</h3>

          <p><strong>You have the right to:</strong></p>
          <ul>
            <li>Request a copy of all data we hold about you</li>
            <li>Review your assessment responses and account information</li>
            <li>Receive data in portable format (JSON, CSV)</li>
          </ul>

          <h3>6.2 Delete Your Data</h3>

          <p><strong>You have the right to:</strong></p>
          <ul>
            <li>Delete your account at any time</li>
            <li>Request deletion of specific assessment data</li>
            <li>Have your data removed from our systems</li>
          </ul>

          <p><strong>How to delete:</strong></p>
          <ul>
            <li>Account settings → Delete Account</li>
            <li>Contact support@humusandshore.com</li>
            <li>We&apos;ll confirm deletion within 30 days</li>
          </ul>

          <hr />

          <h2>7. Contact Us About Privacy</h2>

          <p><strong>General Privacy Inquiries:</strong> privacy@humusandshore.com</p>

          <p><strong>General Questions:</strong> geter@humusnshore.org</p>

          <hr />

          <h2>Final Note: Privacy as Partnership</h2>

          <p>Privacy isn&apos;t just about compliance—it&apos;s about respect.</p>

          <p>We built this platform to help technical founders transform their revenue processes through systematic, authentic approaches. That same authenticity extends to how we handle your data.</p>

          <p><strong>You&apos;re trusting us with:</strong></p>
          <ul>
            <li>Confidential business information</li>
            <li>Strategic plans and roadmaps</li>
            <li>Financial performance metrics</li>
            <li>Competitive positioning details</li>
          </ul>

          <p><strong>We honor that trust by:</strong></p>
          <ul>
            <li>Protecting your data as if it were our own</li>
            <li>Being transparent about our practices and limitations</li>
            <li>Giving you control over your information</li>
            <li>Never exploiting your data for purposes beyond serving you</li>
          </ul>

          <p>If you have questions, concerns, or suggestions about our privacy practices, please reach out. We genuinely want to hear from you.</p>

          <hr />

          <p><em>This Privacy Policy is drafted to balance legal compliance with H&amp;S&apos;s values of Transparency and Empathy.</em></p>
        </motion.div>
      </div>
    </div>
  );
}

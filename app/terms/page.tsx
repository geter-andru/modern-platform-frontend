'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MotionBackground } from '../../src/shared/components/ui/MotionBackground';

export default function TermsPage() {
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
          <h1>Andru Platform Terms of Service</h1>

          <p><strong>Last Updated:</strong> November 14, 2025<br />
          <strong>Effective Date:</strong> November 1, 2025</p>

          <hr />

          <h2>Plain Language Summary</h2>

          <p><strong>What this means in real terms:</strong></p>

          <p>This is a beta platform that helps technical founders build systematic revenue processes. By using Andru, you&apos;re agreeing to:</p>

          <ul>
            <li><strong>Be an early adopter:</strong> This platform is production-ready but still evolving. We&apos;re learning together.</li>
            <li><strong>Provide honest input:</strong> The quality of your results depends on the accuracy of your assessment responses.</li>
            <li><strong>Respect our intellectual property:</strong> Our frameworks and methodologies are proprietary, but your business data always remains yours.</li>
            <li><strong>Work with us in good faith:</strong> We&apos;re building for founders who value authenticity and systematic growth over shortcuts.</li>
          </ul>

          <p><strong>What we commit to:</strong></p>

          <ul>
            <li><strong>Transparent communication:</strong> We&apos;ll tell you what&apos;s working, what&apos;s not, and what we&apos;re learning.</li>
            <li><strong>Data protection:</strong> Your business information is confidential and will never be sold or used for purposes beyond serving you.</li>
            <li><strong>Values alignment:</strong> We reject growth hacks and prioritize your genuine transformation over our revenue metrics.</li>
          </ul>

          <p>The legal details below protect both of us, but our relationship is built on mutual respect and shared commitment to doing revenue strategy right.</p>

          <hr />

          <h2>1. Acceptance of Terms</h2>

          <p>By accessing or using the Andru platform (&quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Platform.</p>

          <p>These Terms constitute a legally binding agreement between you (either as an individual or on behalf of an entity, &quot;you&quot; or &quot;User&quot;) and Humus &amp; Shore LLC (&quot;H&amp;S,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).</p>

          <hr />

          <h2>2. Service Description</h2>

          <h3>2.1 What Andru Does</h3>

          <p>Andru is a revenue acceleration platform designed specifically for technical founders who need systematic approaches to revenue generation. The Platform provides:</p>

          <ul>
            <li><strong>Comprehensive Assessments:</strong> Multi-dimensional evaluation of your revenue readiness, ICP clarity, and go-to-market foundation</li>
            <li><strong>Personalized Recommendations:</strong> Customized guidance based on your specific business context, stage, and challenges</li>
            <li><strong>Framework Access:</strong> Structured methodologies for ICP generation, buyer persona development, and value proposition creation</li>
            <li><strong>Business Case Tools:</strong> Calculators and templates for cost analysis, pricing strategy, and investment justification</li>
            <li><strong>Implementation Resources:</strong> Step-by-step guides for executing systematic revenue processes</li>
          </ul>

          <h3>2.2 What Andru Is NOT</h3>

          <p>To set clear expectations:</p>

          <ul>
            <li><strong>Not a guarantee of revenue outcomes:</strong> We provide methodology and frameworks, but execution and market conditions determine results</li>
            <li><strong>Not generic business advice:</strong> Our approach is specifically designed for technical founders building B2B products</li>
            <li><strong>Not a replacement for judgment:</strong> Platform recommendations should inform, not replace, your strategic decision-making</li>
            <li><strong>Not a growth hack:</strong> We explicitly reject shortcuts and tactics that compromise authenticity or sustainable growth</li>
          </ul>

          <h3>2.3 Beta/Early Access Status</h3>

          <p><strong>IMPORTANT:</strong> Andru is currently in <strong>Beta Release</strong> with capacity-limited access.</p>

          <p>This means:</p>

          <ul>
            <li><strong>Platform Stability:</strong> The Platform is production-ready with 83%+ test success rates, but you may encounter occasional bugs or unexpected behavior</li>
            <li><strong>Feature Evolution:</strong> Features, methodologies, and user interface may change based on user feedback and platform learning</li>
            <li><strong>Limited Capacity:</strong> We intentionally limit user capacity (target: 75-5,000 users maximum) to maintain quality and ensure we can serve each founder effectively</li>
            <li><strong>Active Development:</strong> Your feedback directly influences platform development priorities</li>
            <li><strong>Service Interruptions:</strong> We may need to pause service temporarily for updates, improvements, or infrastructure changes</li>
          </ul>

          <hr />

          <h2>3. User Accounts and Responsibilities</h2>

          <h3>3.1 Account Creation</h3>

          <p>To access the Platform, you must:</p>

          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security and confidentiality of your account credentials</li>
            <li>Be at least 18 years of age and legally capable of entering into binding contracts</li>
          </ul>

          <h3>3.2 Account Security</h3>

          <p>You are responsible for:</p>

          <ul>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access or security breach</li>
            <li>Taking reasonable measures to prevent unauthorized access</li>
          </ul>

          <h3>3.3 Honest Input Requirement</h3>

          <p><strong>Critical to Platform Effectiveness:</strong></p>

          <p>The Platform&apos;s value depends entirely on the accuracy and honesty of your input. You agree to:</p>

          <ul>
            <li>Provide truthful responses to all assessment questions</li>
            <li>Avoid gaming or manipulating assessments to achieve desired scores</li>
            <li>Update information when your business circumstances change materially</li>
            <li>Acknowledge limitations or gaps in your knowledge rather than guessing</li>
          </ul>

          <hr />

          <h2>4. Payment Terms</h2>

          <h3>4.1 Refund Policy</h3>

          <p><strong>Beta Period Refund Commitment:</strong></p>

          <p>Given the Beta status of the Platform, we offer the following refund protections:</p>

          <ul>
            <li><strong>30-Day Full Refund:</strong> If you&apos;re unsatisfied within the first 30 days of your subscription, we&apos;ll provide a full refund, no questions asked</li>
            <li><strong>Post-30-Day Evaluation:</strong> After 30 days, refund requests will be evaluated based on platform performance, service delivery issues, or circumstances where we failed to meet reasonable expectations</li>
            <li><strong>Good Faith Requirement:</strong> Refund eligibility requires good faith use of the Platform—completing assessments, reviewing recommendations, and engaging with provided resources</li>
          </ul>

          <p><strong>To Request a Refund:</strong> Contact support@humusandshore.com with your account details and reason for the request.</p>

          <hr />

          <h2>5. Intellectual Property Rights</h2>

          <h3>5.1 H&amp;S Proprietary Content</h3>

          <p>The Platform and all content, features, and functionality—including but not limited to assessment frameworks and methodologies, the Pure Signal Revolution™ approach, ICP generation processes, business case templates, and all text, graphics, and trademarks—are owned by H&amp;S and protected by intellectual property laws.</p>

          <h3>5.2 User Data Ownership</h3>

          <p><strong>You own your data.</strong> Specifically:</p>

          <ul>
            <li><strong>Your Input Data:</strong> All information you provide through assessments, profiles, and platform interactions remains your property</li>
            <li><strong>Your Business Information:</strong> All company data, strategic plans, financial information, and customer details belong to you</li>
            <li><strong>Generated Outputs:</strong> Reports, recommendations, and analysis generated based on your input are licensed to you for your use</li>
          </ul>

          <p><strong>We will NEVER:</strong></p>

          <ul>
            <li>Sell your individual business data to third parties</li>
            <li>Share your confidential information without explicit permission</li>
            <li>Use your data to benefit competitors</li>
          </ul>

          <hr />

          <h2>6. Disclaimer of Warranties</h2>

          <p><strong>READ CAREFULLY:</strong></p>

          <p>THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>

          <ul>
            <li><strong>Accuracy of Information:</strong> We cannot guarantee that assessments, recommendations, or analysis are error-free or will produce specific results</li>
            <li><strong>Business Outcomes:</strong> We do not warrant that using the Platform will increase revenue, improve conversion rates, or achieve any particular business objective</li>
            <li><strong>Continuous Availability:</strong> We do not guarantee uninterrupted or error-free operation</li>
          </ul>

          <hr />

          <h2>7. Limitation of Liability</h2>

          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>

          <p>H&amp;S SHALL NOT BE LIABLE FOR indirect, incidental, or consequential damages, including lost profits, lost revenue, lost business opportunities, or business interruption.</p>

          <p>OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE AMOUNT YOU PAID TO H&amp;S IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>

          <hr />

          <h2>8. Contact Information</h2>

          <p><strong>General Inquiries:</strong> geter@humusnshore.org</p>

          <hr />

          <h2>Acknowledgment</h2>

          <p>BY CLICKING &quot;I ACCEPT,&quot; CREATING AN ACCOUNT, OR USING THE PLATFORM, YOU ACKNOWLEDGE THAT:</p>

          <ol>
            <li>You have read and understood these Terms</li>
            <li>You agree to be bound by these Terms</li>
            <li>You understand this is a Beta platform with inherent limitations</li>
            <li>You acknowledge the disclaimer of warranties and limitation of liability</li>
          </ol>

          <p><strong>If you do not agree to these Terms, do not use the Platform.</strong></p>

          <hr />

          <p><em>These Terms of Service are drafted to balance legal protection with H&amp;S&apos;s values of Clarity and Authenticity. While comprehensive, they are designed to be readable and honest about both our commitments and limitations.</em></p>
        </motion.div>
      </div>
    </div>
  );
}

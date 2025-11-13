import { notFound } from 'next/navigation';
import scenarios from '@/data/scenarios.json';
import ICPPageClient from './ICPPageClient';

// Server Component - scenarios.json loaded server-side only
export default async function ICPScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = scenarios.find((s) => s.slug === slug);

  if (!scenario) {
    notFound();
  }

  // Pass scenario data to Client Component for tracking
  return <ICPPageClient scenario={scenario} />;
}

// Generate static params for all scenarios (optional - for static generation)
export async function generateStaticParams() {
  return scenarios.map((scenario) => ({
    slug: scenario.slug,
  }));
}

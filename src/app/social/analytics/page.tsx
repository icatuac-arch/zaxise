import { BarChart3 } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function AnalyticsPage() {
  return (
    <FeatureDetailPage
      icon={BarChart3}
      title="Analytics Dashboard"
      tagline="Track engagement, reach, and growth with beautiful visual reports."
      description="Make data-driven decisions with comprehensive analytics across all your social platforms."
      gradient="from-cyan-500 to-blue-600"
      color="#06B6D4"
      highlights={[
        'Real-time engagement metrics across all platforms',
        'Follower growth tracking with trend analysis',
        'Best-performing content identification',
        'Audience demographics and behavior insights',
        'Custom date range comparisons',
        'Exportable reports in PDF and CSV formats',
        'Weekly email report summaries',
      ]}
      details={[
        { title: 'Cross-Platform Metrics', desc: 'See likes, comments, shares, clicks, and impressions from every platform in one unified dashboard.' },
        { title: 'Growth Charts', desc: 'Track follower growth over time with beautiful, interactive charts. Identify what drives spikes in growth.' },
        { title: 'Content Performance', desc: 'Rank your posts by engagement rate to understand what content resonates most with your audience.' },
        { title: 'Audience Insights', desc: 'Understand your audience demographics — age, location, active hours — to create more targeted content.' },
        { title: 'Automated Reports', desc: 'Get weekly performance summaries delivered to your inbox. Share branded reports with clients or stakeholders.' },
        { title: 'ROI Tracking', desc: 'Connect your goals and track how social media efforts translate into website visits, leads, and conversions.' },
      ]}
    />
  );
}

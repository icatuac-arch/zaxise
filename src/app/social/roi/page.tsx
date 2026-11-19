import { DollarSign } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function ROIPage() {
  return (
    <FeatureDetailPage
      icon={DollarSign}
      title="ROI Tracking"
      tagline="Finally measure the actual revenue your social media efforts generate. Track sales, leads, and conversions from every post."
      description="Stop guessing whether social media is working. Our ROI tracking connects your posts directly to revenue, showing you exactly which content drives sales and which falls flat."
      gradient="from-emerald-500 to-green-600"
      color="#10B981"
      highlights={[
        'Track actual sales and leads generated from social posts',
        'Built-in UTM link builder with auto-tagging',
        'See which posts, platforms, and campaigns drive the most revenue',
        'Monthly and weekly ROI summary reports',
        'Built-in UTM link builder for tracking traffic sources',
        'Cost-per-lead and cost-per-acquisition calculations',
        'Custom conversion goals and tracking pixels',
        'Exportable reports for stakeholders and clients',
      ]}
      details={[
        { title: 'Revenue Attribution', desc: 'Connect social media activity directly to revenue. See which posts, stories, and campaigns actually drive purchases and signups.' },
        { title: 'UTM Link Builder', desc: 'Generate UTM-tagged links with one click. Auto-apply campaign parameters so every link is trackable without manual work.' },
        { title: 'Conversion Tracking', desc: 'Set up custom conversion goals — purchases, signups, downloads, form fills. Track them all from your SocialMarketly dashboard.' },
        { title: 'Monthly ROI Reports', desc: 'Automated monthly reports showing total revenue attributed to social, cost per acquisition, and ROI percentage. Share with your team or clients.' },
        { title: 'Platform Comparison', desc: 'See which platforms deliver the best ROI. Reallocate your effort to the channels that actually drive results.' },
        { title: 'Traffic Attribution', desc: 'Use UTM-tagged links to understand which social posts drive the most traffic to your website or online store.' },
      ]}
    />
  );
}

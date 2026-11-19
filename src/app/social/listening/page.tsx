import { Ear } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function ListeningPage() {
  return (
    <FeatureDetailPage
      icon={Ear}
      title="Social Listening"
      tagline="Monitor every mention of your brand across the internet. Track competitors, analyze sentiment, and never miss a conversation about you."
      description="Know what people are saying about your brand in real time. Our social listening engine scans platforms, blogs, forums, and news sites to surface every mention that matters."
      gradient="from-cyan-500 to-teal-600"
      color="#06B6D4"
      highlights={[
        'Monitor brand mentions across all major social platforms',
        'Track competitor keywords and campaigns',
        'AI-powered sentiment analysis (positive, neutral, negative)',
        'Real-time alerts via email, Slack, or in-app notifications',
        'Trend detection for emerging topics in your niche',
        'Share of voice analysis vs competitors',
        'Historical data and trend reports',
        'Custom keyword and phrase tracking',
      ]}
      details={[
        { title: 'Brand Monitoring', desc: 'Track every mention of your brand, products, or team across social media, blogs, forums, and news sites. Nothing slips through.' },
        { title: 'Sentiment Analysis', desc: 'AI classifies each mention as positive, neutral, or negative. Spot PR crises early and amplify positive buzz.' },
        { title: 'Competitor Tracking', desc: 'Monitor what people say about your competitors. Identify their strengths, weaknesses, and opportunities you can capitalize on.' },
        { title: 'Real-Time Alerts', desc: 'Get instant notifications when your brand is mentioned. Choose email, Slack, or push notifications — you decide the threshold.' },
        { title: 'Trend Detection', desc: 'Discover trending topics and hashtags in your industry before they peak. Jump on trends early for maximum visibility.' },
        { title: 'Share of Voice', desc: 'See how your brand stacks up against competitors in terms of mentions, reach, and sentiment. Track progress over time.' },
      ]}
    />
  );
}

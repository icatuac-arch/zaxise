import { Compass } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function ContentDiscoveryPage() {
  return (
    <FeatureDetailPage
      icon={Compass}
      title="Content Discovery"
      tagline="Never run out of ideas. Discover trending topics, holidays, RSS feeds, and content inspiration tailored to your niche."
      description="Content block is a thing of the past. Our discovery engine surfaces trending topics, upcoming holidays, curated RSS feeds, and AI-powered content ideas so you always have something great to post."
      gradient="from-indigo-500 to-purple-600"
      color="#6366F1"
      highlights={[
        'Holiday calendar with 500+ national and international days',
        'RSS feed integration — curate content from your favorite sources',
        'Trending topics in your niche, updated hourly',
        'AI-powered content inspiration engine',
        'Curated content suggestions based on your audience',
        'Save ideas to your content library for later',
        'One-click draft creation from any idea',
        'Custom topic alerts and keyword monitoring',
      ]}
      details={[
        { title: 'Holiday Calendar', desc: 'Never miss National Coffee Day, World Mental Health Day, or any trending holiday. Browse 500+ days with post ideas for each one.' },
        { title: 'RSS Feed Integration', desc: 'Connect RSS feeds from industry blogs, news sites, and publications. Curate the best articles and share them with your audience.' },
        { title: 'Trending Topics', desc: 'See what\'s trending in your niche right now. Our engine scans social platforms, news, and search trends to surface opportunities.' },
        { title: 'Content Inspiration', desc: 'AI analyzes your best-performing content and suggests new ideas in the same style. Get captions, hooks, and post formats ready to use.' },
        { title: 'Content Library', desc: 'Save ideas, articles, and inspiration to your personal content library. Organize with tags and access them when you\'re ready to create.' },
        { title: 'Quick Draft', desc: 'Found something inspiring? Turn it into a draft with one click. Add your own spin, attach media, and schedule — all in seconds.' },
      ]}
    />
  );
}

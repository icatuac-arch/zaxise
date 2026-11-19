import { Hash } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function HashtagsPage() {
  return (
    <FeatureDetailPage
      icon={Hash}
      title="Hashtag Research"
      tagline="Find trending hashtags. Track performance. Save groups for quick access."
      description="Maximize your reach with data-driven hashtag strategies that put your content in front of the right audience."
      gradient="from-sky-500 to-cyan-600"
      color="#0EA5E9"
      highlights={[
        'Discover trending hashtags in your niche',
        'Track hashtag performance over time',
        'Save hashtag groups for quick reuse',
        'Hashtag difficulty and competition scores',
        'Related hashtag suggestions',
        'Banned hashtag warnings to protect your reach',
        'Copy hashtag groups with one click',
        'Platform-specific hashtag recommendations',
      ]}
      details={[
        { title: 'Trending Discovery', desc: 'Find hashtags that are trending right now in your industry. Get ahead of trends before they peak.' },
        { title: 'Performance Tracking', desc: 'See how each hashtag performs for your posts. Track reach, impressions, and engagement by hashtag.' },
        { title: 'Saved Groups', desc: 'Create and save hashtag sets for different content types. Apply them to new posts with a single click.' },
        { title: 'Competition Analysis', desc: 'See how many posts use each hashtag. Find the sweet spot between popularity and competition.' },
        { title: 'Banned Tag Alerts', desc: 'Instagram and other platforms shadow-ban certain hashtags. We warn you before you accidentally use one.' },
        { title: 'Smart Mix Strategy', desc: 'Our AI suggests a mix of high-volume, medium, and niche hashtags for optimal discoverability.' },
      ]}
    />
  );
}

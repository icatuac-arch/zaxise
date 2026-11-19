import { Sparkles } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function AIWriterPage() {
  return (
    <FeatureDetailPage
      icon={Sparkles}
      title="AI Content Creator"
      tagline="Generate captions, hashtags, and post ideas with AI. Never face writer's block again."
      description="Our AI understands social media. It writes content that engages, converts, and grows your audience."
      gradient="from-pink-500 to-rose-600"
      color="#EC4899"
      highlights={[
        'Generate captions for any platform in seconds',
        'AI-suggested hashtags based on trending topics',
        'Content ideas tailored to your niche and audience',
        'Multiple tone options: professional, casual, witty, inspiring',
        'Auto-generate alt text for accessibility',
        'Repurpose content across platforms with AI reformatting',
        'Post idea calendar with AI-generated content themes',
        '10 free AI generations per day on the free plan',
      ]}
      details={[
        { title: 'Smart Captions', desc: 'Describe your post in a few words and our AI generates engaging captions with calls-to-action, emojis, and hashtags.' },
        { title: 'Hashtag Generator', desc: 'Get AI-recommended hashtags based on your content, niche, and current trends. Mix popular and niche tags for optimal reach.' },
        { title: 'Content Ideas Engine', desc: 'Running out of ideas? Our AI suggests post concepts, content series, and trending topics specific to your industry.' },
        { title: 'Tone & Style Control', desc: 'Choose from professional, casual, humorous, inspirational, or educational tones. The AI adapts to match your brand voice.' },
        { title: 'Multi-Platform Repurposing', desc: 'Turn one piece of content into posts for every platform. The AI adjusts length, format, and style automatically.' },
        { title: 'A/B Variations', desc: 'Generate multiple caption variations to test which performs best. Use data to refine your content strategy over time.' },
      ]}
    />
  );
}

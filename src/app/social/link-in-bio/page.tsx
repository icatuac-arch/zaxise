import { LinkIcon } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function LinkInBioPage() {
  return (
    <FeatureDetailPage
      icon={LinkIcon}
      title="Link in Bio"
      tagline="Create a beautiful, customizable landing page for your bio link. Unlimited links, full analytics, and your branding — free forever."
      description="Ditch Linktree. Build a stunning link-in-bio page that matches your brand, tracks every click, and costs nothing. Add unlimited links, embed videos, and customize every detail."
      gradient="from-pink-500 to-rose-600"
      color="#EC4899"
      highlights={[
        'Beautiful, customizable landing page for your bio link',
        'Unlimited links with no restrictions',
        'Click analytics and visitor tracking',
        'Multiple themes and custom color palettes',
        'Add your logo, brand colors, and custom fonts',
        'Embed videos, music, and social feeds',
        'Priority links and featured sections',
        'Custom domain support (use your own URL)',
      ]}
      details={[
        { title: 'Beautiful Themes', desc: 'Choose from dozens of professionally designed themes or customize every pixel. Gradients, animations, dark mode — make it yours.' },
        { title: 'Unlimited Links', desc: 'No link limits, ever. Add as many links as you need — products, social profiles, blog posts, merch, music, videos, anything.' },
        { title: 'Click Analytics', desc: 'See how many people visit your page, which links get the most clicks, and where your traffic comes from. Real-time data.' },
        { title: 'Custom Branding', desc: 'Upload your logo, set your brand colors, choose custom fonts. Your link-in-bio page should feel like an extension of your brand.' },
        { title: 'Media Embeds', desc: 'Embed YouTube videos, Spotify tracks, TikToks, and Instagram posts directly on your page. Create a rich, interactive experience.' },
        { title: 'Custom Domain', desc: 'Use your own domain name instead of a SocialMarketly URL. Full white-label experience for professionals and brands.' },
      ]}
    />
  );
}

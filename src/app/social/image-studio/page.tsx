import { Palette } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function ImageStudioPage() {
  return (
    <FeatureDetailPage
      icon={Palette}
      title="Image Studio"
      tagline="Edit, resize, add text to images. Templates for every platform."
      description="Create scroll-stopping visuals without leaving SocialMarketly. No Canva subscription needed."
      gradient="from-rose-500 to-pink-600"
      color="#F43F5E"
      highlights={[
        'Built-in image editor with filters and adjustments',
        'Auto-resize for every platform (IG Story, Feed, Reel, etc.)',
        'Text overlay with custom fonts and styles',
        'Platform-optimized templates library',
        'Brand kit with saved colors, fonts, and logos',
        'Image library with free stock photos',
        'Batch editing for multiple images',
        'Export in optimal formats and sizes',
      ]}
      details={[
        { title: 'Smart Resize', desc: 'Upload one image and auto-resize it for Instagram Feed, Story, Reel, Facebook Post, X Post, LinkedIn, and more.' },
        { title: 'Template Library', desc: 'Hundreds of professionally designed templates for quotes, promotions, announcements, and more. Customize in seconds.' },
        { title: 'Text & Typography', desc: 'Add text overlays with beautiful fonts, shadows, and effects. Create quote posts and announcement graphics.' },
        { title: 'Brand Kit', desc: 'Save your brand colors, fonts, and logos. Apply them to any template or image with one click for consistent branding.' },
        { title: 'Filters & Effects', desc: 'Apply Instagram-style filters, adjust brightness, contrast, saturation, and more. Make every image on-brand.' },
        { title: 'Free Stock Photos', desc: 'Access thousands of free, high-quality stock photos directly within the editor. No attribution required.' },
      ]}
    />
  );
}

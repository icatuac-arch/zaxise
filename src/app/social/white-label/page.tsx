import { Building2 } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function WhiteLabelPage() {
  return (
    <FeatureDetailPage
      icon={Building2}
      title="White Label"
      tagline="Remove SocialMarketly branding and present the platform as your own. Perfect for agencies who want to impress clients."
      description="Build your agency's reputation with white-label reports, dashboards, and client portals. Add your logo, colors, and domain — clients see your brand, not ours."
      gradient="from-slate-500 to-zinc-600"
      color="#64748B"
      highlights={[
        'Custom branding on all reports and dashboards',
        'Client portal with your agency\'s logo and colors',
        'Remove all SocialMarketly branding',
        'Custom domain for client access',
        'Branded PDF report exports',
        'White-label email notifications',
        'Custom onboarding flow for new clients',
        'Agency-branded mobile experience',
      ]}
      details={[
        { title: 'Branded Reports', desc: 'Generate PDF and web reports with your agency\'s logo, colors, and contact info. Clients see professional reports that build trust in your brand.' },
        { title: 'Client Portal', desc: 'Give clients their own login to view analytics, approve content, and communicate — all under your agency\'s branding.' },
        { title: 'Custom Domain', desc: 'Host the client portal on your own domain (e.g., app.youragency.com). Full white-label experience with SSL included.' },
        { title: 'Remove Our Branding', desc: 'Every trace of SocialMarketly disappears. Emails, dashboards, reports, login pages — everything shows your brand.' },
        { title: 'Branded Notifications', desc: 'Email notifications to clients come from your domain and show your logo. Maintain a consistent brand experience at every touchpoint.' },
        { title: 'Custom Onboarding', desc: 'Create a branded onboarding flow for new clients. Set up welcome emails, tutorials, and getting-started guides with your branding.' },
      ]}
    />
  );
}

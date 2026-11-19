import { Inbox } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function InboxPage() {
  return (
    <FeatureDetailPage
      icon={Inbox}
      title="Social Inbox"
      tagline="One unified inbox for every DM, comment, and mention across all your platforms. Never miss a conversation again."
      description="Stop switching between apps. See and respond to every message, comment, and mention from Instagram, Facebook, X, LinkedIn, TikTok, and more — all in one beautifully organized inbox."
      gradient="from-violet-500 to-indigo-600"
      color="#7C3AED"
      highlights={[
        'Unified inbox for DMs, comments, and mentions from all platforms',
        'Smart labels to auto-categorize messages (support, sales, spam)',
        'Assign conversations to team members with one click',
        'Mark conversations as resolved, snoozed, or starred',
        'Keyboard shortcuts for lightning-fast responses',
        'Saved replies and response templates',
        'Real-time notifications for new messages',
        'Filter by platform, label, assignee, or status',
      ]}
      details={[
        { title: 'All Platforms, One View', desc: 'Instagram DMs, Facebook comments, X mentions, LinkedIn messages, TikTok comments — everything streams into a single, clean timeline.' },
        { title: 'Smart Labels', desc: 'AI automatically tags incoming messages as support requests, sales inquiries, compliments, or spam so you can prioritize what matters.' },
        { title: 'Team Assignment', desc: 'Assign conversations to specific team members. See who\'s handling what. Never let a customer message fall through the cracks.' },
        { title: 'Saved Replies', desc: 'Create reusable response templates for common questions. Insert them with a shortcut and personalize before sending.' },
        { title: 'Conversation History', desc: 'See the full history of every conversation in context — even across platforms. Know exactly what was said and when.' },
        { title: 'Resolution Tracking', desc: 'Mark conversations as resolved and track response times. Generate reports on your team\'s customer service performance.' },
      ]}
    />
  );
}

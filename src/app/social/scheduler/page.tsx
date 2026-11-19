import { Calendar } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function SchedulerPage() {
  return (
    <FeatureDetailPage
      icon={Calendar}
      title="Smart Scheduler"
      tagline="Schedule posts across every platform. AI picks the best times for maximum engagement."
      description="Automate your entire social media workflow with intelligent scheduling that adapts to your audience."
      gradient="from-violet-500 to-purple-600"
      color="#7C3AED"
      highlights={[
        'AI-optimized posting times based on your audience activity',
        'Bulk schedule up to 50 posts at once',
        'Queue management with drag-and-drop reordering',
        'Auto-posting across Instagram, Facebook, X, LinkedIn, TikTok, YouTube, Pinterest',
        'Recurring post schedules for evergreen content',
        'Time zone detection for global audiences',
        'Post preview for each platform before publishing',
        'Calendar integration with Google Calendar and Outlook',
      ]}
      details={[
        { title: 'Best Time Suggestions', desc: 'Our AI analyzes your audience engagement patterns and suggests optimal posting times for each platform.' },
        { title: 'Bulk Upload', desc: 'Upload a CSV or spreadsheet of posts to schedule weeks of content in minutes. Perfect for agencies.' },
        { title: 'Queue System', desc: 'Set up a posting queue and add content anytime. Posts go out at pre-set optimal times automatically.' },
        { title: 'Platform Preview', desc: 'See exactly how your post will look on each platform before it goes live. Avoid formatting surprises.' },
        { title: 'Recurring Posts', desc: 'Set posts to repeat daily, weekly, or monthly. Great for promotions, reminders, and evergreen content.' },
        { title: 'Drafts & Approval', desc: 'Save drafts, share with your team for review, and set up approval workflows before publishing.' },
      ]}
    />
  );
}

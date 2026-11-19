import { LayoutGrid } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function CalendarPage() {
  return (
    <FeatureDetailPage
      icon={LayoutGrid}
      title="Content Calendar"
      tagline="Visual drag-and-drop calendar. See your entire content strategy at a glance."
      description="Plan weeks and months of content with a beautiful, intuitive calendar that keeps your strategy organized."
      gradient="from-indigo-500 to-violet-600"
      color="#6366F1"
      highlights={[
        'Drag-and-drop posts to reschedule instantly',
        'Monthly, weekly, and daily calendar views',
        'Color-coded by platform or content type',
        'Content templates for repeating formats',
        'Filter by platform, status, or team member',
        'Notes and internal comments on each post',
        'Export calendar as image or PDF',
        'Shared team calendar with real-time updates',
      ]}
      details={[
        { title: 'Drag-and-Drop Interface', desc: 'Move posts around your calendar with simple drag-and-drop. Reschedule in seconds without editing each post individually.' },
        { title: 'Multi-View Calendar', desc: 'Switch between month, week, and day views. Zoom in for details or zoom out for the big-picture strategy.' },
        { title: 'Color Coding', desc: 'Assign colors by platform, content type, campaign, or team member. Spot gaps and overlaps at a glance.' },
        { title: 'Content Templates', desc: 'Save post templates for recurring content types — weekly tips, product features, behind-the-scenes, etc.' },
        { title: 'Team Collaboration', desc: 'Share calendars with your team. Everyone sees the plan, can add posts, and coordinate without overlap.' },
        { title: 'Holiday & Events Calendar', desc: 'Built-in calendar of social media holidays and trending events. Never miss a relevant occasion to post about.' },
      ]}
    />
  );
}

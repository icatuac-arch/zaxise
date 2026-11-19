import { Users } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function TeamPage() {
  return (
    <FeatureDetailPage
      icon={Users}
      title="Team Collaboration"
      tagline="Invite your team. Assign roles. Approval workflows. Built for agencies and brands."
      description="Work together seamlessly with tools designed for teams of all sizes — from duos to large agencies."
      gradient="from-emerald-500 to-teal-600"
      color="#10B981"
      highlights={[
        'Role-based access control (Admin, Editor, Viewer)',
        'Post approval workflows with review queues',
        'Internal comments and notes on each post',
        'Activity logs for full accountability',
        'Team notifications and alerts',
        'Client workspaces for agency management',
        'Shared asset library for brand consistency',
        'Unlimited team members — all free',
      ]}
      details={[
        { title: 'Role Management', desc: 'Assign Admin, Editor, or Viewer roles. Control who can publish, who can draft, and who can only view content.' },
        { title: 'Approval Workflows', desc: 'Set up multi-step approval chains. Content moves from draft to review to approved before publishing.' },
        { title: 'Internal Comments', desc: 'Leave feedback directly on posts. Tag team members, suggest edits, and resolve comments — all in context.' },
        { title: 'Activity Feed', desc: 'See who did what and when. Full audit trail for every action — edits, approvals, publishes, and more.' },
        { title: 'Client Workspaces', desc: 'Agencies can create separate workspaces for each client. Switch between clients without logging out.' },
        { title: 'Shared Asset Library', desc: 'Upload logos, brand colors, approved images, and templates. Everyone on the team has access to the right assets.' },
      ]}
    />
  );
}

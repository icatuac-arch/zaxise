import { Upload } from 'lucide-react';
import FeatureDetailPage from '@/components/social/FeatureDetailPage';

export default function BulkUploadPage() {
  return (
    <FeatureDetailPage
      icon={Upload}
      title="Bulk Upload"
      tagline="Schedule an entire month of content in minutes. Import from CSV, map your columns, preview everything, and publish."
      description="Stop scheduling one post at a time. Upload a spreadsheet with a month of content and let SocialMarketly handle the rest — platform formatting, image attachments, and scheduling all at once."
      gradient="from-amber-500 to-orange-600"
      color="#F59E0B"
      highlights={[
        'Schedule a full month of content in under 5 minutes',
        'CSV and spreadsheet import (Excel, Google Sheets)',
        'Smart column mapping — auto-detect fields',
        'Preview every post before publishing',
        'Attach images and videos via URL or upload',
        'Set per-post platform targeting',
        'Bulk edit after import — change dates, captions, platforms',
        'Download a template spreadsheet to get started instantly',
      ]}
      details={[
        { title: 'CSV Import', desc: 'Export from any tool, spreadsheet, or content calendar — then import directly into SocialMarketly. We support CSV, XLSX, and Google Sheets links.' },
        { title: 'Smart Column Mapping', desc: 'Our system auto-detects your columns (date, caption, image URL, platform, hashtags). Just confirm and import — no tedious manual mapping.' },
        { title: 'Preview Before Publishing', desc: 'See exactly how each post will look on every platform before it goes live. Fix issues in bulk before anything is scheduled.' },
        { title: 'Media Attachments', desc: 'Include image and video URLs in your spreadsheet, or upload a ZIP of media files. We match them to your posts automatically.' },
        { title: 'Bulk Editing', desc: 'After import, edit any post in bulk — change dates, rewrite captions, swap images, or reassign platforms. Full control before scheduling.' },
        { title: 'Template Download', desc: 'Download our pre-built spreadsheet template with all the right columns. Fill it in and import — the fastest way to get started.' },
      ]}
    />
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Wrench } from 'lucide-react';

// Tool relationships — maps tool slugs to related tool slugs
const RELATED_TOOLS: Record<string, { name: string; href: string; desc: string }[]> = {
  // ── PDF Tools ──
  'pdf-merge': [
    { name: 'PDF Split', href: '/tools/pdf-split', desc: 'Extract pages from PDF' },
    { name: 'PDF Compress', href: '/tools/pdf-compress', desc: 'Reduce PDF file size' },
    { name: 'PDF to Image', href: '/tools/pdf-to-image', desc: 'Convert PDF to images' },
  ],
  'pdf-split': [
    { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
    { name: 'PDF Rotate', href: '/tools/pdf-rotate', desc: 'Rotate PDF pages' },
    { name: 'PDF Reorder', href: '/tools/pdf-reorder', desc: 'Reorder PDF pages' },
  ],
  'pdf-compress': [
    { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
    { name: 'Image Compress', href: '/tools/image-compress', desc: 'Reduce image file size' },
    { name: 'PDF to Text', href: '/tools/pdf-to-text', desc: 'Extract text from PDF' },
  ],
  'pdf-rotate': [
    { name: 'PDF Reorder', href: '/tools/pdf-reorder', desc: 'Reorder PDF pages' },
    { name: 'PDF Split', href: '/tools/pdf-split', desc: 'Extract pages from PDF' },
    { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
  ],
  'pdf-reorder': [
    { name: 'PDF Rotate', href: '/tools/pdf-rotate', desc: 'Rotate PDF pages' },
    { name: 'PDF Split', href: '/tools/pdf-split', desc: 'Extract pages from PDF' },
    { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
  ],
  'pdf-to-image': [
    { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
    { name: 'Image to PDF', href: '/tools/image-to-pdf', desc: 'Convert images to PDF' },
    { name: 'SVG to PNG', href: '/tools/svg-to-png', desc: 'Convert SVG to PNG' },
  ],
  'pdf-to-text': [
    { name: 'PDF Compress', href: '/tools/pdf-compress', desc: 'Reduce PDF file size' },
    { name: 'PDF Split', href: '/tools/pdf-split', desc: 'Extract pages from PDF' },
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
  ],
  'pdf-watermark': [
    { name: 'Image Watermark', href: '/tools/image-watermark', desc: 'Add watermark to images' },
    { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
    { name: 'PDF Compress', href: '/tools/pdf-compress', desc: 'Reduce PDF file size' },
  ],
  'image-to-pdf': [
    { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
    { name: 'PDF to Image', href: '/tools/pdf-to-image', desc: 'Convert PDF to images' },
    { name: 'Image Compress', href: '/tools/image-compress', desc: 'Reduce image file size' },
  ],

  // ── Image Tools ──
  'image-resize': [
    { name: 'Image Compress', href: '/tools/image-compress', desc: 'Reduce image file size' },
    { name: 'Image Crop', href: '/tools/image-crop', desc: 'Crop images precisely' },
    { name: 'Image Convert', href: '/tools/image-convert', desc: 'Convert image formats' },
  ],
  'image-compress': [
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'PDF Compress', href: '/tools/pdf-compress', desc: 'Reduce PDF file size' },
    { name: 'Image Convert', href: '/tools/image-convert', desc: 'Convert image formats' },
  ],
  'image-crop': [
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'Aspect Ratio', href: '/tools/aspect-ratio', desc: 'Calculate aspect ratios' },
    { name: 'Passport Photo', href: '/tools/passport-photo', desc: 'Create passport photos' },
  ],
  'image-convert': [
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'SVG to PNG', href: '/tools/svg-to-png', desc: 'Convert SVG to PNG' },
    { name: 'Image Compress', href: '/tools/image-compress', desc: 'Reduce image file size' },
  ],
  'image-collage': [
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'Image Crop', href: '/tools/image-crop', desc: 'Crop images precisely' },
    { name: 'Image Watermark', href: '/tools/image-watermark', desc: 'Add watermark to images' },
  ],
  'image-watermark': [
    { name: 'PDF Watermark', href: '/tools/pdf-watermark', desc: 'Add watermark to PDFs' },
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'Image Compress', href: '/tools/image-compress', desc: 'Reduce image file size' },
  ],
  'remove-bg': [
    { name: 'Image Crop', href: '/tools/image-crop', desc: 'Crop images precisely' },
    { name: 'Image Convert', href: '/tools/image-convert', desc: 'Convert image formats' },
    { name: 'Passport Photo', href: '/tools/passport-photo', desc: 'Create passport photos' },
  ],
  'passport-photo': [
    { name: 'Image Crop', href: '/tools/image-crop', desc: 'Crop images precisely' },
    { name: 'Remove Background', href: '/tools/remove-bg', desc: 'Remove image backgrounds' },
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
  ],
  'svg-to-png': [
    { name: 'Image Convert', href: '/tools/image-convert', desc: 'Convert image formats' },
    { name: 'Favicon Generator', href: '/tools/favicon', desc: 'Create favicons' },
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
  ],
  'screenshot-mockup': [
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'Image Crop', href: '/tools/image-crop', desc: 'Crop images precisely' },
    { name: 'Color Picker', href: '/tools/color-picker', desc: 'Pick and convert colors' },
  ],
  'aspect-ratio': [
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'Image Crop', href: '/tools/image-crop', desc: 'Crop images precisely' },
    { name: 'Image Convert', href: '/tools/image-convert', desc: 'Convert image formats' },
  ],
  'favicon': [
    { name: 'SVG to PNG', href: '/tools/svg-to-png', desc: 'Convert SVG to PNG' },
    { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
    { name: 'Color Picker', href: '/tools/color-picker', desc: 'Pick and convert colors' },
  ],

  // ── Developer Tools ──
  'json-formatter': [
    { name: 'CSV to JSON', href: '/tools/csv-json', desc: 'Convert CSV and JSON' },
    { name: 'Base64 Encoder', href: '/tools/base64', desc: 'Encode and decode Base64' },
    { name: 'URL Encoder', href: '/tools/url-encode', desc: 'Encode and decode URLs' },
  ],
  'base64': [
    { name: 'URL Encoder', href: '/tools/url-encode', desc: 'Encode and decode URLs' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
    { name: 'UUID Generator', href: '/tools/uuid-generator', desc: 'Generate UUIDs' },
  ],
  'url-encode': [
    { name: 'Base64 Encoder', href: '/tools/base64', desc: 'Encode and decode Base64' },
    { name: 'Slug Generator', href: '/tools/slug-generator', desc: 'Generate URL slugs' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
  ],
  'csv-json': [
    { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
    { name: 'HTML to Markdown', href: '/tools/html-to-markdown', desc: 'Convert HTML to Markdown' },
    { name: 'Base64 Encoder', href: '/tools/base64', desc: 'Encode and decode Base64' },
  ],
  'regex-tester': [
    { name: 'Find & Replace', href: '/tools/find-replace', desc: 'Find and replace text' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
    { name: 'Diff Checker', href: '/tools/diff-checker', desc: 'Compare text differences' },
  ],
  'uuid-generator': [
    { name: 'Password Generator', href: '/tools/password-gen', desc: 'Generate secure passwords' },
    { name: 'Base64 Encoder', href: '/tools/base64', desc: 'Encode and decode Base64' },
    { name: 'Slug Generator', href: '/tools/slug-generator', desc: 'Generate URL slugs' },
  ],
  'cron-builder': [
    { name: 'Regex Tester', href: '/tools/regex-tester', desc: 'Test regular expressions' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
    { name: 'World Clock', href: '/tools/world-clock', desc: 'View times across zones' },
  ],
  'slug-generator': [
    { name: 'URL Encoder', href: '/tools/url-encode', desc: 'Encode and decode URLs' },
    { name: 'Case Converter', href: '/tools/case-converter', desc: 'Convert text case' },
    { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum', desc: 'Generate placeholder text' },
  ],
  'html-to-markdown': [
    { name: 'Markdown Preview', href: '/tools/markdown-preview', desc: 'Preview Markdown live' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
    { name: 'CSV to JSON', href: '/tools/csv-json', desc: 'Convert CSV and JSON' },
  ],
  'markdown-preview': [
    { name: 'HTML to Markdown', href: '/tools/html-to-markdown', desc: 'Convert HTML to Markdown' },
    { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum', desc: 'Generate placeholder text' },
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
  ],
  'qr-generator': [
    { name: 'URL Encoder', href: '/tools/url-encode', desc: 'Encode and decode URLs' },
    { name: 'Base64 Encoder', href: '/tools/base64', desc: 'Encode and decode Base64' },
    { name: 'Password Generator', href: '/tools/password-gen', desc: 'Generate secure passwords' },
  ],

  // ── CSS / Design Tools ──
  'color-picker': [
    { name: 'CSS Gradient', href: '/tools/css-gradient', desc: 'Create CSS gradients' },
    { name: 'Box Shadow', href: '/tools/box-shadow', desc: 'Generate box shadows' },
    { name: 'Favicon Generator', href: '/tools/favicon', desc: 'Create favicons' },
  ],
  'css-gradient': [
    { name: 'Color Picker', href: '/tools/color-picker', desc: 'Pick and convert colors' },
    { name: 'Box Shadow', href: '/tools/box-shadow', desc: 'Generate box shadows' },
    { name: 'Screenshot Mockup', href: '/tools/screenshot-mockup', desc: 'Create device mockups' },
  ],
  'box-shadow': [
    { name: 'CSS Gradient', href: '/tools/css-gradient', desc: 'Create CSS gradients' },
    { name: 'Color Picker', href: '/tools/color-picker', desc: 'Pick and convert colors' },
    { name: 'Favicon Generator', href: '/tools/favicon', desc: 'Create favicons' },
  ],

  // ── Text Tools ──
  'text-counter': [
    { name: 'Case Converter', href: '/tools/case-converter', desc: 'Convert text case' },
    { name: 'Find & Replace', href: '/tools/find-replace', desc: 'Find and replace text' },
    { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum', desc: 'Generate placeholder text' },
  ],
  'case-converter': [
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
    { name: 'Slug Generator', href: '/tools/slug-generator', desc: 'Generate URL slugs' },
    { name: 'Find & Replace', href: '/tools/find-replace', desc: 'Find and replace text' },
  ],
  'find-replace': [
    { name: 'Regex Tester', href: '/tools/regex-tester', desc: 'Test regular expressions' },
    { name: 'Diff Checker', href: '/tools/diff-checker', desc: 'Compare text differences' },
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
  ],
  'diff-checker': [
    { name: 'Text Diff', href: '/tools/text-diff', desc: 'Compare two texts' },
    { name: 'Find & Replace', href: '/tools/find-replace', desc: 'Find and replace text' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
  ],
  'text-diff': [
    { name: 'Diff Checker', href: '/tools/diff-checker', desc: 'Compare text differences' },
    { name: 'Find & Replace', href: '/tools/find-replace', desc: 'Find and replace text' },
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
  ],
  'lorem-ipsum': [
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
    { name: 'Markdown Preview', href: '/tools/markdown-preview', desc: 'Preview Markdown live' },
    { name: 'Case Converter', href: '/tools/case-converter', desc: 'Convert text case' },
  ],

  // ── Security Tools ──
  'password-gen': [
    { name: 'UUID Generator', href: '/tools/uuid-generator', desc: 'Generate UUIDs' },
    { name: 'Base64 Encoder', href: '/tools/base64', desc: 'Encode and decode Base64' },
    { name: 'QR Generator', href: '/tools/qr-generator', desc: 'Create QR codes' },
  ],

  // ── Time Tools ──
  'world-clock': [
    { name: 'Pomodoro Timer', href: '/tools/pomodoro', desc: 'Focus with Pomodoro' },
    { name: 'Stopwatch', href: '/tools/stopwatch', desc: 'Track elapsed time' },
    { name: 'Cron Builder', href: '/tools/cron-builder', desc: 'Build cron expressions' },
  ],
  'pomodoro': [
    { name: 'Stopwatch', href: '/tools/stopwatch', desc: 'Track elapsed time' },
    { name: 'World Clock', href: '/tools/world-clock', desc: 'View times across zones' },
    { name: 'Checklist', href: '/tools/checklist', desc: 'Create task checklists' },
  ],
  'stopwatch': [
    { name: 'Pomodoro Timer', href: '/tools/pomodoro', desc: 'Focus with Pomodoro' },
    { name: 'World Clock', href: '/tools/world-clock', desc: 'View times across zones' },
    { name: 'Checklist', href: '/tools/checklist', desc: 'Create task checklists' },
  ],

  // ── Everyday Tools ──
  'checklist': [
    { name: 'Notes', href: '/tools/notes', desc: 'Quick scratch notes' },
    { name: 'Pomodoro Timer', href: '/tools/pomodoro', desc: 'Focus with Pomodoro' },
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
  ],
  'notes': [
    { name: 'Checklist', href: '/tools/checklist', desc: 'Create task checklists' },
    { name: 'Markdown Preview', href: '/tools/markdown-preview', desc: 'Preview Markdown live' },
    { name: 'Text Counter', href: '/tools/text-counter', desc: 'Count words and characters' },
  ],
};

// Default related tools for any page without specific mappings
const DEFAULT_RELATED = [
  { name: 'PDF Merge', href: '/tools/pdf-merge', desc: 'Combine multiple PDFs' },
  { name: 'Image Resize', href: '/tools/image-resize', desc: 'Resize images easily' },
  { name: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format JSON data' },
];

export default function ToolPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Extract slug from /tools/[slug] or /tools/[slug]/...
  const segments = pathname.split('/').filter(Boolean);
  const toolSlug = segments.length >= 2 && segments[0] === 'tools' ? segments[1] : undefined;
  const related = (toolSlug && RELATED_TOOLS[toolSlug]) || DEFAULT_RELATED;
  const isIndexPage = pathname === '/tools';

  return (
    <div className="tool-page min-h-screen bg-white">
      {/* Tool content */}
      <div className="pb-8">{children}</div>

      {/* Related Tools — only on individual tool pages */}
      {!isIndexPage && (
        <section className="border-t py-10" style={{ background: '#F3E6ED', borderColor: '#E9DFE4' }}>
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#29232B' }}>
              <Wrench className="w-5 h-5" style={{ color: '#801C45' }} />
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-all group"
                  style={{ border: '1px solid #E9DFE4' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#BA7396')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E9DFE4')}
                >
                  <h4 className="font-semibold transition-colors" style={{ color: '#29232B' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#801C45')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#29232B')}
                  >
                    {tool.name}
                  </h4>
                  <p className="text-sm mt-1" style={{ color: '#71646C' }}>{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowRight, X, Sparkles } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Static search index — every searchable page on the site                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

interface SearchItem {
  title: string;
  description: string;
  href: string;
  section: string;
  keywords?: string;
}

const SEARCH_INDEX: SearchItem[] = [
  /* ─── Tools (PDF) ─── */
  { title: 'PDF Merge', description: 'Combine multiple PDFs into one', href: '/tools/pdf-merge', section: 'Tools' },
  { title: 'PDF Split', description: 'Extract or split PDF pages', href: '/tools/pdf-split', section: 'Tools' },
  { title: 'PDF Compress', description: 'Reduce PDF file size', href: '/tools/pdf-compress', section: 'Tools' },
  { title: 'PDF Rotate', description: 'Rotate PDF pages', href: '/tools/pdf-rotate', section: 'Tools' },
  { title: 'PDF Reorder', description: 'Drag & drop page reordering', href: '/tools/pdf-reorder', section: 'Tools' },
  { title: 'PDF to Image', description: 'Convert PDF pages to images', href: '/tools/pdf-to-image', section: 'Tools' },
  { title: 'PDF to Text', description: 'Extract text from PDFs', href: '/tools/pdf-to-text', section: 'Tools' },
  { title: 'PDF Watermark', description: 'Add watermark to PDFs', href: '/tools/pdf-watermark', section: 'Tools' },
  { title: 'Image to PDF', description: 'Convert images to a PDF', href: '/tools/image-to-pdf', section: 'Tools' },

  /* ─── Tools (Image) ─── */
  { title: 'Image Compress', description: 'Reduce image file size', href: '/tools/image-compress', section: 'Tools' },
  { title: 'Image Resize', description: 'Resize images to any dimension', href: '/tools/image-resize', section: 'Tools' },
  { title: 'Image Crop', description: 'Crop images precisely', href: '/tools/image-crop', section: 'Tools' },
  { title: 'Image Convert', description: 'Convert between image formats', href: '/tools/image-convert', section: 'Tools' },
  { title: 'Image Watermark', description: 'Overlay text or logo on images', href: '/tools/image-watermark', section: 'Tools' },
  { title: 'Image Collage', description: 'Build collages from photos', href: '/tools/image-collage', section: 'Tools' },
  { title: 'Remove Background', description: 'Cut out image backgrounds', href: '/tools/remove-bg', section: 'Tools' },
  { title: 'Passport Photo', description: 'Create passport-size photos', href: '/tools/passport-photo', section: 'Tools' },
  { title: 'SVG to PNG', description: 'Rasterize SVG files', href: '/tools/svg-to-png', section: 'Tools' },
  { title: 'Screenshot Mockup', description: 'Frame screenshots in devices', href: '/tools/screenshot-mockup', section: 'Tools' },

  /* ─── Tools (Developer) ─── */
  { title: 'JSON Formatter', description: 'Format and validate JSON', href: '/tools/json-formatter', section: 'Tools' },
  { title: 'Base64 Encoder', description: 'Encode / decode Base64', href: '/tools/base64', section: 'Tools' },
  { title: 'CSV to JSON', description: 'Convert CSV and JSON', href: '/tools/csv-json', section: 'Tools' },
  { title: 'Diff Checker', description: 'Compare code or text', href: '/tools/diff-checker', section: 'Tools' },
  { title: 'Regex Tester', description: 'Test regular expressions', href: '/tools/regex-tester', section: 'Tools' },
  { title: 'Cron Builder', description: 'Build cron expressions visually', href: '/tools/cron-builder', section: 'Tools' },
  { title: 'URL Encoder', description: 'Encode / decode URLs', href: '/tools/url-encode', section: 'Tools' },
  { title: 'UUID Generator', description: 'Generate UUIDs instantly', href: '/tools/uuid-generator', section: 'Tools' },
  { title: 'Color Picker', description: 'Pick and convert colors', href: '/tools/color-picker', section: 'Tools' },
  { title: 'CSS Gradient', description: 'Create CSS gradients', href: '/tools/css-gradient', section: 'Tools' },
  { title: 'Box Shadow', description: 'Generate box-shadow CSS', href: '/tools/box-shadow', section: 'Tools' },
  { title: 'Favicon Generator', description: 'Create favicon files', href: '/tools/favicon', section: 'Tools' },

  /* ─── Tools (Text) ─── */
  { title: 'Case Converter', description: 'Change text case in one click', href: '/tools/case-converter', section: 'Tools' },
  { title: 'Text Counter', description: 'Count words, characters & lines', href: '/tools/text-counter', section: 'Tools' },
  { title: 'Find & Replace', description: 'Bulk find and replace text', href: '/tools/find-replace', section: 'Tools' },
  { title: 'Lorem Ipsum', description: 'Generate placeholder text', href: '/tools/lorem-ipsum', section: 'Tools' },
  { title: 'Slug Generator', description: 'Create URL-friendly slugs', href: '/tools/slug-generator', section: 'Tools' },
  { title: 'Password Generator', description: 'Generate secure passwords', href: '/tools/password-gen', section: 'Tools' },
  { title: 'Markdown Preview', description: 'Live Markdown preview', href: '/tools/markdown-preview', section: 'Tools' },
  { title: 'HTML to Markdown', description: 'Convert HTML to Markdown', href: '/tools/html-to-markdown', section: 'Tools' },
  { title: 'Text Diff', description: 'Side-by-side text comparison', href: '/tools/text-diff', section: 'Tools' },

  /* ─── Tools (Time & Other) ─── */
  { title: 'World Clock (Tools)', description: 'View time in any timezone', href: '/tools/world-clock', section: 'Tools' },
  { title: 'Pomodoro Timer', description: 'Focus with Pomodoro sessions', href: '/tools/pomodoro', section: 'Tools' },
  { title: 'Stopwatch (Tools)', description: 'Track elapsed time', href: '/tools/stopwatch', section: 'Tools' },
  { title: 'QR Generator', description: 'Create QR codes from any text', href: '/tools/qr-generator', section: 'Tools' },
  { title: 'Checklist', description: 'Build and check off task lists', href: '/tools/checklist', section: 'Tools' },
  { title: 'Notes', description: 'Quick scratch pad', href: '/tools/notes', section: 'Tools' },
  { title: 'Aspect Ratio', description: 'Calculate aspect ratio values', href: '/tools/aspect-ratio', section: 'Tools' },

  /* ─── Calculators (Unit Converters) ─── */
  { title: 'Length Converter', description: 'km, miles, meters, feet, inches', href: '/calc/length', section: 'Calculators', keywords: 'unit conversion distance' },
  { title: 'Weight Converter', description: 'kg, lbs, oz, stones, grams', href: '/calc/weight', section: 'Calculators', keywords: 'unit conversion mass' },
  { title: 'Volume Converter', description: 'liters, gallons, cups, fl oz', href: '/calc/volume', section: 'Calculators', keywords: 'unit conversion liquid' },
  { title: 'Temperature Converter', description: 'Celsius, Fahrenheit, Kelvin', href: '/calc/temperature', section: 'Calculators', keywords: 'unit conversion heat' },
  { title: 'Speed Converter', description: 'km/h, mph, m/s, knots', href: '/calc/speed', section: 'Calculators', keywords: 'unit conversion velocity' },
  { title: 'Area Converter', description: 'sq m, sq ft, acres, hectares', href: '/calc/area', section: 'Calculators', keywords: 'unit conversion surface' },

  /* ─── Calculators (Finance) ─── */
  { title: 'Loan Calculator', description: 'Monthly payments & total interest', href: '/calc/loan', section: 'Calculators', keywords: 'finance mortgage emi' },
  { title: 'Home Loan Calculator', description: 'Mortgage with full analysis', href: '/calc/home-loan', section: 'Calculators', keywords: 'finance mortgage house' },
  { title: 'Compound Interest', description: 'Investment growth over time', href: '/calc/compound-interest', section: 'Calculators', keywords: 'finance savings' },
  { title: 'Tip Calculator', description: 'Tip & bill splitting', href: '/calc/tip', section: 'Calculators', keywords: 'finance restaurant split' },
  { title: 'Salary Converter', description: 'Annual, monthly, hourly rates', href: '/calc/salary', section: 'Calculators', keywords: 'finance income pay' },
  { title: 'Discount Calculator', description: 'Sale prices & savings', href: '/calc/discount', section: 'Calculators', keywords: 'finance sale percent off' },
  { title: 'ROI Calculator', description: 'Return on investment', href: '/calc/roi', section: 'Calculators', keywords: 'finance profit' },

  /* ─── Calculators (Health) ─── */
  { title: 'BMI Calculator', description: 'Body mass index', href: '/calc/bmi', section: 'Calculators', keywords: 'health weight body' },
  { title: 'Calorie Calculator', description: 'Daily energy needs (TDEE)', href: '/calc/calorie', section: 'Calculators', keywords: 'health diet nutrition' },
  { title: 'Body Fat Calculator', description: 'Body fat percentage', href: '/calc/body-fat', section: 'Calculators', keywords: 'health fitness' },
  { title: 'Heart Rate Zones', description: 'Training heart rate zones', href: '/calc/heart-rate', section: 'Calculators', keywords: 'health fitness exercise' },
  { title: 'Water Intake', description: 'Daily hydration needs', href: '/calc/water-intake', section: 'Calculators', keywords: 'health drinking water' },

  /* ─── Calculators (Math) ─── */
  { title: 'Percentage Calculator', description: 'Percentages & percentage change', href: '/calc/percentage', section: 'Calculators', keywords: 'math percent' },
  { title: 'Fraction Calculator', description: 'Add, subtract, multiply fractions', href: '/calc/fraction', section: 'Calculators', keywords: 'math arithmetic' },
  { title: 'Scientific Notation', description: 'Decimal to scientific notation', href: '/calc/scientific', section: 'Calculators', keywords: 'math exponent' },
  { title: 'Prime Checker', description: 'Prime numbers & factorization', href: '/calc/prime', section: 'Calculators', keywords: 'math number theory' },
  { title: 'GCD & LCM', description: 'Greatest common divisor & LCM', href: '/calc/gcd-lcm', section: 'Calculators', keywords: 'math divisor multiple' },

  /* ─── Calculators (Science) ─── */
  { title: 'Pressure Converter', description: 'atm, bar, PSI, kPa, mmHg', href: '/calc/pressure', section: 'Calculators', keywords: 'science physics' },
  { title: 'Energy Converter', description: 'Joules, kWh, BTU, calories', href: '/calc/energy', section: 'Calculators', keywords: 'science physics power' },
  { title: 'Force Converter', description: 'Newtons, lbf, kgf, dynes', href: '/calc/force', section: 'Calculators', keywords: 'science physics' },
  { title: 'Data Storage', description: 'Bytes, KB, MB, GB, TB', href: '/calc/data-storage', section: 'Calculators', keywords: 'science computer digital' },
  { title: 'Number Base', description: 'Binary, octal, hex, decimal', href: '/calc/number-base', section: 'Calculators', keywords: 'science computer programming' },
  { title: 'Color Converter', description: 'HEX, RGB, HSL color formats', href: '/calc/color', section: 'Calculators', keywords: 'design web' },

  /* ─── Calculators (Everyday) ─── */
  { title: 'Age Calculator', description: 'Exact age in years, months, days', href: '/calc/age', section: 'Calculators', keywords: 'birthday date' },
  { title: 'Cooking Converter', description: 'Cups, tbsp, tsp, ml, oz', href: '/calc/cooking', section: 'Calculators', keywords: 'kitchen recipe baking' },
  { title: 'Recipe Scaler', description: 'Scale ingredient amounts', href: '/calc/recipe-scaler', section: 'Calculators', keywords: 'kitchen cooking food' },
  { title: 'Fuel Calculator', description: 'Trip fuel cost & efficiency', href: '/calc/fuel', section: 'Calculators', keywords: 'gas mileage car mpg' },
  { title: 'Shoe Size Converter', description: 'US, UK, EU, CM sizes', href: '/calc/shoe-size', section: 'Calculators', keywords: 'fashion footwear' },
  { title: 'Paper Size Guide', description: 'A4, Letter, Legal & more', href: '/calc/paper-size', section: 'Calculators', keywords: 'print office document' },
  { title: 'Time Converter', description: 'Seconds, minutes, hours, days', href: '/calc/time-converter', section: 'Calculators', keywords: 'unit conversion duration' },

  /* ─── Calculators (Hub Pages) ─── */
  { title: 'Health Calculators', description: 'BMI, calories, body fat & more health tools', href: '/calc/health', section: 'Calculators' },
  { title: 'Finance Calculators', description: 'Loans, interest, salary & more finance tools', href: '/calc/finance', section: 'Calculators' },
  { title: 'Math Calculators', description: 'Percentage, fractions, primes & more math tools', href: '/calc/math', section: 'Calculators' },
  { title: 'Science Calculators', description: 'Pressure, energy, force & more science converters', href: '/calc/science', section: 'Calculators' },
  { title: 'Everyday Calculators', description: 'Age, cooking, fuel & more everyday tools', href: '/calc/everyday', section: 'Calculators' },
  { title: 'Digital Converters', description: 'Data storage, number base & more digital tools', href: '/calc/digital', section: 'Calculators' },

  /* ─── Time & Space ─── */
  { title: 'World Clock', description: 'Live clocks for every timezone worldwide', href: '/time/world-clock', section: 'Time & Space', keywords: 'timezone global' },
  { title: 'Timezone Compare', description: 'Compare times across multiple timezones', href: '/time/timezone-compare', section: 'Time & Space' },
  { title: 'Timezone Map', description: 'Interactive world timezone map', href: '/time/timezone-map', section: 'Time & Space' },
  { title: 'Meeting Planner', description: 'Find the best meeting time across timezones', href: '/time/meeting-planner', section: 'Time & Space', keywords: 'schedule call' },
  { title: 'Call Planner', description: 'Plan calls across time zones', href: '/time/call-planner', section: 'Time & Space' },
  { title: 'Countdown Timer', description: 'Countdown to any event or date', href: '/time/countdown', section: 'Time & Space' },
  { title: 'Timer', description: 'Simple countdown timer', href: '/time/timer', section: 'Time & Space' },
  { title: 'Stopwatch', description: 'Precise stopwatch with lap tracking', href: '/time/stopwatch', section: 'Time & Space' },
  { title: 'Pomodoro', description: 'Pomodoro technique productivity timer', href: '/time/pomodoro', section: 'Time & Space' },
  { title: 'Alarm', description: 'Set alarms in your browser', href: '/time/alarm', section: 'Time & Space' },
  { title: 'Calendar', description: 'Interactive calendar with events', href: '/time/calendar', section: 'Time & Space' },
  { title: 'Date Difference', description: 'Calculate days between two dates', href: '/time/date-difference', section: 'Time & Space' },
  { title: 'Age Calculator (Time)', description: 'Calculate your exact age', href: '/time/age-calculator', section: 'Time & Space', keywords: 'birthday' },
  { title: 'Week Number', description: 'Find the ISO week number for any date', href: '/time/week-number', section: 'Time & Space' },
  { title: 'Leap Year', description: 'Check if a year is a leap year', href: '/time/leap-year', section: 'Time & Space' },
  { title: 'Unix Timestamp', description: 'Convert Unix epoch timestamps', href: '/time/unix-timestamp', section: 'Time & Space', keywords: 'developer epoch' },
  { title: 'Julian Date', description: 'Julian day number converter', href: '/time/julian-date', section: 'Time & Space' },
  { title: 'Roman Numerals', description: 'Convert numbers to Roman numerals', href: '/time/roman-numerals', section: 'Time & Space' },
  { title: 'Share Time', description: 'Share your current time with others', href: '/time/share-time', section: 'Time & Space' },
  { title: 'Time Capsule', description: 'Create digital time capsules', href: '/time/time-capsule', section: 'Time & Space' },
  { title: 'Atomic Clock', description: 'Ultra-precise atomic time reference', href: '/time/atomic-clock', section: 'Time & Space' },
  { title: 'Sunrise & Sunset', description: 'Sunrise and sunset times for any location', href: '/time/sunrise-sunset', section: 'Time & Space', keywords: 'golden hour daylight' },
  { title: 'Daylight Hours', description: 'Track hours of daylight throughout the year', href: '/time/daylight-hours', section: 'Time & Space' },
  { title: 'Day & Night Map', description: 'Live day and night terminator map', href: '/time/day-night-map', section: 'Time & Space' },
  { title: 'Weather', description: 'Current weather conditions worldwide', href: '/time/weather', section: 'Time & Space' },
  { title: 'Astronomy Hub', description: 'Explore astronomy, stars, planets, and more', href: '/time/astronomy', section: 'Time & Space', keywords: 'space stars planets' },
  { title: 'Solar System', description: 'Interactive solar system explorer', href: '/time/solar-system', section: 'Time & Space', keywords: 'planets mercury venus mars jupiter saturn' },
  { title: 'Moon Phases', description: 'Current and upcoming full moon dates', href: '/time/full-moon', section: 'Time & Space', keywords: 'lunar cycle' },
  { title: 'Eclipses', description: 'Solar and lunar eclipse schedule', href: '/time/eclipses', section: 'Time & Space' },
  { title: 'Meteor Showers', description: 'Upcoming meteor shower calendar', href: '/time/meteor-showers', section: 'Time & Space', keywords: 'shooting stars' },
  { title: 'Constellations', description: 'Interactive star constellation guide', href: '/time/constellations', section: 'Time & Space', keywords: 'stars sky night' },
  { title: 'Dark Sky Finder', description: 'Find the best stargazing locations', href: '/time/dark-sky', section: 'Time & Space', keywords: 'stargazing light pollution' },
  { title: 'Astro Calendar', description: 'Astronomy events calendar', href: '/time/astro-calendar', section: 'Time & Space' },
  { title: 'Planet Age', description: 'Calculate your age on other planets', href: '/time/planet-age', section: 'Time & Space' },
  { title: 'Planetary Hours', description: 'Classical planetary hours calculator', href: '/time/planetary-hours', section: 'Time & Space' },
  { title: 'Solar Weather', description: 'Solar flares, sunspots & space weather', href: '/time/solar-weather', section: 'Time & Space' },
  { title: 'Speed of Light', description: 'Light travel time between objects', href: '/time/speed-of-light', section: 'Time & Space' },
  { title: 'Space Units', description: 'Astronomical unit converter (AU, ly, parsec)', href: '/time/space-units', section: 'Time & Space' },
  { title: 'ISS Tracker', description: 'Track the International Space Station live', href: '/time/iss-tracker', section: 'Time & Space', keywords: 'satellite orbit' },
  { title: 'ISS Passes', description: 'When will the ISS fly over your location', href: '/time/iss-passes', section: 'Time & Space' },
  { title: 'Satellites', description: 'Track satellites in orbit', href: '/time/satellites', section: 'Time & Space' },
  { title: 'Voyager Tracker', description: 'Track Voyager spacecraft distance from Earth', href: '/time/voyager-tracker', section: 'Time & Space' },
  { title: 'Space Launches', description: 'Upcoming rocket and spacecraft launches', href: '/time/launches', section: 'Time & Space', keywords: 'rocket spacex nasa' },
  { title: 'Space Missions', description: 'Current and past space missions', href: '/time/space-missions', section: 'Time & Space' },
  { title: 'Space Timeline', description: 'History of space exploration timeline', href: '/time/space-timeline', section: 'Time & Space' },
  { title: 'Space Industry', description: 'Commercial space industry overview', href: '/time/space-industry', section: 'Time & Space' },
  { title: 'Space Gallery', description: 'Beautiful space photography and imagery', href: '/time/space-gallery', section: 'Time & Space', keywords: 'photos nasa hubble' },
  { title: 'Space Sounds', description: 'Listen to sounds from space', href: '/time/space-sounds', section: 'Time & Space', keywords: 'audio nasa' },
  { title: 'This Day in Space', description: 'Space history for today', href: '/time/this-day-in-space', section: 'Time & Space' },
  { title: 'Doomsday Clock', description: 'The Bulletin of Atomic Scientists Doomsday Clock', href: '/time/doomsday-clock', section: 'Time & Space' },
  { title: 'Population Clock', description: 'Live world population counter', href: '/time/population-clock', section: 'Time & Space' },
  { title: 'Flight Time', description: 'Estimate flight duration between cities', href: '/time/flight-time', section: 'Time & Space', keywords: 'travel airplane' },
  { title: 'Continents', description: 'Explore world continents', href: '/time/continents', section: 'Time & Space' },
  { title: 'Space News', description: 'Latest space and astronomy news', href: '/time/news', section: 'Time & Space' },
  { title: 'Embeddable Clock', description: 'Embed a world clock on your website', href: '/time/embed', section: 'Time & Space' },
  { title: 'Zodiac', description: 'Zodiac signs and horoscope info', href: '/time/zodiac', section: 'Time & Space', keywords: 'astrology horoscope signs' },
  { title: 'Timezone Quiz', description: 'Test your timezone knowledge', href: '/time/timezone-quiz', section: 'Time & Space', keywords: 'quiz trivia game' },
  { title: 'Time & Space Quizzes', description: 'Astronomy, moon, space, flags & timezone quizzes', href: '/time/quiz', section: 'Time & Space' },

  /* ─── Facts / Did You Know ─── */
  { title: 'Did You Know — Home', description: 'Discover amazing facts from 40+ categories', href: '/facts', section: 'Facts', keywords: 'trivia knowledge learning' },
  { title: 'Browse Facts', description: 'Browse all facts by category', href: '/facts/browse', section: 'Facts' },
  { title: 'Daily Fact', description: 'A new fascinating fact every day', href: '/facts/daily', section: 'Facts' },
  { title: 'Today\'s Fact', description: 'Featured fact of the day', href: '/facts/today', section: 'Facts' },
  { title: 'Fact Quiz', description: 'Test your knowledge with fun quizzes', href: '/facts/quiz', section: 'Facts', keywords: 'trivia game' },
  { title: 'Jeopardy', description: 'Play Jeopardy-style trivia with facts', href: '/facts/jeopardy', section: 'Facts', keywords: 'game show trivia' },
  { title: 'Fact Chains', description: 'Follow chains of connected facts', href: '/facts/chains', section: 'Facts' },
  { title: 'Fact Collections', description: 'Curated collections of amazing facts', href: '/facts/collections', section: 'Facts' },
  { title: 'Compare Facts', description: 'Compare facts side by side', href: '/facts/compare', section: 'Facts' },
  { title: 'Explore Facts', description: 'Visual exploration of all facts', href: '/facts/explore', section: 'Facts' },
  { title: 'Fact Map', description: 'Facts plotted on a world map', href: '/facts/map', section: 'Facts', keywords: 'geography' },
  { title: 'Fact Stats', description: 'Statistics about the fact database', href: '/facts/stats', section: 'Facts' },
  { title: 'Submit a Fact', description: 'Submit your own amazing facts', href: '/facts/submit', section: 'Facts' },
  { title: 'Learning Paths', description: 'Guided learning journeys through facts', href: '/facts/learn', section: 'Facts', keywords: 'education courses' },
  { title: 'Fact Challenge', description: 'Daily fact challenge', href: '/facts/challenge', section: 'Facts' },
  { title: 'Facts Blog', description: 'Articles and deep dives into fascinating topics', href: '/facts/blog', section: 'Facts' },

  /* ─── Social Media Manager ─── */
  { title: 'Social Media Hub', description: 'Manage all your social media from one place', href: '/social', section: 'Social', keywords: 'instagram facebook twitter linkedin tiktok' },
  { title: 'Post Scheduler', description: 'Schedule posts across all platforms', href: '/social/scheduler', section: 'Social' },
  { title: 'Social Dashboard', description: 'Overview of all your social accounts', href: '/social/dashboard', section: 'Social' },
  { title: 'Social Analytics', description: 'Track engagement, reach, and growth', href: '/social/analytics', section: 'Social' },
  { title: 'AI Content Writer', description: 'Generate captions and post ideas with AI', href: '/social/ai-writer', section: 'Social' },
  { title: 'Content Calendar', description: 'Visual drag-and-drop content calendar', href: '/social/calendar', section: 'Social' },
  { title: 'Hashtag Research', description: 'Find trending hashtags and track performance', href: '/social/hashtags', section: 'Social' },
  { title: 'Image Studio', description: 'Edit, resize, and add text to images for social', href: '/social/image-studio', section: 'Social' },
  { title: 'Social Inbox', description: 'Unified inbox for all social messages', href: '/social/inbox', section: 'Social' },
  { title: 'Link in Bio', description: 'Create a beautiful link-in-bio page', href: '/social/link-in-bio', section: 'Social' },
  { title: 'Social Listening', description: 'Monitor brand mentions and keywords', href: '/social/listening', section: 'Social' },
  { title: 'Content Discovery', description: 'Discover trending content to share', href: '/social/content-discovery', section: 'Social' },
  { title: 'Bulk Upload', description: 'Upload and schedule posts in bulk', href: '/social/bulk-upload', section: 'Social' },
  { title: 'Team Collaboration', description: 'Invite your team and assign roles', href: '/social/team', section: 'Social' },
  { title: 'Social Features', description: 'Explore all social media management features', href: '/social/features', section: 'Social' },
  { title: 'Social for Creators', description: 'Tools built for content creators', href: '/social/creators', section: 'Social' },
  { title: 'Social for Small Business', description: 'Social media tools for small businesses', href: '/social/small-business', section: 'Social' },
  { title: 'Social for Agencies', description: 'Agency-grade social management tools', href: '/social/agencies', section: 'Social' },
  { title: 'Enterprise Social', description: 'Enterprise social media management', href: '/social/enterprise', section: 'Social' },
  { title: 'E-commerce Social', description: 'Social commerce and product promotion', href: '/social/ecommerce', section: 'Social' },
  { title: 'White Label', description: 'White-label social media platform', href: '/social/white-label', section: 'Social' },
  { title: 'Social ROI', description: 'Calculate your social media ROI', href: '/social/roi', section: 'Social' },
  { title: 'Social Pricing', description: 'Free plan and pricing details', href: '/social/pricing', section: 'Social' },
  { title: 'Social Resources', description: 'Guides, tips and social media resources', href: '/social/resources', section: 'Social' },
  { title: 'Social Blog', description: 'Social media marketing tips and insights', href: '/social/blog', section: 'Social' },
  { title: 'Social Solutions', description: 'Solutions for every type of business', href: '/social/solutions', section: 'Social' },

  /* ─── Rent or Buy ─── */
  { title: 'Rent or Buy Calculator', description: 'Compare renting vs buying a home with detailed analysis', href: '/rent-or-buy', section: 'Rent or Buy', keywords: 'housing mortgage real estate' },
  { title: 'Affordability Calculator', description: 'How much house can you afford?', href: '/rent-or-buy/affordability', section: 'Rent or Buy', keywords: 'housing budget' },
  { title: 'Closing Costs', description: 'Estimate your home closing costs', href: '/rent-or-buy/closing-costs', section: 'Rent or Buy' },
  { title: 'First-Time Buyer Guide', description: 'Complete guide for first-time home buyers', href: '/rent-or-buy/first-time-buyer', section: 'Rent or Buy' },
  { title: 'Mortgage Types', description: 'Compare fixed, ARM, FHA, VA mortgage types', href: '/rent-or-buy/mortgage-types', section: 'Rent or Buy' },
  { title: 'Pre-Qualification', description: 'Get pre-qualified for a mortgage', href: '/rent-or-buy/prequalify', section: 'Rent or Buy' },
  { title: 'Housing FAQ', description: 'Frequently asked questions about renting and buying', href: '/rent-or-buy/faq', section: 'Rent or Buy' },
  { title: 'Housing Glossary', description: 'Real estate and mortgage terminology', href: '/rent-or-buy/glossary', section: 'Rent or Buy' },
  { title: 'Home Buying Checklist', description: 'Step-by-step checklist for buying a home', href: '/rent-or-buy/checklist', section: 'Rent or Buy' },
  { title: 'Local Housing Data', description: 'Housing market data for your area', href: '/rent-or-buy/local-data', section: 'Rent or Buy' },
  { title: 'Housing Guides', description: 'In-depth guides on rent vs buy decisions', href: '/rent-or-buy/guides', section: 'Rent or Buy' },
  { title: 'Rent vs Buy Factors', description: 'Key factors to consider when deciding rent or buy', href: '/rent-or-buy/rent-vs-buy-factors', section: 'Rent or Buy' },
  { title: 'Hidden Costs of Homeownership', description: 'Costs beyond the mortgage you should know about', href: '/rent-or-buy/hidden-costs-homeownership', section: 'Rent or Buy' },
  { title: 'Housing Market 2026', description: 'Current housing market trends and outlook', href: '/rent-or-buy/housing-market-2026', section: 'Rent or Buy' },
  { title: 'Rent + Invest Difference', description: 'What if you rent and invest the difference?', href: '/rent-or-buy/rent-invest-difference', section: 'Rent or Buy' },
  { title: 'Housing Resources', description: 'Links and resources for home buyers and renters', href: '/rent-or-buy/resources', section: 'Rent or Buy' },
  { title: 'Housing Blog', description: 'Articles on renting, buying, and housing market', href: '/rent-or-buy/blog', section: 'Rent or Buy' },
  { title: 'Community Comments', description: 'Discuss housing decisions with others', href: '/rent-or-buy/comments', section: 'Rent or Buy' },

  /* ─── Travel ─── */
  { title: 'Travel Hub', description: 'Explore destinations worldwide — guides, maps, and tips', href: '/travel', section: 'Travel', keywords: 'vacation trip explore' },
  { title: 'Destinations', description: 'Browse all travel destinations', href: '/travel/destinations', section: 'Travel', keywords: 'countries cities' },
  { title: 'Travel Personality Quiz', description: 'Discover your travel style & get matched destinations', href: '/travel/travel-personality', section: 'Travel' },
  { title: 'Compare Destinations', description: 'Side-by-side on cost, weather, safety & vibe', href: '/travel/compare', section: 'Travel' },
  { title: 'Hidden Gems', description: 'Off-the-beaten-path spots most tourists miss', href: '/travel/hidden-gems', section: 'Travel' },
  { title: 'Interactive Maps', description: 'Visual exploration of every destination', href: '/travel/maps', section: 'Travel' },
  { title: 'Budget Calculator', description: 'Estimate costs for any trip in seconds', href: '/travel/travel-cost', section: 'Travel', keywords: 'money expense' },
  { title: 'Trip Preparation', description: 'Checklists, docs & pre-departure essentials', href: '/travel/trip-prep', section: 'Travel' },
  { title: 'Food Guide', description: 'Must-try food at every destination', href: '/travel/food-guide', section: 'Travel', keywords: 'cuisine restaurant dining' },
  { title: 'Weather Guide', description: 'Best times to visit based on weather', href: '/travel/weather-guide', section: 'Travel' },
  { title: 'Travel Safety', description: 'Safety tips and advisories for travelers', href: '/travel/safety', section: 'Travel' },
  { title: 'Visa Guide', description: 'Visa requirements and application tips', href: '/travel/visa-guide', section: 'Travel', keywords: 'passport immigration' },
  { title: 'Etiquette Guide', description: 'Cultural etiquette tips for travelers', href: '/travel/etiquette-guide', section: 'Travel' },
  { title: 'Language Guide', description: 'Essential phrases and language tips', href: '/travel/language-guide', section: 'Travel' },
  { title: 'Shopping Guide', description: 'Best shopping destinations and tips', href: '/travel/shopping-guide', section: 'Travel' },
  { title: 'Photography Guide', description: 'Best photo spots and camera tips', href: '/travel/photography-guide', section: 'Travel' },
  { title: 'Family Travel', description: 'Family-friendly travel guides', href: '/travel/family-guide', section: 'Travel', keywords: 'kids children' },
  { title: 'Adventure Guide', description: 'Thrilling adventure travel experiences', href: '/travel/adventure-guide', section: 'Travel', keywords: 'hiking trekking extreme' },
  { title: 'Festivals', description: 'World festivals and celebrations calendar', href: '/travel/festivals', section: 'Travel' },
  { title: 'Responsible Travel', description: 'Sustainable and eco-friendly travel tips', href: '/travel/responsible-travel', section: 'Travel', keywords: 'eco sustainable green' },
  { title: 'Bucket List', description: 'Must-visit places before you die', href: '/travel/bucket-list', section: 'Travel' },
  { title: 'Did You Know (Travel)', description: 'Amazing travel facts and trivia', href: '/travel/did-you-know', section: 'Travel' },
  { title: "Don't Miss", description: 'Top experiences you should not miss', href: '/travel/dont-miss', section: 'Travel' },
  { title: 'Packing List', description: 'Smart packing checklist for any trip', href: '/travel/packing-list', section: 'Travel' },
  { title: 'Travel Planning', description: 'Plan your perfect trip step by step', href: '/travel/plan', section: 'Travel' },
  { title: 'Smart Travel Tips', description: 'Pro tips for smarter travel', href: '/travel/smart-tips', section: 'Travel' },
  { title: 'Travel Quiz', description: 'Test your travel knowledge', href: '/travel/travel-quiz', section: 'Travel', keywords: 'trivia game' },
  { title: 'Travel by Type', description: 'Find trips by travel style', href: '/travel/travel-by-type', section: 'Travel' },
  { title: 'Train Journeys', description: 'Epic train rides around the world', href: '/travel/train-journeys', section: 'Travel', keywords: 'rail scenic' },
  { title: 'Download Maps', description: 'Download offline maps for your trip', href: '/travel/download-maps', section: 'Travel' },
  { title: 'Offline Tools', description: 'Travel tools that work without internet', href: '/travel/offline-tools', section: 'Travel' },
  { title: 'Local Deals', description: 'Local travel deals and discounts', href: '/travel/local-deals', section: 'Travel' },
  { title: 'Language Toolkit', description: 'Translation and language tools for travelers', href: '/travel/language-toolkit', section: 'Travel' },
  { title: 'Accessibility Guide', description: 'Accessible travel resources and tips', href: '/travel/accessibility-guide', section: 'Travel' },
  { title: 'USA to India', description: 'Complete guide for traveling from USA to India', href: '/travel/usa-to-india', section: 'Travel', keywords: 'flight desi NRI' },
  { title: 'Travel Guides', description: 'In-depth destination guides', href: '/travel/guides', section: 'Travel' },
  { title: 'Africa Guide', description: 'Travel guide for Africa', href: '/travel/africa-guide', section: 'Travel' },
  { title: 'Americas Guide', description: 'Travel guide for the Americas', href: '/travel/americas-guide', section: 'Travel' },
  { title: 'Asia Guide', description: 'Travel guide for Asia', href: '/travel/asia-guide', section: 'Travel' },
  { title: 'Europe Guide', description: 'Travel guide for Europe', href: '/travel/europe-guide', section: 'Travel' },
  { title: 'Oceania Guide', description: 'Travel guide for Oceania & Australia', href: '/travel/oceania-guide', section: 'Travel' },

  /* ─── Deals ─── */
  { title: 'Deals', description: 'Latest deals, discounts, and offers curated for you', href: '/deals', section: 'Deals', keywords: 'discount coupon sale offer' },
  { title: 'Deals Community', description: 'Community-sourced deals and discussions', href: '/deals-community', section: 'Deals' },

  /* ─── Other ─── */
  { title: 'Internships', description: 'Find internship opportunities', href: '/internships', section: 'Other', keywords: 'jobs career student' },
  { title: 'Products', description: 'Product listings and reviews', href: '/products', section: 'Other' },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Section colors                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

const SECTION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Tools':        { bg: '#FDE8EF', text: '#801C45', border: '#E9C1D2' },
  'Calculators':  { bg: '#E8F0FD', text: '#1C4580', border: '#B8CCE9' },
  'Time & Space': { bg: '#E8FDF0', text: '#1C8045', border: '#B8E9C1' },
  'Facts':        { bg: '#FDF3E8', text: '#805C1C', border: '#E9D6B8' },
  'Social':       { bg: '#F0E8FD', text: '#451C80', border: '#C8B8E9' },
  'Rent or Buy':  { bg: '#E8F8FD', text: '#1C6A80', border: '#B8DEE9' },
  'Travel':       { bg: '#FDE8E8', text: '#801C1C', border: '#E9B8B8' },
  'Deals':        { bg: '#F5FDE8', text: '#5C801C', border: '#D2E9B8' },
  'Other':        { bg: '#F3E6ED', text: '#801C45', border: '#E9DFE4' },
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Search component                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);

  /* Sync URL param changes */
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  /* Auto-focus on mount */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Perform search ── */
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const terms = q.split(/\s+/).filter(Boolean);

    return SEARCH_INDEX.map((item) => {
      const haystack = `${item.title} ${item.description} ${item.keywords || ''}`.toLowerCase();
      let score = 0;

      for (const term of terms) {
        if (haystack.includes(term)) {
          score += 1;
          // Bonus for title match
          if (item.title.toLowerCase().includes(term)) score += 2;
          // Bonus for exact word match
          if (item.title.toLowerCase().split(/\s+/).includes(term)) score += 1;
        }
      }

      return { ...item, score };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  /* ── Group by section ── */
  const grouped = useMemo(() => {
    const map = new Map<string, (SearchItem & { score: number })[]>();
    for (const r of results) {
      const existing = map.get(r.section) || [];
      existing.push(r);
      map.set(r.section, existing);
    }
    return Array.from(map.entries());
  }, [results]);

  /* ── Handle search submission ── */
  const handleSearch = (value: string) => {
    setInputValue(value);
    // Debounce URL update
    const trimmed = value.trim();
    if (trimmed) {
      router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
    } else {
      router.replace('/search', { scroll: false });
    }
    setQuery(trimmed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  /* ── Popular searches ── */
  const POPULAR = ['PDF tools', 'BMI calculator', 'world clock', 'ISS tracker', 'mortgage', 'travel quiz', 'facts', 'password generator'];

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Hero / Search Bar ── */}
      <div className="border-b border-line" style={{ background: 'linear-gradient(180deg, #FDE8EF 0%, #FAF8F9 100%)' }}>
        <div className="mx-auto max-w-[800px] px-6 py-12 sm:py-16">
          <h1 className="text-center text-[32px] sm:text-[40px] font-[850] leading-[1.1] mb-2" style={{ letterSpacing: '-1.4px', color: '#29232B' }}>
            Search <span style={{ color: '#801C45' }}>Everything</span>
          </h1>
          <p className="text-center text-[14px] text-muted mb-8">
            {SEARCH_INDEX.length}+ tools, calculators, guides, and pages across all of ZAXISE
          </p>

          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tools, calculators, travel, facts..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-line bg-white text-[16px] outline-none focus:ring-2 focus:ring-[#BA7396] focus:border-transparent shadow-sm transition-shadow focus:shadow-md"
              aria-label="Search the site"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#E9DFE4] hover:bg-[#D4C5CC] flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 text-muted" />
              </button>
            )}
          </form>

          {/* Popular searches */}
          {!query && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted font-medium mr-1">Popular:</span>
              {POPULAR.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-1.5 rounded-full bg-white border border-line text-xs font-medium text-ink hover:border-[#BA7396] hover:text-[#801C45] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <main className="mx-auto max-w-[800px] px-6 py-8 pb-20">
        {/* Result count */}
        {query && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{results.length}</span>{' '}
              {results.length === 1 ? 'result' : 'results'} for{' '}
              <span className="font-semibold text-[#801C45]">&ldquo;{query}&rdquo;</span>
            </p>
            {grouped.length > 1 && (
              <p className="text-xs text-muted">
                across {grouped.length} sections
              </p>
            )}
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#F3E6ED] flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-[#801C45]" />
            </div>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-sm text-muted max-w-md mx-auto mb-6">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try different keywords or browse our popular sections below.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Tools', 'Calculators', 'Time & Space', 'Travel', 'Facts'].map((section) => (
                <Link
                  key={section}
                  href={
                    section === 'Tools' ? '/tools' :
                    section === 'Calculators' ? '/calc' :
                    section === 'Time & Space' ? '/time' :
                    section === 'Travel' ? '/travel' :
                    '/facts'
                  }
                  className="px-4 py-2 rounded-lg border border-line text-sm font-medium hover:border-[#BA7396] hover:text-[#801C45] transition-colors"
                >
                  {section}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Grouped results */}
        {grouped.map(([section, items]) => {
          const style = SECTION_STYLES[section] || SECTION_STYLES['Other'];

          return (
            <div key={section} className="mb-8">
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                >
                  {section}
                </span>
                <span className="text-xs text-muted">{items.length} {items.length === 1 ? 'result' : 'results'}</span>
              </div>

              {/* Result cards */}
              <div className="space-y-2">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 hover:border-[#BA7396] hover:shadow-md transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-ink group-hover:text-[#801C45] transition-colors truncate">
                          <HighlightMatch text={item.title} query={query} />
                        </h3>
                      </div>
                      <p className="text-xs text-muted truncate">
                        <HighlightMatch text={item.description} query={query} />
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 text-muted group-hover:text-[#801C45] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state — show sections grid */}
        {!query && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#801C45]" />
              <h2 className="text-lg font-bold">Browse Sections</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Tools', desc: '47 free browser-based utilities', href: '/tools', count: SEARCH_INDEX.filter(i => i.section === 'Tools').length },
                { title: 'Calculators', desc: '40+ converters & calculators', href: '/calc', count: SEARCH_INDEX.filter(i => i.section === 'Calculators').length },
                { title: 'Time & Space', desc: 'Clocks, astronomy & space', href: '/time', count: SEARCH_INDEX.filter(i => i.section === 'Time & Space').length },
                { title: 'Facts', desc: '40K+ amazing did-you-know facts', href: '/facts', count: SEARCH_INDEX.filter(i => i.section === 'Facts').length },
                { title: 'Social', desc: 'Social media management suite', href: '/social', count: SEARCH_INDEX.filter(i => i.section === 'Social').length },
                { title: 'Rent or Buy', desc: 'Housing decision tools & guides', href: '/rent-or-buy', count: SEARCH_INDEX.filter(i => i.section === 'Rent or Buy').length },
                { title: 'Travel', desc: 'Destinations, guides & planning', href: '/travel', count: SEARCH_INDEX.filter(i => i.section === 'Travel').length },
                { title: 'Deals', desc: 'Deals, discounts & offers', href: '/deals', count: SEARCH_INDEX.filter(i => i.section === 'Deals').length },
              ].map((s) => {
                const style = SECTION_STYLES[s.title] || SECTION_STYLES['Other'];
                return (
                  <Link
                    key={s.title}
                    href={s.href}
                    className="group flex items-center gap-4 rounded-xl border border-line bg-white px-5 py-4 hover:border-[#BA7396] hover:shadow-md transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                      style={{ background: style.bg, color: style.text }}
                    >
                      {s.count}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ink group-hover:text-[#801C45] transition-colors">{s.title}</h3>
                      <p className="text-xs text-muted">{s.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 text-muted group-hover:text-[#801C45] transition-colors ml-auto" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Highlight matching text                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  // Build regex that matches any term
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = terms.some(t => part.toLowerCase() === t);
        return isMatch ? (
          <mark key={i} className="bg-[#FDE8EF] text-[#801C45] rounded-sm px-0.5 font-semibold" style={{ textDecoration: 'none' }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

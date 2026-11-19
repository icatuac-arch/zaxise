'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Globe, Clock, Trophy, Zap, Star, RotateCcw, Share2,
  ChevronRight, Target, Flame, Award, Brain, Timer, Sparkles
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Types ─────────────────────────────────────────────────
type Difficulty = 'easy' | 'medium' | 'hard'
type GameState = 'menu' | 'playing' | 'results'

interface CityData {
  name: string
  country: string
  timezone: string
  difficulty: Difficulty
}

interface QuestionResult {
  city: CityData
  correct: boolean
  timeBonus: boolean
  selectedAnswer: string
  correctAnswer: string
}

// ─── Cities Pool (30+) ────────────────────────────────────
const CITIES: CityData[] = [
  // Easy — major well-known cities
  { name: 'New York', country: 'USA', timezone: 'America/New_York', difficulty: 'easy' },
  { name: 'London', country: 'UK', timezone: 'Europe/London', difficulty: 'easy' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', difficulty: 'easy' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', difficulty: 'easy' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris', difficulty: 'easy' },
  { name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', difficulty: 'easy' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', difficulty: 'easy' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', difficulty: 'easy' },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', difficulty: 'easy' },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', difficulty: 'easy' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', difficulty: 'easy' },
  // Medium
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', difficulty: 'medium' },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', difficulty: 'medium' },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', difficulty: 'medium' },
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', difficulty: 'medium' },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', difficulty: 'medium' },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', difficulty: 'medium' },
  { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', difficulty: 'medium' },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', difficulty: 'medium' },
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', difficulty: 'medium' },
  { name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', difficulty: 'medium' },
  // Hard — obscure cities
  { name: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', difficulty: 'hard' },
  { name: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent', difficulty: 'hard' },
  { name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', difficulty: 'hard' },
  { name: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', difficulty: 'hard' },
  { name: 'Almaty', country: 'Kazakhstan', timezone: 'Asia/Almaty', difficulty: 'hard' },
  { name: 'Vladivostok', country: 'Russia', timezone: 'Asia/Vladivostok', difficulty: 'hard' },
  { name: 'Anchorage', country: 'USA', timezone: 'America/Anchorage', difficulty: 'hard' },
  { name: 'Colombo', country: 'Sri Lanka', timezone: 'Asia/Colombo', difficulty: 'hard' },
  { name: 'Addis Ababa', country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', difficulty: 'hard' },
  { name: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon', difficulty: 'hard' },
  { name: 'Chatham Islands', country: 'New Zealand', timezone: 'Pacific/Chatham', difficulty: 'hard' },
  { name: 'Eucla', country: 'Australia', timezone: 'Australia/Eucla', difficulty: 'hard' },
  // Additional Easy
  { name: 'Chicago', country: 'USA', timezone: 'America/Chicago', difficulty: 'easy' },
  { name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', difficulty: 'easy' },
  { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', difficulty: 'easy' },
  { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', difficulty: 'easy' },
  { name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', difficulty: 'easy' },
  { name: 'Denver', country: 'USA', timezone: 'America/Denver', difficulty: 'easy' },
  { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', difficulty: 'easy' },
  // Additional Medium
  { name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', difficulty: 'medium' },
  { name: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi', difficulty: 'medium' },
  { name: 'Lima', country: 'Peru', timezone: 'America/Lima', difficulty: 'medium' },
  { name: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', difficulty: 'medium' },
  { name: 'Athens', country: 'Greece', timezone: 'Europe/Athens', difficulty: 'medium' },
  { name: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', difficulty: 'medium' },
  { name: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', difficulty: 'medium' },
  { name: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', difficulty: 'medium' },
  { name: 'Bogota', country: 'Colombia', timezone: 'America/Bogota', difficulty: 'medium' },
  { name: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', difficulty: 'medium' },
  // Additional Hard
  { name: 'Kabul', country: 'Afghanistan', timezone: 'Asia/Kabul', difficulty: 'hard' },
  { name: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran', difficulty: 'hard' },
  { name: 'Pyongyang', country: 'North Korea', timezone: 'Asia/Pyongyang', difficulty: 'hard' },
  { name: 'Apia', country: 'Samoa', timezone: 'Pacific/Apia', difficulty: 'hard' },
  { name: 'Noumea', country: 'New Caledonia', timezone: 'Pacific/Noumea', difficulty: 'hard' },
  { name: 'Honolulu', country: 'USA', timezone: 'Pacific/Honolulu', difficulty: 'hard' },
  { name: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', difficulty: 'hard' },
  { name: 'Tbilisi', country: 'Georgia', timezone: 'Asia/Tbilisi', difficulty: 'hard' },
  { name: 'Port Moresby', country: 'Papua New Guinea', timezone: 'Pacific/Port_Moresby', difficulty: 'hard' },
  { name: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas', difficulty: 'hard' },
  { name: 'Nouakchott', country: 'Mauritania', timezone: 'Africa/Nouakchott', difficulty: 'hard' },
  { name: 'Thimphu', country: 'Bhutan', timezone: 'Asia/Thimphu', difficulty: 'hard' },
  // Additional Easy (batch 2)
  { name: 'Miami', country: 'USA', timezone: 'America/New_York', difficulty: 'easy' },
  { name: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles', difficulty: 'easy' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', difficulty: 'easy' },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', difficulty: 'easy' },
  { name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', difficulty: 'easy' },
  { name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', difficulty: 'easy' },
  { name: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', difficulty: 'easy' },
  { name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', difficulty: 'easy' },
  { name: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', difficulty: 'easy' },
  { name: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', difficulty: 'easy' },
  { name: 'Munich', country: 'Germany', timezone: 'Europe/Berlin', difficulty: 'easy' },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', difficulty: 'easy' },
  { name: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', difficulty: 'easy' },
  // Additional Medium (batch 2)
  { name: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', difficulty: 'medium' },
  { name: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo', difficulty: 'medium' },
  { name: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen', difficulty: 'medium' },
  { name: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', difficulty: 'medium' },
  { name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', difficulty: 'medium' },
  { name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', difficulty: 'medium' },
  { name: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca', difficulty: 'medium' },
  { name: 'Santiago', country: 'Chile', timezone: 'America/Santiago', difficulty: 'medium' },
  { name: 'Havana', country: 'Cuba', timezone: 'America/Havana', difficulty: 'medium' },
  { name: 'Bucharest', country: 'Romania', timezone: 'Europe/Bucharest', difficulty: 'medium' },
  { name: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar', difficulty: 'medium' },
  { name: 'Accra', country: 'Ghana', timezone: 'Africa/Accra', difficulty: 'medium' },
  { name: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague', difficulty: 'medium' },
  { name: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest', difficulty: 'medium' },
  // Additional Hard (batch 2)
  { name: 'Ulaanbaatar', country: 'Mongolia', timezone: 'Asia/Ulaanbaatar', difficulty: 'hard' },
  { name: 'Baku', country: 'Azerbaijan', timezone: 'Asia/Baku', difficulty: 'hard' },
  { name: 'Yerevan', country: 'Armenia', timezone: 'Asia/Yerevan', difficulty: 'hard' },
  { name: 'Muscat', country: 'Oman', timezone: 'Asia/Muscat', difficulty: 'hard' },
  { name: 'Phnom Penh', country: 'Cambodia', timezone: 'Asia/Phnom_Penh', difficulty: 'hard' },
  { name: 'Vientiane', country: 'Laos', timezone: 'Asia/Vientiane', difficulty: 'hard' },
  { name: 'Montevideo', country: 'Uruguay', timezone: 'America/Montevideo', difficulty: 'hard' },
  { name: 'Asuncion', country: 'Paraguay', timezone: 'America/Asuncion', difficulty: 'hard' },
  { name: 'La Paz', country: 'Bolivia', timezone: 'America/La_Paz', difficulty: 'hard' },
  { name: 'Quito', country: 'Ecuador', timezone: 'America/Guayaquil', difficulty: 'hard' },
  { name: 'Manaus', country: 'Brazil', timezone: 'America/Manaus', difficulty: 'hard' },
  { name: 'Suva', country: 'Fiji', timezone: 'Pacific/Fiji', difficulty: 'hard' },
  { name: 'Tongatapu', country: 'Tonga', timezone: 'Pacific/Tongatapu', difficulty: 'hard' },
  { name: 'Nukualofa', country: 'Tonga', timezone: 'Pacific/Tongatapu', difficulty: 'hard' },
  { name: 'Kiritimati', country: 'Kiribati', timezone: 'Pacific/Kiritimati', difficulty: 'hard' },
  { name: 'Midway', country: 'US Minor Islands', timezone: 'Pacific/Midway', difficulty: 'hard' },
  { name: 'Funafuti', country: 'Tuvalu', timezone: 'Pacific/Funafuti', difficulty: 'hard' },
  { name: 'Dili', country: 'East Timor', timezone: 'Asia/Dili', difficulty: 'hard' },
  { name: 'Bishkek', country: 'Kyrgyzstan', timezone: 'Asia/Bishkek', difficulty: 'hard' },
  { name: 'Dushanbe', country: 'Tajikistan', timezone: 'Asia/Dushanbe', difficulty: 'hard' },
  { name: 'Ashgabat', country: 'Turkmenistan', timezone: 'Asia/Ashgabat', difficulty: 'hard' },
  { name: 'Male', country: 'Maldives', timezone: 'Indian/Maldives', difficulty: 'hard' },
  { name: 'Maputo', country: 'Mozambique', timezone: 'Africa/Maputo', difficulty: 'hard' },
  // ─── Additional Cities (expanding to 200+) ─────────────────
  // Easy — more well-known cities
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', difficulty: 'easy' },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', difficulty: 'easy' },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', difficulty: 'easy' },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', difficulty: 'easy' },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', difficulty: 'easy' },
  { name: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', difficulty: 'easy' },
  { name: 'Munich', country: 'Germany', timezone: 'Europe/Berlin', difficulty: 'easy' },
  { name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', difficulty: 'easy' },
  { name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', difficulty: 'easy' },
  { name: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', difficulty: 'easy' },
  { name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', difficulty: 'easy' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', difficulty: 'easy' },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', difficulty: 'easy' },
  { name: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo', difficulty: 'easy' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', difficulty: 'easy' },
  { name: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', difficulty: 'easy' },
  { name: 'Montreal', country: 'Canada', timezone: 'America/Toronto', difficulty: 'easy' },
  { name: 'Dallas', country: 'USA', timezone: 'America/Chicago', difficulty: 'easy' },
  { name: 'Seattle', country: 'USA', timezone: 'America/Los_Angeles', difficulty: 'easy' },
  { name: 'Phoenix', country: 'USA', timezone: 'America/Phoenix', difficulty: 'easy' },
  // Medium — less obvious cities
  { name: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', difficulty: 'medium' },
  { name: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo', difficulty: 'medium' },
  { name: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen', difficulty: 'medium' },
  { name: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague', difficulty: 'medium' },
  { name: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest', difficulty: 'medium' },
  { name: 'Bucharest', country: 'Romania', timezone: 'Europe/Bucharest', difficulty: 'medium' },
  { name: 'Kyiv', country: 'Ukraine', timezone: 'Europe/Kyiv', difficulty: 'medium' },
  { name: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', difficulty: 'medium' },
  { name: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar', difficulty: 'medium' },
  { name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', difficulty: 'medium' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', difficulty: 'medium' },
  { name: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', difficulty: 'medium' },
  { name: 'Santiago', country: 'Chile', timezone: 'America/Santiago', difficulty: 'medium' },
  { name: 'Havana', country: 'Cuba', timezone: 'America/Havana', difficulty: 'medium' },
  { name: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca', difficulty: 'medium' },
  { name: 'Accra', country: 'Ghana', timezone: 'Africa/Accra', difficulty: 'medium' },
  { name: 'Dakar', country: 'Senegal', timezone: 'Africa/Dakar', difficulty: 'medium' },
  { name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', difficulty: 'medium' },
  { name: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg', difficulty: 'medium' },
  { name: 'Perth', country: 'Australia', timezone: 'Australia/Perth', difficulty: 'medium' },
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', difficulty: 'medium' },
  { name: 'Kolkata', country: 'India', timezone: 'Asia/Kolkata', difficulty: 'medium' },
  { name: 'Chennai', country: 'India', timezone: 'Asia/Kolkata', difficulty: 'medium' },
  { name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', difficulty: 'medium' },
  // Hard — unusual timezones and less-known cities
  { name: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', difficulty: 'hard' },
  { name: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran', difficulty: 'hard' },
  { name: 'Kabul', country: 'Afghanistan', timezone: 'Asia/Kabul', difficulty: 'hard' },
  { name: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon', difficulty: 'hard' },
  { name: 'Chatham Islands', country: 'New Zealand', timezone: 'Pacific/Chatham', difficulty: 'hard' },
  { name: 'Marquesas Islands', country: 'French Polynesia', timezone: 'Pacific/Marquesas', difficulty: 'hard' },
  { name: 'Lord Howe Island', country: 'Australia', timezone: 'Australia/Lord_Howe', difficulty: 'hard' },
  { name: 'Eucla', country: 'Australia', timezone: 'Australia/Eucla', difficulty: 'hard' },
  { name: 'Newfoundland', country: 'Canada', timezone: 'America/St_Johns', difficulty: 'hard' },
  { name: 'Adak', country: 'USA', timezone: 'America/Adak', difficulty: 'hard' },
  { name: 'Kiritimati', country: 'Kiribati', timezone: 'Pacific/Kiritimati', difficulty: 'hard' },
  { name: 'Nuku\'alofa', country: 'Tonga', timezone: 'Pacific/Tongatapu', difficulty: 'hard' },
  { name: 'Apia', country: 'Samoa', timezone: 'Pacific/Apia', difficulty: 'hard' },
  { name: 'Suva', country: 'Fiji', timezone: 'Pacific/Fiji', difficulty: 'hard' },
  { name: 'Noumea', country: 'New Caledonia', timezone: 'Pacific/Noumea', difficulty: 'hard' },
  { name: 'Pago Pago', country: 'American Samoa', timezone: 'Pacific/Pago_Pago', difficulty: 'hard' },
  { name: 'Majuro', country: 'Marshall Islands', timezone: 'Pacific/Majuro', difficulty: 'hard' },
  { name: 'Tarawa', country: 'Kiribati', timezone: 'Pacific/Tarawa', difficulty: 'hard' },
  { name: 'Honiara', country: 'Solomon Islands', timezone: 'Pacific/Guadalcanal', difficulty: 'hard' },
  { name: 'Port Vila', country: 'Vanuatu', timezone: 'Pacific/Efate', difficulty: 'hard' },
  { name: 'Ngerulmud', country: 'Palau', timezone: 'Pacific/Palau', difficulty: 'hard' },
  { name: 'Yaren', country: 'Nauru', timezone: 'Pacific/Nauru', difficulty: 'hard' },
  { name: 'Funafuti', country: 'Tuvalu', timezone: 'Pacific/Funafuti', difficulty: 'hard' },
  { name: 'Baku', country: 'Azerbaijan', timezone: 'Asia/Baku', difficulty: 'hard' },
  { name: 'Yerevan', country: 'Armenia', timezone: 'Asia/Yerevan', difficulty: 'hard' },
  { name: 'Muscat', country: 'Oman', timezone: 'Asia/Muscat', difficulty: 'hard' },
  { name: 'Manama', country: 'Bahrain', timezone: 'Asia/Bahrain', difficulty: 'hard' },
  { name: 'Amman', country: 'Jordan', timezone: 'Asia/Amman', difficulty: 'hard' },
  { name: 'Beirut', country: 'Lebanon', timezone: 'Asia/Beirut', difficulty: 'hard' },
  { name: 'Damascus', country: 'Syria', timezone: 'Asia/Damascus', difficulty: 'hard' },
  { name: 'Baghdad', country: 'Iraq', timezone: 'Asia/Baghdad', difficulty: 'hard' },
  { name: 'Ulaanbaatar', country: 'Mongolia', timezone: 'Asia/Ulaanbaatar', difficulty: 'hard' },
  { name: 'Phnom Penh', country: 'Cambodia', timezone: 'Asia/Phnom_Penh', difficulty: 'hard' },
  { name: 'Vientiane', country: 'Laos', timezone: 'Asia/Vientiane', difficulty: 'hard' },
  { name: 'Colombo', country: 'Sri Lanka', timezone: 'Asia/Colombo', difficulty: 'hard' },
  { name: 'Thimphu', country: 'Bhutan', timezone: 'Asia/Thimphu', difficulty: 'hard' },
  { name: 'Male', country: 'Maldives', timezone: 'Indian/Maldives', difficulty: 'hard' },
  { name: 'Antananarivo', country: 'Madagascar', timezone: 'Indian/Antananarivo', difficulty: 'hard' },
  { name: 'Port Louis', country: 'Mauritius', timezone: 'Indian/Mauritius', difficulty: 'hard' },
  { name: 'Victoria', country: 'Seychelles', timezone: 'Indian/Mahe', difficulty: 'hard' },
  { name: 'Mogadishu', country: 'Somalia', timezone: 'Africa/Mogadishu', difficulty: 'hard' },
  { name: 'Kampala', country: 'Uganda', timezone: 'Africa/Kampala', difficulty: 'hard' },
  { name: 'Kigali', country: 'Rwanda', timezone: 'Africa/Kigali', difficulty: 'hard' },
  { name: 'Dar es Salaam', country: 'Tanzania', timezone: 'Africa/Dar_es_Salaam', difficulty: 'hard' },
  { name: 'Lusaka', country: 'Zambia', timezone: 'Africa/Lusaka', difficulty: 'hard' },
  { name: 'Harare', country: 'Zimbabwe', timezone: 'Africa/Harare', difficulty: 'hard' },
  { name: 'Windhoek', country: 'Namibia', timezone: 'Africa/Windhoek', difficulty: 'hard' },
  { name: 'Luanda', country: 'Angola', timezone: 'Africa/Luanda', difficulty: 'hard' },
  { name: 'Kinshasa', country: 'DR Congo', timezone: 'Africa/Kinshasa', difficulty: 'hard' },
  { name: 'Libreville', country: 'Gabon', timezone: 'Africa/Libreville', difficulty: 'hard' },
  { name: 'Douala', country: 'Cameroon', timezone: 'Africa/Douala', difficulty: 'hard' },
  { name: 'Bamako', country: 'Mali', timezone: 'Africa/Bamako', difficulty: 'hard' },
  { name: 'Ouagadougou', country: 'Burkina Faso', timezone: 'Africa/Ouagadougou', difficulty: 'hard' },
  { name: 'Conakry', country: 'Guinea', timezone: 'Africa/Conakry', difficulty: 'hard' },
  { name: 'Freetown', country: 'Sierra Leone', timezone: 'Africa/Freetown', difficulty: 'hard' },
  { name: 'Monrovia', country: 'Liberia', timezone: 'Africa/Monrovia', difficulty: 'hard' },
  { name: 'Lome', country: 'Togo', timezone: 'Africa/Lome', difficulty: 'hard' },
  { name: 'Niamey', country: 'Niger', timezone: 'Africa/Niamey', difficulty: 'hard' },
  { name: 'N\'Djamena', country: 'Chad', timezone: 'Africa/Ndjamena', difficulty: 'hard' },
  { name: 'Khartoum', country: 'Sudan', timezone: 'Africa/Khartoum', difficulty: 'hard' },
  { name: 'Asmara', country: 'Eritrea', timezone: 'Africa/Asmara', difficulty: 'hard' },
  { name: 'Tripoli', country: 'Libya', timezone: 'Africa/Tripoli', difficulty: 'hard' },
  { name: 'Tunis', country: 'Tunisia', timezone: 'Africa/Tunis', difficulty: 'hard' },
  { name: 'Algiers', country: 'Algeria', timezone: 'Africa/Algiers', difficulty: 'hard' },
  { name: 'Tegucigalpa', country: 'Honduras', timezone: 'America/Tegucigalpa', difficulty: 'hard' },
  { name: 'Managua', country: 'Nicaragua', timezone: 'America/Managua', difficulty: 'hard' },
  { name: 'San Salvador', country: 'El Salvador', timezone: 'America/El_Salvador', difficulty: 'hard' },
  { name: 'Georgetown', country: 'Guyana', timezone: 'America/Guyana', difficulty: 'hard' },
  { name: 'Paramaribo', country: 'Suriname', timezone: 'America/Paramaribo', difficulty: 'hard' },
  { name: 'Asuncion', country: 'Paraguay', timezone: 'America/Asuncion', difficulty: 'hard' },
  { name: 'Montevideo', country: 'Uruguay', timezone: 'America/Montevideo', difficulty: 'hard' },
  { name: 'La Paz', country: 'Bolivia', timezone: 'America/La_Paz', difficulty: 'hard' },
  { name: 'Quito', country: 'Ecuador', timezone: 'America/Guayaquil', difficulty: 'hard' },
  { name: 'Port-au-Prince', country: 'Haiti', timezone: 'America/Port-au-Prince', difficulty: 'hard' },
  { name: 'Nassau', country: 'Bahamas', timezone: 'America/Nassau', difficulty: 'hard' },
  { name: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', difficulty: 'hard' },
  { name: 'Nuuk', country: 'Greenland', timezone: 'America/Nuuk', difficulty: 'hard' },
  { name: 'Tirana', country: 'Albania', timezone: 'Europe/Tirane', difficulty: 'hard' },
  { name: 'Skopje', country: 'North Macedonia', timezone: 'Europe/Skopje', difficulty: 'hard' },
  { name: 'Podgorica', country: 'Montenegro', timezone: 'Europe/Podgorica', difficulty: 'hard' },
  { name: 'Sarajevo', country: 'Bosnia', timezone: 'Europe/Sarajevo', difficulty: 'hard' },
  { name: 'Chisinau', country: 'Moldova', timezone: 'Europe/Chisinau', difficulty: 'hard' },
  { name: 'Minsk', country: 'Belarus', timezone: 'Europe/Minsk', difficulty: 'hard' },
  { name: 'Vladivostok', country: 'Russia', timezone: 'Asia/Vladivostok', difficulty: 'hard' },
  { name: 'Novosibirsk', country: 'Russia', timezone: 'Asia/Novosibirsk', difficulty: 'hard' },
  { name: 'Yakutsk', country: 'Russia', timezone: 'Asia/Yakutsk', difficulty: 'hard' },
  { name: 'Petropavlovsk-Kamchatsky', country: 'Russia', timezone: 'Asia/Kamchatka', difficulty: 'hard' },
  // ─── World Capitals (Easy batch 3) ────────────────────────
  { name: 'Washington D.C.', country: 'USA', timezone: 'America/New_York', difficulty: 'easy' },
  { name: 'Ottawa', country: 'Canada', timezone: 'America/Toronto', difficulty: 'easy' },
  { name: 'Canberra', country: 'Australia', timezone: 'Australia/Sydney', difficulty: 'easy' },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', difficulty: 'easy' },
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', difficulty: 'easy' },
  { name: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo', difficulty: 'easy' },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', difficulty: 'easy' },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', difficulty: 'easy' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', difficulty: 'easy' },
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', difficulty: 'easy' },
  // ─── World Capitals (Medium batch 3) ──────────────────────
  { name: 'Ankara', country: 'Turkey', timezone: 'Europe/Istanbul', difficulty: 'medium' },
  { name: 'Islamabad', country: 'Pakistan', timezone: 'Asia/Karachi', difficulty: 'medium' },
  { name: 'Brasilia', country: 'Brazil', timezone: 'America/Sao_Paulo', difficulty: 'medium' },
  { name: 'Abuja', country: 'Nigeria', timezone: 'Africa/Lagos', difficulty: 'medium' },
  { name: 'Rabat', country: 'Morocco', timezone: 'Africa/Casablanca', difficulty: 'medium' },
  { name: 'Algiers', country: 'Algeria', timezone: 'Africa/Algiers', difficulty: 'medium' },
  { name: 'Tunis', country: 'Tunisia', timezone: 'Africa/Tunis', difficulty: 'medium' },
  { name: 'Pretoria', country: 'South Africa', timezone: 'Africa/Johannesburg', difficulty: 'medium' },
  { name: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', difficulty: 'medium' },
  { name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', difficulty: 'medium' },
  { name: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', difficulty: 'medium' },
  { name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', difficulty: 'medium' },
  { name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', difficulty: 'medium' },
  { name: 'Kyiv', country: 'Ukraine', timezone: 'Europe/Kyiv', difficulty: 'medium' },
  { name: 'Belgrade', country: 'Serbia', timezone: 'Europe/Belgrade', difficulty: 'medium' },
  { name: 'Addis Ababa', country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', difficulty: 'medium' },
  { name: 'Colombo', country: 'Sri Lanka', timezone: 'Asia/Colombo', difficulty: 'medium' },
  { name: 'Muscat', country: 'Oman', timezone: 'Asia/Muscat', difficulty: 'medium' },
  { name: 'Abu Dhabi', country: 'UAE', timezone: 'Asia/Dubai', difficulty: 'medium' },
  { name: 'Kuwait City', country: 'Kuwait', timezone: 'Asia/Kuwait', difficulty: 'medium' },
  // ─── World Capitals (Hard batch 3) ────────────────────────
  { name: 'Kabul', country: 'Afghanistan', timezone: 'Asia/Kabul', difficulty: 'hard' },
  { name: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran', difficulty: 'hard' },
  { name: 'Baghdad', country: 'Iraq', timezone: 'Asia/Baghdad', difficulty: 'hard' },
  { name: 'Damascus', country: 'Syria', timezone: 'Asia/Damascus', difficulty: 'hard' },
  { name: 'Amman', country: 'Jordan', timezone: 'Asia/Amman', difficulty: 'hard' },
  { name: 'Beirut', country: 'Lebanon', timezone: 'Asia/Beirut', difficulty: 'hard' },
  { name: 'Naypyidaw', country: 'Myanmar', timezone: 'Asia/Yangon', difficulty: 'hard' },
  { name: 'Pyongyang', country: 'North Korea', timezone: 'Asia/Pyongyang', difficulty: 'hard' },
  { name: 'Ulaanbaatar', country: 'Mongolia', timezone: 'Asia/Ulaanbaatar', difficulty: 'hard' },
  { name: 'Astana', country: 'Kazakhstan', timezone: 'Asia/Almaty', difficulty: 'hard' },
  { name: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent', difficulty: 'hard' },
  { name: 'Ashgabat', country: 'Turkmenistan', timezone: 'Asia/Ashgabat', difficulty: 'hard' },
  { name: 'Bishkek', country: 'Kyrgyzstan', timezone: 'Asia/Bishkek', difficulty: 'hard' },
  { name: 'Dushanbe', country: 'Tajikistan', timezone: 'Asia/Dushanbe', difficulty: 'hard' },
  { name: 'Yerevan', country: 'Armenia', timezone: 'Asia/Yerevan', difficulty: 'hard' },
  { name: 'Baku', country: 'Azerbaijan', timezone: 'Asia/Baku', difficulty: 'hard' },
  { name: 'Tbilisi', country: 'Georgia', timezone: 'Asia/Tbilisi', difficulty: 'hard' },
  { name: 'Kampala', country: 'Uganda', timezone: 'Africa/Kampala', difficulty: 'hard' },
  { name: 'Kigali', country: 'Rwanda', timezone: 'Africa/Kigali', difficulty: 'hard' },
  { name: 'Lusaka', country: 'Zambia', timezone: 'Africa/Lusaka', difficulty: 'hard' },
  { name: 'Harare', country: 'Zimbabwe', timezone: 'Africa/Harare', difficulty: 'hard' },
  { name: 'Maputo', country: 'Mozambique', timezone: 'Africa/Maputo', difficulty: 'hard' },
  { name: 'Windhoek', country: 'Namibia', timezone: 'Africa/Windhoek', difficulty: 'hard' },
  { name: 'Antananarivo', country: 'Madagascar', timezone: 'Indian/Antananarivo', difficulty: 'hard' },
  { name: 'Mogadishu', country: 'Somalia', timezone: 'Africa/Mogadishu', difficulty: 'hard' },
  { name: 'Khartoum', country: 'Sudan', timezone: 'Africa/Khartoum', difficulty: 'hard' },
  { name: 'Tripoli', country: 'Libya', timezone: 'Africa/Tripoli', difficulty: 'hard' },
  { name: 'Bamako', country: 'Mali', timezone: 'Africa/Bamako', difficulty: 'hard' },
  { name: 'Ouagadougou', country: 'Burkina Faso', timezone: 'Africa/Ouagadougou', difficulty: 'hard' },
  { name: 'Niamey', country: 'Niger', timezone: 'Africa/Niamey', difficulty: 'hard' },
  { name: 'Dakar', country: 'Senegal', timezone: 'Africa/Dakar', difficulty: 'hard' },
  { name: 'Conakry', country: 'Guinea', timezone: 'Africa/Conakry', difficulty: 'hard' },
  { name: 'Freetown', country: 'Sierra Leone', timezone: 'Africa/Freetown', difficulty: 'hard' },
  { name: 'Monrovia', country: 'Liberia', timezone: 'Africa/Monrovia', difficulty: 'hard' },
  { name: 'Lome', country: 'Togo', timezone: 'Africa/Lome', difficulty: 'hard' },
  { name: 'Porto-Novo', country: 'Benin', timezone: 'Africa/Porto-Novo', difficulty: 'hard' },
  { name: 'Libreville', country: 'Gabon', timezone: 'Africa/Libreville', difficulty: 'hard' },
  { name: 'Brazzaville', country: 'Congo', timezone: 'Africa/Brazzaville', difficulty: 'hard' },
  { name: 'Kinshasa', country: 'DR Congo', timezone: 'Africa/Kinshasa', difficulty: 'hard' },
  { name: 'Luanda', country: 'Angola', timezone: 'Africa/Luanda', difficulty: 'hard' },
  { name: 'Lilongwe', country: 'Malawi', timezone: 'Africa/Blantyre', difficulty: 'hard' },
  { name: 'Dodoma', country: 'Tanzania', timezone: 'Africa/Dar_es_Salaam', difficulty: 'hard' },
  { name: 'Gaborone', country: 'Botswana', timezone: 'Africa/Gaborone', difficulty: 'hard' },
  // ─── Americas Capitals (Hard) ─────────────────────────────
  { name: 'Tegucigalpa', country: 'Honduras', timezone: 'America/Tegucigalpa', difficulty: 'hard' },
  { name: 'San Salvador', country: 'El Salvador', timezone: 'America/El_Salvador', difficulty: 'hard' },
  { name: 'Managua', country: 'Nicaragua', timezone: 'America/Managua', difficulty: 'hard' },
  { name: 'San Jose', country: 'Costa Rica', timezone: 'America/Costa_Rica', difficulty: 'hard' },
  { name: 'Panama City', country: 'Panama', timezone: 'America/Panama', difficulty: 'hard' },
  { name: 'Guatemala City', country: 'Guatemala', timezone: 'America/Guatemala', difficulty: 'hard' },
  { name: 'Belmopan', country: 'Belize', timezone: 'America/Belize', difficulty: 'hard' },
  { name: 'Port-au-Prince', country: 'Haiti', timezone: 'America/Port-au-Prince', difficulty: 'hard' },
  { name: 'Santo Domingo', country: 'Dominican Republic', timezone: 'America/Santo_Domingo', difficulty: 'hard' },
  { name: 'Nassau', country: 'Bahamas', timezone: 'America/Nassau', difficulty: 'hard' },
  { name: 'Kingston', country: 'Jamaica', timezone: 'America/Jamaica', difficulty: 'hard' },
  { name: 'Georgetown', country: 'Guyana', timezone: 'America/Guyana', difficulty: 'hard' },
  { name: 'Paramaribo', country: 'Suriname', timezone: 'America/Paramaribo', difficulty: 'hard' },
  // ─── Pacific Islands (Hard) ───────────────────────────────
  { name: 'Apia', country: 'Samoa', timezone: 'Pacific/Apia', difficulty: 'hard' },
  { name: 'Port Vila', country: 'Vanuatu', timezone: 'Pacific/Efate', difficulty: 'hard' },
  { name: 'Honiara', country: 'Solomon Islands', timezone: 'Pacific/Guadalcanal', difficulty: 'hard' },
  { name: 'Tarawa', country: 'Kiribati', timezone: 'Pacific/Tarawa', difficulty: 'hard' },
  { name: 'Nuku\'alofa', country: 'Tonga', timezone: 'Pacific/Tongatapu', difficulty: 'hard' },
  { name: 'Pago Pago', country: 'American Samoa', timezone: 'Pacific/Pago_Pago', difficulty: 'hard' },
  { name: 'Noumea', country: 'New Caledonia', timezone: 'Pacific/Noumea', difficulty: 'hard' },
  { name: 'Papeete', country: 'French Polynesia', timezone: 'Pacific/Tahiti', difficulty: 'hard' },
  // ─── European Cities (Medium) ─────────────────────────────
  { name: 'Sofia', country: 'Bulgaria', timezone: 'Europe/Sofia', difficulty: 'medium' },
  { name: 'Zagreb', country: 'Croatia', timezone: 'Europe/Zagreb', difficulty: 'medium' },
  { name: 'Tallinn', country: 'Estonia', timezone: 'Europe/Tallinn', difficulty: 'medium' },
  { name: 'Vilnius', country: 'Lithuania', timezone: 'Europe/Vilnius', difficulty: 'medium' },
  { name: 'Riga', country: 'Latvia', timezone: 'Europe/Riga', difficulty: 'medium' },
  { name: 'Bratislava', country: 'Slovakia', timezone: 'Europe/Bratislava', difficulty: 'medium' },
  { name: 'Ljubljana', country: 'Slovenia', timezone: 'Europe/Ljubljana', difficulty: 'medium' },
  { name: 'Edinburgh', country: 'UK', timezone: 'Europe/London', difficulty: 'medium' },
  { name: 'Milan', country: 'Italy', timezone: 'Europe/Rome', difficulty: 'medium' },
  { name: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin', difficulty: 'medium' },
  { name: 'Marseille', country: 'France', timezone: 'Europe/Paris', difficulty: 'medium' },
  { name: 'Porto', country: 'Portugal', timezone: 'Europe/Lisbon', difficulty: 'medium' },
  { name: 'Gothenburg', country: 'Sweden', timezone: 'Europe/Stockholm', difficulty: 'medium' },
  // ─── Unusual Timezone Cities (Hard) ───────────────────────
  { name: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', difficulty: 'hard' },
  { name: 'Kolkata', country: 'India', timezone: 'Asia/Kolkata', difficulty: 'hard' },
  { name: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon', difficulty: 'hard' },
  { name: 'Chatham Islands', country: 'New Zealand', timezone: 'Pacific/Chatham', difficulty: 'hard' },
  { name: 'Eucla', country: 'Australia', timezone: 'Australia/Eucla', difficulty: 'hard' },
  { name: 'Lord Howe Island', country: 'Australia', timezone: 'Australia/Lord_Howe', difficulty: 'hard' },
  { name: 'Marquesas Islands', country: 'French Polynesia', timezone: 'Pacific/Marquesas', difficulty: 'hard' },
  { name: 'St. John\'s', country: 'Canada', timezone: 'America/St_Johns', difficulty: 'hard' },
  { name: 'Adelaide', country: 'Australia', timezone: 'Australia/Adelaide', difficulty: 'hard' },
  { name: 'Darwin', country: 'Australia', timezone: 'Australia/Darwin', difficulty: 'hard' },
  { name: 'Iqaluit', country: 'Canada', timezone: 'America/Iqaluit', difficulty: 'hard' },
  { name: 'Nuuk', country: 'Greenland', timezone: 'America/Nuuk', difficulty: 'hard' },
  { name: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', difficulty: 'hard' },
]

// ─── Fun Facts ─────────────────────────────────────────────
const FUN_FACTS = [
  "China uses a single timezone (UTC+8) despite spanning 5 geographical timezones!",
  "Nepal is the only country with a timezone offset of +5:45 — not a round number!",
  "France has the most timezones of any country — 12 in total, thanks to overseas territories.",
  "Before timezones, every city set clocks to local solar noon. Railroads changed that in the 1880s.",
  "India chose UTC+5:30 as a compromise between Kolkata (east) and Mumbai (west).",
  "The International Date Line zigzags to keep island nations in the same day.",
  "Chatham Islands, New Zealand is UTC+12:45 — one of the world's quirkiest offsets.",
  "Arizona doesn't observe daylight saving time, but the Navajo Nation within it does!",
  "Russia spans 11 timezones, the most contiguous timezones of any single country.",
  "Samoa skipped December 30, 2011 entirely when it moved across the date line.",
  "Lord Howe Island, Australia shifts clocks by only 30 minutes for daylight saving.",
  "The Moon has no official timezone — astronauts used Houston time during Apollo missions.",
  "Kiribati's Line Islands are UTC+14, making them the first place to see each new day.",
  "North Korea created its own timezone 'Pyongyang Time' (UTC+8:30) in 2015, then scrapped it in 2018.",
  "Spain is geographically in the same zone as the UK but uses Central European Time due to Franco's 1940 decree.",
  "Afghanistan uses UTC+4:30, one of several countries with a half-hour offset.",
  "Venezuela switched to UTC-4:30 in 2007, then back to UTC-4 in 2016.",
  "The US has 6 timezones in the contiguous states, plus 3 more for Alaska, Hawaii, and territories.",
  "Japan considered adopting DST after WWII but abandoned the idea as workers complained of exhaustion.",
  "Iran uses UTC+3:30 and also observes daylight saving time, creating UTC+4:30 in summer.",
  "Tonga and Samoa are among the first places to welcome each new day, at UTC+13.",
  "Before 1883, US railroads each kept their own time — some cities had dozens of different local times.",
  "UTC stands for Coordinated Universal Time — a compromise between English and French acronym orderings.",
  "Antarctica has no official timezone. Research stations use the time of their home country or supply route.",
  "Bhutan uses UTC+6, exactly 30 minutes different from its neighbor India at UTC+5:30.",
  "The concept of DST was first proposed by George Vernon Hudson, a New Zealand entomologist, in 1895.",
  "China abolished its five timezones in 1949 and adopted a single zone — Beijing Time (UTC+8).",
  "Newfoundland, Canada uses UTC-3:30, making it one of the few places with a :30 offset in the Americas.",
  "The International Date Line was established in 1884 at the International Meridian Conference in Washington, D.C.",
]

// ─── Helpers ───────────────────────────────────────────────
function getTimeForTimezone(tz: string): string {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return '12:00 PM'
  }
}

function generateOptions(correctTime: string, difficulty: Difficulty): string[] {
  const [timePart, period] = correctTime.split(' ')
  const [hourStr, minuteStr] = timePart.split(':')
  const hour = parseInt(hourStr)
  const minute = parseInt(minuteStr)

  // Convert to 24h for math
  let hour24 = hour
  if (period === 'PM' && hour !== 12) hour24 += 12
  if (period === 'AM' && hour === 12) hour24 = 0

  const offsets = difficulty === 'easy'
    ? [-1, 1, 2]
    : difficulty === 'medium'
    ? [-2, -1, 2]
    : [-1, 1, -2]

  const options = [correctTime]

  offsets.forEach(offset => {
    const newHour24 = (hour24 + offset + 24) % 24
    const newPeriod = newHour24 >= 12 ? 'PM' : 'AM'
    let newHour12 = newHour24 % 12
    if (newHour12 === 0) newHour12 = 12
    const newMin = difficulty === 'hard'
      ? String(((minute + (offset > 0 ? 15 : 45)) % 60)).padStart(2, '0')
      : String(minute).padStart(2, '0')
    options.push(`${String(newHour12).padStart(2, '0')}:${newMin} ${newPeriod}`)
  })

  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }

  return options
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// ─── Components ────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100
  return (
    <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function TimerBar({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const pct = (timeLeft / maxTime) * 100
  const color = timeLeft <= 3 ? 'from-red-500 to-red-400' : timeLeft <= 5 ? 'from-yellow-500 to-yellow-400' : 'from-green-500 to-secondary'
  return (
    <div className="w-full h-1.5 bg-card-border rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 linear`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────
export default function TimezoneQuizPage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [questions, setQuestions] = useState<CityData[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFact, setShowFact] = useState(false)
  const [currentFact, setCurrentFact] = useState('')
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerMode, setTimerMode] = useState<'timed' | 'untimed'>('timed')
  const [timerSeconds, setTimerSeconds] = useState(10)
  const [bestScore, setBestScore] = useState(0)
  const [animateScore, setAnimateScore] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Load best score
  useEffect(() => {
    const saved = localStorage.getItem('tz-quiz-best')
    if (saved) setBestScore(parseInt(saved))
  }, [])

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff)
    const pool = diff === 'easy'
      ? CITIES.filter(c => c.difficulty === 'easy')
      : diff === 'medium'
      ? CITIES.filter(c => c.difficulty !== 'hard')
      : CITIES

    const selected = shuffleArray(pool).slice(0, 10)
    setQuestions(selected)
    setCurrentQ(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setResults([])
    setSelectedAnswer(null)
    setShowFact(false)
    setGameState('playing')

    // Setup first question
    const city = selected[0]
    const correct = getTimeForTimezone(city.timezone)
    setCorrectAnswer(correct)
    setOptions(generateOptions(correct, diff))
    setTimeLeft(timerSeconds)
    startTimeRef.current = Date.now()
  }, [])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null || timerMode === 'untimed') return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up — auto wrong
          clearInterval(timerRef.current!)
          handleAnswer('__timeout__')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, currentQ, selectedAnswer])

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return
    if (timerRef.current) clearInterval(timerRef.current)

    const isTimeout = answer === '__timeout__'
    const isCorrect = !isTimeout && answer === correctAnswer
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const timeBonus = isCorrect && elapsed <= 5

    setSelectedAnswer(isTimeout ? '' : answer)

    if (isCorrect) {
      const points = timeBonus ? 2 : 1
      setScore(prev => prev + points)
      setStreak(prev => {
        const newStreak = prev + 1
        setMaxStreak(ms => Math.max(ms, newStreak))
        return newStreak
      })
      setAnimateScore(true)
      setTimeout(() => setAnimateScore(false), 600)
    } else {
      setStreak(0)
    }

    setResults(prev => [...prev, {
      city: questions[currentQ],
      correct: isCorrect,
      timeBonus,
      selectedAnswer: isTimeout ? 'Timed out' : answer,
      correctAnswer,
    }])

    // Show fun fact
    setCurrentFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)])
    setShowFact(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswer, correctAnswer, currentQ, questions])

  const nextQuestion = useCallback(() => {
    const nextIdx = currentQ + 1
    if (nextIdx >= 10) {
      // Game over
      const finalScore = score
      if (finalScore > bestScore) {
        setBestScore(finalScore)
        localStorage.setItem('tz-quiz-best', String(finalScore))
      }
      setGameState('results')
      return
    }

    setCurrentQ(nextIdx)
    setSelectedAnswer(null)
    setShowFact(false)

    const city = questions[nextIdx]
    const correct = getTimeForTimezone(city.timezone)
    setCorrectAnswer(correct)
    setOptions(generateOptions(correct, difficulty))
    setTimeLeft(timerSeconds)
    startTimeRef.current = Date.now()
  }, [currentQ, questions, difficulty, score, bestScore])

  const shareResult = () => {
    const correctCount = results.filter(r => r.correct).length
    const text = `I scored ${correctCount}/10 on the DateAndTimezone Timezone Challenge! (${difficulty} mode) Can you beat me? https://www.dateandtimezone.com/timezone-quiz`
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  // ─── Menu Screen ─────────────────────────────────────────
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 pt-10 sm:pt-12 pb-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 mb-6">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Timezone Challenge
            </h1>
            <p className="text-muted text-lg max-w-md mx-auto">
              Can you guess the current time in cities around the world? Test your timezone knowledge!
            </p>
          </div>

          {/* Best Score */}
          {bestScore > 0 && (
            <div className="flex items-center justify-center gap-2 mb-8 text-yellow-400">
              <Trophy className="w-5 h-5" />
              <span className="font-heading font-semibold">Personal Best: {bestScore} points</span>
            </div>
          )}

          {/* Timer Settings */}
          <div className="mb-6 p-4 rounded-xl bg-card-bg border border-card-border">
            <p className="text-sm font-medium text-white mb-3">Timer Settings</p>
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setTimerMode('timed')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${timerMode === 'timed' ? 'bg-primary/20 border border-primary/50 text-blue-300' : 'border border-card-border text-muted hover:text-white'}`}
              >
                ⏱️ Timed
              </button>
              <button
                onClick={() => setTimerMode('untimed')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${timerMode === 'untimed' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' : 'border border-card-border text-muted hover:text-white'}`}
              >
                🧘 No Timer
              </button>
            </div>
            {timerMode === 'timed' && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">Seconds per question:</span>
                {[5, 10, 15, 20, 30].map(s => (
                  <button
                    key={s}
                    onClick={() => setTimerSeconds(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timerSeconds === s ? 'bg-primary text-white' : 'border border-card-border text-muted hover:text-white'}`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-center mb-6">Choose Difficulty</h2>

            {([
              { level: 'easy' as Difficulty, icon: Star, label: 'Easy', desc: 'Major cities, wider time gaps', color: 'from-green-500 to-emerald-400' },
              { level: 'medium' as Difficulty, icon: Target, label: 'Medium', desc: 'More cities, trickier options', color: 'from-yellow-500 to-orange-400' },
              { level: 'hard' as Difficulty, icon: Flame, label: 'Hard', desc: 'Obscure cities, close options', color: 'from-red-500 to-pink-500' },
            ]).map(({ level, icon: Icon, label, desc, color }) => (
              <button
                key={level}
                onClick={() => startGame(level)}
                className="w-full group flex items-center gap-4 p-5 rounded-xl bg-card-bg border border-card-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-heading font-semibold text-lg">{label}</div>
                  <div className="text-muted text-sm">{desc}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>

          {/* How to Play */}
          <div className="mt-12 p-6 rounded-xl bg-card-bg border border-card-border">
            <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              How to Play
            </h3>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                You will see a city name and 4 time options
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Pick the correct current time for that city
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Answer within 5 seconds for a speed bonus (+2 points instead of +1)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                10 questions per round — try to get a perfect score!
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // ─── Playing Screen ──────────────────────────────────────
  if (gameState === 'playing') {
    const city = questions[currentQ]

    return (
      <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`font-heading font-bold text-2xl transition-all duration-300 ${animateScore ? 'scale-125 text-yellow-400' : ''}`}>
                <Zap className="w-4 h-4 inline mr-1 text-yellow-400" />
                {score}
              </div>
              {streak >= 2 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-semibold animate-pulse">
                  <Flame className="w-4 h-4" />
                  {streak} streak
                </div>
              )}
            </div>
            <div className="text-muted text-sm font-medium">
              {currentQ + 1} / 10
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar current={currentQ + (selectedAnswer !== null ? 1 : 0)} total={10} />

          {/* Timer */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted mb-1">
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span>{timeLeft}s</span>
              </div>
              {timeLeft <= 5 && timeLeft > 0 && selectedAnswer === null && (
                <span className="text-yellow-400 text-xs">Speed bonus available!</span>
              )}
            </div>
            {timerMode === 'timed' && <TimerBar timeLeft={timeLeft} maxTime={timerSeconds} />}
          </div>

          {/* Question Card */}
          <div className="mt-8 p-8 rounded-2xl bg-card-bg border border-card-border text-center">
            <div className="text-muted text-sm uppercase tracking-wider mb-2">What time is it in...</div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-1">{city.name}</h2>
            <p className="text-muted text-lg">{city.country}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {options.map((option, idx) => {
              let btnStyle = 'bg-card-bg border-card-border hover:border-primary/50 hover:bg-primary/10'
              if (selectedAnswer !== null) {
                if (option === correctAnswer) {
                  btnStyle = 'bg-green-500/20 border-green-500/50 text-green-400'
                } else if (option === selectedAnswer && option !== correctAnswer) {
                  btnStyle = 'bg-red-500/20 border-red-500/50 text-red-400'
                } else {
                  btnStyle = 'bg-card-bg border-card-border opacity-50'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-xl border text-center font-heading text-xl font-semibold transition-all duration-300 ${btnStyle} ${selectedAnswer === null ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                >
                  <Clock className="w-4 h-4 inline mr-2 opacity-50" />
                  {option}
                </button>
              )
            })}
          </div>

          {/* Feedback + Fun Fact */}
          {selectedAnswer !== null && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              {/* Result */}
              <div className={`p-4 rounded-xl border ${
                results[results.length - 1]?.correct
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2 font-heading font-semibold text-lg">
                  {results[results.length - 1]?.correct ? (
                    <>
                      <Sparkles className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">
                        Correct! {results[results.length - 1]?.timeBonus ? '+2 (speed bonus!)' : '+1'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-400">Wrong! The answer was {correctAnswer}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Fun Fact */}
              {showFact && (
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                  <div className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-secondary font-heading font-semibold text-sm mb-1">Did you know?</div>
                      <p className="text-muted text-sm">{currentFact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <button
                onClick={nextQuestion}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover font-heading font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                {currentQ < 9 ? 'Next Question' : 'See Results'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        `}</style>
      </div>
    )
  }

  // ─── Results Screen ──────────────────────────────────────
  const correctCount = results.filter(r => r.correct).length
  const bonusCount = results.filter(r => r.timeBonus).length
  const isNewBest = score >= bestScore && score > 0

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Score Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2">
            {correctCount}/10
          </h1>
          <p className="text-muted text-lg">
            {correctCount >= 9 ? 'Timezone Master!' : correctCount >= 7 ? 'Great job!' : correctCount >= 5 ? 'Not bad!' : 'Keep practicing!'}
          </p>

          {isNewBest && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-heading font-semibold animate-bounce">
              <Award className="w-5 h-5" />
              New Personal Best!
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Total Score', value: score, icon: Zap, color: 'text-yellow-400' },
            { label: 'Best Streak', value: maxStreak, icon: Flame, color: 'text-orange-400' },
            { label: 'Speed Bonuses', value: bonusCount, icon: Timer, color: 'text-green-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <div className="font-heading font-bold text-2xl">{value}</div>
              <div className="text-muted text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Question Review */}
        <div className="space-y-2 mb-8">
          <h3 className="font-heading font-semibold text-lg mb-3">Question Review</h3>
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                r.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  r.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {r.correct ? '✓' : '✗'}
                </span>
                <div>
                  <span className="font-medium">{r.city.name}</span>
                  <span className="text-muted text-sm ml-2">{r.city.country}</span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className={r.correct ? 'text-green-400' : 'text-red-400'}>
                  {r.correct ? r.correctAnswer : r.selectedAnswer}
                </div>
                {!r.correct && (
                  <div className="text-muted text-xs">Correct: {r.correctAnswer}</div>
                )}
                {r.timeBonus && (
                  <div className="text-yellow-400 text-xs">+speed bonus</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="p-5 rounded-xl bg-card-bg border border-card-border mb-8">
          <h3 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Your Best Scores
          </h3>
          <div className="flex items-center justify-between py-2 border-b border-card-border">
            <span className="text-muted">Personal Best</span>
            <span className="font-heading font-bold text-yellow-400">{bestScore} points</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted">This Game</span>
            <span className="font-heading font-bold">{score} points</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => startGame(difficulty)}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover font-heading font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={shareResult}
            className="flex-1 py-3 rounded-xl bg-card-bg border border-card-border hover:border-primary/50 font-heading font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Score
          </button>
        </div>

        <button
          onClick={() => setGameState('menu')}
          className="w-full mt-3 py-3 rounded-xl text-muted hover:text-[#E2E8F0] font-heading font-semibold transition-all duration-300"
        >
          Change Difficulty
        </button>
      </div>

      <AdBanner />
    </div>
  )
}
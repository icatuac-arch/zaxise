'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Flag, Trophy, Zap, RotateCcw, Share2,
  ChevronRight, Flame, Award, Brain, Timer, Sparkles, ArrowLeft
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Types ─────────────────────────────────────────────────
type GameState = 'menu' | 'playing' | 'results'

interface FlagQuestion {
  flag: string
  country: string
  capital: string
  timezone: string
}

// ─── Questions Pool (20) ──────────────────────────────────
const FLAGS_POOL: FlagQuestion[] = [
  { flag: '\ud83c\uddef\ud83c\uddf5', country: 'Japan', capital: 'Tokyo', timezone: 'UTC+9' },
  { flag: '\ud83c\udde7\ud83c\uddf7', country: 'Brazil', capital: 'Bras\u00edlia', timezone: 'UTC-3' },
  { flag: '\ud83c\uddee\ud83c\uddf3', country: 'India', capital: 'New Delhi', timezone: 'UTC+5:30' },
  { flag: '\ud83c\udde9\ud83c\uddea', country: 'Germany', capital: 'Berlin', timezone: 'UTC+1' },
  { flag: '\ud83c\udde6\ud83c\uddfa', country: 'Australia', capital: 'Canberra', timezone: 'UTC+10' },
  { flag: '\ud83c\udde8\ud83c\udde6', country: 'Canada', capital: 'Ottawa', timezone: 'UTC-5' },
  { flag: '\ud83c\uddf2\ud83c\uddfd', country: 'Mexico', capital: 'Mexico City', timezone: 'UTC-6' },
  { flag: '\ud83c\uddea\ud83c\uddec', country: 'Egypt', capital: 'Cairo', timezone: 'UTC+2' },
  { flag: '\ud83c\uddff\ud83c\udde6', country: 'South Africa', capital: 'Pretoria', timezone: 'UTC+2' },
  { flag: '\ud83c\uddf0\ud83c\uddf7', country: 'South Korea', capital: 'Seoul', timezone: 'UTC+9' },
  { flag: '\ud83c\uddf9\ud83c\uddf7', country: 'Turkey', capital: 'Ankara', timezone: 'UTC+3' },
  { flag: '\ud83c\udde6\ud83c\uddf7', country: 'Argentina', capital: 'Buenos Aires', timezone: 'UTC-3' },
  { flag: '\ud83c\uddf9\ud83c\udded', country: 'Thailand', capital: 'Bangkok', timezone: 'UTC+7' },
  { flag: '\ud83c\uddf3\ud83c\uddec', country: 'Nigeria', capital: 'Abuja', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf5\ud83c\uddf0', country: 'Pakistan', capital: 'Islamabad', timezone: 'UTC+5' },
  { flag: '\ud83c\uddf3\ud83c\uddff', country: 'New Zealand', capital: 'Wellington', timezone: 'UTC+12' },
  { flag: '\ud83c\uddf8\ud83c\uddec', country: 'Singapore', capital: 'Singapore', timezone: 'UTC+8' },
  { flag: '\ud83c\udde8\ud83c\uddf1', country: 'Chile', capital: 'Santiago', timezone: 'UTC-4' },
  { flag: '\ud83c\uddf3\ud83c\uddf4', country: 'Norway', capital: 'Oslo', timezone: 'UTC+1' },
  { flag: '\ud83c\uddeb\ud83c\uddee', country: 'Finland', capital: 'Helsinki', timezone: 'UTC+2' },
  { flag: '\ud83c\uddf5\ud83c\uddea', country: 'Peru', capital: 'Lima', timezone: 'UTC-5' },
  { flag: '\ud83c\uddf5\ud83c\udded', country: 'Philippines', capital: 'Manila', timezone: 'UTC+8' },
  { flag: '\ud83c\uddf5\ud83c\uddf1', country: 'Poland', capital: 'Warsaw', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf5\ud83c\uddf9', country: 'Portugal', capital: 'Lisbon', timezone: 'UTC+0' },
  { flag: '\ud83c\uddf7\ud83c\uddf4', country: 'Romania', capital: 'Bucharest', timezone: 'UTC+2' },
  { flag: '\ud83c\uddf7\ud83c\uddfa', country: 'Russia', capital: 'Moscow', timezone: 'UTC+3' },
  { flag: '\ud83c\uddf8\ud83c\udde6', country: 'Saudi Arabia', capital: 'Riyadh', timezone: 'UTC+3' },
  { flag: '\ud83c\uddea\ud83c\uddf8', country: 'Spain', capital: 'Madrid', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf8\ud83c\uddea', country: 'Sweden', capital: 'Stockholm', timezone: 'UTC+1' },
  { flag: '\ud83c\udde8\ud83c\udded', country: 'Switzerland', capital: 'Bern', timezone: 'UTC+1' },
  { flag: '\ud83c\uddfa\ud83c\udde6', country: 'Ukraine', capital: 'Kyiv', timezone: 'UTC+2' },
  { flag: '\ud83c\uddfb\ud83c\uddf3', country: 'Vietnam', capital: 'Hanoi', timezone: 'UTC+7' },
  { flag: '\ud83c\uddee\ud83c\udde9', country: 'Indonesia', capital: 'Jakarta', timezone: 'UTC+7' },
  { flag: '\ud83c\uddee\ud83c\uddf7', country: 'Iran', capital: 'Tehran', timezone: 'UTC+3:30' },
  { flag: '\ud83c\uddee\ud83c\uddf1', country: 'Israel', capital: 'Jerusalem', timezone: 'UTC+2' },
  { flag: '\ud83c\uddee\ud83c\uddf9', country: 'Italy', capital: 'Rome', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf0\ud83c\uddea', country: 'Kenya', capital: 'Nairobi', timezone: 'UTC+3' },
  { flag: '\ud83c\uddf2\ud83c\udde6', country: 'Morocco', capital: 'Rabat', timezone: 'UTC+1' },
  { flag: '\ud83c\udde8\ud83c\uddf4', country: 'Colombia', capital: 'Bogota', timezone: 'UTC-5' },
  { flag: '\ud83c\uddec\ud83c\uddf7', country: 'Greece', capital: 'Athens', timezone: 'UTC+2' },
  { flag: '\ud83c\udde8\ud83c\uddff', country: 'Czech Republic', capital: 'Prague', timezone: 'UTC+1' },
  { flag: '\ud83c\udde9\ud83c\uddf0', country: 'Denmark', capital: 'Copenhagen', timezone: 'UTC+1' },
  { flag: '\ud83c\uddee\ud83c\uddea', country: 'Ireland', capital: 'Dublin', timezone: 'UTC+0' },
  { flag: '\ud83c\uddf2\ud83c\uddfe', country: 'Malaysia', capital: 'Kuala Lumpur', timezone: 'UTC+8' },
  { flag: '\ud83c\udde8\ud83c\uddfa', country: 'Cuba', capital: 'Havana', timezone: 'UTC-5' },
  { flag: '\ud83c\uddea\ud83c\uddf9', country: 'Ethiopia', capital: 'Addis Ababa', timezone: 'UTC+3' },
  { flag: '\ud83c\uddec\ud83c\udded', country: 'Ghana', capital: 'Accra', timezone: 'UTC+0' },
  { flag: '\ud83c\uddf3\ud83c\uddf5', country: 'Nepal', capital: 'Kathmandu', timezone: 'UTC+5:45' },
  { flag: '\ud83c\uddef\ud83c\uddf2', country: 'Jamaica', capital: 'Kingston', timezone: 'UTC-5' },
  { flag: '\ud83c\uddee\ud83c\uddf8', country: 'Iceland', capital: 'Reykjavik', timezone: 'UTC+0' },
  { flag: '\ud83c\udde6\ud83c\uddf9', country: 'Austria', capital: 'Vienna', timezone: 'UTC+1' },
  { flag: '\ud83c\udde7\ud83c\uddea', country: 'Belgium', capital: 'Brussels', timezone: 'UTC+1' },
  { flag: '\ud83c\udded\ud83c\uddfa', country: 'Hungary', capital: 'Budapest', timezone: 'UTC+1' },
  { flag: '\ud83c\udde7\ud83c\uddec', country: 'Bulgaria', capital: 'Sofia', timezone: 'UTC+2' },
  { flag: '\ud83c\udded\ud83c\uddf7', country: 'Croatia', capital: 'Zagreb', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf8\ud83c\uddf0', country: 'Slovakia', capital: 'Bratislava', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf8\ud83c\uddee', country: 'Slovenia', capital: 'Ljubljana', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf7\ud83c\uddf8', country: 'Serbia', capital: 'Belgrade', timezone: 'UTC+1' },
  { flag: '\ud83c\uddea\ud83c\uddea', country: 'Estonia', capital: 'Tallinn', timezone: 'UTC+2' },
  { flag: '\ud83c\uddf1\ud83c\uddf9', country: 'Lithuania', capital: 'Vilnius', timezone: 'UTC+2' },
  { flag: '\ud83c\uddf1\ud83c\uddfb', country: 'Latvia', capital: 'Riga', timezone: 'UTC+2' },
  { flag: '\ud83c\uddfb\ud83c\uddea', country: 'Venezuela', capital: 'Caracas', timezone: 'UTC-4' },
  { flag: '\ud83c\uddea\ud83c\udde8', country: 'Ecuador', capital: 'Quito', timezone: 'UTC-5' },
  { flag: '\ud83c\udde7\ud83c\uddf4', country: 'Bolivia', capital: 'Sucre', timezone: 'UTC-4' },
  { flag: '\ud83c\uddfa\ud83c\uddfe', country: 'Uruguay', capital: 'Montevideo', timezone: 'UTC-3' },
  { flag: '\ud83c\uddf5\ud83c\uddfe', country: 'Paraguay', capital: 'Asuncion', timezone: 'UTC-4' },
  { flag: '\ud83c\udde8\ud83c\uddf7', country: 'Costa Rica', capital: 'San Jose', timezone: 'UTC-6' },
  { flag: '\ud83c\uddf5\ud83c\udde6', country: 'Panama', capital: 'Panama City', timezone: 'UTC-5' },
  { flag: '\ud83c\uddec\ud83c\uddf9', country: 'Guatemala', capital: 'Guatemala City', timezone: 'UTC-6' },
  { flag: '\ud83c\udde9\ud83c\uddf4', country: 'Dominican Republic', capital: 'Santo Domingo', timezone: 'UTC-4' },
  { flag: '\ud83c\uddf9\ud83c\uddf9', country: 'Trinidad and Tobago', capital: 'Port of Spain', timezone: 'UTC-4' },
  { flag: '\ud83c\uddf1\ud83c\uddf0', country: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', timezone: 'UTC+5:30' },
  { flag: '\ud83c\udde7\ud83c\udde9', country: 'Bangladesh', capital: 'Dhaka', timezone: 'UTC+6' },
  { flag: '\ud83c\uddf2\ud83c\uddf2', country: 'Myanmar', capital: 'Naypyidaw', timezone: 'UTC+6:30' },
  { flag: '\ud83c\uddf0\ud83c\udded', country: 'Cambodia', capital: 'Phnom Penh', timezone: 'UTC+7' },
  { flag: '\ud83c\uddf1\ud83c\udde6', country: 'Laos', capital: 'Vientiane', timezone: 'UTC+7' },
  { flag: '\ud83c\uddf2\ud83c\uddf3', country: 'Mongolia', capital: 'Ulaanbaatar', timezone: 'UTC+8' },
  { flag: '\ud83c\uddf0\ud83c\uddff', country: 'Kazakhstan', capital: 'Astana', timezone: 'UTC+6' },
  { flag: '\ud83c\uddfa\ud83c\uddff', country: 'Uzbekistan', capital: 'Tashkent', timezone: 'UTC+5' },
  { flag: '\ud83c\uddec\ud83c\uddea', country: 'Georgia', capital: 'Tbilisi', timezone: 'UTC+4' },
  { flag: '\ud83c\udde6\ud83c\uddf2', country: 'Armenia', capital: 'Yerevan', timezone: 'UTC+4' },
  { flag: '\ud83c\udde6\ud83c\uddff', country: 'Azerbaijan', capital: 'Baku', timezone: 'UTC+4' },
  { flag: '\ud83c\uddef\ud83c\uddf4', country: 'Jordan', capital: 'Amman', timezone: 'UTC+3' },
  { flag: '\ud83c\uddf1\ud83c\udde7', country: 'Lebanon', capital: 'Beirut', timezone: 'UTC+2' },
  { flag: '\ud83c\uddf6\ud83c\udde6', country: 'Qatar', capital: 'Doha', timezone: 'UTC+3' },
  { flag: '\ud83c\udde6\ud83c\uddea', country: 'United Arab Emirates', capital: 'Abu Dhabi', timezone: 'UTC+4' },
  { flag: '\ud83c\uddf0\ud83c\uddfc', country: 'Kuwait', capital: 'Kuwait City', timezone: 'UTC+3' },
  { flag: '\ud83c\uddf4\ud83c\uddf2', country: 'Oman', capital: 'Muscat', timezone: 'UTC+4' },
  { flag: '\ud83c\uddf9\ud83c\uddf3', country: 'Tunisia', capital: 'Tunis', timezone: 'UTC+1' },
  { flag: '\ud83c\udde9\ud83c\uddff', country: 'Algeria', capital: 'Algiers', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf9\ud83c\uddff', country: 'Tanzania', capital: 'Dodoma', timezone: 'UTC+3' },
  { flag: '\ud83c\uddfa\ud83c\uddec', country: 'Uganda', capital: 'Kampala', timezone: 'UTC+3' },
  { flag: '\ud83c\uddf8\ud83c\uddf3', country: 'Senegal', capital: 'Dakar', timezone: 'UTC+0' },
  { flag: '\ud83c\udde8\ud83c\uddf2', country: 'Cameroon', capital: 'Yaounde', timezone: 'UTC+1' },
  { flag: '\ud83c\udde8\ud83c\udde9', country: 'DR Congo', capital: 'Kinshasa', timezone: 'UTC+1' },
  { flag: '\ud83c\uddf2\ud83c\uddec', country: 'Madagascar', capital: 'Antananarivo', timezone: 'UTC+3' },
  { flag: '\ud83c\uddf2\ud83c\uddff', country: 'Mozambique', capital: 'Maputo', timezone: 'UTC+2' },
  { flag: '\ud83c\uddff\ud83c\uddfc', country: 'Zimbabwe', capital: 'Harare', timezone: 'UTC+2' },
  { flag: '\ud83c\uddf5\ud83c\uddec', country: 'Papua New Guinea', capital: 'Port Moresby', timezone: 'UTC+10' },
  { flag: '\ud83c\uddeb\ud83c\uddef', country: 'Fiji', capital: 'Suva', timezone: 'UTC+12' },
  // ─── Additional Countries (expanding to 200+) ──────────────
  { flag: '🇺🇸', country: 'United States', capital: 'Washington, D.C.', timezone: 'UTC-5' },
  { flag: '🇬🇧', country: 'United Kingdom', capital: 'London', timezone: 'UTC+0' },
  { flag: '🇫🇷', country: 'France', capital: 'Paris', timezone: 'UTC+1' },
  { flag: '🇨🇳', country: 'China', capital: 'Beijing', timezone: 'UTC+8' },
  { flag: '🇱🇺', country: 'Luxembourg', capital: 'Luxembourg City', timezone: 'UTC+1' },
  { flag: '🇲🇹', country: 'Malta', capital: 'Valletta', timezone: 'UTC+1' },
  { flag: '🇨🇾', country: 'Cyprus', capital: 'Nicosia', timezone: 'UTC+2' },
  { flag: '🇦🇱', country: 'Albania', capital: 'Tirana', timezone: 'UTC+1' },
  { flag: '🇲🇰', country: 'North Macedonia', capital: 'Skopje', timezone: 'UTC+1' },
  { flag: '🇲🇪', country: 'Montenegro', capital: 'Podgorica', timezone: 'UTC+1' },
  { flag: '🇧🇦', country: 'Bosnia and Herzegovina', capital: 'Sarajevo', timezone: 'UTC+1' },
  { flag: '🇽🇰', country: 'Kosovo', capital: 'Pristina', timezone: 'UTC+1' },
  { flag: '🇲🇩', country: 'Moldova', capital: 'Chisinau', timezone: 'UTC+2' },
  { flag: '🇬🇪', country: 'Georgia', capital: 'Tbilisi', timezone: 'UTC+4' },
  { flag: '🇦🇲', country: 'Armenia', capital: 'Yerevan', timezone: 'UTC+4' },
  { flag: '🇦🇿', country: 'Azerbaijan', capital: 'Baku', timezone: 'UTC+4' },
  { flag: '🇹🇲', country: 'Turkmenistan', capital: 'Ashgabat', timezone: 'UTC+5' },
  { flag: '🇰🇬', country: 'Kyrgyzstan', capital: 'Bishkek', timezone: 'UTC+6' },
  { flag: '🇹🇯', country: 'Tajikistan', capital: 'Dushanbe', timezone: 'UTC+5' },
  { flag: '🇦🇫', country: 'Afghanistan', capital: 'Kabul', timezone: 'UTC+4:30' },
  { flag: '🇮🇶', country: 'Iraq', capital: 'Baghdad', timezone: 'UTC+3' },
  { flag: '🇸🇾', country: 'Syria', capital: 'Damascus', timezone: 'UTC+3' },
  { flag: '🇯🇴', country: 'Jordan', capital: 'Amman', timezone: 'UTC+3' },
  { flag: '🇱🇧', country: 'Lebanon', capital: 'Beirut', timezone: 'UTC+2' },
  { flag: '🇰🇼', country: 'Kuwait', capital: 'Kuwait City', timezone: 'UTC+3' },
  { flag: '🇧🇭', country: 'Bahrain', capital: 'Manama', timezone: 'UTC+3' },
  { flag: '🇶🇦', country: 'Qatar', capital: 'Doha', timezone: 'UTC+3' },
  { flag: '🇦🇪', country: 'United Arab Emirates', capital: 'Abu Dhabi', timezone: 'UTC+4' },
  { flag: '🇴🇲', country: 'Oman', capital: 'Muscat', timezone: 'UTC+4' },
  { flag: '🇾🇪', country: 'Yemen', capital: 'Sanaa', timezone: 'UTC+3' },
  { flag: '🇲🇻', country: 'Maldives', capital: 'Male', timezone: 'UTC+5' },
  { flag: '🇧🇹', country: 'Bhutan', capital: 'Thimphu', timezone: 'UTC+6' },
  { flag: '🇧🇳', country: 'Brunei', capital: 'Bandar Seri Begawan', timezone: 'UTC+8' },
  { flag: '🇹🇱', country: 'East Timor', capital: 'Dili', timezone: 'UTC+9' },
  { flag: '🇰🇵', country: 'North Korea', capital: 'Pyongyang', timezone: 'UTC+9' },
  { flag: '🇹🇼', country: 'Taiwan', capital: 'Taipei', timezone: 'UTC+8' },
  { flag: '🇸🇳', country: 'Senegal', capital: 'Dakar', timezone: 'UTC+0' },
  { flag: '🇲🇱', country: 'Mali', capital: 'Bamako', timezone: 'UTC+0' },
  { flag: '🇧🇫', country: 'Burkina Faso', capital: 'Ouagadougou', timezone: 'UTC+0' },
  { flag: '🇳🇪', country: 'Niger', capital: 'Niamey', timezone: 'UTC+1' },
  { flag: '🇹🇩', country: 'Chad', capital: 'N\'Djamena', timezone: 'UTC+1' },
  { flag: '🇨🇫', country: 'Central African Republic', capital: 'Bangui', timezone: 'UTC+1' },
  { flag: '🇬🇦', country: 'Gabon', capital: 'Libreville', timezone: 'UTC+1' },
  { flag: '🇨🇬', country: 'Republic of the Congo', capital: 'Brazzaville', timezone: 'UTC+1' },
  { flag: '🇦🇴', country: 'Angola', capital: 'Luanda', timezone: 'UTC+1' },
  { flag: '🇿🇲', country: 'Zambia', capital: 'Lusaka', timezone: 'UTC+2' },
  { flag: '🇲🇼', country: 'Malawi', capital: 'Lilongwe', timezone: 'UTC+2' },
  { flag: '🇹🇿', country: 'Tanzania', capital: 'Dodoma', timezone: 'UTC+3' },
  { flag: '🇺🇬', country: 'Uganda', capital: 'Kampala', timezone: 'UTC+3' },
  { flag: '🇷🇼', country: 'Rwanda', capital: 'Kigali', timezone: 'UTC+2' },
  { flag: '🇧🇮', country: 'Burundi', capital: 'Gitega', timezone: 'UTC+2' },
  { flag: '🇸🇴', country: 'Somalia', capital: 'Mogadishu', timezone: 'UTC+3' },
  { flag: '🇩🇯', country: 'Djibouti', capital: 'Djibouti', timezone: 'UTC+3' },
  { flag: '🇪🇷', country: 'Eritrea', capital: 'Asmara', timezone: 'UTC+3' },
  { flag: '🇸🇩', country: 'Sudan', capital: 'Khartoum', timezone: 'UTC+2' },
  { flag: '🇸🇸', country: 'South Sudan', capital: 'Juba', timezone: 'UTC+2' },
  { flag: '🇱🇾', country: 'Libya', capital: 'Tripoli', timezone: 'UTC+2' },
  { flag: '🇹🇳', country: 'Tunisia', capital: 'Tunis', timezone: 'UTC+1' },
  { flag: '🇩🇿', country: 'Algeria', capital: 'Algiers', timezone: 'UTC+1' },
  { flag: '🇲🇷', country: 'Mauritania', capital: 'Nouakchott', timezone: 'UTC+0' },
  { flag: '🇬🇲', country: 'Gambia', capital: 'Banjul', timezone: 'UTC+0' },
  { flag: '🇬🇼', country: 'Guinea-Bissau', capital: 'Bissau', timezone: 'UTC+0' },
  { flag: '🇬🇳', country: 'Guinea', capital: 'Conakry', timezone: 'UTC+0' },
  { flag: '🇸🇱', country: 'Sierra Leone', capital: 'Freetown', timezone: 'UTC+0' },
  { flag: '🇱🇷', country: 'Liberia', capital: 'Monrovia', timezone: 'UTC+0' },
  { flag: '🇨🇮', country: 'Ivory Coast', capital: 'Yamoussoukro', timezone: 'UTC+0' },
  { flag: '🇹🇬', country: 'Togo', capital: 'Lome', timezone: 'UTC+0' },
  { flag: '🇧🇯', country: 'Benin', capital: 'Porto-Novo', timezone: 'UTC+1' },
  { flag: '🇬🇶', country: 'Equatorial Guinea', capital: 'Malabo', timezone: 'UTC+1' },
  { flag: '🇸🇹', country: 'Sao Tome and Principe', capital: 'Sao Tome', timezone: 'UTC+0' },
  { flag: '🇨🇻', country: 'Cape Verde', capital: 'Praia', timezone: 'UTC-1' },
  { flag: '🇳🇦', country: 'Namibia', capital: 'Windhoek', timezone: 'UTC+2' },
  { flag: '🇧🇼', country: 'Botswana', capital: 'Gaborone', timezone: 'UTC+2' },
  { flag: '🇱🇸', country: 'Lesotho', capital: 'Maseru', timezone: 'UTC+2' },
  { flag: '🇸🇿', country: 'Eswatini', capital: 'Mbabane', timezone: 'UTC+2' },
  { flag: '🇰🇲', country: 'Comoros', capital: 'Moroni', timezone: 'UTC+3' },
  { flag: '🇲🇺', country: 'Mauritius', capital: 'Port Louis', timezone: 'UTC+4' },
  { flag: '🇸🇨', country: 'Seychelles', capital: 'Victoria', timezone: 'UTC+4' },
  { flag: '🇭🇳', country: 'Honduras', capital: 'Tegucigalpa', timezone: 'UTC-6' },
  { flag: '🇸🇻', country: 'El Salvador', capital: 'San Salvador', timezone: 'UTC-6' },
  { flag: '🇳🇮', country: 'Nicaragua', capital: 'Managua', timezone: 'UTC-6' },
  { flag: '🇧🇿', country: 'Belize', capital: 'Belmopan', timezone: 'UTC-6' },
  { flag: '🇭🇹', country: 'Haiti', capital: 'Port-au-Prince', timezone: 'UTC-5' },
  { flag: '🇧🇸', country: 'Bahamas', capital: 'Nassau', timezone: 'UTC-5' },
  { flag: '🇧🇧', country: 'Barbados', capital: 'Bridgetown', timezone: 'UTC-4' },
  { flag: '🇬🇾', country: 'Guyana', capital: 'Georgetown', timezone: 'UTC-4' },
  { flag: '🇸🇷', country: 'Suriname', capital: 'Paramaribo', timezone: 'UTC-3' },
  { flag: '🇼🇸', country: 'Samoa', capital: 'Apia', timezone: 'UTC+13' },
  { flag: '🇹🇴', country: 'Tonga', capital: 'Nuku\'alofa', timezone: 'UTC+13' },
  { flag: '🇻🇺', country: 'Vanuatu', capital: 'Port Vila', timezone: 'UTC+11' },
  { flag: '🇸🇧', country: 'Solomon Islands', capital: 'Honiara', timezone: 'UTC+11' },
  { flag: '🇰🇮', country: 'Kiribati', capital: 'Tarawa', timezone: 'UTC+12' },
  { flag: '🇹🇻', country: 'Tuvalu', capital: 'Funafuti', timezone: 'UTC+12' },
  { flag: '🇳🇷', country: 'Nauru', capital: 'Yaren', timezone: 'UTC+12' },
  { flag: '🇵🇼', country: 'Palau', capital: 'Ngerulmud', timezone: 'UTC+9' },
  { flag: '🇫🇲', country: 'Micronesia', capital: 'Palikir', timezone: 'UTC+11' },
  { flag: '🇲🇭', country: 'Marshall Islands', capital: 'Majuro', timezone: 'UTC+12' },
  { flag: '🇦🇬', country: 'Antigua and Barbuda', capital: 'St. John\'s', timezone: 'UTC-4' },
  { flag: '🇩🇲', country: 'Dominica', capital: 'Roseau', timezone: 'UTC-4' },
  { flag: '🇬🇩', country: 'Grenada', capital: 'St. George\'s', timezone: 'UTC-4' },
  { flag: '🇰🇳', country: 'Saint Kitts and Nevis', capital: 'Basseterre', timezone: 'UTC-4' },
  { flag: '🇱🇨', country: 'Saint Lucia', capital: 'Castries', timezone: 'UTC-4' },
  { flag: '🇻🇨', country: 'Saint Vincent and the Grenadines', capital: 'Kingstown', timezone: 'UTC-4' },
  { flag: '🇦🇩', country: 'Andorra', capital: 'Andorra la Vella', timezone: 'UTC+1' },
  { flag: '🇱🇮', country: 'Liechtenstein', capital: 'Vaduz', timezone: 'UTC+1' },
  { flag: '🇲🇨', country: 'Monaco', capital: 'Monaco', timezone: 'UTC+1' },
  { flag: '🇸🇲', country: 'San Marino', capital: 'San Marino', timezone: 'UTC+1' },
  { flag: '🇻🇦', country: 'Vatican City', capital: 'Vatican City', timezone: 'UTC+1' },
  { flag: '🇧🇾', country: 'Belarus', capital: 'Minsk', timezone: 'UTC+3' },
  { flag: '🇳🇱', country: 'Netherlands', capital: 'Amsterdam', timezone: 'UTC+1' },
  { flag: '🇱🇰', country: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', timezone: 'UTC+5:30' },
  // ─── Additional Countries & Territories ───────────────────
  { flag: '🇵🇱', country: 'Poland', capital: 'Warsaw', timezone: 'UTC+1' },
  { flag: '🇸🇰', country: 'Slovakia', capital: 'Bratislava', timezone: 'UTC+1' },
  { flag: '🇭🇷', country: 'Croatia', capital: 'Zagreb', timezone: 'UTC+1' },
  { flag: '🇸🇮', country: 'Slovenia', capital: 'Ljubljana', timezone: 'UTC+1' },
  { flag: '🇪🇪', country: 'Estonia', capital: 'Tallinn', timezone: 'UTC+2' },
  { flag: '🇱🇹', country: 'Lithuania', capital: 'Vilnius', timezone: 'UTC+2' },
  { flag: '🇱🇻', country: 'Latvia', capital: 'Riga', timezone: 'UTC+2' },
  { flag: '🇧🇬', country: 'Bulgaria', capital: 'Sofia', timezone: 'UTC+2' },
  { flag: '🇷🇴', country: 'Romania', capital: 'Bucharest', timezone: 'UTC+2' },
  { flag: '🇫🇮', country: 'Finland', capital: 'Helsinki', timezone: 'UTC+2' },
  { flag: '🇳🇴', country: 'Norway', capital: 'Oslo', timezone: 'UTC+1' },
  { flag: '🇸🇪', country: 'Sweden', capital: 'Stockholm', timezone: 'UTC+1' },
  { flag: '🇩🇰', country: 'Denmark', capital: 'Copenhagen', timezone: 'UTC+1' },
  { flag: '🇮🇸', country: 'Iceland', capital: 'Reykjavik', timezone: 'UTC+0' },
  // ─── Caribbean & Central America ──────────────────────────
  { flag: '🇨🇺', country: 'Cuba', capital: 'Havana', timezone: 'UTC-5' },
  { flag: '🇯🇲', country: 'Jamaica', capital: 'Kingston', timezone: 'UTC-5' },
  { flag: '🇵🇷', country: 'Puerto Rico', capital: 'San Juan', timezone: 'UTC-4' },
  { flag: '🇹🇹', country: 'Trinidad and Tobago', capital: 'Port of Spain', timezone: 'UTC-4' },
  { flag: '🇨🇼', country: 'Curacao', capital: 'Willemstad', timezone: 'UTC-4' },
  { flag: '🇦🇼', country: 'Aruba', capital: 'Oranjestad', timezone: 'UTC-4' },
  { flag: '🇻🇮', country: 'US Virgin Islands', capital: 'Charlotte Amalie', timezone: 'UTC-4' },
  { flag: '🇰🇾', country: 'Cayman Islands', capital: 'George Town', timezone: 'UTC-5' },
  { flag: '🇧🇲', country: 'Bermuda', capital: 'Hamilton', timezone: 'UTC-4' },
  { flag: '🇹🇨', country: 'Turks and Caicos', capital: 'Cockburn Town', timezone: 'UTC-5' },
  // ─── Asia-Pacific Missing ─────────────────────────────────
  { flag: '🇭🇰', country: 'Hong Kong', capital: 'Hong Kong', timezone: 'UTC+8' },
  { flag: '🇲🇴', country: 'Macau', capital: 'Macau', timezone: 'UTC+8' },
  { flag: '🇵🇬', country: 'Papua New Guinea', capital: 'Port Moresby', timezone: 'UTC+10' },
  { flag: '🇳🇵', country: 'Nepal', capital: 'Kathmandu', timezone: 'UTC+5:45' },
  { flag: '🇲🇻', country: 'Maldives', capital: 'Male', timezone: 'UTC+5' },
  { flag: '🇱🇦', country: 'Laos', capital: 'Vientiane', timezone: 'UTC+7' },
  { flag: '🇧🇳', country: 'Brunei', capital: 'Bandar Seri Begawan', timezone: 'UTC+8' },
  { flag: '🇹🇱', country: 'Timor-Leste', capital: 'Dili', timezone: 'UTC+9' },
  { flag: '🇫🇯', country: 'Fiji', capital: 'Suva', timezone: 'UTC+12' },
  { flag: '🇵🇫', country: 'French Polynesia', capital: 'Papeete', timezone: 'UTC-10' },
  { flag: '🇳🇨', country: 'New Caledonia', capital: 'Noumea', timezone: 'UTC+11' },
  { flag: '🇬🇺', country: 'Guam', capital: 'Hagatna', timezone: 'UTC+10' },
  { flag: '🇦🇸', country: 'American Samoa', capital: 'Pago Pago', timezone: 'UTC-11' },
  { flag: '🇨🇰', country: 'Cook Islands', capital: 'Avarua', timezone: 'UTC-10' },
  // ─── Africa Missing ───────────────────────────────────────
  { flag: '🇪🇬', country: 'Egypt', capital: 'Cairo', timezone: 'UTC+2' },
  { flag: '🇬🇭', country: 'Ghana', capital: 'Accra', timezone: 'UTC+0' },
  { flag: '🇰🇪', country: 'Kenya', capital: 'Nairobi', timezone: 'UTC+3' },
  { flag: '🇪🇹', country: 'Ethiopia', capital: 'Addis Ababa', timezone: 'UTC+3' },
  { flag: '🇳🇬', country: 'Nigeria', capital: 'Abuja', timezone: 'UTC+1' },
  { flag: '🇲🇦', country: 'Morocco', capital: 'Rabat', timezone: 'UTC+1' },
  { flag: '🇿🇦', country: 'South Africa', capital: 'Pretoria', timezone: 'UTC+2' },
  { flag: '🇲🇬', country: 'Madagascar', capital: 'Antananarivo', timezone: 'UTC+3' },
  { flag: '🇿🇼', country: 'Zimbabwe', capital: 'Harare', timezone: 'UTC+2' },
  { flag: '🇲🇿', country: 'Mozambique', capital: 'Maputo', timezone: 'UTC+2' },
  { flag: '🇨🇲', country: 'Cameroon', capital: 'Yaounde', timezone: 'UTC+1' },
  { flag: '🇨🇩', country: 'DR Congo', capital: 'Kinshasa', timezone: 'UTC+1' },
  // ─── Territories & Special Flags ──────────────────────────
  { flag: '🇬🇱', country: 'Greenland', capital: 'Nuuk', timezone: 'UTC-2' },
  { flag: '🇫🇴', country: 'Faroe Islands', capital: 'Torshavn', timezone: 'UTC+0' },
  { flag: '🇬🇮', country: 'Gibraltar', capital: 'Gibraltar', timezone: 'UTC+1' },
  { flag: '🇯🇪', country: 'Jersey', capital: 'St. Helier', timezone: 'UTC+0' },
  { flag: '🇮🇲', country: 'Isle of Man', capital: 'Douglas', timezone: 'UTC+0' },
  { flag: '🇬🇬', country: 'Guernsey', capital: 'St. Peter Port', timezone: 'UTC+0' },
  { flag: '🇲🇵', country: 'Northern Mariana Islands', capital: 'Saipan', timezone: 'UTC+10' },
  { flag: '🇼🇫', country: 'Wallis and Futuna', capital: 'Mata-Utu', timezone: 'UTC+12' },
  { flag: '🇸🇽', country: 'Sint Maarten', capital: 'Philipsburg', timezone: 'UTC-4' },
  { flag: '🇧🇱', country: 'Saint Barthelemy', capital: 'Gustavia', timezone: 'UTC-4' },
  { flag: '🇲🇫', country: 'Saint Martin', capital: 'Marigot', timezone: 'UTC-4' },
  { flag: '🇵🇲', country: 'Saint Pierre and Miquelon', capital: 'Saint-Pierre', timezone: 'UTC-3' },
  { flag: '🇷🇪', country: 'Reunion', capital: 'Saint-Denis', timezone: 'UTC+4' },
  { flag: '🇾🇹', country: 'Mayotte', capital: 'Mamoudzou', timezone: 'UTC+3' },
  // ─── South America Missing ────────────────────────────────
  { flag: '🇧🇷', country: 'Brazil', capital: 'Brasilia', timezone: 'UTC-3' },
  { flag: '🇦🇷', country: 'Argentina', capital: 'Buenos Aires', timezone: 'UTC-3' },
  { flag: '🇨🇱', country: 'Chile', capital: 'Santiago', timezone: 'UTC-4' },
  { flag: '🇨🇴', country: 'Colombia', capital: 'Bogota', timezone: 'UTC-5' },
  { flag: '🇵🇪', country: 'Peru', capital: 'Lima', timezone: 'UTC-5' },
  { flag: '🇻🇪', country: 'Venezuela', capital: 'Caracas', timezone: 'UTC-4' },
  { flag: '🇪🇨', country: 'Ecuador', capital: 'Quito', timezone: 'UTC-5' },
  { flag: '🇧🇴', country: 'Bolivia', capital: 'Sucre', timezone: 'UTC-4' },
  { flag: '🇺🇾', country: 'Uruguay', capital: 'Montevideo', timezone: 'UTC-3' },
  { flag: '🇵🇾', country: 'Paraguay', capital: 'Asuncion', timezone: 'UTC-4' },
  { flag: '🇬🇫', country: 'French Guiana', capital: 'Cayenne', timezone: 'UTC-3' },
  { flag: '🇫🇰', country: 'Falkland Islands', capital: 'Stanley', timezone: 'UTC-3' },
  // ─── More Asian countries ─────────────────────────────────
  { flag: '🇯🇵', country: 'Japan', capital: 'Tokyo', timezone: 'UTC+9' },
  { flag: '🇰🇷', country: 'South Korea', capital: 'Seoul', timezone: 'UTC+9' },
  { flag: '🇮🇳', country: 'India', capital: 'New Delhi', timezone: 'UTC+5:30' },
  { flag: '🇮🇩', country: 'Indonesia', capital: 'Jakarta', timezone: 'UTC+7' },
  { flag: '🇹🇭', country: 'Thailand', capital: 'Bangkok', timezone: 'UTC+7' },
  { flag: '🇻🇳', country: 'Vietnam', capital: 'Hanoi', timezone: 'UTC+7' },
  { flag: '🇵🇭', country: 'Philippines', capital: 'Manila', timezone: 'UTC+8' },
  { flag: '🇲🇾', country: 'Malaysia', capital: 'Kuala Lumpur', timezone: 'UTC+8' },
  { flag: '🇸🇬', country: 'Singapore', capital: 'Singapore', timezone: 'UTC+8' },
  { flag: '🇲🇲', country: 'Myanmar', capital: 'Naypyidaw', timezone: 'UTC+6:30' },
  { flag: '🇧🇩', country: 'Bangladesh', capital: 'Dhaka', timezone: 'UTC+6' },
  { flag: '🇵🇰', country: 'Pakistan', capital: 'Islamabad', timezone: 'UTC+5' },
  { flag: '🇰🇿', country: 'Kazakhstan', capital: 'Astana', timezone: 'UTC+6' },
  { flag: '🇺🇿', country: 'Uzbekistan', capital: 'Tashkent', timezone: 'UTC+5' },
  { flag: '🇮🇷', country: 'Iran', capital: 'Tehran', timezone: 'UTC+3:30' },
  { flag: '🇮🇶', country: 'Iraq', capital: 'Baghdad', timezone: 'UTC+3' },
  { flag: '🇸🇦', country: 'Saudi Arabia', capital: 'Riyadh', timezone: 'UTC+3' },
  { flag: '🇹🇷', country: 'Turkey', capital: 'Ankara', timezone: 'UTC+3' },
  // ─── Unique Flag Shapes & Notable Flags ───────────────────
  { flag: '🇳🇵', country: 'Nepal', capital: 'Kathmandu', timezone: 'UTC+5:45' },
  { flag: '🇨🇭', country: 'Switzerland', capital: 'Bern', timezone: 'UTC+1' },
  { flag: '🇻🇦', country: 'Vatican City', capital: 'Vatican City', timezone: 'UTC+1' },
]

// ─── Helpers ──────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function generateOptions(correct: string, allCountries: string[]): string[] {
  const others = allCountries.filter(c => c !== correct)
  const wrongOptions = shuffleArray(others).slice(0, 3)
  return shuffleArray([correct, ...wrongOptions])
}

// ─── Components ───────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100
  return (
    <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
    </div>
  )
}

function TimerBar({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const pct = (timeLeft / maxTime) * 100
  const color = timeLeft <= 3 ? 'from-red-500 to-red-400' : timeLeft <= 5 ? 'from-yellow-500 to-yellow-400' : 'from-green-500 to-secondary'
  return (
    <div className="w-full h-1.5 bg-card-border rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 linear`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────
export default function FlagsQuizPage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [questions, setQuestions] = useState<FlagQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [results, setResults] = useState<{ flag: string; country: string; correct: boolean; timeBonus: boolean; selected: string }[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerMode, setTimerMode] = useState<'timed' | 'untimed'>('timed')
  const [timerSeconds, setTimerSeconds] = useState(10)
  const [bestScore, setBestScore] = useState(0)
  const [animateScore, setAnimateScore] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const allCountries = FLAGS_POOL.map(f => f.country)

  useEffect(() => {
    const saved = localStorage.getItem('flags-quiz-best')
    if (saved) setBestScore(parseInt(saved))
  }, [])

  const startGame = useCallback(() => {
    const selected = shuffleArray(FLAGS_POOL).slice(0, 10)
    setQuestions(selected)
    setCurrentQ(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setResults([])
    setSelectedAnswer(null)
    setShowInfo(false)
    setGameState('playing')
    setOptions(generateOptions(selected[0].country, allCountries))
    setTimeLeft(timerSeconds)
    startTimeRef.current = Date.now()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null || timerMode === 'untimed') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleAnswer('__timeout__')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, currentQ, selectedAnswer])

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return
    if (timerRef.current) clearInterval(timerRef.current)

    const isTimeout = answer === '__timeout__'
    const q = questions[currentQ]
    const isCorrect = !isTimeout && answer === q.country
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const timeBonus = isCorrect && elapsed <= 5

    setSelectedAnswer(isTimeout ? '' : answer)

    if (isCorrect) {
      setScore(prev => prev + (timeBonus ? 2 : 1))
      setStreak(prev => {
        const ns = prev + 1
        setMaxStreak(ms => Math.max(ms, ns))
        return ns
      })
      setAnimateScore(true)
      setTimeout(() => setAnimateScore(false), 600)
    } else {
      setStreak(0)
    }

    setResults(prev => [...prev, {
      flag: q.flag,
      country: q.country,
      correct: isCorrect,
      timeBonus,
      selected: isTimeout ? 'Timed out' : answer,
    }])
    setShowInfo(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswer, currentQ, questions])

  const nextQuestion = useCallback(() => {
    const nextIdx = currentQ + 1
    if (nextIdx >= 10) {
      if (score > bestScore) {
        setBestScore(score)
        localStorage.setItem('flags-quiz-best', String(score))
      }
      setGameState('results')
      return
    }
    setCurrentQ(nextIdx)
    setSelectedAnswer(null)
    setShowInfo(false)
    setOptions(generateOptions(questions[nextIdx].country, allCountries))
    setTimeLeft(timerSeconds)
    startTimeRef.current = Date.now()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, questions, score, bestScore])

  const shareResult = () => {
    const correctCount = results.filter(r => r.correct).length
    const text = `I scored ${correctCount}/10 on the DateAndTimezone Flags & Countries quiz! Can you beat me? https://www.dateandtimezone.com/quiz/flags`
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  // ─── Menu ───────────────────────────────────────────────
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 pt-10 sm:pt-12 pb-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 mb-6">
              <Flag className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
              Flags & Countries
            </h1>
            <p className="text-muted text-lg max-w-md mx-auto">
              Match flags to their countries! 20 countries from around the world.
            </p>
          </div>

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
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${timerMode === 'timed' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'border border-card-border text-muted hover:text-white'}`}
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
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timerSeconds === s ? 'bg-green-500 text-white' : 'border border-card-border text-muted hover:text-white'}`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 font-heading font-semibold text-white text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Flag className="w-5 h-5" />
            Start Quiz (10 random flags)
          </button>

          <div className="mt-8 p-6 rounded-xl bg-card-bg border border-card-border">
            <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              How to Play
            </h3>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2"><span className="text-green-400 font-bold">1.</span>A flag emoji will be shown large on screen</li>
              <li className="flex items-start gap-2"><span className="text-green-400 font-bold">2.</span>Pick the matching country from 4 options</li>
              <li className="flex items-start gap-2"><span className="text-green-400 font-bold">3.</span>Answer within 5 seconds for a speed bonus (+2)</li>
              <li className="flex items-start gap-2"><span className="text-green-400 font-bold">4.</span>Learn the capital and timezone after each answer!</li>
            </ul>
          </div>

          <Link href="/quiz" className="flex items-center justify-center gap-2 mt-6 text-muted hover:text-[#E2E8F0] transition-colors font-heading font-semibold">
            <ArrowLeft className="w-4 h-4" />Back to Quizzes
          </Link>
        </div>
      </div>
    )
  }

  // ─── Playing ────────────────────────────────────────────
  if (gameState === 'playing') {
    const q = questions[currentQ]

    return (
      <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`font-heading font-bold text-2xl transition-all duration-300 ${animateScore ? 'scale-125 text-yellow-400' : ''}`}>
                <Zap className="w-4 h-4 inline mr-1 text-yellow-400" />{score}
              </div>
              {streak >= 2 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-semibold animate-pulse">
                  <Flame className="w-4 h-4" />{streak} streak
                </div>
              )}
            </div>
            <div className="text-muted text-sm font-medium">{currentQ + 1} / 10</div>
          </div>

          <ProgressBar current={currentQ + (selectedAnswer !== null ? 1 : 0)} total={10} />

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted mb-1">
              <div className="flex items-center gap-1"><Timer className="w-3 h-3" /><span>{timeLeft}s</span></div>
              {timeLeft <= 5 && timeLeft > 0 && selectedAnswer === null && (
                <span className="text-yellow-400 text-xs">Speed bonus available!</span>
              )}
            </div>
            {timerMode === 'timed' && <TimerBar timeLeft={timeLeft} maxTime={timerSeconds} />}
          </div>

          {/* Flag Display */}
          <div className="mt-8 p-8 rounded-2xl bg-card-bg border border-card-border text-center">
            <div className="text-muted text-sm uppercase tracking-wider mb-4">Which country is this?</div>
            <div className="text-8xl mb-2 leading-none">{q.flag}</div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {options.map((option, idx) => {
              let btnStyle = 'bg-card-bg border-card-border hover:border-green-500/50 hover:bg-green-500/10'
              if (selectedAnswer !== null) {
                if (option === q.country) {
                  btnStyle = 'bg-green-500/20 border-green-500/50 text-green-400'
                } else if (option === selectedAnswer && option !== q.country) {
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
                  className={`p-4 rounded-xl border text-center font-heading font-semibold transition-all duration-300 ${btnStyle} ${selectedAnswer === null ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {selectedAnswer !== null && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div className={`p-4 rounded-xl border ${results[results.length - 1]?.correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center gap-2 font-heading font-semibold text-lg">
                  {results[results.length - 1]?.correct ? (
                    <><Sparkles className="w-5 h-5 text-green-400" /><span className="text-green-400">Correct! {results[results.length - 1]?.timeBonus ? '+2 (speed bonus!)' : '+1'}</span></>
                  ) : (
                    <span className="text-red-400">Wrong! That was {q.country}</span>
                  )}
                </div>
              </div>

              {showInfo && (
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                  <div className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-secondary font-heading font-semibold text-sm mb-1">Bonus Info</div>
                      <p className="text-muted text-sm">Capital: <span className="text-[#E2E8F0] font-medium">{q.capital}</span> &middot; Timezone: <span className="text-[#E2E8F0] font-medium">{q.timezone}</span></p>
                    </div>
                  </div>
                </div>
              )}

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
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        `}</style>
      </div>
    )
  }

  // ─── Results ────────────────────────────────────────────
  const correctCount = results.filter(r => r.correct).length
  const bonusCount = results.filter(r => r.timeBonus).length
  const isNewBest = score >= bestScore && score > 0

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2">{correctCount}/10</h1>
          <p className="text-muted text-lg">
            {correctCount >= 9 ? 'Flag Master!' : correctCount >= 7 ? 'Great job!' : correctCount >= 5 ? 'Not bad!' : 'Keep studying those flags!'}
          </p>
          {isNewBest && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-heading font-semibold animate-bounce">
              <Award className="w-5 h-5" />New Personal Best!
            </div>
          )}
        </div>

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

        <div className="space-y-2 mb-8">
          <h3 className="font-heading font-semibold text-lg mb-3">Question Review</h3>
          {results.map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${r.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.flag}</span>
                <span className="font-medium">{r.country}</span>
              </div>
              <div className="text-right text-sm">
                <div className={r.correct ? 'text-green-400' : 'text-red-400'}>{r.correct ? 'Correct' : r.selected}</div>
                {r.timeBonus && <div className="text-yellow-400 text-xs">+speed bonus</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={startGame} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover font-heading font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" />Play Again
          </button>
          <button onClick={shareResult} className="flex-1 py-3 rounded-xl bg-card-bg border border-card-border hover:border-primary/50 font-heading font-semibold transition-all duration-300 flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />Share Score
          </button>
        </div>

        <Link href="/quiz" className="flex items-center justify-center gap-2 mt-4 text-muted hover:text-[#E2E8F0] transition-colors font-heading font-semibold py-3">
          <ArrowLeft className="w-4 h-4" />Back to Quizzes
        </Link>
      </div>

      <AdBanner />
    </div>
  )
}
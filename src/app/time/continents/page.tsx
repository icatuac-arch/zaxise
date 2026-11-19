'use client';

import { useState, useMemo } from 'react';
import {
  Globe,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Users,
  Maximize2,
  Lightbulb,
  Map,
  LayoutGrid,
} from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface Country {
  name: string;
  flag: string;
  capital: string;
  timezone: string;
  population: string;
}

interface Continent {
  name: string;
  emoji: string;
  countries: number;
  timezones: number;
  timezoneRange: string;
  area: string;
  population: string;
  largest: string;
  color: string;
  countryList: Country[];
}

const continents: Continent[] = [
  {
    name: 'Asia',
    emoji: '🌏',
    countries: 49,
    timezones: 11,
    timezoneRange: 'UTC+3 to UTC+12',
    area: '44.6M km²',
    population: '4.7 billion',
    largest: 'Russia / China',
    color: '#EF4444',
    countryList: [
      { name: 'Afghanistan', flag: '🇦🇫', capital: 'Kabul', timezone: 'UTC+4:30', population: '41M' },
      { name: 'Armenia', flag: '🇦🇲', capital: 'Yerevan', timezone: 'UTC+4', population: '3M' },
      { name: 'Azerbaijan', flag: '🇦🇿', capital: 'Baku', timezone: 'UTC+4', population: '10M' },
      { name: 'Bahrain', flag: '🇧🇭', capital: 'Manama', timezone: 'UTC+3', population: '1.5M' },
      { name: 'Bangladesh', flag: '🇧🇩', capital: 'Dhaka', timezone: 'UTC+6', population: '170M' },
      { name: 'Bhutan', flag: '🇧🇹', capital: 'Thimphu', timezone: 'UTC+6', population: '780K' },
      { name: 'Brunei', flag: '🇧🇳', capital: 'Bandar Seri Begawan', timezone: 'UTC+8', population: '450K' },
      { name: 'Cambodia', flag: '🇰🇭', capital: 'Phnom Penh', timezone: 'UTC+7', population: '17M' },
      { name: 'China', flag: '🇨🇳', capital: 'Beijing', timezone: 'UTC+8', population: '1.4B' },
      { name: 'Cyprus', flag: '🇨🇾', capital: 'Nicosia', timezone: 'UTC+2', population: '1.2M' },
      { name: 'Georgia', flag: '🇬🇪', capital: 'Tbilisi', timezone: 'UTC+4', population: '3.7M' },
      { name: 'India', flag: '🇮🇳', capital: 'New Delhi', timezone: 'UTC+5:30', population: '1.4B' },
      { name: 'Indonesia', flag: '🇮🇩', capital: 'Jakarta', timezone: 'UTC+7/+8/+9', population: '275M' },
      { name: 'Iran', flag: '🇮🇷', capital: 'Tehran', timezone: 'UTC+3:30', population: '87M' },
      { name: 'Iraq', flag: '🇮🇶', capital: 'Baghdad', timezone: 'UTC+3', population: '42M' },
      { name: 'Israel', flag: '🇮🇱', capital: 'Jerusalem', timezone: 'UTC+2', population: '9.5M' },
      { name: 'Japan', flag: '🇯🇵', capital: 'Tokyo', timezone: 'UTC+9', population: '125M' },
      { name: 'Jordan', flag: '🇯🇴', capital: 'Amman', timezone: 'UTC+3', population: '11M' },
      { name: 'Kazakhstan', flag: '🇰🇿', capital: 'Astana', timezone: 'UTC+5/+6', population: '19M' },
      { name: 'Kuwait', flag: '🇰🇼', capital: 'Kuwait City', timezone: 'UTC+3', population: '4.3M' },
      { name: 'Kyrgyzstan', flag: '🇰🇬', capital: 'Bishkek', timezone: 'UTC+6', population: '6.7M' },
      { name: 'Laos', flag: '🇱🇦', capital: 'Vientiane', timezone: 'UTC+7', population: '7.4M' },
      { name: 'Lebanon', flag: '🇱🇧', capital: 'Beirut', timezone: 'UTC+2', population: '5.5M' },
      { name: 'Malaysia', flag: '🇲🇾', capital: 'Kuala Lumpur', timezone: 'UTC+8', population: '33M' },
      { name: 'Maldives', flag: '🇲🇻', capital: 'Male', timezone: 'UTC+5', population: '520K' },
      { name: 'Mongolia', flag: '🇲🇳', capital: 'Ulaanbaatar', timezone: 'UTC+8', population: '3.3M' },
      { name: 'Myanmar', flag: '🇲🇲', capital: 'Naypyidaw', timezone: 'UTC+6:30', population: '54M' },
      { name: 'Nepal', flag: '🇳🇵', capital: 'Kathmandu', timezone: 'UTC+5:45', population: '30M' },
      { name: 'North Korea', flag: '🇰🇵', capital: 'Pyongyang', timezone: 'UTC+9', population: '26M' },
      { name: 'Oman', flag: '🇴🇲', capital: 'Muscat', timezone: 'UTC+4', population: '5.1M' },
      { name: 'Pakistan', flag: '🇵🇰', capital: 'Islamabad', timezone: 'UTC+5', population: '230M' },
      { name: 'Palestine', flag: '🇵🇸', capital: 'Ramallah', timezone: 'UTC+2', population: '5.3M' },
      { name: 'Philippines', flag: '🇵🇭', capital: 'Manila', timezone: 'UTC+8', population: '114M' },
      { name: 'Qatar', flag: '🇶🇦', capital: 'Doha', timezone: 'UTC+3', population: '2.9M' },
      { name: 'Saudi Arabia', flag: '🇸🇦', capital: 'Riyadh', timezone: 'UTC+3', population: '36M' },
      { name: 'Singapore', flag: '🇸🇬', capital: 'Singapore', timezone: 'UTC+8', population: '5.9M' },
      { name: 'South Korea', flag: '🇰🇷', capital: 'Seoul', timezone: 'UTC+9', population: '52M' },
      { name: 'Sri Lanka', flag: '🇱🇰', capital: 'Colombo', timezone: 'UTC+5:30', population: '22M' },
      { name: 'Syria', flag: '🇸🇾', capital: 'Damascus', timezone: 'UTC+3', population: '22M' },
      { name: 'Taiwan', flag: '🇹🇼', capital: 'Taipei', timezone: 'UTC+8', population: '24M' },
      { name: 'Tajikistan', flag: '🇹🇯', capital: 'Dushanbe', timezone: 'UTC+5', population: '10M' },
      { name: 'Thailand', flag: '🇹🇭', capital: 'Bangkok', timezone: 'UTC+7', population: '72M' },
      { name: 'Timor-Leste', flag: '🇹🇱', capital: 'Dili', timezone: 'UTC+9', population: '1.3M' },
      { name: 'Turkey', flag: '🇹🇷', capital: 'Ankara', timezone: 'UTC+3', population: '85M' },
      { name: 'Turkmenistan', flag: '🇹🇲', capital: 'Ashgabat', timezone: 'UTC+5', population: '6.1M' },
      { name: 'UAE', flag: '🇦🇪', capital: 'Abu Dhabi', timezone: 'UTC+4', population: '10M' },
      { name: 'Uzbekistan', flag: '🇺🇿', capital: 'Tashkent', timezone: 'UTC+5', population: '35M' },
      { name: 'Vietnam', flag: '🇻🇳', capital: 'Hanoi', timezone: 'UTC+7', population: '99M' },
      { name: 'Yemen', flag: '🇾🇪', capital: 'Sanaa', timezone: 'UTC+3', population: '33M' },
    ],
  },
  {
    name: 'Africa',
    emoji: '🌍',
    countries: 54,
    timezones: 6,
    timezoneRange: 'UTC-1 to UTC+4',
    area: '30.4M km²',
    population: '1.4 billion',
    largest: 'Algeria',
    color: '#F59E0B',
    countryList: [
      { name: 'Algeria', flag: '🇩🇿', capital: 'Algiers', timezone: 'UTC+1', population: '45M' },
      { name: 'Angola', flag: '🇦🇴', capital: 'Luanda', timezone: 'UTC+1', population: '35M' },
      { name: 'Benin', flag: '🇧🇯', capital: 'Porto-Novo', timezone: 'UTC+1', population: '13M' },
      { name: 'Botswana', flag: '🇧🇼', capital: 'Gaborone', timezone: 'UTC+2', population: '2.4M' },
      { name: 'Burkina Faso', flag: '🇧🇫', capital: 'Ouagadougou', timezone: 'UTC+0', population: '22M' },
      { name: 'Burundi', flag: '🇧🇮', capital: 'Gitega', timezone: 'UTC+2', population: '12M' },
      { name: 'Cameroon', flag: '🇨🇲', capital: 'Yaoundé', timezone: 'UTC+1', population: '27M' },
      { name: 'Cape Verde', flag: '🇨🇻', capital: 'Praia', timezone: 'UTC-1', population: '590K' },
      { name: 'Central African Republic', flag: '🇨🇫', capital: 'Bangui', timezone: 'UTC+1', population: '5M' },
      { name: 'Chad', flag: '🇹🇩', capital: "N'Djamena", timezone: 'UTC+1', population: '17M' },
      { name: 'Comoros', flag: '🇰🇲', capital: 'Moroni', timezone: 'UTC+3', population: '900K' },
      { name: 'DR Congo', flag: '🇨🇩', capital: 'Kinshasa', timezone: 'UTC+1/+2', population: '102M' },
      { name: 'Republic of Congo', flag: '🇨🇬', capital: 'Brazzaville', timezone: 'UTC+1', population: '5.8M' },
      { name: 'Djibouti', flag: '🇩🇯', capital: 'Djibouti', timezone: 'UTC+3', population: '1M' },
      { name: 'Egypt', flag: '🇪🇬', capital: 'Cairo', timezone: 'UTC+2', population: '104M' },
      { name: 'Equatorial Guinea', flag: '🇬🇶', capital: 'Malabo', timezone: 'UTC+1', population: '1.5M' },
      { name: 'Eritrea', flag: '🇪🇷', capital: 'Asmara', timezone: 'UTC+3', population: '3.6M' },
      { name: 'Eswatini', flag: '🇸🇿', capital: 'Mbabane', timezone: 'UTC+2', population: '1.2M' },
      { name: 'Ethiopia', flag: '🇪🇹', capital: 'Addis Ababa', timezone: 'UTC+3', population: '120M' },
      { name: 'Gabon', flag: '🇬🇦', capital: 'Libreville', timezone: 'UTC+1', population: '2.3M' },
      { name: 'Gambia', flag: '🇬🇲', capital: 'Banjul', timezone: 'UTC+0', population: '2.5M' },
      { name: 'Ghana', flag: '🇬🇭', capital: 'Accra', timezone: 'UTC+0', population: '32M' },
      { name: 'Guinea', flag: '🇬🇳', capital: 'Conakry', timezone: 'UTC+0', population: '13M' },
      { name: 'Guinea-Bissau', flag: '🇬🇼', capital: 'Bissau', timezone: 'UTC+0', population: '2M' },
      { name: 'Ivory Coast', flag: '🇨🇮', capital: 'Yamoussoukro', timezone: 'UTC+0', population: '28M' },
      { name: 'Kenya', flag: '🇰🇪', capital: 'Nairobi', timezone: 'UTC+3', population: '54M' },
      { name: 'Lesotho', flag: '🇱🇸', capital: 'Maseru', timezone: 'UTC+2', population: '2.2M' },
      { name: 'Liberia', flag: '🇱🇷', capital: 'Monrovia', timezone: 'UTC+0', population: '5.2M' },
      { name: 'Libya', flag: '🇱🇾', capital: 'Tripoli', timezone: 'UTC+2', population: '7M' },
      { name: 'Madagascar', flag: '🇲🇬', capital: 'Antananarivo', timezone: 'UTC+3', population: '29M' },
      { name: 'Malawi', flag: '🇲🇼', capital: 'Lilongwe', timezone: 'UTC+2', population: '20M' },
      { name: 'Mali', flag: '🇲🇱', capital: 'Bamako', timezone: 'UTC+0', population: '21M' },
      { name: 'Mauritania', flag: '🇲🇷', capital: 'Nouakchott', timezone: 'UTC+0', population: '4.6M' },
      { name: 'Mauritius', flag: '🇲🇺', capital: 'Port Louis', timezone: 'UTC+4', population: '1.3M' },
      { name: 'Morocco', flag: '🇲🇦', capital: 'Rabat', timezone: 'UTC+1', population: '37M' },
      { name: 'Mozambique', flag: '🇲🇿', capital: 'Maputo', timezone: 'UTC+2', population: '32M' },
      { name: 'Namibia', flag: '🇳🇦', capital: 'Windhoek', timezone: 'UTC+2', population: '2.6M' },
      { name: 'Niger', flag: '🇳🇪', capital: 'Niamey', timezone: 'UTC+1', population: '25M' },
      { name: 'Nigeria', flag: '🇳🇬', capital: 'Abuja', timezone: 'UTC+1', population: '218M' },
      { name: 'Rwanda', flag: '🇷🇼', capital: 'Kigali', timezone: 'UTC+2', population: '13M' },
      { name: 'São Tomé', flag: '🇸🇹', capital: 'São Tomé', timezone: 'UTC+0', population: '220K' },
      { name: 'Senegal', flag: '🇸🇳', capital: 'Dakar', timezone: 'UTC+0', population: '17M' },
      { name: 'Seychelles', flag: '🇸🇨', capital: 'Victoria', timezone: 'UTC+4', population: '100K' },
      { name: 'Sierra Leone', flag: '🇸🇱', capital: 'Freetown', timezone: 'UTC+0', population: '8.2M' },
      { name: 'Somalia', flag: '🇸🇴', capital: 'Mogadishu', timezone: 'UTC+3', population: '17M' },
      { name: 'South Africa', flag: '🇿🇦', capital: 'Pretoria', timezone: 'UTC+2', population: '60M' },
      { name: 'South Sudan', flag: '🇸🇸', capital: 'Juba', timezone: 'UTC+2', population: '11M' },
      { name: 'Sudan', flag: '🇸🇩', capital: 'Khartoum', timezone: 'UTC+2', population: '45M' },
      { name: 'Tanzania', flag: '🇹🇿', capital: 'Dodoma', timezone: 'UTC+3', population: '63M' },
      { name: 'Togo', flag: '🇹🇬', capital: 'Lomé', timezone: 'UTC+0', population: '8.5M' },
      { name: 'Tunisia', flag: '🇹🇳', capital: 'Tunis', timezone: 'UTC+1', population: '12M' },
      { name: 'Uganda', flag: '🇺🇬', capital: 'Kampala', timezone: 'UTC+3', population: '47M' },
      { name: 'Zambia', flag: '🇿🇲', capital: 'Lusaka', timezone: 'UTC+2', population: '20M' },
      { name: 'Zimbabwe', flag: '🇿🇼', capital: 'Harare', timezone: 'UTC+2', population: '16M' },
    ],
  },
  {
    name: 'North America',
    emoji: '🌎',
    countries: 23,
    timezones: 7,
    timezoneRange: 'UTC-10 to UTC-3.5',
    area: '24.7M km²',
    population: '579 million',
    largest: 'Canada',
    color: '#3B82F6',
    countryList: [
      { name: 'Antigua & Barbuda', flag: '🇦🇬', capital: "St John's", timezone: 'UTC-4', population: '100K' },
      { name: 'Bahamas', flag: '🇧🇸', capital: 'Nassau', timezone: 'UTC-5', population: '400K' },
      { name: 'Barbados', flag: '🇧🇧', capital: 'Bridgetown', timezone: 'UTC-4', population: '290K' },
      { name: 'Belize', flag: '🇧🇿', capital: 'Belmopan', timezone: 'UTC-6', population: '405K' },
      { name: 'Canada', flag: '🇨🇦', capital: 'Ottawa', timezone: 'UTC-5/-4/-3.5', population: '39M' },
      { name: 'Costa Rica', flag: '🇨🇷', capital: 'San José', timezone: 'UTC-6', population: '5.2M' },
      { name: 'Cuba', flag: '🇨🇺', capital: 'Havana', timezone: 'UTC-5', population: '11M' },
      { name: 'Dominica', flag: '🇩🇲', capital: 'Roseau', timezone: 'UTC-4', population: '72K' },
      { name: 'Dominican Republic', flag: '🇩🇴', capital: 'Santo Domingo', timezone: 'UTC-4', population: '11M' },
      { name: 'El Salvador', flag: '🇸🇻', capital: 'San Salvador', timezone: 'UTC-6', population: '6.3M' },
      { name: 'Grenada', flag: '🇬🇩', capital: "St George's", timezone: 'UTC-4', population: '113K' },
      { name: 'Guatemala', flag: '🇬🇹', capital: 'Guatemala City', timezone: 'UTC-6', population: '17M' },
      { name: 'Haiti', flag: '🇭🇹', capital: 'Port-au-Prince', timezone: 'UTC-5', population: '11M' },
      { name: 'Honduras', flag: '🇭🇳', capital: 'Tegucigalpa', timezone: 'UTC-6', population: '10M' },
      { name: 'Jamaica', flag: '🇯🇲', capital: 'Kingston', timezone: 'UTC-5', population: '3M' },
      { name: 'Mexico', flag: '🇲🇽', capital: 'Mexico City', timezone: 'UTC-6/-5', population: '129M' },
      { name: 'Nicaragua', flag: '🇳🇮', capital: 'Managua', timezone: 'UTC-6', population: '6.8M' },
      { name: 'Panama', flag: '🇵🇦', capital: 'Panama City', timezone: 'UTC-5', population: '4.4M' },
      { name: 'Saint Kitts', flag: '🇰🇳', capital: 'Basseterre', timezone: 'UTC-4', population: '53K' },
      { name: 'Saint Lucia', flag: '🇱🇨', capital: 'Castries', timezone: 'UTC-4', population: '180K' },
      { name: 'Saint Vincent', flag: '🇻🇨', capital: 'Kingstown', timezone: 'UTC-4', population: '110K' },
      { name: 'Trinidad & Tobago', flag: '🇹🇹', capital: 'Port of Spain', timezone: 'UTC-4', population: '1.4M' },
      { name: 'United States', flag: '🇺🇸', capital: 'Washington DC', timezone: 'UTC-5/-4 (HI -10, AK -9)', population: '335M' },
    ],
  },
  {
    name: 'South America',
    emoji: '🌎',
    countries: 12,
    timezones: 4,
    timezoneRange: 'UTC-5 to UTC-2',
    area: '17.8M km²',
    population: '434 million',
    largest: 'Brazil',
    color: '#22C55E',
    countryList: [
      { name: 'Argentina', flag: '🇦🇷', capital: 'Buenos Aires', timezone: 'UTC-3', population: '46M' },
      { name: 'Bolivia', flag: '🇧🇴', capital: 'Sucre', timezone: 'UTC-4', population: '12M' },
      { name: 'Brazil', flag: '🇧🇷', capital: 'Brasília', timezone: 'UTC-3/-4', population: '215M' },
      { name: 'Chile', flag: '🇨🇱', capital: 'Santiago', timezone: 'UTC-3/-4', population: '19M' },
      { name: 'Colombia', flag: '🇨🇴', capital: 'Bogotá', timezone: 'UTC-5', population: '52M' },
      { name: 'Ecuador', flag: '🇪🇨', capital: 'Quito', timezone: 'UTC-5', population: '18M' },
      { name: 'Guyana', flag: '🇬🇾', capital: 'Georgetown', timezone: 'UTC-4', population: '800K' },
      { name: 'Paraguay', flag: '🇵🇾', capital: 'Asunción', timezone: 'UTC-4', population: '7.2M' },
      { name: 'Peru', flag: '🇵🇪', capital: 'Lima', timezone: 'UTC-5', population: '34M' },
      { name: 'Suriname', flag: '🇸🇷', capital: 'Paramaribo', timezone: 'UTC-3', population: '610K' },
      { name: 'Uruguay', flag: '🇺🇾', capital: 'Montevideo', timezone: 'UTC-3', population: '3.5M' },
      { name: 'Venezuela', flag: '🇻🇪', capital: 'Caracas', timezone: 'UTC-4', population: '28M' },
    ],
  },
  {
    name: 'Europe',
    emoji: '🌍',
    countries: 44,
    timezones: 4,
    timezoneRange: 'UTC-1 to UTC+4',
    area: '10.2M km²',
    population: '748 million',
    largest: 'Ukraine (excl. Russia)',
    color: '#8B5CF6',
    countryList: [
      { name: 'Albania', flag: '🇦🇱', capital: 'Tirana', timezone: 'UTC+1', population: '2.8M' },
      { name: 'Andorra', flag: '🇦🇩', capital: 'Andorra la Vella', timezone: 'UTC+1', population: '80K' },
      { name: 'Austria', flag: '🇦🇹', capital: 'Vienna', timezone: 'UTC+1', population: '9.1M' },
      { name: 'Belarus', flag: '🇧🇾', capital: 'Minsk', timezone: 'UTC+3', population: '9.4M' },
      { name: 'Belgium', flag: '🇧🇪', capital: 'Brussels', timezone: 'UTC+1', population: '11.6M' },
      { name: 'Bosnia', flag: '🇧🇦', capital: 'Sarajevo', timezone: 'UTC+1', population: '3.3M' },
      { name: 'Bulgaria', flag: '🇧🇬', capital: 'Sofia', timezone: 'UTC+2', population: '6.9M' },
      { name: 'Croatia', flag: '🇭🇷', capital: 'Zagreb', timezone: 'UTC+1', population: '3.9M' },
      { name: 'Czech Republic', flag: '🇨🇿', capital: 'Prague', timezone: 'UTC+1', population: '10.7M' },
      { name: 'Denmark', flag: '🇩🇰', capital: 'Copenhagen', timezone: 'UTC+1', population: '5.9M' },
      { name: 'Estonia', flag: '🇪🇪', capital: 'Tallinn', timezone: 'UTC+2', population: '1.3M' },
      { name: 'Finland', flag: '🇫🇮', capital: 'Helsinki', timezone: 'UTC+2', population: '5.5M' },
      { name: 'France', flag: '🇫🇷', capital: 'Paris', timezone: 'UTC+1', population: '68M' },
      { name: 'Germany', flag: '🇩🇪', capital: 'Berlin', timezone: 'UTC+1', population: '84M' },
      { name: 'Greece', flag: '🇬🇷', capital: 'Athens', timezone: 'UTC+2', population: '10.4M' },
      { name: 'Hungary', flag: '🇭🇺', capital: 'Budapest', timezone: 'UTC+1', population: '9.7M' },
      { name: 'Iceland', flag: '🇮🇸', capital: 'Reykjavík', timezone: 'UTC+0', population: '380K' },
      { name: 'Ireland', flag: '🇮🇪', capital: 'Dublin', timezone: 'UTC+0', population: '5.1M' },
      { name: 'Italy', flag: '🇮🇹', capital: 'Rome', timezone: 'UTC+1', population: '59M' },
      { name: 'Kosovo', flag: '🇽🇰', capital: 'Pristina', timezone: 'UTC+1', population: '1.8M' },
      { name: 'Latvia', flag: '🇱🇻', capital: 'Riga', timezone: 'UTC+2', population: '1.8M' },
      { name: 'Liechtenstein', flag: '🇱🇮', capital: 'Vaduz', timezone: 'UTC+1', population: '39K' },
      { name: 'Lithuania', flag: '🇱🇹', capital: 'Vilnius', timezone: 'UTC+2', population: '2.8M' },
      { name: 'Luxembourg', flag: '🇱🇺', capital: 'Luxembourg', timezone: 'UTC+1', population: '650K' },
      { name: 'Malta', flag: '🇲🇹', capital: 'Valletta', timezone: 'UTC+1', population: '520K' },
      { name: 'Moldova', flag: '🇲🇩', capital: 'Chișinău', timezone: 'UTC+2', population: '2.6M' },
      { name: 'Monaco', flag: '🇲🇨', capital: 'Monaco', timezone: 'UTC+1', population: '39K' },
      { name: 'Montenegro', flag: '🇲🇪', capital: 'Podgorica', timezone: 'UTC+1', population: '620K' },
      { name: 'Netherlands', flag: '🇳🇱', capital: 'Amsterdam', timezone: 'UTC+1', population: '17.5M' },
      { name: 'North Macedonia', flag: '🇲🇰', capital: 'Skopje', timezone: 'UTC+1', population: '1.8M' },
      { name: 'Norway', flag: '🇳🇴', capital: 'Oslo', timezone: 'UTC+1', population: '5.4M' },
      { name: 'Poland', flag: '🇵🇱', capital: 'Warsaw', timezone: 'UTC+1', population: '37.7M' },
      { name: 'Portugal', flag: '🇵🇹', capital: 'Lisbon', timezone: 'UTC+0', population: '10.3M' },
      { name: 'Romania', flag: '🇷🇴', capital: 'Bucharest', timezone: 'UTC+2', population: '19M' },
      { name: 'Russia', flag: '🇷🇺', capital: 'Moscow', timezone: 'UTC+3 (11 zones)', population: '144M' },
      { name: 'San Marino', flag: '🇸🇲', capital: 'San Marino', timezone: 'UTC+1', population: '33K' },
      { name: 'Serbia', flag: '🇷🇸', capital: 'Belgrade', timezone: 'UTC+1', population: '6.6M' },
      { name: 'Slovakia', flag: '🇸🇰', capital: 'Bratislava', timezone: 'UTC+1', population: '5.4M' },
      { name: 'Slovenia', flag: '🇸🇮', capital: 'Ljubljana', timezone: 'UTC+1', population: '2.1M' },
      { name: 'Spain', flag: '🇪🇸', capital: 'Madrid', timezone: 'UTC+1', population: '47M' },
      { name: 'Sweden', flag: '🇸🇪', capital: 'Stockholm', timezone: 'UTC+1', population: '10.4M' },
      { name: 'Switzerland', flag: '🇨🇭', capital: 'Bern', timezone: 'UTC+1', population: '8.8M' },
      { name: 'Ukraine', flag: '🇺🇦', capital: 'Kyiv', timezone: 'UTC+2', population: '43M' },
      { name: 'United Kingdom', flag: '🇬🇧', capital: 'London', timezone: 'UTC+0', population: '67M' },
    ],
  },
  {
    name: 'Oceania',
    emoji: '🌏',
    countries: 14,
    timezones: 9,
    timezoneRange: 'UTC+8 to UTC+13',
    area: '8.5M km²',
    population: '45 million',
    largest: 'Australia',
    color: '#06B6D4',
    countryList: [
      { name: 'Australia', flag: '🇦🇺', capital: 'Canberra', timezone: 'UTC+8/+9.5/+10/+11', population: '26M' },
      { name: 'Fiji', flag: '🇫🇯', capital: 'Suva', timezone: 'UTC+12', population: '900K' },
      { name: 'Kiribati', flag: '🇰🇮', capital: 'Tarawa', timezone: 'UTC+12/+13/+14', population: '120K' },
      { name: 'Marshall Islands', flag: '🇲🇭', capital: 'Majuro', timezone: 'UTC+12', population: '60K' },
      { name: 'Micronesia', flag: '🇫🇲', capital: 'Palikir', timezone: 'UTC+10/+11', population: '115K' },
      { name: 'Nauru', flag: '🇳🇷', capital: 'Yaren', timezone: 'UTC+12', population: '10K' },
      { name: 'New Zealand', flag: '🇳🇿', capital: 'Wellington', timezone: 'UTC+12/+13', population: '5.1M' },
      { name: 'Palau', flag: '🇵🇼', capital: 'Ngerulmud', timezone: 'UTC+9', population: '18K' },
      { name: 'Papua New Guinea', flag: '🇵🇬', capital: 'Port Moresby', timezone: 'UTC+10', population: '10M' },
      { name: 'Samoa', flag: '🇼🇸', capital: 'Apia', timezone: 'UTC+13', population: '200K' },
      { name: 'Solomon Islands', flag: '🇸🇧', capital: 'Honiara', timezone: 'UTC+11', population: '700K' },
      { name: 'Tonga', flag: '🇹🇴', capital: "Nuku'alofa", timezone: 'UTC+13', population: '100K' },
      { name: 'Tuvalu', flag: '🇹🇻', capital: 'Funafuti', timezone: 'UTC+12', population: '11K' },
      { name: 'Vanuatu', flag: '🇻🇺', capital: 'Port Vila', timezone: 'UTC+11', population: '315K' },
    ],
  },
  {
    name: 'Antarctica',
    emoji: '🏔️',
    countries: 0,
    timezones: 0,
    timezoneRange: 'Various (station-based)',
    area: '14M km²',
    population: '~5,000 seasonal',
    largest: 'N/A (30+ nations operate stations)',
    color: '#94A3B8',
    countryList: [],
  },
];

const funFacts = [
  {
    title: 'China uses 1 time zone',
    description:
      'Despite spanning 5 geographical time zones, all of China officially uses Beijing Time (UTC+8). This means sunrise in western Xinjiang can be as late as 10 AM.',
  },
  {
    title: "India's half-hour offset",
    description:
      'India uses UTC+5:30, one of only a few countries with a :30 offset. This single zone covers 3,000 km east to west.',
  },
  {
    title: "Nepal's unique UTC+5:45",
    description:
      "Nepal is the only country in the world using a :45 offset (UTC+5:45), chosen to differentiate from India's UTC+5:30.",
  },
  {
    title: 'France leads with 12 time zones',
    description:
      'Thanks to overseas territories like French Polynesia, New Caledonia, and Réunion, France spans 12 time zones — the most of any country.',
  },
  {
    title: 'Russia spans 11 time zones',
    description:
      'From Kaliningrad (UTC+2) to Kamchatka (UTC+12), Russia covers 11 contiguous time zones across the largest country on Earth.',
  },
  {
    title: 'Kiribati sees the New Year first',
    description:
      "Kiribati's Line Islands use UTC+14, making them the first place on Earth to ring in the New Year each January 1st.",
  },
];

/* ------------------------------------------------------------------ */
/*  HELPER: parse timezone strings into individual zones               */
/* ------------------------------------------------------------------ */

function parseTimezones(tz: string): string[] {
  // Handle special formats like "UTC+3 (11 zones)" or "UTC-5/-4 (HI -10, AK -9)"
  const cleaned = tz.replace(/\s*\(.*?\)\s*/g, '');
  // Split on "/" but keep the UTC prefix
  const parts = cleaned.split('/');
  const results: string[] = [];
  let basePrefix = '';
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith('UTC')) {
      basePrefix = 'UTC';
      results.push(trimmed);
    } else {
      results.push(basePrefix + trimmed);
    }
  }
  return results;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function ContinentsPage() {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* Search across all continents */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: { continent: string; country: Country; color: string }[] = [];
    for (const c of continents) {
      for (const country of c.countryList) {
        if (
          country.name.toLowerCase().includes(q) ||
          country.capital.toLowerCase().includes(q) ||
          country.timezone.toLowerCase().includes(q)
        ) {
          results.push({ continent: c.name, country, color: c.color });
        }
      }
    }
    return results;
  }, [searchQuery]);

  /* Time zone breakdown per continent */
  const timezoneBreakdown = useMemo(() => {
    return continents
      .filter((c) => c.countryList.length > 0)
      .map((c) => {
        const tzMap: Record<string, string[]> = {};
        for (const country of c.countryList) {
          const zones = parseTimezones(country.timezone);
          for (const z of zones) {
            if (!tzMap[z]) tzMap[z] = [];
            if (!tzMap[z].includes(country.name)) {
              tzMap[z].push(country.name);
            }
          }
        }
        const sorted = Object.entries(tzMap).sort((a, b) => {
          const numA = parseFloat(a[0].replace('UTC', '').replace(':', '.') || '0');
          const numB = parseFloat(b[0].replace('UTC', '').replace(':', '.') || '0');
          return numA - numB;
        });
        return { name: c.name, color: c.color, emoji: c.emoji, zones: sorted };
      });
  }, []);

  const handleContinentClick = (name: string) => {
    setSelectedContinent((prev) => (prev === name ? null : name));
  };

  return (
    <main className="min-h-screen" style={{ background: '#030712', fontFamily: 'Inter, sans-serif' }}>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 50%, rgba(79,70,229,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.2) 0%, transparent 60%)',
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Globe className="h-10 w-10" style={{ color: '#4F46E5' }} />
            <span
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: 'rgba(79,70,229,0.15)', color: '#A5B4FC', border: '1px solid rgba(79,70,229,0.3)' }}
            >
              7 Continents &middot; 196+ Countries
            </span>
          </div>
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
          >
            Continents &amp; Time Zones
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              of the World
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: '#94A3B8' }}>
            Explore every continent, country, capital, and time zone on Earth. Click a continent to reveal its nations, search any country instantly, and discover fascinating timezone facts.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── SEARCH ── */}
        <section className="mb-12">
          <div
            className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl"
            style={{ background: '#0F172A', border: '1px solid #1E293B' }}
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <Search className="h-5 w-5 flex-shrink-0" style={{ color: '#94A3B8' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any country, capital, or time zone..."
                className="w-full bg-transparent text-base outline-none placeholder:text-slate-500"
                style={{ color: '#E2E8F0' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex-shrink-0 rounded-lg px-3 py-1 text-sm transition-colors hover:bg-slate-700"
                  style={{ color: '#94A3B8' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults && searchResults.length > 0 && (
            <div className="mx-auto mt-4 max-w-4xl">
              <p className="mb-3 text-sm" style={{ color: '#94A3B8' }}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 transition-all hover:scale-[1.02]"
                    style={{
                      background: '#0F172A',
                      border: '1px solid #1E293B',
                      borderLeft: `3px solid ${r.color}`,
                    }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xl">{r.country.flag}</span>
                      <span className="font-semibold" style={{ color: '#E2E8F0', fontFamily: 'Outfit, sans-serif' }}>
                        {r.country.name}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm" style={{ color: '#94A3B8' }}>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {r.country.capital}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {r.country.timezone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {r.country.population}
                      </div>
                    </div>
                    <span
                      className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs"
                      style={{ background: `${r.color}20`, color: r.color }}
                    >
                      {r.continent}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {searchResults && searchResults.length === 0 && (
            <p className="mt-4 text-center text-sm" style={{ color: '#94A3B8' }}>
              No countries found for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </section>

        {/* ── CONTINENT CARDS ── */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <LayoutGrid className="h-6 w-6" style={{ color: '#4F46E5' }} />
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
            >
              Continent Overview
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continents.map((c) => {
              const isSelected = selectedContinent === c.name;
              return (
                <div key={c.name} className="flex flex-col">
                  <button
                    onClick={() => handleContinentClick(c.name)}
                    className="group relative flex flex-1 flex-col rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: '#0F172A',
                      border: `1px solid ${isSelected ? c.color : '#1E293B'}`,
                      boxShadow: isSelected ? `0 0 24px ${c.color}20` : 'none',
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      className="absolute left-0 right-0 top-0 h-1 rounded-t-2xl"
                      style={{ background: c.color }}
                    />

                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <span className="text-3xl">{c.emoji}</span>
                        <h3
                          className="mt-1 text-xl font-bold"
                          style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
                        >
                          {c.name}
                        </h3>
                      </div>
                      <div
                        className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ background: `${c.color}20`, color: c.color }}
                      >
                        {c.countries > 0 ? c.countries : '0'}
                        <span className="opacity-75">
                          {c.countries === 1 ? 'country' : 'countries'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm" style={{ color: '#94A3B8' }}>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> Time zones
                        </span>
                        <span style={{ color: '#E2E8F0' }}>
                          {c.timezones > 0 ? c.timezones : '—'}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: '#64748B' }}>
                        {c.timezoneRange}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Maximize2 className="h-3.5 w-3.5" /> Area
                        </span>
                        <span style={{ color: '#E2E8F0' }}>{c.area}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" /> Population
                        </span>
                        <span style={{ color: '#E2E8F0' }}>{c.population}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> Largest
                        </span>
                        <span className="text-right text-xs" style={{ color: '#E2E8F0' }}>
                          {c.largest}
                        </span>
                      </div>
                    </div>

                    <div
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors"
                      style={{
                        background: isSelected ? `${c.color}20` : 'rgba(30,41,59,0.5)',
                        color: isSelected ? c.color : '#94A3B8',
                      }}
                    >
                      {c.countryList.length > 0 ? (
                        <>
                          {isSelected ? 'Hide' : 'View'} Countries
                          {isSelected ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </>
                      ) : (
                        'No permanent countries'
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <AdBanner />

        {/* ── EXPANDED COUNTRY LIST ── */}
        {selectedContinent && (
          <section className="mb-16">
            {(() => {
              const c = continents.find((ct) => ct.name === selectedContinent);
              if (!c || c.countryList.length === 0) return null;
              return (
                <div
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: '#0F172A',
                    border: `1px solid ${c.color}40`,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: `1px solid ${c.color}30` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.emoji}</span>
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
                      >
                        Countries of {c.name}
                      </h3>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ background: `${c.color}20`, color: c.color }}
                      >
                        {c.countryList.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedContinent(null)}
                      className="rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-slate-700"
                      style={{ color: '#94A3B8' }}
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {c.countryList.map((country) => (
                      <div
                        key={country.name}
                        className="rounded-xl p-4 transition-all hover:scale-[1.01]"
                        style={{
                          background: '#030712',
                          border: '1px solid #1E293B',
                        }}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xl">{country.flag}</span>
                          <span
                            className="font-semibold"
                            style={{ color: '#E2E8F0', fontFamily: 'Outfit, sans-serif' }}
                          >
                            {country.name}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm" style={{ color: '#94A3B8' }}>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: c.color }} />
                            <span>{country.capital}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 flex-shrink-0" style={{ color: c.color }} />
                            <span>{country.timezone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 flex-shrink-0" style={{ color: c.color }} />
                            <span>{country.population}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* ── TIME ZONE MAP / BREAKDOWN ── */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <Map className="h-6 w-6" style={{ color: '#06B6D4' }} />
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
            >
              Time Zones by Continent
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {timezoneBreakdown.map((tb) => (
              <div
                key={tb.name}
                className="rounded-2xl p-5"
                style={{ background: '#0F172A', border: '1px solid #1E293B' }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl">{tb.emoji}</span>
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
                  >
                    {tb.name}
                  </h3>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ background: `${tb.color}20`, color: tb.color }}
                  >
                    {tb.zones.length} zone{tb.zones.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {tb.zones.map(([zone, countries]) => (
                    <div
                      key={zone}
                      className="flex items-start gap-3 rounded-lg px-3 py-2"
                      style={{ background: 'rgba(3,7,18,0.6)' }}
                    >
                      <span
                        className="mt-0.5 flex-shrink-0 rounded-md px-2 py-0.5 text-xs font-mono font-semibold"
                        style={{ background: `${tb.color}15`, color: tb.color, minWidth: '5.5rem', textAlign: 'center' }}
                      >
                        {zone}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {countries.map((cn) => (
                          <span
                            key={cn}
                            className="rounded-md px-2 py-0.5 text-xs"
                            style={{ background: '#1E293B', color: '#94A3B8' }}
                          >
                            {cn}
                          </span>
                        ))}
                      </div>
                      <span
                        className="ml-auto flex-shrink-0 text-xs font-semibold"
                        style={{ color: '#64748B' }}
                      >
                        {countries.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FUN FACTS ── */}
        <section className="mb-20">
          <div className="mb-8 flex items-center gap-3">
            <Lightbulb className="h-6 w-6" style={{ color: '#F59E0B' }} />
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
            >
              Fun Time Zone Facts
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {funFacts.map((fact, i) => (
              <div
                key={i}
                className="group rounded-2xl p-5 transition-all hover:scale-[1.02]"
                style={{ background: '#0F172A', border: '1px solid #1E293B' }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))',
                    color: '#06B6D4',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  className="mb-2 text-base font-bold"
                  style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
                >
                  {fact.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                  {fact.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

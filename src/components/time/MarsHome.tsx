'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Clock,
  Globe,
  CalendarDays,
  Telescope,
  Rocket,
  Calculator,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ArrowLeftRight,
  Star,
  Zap,
  MapPin,
  ChevronDown,
  Search,
} from 'lucide-react';

// ─── Did You Know Facts (from shared source) ───────────────
import { HERO_FACTS } from '@/lib/time/facts';


// ─── Premium Analog Clock with country flag colors (exact same as dark theme) ──
function MarsAnalogClock({ timezone, colors, size = 95 }: { timezone: string; colors: string[]; size?: number }) {
  const [angles, setAngles] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const str = now.toLocaleString('en-US', { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const [h, m, s] = str.split(':').map(Number);
      setAngles({ h: ((h % 12) + m / 60) * 30, m: (m + s / 60) * 6, s: s * 6 });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const r = size / 2;
  const ringR = r - 4;
  const faceR = r - 10;
  const uid = `mars-grad-${timezone.replace(/\//g, '-')}`;

  function arcPath(startDeg: number, endDeg: number, radius: number): string {
    const cx = r, cy = r;
    const s = (startDeg - 90) * Math.PI / 180;
    const e = (endDeg - 90) * Math.PI / 180;
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ aspectRatio: '1/1', display: 'block' }}>
      <circle cx={r} cy={r} r={r - 1} fill="none" stroke={colors[0]} strokeWidth={1} opacity={0.3} />
      <path d={arcPath(0, 120, ringR)} fill="none" stroke={colors[0]} strokeWidth={5} strokeLinecap="butt" />
      <path d={arcPath(120, 240, ringR)} fill="none" stroke={colors[1]} strokeWidth={5} strokeLinecap="butt" />
      <path d={arcPath(240, 360, ringR)} fill="none" stroke={colors[2]} strokeWidth={5} strokeLinecap="butt" />
      <circle cx={r} cy={r} r={faceR} fill="#0F172A" />
      <circle cx={r} cy={r} r={faceR} fill={`url(#${uid})`} opacity={0.3} />
      <defs><radialGradient id={uid}><stop offset="0%" stopColor={colors[0]} /><stop offset="100%" stopColor="transparent" /></radialGradient></defs>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const isMain = i % 3 === 0;
        const inner = faceR - (isMain ? 12 : 7);
        const outer = faceR - 3;
        return <line key={i} x1={r + inner * Math.cos(angle)} y1={r + inner * Math.sin(angle)} x2={r + outer * Math.cos(angle)} y2={r + outer * Math.sin(angle)} stroke={isMain ? '#E2E8F0' : '#475569'} strokeWidth={isMain ? 2.5 : 1} strokeLinecap="round" />;
      })}
      {Array.from({ length: 60 }).map((_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i * 6 - 90) * (Math.PI / 180);
        return <line key={`m${i}`} x1={r + (faceR - 3) * Math.cos(angle)} y1={r + (faceR - 3) * Math.sin(angle)} x2={r + (faceR - 1) * Math.cos(angle)} y2={r + (faceR - 1) * Math.sin(angle)} stroke="#334155" strokeWidth={0.5} />;
      })}
      <polygon points={`${r},${r - 3} ${r + (faceR * 0.5) * Math.sin((angles.h * Math.PI) / 180)},${r - (faceR * 0.5) * Math.cos((angles.h * Math.PI) / 180)} ${r},${r + 3}`} fill="#F1F5F9" />
      <polygon points={`${r},${r - 2} ${r + (faceR * 0.72) * Math.sin((angles.m * Math.PI) / 180)},${r - (faceR * 0.72) * Math.cos((angles.m * Math.PI) / 180)} ${r},${r + 2}`} fill="#CBD5E1" />
      <line x1={r - (faceR * 0.2) * Math.sin((angles.s * Math.PI) / 180)} y1={r + (faceR * 0.2) * Math.cos((angles.s * Math.PI) / 180)} x2={r + (faceR * 0.78) * Math.sin((angles.s * Math.PI) / 180)} y2={r - (faceR * 0.78) * Math.cos((angles.s * Math.PI) / 180)} stroke={colors[0]} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={r} cy={r} r={4} fill={colors[0]} />
      <circle cx={r} cy={r} r={2} fill="#0F172A" />
    </svg>
  );
}

// ─── Mini Digital Time ──────────────────────────────────────
function MarsMiniDigitalTime({ tz }: { tz: string }) {
  const [t, setT] = useState('');
  useEffect(() => {
    const u = () => setT(new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }));
    u();
    const id = setInterval(u, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return <span className="font-mono text-[10px] text-gray-300 tabular-nums">{t}</span>;
}

// ─── World Clock Cities (with flag colors for analog ring) ──
const WORLD_CLOCK_CITIES: { city: string; tz: string; flag: string; colors: string[] }[] = [
  // ─── Americas ───────────────────────────────────────────────
  { city: 'New York', tz: 'America/New_York', flag: '🇺🇸', colors: ['#3C3B6E', '#B22234', '#FFFFFF'] },
  { city: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🇺🇸', colors: ['#3C3B6E', '#B22234', '#FFFFFF'] },
  { city: 'Chicago', tz: 'America/Chicago', flag: '🇺🇸', colors: ['#3C3B6E', '#B22234', '#FFFFFF'] },
  { city: 'Anchorage', tz: 'America/Anchorage', flag: '🇺🇸', colors: ['#3C3B6E', '#B22234', '#FFFFFF'] },
  { city: 'Honolulu', tz: 'Pacific/Honolulu', flag: '🇺🇸', colors: ['#3C3B6E', '#B22234', '#FFFFFF'] },
  { city: 'Denver', tz: 'America/Denver', flag: '🇺🇸', colors: ['#3C3B6E', '#B22234', '#FFFFFF'] },
  { city: 'Toronto', tz: 'America/Toronto', flag: '🇨🇦', colors: ['#FF0000', '#FFFFFF', '#FF0000'] },
  { city: 'Vancouver', tz: 'America/Vancouver', flag: '🇨🇦', colors: ['#FF0000', '#FFFFFF', '#FF0000'] },
  { city: 'Mexico City', tz: 'America/Mexico_City', flag: '🇲🇽', colors: ['#006341', '#CE1126', '#FFFFFF'] },
  { city: 'São Paulo', tz: 'America/Sao_Paulo', flag: '🇧🇷', colors: ['#009C3B', '#FFDF00', '#002776'] },
  { city: 'Rio de Janeiro', tz: 'America/Sao_Paulo', flag: '🇧🇷', colors: ['#009C3B', '#FFDF00', '#002776'] },
  { city: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', colors: ['#74ACDF', '#FFFFFF', '#74ACDF'] },
  { city: 'Bogotá', tz: 'America/Bogota', flag: '🇨🇴', colors: ['#FCD116', '#003893', '#CE1126'] },
  { city: 'Santiago', tz: 'America/Santiago', flag: '🇨🇱', colors: ['#D52B1E', '#FFFFFF', '#0039A6'] },
  { city: 'Lima', tz: 'America/Lima', flag: '🇵🇪', colors: ['#D91023', '#FFFFFF', '#D91023'] },
  { city: 'Havana', tz: 'America/Havana', flag: '🇨🇺', colors: ['#002A8F', '#CB1515', '#FFFFFF'] },
  { city: 'Kingston', tz: 'America/Jamaica', flag: '🇯🇲', colors: ['#009B3A', '#FED100', '#000000'] },
  { city: 'Panama City', tz: 'America/Panama', flag: '🇵🇦', colors: ['#005293', '#D21034', '#FFFFFF'] },
  { city: 'San José', tz: 'America/Costa_Rica', flag: '🇨🇷', colors: ['#002B7F', '#CE1126', '#FFFFFF'] },
  { city: 'Quito', tz: 'America/Guayaquil', flag: '🇪🇨', colors: ['#FFD100', '#034EA2', '#CE1126'] },
  { city: 'Caracas', tz: 'America/Caracas', flag: '🇻🇪', colors: ['#FFCC00', '#003893', '#CF142B'] },
  { city: 'Montevideo', tz: 'America/Montevideo', flag: '🇺🇾', colors: ['#0038A8', '#FFFFFF', '#0038A8'] },
  { city: 'Asunción', tz: 'America/Asuncion', flag: '🇵🇾', colors: ['#D52B1E', '#FFFFFF', '#0038A8'] },
  { city: 'La Paz', tz: 'America/La_Paz', flag: '🇧🇴', colors: ['#D52B1E', '#F9E300', '#007934'] },
  { city: 'Santo Domingo', tz: 'America/Santo_Domingo', flag: '🇩🇴', colors: ['#002D62', '#CE1126', '#FFFFFF'] },
  { city: 'Guatemala City', tz: 'America/Guatemala', flag: '🇬🇹', colors: ['#4997D0', '#FFFFFF', '#4997D0'] },
  { city: 'Tegucigalpa', tz: 'America/Tegucigalpa', flag: '🇭🇳', colors: ['#0073CF', '#FFFFFF', '#0073CF'] },
  { city: 'San Salvador', tz: 'America/El_Salvador', flag: '🇸🇻', colors: ['#0F47AF', '#FFFFFF', '#0F47AF'] },
  { city: 'Managua', tz: 'America/Managua', flag: '🇳🇮', colors: ['#0067C6', '#FFFFFF', '#0067C6'] },
  { city: 'Port-au-Prince', tz: 'America/Port-au-Prince', flag: '🇭🇹', colors: ['#00209F', '#D21034', '#00209F'] },
  { city: 'Port of Spain', tz: 'America/Port_of_Spain', flag: '🇹🇹', colors: ['#CE1126', '#000000', '#FFFFFF'] },
  { city: 'Nassau', tz: 'America/Nassau', flag: '🇧🇸', colors: ['#00778B', '#FFC72C', '#000000'] },
  { city: 'Bridgetown', tz: 'America/Barbados', flag: '🇧🇧', colors: ['#00267F', '#FFC726', '#00267F'] },
  { city: 'Paramaribo', tz: 'America/Paramaribo', flag: '🇸🇷', colors: ['#377E3F', '#B40A2D', '#FFFFFF'] },
  { city: 'Georgetown', tz: 'America/Guyana', flag: '🇬🇾', colors: ['#009E49', '#FCD116', '#CE1126'] },
  { city: 'Belmopan', tz: 'America/Belize', flag: '🇧🇿', colors: ['#003F87', '#CE1126', '#FFFFFF'] },
  // ─── Europe ─────────────────────────────────────────────────
  { city: 'London', tz: 'Europe/London', flag: '🇬🇧', colors: ['#012169', '#C8102E', '#FFFFFF'] },
  { city: 'Paris', tz: 'Europe/Paris', flag: '🇫🇷', colors: ['#002395', '#ED2939', '#FFFFFF'] },
  { city: 'Berlin', tz: 'Europe/Berlin', flag: '🇩🇪', colors: ['#000000', '#DD0000', '#FFCE00'] },
  { city: 'Madrid', tz: 'Europe/Madrid', flag: '🇪🇸', colors: ['#AA151B', '#F1BF00', '#AA151B'] },
  { city: 'Rome', tz: 'Europe/Rome', flag: '🇮🇹', colors: ['#008C45', '#FFFFFF', '#CD212A'] },
  { city: 'Amsterdam', tz: 'Europe/Amsterdam', flag: '🇳🇱', colors: ['#AE1C28', '#FFFFFF', '#21468B'] },
  { city: 'Brussels', tz: 'Europe/Brussels', flag: '🇧🇪', colors: ['#000000', '#FDDA24', '#EF3340'] },
  { city: 'Zurich', tz: 'Europe/Zurich', flag: '🇨🇭', colors: ['#FF0000', '#FFFFFF', '#FF0000'] },
  { city: 'Vienna', tz: 'Europe/Vienna', flag: '🇦🇹', colors: ['#ED2939', '#FFFFFF', '#ED2939'] },
  { city: 'Stockholm', tz: 'Europe/Stockholm', flag: '🇸🇪', colors: ['#006AA7', '#FECC00', '#006AA7'] },
  { city: 'Oslo', tz: 'Europe/Oslo', flag: '🇳🇴', colors: ['#EF2B2D', '#002868', '#FFFFFF'] },
  { city: 'Copenhagen', tz: 'Europe/Copenhagen', flag: '🇩🇰', colors: ['#C60C30', '#FFFFFF', '#C60C30'] },
  { city: 'Helsinki', tz: 'Europe/Helsinki', flag: '🇫🇮', colors: ['#003580', '#FFFFFF', '#003580'] },
  { city: 'Warsaw', tz: 'Europe/Warsaw', flag: '🇵🇱', colors: ['#FFFFFF', '#DC143C', '#FFFFFF'] },
  { city: 'Prague', tz: 'Europe/Prague', flag: '🇨🇿', colors: ['#11457E', '#D7141A', '#FFFFFF'] },
  { city: 'Lisbon', tz: 'Europe/Lisbon', flag: '🇵🇹', colors: ['#006600', '#FF0000', '#FFCC00'] },
  { city: 'Athens', tz: 'Europe/Athens', flag: '🇬🇷', colors: ['#0D5EAF', '#FFFFFF', '#0D5EAF'] },
  { city: 'Dublin', tz: 'Europe/Dublin', flag: '🇮🇪', colors: ['#169B62', '#FFFFFF', '#FF883E'] },
  { city: 'Budapest', tz: 'Europe/Budapest', flag: '🇭🇺', colors: ['#CE2939', '#FFFFFF', '#477050'] },
  { city: 'Bucharest', tz: 'Europe/Bucharest', flag: '🇷🇴', colors: ['#002B7F', '#FCD116', '#CE1126'] },
  { city: 'Sofia', tz: 'Europe/Sofia', flag: '🇧🇬', colors: ['#FFFFFF', '#009B74', '#D62612'] },
  { city: 'Zagreb', tz: 'Europe/Zagreb', flag: '🇭🇷', colors: ['#FF0000', '#FFFFFF', '#171796'] },
  { city: 'Belgrade', tz: 'Europe/Belgrade', flag: '🇷🇸', colors: ['#C6363C', '#0C4076', '#FFFFFF'] },
  { city: 'Kyiv', tz: 'Europe/Kyiv', flag: '🇺🇦', colors: ['#005BBB', '#FFD500', '#005BBB'] },
  { city: 'Moscow', tz: 'Europe/Moscow', flag: '🇷🇺', colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
  { city: 'Novosibirsk', tz: 'Asia/Novosibirsk', flag: '🇷🇺', colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
  { city: 'Reykjavik', tz: 'Atlantic/Reykjavik', flag: '🇮🇸', colors: ['#003897', '#D72828', '#FFFFFF'] },
  { city: 'Istanbul', tz: 'Europe/Istanbul', flag: '🇹🇷', colors: ['#E30A17', '#FFFFFF', '#E30A17'] },
  { city: 'Bratislava', tz: 'Europe/Bratislava', flag: '🇸🇰', colors: ['#FFFFFF', '#0B4EA2', '#EE1C25'] },
  { city: 'Ljubljana', tz: 'Europe/Ljubljana', flag: '🇸🇮', colors: ['#FFFFFF', '#003DA5', '#ED1C24'] },
  { city: 'Tallinn', tz: 'Europe/Tallinn', flag: '🇪🇪', colors: ['#0072CE', '#000000', '#FFFFFF'] },
  { city: 'Riga', tz: 'Europe/Riga', flag: '🇱🇻', colors: ['#9E3039', '#FFFFFF', '#9E3039'] },
  { city: 'Vilnius', tz: 'Europe/Vilnius', flag: '🇱🇹', colors: ['#FDB913', '#006A44', '#C1272D'] },
  { city: 'Tbilisi', tz: 'Asia/Tbilisi', flag: '🇬🇪', colors: ['#FFFFFF', '#FF0000', '#FFFFFF'] },
  { city: 'Yerevan', tz: 'Asia/Yerevan', flag: '🇦🇲', colors: ['#D90012', '#0033A0', '#F2A800'] },
  { city: 'Baku', tz: 'Asia/Baku', flag: '🇦🇿', colors: ['#0092BC', '#E4002B', '#00AF66'] },
  { city: 'Chisinau', tz: 'Europe/Chisinau', flag: '🇲🇩', colors: ['#003DA5', '#FFD200', '#CC0000'] },
  { city: 'Tirana', tz: 'Europe/Tirane', flag: '🇦🇱', colors: ['#E41E20', '#000000', '#E41E20'] },
  { city: 'Skopje', tz: 'Europe/Skopje', flag: '🇲🇰', colors: ['#D20000', '#FFE600', '#D20000'] },
  { city: 'Podgorica', tz: 'Europe/Podgorica', flag: '🇲🇪', colors: ['#D4AF37', '#C40308', '#D4AF37'] },
  { city: 'Sarajevo', tz: 'Europe/Sarajevo', flag: '🇧🇦', colors: ['#002395', '#FECB00', '#002395'] },
  { city: 'Luxembourg', tz: 'Europe/Luxembourg', flag: '🇱🇺', colors: ['#EF3340', '#FFFFFF', '#00A3E0'] },
  { city: 'Valletta', tz: 'Europe/Malta', flag: '🇲🇹', colors: ['#FFFFFF', '#CF142B', '#FFFFFF'] },
  { city: 'Nicosia', tz: 'Asia/Nicosia', flag: '🇨🇾', colors: ['#FFFFFF', '#D57800', '#4E7A3E'] },
  { city: 'Monaco', tz: 'Europe/Monaco', flag: '🇲🇨', colors: ['#CE1126', '#FFFFFF', '#CE1126'] },
  { city: 'Andorra la Vella', tz: 'Europe/Andorra', flag: '🇦🇩', colors: ['#0032A0', '#FEDF00', '#D1001F'] },
  // ─── Africa ─────────────────────────────────────────────────
  { city: 'Cairo', tz: 'Africa/Cairo', flag: '🇪🇬', colors: ['#CE1126', '#FFFFFF', '#000000'] },
  { city: 'Lagos', tz: 'Africa/Lagos', flag: '🇳🇬', colors: ['#008751', '#FFFFFF', '#008751'] },
  { city: 'Johannesburg', tz: 'Africa/Johannesburg', flag: '🇿🇦', colors: ['#007749', '#FFB81C', '#DE3831'] },
  { city: 'Cape Town', tz: 'Africa/Johannesburg', flag: '🇿🇦', colors: ['#007749', '#FFB81C', '#DE3831'] },
  { city: 'Nairobi', tz: 'Africa/Nairobi', flag: '🇰🇪', colors: ['#000000', '#BB0000', '#006600'] },
  { city: 'Casablanca', tz: 'Africa/Casablanca', flag: '🇲🇦', colors: ['#C1272D', '#006233', '#C1272D'] },
  { city: 'Addis Ababa', tz: 'Africa/Addis_Ababa', flag: '🇪🇹', colors: ['#009A44', '#FCDD09', '#DA121A'] },
  { city: 'Accra', tz: 'Africa/Accra', flag: '🇬🇭', colors: ['#CE1126', '#FCD116', '#006B3F'] },
  { city: 'Dar es Salaam', tz: 'Africa/Dar_es_Salaam', flag: '🇹🇿', colors: ['#1EB53A', '#FCD116', '#00A3DD'] },
  { city: 'Algiers', tz: 'Africa/Algiers', flag: '🇩🇿', colors: ['#006233', '#FFFFFF', '#D21034'] },
  { city: 'Tunis', tz: 'Africa/Tunis', flag: '🇹🇳', colors: ['#E70013', '#FFFFFF', '#E70013'] },
  { city: 'Dakar', tz: 'Africa/Dakar', flag: '🇸🇳', colors: ['#00853F', '#FDEF42', '#E31B23'] },
  { city: 'Kinshasa', tz: 'Africa/Kinshasa', flag: '🇨🇩', colors: ['#007FFF', '#CE1021', '#F7D618'] },
  { city: 'Abidjan', tz: 'Africa/Abidjan', flag: '🇨🇮', colors: ['#F77F00', '#FFFFFF', '#009E60'] },
  { city: 'Douala', tz: 'Africa/Douala', flag: '🇨🇲', colors: ['#007A5E', '#CE1126', '#FCD116'] },
  { city: 'Kampala', tz: 'Africa/Kampala', flag: '🇺🇬', colors: ['#000000', '#FCDC04', '#D90000'] },
  { city: 'Harare', tz: 'Africa/Harare', flag: '🇿🇼', colors: ['#006400', '#FFD200', '#D21034'] },
  { city: 'Luanda', tz: 'Africa/Luanda', flag: '🇦🇴', colors: ['#CE1126', '#000000', '#FFCE00'] },
  { city: 'Maputo', tz: 'Africa/Maputo', flag: '🇲🇿', colors: ['#009A44', '#000000', '#FCE100'] },
  { city: 'Lusaka', tz: 'Africa/Lusaka', flag: '🇿🇲', colors: ['#198A00', '#000000', '#EF7D00'] },
  { city: 'Antananarivo', tz: 'Indian/Antananarivo', flag: '🇲🇬', colors: ['#FFFFFF', '#FC3D32', '#007E3A'] },
  { city: 'Kigali', tz: 'Africa/Kigali', flag: '🇷🇼', colors: ['#00A1DE', '#FAD201', '#20603D'] },
  { city: 'Tripoli', tz: 'Africa/Tripoli', flag: '🇱🇾', colors: ['#E70013', '#000000', '#239E46'] },
  { city: 'Windhoek', tz: 'Africa/Windhoek', flag: '🇳🇦', colors: ['#003580', '#009543', '#D21034'] },
  { city: 'Gaborone', tz: 'Africa/Gaborone', flag: '🇧🇼', colors: ['#75AADB', '#000000', '#FFFFFF'] },
  { city: 'Bamako', tz: 'Africa/Bamako', flag: '🇲🇱', colors: ['#14B53A', '#FCD116', '#CE1126'] },
  { city: 'Nouakchott', tz: 'Africa/Nouakchott', flag: '🇲🇷', colors: ['#006233', '#FFC400', '#006233'] },
  // ─── Middle East ────────────────────────────────────────────
  { city: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪', colors: ['#00732F', '#FF0000', '#FFFFFF'] },
  { city: 'Riyadh', tz: 'Asia/Riyadh', flag: '🇸🇦', colors: ['#006C35', '#FFFFFF', '#006C35'] },
  { city: 'Tel Aviv', tz: 'Asia/Jerusalem', flag: '🇮🇱', colors: ['#0038B8', '#FFFFFF', '#0038B8'] },
  { city: 'Doha', tz: 'Asia/Qatar', flag: '🇶🇦', colors: ['#8D1B3D', '#FFFFFF', '#8D1B3D'] },
  { city: 'Kuwait City', tz: 'Asia/Kuwait', flag: '🇰🇼', colors: ['#007A33', '#CE1126', '#000000'] },
  { city: 'Muscat', tz: 'Asia/Muscat', flag: '🇴🇲', colors: ['#DB161B', '#FFFFFF', '#008000'] },
  { city: 'Manama', tz: 'Asia/Bahrain', flag: '🇧🇭', colors: ['#CE1126', '#FFFFFF', '#CE1126'] },
  { city: 'Amman', tz: 'Asia/Amman', flag: '🇯🇴', colors: ['#000000', '#007A33', '#CE1126'] },
  { city: 'Beirut', tz: 'Asia/Beirut', flag: '🇱🇧', colors: ['#ED1C24', '#00A651', '#FFFFFF'] },
  { city: 'Baghdad', tz: 'Asia/Baghdad', flag: '🇮🇶', colors: ['#CE1126', '#FFFFFF', '#007A33'] },
  { city: 'Tehran', tz: 'Asia/Tehran', flag: '🇮🇷', colors: ['#239F40', '#FFFFFF', '#DA0000'] },
  { city: 'Sanaa', tz: 'Asia/Aden', flag: '🇾🇪', colors: ['#CE1126', '#FFFFFF', '#000000'] },
  // ─── South Asia ─────────────────────────────────────────────
  { city: 'Mumbai', tz: 'Asia/Kolkata', flag: '🇮🇳', colors: ['#FF9933', '#138808', '#FFFFFF'] },
  { city: 'Delhi', tz: 'Asia/Kolkata', flag: '🇮🇳', colors: ['#FF9933', '#138808', '#FFFFFF'] },
  { city: 'Bangalore', tz: 'Asia/Kolkata', flag: '🇮🇳', colors: ['#FF9933', '#138808', '#FFFFFF'] },
  { city: 'Kolkata', tz: 'Asia/Kolkata', flag: '🇮🇳', colors: ['#FF9933', '#138808', '#FFFFFF'] },
  { city: 'Karachi', tz: 'Asia/Karachi', flag: '🇵🇰', colors: ['#01411C', '#FFFFFF', '#01411C'] },
  { city: 'Lahore', tz: 'Asia/Karachi', flag: '🇵🇰', colors: ['#01411C', '#FFFFFF', '#01411C'] },
  { city: 'Dhaka', tz: 'Asia/Dhaka', flag: '🇧🇩', colors: ['#006A4E', '#F42A41', '#006A4E'] },
  { city: 'Colombo', tz: 'Asia/Colombo', flag: '🇱🇰', colors: ['#8D153A', '#FCBE24', '#005641'] },
  { city: 'Kathmandu', tz: 'Asia/Kathmandu', flag: '🇳🇵', colors: ['#DC143C', '#003893', '#FFFFFF'] },
  { city: 'Kabul', tz: 'Asia/Kabul', flag: '🇦🇫', colors: ['#000000', '#D32011', '#007A36'] },
  { city: 'Malé', tz: 'Indian/Maldives', flag: '🇲🇻', colors: ['#D21034', '#007E3A', '#FFFFFF'] },
  { city: 'Thimphu', tz: 'Asia/Thimphu', flag: '🇧🇹', colors: ['#FFD520', '#FF4E12', '#FFFFFF'] },
  // ─── Central Asia ───────────────────────────────────────────
  { city: 'Almaty', tz: 'Asia/Almaty', flag: '🇰🇿', colors: ['#00AFCA', '#FEC50C', '#00AFCA'] },
  { city: 'Tashkent', tz: 'Asia/Tashkent', flag: '🇺🇿', colors: ['#0099B5', '#CE1126', '#1EB53A'] },
  { city: 'Bishkek', tz: 'Asia/Bishkek', flag: '🇰🇬', colors: ['#E8112D', '#FFEF00', '#E8112D'] },
  { city: 'Dushanbe', tz: 'Asia/Dushanbe', flag: '🇹🇯', colors: ['#006600', '#CC0000', '#FFFFFF'] },
  { city: 'Ashgabat', tz: 'Asia/Ashgabat', flag: '🇹🇲', colors: ['#00843D', '#FFFFFF', '#CC0000'] },
  // ─── East Asia ──────────────────────────────────────────────
  { city: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵', colors: ['#BC002D', '#FFFFFF', '#BC002D'] },
  { city: 'Osaka', tz: 'Asia/Tokyo', flag: '🇯🇵', colors: ['#BC002D', '#FFFFFF', '#BC002D'] },
  { city: 'Shanghai', tz: 'Asia/Shanghai', flag: '🇨🇳', colors: ['#DE2910', '#FFDE00', '#DE2910'] },
  { city: 'Beijing', tz: 'Asia/Shanghai', flag: '🇨🇳', colors: ['#DE2910', '#FFDE00', '#DE2910'] },
  { city: 'Hong Kong', tz: 'Asia/Hong_Kong', flag: '🇭🇰', colors: ['#DE2910', '#FFFFFF', '#DE2910'] },
  { city: 'Seoul', tz: 'Asia/Seoul', flag: '🇰🇷', colors: ['#003478', '#CD2E3A', '#FFFFFF'] },
  { city: 'Taipei', tz: 'Asia/Taipei', flag: '🇹🇼', colors: ['#FE0000', '#000095', '#FFFFFF'] },
  { city: 'Ulaanbaatar', tz: 'Asia/Ulaanbaatar', flag: '🇲🇳', colors: ['#003DA5', '#CE1126', '#003DA5'] },
  { city: 'Pyongyang', tz: 'Asia/Pyongyang', flag: '🇰🇵', colors: ['#024FA2', '#ED1C27', '#FFFFFF'] },
  // ─── Southeast Asia ─────────────────────────────────────────
  { city: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬', colors: ['#ED2939', '#FFFFFF', '#ED2939'] },
  { city: 'Bangkok', tz: 'Asia/Bangkok', flag: '🇹🇭', colors: ['#A51931', '#FFFFFF', '#2D2A4A'] },
  { city: 'Ho Chi Minh City', tz: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', colors: ['#DA251D', '#FFCD00', '#DA251D'] },
  { city: 'Jakarta', tz: 'Asia/Jakarta', flag: '🇮🇩', colors: ['#FF0000', '#FFFFFF', '#FF0000'] },
  { city: 'Bali', tz: 'Asia/Makassar', flag: '🇮🇩', colors: ['#FF0000', '#FFFFFF', '#FF0000'] },
  { city: 'Manila', tz: 'Asia/Manila', flag: '🇵🇭', colors: ['#0038A8', '#CE1126', '#FCD116'] },
  { city: 'Kuala Lumpur', tz: 'Asia/Kuala_Lumpur', flag: '🇲🇾', colors: ['#010066', '#CC0001', '#FFCC00'] },
  { city: 'Yangon', tz: 'Asia/Yangon', flag: '🇲🇲', colors: ['#FECB00', '#34B233', '#EA2839'] },
  { city: 'Phnom Penh', tz: 'Asia/Phnom_Penh', flag: '🇰🇭', colors: ['#032EA1', '#E00025', '#032EA1'] },
  { city: 'Vientiane', tz: 'Asia/Vientiane', flag: '🇱🇦', colors: ['#002868', '#CE1126', '#FFFFFF'] },
  { city: 'Hanoi', tz: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', colors: ['#DA251D', '#FFCD00', '#DA251D'] },
  { city: 'Bandar Seri Begawan', tz: 'Asia/Brunei', flag: '🇧🇳', colors: ['#F7E017', '#000000', '#FFFFFF'] },
  { city: 'Dili', tz: 'Asia/Dili', flag: '🇹🇱', colors: ['#DC241F', '#000000', '#FFC726'] },
  // ─── Oceania ────────────────────────────────────────────────
  { city: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺', colors: ['#00008B', '#FFFFFF', '#FF0000'] },
  { city: 'Melbourne', tz: 'Australia/Melbourne', flag: '🇦🇺', colors: ['#00008B', '#FFFFFF', '#FF0000'] },
  { city: 'Perth', tz: 'Australia/Perth', flag: '🇦🇺', colors: ['#00008B', '#FFFFFF', '#FF0000'] },
  { city: 'Auckland', tz: 'Pacific/Auckland', flag: '🇳🇿', colors: ['#00247D', '#CC142B', '#FFFFFF'] },
  { city: 'Suva', tz: 'Pacific/Fiji', flag: '🇫🇯', colors: ['#68BFE5', '#002868', '#CE1126'] },
  { city: 'Port Moresby', tz: 'Pacific/Port_Moresby', flag: '🇵🇬', colors: ['#000000', '#CE1126', '#FCD116'] },
  { city: 'Apia', tz: 'Pacific/Apia', flag: '🇼🇸', colors: ['#002B7F', '#CE1126', '#FFFFFF'] },
  { city: "Nuku'alofa", tz: 'Pacific/Tongatapu', flag: '🇹🇴', colors: ['#C10000', '#FFFFFF', '#C10000'] },
  { city: 'Honiara', tz: 'Pacific/Guadalcanal', flag: '🇸🇧', colors: ['#0051A5', '#008000', '#FCD116'] },
  { city: 'Port Vila', tz: 'Pacific/Efate', flag: '🇻🇺', colors: ['#009543', '#D21034', '#000000'] },
  { city: 'Tarawa', tz: 'Pacific/Tarawa', flag: '🇰🇮', colors: ['#CE1126', '#003F87', '#FCD116'] },
  { city: 'Majuro', tz: 'Pacific/Majuro', flag: '🇲🇭', colors: ['#003893', '#FFFFFF', '#DD7500'] },
  { city: 'Noumea', tz: 'Pacific/Noumea', flag: '🇳🇨', colors: ['#009543', '#CE1126', '#003DA5'] },
  { city: 'Pago Pago', tz: 'Pacific/Pago_Pago', flag: '🇦🇸', colors: ['#003478', '#D52B1E', '#FFFFFF'] },
];

// ─── City to Country mapping (for search by country name) ───
const CITY_COUNTRY: Record<string, string> = {
  // Americas
  'New York': 'United States', 'Los Angeles': 'United States', 'Chicago': 'United States', 'Anchorage': 'United States',
  'Honolulu': 'United States', 'Denver': 'United States',
  'Toronto': 'Canada', 'Vancouver': 'Canada',
  'Mexico City': 'Mexico', 'São Paulo': 'Brazil', 'Rio de Janeiro': 'Brazil',
  'Buenos Aires': 'Argentina', 'Bogotá': 'Colombia', 'Santiago': 'Chile', 'Lima': 'Peru',
  'Havana': 'Cuba', 'Kingston': 'Jamaica', 'Panama City': 'Panama', 'San José': 'Costa Rica',
  'Quito': 'Ecuador', 'Caracas': 'Venezuela', 'Montevideo': 'Uruguay', 'Asunción': 'Paraguay',
  'La Paz': 'Bolivia', 'Santo Domingo': 'Dominican Republic', 'Guatemala City': 'Guatemala',
  'Tegucigalpa': 'Honduras', 'San Salvador': 'El Salvador', 'Managua': 'Nicaragua',
  'Port-au-Prince': 'Haiti', 'Port of Spain': 'Trinidad and Tobago', 'Nassau': 'Bahamas',
  'Bridgetown': 'Barbados', 'Paramaribo': 'Suriname', 'Georgetown': 'Guyana', 'Belmopan': 'Belize',
  // Europe
  'London': 'United Kingdom', 'Paris': 'France', 'Berlin': 'Germany', 'Madrid': 'Spain',
  'Rome': 'Italy', 'Amsterdam': 'Netherlands', 'Brussels': 'Belgium', 'Zurich': 'Switzerland',
  'Vienna': 'Austria', 'Stockholm': 'Sweden', 'Oslo': 'Norway', 'Copenhagen': 'Denmark',
  'Helsinki': 'Finland', 'Warsaw': 'Poland', 'Prague': 'Czech Republic', 'Lisbon': 'Portugal',
  'Athens': 'Greece', 'Dublin': 'Ireland', 'Budapest': 'Hungary', 'Bucharest': 'Romania',
  'Sofia': 'Bulgaria', 'Zagreb': 'Croatia', 'Belgrade': 'Serbia', 'Kyiv': 'Ukraine',
  'Moscow': 'Russia', 'Novosibirsk': 'Russia', 'Reykjavik': 'Iceland', 'Istanbul': 'Turkey',
  'Bratislava': 'Slovakia', 'Ljubljana': 'Slovenia', 'Tallinn': 'Estonia', 'Riga': 'Latvia',
  'Vilnius': 'Lithuania', 'Tbilisi': 'Georgia', 'Yerevan': 'Armenia', 'Baku': 'Azerbaijan',
  'Chisinau': 'Moldova', 'Tirana': 'Albania', 'Skopje': 'North Macedonia', 'Podgorica': 'Montenegro',
  'Sarajevo': 'Bosnia and Herzegovina', 'Luxembourg': 'Luxembourg', 'Valletta': 'Malta',
  'Nicosia': 'Cyprus', 'Monaco': 'Monaco', 'Andorra la Vella': 'Andorra',
  // Africa
  'Cairo': 'Egypt', 'Lagos': 'Nigeria', 'Johannesburg': 'South Africa', 'Cape Town': 'South Africa',
  'Nairobi': 'Kenya', 'Casablanca': 'Morocco', 'Addis Ababa': 'Ethiopia', 'Accra': 'Ghana',
  'Dar es Salaam': 'Tanzania', 'Algiers': 'Algeria', 'Tunis': 'Tunisia', 'Dakar': 'Senegal',
  'Kinshasa': 'DR Congo', 'Abidjan': 'Ivory Coast', 'Douala': 'Cameroon', 'Kampala': 'Uganda',
  'Harare': 'Zimbabwe', 'Luanda': 'Angola', 'Maputo': 'Mozambique', 'Lusaka': 'Zambia',
  'Antananarivo': 'Madagascar', 'Kigali': 'Rwanda', 'Tripoli': 'Libya', 'Windhoek': 'Namibia',
  'Gaborone': 'Botswana', 'Bamako': 'Mali', 'Nouakchott': 'Mauritania',
  // Middle East
  'Dubai': 'UAE', 'Riyadh': 'Saudi Arabia', 'Tel Aviv': 'Israel', 'Doha': 'Qatar',
  'Kuwait City': 'Kuwait', 'Muscat': 'Oman', 'Manama': 'Bahrain', 'Amman': 'Jordan',
  'Beirut': 'Lebanon', 'Baghdad': 'Iraq', 'Tehran': 'Iran', 'Sanaa': 'Yemen',
  // South Asia
  'Mumbai': 'India', 'Delhi': 'India', 'Bangalore': 'India', 'Kolkata': 'India',
  'Karachi': 'Pakistan', 'Lahore': 'Pakistan', 'Dhaka': 'Bangladesh', 'Colombo': 'Sri Lanka',
  'Kathmandu': 'Nepal', 'Kabul': 'Afghanistan', 'Malé': 'Maldives', 'Thimphu': 'Bhutan',
  // Central Asia
  'Almaty': 'Kazakhstan', 'Tashkent': 'Uzbekistan', 'Bishkek': 'Kyrgyzstan',
  'Dushanbe': 'Tajikistan', 'Ashgabat': 'Turkmenistan',
  // East Asia
  'Tokyo': 'Japan', 'Osaka': 'Japan', 'Shanghai': 'China', 'Beijing': 'China',
  'Hong Kong': 'China', 'Seoul': 'South Korea', 'Taipei': 'Taiwan',
  'Ulaanbaatar': 'Mongolia', 'Pyongyang': 'North Korea',
  // Southeast Asia
  'Singapore': 'Singapore', 'Bangkok': 'Thailand', 'Ho Chi Minh City': 'Vietnam',
  'Jakarta': 'Indonesia', 'Bali': 'Indonesia', 'Manila': 'Philippines',
  'Kuala Lumpur': 'Malaysia', 'Yangon': 'Myanmar', 'Phnom Penh': 'Cambodia',
  'Vientiane': 'Laos', 'Hanoi': 'Vietnam', 'Bandar Seri Begawan': 'Brunei',
  'Dili': 'Timor-Leste',
  // Oceania
  'Sydney': 'Australia', 'Melbourne': 'Australia', 'Perth': 'Australia',
  'Auckland': 'New Zealand', 'Suva': 'Fiji', 'Port Moresby': 'Papua New Guinea',
  'Apia': 'Samoa', "Nuku'alofa": 'Tonga', 'Honiara': 'Solomon Islands',
  'Port Vila': 'Vanuatu', 'Tarawa': 'Kiribati', 'Majuro': 'Marshall Islands',
  'Noumea': 'New Caledonia', 'Pago Pago': 'American Samoa',
};

const DEFAULT_WORLD_CLOCK_CITIES = [
  'London', 'Paris', 'Dubai', 'Mumbai', 'Singapore',
  'Shanghai', 'Tokyo', 'Sydney', 'New York', 'Moscow',
];

function getUtcOffsetHours(tz: string): number {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(now);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    if (!offsetPart) return 0;
    const val = offsetPart.value; // e.g. "GMT+5:30" or "GMT-8" or "GMT"
    if (val === 'GMT' || val === 'UTC') return 0;
    const match = val.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours + minutes / 60);
  } catch {
    return 0;
  }
}

function formatOffset(homeTz: string, targetTz: string): string {
  const homeOff = getUtcOffsetHours(homeTz);
  const targetOff = getUtcOffsetHours(targetTz);
  const diff = targetOff - homeOff;
  if (diff === 0) return 'Same';
  const sign = diff > 0 ? '+' : '-';
  const abs = Math.abs(diff);
  if (abs === Math.floor(abs)) return `${sign}${abs}h`;
  return `${sign}${abs}h`;
}

// ─── Location presets ───────────────────────────────────────
const LOCATION_PRESETS = [
  { label: 'San Jose', tz: 'America/Los_Angeles' },
  { label: 'New York', tz: 'America/New_York' },
  { label: 'London', tz: 'Europe/London' },
  { label: 'Paris', tz: 'Europe/Paris' },
  { label: 'Dubai', tz: 'Asia/Dubai' },
  { label: 'Mumbai', tz: 'Asia/Kolkata' },
  { label: 'Tokyo', tz: 'Asia/Tokyo' },
  { label: 'Sydney', tz: 'Australia/Sydney' },
  { label: 'Singapore', tz: 'Asia/Singapore' },
  { label: 'Berlin', tz: 'Europe/Berlin' },
  { label: 'Toronto', tz: 'America/Toronto' },
  { label: 'Seoul', tz: 'Asia/Seoul' },
];

// ─── Helper: format time for a timezone ──────────────────────
function formatTime(tz: string, withSeconds = true): string {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {}),
      hour12: true,
    });
  } catch {
    return '--:--:--';
  }
}

function formatDate(tz: string): string {
  try {
    return new Date().toLocaleDateString('en-US', {
      timeZone: tz,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function getTzAbbr(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date());
    const found = parts.find((p) => p.type === 'timeZoneName');
    return found?.value || '';
  } catch {
    return '';
  }
}

// ─── Sunrise / Sunset approximation ─────────────────────────
function getSunTimes(month: number) {
  const sunriseH = [7.2, 6.8, 6.2, 5.5, 5.2, 5.0, 5.1, 5.5, 6.0, 6.5, 7.0, 7.3];
  const sunsetH = [16.8, 17.5, 18.2, 19.0, 19.8, 20.5, 20.5, 19.8, 18.8, 17.8, 16.8, 16.5];
  const rH = sunriseH[month];
  const sH = sunsetH[month];
  const fmtDecimal = (h: number) => {
    const hr = Math.floor(h);
    const mn = Math.round((h - hr) * 60);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const hh = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
    return `${hh}:${mn.toString().padStart(2, '0')} ${ampm}`;
  };
  const daylightMins = Math.round((sH - rH) * 60);
  const dlH = Math.floor(daylightMins / 60);
  const dlM = daylightMins % 60;
  return {
    sunrise: fmtDecimal(rH),
    sunset: fmtDecimal(sH),
    daylight: `${dlH}h ${dlM}m`,
  };
}

// ─── Moon phase calculation ──────────────────────────────────
// Known new moon: January 29, 2026
const KNOWN_NEW_MOON = new Date(2026, 0, 29).getTime();
const SYNODIC_PERIOD = 29.53058867;

function getMoonPhase(date: Date) {
  const daysSince = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const cycle = ((daysSince % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD;
  const daysToFull = ((14.765 - cycle + SYNODIC_PERIOD) % SYNODIC_PERIOD);
  const daysToNew = ((SYNODIC_PERIOD - cycle) % SYNODIC_PERIOD) || SYNODIC_PERIOD;

  let phase: string;
  let emoji: string;
  if (cycle < 1.85) { phase = 'New Moon'; emoji = '\u{1F311}'; }
  else if (cycle < 7.38) { phase = 'Waxing Crescent'; emoji = '\u{1F312}'; }
  else if (cycle < 9.23) { phase = 'First Quarter'; emoji = '\u{1F313}'; }
  else if (cycle < 14.765) { phase = 'Waxing Gibbous'; emoji = '\u{1F314}'; }
  else if (cycle < 16.615) { phase = 'Full Moon'; emoji = '\u{1F315}'; }
  else if (cycle < 22.15) { phase = 'Waning Gibbous'; emoji = '\u{1F316}'; }
  else if (cycle < 24.0) { phase = 'Last Quarter'; emoji = '\u{1F317}'; }
  else if (cycle < 27.68) { phase = 'Waning Crescent'; emoji = '\u{1F318}'; }
  else { phase = 'New Moon'; emoji = '\u{1F311}'; }

  return {
    phase,
    emoji,
    daysToFull: Math.round(daysToFull),
    daysToNew: Math.round(daysToNew),
  };
}

// ─── Days Until calculations ─────────────────────────────────
function getNextSaturday(now: Date): number {
  const day = now.getDay();
  const diff = (6 - day + 7) % 7 || 7;
  return diff;
}

function getNextFullMoon(now: Date): number {
  const moon = getMoonPhase(now);
  return moon.daysToFull === 0 ? 0 : moon.daysToFull;
}

function daysUntilDate(now: Date, month: number, day: number): number {
  let target = new Date(now.getFullYear(), month, day);
  if (target.getTime() < now.getTime()) {
    // Check if it's today
    if (target.toDateString() === now.toDateString()) return 0;
    target = new Date(now.getFullYear() + 1, month, day);
  }
  return Math.ceil((target.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
}

function getThanksgiving(year: number): Date {
  // 4th Thursday of November
  const nov1 = new Date(year, 10, 1);
  const dayOfWeek = nov1.getDay();
  const firstThurs = dayOfWeek <= 4 ? 1 + (4 - dayOfWeek) : 1 + (11 - dayOfWeek);
  return new Date(year, 10, firstThurs + 21);
}

function daysUntilThanksgiving(now: Date): number {
  let tg = getThanksgiving(now.getFullYear());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (tg.toDateString() === today.toDateString()) return 0;
  if (tg.getTime() < today.getTime()) {
    tg = getThanksgiving(now.getFullYear() + 1);
  }
  return Math.ceil((tg.getTime() - today.getTime()) / 86400000);
}

// ─── Timezone pairs for live conversions ─────────────────────
const TZ_PAIRS = [
  { a: 'New York', tzA: 'America/New_York', abbrA: 'EST', b: 'Los Angeles', tzB: 'America/Los_Angeles', abbrB: 'PST' },
  { a: 'New York', tzA: 'America/New_York', abbrA: 'EST', b: 'London', tzB: 'Europe/London', abbrB: 'GMT' },
  { a: 'New York', tzA: 'America/New_York', abbrA: 'EST', b: 'Mumbai', tzB: 'Asia/Kolkata', abbrB: 'IST' },
  { a: 'London', tzA: 'Europe/London', abbrA: 'GMT', b: 'Tokyo', tzB: 'Asia/Tokyo', abbrB: 'JST' },
  { a: 'Los Angeles', tzA: 'America/Los_Angeles', abbrA: 'PST', b: 'London', tzB: 'Europe/London', abbrB: 'GMT' },
  { a: 'Sydney', tzA: 'Australia/Sydney', abbrA: 'AEST', b: 'New York', tzB: 'America/New_York', abbrB: 'EST' },
];

// ─── Common timezone list for converter ──────────────────────
const COMMON_TIMEZONES = [
  { label: 'New York (EST)', tz: 'America/New_York' },
  { label: 'Chicago (CST)', tz: 'America/Chicago' },
  { label: 'Denver (MST)', tz: 'America/Denver' },
  { label: 'Los Angeles (PST)', tz: 'America/Los_Angeles' },
  { label: 'London (GMT)', tz: 'Europe/London' },
  { label: 'Paris (CET)', tz: 'Europe/Paris' },
  { label: 'Berlin (CET)', tz: 'Europe/Berlin' },
  { label: 'Moscow (MSK)', tz: 'Europe/Moscow' },
  { label: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { label: 'Mumbai (IST)', tz: 'Asia/Kolkata' },
  { label: 'Singapore (SGT)', tz: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', tz: 'Australia/Sydney' },
  { label: 'Auckland (NZST)', tz: 'Pacific/Auckland' },
  { label: 'Honolulu (HST)', tz: 'Pacific/Honolulu' },
];

// ─── Space News Component (fetches live from API) ───────────
function MarsSpaceNews() {
  const [articles, setArticles] = useState<Array<{ id: number; title: string; url: string; image_url: string; news_site: string; summary: string; published_at: string }>>([]);

  useEffect(() => {
    fetch('/api/news?limit=3')
      .then(r => r.json())
      .then(data => {
        if (data.results) setArticles(data.results.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (articles.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Space News
        </h3>
        <Link href="/news" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          All news <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-40 bg-gray-100 overflow-hidden">
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Rocket className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {article.title}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-500">{article.news_site}</span>
                <span className="text-[10px] text-gray-400">{timeAgo(article.published_at)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Meeting Planner Cities ─────────────────────────────────
const MEETING_CITIES = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Mumbai', tz: 'Asia/Kolkata' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Singapore', tz: 'Asia/Singapore' },
  { name: 'Shanghai', tz: 'Asia/Shanghai' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Moscow', tz: 'Europe/Moscow' },
];

function getHourInTz(tz: string, utcHour: number): number {
  const d = new Date();
  d.setUTCHours(utcHour, 0, 0, 0);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).formatToParts(d);
  const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  return h === 24 ? 0 : h;
}

function hourColor(hour: number): string {
  if (hour >= 9 && hour < 18) return 'bg-green-100 text-green-800 font-medium';
  if (hour >= 7 && hour < 9) return 'bg-yellow-50 text-yellow-700';
  if (hour >= 18 && hour < 21) return 'bg-yellow-50 text-yellow-700';
  return 'bg-red-50 text-red-400';
}

function formatHr(h: number): string {
  const hour = ((h % 24) + 24) % 24;
  if (hour === 0) return '12a';
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return '12p';
  return `${hour - 12}p`;
}

function MarsMeetingPlanner({ userTz }: { userTz: string }) {
  const [selectedCityNames, setSelectedCityNames] = useState<string[]>(() => {
    // Pick 3 defaults that aren't the user's timezone
    const defaults = ['New York', 'London', 'Mumbai', 'Tokyo', 'Singapore'];
    return defaults.filter(n => {
      const c = MEETING_CITIES.find(mc => mc.name === n);
      return c && c.tz !== userTz;
    }).slice(0, 3);
  });

  const homeName = userTz.split('/').pop()?.replace(/_/g, ' ') || 'Home';

  // Build city list: home ALWAYS first, then selected sorted by UTC offset
  const otherCities = selectedCityNames
    .map(n => MEETING_CITIES.find(c => c.name === n))
    .filter((c): c is typeof MEETING_CITIES[0] => !!c && c.tz !== userTz)
    .map(c => ({ ...c, isHome: false }))
    .sort((a, b) => getHourInTz(a.tz, 0) - getHourInTz(b.tz, 0));

  const allCities = [
    { name: `${homeName} (You)`, tz: userTz, isHome: true },
    ...otherCities,
  ];


  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* City selector */}
      <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Compare with:</span>
        {MEETING_CITIES.map(c => (
          <button
            key={c.name}
            onClick={() => {
              if (selectedCityNames.includes(c.name)) {
                setSelectedCityNames(prev => prev.filter(n => n !== c.name));
              } else if (selectedCityNames.length < 5) {
                setSelectedCityNames(prev => [...prev, c.name]);
              }
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              selectedCityNames.includes(c.name)
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-200"></span> Business hours (9am-6pm)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200"></span> Early/Late</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 border border-red-200"></span> Night</span>
      </div>

      {/* 24-hour grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-3 py-2 text-xs font-semibold text-gray-700 sticky left-0 bg-white min-w-[120px]">City</th>
              {Array.from({ length: 24 }).map((_, i) => (
                <th key={i} className="px-0.5 py-2 text-center text-gray-400 font-normal min-w-[32px]">{formatHr(i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allCities.map((city) => (
              <tr key={city.tz + city.name} className={`border-b border-gray-50 ${city.isHome ? 'bg-blue-50/30' : ''}`}>
                <td className={`px-3 py-1.5 text-xs font-medium sticky left-0 bg-white ${city.isHome ? 'text-blue-700 bg-blue-50/30' : 'text-gray-700'}`}>
                  {city.name}
                </td>
                {Array.from({ length: 24 }).map((_, utcH) => {
                  const localH = getHourInTz(city.tz, utcH);
                  return (
                    <td key={utcH} className={`px-0.5 py-1.5 text-center text-[9px] tabular-nums ${hourColor(localH)}`}>
                      {formatHr(localH)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function MarsHome() {
  const [userTz, setUserTz] = useState<string>('America/New_York');
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Inline calculator states
  const [birthday, setBirthday] = useState('');
  const [ageResult, setAgeResult] = useState<string | null>(null);
  const [dateDiffFrom, setDateDiffFrom] = useState('');
  const [dateDiffTo, setDateDiffTo] = useState('');
  const [dateDiffResult, setDateDiffResult] = useState<string | null>(null);
  const [convFrom, setConvFrom] = useState('America/New_York');
  const [convTo, setConvTo] = useState('Europe/London');

  // World clock
  const [selectedCities, setSelectedCities] = useState<string[]>(DEFAULT_WORLD_CLOCK_CITIES);
  const [editMode, setEditMode] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [clockStyle, setClockStyle] = useState<'square' | 'circle'>('circle');

  // Weather & location
  const [weather, setWeather] = useState<{ temp: number; desc: string; humidity: number; wind: number } | null>(null);
  const [cityName, setCityName] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [heroFact, setHeroFact] = useState('');

  useEffect(() => {
    const override = typeof window !== 'undefined' ? localStorage.getItem('dateandtimezone_tz_override') : null;
    const tz = override || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    setUserTz(tz);
    setMounted(true);
    setHeroFact(HERO_FACTS[Math.floor(Math.random() * HERO_FACTS.length)]);

    // Load saved world clock cities
    try {
      const saved = localStorage.getItem('dateandtimezone_home_clocks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedCities(parsed);
        }
      }
    } catch { /* ignore */ }

    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch weather
  useEffect(() => {
    const preset = LOCATION_PRESETS.find(l => l.tz === userTz);
    const city = preset?.label || userTz.split('/').pop()?.replace(/_/g, ' ') || 'London';
    setCityName(city);
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
      .then(r => r.json())
      .then(data => {
        const c = data.current_condition[0];
        setWeather({
          temp: parseInt(c.temp_C),
          desc: c.weatherDesc[0].value,
          humidity: parseInt(c.humidity),
          wind: parseInt(c.windspeedKmph),
        });
      })
      .catch(() => {});
  }, [userTz]);

  const getWeatherEmoji = (d: string) => {
    const desc = d.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud') || desc.includes('overcast')) return '☁️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const changeLocation = (newTz: string) => {
    localStorage.setItem('dateandtimezone_tz_override', newTz);
    setLocationOpen(false);
    window.location.reload();
  };

  // Age calculator
  const calcAge = useCallback(() => {
    if (!birthday) return;
    const bd = new Date(birthday + 'T00:00:00');
    const now = new Date();
    if (isNaN(bd.getTime()) || bd > now) { setAgeResult('Please enter a valid past date.'); return; }
    let years = now.getFullYear() - bd.getFullYear();
    let months = now.getMonth() - bd.getMonth();
    let days = now.getDate() - bd.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - bd.getTime()) / 86400000);
    setAgeResult(`${years} years, ${months} months, ${days} days old (${totalDays.toLocaleString()} days alive)`);
  }, [birthday]);

  // Date difference calculator
  const calcDateDiff = useCallback(() => {
    if (!dateDiffFrom || !dateDiffTo) return;
    const d1 = new Date(dateDiffFrom + 'T00:00:00');
    const d2 = new Date(dateDiffTo + 'T00:00:00');
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setDateDiffResult('Please enter valid dates.'); return; }
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffMs / 86400000);
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;
    let yrs = end.getFullYear() - start.getFullYear();
    let mos = end.getMonth() - start.getMonth();
    let dys = end.getDate() - start.getDate();
    if (dys < 0) { mos--; dys += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
    if (mos < 0) { yrs--; mos += 12; }
    setDateDiffResult(`${totalDays.toLocaleString()} days (${yrs} years, ${mos} months, ${dys} days)`);
  }, [dateDiffFrom, dateDiffTo]);

  // Derived values (recalculated each tick)
  const now = new Date();
  const month = now.getMonth();
  const sunTimes = getSunTimes(month);
  const moonData = getMoonPhase(now);
  const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0;
  const totalDaysInYear = isLeap ? 366 : 365;
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / 86400000);
  const startOfWeekYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - startOfWeekYear.getTime()) / 86400000 + startOfWeekYear.getDay() + 1) / 7);

  // Countdowns
  const countdowns = [
    { emoji: '\u{1F389}', label: 'Next Weekend', days: getNextSaturday(now) },
    { emoji: '\u{1F315}', label: 'Next Full Moon', days: getNextFullMoon(now) },
    { emoji: '\u{1F1FA}\u{1F1F8}', label: 'Independence Day', days: daysUntilDate(now, 6, 4) },
    { emoji: '\u{1F383}', label: 'Halloween', days: daysUntilDate(now, 9, 31) },
    { emoji: '\u{1F983}', label: 'Thanksgiving', days: daysUntilThanksgiving(now) },
    { emoji: '\u{1F384}', label: 'Christmas', days: daysUntilDate(now, 11, 25) },
    { emoji: '\u{1F386}', label: 'New Year', days: daysUntilDate(now, 0, 1) },
    { emoji: '\u{1F495}', label: "Valentine's Day", days: daysUntilDate(now, 1, 14) },
  ];

  // Suppress hydration with mounted check
  void tick;

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══ ROW 1: Hero — Your Time Right Now ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#1B2838]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-blue-500/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-2 sm:py-3 sm:px-6 lg:px-8 text-center">
          {/* Big Digital Clock */}
          <p className="font-mono text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white tabular-nums leading-none">
            {formatTime(userTz)}
          </p>
          <p className="text-gray-300 mt-1.5 text-sm sm:text-base">{formatDate(userTz)}</p>

          {/* Location + Weather Row */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm">
            {/* Location picker */}
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors rounded-lg px-3 py-1.5 border border-gray-700 hover:border-gray-500"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{cityName || userTz.split('/').pop()?.replace(/_/g, ' ')}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
              </button>
              {locationOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl border border-gray-700 bg-[#0F172A] shadow-2xl py-2 z-[100]">
                  {LOCATION_PRESETS.map(loc => (
                    <button
                      key={loc.tz}
                      onClick={() => changeLocation(loc.tz)}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-800 transition-colors ${loc.tz === userTz ? 'text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'}`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-600">·</span>
            <span className="text-gray-400">Week {weekNumber} of 52</span>

            {/* Weather */}
            {weather && (
              <>
                <span className="text-gray-600">·</span>
                <span className="flex items-center gap-2 rounded-lg px-3 py-1.5 border border-gray-700 bg-gray-800/40">
                  <span className="text-lg">{getWeatherEmoji(weather.desc)}</span>
                  <span className="font-bold text-white">{weather.temp}°C</span>
                  <span className="text-xs text-gray-400 capitalize hidden sm:inline">{weather.desc}</span>
                </span>
              </>
            )}
          </div>

          {/* Sunrise / Sunset / Daylight / Moon */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Sunrise className="w-4 h-4 text-amber-400" />
              Sunrise {sunTimes.sunrise}
            </span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1">
              <Sunset className="w-4 h-4 text-orange-400" />
              Sunset {sunTimes.sunset}
            </span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1">
              <Sun className="w-4 h-4 text-yellow-400" />
              Daylight {sunTimes.daylight}
            </span>
            <span className="text-gray-600">|</span>
            <span>
              Moon: {moonData.emoji} {moonData.phase}
            </span>
          </div>

          {/* Did You Know */}
          {heroFact && (
            <div className="mt-3 mx-auto max-w-2xl rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-rose-500/20 border border-amber-500/40 px-4 py-2">
              <p className="text-sm leading-relaxed" style={{ color: '#F1F5F9' }}>
                <span className="font-bold mr-2" style={{ color: '#FCD34D' }}>🤯 Did you know?</span>
                {heroFact}
              </p>
            </div>
          )}

          {/* ── World Clock (no title, compact controls) ──── */}
          <div className="mt-4">
            {/* Clock row — center aligned, same layout as dark theme */}
            <div className="flex items-end justify-center gap-1 sm:gap-2 flex-wrap">
              {/* Home clock */}
              <div className="flex flex-col items-center w-[11%] sm:w-auto">
                {clockStyle === 'circle' ? (
                  <MarsAnalogClock timezone={userTz} colors={['#0EA5E9', '#F59E0B', '#FFFFFF']} size={95} />
                ) : (
                  <div className="w-[95px] h-[95px] rounded-xl bg-white/10 border border-cyan-500/30 flex flex-col items-center justify-center">
                    <span className="text-2xl">📍</span>
                    <span className="font-mono text-xs font-bold text-white tabular-nums mt-1">
                      {formatTime(userTz)}
                    </span>
                  </div>
                )}
                <span className="text-[10px] mt-1 text-primary font-bold">{cityName || userTz.split('/').pop()?.replace(/_/g, ' ')} (You)</span>
                <MarsMiniDigitalTime tz={userTz} />
                <span className="text-[9px] font-mono font-medium mt-0.5 text-emerald-400">Home</span>
              </div>

              {/* Selected city clocks — sorted by UTC offset */}
              {selectedCities
                .map(cn => WORLD_CLOCK_CITIES.find(c => c.city === cn))
                .filter((cd): cd is typeof WORLD_CLOCK_CITIES[0] => !!cd)
                .sort((a, b) => getUtcOffsetHours(a.tz) - getUtcOffsetHours(b.tz))
                .map((cd) => {
                const cn = cd.city;
                const offset = formatOffset(userTz, cd.tz);
                return (
                  <div key={cd.city} className="flex flex-col items-center w-[11%] sm:w-auto relative group">
                    {editMode && (
                      <button
                        onClick={() => {
                          const next = selectedCities.filter(c => c !== cn);
                          setSelectedCities(next);
                          localStorage.setItem('dateandtimezone_home_clocks', JSON.stringify(next));
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center z-10 opacity-80 hover:opacity-100"
                      >×</button>
                    )}
                    {clockStyle === 'circle' ? (
                      <MarsAnalogClock timezone={cd.tz} colors={cd.colors} size={95} />
                    ) : (
                      <div className="w-[95px] h-[95px] rounded-xl bg-white/5 border border-gray-700 flex flex-col items-center justify-center">
                        <span className="text-2xl">{cd.flag}</span>
                        <span className="font-mono text-xs font-bold text-white tabular-nums mt-1">
                          {formatTime(cd.tz)}
                        </span>
                      </div>
                    )}
                    <span className="text-[10px] mt-1 text-gray-400">{cd.city}</span>
                    <MarsMiniDigitalTime tz={cd.tz} />
                    <span className={`text-[9px] font-mono font-medium mt-0.5 ${offset.startsWith('+') ? 'text-amber-400' : offset.startsWith('-') ? 'text-sky-400' : 'text-emerald-400'}`}>{offset}</span>
                  </div>
                );
              })}
            </div>

            {/* Compact controls — one tiny line */}
            <div className="flex items-center justify-center gap-3 mt-2 text-[10px]">
              <button onClick={() => setClockStyle(clockStyle === 'circle' ? 'square' : 'circle')} className="text-gray-500 hover:text-white transition-colors">
                {clockStyle === 'circle' ? '▣ switch to square' : '⏱ switch to circle'}
              </button>
              <span className="text-gray-700">·</span>
              <button onClick={() => { setEditMode(!editMode); setCitySearch(''); }} className="text-gray-500 hover:text-white transition-colors">
                {editMode ? '✓ done' : '✏️ customize'}
              </button>
              <span className="text-gray-700">·</span>
              <Link href="/world-clock" className="text-cyan-500 hover:text-cyan-300 transition-colors">
                all cities →
              </Link>
            </div>

            {/* Edit mode panel */}
            {editMode && (
              <div className="mt-4 rounded-xl border border-gray-700 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    style={{ backgroundColor: '#0F172A', color: '#F1F5F9', borderColor: '#334155', border: '1px solid #334155' }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {WORLD_CLOCK_CITIES
                    .filter(c => !selectedCities.includes(c.city))
                    .filter(c => {
                      if (!citySearch) return true;
                      const q = citySearch.toLowerCase();
                      const country = CITY_COUNTRY[c.city] || '';
                      return c.city.toLowerCase().includes(q) || country.toLowerCase().includes(q);
                    })
                    .map(c => (
                      <button
                        key={c.city}
                        disabled={selectedCities.length >= 10}
                        onClick={() => {
                          const next = [...selectedCities, c.city];
                          setSelectedCities(next);
                          localStorage.setItem('dateandtimezone_home_clocks', JSON.stringify(next));
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 border border-gray-700 rounded-lg px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span>{c.flag}</span> {c.city}
                      </button>
                    ))}
                </div>
                {selectedCities.length >= 10 && (
                  <p className="text-xs text-gray-500 mt-2">Maximum of 10 cities reached. Remove one to add another.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ ROW 2: Most Searched Tools ══════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Most Popular Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { emoji: '\u{1F550}', title: 'World Clock', desc: 'Current time in cities worldwide', href: '/world-clock', border: 'border-l-blue-500' },
            { emoji: '\u{1F504}', title: 'Time Zone Converter', desc: 'Convert between any time zones', href: '/timezone-compare', border: 'border-l-purple-500' },
            { emoji: '\u{1F382}', title: 'Age Calculator', desc: 'Calculate your exact age', href: '/age-calculator', border: 'border-l-pink-500' },
            { emoji: '\u{1F4C5}', title: 'Date Calculator', desc: 'Days between any two dates', href: '/date-difference', border: 'border-l-green-500' },
            { emoji: '\u23F1\uFE0F', title: 'Countdown Timer', desc: 'Count down to any date', href: '/countdown', border: 'border-l-amber-500' },
            { emoji: '\u{1F305}', title: 'Sunrise & Sunset', desc: 'Sun times for your location', href: '/sunrise-sunset', border: 'border-l-orange-500' },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group bg-white rounded-lg border border-gray-200 border-l-4 ${tool.border} p-5 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="text-2xl mb-2">{tool.emoji}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ ROW 3: Quick Time Zone Conversions ══════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Popular Time Zone Conversions &mdash; Live</h2>
          <Link href="/timezone-compare" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            Convert any timezone <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TZ_PAIRS.map((pair, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{pair.a}</p>
                  <p className="font-mono text-lg font-bold text-gray-900 mt-1">{formatTime(pair.tzA, false)}</p>
                  <p className="text-xs text-gray-400">{getTzAbbr(pair.tzA)}</p>
                </div>
                <ArrowLeftRight className="w-5 h-5 text-gray-300 mx-2 shrink-0" />
                <div className="text-center flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{pair.b}</p>
                  <p className="font-mono text-lg font-bold text-gray-900 mt-1">{formatTime(pair.tzB, false)}</p>
                  <p className="text-xs text-gray-400">{getTzAbbr(pair.tzB)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ROW 3b: Meeting Planner ═══════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Meeting Planner</h2>
          <Link href="/meeting-planner" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            Full planner <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <MarsMeetingPlanner userTz={userTz} />
      </section>

      {/* ═══ ROW 4: How Many Days Until... ═══════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">How Many Days Until...</h2>
        <div className="flex flex-wrap gap-3">
          {countdowns.map((cd) => {
            const colors = [
              'bg-blue-50 text-blue-700 border-blue-200',
              'bg-purple-50 text-purple-700 border-purple-200',
              'bg-red-50 text-red-700 border-red-200',
              'bg-orange-50 text-orange-700 border-orange-200',
              'bg-amber-50 text-amber-700 border-amber-200',
              'bg-green-50 text-green-700 border-green-200',
              'bg-indigo-50 text-indigo-700 border-indigo-200',
              'bg-pink-50 text-pink-700 border-pink-200',
            ];
            const idx = countdowns.indexOf(cd);
            const colorClass = colors[idx % colors.length];
            return (
              <span
                key={cd.label}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border ${colorClass}`}
              >
                <span>{cd.emoji}</span>
                {cd.label}: {cd.days === 0 ? 'Today!' : `${cd.days} days`}
              </span>
            );
          })}
        </div>
      </section>

      {/* ═══ ROW 5: Today's Sky ══════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Today&apos;s Sky
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Sun */}
          <div className="bg-white rounded-lg border border-gray-200 border-t-4 border-t-amber-400 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Sun
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <Sunrise className="w-4 h-4 text-orange-400" /> Sunrise
                </span>
                <span className="font-semibold text-gray-900">{sunTimes.sunrise}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <Sunset className="w-4 h-4 text-rose-400" /> Sunset
                </span>
                <span className="font-semibold text-gray-900">{sunTimes.sunset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-yellow-500" /> Daylight
                </span>
                <span className="font-semibold text-gray-900">{sunTimes.daylight}</span>
              </div>
            </div>
          </div>

          {/* Moon */}
          <div className="bg-white rounded-lg border border-gray-200 border-t-4 border-t-purple-400 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-500" />
              Moon
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Phase</span>
                <span className="font-semibold text-gray-900">{moonData.emoji} {moonData.phase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Full Moon in</span>
                <span className="font-semibold text-gray-900">{moonData.daysToFull === 0 ? 'Today!' : `${moonData.daysToFull} days`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Moon in</span>
                <span className="font-semibold text-gray-900">{moonData.daysToNew === 0 ? 'Today!' : `${moonData.daysToNew} days`}</span>
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="bg-white rounded-lg border border-gray-200 border-t-4 border-t-blue-400 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              Quick Facts
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Day of Year</span>
                <span className="font-semibold text-gray-900">{dayOfYear} of {totalDaysInYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Week Number</span>
                <span className="font-semibold text-gray-900">{weekNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days Left in Year</span>
                <span className="font-semibold text-gray-900">{totalDaysInYear - dayOfYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leap Year?</span>
                <span className="font-semibold text-gray-900">{isLeap ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ROW 6: Inline Calculators ═══════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-green-600" />
          Quick Calculators &mdash; Get Answers Instantly
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Age Calculator */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">&#x1F382;</span> Age Calculator
            </h3>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={calcAge}
              className="mt-3 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate Age
            </button>
            {ageResult && (
              <p className="mt-3 text-sm text-gray-700 bg-blue-50 rounded-md px-3 py-2">{ageResult}</p>
            )}
          </div>

          {/* Date Difference */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">&#x1F4C5;</span> Date Difference
            </h3>
            <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              value={dateDiffFrom}
              onChange={(e) => setDateDiffFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <label className="block text-xs font-medium text-gray-600 mb-1 mt-2">To Date</label>
            <input
              type="date"
              value={dateDiffTo}
              onChange={(e) => setDateDiffTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={calcDateDiff}
              className="mt-3 w-full bg-green-600 text-white text-sm font-medium py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Calculate Difference
            </button>
            {dateDiffResult && (
              <p className="mt-3 text-sm text-gray-700 bg-green-50 rounded-md px-3 py-2">{dateDiffResult}</p>
            )}
          </div>

          {/* Timezone Converter */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">&#x1F30D;</span> Time Zone Converter
            </h3>
            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <select
              value={convFrom}
              onChange={(e) => setConvFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.tz} value={tz.tz}>{tz.label}</option>
              ))}
            </select>
            <label className="block text-xs font-medium text-gray-600 mb-1 mt-2">To</label>
            <select
              value={convTo}
              onChange={(e) => setConvTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.tz} value={tz.tz}>{tz.label}</option>
              ))}
            </select>
            <div className="mt-3 bg-purple-50 rounded-md px-3 py-3 text-center">
              <p className="text-xs text-gray-500">
                {COMMON_TIMEZONES.find((t) => t.tz === convFrom)?.label.split(' (')[0] || ''}
              </p>
              <p className="font-mono text-lg font-bold text-purple-700">{formatTime(convFrom, false)}</p>
              <ArrowRight className="w-4 h-4 text-gray-400 mx-auto my-1" />
              <p className="text-xs text-gray-500">
                {COMMON_TIMEZONES.find((t) => t.tz === convTo)?.label.split(' (')[0] || ''}
              </p>
              <p className="font-mono text-lg font-bold text-purple-700">{formatTime(convTo, false)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ROW 7: Space & Astronomy ════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-orange-600" />
          Space &amp; Astronomy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: '\u{1F6F0}\uFE0F', title: 'ISS Tracker', desc: 'Track the International Space Station live', href: '/iss-tracker', color: 'bg-cyan-50 border-cyan-200', textColor: 'text-cyan-700' },
            { emoji: '\u{1F311}', title: 'Eclipse Calendar', desc: 'Upcoming solar & lunar eclipses', href: '/eclipses', color: 'bg-gray-50 border-gray-200', textColor: 'text-gray-700' },
            { emoji: '\u{1FA90}', title: 'Solar System', desc: 'Explore planets and their details', href: '/solar-system', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
            { emoji: '\u{1F320}', title: 'Meteor Showers', desc: 'Next meteor shower dates', href: '/meteor-showers', color: 'bg-indigo-50 border-indigo-200', textColor: 'text-indigo-700' },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group ${card.color} border rounded-lg p-5 hover:shadow-md transition-all`}
            >
              <div className="text-2xl mb-2">{card.emoji}</div>
              <h3 className={`font-semibold ${card.textColor} group-hover:underline`}>{card.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
            </Link>
          ))}
        </div>
        {/* Space News — live from API */}
        <MarsSpaceNews />
      </section>

      {/* ═══ ROW 8: Test Your Knowledge ══════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Test Your Knowledge &mdash; 5 Free Quizzes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { emoji: '\u{1F30D}', title: 'Timezone Challenge', href: '/quiz/timezone', bg: 'bg-blue-500' },
            { emoji: '\u{1F680}', title: 'Space Trivia', href: '/quiz/space', bg: 'bg-orange-500' },
            { emoji: '\u{1F3C1}', title: 'Flags & Countries', href: '/quiz/flags', bg: 'bg-green-500' },
            { emoji: '\u{1F319}', title: 'Moon & Eclipse', href: '/quiz/moon', bg: 'bg-yellow-500' },
            { emoji: '\u{1F52D}', title: 'Astronomy', href: '/quiz/astronomy', bg: 'bg-cyan-500' },
          ].map((quiz) => (
            <Link
              key={quiz.href}
              href={quiz.href}
              className={`${quiz.bg} rounded-lg p-5 text-center text-white hover:opacity-90 transition-opacity shadow-sm`}
            >
              <div className="text-3xl mb-2">{quiz.emoji}</div>
              <h3 className="font-semibold text-sm">{quiz.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ ROW 9: Explore All Tools ════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Explore All 50+ Tools
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Clock, title: 'Clocks & Timers', desc: 'World clock, stopwatch, alarms', href: '/world-clock', color: 'text-blue-600' },
            { icon: ArrowLeftRight, title: 'Time Zones', desc: 'Convert, compare, find zones', href: '/timezone-map', color: 'text-purple-600' },
            { icon: CalendarDays, title: 'Dates & Calendar', desc: 'Calendars, holidays, date math', href: '/calendar', color: 'text-green-600' },
            { icon: Telescope, title: 'Astronomy', desc: 'Sun, moon, eclipses, stars', href: '/astronomy', color: 'text-orange-600' },
            { icon: Rocket, title: 'Space', desc: 'Planets, ISS, exploration', href: '/solar-system', color: 'text-red-600' },
            { icon: Zap, title: 'Quizzes', desc: 'Test your knowledge', href: '/quiz/timezone', color: 'text-yellow-600' },
            { icon: Calculator, title: 'Converters', desc: 'Unix time, Julian date, more', href: '/unix-timestamp', color: 'text-cyan-600' },
            { icon: Sparkles, title: 'Fun & More', desc: 'Random facts, space news', href: '/news', color: 'text-pink-600' },
          ].map(({ icon: Icon, title, desc, href, color }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all text-center"
            >
              <Icon className={`w-7 h-7 ${color} mx-auto mb-2`} />
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ ROW 10: Footer CTA ══════════════════════════════════ */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Your free toolkit for time, dates, and space exploration
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
            50+ tools for time zones, calendars, astronomy, and space exploration. No sign-up, no ads, completely free.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/world-clock"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              World Clock
            </Link>
            <Link
              href="/astronomy"
              className="px-6 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Astronomy
            </Link>
            <Link
              href="/iss-tracker"
              className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition-colors"
            >
              ISS Tracker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

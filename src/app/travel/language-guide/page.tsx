'use client'

import { useState } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

/* ── phrase data ── */
const PHRASE_KEYS = [
  'Hello',
  'Thank you',
  'Please',
  'How much?',
  'Where is...?',
  'I need help',
  'Yes',
  'No',
  'Goodbye',
  'Excuse me',
] as const

type PhraseKey = (typeof PHRASE_KEYS)[number]

interface LanguageMeta {
  officialLanguages: string[]
  englishRating: number          // 1-5
  englishNote: string
  phrases: Record<PhraseKey, string>
  translationApps: { name: string; note: string }[]
  simGuidance: string
  wifiRating: number             // 1-5
  wifiNote: string
  scriptNote: string
}

const LANGUAGE_DATA: Record<string, LanguageMeta> = {
  japan: {
    officialLanguages: ['Japanese'],
    englishRating: 2,
    englishNote: 'English signage in major cities and transit, but conversational English is limited outside tourist hubs. Google Translate with camera mode is invaluable.',
    phrases: {
      'Hello': 'Konnichiwa (こんにちは)',
      'Thank you': 'Arigatou gozaimasu (ありがとうございます)',
      'Please': 'Onegaishimasu (お願いします)',
      'How much?': 'Ikura desu ka? (いくらですか？)',
      'Where is...?': '...wa doko desu ka? (…はどこですか？)',
      'I need help': 'Tasukete kudasai (助けてください)',
      'Yes': 'Hai (はい)',
      'No': 'Iie (いいえ)',
      'Goodbye': 'Sayounara (さようなら)',
      'Excuse me': 'Sumimasen (すみません)',
    },
    translationApps: [
      { name: 'Google Translate', note: 'Camera mode reads Japanese signs and menus in real-time' },
      { name: 'Papago', note: 'Strong with Asian languages; natural phrasing' },
      { name: 'Yomiwa', note: 'Specialized Japanese dictionary with kanji recognition' },
    ],
    simGuidance: 'Pocket WiFi rental is the most popular option (pick up at airports). Prepaid SIM cards available at airports and electronics stores (e.g., Bic Camera). Major carriers: IIJmio, Sakura Mobile. eSIM via Ubigi or Airalo also works well.',
    wifiRating: 4,
    wifiNote: 'Free WiFi at most hotels, convenience stores (7-Eleven, FamilyMart), train stations, and Starbucks. Coverage is excellent in cities but limited in rural areas.',
    scriptNote: 'Japanese uses three writing systems: Hiragana (ひらがな) for native words, Katakana (カタカナ) for foreign words, and Kanji (漢字) — Chinese characters. Train stations and tourist spots often have Romaji (Latin script) alongside.',
  },
  italy: {
    officialLanguages: ['Italian'],
    englishRating: 3,
    englishNote: 'Widely spoken in tourist areas, hotels, and by younger Italians. Less common in rural southern Italy. A few Italian phrases go a long way in earning goodwill.',
    phrases: {
      'Hello': 'Ciao / Buongiorno',
      'Thank you': 'Grazie',
      'Please': 'Per favore',
      'How much?': 'Quanto costa?',
      'Where is...?': 'Dov\'e...?',
      'I need help': 'Ho bisogno di aiuto',
      'Yes': 'Si',
      'No': 'No',
      'Goodbye': 'Arrivederci',
      'Excuse me': 'Mi scusi',
    },
    translationApps: [
      { name: 'Google Translate', note: 'Excellent for Italian with offline mode available' },
      { name: 'DeepL', note: 'Superior translation quality for longer texts and nuances' },
      { name: 'iTranslate', note: 'Good voice-to-voice translation for conversations' },
    ],
    simGuidance: 'EU roaming rules apply for EU citizens. Tourists can buy prepaid SIMs at TIM, Vodafone, or WIND Tre shops (bring your passport). Airport kiosks available at major airports. eSIM via Airalo is convenient.',
    wifiRating: 3,
    wifiNote: 'Hotels and restaurants generally have WiFi. Public WiFi in major cities through municipal networks. Cafes usually share passwords with customers. Coverage can be spotty in rural Tuscany and smaller towns.',
    scriptNote: 'Italian uses the Latin alphabet with very consistent pronunciation rules. Accented vowels (e, a) are common. Once you learn the pronunciation patterns, you can read Italian words aloud quite accurately.',
  },
  thailand: {
    officialLanguages: ['Thai'],
    englishRating: 2,
    englishNote: 'English is common in Bangkok tourist areas, hotels, and popular islands. Limited outside major tourist zones. Taxi drivers rarely speak English — have your destination written in Thai.',
    phrases: {
      'Hello': 'Sawasdee (สวัสดี) + krub/ka',
      'Thank you': 'Khop khun (ขอบคุณ) + krub/ka',
      'Please': 'Ga-ru-na (กรุณา)',
      'How much?': 'Tao rai? (เท่าไหร่?)',
      'Where is...?': '...yoo tee nai? (…อยู่ที่ไหน?)',
      'I need help': 'Chuay duay (ช่วยด้วย)',
      'Yes': 'Chai (ใช่)',
      'No': 'Mai (ไม่)',
      'Goodbye': 'La gon (ลาก่อน)',
      'Excuse me': 'Kor thot (ขอโทษ)',
    },
    translationApps: [
      { name: 'Google Translate', note: 'Camera mode reads Thai script; offline pack recommended' },
      { name: 'Thai Dictionary', note: 'Dedicated app with phonetic pronunciation guides' },
      { name: 'Speak Thai', note: 'Good for learning tonal pronunciation' },
    ],
    simGuidance: 'Very affordable SIM cards at every airport (AIS, DTAC, TrueMove). Tourist SIMs start around 299 THB for 8 days with generous data. 7-Eleven stores also sell SIMs. eSIM available via Airalo and local carriers.',
    wifiRating: 4,
    wifiNote: 'Excellent free WiFi in hotels, malls, cafes, and restaurants throughout Bangkok and tourist islands. Many street food areas and markets also have WiFi. Rural areas have limited coverage.',
    scriptNote: 'Thai script (อักษรไทย) has 44 consonants, 15 vowel symbols, and 4 tone marks. It is written left to right without spaces between words. Thai is a tonal language with 5 tones — the same syllable means different things depending on pitch.',
  },
  france: {
    officialLanguages: ['French'],
    englishRating: 3,
    englishNote: 'English is widely understood in Paris and tourist areas. Always greet with "Bonjour" first — attempting French before switching to English is greatly appreciated and changes the interaction.',
    phrases: {
      'Hello': 'Bonjour',
      'Thank you': 'Merci',
      'Please': 'S\'il vous plait',
      'How much?': 'Combien ca coute?',
      'Where is...?': 'Ou est...?',
      'I need help': 'J\'ai besoin d\'aide',
      'Yes': 'Oui',
      'No': 'Non',
      'Goodbye': 'Au revoir',
      'Excuse me': 'Excusez-moi',
    },
    translationApps: [
      { name: 'Google Translate', note: 'Reliable for French with excellent voice input' },
      { name: 'DeepL', note: 'Best-in-class French translations, especially for nuanced text' },
      { name: 'WordReference', note: 'Superb dictionary with forums discussing usage nuances' },
    ],
    simGuidance: 'EU roaming for EU residents. Tourists can buy SIMs from Orange, SFR, or Bouygues at tabac shops, supermarkets, or dedicated stores. Orange Holiday SIM is popular for tourists. eSIM widely supported.',
    wifiRating: 4,
    wifiNote: 'Excellent WiFi in hotels, cafes, and restaurants. Paris has extensive free municipal WiFi in parks and public spaces. TGV trains offer WiFi. Most McDonalds and Starbucks have reliable free WiFi.',
    scriptNote: 'French uses the Latin alphabet with several accents: acute (e), grave (e, a, u), circumflex (e, a, i, o, u), cedilla (c), and diaeresis (e, i, u). Pronunciation has many silent letters and liaisons between words.',
  },
  india: {
    officialLanguages: ['Hindi', 'English (associate official)', '22 scheduled languages'],
    englishRating: 4,
    englishNote: 'English is widely spoken in cities, hotels, and tourist areas. India has the second-largest English-speaking population globally. However, in rural areas and smaller towns, Hindi or regional languages dominate.',
    phrases: {
      'Hello': 'Namaste (नमस्ते)',
      'Thank you': 'Dhanyavaad (धन्यवाद)',
      'Please': 'Kripya (कृपया)',
      'How much?': 'Kitne ka hai? (कितने का है?)',
      'Where is...?': '...kahan hai? (…कहाँ है?)',
      'I need help': 'Mujhe madad chahiye (मुझे मदद चाहिए)',
      'Yes': 'Haan (हाँ)',
      'No': 'Nahi (नहीं)',
      'Goodbye': 'Alvida (अलविदा) / Phir milenge',
      'Excuse me': 'Suniye (सुनिए)',
    },
    translationApps: [
      { name: 'Google Translate', note: 'Supports Hindi and many Indian regional languages with camera mode' },
      { name: 'Microsoft Translator', note: 'Good for Indian languages with conversation mode' },
      { name: 'HindiPod101', note: 'Lessons and phrases for learning Hindi basics' },
    ],
    simGuidance: 'SIM registration requires your passport and a local address (hotel address works). Jio and Airtel offer tourist SIMs at airports. Process can take 24-48 hours for activation. eSIM via Airalo is faster. Buy at airport Jio/Airtel counters for quickest service.',
    wifiRating: 3,
    wifiNote: 'Good WiFi in hotels, malls, and chain cafes. Indian Railways offers free WiFi at 400+ stations via Google partnership. Coverage and speed vary greatly. Mobile data (4G/5G) is extremely cheap — often more reliable than WiFi.',
    scriptNote: 'Hindi uses the Devanagari script (देवनागरी), written left to right with a distinctive horizontal line connecting letters. India has dozens of scripts for its many languages. Road signs and official documents often include English alongside local languages.',
  },
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-secondary' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function LanguageGuidePage() {
  const [selectedCountry, setSelectedCountry] = useState('japan')

  const country = COUNTRIES.find((c) => c.id === selectedCountry)
  const langData = LANGUAGE_DATA[selectedCountry]

  if (!country || !langData) return null

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold text-dark sm:text-5xl">
          Language &amp; Communication Guide
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dark/70">
          Navigate any destination with confidence. Essential phrases, translation tools, and connectivity tips for every country.
        </p>
      </div>

      {/* ── Country Selector ── */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {COUNTRIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              selectedCountry === c.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-card-bg text-dark/70 border border-border hover:border-primary/40 hover:text-primary'
            }`}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {/* ── Official Languages & English Rating ── */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-dark mb-3">Official Languages</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {langData.officialLanguages.map((lang) => (
              <span key={lang} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-dark mb-3">English Proficiency</h2>
          <StarRating rating={langData.englishRating} />
          <p className="mt-3 text-sm text-dark/70 leading-relaxed">{langData.englishNote}</p>
        </div>
      </div>

      {/* ── Essential Phrases ── */}
      <div className="mb-8 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">
          Essential Phrases in {langData.officialLanguages[0]}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PHRASE_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-start gap-3 rounded-xl bg-page-bg p-4 border border-border/50"
            >
              <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
                {key}
              </span>
              <span className="text-sm font-medium text-dark leading-relaxed">
                {langData.phrases[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Script / Writing System ── */}
      <div className="mb-8 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-dark mb-3">
          Script &amp; Writing System
        </h2>
        <p className="text-dark/70 leading-relaxed">{langData.scriptNote}</p>
      </div>

      {/* ── Recommended Translation Apps ── */}
      <div className="mb-8 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">
          Recommended Translation Apps
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {langData.translationApps.map((app) => (
            <div key={app.name} className="rounded-xl bg-page-bg border border-border/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </span>
                <h3 className="font-semibold text-dark">{app.name}</h3>
              </div>
              <p className="text-sm text-dark/70 leading-relaxed">{app.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SIM Card & Data + WiFi ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-dark mb-3">
            SIM Card &amp; Data in {country.name}
          </h2>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-dark">Mobile Data Guide</span>
          </div>
          <p className="text-sm text-dark/70 leading-relaxed">{langData.simGuidance}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-dark mb-3">
            WiFi Availability
          </h2>
          <div className="mb-3">
            <StarRating rating={langData.wifiRating} />
          </div>
          <p className="text-sm text-dark/70 leading-relaxed">{langData.wifiNote}</p>
        </div>
      </div>
    </section>
  )
}

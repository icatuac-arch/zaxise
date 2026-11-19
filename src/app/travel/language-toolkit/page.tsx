'use client'

import { useState } from 'react'

/* ──────────────────────────────────────────────
   PHRASE DATA — 15 languages × 20 phrases = 300
   ────────────────────────────────────────────── */

interface Phrase {
  english: string
  local: string
  romanized: string
  sounds: string
}

interface LanguageData {
  language: string
  countries: string
  flag: string
  phrases: Phrase[]
}

const languages: LanguageData[] = [
  {
    language: 'Japanese',
    countries: 'Japan',
    flag: '🇯🇵',
    phrases: [
      { english: 'Hello', local: 'こんにちは', romanized: 'Konnichiwa', sounds: 'kon-nee-chee-wah' },
      { english: 'Thank you', local: 'ありがとう', romanized: 'Arigatou', sounds: 'ah-ree-gah-toh' },
      { english: 'Excuse me', local: 'すみません', romanized: 'Sumimasen', sounds: 'su-mee-mah-sen' },
      { english: 'How much?', local: 'いくらですか', romanized: 'Ikura desu ka', sounds: 'ee-ku-rah des-kah' },
      { english: 'Where is...?', local: '...はどこですか', romanized: '...wa doko desu ka', sounds: 'wah doh-koh des-kah' },
      { english: "I don't understand", local: 'わかりません', romanized: 'Wakarimasen', sounds: 'wah-kah-ree-mah-sen' },
      { english: 'Yes / No', local: 'はい / いいえ', romanized: 'Hai / Iie', sounds: 'hai / ee-eh' },
      { english: 'Help!', local: '助けて', romanized: 'Tasukete', sounds: 'tah-su-keh-teh' },
      { english: 'Delicious', local: 'おいしい', romanized: 'Oishii', sounds: 'oh-ee-shee' },
      { english: 'Bill please', local: 'お会計', romanized: 'Okaikei', sounds: 'oh-kai-keh' },
      { english: "I'm vegetarian", local: 'ベジタリアンです', romanized: 'Bejitarian desu', sounds: 'beh-jee-tah-ree-ahn des' },
      { english: 'No meat please', local: '肉なしで', romanized: 'Niku nashi de', sounds: 'nee-ku nah-shee deh' },
      { english: 'Bathroom', local: 'トイレ', romanized: 'Toire', sounds: 'toy-reh' },
      { english: 'Train station', local: '駅', romanized: 'Eki', sounds: 'eh-kee' },
      { english: 'Beautiful', local: 'きれい', romanized: 'Kirei', sounds: 'kee-reh' },
      { english: 'Sorry', local: 'ごめんなさい', romanized: 'Gomen nasai', sounds: 'goh-men nah-sai' },
      { english: 'Good morning', local: 'おはようございます', romanized: 'Ohayou gozaimasu', sounds: 'oh-hah-yoh goh-zai-mas' },
      { english: 'Goodbye', local: 'さようなら', romanized: 'Sayounara', sounds: 'sah-yoh-nah-rah' },
      { english: 'Water', local: '水', romanized: 'Mizu', sounds: 'mee-zu' },
      { english: "I'm lost", local: '迷いました', romanized: 'Mayoimashita', sounds: 'mah-yoy-mah-shee-tah' },
    ],
  },
  {
    language: 'Spanish',
    countries: 'Spain / Mexico / South America',
    flag: '🇪🇸',
    phrases: [
      { english: 'Hello', local: 'Hola', romanized: 'Hola', sounds: 'oh-lah' },
      { english: 'Thank you', local: 'Gracias', romanized: 'Gracias', sounds: 'grah-see-ahs' },
      { english: 'Excuse me', local: 'Disculpe', romanized: 'Disculpe', sounds: 'dees-kool-peh' },
      { english: 'How much?', local: '¿Cuánto cuesta?', romanized: 'Cuánto cuesta', sounds: 'kwahn-toh kwes-tah' },
      { english: 'Where is...?', local: '¿Dónde está...?', romanized: 'Dónde está', sounds: 'dohn-deh es-tah' },
      { english: "I don't understand", local: 'No entiendo', romanized: 'No entiendo', sounds: 'noh en-tee-en-doh' },
      { english: 'Yes / No', local: 'Sí / No', romanized: 'Sí / No', sounds: 'see / noh' },
      { english: 'Help!', local: '¡Ayuda!', romanized: 'Ayuda', sounds: 'ah-yoo-dah' },
      { english: 'Delicious', local: 'Delicioso', romanized: 'Delicioso', sounds: 'deh-lee-see-oh-soh' },
      { english: 'Bill please', local: 'La cuenta, por favor', romanized: 'La cuenta por favor', sounds: 'lah kwen-tah por fah-vor' },
      { english: "I'm vegetarian", local: 'Soy vegetariano/a', romanized: 'Soy vegetariano', sounds: 'soy veh-heh-tah-ree-ah-noh' },
      { english: 'No meat please', local: 'Sin carne, por favor', romanized: 'Sin carne por favor', sounds: 'seen kar-neh por fah-vor' },
      { english: 'Bathroom', local: 'Baño', romanized: 'Baño', sounds: 'bah-nyoh' },
      { english: 'Train station', local: 'Estación de tren', romanized: 'Estación de tren', sounds: 'es-tah-see-ohn deh tren' },
      { english: 'Beautiful', local: 'Hermoso/a', romanized: 'Hermoso', sounds: 'air-moh-soh' },
      { english: 'Sorry', local: 'Lo siento', romanized: 'Lo siento', sounds: 'loh see-en-toh' },
      { english: 'Good morning', local: 'Buenos días', romanized: 'Buenos días', sounds: 'bweh-nohs dee-ahs' },
      { english: 'Goodbye', local: 'Adiós', romanized: 'Adiós', sounds: 'ah-dee-ohs' },
      { english: 'Water', local: 'Agua', romanized: 'Agua', sounds: 'ah-gwah' },
      { english: "I'm lost", local: 'Estoy perdido/a', romanized: 'Estoy perdido', sounds: 'es-toy pair-dee-doh' },
    ],
  },
  {
    language: 'French',
    countries: 'France / Belgium / Switzerland',
    flag: '🇫🇷',
    phrases: [
      { english: 'Hello', local: 'Bonjour', romanized: 'Bonjour', sounds: 'bohn-zhoor' },
      { english: 'Thank you', local: 'Merci', romanized: 'Merci', sounds: 'mair-see' },
      { english: 'Excuse me', local: 'Excusez-moi', romanized: 'Excusez-moi', sounds: 'ex-koo-zay mwah' },
      { english: 'How much?', local: 'Combien ?', romanized: 'Combien', sounds: 'kohm-bee-en' },
      { english: 'Where is...?', local: 'Où est... ?', romanized: 'Où est', sounds: 'oo eh' },
      { english: "I don't understand", local: 'Je ne comprends pas', romanized: 'Je ne comprends pas', sounds: 'zhuh nuh kohm-prahn pah' },
      { english: 'Yes / No', local: 'Oui / Non', romanized: 'Oui / Non', sounds: 'wee / nohn' },
      { english: 'Help!', local: 'Au secours !', romanized: 'Au secours', sounds: 'oh suh-koor' },
      { english: 'Delicious', local: 'Délicieux', romanized: 'Délicieux', sounds: 'day-lee-see-uh' },
      { english: 'Bill please', local: "L'addition, s'il vous plaît", romanized: "L'addition s'il vous plaît", sounds: 'lah-dee-see-ohn seel voo pleh' },
      { english: "I'm vegetarian", local: 'Je suis végétarien(ne)', romanized: 'Je suis végétarien', sounds: 'zhuh swee vay-zhay-tah-ree-en' },
      { english: 'No meat please', local: 'Sans viande, s\'il vous plaît', romanized: 'Sans viande', sounds: 'sahn vee-ahnd seel voo pleh' },
      { english: 'Bathroom', local: 'Toilettes', romanized: 'Toilettes', sounds: 'twah-let' },
      { english: 'Train station', local: 'Gare', romanized: 'Gare', sounds: 'gahr' },
      { english: 'Beautiful', local: 'Beau / Belle', romanized: 'Beau / Belle', sounds: 'boh / bell' },
      { english: 'Sorry', local: 'Pardon', romanized: 'Pardon', sounds: 'par-dohn' },
      { english: 'Good morning', local: 'Bonjour', romanized: 'Bonjour', sounds: 'bohn-zhoor' },
      { english: 'Goodbye', local: 'Au revoir', romanized: 'Au revoir', sounds: 'oh ruh-vwahr' },
      { english: 'Water', local: "De l'eau", romanized: "De l'eau", sounds: 'duh loh' },
      { english: "I'm lost", local: 'Je suis perdu(e)', romanized: 'Je suis perdu', sounds: 'zhuh swee pair-doo' },
    ],
  },
  {
    language: 'Italian',
    countries: 'Italy',
    flag: '🇮🇹',
    phrases: [
      { english: 'Hello', local: 'Ciao / Buongiorno', romanized: 'Ciao / Buongiorno', sounds: 'chow / bwohn-jor-noh' },
      { english: 'Thank you', local: 'Grazie', romanized: 'Grazie', sounds: 'grah-tsee-eh' },
      { english: 'Excuse me', local: 'Scusi', romanized: 'Scusi', sounds: 'skoo-zee' },
      { english: 'How much?', local: 'Quanto costa?', romanized: 'Quanto costa', sounds: 'kwahn-toh kos-tah' },
      { english: 'Where is...?', local: 'Dov\'è...?', romanized: 'Dov\'è', sounds: 'doh-veh' },
      { english: "I don't understand", local: 'Non capisco', romanized: 'Non capisco', sounds: 'non kah-pees-koh' },
      { english: 'Yes / No', local: 'Sì / No', romanized: 'Sì / No', sounds: 'see / noh' },
      { english: 'Help!', local: 'Aiuto!', romanized: 'Aiuto', sounds: 'ah-yoo-toh' },
      { english: 'Delicious', local: 'Delizioso', romanized: 'Delizioso', sounds: 'deh-lee-tsee-oh-zoh' },
      { english: 'Bill please', local: 'Il conto, per favore', romanized: 'Il conto per favore', sounds: 'eel kon-toh pair fah-voh-reh' },
      { english: "I'm vegetarian", local: 'Sono vegetariano/a', romanized: 'Sono vegetariano', sounds: 'soh-noh veh-jeh-tah-ree-ah-noh' },
      { english: 'No meat please', local: 'Senza carne, per favore', romanized: 'Senza carne', sounds: 'sen-tsah kar-neh pair fah-voh-reh' },
      { english: 'Bathroom', local: 'Bagno', romanized: 'Bagno', sounds: 'bah-nyoh' },
      { english: 'Train station', local: 'Stazione', romanized: 'Stazione', sounds: 'stah-tsee-oh-neh' },
      { english: 'Beautiful', local: 'Bello/a', romanized: 'Bello', sounds: 'bel-loh' },
      { english: 'Sorry', local: 'Mi dispiace', romanized: 'Mi dispiace', sounds: 'mee dees-pee-ah-cheh' },
      { english: 'Good morning', local: 'Buongiorno', romanized: 'Buongiorno', sounds: 'bwohn-jor-noh' },
      { english: 'Goodbye', local: 'Arrivederci', romanized: 'Arrivederci', sounds: 'ah-ree-veh-dair-chee' },
      { english: 'Water', local: 'Acqua', romanized: 'Acqua', sounds: 'ah-kwah' },
      { english: "I'm lost", local: 'Mi sono perso/a', romanized: 'Mi sono perso', sounds: 'mee soh-noh pair-soh' },
    ],
  },
  {
    language: 'German',
    countries: 'Germany / Austria / Switzerland',
    flag: '🇩🇪',
    phrases: [
      { english: 'Hello', local: 'Hallo', romanized: 'Hallo', sounds: 'hah-loh' },
      { english: 'Thank you', local: 'Danke', romanized: 'Danke', sounds: 'dahn-kuh' },
      { english: 'Excuse me', local: 'Entschuldigung', romanized: 'Entschuldigung', sounds: 'ent-shool-dee-goong' },
      { english: 'How much?', local: 'Wie viel kostet das?', romanized: 'Wie viel kostet das', sounds: 'vee feel kos-tet dahs' },
      { english: 'Where is...?', local: 'Wo ist...?', romanized: 'Wo ist', sounds: 'voh ist' },
      { english: "I don't understand", local: 'Ich verstehe nicht', romanized: 'Ich verstehe nicht', sounds: 'ikh fair-shtay-uh nikht' },
      { english: 'Yes / No', local: 'Ja / Nein', romanized: 'Ja / Nein', sounds: 'yah / nine' },
      { english: 'Help!', local: 'Hilfe!', romanized: 'Hilfe', sounds: 'hill-fuh' },
      { english: 'Delicious', local: 'Lecker', romanized: 'Lecker', sounds: 'leh-ker' },
      { english: 'Bill please', local: 'Die Rechnung, bitte', romanized: 'Die Rechnung bitte', sounds: 'dee rekh-noong bit-uh' },
      { english: "I'm vegetarian", local: 'Ich bin Vegetarier(in)', romanized: 'Ich bin Vegetarier', sounds: 'ikh bin veh-geh-tah-ree-er' },
      { english: 'No meat please', local: 'Ohne Fleisch, bitte', romanized: 'Ohne Fleisch bitte', sounds: 'oh-nuh flysh bit-uh' },
      { english: 'Bathroom', local: 'Toilette', romanized: 'Toilette', sounds: 'toy-let-uh' },
      { english: 'Train station', local: 'Bahnhof', romanized: 'Bahnhof', sounds: 'bahn-hohf' },
      { english: 'Beautiful', local: 'Schön', romanized: 'Schön', sounds: 'shurn' },
      { english: 'Sorry', local: 'Es tut mir leid', romanized: 'Es tut mir leid', sounds: 'es toot meer lied' },
      { english: 'Good morning', local: 'Guten Morgen', romanized: 'Guten Morgen', sounds: 'goo-ten mor-gen' },
      { english: 'Goodbye', local: 'Auf Wiedersehen', romanized: 'Auf Wiedersehen', sounds: 'owf vee-der-zay-en' },
      { english: 'Water', local: 'Wasser', romanized: 'Wasser', sounds: 'vah-ser' },
      { english: "I'm lost", local: 'Ich habe mich verlaufen', romanized: 'Ich habe mich verlaufen', sounds: 'ikh hah-buh mikh fair-low-fen' },
    ],
  },
  {
    language: 'Thai',
    countries: 'Thailand',
    flag: '🇹🇭',
    phrases: [
      { english: 'Hello', local: 'สวัสดี', romanized: 'Sawasdee', sounds: 'sah-wah-dee' },
      { english: 'Thank you', local: 'ขอบคุณ', romanized: 'Khop khun', sounds: 'kohp-koon' },
      { english: 'Excuse me', local: 'ขอโทษ', romanized: 'Kho thot', sounds: 'koh-toht' },
      { english: 'How much?', local: 'เท่าไหร่', romanized: 'Thao rai', sounds: 'tow-rai' },
      { english: 'Where is...?', local: '...อยู่ที่ไหน', romanized: '...yuu thii nai', sounds: 'yoo tee nai' },
      { english: "I don't understand", local: 'ไม่เข้าใจ', romanized: 'Mai khao jai', sounds: 'mai kow jai' },
      { english: 'Yes / No', local: 'ใช่ / ไม่ใช่', romanized: 'Chai / Mai chai', sounds: 'chai / mai chai' },
      { english: 'Help!', local: 'ช่วยด้วย', romanized: 'Chuay duay', sounds: 'choo-ay doo-ay' },
      { english: 'Delicious', local: 'อร่อย', romanized: 'Aroi', sounds: 'ah-roy' },
      { english: 'Bill please', local: 'เก็บเงินด้วย', romanized: 'Gep ngoen duay', sounds: 'gep ngern doo-ay' },
      { english: "I'm vegetarian", local: 'กินเจ', romanized: 'Gin jeh', sounds: 'gin jeh' },
      { english: 'No meat please', local: 'ไม่ใส่เนื้อ', romanized: 'Mai sai neua', sounds: 'mai sai nuh-ah' },
      { english: 'Bathroom', local: 'ห้องน้ำ', romanized: 'Hong nam', sounds: 'hong nahm' },
      { english: 'Train station', local: 'สถานีรถไฟ', romanized: 'Sathani rot fai', sounds: 'sah-tah-nee rot fai' },
      { english: 'Beautiful', local: 'สวย', romanized: 'Suay', sounds: 'soo-ay' },
      { english: 'Sorry', local: 'ขอโทษ', romanized: 'Kho thot', sounds: 'koh-toht' },
      { english: 'Good morning', local: 'สวัสดีตอนเช้า', romanized: 'Sawasdee ton chao', sounds: 'sah-wah-dee ton chow' },
      { english: 'Goodbye', local: 'ลาก่อน', romanized: 'La gon', sounds: 'lah gohn' },
      { english: 'Water', local: 'น้ำ', romanized: 'Nam', sounds: 'nahm' },
      { english: "I'm lost", local: 'หลงทาง', romanized: 'Long thang', sounds: 'long tahng' },
    ],
  },
  {
    language: 'Hindi',
    countries: 'India',
    flag: '🇮🇳',
    phrases: [
      { english: 'Hello', local: 'नमस्ते', romanized: 'Namaste', sounds: 'nah-mah-stay' },
      { english: 'Thank you', local: 'धन्यवाद', romanized: 'Dhanyavaad', sounds: 'dhan-yah-vahd' },
      { english: 'Excuse me', local: 'माफ़ कीजिए', romanized: 'Maaf kijiye', sounds: 'mahf kee-jee-yeh' },
      { english: 'How much?', local: 'कितना है?', romanized: 'Kitna hai', sounds: 'kit-nah hai' },
      { english: 'Where is...?', local: '...कहाँ है?', romanized: '...kahan hai', sounds: 'kah-hahn hai' },
      { english: "I don't understand", local: 'मुझे समझ नहीं आया', romanized: 'Mujhe samajh nahi aaya', sounds: 'moo-jheh sah-mahj nah-hee ah-yah' },
      { english: 'Yes / No', local: 'हाँ / नहीं', romanized: 'Haan / Nahi', sounds: 'hahn / nah-hee' },
      { english: 'Help!', local: 'मदद!', romanized: 'Madad', sounds: 'mah-dahd' },
      { english: 'Delicious', local: 'स्वादिष्ट', romanized: 'Swaadisht', sounds: 'svah-dish-t' },
      { english: 'Bill please', local: 'बिल दीजिए', romanized: 'Bill dijiye', sounds: 'bill dee-jee-yeh' },
      { english: "I'm vegetarian", local: 'मैं शाकाहारी हूँ', romanized: 'Main shakahari hoon', sounds: 'main shah-kah-hah-ree hoon' },
      { english: 'No meat please', local: 'मांस नहीं चाहिए', romanized: 'Mans nahi chahiye', sounds: 'mahns nah-hee chah-hee-yeh' },
      { english: 'Bathroom', local: 'शौचालय', romanized: 'Shauchalay', sounds: 'show-chah-lay' },
      { english: 'Train station', local: 'रेलवे स्टेशन', romanized: 'Railway station', sounds: 'rail-way stay-shun' },
      { english: 'Beautiful', local: 'सुंदर', romanized: 'Sundar', sounds: 'soon-dar' },
      { english: 'Sorry', local: 'माफ़ कीजिए', romanized: 'Maaf kijiye', sounds: 'mahf kee-jee-yeh' },
      { english: 'Good morning', local: 'सुप्रभात', romanized: 'Suprabhat', sounds: 'su-prah-bhaht' },
      { english: 'Goodbye', local: 'अलविदा', romanized: 'Alvida', sounds: 'al-vee-dah' },
      { english: 'Water', local: 'पानी', romanized: 'Paani', sounds: 'pah-nee' },
      { english: "I'm lost", local: 'मैं खो गया/गयी', romanized: 'Main kho gaya/gayi', sounds: 'main koh gah-yah' },
    ],
  },
  {
    language: 'Mandarin Chinese',
    countries: 'China / Taiwan / Singapore',
    flag: '🇨🇳',
    phrases: [
      { english: 'Hello', local: '你好', romanized: 'Nǐ hǎo', sounds: 'nee how' },
      { english: 'Thank you', local: '谢谢', romanized: 'Xièxiè', sounds: 'syeh-syeh' },
      { english: 'Excuse me', local: '请问', romanized: 'Qǐngwèn', sounds: 'ching-wen' },
      { english: 'How much?', local: '多少钱？', romanized: 'Duōshao qián', sounds: 'dwoh-shaow chee-en' },
      { english: 'Where is...?', local: '...在哪里？', romanized: '...zài nǎlǐ', sounds: 'zai nah-lee' },
      { english: "I don't understand", local: '我听不懂', romanized: 'Wǒ tīng bù dǒng', sounds: 'woh ting boo dong' },
      { english: 'Yes / No', local: '是 / 不是', romanized: 'Shì / Bú shì', sounds: 'shh / boo-shh' },
      { english: 'Help!', local: '救命！', romanized: 'Jiùmìng', sounds: 'jyo-ming' },
      { english: 'Delicious', local: '好吃', romanized: 'Hǎo chī', sounds: 'how chee' },
      { english: 'Bill please', local: '买单', romanized: 'Mǎidān', sounds: 'my-dahn' },
      { english: "I'm vegetarian", local: '我吃素', romanized: 'Wǒ chī sù', sounds: 'woh chee soo' },
      { english: 'No meat please', local: '不要肉', romanized: 'Bú yào ròu', sounds: 'boo yow roh' },
      { english: 'Bathroom', local: '洗手间', romanized: 'Xǐshǒujiān', sounds: 'shee-show-jee-en' },
      { english: 'Train station', local: '火车站', romanized: 'Huǒchē zhàn', sounds: 'hwoh-chuh jahn' },
      { english: 'Beautiful', local: '漂亮', romanized: 'Piàoliang', sounds: 'pee-ow-lee-ahng' },
      { english: 'Sorry', local: '对不起', romanized: 'Duìbùqǐ', sounds: 'dway-boo-chee' },
      { english: 'Good morning', local: '早上好', romanized: 'Zǎoshang hǎo', sounds: 'zaow-shahng how' },
      { english: 'Goodbye', local: '再见', romanized: 'Zàijiàn', sounds: 'zai-jee-en' },
      { english: 'Water', local: '水', romanized: 'Shuǐ', sounds: 'shway' },
      { english: "I'm lost", local: '我迷路了', romanized: 'Wǒ mílù le', sounds: 'woh mee-loo luh' },
    ],
  },
  {
    language: 'Korean',
    countries: 'South Korea',
    flag: '🇰🇷',
    phrases: [
      { english: 'Hello', local: '안녕하세요', romanized: 'Annyeonghaseyo', sounds: 'ahn-nyung-hah-say-yo' },
      { english: 'Thank you', local: '감사합니다', romanized: 'Gamsahamnida', sounds: 'gahm-sah-hahm-nee-dah' },
      { english: 'Excuse me', local: '실례합니다', romanized: 'Sillyehamnida', sounds: 'sheel-lyeh-hahm-nee-dah' },
      { english: 'How much?', local: '얼마예요?', romanized: 'Eolmayeyo', sounds: 'uhl-mah-yeh-yo' },
      { english: 'Where is...?', local: '...어디예요?', romanized: '...eodiyeyo', sounds: 'uh-dee-yeh-yo' },
      { english: "I don't understand", local: '이해 못 해요', romanized: 'Ihae mot haeyo', sounds: 'ee-heh moht heh-yo' },
      { english: 'Yes / No', local: '네 / 아니요', romanized: 'Ne / Aniyo', sounds: 'neh / ah-nee-yo' },
      { english: 'Help!', local: '도와주세요!', romanized: 'Dowajuseyo', sounds: 'doh-wah-joo-seh-yo' },
      { english: 'Delicious', local: '맛있어요', romanized: 'Mashisseoyo', sounds: 'mah-shee-suh-yo' },
      { english: 'Bill please', local: '계산서 주세요', romanized: 'Gyesanseo juseyo', sounds: 'geh-sahn-suh joo-seh-yo' },
      { english: "I'm vegetarian", local: '채식주의자예요', romanized: 'Chaesikjuuijayeyo', sounds: 'cheh-shik-joo-ee-jah-yeh-yo' },
      { english: 'No meat please', local: '고기 빼주세요', romanized: 'Gogi ppaejuseyo', sounds: 'goh-gee ppeh-joo-seh-yo' },
      { english: 'Bathroom', local: '화장실', romanized: 'Hwajangsil', sounds: 'hwah-jahng-sheel' },
      { english: 'Train station', local: '기차역', romanized: 'Gichayeok', sounds: 'gee-chah-yuk' },
      { english: 'Beautiful', local: '아름다워요', romanized: 'Areumdawoyo', sounds: 'ah-reum-dah-woh-yo' },
      { english: 'Sorry', local: '죄송합니다', romanized: 'Joesonghamnida', sounds: 'jweh-song-hahm-nee-dah' },
      { english: 'Good morning', local: '좋은 아침이에요', romanized: 'Joeun achimieyo', sounds: 'joh-eun ah-chee-mee-eh-yo' },
      { english: 'Goodbye', local: '안녕히 가세요', romanized: 'Annyeonghi gaseyo', sounds: 'ahn-nyung-hee gah-seh-yo' },
      { english: 'Water', local: '물', romanized: 'Mul', sounds: 'mool' },
      { english: "I'm lost", local: '길을 잃었어요', romanized: 'Gireul ilheosseoyo', sounds: 'gee-ruhl eel-huh-suh-yo' },
    ],
  },
  {
    language: 'Portuguese',
    countries: 'Portugal / Brazil',
    flag: '🇵🇹',
    phrases: [
      { english: 'Hello', local: 'Olá', romanized: 'Olá', sounds: 'oh-lah' },
      { english: 'Thank you', local: 'Obrigado/a', romanized: 'Obrigado', sounds: 'oh-bree-gah-doo' },
      { english: 'Excuse me', local: 'Com licença', romanized: 'Com licença', sounds: 'kohm lee-sen-sah' },
      { english: 'How much?', local: 'Quanto custa?', romanized: 'Quanto custa', sounds: 'kwahn-too koos-tah' },
      { english: 'Where is...?', local: 'Onde fica...?', romanized: 'Onde fica', sounds: 'ohn-jee fee-kah' },
      { english: "I don't understand", local: 'Não entendo', romanized: 'Não entendo', sounds: 'now en-ten-doo' },
      { english: 'Yes / No', local: 'Sim / Não', romanized: 'Sim / Não', sounds: 'seem / now' },
      { english: 'Help!', local: 'Socorro!', romanized: 'Socorro', sounds: 'soh-koh-hoo' },
      { english: 'Delicious', local: 'Delicioso', romanized: 'Delicioso', sounds: 'deh-lee-see-oh-zoo' },
      { english: 'Bill please', local: 'A conta, por favor', romanized: 'A conta por favor', sounds: 'ah kohn-tah por fah-vor' },
      { english: "I'm vegetarian", local: 'Sou vegetariano/a', romanized: 'Sou vegetariano', sounds: 'soh veh-zheh-tah-ree-ah-noo' },
      { english: 'No meat please', local: 'Sem carne, por favor', romanized: 'Sem carne por favor', sounds: 'saym kar-nee por fah-vor' },
      { english: 'Bathroom', local: 'Banheiro', romanized: 'Banheiro', sounds: 'bahn-yay-roo' },
      { english: 'Train station', local: 'Estação de trem', romanized: 'Estação de trem', sounds: 'es-tah-sow jee trehn' },
      { english: 'Beautiful', local: 'Bonito/a', romanized: 'Bonito', sounds: 'boh-nee-too' },
      { english: 'Sorry', local: 'Desculpe', romanized: 'Desculpe', sounds: 'des-kool-pee' },
      { english: 'Good morning', local: 'Bom dia', romanized: 'Bom dia', sounds: 'bohm jee-ah' },
      { english: 'Goodbye', local: 'Tchau', romanized: 'Tchau', sounds: 'chow' },
      { english: 'Water', local: 'Água', romanized: 'Água', sounds: 'ah-gwah' },
      { english: "I'm lost", local: 'Estou perdido/a', romanized: 'Estou perdido', sounds: 'es-toh pair-jee-doo' },
    ],
  },
  {
    language: 'Turkish',
    countries: 'Turkey',
    flag: '🇹🇷',
    phrases: [
      { english: 'Hello', local: 'Merhaba', romanized: 'Merhaba', sounds: 'mair-hah-bah' },
      { english: 'Thank you', local: 'Teşekkür ederim', romanized: 'Teşekkür ederim', sounds: 'teh-shek-koor eh-deh-reem' },
      { english: 'Excuse me', local: 'Affedersiniz', romanized: 'Affedersiniz', sounds: 'ahf-feh-dair-see-neez' },
      { english: 'How much?', local: 'Ne kadar?', romanized: 'Ne kadar', sounds: 'neh kah-dahr' },
      { english: 'Where is...?', local: '...nerede?', romanized: 'Nerede', sounds: 'neh-reh-deh' },
      { english: "I don't understand", local: 'Anlamıyorum', romanized: 'Anlamıyorum', sounds: 'ahn-lah-muh-yoh-room' },
      { english: 'Yes / No', local: 'Evet / Hayır', romanized: 'Evet / Hayır', sounds: 'eh-vet / hi-yuhr' },
      { english: 'Help!', local: 'İmdat!', romanized: 'İmdat', sounds: 'eem-daht' },
      { english: 'Delicious', local: 'Lezzetli', romanized: 'Lezzetli', sounds: 'lez-zet-lee' },
      { english: 'Bill please', local: 'Hesap, lütfen', romanized: 'Hesap lütfen', sounds: 'heh-sahp loot-fen' },
      { english: "I'm vegetarian", local: 'Ben vejetaryenim', romanized: 'Ben vejetaryenim', sounds: 'ben veh-zheh-tar-yeh-neem' },
      { english: 'No meat please', local: 'Etsiz, lütfen', romanized: 'Etsiz lütfen', sounds: 'et-seez loot-fen' },
      { english: 'Bathroom', local: 'Tuvalet', romanized: 'Tuvalet', sounds: 'too-vah-let' },
      { english: 'Train station', local: 'Tren istasyonu', romanized: 'Tren istasyonu', sounds: 'tren ees-tahs-yoh-noo' },
      { english: 'Beautiful', local: 'Güzel', romanized: 'Güzel', sounds: 'goo-zel' },
      { english: 'Sorry', local: 'Özür dilerim', romanized: 'Özür dilerim', sounds: 'oh-zoor dee-leh-reem' },
      { english: 'Good morning', local: 'Günaydın', romanized: 'Günaydın', sounds: 'goo-nai-duhn' },
      { english: 'Goodbye', local: 'Hoşça kal', romanized: 'Hoşça kal', sounds: 'hosh-chah kahl' },
      { english: 'Water', local: 'Su', romanized: 'Su', sounds: 'soo' },
      { english: "I'm lost", local: 'Kayboldum', romanized: 'Kayboldum', sounds: 'kai-bol-doom' },
    ],
  },
  {
    language: 'Arabic',
    countries: 'Egypt / Morocco / Jordan / UAE',
    flag: '🇪🇬',
    phrases: [
      { english: 'Hello', local: 'مرحبا', romanized: 'Marhaba', sounds: 'mar-hah-bah' },
      { english: 'Thank you', local: 'شكرا', romanized: 'Shukran', sounds: 'shoo-krahn' },
      { english: 'Excuse me', local: 'عفوا', romanized: 'Afwan', sounds: 'af-wahn' },
      { english: 'How much?', local: 'بكم؟', romanized: 'Bikam', sounds: 'bee-kahm' },
      { english: 'Where is...?', local: 'أين...؟', romanized: 'Ayna', sounds: 'ay-nah' },
      { english: "I don't understand", local: 'لا أفهم', romanized: 'La afham', sounds: 'lah af-ham' },
      { english: 'Yes / No', local: 'نعم / لا', romanized: 'Naam / La', sounds: 'nah-ahm / lah' },
      { english: 'Help!', local: 'ساعدوني!', romanized: 'Sa\'idooni', sounds: 'sah-ee-doo-nee' },
      { english: 'Delicious', local: 'لذيذ', romanized: 'Ladheedh', sounds: 'lah-zeez' },
      { english: 'Bill please', local: 'الحساب من فضلك', romanized: 'Al-hisab min fadlak', sounds: 'al-hee-sahb min fahd-lahk' },
      { english: "I'm vegetarian", local: 'أنا نباتي', romanized: 'Ana nabati', sounds: 'ah-nah nah-bah-tee' },
      { english: 'No meat please', local: 'بدون لحم من فضلك', romanized: 'Bidoun lahm min fadlak', sounds: 'bee-doon lahm min fahd-lahk' },
      { english: 'Bathroom', local: 'حمام', romanized: 'Hammam', sounds: 'hahm-mahm' },
      { english: 'Train station', local: 'محطة القطار', romanized: 'Mahattat al-qitar', sounds: 'mah-hat-tat al-kee-tar' },
      { english: 'Beautiful', local: 'جميل', romanized: 'Jameel', sounds: 'jah-meel' },
      { english: 'Sorry', local: 'آسف', romanized: 'Aasif', sounds: 'ah-sef' },
      { english: 'Good morning', local: 'صباح الخير', romanized: 'Sabah al-khayr', sounds: 'sah-bah al-khair' },
      { english: 'Goodbye', local: 'مع السلامة', romanized: 'Ma\'a salama', sounds: 'mah-ah sah-lah-mah' },
      { english: 'Water', local: 'ماء', romanized: 'Maa\'', sounds: 'mah' },
      { english: "I'm lost", local: 'أنا تائه', romanized: 'Ana ta\'ih', sounds: 'ah-nah tah-eeh' },
    ],
  },
  {
    language: 'Greek',
    countries: 'Greece / Cyprus',
    flag: '🇬🇷',
    phrases: [
      { english: 'Hello', local: 'Γεια σας', romanized: 'Yia sas', sounds: 'yah sahs' },
      { english: 'Thank you', local: 'Ευχαριστώ', romanized: 'Efcharistó', sounds: 'ef-hah-ree-stoh' },
      { english: 'Excuse me', local: 'Συγγνώμη', romanized: 'Signómi', sounds: 'see-gnoh-mee' },
      { english: 'How much?', local: 'Πόσο κάνει;', romanized: 'Póso kánei', sounds: 'poh-soh kah-nee' },
      { english: 'Where is...?', local: 'Πού είναι...;', romanized: 'Poú eínai', sounds: 'poo ee-neh' },
      { english: "I don't understand", local: 'Δεν καταλαβαίνω', romanized: 'Den katalavéno', sounds: 'den kah-tah-lah-veh-noh' },
      { english: 'Yes / No', local: 'Ναι / Όχι', romanized: 'Nai / Óchi', sounds: 'neh / oh-hee' },
      { english: 'Help!', local: 'Βοήθεια!', romanized: 'Voítheia', sounds: 'voh-ee-thee-ah' },
      { english: 'Delicious', local: 'Νόστιμο', romanized: 'Nóstimo', sounds: 'noh-stee-moh' },
      { english: 'Bill please', local: 'Τον λογαριασμό', romanized: 'Ton logariasmó', sounds: 'ton loh-gah-ree-ahz-moh' },
      { english: "I'm vegetarian", local: 'Είμαι χορτοφάγος', romanized: 'Eímai chortofágos', sounds: 'ee-meh hor-toh-fah-gohs' },
      { english: 'No meat please', local: 'Χωρίς κρέας', romanized: 'Chorís kréas', sounds: 'hoh-rees kreh-ahs' },
      { english: 'Bathroom', local: 'Τουαλέτα', romanized: 'Toualéta', sounds: 'too-ah-leh-tah' },
      { english: 'Train station', local: 'Σταθμός τρένου', romanized: 'Stathmós trénou', sounds: 'stahth-mohs treh-noo' },
      { english: 'Beautiful', local: 'Όμορφο', romanized: 'Ómorfo', sounds: 'oh-mor-foh' },
      { english: 'Sorry', local: 'Συγγνώμη', romanized: 'Signómi', sounds: 'see-gnoh-mee' },
      { english: 'Good morning', local: 'Καλημέρα', romanized: 'Kaliméra', sounds: 'kah-lee-meh-rah' },
      { english: 'Goodbye', local: 'Αντίο', romanized: 'Antío', sounds: 'ahn-dee-oh' },
      { english: 'Water', local: 'Νερό', romanized: 'Neró', sounds: 'neh-roh' },
      { english: "I'm lost", local: 'Έχω χαθεί', romanized: 'Écho chatheí', sounds: 'eh-hoh hah-thee' },
    ],
  },
  {
    language: 'Indonesian',
    countries: 'Indonesia / Malaysia',
    flag: '🇮🇩',
    phrases: [
      { english: 'Hello', local: 'Halo', romanized: 'Halo', sounds: 'hah-loh' },
      { english: 'Thank you', local: 'Terima kasih', romanized: 'Terima kasih', sounds: 'teh-ree-mah kah-see' },
      { english: 'Excuse me', local: 'Permisi', romanized: 'Permisi', sounds: 'per-mee-see' },
      { english: 'How much?', local: 'Berapa?', romanized: 'Berapa', sounds: 'beh-rah-pah' },
      { english: 'Where is...?', local: '...di mana?', romanized: 'Di mana', sounds: 'dee mah-nah' },
      { english: "I don't understand", local: 'Saya tidak mengerti', romanized: 'Saya tidak mengerti', sounds: 'sah-yah tee-dahk men-ger-tee' },
      { english: 'Yes / No', local: 'Ya / Tidak', romanized: 'Ya / Tidak', sounds: 'yah / tee-dahk' },
      { english: 'Help!', local: 'Tolong!', romanized: 'Tolong', sounds: 'toh-long' },
      { english: 'Delicious', local: 'Enak', romanized: 'Enak', sounds: 'eh-nahk' },
      { english: 'Bill please', local: 'Minta bon', romanized: 'Minta bon', sounds: 'min-tah bon' },
      { english: "I'm vegetarian", local: 'Saya vegetarian', romanized: 'Saya vegetarian', sounds: 'sah-yah veh-geh-tah-ree-ahn' },
      { english: 'No meat please', local: 'Tanpa daging', romanized: 'Tanpa daging', sounds: 'tahn-pah dah-ging' },
      { english: 'Bathroom', local: 'Kamar mandi', romanized: 'Kamar mandi', sounds: 'kah-mar mahn-dee' },
      { english: 'Train station', local: 'Stasiun kereta', romanized: 'Stasiun kereta', sounds: 'stah-see-oon keh-reh-tah' },
      { english: 'Beautiful', local: 'Indah', romanized: 'Indah', sounds: 'een-dah' },
      { english: 'Sorry', local: 'Maaf', romanized: 'Maaf', sounds: 'mah-ahf' },
      { english: 'Good morning', local: 'Selamat pagi', romanized: 'Selamat pagi', sounds: 'seh-lah-maht pah-gee' },
      { english: 'Goodbye', local: 'Selamat tinggal', romanized: 'Selamat tinggal', sounds: 'seh-lah-maht ting-gahl' },
      { english: 'Water', local: 'Air', romanized: 'Air', sounds: 'ah-eer' },
      { english: "I'm lost", local: 'Saya tersesat', romanized: 'Saya tersesat', sounds: 'sah-yah ter-seh-saht' },
    ],
  },
  {
    language: 'Vietnamese',
    countries: 'Vietnam',
    flag: '🇻🇳',
    phrases: [
      { english: 'Hello', local: 'Xin chào', romanized: 'Xin chào', sounds: 'sin chow' },
      { english: 'Thank you', local: 'Cảm ơn', romanized: 'Cảm ơn', sounds: 'kahm uhn' },
      { english: 'Excuse me', local: 'Xin lỗi', romanized: 'Xin lỗi', sounds: 'sin loy' },
      { english: 'How much?', local: 'Bao nhiêu?', romanized: 'Bao nhiêu', sounds: 'bow nyew' },
      { english: 'Where is...?', local: '...ở đâu?', romanized: 'Ở đâu', sounds: 'uh doh' },
      { english: "I don't understand", local: 'Tôi không hiểu', romanized: 'Tôi không hiểu', sounds: 'toy kohng hee-oh' },
      { english: 'Yes / No', local: 'Vâng / Không', romanized: 'Vâng / Không', sounds: 'vung / kohng' },
      { english: 'Help!', local: 'Cứu tôi!', romanized: 'Cứu tôi', sounds: 'koo-oo toy' },
      { english: 'Delicious', local: 'Ngon', romanized: 'Ngon', sounds: 'ngon' },
      { english: 'Bill please', local: 'Tính tiền', romanized: 'Tính tiền', sounds: 'tin tee-en' },
      { english: "I'm vegetarian", local: 'Tôi ăn chay', romanized: 'Tôi ăn chay', sounds: 'toy ahn chai' },
      { english: 'No meat please', local: 'Không thịt', romanized: 'Không thịt', sounds: 'kohng tit' },
      { english: 'Bathroom', local: 'Nhà vệ sinh', romanized: 'Nhà vệ sinh', sounds: 'nyah vay sin' },
      { english: 'Train station', local: 'Ga tàu', romanized: 'Ga tàu', sounds: 'gah tow' },
      { english: 'Beautiful', local: 'Đẹp', romanized: 'Đẹp', sounds: 'dehp' },
      { english: 'Sorry', local: 'Xin lỗi', romanized: 'Xin lỗi', sounds: 'sin loy' },
      { english: 'Good morning', local: 'Chào buổi sáng', romanized: 'Chào buổi sáng', sounds: 'chow boo-oy sahng' },
      { english: 'Goodbye', local: 'Tạm biệt', romanized: 'Tạm biệt', sounds: 'tahm bee-et' },
      { english: 'Water', local: 'Nước', romanized: 'Nước', sounds: 'nook' },
      { english: "I'm lost", local: 'Tôi bị lạc', romanized: 'Tôi bị lạc', sounds: 'toy bee lahk' },
    ],
  },
]

/* ──────────────────────────────────────────────
   EMERGENCY DATA
   ────────────────────────────────────────────── */

interface EmergencyPhrase {
  language: string
  flag: string
  doctor: string
  police: string
  allergic: string
  emergencyNumber: string
}

const emergencyData: EmergencyPhrase[] = [
  { language: 'Japanese', flag: '🇯🇵', doctor: '医者が必要です (Isha ga hitsuyou desu)', police: '警察を呼んでください (Keisatsu wo yonde kudasai)', allergic: 'アレルギー反応が出ています (Arerugii hannou ga dete imasu)', emergencyNumber: '110 (Police) / 119 (Ambulance)' },
  { language: 'Spanish', flag: '🇪🇸', doctor: 'Necesito un médico', police: 'Llame a la policía', allergic: 'Estoy teniendo una reacción alérgica', emergencyNumber: '112 (Europe) / 911 (Mexico)' },
  { language: 'French', flag: '🇫🇷', doctor: "J'ai besoin d'un médecin", police: 'Appelez la police', allergic: "Je fais une réaction allergique", emergencyNumber: '112 / 15 (SAMU)' },
  { language: 'Italian', flag: '🇮🇹', doctor: 'Ho bisogno di un medico', police: 'Chiamate la polizia', allergic: 'Sto avendo una reazione allergica', emergencyNumber: '112 / 118 (Ambulance)' },
  { language: 'German', flag: '🇩🇪', doctor: 'Ich brauche einen Arzt', police: 'Rufen Sie die Polizei', allergic: 'Ich habe eine allergische Reaktion', emergencyNumber: '112' },
  { language: 'Thai', flag: '🇹🇭', doctor: 'ต้องการหมอ (Tong kaan moh)', police: 'เรียกตำรวจ (Riak tamruat)', allergic: 'แพ้อาหาร (Phae aahaan)', emergencyNumber: '191 (Police) / 1669 (Ambulance)' },
  { language: 'Hindi', flag: '🇮🇳', doctor: 'मुझे डॉक्टर चाहिए (Mujhe doctor chahiye)', police: 'पुलिस को बुलाओ (Police ko bulao)', allergic: 'मुझे एलर्जी हो रही है (Mujhe allergy ho rahi hai)', emergencyNumber: '100 (Police) / 108 (Ambulance)' },
  { language: 'Mandarin', flag: '🇨🇳', doctor: '我需要医生 (Wǒ xūyào yīshēng)', police: '请叫警察 (Qǐng jiào jǐngchá)', allergic: '我过敏了 (Wǒ guòmǐn le)', emergencyNumber: '110 (Police) / 120 (Ambulance)' },
  { language: 'Korean', flag: '🇰🇷', doctor: '의사가 필요해요 (Uisaga pilyohaeyo)', police: '경찰을 불러주세요 (Gyeongchareul bulleojuseyo)', allergic: '알레르기 반응이에요 (Allereugi baneungi-eyo)', emergencyNumber: '112 (Police) / 119 (Ambulance)' },
  { language: 'Portuguese', flag: '🇵🇹', doctor: 'Preciso de um médico', police: 'Chame a polícia', allergic: 'Estou tendo uma reação alérgica', emergencyNumber: '112 (Portugal) / 190 (Brazil)' },
  { language: 'Turkish', flag: '🇹🇷', doctor: 'Bir doktora ihtiyacım var', police: 'Polis çağırın', allergic: 'Alerjik reaksiyon geçiriyorum', emergencyNumber: '112 / 155 (Police)' },
  { language: 'Arabic', flag: '🇪🇬', doctor: 'أحتاج طبيب (Ahtaj tabeeb)', police: 'اتصل بالشرطة (Ittasil bish-shurta)', allergic: 'عندي حساسية (Indi hasasiya)', emergencyNumber: '122 (Egypt) / 999 (UAE)' },
  { language: 'Greek', flag: '🇬🇷', doctor: 'Χρειάζομαι γιατρό (Chriázomai giatró)', police: 'Καλέστε την αστυνομία (Kaléste tin astinomía)', allergic: 'Έχω αλλεργική αντίδραση (Écho allergikí antídrasi)', emergencyNumber: '112 / 100 (Police)' },
  { language: 'Indonesian', flag: '🇮🇩', doctor: 'Saya butuh dokter', police: 'Panggil polisi', allergic: 'Saya mengalami reaksi alergi', emergencyNumber: '110 (Police) / 118 (Ambulance)' },
  { language: 'Vietnamese', flag: '🇻🇳', doctor: 'Tôi cần bác sĩ', police: 'Gọi cảnh sát', allergic: 'Tôi bị dị ứng', emergencyNumber: '113 (Police) / 115 (Ambulance)' },
]

/* ──────────────────────────────────────────────
   VEGETARIAN / HALAL CARDS
   ────────────────────────────────────────────── */

const vegetarianCards = [
  { language: 'Japanese', text: '私は肉も魚も食べません。野菜だけお願いします。', romanized: 'Watashi wa niku mo sakana mo tabemasen. Yasai dake onegaishimasu.' },
  { language: 'Spanish', text: 'No como carne ni pescado. Solo vegetales, por favor.', romanized: '' },
  { language: 'French', text: 'Je ne mange ni viande ni poisson. Seulement des légumes, s\'il vous plaît.', romanized: '' },
  { language: 'Italian', text: 'Non mangio carne né pesce. Solo verdure, per favore.', romanized: '' },
  { language: 'German', text: 'Ich esse kein Fleisch und keinen Fisch. Nur Gemüse, bitte.', romanized: '' },
  { language: 'Thai', text: 'ฉันไม่กินเนื้อสัตว์และปลา กินแต่ผักเท่านั้น', romanized: 'Chan mai gin neua sat lae pla. Gin tae pak thao nan.' },
  { language: 'Hindi', text: 'मैं मांस और मछली नहीं खाता/खाती। सिर्फ शाकाहारी खाना चाहिए।', romanized: 'Main mans aur machli nahi khata. Sirf shakahari khana chahiye.' },
  { language: 'Mandarin', text: '我不吃肉也不吃鱼。请只给我蔬菜。', romanized: 'Wǒ bù chī ròu yě bù chī yú. Qǐng zhǐ gěi wǒ shūcài.' },
  { language: 'Korean', text: '고기와 생선을 먹지 않습니다. 채소만 주세요.', romanized: 'Gogiwa saengseon-eul meokji anhseumnida. Chaesoman juseyo.' },
  { language: 'Portuguese', text: 'Não como carne nem peixe. Apenas vegetais, por favor.', romanized: '' },
  { language: 'Turkish', text: 'Et ve balık yemiyorum. Sadece sebze, lütfen.', romanized: '' },
  { language: 'Arabic', text: 'أنا لا آكل اللحم ولا السمك. خضروات فقط من فضلك.', romanized: 'Ana la aakul al-lahm wa la al-samak. Khudrawat faqat min fadlak.' },
  { language: 'Greek', text: 'Δεν τρώω κρέας ούτε ψάρι. Μόνο λαχανικά, παρακαλώ.', romanized: 'Den tróo kréas oúte psári. Móno lachaniká, parakaló.' },
  { language: 'Indonesian', text: 'Saya tidak makan daging dan ikan. Hanya sayuran, tolong.', romanized: '' },
  { language: 'Vietnamese', text: 'Tôi không ăn thịt và cá. Chỉ rau thôi.', romanized: '' },
]

const halalCards = [
  { language: 'Arabic', text: 'هل هذا حلال؟', romanized: 'Hal hadha halal?' },
  { language: 'Turkish', text: 'Bu helal mi?', romanized: '' },
  { language: 'Indonesian', text: 'Apakah ini halal?', romanized: '' },
  { language: 'French', text: 'Est-ce que c\'est halal ?', romanized: '' },
  { language: 'German', text: 'Ist das halal?', romanized: '' },
  { language: 'Spanish', text: '¿Esto es halal?', romanized: '' },
  { language: 'Thai', text: 'อาหารนี้ฮาลาลไหม?', romanized: 'Aahaan nee halal mai?' },
  { language: 'Hindi', text: 'क्या यह हलाल है?', romanized: 'Kya yeh halal hai?' },
  { language: 'Mandarin', text: '这个是清真的吗？', romanized: 'Zhège shì qīngzhēn de ma?' },
  { language: 'Japanese', text: 'ハラールですか？', romanized: 'Haraaru desu ka?' },
]

/* ──────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────── */

export default function LanguageToolkitPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(0)
  const [phraseSearch, setPhraseSearch] = useState('')
  const [expandedEmergency, setExpandedEmergency] = useState(false)
  const [showVegCards, setShowVegCards] = useState(false)
  const [showHalalCards, setShowHalalCards] = useState(false)

  const current = languages[selectedLanguage]
  const filteredPhrases = current.phrases.filter(
    (p) =>
      p.english.toLowerCase().includes(phraseSearch.toLowerCase()) ||
      p.local.includes(phraseSearch) ||
      p.romanized.toLowerCase().includes(phraseSearch.toLowerCase())
  )

  return (
    <div style={{ background: '#FAFBFC', color: '#0F172A', minHeight: '100vh' }}>
      {/* ── HERO ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
          color: '#fff',
          padding: '80px 24px 64px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🗣️</p>
        <h1
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.15,
            margin: '0 auto 16px',
            maxWidth: '720px',
          }}
        >
          Never Be Lost for Words
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            opacity: 0.92,
            maxWidth: '600px',
            margin: '0 auto 32px',
            lineHeight: 1.5,
          }}
        >
          Your Travel Communication Toolkit — essential phrases, translation tech, emergency
          communication, and restaurant survival for 15 languages.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#phrases" style={{ background: '#F59E0B', color: '#0F172A', padding: '14px 28px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}>
            Essential Phrases
          </a>
          <a href="#emergency" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', fontSize: '15px', border: '1px solid rgba(255,255,255,0.3)' }}>
            Emergency Guide
          </a>
        </div>
      </section>

      {/* ── SECTION 2: ESSENTIAL PHRASES ── */}
      <section id="phrases" style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#0F172A',
          }}
        >
          Essential Phrases Per Country
        </h2>
        <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
          Select a language below. Each phrase card is large enough to show to a local — just hold
          up your phone.
        </p>

        {/* Country selector */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <select
            value={selectedLanguage}
            onChange={(e) => { setSelectedLanguage(Number(e.target.value)); setPhraseSearch('') }}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '2px solid #E2E8F0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#0F172A',
              background: '#fff',
              cursor: 'pointer',
              minWidth: '260px',
            }}
          >
            {languages.map((l, i) => (
              <option key={l.language} value={i}>
                {l.flag} {l.language} — {l.countries}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter phrases..."
            value={phraseSearch}
            onChange={(e) => setPhraseSearch(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '2px solid #E2E8F0',
              fontSize: '15px',
              color: '#0F172A',
              background: '#fff',
              flex: 1,
              minWidth: '180px',
            }}
          />
        </div>

        {/* Language quick-select pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {languages.map((l, i) => (
            <button
              key={l.language}
              onClick={() => { setSelectedLanguage(i); setPhraseSearch('') }}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedLanguage === i ? '#0EA5E9' : '#E2E8F0',
                color: selectedLanguage === i ? '#fff' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              {l.flag} {l.language}
            </button>
          ))}
        </div>

        {/* Current language header */}
        <div
          style={{
            background: '#fff',
            border: '2px solid #0EA5E9',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '40px' }}>{current.flag}</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', fontWeight: 700, margin: 0 }}>
              {current.language}
            </h3>
            <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '14px' }}>
              Spoken in: {current.countries} — {current.phrases.length} essential phrases
            </p>
          </div>
        </div>

        {/* Phrase cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: '16px' }}>
          {filteredPhrases.map((phrase, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {phrase.english}
                </span>
                <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: '6px' }}>
                  #{idx + 1}
                </span>
              </div>
              <p
                style={{
                  fontSize: 'clamp(22px, 3vw, 28px)',
                  fontWeight: 700,
                  margin: '0 0 6px',
                  lineHeight: 1.3,
                  color: '#0F172A',
                }}
              >
                {phrase.local}
              </p>
              <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 4px', fontStyle: 'italic' }}>
                {phrase.romanized}
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: '#0EA5E9',
                  margin: 0,
                  background: '#F0F9FF',
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              >
                Sounds like: &ldquo;{phrase.sounds}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {filteredPhrases.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94A3B8', padding: '40px', fontSize: '16px' }}>
            No phrases match your filter. Try a different search term.
          </p>
        )}
      </section>

      {/* ── SECTION 3: TRANSLATION TOOLS & TECHNOLOGY ── */}
      <section style={{ background: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            Translation Tools & Technology
          </h2>
          <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
            Download these before you leave. They will save you dozens of times.
          </p>

          {/* Apps */}
          <h3
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '22px',
              fontWeight: 700,
              marginBottom: '20px',
              color: '#0F172A',
            }}
          >
            Apps to Download Before You Go
          </h3>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '48px' }}>
            {[
              {
                name: 'Google Translate',
                price: 'Free',
                platforms: 'iOS & Android',
                description: 'Camera mode translates signs and menus in real-time. Download offline language packs. Conversation mode for two-way translation.',
                proTip: 'Download the language pack BEFORE you leave. In airplane mode, it still works. Camera translation on restaurant menus is a game changer in Japan, China, and Korea.',
                color: '#4285F4',
              },
              {
                name: 'Apple Translate',
                price: 'Free',
                platforms: 'iOS only',
                description: 'Built into every iPhone. Works fully offline after downloading language packs. Clean conversation mode with side-by-side translations.',
                proTip: 'Access it from the share sheet in Safari to translate entire web pages instantly.',
                color: '#007AFF',
              },
              {
                name: 'iTranslate',
                price: 'Free / Premium',
                platforms: 'iOS & Android',
                description: 'Better voice quality than competitors. Premium unlocks camera translation for menus and signs.',
                proTip: 'The voice output is clearer and more natural-sounding than most alternatives.',
                color: '#00C853',
              },
              {
                name: 'Papago',
                price: 'Free',
                platforms: 'iOS & Android',
                description: 'Made by Naver (the Korean equivalent of Google). Best-in-class for Korean, Japanese, and Chinese translation. Understands context better.',
                proTip: 'If you are going anywhere in East Asia, this is the one app you cannot skip.',
                color: '#1EC800',
              },
              {
                name: 'Microsoft Translator',
                price: 'Free',
                platforms: 'iOS & Android',
                description: 'Unique group conversation feature — multiple phones can join the same session and everyone sees translations in their own language.',
                proTip: 'Perfect for group dinners with locals. Everyone joins the same room and speaks their own language.',
                color: '#00A4EF',
              },
              {
                name: 'DeepL',
                price: 'Free / Pro',
                platforms: 'iOS & Android',
                description: 'Most accurate translator for European languages. Consistently outperforms Google Translate for French, German, Spanish, Italian, and Portuguese.',
                proTip: 'For anything beyond casual phrases in European languages, use DeepL over Google. The difference in quality is noticeable.',
                color: '#042B48',
              },
            ].map((app) => (
              <div
                key={app.name}
                style={{
                  background: '#FAFBFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: app.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '18px',
                      }}
                    >
                      {app.name[0]}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{app.name}</h4>
                      <span style={{ fontSize: '13px', color: '#64748B' }}>{app.price} | {app.platforms}</span>
                    </div>
                  </div>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
                  {app.description}
                </p>
                <div
                  style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#92400E',
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Pro tip:</strong> {app.proTip}
                </div>
              </div>
            ))}
          </div>

          {/* Hardware & Wearables */}
          <h3
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '22px',
              fontWeight: 700,
              marginBottom: '20px',
              color: '#0F172A',
            }}
          >
            Hardware & Wearables
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: '16px' }}>
            {[
              {
                name: 'Meta Ray-Ban Smart Glasses',
                price: '~$300+',
                desc: 'Real-time translation through smart glasses. Say what you want in English and it speaks the local language through the built-in speaker. Not everyone has them, but if you do, it feels like magic.',
                icon: '🕶️',
              },
              {
                name: 'Timekettle WT2 Edge',
                price: '~$200',
                desc: 'Earbuds that translate in real-time. Both people wear one earbud and speak naturally. Supports 40+ languages with high accuracy.',
                icon: '🎧',
              },
              {
                name: 'Pocketalk',
                price: '~$180',
                desc: 'Dedicated translation device supporting 82 languages. Has its own cellular SIM, so it works without Wi-Fi. Great for elderly travelers who are not comfortable with phone apps.',
                icon: '📱',
              },
              {
                name: 'Google Pixel Buds',
                price: '~$100-$200',
                desc: 'Real-time translation through Google Translate integration. Tap and hold the earbud, speak, and it translates through your phone speaker for the other person.',
                icon: '🎵',
              },
            ].map((hw) => (
              <div
                key={hw.name}
                style={{
                  background: '#FAFBFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{hw.icon}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>{hw.name}</h4>
                    <span style={{ fontSize: '14px', color: '#0EA5E9', fontWeight: 600 }}>{hw.price}</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
                  {hw.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: COMMUNICATION WITHOUT WORDS ── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          Communication Without Words
        </h2>
        <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
          When technology fails or is not available, these non-verbal techniques will get you through.
        </p>

        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Point and speak */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>👆</span> Point-and-Speak Cards
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
              Printable cards with pictures of common food items, directions, numbers, and essential needs. Point at what you want and show it to a local. Works surprisingly well in markets and street food stalls.
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '15px', lineHeight: 1.8, color: '#475569' }}>
              <li>Create cards with pictures of: chicken, fish, beef, rice, noodles, vegetables, eggs, water, beer, coffee, tea</li>
              <li>Include numbers 1-10 with large, clear digits</li>
              <li>Add directional arrows: left, right, straight, stop</li>
            </ul>
          </div>

          {/* Universal gestures */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🤝</span> Universal Gestures
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
              Some gestures work almost everywhere. Others can get you in trouble. Know the difference.
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '15px', lineHeight: 1.8, color: '#475569' }}>
              <li><strong>Thumbs up</strong> — Positive in most places, but considered rude in parts of the Middle East, West Africa, and Greece</li>
              <li><strong>Pointing at items</strong> — Generally safe. Use an open hand (palm up) instead of a finger in Southeast Asia</li>
              <li><strong>Using fingers for numbers</strong> — Works, but note that Germans start counting on the thumb (1 = thumb), not the index finger</li>
              <li><strong>Waving for the bill</strong> — Scribble-on-palm gesture is understood in most restaurants worldwide</li>
            </ul>
          </div>

          {/* Show your phone */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>📱</span> Show Your Phone
            </h3>
            <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '15px', lineHeight: 1.8, color: '#475569' }}>
              <li><strong>Google Maps</strong> — Show the map pin of where you want to go to a taxi driver. More effective than any phrase.</li>
              <li><strong>Hotel photo</strong> — Screenshot your hotel entrance, lobby, and sign. Show it to taxi drivers.</li>
              <li><strong>Food photos</strong> — Take a photo of a dish you loved and show it at the next restaurant. &ldquo;I want this.&rdquo;</li>
              <li><strong>Google Lens</strong> — Point your camera at any sign, menu, or label and get instant translation.</li>
            </ul>
          </div>

          {/* Body language differences */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '2px solid #F59E0B', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span> Body Language Differences by Culture
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
              These cultural differences catch travelers off guard constantly. Memorize the ones for your destination.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { region: '🇮🇳 India', note: 'The head wobble (side-to-side tilt) means "yes" or "okay" — not "no." It confused every first-time visitor.' },
                { region: '🇯🇵 Japan', note: 'Bowing depth matters. A slight nod is casual. A 30-degree bow is respectful. A 45-degree bow is very formal or apologetic. When in doubt, match the depth of the person you are greeting.' },
                { region: '🇹🇭 Thailand', note: 'The "wai" greeting — palms pressed together at chest level with a slight bow. Higher hands = more respect. Do not wai to children or service staff (they wai you).' },
                { region: '🇸🇦 Middle East', note: 'The left hand is considered unclean. Always eat, shake hands, and pass objects with your right hand.' },
                { region: '🇧🇬 Bulgaria / 🇬🇷 Greece', note: 'In Bulgaria, nodding your head means "no" and shaking your head means "yes." This is the opposite of most of the world. In parts of Greece, an upward head nod also means "no."' },
              ].map((item) => (
                <div
                  key={item.region}
                  style={{
                    background: '#FFFBEB',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#334155',
                  }}
                >
                  <strong style={{ color: '#92400E' }}>{item.region}:</strong> {item.note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: RESTAURANT SURVIVAL GUIDE ── */}
      <section style={{ background: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            Restaurant Survival Guide
          </h2>
          <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
            How to order food when you cannot read the menu. These techniques work everywhere.
          </p>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
            {[
              {
                title: 'Point at What Someone Else Is Eating',
                desc: 'The most reliable technique worldwide. See a dish that looks good at another table? Point at it and gesture to the waiter. They understand immediately. In Japan you can say "are to onaji" (same as that one).',
                icon: '👉',
              },
              {
                title: 'Ask for the Recommendation',
                desc: 'In Japan, say "osusume wa?" (what do you recommend?). In Spanish: "Qué recomienda?" In French: "Qu\'est-ce que vous recommandez?" Staff love recommending their favorites.',
                icon: '⭐',
              },
              {
                title: 'Look for Picture Menus',
                desc: 'Many restaurants in tourist areas have picture menus. In Japan, most restaurants display incredibly realistic plastic food replicas (sampuru) in their windows. Point at those.',
                icon: '🖼️',
              },
              {
                title: 'Use Google Lens on the Menu',
                desc: 'Open Google Lens (or Google Translate camera mode), point at the menu, and get an instant translation overlaid on the text. This single feature has rescued millions of travelers.',
                icon: '📷',
              },
            ].map((tip) => (
              <div
                key={tip.title}
                style={{
                  background: '#FAFBFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                }}
              >
                <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{tip.icon}</span> {tip.title}
                </h4>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Food allergy card */}
          <div
            style={{
              background: '#FEF2F2',
              borderRadius: '14px',
              border: '2px solid #FCA5A5',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 12px', color: '#B91C1C' }}>
              Food Allergy Card
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.6, color: '#7F1D1D' }}>
              If you have food allergies, create a card in the local language listing your specific allergies. Show it to the waiter before ordering. Many travel health sites offer printable allergy cards. This is not optional — it could save your life.
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#991B1B', fontWeight: 600 }}>
              Common allergens to list: peanuts, tree nuts, shellfish, fish, eggs, milk/dairy, wheat/gluten, soy, sesame
            </p>
          </div>

          {/* Vegetarian card */}
          <div
            style={{
              background: '#F0FDF4',
              borderRadius: '14px',
              border: '2px solid #86EFAC',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: 0, color: '#166534' }}>
                Vegetarian Card — &ldquo;I don&rsquo;t eat meat or fish&rdquo; in 15 Languages
              </h3>
              <button
                onClick={() => setShowVegCards(!showVegCards)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#22C55E',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {showVegCards ? 'Hide' : 'Show All'}
              </button>
            </div>
            {showVegCards && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: '12px' }}>
                {vegetarianCards.map((card) => (
                  <div
                    key={card.language}
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid #BBF7D0',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>
                      {card.language}
                    </span>
                    <p style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: 700, lineHeight: 1.4, color: '#0F172A' }}>
                      {card.text}
                    </p>
                    {card.romanized && (
                      <p style={{ margin: '4px 0 0', fontSize: '14px', fontStyle: 'italic', color: '#64748B' }}>
                        {card.romanized}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Halal card */}
          <div
            style={{
              background: '#FFF7ED',
              borderRadius: '14px',
              border: '2px solid #FDBA74',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: 0, color: '#9A3412' }}>
                Halal Card — &ldquo;Is this halal?&rdquo; in 10 Languages
              </h3>
              <button
                onClick={() => setShowHalalCards(!showHalalCards)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#F59E0B',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {showHalalCards ? 'Hide' : 'Show All'}
              </button>
            </div>
            {showHalalCards && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: '12px' }}>
                {halalCards.map((card) => (
                  <div
                    key={card.language}
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid #FED7AA',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#EA580C', textTransform: 'uppercase' }}>
                      {card.language}
                    </span>
                    <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 700, lineHeight: 1.4, color: '#0F172A' }}>
                      {card.text}
                    </p>
                    {card.romanized && (
                      <p style={{ margin: '4px 0 0', fontSize: '14px', fontStyle: 'italic', color: '#64748B' }}>
                        {card.romanized}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: EMERGENCY COMMUNICATION ── */}
      <section id="emergency" style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          Emergency Communication
        </h2>
        <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
          When you NEED to communicate and cannot afford mistakes. Save this section to your phone.
        </p>

        {/* Emergency numbers */}
        <div
          style={{
            background: '#FEF2F2',
            borderRadius: '14px',
            border: '2px solid #FCA5A5',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 16px', color: '#B91C1C' }}>
            Emergency Numbers by Country
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {[
              { region: 'Europe (all)', number: '112' },
              { region: 'USA / Canada', number: '911' },
              { region: 'Japan', number: '110 / 119' },
              { region: 'India', number: '100 / 108' },
              { region: 'Thailand', number: '191 / 1669' },
              { region: 'China', number: '110 / 120' },
              { region: 'South Korea', number: '112 / 119' },
              { region: 'Turkey', number: '112 / 155' },
              { region: 'Egypt', number: '122 / 123' },
              { region: 'UAE', number: '999' },
              { region: 'Indonesia', number: '110 / 118' },
              { region: 'Vietnam', number: '113 / 115' },
              { region: 'Brazil', number: '190 / 192' },
              { region: 'Australia', number: '000' },
              { region: 'UK', number: '999 / 112' },
            ].map((item) => (
              <div
                key={item.region}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  border: '1px solid #FECACA',
                }}
              >
                <span style={{ fontSize: '13px', color: '#991B1B', fontWeight: 600 }}>{item.region}</span>
                <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: '#DC2626', letterSpacing: '1px' }}>
                  {item.number}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency phrases toggle */}
        <div
          style={{
            background: '#fff',
            borderRadius: '14px',
            border: '2px solid #DC2626',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expandedEmergency ? '20px' : '0' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: 0, color: '#DC2626' }}>
              Emergency Phrases in 15 Languages
            </h3>
            <button
              onClick={() => setExpandedEmergency(!expandedEmergency)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#DC2626',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {expandedEmergency ? 'Collapse' : 'Show All 15 Languages'}
            </button>
          </div>

          {expandedEmergency && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {emergencyData.map((e) => (
                <div
                  key={e.language}
                  style={{
                    background: '#FEF2F2',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #FECACA',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '28px' }}>{e.flag}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{e.language}</h4>
                      <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: 600 }}>Emergency: {e.emergencyNumber}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>I need a doctor</span>
                      <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>{e.doctor}</p>
                    </div>
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>Call the police</span>
                      <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>{e.police}</p>
                    </div>
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>I&apos;m having an allergic reaction</span>
                      <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>{e.allergic}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Practical emergency tips */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            {
              title: 'Keep Your Hotel Address in Local Script',
              desc: 'Before you leave your hotel each day, take a photo of the hotel business card or ask the front desk to write the address in the local language. In countries with non-Latin scripts (Japan, China, Korea, Thailand, Arabic countries), this is essential for getting a taxi back.',
              icon: '🏨',
            },
            {
              title: 'Screenshot Your Hotel on Google Maps',
              desc: 'Drop a pin on your hotel in Google Maps and screenshot it. Even if you lose internet, you can show this to a taxi driver. Better yet, download offline maps for the city before you travel.',
              icon: '📍',
            },
            {
              title: 'Save Your Embassy Phone Number',
              desc: 'Before departure, save your country\'s embassy or consulate phone number for your destination. In a serious emergency (lost passport, arrest, hospitalization), they are your lifeline.',
              icon: '🏛️',
            },
          ].map((tip) => (
            <div
              key={tip.title}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '24px',
              }}
            >
              <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{tip.icon}</span> {tip.title}
              </h4>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: SIM CARD & INTERNET SETUP ── */}
      <section style={{ background: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            SIM Card & Internet Setup
          </h2>
          <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
            Internet access is the foundation of every other communication tool. A quick primer to get you connected.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#F0F9FF', borderRadius: '14px', padding: '24px', border: '1px solid #BAE6FD' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 700, color: '#0369A1' }}>
                Wi-Fi Calling
              </h4>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
                WhatsApp, FaceTime, and Telegram calls work everywhere there is Wi-Fi. No SIM card needed. Most hotels, cafes, and airports have free Wi-Fi for basic translation needs.
              </p>
            </div>
            <div style={{ background: '#F0F9FF', borderRadius: '14px', padding: '24px', border: '1px solid #BAE6FD' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 700, color: '#0369A1' }}>
                eSIM Setup
              </h4>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
                Takes 5 minutes. Services like Airalo, Holafly, and Nomad let you buy a data plan before you land. Install the eSIM, activate on arrival, and you have instant data. No physical SIM swapping.
              </p>
            </div>
            <div style={{ background: '#F0F9FF', borderRadius: '14px', padding: '24px', border: '1px solid #BAE6FD' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 700, color: '#0369A1' }}>
                Airport Wi-Fi
              </h4>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#334155' }}>
                Most international airports offer 30-60 minutes of free Wi-Fi. Use it to download offline translation packs, message your hotel, and set up your eSIM before stepping outside.
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#FFFBEB',
              borderRadius: '14px',
              border: '1px solid #FDE68A',
              padding: '20px 24px',
              fontSize: '15px',
              color: '#92400E',
              lineHeight: 1.6,
            }}
          >
            <strong>Bottom line:</strong> Do not leave your home country without internet access figured out. Translation apps, maps, ride-hailing, and emergency communication all depend on it. An eSIM costs $5-15 for a week of data in most countries. That is the best travel investment you can make.
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#fff',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          Bookmark This Page
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.8, maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Save this toolkit to your phone&rsquo;s home screen. When you are standing in a restaurant in Tokyo or negotiating in a market in Marrakech, you will be glad you did.
        </p>
        <p style={{ fontSize: '14px', opacity: 0.5 }}>
          WorldTourly — Language & Communication Toolkit
        </p>
      </section>
    </div>
  )
}

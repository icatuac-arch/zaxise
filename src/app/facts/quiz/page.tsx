'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Trophy, ChevronRight, Check, X, RotateCcw, Timer, Zap,
  ChevronLeft, Share2, Copy, Flame, Target, Award,
} from 'lucide-react'
import { useBadges } from '@/components/facts/BadgeDisplay'

/* ─── Types ─── */
interface QuizQuestion {
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  answer: number
  explainer: string
}

/* ─── 200+ Quiz Questions ─── */
const QUESTIONS: QuizQuestion[] = [
  // ── Space (20) ──
  { category: "Space", difficulty: "easy", question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1, explainer: "Mars appears red due to iron oxide (rust) on its surface." },
  { category: "Space", difficulty: "easy", question: "What is the closest star to Earth?", options: ["Proxima Centauri", "Sirius", "The Sun", "Alpha Centauri A"], answer: 2, explainer: "The Sun is about 150 million km away --- the nearest star by far." },
  { category: "Space", difficulty: "easy", question: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], answer: 1, explainer: "Since Pluto was reclassified in 2006, there are 8 recognized planets." },
  { category: "Space", difficulty: "medium", question: "Which planet has a day longer than its year?", options: ["Mars", "Mercury", "Venus", "Jupiter"], answer: 2, explainer: "Venus rotates so slowly that a single day outlasts its 225-Earth-day orbit." },
  { category: "Space", difficulty: "medium", question: "India's Chandrayaan-1 was the first mission to confirm what on the Moon?", options: ["Ice caves", "Water molecules", "Volcanic activity", "Magnetic fields"], answer: 1, explainer: "India's 2008 Chandrayaan-1 mission first confirmed water molecules on the Moon's surface." },
  { category: "Space", difficulty: "medium", question: "How fast does the International Space Station travel?", options: ["8,000 km/h", "18,000 km/h", "28,000 km/h", "38,000 km/h"], answer: 2, explainer: "The ISS orbits at about 28,000 km/h, circling Earth every 90 minutes." },
  { category: "Space", difficulty: "medium", question: "Which country launched the Hope probe to Mars in 2020?", options: ["India", "Japan", "UAE", "South Korea"], answer: 2, explainer: "The UAE's Hope probe made it the first Arab nation to reach Mars orbit." },
  { category: "Space", difficulty: "hard", question: "How many times per second can a neutron star spin?", options: ["Up to 10", "Up to 100", "Up to 716", "Up to 2,000"], answer: 2, explainer: "The fastest known neutron star spins 716 times per second." },
  { category: "Space", difficulty: "hard", question: "What does the space cloud Sagittarius B2 contain in vast quantities?", options: ["Methane", "Ethanol (alcohol)", "Ammonia", "Hydrogen peroxide"], answer: 1, explainer: "There's enough ethanol in Sagittarius B2 to fill 400 trillion trillion pints." },
  { category: "Space", difficulty: "hard", question: "China's Tiangong is the world's ___ crewed space station.", options: ["Second", "Third", "Fourth", "Fifth"], answer: 1, explainer: "Tiangong (completed 2022) is the third after Mir and the ISS." },
  { category: "Space", difficulty: "easy", question: "How many Earths could fit inside the Sun?", options: ["1,000", "10,000", "100,000", "1,000,000"], answer: 3, explainer: "About one million Earths could fit inside the Sun." },
  { category: "Space", difficulty: "medium", question: "Why will astronaut footprints last so long on the Moon?", options: ["They're very deep", "No wind or water to erode them", "Moon soil is sticky", "Low gravity preserves them"], answer: 1, explainer: "With no atmosphere, wind, or water, footprints could last 100 million years." },
  { category: "Space", difficulty: "easy", question: "Which planet could theoretically float in water?", options: ["Jupiter", "Neptune", "Saturn", "Uranus"], answer: 2, explainer: "Saturn's density is less than water --- it would float in a big enough bathtub." },

  // ── Animals (18) ──
  { category: "Animals", difficulty: "easy", question: "How many hearts does an octopus have?", options: ["1", "2", "3", "4"], answer: 2, explainer: "Two pump blood to the gills; the third sends it to the rest of the body." },
  { category: "Animals", difficulty: "easy", question: "Which animal produces cube-shaped poop?", options: ["Koala", "Wombat", "Platypus", "Echidna"], answer: 1, explainer: "Wombats are the only known animal to produce cube-shaped droppings." },
  { category: "Animals", difficulty: "easy", question: "What is a group of flamingos called?", options: ["A flock", "A flamboyance", "A flutter", "A parade"], answer: 1, explainer: "The collective noun for flamingos is a flamboyance." },
  { category: "Animals", difficulty: "medium", question: "Which are older --- sharks or trees?", options: ["Trees", "Sharks", "They appeared at the same time", "Neither existed before 200 million years ago"], answer: 1, explainer: "Sharks have existed for ~400 million years; trees appeared ~350 million years ago." },
  { category: "Animals", difficulty: "medium", question: "What can the Mexican axolotl regenerate?", options: ["Only its tail", "Only its limbs", "Its brain, heart, and limbs", "Only skin tissue"], answer: 2, explainer: "Axolotls can regenerate their brain, heart, and limbs throughout life." },
  { category: "Animals", difficulty: "medium", question: "How far does the bar-tailed godwit migrate nonstop?", options: ["3,000 km", "7,000 km", "11,000 km", "15,000 km"], answer: 2, explainer: "It flies over 11,000 km from Alaska to New Zealand without stopping." },
  { category: "Animals", difficulty: "hard", question: "How does the bombardier beetle defend itself?", options: ["Electric shock", "Venomous bite", "Spraying boiling chemicals at 100\u00b0C", "Ultrasonic screams"], answer: 2, explainer: "It sprays a boiling chemical mixture from its abdomen at 100\u00b0C." },
  { category: "Animals", difficulty: "hard", question: "What unique ability do Indian elephants have with human languages?", options: ["They can mimic words", "They distinguish between languages", "They respond to music", "They understand counting"], answer: 1, explainer: "They react differently to languages of groups that threaten them vs. those that don't." },
  { category: "Animals", difficulty: "medium", question: "What do cows have that affects their behavior when separated?", options: ["Favorite foods", "Best friends", "Sleeping partners", "Territorial instincts"], answer: 1, explainer: "Cows have best friends and become visibly stressed when separated." },
  { category: "Animals", difficulty: "hard", question: "How does the Komodo dragon actually kill its prey?", options: ["Crushing bite force", "Bacteria in saliva", "Venom glands", "Suffocation"], answer: 2, explainer: "Komodo dragons use venom glands, not bacteria as was long believed." },

  // ── Human Body (16) ──
  { category: "Human Body", difficulty: "easy", question: "What percentage of your body's energy does the brain use?", options: ["5%", "10%", "20%", "35%"], answer: 2, explainer: "Your brain uses ~20% of your energy despite being only ~2% of body weight." },
  { category: "Human Body", difficulty: "easy", question: "Roughly what percentage of DNA do humans share with bananas?", options: ["25%", "40%", "60%", "85%"], answer: 2, explainer: "About 60% --- the genes for basic cellular processes are deeply conserved." },
  { category: "Human Body", difficulty: "medium", question: "How often does your stomach lining replace itself?", options: ["Every day", "Every 3--4 days", "Every week", "Every month"], answer: 1, explainer: "Without replacement every 3--4 days, stomach acid would digest the organ." },
  { category: "Human Body", difficulty: "medium", question: "What special adaptation do Tibetan people have?", options: ["Extra lung capacity", "A gene for high-altitude survival", "Larger hearts", "Thicker blood"], answer: 1, explainer: "They have an EPAS1 gene variant inherited from Denisovans for high-altitude living." },
  { category: "Human Body", difficulty: "hard", question: "How many scents can the human nose detect?", options: ["About 10,000", "About 100,000", "About 1 million", "Over 1 trillion"], answer: 3, explainer: "The human nose can detect over one trillion distinct scents." },
  { category: "Human Body", difficulty: "hard", question: "What genetic adaptation do the Bajau people of Southeast Asia have?", options: ["Night vision", "Larger spleens for diving", "Webbed toes", "Enhanced hearing"], answer: 1, explainer: "They evolved larger spleens, allowing free-diving to 70 meters." },
  { category: "Human Body", difficulty: "easy", question: "Are humans bioluminescent?", options: ["No, never", "Yes, but too faint to see", "Only in ultraviolet", "Only when excited"], answer: 1, explainer: "We emit visible light about 1,000 times weaker than our eyes can detect." },
  { category: "Human Body", difficulty: "medium", question: "What is the strongest muscle in the body by weight?", options: ["Heart", "Tongue", "Masseter (jaw)", "Quadriceps"], answer: 2, explainer: "The masseter in your jaw is the strongest muscle relative to its weight." },

  // ── History (20) ──
  { category: "History", difficulty: "easy", question: "Who lived closer to the Moon landing --- Cleopatra or the Great Pyramid builders?", options: ["The Pyramid builders", "Cleopatra", "They're equidistant", "Neither is close"], answer: 1, explainer: "Cleopatra lived closer in time to the Moon landing than to the Pyramids." },
  { category: "History", difficulty: "easy", question: "Which is older --- Oxford University or the Aztec Empire?", options: ["Aztec Empire", "Oxford University", "They're the same age", "Neither existed before 1400"], answer: 1, explainer: "Oxford began teaching ~1096; the Aztec capital was founded in 1325." },
  { category: "History", difficulty: "easy", question: "How long did the shortest war in history last?", options: ["38--45 minutes", "6 hours", "1 day", "3 days"], answer: 0, explainer: "The Anglo-Zanzibar War of 1896 lasted between 38 and 45 minutes." },
  { category: "History", difficulty: "medium", question: "What did the Indus Valley Civilization have millennia before Rome?", options: ["Democracy", "Grid streets and sewage systems", "A written constitution", "Standing army"], answer: 1, explainer: "The Indus Valley (3300--1300 BCE) had grid streets, sewage, and public baths." },
  { category: "History", difficulty: "medium", question: "What happened when Mansa Musa visited Cairo in 1324?", options: ["He was imprisoned", "His gold spending crashed Egypt's economy", "He built a palace", "He declared war"], answer: 1, explainer: "He spent so much gold that Egypt's economy was destabilized for a decade." },
  { category: "History", difficulty: "medium", question: "Which civilization had flush toilets around 2500 BCE?", options: ["Roman Empire", "Ancient Egypt", "Indus Valley (Mohenjo-daro)", "Ancient Greece"], answer: 2, explainer: "Mohenjo-daro had sophisticated plumbing millennia before Rome." },
  { category: "History", difficulty: "medium", question: "Which country invented paper money?", options: ["India", "Rome", "China", "Persia"], answer: 2, explainer: "China invented paper money during the Tang Dynasty, ~700 years before Europe." },
  { category: "History", difficulty: "hard", question: "Which African country was never colonized by a European power?", options: ["Ghana", "Ethiopia", "Kenya", "Nigeria"], answer: 1, explainer: "Ethiopia defeated Italy at the Battle of Adwa in 1896." },
  { category: "History", difficulty: "hard", question: "What is the largest religious monument ever constructed?", options: ["St. Peter's Basilica", "Angkor Wat", "Hagia Sophia", "Borobudur"], answer: 1, explainer: "Angkor Wat in Cambodia was built by the Khmer Empire in the 12th century." },
  { category: "History", difficulty: "hard", question: "What was in the world's first known recipe (from ancient Sumer)?", options: ["Bread", "Beer", "Wine", "Stew"], answer: 1, explainer: "The oldest known recipe, from cuneiform tablets, was for beer." },
  { category: "History", difficulty: "medium", question: "How often is Japan's Ise Grand Shrine rebuilt?", options: ["Every 10 years", "Every 20 years", "Every 50 years", "Every 100 years"], answer: 1, explainer: "It has been ceremonially rebuilt every 20 years for over 1,300 years." },
  { category: "History", difficulty: "hard", question: "How large was the Aztec capital Tenochtitlan in 1500?", options: ["20,000 people", "80,000 people", "Over 200,000 people", "Over 1 million people"], answer: 2, explainer: "Tenochtitlan had over 200,000 people --- larger than most European cities." },

  // ── Geography (16) ──
  { category: "Geography", difficulty: "easy", question: "How many time zones does Russia span?", options: ["5", "9", "11", "14"], answer: 2, explainer: "Russia officially spans 11 time zones --- more than any other country." },
  { category: "Geography", difficulty: "easy", question: "Which is wider --- Australia or the Moon?", options: ["The Moon", "Australia", "They're about the same", "Depends on measurement"], answer: 1, explainer: "Australia is about 4,000 km across; the Moon's diameter is ~3,474 km." },
  { category: "Geography", difficulty: "medium", question: "Which continent lies in all four hemispheres?", options: ["Asia", "South America", "Africa", "Europe"], answer: 2, explainer: "Africa spans the northern, southern, eastern, and western hemispheres." },
  { category: "Geography", difficulty: "medium", question: "How much does Mount Everest grow each year?", options: ["0.5 mm", "4 mm", "2 cm", "10 cm"], answer: 1, explainer: "Pushed up by tectonic plate collision, Everest grows about 4 mm per year." },
  { category: "Geography", difficulty: "medium", question: "Which country has the most active volcanoes?", options: ["Japan", "Chile", "Indonesia", "Iceland"], answer: 2, explainer: "Indonesia has about 130 active volcanoes in the Pacific Ring of Fire." },
  { category: "Geography", difficulty: "hard", question: "What holds 20% of the world's unfrozen fresh surface water?", options: ["The Great Lakes", "The Amazon River", "Lake Baikal", "Lake Victoria"], answer: 2, explainer: "Russia's Lake Baikal holds more freshwater than all North American Great Lakes combined." },
  { category: "Geography", difficulty: "hard", question: "What was the Sahara Desert like 5,000 years ago?", options: ["Frozen tundra", "Green with lakes", "Shallow sea", "The same as today"], answer: 1, explainer: "The Sahara was green and covered in lakes, supporting hippos and early humans." },
  { category: "Geography", difficulty: "easy", question: "How does Bhutan measure national prosperity?", options: ["GDP per capita", "Trade volume", "Gross National Happiness", "Military strength"], answer: 2, explainer: "Bhutan uses Gross National Happiness, enshrined in its constitution." },
  { category: "Geography", difficulty: "medium", question: "Which is the only country lying entirely above 1,000 meters?", options: ["Nepal", "Bhutan", "Lesotho", "Bolivia"], answer: 2, explainer: "Lesotho is the only country entirely above 1,000 meters elevation." },
  { category: "Geography", difficulty: "hard", question: "In which direction did the Amazon River originally flow?", options: ["North", "South", "West (into Pacific)", "It has always flowed east"], answer: 2, explainer: "Before the Andes rose, the Amazon flowed westward into the Pacific." },

  // ── Science (14) ──
  { category: "Science", difficulty: "easy", question: "Does honey ever spoil?", options: ["Yes, after 1 year", "Yes, after 10 years", "No, it never spoils", "Only if unsealed"], answer: 2, explainer: "Edible honey has been found in 3,000-year-old Egyptian tombs." },
  { category: "Science", difficulty: "easy", question: "Are bananas radioactive?", options: ["No", "Slightly, due to potassium-40", "Only when ripe", "Only the peel"], answer: 1, explainer: "Bananas contain potassium-40, making them slightly radioactive (harmlessly so)." },
  { category: "Science", difficulty: "medium", question: "How hot is lightning compared to the Sun's surface?", options: ["Same temperature", "Twice as hot", "Five times hotter", "Ten times hotter"], answer: 2, explainer: "Lightning reaches ~30,000\u00b0C vs. the Sun's surface at ~5,500\u00b0C." },
  { category: "Science", difficulty: "medium", question: "What would a teaspoon of neutron star material weigh on Earth?", options: ["1 ton", "1 million tons", "6 billion tons", "1 trillion tons"], answer: 2, explainer: "A teaspoon of neutron star material weighs about 6 billion tons." },
  { category: "Science", difficulty: "medium", question: "What is the triple point of water?", options: ["When it boils and freezes at once", "When all three states coexist", "When it becomes plasma", "When it reaches maximum density"], answer: 1, explainer: "At a specific temperature and pressure, water exists as solid, liquid, and gas simultaneously." },
  { category: "Science", difficulty: "hard", question: "Who discovered the Raman Effect?", options: ["Niels Bohr", "C.V. Raman", "Max Planck", "Satyendra Nath Bose"], answer: 1, explainer: "India's C.V. Raman won the 1930 Nobel Prize for discovering light wavelength changes during scattering." },
  { category: "Science", difficulty: "hard", question: "What is the Mpemba effect?", options: ["Cold water boils faster", "Hot water can freeze faster than cold", "Ice melts faster in salt", "Steam condenses in sunlight"], answer: 1, explainer: "Named after Tanzanian student Erasto Mpemba, who noticed hot water sometimes freezes faster." },
  { category: "Science", difficulty: "medium", question: "Is glass a solid or a liquid?", options: ["Solid", "Liquid", "Amorphous solid", "Crystalline liquid"], answer: 2, explainer: "Glass is an amorphous solid --- molecules arranged like a liquid but moving extremely slowly." },
  { category: "Science", difficulty: "hard", question: "Who won a Nobel Prize by studying ancient Chinese herbal texts?", options: ["Shinya Yamanaka", "Tu Youyou", "Yoshinori Ohsumi", "Tasuku Honjo"], answer: 1, explainer: "Tu Youyou discovered artemisinin from ancient texts, saving millions from malaria." },

  // ── Technology (12) ──
  { category: "Technology", difficulty: "easy", question: "What was the first recorded computer 'bug'?", options: ["A typo", "A moth", "A power surge", "A loose wire"], answer: 1, explainer: "An actual moth was found in the Harvard Mark II in 1947." },
  { category: "Technology", difficulty: "easy", question: "Why was the first webcam invented?", options: ["Security", "Video calls", "To check a coffee pot", "Weather monitoring"], answer: 2, explainer: "Cambridge researchers created it in 1991 to check if the coffee pot was full." },
  { category: "Technology", difficulty: "medium", question: "Which country pioneered mobile money with M-Pesa?", options: ["India", "Nigeria", "Kenya", "South Africa"], answer: 2, explainer: "M-Pesa launched in Kenya in 2007 and now processes more transactions than Western Union globally." },
  { category: "Technology", difficulty: "medium", question: "Which country lets citizens vote online in national elections?", options: ["Sweden", "Estonia", "Singapore", "Japan"], answer: 1, explainer: "Estonia has offered online voting and e-residency to non-citizens since 2014." },
  { category: "Technology", difficulty: "hard", question: "What is the average delay of Japan's Shinkansen bullet trains per year?", options: ["Less than 1 minute", "About 5 minutes", "About 30 minutes", "About 1 hour"], answer: 0, explainer: "The Shinkansen has an average annual delay of less than one minute across the network." },
  { category: "Technology", difficulty: "medium", question: "Which is the world's largest biometric ID program?", options: ["China's Social Credit", "India's Aadhaar", "US Social Security", "EU Digital ID"], answer: 1, explainer: "India's Aadhaar covers over 1.3 billion people." },
  { category: "Technology", difficulty: "easy", question: "Why was the QWERTY keyboard designed that way?", options: ["For speed", "To prevent key jamming", "Random layout", "Alphabetical order modified"], answer: 1, explainer: "QWERTY was designed partly to slow typists down and prevent mechanical jams." },
  { category: "Technology", difficulty: "hard", question: "Which country uses drones for medical supply delivery to remote clinics?", options: ["Switzerland", "Australia", "Rwanda", "Japan"], answer: 2, explainer: "Rwanda uses one of the most advanced drone delivery networks in the world." },

  // ── Food (14) ──
  { category: "Food", difficulty: "easy", question: "What color were most carrots before the 17th century?", options: ["Orange", "White", "Purple", "Red"], answer: 2, explainer: "Purple was dominant until Dutch farmers bred the orange variant." },
  { category: "Food", difficulty: "easy", question: "Are peanuts actually nuts?", options: ["Yes", "No, they're legumes", "No, they're seeds", "No, they're tubers"], answer: 1, explainer: "Peanuts are legumes, more related to beans and lentils than walnuts." },
  { category: "Food", difficulty: "medium", question: "Which country is the birthplace of coffee?", options: ["Colombia", "Brazil", "Ethiopia", "Yemen"], answer: 2, explainer: "Legend says a goat herder named Kaldi in Ethiopia discovered coffee." },
  { category: "Food", difficulty: "medium", question: "How many native potato varieties does Peru have?", options: ["About 200", "About 1,000", "Over 4,000", "Over 10,000"], answer: 2, explainer: "Peru has over 4,000 native varieties, domesticated over 8,000 years ago." },
  { category: "Food", difficulty: "medium", question: "Which country produces 90% of the world's saffron?", options: ["India", "Spain", "Iran", "Turkey"], answer: 2, explainer: "Iran produces 90% of the world's saffron; 150,000 flowers make just 1 kg." },
  { category: "Food", difficulty: "hard", question: "Which country gave the world chocolate, tomatoes, vanilla, and avocados?", options: ["Peru", "Mexico", "Brazil", "Colombia"], answer: 1, explainer: "Mexico transformed global cuisine after 1492 with these ingredients." },
  { category: "Food", difficulty: "easy", question: "Was lobster always a luxury food?", options: ["Yes, always", "No, it was poverty food", "It was used as bait", "It was medicine"], answer: 1, explainer: "Lobster was routinely fed to prisoners and servants in colonial America." },
  { category: "Food", difficulty: "medium", question: "How many regional varieties of kimchi exist?", options: ["About 20", "About 50", "Over 200", "Over 500"], answer: 2, explainer: "Kimchi has over 200 regional varieties and is UNESCO-protected." },
  { category: "Food", difficulty: "hard", question: "Why is durian banned from many hotels in Southeast Asia?", options: ["Attracts insects", "Causes allergies", "Its potent smell", "It stains surfaces"], answer: 2, explainer: "Despite being called the 'King of Fruits,' its smell gets it banned from public spaces." },
  { category: "Food", difficulty: "hard", question: "How long does a single pineapple take to grow?", options: ["3 months", "6 months", "1 year", "About 2 years"], answer: 3, explainer: "A single pineapple plant produces just one fruit, taking about 2 years." },

  // ── Language (12) ──
  { category: "Language", difficulty: "easy", question: "What is the dot over a lowercase 'i' called?", options: ["A dot", "A tittle", "A jot", "A pip"], answer: 1, explainer: "The dot over i and j is technically called a tittle." },
  { category: "Language", difficulty: "easy", question: "Which English word has the most definitions?", options: ["Run", "Go", "Set", "Get"], answer: 2, explainer: "The word 'set' has over 400 distinct definitions in the OED." },
  { category: "Language", difficulty: "medium", question: "Which country has the most living languages?", options: ["India", "Indonesia", "Nigeria", "Papua New Guinea"], answer: 3, explainer: "Papua New Guinea has over 840 living languages with ~10 million people." },
  { category: "Language", difficulty: "medium", question: "What is unusual about Arabic numbers?", options: ["They go right to left", "They go left to right while text goes right to left", "They use different symbols daily", "They have no zero"], answer: 1, explainer: "Arabic text is right-to-left but numbers are left-to-right, creating bidirectional reading." },
  { category: "Language", difficulty: "hard", question: "How many letters does the Hawaiian alphabet have?", options: ["13", "18", "22", "26"], answer: 0, explainer: "Hawaiian has only 13 letters --- 8 consonants and 5 vowels." },
  { category: "Language", difficulty: "hard", question: "What is Silbo Gomero?", options: ["A dance form", "A whistled language", "An ancient script", "A counting system"], answer: 1, explainer: "The whistled language of La Gomera can be understood up to 5 km away across ravines." },
  { category: "Language", difficulty: "medium", question: "How many words did Shakespeare reportedly introduce to English?", options: ["About 200", "About 700", "Over 1,700", "Over 5,000"], answer: 2, explainer: "Shakespeare is credited with introducing over 1,700 words including 'eyeball' and 'lonely.'" },
  { category: "Language", difficulty: "medium", question: "What is 'lethologica'?", options: ["Fear of words", "Tip-of-the-tongue feeling", "Speaking in sleep", "Mixing up languages"], answer: 1, explainer: "Lethologica is the inability to recall the right word --- the tip-of-tongue phenomenon." },
  { category: "Language", difficulty: "hard", question: "How many click sounds does the !Xoo language have?", options: ["About 20", "About 50", "Over 100", "Over 200"], answer: 2, explainer: "Khoisan languages like !Xoo include over 100 distinct click consonants." },
  { category: "Language", difficulty: "easy", question: "Which classical language has continuous literature spanning 2,000+ years?", options: ["Sanskrit", "Latin", "Tamil", "Greek"], answer: 2, explainer: "Tamil, spoken in southern India and Sri Lanka, has the longest continuous literary tradition." },

  // ── Ocean (10) ──
  { category: "Ocean", difficulty: "easy", question: "What percentage of the ocean floor remains unmapped?", options: ["About 30%", "About 50%", "About 65%", "More than 80%"], answer: 3, explainer: "Over 80% of the ocean floor is still unmapped --- we know more about Mars." },
  { category: "Ocean", difficulty: "medium", question: "If Mount Everest were placed in the Mariana Trench, what would happen?", options: ["It would stick out", "Its peak would be underwater", "It would reach the surface exactly", "It would be crushed"], answer: 1, explainer: "The trench is ~11 km deep; Everest (~8.8 km) would still be over a mile underwater." },
  { category: "Ocean", difficulty: "medium", question: "What percentage of world oxygen does the ocean produce?", options: ["About 10%", "About 30%", "Over 50%", "About 75%"], answer: 2, explainer: "Phytoplankton in the ocean produce over 50% of the world's oxygen." },
  { category: "Ocean", difficulty: "hard", question: "What is special about deep-sea hydrothermal vents?", options: ["They freeze nearby water", "They support life without sunlight", "They produce fresh water", "They emit radio waves"], answer: 1, explainer: "Vent ecosystems use chemosynthesis, challenging the assumption all life needs sunlight." },
  { category: "Ocean", difficulty: "easy", question: "Which is the largest living structure on Earth?", options: ["Amazon Rainforest", "Great Barrier Reef", "Sequoia forests", "Antarctic ice shelf"], answer: 1, explainer: "The Great Barrier Reef stretches over 2,300 km and is visible from space." },
  { category: "Ocean", difficulty: "hard", question: "What is the lowest-lying country on Earth?", options: ["Bangladesh", "Netherlands", "Maldives", "Tuvalu"], answer: 2, explainer: "The Maldives averages just 1.5 meters above sea level." },

  // ── Music (10) ──
  { category: "Music", difficulty: "easy", question: "What is the only acoustic instrument invented in the 20th century?", options: ["Synthesizer", "Electric guitar", "Steel pan", "Theremin"], answer: 2, explainer: "Trinidad and Tobago's steel pan, made from oil drums, was invented in the 20th century." },
  { category: "Music", difficulty: "medium", question: "How many ragas does India's raga system contain?", options: ["About 30", "About 100", "Over 300", "Over 1,000"], answer: 2, explainer: "India's raga system has over 300 ragas, each tied to times of day, seasons, and emotions." },
  { category: "Music", difficulty: "medium", question: "What is the origin of salsa music?", options: ["Mexican folk", "Cuban son music", "Brazilian samba", "Puerto Rican bomba"], answer: 1, explainer: "Cuba's son music blended African rhythms with Spanish guitar, birthing salsa." },
  { category: "Music", difficulty: "hard", question: "What Portuguese music genre is built around the concept of 'saudade'?", options: ["Bossa nova", "Fado", "Flamenco", "Morna"], answer: 1, explainer: "Fado expresses 'saudade' --- a deep, untranslatable longing for something absent." },
  { category: "Music", difficulty: "hard", question: "How old is the Chinese guqin instrument?", options: ["500 years", "1,000 years", "Over 3,000 years", "Over 5,000 years"], answer: 2, explainer: "The seven-stringed guqin has been played for over 3,000 years; it was Confucius's instrument." },
  { category: "Music", difficulty: "easy", question: "Which country's music industry is the sixth-largest in the world?", options: ["Japan", "India", "South Korea", "Brazil"], answer: 2, explainer: "K-pop generated over $10 billion in revenue in 2022." },

  // ── Sports (10) ──
  { category: "Sports", difficulty: "easy", question: "What is the most popular sport on Earth by participation?", options: ["Cricket", "Basketball", "Football (soccer)", "Tennis"], answer: 2, explainer: "Football is played by over 250 million people in 200+ countries." },
  { category: "Sports", difficulty: "easy", question: "Which country has won the most FIFA World Cups?", options: ["Germany", "Italy", "Argentina", "Brazil"], answer: 3, explainer: "Brazil has won the FIFA World Cup five times." },
  { category: "Sports", difficulty: "medium", question: "In kabaddi, what must a raider do while attacking?", options: ["Hop on one foot", "Hold their breath and chant", "Keep eyes closed", "Touch the ground"], answer: 1, explainer: "Raiders must hold their breath and chant 'kabaddi' --- referees listen for the sound." },
  { category: "Sports", difficulty: "medium", question: "Why do Ethiopian and Kenyan runners dominate long-distance events?", options: ["Diet alone", "Genetic leg length", "High-altitude training", "Government programs"], answer: 2, explainer: "Training above 2,400 meters boosts red blood cell production naturally." },
  { category: "Sports", difficulty: "hard", question: "What was pankration in the ancient Olympics?", options: ["Javelin throwing", "Chariot racing", "A brutal boxing-wrestling mix", "Long-distance running"], answer: 2, explainer: "Pankration combined boxing and wrestling with almost no rules." },
  { category: "Sports", difficulty: "hard", question: "What three sports make up Mongolia's Naadam festival?", options: ["Boxing, running, swimming", "Wrestling, horse racing, archery", "Polo, javelin, fencing", "Rowing, cycling, shooting"], answer: 1, explainer: "Naadam features wrestling, horse racing (with child jockeys), and archery." },

  // ── Art (8) ──
  { category: "Art", difficulty: "medium", question: "Where is the oldest known figurative art?", options: ["France (Lascaux)", "Spain (Altamira)", "Indonesia (Sulawesi)", "South Africa (Blombos)"], answer: 2, explainer: "Sulawesi cave paintings are at least 45,500 years old --- predating European cave art." },
  { category: "Art", difficulty: "medium", question: "What is Japan's kintsugi?", options: ["Flower arranging", "Repairing pottery with gold", "Sword-making", "Tea ceremony"], answer: 1, explainer: "Kintsugi repairs broken pottery with gold, celebrating imperfection." },
  { category: "Art", difficulty: "hard", question: "How were the Ajanta Cave paintings in India created?", options: ["By firelight", "Using reflected sunlight in near-darkness", "By moonlight", "Using bioluminescent moss"], answer: 1, explainer: "Artists created these Buddhist paintings in near-total darkness using reflected sunlight." },
  { category: "Art", difficulty: "easy", question: "How many unique terracotta soldiers are in Xi'an, China?", options: ["About 1,000", "About 4,000", "Over 8,000", "Over 20,000"], answer: 2, explainer: "Over 8,000 life-sized soldiers, each with a unique face, buried with Emperor Qin Shi Huang." },
  { category: "Art", difficulty: "hard", question: "What are the Nazca Lines?", options: ["Ancient roads", "Massive geoglyphs visible from the air", "River channels", "Stone walls"], answer: 1, explainer: "Peru's Nazca Lines are massive ground drawings created between 500 BCE and 500 CE." },

  // ── Nature (10) ──
  { category: "Nature", difficulty: "easy", question: "What is the driest place on Earth?", options: ["Sahara Desert", "Gobi Desert", "Atacama Desert", "Arabian Desert"], answer: 2, explainer: "Some weather stations in Chile's Atacama have never recorded a single drop of rain." },
  { category: "Nature", difficulty: "medium", question: "Where does lightning strike nearly 300 nights per year?", options: ["Central Africa", "Tornado Alley, USA", "Catatumbo, Venezuela", "Bangladesh delta"], answer: 2, explainer: "Catatumbo lightning is the world's most persistent storm." },
  { category: "Nature", difficulty: "medium", question: "What causes bioluminescent bays to glow?", options: ["Mineral deposits", "Reflected moonlight", "Dinoflagellates", "Chemical pollution"], answer: 2, explainer: "Dinoflagellates are microscopic organisms that emit light when disturbed." },
  { category: "Nature", difficulty: "hard", question: "What unique feature does Mount Erebus in Antarctica have?", options: ["A permanent glacier", "A permanent lava lake", "An ice cave system", "A freshwater lake"], answer: 1, explainer: "Erebus has one of only a handful of permanent lava lakes --- on the coldest continent." },
  { category: "Nature", difficulty: "hard", question: "Why has cherry blossom season shifted in Japan?", options: ["Volcanic activity", "Ocean currents", "Climate change", "Deforestation"], answer: 2, explainer: "Hanami has shifted over a week earlier in the past century due to climate change." },
  { category: "Nature", difficulty: "medium", question: "What is special about Socotra Island (Yemen)?", options: ["It sinks seasonally", "It has alien-looking unique flora", "It's volcanic", "It rotates"], answer: 1, explainer: "Socotra has unique flora including dragon blood trees --- called 'the most alien place on Earth.'" },

  // ── Math (10) ──
  { category: "Math", difficulty: "easy", question: "Who formalized the concept of zero as a number?", options: ["Euclid", "Archimedes", "Brahmagupta", "Pythagoras"], answer: 2, explainer: "Indian mathematician Brahmagupta formalized zero in 628 CE." },
  { category: "Math", difficulty: "easy", question: "In a room of 23 people, what's the chance two share a birthday?", options: ["About 10%", "About 25%", "About 50%", "About 75%"], answer: 2, explainer: "The 'birthday paradox' gives ~50% probability with just 23 people." },
  { category: "Math", difficulty: "medium", question: "Why do cicadas emerge in prime-numbered year cycles?", options: ["Random chance", "To avoid predator synchronization", "Temperature cycles", "Lunar cycles"], answer: 1, explainer: "Prime number cycles (13 or 17 years) minimize overlap with predator life cycles." },
  { category: "Math", difficulty: "medium", question: "Where does the word 'algorithm' come from?", options: ["Greek word for logic", "Latin for calculation", "Name of mathematician Al-Khwarizmi", "Arabic for sequence"], answer: 2, explainer: "Al-Khwarizmi was a 9th-century Persian mathematician who wrote the foundation text on algebra." },
  { category: "Math", difficulty: "hard", question: "How many possible arrangements exist for a shuffled deck of 52 cards?", options: ["About 1 million", "About 1 billion", "About 8 x 10^67", "About 10^100"], answer: 2, explainer: "8 x 10^67 arrangements means no two shuffled decks in history have likely been the same." },
  { category: "Math", difficulty: "hard", question: "How many mathematical results did Ramanujan independently discover?", options: ["About 400", "About 1,200", "Nearly 3,900", "Over 10,000"], answer: 2, explainer: "Self-taught Indian mathematician Ramanujan discovered nearly 3,900 results, many new to Western math." },
  { category: "Math", difficulty: "medium", question: "Why do we have 60 seconds in a minute?", options: ["Roman counting", "Babylonian base-60 system", "Chinese astronomy", "Egyptian sundials"], answer: 1, explainer: "The ancient Babylonians used base-60, giving us 60 seconds, 60 minutes, and 360 degrees." },

  // ── Psychology (10) ──
  { category: "Psychology", difficulty: "easy", question: "What is the IKEA effect?", options: ["Preferring Swedish design", "Overvaluing things you built yourself", "Decision fatigue from choices", "Impulse buying"], answer: 1, explainer: "People value things they built themselves disproportionately more, even if objectively worse." },
  { category: "Psychology", difficulty: "medium", question: "What happens to multilingual people's personalities?", options: ["They become more introverted", "They report slightly different personalities in each language", "They lose cultural identity", "No measurable effect"], answer: 1, explainer: "Multilingual people often report subtly different personalities depending on the language." },
  { category: "Psychology", difficulty: "medium", question: "How fast can your brain process an image?", options: ["100 milliseconds", "50 milliseconds", "13 milliseconds", "1 millisecond"], answer: 2, explainer: "The brain processes images seen for as little as 13 milliseconds." },
  { category: "Psychology", difficulty: "hard", question: "What is the Dunning-Kruger effect?", options: ["Experts overestimate their ability", "Beginners underestimate difficulty", "Less knowledgeable people overestimate their competence", "Intelligence decreases with age"], answer: 2, explainer: "People with limited knowledge overestimate themselves; experts tend to underestimate." },
  { category: "Psychology", difficulty: "easy", question: "What was nostalgia once classified as?", options: ["A phobia", "A medical disease", "A personality trait", "A learning disability"], answer: 1, explainer: "In the 17th century nostalgia was a 'disease'; now it's known to boost mood and meaning." },
  { category: "Psychology", difficulty: "hard", question: "What does Japanese 'shinrin-yoku' (forest bathing) measurably reduce?", options: ["Only anxiety", "Cortisol, blood pressure, and heart rate", "Only muscle tension", "Only depression"], answer: 1, explainer: "Forest bathing has been scientifically shown to lower cortisol, blood pressure, and heart rate within 15 minutes." },

  // ── Culture (10) ──
  { category: "Culture", difficulty: "easy", question: "What is the largest peaceful human gathering on Earth?", options: ["Hajj", "Carnival", "Kumbh Mela", "Olympics opening ceremony"], answer: 2, explainer: "India's Kumbh Mela attracts over 100 million pilgrims and is visible from space." },
  { category: "Culture", difficulty: "easy", question: "How many months does the Ethiopian calendar have?", options: ["10", "12", "13", "14"], answer: 2, explainer: "Ethiopia has 13 months and is roughly 7 years behind the Gregorian calendar." },
  { category: "Culture", difficulty: "medium", question: "What is Mexico's Day of the Dead primarily about?", options: ["Mourning the dead", "Joyfully celebrating deceased loved ones", "Scaring evil spirits", "Fasting and prayer"], answer: 1, explainer: "Dia de los Muertos is a joyful celebration with altars, food, and music." },
  { category: "Culture", difficulty: "medium", question: "How many saunas are there in Finland?", options: ["About 500,000", "About 1.5 million", "About 3.3 million", "About 5 million"], answer: 2, explainer: "Finland has ~3.3 million saunas for 5.5 million people --- more saunas than cars." },
  { category: "Culture", difficulty: "hard", question: "What do the Toraja people of Indonesia do with deceased relatives?", options: ["Cremation at sea", "Keep them at home treating them as 'sick'", "Mummification", "Sky burial"], answer: 1, explainer: "The Toraja keep deceased relatives at home for weeks or years, treating them as 'sick.'" },
  { category: "Culture", difficulty: "medium", question: "How many words for snow do the Sami people have?", options: ["About 50", "About 100", "Over 300", "Over 500"], answer: 2, explainer: "The Sami have over 300 words for snow and ice, reflecting its centrality to their culture." },
  { category: "Culture", difficulty: "easy", question: "Why is slurping noodles loudly considered polite in Japan?", options: ["Shows hunger", "Signals enjoyment and improves flavor", "Traditional greeting", "Clears the throat"], answer: 1, explainer: "Slurping signals enjoyment and aerates the noodles for better flavor." },

  // ── Medicine (8) ──
  { category: "Medicine", difficulty: "easy", question: "Which country produces over 60% of the world's vaccines?", options: ["China", "Germany", "India", "USA"], answer: 2, explainer: "India is called the 'pharmacy of the world' for its vaccine production." },
  { category: "Medicine", difficulty: "easy", question: "What is the only human disease to have been completely eradicated?", options: ["Polio", "Smallpox", "Measles", "Tuberculosis"], answer: 1, explainer: "Smallpox was declared eradicated by the WHO in 1980." },
  { category: "Medicine", difficulty: "medium", question: "How many bacteria are in the human gut microbiome?", options: ["About 1 billion", "About 100 billion", "About 38 trillion", "About 100 trillion"], answer: 2, explainer: "About 38 trillion bacteria --- slightly outnumbering human cells." },
  { category: "Medicine", difficulty: "medium", question: "Where did the world's first human heart transplant take place?", options: ["London", "New York", "Cape Town", "Tokyo"], answer: 2, explainer: "Dr. Christiaan Barnard performed it in Cape Town, South Africa, in 1967." },
  { category: "Medicine", difficulty: "hard", question: "Which country achieved near-universal health coverage using community-based insurance?", options: ["Cuba", "Rwanda", "Thailand", "Costa Rica"], answer: 1, explainer: "Rwanda's community-based health insurance dramatically reduced poverty-related deaths." },
  { category: "Medicine", difficulty: "medium", question: "What does 'Ayurveda' mean?", options: ["Body science", "Life knowledge", "Health path", "Healing art"], answer: 1, explainer: "'Ayur' means life and 'veda' means knowledge --- it's over 3,000 years old." },

  // ── Economics (8) ──
  { category: "Economics", difficulty: "easy", question: "How long was the Silk Road?", options: ["1,000 km", "3,200 km", "6,400 km", "12,000 km"], answer: 2, explainer: "The Silk Road connected China to the Mediterranean, spanning 6,400 km for over 1,500 years." },
  { category: "Economics", difficulty: "medium", question: "What is the world's second-largest film industry by volume?", options: ["Hollywood", "Bollywood", "Nollywood", "Chinese cinema"], answer: 2, explainer: "Nigeria's Nollywood produces about 2,500 films per year, second only to India's Bollywood." },
  { category: "Economics", difficulty: "medium", question: "What was the first recorded speculative financial bubble?", options: ["South Sea Bubble", "Dutch Tulip Mania", "Mississippi Bubble", "Railway Mania"], answer: 1, explainer: "In 1637, a single tulip bulb sold for more than a canal house in Amsterdam." },
  { category: "Economics", difficulty: "hard", question: "What percentage of global employment is in the informal economy?", options: ["About 20%", "About 40%", "Over 60%", "About 80%"], answer: 2, explainer: "Over 60% of global employment --- 2 billion+ people --- is informal." },
  { category: "Economics", difficulty: "hard", question: "How did Botswana transform its economy after independence in 1966?", options: ["Oil exports", "Tech industry", "Wise diamond revenue management", "Tourism"], answer: 2, explainer: "Botswana went from one of the poorest to upper-middle-income through smart diamond management." },
  { category: "Economics", difficulty: "medium", question: "What were cowrie shells used for across Africa and Asia?", options: ["Jewelry only", "Currency for 3,000+ years", "Religious offerings", "Building material"], answer: 1, explainer: "Cowrie shells were one of the most widespread forms of money in history." },

  // ── Additional questions to reach 200+ ──
  // Space extras
  { category: "Space", difficulty: "medium", question: "What is the largest volcano in the solar system?", options: ["Mount Etna", "Mauna Kea", "Olympus Mons on Mars", "A volcano on Io"], answer: 2, explainer: "Olympus Mons on Mars is about 21 km tall --- nearly 3x the height of Everest." },
  { category: "Space", difficulty: "hard", question: "What percentage of the universe is 'dark energy'?", options: ["About 27%", "About 50%", "About 68%", "About 95%"], answer: 2, explainer: "About 68% of the universe is dark energy, 27% dark matter, and only 5% ordinary matter." },
  { category: "Space", difficulty: "easy", question: "Which planet has the Great Red Spot?", options: ["Mars", "Jupiter", "Neptune", "Saturn"], answer: 1, explainer: "Jupiter's Great Red Spot is a storm larger than Earth that has raged for at least 350 years." },
  { category: "Space", difficulty: "medium", question: "How long does it take light from the Sun to reach Earth?", options: ["About 30 seconds", "About 8 minutes", "About 1 hour", "About 1 day"], answer: 1, explainer: "Sunlight takes about 8 minutes and 20 seconds to travel 150 million km to Earth." },

  // Animals extras
  { category: "Animals", difficulty: "easy", question: "What color is an octopus's blood?", options: ["Red", "Green", "Blue", "Clear"], answer: 2, explainer: "Octopuses have blue blood because they use copper-based hemocyanin instead of iron-based hemoglobin." },
  { category: "Animals", difficulty: "medium", question: "Which bird can fly backwards?", options: ["Hummingbird", "Swift", "Eagle", "Penguin"], answer: 0, explainer: "Hummingbirds are the only birds that can sustain backward flight." },
  { category: "Animals", difficulty: "hard", question: "How long can a tardigrade survive in space?", options: ["Minutes", "Hours", "Days", "At least 10 days"], answer: 3, explainer: "Tardigrades have survived 10 days in the vacuum of space, exposed to solar radiation." },
  { category: "Animals", difficulty: "easy", question: "Which animal has the longest migration?", options: ["Monarch butterfly", "Arctic tern", "Humpback whale", "Caribou"], answer: 1, explainer: "The Arctic tern migrates from Arctic to Antarctic and back --- about 70,000 km annually." },

  // Human Body extras
  { category: "Human Body", difficulty: "easy", question: "How many bones does an adult human have?", options: ["106", "156", "206", "256"], answer: 2, explainer: "Adults have 206 bones (babies are born with about 270, which fuse over time)." },
  { category: "Human Body", difficulty: "medium", question: "How fast do nerve impulses travel?", options: ["5 km/h", "50 km/h", "120 m/s (430 km/h)", "Speed of light"], answer: 2, explainer: "The fastest nerve impulses travel at about 120 meters per second." },
  { category: "Human Body", difficulty: "hard", question: "What percentage of your body's cells are bacteria?", options: ["About 10%", "About 30%", "Roughly half", "About 90%"], answer: 2, explainer: "Bacterial cells roughly equal human cells in number --- about 38 trillion each." },

  // History extras
  { category: "History", difficulty: "easy", question: "In what year did the Titanic sink?", options: ["1905", "1912", "1918", "1923"], answer: 1, explainer: "The Titanic sank on April 15, 1912, on its maiden voyage." },
  { category: "History", difficulty: "medium", question: "Which empire was the largest in history by land area?", options: ["Roman Empire", "Mongol Empire", "British Empire", "Spanish Empire"], answer: 2, explainer: "The British Empire covered about 35.5 million sq km at its peak --- about 24% of Earth's land." },
  { category: "History", difficulty: "hard", question: "When was the printing press invented in East Asia?", options: ["1st century", "7th century", "11th century", "14th century"], answer: 2, explainer: "Movable type printing was invented in China around 1040 CE by Bi Sheng --- 400 years before Gutenberg." },

  // Geography extras
  { category: "Geography", difficulty: "easy", question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1, explainer: "Vatican City is only about 0.44 sq km --- smaller than many parks." },
  { category: "Geography", difficulty: "medium", question: "Which river is the longest in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1, explainer: "The Nile flows about 6,650 km through northeastern Africa (though the Amazon is sometimes disputed as longer)." },
  { category: "Geography", difficulty: "hard", question: "What is the deepest lake in the world?", options: ["Lake Victoria", "Caspian Sea", "Lake Baikal", "Lake Tanganyika"], answer: 2, explainer: "Lake Baikal in Russia reaches 1,642 meters deep --- the deepest and oldest freshwater lake." },

  // Science extras
  { category: "Science", difficulty: "easy", question: "What is the hardest natural substance?", options: ["Titanium", "Granite", "Diamond", "Quartz"], answer: 2, explainer: "Diamond is the hardest known natural material, scoring 10 on the Mohs scale." },
  { category: "Science", difficulty: "medium", question: "At what temperature are Celsius and Fahrenheit equal?", options: ["-10", "-20", "-30", "-40"], answer: 3, explainer: "At -40 degrees, both Celsius and Fahrenheit scales intersect." },
  { category: "Science", difficulty: "hard", question: "What is the most abundant element in the universe?", options: ["Oxygen", "Carbon", "Helium", "Hydrogen"], answer: 3, explainer: "Hydrogen makes up about 75% of all normal matter in the universe by mass." },

  // Technology extras
  { category: "Technology", difficulty: "easy", question: "What year was the World Wide Web invented?", options: ["1985", "1989", "1993", "1997"], answer: 1, explainer: "Tim Berners-Lee proposed the World Wide Web in 1989 at CERN." },
  { category: "Technology", difficulty: "medium", question: "What was the first programmable computer?", options: ["ENIAC", "Colossus", "Z3", "UNIVAC"], answer: 2, explainer: "The Z3, built by Konrad Zuse in 1941 in Germany, was the first programmable computer." },
  { category: "Technology", difficulty: "hard", question: "How many transistors are in a modern smartphone chip?", options: ["Millions", "Hundreds of millions", "Billions", "Trillions"], answer: 2, explainer: "Modern chips contain over 10 billion transistors, each smaller than a virus." },

  // Food extras
  { category: "Food", difficulty: "easy", question: "Which fruit has its seeds on the outside?", options: ["Kiwi", "Strawberry", "Raspberry", "Fig"], answer: 1, explainer: "Strawberries have about 200 seeds on their exterior --- making them technically not berries." },
  { category: "Food", difficulty: "medium", question: "What country drinks the most coffee per capita?", options: ["Brazil", "Italy", "Finland", "USA"], answer: 2, explainer: "Finland consumes about 12 kg of coffee per person per year --- the most in the world." },

  // Nature extras
  { category: "Nature", difficulty: "easy", question: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Pronghorn", "Greyhound"], answer: 1, explainer: "Cheetahs can reach speeds of about 112 km/h in short bursts." },
  { category: "Nature", difficulty: "medium", question: "What is the tallest type of tree?", options: ["Douglas fir", "Coast redwood", "Giant sequoia", "Eucalyptus"], answer: 1, explainer: "Coast redwoods (Sequoia sempervirens) can exceed 115 meters --- taller than the Statue of Liberty." },
  { category: "Nature", difficulty: "hard", question: "What is the oldest living organism on Earth?", options: ["Bristlecone pine", "A coral colony", "A fungal network", "A clonal grove of aspen (Pando)"], answer: 3, explainer: "Pando, a clonal colony of quaking aspen in Utah, is estimated at 80,000 years old." },

  // Math extras
  { category: "Math", difficulty: "easy", question: "What is pi approximately equal to?", options: ["2.14", "3.14", "4.14", "3.41"], answer: 1, explainer: "Pi is approximately 3.14159... and is the ratio of a circle's circumference to its diameter." },
  { category: "Math", difficulty: "medium", question: "What is a googol?", options: ["A search engine", "10 to the power of 10", "10 to the power of 100", "Infinity"], answer: 2, explainer: "A googol is 10^100 --- a 1 followed by 100 zeros. Google's name is a play on this word." },
  { category: "Math", difficulty: "hard", question: "What is the only even prime number?", options: ["0", "1", "2", "4"], answer: 2, explainer: "2 is the only even prime number --- every other even number is divisible by 2." },

  // Psychology extras
  { category: "Psychology", difficulty: "easy", question: "What phobia is the fear of spiders?", options: ["Claustrophobia", "Arachnophobia", "Acrophobia", "Xenophobia"], answer: 1, explainer: "Arachnophobia affects roughly 3-6% of the global population." },
  { category: "Psychology", difficulty: "medium", question: "What is 'confirmation bias'?", options: ["Seeking info that confirms existing beliefs", "Remembering only good events", "Trusting authority figures", "Following the crowd"], answer: 0, explainer: "Confirmation bias is the tendency to search for and favor information that confirms pre-existing beliefs." },

  // Culture extras
  { category: "Culture", difficulty: "medium", question: "Which is the world's oldest known board game?", options: ["Chess", "Go", "The Royal Game of Ur", "Backgammon"], answer: 2, explainer: "The Royal Game of Ur dates to approximately 2600 BCE in ancient Mesopotamia." },
  { category: "Culture", difficulty: "hard", question: "How old are the oldest known cave paintings?", options: ["About 10,000 years", "About 25,000 years", "About 45,000 years", "About 100,000 years"], answer: 2, explainer: "Cave paintings in Indonesia's Sulawesi are at least 45,500 years old." },

  // Medicine extras
  { category: "Medicine", difficulty: "easy", question: "What organ does dialysis replace the function of?", options: ["Heart", "Liver", "Kidney", "Lung"], answer: 2, explainer: "Dialysis filters blood when the kidneys can no longer perform this function." },
  { category: "Medicine", difficulty: "medium", question: "What does DNA stand for?", options: ["Dynamic Nucleic Acid", "Deoxyribonucleic Acid", "Di-Nucleotide Arrangement", "Dual Nitrogen Assembly"], answer: 1, explainer: "Deoxyribonucleic acid carries the genetic instructions for life." },

  // Ocean extras
  { category: "Ocean", difficulty: "medium", question: "What percentage of Earth's surface is covered by ocean?", options: ["About 50%", "About 60%", "About 71%", "About 80%"], answer: 2, explainer: "Oceans cover approximately 71% of Earth's surface --- about 361 million sq km." },
  { category: "Ocean", difficulty: "hard", question: "What is the longest mountain range on Earth?", options: ["The Andes", "The Himalayas", "The Mid-Ocean Ridge", "The Rockies"], answer: 2, explainer: "The Mid-Ocean Ridge stretches over 65,000 km across ocean floors --- mostly underwater and unseen." },

  // Sports extras
  { category: "Sports", difficulty: "easy", question: "Where were the first modern Olympics held?", options: ["Paris", "Athens", "London", "Rome"], answer: 1, explainer: "The first modern Olympic Games were held in Athens, Greece, in 1896." },
  { category: "Sports", difficulty: "medium", question: "What martial art was developed in Brazil by enslaved Africans?", options: ["Judo", "Taekwondo", "Capoeira", "Krav Maga"], answer: 2, explainer: "Capoeira combines dance, acrobatics, and music --- developed as disguised combat training." },

  // Art extras
  { category: "Art", difficulty: "easy", question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Botticelli"], answer: 2, explainer: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519." },
  { category: "Art", difficulty: "medium", question: "What art movement did Claude Monet help create?", options: ["Cubism", "Impressionism", "Surrealism", "Expressionism"], answer: 1, explainer: "Monet's painting 'Impression, Sunrise' (1872) gave the Impressionist movement its name." },

  // Music extras
  { category: "Music", difficulty: "easy", question: "How many strings does a standard guitar have?", options: ["4", "5", "6", "8"], answer: 2, explainer: "A standard guitar has 6 strings, though bass guitars have 4 and some variants have 7 or 12." },
  { category: "Music", difficulty: "medium", question: "Which instrument has the widest pitch range in an orchestra?", options: ["Violin", "Piano", "Harp", "Pipe organ"], answer: 3, explainer: "The pipe organ can produce the widest range of pitches of any instrument, spanning over 9 octaves." },

  // Language extras
  { category: "Language", difficulty: "medium", question: "What is the most spoken language in the world by total speakers?", options: ["Mandarin Chinese", "English", "Spanish", "Hindi"], answer: 1, explainer: "English has the most total speakers (native + non-native) at about 1.5 billion." },
  { category: "Language", difficulty: "hard", question: "What is the longest word in the English language without repeating a letter?", options: ["Uncopyrightable", "Dermatoglyphics", "Both are correct", "Subdermatoglyphic"], answer: 3, explainer: "Subdermatoglyphic (17 letters) is the longest known English word without any repeated letters." },

  // Final additions
  { category: "Economics", difficulty: "easy", question: "What is inflation?", options: ["Rising stock prices", "A general increase in prices over time", "Government spending", "Interest rate changes"], answer: 1, explainer: "Inflation is the rate at which the general level of prices for goods and services rises." },
  { category: "Nature", difficulty: "easy", question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Antarctica", "Arabian"], answer: 2, explainer: "Antarctica is technically the largest desert --- a desert is defined by low precipitation, not temperature." },
  { category: "History", difficulty: "easy", question: "What ancient wonder is the only one still standing?", options: ["Colossus of Rhodes", "Hanging Gardens", "Great Pyramid of Giza", "Lighthouse of Alexandria"], answer: 2, explainer: "The Great Pyramid of Giza, built around 2560 BCE, is the only surviving ancient wonder." },
  { category: "Science", difficulty: "easy", question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: 2, explainer: "Plants absorb CO2 and release oxygen through photosynthesis." },
]

const ALL_CATEGORIES = ["All", "Space", "Animals", "Human Body", "History", "Geography", "Science", "Technology", "Food", "Language", "Ocean", "Music", "Sports", "Art", "Nature", "Math", "Psychology", "Culture", "Medicine", "Economics"]

/* ─── Helpers ─── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ─── Main Page ─── */
export default function QuizPage() {
  const { checkAndAwardBadges } = useBadges()
  const [phase, setPhase] = useState<'setup' | 'playing' | 'results'>('setup')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('Mixed')
  const [numQuestions, setNumQuestions] = useState(10)
  const [timerSetting, setTimerSetting] = useState(0) // 0 = no timer
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [answers, setAnswers] = useState<{ q: QuizQuestion; picked: number; correct: boolean }[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  const [toast, setToast] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const startQuiz = () => {
    let pool = QUESTIONS.filter(q => {
      const catMatch = category === 'All' || q.category === category
      const diffMatch = difficulty === 'Mixed' || q.difficulty === difficulty.toLowerCase()
      return catMatch && diffMatch
    })
    pool = shuffle(pool).slice(0, numQuestions)
    if (pool.length === 0) {
      showToast('No questions match those filters. Try different settings.')
      return
    }
    setQuestions(pool)
    setCurrentIdx(0)
    setPicked(null)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setAnswers([])
    setTimedOut(false)
    if (timerSetting > 0) setTimeLeft(timerSetting)
    setPhase('playing')
  }

  // Timer logic
  useEffect(() => {
    if (phase !== 'playing' || timerSetting === 0 || picked !== null || timedOut) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setTimeLeft(timerSetting)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setTimedOut(true)
          setStreak(0)
          setAnswers(a => [...a, { q: questions[currentIdx], picked: -1, correct: false }])
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, currentIdx, picked, timerSetting, timedOut, questions])

  const pick = (i: number) => {
    if (picked !== null || timedOut) return
    if (timerRef.current) clearInterval(timerRef.current)
    setPicked(i)
    const correct = i === questions[currentIdx].answer
    if (correct) {
      setScore(s => s + 1)
      setStreak(s => {
        const ns = s + 1
        setBestStreak(b => Math.max(b, ns))
        return ns
      })
    } else {
      setStreak(0)
    }
    setAnswers(a => [...a, { q: questions[currentIdx], picked: i, correct }])
  }

  const next = () => {
    if (currentIdx + 1 >= questions.length) {
      // Check for perfect score badge
      const finalScore = answers.filter(a => a.correct).length + (picked !== null && picked === questions[currentIdx]?.answer ? 1 : 0)
      if (finalScore === questions.length) {
        checkAndAwardBadges({ quizPerfect: true })
      }
      setPhase('results')
    } else {
      setCurrentIdx(i => i + 1)
      setPicked(null)
      setTimedOut(false)
    }
  }

  const challengeUrl = () => {
    const params = new URLSearchParams({
      cat: category,
      diff: difficulty,
      n: String(numQuestions),
      t: String(timerSetting),
    })
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/quiz?${params.toString()}`
  }

  const copyChallenge = () => {
    navigator.clipboard?.writeText(challengeUrl()).then(() => showToast('Challenge link copied!'))
  }

  // Parse URL params on mount for challenge links
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('cat')) setCategory(params.get('cat')!)
    if (params.get('diff')) setDifficulty(params.get('diff')!)
    if (params.get('n')) setNumQuestions(Number(params.get('n')))
    if (params.get('t')) setTimerSetting(Number(params.get('t')))
  }, [])

  /* ─── SETUP SCREEN ─── */
  if (phase === 'setup') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="font-mono text-xs uppercase tracking-wide hover:text-tomato transition-colors mb-8 inline-flex items-center gap-1">
          <ChevronLeft size={14} /> Back
        </Link>

        <div className="text-center mb-12">
          <Trophy size={36} strokeWidth={1.5} className="mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Quiz <span className="italic" style={{ color: 'var(--tomato)' }}>Challenge</span>
          </h1>
          <p className="font-display italic text-lg" style={{ color: 'var(--ink-soft)' }}>
            Test your knowledge across {QUESTIONS.length} questions
          </p>
        </div>

        {/* Category */}
        <div className="mb-8">
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>Category</label>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(c => (
              <button key={c} className={`pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-8">
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {['Easy', 'Medium', 'Hard', 'Mixed'].map(d => (
              <button key={d} className={`pill ${difficulty === d ? 'active' : ''}`} onClick={() => setDifficulty(d)}>{d}</button>
            ))}
          </div>
        </div>

        {/* Number of questions */}
        <div className="mb-8">
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>Questions</label>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20].map(n => (
              <button key={n} className={`pill ${numQuestions === n ? 'active' : ''}`} onClick={() => setNumQuestions(n)}>{n}</button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="mb-10">
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>Timer per question</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'No Timer', value: 0 },
              { label: '10s', value: 10 },
              { label: '15s', value: 15 },
              { label: '30s', value: 30 },
            ].map(t => (
              <button key={t.value} className={`pill ${timerSetting === t.value ? 'active' : ''}`} onClick={() => setTimerSetting(t.value)}>
                {t.value > 0 && <Timer size={13} className="mr-1" />}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button className="btn btn-primary text-lg px-8 py-4" onClick={startQuiz}>
            <Zap size={18} /> Start Quiz
          </button>
        </div>
      </div>
    )
  }

  /* ─── RESULTS SCREEN ─── */
  if (phase === 'results') {
    const pct = Math.round((score / questions.length) * 100)
    const verdict = pct === 100 ? 'Encyclopedic.' : pct >= 80 ? 'Genuinely impressive.' : pct >= 60 ? 'A respectable showing.' : pct >= 40 ? 'Not bad --- room to grow.' : 'Plenty more to discover.'

    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="font-mono text-xs uppercase tracking-wide hover:text-tomato transition-colors mb-8 inline-flex items-center gap-1">
          <ChevronLeft size={14} /> Home
        </Link>

        <div className="text-center mb-12">
          <Award size={48} strokeWidth={1.5} className="mx-auto mb-4" />
          <div className="font-mono text-xs tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--ink-soft)' }}>Quiz Complete</div>
          <div className="font-display font-[800] leading-none mb-3" style={{ fontSize: 'clamp(64px, 12vw, 128px)' }}>
            {score}<span style={{ color: 'var(--tomato)' }}>/</span>{questions.length}
          </div>
          <p className="font-display italic text-2xl mb-2" style={{ color: 'var(--ink-soft)' }}>{verdict}</p>
          <p className="font-mono text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--ink-soft)' }}>
            {pct}% correct &middot; Best streak: {bestStreak}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Correct', value: score, icon: Check },
            { label: 'Wrong', value: questions.length - score, icon: X },
            { label: 'Best Streak', value: bestStreak, icon: Flame },
          ].map(s => (
            <div key={s.label} className="text-center p-4" style={{ border: '1.5px solid var(--ink)' }}>
              <s.icon size={20} className="mx-auto mb-2" />
              <div className="font-display text-3xl font-bold">{s.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Answer Breakdown */}
        <div className="mb-10">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] mb-4" style={{ color: 'var(--ink-soft)' }}>Breakdown</h3>
          <div className="space-y-3">
            {answers.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-4" style={{ border: '1.5px solid var(--ink)', borderLeftWidth: '4px', borderLeftColor: a.correct ? 'var(--ink)' : 'var(--tomato)' }}>
                <div className="flex-shrink-0 mt-0.5">
                  {a.correct ? <Check size={16} /> : <X size={16} style={{ color: 'var(--tomato)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm leading-snug mb-1">{a.q.question}</p>
                  <p className="font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                    {a.picked === -1 ? 'Timed out' : `Your answer: ${a.q.options[a.picked]}`}
                    {!a.correct && ` · Correct: ${a.q.options[a.q.answer]}`}
                  </p>
                </div>
                <span className="stamp flex-shrink-0" style={{ borderRadius: '999px', fontSize: '0.6rem' }}>{a.q.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button className="btn btn-primary" onClick={() => { setPhase('setup') }}>
            <RotateCcw size={14} /> New Quiz
          </button>
          <button className="btn" onClick={copyChallenge}>
            <Share2 size={14} /> Challenge a Friend
          </button>
        </div>
      </div>
    )
  }

  /* ─── PLAYING SCREEN ─── */
  const q = questions[currentIdx]
  const answered = picked !== null || timedOut
  const progress = ((currentIdx + (answered ? 1 : 0)) / questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 font-mono text-xs tracking-[0.14em] uppercase">
        <span>Question {currentIdx + 1} / {questions.length}</span>
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <span className="flex items-center gap-1" style={{ color: 'var(--tomato)' }}>
              <Flame size={14} /> {streak} streak
            </span>
          )}
          <span style={{ color: 'var(--ink-soft)' }}>
            <Target size={13} className="inline mr-1" />Score {score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] w-full mb-2" style={{ background: 'var(--cream-2)' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: 'var(--ink)' }} />
      </div>

      {/* Timer bar */}
      {timerSetting > 0 && (
        <div className="h-[3px] w-full mb-8" style={{ background: 'var(--cream-2)' }}>
          <div
            className="h-full transition-all"
            style={{
              width: answered ? '0%' : `${(timeLeft / timerSetting) * 100}%`,
              background: timeLeft <= 3 ? 'var(--tomato)' : 'var(--ochre)',
              transition: answered ? 'none' : 'width 1s linear',
            }}
          />
        </div>
      )}

      {!timerSetting && <div className="mb-8" />}

      {/* Category + Difficulty */}
      <div className="flex items-center gap-2 mb-6">
        <span className="stamp" style={{ borderRadius: '999px' }}>{q.category}</span>
        <span className="stamp" style={{
          borderRadius: '999px',
          background: q.difficulty === 'hard' ? 'var(--tomato)' : q.difficulty === 'medium' ? 'var(--ochre)' : 'var(--ink)',
          color: 'var(--cream)',
          borderColor: q.difficulty === 'hard' ? 'var(--tomato)' : q.difficulty === 'medium' ? 'var(--ochre)' : 'var(--ink)',
        }}>{q.difficulty}</span>
        {timerSetting > 0 && !answered && (
          <span className="font-mono text-sm ml-auto" style={{ color: timeLeft <= 5 ? 'var(--tomato)' : 'var(--ink-soft)' }}>
            <Timer size={14} className="inline mr-1" />{timeLeft}s
          </span>
        )}
      </div>

      {/* Question */}
      <h2 className="font-display font-light leading-tight mb-8" style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}>
        {q.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer
          const isPicked = i === picked
          let s: React.CSSProperties = {}
          let icon: React.ReactNode = null

          if (answered) {
            if (isCorrect) {
              s = { background: 'var(--ink)', color: 'var(--cream)', borderColor: 'var(--ink)' }
              icon = <Check size={16} />
            } else if (isPicked || (timedOut && !isCorrect)) {
              if (isPicked) {
                s = { background: 'var(--tomato)', color: 'var(--cream)', borderColor: 'var(--tomato)' }
                icon = <X size={16} />
              } else {
                s = { opacity: 0.35 }
              }
            } else {
              s = { opacity: 0.35 }
            }
          }

          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={answered}
              className="w-full text-left px-5 py-4 font-display text-lg flex items-center justify-between transition-all"
              style={{
                border: '1.5px solid var(--ink)',
                cursor: answered ? 'default' : 'pointer',
                ...s,
              }}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs w-6 text-center" style={{ opacity: 0.5 }}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </span>
              {icon}
            </button>
          )
        })}
      </div>

      {/* Timed out message */}
      {timedOut && (
        <div className="mt-6 p-4 text-center" style={{ background: 'var(--tomato)', color: 'var(--cream)' }}>
          <p className="font-mono text-sm uppercase tracking-[0.1em]">Time&apos;s up!</p>
        </div>
      )}

      {/* Explainer + Next */}
      {answered && (
        <div className="mt-8 pt-5 flex flex-wrap items-center justify-between gap-4" style={{ borderTop: '1px dashed var(--ink-soft)', animation: 'fadeIn 500ms ease both' }}>
          <p className="font-display italic text-lg max-w-md" style={{ color: 'var(--ink-soft)' }}>{q.explainer}</p>
          <button className="btn btn-primary" onClick={next}>
            {currentIdx + 1 >= questions.length ? 'See Results' : 'Next Question'} <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase z-50" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

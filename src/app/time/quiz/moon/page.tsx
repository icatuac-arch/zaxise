'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Moon, Trophy, Zap, RotateCcw, Share2,
  ChevronRight, Flame, Award, Brain, Timer, Sparkles, ArrowLeft
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Types ─────────────────────────────────────────────────
type GameState = 'menu' | 'playing' | 'results'

interface Question {
  question: string
  options: string[]
  correct: string
  funFact: string
}

// ─── Questions Pool (15) ──────────────────────────────────
const QUESTIONS_POOL: Question[] = [
  {
    question: 'How long is a lunar cycle (synodic month)?',
    options: ['~27.3 days', '~29.5 days', '~31 days', '~25 days'],
    correct: '~29.5 days',
    funFact: 'The synodic month (29.53 days) is the time between two identical moon phases. The sidereal month (27.32 days) is the actual orbital period.',
  },
  {
    question: 'What causes a solar eclipse?',
    options: ['Earth passes between Sun and Moon', 'Moon passes between Sun and Earth', 'Sun passes between Earth and Moon', 'Moon enters Earth\'s shadow'],
    correct: 'Moon passes between Sun and Earth',
    funFact: 'By cosmic coincidence, the Sun is ~400x larger than the Moon but also ~400x farther away, making them appear the same size in our sky!',
  },
  {
    question: 'What is a "Blood Moon"?',
    options: ['Moon closest to Earth', 'Total lunar eclipse \u2014 Moon turns red', 'Moon during a meteor shower', 'First moon of autumn'],
    correct: 'Total lunar eclipse \u2014 Moon turns red',
    funFact: 'During a total lunar eclipse, Earth\'s atmosphere bends red wavelengths of sunlight onto the Moon\'s surface, giving it a copper-red hue.',
  },
  {
    question: 'How many people have walked on the Moon?',
    options: ['6', '8', '12', '15'],
    correct: '12',
    funFact: '12 astronauts walked on the Moon across 6 Apollo missions (Apollo 11, 12, 14, 15, 16, and 17) between 1969 and 1972.',
  },
  {
    question: 'What causes ocean tides?',
    options: ['Wind patterns', 'Moon\'s gravitational pull', 'Earth\'s rotation speed', 'Sun\'s magnetic field'],
    correct: 'Moon\'s gravitational pull',
    funFact: 'The Moon\'s gravity creates two tidal bulges on Earth \u2014 one facing the Moon and one on the opposite side. The Sun also contributes, creating spring and neap tides.',
  },
  {
    question: 'What is the Moon\'s diameter?',
    options: ['~1,737 km', '~3,474 km', '~5,200 km', '~2,100 km'],
    correct: '~3,474 km',
    funFact: 'The Moon\'s diameter is about 27% of Earth\'s. If Earth were a basketball, the Moon would be a tennis ball!',
  },
  {
    question: 'What is tidal locking?',
    options: ['Tides that don\'t change', 'Same side of Moon always faces Earth', 'Moon locked in fixed orbit', 'Ocean tides synchronized globally'],
    correct: 'Same side of Moon always faces Earth',
    funFact: 'Tidal locking means the Moon rotates on its axis in exactly the same time it takes to orbit Earth (~27.3 days), so we always see the same face.',
  },
  {
    question: 'What is a "Blue Moon"?',
    options: ['Moon appears blue', 'Second full moon in a calendar month', 'Moon at its farthest from Earth', 'Moon during winter solstice'],
    correct: 'Second full moon in a calendar month',
    funFact: 'Blue Moons occur roughly every 2.7 years. The phrase "once in a blue moon" means something rare. The Moon doesn\'t actually turn blue!',
  },
  {
    question: 'Who was the first person on the Moon?',
    options: ['Buzz Aldrin', 'Neil Armstrong', 'Michael Collins', 'John Glenn'],
    correct: 'Neil Armstrong',
    funFact: 'Neil Armstrong stepped onto the Moon on July 20, 1969, declaring: "That\'s one small step for man, one giant leap for mankind."',
  },
  {
    question: 'How far is the Moon from Earth?',
    options: ['~150,000 km', '~384,400 km', '~500,000 km', '~250,000 km'],
    correct: '~384,400 km',
    funFact: 'The average distance is 384,400 km (238,855 miles). You could fit all 7 other planets in our solar system between Earth and the Moon!',
  },
  {
    question: 'What is a penumbral eclipse?',
    options: ['Partial solar eclipse', 'Moon passes through Earth\'s partial shadow', 'Eclipse visible only at poles', 'Eclipse lasting less than 1 minute'],
    correct: 'Moon passes through Earth\'s partial shadow',
    funFact: 'Penumbral eclipses are subtle \u2014 the Moon only slightly dims. They\'re much harder to notice than partial or total lunar eclipses.',
  },
  {
    question: 'What is the Moon\'s surface gravity compared to Earth?',
    options: ['1/3rd', '1/6th', '1/10th', '1/2'],
    correct: '1/6th',
    funFact: 'On the Moon, you\'d weigh only 1/6th of your Earth weight. A 180 lb person would weigh just 30 lbs! You could jump about 6x higher.',
  },
  {
    question: 'What year was the last total solar eclipse visible from the US before 2024?',
    options: ['2012', '2015', '2017', '2019'],
    correct: '2017',
    funFact: 'The August 21, 2017 "Great American Eclipse" was visible coast to coast. Before that, the last total solar eclipse crossing the entire US was in 1918!',
  },
  {
    question: 'What is the "Harvest Moon"?',
    options: ['Largest moon of the year', 'Full moon closest to autumn equinox', 'Moon during harvest season', 'Orange-colored moon in October'],
    correct: 'Full moon closest to autumn equinox',
    funFact: 'The Harvest Moon rises shortly after sunset for several nights in a row, historically giving farmers extra light to harvest crops.',
  },
  {
    question: 'What does "waning" mean?',
    options: ['Moon appears to grow', 'Moon appears to shrink', 'Moon is at its brightest', 'Moon is closest to Earth'],
    correct: 'Moon appears to shrink',
    funFact: 'The Moon "waxes" (grows from new to full) and "wanes" (shrinks from full to new). A waning crescent is the thin sliver before a new moon.',
  },
  {
    question: 'What is a "Supermoon"?',
    options: ['Full moon at perigee (closest to Earth)', 'Moon that appears larger due to atmosphere', 'Two full moons in one month', 'Moon during summer solstice'],
    correct: 'Full moon at perigee (closest to Earth)',
    funFact: 'A Supermoon appears about 14% larger and 30% brighter than when the Moon is at apogee (farthest point). The term was coined by astrologer Richard Nolle in 1979.',
  },
  {
    question: 'How old is the Moon?',
    options: ['~3.5 billion years', '~4.5 billion years', '~5.5 billion years', '~2.5 billion years'],
    correct: '~4.5 billion years',
    funFact: 'The Moon formed about 4.5 billion years ago, likely when a Mars-sized body called Theia collided with early Earth. Debris from the impact coalesced to form the Moon.',
  },
  {
    question: 'What is the far side of the Moon?',
    options: ['The dark side that never gets sunlight', 'The hemisphere never visible from Earth', 'The southern pole region', 'The side facing away from the Sun'],
    correct: 'The hemisphere never visible from Earth',
    funFact: 'The far side is NOT always dark \u2014 it gets equal sunlight. It was first photographed by the Soviet Luna 3 in 1959 and has far more craters than the near side.',
  },
  {
    question: 'What are the dark areas on the Moon called?',
    options: ['Craters', 'Maria (seas)', 'Rilles', 'Highlands'],
    correct: 'Maria (seas)',
    funFact: 'Early astronomers thought these dark basalt plains were seas and called them "maria" (Latin for seas). They formed from ancient volcanic eruptions 3-3.5 billion years ago.',
  },
  {
    question: 'What is a total solar eclipse\'s path called?',
    options: ['Umbral zone', 'Path of totality', 'Eclipse corridor', 'Shadow track'],
    correct: 'Path of totality',
    funFact: 'The path of totality is typically only 100-160 miles wide. Outside it, you only see a partial eclipse. Totality lasts a maximum of about 7.5 minutes.',
  },
  {
    question: 'What is the Moon\'s orbital period around Earth?',
    options: ['~24 days', '~27.3 days', '~29.5 days', '~31 days'],
    correct: '~27.3 days',
    funFact: 'The sidereal period (27.3 days) is the true orbital period relative to stars. The synodic period (29.5 days) is longer because Earth has moved in its orbit.',
  },
  {
    question: 'What is a "Micromoon"?',
    options: ['A very small crescent', 'Full moon at apogee (farthest from Earth)', 'Eclipse of a tiny portion of the Moon', 'The Moon when barely visible'],
    correct: 'Full moon at apogee (farthest from Earth)',
    funFact: 'A Micromoon appears about 14% smaller and 30% dimmer than a Supermoon. The difference is subtle but measurable in photographs.',
  },
  {
    question: 'What is the largest crater on the Moon?',
    options: ['Tycho', 'Copernicus', 'South Pole-Aitken Basin', 'Clavius'],
    correct: 'South Pole-Aitken Basin',
    funFact: 'The South Pole-Aitken Basin is about 2,500 km across and 8 km deep \u2014 one of the largest impact structures in the entire solar system. It is on the far side.',
  },
  {
    question: 'What causes "Earthshine" on the Moon?',
    options: ['Stars reflecting off the Moon', 'Sunlight reflected from Earth illuminating the Moon\'s dark side', 'Volcanic activity on the Moon', 'Aurora-like phenomena on the Moon'],
    correct: 'Sunlight reflected from Earth illuminating the Moon\'s dark side',
    funFact: 'Earthshine is visible as a faint glow on the unlit part of a crescent Moon. Leonardo da Vinci was the first to correctly explain it in the early 1500s.',
  },
  {
    question: 'How much does the Moon move away from Earth each year?',
    options: ['~1 cm', '~3.8 cm', '~10 cm', '~1 meter'],
    correct: '~3.8 cm',
    funFact: 'The Moon recedes about 3.8 cm per year due to tidal interactions. Billions of years ago, it was much closer and Earth\'s days were much shorter.',
  },
  {
    question: 'What is a selenologist?',
    options: ['Someone who studies the Sun', 'A scientist who studies the Moon', 'An eclipse photographer', 'A lunar astronaut'],
    correct: 'A scientist who studies the Moon',
    funFact: 'Selenology comes from "Selene," the Greek goddess of the Moon. The study of the Moon\'s geology, surface, and history falls under selenology.',
  },
  {
    question: 'What is the "Saros cycle"?',
    options: ['Moon\'s rotation period', '~18-year cycle after which eclipses repeat in similar patterns', 'Time between two Supermoons', 'Cycle of Moon\'s distance changes'],
    correct: '~18-year cycle after which eclipses repeat in similar patterns',
    funFact: 'The Saros cycle is 6,585.3 days (about 18 years, 11 days). After one Saros, the Sun, Earth, and Moon return to nearly the same relative geometry.',
  },
  {
    question: 'What did the Apollo missions bring back from the Moon?',
    options: ['~100 lbs of rocks', '~382 kg (842 lbs) of lunar samples', '~50 kg of dust', '~1,000 lbs of material'],
    correct: '~382 kg (842 lbs) of lunar samples',
    funFact: 'The 6 Apollo missions returned 2,196 individual samples from the Moon. Scientists are still studying them today and some remain sealed and unopened.',
  },
  {
    question: 'What is a "Worm Moon"?',
    options: ['Moon with crater patterns like worms', 'The full moon in March', 'A phase between crescent and half', 'Moon during a meteor shower'],
    correct: 'The full moon in March',
    funFact: 'Full moons have traditional names from Native American and colonial traditions. March\'s "Worm Moon" refers to earthworms emerging as the ground thaws in spring.',
  },
  {
    question: 'Why can\'t lunar eclipses happen every month?',
    options: ['The Moon is too far away', 'The Moon\'s orbit is tilted ~5\u00b0 relative to Earth\'s orbital plane', 'The Sun is too bright', 'Earth\'s shadow is too small'],
    correct: 'The Moon\'s orbit is tilted ~5\u00b0 relative to Earth\'s orbital plane',
    funFact: 'Because of this 5\u00b0 tilt, the Moon usually passes above or below Earth\'s shadow. Eclipses only occur when the Moon crosses the ecliptic plane during a full or new moon.',
  },
  {
    question: 'What is the "terminator" on the Moon?',
    options: ['The edge between the lit and dark sides', 'A large crater', 'The far side boundary', 'Where meteorites typically hit'],
    correct: 'The edge between the lit and dark sides',
    funFact: 'The terminator is the best place to observe the Moon through a telescope because shadows are longest there, revealing crater walls and mountain peaks in dramatic relief.',
  },
  {
    question: 'What is a "Spring tide"?',
    options: ['Tide during springtime', 'Extra-high tide when Sun and Moon align', 'Tide caused by warm weather', 'Rising tide in rivers'],
    correct: 'Extra-high tide when Sun and Moon align',
    funFact: 'Spring tides occur at new and full moons when the Sun, Moon, and Earth align. "Spring" refers to the water springing up, not the season. They\'re 20% higher than average.',
  },
  {
    question: 'What is the temperature range on the Moon\'s surface?',
    options: ['-50\u00b0C to 50\u00b0C', '-173\u00b0C to 127\u00b0C', '-100\u00b0C to 200\u00b0C', '-273\u00b0C to 300\u00b0C'],
    correct: '-173\u00b0C to 127\u00b0C',
    funFact: 'Without an atmosphere to retain heat, the Moon experiences extreme temperature swings of about 300\u00b0C between day and night.',
  },
  {
    question: 'What is a "Neap tide"?',
    options: ['Tide during neap season', 'Weaker tide when Sun and Moon are at right angles', 'Extremely low tide', 'Tide caused by wind'],
    correct: 'Weaker tide when Sun and Moon are at right angles',
    funFact: 'Neap tides occur during first and third quarter moons. The Sun and Moon partially cancel each other\'s gravitational pull, resulting in smaller tidal differences.',
  },
  {
    question: 'Which country first landed a spacecraft on the far side of the Moon?',
    options: ['United States', 'Russia', 'China', 'India'],
    correct: 'China',
    funFact: 'China\'s Chang\'e 4 made the first-ever soft landing on the lunar far side on January 3, 2019, in the Von K\u00e1rm\u00e1n crater within the South Pole-Aitken Basin.',
  },
  {
    question: 'What are lunar rilles?',
    options: ['Mountain ranges', 'Long narrow channels on the Moon\'s surface', 'Types of craters', 'Frozen rivers'],
    correct: 'Long narrow channels on the Moon\'s surface',
    funFact: 'Lunar rilles were likely formed by flowing lava billions of years ago. Some are hundreds of kilometers long. Hadley Rille was visited by Apollo 15 astronauts.',
  },
  {
    question: 'What is the "Diamond Ring effect" during a solar eclipse?',
    options: ['Sunlight through Moon craters just before/after totality', 'Ring of fire during annular eclipse', 'Reflection off the Moon\'s ice', 'A lens flare in cameras'],
    correct: 'Sunlight through Moon craters just before/after totality',
    funFact: 'Just before and after totality, a single bead of sunlight shines through lunar valleys creating a brilliant "diamond" on the corona "ring." It lasts only seconds.',
  },
  {
    question: 'What is the Moon made of?',
    options: ['Mostly iron', 'Mostly silicate rock similar to Earth\'s mantle', 'Mostly ice', 'Mostly calcium'],
    correct: 'Mostly silicate rock similar to Earth\'s mantle',
    funFact: 'The Moon\'s composition is very similar to Earth\'s mantle, supporting the giant impact hypothesis. It has a small iron core only about 350 km in radius.',
  },
  {
    question: 'How many total solar eclipses occur per century on average?',
    options: ['About 25', 'About 66', 'About 100', 'About 150'],
    correct: 'About 66',
    funFact: 'While total solar eclipses happen about 2-3 times every 5 years somewhere on Earth, any specific location on Earth sees one only about once every 375 years on average.',
  },
  {
    question: 'What is the "Lunar Reconnaissance Orbiter"?',
    options: ['A crewed spacecraft orbiting the Moon', 'A NASA probe mapping the Moon in high detail since 2009', 'A Chinese rover on the Moon', 'The Apollo command module'],
    correct: 'A NASA probe mapping the Moon in high detail since 2009',
    funFact: 'The LRO has mapped the Moon\'s surface at resolutions down to 50 cm/pixel. It has photographed the Apollo landing sites, showing astronaut footpaths and equipment.',
  },
  {
    question: 'Is there water on the Moon?',
    options: ['No, none at all', 'Yes, as ice in permanently shadowed craters at the poles', 'Yes, as liquid underground', 'Yes, in the maria (seas)'],
    correct: 'Yes, as ice in permanently shadowed craters at the poles',
    funFact: 'NASA\'s LCROSS mission confirmed water ice in Cabeus crater near the south pole in 2009. Some craters haven\'t seen sunlight in billions of years.',
  },
  {
    question: 'Who was the last Apollo astronaut to leave the Moon\'s surface?',
    options: ['Harrison Schmitt', 'Eugene Cernan', 'John Young', 'Charles Duke'],
    correct: 'Eugene Cernan',
    funFact: 'Eugene Cernan, commander of Apollo 17, was the last to re-enter the Lunar Module on December 14, 1972. His final words on the surface noted that man would return.',
  },
  {
    question: 'What is the "Giant Impact Hypothesis"?',
    options: ['The Moon was captured from deep space', 'A Mars-sized body (Theia) hit Earth, creating the Moon from debris', 'The Moon formed alongside Earth', 'A giant asteroid created the largest crater'],
    correct: 'A Mars-sized body (Theia) hit Earth, creating the Moon from debris',
    funFact: 'About 4.5 billion years ago, a planet called Theia collided with proto-Earth. The debris disk coalesced into the Moon within about 100 years.',
  },
  {
    question: 'What did Apollo 15 astronauts use on the Moon?',
    options: ['A helicopter', 'The Lunar Roving Vehicle (LRV)', 'Jet packs', 'A drilling rig'],
    correct: 'The Lunar Roving Vehicle (LRV)',
    funFact: 'The Lunar Rover was an electric vehicle weighing 210 kg on Earth (35 kg on the Moon). Apollo 15, 16, and 17 each used one. They remain on the Moon today.',
  },
  {
    question: 'What is a "Strawberry Moon"?',
    options: ['A pink-colored moon', 'The full moon in June', 'A moon shaped like a strawberry', 'A moon during strawberry harvest'],
    correct: 'The full moon in June',
    funFact: 'The Strawberry Moon gets its name from Algonquin tribes who associated June\'s full moon with the strawberry harvesting season.',
  },
  {
    question: 'What is the Moon\'s escape velocity?',
    options: ['~1.2 km/s', '~2.4 km/s', '~5.0 km/s', '~8.0 km/s'],
    correct: '~2.4 km/s',
    funFact: 'The Moon\'s escape velocity is only about 2.4 km/s (5,300 mph), compared to Earth\'s 11.2 km/s. This makes lunar launches require much less energy.',
  },
  {
    question: 'What is a "moonquake"?',
    options: ['An earthquake caused by the Moon', 'Seismic activity on the Moon itself', 'Shaking during a lunar eclipse', 'Tidal wave during a Supermoon'],
    correct: 'Seismic activity on the Moon itself',
    funFact: 'Apollo seismometers detected thousands of moonquakes. Some deep moonquakes occur at ~700 km depth due to tidal stresses from Earth\'s gravity.',
  },
  {
    question: 'What are "Cold Traps" on the Moon?',
    options: ['Freezing winds', 'Permanently shadowed craters below -230\u00b0C', 'The dark side temperature', 'Liquid nitrogen pools'],
    correct: 'Permanently shadowed craters below -230\u00b0C',
    funFact: 'Cold traps at the lunar poles can reach -248\u00b0C, colder than Pluto. They trap volatile compounds including water ice accumulated over billions of years.',
  },
  {
    question: 'What is the "Lunar Gateway"?',
    options: ['A crater on the Moon', 'A planned space station orbiting the Moon', 'A launch pad on the Moon', 'A portal theory about the Moon'],
    correct: 'A planned space station orbiting the Moon',
    funFact: 'The Lunar Gateway will orbit the Moon in a near-rectilinear halo orbit, serving as a staging point for surface missions under the Artemis program.',
  },
  {
    question: 'How many Apollo missions attempted Moon landings?',
    options: ['6', '7', '8', '9'],
    correct: '7',
    funFact: 'Seven missions attempted lunar landings (Apollo 11-17), six succeeded. Apollo 13 aborted due to an oxygen tank explosion but the crew returned safely.',
  },
  {
    question: 'What is regolith?',
    options: ['Moon rock deep underground', 'The layer of loose dust and broken rock on the surface', 'A mineral found only on the Moon', 'Volcanic glass'],
    correct: 'The layer of loose dust and broken rock on the surface',
    funFact: 'Lunar regolith is 2-8 meters deep in mare areas and up to 15 meters in highlands, created by billions of years of meteorite impacts pulverizing bedrock.',
  },
  {
    question: 'What is the Moon\'s core made of?',
    options: ['Solid rock throughout', 'A small iron core (solid inner, liquid outer)', 'Pure nickel', 'Magma'],
    correct: 'A small iron core (solid inner, liquid outer)',
    funFact: 'The Moon has a small iron core about 350 km in radius, only 1-2% of its mass. This is why the Moon has no global magnetic field today.',
  },
  {
    question: 'What is the "Lunar Laser Ranging Experiment"?',
    options: ['Using lasers to cut Moon rocks', 'Reflecting laser beams off mirrors left on the Moon', 'Laser communication with probes', 'Measuring composition by laser'],
    correct: 'Reflecting laser beams off mirrors left on the Moon',
    funFact: 'Apollo astronauts placed retroreflectors on the Moon. By timing laser pulses bounced off them, we measure the Earth-Moon distance to within millimeters.',
  },
  {
    question: 'What is the "Hunter\'s Moon"?',
    options: ['A full moon during hunting season', 'The first full moon after the Harvest Moon', 'A new moon ideal for hunting', 'A blood-red moon in November'],
    correct: 'The first full moon after the Harvest Moon',
    funFact: 'Like the Harvest Moon, the Hunter\'s Moon rises soon after sunset for several evenings, historically giving hunters extra light to track prey before winter.',
  },
  {
    question: 'Why is Shackleton Crater significant?',
    options: ['It\'s the largest crater', 'Its permanently shadowed interior likely contains water ice', 'Apollo 11 landed there', 'It\'s the youngest crater'],
    correct: 'Its permanently shadowed interior likely contains water ice',
    funFact: 'Shackleton Crater at the south pole has a rim in near-permanent sunlight (solar power) and a floor in permanent shadow (water ice). It\'s a prime base location.',
  },
  {
    question: 'What is "libration"?',
    options: ['The Moon\'s rotation speed', 'A slight wobble letting us see ~59% of the Moon\'s surface', 'The Moon\'s vibration from impacts', 'Gravitational oscillation'],
    correct: 'A slight wobble letting us see ~59% of the Moon\'s surface',
    funFact: 'Although tidally locked, libration from orbital eccentricity and axial tilt lets us peek around the edges, seeing 59% of the surface over time.',
  },
  {
    question: 'What is the Aristarchus crater known for?',
    options: ['Largest crater', 'The brightest feature on the near side', 'Apollo 11 landing site', 'Only crater with water'],
    correct: 'The brightest feature on the near side',
    funFact: 'Aristarchus is so bright it can be seen with the naked eye during earthshine. It\'s about 40 km wide with walls that reflect light exceptionally well.',
  },
  {
    question: 'What is the Moon Illusion?',
    options: ['The Moon doesn\'t exist', 'The Moon appears larger near the horizon than overhead', 'The Moon changes color nightly', 'The Moon moves backward'],
    correct: 'The Moon appears larger near the horizon than overhead',
    funFact: 'The Moon Illusion is psychological \u2014 the Moon is the same angular size regardless of position. The brain interprets it as larger near the horizon due to visual cues.',
  },
  {
    question: 'What was Luna 9 famous for?',
    options: ['First lunar orbit', 'First soft landing on the Moon (1966)', 'First sample return', 'First far side images'],
    correct: 'First soft landing on the Moon (1966)',
    funFact: 'The Soviet Luna 9 made the first soft landing on February 3, 1966, proving the surface was solid enough to support a spacecraft.',
  },
  {
    question: 'What did India\'s Chandrayaan-1 discover?',
    options: ['Moonquakes', 'Evidence of water molecules on the lunar surface', 'Lunar volcanoes', 'Underground caves'],
    correct: 'Evidence of water molecules on the lunar surface',
    funFact: 'India\'s Chandrayaan-1 (2008) confirmed water and hydroxyl molecules in the lunar soil, revolutionizing our understanding of the Moon.',
  },
  {
    question: 'What are "mascons" on the Moon?',
    options: ['Types of Moon rocks', 'Mass concentrations beneath the surface', 'Magnetic anomalies', 'Mountain regions'],
    correct: 'Mass concentrations beneath the surface',
    funFact: 'Mascons beneath large mare basins create gravitational anomalies that perturb spacecraft orbits. They were discovered during the Lunar Orbiter missions in the 1960s.',
  },
  {
    question: 'What is the "Tycho crater" known for?',
    options: ['It\'s on the far side', 'Its spectacular bright ray system', 'Apollo 12 landing site', 'It contains diamonds'],
    correct: 'Its spectacular bright ray system',
    funFact: 'Tycho is about 108 million years old and 85 km across. Its bright rays extend 1,500 km. A dinosaur could have witnessed its formation.',
  },
  {
    question: 'What is the "Wolf Moon"?',
    options: ['A moon shaped like a wolf', 'The full moon in January', 'A very dim moon', 'Moon during wolf migration'],
    correct: 'The full moon in January',
    funFact: 'January\'s full moon is named after wolves howling during cold midwinter nights. Other names include Ice Moon and Old Moon.',
  },
  {
    question: 'What would happen if the Moon disappeared?',
    options: ['Nothing noticeable', 'Earth\'s tilt would destabilize, tides would shrink dramatically', 'Earth would fly into space', 'The Sun would explode'],
    correct: 'Earth\'s tilt would destabilize, tides would shrink dramatically',
    funFact: 'Without the Moon, Earth\'s axial tilt could vary between 0\u00b0 and 85\u00b0. Ocean tides would be only 1/3 current size (from the Sun alone).',
  },
  {
    question: 'What is the "Metonic cycle"?',
    options: ['A 19-year period after which Moon phases repeat on same dates', 'The Moon\'s rotation period', 'Time between eclipses', 'The Moon\'s color cycle'],
    correct: 'A 19-year period after which Moon phases repeat on same dates',
    funFact: 'Discovered by Greek astronomer Meton in 432 BCE, this cycle (235 synodic months) was used to create lunisolar calendars. It\'s accurate to within 2 hours.',
  },
  {
    question: 'What is the Apollo 11 landing site called?',
    options: ['Sea of Tranquility', 'Ocean of Storms', 'Sea of Serenity', 'Sea of Clouds'],
    correct: 'Sea of Tranquility',
    funFact: 'Mare Tranquillitatis was chosen because it was relatively flat. The exact landing spot is now officially called "Statio Tranquillitatis."',
  },
  {
    question: 'What are "Lunar Swirls"?',
    options: ['Spinning dust devils', 'Bright sinuous markings from local magnetic fields', 'Patterns from ancient water', 'Ancient river beds'],
    correct: 'Bright sinuous markings from local magnetic fields',
    funFact: 'Lunar swirls like Reiner Gamma are associated with localized magnetic fields that may deflect solar wind, keeping the soil from darkening.',
  },
  {
    question: 'What is the Moon\'s albedo?',
    options: ['~12%', '~36%', '~55%', '~80%'],
    correct: '~12%',
    funFact: 'The Moon reflects only about 12% of sunlight \u2014 similar to worn asphalt. It appears bright only because of contrast with the dark night sky.',
  },
  {
    question: 'What are "lava tubes" on the Moon?',
    options: ['Active lava channels', 'Underground tunnels from ancient lava flows', 'Apollo instruments', 'Surface channels'],
    correct: 'Underground tunnels from ancient lava flows',
    funFact: 'Lunar lava tubes could be 1 km wide (much larger than Earth\'s due to lower gravity). They could shelter future bases from radiation and micrometeorites.',
  },
  {
    question: 'What is SLIM (Japan\'s Moon lander)?',
    options: ['A weight-loss program', 'Smart Lander for Investigating Moon', 'A slim rocket design', 'Sub-Lunar Investigation Module'],
    correct: 'Smart Lander for Investigating Moon',
    funFact: 'Japan\'s SLIM landed in January 2024, making Japan the 5th country to soft-land on the Moon. It demonstrated precision landing within 100m of its target.',
  },
  {
    question: 'What is the "Beaver Moon"?',
    options: ['A brown-colored moon', 'The full moon in November', 'A moon when beavers are active', 'The smallest full moon'],
    correct: 'The full moon in November',
    funFact: 'November\'s full moon coincided with the time to set beaver traps before winter. It\'s also called the Frost Moon.',
  },
  {
    question: 'What is "Helium-3" on the Moon?',
    options: ['A type of moonrock', 'A rare isotope from solar wind, potential fusion fuel', 'A gas in the lunar atmosphere', 'A chemical in moon dust'],
    correct: 'A rare isotope from solar wind, potential fusion fuel',
    funFact: 'Helium-3 is rare on Earth but abundant in lunar regolith (deposited by solar wind over billions of years). It could theoretically fuel clean nuclear fusion reactors.',
  },
  {
    question: 'How much of the Moon\'s surface have humans explored?',
    options: ['Less than 5%', 'About 25%', 'About 50%', 'About 75%'],
    correct: 'Less than 5%',
    funFact: 'The six Apollo landing sites explored only tiny areas. All the ground covered by astronauts would fit inside a small town. Vast regions remain unvisited.',
  },
  {
    question: 'What is the "Corn Moon"?',
    options: ['A yellow moon', 'The full moon in September (if not Harvest Moon)', 'A moon over cornfields', 'A moon during planting season'],
    correct: 'The full moon in September (if not Harvest Moon)',
    funFact: 'When September\'s full moon isn\'t closest to the autumn equinox, it\'s called the Corn Moon. The name comes from the time when corn was ready for harvest.',
  },
  {
    question: 'What is the "Ocean of Storms"?',
    options: ['An ocean on Earth affected by the Moon', 'The largest mare on the Moon (Oceanus Procellarum)', 'A theory about lunar weather', 'Tidal waves caused by the Moon'],
    correct: 'The largest mare on the Moon (Oceanus Procellarum)',
    funFact: 'Oceanus Procellarum spans about 2,500 km across the Moon\'s near side. Unlike other maria, it wasn\'t formed by a single impact but by volcanic flooding.',
  },
  {
    question: 'What is the "Selenelion" phenomenon?',
    options: ['A type of moonquake', 'Seeing both the eclipsed Moon and the Sun simultaneously near horizon', 'A special alignment of moons', 'Moonlight creating rainbows'],
    correct: 'Seeing both the eclipsed Moon and the Sun simultaneously near horizon',
    funFact: 'A selenelion occurs during a lunar eclipse when atmospheric refraction bends light, allowing both the Sun and eclipsed Moon to be seen above the horizon simultaneously.',
  },
  {
    question: 'What is the "Sturgeon Moon"?',
    options: ['A moon shaped like a fish', 'The full moon in August', 'A very bright moon', 'The moon during fishing season'],
    correct: 'The full moon in August',
    funFact: 'August\'s full moon was named the Sturgeon Moon by Native American tribes because giant sturgeon fish were most readily caught in the Great Lakes during this month.',
  },
  {
    question: 'What was the first object to orbit the Moon?',
    options: ['Apollo 8', 'Luna 10', 'Lunar Orbiter 1', 'Explorer 1'],
    correct: 'Luna 10',
    funFact: 'The Soviet Luna 10 became the first artificial satellite of the Moon on April 3, 1966. It transmitted data for 56 days before its batteries died.',
  },
  {
    question: 'What is "Peak of Eternal Light"?',
    options: ['The brightest spot on the Moon', 'A hypothetical point on the Moon in near-permanent sunlight', 'A mountain on Mars', 'The Sun\'s highest point as seen from Moon'],
    correct: 'A hypothetical point on the Moon in near-permanent sunlight',
    funFact: 'Near the lunar poles, some mountain peaks are illuminated by sunlight for over 90% of the year. These are prime locations for solar-powered bases.',
  },
  {
    question: 'What country sent the first probe to land on the far side of the Moon?',
    options: ['United States', 'Russia', 'China', 'India'],
    correct: 'China',
    funFact: 'China\'s Chang\'e 4 made the first-ever soft landing on the lunar far side on January 3, 2019, in the Von K\u00e1rm\u00e1n crater.',
  },
  {
    question: 'What is the "Pink Moon"?',
    options: ['A pink-colored moon', 'The full moon in April', 'A moon during cherry blossom season', 'A rare atmospheric event'],
    correct: 'The full moon in April',
    funFact: 'April\'s full moon is called the Pink Moon after the pink wildflower phlox that blooms in early spring. The Moon does not actually appear pink.',
  },
  // ─── Apollo Missions in Detail ─────────────────────────────
  {
    question: 'How many Apollo missions attempted to land on the Moon?',
    options: ['6', '7', '9', '11'],
    correct: '7',
    funFact: 'Seven missions attempted lunar landings (Apollo 11-17), and six succeeded. Apollo 13 had to abort due to an oxygen tank explosion but returned safely.',
  },
  {
    question: 'What was Apollo 8 famous for?',
    options: ['First Moon landing', 'First humans to orbit the Moon', 'First spacewalk', 'First docking in space'],
    correct: 'First humans to orbit the Moon',
    funFact: 'Apollo 8 orbited the Moon on Christmas Eve 1968. The crew took the famous "Earthrise" photo and read from Genesis during a live TV broadcast watched by a billion people.',
  },
  {
    question: 'Who was the last person to walk on the Moon?',
    options: ['Buzz Aldrin', 'Gene Cernan', 'Harrison Schmitt', 'John Young'],
    correct: 'Gene Cernan',
    funFact: 'Eugene Cernan was the last to re-enter the lunar module on December 14, 1972, during Apollo 17. He wrote his daughter\'s initials in the lunar dust.',
  },
  {
    question: 'What was unique about Apollo 15, 16, and 17?',
    options: ['They were unmanned', 'They carried lunar rovers', 'They orbited but didn\'t land', 'They went to Mars'],
    correct: 'They carried lunar rovers',
    funFact: 'The Lunar Roving Vehicle (LRV) allowed astronauts to explore much farther from the landing site. On Apollo 17, the rover traveled a total of 35.9 km.',
  },
  {
    question: 'What was the Apollo 13 mission famous for?',
    options: ['First landing', 'Longest moonwalk', 'Successful failure — survived an explosion in space', 'First woman on the Moon'],
    correct: 'Successful failure — survived an explosion in space',
    funFact: 'An oxygen tank exploded on April 13, 1970. The crew used the lunar module as a lifeboat, swinging around the Moon and returning safely after 4 harrowing days.',
  },
  {
    question: 'How much Moon rock did the Apollo missions bring back?',
    options: ['10 kg', '50 kg', '382 kg', '1,000 kg'],
    correct: '382 kg',
    funFact: 'The six successful landing missions returned 382 kg (842 lbs) of lunar samples — 2,196 individual specimens from different locations, still studied today.',
  },
  {
    question: 'Who was the only scientist-astronaut to walk on the Moon?',
    options: ['Buzz Aldrin', 'Harrison Schmitt', 'Jim Irwin', 'Alan Bean'],
    correct: 'Harrison Schmitt',
    funFact: 'Harrison "Jack" Schmitt, a geologist, walked on the Moon during Apollo 17 in 1972. He discovered orange soil — volcanic glass beads 3.7 billion years old.',
  },
  {
    question: 'What did Apollo 11 astronauts leave on the Moon?',
    options: ['Only footprints', 'A flag, instruments, and a plaque reading "We came in peace for all mankind"', 'Nothing', 'A time capsule'],
    correct: 'A flag, instruments, and a plaque reading "We came in peace for all mankind"',
    funFact: 'They also left retroreflectors that scientists still bounce lasers off today to measure the Moon\'s distance to within millimeters.',
  },
  {
    question: 'How long did the Apollo 11 moonwalk last?',
    options: ['30 minutes', '2 hours 31 minutes', '6 hours', '12 hours'],
    correct: '2 hours 31 minutes',
    funFact: 'Armstrong and Aldrin\'s first moonwalk was relatively short. Later missions extended to over 7 hours per EVA, with Apollo 17 doing three moonwalks.',
  },
  {
    question: 'What was the Apollo command module\'s name on Apollo 11?',
    options: ['Eagle', 'Columbia', 'Odyssey', 'Endeavour'],
    correct: 'Columbia',
    funFact: 'Columbia orbited the Moon with Michael Collins while Armstrong and Aldrin descended in the lunar module Eagle. Collins was alone for over 21 hours.',
  },
  // ─── Lunar Geology ─────────────────────────────────────────
  {
    question: 'What are the dark areas on the Moon called?',
    options: ['Craters', 'Maria (seas)', 'Mountains', 'Valleys'],
    correct: 'Maria (seas)',
    funFact: 'The dark patches are ancient basaltic lava plains called maria (singular: mare, Latin for "sea"). Early astronomers thought they were actual seas.',
  },
  {
    question: 'What are the bright areas on the Moon?',
    options: ['Ice caps', 'Highlands (terrae)', 'Sandy deserts', 'Reflective lakes'],
    correct: 'Highlands (terrae)',
    funFact: 'The lunar highlands are older and more heavily cratered than the maria. They\'re composed mainly of anorthosite, a light-colored ignite rock.',
  },
  {
    question: 'What is the largest crater on the Moon?',
    options: ['Tycho', 'Copernicus', 'South Pole-Aitken Basin', 'Clavius'],
    correct: 'South Pole-Aitken Basin',
    funFact: 'The South Pole-Aitken Basin is about 2,500 km across and 8 km deep — one of the largest known impact structures in the entire solar system.',
  },
  {
    question: 'Is there water ice on the Moon?',
    options: ['No, none at all', 'Yes, in permanently shadowed craters at the poles', 'Only on the far side', 'Only during eclipses'],
    correct: 'Yes, in permanently shadowed craters at the poles',
    funFact: 'NASA\'s LCROSS mission confirmed water ice in Cabeus crater in 2009. Some permanently shadowed polar craters haven\'t seen sunlight in billions of years.',
  },
  {
    question: 'What is regolith?',
    options: ['A type of Moon rock', 'The layer of loose, broken rock and dust covering the Moon\'s surface', 'Lunar lava', 'Moon atmosphere'],
    correct: 'The layer of loose, broken rock and dust covering the Moon\'s surface',
    funFact: 'Lunar regolith is 4-5 meters deep in maria and up to 15 meters in highlands. It\'s formed by billions of years of meteorite impacts grinding rock into fine powder.',
  },
  {
    question: 'Does the Moon have a magnetic field?',
    options: ['Yes, like Earth\'s', 'No global field, but localized crustal magnetism', 'Only during eclipses', 'Only on the far side'],
    correct: 'No global field, but localized crustal magnetism',
    funFact: 'The Moon lost its global magnetic field 3-4 billion years ago when its iron core cooled. But some surface rocks retain magnetism from that ancient field.',
  },
  {
    question: 'What are rilles on the Moon?',
    options: ['Mountains', 'Long, narrow channels or grooves — likely ancient lava tubes or collapsed tunnels', 'Craters', 'Dust dunes'],
    correct: 'Long, narrow channels or grooves — likely ancient lava tubes or collapsed tunnels',
    funFact: 'Hadley Rille, visited by Apollo 15, is 120 km long. Some rilles may indicate intact lava tubes below — potential sites for future lunar bases.',
  },
  {
    question: 'How old is the Moon?',
    options: ['1 billion years', '2.5 billion years', '4.5 billion years', '6 billion years'],
    correct: '4.5 billion years',
    funFact: 'The Moon formed about 4.5 billion years ago, shortly after Earth. Radiometric dating of Apollo samples confirmed this age.',
  },
  // ─── Moon\'s Effect on Earth ─────────────────────────────────
  {
    question: 'How does the Moon stabilize Earth?',
    options: ['Controls weather', 'Stabilizes Earth\'s axial tilt at ~23.5 degrees', 'Generates Earth\'s magnetic field', 'Controls plate tectonics'],
    correct: 'Stabilizes Earth\'s axial tilt at ~23.5 degrees',
    funFact: 'Without the Moon, Earth\'s axial tilt could vary chaotically from 0° to 85°, causing extreme climate swings that might have prevented complex life from evolving.',
  },
  {
    question: 'How much is the Moon moving away from Earth each year?',
    options: ['Not at all', '3.8 cm per year', '1 meter per year', '10 meters per year'],
    correct: '3.8 cm per year',
    funFact: 'Tidal interactions transfer energy from Earth\'s rotation to the Moon\'s orbit. In the distant past, the Moon was much closer and days were shorter.',
  },
  {
    question: 'What causes spring tides?',
    options: ['Spring season', 'Sun and Moon aligned (new/full moon) creating stronger tides', 'Earth closer to Sun', 'Moon at apogee'],
    correct: 'Sun and Moon aligned (new/full moon) creating stronger tides',
    funFact: 'Spring tides (nothing to do with the season) occur at new and full moons when the Sun and Moon pull together. Neap tides occur at quarter moons when they pull at right angles.',
  },
  {
    question: 'How is Earth\'s rotation slowing due to the Moon?',
    options: ['It isn\'t', 'Days are getting about 2.3 milliseconds longer per century', 'Days get 1 hour longer per million years', 'Only during eclipses'],
    correct: 'Days are getting about 2.3 milliseconds longer per century',
    funFact: '600 million years ago, a day was only about 21 hours long. Tidal friction from the Moon gradually transfers rotational energy, lengthening our days.',
  },
  {
    question: 'What would happen to Earth\'s tides without the Moon?',
    options: ['No change', 'Tides would be about 1/3 as strong (Sun-only tides)', 'No tides at all', 'Stronger tides'],
    correct: 'Tides would be about 1/3 as strong (Sun-only tides)',
    funFact: 'The Moon generates about 2/3 of Earth\'s tidal force and the Sun about 1/3. Without the Moon, tides would still exist but be much weaker.',
  },
  // ─── Future Lunar Missions ─────────────────────────────────
  {
    question: 'What is the Artemis program\'s goal for the Moon?',
    options: ['Fly by the Moon', 'Establish a sustainable human presence on and around the Moon', 'Mine the Moon immediately', 'Destroy an asteroid'],
    correct: 'Establish a sustainable human presence on and around the Moon',
    funFact: 'Artemis plans to build the Gateway space station in lunar orbit and establish a base camp on the surface, targeting the resource-rich south polar region.',
  },
  {
    question: 'What did India\'s Chandrayaan-3 achieve in 2023?',
    options: ['Orbited the Moon', 'First landing near the lunar south pole', 'Returned Moon samples', 'Found life on the Moon'],
    correct: 'First landing near the lunar south pole',
    funFact: 'On August 23, 2023, Chandrayaan-3\'s Vikram lander touched down near 69°S latitude, making India the first country to land near the Moon\'s south pole.',
  },
  {
    question: 'What is Japan\'s SLIM mission?',
    options: ['A Mars probe', 'Smart Lander for Investigating Moon — precision landing demonstrator', 'A space telescope', 'An asteroid mission'],
    correct: 'Smart Lander for Investigating Moon — precision landing demonstrator',
    funFact: 'SLIM landed on the Moon in January 2024, demonstrating pinpoint landing accuracy within 100 meters. It landed upside-down but still operated its cameras.',
  },
  {
    question: 'What is the Lunar Gateway?',
    options: ['A Moon base on the surface', 'A planned space station orbiting the Moon', 'A rocket to the Moon', 'A lunar elevator'],
    correct: 'A planned space station orbiting the Moon',
    funFact: 'Gateway will orbit the Moon in a near-rectilinear halo orbit, serving as a staging point for lunar surface missions and deep space exploration.',
  },
  {
    question: 'Which private company\'s lander (Odysseus) reached the Moon in 2024?',
    options: ['SpaceX', 'Blue Origin', 'Intuitive Machines', 'Rocket Lab'],
    correct: 'Intuitive Machines',
    funFact: 'Intuitive Machines\' Odysseus (IM-1) landed near the south pole on Feb 22, 2024, becoming the first US lunar landing since Apollo 17 in 1972 — though it tipped on its side.',
  },
  {
    question: 'What resources make the lunar south pole attractive for bases?',
    options: ['Gold deposits', 'Water ice and near-permanent sunlight on crater rims', 'Oxygen atmosphere', 'Vegetation'],
    correct: 'Water ice and near-permanent sunlight on crater rims',
    funFact: 'Crater rims near the poles receive sunlight 80-90% of the time (for solar power), while permanently shadowed crater floors contain water ice for drinking, oxygen, and rocket fuel.',
  },
  // ─── Cultural Significance of the Moon ─────────────────────
  {
    question: 'What is the Chinese Moon goddess called?',
    options: ['Selene', 'Chang\'e', 'Diana', 'Artemis'],
    correct: 'Chang\'e',
    funFact: 'In Chinese mythology, Chang\'e flew to the Moon after drinking an elixir of immortality. China\'s lunar program is named after her — Chang\'e 1 through Chang\'e 6.',
  },
  {
    question: 'In Hindu mythology, who is the Moon god?',
    options: ['Surya', 'Chandra', 'Indra', 'Agni'],
    correct: 'Chandra',
    funFact: 'Chandra (also called Soma) rides a chariot pulled by ten white horses across the night sky. The word "Monday" in many Indian languages derives from "Moon day" (Somavar).',
  },
  {
    question: 'What did the ancient Greeks call the Moon goddess?',
    options: ['Athena', 'Selene', 'Aphrodite', 'Hera'],
    correct: 'Selene',
    funFact: 'Selene was the personification of the Moon in Greek mythology, driving a silver chariot across the sky. Artemis and Hecate were also associated with the Moon.',
  },
  {
    question: 'What do some cultures see in the Moon\'s markings instead of a "Man in the Moon"?',
    options: ['Nothing', 'A rabbit, a toad, or a woman', 'Only craters', 'A face always'],
    correct: 'A rabbit, a toad, or a woman',
    funFact: 'In East Asian, Mesoamerican, and Native American traditions, the Moon markings show a rabbit. Japanese folklore calls it the Moon Rabbit (Tsuki no Usagi) pounding rice cakes.',
  },
  {
    question: 'What is Ramadan\'s relationship to the Moon?',
    options: ['No connection', 'The Islamic calendar is lunar — Ramadan starts with crescent Moon sighting', 'It happens during full Moon only', 'It\'s based on the Sun'],
    correct: 'The Islamic calendar is lunar — Ramadan starts with crescent Moon sighting',
    funFact: 'The Islamic (Hijri) calendar is purely lunar with 12 months of 29-30 days. Important dates are determined by actual Moon sightings, not calculations.',
  },
  // ─── Lunar Eclipses and Supermoons ─────────────────────────
  {
    question: 'How long can a total lunar eclipse last?',
    options: ['A few seconds', 'Up to 1 hour 42 minutes', 'Exactly 2 hours', 'A full day'],
    correct: 'Up to 1 hour 42 minutes',
    funFact: 'The longest total lunar eclipse of the 21st century occurred on July 27, 2018, lasting 1 hour 43 minutes. The Moon was near apogee, taking longer to cross Earth\'s shadow.',
  },
  {
    question: 'What is a supermoon?',
    options: ['A very large moon phase', 'A full moon at or near perigee (closest to Earth)', 'The Moon during summer', 'An eclipse'],
    correct: 'A full moon at or near perigee (closest to Earth)',
    funFact: 'A supermoon appears about 14% larger and 30% brighter than a micromoon (full moon at apogee). The difference is subtle to the naked eye.',
  },
  {
    question: 'What causes the Moon to appear orange/red near the horizon?',
    options: ['It actually changes color', 'Earth\'s atmosphere scatters blue light, letting red through (like sunsets)', 'Lunar dust', 'Solar flares'],
    correct: 'Earth\'s atmosphere scatters blue light, letting red through (like sunsets)',
    funFact: 'When the Moon is near the horizon, its light passes through more atmosphere, scattering shorter blue wavelengths and leaving longer red/orange wavelengths — same physics as sunsets.',
  },
  {
    question: 'How often do total lunar eclipses occur?',
    options: ['Once a month', 'About 2-3 times per year somewhere on Earth', 'Once a decade', 'Every day somewhere'],
    correct: 'About 2-3 times per year somewhere on Earth',
    funFact: 'Total lunar eclipses happen about 2-3 times per year. Unlike solar eclipses, they\'re visible from the entire night side of Earth — anywhere the Moon is above the horizon.',
  },
  {
    question: 'What is a selenelion (selenehelion)?',
    options: ['A Moon rock', 'Seeing both the eclipsed Moon and the Sun simultaneously at horizon', 'A type of crater', 'A Moon earthquake'],
    correct: 'Seeing both the eclipsed Moon and the Sun simultaneously at horizon',
    funFact: 'A selenelion occurs during a lunar eclipse at sunrise/sunset when atmospheric refraction lets you see both the Sun and eclipsed Moon above the horizon simultaneously.',
  },
  // ─── Moon Formation ────────────────────────────────────────
  {
    question: 'What is the leading theory for how the Moon formed?',
    options: ['Captured asteroid', 'Spun off from Earth', 'Giant impact (Theia collision)', 'Formed from same cloud as Earth'],
    correct: 'Giant impact (Theia collision)',
    funFact: 'About 4.5 billion years ago, a Mars-sized body called Theia struck the proto-Earth. Debris from both bodies coalesced into the Moon. This explains their similar isotopes.',
  },
  {
    question: 'What was Theia?',
    options: ['A comet', 'A Mars-sized protoplanet that collided with early Earth', 'A moon of Jupiter', 'An asteroid'],
    correct: 'A Mars-sized protoplanet that collided with early Earth',
    funFact: 'Named after the Greek Titan mother of Selene (Moon goddess), Theia likely shared an orbit with Earth before their violent collision created the Moon.',
  },
  {
    question: 'What evidence supports the giant impact hypothesis?',
    options: ['The Moon is made of iron', 'Moon rocks have similar oxygen isotopes to Earth and the Moon lacks a large iron core', 'The Moon is older than Earth', 'Moon has atmosphere'],
    correct: 'Moon rocks have similar oxygen isotopes to Earth and the Moon lacks a large iron core',
    funFact: 'Apollo samples show Moon and Earth share nearly identical oxygen isotope ratios. The Moon\'s small iron core (only 1-2% of mass vs Earth\'s 30%) suggests it formed from mantle material.',
  },
  {
    question: 'What was the Lunar Magma Ocean?',
    options: ['Current lava on Moon', 'A molten layer covering early Moon that crystallized into the crust', 'A volcano', 'An ocean of water'],
    correct: 'A molten layer covering early Moon that crystallized into the crust',
    funFact: 'After formation, the Moon was covered in a magma ocean hundreds of km deep. As it cooled, lighter minerals floated to form the bright highland crust we see today.',
  },
  // ─── Additional Moon Facts ─────────────────────────────────
  {
    question: 'What is a moonquake?',
    options: ['An earthquake caused by the Moon', 'Seismic activity on the Moon detected by Apollo instruments', 'A Moon crater forming', 'A tidal wave'],
    correct: 'Seismic activity on the Moon detected by Apollo instruments',
    funFact: 'Apollo seismometers recorded thousands of moonquakes. Some are caused by tidal stresses, meteorite impacts, or thermal expansion. Deep moonquakes occur at ~700 km depth.',
  },
  {
    question: 'What is the Moon\'s escape velocity?',
    options: ['1.2 km/s', '2.38 km/s', '5.0 km/s', '11.2 km/s'],
    correct: '2.38 km/s',
    funFact: 'The Moon\'s escape velocity is just 2.38 km/s vs Earth\'s 11.2 km/s. This low gravity makes the Moon an ideal stepping stone for deeper space missions.',
  },
  {
    question: 'What temperature extremes does the Moon\'s surface experience?',
    options: ['0 to 50°C', '-173°C to 127°C', '-50°C to 100°C', '-273°C to 500°C'],
    correct: '-173°C to 127°C',
    funFact: 'Without an atmosphere, the Moon has no insulation. Sunlit areas reach 127°C (260°F) while shadowed areas plunge to -173°C (-280°F) — a 300°C swing.',
  },
  {
    question: 'How many countries have soft-landed on the Moon?',
    options: ['3', '4', '5', '6'],
    correct: '6',
    funFact: 'As of 2024, six countries/entities have soft-landed on the Moon: USSR (1966), USA (1966), China (2013), India (2023), Japan (2024), and a US private company (2024).',
  },
  {
    question: 'What is the "dark side" of the Moon?',
    options: ['A side that\'s always dark', 'The far side — it gets equal sunlight but is never visible from Earth', 'The shadowed poles', 'Areas during new moon'],
    correct: 'The far side — it gets equal sunlight but is never visible from Earth',
    funFact: 'The far side gets just as much sunlight as the near side. It\'s more heavily cratered with fewer maria and has a thicker crust, looking very different from what we see.',
  },
  {
    question: 'What is libration?',
    options: ['Moon spinning faster', 'A slight wobble allowing us to see about 59% of the Moon\'s surface over time', 'Moon moving closer', 'A lunar phase'],
    correct: 'A slight wobble allowing us to see about 59% of the Moon\'s surface over time',
    funFact: 'Due to libration (caused by orbital eccentricity, inclination, and Earth\'s rotation), we can see 59% of the Moon\'s surface over time, not just 50%.',
  },
  {
    question: 'What is the Moon\'s core made of?',
    options: ['Solid rock', 'A small iron core (solid inner, liquid outer)', 'Ice', 'Hollow'],
    correct: 'A small iron core (solid inner, liquid outer)',
    funFact: 'The Moon has a small iron core about 480 km in diameter (Earth\'s is 6,960 km). It has a solid inner core, liquid outer core, and partially molten boundary layer.',
  },
  {
    question: 'Can you see stars from the Moon?',
    options: ['No, never', 'Yes, clearly when not looking at sunlit surfaces', 'Only during eclipses', 'Stars don\'t exist near the Moon'],
    correct: 'Yes, clearly when not looking at sunlit surfaces',
    funFact: 'Stars are always visible from the Moon if you look away from the Sun and bright surfaces. Apollo photos show no stars because cameras were exposed for bright surfaces.',
  },
  {
    question: 'What is the lunar recession?',
    options: ['Moon getting smaller', 'Moon slowly moving away from Earth over time', 'Moon\'s orbit decaying', 'Moon losing atmosphere'],
    correct: 'Moon slowly moving away from Earth over time',
    funFact: 'The Moon is receding at 3.8 cm/year due to tidal energy transfer. In the early solar system, the Moon was about 10 times closer to Earth than today.',
  },
  {
    question: 'What are mascons on the Moon?',
    options: ['Mountains', 'Mass concentrations — areas of higher gravity beneath some maria', 'Magnetic regions', 'Types of craters'],
    correct: 'Mass concentrations — areas of higher gravity beneath some maria',
    funFact: 'Mascons are dense material beneath lunar maria that create gravitational anomalies. They caused problems for early lunar orbiters by subtly altering their orbits.',
  },
  {
    question: 'What is the Moon Illusion?',
    options: ['The Moon changing size', 'The Moon appearing larger near the horizon (an optical illusion)', 'Seeing two moons', 'The Moon changing color'],
    correct: 'The Moon appearing larger near the horizon (an optical illusion)',
    funFact: 'The Moon is actually slightly smaller near the horizon (farther away by Earth\'s radius). The illusion is psychological — likely involving how our brain interprets size cues.',
  },
  {
    question: 'How long is a lunar day (sunrise to sunrise)?',
    options: ['24 hours', '~14 Earth days', '~29.5 Earth days', '27.3 Earth days'],
    correct: '~29.5 Earth days',
    funFact: 'A lunar day equals one synodic month (~29.5 Earth days). Any given spot on the Moon gets about 14.75 days of continuous sunlight followed by 14.75 days of darkness.',
  },
  {
    question: 'What is transient lunar phenomena (TLP)?',
    options: ['Aliens on the Moon', 'Brief, unexplained changes in appearance of the lunar surface', 'Meteor impacts', 'Tidal effects'],
    correct: 'Brief, unexplained changes in appearance of the lunar surface',
    funFact: 'TLPs include localized color changes, brightness spots, and haziness reported for centuries. They may be caused by outgassing, meteor impacts, or electrostatic effects.',
  },
  {
    question: 'What is the Lunar Laser Ranging Experiment?',
    options: ['A weapon test', 'Using retroreflectors on Moon to measure its distance via laser pulses', 'Moon-based telescope', 'A communication method'],
    correct: 'Using retroreflectors on Moon to measure its distance via laser pulses',
    funFact: 'Apollo 11, 14, and 15 left retroreflectors that still work today. By timing laser bounces, we measure the Earth-Moon distance to millimeter precision.',
  },
  {
    question: 'What element is relatively abundant on the Moon that could fuel future fusion reactors?',
    options: ['Uranium', 'Helium-3', 'Plutonium', 'Deuterium'],
    correct: 'Helium-3',
    funFact: 'Helium-3, deposited by solar wind, is rare on Earth but relatively abundant in lunar regolith. If fusion technology advances, lunar He-3 could provide clean energy for Earth.',
  },
  {
    question: 'What is the synodic month vs sidereal month?',
    options: ['Same thing', 'Synodic is phase cycle (29.5 days); sidereal is orbital period relative to stars (27.3 days)', 'Sidereal is longer', 'They differ by 1 day'],
    correct: 'Synodic is phase cycle (29.5 days); sidereal is orbital period relative to stars (27.3 days)',
    funFact: 'The synodic month is longer because as the Moon orbits Earth, Earth also moves around the Sun. The Moon needs 2 extra days to reach the same Sun-Earth-Moon angle.',
  },
  {
    question: 'What is the "Earthrise" photo?',
    options: ['Earth from Moon\'s surface', 'Famous Apollo 8 photo showing Earth rising above the Moon\'s horizon', 'Earth from ISS', 'Sunrise on Earth'],
    correct: 'Famous Apollo 8 photo showing Earth rising above the Moon\'s horizon',
    funFact: 'Taken by William Anders on December 24, 1968, Earthrise showed our fragile blue planet rising above the barren lunar landscape — credited with inspiring the environmental movement.',
  },
  // ─── More Apollo Mission Details ───────────────────────────
  {
    question: 'What was unique about the Apollo 12 landing?',
    options: ['First night landing', 'Precision landing near Surveyor 3 probe', 'Longest stay', 'First to find water'],
    correct: 'Precision landing near Surveyor 3 probe',
    funFact: 'Apollo 12 landed within 200 meters of the Surveyor 3 probe (which had landed in 1967). Astronauts retrieved parts of it to study how materials survived on the Moon.',
  },
  {
    question: 'What happened to the Apollo 12 rocket during launch?',
    options: ['Engine failure', 'Struck by lightning twice', 'Ran out of fuel', 'Nothing unusual'],
    correct: 'Struck by lightning twice',
    funFact: 'Lightning struck the Saturn V twice during ascent, temporarily knocking out fuel cells and telemetry. Quick thinking by mission control and the crew saved the mission.',
  },
  {
    question: 'What was the longest lunar surface stay during Apollo?',
    options: ['2.5 hours (Apollo 11)', '33 hours (Apollo 14)', '75 hours (Apollo 17)', '55 hours (Apollo 16)'],
    correct: '75 hours (Apollo 17)',
    funFact: 'Apollo 17 astronauts Cernan and Schmitt spent over 75 hours on the surface (3+ days), conducting three EVAs totaling 22 hours and driving 35.9 km in the rover.',
  },
  {
    question: 'What was the purpose of the Apollo Lunar Surface Experiments Package (ALSEP)?',
    options: ['Photography only', 'A suite of scientific instruments left on the Moon to transmit data to Earth', 'Navigation aids', 'Communication relays'],
    correct: 'A suite of scientific instruments left on the Moon to transmit data to Earth',
    funFact: 'ALSEP packages on Apollo 12-17 included seismometers, magnetometers, and solar wind collectors. They transmitted data for years, some until 1977 when funding ended.',
  },
  {
    question: 'How many people have orbited the Moon without landing?',
    options: ['3', '6', '12', '24'],
    correct: '6',
    funFact: 'Six command module pilots orbited alone while their crewmates walked below: Collins (11), Gordon (12), Roosa (14), Worden (15), Mattingly (16), and Evans (17).',
  },
  // ─── More Lunar Geology ────────────────────────────────────
  {
    question: 'What are lunar swirls?',
    options: ['Spinning dust storms', 'Bright, sinuous markings on the surface associated with local magnetic fields', 'Water patterns', 'Ancient rivers'],
    correct: 'Bright, sinuous markings on the surface associated with local magnetic fields',
    funFact: 'Lunar swirls like Reiner Gamma are thought to form where crustal magnetic fields deflect solar wind, preventing space weathering and keeping the surface bright.',
  },
  {
    question: 'What caused the lunar maria to form?',
    options: ['Water erosion', 'Ancient volcanic eruptions flooding basins with basaltic lava', 'Meteor impacts alone', 'Wind erosion'],
    correct: 'Ancient volcanic eruptions flooding basins with basaltic lava',
    funFact: 'Between 3-4 billion years ago, lava from the Moon\'s interior flooded large impact basins, creating the dark, smooth maria. Volcanism has since ceased.',
  },
  {
    question: 'What is KREEP?',
    options: ['A Moon creature', 'Lunar material rich in potassium, rare earth elements, and phosphorus', 'A type of crater', 'A rock collecting method'],
    correct: 'Lunar material rich in potassium, rare earth elements, and phosphorus',
    funFact: 'KREEP formed as the last residue of the Lunar Magma Ocean crystallization. It\'s concentrated on the nearside, particularly around the Procellarum region.',
  },
  {
    question: 'What is the Tycho crater famous for?',
    options: ['Largest crater', 'Young crater with bright ray system visible from Earth', 'Contains water', 'Landing site'],
    correct: 'Young crater with bright ray system visible from Earth',
    funFact: 'Tycho is only ~108 million years old (young by lunar standards). Its bright rays extend over 1,500 km across the Moon\'s surface, easily visible during full Moon.',
  },
  {
    question: 'What is the Aristarchus crater known for?',
    options: ['Deepest crater', 'The brightest spot on the Moon — highly reflective', 'Oldest crater', 'Largest crater'],
    correct: 'The brightest spot on the Moon — highly reflective',
    funFact: 'Aristarchus is so bright it\'s visible to the naked eye on the dark (earthlit) side of the Moon. It\'s also a frequent site of reported transient lunar phenomena.',
  },
  // ─── More Tides and Earth Effects ──────────────────────────
  {
    question: 'What is a tidal bore?',
    options: ['A boring topic', 'A wave caused by incoming tide funneling into a narrow river', 'A drill for ocean floor', 'A type of moonquake'],
    correct: 'A wave caused by incoming tide funneling into a narrow river',
    funFact: 'The Bay of Fundy has tides up to 16 meters — the world\'s highest. Tidal bores occur in rivers like the Severn (UK) and Qiantang (China), creating surfable waves.',
  },
  {
    question: 'How does the Moon affect Earth\'s length of day?',
    options: ['Makes days shorter', 'Gradually slowing Earth\'s rotation, making days longer', 'No effect', 'Makes seasons change'],
    correct: 'Gradually slowing Earth\'s rotation, making days longer',
    funFact: 'Tidal friction between the Moon and Earth\'s oceans acts like a brake. Fossil coral records show that 400 million years ago, a year had about 400 shorter days.',
  },
  {
    question: 'What are Earth tides?',
    options: ['Only ocean tides', 'The solid Earth itself deforms slightly due to the Moon\'s gravity', 'Atmospheric currents', 'Magnetic fluctuations'],
    correct: 'The solid Earth itself deforms slightly due to the Moon\'s gravity',
    funFact: 'The Moon\'s gravity causes Earth\'s crust to flex up to 30 cm twice daily. This "body tide" is smaller than ocean tides but measurable with precise instruments.',
  },
  // ─── More Eclipses ─────────────────────────────────────────
  {
    question: 'Why don\'t eclipses happen every month?',
    options: ['Moon doesn\'t orbit monthly', 'Moon\'s orbit is tilted ~5° relative to Earth\'s orbit around Sun', 'Sun is too far away', 'Earth is too small'],
    correct: 'Moon\'s orbit is tilted ~5° relative to Earth\'s orbit around Sun',
    funFact: 'The Moon\'s orbit is tilted about 5.14° to the ecliptic. Eclipses only happen when the Moon crosses the ecliptic plane (at nodes) during full or new moon.',
  },
  {
    question: 'What is a Saros cycle?',
    options: ['A Moon phase cycle', 'An 18-year, 11-day cycle after which nearly identical eclipses repeat', 'A daily cycle', 'A calendar system'],
    correct: 'An 18-year, 11-day cycle after which nearly identical eclipses repeat',
    funFact: 'Known since ancient Babylon, the Saros cycle occurs because after 6,585.3 days, the Sun, Moon, and nodes return to almost the same relative geometry.',
  },
  {
    question: 'What is a diamond ring effect during a solar eclipse?',
    options: ['A jewelry advertisement', 'Last bright point of sunlight through a lunar valley before/after totality', 'Stars around the Moon', 'A lunar phase'],
    correct: 'Last bright point of sunlight through a lunar valley before/after totality',
    funFact: 'Just before and after totality, sunlight shines through a lunar valley creating a bright point of light alongside the corona — resembling a diamond ring.',
  },
  {
    question: 'What are Baily\'s Beads?',
    options: ['A necklace', 'Points of light visible at the Moon\'s edge during solar eclipse caused by lunar mountains', 'Stars near the Moon', 'A lunar crater chain'],
    correct: 'Points of light visible at the Moon\'s edge during solar eclipse caused by lunar mountains',
    funFact: 'Named after Francis Baily (1836), these beads of light shine through lunar valleys and craters at the Moon\'s limb during the seconds before and after totality.',
  },
  // ─── Moon in Science Fiction and Culture ───────────────────
  {
    question: 'What was the first science fiction story about traveling to the Moon?',
    options: ['From the Earth to the Moon (Verne, 1865)', 'True History (Lucian, ~170 CE)', 'First Men in the Moon (Wells, 1901)', '2001: A Space Odyssey'],
    correct: 'True History (Lucian, ~170 CE)',
    funFact: 'Lucian of Samosata wrote about a ship carried to the Moon by a waterspout in ~170 CE — nearly 2,000 years before actual spaceflight.',
  },
  {
    question: 'What is the Moon Treaty (1979)?',
    options: ['An agreement all countries signed', 'A UN agreement declaring the Moon common heritage — ratified by very few countries', 'A peace treaty signed on the Moon', 'A movie'],
    correct: 'A UN agreement declaring the Moon common heritage — ratified by very few countries',
    funFact: 'The Moon Treaty declares no nation can own any part of the Moon. However, no major spacefaring nation (USA, Russia, China) has ratified it, limiting its effectiveness.',
  },
  {
    question: 'What Japanese term describes Moon viewing as a cultural practice?',
    options: ['Hanami', 'Tsukimi', 'Sakura', 'Obon'],
    correct: 'Tsukimi',
    funFact: 'Tsukimi (Moon viewing) is a centuries-old Japanese autumn tradition. People gather to admire the full Moon, often eating tsukimi dango (rice dumplings) and decorating with pampas grass.',
  },
  {
    question: 'In which religion is the crescent Moon a major symbol?',
    options: ['Hinduism', 'Buddhism', 'Islam', 'Christianity'],
    correct: 'Islam',
    funFact: 'The crescent Moon and star became associated with Islam during the Ottoman Empire. The Islamic calendar is lunar, and the crescent signals the start of each month.',
  },
  // ─── More Moon Science ─────────────────────────────────────
  {
    question: 'What is the Moon\'s albedo (reflectivity)?',
    options: ['90% (very reflective)', '12% (similar to asphalt)', '50% (like snow)', '75% (like white paint)'],
    correct: '12% (similar to asphalt)',
    funFact: 'Despite appearing bright at night, the Moon only reflects about 12% of sunlight — similar to worn asphalt. It appears bright only because it\'s against the dark sky.',
  },
  {
    question: 'Does the Moon have any atmosphere?',
    options: ['Yes, thick like Earth', 'An extremely thin exosphere with traces of gases', 'No, absolute vacuum', 'Only during eclipses'],
    correct: 'An extremely thin exosphere with traces of gases',
    funFact: 'The Moon has an exosphere containing helium, neon, hydrogen, and argon at about 100 molecules per cubic cm — compared to Earth\'s 10^19 molecules per cubic cm at sea level.',
  },
  {
    question: 'What is the Moon\'s internal structure?',
    options: ['Solid throughout', 'Crust, mantle, and small iron core — similar layers to Earth', 'Hollow inside', 'All liquid'],
    correct: 'Crust, mantle, and small iron core — similar layers to Earth',
    funFact: 'The Moon has a ~50 km crust, silicate mantle, and a ~480 km iron core (partially liquid). Apollo seismometers revealed this layered structure.',
  },
  {
    question: 'What is the "Harvest Moon"?',
    options: ['A small Moon', 'The full moon nearest to the autumn equinox', 'A red Moon', 'The last full moon of summer'],
    correct: 'The full moon nearest to the autumn equinox',
    funFact: 'The Harvest Moon rises shortly after sunset for several nights in a row, providing extra light for farmers harvesting crops. The Moon\'s path is shallow near the equinox.',
  },
  {
    question: 'What is a "Worm Moon"?',
    options: ['A Moon with worm-like craters', 'The full moon in March', 'A type of eclipse', 'A Moon phase for fishing'],
    correct: 'The full moon in March',
    funFact: 'March\'s full moon is called the Worm Moon because earthworms begin to emerge as the soil thaws in spring. Different cultures had various names for each month\'s full Moon.',
  },
  {
    question: 'What is the "Wolf Moon"?',
    options: ['A werewolf legend', 'The full moon in January', 'A very large Moon', 'A Moon with wolf-shaped craters'],
    correct: 'The full moon in January',
    funFact: 'January\'s full moon was named by Native Americans for the wolves howling during the long cold nights of winter. Other names include Ice Moon and Old Moon.',
  },
  {
    question: 'What is the "Sturgeon Moon"?',
    options: ['A Moon near a lake', 'The full moon in August', 'A fish-shaped Moon', 'A Russian Moon mission'],
    correct: 'The full moon in August',
    funFact: 'August\'s full Moon is named after the sturgeon fish, which were most readily caught in the Great Lakes and Lake Champlain during this month.',
  },
  {
    question: 'How does moonlight affect wildlife?',
    options: ['No effect', 'Many species adjust behavior — some forage more, others hide from predators', 'Only affects werewolves', 'Only affects ocean life'],
    correct: 'Many species adjust behavior — some forage more, others hide from predators',
    funFact: 'Coral spawning is synchronized with the full Moon. Dung beetles navigate by moonlight. Many prey animals reduce activity during bright moons to avoid predators.',
  },
  {
    question: 'What is the antipodal focusing effect on the Moon?',
    options: ['A photography technique', 'Seismic waves from an impact converging on the opposite side of the Moon', 'A telescopic illusion', 'Light focusing at the poles'],
    correct: 'Seismic waves from an impact converging on the opposite side of the Moon',
    funFact: 'Large impacts send seismic waves through the Moon that converge on the antipodal (opposite) point, potentially causing disruption. Some hilly terrain may have formed this way.',
  },
  {
    question: 'What is the Moon\'s orbital eccentricity?',
    options: ['Perfectly circular (0.0)', 'Slightly elliptical (0.0549)', 'Highly elliptical (0.5)', 'Irregular'],
    correct: 'Slightly elliptical (0.0549)',
    funFact: 'The Moon\'s orbit varies from 356,500 km (perigee) to 406,700 km (apogee). This 50,000 km difference is why the Moon\'s apparent size changes throughout the month.',
  },
  {
    question: 'What is the Sea of Tranquility?',
    options: ['An ocean on the Moon', 'The mare (lava plain) where Apollo 11 landed', 'A calm area of space', 'A crater at the south pole'],
    correct: 'The mare (lava plain) where Apollo 11 landed',
    funFact: 'Mare Tranquillitatis is a basaltic lava plain on the Moon\'s nearside. Armstrong and Aldrin landed in its southwestern portion on July 20, 1969.',
  },
  {
    question: 'What is lunar dust\'s biggest problem for astronauts?',
    options: ['It tastes bad', 'It\'s extremely abrasive, clingy, and potentially toxic to lungs', 'It\'s radioactive', 'It\'s too heavy'],
    correct: 'It\'s extremely abrasive, clingy, and potentially toxic to lungs',
    funFact: 'Lunar dust is electrostatically charged, jagged (never weathered by wind/water), and sticks to everything. Apollo astronauts reported it smelled like gunpowder.',
  },
  {
    question: 'What is the "Cold Trap" theory for lunar water?',
    options: ['Water freezes at night', 'Water molecules migrate to permanently shadowed craters where they freeze and accumulate', 'Comets bring fresh water daily', 'Moon creates its own water'],
    correct: 'Water molecules migrate to permanently shadowed craters where they freeze and accumulate',
    funFact: 'Temperatures in permanently shadowed craters can reach -248°C. Water delivered by comets and solar wind interactions slowly migrates to these "cold traps" over billions of years.',
  },
  {
    question: 'What is the proposed Lunar South Pole-Aitken Basin sample return mission?',
    options: ['Apollo 18', 'A mission concept to return ancient impact material from the Moon\'s oldest, largest basin', 'A Chinese mission in progress', 'A telescope on the Moon'],
    correct: 'A mission concept to return ancient impact material from the Moon\'s oldest, largest basin',
    funFact: 'The South Pole-Aitken Basin (4.3 billion years old, 2,500 km wide) may have excavated mantle material. A sample return would revolutionize our understanding of early solar system impacts.',
  },
  {
    question: 'What is Chang\'e 5 famous for?',
    options: ['First far side landing', 'First lunar sample return since 1976', 'First Chinese astronaut on Moon', 'Finding water'],
    correct: 'First lunar sample return since 1976',
    funFact: 'China\'s Chang\'e 5 returned 1.73 kg of lunar samples in December 2020 — the first new Moon samples in 44 years. They revealed volcanism as recent as 2 billion years ago.',
  },
  {
    question: 'What is a micro-moon?',
    options: ['A tiny moon in the solar system', 'A full moon at apogee (farthest from Earth), appearing smaller', 'A moon of an asteroid', 'A phase between quarter moons'],
    correct: 'A full moon at apogee (farthest from Earth), appearing smaller',
    funFact: 'A micro-moon (mini-moon) appears about 14% smaller and 30% dimmer than a supermoon. The difference is subtle but measurable — like comparing a quarter to a nickel.',
  },
  {
    question: 'How many lunar eclipses can occur in one year?',
    options: ['Maximum 1', 'Maximum 3', 'Maximum 5', 'Unlimited'],
    correct: 'Maximum 3',
    funFact: 'Up to 3 lunar eclipses can occur in a calendar year. In some years there are none. There are typically 2-5 eclipses total (solar + lunar) per year.',
  },
  {
    question: 'What is the Moon\'s moment of inertia telling us?',
    options: ['Its rotation speed', 'That mass is concentrated toward the center (has a dense core)', 'It\'s hollow', 'It\'s evenly distributed'],
    correct: 'That mass is concentrated toward the center (has a dense core)',
    funFact: 'The Moon\'s moment of inertia factor (0.3931) is less than a uniform sphere (0.4), indicating denser material at the center — evidence for its iron core.',
  },
  // ─── More Moon Questions (reaching 200+) ───────────────────
  {
    question: 'What is the Copernicus crater known for?',
    options: ['Oldest crater', 'A prominent young crater with terraced walls and central peaks', 'Deepest crater', 'Contains ice'],
    correct: 'A prominent young crater with terraced walls and central peaks',
    funFact: 'Copernicus is about 93 km across and 800 million years old. Its dramatic ray system and terraced walls make it one of the most studied craters on the Moon.',
  },
  {
    question: 'What is the Imbrium Basin?',
    options: ['A water basin', 'One of the largest impact basins on the Moon, filled with lava (Mare Imbrium)', 'A valley', 'A mountain range'],
    correct: 'One of the largest impact basins on the Moon, filled with lava (Mare Imbrium)',
    funFact: 'The Imbrium impact about 3.85 billion years ago created a basin 1,145 km across. The surrounding Apennine Mountains rise 5 km above the mare floor.',
  },
  {
    question: 'What is the Lunar Reconnaissance Orbiter (LRO)?',
    options: ['A rover', 'NASA spacecraft mapping the Moon in high resolution since 2009', 'A telescope on the Moon', 'A landing mission'],
    correct: 'NASA spacecraft mapping the Moon in high resolution since 2009',
    funFact: 'LRO has mapped the entire Moon at up to 0.5 meter resolution. Its images can even show the Apollo landing sites, rover tracks, and equipment left behind.',
  },
  {
    question: 'Can you see the Apollo landing sites from Earth with a telescope?',
    options: ['Yes, easily', 'No — they are far too small even for the largest telescopes', 'Only during full Moon', 'Only with Hubble'],
    correct: 'No — they are far too small even for the largest telescopes',
    funFact: 'The largest piece of equipment left on the Moon is about 9 meters across. To resolve it from Earth would require a telescope with a mirror over 200 meters wide.',
  },
  {
    question: 'What are lunar lava tubes?',
    options: ['Tubes carrying lava to the surface now', 'Ancient tunnels formed by flowing lava that could shelter future bases', 'Water channels', 'Gas vents'],
    correct: 'Ancient tunnels formed by flowing lava that could shelter future bases',
    funFact: 'Lunar lava tubes may be up to 1 km wide (far larger than Earth\'s due to lower gravity). They could protect future inhabitants from radiation, micrometeoroids, and temperature extremes.',
  },
  {
    question: 'What is the origin of the word "lunatic"?',
    options: ['A Roman emperor', 'From "luna" (Moon) — the ancient belief that the full Moon caused madness', 'A Greek astronomer', 'A type of moth'],
    correct: 'From "luna" (Moon) — the ancient belief that the full Moon caused madness',
    funFact: 'For centuries, people believed the full Moon caused insanity ("lunacy"). While scientific studies have found no statistical link, the belief persists in folklore.',
  },
  {
    question: 'What is "Moon gardening"?',
    options: ['Growing plants on the Moon', 'The practice of planting/harvesting according to lunar phases', 'NASA experiment', 'A children\'s game'],
    correct: 'The practice of planting/harvesting according to lunar phases',
    funFact: 'Lunar gardening traditions span many cultures. Practitioners plant above-ground crops during waxing Moon and root crops during waning Moon. Scientific support is limited.',
  },
  {
    question: 'What is the GRAIL mission?',
    options: ['A search for the Holy Grail', 'Twin spacecraft that mapped the Moon\'s gravitational field in extreme detail', 'A rover mission', 'A Mars mission'],
    correct: 'Twin spacecraft that mapped the Moon\'s gravitational field in extreme detail',
    funFact: 'GRAIL\'s twin spacecraft (Ebb and Flow) orbited the Moon in 2012, mapping gravity variations to reveal subsurface structures, ancient rift valleys, and impact basin details.',
  },
  {
    question: 'How was the Moon\'s age determined?',
    options: ['By counting craters', 'Radiometric dating of Apollo samples', 'Estimating from its appearance', 'Measuring its distance'],
    correct: 'Radiometric dating of Apollo samples',
    funFact: 'Scientists used uranium-lead and other radiometric techniques on Apollo rocks to determine the Moon is 4.51 billion years old — about 60 million years younger than the solar system.',
  },
  {
    question: 'What are "ghost craters"?',
    options: ['Invisible craters', 'Craters nearly buried by later lava flows with only their rims visible', 'Craters that disappeared', 'Optical illusions'],
    correct: 'Craters nearly buried by later lava flows with only their rims visible',
    funFact: 'Ghost craters are found in the maria where lava nearly covered older craters. Only their circular rims peek above the surface, like ghosts of their former selves.',
  },
  {
    question: 'What is the terminator on the Moon?',
    options: ['A movie character', 'The line between the lit and dark sides of the Moon', 'The edge of the Moon', 'Where craters end'],
    correct: 'The line between the lit and dark sides of the Moon',
    funFact: 'The terminator moves across the Moon\'s face during its phases. Craters along the terminator cast long shadows, making it the best region for observing lunar terrain.',
  },
  {
    question: 'What did the Soviet Luna 9 achieve?',
    options: ['First orbit of Moon', 'First soft landing on the Moon (1966)', 'First sample return', 'First far-side photo'],
    correct: 'First soft landing on the Moon (1966)',
    funFact: 'Luna 9 landed on Feb 3, 1966, in Oceanus Procellarum. It proved the surface was solid enough to support a spacecraft — a crucial finding for the Apollo program.',
  },
  {
    question: 'What did Luna 3 photograph for the first time?',
    options: ['The Sun', 'The far side of the Moon (1959)', 'Earth from space', 'Mars'],
    correct: 'The far side of the Moon (1959)',
    funFact: 'Luna 3 photographed the Moon\'s far side on October 7, 1959. The images revealed it was mostly highlands with very few maria — very different from the nearside.',
  },
  {
    question: 'What is the "Hunter\'s Moon"?',
    options: ['A Moon shaped like a bow', 'The full moon after the Harvest Moon', 'A Moon only hunters can see', 'A partial eclipse'],
    correct: 'The full moon after the Harvest Moon',
    funFact: 'The Hunter\'s Moon (usually October) rises soon after sunset like the Harvest Moon, providing bright moonlight for hunters tracking prey before winter.',
  },
  {
    question: 'What is the maximum number of full Moons possible in a calendar year?',
    options: ['12', '13', '14', '11'],
    correct: '13',
    funFact: 'Since the lunar cycle is 29.5 days and a year is 365.25 days, occasionally 13 full Moons fit into one year. When a month has two full Moons, the second is a "Blue Moon."',
  },
  {
    question: 'What is the "Beaver Moon"?',
    options: ['A Moon with beaver-shaped craters', 'The full moon in November', 'A Canadian holiday', 'A Moon visible from dams'],
    correct: 'The full moon in November',
    funFact: 'November\'s full Moon was named because beavers become active building dams before winter, and it was traditionally the time to set beaver traps for warm fur.',
  },
  {
    question: 'What is Earth\'s shadow composed of during a lunar eclipse?',
    options: ['One shadow', 'Two parts: the dark umbra (total shadow) and lighter penumbra (partial shadow)', 'Three shadows', 'No shadow, just darkness'],
    correct: 'Two parts: the dark umbra (total shadow) and lighter penumbra (partial shadow)',
    funFact: 'The umbra is the cone of complete shadow where all sunlight is blocked. The penumbra is where only part of the Sun is obscured — creating a partial dimming.',
  },
  {
    question: 'What is the "Danjon scale"?',
    options: ['A musical scale', 'A scale (L0-L4) measuring the darkness/color of a total lunar eclipse', 'A weight scale', 'A temperature scale'],
    correct: 'A scale (L0-L4) measuring the darkness/color of a total lunar eclipse',
    funFact: 'L0 is very dark (Moon nearly invisible), L4 is bright copper-red/orange. Volcanic aerosols in Earth\'s atmosphere can darken eclipses significantly.',
  },
  {
    question: 'Has anything been grown on the Moon?',
    options: ['Yes, plants grow there naturally', 'Cotton seeds sprouted briefly on Chang\'e 4 (2019) in a biosphere container', 'No, never', 'Only bacteria'],
    correct: 'Cotton seeds sprouted briefly on Chang\'e 4 (2019) in a biosphere container',
    funFact: 'China\'s Chang\'e 4 carried a mini biosphere to the far side. Cotton seeds sprouted in January 2019 — the first biological growth on the Moon. They died when temperatures dropped.',
  },
  {
    question: 'What is the Moon\'s orbital inclination?',
    options: ['0° (same as Earth\'s equator)', '5.14° to the ecliptic plane', '23.5° like Earth\'s tilt', '90° (polar orbit)'],
    correct: '5.14° to the ecliptic plane',
    funFact: 'The 5.14° tilt is why eclipses don\'t happen every month. The nodes (where the orbit crosses the ecliptic) precess with an 18.6-year cycle.',
  },
  // ─── Named Craters (Batch 2) ──────────────────────────────
  {
    question: 'Which crater is the largest on the Moon\'s near side?',
    options: ['Tycho', 'Copernicus', 'Bailly', 'Clavius'],
    correct: 'Bailly',
    funFact: 'Bailly is about 303 km wide near the south pole, named after Jean Sylvain Bailly, a French astronomer who became mayor of Paris during the French Revolution.',
  },
  {
    question: 'Who is the Tycho crater named after?',
    options: ['Tycho Brahe', 'A Greek hero', 'Tycho the robot', 'An Apollo astronaut'],
    correct: 'Tycho Brahe',
    funFact: 'Tycho is 85 km wide with bright rays extending 1,500+ km. Tycho Brahe made the most precise pre-telescope astronomical observations in the 16th century.',
  },
  {
    question: 'What is special about the Aristarchus crater?',
    options: ['Deepest crater', 'Brightest large spot on the Moon', 'Largest crater', 'Contains lava'],
    correct: 'Brightest large spot on the Moon',
    funFact: 'Aristarchus is so reflective it can be spotted with the naked eye on an earthlit Moon. It\'s named after Aristarchus of Samos who first proposed heliocentrism.',
  },
  {
    question: 'Which lunar crater has a perfectly flat dark floor?',
    options: ['Copernicus', 'Plato', 'Kepler', 'Archimedes'],
    correct: 'Plato',
    funFact: 'Plato is a 101 km lava-flooded crater with such a smooth dark floor it\'s been used to test telescope resolution. Named after the Greek philosopher.',
  },
  {
    question: 'What is the South Pole-Aitken Basin?',
    options: ['A small crater', 'The largest impact basin in the solar system (2,500 km)', 'A lunar sea', 'A mountain'],
    correct: 'The largest impact basin in the solar system (2,500 km)',
    funFact: 'Located on the far side, it\'s 2,500 km across and up to 8 km deep. China\'s Chang\'e 4 was the first to land inside it, in Von Kármán crater.',
  },
  {
    question: 'What makes Shackleton crater scientifically important?',
    options: ['It\'s the largest', 'Permanently shadowed interior likely holds water ice', 'It\'s the newest', 'Contains gold'],
    correct: 'Permanently shadowed interior likely holds water ice',
    funFact: 'Near the south pole, Shackleton\'s floor never sees sunlight. Temperatures stay below -173°C, cold enough to trap water ice for billions of years — key for future bases.',
  },
  {
    question: 'Which crater is named after the first human to observe the Moon through a telescope?',
    options: ['Copernicus', 'Galileo', 'Newton', 'Kepler'],
    correct: 'Galileo',
    funFact: 'Crater Galileo on the western near side is relatively small (16 km) for such a famous astronomer, but a large far-side basin was later named Galileo in additional recognition.',
  },
  {
    question: 'What is Clavius crater known for?',
    options: ['Deepest crater', 'One of the largest near-side craters with craters inside it', 'First landing site', 'Volcanic origin'],
    correct: 'One of the largest near-side craters with craters inside it',
    funFact: 'Clavius is 225 km across with a chain of progressively smaller craters on its floor — a famous telescopic sight. It was featured as a Moon base location in 2001: A Space Odyssey.',
  },
  // ─── Moon in Cultures (Batch 2) ───────────────────────────
  {
    question: 'What is the Chinese Moon goddess called?',
    options: ['Artemis', 'Chang\'e', 'Selene', 'Diana'],
    correct: 'Chang\'e',
    funFact: 'Chang\'e drank an elixir of immortality and flew to the Moon. China\'s entire lunar program is named after her. The Mid-Autumn Festival celebrates her legend with mooncakes.',
  },
  {
    question: 'In Hindu tradition, what is the Moon deity called?',
    options: ['Surya', 'Chandra', 'Agni', 'Vayu'],
    correct: 'Chandra',
    funFact: 'Chandra rides a chariot of ten white horses. India\'s Chandrayaan missions are named for this deity (Chandra=Moon + yaan=vehicle). Monday is "Somvar" (Soma\'s day) in Hindi.',
  },
  {
    question: 'What is the Japanese Moon deity called?',
    options: ['Amaterasu', 'Tsukuyomi', 'Susanoo', 'Inari'],
    correct: 'Tsukuyomi',
    funFact: 'Tsukuyomi-no-Mikoto is brother to sun goddess Amaterasu. After a quarrel at a feast, they refused to meet — creating the separation of day and night.',
  },
  {
    question: 'In Māori tradition, what is the Moon called?',
    options: ['Marama', 'Tane', 'Rangi', 'Hina'],
    correct: 'Marama',
    funFact: 'The Māori maramataka (lunar calendar) assigns each night a name and meaning, guiding planting, fishing, and ceremonies. It\'s one of the most detailed lunar calendar systems.',
  },
  {
    question: 'What do East Asian cultures traditionally see in the Moon\'s markings?',
    options: ['A face', 'A rabbit pounding rice/medicine', 'A tree', 'A woman'],
    correct: 'A rabbit pounding rice/medicine',
    funFact: 'Chinese, Japanese, and Korean traditions see a Jade Rabbit with a mortar and pestle. This is why China named its lunar rovers Yutu (Jade Rabbit).',
  },
  {
    question: 'How does the Islamic calendar use the Moon?',
    options: ['For decoration', 'Each month begins with sighting of the new crescent moon', 'Only for Ramadan', 'Only for navigation'],
    correct: 'Each month begins with sighting of the new crescent moon',
    funFact: 'The Islamic (Hijri) calendar is purely lunar — months are 29 or 30 days based on crescent sighting. This is why Islamic holidays shift ~11 days earlier each solar year.',
  },
  {
    question: 'What is the significance of the Moon in Judaism?',
    options: ['No significance', 'The Hebrew calendar is lunisolar — months follow the Moon', 'Only for Sabbath', 'Decoration only'],
    correct: 'The Hebrew calendar is lunisolar — months follow the Moon',
    funFact: 'Jewish months begin at the new moon (Rosh Chodesh). Major holidays like Passover and Sukkot always fall on full moons. The calendar adds leap months to stay aligned with seasons.',
  },
  // ─── Tidal Locking & Physics (Batch 2) ────────────────────
  {
    question: 'What is tidal locking?',
    options: ['Ocean tides stopping', 'A body rotating at the same rate it orbits', 'The Moon being stuck', 'Gravity turning off'],
    correct: 'A body rotating at the same rate it orbits',
    funFact: 'The Moon rotates once per orbit (27.3 days), keeping the same face toward Earth. Most large moons in the solar system are tidally locked to their planets.',
  },
  {
    question: 'What is lunar libration?',
    options: ['Moon shaking', 'Apparent wobble letting us see 59% of the Moon over time', 'Moon liberation from orbit', 'A telescope artifact'],
    correct: 'Apparent wobble letting us see 59% of the Moon over time',
    funFact: 'Libration in longitude (from orbital eccentricity), latitude (from axial tilt), and diurnal (from Earth\'s rotation) all contribute to revealing 9% more surface.',
  },
  {
    question: 'Is the far side of the Moon always dark?',
    options: ['Yes', 'No — it receives equal sunlight to the near side', 'Only half the time', 'Mostly dark'],
    correct: 'No — it receives equal sunlight to the near side',
    funFact: '"Dark side" is a misnomer. During new moon phases, the far side is fully illuminated. "Far side" is correct — it\'s always facing away from Earth, not always in shadow.',
  },
  {
    question: 'How far is the Moon from Earth on average?',
    options: ['38,400 km', '184,400 km', '384,400 km', '3,844,000 km'],
    correct: '384,400 km',
    funFact: 'This distance varies from 356,500 km (perigee) to 406,700 km (apogee). You could fit all 7 other planets side by side in this gap!',
  },
  {
    question: 'What is the Moon\'s diameter?',
    options: ['1,737 km', '3,474 km', '5,200 km', '12,742 km'],
    correct: '3,474 km',
    funFact: 'At 3,474 km diameter (27% of Earth\'s), the Moon is the 5th largest satellite in the solar system. It\'s larger than Pluto.',
  },
  {
    question: 'What causes a supermoon?',
    options: ['Moon gets bigger', 'Full moon coinciding with perigee (closest approach)', 'Special planetary alignment', 'Solar radiation effect'],
    correct: 'Full moon coinciding with perigee (closest approach)',
    funFact: 'Supermoons appear about 14% larger and 30% brighter than micro-moons (full at apogee). There are typically 3-4 supermoons per year.',
  },
  {
    question: 'What is the Moon\'s escape velocity?',
    options: ['1.2 km/s', '2.4 km/s', '5.0 km/s', '11.2 km/s'],
    correct: '2.4 km/s',
    funFact: 'Much lower than Earth\'s 11.2 km/s, making the Moon attractive as a launch point. Spacecraft leaving the Moon need far less fuel than leaving Earth.',
  },
  // ─── Lunar Resources (Batch 2) ────────────────────────────
  {
    question: 'What valuable isotope is found in lunar soil from solar wind?',
    options: ['Uranium-235', 'Helium-3', 'Deuterium', 'Carbon-14'],
    correct: 'Helium-3',
    funFact: 'Helium-3 could fuel future fusion reactors producing minimal radioactive waste. The Moon has ~1 million tons deposited by solar wind over billions of years — extremely rare on Earth.',
  },
  {
    question: 'Where is water ice confirmed on the Moon?',
    options: ['Maria', 'In permanently shadowed polar craters', 'Equator', 'Everywhere'],
    correct: 'In permanently shadowed polar craters',
    funFact: 'Multiple missions confirmed ice deposits. Chandrayaan-1 first detected it widely, and LCROSS confirmed it in Cabeus crater. This water is key to sustainable lunar exploration.',
  },
  {
    question: 'What is lunar regolith?',
    options: ['Solid bedrock', 'The layer of loose broken rock and dust covering the surface', 'Underground ice', 'Volcanic glass'],
    correct: 'The layer of loose broken rock and dust covering the surface',
    funFact: 'Regolith is 4-15m deep, extremely abrasive due to lack of weathering. Its jagged grains damaged Apollo equipment and spacesuits. Future missions must solve the dust problem.',
  },
  {
    question: 'Could lunar regolith be used for construction?',
    options: ['No, too weak', 'Yes — 3D printing and sintering have been demonstrated', 'Only for decoration', 'Only with Earth cement'],
    correct: 'Yes — 3D printing and sintering have been demonstrated',
    funFact: 'Scientists have 3D-printed structures using simulated regolith. Microwave sintering can fuse it into solid bricks. This ISRU approach avoids launching building materials from Earth.',
  },
  {
    question: 'Why is lunar water so important for exploration?',
    options: ['Swimming pools', 'Split into rocket fuel (H₂/O₂) and drinking water/oxygen', 'Making ice cream', 'Filling lakes'],
    correct: 'Split into rocket fuel (H₂/O₂) and drinking water/oxygen',
    funFact: 'Water electrolysis produces hydrogen fuel and oxygen for breathing and oxidizer. Using lunar water instead of launching it from Earth saves enormous costs.',
  },
  // ─── Missions (Batch 2) ───────────────────────────────────
  {
    question: 'Which country first soft-landed on the Moon?',
    options: ['USA', 'Soviet Union', 'China', 'ESA'],
    correct: 'Soviet Union',
    funFact: 'Luna 9 soft-landed on February 3, 1966, proving the surface could support a spacecraft. Some scientists had feared vehicles would sink into deep accumulated dust.',
  },
  {
    question: 'How many countries have achieved lunar soft landings (as of 2024)?',
    options: ['3', '4', '5', '6'],
    correct: '6',
    funFact: 'USSR (1966), USA (1966), China (2013), India (2023), Japan (2024), and privately Intuitive Machines/USA (2024). Several other countries have crashed probes deliberately.',
  },
  {
    question: 'What was Chang\'e 4\'s historic achievement?',
    options: ['First orbit', 'First far-side landing', 'First sample return', 'First human landing'],
    correct: 'First far-side landing',
    funFact: 'Chang\'e 4 landed in Von Kármán crater on January 3, 2019. A relay satellite (Queqiao) at L2 enables communication since the far side can\'t directly reach Earth.',
  },
  {
    question: 'What did Chang\'e 5 accomplish in 2020?',
    options: ['Far-side landing', 'Returned lunar samples — first in 44 years', 'Crewed landing', 'Built a base'],
    correct: 'Returned lunar samples — first in 44 years',
    funFact: 'Chang\'e 5 returned 1.73 kg of samples revealing volcanic activity as recent as 2 billion years ago — much younger than expected for such a small body.',
  },
  {
    question: 'What was Apollo 11\'s lunar module named?',
    options: ['Columbia', 'Eagle', 'Spider', 'Falcon'],
    correct: 'Eagle',
    funFact: '"The Eagle has landed" — Armstrong\'s words as they touched down in Mare Tranquillitatis on July 20, 1969. Only 25 seconds of fuel remained.',
  },
  {
    question: 'Which was the last crewed Moon landing?',
    options: ['Apollo 15', 'Apollo 16', 'Apollo 17', 'Apollo 18'],
    correct: 'Apollo 17',
    funFact: 'Apollo 17 (December 1972) included geologist Harrison Schmitt. Gene Cernan was the last to step off the Moon. No human has returned since.',
  },
  {
    question: 'What did Chandrayaan-1 discover?',
    options: ['Life', 'Widespread water/hydroxyl molecules on the lunar surface', 'Atmosphere', 'Magnetic field'],
    correct: 'Widespread water/hydroxyl molecules on the lunar surface',
    funFact: 'India\'s first lunar mission (2008) used its Moon Mineralogy Mapper to detect water molecules across the surface, fundamentally changing lunar science.',
  },
  {
    question: 'Which private company first landed on the Moon?',
    options: ['SpaceX', 'Blue Origin', 'Intuitive Machines', 'Astrobotic'],
    correct: 'Intuitive Machines',
    funFact: 'Their Odysseus (IM-1) lander touched down February 22, 2024, near Malapert A crater. It tipped sideways but still returned data — first commercial lunar landing.',
  },
  {
    question: 'What was the Soviet Lunokhod program?',
    options: ['Human landing', 'First robotic rovers on the Moon', 'Sample return', 'Orbital missions'],
    correct: 'First robotic rovers on the Moon',
    funFact: 'Lunokhod 1 (1970) and 2 (1973) were the first remote-controlled rovers on another world. Lunokhod 2 still holds the distance record for any off-Earth rover: 42 km.',
  },
  // ─── Moon Names & Definitions (Batch 2) ───────────────────
  {
    question: 'What is a "Harvest Moon"?',
    options: ['Any autumn full moon', 'The full moon closest to the autumnal equinox', 'A red moon', 'A half moon'],
    correct: 'The full moon closest to the autumnal equinox',
    funFact: 'The Harvest Moon rises near sunset for several consecutive nights, providing extra light for harvesting crops. It can occur in September or October.',
  },
  {
    question: 'What is a "Blue Moon"?',
    options: ['Moon turns blue', 'Second full moon in a calendar month (or third of four in a season)', 'A lunar eclipse', 'Winter full moon'],
    correct: 'Second full moon in a calendar month (or third of four in a season)',
    funFact: 'Blue Moons happen about every 2.7 years. The Moon doesn\'t turn blue, though volcanic ash has rarely made it appear bluish (after Krakatoa 1883, Mt. Pinatubo 1991).',
  },
  {
    question: 'What is a "Blood Moon"?',
    options: ['Red naturally', 'The reddish Moon during a total lunar eclipse', 'A Mars-like moon', 'A myth'],
    correct: 'The reddish Moon during a total lunar eclipse',
    funFact: 'Earth\'s atmosphere bends sunlight around our planet during a total lunar eclipse. Only long red wavelengths make it through, painting the Moon copper-red.',
  },
  {
    question: 'What is a "Wolf Moon"?',
    options: ['Wolf-shaped', 'Traditional name for January\'s full moon', 'When wolves appear', 'A rare event'],
    correct: 'Traditional name for January\'s full moon',
    funFact: 'Named by Native American tradition for wolves howling in deep winter hunger. Each month has traditional full moon names from various cultures.',
  },
  {
    question: 'What is a "Hunter\'s Moon"?',
    options: ['Red moon', 'The full moon after the Harvest Moon', 'Moon for hunting', 'A new moon'],
    correct: 'The full moon after the Harvest Moon',
    funFact: 'Usually in October, the Hunter\'s Moon also rises close to sunset for successive evenings, historically aiding hunters tracking prey in fields cleared after harvest.',
  },
  {
    question: 'What is a "Strawberry Moon"?',
    options: ['Pink colored', 'Traditional name for June\'s full moon', 'Seen only in summer', 'Very small'],
    correct: 'Traditional name for June\'s full moon',
    funFact: 'Named by Algonquin peoples for the short strawberry harvest season. In Europe it\'s the Rose Moon or Mead Moon — and possibly the origin of "honeymoon."',
  },
  // ─── Selenography & More Science ──────────────────────────
  {
    question: 'What are lunar maria?',
    options: ['Mountains', 'Dark flat plains of ancient volcanic lava', 'Actual seas', 'Ice fields'],
    correct: 'Dark flat plains of ancient volcanic lava',
    funFact: 'Maria cover 31% of the near side but only 2% of the far side. This asymmetry is likely due to thinner near-side crust allowing lava to reach the surface more easily.',
  },
  {
    question: 'What is the largest lunar mare?',
    options: ['Mare Tranquillitatis', 'Mare Imbrium', 'Oceanus Procellarum', 'Mare Serenitatis'],
    correct: 'Oceanus Procellarum',
    funFact: 'The Ocean of Storms is 2,500 km across — so large it was given a unique designation. It\'s the prominent large dark area on the Moon\'s western (left) face.',
  },
  {
    question: 'What is a lunar rille?',
    options: ['A mountain range', 'A narrow channel carved by ancient lava flow', 'A type of crater', 'A fault line'],
    correct: 'A narrow channel carved by ancient lava flow',
    funFact: 'Hadley Rille (explored by Apollo 15) is 1.5 km wide, 300m deep, and 80 km long. Some rilles are collapsed lava tubes that could shelter future moon bases from radiation.',
  },
  {
    question: 'What is a mascon?',
    options: ['Moon mineral', 'Mass concentration causing local gravity increase', 'A crater type', 'A rover name'],
    correct: 'Mass concentration causing local gravity increase',
    funFact: 'Dense material beneath maria creates gravitational anomalies. Orbiting spacecraft are measurably tugged by mascons, which must be accounted for in navigation.',
  },
  {
    question: 'What are the bright areas on the Moon?',
    options: ['Ice', 'Lunar highlands (terrae) — ancient heavily cratered terrain', 'Reflected sunlight', 'Volcanic glass'],
    correct: 'Lunar highlands (terrae) — ancient heavily cratered terrain',
    funFact: 'Highlands are ~4.4 billion years old, made of lighter anorthosite rock. They\'re more heavily cratered because they\'re older than the lava-filled maria.',
  },
  {
    question: 'What are lunar swirls?',
    options: ['Whirlpools', 'Bright sinuous surface markings associated with magnetic fields', 'Dust storms', 'Impact patterns'],
    correct: 'Bright sinuous surface markings associated with magnetic fields',
    funFact: 'Reiner Gamma is the most famous swirl. Local magnetic fields may deflect solar wind, leaving soil less "space-weathered" and therefore brighter than surroundings.',
  },
  // ─── Earth-Moon Tides ─────────────────────────────────────
  {
    question: 'What primarily causes Earth\'s ocean tides?',
    options: ['Wind', 'Moon\'s gravity (and the Sun\'s to a lesser extent)', 'Earth\'s rotation alone', 'Plate tectonics'],
    correct: 'Moon\'s gravity (and the Sun\'s to a lesser extent)',
    funFact: 'The Moon provides ~2/3 and the Sun ~1/3 of tidal forces. Spring tides (Sun+Moon aligned) are 20% stronger than average; neap tides (at right angles) are 20% weaker.',
  },
  {
    question: 'Why are there two high tides per day?',
    options: ['Two moons', 'Bulges form on BOTH the Moon-facing and opposite sides of Earth', 'Earth rotates twice', 'Continents cause two'],
    correct: 'Bulges form on BOTH the Moon-facing and opposite sides of Earth',
    funFact: 'The near-side bulge is from the Moon\'s stronger gravity pulling water toward it. The far-side bulge is because Earth is pulled away from the water there (differential gravity).',
  },
  {
    question: 'How is the Moon slowing Earth\'s rotation?',
    options: ['Magnetic braking', 'Tidal friction transfers rotational energy to the Moon\'s orbit', 'Solar wind', 'Direct collision'],
    correct: 'Tidal friction transfers rotational energy to the Moon\'s orbit',
    funFact: 'Earth\'s rotation slows ~2.3 ms/century while the Moon gains orbital energy and recedes 3.8 cm/year. 900 million years ago, a day was only ~18 hours.',
  },
  // ─── More Moon Facts ──────────────────────────────────────
  {
    question: 'What is the Giant Impact Hypothesis?',
    options: ['An asteroid killed the dinosaurs', 'A Mars-sized body (Theia) hit Earth forming the Moon', 'Jupiter hit Saturn', 'Moon was captured'],
    correct: 'A Mars-sized body (Theia) hit Earth forming the Moon',
    funFact: 'About 4.5 Gyr ago, Theia struck proto-Earth at an angle. Debris from both bodies formed a disk that coalesced into the Moon. This explains the Moon\'s composition matching Earth\'s mantle.',
  },
  {
    question: 'How much would a 60 kg person weigh on the Moon?',
    options: ['60 kg', '30 kg', '10 kg', '6 kg'],
    correct: '10 kg',
    funFact: 'Lunar gravity is 1/6 of Earth\'s (1.62 vs 9.8 m/s²). A 60 kg person would weigh only about 10 kg. Apollo astronauts could hop and bounce despite heavy suits.',
  },
  {
    question: 'Does the Moon have moonquakes?',
    options: ['No', 'Yes — Apollo seismometers detected thousands', 'Only from impacts', 'Unknown'],
    correct: 'Yes — Apollo seismometers detected thousands',
    funFact: 'Deep moonquakes (~700 km down) are tidally triggered. Shallow ones are rarer but stronger — up to magnitude 5.5. The Moon rings like a bell because it\'s so dry and rigid.',
  },
  {
    question: 'What temperature extremes exist on the Moon?',
    options: ['0° to 50°C', '-50° to 100°C', '-173°C to 127°C', '-20° to 40°C'],
    correct: '-173°C to 127°C',
    funFact: 'With no atmosphere, the Moon goes from boiling hot in sunlight to extremely cold in shadow. In permanently shadowed craters, temperatures drop to -233°C — colder than Pluto\'s surface.',
  },
  {
    question: 'How does the Moon stabilize Earth\'s climate?',
    options: ['Reflects heat', 'Its gravity keeps Earth\'s axial tilt stable at ~23.5°', 'Blocks solar radiation', 'Creates seasons directly'],
    correct: 'Its gravity keeps Earth\'s axial tilt stable at ~23.5°',
    funFact: 'Without the Moon, Earth\'s tilt could chaotically vary from 0° to 85° over millions of years, causing catastrophic climate swings. Mars (no large moon) wobbles dramatically.',
  },
  {
    question: 'Can sound travel on the Moon?',
    options: ['Yes, normally', 'No — no atmosphere to carry sound waves', 'Only at night', 'Only underground'],
    correct: 'No — no atmosphere to carry sound waves',
    funFact: 'The Moon\'s atmosphere is 10 trillion times thinner than Earth\'s — essentially a vacuum. All communication on the Moon must be via radio.',
  },
  {
    question: 'What did the Moon smell like to Apollo astronauts?',
    options: ['Nothing', 'Gunpowder or burnt metal', 'Sulfur', 'Flowers'],
    correct: 'Gunpowder or burnt metal',
    funFact: 'After moonwalks, astronauts noticed moondust in the cabin smelled like spent gunpowder. The scent likely comes from iron-rich dust particles oxidizing in moist cabin air.',
  },
  {
    question: 'What is the Moon\'s age?',
    options: ['2 billion years', '3.5 billion years', '4.5 billion years', '10 billion years'],
    correct: '4.5 billion years',
    funFact: 'Radiometric dating of Apollo samples confirms the Moon formed ~4.5 billion years ago, just 30-50 million years after the solar system.',
  },
  {
    question: 'Does the Moon have remnant magnetism?',
    options: ['Strong global field', 'No magnetism at all', 'Localized crustal patches only', 'Only at poles'],
    correct: 'Localized crustal patches only',
    funFact: 'The Moon had a global magnetic field until ~3 billion years ago. Remnant magnetized patches in the crust create "mini-magnetospheres" that partially deflect solar wind.',
  },
  {
    question: 'What is the "lunar horizon glow"?',
    options: ['Sunrise colors', 'Electrostatically levitated dust at the day-night boundary', 'Light from Earth', 'Aurora'],
    correct: 'Electrostatically levitated dust at the day-night boundary',
    funFact: 'Solar UV charges the surface, levitating dust particles at the terminator. Surveyor cameras and Apollo 17 astronauts both observed this phenomenon at lunar dawn.',
  },
  {
    question: 'How much of the Moon\'s surface can we see from Earth?',
    options: ['50%', '55%', '59%', '65%'],
    correct: '59%',
    funFact: 'Libration allows us to peek around the Moon\'s edges over time. The extra 9% beyond 50% comes from wobbles in longitude, latitude, and parallax from Earth\'s rotation.',
  },
  {
    question: 'What is the Moon\'s surface area compared to?',
    options: ['USA', 'Russia', 'Africa', 'Australia'],
    correct: 'Africa',
    funFact: 'The Moon\'s surface area (37.9 million km²) is about 25% larger than Africa (30.4 million km²), but the comparison helps visualize its size.',
  },
  {
    question: 'What is the Maria asymmetry problem?',
    options: ['Maria are different colors', 'The near side has far more maria than the far side', 'Maria get larger over time', 'Some maria are filled with water'],
    correct: 'The near side has far more maria than the far side',
    funFact: 'Maria cover 31% of the near side but only 2% of the far side. This may be due to thinner near-side crust (from tidal heating or Theia impact geometry) allowing easier lava eruption.',
  },
  {
    question: 'What is the GRAIL mission?',
    options: ['A Mars lander', 'Twin spacecraft that mapped the Moon\'s interior gravity field', 'A sample return', 'A crewed mission'],
    correct: 'Twin spacecraft that mapped the Moon\'s interior gravity field',
    funFact: 'GRAIL\'s twin spacecraft (Ebb and Flow) orbited the Moon in 2012, mapping gravity variations that revealed subsurface structures, ancient volcanic plumbing, and crustal thickness.',
  },
  {
    question: 'What is the LRO (Lunar Reconnaissance Orbiter)?',
    options: ['A Mars orbiter', 'A NASA spacecraft mapping the Moon in extreme detail since 2009', 'A Chinese rover', 'A telescope'],
    correct: 'A NASA spacecraft mapping the Moon in extreme detail since 2009',
    funFact: 'LRO has photographed all Apollo landing sites (visible hardware and tracks), mapped water ice deposits, measured temperatures, and identified safe landing areas for Artemis.',
  },
  // ─── Additional Moon Questions (Batch 3 - to reach 300+) ──
  {
    question: 'What was the first object to reach the Moon\'s surface?',
    options: ['Apollo 11', 'Luna 2', 'Ranger 7', 'Surveyor 1'],
    correct: 'Luna 2',
    funFact: 'The Soviet Luna 2 crashed into the Moon on September 14, 1959, becoming the first human-made object to reach another celestial body. It carried Soviet pennants.',
  },
  {
    question: 'What did Luna 3 reveal for the first time?',
    options: ['Water on the Moon', 'The far side of the Moon', 'Lunar craters', 'The Moon\'s core'],
    correct: 'The far side of the Moon',
    funFact: 'Luna 3 photographed the far side in October 1959, revealing it is drastically different — mostly highlands with very few maria, surprising scientists.',
  },
  {
    question: 'What is the Artemis Accords?',
    options: ['A peace treaty', 'International agreements for responsible lunar exploration', 'A rocket program only', 'A Moon base design'],
    correct: 'International agreements for responsible lunar exploration',
    funFact: 'Signed by 40+ nations, the Artemis Accords establish principles for peaceful lunar exploration, including resource utilization, avoiding harmful interference, and transparency.',
  },
  {
    question: 'What is the lunar recession rate?',
    options: ['1 cm/year', '3.8 cm/year', '10 cm/year', '1 m/year'],
    correct: '3.8 cm/year',
    funFact: 'The Moon moves 3.8 cm farther from Earth each year due to tidal energy transfer. In the distant past it was much closer, and Earth\'s days were shorter.',
  },
  {
    question: 'What are lava tubes on the Moon?',
    options: ['Volcanic vents', 'Underground tunnels left by ancient lava flows', 'Water channels', 'Meteor tracks'],
    correct: 'Underground tunnels left by ancient lava flows',
    funFact: 'Lunar lava tubes could be hundreds of meters wide — far larger than those on Earth (lower gravity allows bigger tunnels). They could shelter future bases from radiation and micrometeoroids.',
  },
  {
    question: 'What is the Marius Hills Hole?',
    options: ['A crater', 'A skylight into a possible lava tube', 'A water well', 'A landing site'],
    correct: 'A skylight into a possible lava tube',
    funFact: 'Discovered by Japan\'s SELENE (Kaguya) orbiter, this 65m-wide hole appears to open into a lava tube below. It\'s a candidate site for a radiation-shielded lunar base.',
  },
  {
    question: 'How long does a lunar day (sunrise to sunrise) last?',
    options: ['24 hours', '~14 Earth days', '~29.5 Earth days', '~365 days'],
    correct: '~29.5 Earth days',
    funFact: 'A point on the Moon\'s equator gets about 14.75 days of continuous sunlight followed by 14.75 days of darkness. This extreme day/night cycle creates massive temperature swings.',
  },
  {
    question: 'What is the regolith depth on the Moon?',
    options: ['A few millimeters', '4-15 meters', '100 meters', '1 km'],
    correct: '4-15 meters',
    funFact: 'Regolith is thicker on older surfaces (highlands: ~15m) and thinner on younger maria (~4m). It was created by billions of years of micrometeorite bombardment.',
  },
  {
    question: 'What is CAPSTONE?',
    options: ['A Moon rock', 'A small satellite testing the Gateway orbit around the Moon', 'A landing program', 'A crater name'],
    correct: 'A small satellite testing the Gateway orbit around the Moon',
    funFact: 'CAPSTONE (launched 2022) is a microwave-oven-sized cubesat testing the near-rectilinear halo orbit planned for NASA\'s Gateway station near the Moon.',
  },
  {
    question: 'What causes the "ashen glow" or earthshine on the Moon?',
    options: ['Moon\'s own light', 'Sunlight reflected from Earth illuminating the dark part of the Moon', 'Volcanic activity', 'Starlight'],
    correct: 'Sunlight reflected from Earth illuminating the dark part of the Moon',
    funFact: 'During a crescent moon, the dark portion is faintly visible because Earth reflects sunlight onto it. Leonardo da Vinci was the first to correctly explain this in the 1500s.',
  },
  {
    question: 'What is the Moon\'s mass compared to Earth?',
    options: ['1/2', '1/4', '1/6', '1/81'],
    correct: '1/81',
    funFact: 'The Moon\'s mass is 7.35 × 10²² kg — about 1.2% of Earth\'s mass. Despite its relatively large size (1/4 Earth diameter), it\'s much less dense.',
  },
  {
    question: 'What is the Moon\'s average density?',
    options: ['Same as Earth (5.5 g/cm³)', '3.34 g/cm³', '1.0 g/cm³', '7.8 g/cm³'],
    correct: '3.34 g/cm³',
    funFact: 'The Moon\'s low density (vs Earth\'s 5.5 g/cm³) means it has a proportionally tiny iron core. This supports the giant impact theory — the Moon formed mostly from mantle material.',
  },
  {
    question: 'What is KREEP?',
    options: ['A scary movie', 'Potassium, Rare Earth Elements, and Phosphorus-rich lunar rock', 'A rover name', 'A crater'],
    correct: 'Potassium, Rare Earth Elements, and Phosphorus-rich lunar rock',
    funFact: 'KREEP is a geochemical component found in certain lunar rocks, representing the last dregs of the magma ocean that crystallized. Its distribution reveals the Moon\'s thermal history.',
  },
  {
    question: 'What was the Lunar Magma Ocean?',
    options: ['Lava on the surface today', 'A theoretical global ocean of molten rock that covered the early Moon', 'An underground lake', 'A sci-fi concept'],
    correct: 'A theoretical global ocean of molten rock that covered the early Moon',
    funFact: 'Shortly after forming from the giant impact, the Moon was likely covered by a magma ocean hundreds of km deep. As it cooled, lighter minerals floated up forming the anorthosite crust.',
  },
  {
    question: 'What is the Moon\'s exosphere composed of?',
    options: ['Oxygen and nitrogen', 'Helium, neon, argon, and sodium atoms', 'Water vapor', 'Carbon dioxide'],
    correct: 'Helium, neon, argon, and sodium atoms',
    funFact: 'The Moon\'s "atmosphere" is technically an exosphere — so thin that molecules rarely collide with each other. Total mass is only about 10 tonnes, vs Earth\'s 5.15 × 10¹⁸ tonnes.',
  },
  {
    question: 'What is the significance of the Ina formation on the Moon?',
    options: ['Oldest feature', 'Evidence of geologically recent volcanic activity', 'Water deposit', 'Landing site'],
    correct: 'Evidence of geologically recent volcanic activity',
    funFact: 'Ina appears to be a very young volcanic feature (possibly less than 100 million years old), suggesting the Moon may not be entirely geologically dead.',
  },
  {
    question: 'Which Apollo mission first used a lunar rover?',
    options: ['Apollo 11', 'Apollo 14', 'Apollo 15', 'Apollo 17'],
    correct: 'Apollo 15',
    funFact: 'The Lunar Roving Vehicle (LRV) was first used on Apollo 15 in 1971. It could reach 13 km/h and greatly extended the area astronauts could explore. Top speed achieved was 18 km/h on Apollo 17.',
  },
  {
    question: 'What is the Moon Treaty?',
    options: ['A successful agreement', 'A 1979 UN treaty governing lunar activities that most spacefaring nations did NOT sign', 'The Artemis Accords', 'Apollo agreements'],
    correct: 'A 1979 UN treaty governing lunar activities that most spacefaring nations did NOT sign',
    funFact: 'The Moon Treaty declares the Moon and its resources "common heritage of mankind." The US, Russia, and China never signed it, limiting its practical significance.',
  },
  {
    question: 'What did the Apollo astronauts leave on the Moon besides flags?',
    options: ['Nothing else', 'Laser retroreflectors, seismometers, and other instruments', 'Only footprints', 'Robots'],
    correct: 'Laser retroreflectors, seismometers, and other instruments',
    funFact: 'The ALSEP (Apollo Lunar Surface Experiments Package) included seismometers, magnetometers, solar wind collectors, and laser retroreflectors. The retroreflectors still work today.',
  },
  {
    question: 'How many kilograms of lunar samples have been returned to Earth total?',
    options: ['12 kg', '42 kg', '382 kg', '1000 kg'],
    correct: '382 kg',
    funFact: 'Apollo brought 382 kg, Soviet Luna missions returned about 326 grams, and Chang\'e 5 returned 1.73 kg. These samples revolutionized our understanding of the Moon and solar system.',
  },
  {
    question: 'What is the significance of anorthosite on the Moon?',
    options: ['It\'s volcanic lava', 'It forms the bright ancient highlands crust', 'It contains water', 'It\'s magnetic'],
    correct: 'It forms the bright ancient highlands crust',
    funFact: 'Anorthosite (calcium-rich feldspar) floated to the top of the Lunar Magma Ocean like foam on soup, forming the pale highlands that are the Moon\'s oldest surviving surface.',
  },
  {
    question: 'What is the "Moon illusion"?',
    options: ['The Moon doesn\'t exist', 'The Moon appears larger near the horizon than overhead (but isn\'t)', 'A magic trick', 'Eclipse shadow'],
    correct: 'The Moon appears larger near the horizon than overhead (but isn\'t)',
    funFact: 'This is a well-known optical illusion with debated causes. The Moon\'s angular size is actually slightly SMALLER at the horizon (it\'s farther away by one Earth radius).',
  },
  {
    question: 'What year is NASA targeting for the next crewed Moon landing (Artemis III)?',
    options: ['2024', '2025-2026', '2030', '2035'],
    correct: '2025-2026',
    funFact: 'Artemis III will land the first woman and first person of color on the Moon, targeting the lunar south pole region where water ice could support long-term presence.',
  },
  {
    question: 'What is the VIPER rover?',
    options: ['A Mars rover', 'NASA\'s rover designed to map water ice at the lunar south pole', 'A lunar helicopter', 'A Chinese mission'],
    correct: 'NASA\'s rover designed to map water ice at the lunar south pole',
    funFact: 'VIPER (Volatiles Investigating Polar Exploration Rover) will drive into permanently shadowed craters to characterize water ice deposits — critical data for sustainable lunar presence.',
  },
  {
    question: 'Can you see the Great Wall of China from the Moon?',
    options: ['Yes easily', 'No — it\'s far too narrow to see from that distance', 'Only with binoculars', 'During daytime only'],
    correct: 'No — it\'s far too narrow to see from that distance',
    funFact: 'This is a common myth. The Great Wall is only ~6 meters wide — impossible to resolve from 384,400 km away. Even from low Earth orbit it\'s barely visible without zoom.',
  },
  {
    question: 'What is the Moon\'s apparent angular size in the sky?',
    options: ['About 0.1°', 'About 0.5°', 'About 2°', 'About 5°'],
    correct: 'About 0.5°',
    funFact: 'The Moon\'s angular diameter (~0.5°) is almost identical to the Sun\'s, which is why total solar eclipses are possible. This is pure coincidence — the Sun is 400x larger but 400x farther.',
  },
  {
    question: 'What is "moonbounce" or EME communication?',
    options: ['Moon bouncing in orbit', 'Using the Moon to reflect radio signals between Earth stations', 'Moon communication satellite', 'Astronaut radio'],
    correct: 'Using the Moon to reflect radio signals between Earth stations',
    funFact: 'Earth-Moon-Earth (EME) communication bounces radio signals off the Moon. Ham radio operators regularly achieve this, with a round-trip delay of about 2.5 seconds.',
  },
  {
    question: 'How would you describe the Moon\'s geological activity today?',
    options: ['Very active like Earth', 'Completely dead', 'Almost entirely dormant with rare shallow moonquakes', 'Constantly erupting'],
    correct: 'Almost entirely dormant with rare shallow moonquakes',
    funFact: 'The Moon is not completely dead — it still has shallow moonquakes and possible minor outgassing. But compared to Earth\'s vigorous plate tectonics and volcanism, it\'s nearly inactive.',
  },
  {
    question: 'What is the Outer Space Treaty\'s rule about the Moon?',
    options: ['Any nation can claim it', 'No nation can claim sovereignty over the Moon', 'Only the first lander owns it', 'The UN owns it'],
    correct: 'No nation can claim sovereignty over the Moon',
    funFact: 'The 1967 Outer Space Treaty (signed by 114 nations) prohibits national sovereignty claims on celestial bodies. However, resource extraction rights remain debated and partially addressed by the Artemis Accords.',
  },
  {
    question: 'What makes a "supermoon" vs a "micromoon"?',
    options: ['Distance from Sun', 'Full moon at perigee vs full moon at apogee', 'Time of year', 'Phase of the moon'],
    correct: 'Full moon at perigee vs full moon at apogee',
    funFact: 'Perigee full moons (supermoons) are 14% larger and 30% brighter than apogee full moons (micromoons). The difference in distance is about 50,000 km.',
  },
  {
    question: 'What is the Saros cycle?',
    options: ['Moon\'s rotation period', 'An ~18-year cycle after which eclipses repeat in similar patterns', 'Lunar month', 'Tidal cycle'],
    correct: 'An ~18-year cycle after which eclipses repeat in similar patterns',
    funFact: 'After one Saros (6585.3 days), the Sun, Earth, and Moon return to nearly the same relative geometry, producing a similar eclipse. Ancient Babylonians discovered this.',
  },
  {
    question: 'What is the Moon\'s orbital eccentricity?',
    options: ['0 (perfectly circular)', '0.0549', '0.2', '0.5'],
    correct: '0.0549',
    funFact: 'With eccentricity of 0.0549, the Moon\'s orbit is slightly elliptical. This causes the distance to vary by ~50,000 km and is why some full moons appear larger than others.',
  },
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

// ─── Components ───────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100
  return (
    <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
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
export default function MoonQuizPage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [results, setResults] = useState<{ question: string; correct: boolean; timeBonus: boolean; selected: string; answer: string }[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFact, setShowFact] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerMode, setTimerMode] = useState<'timed' | 'untimed'>('timed')
  const [timerSeconds, setTimerSeconds] = useState(10)
  const [bestScore, setBestScore] = useState(0)
  const [animateScore, setAnimateScore] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem('moon-quiz-best')
    if (saved) setBestScore(parseInt(saved))
  }, [])

  const startGame = useCallback(() => {
    const selected = shuffleArray(QUESTIONS_POOL).slice(0, 10)
    setQuestions(selected)
    setCurrentQ(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setResults([])
    setSelectedAnswer(null)
    setShowFact(false)
    setGameState('playing')
    setShuffledOptions(shuffleArray(selected[0].options))
    setTimeLeft(timerSeconds)
    startTimeRef.current = Date.now()
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
    const isCorrect = !isTimeout && answer === q.correct
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
      question: q.question,
      correct: isCorrect,
      timeBonus,
      selected: isTimeout ? 'Timed out' : answer,
      answer: q.correct,
    }])
    setShowFact(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswer, currentQ, questions])

  const nextQuestion = useCallback(() => {
    const nextIdx = currentQ + 1
    if (nextIdx >= 10) {
      if (score > bestScore) {
        setBestScore(score)
        localStorage.setItem('moon-quiz-best', String(score))
      }
      setGameState('results')
      return
    }
    setCurrentQ(nextIdx)
    setSelectedAnswer(null)
    setShowFact(false)
    setShuffledOptions(shuffleArray(questions[nextIdx].options))
    setTimeLeft(timerSeconds)
    startTimeRef.current = Date.now()
  }, [currentQ, questions, score, bestScore])

  const shareResult = () => {
    const correctCount = results.filter(r => r.correct).length
    const text = `I scored ${correctCount}/10 on the DateAndTimezone Moon & Eclipse quiz! Can you beat me? https://www.dateandtimezone.com/quiz/moon`
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 mb-6">
              <Moon className="w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent">
              Moon & Eclipse
            </h1>
            <p className="text-muted text-lg max-w-md mx-auto">
              Test your lunar knowledge! 15 questions about moon phases, eclipses, and tides.
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
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${timerMode === 'timed' ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300' : 'border border-card-border text-muted hover:text-white'}`}
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
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timerSeconds === s ? 'bg-yellow-500 text-white' : 'border border-card-border text-muted hover:text-white'}`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-300 hover:from-yellow-600 hover:to-amber-400 font-heading font-semibold text-gray-900 text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Moon className="w-5 h-5" />
            Start Quiz (10 random questions)
          </button>

          <div className="mt-8 p-6 rounded-xl bg-card-bg border border-card-border">
            <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              How to Play
            </h3>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">1.</span>Each question has 4 answer options</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">2.</span>You have 10 seconds per question</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">3.</span>Answer within 5 seconds for a speed bonus (+2)</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">4.</span>Learn fun facts about the Moon after each answer!</li>
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

          <div className="mt-8 p-8 rounded-2xl bg-card-bg border border-card-border text-center">
            <div className="text-muted text-sm uppercase tracking-wider mb-2">Question {currentQ + 1}</div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">{q.question}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {shuffledOptions.map((option, idx) => {
              let btnStyle = 'bg-card-bg border-card-border hover:border-yellow-500/50 hover:bg-yellow-500/10'
              if (selectedAnswer !== null) {
                if (option === q.correct) {
                  btnStyle = 'bg-green-500/20 border-green-500/50 text-green-400'
                } else if (option === selectedAnswer && option !== q.correct) {
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

          {selectedAnswer !== null && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div className={`p-4 rounded-xl border ${results[results.length - 1]?.correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center gap-2 font-heading font-semibold text-lg">
                  {results[results.length - 1]?.correct ? (
                    <><Sparkles className="w-5 h-5 text-green-400" /><span className="text-green-400">Correct! {results[results.length - 1]?.timeBonus ? '+2 (speed bonus!)' : '+1'}</span></>
                  ) : (
                    <span className="text-red-400">Wrong! The answer was {q.correct}</span>
                  )}
                </div>
              </div>

              {showFact && (
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                  <div className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-secondary font-heading font-semibold text-sm mb-1">Did you know?</div>
                      <p className="text-muted text-sm">{q.funFact}</p>
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-300 mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2">{correctCount}/10</h1>
          <p className="text-muted text-lg">
            {correctCount >= 9 ? 'Lunar Expert!' : correctCount >= 7 ? 'Great job!' : correctCount >= 5 ? 'Not bad!' : 'Keep gazing at the Moon!'}
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
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${r.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {r.correct ? '\u2713' : '\u2717'}
                </span>
                <span className="font-medium text-sm">{r.question}</span>
              </div>
              <div className="text-right text-sm flex-shrink-0 ml-2">
                <div className={r.correct ? 'text-green-400' : 'text-red-400'}>{r.correct ? r.answer : r.selected}</div>
                {!r.correct && <div className="text-muted text-xs">Correct: {r.answer}</div>}
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
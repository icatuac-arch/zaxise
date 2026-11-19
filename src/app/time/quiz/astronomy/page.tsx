'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Telescope, Trophy, Zap, RotateCcw, Share2,
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
    question: 'What constellation contains the North Star (Polaris)?',
    options: ['Ursa Major', 'Ursa Minor', 'Cassiopeia', 'Orion'],
    correct: 'Ursa Minor',
    funFact: 'Polaris is located at the tip of the handle of the Little Dipper (Ursa Minor). It appears nearly motionless in the sky while all other stars rotate around it.',
  },
  {
    question: 'What is the brightest star in the night sky?',
    options: ['Polaris', 'Betelgeuse', 'Sirius', 'Vega'],
    correct: 'Sirius',
    funFact: 'Sirius (the "Dog Star") is 8.6 light-years away and about 25 times more luminous than our Sun. It\'s part of the constellation Canis Major.',
  },
  {
    question: 'What galaxy do we live in?',
    options: ['Andromeda', 'Milky Way', 'Triangulum', 'Whirlpool'],
    correct: 'Milky Way',
    funFact: 'The Milky Way contains 100-400 billion stars and is about 100,000 light-years across. Our solar system is located about 26,000 light-years from the center.',
  },
  {
    question: 'What is a supernova?',
    options: ['Birth of a new star', 'Explosion of a star at end of its life', 'A very bright comet', 'Collision of two galaxies'],
    correct: 'Explosion of a star at end of its life',
    funFact: 'A supernova can briefly outshine an entire galaxy! The last supernova visible to the naked eye in our galaxy was in 1604, observed by Johannes Kepler.',
  },
  {
    question: 'What constellation is shaped like a hunter?',
    options: ['Orion', 'Leo', 'Scorpius', 'Sagittarius'],
    correct: 'Orion',
    funFact: 'Orion is one of the most recognizable constellations. Its "belt" of three stars points toward Sirius. The red giant Betelgeuse marks Orion\'s shoulder.',
  },
  {
    question: 'What is the nearest galaxy to the Milky Way?',
    options: ['Triangulum', 'Andromeda', 'Centaurus A', 'Large Magellanic Cloud'],
    correct: 'Andromeda',
    funFact: 'The Andromeda Galaxy is 2.5 million light-years away and is heading toward us at 110 km/s. It will merge with the Milky Way in about 4.5 billion years!',
  },
  {
    question: 'What causes a star to twinkle?',
    options: ['Star\'s own pulsation', 'Earth\'s atmosphere', 'Interstellar dust', 'Light reflecting off planets'],
    correct: 'Earth\'s atmosphere',
    funFact: 'Stars twinkle (scintillate) because their light passes through turbulent layers of Earth\'s atmosphere. Planets don\'t twinkle as much because they appear larger.',
  },
  {
    question: 'How many constellations are officially recognized?',
    options: ['48', '66', '88', '112'],
    correct: '88',
    funFact: 'The International Astronomical Union recognizes 88 constellations that cover the entire sky. 48 of these were listed by the Greek astronomer Ptolemy around 150 AD.',
  },
  {
    question: 'What is the Big Dipper part of?',
    options: ['Ursa Minor', 'Ursa Major', 'Cassiopeia', 'Draco'],
    correct: 'Ursa Major',
    funFact: 'The Big Dipper is an asterism (a pattern of stars) within the larger constellation Ursa Major (the Great Bear). Its two "pointer stars" lead to Polaris.',
  },
  {
    question: 'What is a nebula?',
    options: ['A dying star', 'Cloud of gas and dust in space', 'A type of galaxy', 'An asteroid cluster'],
    correct: 'Cloud of gas and dust in space',
    funFact: 'Nebulae are stellar nurseries where new stars are born! The Orion Nebula, visible to the naked eye, is about 1,344 light-years away and 24 light-years across.',
  },
  {
    question: 'What type of star is our Sun?',
    options: ['Red dwarf', 'Yellow dwarf / G-type main sequence', 'Blue giant', 'White dwarf'],
    correct: 'Yellow dwarf / G-type main sequence',
    funFact: 'Our Sun is a G2V star, meaning it\'s a main-sequence star that fuses hydrogen into helium. It\'s about 4.6 billion years old and halfway through its life.',
  },
  {
    question: 'What is the Oort Cloud?',
    options: ['A nebula near Earth', 'Spherical shell of icy objects around solar system', 'Cloud formation on Jupiter', 'Dust ring around Saturn'],
    correct: 'Spherical shell of icy objects around solar system',
    funFact: 'The Oort Cloud extends up to 100,000 AU (1.87 light-years) from the Sun. Long-period comets originate there. No spacecraft has ever reached it.',
  },
  {
    question: 'What are the zodiac constellations?',
    options: ['Brightest constellations', '12 constellations along the ecliptic', 'Northern hemisphere constellations only', 'Constellations named after animals'],
    correct: '12 constellations along the ecliptic',
    funFact: 'The 12 zodiac constellations lie along the ecliptic (the Sun\'s apparent path). The Sun actually passes through 13 constellations \u2014 Ophiuchus is the unofficial 13th!',
  },
  {
    question: 'What is a pulsar?',
    options: ['A quasar\'s core', 'Rapidly spinning neutron star emitting radiation beams', 'A planet emitting radio waves', 'A type of black hole'],
    correct: 'Rapidly spinning neutron star emitting radiation beams',
    funFact: 'Pulsars can spin up to 716 times per second! They were first discovered in 1967 by Jocelyn Bell Burnell and were initially nicknamed "LGM" (Little Green Men).',
  },
  {
    question: "What is the observable universe's estimated diameter?",
    options: ['~13.8 billion light-years', '~46 billion light-years', '~93 billion light-years', '~200 billion light-years'],
    correct: '~93 billion light-years',
    funFact: 'Although the universe is ~13.8 billion years old, expansion has stretched it to ~93 billion light-years across. The actual universe may be much larger \u2014 or even infinite!',
  },
  {
    question: 'What is a white dwarf?',
    options: ['A small young star', 'The hot dense remnant of a dead star', 'A type of galaxy', 'A star made of white gas'],
    correct: 'The hot dense remnant of a dead star',
    funFact: 'A white dwarf is about the size of Earth but has the mass of the Sun. A teaspoon of white dwarf material would weigh about 5 tons on Earth.',
  },
  {
    question: 'What is the Hertzsprung-Russell diagram?',
    options: ['A map of the Milky Way', 'A chart plotting star luminosity vs temperature', 'A timeline of the universe', 'A diagram of planetary orbits'],
    correct: 'A chart plotting star luminosity vs temperature',
    funFact: 'The H-R diagram is one of the most important tools in astronomy. Most stars (including our Sun) fall on the "main sequence" diagonal band.',
  },
  {
    question: 'What is the Crab Nebula?',
    options: ['A birthplace of stars', 'Remnant of a supernova observed in 1054 AD', 'A galaxy shaped like a crab', 'A dark nebula blocking light'],
    correct: 'Remnant of a supernova observed in 1054 AD',
    funFact: 'Chinese astronomers recorded this supernova in 1054 AD as a "guest star" visible in daylight for 23 days. At its center is a pulsar spinning 30 times per second.',
  },
  {
    question: 'What is redshift?',
    options: ['Stars turning red as they die', 'Light stretching to longer wavelengths as objects move away', 'The color of Mars in telescopes', 'Infrared radiation from hot stars'],
    correct: 'Light stretching to longer wavelengths as objects move away',
    funFact: 'Edwin Hubble used redshift to discover that the universe is expanding. The farther a galaxy is, the faster it appears to move away from us.',
  },
  {
    question: 'What is the largest known star by radius?',
    options: ['Betelgeuse', 'VY Canis Majoris', 'UY Scuti', 'Stephenson 2-18'],
    correct: 'Stephenson 2-18',
    funFact: 'Stephenson 2-18 is so large that if placed at the center of our solar system, its surface would extend beyond the orbit of Saturn.',
  },
  {
    question: 'What are Cepheid variables used for?',
    options: ['Studying black holes', 'Measuring cosmic distances', 'Detecting exoplanets', 'Mapping dark matter'],
    correct: 'Measuring cosmic distances',
    funFact: 'Cepheid variable stars pulsate at rates directly linked to their brightness. By comparing apparent and actual brightness, astronomers can calculate their distance.',
  },
  {
    question: 'What constellation contains the star Betelgeuse?',
    options: ['Scorpius', 'Canis Major', 'Orion', 'Taurus'],
    correct: 'Orion',
    funFact: 'Betelgeuse marks Orion\'s left shoulder and is a red supergiant about 700 times the Sun\'s diameter. It could explode as a supernova within the next 100,000 years.',
  },
  {
    question: 'What is dark matter?',
    options: ['Matter in black holes', 'Invisible matter that exerts gravitational force', 'Antimatter in space', 'Dust that blocks starlight'],
    correct: 'Invisible matter that exerts gravitational force',
    funFact: 'Dark matter makes up about 27% of the universe but has never been directly detected. We know it exists because of its gravitational effects on visible matter.',
  },
  {
    question: 'What is the Summer Triangle?',
    options: ['A constellation', 'An asterism of Vega, Deneb, and Altair', 'Three planets aligned in summer', 'A telescope alignment technique'],
    correct: 'An asterism of Vega, Deneb, and Altair',
    funFact: 'The Summer Triangle is visible from June through December in the Northern Hemisphere. Its three stars belong to three different constellations: Lyra, Cygnus, and Aquila.',
  },
  {
    question: 'What is the cosmic microwave background (CMB)?',
    options: ['Radio signals from stars', 'Radiation leftover from the Big Bang', 'Microwaves from black holes', 'Background noise from Earth'],
    correct: 'Radiation leftover from the Big Bang',
    funFact: 'The CMB was emitted about 380,000 years after the Big Bang and fills all of space. It was accidentally discovered in 1965 by Penzias and Wilson.',
  },
  {
    question: 'What is an exoplanet?',
    options: ['A planet outside our galaxy', 'A planet orbiting a star other than our Sun', 'A gas giant', 'A rogue planet with no star'],
    correct: 'A planet orbiting a star other than our Sun',
    funFact: 'Over 5,500 exoplanets have been confirmed as of 2024. The first confirmed exoplanet orbiting a Sun-like star was 51 Pegasi b, discovered in 1995.',
  },
  {
    question: 'What type of galaxy is the Milky Way?',
    options: ['Elliptical', 'Irregular', 'Barred spiral', 'Lenticular'],
    correct: 'Barred spiral',
    funFact: 'The Milky Way is a barred spiral galaxy with a central bar-shaped structure of stars. Our Sun is located in one of its spiral arms, the Orion Arm.',
  },
  {
    question: 'What is a quasar?',
    options: ['A type of pulsar', 'An extremely luminous active galactic nucleus', 'A dying star', 'A fast-moving asteroid'],
    correct: 'An extremely luminous active galactic nucleus',
    funFact: 'Quasars are powered by supermassive black holes consuming matter. They can outshine entire galaxies and are among the most distant objects we can observe.',
  },
  {
    question: 'What is the ecliptic?',
    options: ['Path of eclipses across Earth', 'The Sun\'s apparent path across the sky over a year', 'Orbit of the Moon', 'The equator of the Milky Way'],
    correct: 'The Sun\'s apparent path across the sky over a year',
    funFact: 'The ecliptic is the plane of Earth\'s orbit around the Sun. The zodiac constellations lie along this path, and planets are always found near it.',
  },
  {
    question: 'What are brown dwarfs?',
    options: ['Dead stars that cooled down', 'Objects too massive to be planets but too small to sustain fusion', 'Small rocky planets', 'Stars made of brown gas'],
    correct: 'Objects too massive to be planets but too small to sustain fusion',
    funFact: 'Brown dwarfs have between 13 and 80 Jupiter masses. They glow faintly from heat of gravitational contraction but cannot sustain hydrogen fusion like true stars.',
  },
  {
    question: 'What is gravitational lensing?',
    options: ['Looking through a telescope lens', 'Massive objects bending light from behind them', 'Gravity focusing radio signals', 'The lens shape of galaxies'],
    correct: 'Massive objects bending light from behind them',
    funFact: 'Einstein predicted gravitational lensing in 1936. It allows astronomers to see extremely distant galaxies that would otherwise be invisible, magnified by foreground clusters.',
  },
  {
    question: 'What is the Local Group?',
    options: ['Stars nearest to the Sun', 'A cluster of galaxies including the Milky Way', 'Planets in our solar system', 'A group of nearby nebulae'],
    correct: 'A cluster of galaxies including the Milky Way',
    funFact: 'The Local Group contains over 80 galaxies spanning about 10 million light-years. Its largest members are Andromeda, the Milky Way, and the Triangulum Galaxy.',
  },
  {
    question: 'What is the transit method in exoplanet detection?',
    options: ['Tracking a planet\'s radio signals', 'Detecting the dimming when a planet passes in front of its star', 'Measuring a star\'s wobble', 'Photographing the planet directly'],
    correct: 'Detecting the dimming when a planet passes in front of its star',
    funFact: 'NASA\'s Kepler Space Telescope used the transit method to discover over 2,600 exoplanets by measuring tiny dips in starlight as planets crossed in front of their stars.',
  },
  {
    question: 'What is a magnetar?',
    options: ['A magnetic planet', 'A neutron star with an extremely powerful magnetic field', 'A type of compass star', 'A magnetic storm in space'],
    correct: 'A neutron star with an extremely powerful magnetic field',
    funFact: 'Magnetars have magnetic fields about a quadrillion times stronger than Earth\'s. A magnetar halfway across the galaxy could erase your credit card from that distance.',
  },
  {
    question: 'What is the Roche limit?',
    options: ['Maximum orbital speed', 'Distance within which tidal forces will destroy a satellite', 'Closest a comet can get to the Sun', 'Minimum size of a star'],
    correct: 'Distance within which tidal forces will destroy a satellite',
    funFact: 'Saturn\'s rings may have formed when a moon wandered inside Saturn\'s Roche limit and was torn apart by tidal forces billions of years ago.',
  },
  {
    question: 'What is the Hubble constant?',
    options: ['Speed of the Hubble telescope', 'Rate of expansion of the universe', 'Age of the Hubble telescope', 'Distance to the nearest galaxy'],
    correct: 'Rate of expansion of the universe',
    funFact: 'The Hubble constant is approximately 70 km/s/Mpc, meaning for every megaparsec of distance, galaxies recede 70 km/s faster. Its exact value is still debated.',
  },
  {
    question: 'What is a planetary nebula?',
    options: ['A cloud where planets form', 'Gas expelled by a dying Sun-like star', 'A nebula shaped like a planet', 'The atmosphere of a gas giant'],
    correct: 'Gas expelled by a dying Sun-like star',
    funFact: 'Despite the name, planetary nebulae have nothing to do with planets. The name comes from their round, planet-like appearance in early telescopes. Our Sun will create one in ~5 billion years.',
  },
  {
    question: 'What did Galileo first observe with his telescope in 1610?',
    options: ['Saturn\'s rings', 'Jupiter\'s four largest moons', 'The Andromeda Galaxy', 'Pluto'],
    correct: 'Jupiter\'s four largest moons',
    funFact: 'Galileo discovered Io, Europa, Ganymede, and Callisto \u2014 now called the Galilean moons. This proved not everything orbits Earth, supporting the heliocentric model.',
  },
  {
    question: 'What is the habitable zone?',
    options: ['Area of space with no radiation', 'The distance from a star where liquid water could exist', 'Safe zone for spacecraft', 'Part of a galaxy with stable orbits'],
    correct: 'The distance from a star where liquid water could exist',
    funFact: 'Also called the "Goldilocks zone," it\'s not too hot and not too cold. Earth sits comfortably within our Sun\'s habitable zone. Mars is on the outer edge.',
  },
  {
    question: 'What is dark energy?',
    options: ['Energy from black holes', 'The mysterious force accelerating the expansion of the universe', 'Energy in dark nebulae', 'Radiation from dark matter'],
    correct: 'The mysterious force accelerating the expansion of the universe',
    funFact: 'Dark energy makes up about 68% of the universe. It was discovered in 1998 when astronomers found the universe\'s expansion is speeding up, not slowing down.',
  },
  {
    question: 'What is the Sagittarius A*?',
    options: ['A star in Sagittarius', 'The supermassive black hole at the center of the Milky Way', 'A nebula visible from Earth', 'A radio telescope'],
    correct: 'The supermassive black hole at the center of the Milky Way',
    funFact: 'Sagittarius A* has a mass of about 4 million Suns. In 2022, the Event Horizon Telescope captured its first image, confirming its existence.',
  },
  {
    question: 'What is parallax in astronomy?',
    options: ['Parallel light rays from stars', 'Apparent shift in star position as Earth orbits the Sun', 'Two telescopes viewing the same star', 'Light splitting into colors'],
    correct: 'Apparent shift in star position as Earth orbits the Sun',
    funFact: 'Parallax is the oldest method for measuring stellar distances. The nearest stars shift by less than 1 arcsecond \u2014 that\'s like viewing a coin from 4 km away.',
  },
  {
    question: 'What is the Eagle Nebula famous for?',
    options: ['It contains our solar system', 'The "Pillars of Creation" — iconic Hubble image', 'It\'s the closest nebula to Earth', 'It\'s shaped like an eagle constellation'],
    correct: 'The "Pillars of Creation" — iconic Hubble image',
    funFact: 'The Pillars of Creation in the Eagle Nebula (M16) are columns of gas and dust about 5 light-years tall where new stars are forming. JWST imaged them in unprecedented detail in 2022.',
  },
  {
    question: 'What is a red giant star?',
    options: ['A young massive star', 'An evolved star that has expanded enormously', 'A star in a binary system', 'A star in the Milky Way center'],
    correct: 'An evolved star that has expanded enormously',
    funFact: 'When Sun-like stars exhaust their core hydrogen, they expand to hundreds of times their original size. Our Sun will become a red giant in about 5 billion years, engulfing Mercury and Venus.',
  },
  {
    question: 'What is the Ring Nebula (M57)?',
    options: ['A galaxy shaped like a ring', 'A planetary nebula in the constellation Lyra', 'Saturn\'s rings photographed by telescope', 'A dark nebula blocking starlight'],
    correct: 'A planetary nebula in the constellation Lyra',
    funFact: 'The Ring Nebula is about 2,300 light-years away and was ejected by a dying star about 4,000 years ago. At its center is a white dwarf remnant.',
  },
  {
    question: 'Who discovered that galaxies are moving away from us?',
    options: ['Isaac Newton', 'Albert Einstein', 'Edwin Hubble', 'Galileo Galilei'],
    correct: 'Edwin Hubble',
    funFact: 'In 1929, Edwin Hubble demonstrated that galaxies are receding from us proportional to their distance, proving the universe is expanding.',
  },
  {
    question: 'What is a neutron star made of?',
    options: ['Liquid iron', 'Almost entirely neutrons compressed to nuclear density', 'Dark matter', 'Hydrogen gas under extreme pressure'],
    correct: 'Almost entirely neutrons compressed to nuclear density',
    funFact: 'Neutron stars are so dense that a teaspoon of their material would weigh about 6 billion tons. They\'re only about 20 km in diameter but have 1-2 solar masses.',
  },
  {
    question: 'What is the Horsehead Nebula?',
    options: ['A galaxy in Pegasus', 'A dark nebula in Orion shaped like a horse\'s head', 'A star cluster in Sagittarius', 'A planetary nebula in Equuleus'],
    correct: 'A dark nebula in Orion shaped like a horse\'s head',
    funFact: 'The Horsehead Nebula (Barnard 33) is a dark cloud of dust silhouetted against the bright emission nebula IC 434. It\'s about 1,500 light-years from Earth.',
  },
  {
    question: 'What did Copernicus propose?',
    options: ['The Earth is flat', 'The Sun is the center of the solar system (heliocentric model)', 'Stars are other suns', 'The universe is infinite'],
    correct: 'The Sun is the center of the solar system (heliocentric model)',
    funFact: 'In 1543, Nicolaus Copernicus published his heliocentric theory, placing the Sun at the center. This revolutionary idea challenged 1,400 years of geocentric belief.',
  },
  {
    question: 'What is a binary star system?',
    options: ['Two unrelated stars that appear close', 'Two stars orbiting their common center of mass', 'A star with two planets', 'A double image caused by gravitational lensing'],
    correct: 'Two stars orbiting their common center of mass',
    funFact: 'More than half of all star systems in our galaxy are binaries or multiples. Sirius, the brightest star, has a white dwarf companion called Sirius B.',
  },
  {
    question: 'What is the Triangulum Galaxy?',
    options: ['The nearest galaxy to Earth', 'The third-largest galaxy in the Local Group', 'A dwarf galaxy orbiting the Milky Way', 'The oldest known galaxy'],
    correct: 'The third-largest galaxy in the Local Group',
    funFact: 'The Triangulum Galaxy (M33) is about 2.7 million light-years away and contains about 40 billion stars. It\'s the most distant object visible to the naked eye under perfect conditions.',
  },
  {
    question: 'What is a gamma-ray burst?',
    options: ['Radiation from nuclear reactors', 'The most energetic explosions in the universe', 'Sunlight filtered through atmosphere', 'Radio signals from pulsars'],
    correct: 'The most energetic explosions in the universe',
    funFact: 'A gamma-ray burst can release more energy in seconds than the Sun will in its entire 10-billion-year lifetime. They come from collapsing massive stars or merging neutron stars.',
  },
  {
    question: 'What is the Pleiades star cluster?',
    options: ['A galaxy near Andromeda', 'An open star cluster also called the Seven Sisters', 'A globular cluster in Sagittarius', 'A constellation in the southern sky'],
    correct: 'An open star cluster also called the Seven Sisters',
    funFact: 'The Pleiades (M45) is about 444 light-years away and contains over 1,000 stars, though only 6-7 are visible to the naked eye. They are about 100 million years old.',
  },
  {
    question: 'What is a globular cluster?',
    options: ['A cluster of galaxies', 'A spherical collection of hundreds of thousands of old stars', 'A group of planets', 'A nebula with a round shape'],
    correct: 'A spherical collection of hundreds of thousands of old stars',
    funFact: 'Globular clusters orbit the centers of galaxies. Omega Centauri, the largest in the Milky Way, contains about 10 million stars and is 12 billion years old.',
  },
  {
    question: 'What is the Veil Nebula?',
    options: ['A cloud around a black hole', 'A supernova remnant in Cygnus', 'A star-forming region in Orion', 'A nebula blocking the galactic center'],
    correct: 'A supernova remnant in Cygnus',
    funFact: 'The Veil Nebula is the expanding debris from a star that exploded about 10,000 years ago. The entire structure spans about 110 light-years across.',
  },
  {
    question: 'Who was Tycho Brahe?',
    options: ['Inventor of the telescope', 'Danish astronomer who made precise pre-telescope observations', 'First person to see Saturn\'s rings', 'Discoverer of Uranus'],
    correct: 'Danish astronomer who made precise pre-telescope observations',
    funFact: 'Tycho Brahe (1546-1601) made the most accurate astronomical observations before the telescope. His data enabled Kepler to discover the laws of planetary motion.',
  },
  {
    question: 'What are Kepler\'s laws of planetary motion?',
    options: ['Laws about star brightness', 'Rules describing how planets orbit the Sun in ellipses', 'Formulas for telescope magnification', 'Laws about gravitational waves'],
    correct: 'Rules describing how planets orbit the Sun in ellipses',
    funFact: 'Kepler\'s three laws (1609-1619) showed planets orbit in ellipses, sweep equal areas in equal times, and have orbital periods related to their distance from the Sun.',
  },
  {
    question: 'What is the Tarantula Nebula?',
    options: ['A nebula in the Milky Way', 'The largest and most luminous nebula in the Local Group', 'A dark nebula in Scorpius', 'A planetary nebula in Ara'],
    correct: 'The largest and most luminous nebula in the Local Group',
    funFact: 'The Tarantula Nebula (30 Doradus) in the Large Magellanic Cloud is so luminous that if it were as close as the Orion Nebula, it would cast shadows on Earth.',
  },
  {
    question: 'What is a Type Ia supernova?',
    options: ['Explosion of a single massive star', 'Thermonuclear explosion of a white dwarf', 'A failed supernova', 'Collision of two neutron stars'],
    correct: 'Thermonuclear explosion of a white dwarf',
    funFact: 'Type Ia supernovae occur when a white dwarf exceeds the Chandrasekhar limit. They\'re used as "standard candles" to measure cosmic distances because they have consistent peak brightness.',
  },
  {
    question: 'What is the Southern Cross (Crux)?',
    options: ['A navigation tool', 'The smallest constellation, visible from the Southern Hemisphere', 'A star in Orion', 'A nebula in Centaurus'],
    correct: 'The smallest constellation, visible from the Southern Hemisphere',
    funFact: 'Crux is the smallest of the 88 constellations but one of the most distinctive. It appears on the flags of Australia, New Zealand, Brazil, and other southern nations.',
  },
  {
    question: 'What is ALMA?',
    options: ['An optical telescope in Hawaii', 'A radio telescope array in Chile\'s Atacama Desert', 'A space telescope near L2', 'A particle accelerator for astrophysics'],
    correct: 'A radio telescope array in Chile\'s Atacama Desert',
    funFact: 'ALMA consists of 66 radio antennas at 5,000m elevation, making it the most powerful ground-based telescope for observing molecular gas, dust, and the early universe.',
  },
  {
    question: 'What is a protoplanetary disk?',
    options: ['A galaxy in formation', 'A rotating disk of gas and dust around a young star where planets form', 'A ring around a black hole', 'An asteroid belt'],
    correct: 'A rotating disk of gas and dust around a young star where planets form',
    funFact: 'ALMA has captured stunning images of protoplanetary disks showing gaps where planets are forming. Our solar system formed from such a disk 4.6 billion years ago.',
  },
  {
    question: 'What is the Helix Nebula nicknamed?',
    options: ['The Cat\'s Eye', 'The Eye of God', 'The Ring of Fire', 'The Cosmic Spiral'],
    correct: 'The Eye of God',
    funFact: 'The Helix Nebula (NGC 7293) is one of the closest planetary nebulae to Earth at about 650 light-years. Its eye-like appearance comes from looking down a tunnel of gas.',
  },
  {
    question: 'What is the Event Horizon Telescope (EHT)?',
    options: ['A single telescope in space', 'A network of radio telescopes that captured the first black hole image', 'NASA\'s successor to Hubble', 'A telescope at the North Pole'],
    correct: 'A network of radio telescopes that captured the first black hole image',
    funFact: 'The EHT links radio telescopes worldwide to form an Earth-sized virtual telescope. In 2019 it imaged the black hole in galaxy M87, and in 2022, Sagittarius A*.',
  },
  {
    question: 'What is a T Tauri star?',
    options: ['A dead star', 'A very young star still contracting before main sequence fusion begins', 'A type of red dwarf', 'A star only in the Taurus constellation'],
    correct: 'A very young star still contracting before main sequence fusion begins',
    funFact: 'T Tauri stars are less than 10 million years old and haven\'t yet begun stable hydrogen fusion. They\'re often surrounded by protoplanetary disks and are highly variable.',
  },
  {
    question: 'What is precession of the equinoxes?',
    options: ['Seasons shifting days', 'Earth\'s axis slowly wobbling in a 26,000-year cycle', 'Planets changing orbit', 'Stars moving across the sky'],
    correct: 'Earth\'s axis slowly wobbling in a 26,000-year cycle',
    funFact: 'Due to precession, the North Star changes over thousands of years. Polaris is our current North Star, but in 12,000 years it will be Vega.',
  },
  {
    question: 'What is a nova?',
    options: ['Birth of a new star', 'A sudden brightening of a white dwarf from surface nuclear explosion', 'A small asteroid impact', 'A star becoming a red giant'],
    correct: 'A sudden brightening of a white dwarf from surface nuclear explosion',
    funFact: 'In a nova, hydrogen accumulates on a white dwarf\'s surface from a companion star and ignites. Unlike supernovae, the star survives and can repeat the process.',
  },
  {
    question: 'What is the Wow! signal?',
    options: ['First detection of gravitational waves', 'A strong narrowband radio signal detected in 1977', 'Signal from Voyager 1', 'First pulsar detection'],
    correct: 'A strong narrowband radio signal detected in 1977',
    funFact: 'Astronomer Jerry Ehman circled the signal on the printout and wrote "Wow!" It lasted 72 seconds, came from Sagittarius, and has never repeated. Its origin remains unexplained.',
  },
  {
    question: 'What is the Sombrero Galaxy?',
    options: ['A spiral galaxy with a prominent dust lane seen edge-on', 'An irregular galaxy in the Local Group', 'An elliptical galaxy near the Milky Way', 'A dwarf galaxy'],
    correct: 'A spiral galaxy with a prominent dust lane seen edge-on',
    funFact: 'The Sombrero Galaxy (M104) is 28 million light-years away. Its nucleus harbors a supermassive black hole of 1 billion solar masses — one of the most massive known.',
  },
  {
    question: 'What is the Orion Nebula\'s Messier designation?',
    options: ['M31', 'M42', 'M51', 'M87'],
    correct: 'M42',
    funFact: 'M42 is the closest large star-forming region to Earth at about 1,344 light-years. It\'s visible to the naked eye as a fuzzy patch in Orion\'s sword.',
  },
  {
    question: 'What is a kilonova?',
    options: ['A thousand supernovae at once', 'An explosion from two merging neutron stars', 'A very large nova', 'A supernova in a dwarf galaxy'],
    correct: 'An explosion from two merging neutron stars',
    funFact: 'Kilonovae produce heavy elements like gold and platinum through rapid neutron capture. The first confirmed kilonova was observed in 2017 alongside gravitational waves.',
  },
  {
    question: 'What is the Whirlpool Galaxy?',
    options: ['A classic face-on spiral galaxy interacting with a companion', 'A galaxy destroyed by a black hole', 'A newly discovered galaxy', 'The center of the Milky Way'],
    correct: 'A classic face-on spiral galaxy interacting with a companion',
    funFact: 'The Whirlpool Galaxy (M51) was the first galaxy whose spiral structure was observed, by Lord Rosse in 1845. It\'s about 23 million light-years away in Canes Venatici.',
  },
  {
    question: 'What are Wolf-Rayet stars?',
    options: ['The smallest known stars', 'Extremely hot massive stars losing mass via powerful stellar winds', 'Stars discovered near wolves', 'Binary star systems'],
    correct: 'Extremely hot massive stars losing mass via powerful stellar winds',
    funFact: 'Wolf-Rayet stars have surface temperatures of 25,000-200,000 K and shed their outer layers at tremendous rates. They are precursors to some of the most powerful supernovae.',
  },
  {
    question: 'What is the James Webb Space Telescope\'s primary observation wavelength?',
    options: ['Ultraviolet', 'Visible light', 'Infrared', 'X-ray'],
    correct: 'Infrared',
    funFact: 'JWST observes primarily in infrared, allowing it to see through dust clouds and detect light from the earliest galaxies, redshifted by cosmic expansion.',
  },
  {
    question: 'What is a Bok globule?',
    options: ['A type of galaxy', 'A small dark dense cloud where stars are forming', 'A globular cluster remnant', 'A moon of Jupiter'],
    correct: 'A small dark dense cloud where stars are forming',
    funFact: 'Bok globules are named after astronomer Bart Bok who studied them in the 1940s. They typically contain 1-50 solar masses and span about 1 light-year across.',
  },
  {
    question: 'What is the Hubble tuning fork diagram?',
    options: ['A musical instrument', 'A classification scheme for galaxy shapes', 'A diagram of sound frequencies in space', 'A chart of telescope calibration'],
    correct: 'A classification scheme for galaxy shapes',
    funFact: 'Edwin Hubble classified galaxies as elliptical (E0-E7), spiral (Sa-Sc), barred spiral (SBa-SBc), or irregular. The diagram\'s shape resembles a tuning fork.',
  },
  {
    question: 'What is the Cat\'s Eye Nebula?',
    options: ['A nebula in Leo', 'One of the most complex planetary nebulae known, in Draco', 'A supernova remnant', 'A dark nebula'],
    correct: 'One of the most complex planetary nebulae known, in Draco',
    funFact: 'The Cat\'s Eye Nebula (NGC 6543) shows intricate concentric shells and jets. It was one of the first planetary nebulae discovered, by William Herschel in 1786.',
  },
  {
    question: 'What is the Carina Nebula?',
    options: ['A dark nebula', 'One of the largest and brightest nebulae, home to Eta Carinae', 'A nebula visible only from space', 'A nebula in the northern sky'],
    correct: 'One of the largest and brightest nebulae, home to Eta Carinae',
    funFact: 'The Carina Nebula is about 8,500 light-years away and spans over 300 light-years. Eta Carinae within it is one of the most massive stars known, at 100+ solar masses.',
  },
  {
    question: 'What is a main sequence star?',
    options: ['Any star visible to the naked eye', 'A star fusing hydrogen to helium in stable equilibrium', 'A star in a specific constellation', 'The brightest star in a cluster'],
    correct: 'A star fusing hydrogen to helium in stable equilibrium',
    funFact: 'About 90% of a star\'s life is spent on the main sequence. Our Sun has been a main sequence star for 4.6 billion years and will remain one for about 5 billion more.',
  },
  {
    question: 'What is the Large Magellanic Cloud?',
    options: ['A gas cloud in the Milky Way', 'A satellite galaxy visible from the Southern Hemisphere', 'A nebula discovered by Magellan', 'The largest cloud on Jupiter'],
    correct: 'A satellite galaxy visible from the Southern Hemisphere',
    funFact: 'The LMC is about 160,000 light-years away and contains about 30 billion stars. Supernova 1987A, the closest observed supernova since 1604, occurred in the LMC.',
  },
  {
    question: 'What is the Arecibo message?',
    options: ['First radio signal from space', 'An encoded message beamed toward star cluster M13 in 1974', 'A message left on the Moon', 'A coded signal from a pulsar'],
    correct: 'An encoded message beamed toward star cluster M13 in 1974',
    funFact: 'The Arecibo message contained information about DNA, human form, our solar system, and the telescope. M13 is 25,000 light-years away, so any reply would take 50,000 years.',
  },
  {
    question: 'What is the Chandrasekhar limit for white dwarfs?',
    options: ['~0.5 solar masses', '~1.4 solar masses', '~3 solar masses', '~5 solar masses'],
    correct: '~1.4 solar masses',
    funFact: 'Above 1.4 solar masses, electron degeneracy pressure cannot support a white dwarf against gravitational collapse. It will become a neutron star or trigger a Type Ia supernova.',
  },
  {
    question: 'Who discovered Uranus?',
    options: ['Galileo Galilei', 'William Herschel', 'Isaac Newton', 'Johannes Kepler'],
    correct: 'William Herschel',
    funFact: 'William Herschel discovered Uranus on March 13, 1781, making it the first planet discovered with a telescope. He initially thought it was a comet.',
  },
  {
    question: 'What is the Doppler effect in astronomy?',
    options: ['Stars getting brighter', 'Change in frequency of light/sound due to relative motion', 'Planets speeding up in orbit', 'Light bending around stars'],
    correct: 'Change in frequency of light/sound due to relative motion',
    funFact: 'The Doppler effect causes light from approaching objects to shift blue and receding objects to shift red. It\'s used to detect exoplanets by measuring stellar wobble.',
  },
  // ─── Star Lifecycles ───────────────────────────────────────
  {
    question: 'What is the main sequence?',
    options: ['A sequence of galaxy types', 'The longest stage of a star\'s life, fusing hydrogen', 'The order planets formed', 'A list of constellations'],
    correct: 'The longest stage of a star\'s life, fusing hydrogen',
    funFact: 'Stars spend about 90% of their lives on the main sequence. Our Sun has been on the main sequence for 4.6 billion years and will remain for another 5 billion.',
  },
  {
    question: 'What happens to a star like our Sun at the end of its life?',
    options: ['Supernova explosion', 'Becomes a red giant, then white dwarf', 'Becomes a black hole', 'Becomes a neutron star'],
    correct: 'Becomes a red giant, then white dwarf',
    funFact: 'In about 5 billion years, the Sun will expand into a red giant engulfing Mercury and Venus, then shed its outer layers leaving a white dwarf the size of Earth.',
  },
  {
    question: 'What is a white dwarf?',
    options: ['A small main sequence star', 'The hot, dense remnant core of a low-mass star', 'A young star forming', 'A very dim red star'],
    correct: 'The hot, dense remnant core of a low-mass star',
    funFact: 'White dwarfs are incredibly dense — a teaspoon would weigh about 5 tons. They slowly cool over trillions of years, eventually becoming hypothetical "black dwarfs."',
  },
  {
    question: 'What determines whether a star becomes a white dwarf, neutron star, or black hole?',
    options: ['Its color', 'Its mass', 'Its age', 'Its distance from other stars'],
    correct: 'Its mass',
    funFact: 'Stars under ~8 solar masses become white dwarfs. Between 8-25 solar masses, they become neutron stars. Above ~25 solar masses, they collapse into black holes.',
  },
  {
    question: 'What is a red giant?',
    options: ['A very large red planet', 'A star that has expanded after exhausting core hydrogen', 'A type of nebula', 'A young massive star'],
    correct: 'A star that has expanded after exhausting core hydrogen',
    funFact: 'When a star runs out of hydrogen fuel in its core, it expands enormously. Betelgeuse is a red supergiant about 700 times the Sun\'s diameter.',
  },
  {
    question: 'What is a planetary nebula?',
    options: ['A nebula where planets form', 'Gas shells ejected by a dying low-mass star', 'Atmosphere of a gas giant', 'A nebula shaped like a planet'],
    correct: 'Gas shells ejected by a dying low-mass star',
    funFact: 'Despite the misleading name (coined because they looked round like planets through early telescopes), planetary nebulae are stellar death shrouds, not related to planets.',
  },
  {
    question: 'What is a protostar?',
    options: ['A dying star', 'A star in the earliest stage of formation', 'A binary star system', 'A star between galaxies'],
    correct: 'A star in the earliest stage of formation',
    funFact: 'Protostars form when a cloud of gas and dust collapses under gravity. They can take millions of years to gather enough mass to ignite nuclear fusion.',
  },
  {
    question: 'What type of star is Betelgeuse?',
    options: ['White dwarf', 'Red supergiant', 'Blue giant', 'Yellow dwarf'],
    correct: 'Red supergiant',
    funFact: 'Betelgeuse in Orion\'s shoulder is nearing the end of its life and could explode as a supernova anytime in the next 100,000 years — it would be visible in daylight.',
  },
  {
    question: 'What is the Hertzsprung-Russell diagram?',
    options: ['A map of the Milky Way', 'A graph plotting star luminosity against temperature', 'A timeline of the universe', 'A chart of planetary orbits'],
    correct: 'A graph plotting star luminosity against temperature',
    funFact: 'The H-R diagram is one of the most important tools in astronomy. Stars cluster in patterns: the main sequence diagonal, red giant branch, and white dwarf region.',
  },
  {
    question: 'What fuels a star on the main sequence?',
    options: ['Burning gas like a fire', 'Nuclear fusion of hydrogen into helium', 'Gravitational collapse', 'Chemical combustion'],
    correct: 'Nuclear fusion of hydrogen into helium',
    funFact: 'In the Sun\'s core, 600 million tons of hydrogen are converted to helium every second at 15 million °C, releasing energy via Einstein\'s E=mc².',
  },
  // ─── Galaxy Types ──────────────────────────────────────────
  {
    question: 'What type of galaxy is the Milky Way?',
    options: ['Elliptical', 'Barred spiral', 'Irregular', 'Lenticular'],
    correct: 'Barred spiral',
    funFact: 'The Milky Way is a barred spiral galaxy with a central bar-shaped structure of stars. It has 4 major spiral arms and is about 100,000 light-years across.',
  },
  {
    question: 'What are the three main types of galaxies?',
    options: ['Big, medium, small', 'Spiral, elliptical, irregular', 'Young, middle-aged, old', 'Gas, dust, stellar'],
    correct: 'Spiral, elliptical, irregular',
    funFact: 'Edwin Hubble classified galaxies in 1926. Spirals have arms (like Milky Way), ellipticals are smooth spheroids, and irregulars have no defined shape.',
  },
  {
    question: 'What is at the center of most large galaxies?',
    options: ['A giant star', 'A supermassive black hole', 'A neutron star', 'Nothing special'],
    correct: 'A supermassive black hole',
    funFact: 'Most large galaxies harbor supermassive black holes at their centers, ranging from millions to billions of solar masses. The Milky Way\'s is 4 million solar masses.',
  },
  {
    question: 'What is the Local Group?',
    options: ['Nearby stars', 'The cluster of galaxies containing the Milky Way', 'A group of constellations', 'Planets near Earth'],
    correct: 'The cluster of galaxies containing the Milky Way',
    funFact: 'The Local Group contains about 80 galaxies within 10 million light-years, dominated by the Milky Way and Andromeda. Most members are small dwarf galaxies.',
  },
  {
    question: 'What is the largest type of galaxy?',
    options: ['Spiral', 'Giant elliptical', 'Irregular', 'Barred spiral'],
    correct: 'Giant elliptical',
    funFact: 'IC 1101, a giant elliptical galaxy, is about 6 million light-years across — 60 times wider than the Milky Way and contains trillions of stars.',
  },
  {
    question: 'How fast is the Milky Way rotating at our Sun\'s position?',
    options: ['100 km/s', '230 km/s', '500 km/s', '1,000 km/s'],
    correct: '230 km/s',
    funFact: 'The Sun orbits the Milky Way\'s center at about 230 km/s, taking about 225 million years to complete one orbit — a "cosmic year."',
  },
  // ─── Famous Telescopes ─────────────────────────────────────
  {
    question: 'When was the Hubble Space Telescope launched?',
    options: ['1985', '1990', '1995', '2000'],
    correct: '1990',
    funFact: 'Hubble launched on April 24, 1990. Its initially flawed mirror was corrected in 1993, and it has since taken some of the most iconic images in astronomy.',
  },
  {
    question: 'What type of telescope is ALMA?',
    options: ['X-ray space telescope', 'Array of radio/millimeter wave antennas', 'Optical ground telescope', 'Infrared satellite'],
    correct: 'Array of radio/millimeter wave antennas',
    funFact: 'ALMA (Atacama Large Millimeter Array) in Chile consists of 66 antennas at 5,000m altitude. It observes cold gas and dust to study star and planet formation.',
  },
  {
    question: 'What happened to the Arecibo Observatory?',
    options: ['Still operating normally', 'Collapsed in December 2020', 'Moved to a new location', 'Converted to optical telescope'],
    correct: 'Collapsed in December 2020',
    funFact: 'The iconic 305-meter Arecibo radio telescope in Puerto Rico collapsed on Dec 1, 2020, after cable failures. It had operated for 57 years.',
  },
  {
    question: 'What is the largest optical telescope in the world (by mirror size)?',
    options: ['Hubble', 'Gran Telescopio Canarias', 'Keck Observatory', 'Very Large Telescope'],
    correct: 'Gran Telescopio Canarias',
    funFact: 'The GTC in Spain\'s Canary Islands has a 10.4-meter segmented mirror. The upcoming ELT (Extremely Large Telescope) will have a 39-meter mirror when completed.',
  },
  {
    question: 'What does the VLT stand for in astronomy?',
    options: ['Very Large Telescope', 'Visual Light Tracker', 'Variable Light Telescope', 'Volcanic Lava Tracker'],
    correct: 'Very Large Telescope',
    funFact: 'ESO\'s Very Large Telescope in Chile has four 8.2-meter telescopes that can work together as an interferometer, achieving the resolution of a 130-meter telescope.',
  },
  {
    question: 'What is the Extremely Large Telescope (ELT)?',
    options: ['A joke name', 'A 39-meter telescope under construction in Chile', 'NASA\'s next space telescope', 'A radio telescope network'],
    correct: 'A 39-meter telescope under construction in Chile',
    funFact: 'The ELT will be the world\'s largest optical telescope when completed (~2028). Its mirror will collect 13 times more light than any existing telescope.',
  },
  // ─── Constellations Across Cultures ────────────────────────
  {
    question: 'What did Aboriginal Australians see in the dark patches of the Milky Way?',
    options: ['Gods and heroes', 'An Emu in the sky', 'A great river', 'A giant snake'],
    correct: 'An Emu in the sky',
    funFact: 'Aboriginal Australians have one of the oldest astronomical traditions. The "Emu in the Sky" is formed by dark nebulae rather than stars — a unique approach to sky mapping.',
  },
  {
    question: 'In Hindu astronomy, what are the 27 Nakshatras?',
    options: ['Types of stars', 'Lunar mansions/constellations along the Moon\'s path', 'Planets', 'Types of eclipses'],
    correct: 'Lunar mansions/constellations along the Moon\'s path',
    funFact: 'The 27 Nakshatras divide the ecliptic into segments, each associated with a deity and qualities. This system dates back to the Vedic period (1500-500 BCE).',
  },
  {
    question: 'What is the Chinese constellation system called?',
    options: ['The Zodiac', 'Twenty-Eight Mansions (Xiu)', 'Star Houses', 'Celestial Palaces'],
    correct: 'Twenty-Eight Mansions (Xiu)',
    funFact: 'Chinese astronomy divides the sky into 28 Xiu (mansions) grouped into 4 directional symbols: Azure Dragon, Black Tortoise, White Tiger, and Vermilion Bird.',
  },
  {
    question: 'What constellation did the Polynesians use for navigation?',
    options: ['Orion', 'The Southern Cross', 'Big Dipper', 'Cassiopeia'],
    correct: 'The Southern Cross',
    funFact: 'Polynesian navigators used the Southern Cross (Crux) to find south, along with hundreds of other stars, wave patterns, and bird behaviors to navigate vast ocean distances.',
  },
  {
    question: 'In Inuit astronomy, what does the constellation "Tukturjuit" represent?',
    options: ['A hunter', 'Caribou', 'A seal', 'An igloo'],
    correct: 'Caribou',
    funFact: 'The Inuit see caribou (Tukturjuit) in what Western astronomy calls the Big Dipper. Many Arctic peoples have unique constellations suited to their polar sky views.',
  },
  // ─── Dark Matter and Dark Energy ───────────────────────────
  {
    question: 'What is dark matter?',
    options: ['Matter that is very dark colored', 'Invisible matter that interacts gravitationally but not with light', 'Anti-matter', 'Matter inside black holes'],
    correct: 'Invisible matter that interacts gravitationally but not with light',
    funFact: 'Dark matter makes up about 27% of the universe. We know it exists because galaxies rotate too fast to be held together by visible matter alone.',
  },
  {
    question: 'Who first proposed the existence of dark matter?',
    options: ['Einstein', 'Fritz Zwicky', 'Hawking', 'Newton'],
    correct: 'Fritz Zwicky',
    funFact: 'In 1933, Fritz Zwicky studied the Coma galaxy cluster and found galaxies moving too fast for visible mass to hold them together. He called the missing mass "dunkle Materie."',
  },
  {
    question: 'What evidence supports the existence of dark matter?',
    options: ['We can see it directly', 'Galaxy rotation curves, gravitational lensing, and CMB data', 'It has been created in labs', 'Radio signals from dark matter'],
    correct: 'Galaxy rotation curves, gravitational lensing, and CMB data',
    funFact: 'Vera Rubin\'s work in the 1970s on galaxy rotation curves provided compelling evidence — stars at galaxy edges orbit as fast as inner stars, implying invisible mass.',
  },
  {
    question: 'What accelerated the expansion of the universe, leading to the discovery of dark energy?',
    options: ['Hubble observations in 1929', 'Type Ia supernova observations in 1998', 'JWST images', 'Voyager data'],
    correct: 'Type Ia supernova observations in 1998',
    funFact: 'Two teams independently found that distant supernovae were dimmer than expected, meaning the universe\'s expansion is accelerating. This earned the 2011 Nobel Prize.',
  },
  {
    question: 'What percentage of the universe is dark energy?',
    options: ['5%', '27%', '68%', '95%'],
    correct: '68%',
    funFact: 'Dark energy is the dominant component of the universe at 68%, yet we have no idea what it actually is. It acts as a repulsive force on cosmic scales.',
  },
  // ─── The Big Bang ──────────────────────────────────────────
  {
    question: 'Who first proposed the Big Bang theory?',
    options: ['Edwin Hubble', 'Georges Lemaître', 'Albert Einstein', 'Stephen Hawking'],
    correct: 'Georges Lemaître',
    funFact: 'Belgian priest and physicist Georges Lemaître proposed in 1927 that the universe began from a "primeval atom." The term "Big Bang" was coined mockingly by Fred Hoyle in 1949.',
  },
  {
    question: 'What is the cosmic microwave background (CMB)?',
    options: ['Radio noise from cell towers', 'The oldest light in the universe from 380,000 years after the Big Bang', 'Radiation from the Sun', 'Background from WiFi signals'],
    correct: 'The oldest light in the universe from 380,000 years after the Big Bang',
    funFact: 'The CMB was accidentally discovered in 1965 by Penzias and Wilson, who initially thought it was pigeon droppings on their antenna. They won the 1978 Nobel Prize.',
  },
  {
    question: 'What is cosmic inflation?',
    options: ['Prices going up in space', 'An extremely rapid expansion of space in the first fraction of a second', 'Galaxies getting bigger', 'Stars inflating before supernova'],
    correct: 'An extremely rapid expansion of space in the first fraction of a second',
    funFact: 'During inflation (10^-36 to 10^-32 seconds after the Big Bang), the universe expanded by a factor of at least 10^26 — from subatomic to macroscopic size.',
  },
  {
    question: 'What will happen to the universe in the far future according to current models?',
    options: ['Big Crunch', 'Heat death (everything spreads out and cools)', 'Big Bounce', 'It will shrink'],
    correct: 'Heat death (everything spreads out and cools)',
    funFact: 'With dark energy accelerating expansion, the universe will eventually become cold and empty. Stars will burn out, black holes will evaporate, and entropy will reach maximum.',
  },
  // ─── Famous Astronomers ────────────────────────────────────
  {
    question: 'Who was Aryabhata?',
    options: ['Greek philosopher', 'Indian mathematician-astronomer (476 CE) who proposed Earth\'s rotation', 'Chinese explorer', 'Persian poet'],
    correct: 'Indian mathematician-astronomer (476 CE) who proposed Earth\'s rotation',
    funFact: 'Aryabhata correctly stated that Earth rotates on its axis daily, proposed a heliocentric model, and calculated pi to 4 decimal places — over 1,000 years before Copernicus.',
  },
  {
    question: 'Who was Abd al-Rahman al-Sufi?',
    options: ['Ottoman sultan', 'Persian astronomer who cataloged stars and first recorded Andromeda', 'Arab mathematician', 'Indian navigator'],
    correct: 'Persian astronomer who cataloged stars and first recorded Andromeda',
    funFact: 'Al-Sufi (903-986 CE) wrote "Book of Fixed Stars," correcting Ptolemy\'s catalog. He made the first known observation of the Andromeda Galaxy, calling it a "nebulous smear."',
  },
  {
    question: 'What did Copernicus propose?',
    options: ['Earth is flat', 'Sun-centered (heliocentric) solar system', 'Earth is the center', 'The universe is infinite'],
    correct: 'Sun-centered (heliocentric) solar system',
    funFact: 'Copernicus published "De revolutionibus" in 1543, placing the Sun at the center. He delayed publication for decades, fearing controversy. He died the year it was published.',
  },
  {
    question: 'What were Kepler\'s three laws about?',
    options: ['Light and optics', 'Planetary motion (elliptical orbits, equal areas, orbital periods)', 'Star brightness', 'Gravity on Earth'],
    correct: 'Planetary motion (elliptical orbits, equal areas, orbital periods)',
    funFact: 'Johannes Kepler (1571-1630) used Tycho Brahe\'s precise observations to derive his three laws. The first law showed planets move in ellipses, not perfect circles.',
  },
  {
    question: 'Who was the first person to use a telescope for astronomy?',
    options: ['Copernicus', 'Kepler', 'Galileo Galilei', 'Isaac Newton'],
    correct: 'Galileo Galilei',
    funFact: 'In 1609, Galileo turned his telescope skyward, discovering Jupiter\'s moons, Venus\'s phases, lunar craters, and sunspots — revolutionizing our view of the cosmos.',
  },
  {
    question: 'What did Henrietta Swan Leavitt discover?',
    options: ['Pluto', 'The period-luminosity relationship of Cepheid variables', 'Dark matter', 'The first exoplanet'],
    correct: 'The period-luminosity relationship of Cepheid variables',
    funFact: 'Leavitt\'s 1912 discovery that brighter Cepheid stars pulse slower gave astronomers a "standard candle" to measure cosmic distances — enabling Hubble to prove galaxies exist.',
  },
  {
    question: 'What is Vera Rubin famous for?',
    options: ['Discovering Pluto', 'Providing strong evidence for dark matter through galaxy rotation curves', 'First woman in space', 'Inventing the telescope'],
    correct: 'Providing strong evidence for dark matter through galaxy rotation curves',
    funFact: 'In the 1970s, Rubin showed that stars at the edges of galaxies orbit just as fast as those near the center, implying vast amounts of unseen matter.',
  },
  {
    question: 'Who was Subrahmanyan Chandrasekhar?',
    options: ['Indian cricketer', 'Indian-American astrophysicist who determined the mass limit for white dwarfs', 'Bollywood actor', 'Indian politician'],
    correct: 'Indian-American astrophysicist who determined the mass limit for white dwarfs',
    funFact: 'Chandrasekhar calculated that white dwarfs above ~1.4 solar masses will collapse further. This "Chandrasekhar limit" earned him the 1983 Nobel Prize in Physics.',
  },
  // ─── Nebulae ───────────────────────────────────────────────
  {
    question: 'What is the Eagle Nebula famous for?',
    options: ['Being closest to Earth', 'The "Pillars of Creation" — towers of gas where stars are born', 'Containing a black hole', 'Its eagle-shaped stars'],
    correct: 'The "Pillars of Creation" — towers of gas where stars are born',
    funFact: 'The Pillars of Creation, imaged by Hubble in 1995 and JWST in 2022, are columns of cold gas and dust about 5 light-years tall where new stars are forming.',
  },
  {
    question: 'What type of nebula is the Crab Nebula?',
    options: ['Planetary nebula', 'Supernova remnant', 'Emission nebula', 'Dark nebula'],
    correct: 'Supernova remnant',
    funFact: 'The Crab Nebula is the remnant of a supernova observed by Chinese astronomers in 1054 CE. It contains a pulsar spinning 30 times per second at its center.',
  },
  {
    question: 'Where is the Horsehead Nebula located?',
    options: ['Sagittarius', 'Orion', 'Andromeda', 'Cygnus'],
    correct: 'Orion',
    funFact: 'The Horsehead Nebula (Barnard 33) is a dark nebula in Orion, about 1,500 light-years away. Its horse-head shape is formed by dense dust blocking background light.',
  },
  {
    question: 'What is the Orion Nebula?',
    options: ['A dark nebula', 'A stellar nursery visible to the naked eye', 'A planetary nebula', 'A supernova remnant'],
    correct: 'A stellar nursery visible to the naked eye',
    funFact: 'The Orion Nebula (M42) is the closest massive star-forming region at ~1,344 light-years. It\'s visible as a fuzzy patch in Orion\'s "sword" below the belt.',
  },
  {
    question: 'What is the Ring Nebula?',
    options: ['A ring-shaped galaxy', 'A planetary nebula — glowing shell of gas from a dying star', 'Saturn\'s rings', 'A ring of asteroids'],
    correct: 'A planetary nebula — glowing shell of gas from a dying star',
    funFact: 'The Ring Nebula (M57) in Lyra is about 2,300 light-years away. JWST revealed stunning new details of its structure in 2023.',
  },
  {
    question: 'What causes nebulae to glow?',
    options: ['Reflected sunlight', 'Chemical fires', 'Ionized gas excited by ultraviolet radiation from nearby hot stars', 'Radioactivity'],
    correct: 'Ionized gas excited by ultraviolet radiation from nearby hot stars',
    funFact: 'Emission nebulae glow because UV light from hot young stars ionizes hydrogen gas, which then emits characteristic red light as electrons recombine.',
  },
  // ─── Binary Stars and Variable Stars ───────────────────────
  {
    question: 'What is a binary star system?',
    options: ['Two stars orbiting their common center of mass', 'A star with two names', 'Two stars that look close but aren\'t', 'A star visible in two hemispheres'],
    correct: 'Two stars orbiting their common center of mass',
    funFact: 'About half of all star systems are binaries or multiples. Sirius, the brightest star, is actually a binary system — Sirius A and a white dwarf Sirius B.',
  },
  {
    question: 'What is an eclipsing binary?',
    options: ['Stars that cause eclipses on Earth', 'A binary where one star periodically passes in front of the other', 'Stars near the ecliptic', 'A binary that disappears'],
    correct: 'A binary where one star periodically passes in front of the other',
    funFact: 'Algol in Perseus was the first recognized eclipsing binary. Every 2.87 days, its brightness drops as the dimmer star passes in front of the brighter one.',
  },
  {
    question: 'What is a Cepheid variable?',
    options: ['A star with changing color', 'A pulsating star whose brightness varies regularly with its period', 'A star with variable speed', 'A binary star'],
    correct: 'A pulsating star whose brightness varies regularly with its period',
    funFact: 'Cepheids expand and contract rhythmically. Their period-luminosity relation (Leavitt\'s Law) makes them crucial "standard candles" for measuring cosmic distances.',
  },
  {
    question: 'What is a nova?',
    options: ['A new star appearing', 'A thermonuclear explosion on a white dwarf\'s surface in a binary system', 'A supernova', 'A planet forming'],
    correct: 'A thermonuclear explosion on a white dwarf\'s surface in a binary system',
    funFact: 'In a nova, a white dwarf accumulates hydrogen from a companion star until it ignites in a massive surface explosion. Unlike supernovae, the star survives.',
  },
  {
    question: 'What is the most massive star known?',
    options: ['Betelgeuse', 'R136a1', 'Sirius', 'Eta Carinae'],
    correct: 'R136a1',
    funFact: 'R136a1 in the Large Magellanic Cloud has about 196 solar masses and is millions of times more luminous than the Sun. It challenges theories of star formation limits.',
  },
  // ─── Additional Astronomy Questions ────────────────────────
  {
    question: 'What is gravitational lensing?',
    options: ['A telescope lens design', 'Bending of light by gravity of massive objects', 'Gravitational waves bending', 'A camera effect'],
    correct: 'Bending of light by gravity of massive objects',
    funFact: 'Einstein predicted that massive objects warp spacetime, bending light paths. Galaxy clusters can lens background galaxies into arcs and even create multiple images.',
  },
  {
    question: 'What is the Chandrasekhar limit?',
    options: ['Maximum size of a planet', 'Maximum mass of a white dwarf (~1.4 solar masses)', 'Speed limit in space', 'Maximum telescope size'],
    correct: 'Maximum mass of a white dwarf (~1.4 solar masses)',
    funFact: 'Above 1.4 solar masses, electron degeneracy pressure can\'t support a white dwarf, and it will collapse into a neutron star or trigger a Type Ia supernova.',
  },
  {
    question: 'What is redshift?',
    options: ['Stars turning red', 'Stretching of light wavelength as an object moves away', 'Sunrise color', 'A type of star death'],
    correct: 'Stretching of light wavelength as an object moves away',
    funFact: 'Edwin Hubble used redshift to prove galaxies are moving away from us — the farther a galaxy, the faster it recedes. This revealed the universe is expanding.',
  },
  {
    question: 'What is a Type Ia supernova?',
    options: ['Core collapse of a massive star', 'Thermonuclear explosion of a white dwarf exceeding the Chandrasekhar limit', 'A failed supernova', 'Explosion of a neutron star'],
    correct: 'Thermonuclear explosion of a white dwarf exceeding the Chandrasekhar limit',
    funFact: 'Type Ia supernovae all reach about the same peak brightness, making them "standard candles" for measuring cosmic distances. They helped discover dark energy.',
  },
  {
    question: 'What is the Hubble constant?',
    options: ['Speed of light', 'Rate of expansion of the universe', 'Distance to Andromeda', 'Age of Hubble telescope'],
    correct: 'Rate of expansion of the universe',
    funFact: 'The Hubble constant (H₀) is about 67-74 km/s/Mpc. The "Hubble tension" — disagreement between measurement methods — is one of astronomy\'s biggest current puzzles.',
  },
  {
    question: 'What is an asterism?',
    options: ['A type of asteroid', 'A recognizable pattern of stars that isn\'t an official constellation', 'A type of galaxy', 'A meteor shower'],
    correct: 'A recognizable pattern of stars that isn\'t an official constellation',
    funFact: 'The Big Dipper, Summer Triangle, and Winter Hexagon are all asterisms — familiar patterns that are parts of or span multiple constellations.',
  },
  {
    question: 'What is the ecliptic?',
    options: ['The path of eclipses', 'The apparent path of the Sun across the sky through the year', 'Earth\'s equator projected on the sky', 'The Milky Way band'],
    correct: 'The apparent path of the Sun across the sky through the year',
    funFact: 'The ecliptic is the plane of Earth\'s orbit projected onto the sky. Planets and the Moon are always found near the ecliptic, and zodiac constellations lie along it.',
  },
  {
    question: 'What is the celestial equator?',
    options: ['The equator of the Sun', 'Earth\'s equator projected onto the celestial sphere', 'The middle of the Milky Way', 'The ecliptic'],
    correct: 'Earth\'s equator projected onto the celestial sphere',
    funFact: 'The celestial equator divides the sky into northern and southern hemispheres. It intersects the ecliptic at two points — the equinoxes.',
  },
  {
    question: 'What is right ascension in astronomy?',
    options: ['How high a star is', 'The celestial equivalent of longitude', 'The direction to look', 'Elevation of a telescope'],
    correct: 'The celestial equivalent of longitude',
    funFact: 'Right ascension (RA) is measured in hours, minutes, and seconds (0h to 24h) from the vernal equinox point, mapping positions on the celestial sphere.',
  },
  {
    question: 'What is the difference between a meteor, meteoroid, and meteorite?',
    options: ['They are the same thing', 'Meteoroid in space, meteor is the streak in atmosphere, meteorite hits ground', 'Size differences only', 'Color differences'],
    correct: 'Meteoroid in space, meteor is the streak in atmosphere, meteorite hits ground',
    funFact: 'A meteoroid floating in space becomes a meteor (shooting star) when it enters Earth\'s atmosphere. If any part survives to reach the ground, it becomes a meteorite.',
  },
  {
    question: 'What is the Perseid meteor shower associated with?',
    options: ['Halley\'s Comet', 'Comet Swift-Tuttle', 'Asteroid Bennu', 'Comet Hale-Bopp'],
    correct: 'Comet Swift-Tuttle',
    funFact: 'Every August, Earth passes through debris left by Comet Swift-Tuttle, producing up to 100 meteors per hour. The Perseids have been observed for nearly 2,000 years.',
  },
  {
    question: 'What is the Wow! signal?',
    options: ['First radio signal from space', 'A strong narrowband radio signal detected in 1977 that may have been extraterrestrial', 'A NASA distress call', 'A famous comet'],
    correct: 'A strong narrowband radio signal detected in 1977 that may have been extraterrestrial',
    funFact: 'Astronomer Jerry Ehman circled the signal on the printout and wrote "Wow!" It lasted 72 seconds, came from Sagittarius, matched expected alien signals — but was never repeated.',
  },
  {
    question: 'What is the significance of the 21-cm hydrogen line?',
    options: ['It measures telescope size', 'It\'s the radio frequency emitted by neutral hydrogen, used to map the galaxy', 'It measures star distance', 'It detects dark matter'],
    correct: 'It\'s the radio frequency emitted by neutral hydrogen, used to map the galaxy',
    funFact: 'Neutral hydrogen emits radio waves at 21 cm (1420 MHz). Since hydrogen is the most common element, this frequency lets astronomers map the structure of galaxies.',
  },
  {
    question: 'What is a globular cluster?',
    options: ['A type of galaxy', 'A dense, spherical collection of old stars orbiting a galaxy', 'A cluster of planets', 'A nebula type'],
    correct: 'A dense, spherical collection of old stars orbiting a galaxy',
    funFact: 'Globular clusters contain hundreds of thousands to millions of stars, are 10-13 billion years old, and orbit galaxies in halos. The Milky Way has about 150.',
  },
  {
    question: 'What is the cosmic distance ladder?',
    options: ['A real ladder in space', 'A series of methods used to measure increasingly large distances in the universe', 'The order of planets', 'Distance from Earth to ISS'],
    correct: 'A series of methods used to measure increasingly large distances in the universe',
    funFact: 'The distance ladder builds from parallax (nearby stars) to Cepheids (galaxies) to Type Ia supernovae (distant universe). Each rung calibrates the next.',
  },
  {
    question: 'What is parallax?',
    options: ['A type of star', 'The apparent shift in a star\'s position as Earth orbits the Sun', 'A telescope design', 'Light speed measurement'],
    correct: 'The apparent shift in a star\'s position as Earth orbits the Sun',
    funFact: 'By measuring how much a star appears to shift against background stars over 6 months, astronomers can calculate its distance. It works for stars within ~1,000 light-years.',
  },
  {
    question: 'What is adaptive optics?',
    options: ['Smart glasses', 'Technology that corrects atmospheric distortion in real-time for ground telescopes', 'A type of camera', 'Satellite tracking'],
    correct: 'Technology that corrects atmospheric distortion in real-time for ground telescopes',
    funFact: 'Adaptive optics uses deformable mirrors that change shape hundreds of times per second to counteract atmospheric turbulence, giving ground telescopes near-space clarity.',
  },
  {
    question: 'What is spectroscopy used for in astronomy?',
    options: ['Taking photos', 'Analyzing starlight to determine composition, temperature, and motion', 'Measuring size', 'Counting stars'],
    correct: 'Analyzing starlight to determine composition, temperature, and motion',
    funFact: 'By splitting starlight into its spectrum, astronomers can identify elements (via absorption lines), measure temperature, determine radial velocity, and even detect exoplanet atmospheres.',
  },
  {
    question: 'What is the significance of the star Vega?',
    options: ['Brightest star ever', 'Used as the zero-point reference for stellar magnitude and was the former North Star', 'Closest star to Earth', 'Largest star known'],
    correct: 'Used as the zero-point reference for stellar magnitude and was the former North Star',
    funFact: 'Vega was the North Star about 12,000 years ago and will be again in 13,700 years. It was also the first star (other than the Sun) to be photographed (1850).',
  },
  {
    question: 'What is a magnetar?',
    options: ['A magnetic planet', 'A neutron star with an incredibly strong magnetic field', 'A type of compass', 'An electromagnetic pulse'],
    correct: 'A neutron star with an incredibly strong magnetic field',
    funFact: 'Magnetars have magnetic fields 10^15 times stronger than Earth\'s. They can release more energy in 0.1 seconds than the Sun does in 100,000 years.',
  },
  {
    question: 'What is the triple-alpha process?',
    options: ['Three rocket launches', 'Nuclear reaction fusing three helium nuclei into carbon in red giants', 'Three star system', 'A telescope calibration'],
    correct: 'Nuclear reaction fusing three helium nuclei into carbon in red giants',
    funFact: 'The triple-alpha process is how carbon (essential for life) is made in stars. Fred Hoyle predicted a specific nuclear resonance was needed — and it was found.',
  },
  {
    question: 'What is the solar apex?',
    options: ['Top of the Sun', 'The direction the Sun is moving through space', 'The hottest part of the Sun', 'Where solar flares occur'],
    correct: 'The direction the Sun is moving through space',
    funFact: 'The Sun moves toward the constellation Hercules at about 20 km/s relative to nearby stars. This point is called the solar apex.',
  },
  {
    question: 'Who discovered the expanding universe?',
    options: ['Newton', 'Einstein', 'Edwin Hubble', 'Galileo'],
    correct: 'Edwin Hubble',
    funFact: 'In 1929, Hubble showed that galaxies are moving away from us with velocities proportional to their distances — Hubble\'s Law, proving the universe is expanding.',
  },
  {
    question: 'What is a brown dwarf?',
    options: ['A type of planet', 'An object too massive to be a planet but too small to sustain hydrogen fusion', 'A dead star', 'A dark nebula'],
    correct: 'An object too massive to be a planet but too small to sustain hydrogen fusion',
    funFact: 'Brown dwarfs (13-80 Jupiter masses) are "failed stars." They can fuse deuterium briefly but never achieve sustained hydrogen fusion like true stars.',
  },
  {
    question: 'What is the Sloan Digital Sky Survey?',
    options: ['A social media poll', 'A project that mapped millions of galaxies and quasars in 3D', 'A telescope brand', 'A star naming registry'],
    correct: 'A project that mapped millions of galaxies and quasars in 3D',
    funFact: 'SDSS has created the most detailed 3D map of the universe, cataloging over 4 million objects since 2000. Its data has been used in thousands of scientific papers.',
  },
  // ─── More Star and Galaxy Questions ────────────────────────
  {
    question: 'What is a Wolf-Rayet star?',
    options: ['A cool red star', 'A very hot, luminous star losing mass rapidly through stellar winds', 'A type of neutron star', 'A binary star'],
    correct: 'A very hot, luminous star losing mass rapidly through stellar winds',
    funFact: 'Wolf-Rayet stars have surface temperatures of 30,000-200,000 K and lose mass at rates millions of times higher than the Sun. They are precursors to supernovae.',
  },
  {
    question: 'What is the Laniakea Supercluster?',
    options: ['A type of star', 'The supercluster of galaxies that contains the Milky Way', 'A telescope', 'A nebula'],
    correct: 'The supercluster of galaxies that contains the Milky Way',
    funFact: 'Laniakea (Hawaiian for "immeasurable heaven") spans 520 million light-years and contains about 100,000 galaxies, including our Local Group.',
  },
  {
    question: 'What is the Great Attractor?',
    options: ['A magnet in space', 'A gravitational anomaly pulling galaxies toward it in the Zone of Avoidance', 'A black hole', 'A famous astronomer'],
    correct: 'A gravitational anomaly pulling galaxies toward it in the Zone of Avoidance',
    funFact: 'The Great Attractor is a region of gravitational pull hidden behind the Milky Way\'s plane (Zone of Avoidance). It influences the motion of galaxies over hundreds of millions of light-years.',
  },
  {
    question: 'What is a quasar?',
    options: ['A type of star', 'An extremely luminous active galactic nucleus powered by a supermassive black hole', 'A small planet', 'A type of nova'],
    correct: 'An extremely luminous active galactic nucleus powered by a supermassive black hole',
    funFact: 'Quasars can outshine their host galaxy by factors of 100. The most distant quasar detected is from when the universe was only 690 million years old.',
  },
  {
    question: 'What is the Cosmic Web?',
    options: ['The internet', 'The large-scale structure of the universe — filaments of galaxies surrounding voids', 'Spider webs in space', 'A telescope network'],
    correct: 'The large-scale structure of the universe — filaments of galaxies surrounding voids',
    funFact: 'Galaxies are not randomly distributed but form a web-like structure of filaments, walls, and nodes surrounding vast empty voids. It looks like a cosmic sponge.',
  },
  {
    question: 'What is frame dragging (Lense-Thirring effect)?',
    options: ['A camera effect', 'Rotating massive objects dragging spacetime around them', 'Frames of reference being destroyed', 'A telescope alignment issue'],
    correct: 'Rotating massive objects dragging spacetime around them',
    funFact: 'Frame dragging was predicted by Einstein\'s general relativity and confirmed by NASA\'s Gravity Probe B in 2011. Spinning black holes dramatically warp spacetime around them.',
  },
  {
    question: 'What is the Tully-Fisher relation?',
    options: ['A fishing technique', 'A relationship between a spiral galaxy\'s luminosity and its rotation speed', 'A star catalog', 'A telescope design'],
    correct: 'A relationship between a spiral galaxy\'s luminosity and its rotation speed',
    funFact: 'Faster-rotating spiral galaxies are more luminous. This relation allows astronomers to estimate distances to galaxies by measuring their rotation curves.',
  },
  {
    question: 'What are Population I and Population II stars?',
    options: ['First and second stars ever born', 'Pop I are younger metal-rich stars; Pop II are older metal-poor stars', 'Large vs small stars', 'Named after astronomers'],
    correct: 'Pop I are younger metal-rich stars; Pop II are older metal-poor stars',
    funFact: 'Pop I stars (like the Sun) formed from gas enriched by earlier supernovae. Pop II stars formed earlier with fewer heavy elements. Hypothetical Pop III stars were the very first.',
  },
  {
    question: 'What is the Jeans mass?',
    options: ['Mass of clothing', 'The minimum mass of a gas cloud needed to collapse under its own gravity to form a star', 'A unit of measurement', 'Star mass limit'],
    correct: 'The minimum mass of a gas cloud needed to collapse under its own gravity to form a star',
    funFact: 'Named after James Jeans, it balances gravitational collapse against thermal pressure. Clouds above the Jeans mass can contract to form stars.',
  },
  {
    question: 'What is the Hertzsprung gap?',
    options: ['A void in space', 'A region in the H-R diagram with few stars — because evolution through it is rapid', 'A gap between galaxies', 'A telescope defect'],
    correct: 'A region in the H-R diagram with few stars — because evolution through it is rapid',
    funFact: 'Stars evolving from the main sequence to red giant phase cross the Hertzsprung gap so quickly (astronomically speaking) that few are caught in this transition.',
  },
  {
    question: 'What is proper motion?',
    options: ['Correct telescope movement', 'The apparent motion of a star across the sky over time due to its actual space velocity', 'Planet rotation', 'Moon phases'],
    correct: 'The apparent motion of a star across the sky over time due to its actual space velocity',
    funFact: 'Barnard\'s Star has the highest proper motion of any star — 10.3 arcseconds per year. In 180 years, it moves the width of the full Moon across the sky.',
  },
  {
    question: 'What is the Hubble tuning fork diagram?',
    options: ['A musical instrument', 'A classification scheme for galaxies shaped like a tuning fork', 'A sound from space', 'A calibration tool'],
    correct: 'A classification scheme for galaxies shaped like a tuning fork',
    funFact: 'Hubble\'s 1926 scheme places ellipticals on the handle, splitting into barred and unbarred spirals on the prongs. Irregulars don\'t fit this scheme.',
  },
  {
    question: 'What is an active galactic nucleus (AGN)?',
    options: ['The center of a galaxy\'s government', 'A compact, extremely luminous region at a galaxy\'s center powered by accretion onto a supermassive black hole', 'A new galaxy forming', 'A cluster of stars'],
    correct: 'A compact, extremely luminous region at a galaxy\'s center powered by accretion onto a supermassive black hole',
    funFact: 'AGN come in many flavors: quasars, Seyfert galaxies, blazars, and radio galaxies — all powered by the same engine (accreting black holes) viewed from different angles.',
  },
  {
    question: 'What is the Magellanic Stream?',
    options: ['A river on Mars', 'A stream of gas pulled from the Magellanic Clouds by the Milky Way\'s gravity', 'A comet trail', 'A current in space'],
    correct: 'A stream of gas pulled from the Magellanic Clouds by the Milky Way\'s gravity',
    funFact: 'The Magellanic Stream spans over 200° across the southern sky. It\'s hydrogen gas being tidally stripped from the Large and Small Magellanic Clouds as they orbit our galaxy.',
  },
  {
    question: 'What is the Olbers\' paradox?',
    options: ['Why planets orbit', 'Why the night sky is dark if the universe is infinite and full of stars', 'Why stars twinkle', 'Why we can\'t travel faster than light'],
    correct: 'Why the night sky is dark if the universe is infinite and full of stars',
    funFact: 'Resolved by the universe\'s finite age (13.8 billion years) and expansion — light from very distant stars hasn\'t reached us yet, and expansion redshifts distant light.',
  },
  {
    question: 'What is a standard candle in astronomy?',
    options: ['A real candle used in observatories', 'An object of known luminosity used to measure distances', 'A unit of brightness', 'A very dim star'],
    correct: 'An object of known luminosity used to measure distances',
    funFact: 'By comparing an object\'s known luminosity to its observed brightness, distance can be calculated. Cepheids, Type Ia supernovae, and RR Lyrae stars are standard candles.',
  },
  {
    question: 'What is interferometry?',
    options: ['Interfering with observations', 'Combining signals from multiple telescopes to achieve higher resolution', 'Measuring interference patterns', 'A type of spectroscopy'],
    correct: 'Combining signals from multiple telescopes to achieve higher resolution',
    funFact: 'The Event Horizon Telescope used interferometry to combine radio dishes across Earth into one virtual telescope the size of the planet — enabling the first black hole image.',
  },
  {
    question: 'What is the Sagittarius Dwarf Elliptical Galaxy?',
    options: ['A large galaxy', 'A small galaxy being consumed by the Milky Way', 'A constellation', 'A nebula'],
    correct: 'A small galaxy being consumed by the Milky Way',
    funFact: 'Discovered in 1994, this dwarf galaxy is on the far side of the Milky Way\'s center, being tidally shredded. Its stars are being incorporated into our galaxy.',
  },
  {
    question: 'What is the Virgo Cluster?',
    options: ['A group of stars', 'The nearest large galaxy cluster with ~1,300 galaxies', 'A constellation', 'A type of nebula'],
    correct: 'The nearest large galaxy cluster with ~1,300 galaxies',
    funFact: 'The Virgo Cluster is about 54 million light-years away and contains giant ellipticals like M87. Its gravitational pull affects the motion of our Local Group.',
  },
  {
    question: 'What is a starburst galaxy?',
    options: ['A galaxy shaped like a star', 'A galaxy undergoing an exceptionally high rate of star formation', 'A galaxy that exploded', 'A very bright galaxy'],
    correct: 'A galaxy undergoing an exceptionally high rate of star formation',
    funFact: 'Starburst galaxies form stars at 10-1000 times the normal rate, often triggered by galaxy mergers or interactions. They glow brightly in infrared from heated dust.',
  },
  {
    question: 'What are cosmic rays?',
    options: ['Rays of light from space', 'High-energy particles (mostly protons) from outside the solar system', 'Laser beams from stars', 'Radio waves'],
    correct: 'High-energy particles (mostly protons) from outside the solar system',
    funFact: 'Cosmic rays travel near the speed of light and come from supernovae, AGN, and other violent events. The most energetic ones have more energy than a baseball pitch.',
  },
  {
    question: 'What is the Gaia mission?',
    options: ['A Greek mythology study', 'ESA spacecraft mapping a billion stars in the Milky Way with unprecedented precision', 'A climate satellite', 'A Mars rover'],
    correct: 'ESA spacecraft mapping a billion stars in the Milky Way with unprecedented precision',
    funFact: 'Gaia has measured positions, distances, and motions of nearly 2 billion stars — revolutionizing our understanding of the Milky Way\'s structure and history.',
  },
  {
    question: 'What is the Zone of Avoidance?',
    options: ['A dangerous area in space', 'Region of sky obscured by the Milky Way\'s disk making it hard to observe distant galaxies', 'A black hole\'s edge', 'Astronaut restricted zone'],
    correct: 'Region of sky obscured by the Milky Way\'s disk making it hard to observe distant galaxies',
    funFact: 'The Zone of Avoidance covers about 20% of the sky. Radio and infrared observations can partially penetrate it, revealing hidden galaxies and structures.',
  },
  {
    question: 'What is precession of the equinoxes?',
    options: ['Equinoxes happening earlier each year', 'The slow wobble of Earth\'s axis over a 26,000-year cycle', 'The Sun moving faster', 'Constellations changing shape'],
    correct: 'The slow wobble of Earth\'s axis over a 26,000-year cycle',
    funFact: 'Earth\'s axis traces a circle in the sky over 26,000 years. Polaris wasn\'t always the North Star — in 3000 BCE it was Thuban, and in 14,000 years it will be Vega.',
  },
  {
    question: 'What is a T Tauri star?',
    options: ['A type of red giant', 'A young pre-main sequence star still contracting before nuclear fusion begins', 'A dead star', 'An ancient star'],
    correct: 'A young pre-main sequence star still contracting before nuclear fusion begins',
    funFact: 'T Tauri stars are less than 10 million years old, still surrounded by protoplanetary disks. They are variable in brightness and often have strong stellar winds.',
  },
  {
    question: 'What is the Schwarzschild radius?',
    options: ['Size of a star', 'The radius of the event horizon of a non-rotating black hole', 'Distance to the nearest black hole', 'A telescope mirror size'],
    correct: 'The radius of the event horizon of a non-rotating black hole',
    funFact: 'For any mass, the Schwarzschild radius is how compact it must be to become a black hole. For Earth, it would be about 9 mm; for the Sun, about 3 km.',
  },
  {
    question: 'What is a blazar?',
    options: ['A very hot star', 'An AGN with its jet pointed directly at Earth', 'A type of supernova', 'A space heater'],
    correct: 'An AGN with its jet pointed directly at Earth',
    funFact: 'Blazars appear extremely bright and variable because we\'re looking straight down the relativistic jet of an active galactic nucleus. They\'re among the most energetic phenomena.',
  },
  {
    question: 'What are Herbig-Haro objects?',
    options: ['Types of asteroids', 'Bright patches of nebulosity caused by jets from newborn stars hitting surrounding gas', 'Old star remnants', 'Galaxy types'],
    correct: 'Bright patches of nebulosity caused by jets from newborn stars hitting surrounding gas',
    funFact: 'HH objects are found near star-forming regions. They glow as supersonic jets from protostars slam into nearby gas at speeds of 100-1000 km/s, lasting only thousands of years.',
  },
  {
    question: 'What is the stellar main sequence lifetime relationship?',
    options: ['All stars live the same time', 'More massive stars live much shorter lives', 'Smaller stars die faster', 'Only size matters'],
    correct: 'More massive stars live much shorter lives',
    funFact: 'A star\'s lifetime is roughly proportional to M/L (mass/luminosity). A 10-solar-mass star lives only ~20 million years, while a 0.1-solar-mass star can live trillions of years.',
  },
  {
    question: 'What is the cosmic noon?',
    options: ['When the Sun is highest', 'The era when star formation in the universe peaked (about 10 billion years ago)', 'High noon on Mars', 'The center of the universe'],
    correct: 'The era when star formation in the universe peaked (about 10 billion years ago)',
    funFact: 'About 3-4 billion years after the Big Bang, galaxies were forming stars at rates 10 times higher than today. JWST is revealing unprecedented details of this era.',
  },
  {
    question: 'What is the Eddington luminosity?',
    options: ['A light bulb measurement', 'Maximum luminosity a star can have before radiation pressure blows away its outer layers', 'Minimum star brightness', 'Telescope sensitivity'],
    correct: 'Maximum luminosity a star can have before radiation pressure blows away its outer layers',
    funFact: 'The Eddington limit balances radiation pressure outward against gravitational pull inward. Stars exceeding it lose mass rapidly, setting an upper limit on star luminosity.',
  },
  {
    question: 'What is astrometry?',
    options: ['Astrology', 'The precise measurement of star positions and motions', 'Astronomy for beginners', 'Measuring asteroids'],
    correct: 'The precise measurement of star positions and motions',
    funFact: 'Astrometry is one of the oldest branches of astronomy. ESA\'s Gaia mission has revolutionized it, measuring star positions to micro-arcsecond precision.',
  },
  {
    question: 'What is the heliopause?',
    options: ['The Sun pausing', 'The boundary where the solar wind meets interstellar medium', 'A solar eclipse', 'The Sun\'s equator'],
    correct: 'The boundary where the solar wind meets interstellar medium',
    funFact: 'Voyager 1 crossed the heliopause in 2012 at about 121 AU. Beyond it, particles from other stars dominate — marking the edge of the Sun\'s influence.',
  },
  {
    question: 'What is a fast radio burst (FRB)?',
    options: ['Quick radio broadcast', 'A millisecond-duration pulse of radio energy from a distant source', 'A radar signal', 'Radio interference'],
    correct: 'A millisecond-duration pulse of radio energy from a distant source',
    funFact: 'FRBs release as much energy in milliseconds as the Sun does in 3 days. First detected in 2007, their exact origin is debated — magnetars are a leading candidate.',
  },
  {
    question: 'What is the CMB Cold Spot?',
    options: ['A cold area on Earth', 'An unexpectedly large cold region in the cosmic microwave background', 'A telescope error', 'A frozen comet'],
    correct: 'An unexpectedly large cold region in the cosmic microwave background',
    funFact: 'The CMB Cold Spot spans about 5° and is 70 microKelvins colder than average. Its origin is debated — it may be a supervoid or a statistical fluke.',
  },
  {
    question: 'What is the epoch of reionization?',
    options: ['A sci-fi concept', 'When the first stars and galaxies ionized the neutral hydrogen in the early universe', 'When Earth formed', 'A calendar era'],
    correct: 'When the first stars and galaxies ionized the neutral hydrogen in the early universe',
    funFact: 'During the "cosmic dawn" (100-800 million years after the Big Bang), the first stars\' UV light gradually ionized the opaque hydrogen fog, making the universe transparent.',
  },
  {
    question: 'What is multi-messenger astronomy?',
    options: ['Sending multiple messages to space', 'Observing cosmic events using different signals: light, gravitational waves, neutrinos, cosmic rays', 'Multiple astronomers observing', 'Sending rovers to multiple planets'],
    correct: 'Observing cosmic events using different signals: light, gravitational waves, neutrinos, cosmic rays',
    funFact: 'The 2017 neutron star merger was observed in gravitational waves (LIGO) AND light (70+ telescopes) — opening a new era of multi-messenger astronomy.',
  },
  // ─── Zodiac Constellations & Stars (Batch 2) ──────────────
  {
    question: 'What is the brightest star in Leo?',
    options: ['Denebola', 'Regulus', 'Algieba', 'Zosma'],
    correct: 'Regulus',
    funFact: 'Regulus means "little king" in Latin. It\'s a quadruple star system located on the ecliptic, so it\'s frequently occulted by the Moon.',
  },
  {
    question: 'Which zodiac constellation is the largest by sky area?',
    options: ['Scorpius', 'Leo', 'Virgo', 'Aquarius'],
    correct: 'Virgo',
    funFact: 'Virgo covers 1,294 square degrees, making it the largest zodiac constellation and second-largest constellation overall after Hydra.',
  },
  {
    question: 'What is the brightest star in Scorpius?',
    options: ['Shaula', 'Antares', 'Dschubba', 'Sargas'],
    correct: 'Antares',
    funFact: 'Antares means "rival of Mars" because its red color resembles Mars. It\'s a red supergiant about 700 times the Sun\'s diameter.',
  },
  {
    question: 'Which constellation contains Aldebaran?',
    options: ['Aries', 'Taurus', 'Gemini', 'Capricornus'],
    correct: 'Taurus',
    funFact: 'Aldebaran appears as the "eye of the bull" in Taurus. It\'s an orange giant about 65 light-years away and 44 times the Sun\'s diameter.',
  },
  {
    question: 'What is the brightest star in Gemini?',
    options: ['Castor', 'Pollux', 'Alhena', 'Mebsuta'],
    correct: 'Pollux',
    funFact: 'Pollux is an orange giant 34 light-years away with a confirmed exoplanet. Despite being Beta Geminorum, it\'s brighter than Alpha (Castor).',
  },
  {
    question: 'Which zodiac constellation is the smallest by area?',
    options: ['Aries', 'Cancer', 'Libra', 'Capricornus'],
    correct: 'Cancer',
    funFact: 'Cancer covers only 506 square degrees with no stars brighter than magnitude 3.5, making it one of the hardest zodiac constellations to spot.',
  },
  {
    question: 'What is the brightest star in Sagittarius?',
    options: ['Kaus Australis', 'Nunki', 'Ascella', 'Kaus Media'],
    correct: 'Kaus Australis',
    funFact: 'Kaus Australis (Epsilon Sagittarii) marks the base of the Teapot asterism. The Milky Way\'s center lies in the direction of Sagittarius.',
  },
  {
    question: 'Which star is Virgo\'s brightest?',
    options: ['Porrima', 'Spica', 'Vindemiatrix', 'Zaniah'],
    correct: 'Spica',
    funFact: 'Spica is a spectroscopic binary about 250 light-years away. Its blue-white color makes it the 16th brightest star at magnitude 0.97.',
  },
  {
    question: 'What is the brightest star in Aries?',
    options: ['Sheratan', 'Hamal', 'Mesarthim', '41 Arietis'],
    correct: 'Hamal',
    funFact: 'Hamal means "the head of the ram" in Arabic. Around 2000 BCE it marked the vernal equinox, giving Aries prominence in the zodiac.',
  },
  {
    question: 'What is the brightest star in Capricornus?',
    options: ['Deneb Algedi', 'Dabih', 'Nashira', 'Algedi'],
    correct: 'Deneb Algedi',
    funFact: 'Deneb Algedi (Delta Capricorni) means "the tail of the goat." It\'s an eclipsing binary star about 39 light-years away.',
  },
  {
    question: 'What is the brightest star in Pisces?',
    options: ['Eta Piscium', 'Alrescha', 'Fum al Samakah', 'Torcularis Septentrionalis'],
    correct: 'Eta Piscium',
    funFact: 'Pisces has no bright stars — its brightest, Eta Piscium, is only magnitude 3.6. This makes the constellation very difficult to see from light-polluted areas.',
  },
  {
    question: 'What is the brightest star in Libra?',
    options: ['Zubeneschamali', 'Zubenelgenubi', 'Brachium', 'Zubenelhakrabi'],
    correct: 'Zubeneschamali',
    funFact: 'Zubeneschamali (Beta Librae) is reportedly one of the few stars that appear greenish to some observers, though this is debated among astronomers.',
  },
  // ─── Messier Objects (Batch 2) ────────────────────────────
  {
    question: 'What is Messier 1 (the Crab Nebula)?',
    options: ['A galaxy', 'A supernova remnant with a pulsar', 'An open cluster', 'A planetary nebula'],
    correct: 'A supernova remnant with a pulsar',
    funFact: 'M1 is the remnant of a supernova recorded by Chinese astronomers in 1054 AD. Its pulsar spins 30 times per second, powering the nebula\'s eerie glow.',
  },
  {
    question: 'What is Messier 31?',
    options: ['Whirlpool Galaxy', 'Triangulum Galaxy', 'Andromeda Galaxy', 'Sombrero Galaxy'],
    correct: 'Andromeda Galaxy',
    funFact: 'M31 is the nearest large galaxy at 2.5 million light-years. It\'s approaching us at 110 km/s and will merge with the Milky Way in ~4.5 billion years.',
  },
  {
    question: 'What is Messier 42?',
    options: ['Lagoon Nebula', 'Eagle Nebula', 'Orion Nebula', 'Ring Nebula'],
    correct: 'Orion Nebula',
    funFact: 'M42 is the brightest nebula visible to the naked eye at 1,344 light-years away. It\'s a stellar nursery forming hundreds of new stars.',
  },
  {
    question: 'What is Messier 51 commonly called?',
    options: ['Pinwheel Galaxy', 'Whirlpool Galaxy', 'Sunflower Galaxy', 'Tadpole Galaxy'],
    correct: 'Whirlpool Galaxy',
    funFact: 'M51 was the first galaxy classified as a spiral. It\'s interacting with companion NGC 5195 visible at one arm\'s end, about 23 million light-years away.',
  },
  {
    question: 'What is Messier 104?',
    options: ['Pinwheel Galaxy', 'Sombrero Galaxy', 'Cartwheel Galaxy', 'Cigar Galaxy'],
    correct: 'Sombrero Galaxy',
    funFact: 'M104\'s large central bulge and prominent dust lane make it resemble a Mexican sombrero hat. It\'s about 29 million light-years away in Virgo.',
  },
  {
    question: 'What is Messier 13 in Hercules?',
    options: ['A nebula', 'The Great Globular Cluster', 'A supernova remnant', 'An open cluster'],
    correct: 'The Great Globular Cluster',
    funFact: 'M13 packs ~300,000 stars into a sphere 145 light-years across. The 1974 Arecibo message was beamed toward M13 as an interstellar communication attempt.',
  },
  {
    question: 'What is Messier 57?',
    options: ['Crab Nebula', 'Ring Nebula', 'Owl Nebula', 'Dumbbell Nebula'],
    correct: 'Ring Nebula',
    funFact: 'The Ring Nebula in Lyra is a planetary nebula — a shell of gas from a dying star. It\'s about 2,300 light-years away and looks like a cosmic donut.',
  },
  {
    question: 'What is Messier 27?',
    options: ['Ring Nebula', 'Dumbbell Nebula', 'Owl Nebula', 'Cat\'s Eye Nebula'],
    correct: 'Dumbbell Nebula',
    funFact: 'M27 was the first planetary nebula ever discovered (1764). Its dumbbell shape comes from viewing an hourglass-shaped shell from the side.',
  },
  {
    question: 'What type of object is Messier 87?',
    options: ['Spiral galaxy', 'Giant elliptical galaxy', 'Nebula', 'Globular cluster'],
    correct: 'Giant elliptical galaxy',
    funFact: 'M87\'s supermassive black hole (6.5 billion solar masses) was the first ever directly imaged by the Event Horizon Telescope in 2019.',
  },
  {
    question: 'What is Messier 8 (Lagoon Nebula)?',
    options: ['A galaxy', 'An emission nebula and star-forming region', 'A globular cluster', 'A planetary nebula'],
    correct: 'An emission nebula and star-forming region',
    funFact: 'The Lagoon Nebula in Sagittarius is visible to the naked eye. At 4,100 light-years away, it contains a young open cluster called NGC 6530.',
  },
  // ─── Famous Observatories (Batch 2) ───────────────────────
  {
    question: 'On which mountain are many world-class telescopes in Hawaii?',
    options: ['Mauna Loa', 'Mauna Kea', 'Haleakalā', 'Diamond Head'],
    correct: 'Mauna Kea',
    funFact: 'Mauna Kea at 4,205m hosts 13 telescopes from 11 countries. Its summit is above 40% of Earth\'s atmosphere with extremely dry, stable air.',
  },
  {
    question: 'What is the Extremely Large Telescope (ELT)?',
    options: ['An orbiting telescope', 'A 39m optical telescope under construction in Chile', 'A radio telescope in China', 'NASA\'s next mission'],
    correct: 'A 39m optical telescope under construction in Chile',
    funFact: 'ESO\'s ELT will have 798 hexagonal mirror segments forming a 39.3m primary mirror. It will gather 13x more light than any current optical telescope.',
  },
  {
    question: 'What did the Arecibo telescope primarily study?',
    options: ['Visible light', 'Radio waves from space', 'X-rays', 'Infrared radiation'],
    correct: 'Radio waves from space',
    funFact: 'Arecibo was used for SETI, planetary radar, pulsar studies, and gravitational wave evidence. Its collapse in 2020 was a major loss for radio astronomy.',
  },
  {
    question: 'Where is the Atacama Large Millimeter Array (ALMA)?',
    options: ['Hawaii', 'Chile', 'Spain', 'South Africa'],
    correct: 'Chile',
    funFact: 'ALMA sits at 5,058m elevation in the Atacama Desert — one of the driest places on Earth. Its 66 antennas observe in millimeter/submillimeter wavelengths.',
  },
  {
    question: 'What is the Very Large Array (VLA)?',
    options: ['A space station', 'A radio telescope with 27 antennas in New Mexico', 'A satellite constellation', 'An optical telescope'],
    correct: 'A radio telescope with 27 antennas in New Mexico',
    funFact: 'The VLA\'s 27 dishes each 25m across can be spread up to 36 km apart, working together as one telescope. It\'s been featured in the movie "Contact."',
  },
  {
    question: 'What is the Keck Observatory?',
    options: ['A radio telescope', 'Twin 10m optical telescopes on Mauna Kea', 'A space telescope', 'An underground detector'],
    correct: 'Twin 10m optical telescopes on Mauna Kea',
    funFact: 'Each Keck telescope uses 36 hexagonal mirror segments working as one 10m mirror. They can be combined for interferometry with 85m effective resolution.',
  },
  // ─── Astrophysics Concepts (Batch 2) ──────────────────────
  {
    question: 'What does redshift indicate about a galaxy?',
    options: ['Getting brighter', 'Moving away from us', 'Heating up', 'About to explode'],
    correct: 'Moving away from us',
    funFact: 'Redshift stretches light to longer wavelengths as objects recede. The most distant observed galaxies have redshifts exceeding z=10.',
  },
  {
    question: 'What is gravitational lensing?',
    options: ['A lens in space', 'Gravity bending light from distant objects', 'How telescopes focus', 'A type of mirror'],
    correct: 'Gravity bending light from distant objects',
    funFact: 'Massive galaxy clusters can magnify and distort distant background galaxies into arcs and rings, letting us see objects otherwise too faint to detect.',
  },
  {
    question: 'What is the Cosmic Microwave Background (CMB)?',
    options: ['Radio static', 'Leftover radiation from the Big Bang', 'Microwave from stars', 'Human radio interference'],
    correct: 'Leftover radiation from the Big Bang',
    funFact: 'The CMB fills all space at 2.725K. Tiny temperature variations map the density fluctuations that seeded all galaxies, clusters, and large-scale structure.',
  },
  {
    question: 'What is dark matter?',
    options: ['Anti-matter', 'Invisible matter detected only by gravity', 'Black holes', 'Dust clouds'],
    correct: 'Invisible matter detected only by gravity',
    funFact: 'Dark matter is ~27% of the universe. Galaxy rotation curves, gravitational lensing, and CMB measurements all independently require it to exist.',
  },
  {
    question: 'What is dark energy?',
    options: ['Black hole radiation', 'Force causing accelerating cosmic expansion', 'Dark matter\'s energy', 'Antimatter annihilation'],
    correct: 'Force causing accelerating cosmic expansion',
    funFact: 'Dark energy is ~68% of the universe\'s content. Discovered in 1998 from Type Ia supernovae, it makes the universe expand faster over time.',
  },
  {
    question: 'What is the Hubble constant?',
    options: ['A telescope setting', 'Rate of universal expansion (km/s/Mpc)', 'Distance to Andromeda', 'Age of the Sun'],
    correct: 'Rate of universal expansion (km/s/Mpc)',
    funFact: 'H₀ is about 70 km/s/Mpc. The "Hubble tension" — different methods giving different values — is one of modern cosmology\'s biggest puzzles.',
  },
  {
    question: 'What is stellar parallax used for?',
    options: ['Measuring star temperature', 'Measuring distance to nearby stars', 'Finding exoplanets', 'Determining star age'],
    correct: 'Measuring distance to nearby stars',
    funFact: 'As Earth orbits the Sun, nearby stars appear to shift against distant backgrounds. One parsec (3.26 ly) is the distance at which parallax is 1 arcsecond.',
  },
  {
    question: 'What is a Cepheid variable?',
    options: ['A dying star', 'A pulsating star with period linked to luminosity', 'A binary', 'A type of nova'],
    correct: 'A pulsating star with period linked to luminosity',
    funFact: 'Henrietta Leavitt discovered the period-luminosity relation in 1908. It allowed Edwin Hubble to measure distances to other galaxies for the first time.',
  },
  {
    question: 'What is a Type Ia supernova?',
    options: ['Core collapse of massive star', 'White dwarf exceeding Chandrasekhar limit', 'Neutron star merger', 'Gamma-ray burst'],
    correct: 'White dwarf exceeding Chandrasekhar limit',
    funFact: 'Type Ia supernovae reach similar peak brightness regardless of distance, making them "standardizable candles" for measuring cosmic expansion.',
  },
  {
    question: 'What is the Hertzsprung-Russell diagram?',
    options: ['Star map', 'Plot of luminosity vs temperature showing stellar evolution', 'Galaxy catalog', 'Planet finder chart'],
    correct: 'Plot of luminosity vs temperature showing stellar evolution',
    funFact: 'The H-R diagram shows most stars on the "main sequence" diagonal band. A star\'s position reveals its mass, age, and evolutionary stage.',
  },
  {
    question: 'What is the Chandrasekhar limit?',
    options: ['Speed limit in space', 'Max white dwarf mass (~1.4 solar masses)', 'Telescope resolution limit', 'Black hole size'],
    correct: 'Max white dwarf mass (~1.4 solar masses)',
    funFact: 'Subrahmanyan Chandrasekhar calculated this in 1930 at age 19. Above this limit, gravity overwhelms electron degeneracy pressure.',
  },
  // ─── Space Weather & Solar (Batch 2) ──────────────────────
  {
    question: 'What are solar flares?',
    options: ['Sunspots', 'Sudden intense bursts of electromagnetic radiation from the Sun', 'Solar eclipses', 'Prominences'],
    correct: 'Sudden intense bursts of electromagnetic radiation from the Sun',
    funFact: 'Solar flares can release energy equivalent to millions of nuclear bombs in minutes. X-class flares can disrupt radio communications and GPS on Earth.',
  },
  {
    question: 'What is the Carrington Event?',
    options: ['First telescope use', 'Most powerful recorded geomagnetic storm (1859)', 'Moon landing', 'Comet impact'],
    correct: 'Most powerful recorded geomagnetic storm (1859)',
    funFact: 'The Carrington Event caused auroras visible near the equator and set telegraph wires on fire. A repeat today could cause $1-2 trillion in infrastructure damage.',
  },
  {
    question: 'What causes auroras?',
    options: ['Moonlight', 'Solar particles hitting atmospheric gases along magnetic field lines', 'Volcanoes', 'Reflected city lights'],
    correct: 'Solar particles hitting atmospheric gases along magnetic field lines',
    funFact: 'Green auroras come from oxygen at ~100km altitude, red from oxygen above 200km, and blue/purple from nitrogen. They occur in oval bands around the magnetic poles.',
  },
  {
    question: 'How long is a solar cycle?',
    options: ['1 year', '5 years', '~11 years', '50 years'],
    correct: '~11 years',
    funFact: 'During solar maximum, sunspots, flares, and CMEs are far more frequent. The Sun\'s magnetic poles flip every cycle, so the full magnetic cycle is ~22 years.',
  },
  {
    question: 'What is the solar wind?',
    options: ['Wind on the Sun\'s surface', 'A stream of charged particles flowing from the Sun', 'Solar radiation pressure', 'Light from the Sun'],
    correct: 'A stream of charged particles flowing from the Sun',
    funFact: 'The solar wind travels at 300-800 km/s, carrying about 1 million tons of matter per second. It inflates a bubble (heliosphere) protecting us from interstellar radiation.',
  },
  // ─── Light Pollution & Observing (Batch 2) ────────────────
  {
    question: 'What is the Bortle Dark-Sky Scale?',
    options: ['Temperature scale', 'A 1-9 scale of night sky brightness', 'Star magnitude system', 'Telescope quality rating'],
    correct: 'A 1-9 scale of night sky brightness',
    funFact: 'Bortle 1 means pristine dark sky with zodiacal light visible; Bortle 9 means inner-city where only the Moon, planets, and a few bright stars are visible.',
  },
  {
    question: 'What is a Dark Sky Reserve?',
    options: ['A black hole', 'A protected area with minimal artificial light', 'Space without stars', 'Dark matter research area'],
    correct: 'A protected area with minimal artificial light',
    funFact: 'The IDA certifies Dark Sky Places worldwide. NamibRand in Namibia and Aoraki Mackenzie in New Zealand are among the darkest certified reserves.',
  },
  {
    question: 'Why are observatories built on mountain tops?',
    options: ['Closer to stars', 'Above much atmospheric turbulence, moisture, and light pollution', 'Better internet', 'Fewer earthquakes'],
    correct: 'Above much atmospheric turbulence, moisture, and light pollution',
    funFact: 'At high altitude, there\'s less atmosphere to distort starlight ("seeing"), less water vapor absorbing infrared, and usually less nearby human development.',
  },
  // ─── Radio Astronomy & Techniques ─────────────────────────
  {
    question: 'What did Karl Jansky discover in 1932?',
    options: ['A new planet', 'Radio waves coming from the Milky Way', 'X-rays from the Sun', 'Cosmic rays'],
    correct: 'Radio waves coming from the Milky Way',
    funFact: 'Working at Bell Labs on radio static, Jansky found a persistent signal peaking every 23h56m — matching a sidereal day — proving it came from the galaxy\'s center.',
  },
  {
    question: 'What is interferometry in astronomy?',
    options: ['Using one giant mirror', 'Combining signals from multiple telescopes for higher resolution', 'Interfering with satellite signals', 'Blocking light'],
    correct: 'Combining signals from multiple telescopes for higher resolution',
    funFact: 'VLBI (Very Long Baseline Interferometry) combines radio telescopes across continents, achieving resolution equivalent to a telescope the size of Earth.',
  },
  {
    question: 'What are Fast Radio Bursts (FRBs)?',
    options: ['Phone signals', 'Millisecond radio pulses from deep space of unknown origin', 'Satellite pings', 'Lightning on Jupiter'],
    correct: 'Millisecond radio pulses from deep space of unknown origin',
    funFact: 'First detected in 2007, FRBs release incredible energy in milliseconds. Magnetars are a leading candidate source after one was caught producing an FRB in our own galaxy in 2020.',
  },
  {
    question: 'What is adaptive optics?',
    options: ['A camera setting', 'Technology that corrects atmospheric distortion in real time', 'A space telescope feature', 'A type of lens'],
    correct: 'Technology that corrects atmospheric distortion in real time',
    funFact: 'Adaptive optics uses deformable mirrors that change shape hundreds of times per second to counteract atmospheric turbulence, giving ground telescopes space-like sharpness.',
  },
  {
    question: 'What is spectroscopy used for in astronomy?',
    options: ['Taking pretty pictures', 'Analyzing light to determine composition, temperature, and motion', 'Counting stars', 'Measuring time'],
    correct: 'Analyzing light to determine composition, temperature, and motion',
    funFact: 'By splitting starlight into a spectrum, astronomers can identify elements, measure temperatures, determine velocities via Doppler shift, and detect magnetic fields.',
  },
  // ─── Astrobiology & Exoplanets ────────────────────────────
  {
    question: 'What is the Drake Equation?',
    options: ['How to fly to stars', 'Formula estimating number of communicative civilizations', 'Distance calculation', 'Rocket fuel equation'],
    correct: 'Formula estimating number of communicative civilizations',
    funFact: 'N = R* × fp × ne × fl × fi × fc × L. Even with conservative estimates, the equation suggests we shouldn\'t be alone — hence the Fermi Paradox.',
  },
  {
    question: 'What is the transit method for finding exoplanets?',
    options: ['Directly photographing them', 'Detecting the slight dimming when a planet crosses in front of its star', 'Measuring star wobble', 'Using radar'],
    correct: 'Detecting the slight dimming when a planet crosses in front of its star',
    funFact: 'NASA\'s Kepler spacecraft discovered over 2,600 exoplanets using the transit method. The dimming is typically less than 1% — just 0.01% for an Earth-sized planet around a Sun-like star.',
  },
  {
    question: 'What is the radial velocity method?',
    options: ['Measuring planet temperature', 'Detecting star wobble caused by orbiting planet\'s gravity', 'Photographing directly', 'Timing pulsar signals'],
    correct: 'Detecting star wobble caused by orbiting planet\'s gravity',
    funFact: 'A planet\'s gravity makes its star wobble. This Doppler shift method found the first exoplanet around a Sun-like star (51 Pegasi b) in 1995, winning the 2019 Nobel Prize.',
  },
  {
    question: 'What is the "Wow! Signal"?',
    options: ['Confirmed alien message', 'Unexplained strong radio signal from 1977', 'A pulsar discovery', 'Voyager transmission'],
    correct: 'Unexplained strong radio signal from 1977',
    funFact: 'The 72-second signal from Sagittarius matched what an alien transmission might look like. Jerry Ehman wrote "Wow!" on the printout. It was never detected again.',
  },
  {
    question: 'How many exoplanets have been confirmed (approximately)?',
    options: ['About 500', 'About 2,000', 'Over 5,500', 'Over 50,000'],
    correct: 'Over 5,500',
    funFact: 'Over 5,500 exoplanets have been confirmed as of 2024, with thousands more candidates. They range from hot Jupiters to rocky super-Earths in habitable zones.',
  },
  // ─── Additional Core Topics ───────────────────────────────
  {
    question: 'What is a quasar?',
    options: ['A type of star', 'An extremely luminous active galactic nucleus powered by a supermassive black hole', 'A small galaxy', 'A dying nebula'],
    correct: 'An extremely luminous active galactic nucleus powered by a supermassive black hole',
    funFact: 'Quasars can outshine their entire host galaxy by 100x. They\'re visible across billions of light-years, making them beacons of the early universe.',
  },
  {
    question: 'What is a pulsar?',
    options: ['A pulsating galaxy', 'A rapidly rotating neutron star emitting beams of radiation', 'A variable star', 'A radio station'],
    correct: 'A rapidly rotating neutron star emitting beams of radiation',
    funFact: 'The fastest pulsar spins 716 times per second. When first discovered in 1967 by Jocelyn Bell Burnell, the regular signals were jokingly called "LGM-1" (Little Green Men).',
  },
  {
    question: 'What is the event horizon of a black hole?',
    options: ['Its surface', 'The boundary beyond which nothing can escape', 'Its center', 'Its atmosphere'],
    correct: 'The boundary beyond which nothing can escape',
    funFact: 'At the event horizon, escape velocity equals light speed. The Event Horizon Telescope imaged M87\'s black hole shadow in 2019, confirming general relativity predictions.',
  },
  {
    question: 'What is a planetary nebula?',
    options: ['Where planets form', 'Gas shell expelled by a dying Sun-like star', 'A nebula shaped like planets', 'A gas giant\'s atmosphere'],
    correct: 'Gas shell expelled by a dying Sun-like star',
    funFact: 'Despite the name, they have nothing to do with planets. Herschel named them because they looked round like planet disks through early telescopes.',
  },
  {
    question: 'What is the main sequence?',
    options: ['A movie sequence', 'The band on the H-R diagram where stars spend most of their lives fusing hydrogen', 'A telescope lineup', 'Star ordering by age'],
    correct: 'The band on the H-R diagram where stars spend most of their lives fusing hydrogen',
    funFact: 'About 90% of stars are on the main sequence at any given time. More massive stars burn hotter and bluer but die much sooner — a million years vs billions.',
  },
  {
    question: 'What is the observable universe\'s approximate diameter?',
    options: ['13.8 billion light-years', '46 billion light-years', '93 billion light-years', '200 billion light-years'],
    correct: '93 billion light-years',
    funFact: 'Though the universe is 13.8 Gyr old, expansion means the observable universe is 93 Gly across. Space itself expanded while the oldest light was traveling to us.',
  },
  {
    question: 'How old is the universe?',
    options: ['4.6 billion years', '10 billion years', '13.8 billion years', '20 billion years'],
    correct: '13.8 billion years',
    funFact: 'Measured from the CMB, expansion rate, and oldest stars. JWST is finding surprisingly mature galaxies in the early universe, refining our understanding.',
  },
  {
    question: 'What is a galaxy cluster?',
    options: ['A group of stars', 'Hundreds to thousands of galaxies bound by gravity', 'A nebula type', 'A constellation'],
    correct: 'Hundreds to thousands of galaxies bound by gravity',
    funFact: 'Galaxy clusters are the largest gravitationally bound structures. The Virgo Cluster (our nearest large one) contains ~2,000 galaxies and its gravity pulls on us.',
  },
  {
    question: 'What is the Local Group?',
    options: ['Nearby stars', 'The galaxy group containing the Milky Way, Andromeda, and ~80 other galaxies', 'A constellation group', 'Amateur astronomy club'],
    correct: 'The galaxy group containing the Milky Way, Andromeda, and ~80 other galaxies',
    funFact: 'The Local Group spans about 10 million light-years. The Milky Way and Andromeda are its dominant members, with dozens of smaller dwarf galaxies.',
  },
  {
    question: 'What is a white dwarf?',
    options: ['A small bright star fusing hydrogen', 'The hot dense remnant core of a dead Sun-like star', 'A young star', 'A neutron star'],
    correct: 'The hot dense remnant core of a dead Sun-like star',
    funFact: 'White dwarfs are Earth-sized but with mass comparable to the Sun. They slowly cool over billions of years. Sirius B is the most famous white dwarf.',
  },
  {
    question: 'What is a red giant?',
    options: ['A large cold planet', 'An evolved star that has expanded enormously after exhausting core hydrogen', 'A type of nebula', 'A dying galaxy'],
    correct: 'An evolved star that has expanded enormously after exhausting core hydrogen',
    funFact: 'When our Sun becomes a red giant in ~5 billion years, it will expand past Mars\'s orbit. Betelgeuse in Orion is a famous red supergiant that could explode soon.',
  },
  {
    question: 'What is the Milky Way\'s central supermassive black hole called?',
    options: ['Cygnus A', 'Sagittarius A*', 'M87*', 'Centaurus A'],
    correct: 'Sagittarius A*',
    funFact: 'Sgr A* has a mass of about 4 million Suns. Stars have been tracked orbiting it at thousands of km/s. It was directly imaged by the EHT in 2022.',
  },
  {
    question: 'What is a supernova?',
    options: ['A very bright star', 'The explosive death of a massive star or white dwarf', 'A new star forming', 'A fast-moving comet'],
    correct: 'The explosive death of a massive star or white dwarf',
    funFact: 'Supernovae briefly outshine entire galaxies and forge elements heavier than iron. Nearly all elements in your body were created in ancient supernovae.',
  },
  {
    question: 'What is a gamma-ray burst (GRB)?',
    options: ['Gamma radiation from nuclear plants', 'The most energetic explosions in the universe', 'Radiation from the Sun', 'A type of laser'],
    correct: 'The most energetic explosions in the universe',
    funFact: 'Long GRBs come from massive star deaths; short GRBs from neutron star mergers. A nearby GRB aimed at Earth could strip the ozone layer, but the odds are astronomically small.',
  },
  {
    question: 'What is the Roche limit?',
    options: ['Telescope focus limit', 'Minimum distance before tidal forces disintegrate a moon', 'Speed of light in vacuum', 'Maximum orbit height'],
    correct: 'Minimum distance before tidal forces disintegrate a moon',
    funFact: 'Saturn\'s rings exist within its Roche limit — any large moon that enters this zone gets torn apart by differential gravitational forces.',
  },
  {
    question: 'What is the cosmic web?',
    options: ['The internet', 'Large-scale structure of universe with filaments and voids', 'Spider-shaped nebulae', 'A theory'],
    correct: 'Large-scale structure of universe with filaments and voids',
    funFact: 'Galaxies cluster along filaments surrounding vast empty voids, forming a foam-like structure. The largest structures span billions of light-years.',
  },
  {
    question: 'What is a neutron star made of?',
    options: ['Neutrons', 'Iron', 'Hydrogen', 'Dark matter'],
    correct: 'Neutrons',
    funFact: 'In neutron stars, protons and electrons are crushed together forming neutrons. A teaspoon would weigh ~6 billion tons. They\'re typically only 20 km across.',
  },
  {
    question: 'What is the largest known structure in the universe?',
    options: ['Milky Way', 'Virgo Supercluster', 'Hercules-Corona Borealis Great Wall', 'Andromeda Galaxy'],
    correct: 'Hercules-Corona Borealis Great Wall',
    funFact: 'This structure spans about 10 billion light-years, discovered in 2013 from gamma-ray burst distribution. It challenges the cosmological principle of large-scale uniformity.',
  },
  // ─── Additional Astronomy (Batch 3 - to reach 300+) ──────
  {
    question: 'What is a brown dwarf?',
    options: ['A small galaxy', 'A substellar object too small to sustain hydrogen fusion', 'A dead star', 'A type of asteroid'],
    correct: 'A substellar object too small to sustain hydrogen fusion',
    funFact: 'Brown dwarfs are between 13-80 Jupiter masses — too large to be planets but too small to be stars. They glow faintly from gravitational contraction and deuterium fusion.',
  },
  {
    question: 'What is the Jeans mass?',
    options: ['Mass of clothing in space', 'Minimum mass for a gas cloud to collapse under gravity', 'Weight of an astronaut', 'Planet mass limit'],
    correct: 'Minimum mass for a gas cloud to collapse under gravity',
    funFact: 'Named after James Jeans, it depends on temperature and density. Below the Jeans mass, gas pressure resists collapse; above it, gravity wins and star formation begins.',
  },
  {
    question: 'What is the Lyman-alpha forest?',
    options: ['Trees in space', 'Absorption lines in quasar spectra from intergalactic hydrogen', 'A star cluster', 'A planetary system'],
    correct: 'Absorption lines in quasar spectra from intergalactic hydrogen',
    funFact: 'Quasar light passing through clouds of intergalactic hydrogen creates many absorption lines, mapping the distribution of matter across billions of light-years.',
  },
  {
    question: 'What is a nova?',
    options: ['A star death', 'A white dwarf experiencing a thermonuclear explosion on its surface', 'A new star forming', 'A galaxy collision'],
    correct: 'A white dwarf experiencing a thermonuclear explosion on its surface',
    funFact: 'Unlike supernovae, novae don\'t destroy the star. Hydrogen from a companion accumulates and ignites. The same system can produce multiple novae over time.',
  },
  {
    question: 'What is the interstellar medium (ISM)?',
    options: ['Space between galaxies', 'The gas and dust filling space between stars', 'A communication method', 'Dark matter'],
    correct: 'The gas and dust filling space between stars',
    funFact: 'The ISM is mostly hydrogen (90%) and helium (10%) with traces of heavier elements and dust. It contains about 10-15% of the Milky Way\'s visible mass.',
  },
  {
    question: 'What is a protoplanetary disk?',
    options: ['A frisbee in space', 'A disk of gas and dust around a young star where planets form', 'A galaxy type', 'A computer model'],
    correct: 'A disk of gas and dust around a young star where planets form',
    funFact: 'ALMA has directly imaged protoplanetary disks showing gaps and rings where planets are forming. Our solar system began as such a disk 4.6 billion years ago.',
  },
  {
    question: 'What is the Oort Cloud?',
    options: ['A nebula', 'A theoretical sphere of icy bodies at the edge of the solar system', 'A galaxy', 'A dust storm on Mars'],
    correct: 'A theoretical sphere of icy bodies at the edge of the solar system',
    funFact: 'The Oort Cloud may extend up to 100,000 AU (1.6 light-years). Long-period comets originate here when gravitationally disturbed by passing stars.',
  },
  {
    question: 'What is synchrotron radiation?',
    options: ['Normal starlight', 'Radiation from charged particles spiraling in magnetic fields', 'Microwave from ovens', 'Thermal radiation'],
    correct: 'Radiation from charged particles spiraling in magnetic fields',
    funFact: 'Electrons moving at near-light speed in magnetic fields emit synchrotron radiation. It\'s detected from pulsars, active galaxies, and supernova remnants across the electromagnetic spectrum.',
  },
  {
    question: 'What is a Seyfert galaxy?',
    options: ['A dead galaxy', 'A spiral galaxy with an unusually bright active nucleus', 'A dwarf galaxy', 'A colliding pair of galaxies'],
    correct: 'A spiral galaxy with an unusually bright active nucleus',
    funFact: 'Seyfert galaxies are "active galaxies" with bright cores powered by supermassive black holes accreting matter. About 10% of all galaxies are Seyferts.',
  },
  {
    question: 'What is baryonic matter?',
    options: ['Dark matter', 'Ordinary matter made of protons, neutrons, and electrons', 'Antimatter', 'Exotic particles'],
    correct: 'Ordinary matter made of protons, neutrons, and electrons',
    funFact: 'Baryonic matter is everything we can directly observe — stars, planets, gas, dust, and us. But it\'s only about 5% of the universe. The rest is dark matter and dark energy.',
  },
  {
    question: 'What is the Sagittarius Dwarf Galaxy?',
    options: ['A distant quasar', 'A small galaxy being consumed by the Milky Way', 'A star cluster', 'A nebula in Sagittarius'],
    correct: 'A small galaxy being consumed by the Milky Way',
    funFact: 'The Sagittarius Dwarf is being tidally disrupted and absorbed by our galaxy. Its stars are being stripped into streams wrapped around the Milky Way.',
  },
  {
    question: 'What is a Wolf-Rayet star?',
    options: ['A cool red star', 'A very hot massive star shedding its outer layers in fierce stellar winds', 'A white dwarf', 'A binary star'],
    correct: 'A very hot massive star shedding its outer layers in fierce stellar winds',
    funFact: 'Wolf-Rayet stars have surface temperatures of 30,000-200,000K and lose mass at incredible rates. They\'re massive stars in a late evolutionary stage before going supernova.',
  },
  {
    question: 'What is Olbers\' Paradox?',
    options: ['Why space is cold', 'Why the night sky is dark if the universe has infinite stars', 'Why planets orbit', 'How gravity works'],
    correct: 'Why the night sky is dark if the universe has infinite stars',
    funFact: 'In an infinite, eternal, static universe, every line of sight should end at a star, making the sky uniformly bright. The answer: the universe is finite in age and expanding.',
  },
  {
    question: 'What is a kilonova?',
    options: ['A weak supernova', 'The bright explosion from merging neutron stars', 'A new star birth', 'A galaxy collision'],
    correct: 'The bright explosion from merging neutron stars',
    funFact: 'Kilonovae produce heavy elements like gold, platinum, and uranium through r-process nucleosynthesis. The 2017 detection (GW170817) confirmed neutron star mergers create most heavy elements.',
  },
  {
    question: 'What is a T Tauri star?',
    options: ['An old star', 'A very young star still contracting before reaching the main sequence', 'A dead star', 'A binary system'],
    correct: 'A very young star still contracting before reaching the main sequence',
    funFact: 'T Tauri stars are less than 10 million years old, still collapsing from their parent cloud. They\'re highly variable and often surrounded by protoplanetary disks.',
  },
  {
    question: 'What is the Tully-Fisher relation?',
    options: ['A telescope design', 'Correlation between a spiral galaxy\'s rotation speed and luminosity', 'A distance formula', 'A star catalog method'],
    correct: 'Correlation between a spiral galaxy\'s rotation speed and luminosity',
    funFact: 'Brighter spiral galaxies rotate faster. By measuring rotation via Doppler shift and comparing to apparent brightness, astronomers determine galaxy distances.',
  },
  {
    question: 'What is a barred spiral galaxy?',
    options: ['A galaxy with a legal restriction', 'A spiral galaxy with a bar-shaped concentration of stars through its center', 'A blocked galaxy', 'A dead galaxy'],
    correct: 'A spiral galaxy with a bar-shaped concentration of stars through its center',
    funFact: 'About 2/3 of spiral galaxies have bars, including the Milky Way. Bars funnel gas toward the center, potentially feeding the central black hole and triggering star formation.',
  },
  {
    question: 'What is the Great Attractor?',
    options: ['A black hole', 'A gravitational anomaly pulling galaxies in our region of space', 'The Sun\'s gravity', 'A distant quasar'],
    correct: 'A gravitational anomaly pulling galaxies in our region of space',
    funFact: 'Located behind the Milky Way\'s galactic plane (hidden from view), the Great Attractor has the mass of 1,000 trillion Suns and is pulling our galaxy toward it.',
  },
  {
    question: 'What is spectral classification of stars (OBAFGKM)?',
    options: ['Random letters', 'Classification by surface temperature from hottest to coolest', 'Star naming system', 'Discovery order'],
    correct: 'Classification by surface temperature from hottest to coolest',
    funFact: 'Remembered as "Oh Be A Fine Girl/Guy, Kiss Me." O stars are >30,000K (blue), M stars are <3,500K (red). Our Sun is G-type at 5,778K (yellow-white).',
  },
  {
    question: 'What is the Sunyaev-Zel\'dovich effect?',
    options: ['A star wobble', 'CMB photons gaining energy passing through hot galaxy cluster gas', 'A telescope artifact', 'Gravity lensing'],
    correct: 'CMB photons gaining energy passing through hot galaxy cluster gas',
    funFact: 'Hot electrons in galaxy clusters scatter CMB photons to higher energies (inverse Compton). This creates a "shadow" in the CMB, helping map the largest structures in the universe.',
  },
  {
    question: 'What is a planetary transit?',
    options: ['A planet moving', 'A planet passing in front of its star as seen from Earth', 'A space bus', 'Planets aligning'],
    correct: 'A planet passing in front of its star as seen from Earth',
    funFact: 'Transits cause tiny dips in starlight (typically <1%). Kepler found over 2,600 exoplanets this way. TESS is now surveying the nearest and brightest stars.',
  },
  {
    question: 'What is the Gaia spacecraft doing?',
    options: ['Visiting planets', 'Mapping positions and motions of nearly 2 billion stars', 'Studying dark matter', 'Landing on asteroids'],
    correct: 'Mapping positions and motions of nearly 2 billion stars',
    funFact: 'ESA\'s Gaia is creating the most precise 3D map of the Milky Way ever. Its data has revolutionized our understanding of the galaxy\'s structure, history, and future.',
  },
  {
    question: 'What is the cosmic noon?',
    options: ['When the Sun is highest', 'The era when star formation in the universe peaked (~10 billion years ago)', 'Midday on Mars', 'A theoretical time'],
    correct: 'The era when star formation in the universe peaked (~10 billion years ago)',
    funFact: 'At redshift z~2 (about 10 billion years ago), the universe was forming stars at roughly 10x the current rate. JWST is studying this era in unprecedented detail.',
  },
  {
    question: 'What is a gravitational wave detector?',
    options: ['A seismometer', 'An instrument using laser interferometry to detect spacetime ripples', 'A radio telescope', 'A particle accelerator'],
    correct: 'An instrument using laser interferometry to detect spacetime ripples',
    funFact: 'LIGO and Virgo use kilometer-scale laser arms to detect length changes smaller than a proton. They\'ve detected dozens of black hole and neutron star mergers since 2015.',
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
      <div className="h-full bg-gradient-to-r from-secondary to-cyan-300 rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
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
export default function AstronomyQuizPage() {
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
    const saved = localStorage.getItem('astro-quiz-best')
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
        localStorage.setItem('astro-quiz-best', String(score))
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
    const text = `I scored ${correctCount}/10 on the DateAndTimezone Astronomy Basics quiz! Can you beat me? https://www.dateandtimezone.com/quiz/astronomy`
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/20 border border-secondary/30 mb-6">
              <Telescope className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-cyan-300 bg-clip-text text-transparent">
              Astronomy Basics
            </h1>
            <p className="text-muted text-lg max-w-md mx-auto">
              Stars, constellations, and the cosmos. 15 questions to test your knowledge of the universe.
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
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${timerMode === 'timed' ? 'bg-secondary/20 border border-secondary/50 text-cyan-300' : 'border border-card-border text-muted hover:text-white'}`}
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
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timerSeconds === s ? 'bg-secondary text-white' : 'border border-card-border text-muted hover:text-white'}`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary to-cyan-300 hover:from-secondary-hover hover:to-cyan-400 font-heading font-semibold text-gray-900 text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Telescope className="w-5 h-5" />
            Start Quiz (10 random questions)
          </button>

          <div className="mt-8 p-6 rounded-xl bg-card-bg border border-card-border">
            <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              How to Play
            </h3>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">1.</span>Each question has 4 answer options</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">2.</span>You have 10 seconds per question</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">3.</span>Answer within 5 seconds for a speed bonus (+2)</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">4.</span>Discover fascinating astronomy facts after each answer!</li>
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
              let btnStyle = 'bg-card-bg border-card-border hover:border-secondary/50 hover:bg-secondary/10'
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-cyan-300 mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2">{correctCount}/10</h1>
          <p className="text-muted text-lg">
            {correctCount >= 9 ? 'Astronomy Genius!' : correctCount >= 7 ? 'Great job!' : correctCount >= 5 ? 'Not bad!' : 'Keep looking up!'}
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
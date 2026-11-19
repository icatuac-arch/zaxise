'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Rocket, Trophy, Zap, RotateCcw, Share2,
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
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correct: 'Jupiter',
    funFact: 'Jupiter is so large that over 1,300 Earths could fit inside it! Its Great Red Spot alone is bigger than Earth.',
  },
  {
    question: 'Who was the first human in space?',
    options: ['Neil Armstrong', 'Yuri Gagarin', 'John Glenn', 'Alan Shepard'],
    correct: 'Yuri Gagarin',
    funFact: 'Yuri Gagarin orbited Earth on April 12, 1961, aboard Vostok 1. The flight lasted only 108 minutes.',
  },
  {
    question: 'What year did Apollo 11 land on the Moon?',
    options: ['1967', '1969', '1971', '1965'],
    correct: '1969',
    funFact: 'Neil Armstrong and Buzz Aldrin spent about 2.5 hours walking on the Moon on July 20, 1969.',
  },
  {
    question: 'How many planets are in our solar system?',
    options: ['7', '8', '9', '10'],
    correct: '8',
    funFact: 'Pluto was reclassified as a "dwarf planet" by the International Astronomical Union in 2006.',
  },
  {
    question: 'What is the closest star to Earth?',
    options: ['Proxima Centauri', 'The Sun', 'Sirius', 'Alpha Centauri A'],
    correct: 'The Sun',
    funFact: 'The Sun is about 93 million miles (150 million km) away. Proxima Centauri is the closest star after the Sun, at 4.24 light-years.',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correct: 'Mars',
    funFact: 'Mars appears red because its surface is covered in iron oxide (rust). It has the largest volcano in the solar system: Olympus Mons.',
  },
  {
    question: 'What does ISS stand for?',
    options: ['International Space Station', 'Interstellar Space System', 'International Satellite Station', 'Integrated Space Structure'],
    correct: 'International Space Station',
    funFact: 'The ISS orbits Earth at about 17,500 mph (28,000 km/h), completing one orbit every 90 minutes!',
  },
  {
    question: 'Who was the first woman in space?',
    options: ['Sally Ride', 'Valentina Tereshkova', 'Mae Jemison', 'Peggy Whitson'],
    correct: 'Valentina Tereshkova',
    funFact: 'Valentina Tereshkova flew on Vostok 6 in June 1963, 20 years before the first American woman (Sally Ride) reached space.',
  },
  {
    question: 'How long does light from the Sun take to reach Earth?',
    options: ['~4 minutes', '~8 minutes', '~12 minutes', '~1 minute'],
    correct: '~8 minutes',
    funFact: 'It takes about 8 minutes and 20 seconds for sunlight to travel the ~93 million miles to Earth.',
  },
  {
    question: 'What is the hottest planet in our solar system?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correct: 'Venus',
    funFact: 'Despite being farther from the Sun than Mercury, Venus is hotter (~900\u00b0F/475\u00b0C) due to its thick CO2 atmosphere creating a runaway greenhouse effect.',
  },
  {
    question: 'Which planet has the most moons?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correct: 'Saturn',
    funFact: 'As of 2023, Saturn holds the record with 146 known moons, surpassing Jupiter\'s 95. New moons are still being discovered!',
  },
  {
    question: 'What year was Sputnik launched?',
    options: ['1955', '1957', '1960', '1962'],
    correct: '1957',
    funFact: 'Sputnik 1 was launched by the Soviet Union on October 4, 1957. It was only 23 inches (58 cm) in diameter and orbited for 3 months.',
  },
  {
    question: 'What is a light-year?',
    options: ['Time light takes to orbit Earth', 'Distance light travels in one year', 'Speed of light per second', 'Brightness unit for stars'],
    correct: 'Distance light travels in one year',
    funFact: 'One light-year is about 5.88 trillion miles (9.46 trillion km). The Milky Way is about 100,000 light-years across!',
  },
  {
    question: 'Who was the last person to walk on the Moon?',
    options: ['Buzz Aldrin', 'Eugene Cernan', 'Harrison Schmitt', 'Alan Bean'],
    correct: 'Eugene Cernan',
    funFact: 'Eugene Cernan walked on the Moon during Apollo 17 in December 1972. No human has returned since.',
  },
  {
    question: "What is the name of NASA's most powerful space telescope?",
    options: ['Hubble', 'James Webb', 'Spitzer', 'Kepler'],
    correct: 'James Webb',
    funFact: 'The James Webb Space Telescope launched in December 2021 and orbits the Sun 1 million miles from Earth at the L2 point.',
  },
  {
    question: 'What is the Great Red Spot on Jupiter?',
    options: ['A volcano', 'A massive storm', 'An impact crater', 'A magnetic anomaly'],
    correct: 'A massive storm',
    funFact: 'The Great Red Spot is a storm that has been raging for at least 350 years. It\'s large enough to fit two to three Earths inside it.',
  },
  {
    question: 'Which planet rotates on its side?',
    options: ['Neptune', 'Saturn', 'Uranus', 'Venus'],
    correct: 'Uranus',
    funFact: 'Uranus has an axial tilt of about 98 degrees, likely caused by a collision with an Earth-sized object billions of years ago.',
  },
  {
    question: 'What is the Kuiper Belt?',
    options: ['A ring around Saturn', 'Asteroid belt between Mars and Jupiter', 'Region of icy bodies beyond Neptune', 'A radiation zone around Earth'],
    correct: 'Region of icy bodies beyond Neptune',
    funFact: 'The Kuiper Belt extends from about 30 to 55 AU from the Sun. Pluto, Eris, and Makemake are all Kuiper Belt objects.',
  },
  {
    question: 'Which spacecraft was the first to leave the solar system?',
    options: ['Pioneer 10', 'Voyager 1', 'Voyager 2', 'New Horizons'],
    correct: 'Voyager 1',
    funFact: 'Voyager 1 entered interstellar space in August 2012. Launched in 1977, it\'s now over 15 billion miles from Earth and still sending data.',
  },
  {
    question: 'What fuel do most rockets use during launch?',
    options: ['Nuclear energy', 'Liquid hydrogen and oxygen', 'Gasoline', 'Solar energy'],
    correct: 'Liquid hydrogen and oxygen',
    funFact: 'Liquid hydrogen is the most efficient chemical rocket fuel. When combined with liquid oxygen, it produces water vapor as exhaust.',
  },
  {
    question: 'What is the speed of light?',
    options: ['~186,000 miles per second', '~100,000 miles per second', '~250,000 miles per second', '~500,000 miles per second'],
    correct: '~186,000 miles per second',
    funFact: 'Light travels at exactly 299,792,458 meters per second (about 186,282 miles per second). Nothing with mass can reach this speed.',
  },
  {
    question: 'Which planet has the shortest day?',
    options: ['Mercury', 'Mars', 'Jupiter', 'Earth'],
    correct: 'Jupiter',
    funFact: 'Jupiter completes one rotation in just about 10 hours, despite being the largest planet. This rapid spin causes it to bulge at the equator.',
  },
  {
    question: 'What is a black hole?',
    options: ['A hole in space', 'A region where gravity is so strong nothing can escape', 'A dead star', 'An empty region of space'],
    correct: 'A region where gravity is so strong nothing can escape',
    funFact: 'The boundary of a black hole is called the event horizon. Once anything crosses it, not even light can escape the gravitational pull.',
  },
  {
    question: 'Who founded SpaceX?',
    options: ['Jeff Bezos', 'Elon Musk', 'Richard Branson', 'Robert Zubrin'],
    correct: 'Elon Musk',
    funFact: 'SpaceX was founded in 2002 with the goal of reducing space travel costs. In 2020, it became the first private company to send astronauts to the ISS.',
  },
  {
    question: 'What is the name of Mars\' largest moon?',
    options: ['Deimos', 'Phobos', 'Europa', 'Titan'],
    correct: 'Phobos',
    funFact: 'Phobos orbits so close to Mars that it will eventually be torn apart by tidal forces in about 50 million years, forming a ring around Mars.',
  },
  {
    question: 'How many space shuttles did NASA build for spaceflight?',
    options: ['3', '4', '5', '6'],
    correct: '5',
    funFact: 'NASA built 5 space shuttles: Columbia, Challenger, Discovery, Atlantis, and Endeavour. Tragically, Columbia and Challenger were lost in accidents.',
  },
  {
    question: 'What is the farthest planet from the Sun?',
    options: ['Pluto', 'Neptune', 'Uranus', 'Saturn'],
    correct: 'Neptune',
    funFact: 'Neptune is about 2.8 billion miles from the Sun. It takes 165 Earth years to complete one orbit. It was first observed in 1846.',
  },
  {
    question: 'What does the Hubble Space Telescope orbit?',
    options: ['The Sun', 'The Moon', 'Earth', 'Mars'],
    correct: 'Earth',
    funFact: 'Hubble orbits Earth at about 340 miles (547 km) altitude, completing one orbit every 95 minutes. It has been operating since 1990.',
  },
  {
    question: 'What is the asteroid belt?',
    options: ['A ring around Earth', 'Debris between Mars and Jupiter', 'Objects beyond Pluto', 'Meteorites entering our atmosphere'],
    correct: 'Debris between Mars and Jupiter',
    funFact: 'Despite what movies show, the asteroid belt is mostly empty space. If you flew through it, you\'d be unlikely to hit anything.',
  },
  {
    question: 'What planet is famous for its rings?',
    options: ['Jupiter', 'Uranus', 'Neptune', 'Saturn'],
    correct: 'Saturn',
    funFact: 'Saturn\'s rings are made of ice and rock ranging from tiny grains to house-sized chunks. The rings are only about 30 feet thick in most places!',
  },
  {
    question: 'What was the first animal sent into orbit?',
    options: ['A chimpanzee', 'A dog named Laika', 'A cat named Félicette', 'A monkey named Albert'],
    correct: 'A dog named Laika',
    funFact: 'Laika was a stray dog from Moscow who flew on Sputnik 2 in 1957. Sadly, she did not survive the mission, but paved the way for human spaceflight.',
  },
  {
    question: 'What is the escape velocity from Earth?',
    options: ['~7 km/s', '~11.2 km/s', '~25 km/s', '~3 km/s'],
    correct: '~11.2 km/s',
    funFact: 'To escape Earth\'s gravity without further propulsion, you need to reach 11.2 km/s (about 25,000 mph). This is called escape velocity.',
  },
  {
    question: 'Which space station came before the ISS?',
    options: ['Skylab', 'Mir', 'Tiangong', 'Salyut'],
    correct: 'Mir',
    funFact: 'The Soviet/Russian space station Mir operated from 1986 to 2001. It was the first modular space station and held the record for longest continuous human presence in space.',
  },
  {
    question: 'What is the name of the rover that landed on Mars in 2021?',
    options: ['Curiosity', 'Opportunity', 'Perseverance', 'Spirit'],
    correct: 'Perseverance',
    funFact: 'Perseverance landed in Jezero Crater and carries Ingenuity, the first helicopter to fly on another planet. It\'s also collecting samples for future return to Earth.',
  },
  {
    question: 'What causes a comet\'s tail?',
    options: ['Gravity pulling debris behind it', 'Solar wind and radiation pushing material away', 'Friction with space dust', 'Magnetic fields in space'],
    correct: 'Solar wind and radiation pushing material away',
    funFact: 'A comet\'s tail always points away from the Sun, not behind the comet. Comets actually have two tails: a dust tail and an ion tail.',
  },
  {
    question: 'What is the Chandrasekhar limit?',
    options: ['Maximum speed of a spacecraft', 'Maximum mass of a white dwarf star (~1.4 solar masses)', 'Minimum size of a black hole', 'Maximum age of a star'],
    correct: 'Maximum mass of a white dwarf star (~1.4 solar masses)',
    funFact: 'Above this limit (~1.4 times the Sun\'s mass), a white dwarf will collapse into a neutron star or trigger a Type Ia supernova explosion.',
  },
  {
    question: 'Which moon in our solar system is most likely to harbor life?',
    options: ['Titan', 'Europa', 'Ganymede', 'Io'],
    correct: 'Europa',
    funFact: 'Europa, a moon of Jupiter, has a subsurface ocean beneath its icy crust containing more water than all of Earth\'s oceans combined.',
  },
  {
    question: 'What is the Karman line?',
    options: ['Edge of the solar system', 'Boundary between Earth\'s atmosphere and space (100 km)', 'Orbit of the ISS', 'Limit of radio communication'],
    correct: 'Boundary between Earth\'s atmosphere and space (100 km)',
    funFact: 'The Karman line at 100 km (62 miles) altitude is the internationally recognized boundary of space. Above it, aerodynamic flight becomes impossible.',
  },
  {
    question: 'What does "LEO" stand for in space terminology?',
    options: ['Light Emission Orbit', 'Low Earth Orbit', 'Lunar Exploration Operations', 'Launch Entry Operations'],
    correct: 'Low Earth Orbit',
    funFact: 'Low Earth Orbit ranges from about 160 to 2,000 km altitude. The ISS, Hubble, and most satellites operate in LEO.',
  },
  {
    question: 'What is the largest volcano in the solar system?',
    options: ['Mauna Kea on Earth', 'Olympus Mons on Mars', 'Tvashtar on Io', 'Maxwell Montes on Venus'],
    correct: 'Olympus Mons on Mars',
    funFact: 'Olympus Mons is about 72,000 feet (21.9 km) tall — nearly 2.5 times the height of Mount Everest — and covers an area the size of Arizona.',
  },
  {
    question: 'What is a geosynchronous orbit?',
    options: ['An orbit that matches Earth\'s rotation (24h period)', 'An orbit around the Sun', 'The lowest possible orbit', 'An orbit that passes over both poles'],
    correct: 'An orbit that matches Earth\'s rotation (24h period)',
    funFact: 'Geosynchronous orbit is at 35,786 km altitude. Geostationary orbits (a special case over the equator) make satellites appear stationary in the sky.',
  },
  {
    question: 'What was the first space station?',
    options: ['Skylab', 'Salyut 1', 'Mir', 'ISS'],
    correct: 'Salyut 1',
    funFact: 'The Soviet Union launched Salyut 1 on April 19, 1971. Its first crew tragically died during re-entry due to a cabin depressurization.',
  },
  {
    question: 'What was the name of the first Mars rover?',
    options: ['Spirit', 'Sojourner', 'Opportunity', 'Curiosity'],
    correct: 'Sojourner',
    funFact: 'Sojourner landed on Mars on July 4, 1997, as part of the Pathfinder mission. It was only the size of a microwave oven and operated for 83 days.',
  },
  {
    question: 'How long does it take to travel to Mars?',
    options: ['~3 months', '~7 months', '~12 months', '~2 years'],
    correct: '~7 months',
    funFact: 'The journey to Mars takes about 7 months using current propulsion technology. The exact time depends on the relative positions of Earth and Mars in their orbits.',
  },
  {
    question: 'What is the Artemis program?',
    options: ['NASA plan to return humans to the Moon', 'European Mars mission', 'SpaceX satellite network', 'Chinese space station program'],
    correct: 'NASA plan to return humans to the Moon',
    funFact: 'Artemis aims to land the first woman and first person of color on the Moon. It will establish a sustainable presence as a stepping stone to Mars.',
  },
  {
    question: 'What is the Space Launch System (SLS)?',
    options: ['SpaceX rocket', 'NASA\'s most powerful rocket ever built', 'Russian cargo vehicle', 'Blue Origin launcher'],
    correct: 'NASA\'s most powerful rocket ever built',
    funFact: 'The SLS produces 8.8 million pounds of thrust at launch, exceeding even the Saturn V. It first flew successfully on the Artemis I mission in November 2022.',
  },
  {
    question: 'What was the Hubble Space Telescope\'s main mirror flaw?',
    options: ['It was too small', 'It was ground to the wrong shape (spherical aberration)', 'It cracked during launch', 'It was the wrong material'],
    correct: 'It was ground to the wrong shape (spherical aberration)',
    funFact: 'Hubble\'s mirror was off by just 2.2 micrometers (1/50th the width of a human hair), but it blurred all images. Corrective optics were installed in 1993.',
  },
  {
    question: 'What is the Falcon Heavy?',
    options: ['NASA\'s Moon rocket', 'SpaceX\'s heavy-lift rocket', 'Blue Origin spacecraft', 'Russian cargo ship'],
    correct: 'SpaceX\'s heavy-lift rocket',
    funFact: 'Falcon Heavy first launched in February 2018 carrying a Tesla Roadster into orbit around the Sun. It can lift 64 metric tons to low Earth orbit.',
  },
  {
    question: 'What is the James Webb Space Telescope\'s primary mirror made of?',
    options: ['Glass', 'Gold-coated beryllium', 'Aluminum', 'Silicon carbide'],
    correct: 'Gold-coated beryllium',
    funFact: 'JWST\'s 18 hexagonal mirror segments are made of beryllium coated with a thin layer of gold, which is excellent at reflecting infrared light.',
  },
  {
    question: 'What was the Challenger disaster caused by?',
    options: ['Engine failure', 'O-ring failure in solid rocket booster', 'Heat shield damage', 'Fuel leak'],
    correct: 'O-ring failure in solid rocket booster',
    funFact: 'On January 28, 1986, cold temperatures caused an O-ring seal to fail 73 seconds after launch. All 7 crew members were killed, including teacher Christa McAuliffe.',
  },
  {
    question: 'What is the Starship spacecraft?',
    options: ['NASA deep space probe', 'SpaceX fully reusable super heavy-lift launch vehicle', 'ESA Mars orbiter', 'ISS replacement'],
    correct: 'SpaceX fully reusable super heavy-lift launch vehicle',
    funFact: 'Starship is the largest and most powerful rocket ever built, standing 121 meters tall. It is designed to carry 100+ tons to orbit and eventually transport humans to Mars.',
  },
  {
    question: 'What is orbital velocity for Low Earth Orbit?',
    options: ['~5 km/s', '~7.8 km/s', '~11 km/s', '~15 km/s'],
    correct: '~7.8 km/s',
    funFact: 'To stay in Low Earth Orbit, a spacecraft must travel at about 7.8 km/s (17,500 mph). Any slower and gravity pulls it back to Earth.',
  },
  {
    question: 'What is the Van Allen radiation belt?',
    options: ['A dust ring around Earth', 'Zones of trapped charged particles around Earth', 'A belt of asteroids', 'Radiation from the Sun'],
    correct: 'Zones of trapped charged particles around Earth',
    funFact: 'The Van Allen belts were discovered in 1958 by Explorer 1. They consist of energetic protons and electrons trapped by Earth\'s magnetic field.',
  },
  {
    question: 'Which planet has the longest day?',
    options: ['Mercury', 'Venus', 'Jupiter', 'Mars'],
    correct: 'Venus',
    funFact: 'Venus takes 243 Earth days to rotate once on its axis — longer than its year (225 days). It also rotates backwards compared to most planets.',
  },
  {
    question: 'What was Apollo 13 famous for?',
    options: ['First Moon landing', 'A successful failure — crew survived after oxygen tank explosion', 'Longest Moon walk', 'First space station docking'],
    correct: 'A successful failure — crew survived after oxygen tank explosion',
    funFact: 'On April 13, 1970, an oxygen tank exploded en route to the Moon. The crew used the Lunar Module as a lifeboat and returned safely after 4 harrowing days.',
  },
  {
    question: 'What is a Hohmann transfer orbit?',
    options: ['Orbit around two stars', 'Most fuel-efficient path between two orbits', 'Orbit that passes through an asteroid belt', 'An escape trajectory from the solar system'],
    correct: 'Most fuel-efficient path between two orbits',
    funFact: 'A Hohmann transfer uses two engine burns to move between orbits. It\'s the most fuel-efficient method but takes longer than direct transfers.',
  },
  {
    question: 'What is the Tiangong space station?',
    options: ['India\'s planned station', 'China\'s operational space station', 'Japan\'s orbiting laboratory', 'Private commercial station'],
    correct: 'China\'s operational space station',
    funFact: 'Tiangong (meaning "Heavenly Palace") became fully operational in 2022. It has three modules and hosts rotating crews of three Chinese astronauts (taikonauts).',
  },
  {
    question: 'What was the first reusable orbital spacecraft?',
    options: ['SpaceX Dragon', 'Space Shuttle', 'Buran', 'X-37B'],
    correct: 'Space Shuttle',
    funFact: 'NASA\'s Space Shuttle first flew in 1981 and made 135 missions before retiring in 2011. It could carry up to 7 crew and deploy/retrieve satellites.',
  },
  {
    question: 'What is the Lagrange point L2?',
    options: ['A point between Earth and Moon', 'A point 1.5 million km from Earth away from the Sun', 'The center of the solar system', 'A point on the Moon\'s far side'],
    correct: 'A point 1.5 million km from Earth away from the Sun',
    funFact: 'L2 is where the gravitational pull of Earth and Sun balance with centrifugal force. JWST orbits here because it provides a stable, cold environment for observations.',
  },
  {
    question: 'What is the New Horizons mission?',
    options: ['Mars sample return', 'First spacecraft to fly past Pluto', 'Venus atmospheric probe', 'Asteroid mining mission'],
    correct: 'First spacecraft to fly past Pluto',
    funFact: 'New Horizons flew past Pluto on July 14, 2015, after a 9.5-year journey. It revealed Pluto has mountains, glaciers, and a heart-shaped nitrogen ice plain.',
  },
  {
    question: 'What rocket launched the Apollo missions?',
    options: ['Atlas V', 'Saturn V', 'Delta IV', 'Titan III'],
    correct: 'Saturn V',
    funFact: 'The Saturn V remains the tallest, heaviest, and most powerful rocket ever brought to operational status. It stood 363 feet tall and generated 7.5 million pounds of thrust.',
  },
  {
    question: 'What is the Drake Equation?',
    options: ['Formula for rocket trajectory', 'Estimate of communicative civilizations in our galaxy', 'Calculation of star distances', 'Formula for black hole mass'],
    correct: 'Estimate of communicative civilizations in our galaxy',
    funFact: 'Proposed by Frank Drake in 1961, the equation multiplies factors like star formation rate, fraction with planets, and lifespan of civilizations to estimate alien life.',
  },
  {
    question: 'What is the Cassini-Huygens mission?',
    options: ['Mars rover mission', 'Saturn orbiter and Titan lander', 'Jupiter flyby', 'Mercury orbiter'],
    correct: 'Saturn orbiter and Titan lander',
    funFact: 'Cassini orbited Saturn for 13 years (2004-2017) and the Huygens probe landed on Titan in 2005, revealing lakes of liquid methane and ethane on its surface.',
  },
  {
    question: 'What is the Fermi Paradox?',
    options: ['Why atoms are mostly empty space', 'The contradiction between high probability of alien life and lack of evidence', 'Why light has a speed limit', 'Why the universe is expanding'],
    correct: 'The contradiction between high probability of alien life and lack of evidence',
    funFact: 'Named after physicist Enrico Fermi who asked "Where is everybody?" Given billions of stars older than our Sun, advanced civilizations should exist — but we see no evidence.',
  },
  {
    question: 'What is the Juno spacecraft studying?',
    options: ['Mars', 'Jupiter', 'Saturn', 'The Sun'],
    correct: 'Jupiter',
    funFact: 'Juno arrived at Jupiter in 2016 and has revealed that Jupiter\'s atmosphere extends much deeper than expected, with cyclones at the poles and a surprisingly complex magnetic field.',
  },
  {
    question: 'What is the Oort Cloud?',
    options: ['An interstellar gas cloud', 'A theoretical shell of icy objects surrounding the solar system', 'A cloud on Neptune', 'Debris from the Big Bang'],
    correct: 'A theoretical shell of icy objects surrounding the solar system',
    funFact: 'The Oort Cloud may contain trillions of icy bodies extending up to 100,000 AU from the Sun. Long-period comets are thought to originate there.',
  },
  {
    question: 'What is space debris (space junk)?',
    options: ['Asteroids near Earth', 'Non-functional human-made objects in orbit', 'Cosmic dust', 'Meteorites'],
    correct: 'Non-functional human-made objects in orbit',
    funFact: 'There are over 36,000 tracked pieces of space debris larger than 10 cm in orbit. Even a 1 cm piece can be catastrophic at orbital speeds of 7+ km/s.',
  },
  {
    question: 'What is the Parker Solar Probe?',
    options: ['A telescope pointed at the Sun', 'A spacecraft flying through the Sun\'s corona', 'A solar panel experiment', 'A satellite monitoring solar storms'],
    correct: 'A spacecraft flying through the Sun\'s corona',
    funFact: 'Launched in 2018, Parker Solar Probe is the fastest human-made object ever, reaching speeds over 430,000 mph. It flies within 3.8 million miles of the Sun\'s surface.',
  },
  {
    question: 'What is the Voyager Golden Record?',
    options: ['A music album about space', 'A phonograph record on Voyager spacecraft with sounds and images of Earth', 'NASA\'s achievement log', 'A space-themed vinyl record'],
    correct: 'A phonograph record on Voyager spacecraft with sounds and images of Earth',
    funFact: 'The Golden Record contains greetings in 55 languages, music from Beethoven to Chuck Berry, natural sounds, and 116 images representing life on Earth.',
  },
  {
    question: 'What is the Kessler Syndrome?',
    options: ['A disease from space travel', 'A cascade of collisions making orbit unusable due to debris', 'Loss of bone density in space', 'Communication blackout during re-entry'],
    correct: 'A cascade of collisions making orbit unusable due to debris',
    funFact: 'Proposed by NASA scientist Donald Kessler in 1978, this scenario describes how one collision creates fragments that cause more collisions in a dangerous chain reaction.',
  },
  {
    question: 'What is the farthest human-made object from Earth?',
    options: ['Pioneer 10', 'Voyager 1', 'Voyager 2', 'New Horizons'],
    correct: 'Voyager 1',
    funFact: 'Voyager 1 is over 15 billion miles from Earth in interstellar space. Its radio signals take over 22 hours to reach us, traveling at the speed of light.',
  },
  {
    question: 'What is the International Space Station\'s altitude?',
    options: ['~200 km', '~408 km', '~800 km', '~1,200 km'],
    correct: '~408 km',
    funFact: 'The ISS orbits at approximately 408 km (254 miles) altitude. It occasionally needs reboost maneuvers because atmospheric drag slowly lowers its orbit.',
  },
  {
    question: 'What is the OSIRIS-REx mission?',
    options: ['Mars rover', 'Asteroid sample return mission', 'Jupiter probe', 'Solar observatory'],
    correct: 'Asteroid sample return mission',
    funFact: 'OSIRIS-REx collected samples from asteroid Bennu and returned them to Earth in September 2023 — the largest asteroid sample ever brought to Earth by a spacecraft.',
  },
  {
    question: 'What is a solar sail?',
    options: ['A type of solar panel', 'A propulsion method using pressure from sunlight', 'A sunshade for spacecraft', 'A device to collect solar wind'],
    correct: 'A propulsion method using pressure from sunlight',
    funFact: 'Solar sails use the tiny pressure of photons hitting a large reflective surface. Japan\'s IKAROS was the first successful solar sail in interplanetary space (2010).',
  },
  {
    question: 'What is the DART mission?',
    options: ['Deep-space radio telescope', 'NASA\'s first planetary defense test to redirect an asteroid', 'Mars sample return', 'Dark matter detection experiment'],
    correct: 'NASA\'s first planetary defense test to redirect an asteroid',
    funFact: 'In September 2022, DART deliberately crashed into asteroid moonlet Dimorphos, successfully changing its orbit by 33 minutes — proving we could deflect a threatening asteroid.',
  },
  {
    question: 'How many countries have independently launched humans into space?',
    options: ['2', '3', '4', '5'],
    correct: '3',
    funFact: 'Only Russia (1961), the USA (1961), and China (2003) have independently launched humans into space using their own rockets and spacecraft.',
  },
  {
    question: 'What is the Ingenuity helicopter?',
    options: ['A drone on the Moon', 'The first aircraft to fly on another planet (Mars)', 'A helicopter delivering supplies to the ISS', 'An aerial drone for Venus'],
    correct: 'The first aircraft to fly on another planet (Mars)',
    funFact: 'Ingenuity made its first flight on Mars on April 19, 2021. Originally designed for 5 flights, it completed 72 flights before retiring in January 2024.',
  },
  {
    question: 'What is the cosmic speed limit?',
    options: ['Speed of sound', 'Speed of light in a vacuum', 'Escape velocity of the Milky Way', 'Speed of the fastest star'],
    correct: 'Speed of light in a vacuum',
    funFact: 'Nothing with mass can reach the speed of light (299,792,458 m/s). As objects approach this speed, their mass effectively increases, requiring infinite energy to accelerate further.',
  },
  {
    question: 'What is the largest moon in the solar system?',
    options: ['Titan', 'Ganymede', 'Europa', 'Callisto'],
    correct: 'Ganymede',
    funFact: 'Ganymede, a moon of Jupiter, is larger than the planet Mercury with a diameter of 5,268 km. It\'s the only moon with its own magnetic field.',
  },
  {
    question: 'What was the first satellite launched by the United States?',
    options: ['Vanguard 1', 'Explorer 1', 'TIROS-1', 'Echo 1'],
    correct: 'Explorer 1',
    funFact: 'Explorer 1 launched on January 31, 1958, four months after Sputnik. It discovered the Van Allen radiation belts, making it a major scientific achievement.',
  },
  {
    question: 'What is the average temperature in space?',
    options: ['0°C', '-18°C', '-270.45°C (2.7 Kelvin)', '-100°C'],
    correct: '-270.45°C (2.7 Kelvin)',
    funFact: 'The cosmic microwave background radiation gives empty space an average temperature of 2.7 Kelvin (-270.45°C), just above absolute zero.',
  },
  {
    question: 'What is a gravity assist (slingshot maneuver)?',
    options: ['Using a planet\'s gravity to accelerate a spacecraft', 'Artificial gravity in space stations', 'Braking using thrusters', 'Landing using parachutes on other planets'],
    correct: 'Using a planet\'s gravity to accelerate a spacecraft',
    funFact: 'Gravity assists steal a tiny amount of a planet\'s orbital energy. Voyager 2 used gravity assists from Jupiter, Saturn, and Uranus to reach Neptune.',
  },
  {
    question: 'What is the Hubble Deep Field?',
    options: ['The deepest part of space Hubble can\'t see', 'A long-exposure image revealing thousands of distant galaxies', 'Hubble\'s closest target', 'A region with no stars'],
    correct: 'A long-exposure image revealing thousands of distant galaxies',
    funFact: 'The Hubble Deep Field (1995) stared at a tiny blank patch of sky for 10 days and revealed about 3,000 galaxies, some over 12 billion light-years away.',
  },
  {
    question: 'What is the speed of the ISS relative to Earth?',
    options: ['~5,000 mph', '~17,500 mph', '~25,000 mph', '~50,000 mph'],
    correct: '~17,500 mph',
    funFact: 'At 17,500 mph (28,000 km/h), the ISS completes one orbit every 90 minutes. Astronauts see 16 sunrises and sunsets every day.',
  },
  {
    question: 'What is the Chandrayaan-3 mission?',
    options: ['Chinese Mars rover', 'India\'s successful Moon lander (2023)', 'Japanese asteroid probe', 'NASA Venus orbiter'],
    correct: 'India\'s successful Moon lander (2023)',
    funFact: 'India became the fourth country to soft-land on the Moon and the first to land near the lunar south pole on August 23, 2023.',
  },
  // ─── Mars Missions ─────────────────────────────────────────
  {
    question: 'What is the name of the Mars rover that landed in February 2021?',
    options: ['Curiosity', 'Spirit', 'Perseverance', 'Opportunity'],
    correct: 'Perseverance',
    funFact: 'Perseverance landed in Jezero Crater on Feb 18, 2021. It carries instruments to search for ancient microbial life and collect rock samples for future return to Earth.',
  },
  {
    question: 'What was the name of the helicopter drone on Mars?',
    options: ['Ingenuity', 'Sojourner', 'Discovery', 'Dragonfly'],
    correct: 'Ingenuity',
    funFact: 'Ingenuity made the first powered flight on another planet on April 19, 2021. Originally planned for 5 flights, it completed 72 flights before retiring in January 2024.',
  },
  {
    question: 'How long has the Curiosity rover been operating on Mars (as of 2024)?',
    options: ['5 years', '8 years', '12+ years', '3 years'],
    correct: '12+ years',
    funFact: 'Curiosity landed on August 6, 2012, in Gale Crater. It was designed for a 2-year mission but has far exceeded its planned lifespan.',
  },
  {
    question: 'What is the name of the largest volcano on Mars?',
    options: ['Olympus Mons', 'Elysium Mons', 'Ascraeus Mons', 'Pavonis Mons'],
    correct: 'Olympus Mons',
    funFact: 'Olympus Mons stands about 21.9 km (72,000 ft) tall — nearly 2.5 times the height of Mount Everest. It is also the largest volcano in the solar system.',
  },
  {
    question: 'What canyon system on Mars is the largest in the solar system?',
    options: ['Grand Canyon', 'Valles Marineris', 'Hellas Basin', 'Syrtis Major'],
    correct: 'Valles Marineris',
    funFact: 'Valles Marineris stretches over 4,000 km long, up to 200 km wide, and 7 km deep — it would span the entire United States coast to coast.',
  },
  {
    question: 'Which country launched the Mangalyaan Mars orbiter?',
    options: ['Japan', 'China', 'India', 'Russia'],
    correct: 'India',
    funFact: 'India\'s Mars Orbiter Mission (Mangalyaan) reached Mars in September 2014 on its first attempt, at a cost of just $74 million — less than many Hollywood movies.',
  },
  {
    question: 'What did NASA\'s Phoenix lander confirm on Mars in 2008?',
    options: ['Methane gas', 'Water ice in soil', 'Active volcanoes', 'Microbial life'],
    correct: 'Water ice in soil',
    funFact: 'Phoenix directly sampled water ice just below the Martian surface near the north pole, confirming what orbital data had suggested.',
  },
  // ─── James Webb Space Telescope ────────────────────────────
  {
    question: 'When was the James Webb Space Telescope launched?',
    options: ['December 2020', 'December 2021', 'March 2022', 'July 2021'],
    correct: 'December 2021',
    funFact: 'JWST launched on December 25, 2021, after 25 years of development. It is the most powerful space telescope ever built, observing in infrared light.',
  },
  {
    question: 'Where is the James Webb Space Telescope located?',
    options: ['Low Earth orbit', 'Lagrange point L2', 'Lunar orbit', 'Mars orbit'],
    correct: 'Lagrange point L2',
    funFact: 'JWST orbits the Sun at L2, about 1.5 million km from Earth. This location keeps the Sun, Earth, and Moon all behind its sunshield.',
  },
  {
    question: 'What is the primary mirror diameter of JWST?',
    options: ['2.4 meters', '6.5 meters', '10 meters', '4.2 meters'],
    correct: '6.5 meters',
    funFact: 'JWST\'s 6.5-meter gold-coated mirror is made of 18 hexagonal segments. It has about 6 times the light-collecting area of Hubble.',
  },
  {
    question: 'What type of light does JWST primarily observe?',
    options: ['Visible light', 'Ultraviolet', 'Infrared', 'X-ray'],
    correct: 'Infrared',
    funFact: 'By observing in infrared, JWST can see through cosmic dust and detect light from the earliest galaxies, which has been redshifted by the expansion of the universe.',
  },
  {
    question: 'What was one of JWST\'s first major discoveries?',
    options: ['Life on Europa', 'Galaxies forming earlier than expected', 'A new planet in our solar system', 'Water on the Sun'],
    correct: 'Galaxies forming earlier than expected',
    funFact: 'JWST found massive, well-formed galaxies existing just 300-500 million years after the Big Bang — much earlier than models predicted.',
  },
  // ─── SpaceX and Artemis ────────────────────────────────────
  {
    question: 'What is SpaceX\'s fully reusable mega-rocket called?',
    options: ['Falcon Heavy', 'New Glenn', 'Starship', 'SLS'],
    correct: 'Starship',
    funFact: 'Starship stands about 120 meters tall when stacked with its Super Heavy booster, making it the tallest and most powerful rocket ever built.',
  },
  {
    question: 'What is the goal of NASA\'s Artemis program?',
    options: ['Mars colonization', 'Return humans to the Moon', 'Replace the ISS', 'Launch new space telescopes'],
    correct: 'Return humans to the Moon',
    funFact: 'Artemis aims to land the first woman and first person of color on the Moon. Artemis I (uncrewed) successfully flew around the Moon in late 2022.',
  },
  {
    question: 'What was special about SpaceX\'s Falcon 9 when it first landed?',
    options: ['It was solar powered', 'First orbital rocket booster to land vertically', 'It carried tourists', 'It was fully 3D printed'],
    correct: 'First orbital rocket booster to land vertically',
    funFact: 'In December 2015, Falcon 9 became the first orbital-class rocket booster to land vertically, revolutionizing spaceflight economics through reusability.',
  },
  {
    question: 'What rocket does NASA use for the Artemis program?',
    options: ['Falcon Heavy', 'Space Launch System (SLS)', 'Starship', 'Delta IV Heavy'],
    correct: 'Space Launch System (SLS)',
    funFact: 'The SLS produces 8.8 million pounds of thrust at liftoff — 15% more than the Saturn V. It stands 98 meters tall.',
  },
  {
    question: 'Who was the first all-civilian crew in orbit?',
    options: ['Axiom-1', 'Inspiration4', 'Blue Origin NS-18', 'SpaceShipTwo Unity 22'],
    correct: 'Inspiration4',
    funFact: 'Inspiration4 launched in September 2021 with four civilians aboard a SpaceX Crew Dragon. They orbited Earth for 3 days at 585 km altitude.',
  },
  // ─── ISRO / Indian Space Program ──────────────────────────
  {
    question: 'What was India\'s first satellite?',
    options: ['Aryabhata', 'INSAT-1A', 'Rohini', 'Bhaskara'],
    correct: 'Aryabhata',
    funFact: 'Aryabhata was launched on April 19, 1975, by a Soviet Kosmos-3M rocket from Kapustin Yar. It was named after the ancient Indian mathematician.',
  },
  {
    question: 'What did Chandrayaan-1 discover on the Moon?',
    options: ['Helium-3 deposits', 'Water molecules on the surface', 'Underground caves', 'Magnetic field remnants'],
    correct: 'Water molecules on the surface',
    funFact: 'India\'s Chandrayaan-1 (2008) was the first mission to confirm the presence of water molecules on the Moon\'s surface using its Moon Impact Probe.',
  },
  {
    question: 'What is ISRO\'s heavy-lift launch vehicle called?',
    options: ['PSLV', 'GSLV Mk III (LVM3)', 'Falcon 9', 'Ariane 5'],
    correct: 'GSLV Mk III (LVM3)',
    funFact: 'GSLV Mk III (renamed LVM3) can carry 4 tonnes to geostationary transfer orbit. It launched Chandrayaan-3 and will launch India\'s Gaganyaan crewed mission.',
  },
  {
    question: 'What is India\'s upcoming crewed space mission called?',
    options: ['Gaganyaan', 'Chandrayaan-4', 'Shukrayaan', 'Aditya-L2'],
    correct: 'Gaganyaan',
    funFact: 'Gaganyaan aims to send Indian astronauts (Gagannauts) to low Earth orbit. It will make India the fourth country to independently launch humans into space.',
  },
  {
    question: 'What does ISRO\'s Aditya-L1 mission study?',
    options: ['Jupiter', 'The Moon', 'The Sun', 'Asteroids'],
    correct: 'The Sun',
    funFact: 'Aditya-L1, launched in September 2023, is India\'s first dedicated solar mission. It orbits the Sun-Earth L1 point to observe the solar corona continuously.',
  },
  // ─── Chinese Space Program ─────────────────────────────────
  {
    question: 'What is China\'s space station called?',
    options: ['Mir', 'Skylab', 'Tiangong', 'Salyut'],
    correct: 'Tiangong',
    funFact: 'Tiangong ("Heavenly Palace") was completed in 2022. It weighs about 100 tonnes and maintains a crew of 3 astronauts (taikonauts) in low Earth orbit.',
  },
  {
    question: 'Which Chinese rover explored the far side of the Moon?',
    options: ['Yutu', 'Yutu-2', 'Zhurong', 'Tianwen'],
    correct: 'Yutu-2',
    funFact: 'Yutu-2 landed on the far side of the Moon in January 2019 aboard Chang\'e 4 — the first-ever soft landing on the lunar far side.',
  },
  {
    question: 'What is the name of China\'s Mars rover?',
    options: ['Tianwen', 'Zhurong', 'Yutu', 'Chang\'e'],
    correct: 'Zhurong',
    funFact: 'Zhurong landed on Mars in May 2021, making China the second country to successfully operate a rover on Mars. It explored Utopia Planitia.',
  },
  // ─── Black Holes and Neutron Stars ─────────────────────────
  {
    question: 'What is the boundary around a black hole from which nothing can escape?',
    options: ['Photon sphere', 'Event horizon', 'Singularity', 'Accretion disk'],
    correct: 'Event horizon',
    funFact: 'The event horizon is not a physical surface — it\'s the mathematical boundary beyond which escape velocity exceeds the speed of light.',
  },
  {
    question: 'What was the first black hole to be photographed?',
    options: ['Sagittarius A*', 'M87*', 'Cygnus X-1', 'V404 Cygni'],
    correct: 'M87*',
    funFact: 'The Event Horizon Telescope captured the first black hole image in April 2019 — the supermassive black hole in galaxy M87, 55 million light-years away.',
  },
  {
    question: 'What is the supermassive black hole at the center of our galaxy called?',
    options: ['M87*', 'Sagittarius A*', 'Cygnus X-1', 'TON 618'],
    correct: 'Sagittarius A*',
    funFact: 'Sagittarius A* has a mass of about 4 million suns. Its image was captured by the Event Horizon Telescope in 2022.',
  },
  {
    question: 'What is a neutron star?',
    options: ['A star made of neutrons left after a supernova', 'A star with no protons', 'A cold dead star', 'A star orbiting a black hole'],
    correct: 'A star made of neutrons left after a supernova',
    funFact: 'A neutron star packs about 1.4 solar masses into a sphere just 20 km across. A teaspoon of neutron star material weighs about 6 billion tons.',
  },
  {
    question: 'What is a pulsar?',
    options: ['A dying star', 'A rapidly rotating neutron star emitting radiation beams', 'A type of quasar', 'An X-ray binary system'],
    correct: 'A rapidly rotating neutron star emitting radiation beams',
    funFact: 'Pulsars can spin up to 716 times per second (millisecond pulsars). They were first discovered in 1967 by Jocelyn Bell Burnell.',
  },
  {
    question: 'What happens when two neutron stars collide?',
    options: ['They form a new star', 'A kilonova — producing heavy elements like gold', 'They annihilate completely', 'Nothing observable'],
    correct: 'A kilonova — producing heavy elements like gold',
    funFact: 'The first neutron star merger was detected in 2017 via gravitational waves (LIGO) and light. These events produce most of the universe\'s gold and platinum.',
  },
  // ─── Exoplanets ────────────────────────────────────────────
  {
    question: 'How many exoplanets have been confirmed (as of 2024)?',
    options: ['About 500', 'About 2,000', 'Over 5,500', 'Over 10,000'],
    correct: 'Over 5,500',
    funFact: 'As of 2024, over 5,500 exoplanets have been confirmed in more than 4,000 star systems. Most were found by the Kepler and TESS space telescopes.',
  },
  {
    question: 'What is the "habitable zone"?',
    options: ['Area inside a space station', 'Region around a star where liquid water could exist', 'The Milky Way\'s center', 'Earth\'s atmosphere'],
    correct: 'Region around a star where liquid water could exist',
    funFact: 'Also called the "Goldilocks zone," it\'s not too hot and not too cold for liquid water. Earth is perfectly positioned in our Sun\'s habitable zone.',
  },
  {
    question: 'What method has discovered the most exoplanets?',
    options: ['Direct imaging', 'Transit method', 'Radial velocity', 'Gravitational lensing'],
    correct: 'Transit method',
    funFact: 'The transit method detects exoplanets by measuring the tiny dip in a star\'s brightness as a planet crosses in front of it. Kepler used this method.',
  },
  {
    question: 'What is TRAPPIST-1 famous for?',
    options: ['Nearest star to Earth', 'Has 7 Earth-sized planets', 'Brightest star visible', 'First star with a confirmed exoplanet'],
    correct: 'Has 7 Earth-sized planets',
    funFact: 'TRAPPIST-1 is a red dwarf 40 light-years away with 7 rocky planets, at least 3 of which are in the habitable zone. It\'s a prime target for JWST.',
  },
  // ─── Solar System Records ──────────────────────────────────
  {
    question: 'What is the coldest planet in our solar system?',
    options: ['Neptune', 'Uranus', 'Pluto', 'Saturn'],
    correct: 'Uranus',
    funFact: 'Uranus holds the record for coldest temperature measured in our solar system at -224°C (-371°F), even colder than more distant Neptune.',
  },
  {
    question: 'Which planet spins on its side?',
    options: ['Venus', 'Uranus', 'Neptune', 'Mercury'],
    correct: 'Uranus',
    funFact: 'Uranus has an axial tilt of 98°, likely caused by a massive collision billions of years ago. It essentially rolls around the Sun on its side.',
  },
  {
    question: 'Which planet has the shortest day?',
    options: ['Mercury', 'Mars', 'Jupiter', 'Saturn'],
    correct: 'Jupiter',
    funFact: 'Jupiter rotates in just under 10 hours despite being the largest planet. This rapid spin causes it to bulge noticeably at the equator.',
  },
  {
    question: 'Which moon in our solar system has a thick atmosphere?',
    options: ['Europa', 'Titan', 'Ganymede', 'Io'],
    correct: 'Titan',
    funFact: 'Titan has a dense nitrogen atmosphere 1.5 times the surface pressure of Earth\'s. It has lakes and rivers of liquid methane and ethane.',
  },
  {
    question: 'What is the smallest planet in our solar system?',
    options: ['Mars', 'Mercury', 'Venus', 'Pluto'],
    correct: 'Mercury',
    funFact: 'Mercury is only slightly larger than Earth\'s Moon (4,879 km diameter vs 3,474 km). It has virtually no atmosphere and extreme temperature swings.',
  },
  {
    question: 'A day on Venus is longer than a year on Venus. True or false?',
    options: ['True', 'False', 'They are equal', 'Depends on the season'],
    correct: 'True',
    funFact: 'Venus takes 243 Earth days to rotate once on its axis but only 225 Earth days to orbit the Sun. It also rotates backwards (retrograde).',
  },
  {
    question: 'Which moon has the most volcanic activity in the solar system?',
    options: ['Titan', 'Europa', 'Io', 'Triton'],
    correct: 'Io',
    funFact: 'Jupiter\'s moon Io has over 400 active volcanoes, driven by tidal heating from Jupiter\'s immense gravity. Its surface is constantly reshaped by eruptions.',
  },
  // ─── Space History ─────────────────────────────────────────
  {
    question: 'What was the first animal sent into orbit?',
    options: ['Ham the chimp', 'Laika the dog', 'Fruit flies', 'Albert II the monkey'],
    correct: 'Laika the dog',
    funFact: 'Laika was launched aboard Sputnik 2 on November 3, 1957. Sadly, she did not survive the mission, but she proved living organisms could survive launch and weightlessness.',
  },
  {
    question: 'How many Space Shuttle orbiters were built for spaceflight?',
    options: ['4', '5', '6', '3'],
    correct: '5',
    funFact: 'The five flight orbiters were Columbia, Challenger, Discovery, Atlantis, and Endeavour. Enterprise was built for testing but never flew in space.',
  },
  {
    question: 'What year was the International Space Station first occupied?',
    options: ['1998', '2000', '2003', '1996'],
    correct: '2000',
    funFact: 'The first crew (Expedition 1) arrived at the ISS on November 2, 2000. The station has been continuously occupied since then — over 23 years.',
  },
  {
    question: 'Who was the first American to orbit Earth?',
    options: ['Alan Shepard', 'John Glenn', 'Gus Grissom', 'Scott Carpenter'],
    correct: 'John Glenn',
    funFact: 'John Glenn orbited Earth 3 times on February 20, 1962, aboard Friendship 7. He later returned to space in 1998 at age 77!',
  },
  {
    question: 'What was the first space station?',
    options: ['Mir', 'Skylab', 'Salyut 1', 'ISS'],
    correct: 'Salyut 1',
    funFact: 'The Soviet Salyut 1 was launched on April 19, 1971. Its first crew tragically died during re-entry due to a cabin depressurization.',
  },
  {
    question: 'What year did the Apollo-Soyuz Test Project occur?',
    options: ['1972', '1975', '1980', '1969'],
    correct: '1975',
    funFact: 'In July 1975, American and Soviet spacecraft docked together in orbit for the first time, symbolizing detente during the Cold War.',
  },
  // ─── Voyager and Deep Space Probes ─────────────────────────
  {
    question: 'How far is Voyager 1 from Earth (approximately)?',
    options: ['1 billion km', '5 billion km', '15 billion km', '24+ billion km'],
    correct: '24+ billion km',
    funFact: 'Voyager 1 is the most distant human-made object, over 24 billion km from Earth. Its signals take over 22 hours to reach us at the speed of light.',
  },
  {
    question: 'What is the "Pale Blue Dot" photo?',
    options: ['First photo of Earth from Moon', 'Voyager 1 photo of Earth from 6 billion km', 'Hubble image of a galaxy', 'Mars from orbit'],
    correct: 'Voyager 1 photo of Earth from 6 billion km',
    funFact: 'Taken on Feb 14, 1990, at Carl Sagan\'s request, it shows Earth as a tiny dot in a sunbeam — inspiring Sagan\'s famous "Pale Blue Dot" speech.',
  },
  {
    question: 'What did New Horizons explore in 2015?',
    options: ['Jupiter', 'Pluto', 'Ceres', 'Eris'],
    correct: 'Pluto',
    funFact: 'New Horizons flew by Pluto on July 14, 2015, after a 9.5-year journey. It revealed a surprisingly complex world with mountains, glaciers, and a heart-shaped plain.',
  },
  {
    question: 'What object did New Horizons visit after Pluto?',
    options: ['Eris', 'Makemake', 'Arrokoth (2014 MU69)', 'Sedna'],
    correct: 'Arrokoth (2014 MU69)',
    funFact: 'New Horizons flew by Arrokoth on Jan 1, 2019 — the most distant object ever visited by a spacecraft, a snowman-shaped Kuiper Belt object.',
  },
  {
    question: 'Which Pioneer probe carries a gold plaque with human figures?',
    options: ['Pioneer 5', 'Pioneer 10', 'Pioneer Venus', 'Pioneer 7'],
    correct: 'Pioneer 10',
    funFact: 'Pioneer 10 (launched 1972) and Pioneer 11 both carry gold-anodized aluminum plaques depicting humans and Earth\'s location, designed by Carl Sagan.',
  },
  {
    question: 'What is the Golden Record?',
    options: ['A music award', 'Record of all satellite launches', 'Sounds and images on Voyager probes for aliens', 'NASA\'s mission database'],
    correct: 'Sounds and images on Voyager probes for aliens',
    funFact: 'The Voyager Golden Records contain greetings in 55 languages, music from Bach to Chuck Berry, nature sounds, and 115 images — a message for extraterrestrials.',
  },
  // ─── Additional Space Facts ────────────────────────────────
  {
    question: 'What is the largest known structure in the universe?',
    options: ['Milky Way', 'Hercules-Corona Borealis Great Wall', 'Andromeda Galaxy', 'Virgo Supercluster'],
    correct: 'Hercules-Corona Borealis Great Wall',
    funFact: 'This massive structure of galaxies spans about 10 billion light-years across — so large it challenges our understanding of cosmic structure formation.',
  },
  {
    question: 'How many Earths could fit inside the Sun?',
    options: ['1,000', '100,000', '1.3 million', '10 million'],
    correct: '1.3 million',
    funFact: 'About 1.3 million Earths could fit inside the Sun by volume. The Sun makes up 99.86% of all mass in the solar system.',
  },
  {
    question: 'What is the observable universe\'s estimated number of galaxies?',
    options: ['100 million', '2 billion', '2 trillion', '100 trillion'],
    correct: '2 trillion',
    funFact: 'A 2016 study estimated about 2 trillion galaxies in the observable universe — ten times more than previously thought. Most are small and faint.',
  },
  {
    question: 'What is the UAE\'s Mars mission called?',
    options: ['Hope (Al Amal)', 'Perseverance', 'Tianwen-1', 'ExoMars'],
    correct: 'Hope (Al Amal)',
    funFact: 'The UAE\'s Hope probe entered Mars orbit in February 2021, making the UAE the first Arab nation to reach Mars. It studies the Martian atmosphere.',
  },
  {
    question: 'How much mass does the Sun lose per second through fusion?',
    options: ['4 kg', '4,000 kg', '4 million tonnes', '4 billion tonnes'],
    correct: '4 million tonnes',
    funFact: 'The Sun converts about 4 million tonnes of matter into energy every second via nuclear fusion. Despite this, it has enough fuel for another 5 billion years.',
  },
  {
    question: 'What is Saturn\'s moon Enceladus famous for?',
    options: ['Largest moon in solar system', 'Ice geysers and subsurface ocean', 'Thick atmosphere', 'Retrograde orbit'],
    correct: 'Ice geysers and subsurface ocean',
    funFact: 'Enceladus shoots plumes of water ice into space from its south pole. The Cassini mission detected organic molecules, making it a top target for astrobiology.',
  },
  {
    question: 'What is the Kuiper Belt?',
    options: ['An asteroid belt between Mars and Jupiter', 'A region of icy bodies beyond Neptune', 'A belt of space debris around Earth', 'A radiation belt around Jupiter'],
    correct: 'A region of icy bodies beyond Neptune',
    funFact: 'The Kuiper Belt extends from about 30 to 55 AU from the Sun. It contains millions of icy bodies including dwarf planets Pluto, Eris, and Makemake.',
  },
  {
    question: 'What is the speed of light in km/s?',
    options: ['100,000 km/s', '200,000 km/s', '300,000 km/s', '400,000 km/s'],
    correct: '300,000 km/s',
    funFact: 'The speed of light is exactly 299,792,458 m/s (about 300,000 km/s). Nothing with mass can travel at or exceed this universal speed limit.',
  },
  {
    question: 'Which planet has rings that are disappearing?',
    options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'],
    correct: 'Saturn',
    funFact: 'Saturn\'s iconic rings are relatively young (100-400 million years old) and are slowly being pulled into the planet by gravity — they may vanish in 100 million years.',
  },
  {
    question: 'What is a quasar?',
    options: ['A type of star', 'An extremely luminous active galactic nucleus', 'A small asteroid', 'A type of nebula'],
    correct: 'An extremely luminous active galactic nucleus',
    funFact: 'Quasars are powered by supermassive black holes gobbling material. They can outshine entire galaxies and are visible billions of light-years away.',
  },
  {
    question: 'What is the Oort Cloud?',
    options: ['A nebula', 'A gas cloud on Jupiter', 'A spherical shell of icy bodies far beyond Pluto', 'Dust around the Sun'],
    correct: 'A spherical shell of icy bodies far beyond Pluto',
    funFact: 'The Oort Cloud extends up to 100,000 AU (1.87 light-years) from the Sun. Long-period comets originate from this distant reservoir.',
  },
  {
    question: 'What is the Karman line?',
    options: ['Edge of the universe', 'Boundary between Earth\'s atmosphere and space (100 km)', 'Mars\'s equator', 'A line on Jupiter'],
    correct: 'Boundary between Earth\'s atmosphere and space (100 km)',
    funFact: 'At 100 km altitude, the Karman line is the internationally recognized boundary of space. Above it, aerodynamic flight becomes impossible.',
  },
  {
    question: 'What was the first privately funded spacecraft to reach orbit?',
    options: ['SpaceShipOne', 'Falcon 1', 'Dragon', 'Blue Origin New Shepard'],
    correct: 'Falcon 1',
    funFact: 'SpaceX\'s Falcon 1 reached orbit on its fourth attempt on September 28, 2008. SpaceShipOne reached space (suborbital) in 2004 but not orbit.',
  },
  {
    question: 'What galaxy is on a collision course with the Milky Way?',
    options: ['Triangulum', 'Andromeda', 'Large Magellanic Cloud', 'Centaurus A'],
    correct: 'Andromeda',
    funFact: 'Andromeda is approaching us at 110 km/s and will merge with the Milky Way in about 4.5 billion years, forming "Milkomeda" or "Milkdromeda."',
  },
  {
    question: 'What is the closest exoplanet to Earth?',
    options: ['Kepler-452b', 'Proxima Centauri b', 'TRAPPIST-1e', 'Gliese 581g'],
    correct: 'Proxima Centauri b',
    funFact: 'Proxima Centauri b orbits the nearest star to our Sun (4.24 light-years away) and lies in the habitable zone, though stellar flares may strip its atmosphere.',
  },
  {
    question: 'How old is the universe?',
    options: ['4.6 billion years', '10 billion years', '13.8 billion years', '20 billion years'],
    correct: '13.8 billion years',
    funFact: 'The universe is 13.8 billion years old, determined by measuring the cosmic microwave background radiation and the expansion rate of the universe.',
  },
  {
    question: 'What is dark energy?',
    options: ['Energy from black holes', 'A mysterious force accelerating the expansion of the universe', 'Energy in dark matter', 'Radiation from deep space'],
    correct: 'A mysterious force accelerating the expansion of the universe',
    funFact: 'Dark energy makes up about 68% of the universe. It was discovered in 1998 when astronomers found that the universe\'s expansion is accelerating.',
  },
  {
    question: 'What percentage of the universe is ordinary matter?',
    options: ['About 5%', 'About 25%', 'About 50%', 'About 75%'],
    correct: 'About 5%',
    funFact: 'Ordinary matter (atoms, stars, planets, us) makes up only about 5% of the universe. Dark matter is 27% and dark energy is 68%.',
  },
  {
    question: 'What is the largest planet ever discovered?',
    options: ['Jupiter', 'ROXs 42Bb', 'HAT-P-67b', 'TrES-4b'],
    correct: 'HAT-P-67b',
    funFact: 'HAT-P-67b is about twice Jupiter\'s diameter but very puffy — its density is less than that of styrofoam. It orbits extremely close to its star.',
  },
  {
    question: 'What is spacewalking officially called?',
    options: ['EVA (Extravehicular Activity)', 'Orbital transit', 'Microgravity walk', 'External patrol'],
    correct: 'EVA (Extravehicular Activity)',
    funFact: 'The first EVA was performed by Alexei Leonov on March 18, 1965. He spent 12 minutes outside Voskhod 2 and nearly couldn\'t fit back through the airlock.',
  },
  {
    question: 'What is the farthest humans have traveled from Earth?',
    options: ['ISS orbit (400 km)', 'Apollo 13 (400,171 km from Earth)', 'Moon\'s surface (384,400 km)', 'Skylab orbit (435 km)'],
    correct: 'Apollo 13 (400,171 km from Earth)',
    funFact: 'Apollo 13\'s crew reached 400,171 km from Earth during their emergency swing around the Moon — the farthest any humans have ever been from our planet.',
  },
  {
    question: 'What is the cosmic microwave background (CMB)?',
    options: ['Microwave radiation from cell towers', 'Radiation from the earliest light in the universe', 'Background static from satellites', 'Heat from nearby stars'],
    correct: 'Radiation from the earliest light in the universe',
    funFact: 'The CMB is the afterglow of the Big Bang, released about 380,000 years after the universe began. It fills all of space at a temperature of 2.725 K.',
  },
  {
    question: 'What causes a gamma-ray burst?',
    options: ['Solar flares', 'Collapsing massive stars or neutron star mergers', 'Asteroid impacts', 'Black hole evaporation'],
    correct: 'Collapsing massive stars or neutron star mergers',
    funFact: 'Gamma-ray bursts are the most energetic events in the universe. A single burst can release more energy in seconds than the Sun will in its entire lifetime.',
  },
  {
    question: 'What is the Drake Equation used for?',
    options: ['Calculating rocket trajectories', 'Estimating the number of communicating civilizations in our galaxy', 'Measuring star brightness', 'Predicting comet orbits'],
    correct: 'Estimating the number of communicating civilizations in our galaxy',
    funFact: 'Frank Drake devised this equation in 1961. While highly speculative, it provides a framework for thinking about extraterrestrial intelligence (SETI).',
  },
  {
    question: 'What is a Dyson Sphere?',
    options: ['A type of vacuum cleaner', 'Theoretical megastructure around a star to capture energy', 'A planet-sized computer', 'A real structure found in space'],
    correct: 'Theoretical megastructure around a star to capture energy',
    funFact: 'Proposed by Freeman Dyson in 1960, a Dyson Sphere would allow a civilization to harness all the energy output of its star — a Type II civilization concept.',
  },
  {
    question: 'How many times has the Space Shuttle launched?',
    options: ['100', '135', '150', '75'],
    correct: '135',
    funFact: 'The Space Shuttle program ran from 1981 to 2011, completing 135 missions. It transported over 350 people to space and helped build the ISS.',
  },
  {
    question: 'What is the largest asteroid in the asteroid belt?',
    options: ['Vesta', 'Ceres', 'Pallas', 'Hygiea'],
    correct: 'Ceres',
    funFact: 'Ceres is about 940 km in diameter — so large it\'s classified as a dwarf planet. NASA\'s Dawn spacecraft orbited it from 2015-2018, finding bright salt deposits.',
  },
  {
    question: 'What type of engine does an ion thruster use?',
    options: ['Chemical combustion', 'Nuclear fission', 'Electrically charged particles (ions)', 'Solar sails'],
    correct: 'Electrically charged particles (ions)',
    funFact: 'Ion thrusters produce very low thrust but are extremely efficient. NASA\'s Dawn and JAXA\'s Hayabusa missions successfully used ion propulsion.',
  },
  {
    question: 'What is the "Great Filter" hypothesis?',
    options: ['A space telescope filter', 'Proposed explanation for why we haven\'t found alien civilizations', 'Water purification on the ISS', 'A type of radiation shielding'],
    correct: 'Proposed explanation for why we haven\'t found alien civilizations',
    funFact: 'The Great Filter suggests there\'s a barrier that prevents civilizations from becoming interstellar — whether it\'s behind us or ahead of us is the crucial question.',
  },
  {
    question: 'What is the temperature at the center of the Sun?',
    options: ['1 million °C', '5 million °C', '15 million °C', '100 million °C'],
    correct: '15 million °C',
    funFact: 'At 15 million °C, the Sun\'s core is where hydrogen atoms fuse into helium, releasing the energy that powers our solar system.',
  },
  {
    question: 'What did the LIGO observatory first detect in 2015?',
    options: ['Dark matter', 'Gravitational waves', 'New exoplanets', 'Cosmic rays'],
    correct: 'Gravitational waves',
    funFact: 'LIGO detected gravitational waves from two merging black holes on September 14, 2015, confirming Einstein\'s 1916 prediction. The discovery won the 2017 Nobel Prize.',
  },
  {
    question: 'What is the ISS\'s altitude above Earth?',
    options: ['100 km', '200 km', 'About 400 km', '1,000 km'],
    correct: 'About 400 km',
    funFact: 'The ISS orbits at about 408 km altitude, traveling at 7.66 km/s. At this speed, astronauts see 16 sunrises and sunsets every day.',
  },
  {
    question: 'Which space agency landed on a comet in 2014?',
    options: ['NASA', 'ESA (Rosetta/Philae)', 'JAXA', 'ISRO'],
    correct: 'ESA (Rosetta/Philae)',
    funFact: 'ESA\'s Philae lander touched down on Comet 67P/Churyumov-Gerasimenko on Nov 12, 2014 — the first soft landing on a comet in history.',
  },
  {
    question: 'What is the solar wind?',
    options: ['Wind on the Sun', 'Stream of charged particles from the Sun', 'Light from the Sun', 'Magnetic storms on Earth'],
    correct: 'Stream of charged particles from the Sun',
    funFact: 'The solar wind travels at 300-800 km/s and consists mainly of protons and electrons. It extends far beyond Pluto, creating the heliosphere.',
  },
  {
    question: 'What is a magnetar?',
    options: ['A magnetic asteroid', 'A neutron star with extremely powerful magnetic fields', 'A type of compass in space', 'A magnetic storm on Jupiter'],
    correct: 'A neutron star with extremely powerful magnetic fields',
    funFact: 'A magnetar\'s magnetic field is about 1 quadrillion (10^15) times stronger than Earth\'s. It could erase a credit card from halfway across the solar system.',
  },
  {
    question: 'What probe first entered Jupiter\'s atmosphere?',
    options: ['Juno', 'Galileo', 'Voyager 1', 'Pioneer 10'],
    correct: 'Galileo',
    funFact: 'The Galileo atmospheric probe descended into Jupiter on December 7, 1995, transmitting data for 58 minutes before being crushed by pressure.',
  },
  {
    question: 'How long would it take to drive to space at highway speed?',
    options: ['About 10 minutes', 'About 1 hour', 'About 6 hours', 'About 1 day'],
    correct: 'About 1 hour',
    funFact: 'At 100 km/h (60 mph), you would reach the Karman line (100 km) in about 1 hour. Space is surprisingly close — it\'s just really hard to stay there.',
  },
  {
    question: 'What was the Cassini mission?',
    options: ['A Mars rover', 'Saturn orbiter that operated 2004-2017', 'Jupiter flyby probe', 'Asteroid sample return'],
    correct: 'Saturn orbiter that operated 2004-2017',
    funFact: 'Cassini orbited Saturn for 13 years, discovering ocean worlds (Enceladus, Titan) and taking over 450,000 images before its intentional plunge into Saturn.',
  },
  {
    question: 'What is the Parker Solar Probe\'s mission?',
    options: ['Study Mars', 'Fly through the Sun\'s corona', 'Map the asteroid belt', 'Orbit Mercury'],
    correct: 'Fly through the Sun\'s corona',
    funFact: 'The Parker Solar Probe is the fastest human-made object (over 600,000 km/h) and flies within 6 million km of the Sun\'s surface, enduring temperatures over 1,000°C.',
  },
  {
    question: 'What does the acronym SETI stand for?',
    options: ['Space Exploration and Technology Institute', 'Search for Extraterrestrial Intelligence', 'Solar Energy Transmission Initiative', 'Satellite Earth Tracking International'],
    correct: 'Search for Extraterrestrial Intelligence',
    funFact: 'SETI has been listening for signals from alien civilizations since 1960. The famous "Wow! signal" in 1977 remains unexplained but was never repeated.',
  },
  {
    question: 'What is the Fermi Paradox?',
    options: ['Why particles can\'t go faster than light', 'The contradiction between the high probability of alien life and lack of evidence', 'Why black holes emit radiation', 'How fusion works in stars'],
    correct: 'The contradiction between the high probability of alien life and lack of evidence',
    funFact: 'Named after physicist Enrico Fermi, who asked "Where is everybody?" Given billions of Sun-like stars and eons of time, advanced civilizations should be common — yet we see none.',
  },
  {
    question: 'How fast does the ISS travel?',
    options: ['5,000 km/h', '17,500 mph (28,000 km/h)', '50,000 km/h', '100,000 km/h'],
    correct: '17,500 mph (28,000 km/h)',
    funFact: 'At this speed, the ISS completes one orbit every 90 minutes. Astronauts witness 16 sunrises and 16 sunsets every day.',
  },
  {
    question: 'What is the largest known star by radius?',
    options: ['Betelgeuse', 'UY Scuti', 'Stephenson 2-18', 'VY Canis Majoris'],
    correct: 'Stephenson 2-18',
    funFact: 'Stephenson 2-18 has a radius about 2,150 times that of the Sun. If placed at the center of our solar system, its surface would extend beyond Saturn\'s orbit.',
  },
  {
    question: 'What is the Roche limit?',
    options: ['Maximum altitude for satellites', 'Distance within which a celestial body will disintegrate due to tidal forces', 'Maximum speed in orbit', 'Edge of a galaxy'],
    correct: 'Distance within which a celestial body will disintegrate due to tidal forces',
    funFact: 'Saturn\'s rings exist within its Roche limit — they\'re the remnants of moons or comets that got too close and were torn apart by tidal forces.',
  },
  {
    question: 'What is the Hubble Deep Field?',
    options: ['Hubble\'s maintenance area', 'Ultra-long exposure image revealing thousands of galaxies in a tiny patch of sky', 'The darkest area near Hubble', 'A region with no stars'],
    correct: 'Ultra-long exposure image revealing thousands of galaxies in a tiny patch of sky',
    funFact: 'The Hubble Deep Field (1995) stared at a seemingly blank patch of sky for 10 days, revealing about 3,000 galaxies in an area 1/13 millionth of the sky.',
  },
  {
    question: 'What powers a spacecraft in the outer solar system where sunlight is too weak?',
    options: ['Chemical batteries', 'RTGs (Radioisotope Thermoelectric Generators)', 'Wind turbines', 'Fuel cells only'],
    correct: 'RTGs (Radioisotope Thermoelectric Generators)',
    funFact: 'RTGs convert heat from decaying plutonium-238 into electricity. Voyager, Cassini, New Horizons, and Perseverance all use or used RTGs.',
  },
  {
    question: 'What is the largest known void in the universe?',
    options: ['The Local Void', 'The Boötes Void', 'The CMB Cold Spot', 'The Great Void'],
    correct: 'The Boötes Void',
    funFact: 'The Boötes Void is a nearly spherical region about 330 million light-years across containing very few galaxies — one of the largest known structures in the universe.',
  },
  {
    question: 'What is an astronomical unit (AU)?',
    options: ['Distance between stars', 'Average distance from Earth to the Sun (~150 million km)', 'Width of the Milky Way', 'Distance light travels in a minute'],
    correct: 'Average distance from Earth to the Sun (~150 million km)',
    funFact: 'One AU is about 149.6 million km. Jupiter is 5.2 AU from the Sun, Neptune is 30 AU, and the Oort Cloud extends to about 100,000 AU.',
  },
  {
    question: 'What is the most distant human-made object?',
    options: ['Pioneer 10', 'Voyager 2', 'Voyager 1', 'New Horizons'],
    correct: 'Voyager 1',
    funFact: 'Voyager 1 entered interstellar space in 2012 and continues to transmit data. Launched in 1977, it still communicates with Earth over 46 years later.',
  },
  {
    question: 'What spacecraft sampled asteroid Bennu and returned to Earth?',
    options: ['Hayabusa2', 'OSIRIS-REx', 'Dawn', 'NEAR Shoemaker'],
    correct: 'OSIRIS-REx',
    funFact: 'OSIRIS-REx collected about 121 grams of material from asteroid Bennu and returned the sample to Earth on Sept 24, 2023 — NASA\'s first asteroid sample return.',
  },
  {
    question: 'What is space debris (space junk)?',
    options: ['Cosmic dust', 'Non-functional human-made objects in orbit', 'Asteroid fragments', 'Cometary tails'],
    correct: 'Non-functional human-made objects in orbit',
    funFact: 'There are over 36,000 tracked objects larger than 10 cm in orbit, plus millions of smaller pieces. They travel at ~28,000 km/h, making even paint flecks dangerous.',
  },
  {
    question: 'What is a Hohmann transfer orbit?',
    options: ['A type of escape trajectory', 'The most fuel-efficient elliptical path between two orbits', 'A circular orbit change', 'A gravity-assist maneuver'],
    correct: 'The most fuel-efficient elliptical path between two orbits',
    funFact: 'Named after Walter Hohmann (1925), this orbit uses two engine burns to transfer between circular orbits. Most interplanetary missions use variations of it.',
  },
  {
    question: 'Which planet has winds of over 2,000 km/h?',
    options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'],
    correct: 'Neptune',
    funFact: 'Neptune has the fastest winds in the solar system — up to 2,100 km/h. This is puzzling because Neptune receives very little solar energy to drive weather.',
  },
  {
    question: 'What was special about Japan\'s Hayabusa2 mission?',
    options: ['First Mars landing', 'Returned samples from asteroid Ryugu', 'First solar sail', 'Landed on the Moon'],
    correct: 'Returned samples from asteroid Ryugu',
    funFact: 'Hayabusa2 returned 5.4 grams of material from asteroid Ryugu in December 2020. Analysis found amino acids and other organic compounds — building blocks of life.',
  },
  {
    question: 'What is the habitable zone sometimes called?',
    options: ['The Dead Zone', 'The Goldilocks Zone', 'The Life Belt', 'The Water Ring'],
    correct: 'The Goldilocks Zone',
    funFact: 'Like Goldilocks\' porridge, conditions must be "just right" — not too hot, not too cold — for liquid water to exist on a planet\'s surface.',
  },
  // ─── Planet Features ─────────────────────────────────────
  {
    question: 'Which planet has the most prominent ring system?',
    options: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'],
    correct: 'Saturn',
    funFact: 'Saturn\'s rings are made mostly of ice particles ranging from tiny grains to chunks as big as houses. They span up to 282,000 km but are only about 10 meters thick.',
  },
  {
    question: 'What is the Great Red Spot on Jupiter?',
    options: ['A volcano', 'A giant storm', 'An impact crater', 'A magnetic anomaly'],
    correct: 'A giant storm',
    funFact: 'The Great Red Spot is a massive anticyclonic storm that has been raging for at least 350 years. It\'s large enough to engulf Earth.',
  },
  {
    question: 'Which planet rotates on its side with an axial tilt of about 98 degrees?',
    options: ['Neptune', 'Uranus', 'Venus', 'Pluto'],
    correct: 'Uranus',
    funFact: 'Uranus essentially rolls around the Sun on its side, likely due to a collision with an Earth-sized object billions of years ago.',
  },
  {
    question: 'What is Venus\'s atmosphere primarily composed of?',
    options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Methane'],
    correct: 'Carbon dioxide',
    funFact: 'Venus has a runaway greenhouse effect with 96.5% CO2 atmosphere, creating surface temperatures of 465°C — hotter than Mercury despite being farther from the Sun.',
  },
  {
    question: 'How many known moons does Jupiter have (as of 2024)?',
    options: ['16', '53', '79', '95'],
    correct: '95',
    funFact: 'Jupiter\'s moon count keeps growing as astronomers discover smaller moons. The four largest — Io, Europa, Ganymede, and Callisto — were discovered by Galileo in 1610.',
  },
  {
    question: 'Which planet has the strongest winds in the solar system?',
    options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'],
    correct: 'Neptune',
    funFact: 'Neptune\'s winds can reach speeds of 2,100 km/h (1,300 mph), making them the fastest in the solar system despite being the farthest planet from the Sun.',
  },
  {
    question: 'What gives Mars its red color?',
    options: ['Copper deposits', 'Iron oxide (rust)', 'Red clay', 'Volcanic ash'],
    correct: 'Iron oxide (rust)',
    funFact: 'Mars is red because its surface is rich in iron minerals that have oxidized (rusted) over billions of years, giving it the nickname "The Red Planet."',
  },
  {
    question: 'Which is the tallest mountain in the solar system?',
    options: ['Mount Everest', 'Maxwell Montes', 'Olympus Mons', 'Rheasilvia'],
    correct: 'Olympus Mons',
    funFact: 'Olympus Mons on Mars stands about 21.9 km tall — nearly 2.5 times the height of Mount Everest. Its base is so wide it would cover most of France.',
  },
  {
    question: 'What unique feature does Mercury have due to its slow rotation?',
    options: ['No atmosphere at all', 'A day longer than its year', 'Permanent ice caps', 'Two suns visible'],
    correct: 'A day longer than its year',
    funFact: 'Mercury takes 59 Earth days to rotate once but only 88 days to orbit the Sun. One solar day on Mercury equals 176 Earth days.',
  },
  {
    question: 'Which planet has a hexagonal storm at its north pole?',
    options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'],
    correct: 'Saturn',
    funFact: 'Saturn\'s hexagonal jet stream at its north pole is about 30,000 km across, large enough to fit four Earths inside. It was first discovered by Voyager in 1981.',
  },
  // ─── Dwarf Planets ────────────────────────────────────────
  {
    question: 'When was Pluto reclassified as a dwarf planet?',
    options: ['2001', '2004', '2006', '2009'],
    correct: '2006',
    funFact: 'The International Astronomical Union reclassified Pluto in 2006 because it hasn\'t "cleared the neighborhood" around its orbit, one of three criteria for planet status.',
  },
  {
    question: 'Which dwarf planet is larger than Pluto?',
    options: ['Ceres', 'Makemake', 'Eris', 'Haumea'],
    correct: 'Eris',
    funFact: 'Eris is about 27% more massive than Pluto, though slightly smaller in diameter. Its discovery in 2005 was the main trigger for redefining what constitutes a planet.',
  },
  {
    question: 'Where is the dwarf planet Ceres located?',
    options: ['Kuiper Belt', 'Asteroid Belt', 'Oort Cloud', 'Beyond Neptune'],
    correct: 'Asteroid Belt',
    funFact: 'Ceres is the largest object in the asteroid belt between Mars and Jupiter, comprising about a third of the belt\'s total mass. It has a thin water vapor atmosphere.',
  },
  {
    question: 'What unusual shape does the dwarf planet Haumea have?',
    options: ['Cube-like', 'Elongated ellipsoid', 'Pear-shaped', 'Perfectly spherical'],
    correct: 'Elongated ellipsoid',
    funFact: 'Haumea spins so fast (once every 4 hours) that it has been stretched into an elongated shape, like a squished football. It also has rings.',
  },
  {
    question: 'Which dwarf planet\'s moon is named "Dysnomia"?',
    options: ['Pluto', 'Eris', 'Makemake', 'Ceres'],
    correct: 'Eris',
    funFact: 'Dysnomia is named after the daughter of Eris in Greek mythology. It takes about 16 days to orbit Eris and was discovered in 2005.',
  },
  // ─── Space Records ────────────────────────────────────────
  {
    question: 'What is the farthest human-made object from Earth?',
    options: ['Voyager 2', 'Voyager 1', 'New Horizons', 'Pioneer 10'],
    correct: 'Voyager 1',
    funFact: 'Voyager 1 is over 24 billion km from Earth and entered interstellar space in 2012. It continues to send data back, though signals take over 22 hours to reach us.',
  },
  {
    question: 'What is the longest single human spaceflight?',
    options: ['340 days', '371 days', '437 days', '523 days'],
    correct: '437 days',
    funFact: 'Russian cosmonaut Valeri Polyakov spent 437 consecutive days aboard Mir space station from 1994-1995, still the record for continuous time in space.',
  },
  {
    question: 'Which was the most expensive space mission ever?',
    options: ['Apollo Program', 'International Space Station', 'James Webb Telescope', 'Space Shuttle Program'],
    correct: 'International Space Station',
    funFact: 'The ISS has cost over $150 billion to build, maintain, and resupply, making it the most expensive single structure ever built by humanity.',
  },
  {
    question: 'What is the fastest speed ever achieved by a spacecraft?',
    options: ['Parker Solar Probe', 'Juno', 'New Horizons', 'Helios 2'],
    correct: 'Parker Solar Probe',
    funFact: 'The Parker Solar Probe reached speeds of about 635,266 km/h (163 km/s) in 2024, fast enough to travel from New York to Tokyo in under a minute.',
  },
  {
    question: 'Who holds the record for most time spent in space total?',
    options: ['Scott Kelly', 'Gennady Padalka', 'Peggy Whitson', 'Yuri Gagarin'],
    correct: 'Gennady Padalka',
    funFact: 'Gennady Padalka spent a cumulative 878 days in space across five missions, more than any other human in history.',
  },
  // ─── Space Disasters ──────────────────────────────────────
  {
    question: 'In what year did the Space Shuttle Challenger disaster occur?',
    options: ['1984', '1986', '1988', '1990'],
    correct: '1986',
    funFact: 'Challenger broke apart 73 seconds after launch on January 28, 1986, due to a failed O-ring seal in its solid rocket booster, exacerbated by cold weather.',
  },
  {
    question: 'What caused the Columbia disaster in 2003?',
    options: ['Engine failure', 'Foam insulation damage to wing', 'Fuel leak', 'Computer malfunction'],
    correct: 'Foam insulation damage to wing',
    funFact: 'A piece of foam insulation broke off during launch and struck Columbia\'s left wing, creating a hole that allowed superheated gas to penetrate during re-entry.',
  },
  {
    question: 'Which Apollo mission suffered an oxygen tank explosion?',
    options: ['Apollo 1', 'Apollo 11', 'Apollo 13', 'Apollo 17'],
    correct: 'Apollo 13',
    funFact: 'Apollo 13\'s famous "Houston, we\'ve had a problem" moment led to an incredible rescue mission. The crew used the lunar module as a lifeboat to return safely to Earth.',
  },
  {
    question: 'What happened to the Soviet N1 rocket?',
    options: ['Reached orbit on first try', 'All four launch attempts failed', 'Exploded on the pad', 'Was cancelled before testing'],
    correct: 'All four launch attempts failed',
    funFact: 'The Soviet N1 moon rocket failed all four launch attempts between 1969-1972. The second attempt produced one of the largest non-nuclear explosions in history.',
  },
  {
    question: 'Which space station had a fire emergency in 1997?',
    options: ['ISS', 'Skylab', 'Mir', 'Salyut 7'],
    correct: 'Mir',
    funFact: 'A solid-fuel oxygen generator caught fire on Mir in February 1997, filling the station with smoke. The crew had to work around the blaze as it blocked their escape route to one of the Soyuz capsules.',
  },
  // ─── Commercial Space ─────────────────────────────────────
  {
    question: 'Who founded Blue Origin?',
    options: ['Elon Musk', 'Richard Branson', 'Jeff Bezos', 'Paul Allen'],
    correct: 'Jeff Bezos',
    funFact: 'Blue Origin was founded in 2000, two years before SpaceX. Its motto is "Gradatim Ferociter" (Step by Step, Ferociously). Its New Shepard rocket is named after Alan Shepard.',
  },
  {
    question: 'What is SpaceX\'s Starship designed to carry to Mars?',
    options: ['10 people', '50 people', '100 people', '500 people'],
    correct: '100 people',
    funFact: 'Starship is designed to carry up to 100 passengers on long-duration interplanetary flights. It\'s also the largest and most powerful rocket ever built.',
  },
  {
    question: 'Which company launched the first all-civilian orbital spaceflight?',
    options: ['Blue Origin', 'Virgin Galactic', 'SpaceX', 'Axiom Space'],
    correct: 'SpaceX',
    funFact: 'Inspiration4 in September 2021 was the first orbital mission with no professional astronauts on board. The crew orbited Earth for 3 days at 585 km altitude.',
  },
  {
    question: 'What altitude does Virgin Galactic\'s SpaceShipTwo reach?',
    options: ['~40 km', '~86 km', '~200 km', '~400 km'],
    correct: '~86 km',
    funFact: 'Virgin Galactic reaches about 86 km, above the US-defined space boundary (80 km) but below the Kármán line (100 km) used internationally.',
  },
  {
    question: 'Which company built the first private space station module?',
    options: ['SpaceX', 'Axiom Space', 'Bigelow Aerospace', 'Nanoracks'],
    correct: 'Axiom Space',
    funFact: 'Axiom Space plans to attach modules to the ISS and eventually detach them to form an independent commercial space station after ISS retirement.',
  },
  // ─── Space Food, Suits, Toilets ───────────────────────────
  {
    question: 'What did astronauts first eat in space?',
    options: ['Freeze-dried ice cream', 'Pureed meat in tubes', 'Tang', 'Dehydrated fruit'],
    correct: 'Pureed meat in tubes',
    funFact: 'Yuri Gagarin squeezed pureed meat from a toothpaste-like tube during his 1961 flight. Early space food was designed to be eaten without crumbs that could float into equipment.',
  },
  {
    question: 'How much does a NASA spacesuit (EMU) cost?',
    options: ['$1 million', '$5 million', '$12 million', '$150 million'],
    correct: '$12 million',
    funFact: 'Each Extravehicular Mobility Unit costs about $12 million (1974 dollars, ~$150 million today). They weigh 127 kg on Earth but are weightless in orbit.',
  },
  {
    question: 'How do astronauts go to the bathroom on the ISS?',
    options: ['Regular toilet with gravity', 'Suction-based vacuum system', 'Absorbent diapers only', 'They don\'t — waste is stored'],
    correct: 'Suction-based vacuum system',
    funFact: 'The ISS toilet uses airflow and suction instead of gravity. Urine is recycled into drinking water, and solid waste is vacuum-dried, stored, and eventually burned up during re-entry.',
  },
  {
    question: 'What is the "Maximum Absorbency Garment" used by astronauts?',
    options: ['A spacesuit cooling system', 'A space diaper', 'A radiation shield', 'An oxygen mask'],
    correct: 'A space diaper',
    funFact: 'MAGs are essentially adult diapers worn during launch, re-entry, and spacewalks when astronauts can\'t access a toilet for hours at a time.',
  },
  {
    question: 'Which food is banned on the ISS because of crumb danger?',
    options: ['Crackers', 'Regular bread', 'Chips', 'All of the above'],
    correct: 'All of the above',
    funFact: 'Crumbs float in microgravity and can get into equipment or astronauts\' eyes. The ISS uses tortillas instead of bread, a practice started on the Space Shuttle.',
  },
  // ─── Space Stations ───────────────────────────────────────
  {
    question: 'What was the first space station ever launched?',
    options: ['Skylab', 'Mir', 'Salyut 1', 'ISS'],
    correct: 'Salyut 1',
    funFact: 'The Soviet Union launched Salyut 1 on April 19, 1971. Tragically, its first crew of three cosmonauts died during re-entry due to a cabin depressurization.',
  },
  {
    question: 'How long was Skylab in orbit?',
    options: ['2 years', '6 years', '10 years', '15 years'],
    correct: '6 years',
    funFact: 'Skylab orbited from 1973 to 1979. It fell back to Earth earlier than planned due to higher-than-expected solar activity expanding the atmosphere. Debris fell over Western Australia.',
  },
  {
    question: 'How many years was the Mir space station in orbit?',
    options: ['5 years', '10 years', '15 years', '20 years'],
    correct: '15 years',
    funFact: 'Mir orbited from 1986 to 2001. It was designed for 5 years but lasted three times longer. It hosted astronauts from 12 different countries.',
  },
  {
    question: 'What is China\'s space station called?',
    options: ['Shenzhou', 'Tiangong', 'Chang\'e', 'Tianwen'],
    correct: 'Tiangong',
    funFact: 'Tiangong (meaning "Heavenly Palace") became fully operational in 2022. China is only the third country to independently operate a space station.',
  },
  {
    question: 'How many countries contributed to building the ISS?',
    options: ['5', '10', '15', '16'],
    correct: '15',
    funFact: 'The ISS was built by the space agencies of the US, Russia, Europe, Japan, and Canada — representing 15 countries. It\'s been continuously occupied since November 2000.',
  },
  // ─── Rockets ──────────────────────────────────────────────
  {
    question: 'How tall was the Saturn V rocket?',
    options: ['60 meters', '85 meters', '111 meters', '140 meters'],
    correct: '111 meters',
    funFact: 'Saturn V stood 111 meters tall (36 stories) and remains the most powerful rocket ever flown successfully. It could lift 130 tonnes to low Earth orbit.',
  },
  {
    question: 'What is unique about SpaceX\'s Falcon 9?',
    options: ['Uses nuclear power', 'First stage lands and is reused', 'Launches from water', 'Is fully 3D printed'],
    correct: 'First stage lands and is reused',
    funFact: 'Falcon 9 boosters have been reused up to 20+ times each. The first successful landing was in December 2015, revolutionizing the economics of spaceflight.',
  },
  {
    question: 'What does SLS stand for in NASA\'s rocket program?',
    options: ['Space Launch System', 'Super Lift System', 'Saturn Legacy System', 'Space Logistics System'],
    correct: 'Space Launch System',
    funFact: 'SLS is NASA\'s successor to the Space Shuttle, designed for deep space missions including Artemis Moon landings. Its first flight was Artemis I in November 2022.',
  },
  {
    question: 'Which country operates the GSLV rocket?',
    options: ['Japan', 'China', 'India', 'South Korea'],
    correct: 'India',
    funFact: 'India\'s GSLV (Geosynchronous Satellite Launch Vehicle) uses a cryogenic upper stage. ISRO is among few agencies to master cryogenic engine technology.',
  },
  {
    question: 'What is China\'s main heavy-lift rocket family called?',
    options: ['Kuaizhou', 'Long March', 'Zhuque', 'Jielong'],
    correct: 'Long March',
    funFact: 'The Long March rocket family has been operational since 1970. Long March 5 can lift 25 tonnes to LEO and launched China\'s space station modules.',
  },
  {
    question: 'How many engines does SpaceX\'s Starship Super Heavy booster have?',
    options: ['9', '27', '33', '42'],
    correct: '33',
    funFact: 'Super Heavy uses 33 Raptor engines generating about 74 MN of thrust at liftoff — roughly twice the thrust of Saturn V, making it the most powerful rocket ever built.',
  },
  // ─── Satellites ───────────────────────────────────────────
  {
    question: 'What was the first artificial satellite launched into space?',
    options: ['Explorer 1', 'Sputnik 1', 'Vanguard 1', 'TIROS-1'],
    correct: 'Sputnik 1',
    funFact: 'Sputnik 1 was launched by the USSR on October 4, 1957. It was a 58 cm polished metal sphere that transmitted radio beeps for 21 days before its batteries died.',
  },
  {
    question: 'How many satellites make up the core GPS constellation?',
    options: ['12', '24', '31', '48'],
    correct: '31',
    funFact: 'The GPS constellation has at least 24 operational satellites (usually 31+) orbiting at 20,200 km. You need signals from at least 4 satellites to determine your position.',
  },
  {
    question: 'At what altitude does the Hubble Space Telescope orbit?',
    options: ['200 km', '340 km', '540 km', '35,786 km'],
    correct: '540 km',
    funFact: 'Hubble orbits at about 540 km in low Earth orbit. It has made over 1.5 million observations since 1990 and helped determine the age of the universe.',
  },
  {
    question: 'What do GOES satellites monitor?',
    options: ['GPS signals', 'Earth\'s weather', 'Deep space objects', 'Internet traffic'],
    correct: 'Earth\'s weather',
    funFact: 'GOES (Geostationary Operational Environmental Satellites) provide continuous weather monitoring from 35,786 km altitude. They can image the full Earth disk every 5 minutes.',
  },
  {
    question: 'What has the Landsat program been doing since 1972?',
    options: ['Tracking ships', 'Imaging Earth\'s land surface', 'Studying the Moon', 'Monitoring asteroids'],
    correct: 'Imaging Earth\'s land surface',
    funFact: 'Landsat provides the longest continuous space-based record of Earth\'s land surface. This 50+ year archive helps track deforestation, urban growth, and climate change.',
  },
  // ─── Deep Space Probes ────────────────────────────────────
  {
    question: 'Which probe orbited Saturn for 13 years?',
    options: ['Pioneer 11', 'Juno', 'Cassini', 'Galileo'],
    correct: 'Cassini',
    funFact: 'Cassini orbited Saturn from 2004-2017 and discovered geysers on Enceladus, lakes on Titan, and new moons. It was deliberately crashed into Saturn to protect those moons from contamination.',
  },
  {
    question: 'What is the Juno spacecraft studying?',
    options: ['Mars', 'Saturn', 'Jupiter', 'The Sun'],
    correct: 'Jupiter',
    funFact: 'Juno arrived at Jupiter in 2016 and has revealed that Jupiter\'s interior is more complex than expected, with a "fuzzy" core rather than a solid one.',
  },
  {
    question: 'Which probe visited the dwarf planet Ceres?',
    options: ['Dawn', 'New Horizons', 'MESSENGER', 'Deep Impact'],
    correct: 'Dawn',
    funFact: 'Dawn was unique in that it orbited two different bodies (asteroid Vesta and dwarf planet Ceres) using ion propulsion. It discovered bright spots on Ceres that are salt deposits.',
  },
  {
    question: 'What planet did MESSENGER orbit?',
    options: ['Venus', 'Mercury', 'Mars', 'Jupiter'],
    correct: 'Mercury',
    funFact: 'MESSENGER orbited Mercury from 2011-2015, mapping its entire surface and discovering water ice in permanently shadowed craters near the poles despite surface temps reaching 430°C.',
  },
  {
    question: 'Which probe was the first to fly through a comet\'s tail?',
    options: ['Rosetta', 'Stardust', 'Deep Space 1', 'ICE'],
    correct: 'ICE',
    funFact: 'The International Cometary Explorer (ICE) flew through Comet Giacobini-Zinner\'s tail in 1985, becoming the first spacecraft to directly investigate a comet.',
  },
  {
    question: 'What did the Huygens probe land on?',
    options: ['Mars', 'Enceladus', 'Titan', 'Europa'],
    correct: 'Titan',
    funFact: 'Huygens landed on Saturn\'s moon Titan in January 2005 — the most distant landing ever achieved. It found a landscape with methane rivers, lakes, and rain.',
  },
  // ─── More Planet Features ─────────────────────────────────
  {
    question: 'Which moon in the solar system has active volcanoes?',
    options: ['Europa', 'Titan', 'Io', 'Ganymede'],
    correct: 'Io',
    funFact: 'Jupiter\'s moon Io is the most volcanically active body in the solar system, with over 400 active volcanoes. Tidal heating from Jupiter\'s gravity drives this activity.',
  },
  {
    question: 'Which moon likely has a subsurface ocean that could harbor life?',
    options: ['Phobos', 'Deimos', 'Europa', 'Miranda'],
    correct: 'Europa',
    funFact: 'Europa\'s ocean beneath its icy crust may contain twice as much water as all of Earth\'s oceans combined. NASA\'s Europa Clipper mission launched in 2024 to investigate.',
  },
  {
    question: 'What is the largest moon in the solar system?',
    options: ['Titan', 'Ganymede', 'Callisto', 'Triton'],
    correct: 'Ganymede',
    funFact: 'Ganymede is larger than the planet Mercury with a diameter of 5,268 km. It\'s also the only moon with its own magnetic field.',
  },
  {
    question: 'Which planet spins backwards (retrograde rotation)?',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correct: 'Venus',
    funFact: 'Venus rotates clockwise (retrograde) so slowly that its day (243 Earth days) is longer than its year (225 Earth days). The Sun rises in the west on Venus.',
  },
  {
    question: 'What are Saturn\'s rings primarily made of?',
    options: ['Rock and metal', 'Ice and rock', 'Gas and dust', 'Pure ice'],
    correct: 'Ice and rock',
    funFact: 'Saturn\'s rings are 99.9% water ice with traces of rocky material. Ring particles range from microscopic grains to boulders several meters across.',
  },
  {
    question: 'Which planet has the shortest day?',
    options: ['Mercury', 'Earth', 'Jupiter', 'Mars'],
    correct: 'Jupiter',
    funFact: 'Jupiter completes one rotation in just 9 hours and 56 minutes despite being the largest planet. This rapid spin causes it to bulge at the equator.',
  },
  {
    question: 'What is the Kuiper Belt?',
    options: ['A ring around Saturn', 'A region beyond Neptune with icy bodies', 'An asteroid field near Mars', 'A radiation belt around Earth'],
    correct: 'A region beyond Neptune with icy bodies',
    funFact: 'The Kuiper Belt extends from about 30 to 55 AU from the Sun. It contains hundreds of thousands of icy bodies and is home to Pluto, Eris, and Makemake.',
  },
  {
    question: 'What is the Oort Cloud?',
    options: ['A nebula near our Sun', 'A theoretical sphere of comets surrounding the solar system', 'A dust cloud on Mars', 'A cloud layer on Jupiter'],
    correct: 'A theoretical sphere of comets surrounding the solar system',
    funFact: 'The Oort Cloud is thought to extend up to 100,000 AU from the Sun (nearly 2 light-years). Long-period comets originate here when gravitationally disturbed.',
  },
  {
    question: 'How long does light take to travel from the Sun to Earth?',
    options: ['1 minute', '4 minutes', '8 minutes', '15 minutes'],
    correct: '8 minutes',
    funFact: 'Light takes about 8 minutes and 20 seconds to travel from the Sun to Earth (about 150 million km). This means we always see the Sun as it was 8 minutes ago.',
  },
  {
    question: 'Which moon has geysers that spray water into space?',
    options: ['Titan', 'Enceladus', 'Triton', 'Miranda'],
    correct: 'Enceladus',
    funFact: 'Enceladus shoots jets of water ice from its south pole through cracks called "tiger stripes." Cassini flew through these plumes and detected organic molecules.',
  },
  // ─── More Rockets & Missions ──────────────────────────────
  {
    question: 'What was the first reusable spacecraft?',
    options: ['Gemini', 'Space Shuttle', 'Soyuz', 'Dragon'],
    correct: 'Space Shuttle',
    funFact: 'The Space Shuttle first flew in 1981 and completed 135 missions over 30 years. The orbiter and solid rocket boosters were reusable; only the external tank was expendable.',
  },
  {
    question: 'Which rocket is used to launch astronauts to the ISS from Russia?',
    options: ['Proton', 'Angara', 'Soyuz', 'Zenit'],
    correct: 'Soyuz',
    funFact: 'The Soyuz rocket family has been flying since 1966 and is the most frequently launched rocket in history with over 1,900 flights. It\'s remarkably reliable.',
  },
  {
    question: 'What was NASA\'s first successful Mars rover?',
    options: ['Curiosity', 'Spirit', 'Sojourner', 'Opportunity'],
    correct: 'Sojourner',
    funFact: 'Sojourner landed on Mars in 1997 as part of the Mars Pathfinder mission. It was only the size of a microwave oven and operated for 83 sols (Martian days).',
  },
  {
    question: 'How long did the Opportunity rover operate on Mars?',
    options: ['90 days', '6 years', '10 years', '15 years'],
    correct: '15 years',
    funFact: 'Opportunity was designed for a 90-day mission but lasted from 2004 to 2018 — over 15 years. A massive dust storm finally cut off its solar power, ending contact.',
  },
  {
    question: 'What was special about the SpaceX Crew Dragon Demo-2 mission?',
    options: ['First Mars landing', 'First commercial crew to ISS', 'First space tourist', 'First lunar orbit'],
    correct: 'First commercial crew to ISS',
    funFact: 'Demo-2 in May 2020 was the first crewed orbital spaceflight launched from the US since the Space Shuttle retired in 2011, and the first by a commercial provider.',
  },
  {
    question: 'What is the name of NASA\'s Mars helicopter?',
    options: ['Dragonfly', 'Ingenuity', 'Phoenix', 'Scout'],
    correct: 'Ingenuity',
    funFact: 'Ingenuity made the first powered controlled flight on another planet on April 19, 2021. Designed for 5 flights, it completed 72 before a rotor blade was damaged in 2024.',
  },
  {
    question: 'Which probe took the first close-up photos of Pluto?',
    options: ['Voyager 2', 'Pioneer 10', 'New Horizons', 'Dawn'],
    correct: 'New Horizons',
    funFact: 'New Horizons flew by Pluto on July 14, 2015, revealing a surprisingly complex world with mountains, glaciers, and a heart-shaped nitrogen ice plain called Tombaugh Regio.',
  },
  {
    question: 'What is SpaceX\'s Raptor engine fueled by?',
    options: ['Hydrogen and oxygen', 'Methane and oxygen', 'Kerosene and oxygen', 'Hydrazine'],
    correct: 'Methane and oxygen',
    funFact: 'Raptor uses liquid methane/oxygen in a full-flow staged combustion cycle. Methane was chosen partly because it can theoretically be manufactured on Mars from CO2 and water.',
  },
  // ─── Additional Space Records & Facts ─────────────────────
  {
    question: 'Who was the first woman in space?',
    options: ['Sally Ride', 'Valentina Tereshkova', 'Mae Jemison', 'Svetlana Savitskaya'],
    correct: 'Valentina Tereshkova',
    funFact: 'Valentina Tereshkova flew on Vostok 6 in June 1963, orbiting Earth 48 times over 3 days. She remains the only woman to have done a solo spaceflight.',
  },
  {
    question: 'What is a Lagrange point?',
    options: ['A point where gravity cancels out between two bodies', 'A type of orbit around Jupiter', 'The edge of the solar system', 'A landing site on Mars'],
    correct: 'A point where gravity cancels out between two bodies',
    funFact: 'There are 5 Lagrange points in any two-body system. The James Webb Space Telescope orbits the Sun-Earth L2 point, 1.5 million km from Earth.',
  },
  {
    question: 'What year did the James Webb Space Telescope launch?',
    options: ['2019', '2020', '2021', '2022'],
    correct: '2021',
    funFact: 'JWST launched on December 25, 2021, after 25 years of development. Its 6.5-meter gold-coated mirror can see the first galaxies that formed after the Big Bang.',
  },
  {
    question: 'What is the Kármán line?',
    options: ['The edge of the solar system', 'The boundary of space at 100 km altitude', 'The event horizon of a black hole', 'Mars\' equator'],
    correct: 'The boundary of space at 100 km altitude',
    funFact: 'The Kármán line at 100 km is the internationally recognized boundary of space. Above this altitude, the atmosphere is too thin for aerodynamic flight.',
  },
  {
    question: 'Which was the first private company to send humans to orbit?',
    options: ['Virgin Galactic', 'Blue Origin', 'SpaceX', 'Orbital Sciences'],
    correct: 'SpaceX',
    funFact: 'SpaceX\'s Crew Dragon Demo-2 in May 2020 made SpaceX the first private company to send astronauts to orbit, breaking a paradigm where only governments achieved crewed orbital flight.',
  },
  {
    question: 'What did the Rosetta mission accomplish?',
    options: ['First asteroid landing', 'First comet orbit and landing', 'First Jupiter flyby', 'First Mercury orbit'],
    correct: 'First comet orbit and landing',
    funFact: 'ESA\'s Rosetta orbited Comet 67P/Churyumov-Gerasimenko and deployed the Philae lander in November 2014 — the first spacecraft to orbit and land on a comet.',
  },
  {
    question: 'How many Space Shuttle orbiters were built for spaceflight?',
    options: ['3', '4', '5', '6'],
    correct: '5',
    funFact: 'Five flight-capable orbiters were built: Columbia, Challenger, Discovery, Atlantis, and Endeavour. Enterprise was a test vehicle that never reached space.',
  },
  {
    question: 'What is the Van Allen radiation belt?',
    options: ['A ring around Saturn', 'Radiation zones trapped by Earth\'s magnetic field', 'Solar wind boundary', 'A nebula'],
    correct: 'Radiation zones trapped by Earth\'s magnetic field',
    funFact: 'The Van Allen belts are two zones of energetic charged particles held by Earth\'s magnetosphere. Apollo astronauts had to pass through them quickly to minimize radiation exposure.',
  },
  {
    question: 'Which space telescope observes in X-ray wavelengths?',
    options: ['Hubble', 'James Webb', 'Chandra', 'Spitzer'],
    correct: 'Chandra',
    funFact: 'NASA\'s Chandra X-ray Observatory has been operating since 1999, revealing the universe in X-rays — showing black holes, supernova remnants, and galaxy clusters.',
  },
  {
    question: 'What is orbital debris (space junk)?',
    options: ['Natural meteoroids', 'Human-made objects no longer serving a purpose in orbit', 'Comet tails', 'Asteroid fragments'],
    correct: 'Human-made objects no longer serving a purpose in orbit',
    funFact: 'There are over 36,000 tracked pieces of debris larger than 10 cm in orbit, and millions of smaller pieces. They travel at ~28,000 km/h, making even paint flecks dangerous.',
  },
  {
    question: 'What was the first animal sent into orbit?',
    options: ['Ham the chimp', 'Laika the dog', 'Fruit flies', 'Felix the cat'],
    correct: 'Laika the dog',
    funFact: 'Laika, a stray dog from Moscow, was launched aboard Sputnik 2 on November 3, 1957. Sadly, she died from overheating within hours. Fruit flies were first in space (1947) but not orbit.',
  },
  {
    question: 'What is aerobraking?',
    options: ['Landing with parachutes', 'Using atmospheric drag to slow a spacecraft and change orbit', 'Firing reverse thrusters', 'Using gravity assists'],
    correct: 'Using atmospheric drag to slow a spacecraft and change orbit',
    funFact: 'Aerobraking saves fuel by using a planet\'s atmosphere to gradually slow down. Mars orbiters like MRO used it to change from elliptical to circular orbits over months.',
  },
  {
    question: 'Which Indian mission successfully reached Mars orbit on its first attempt?',
    options: ['Chandrayaan-1', 'Mangalyaan (MOM)', 'Gaganyaan', 'Aditya-L1'],
    correct: 'Mangalyaan (MOM)',
    funFact: 'India\'s Mars Orbiter Mission reached Mars in 2014 on a budget of just $74 million — less than the budget of the movie "Gravity." India was the first country to succeed on its first Mars attempt.',
  },
  {
    question: 'What does the acronym EVA stand for in spaceflight?',
    options: ['External Vehicle Adapter', 'Extra-Vehicular Activity', 'Earth-Venus Alignment', 'Emergency Vent Assembly'],
    correct: 'Extra-Vehicular Activity',
    funFact: 'An EVA is commonly called a spacewalk. The first EVA was performed by Soviet cosmonaut Alexei Leonov on March 18, 1965, lasting 12 minutes outside Voskhod 2.',
  },
  {
    question: 'What is a gravity assist (slingshot maneuver)?',
    options: ['Landing on a planet', 'Using a planet\'s gravity to change speed and direction', 'Artificial gravity on stations', 'Launching from a gravity well'],
    correct: 'Using a planet\'s gravity to change speed and direction',
    funFact: 'Gravity assists allow spacecraft to gain (or lose) speed without using fuel. Voyager 2 used assists from Jupiter, Saturn, and Uranus to reach Neptune.',
  },
  {
    question: 'What is the name of the boundary where the solar wind meets interstellar space?',
    options: ['Heliosphere', 'Heliopause', 'Magnetopause', 'Thermosphere'],
    correct: 'Heliopause',
    funFact: 'The heliopause is where the Sun\'s solar wind is stopped by interstellar medium. Voyager 1 crossed it in 2012 at about 121 AU from the Sun.',
  },
  // ─── Additional Space Coverage (Batch 2) ──────────────────
  {
    question: 'What is the Artemis program\'s goal?',
    options: ['Send rovers to Mars', 'Return humans to the Moon', 'Build a telescope', 'Launch satellites'],
    correct: 'Return humans to the Moon',
    funFact: 'NASA\'s Artemis program aims to land the first woman and first person of color on the Moon, establish a sustainable presence, and prepare for Mars missions.',
  },
  {
    question: 'What is the Gateway in NASA\'s plans?',
    options: ['A Mars base', 'A lunar-orbiting space station', 'A rocket engine', 'An asteroid defense system'],
    correct: 'A lunar-orbiting space station',
    funFact: 'Gateway will be a small space station in lunar orbit serving as a staging point for Moon landings and eventually deep space missions. It will have about 1/6 the volume of the ISS.',
  },
  {
    question: 'What is SpaceX\'s Starlink?',
    options: ['A Mars rover', 'A constellation of internet satellites', 'A rocket booster', 'A space telescope'],
    correct: 'A constellation of internet satellites',
    funFact: 'Starlink aims to provide global broadband internet from thousands of small satellites in low Earth orbit. By 2024, over 5,000 Starlink satellites were operational.',
  },
  {
    question: 'What fuel did the Saturn V first stage use?',
    options: ['Liquid hydrogen', 'RP-1 (kerosene)', 'Methane', 'Solid fuel'],
    correct: 'RP-1 (kerosene)',
    funFact: 'Saturn V\'s first stage (S-IC) burned RP-1 kerosene with liquid oxygen. Its five F-1 engines consumed 15 tons of propellant per second.',
  },
  {
    question: 'What is the ISS\'s orbital altitude?',
    options: ['200 km', '408 km', '700 km', '1,000 km'],
    correct: '408 km',
    funFact: 'The ISS orbits at about 408 km altitude, completing one orbit every 90 minutes. This means astronauts see 16 sunrises and sunsets every day.',
  },
  {
    question: 'Which space agency launched the first successful Mars rover (Sojourner)?',
    options: ['ESA', 'JAXA', 'NASA', 'ISRO'],
    correct: 'NASA',
    funFact: 'NASA\'s Sojourner rover, part of Mars Pathfinder, landed on July 4, 1997. It was designed for 7 days but operated for 83, traveling about 100 meters total.',
  },
  {
    question: 'What is a polar orbit?',
    options: ['Orbit around the poles of Jupiter', 'Orbit passing over Earth\'s north and south poles', 'Orbit of asteroids', 'Orbit at the equator'],
    correct: 'Orbit passing over Earth\'s north and south poles',
    funFact: 'Polar orbits pass over both poles as Earth rotates beneath, eventually covering the entire surface. They\'re ideal for Earth observation and weather satellites.',
  },
  {
    question: 'What is geostationary orbit?',
    options: ['Any orbit around Earth', 'An orbit where a satellite stays above the same point on Earth', 'An orbit around the Moon', 'A very low orbit'],
    correct: 'An orbit where a satellite stays above the same point on Earth',
    funFact: 'Geostationary orbit is at exactly 35,786 km above the equator. At this altitude, orbital period matches Earth\'s rotation (24 hrs), so the satellite appears stationary.',
  },
  {
    question: 'What is ISRO\'s Chandrayaan-3 known for?',
    options: ['First Mars orbiter', 'First successful lunar south pole landing', 'First Indian astronaut', 'First solar probe'],
    correct: 'First successful lunar south pole landing',
    funFact: 'India\'s Chandrayaan-3 landed near the lunar south pole on August 23, 2023, making India the first country to land in this region and only the fourth to soft-land on the Moon.',
  },
  {
    question: 'What is the Perseverance rover\'s main mission?',
    options: ['Map Mars from orbit', 'Search for signs of ancient microbial life', 'Mine Martian minerals', 'Test human habitation'],
    correct: 'Search for signs of ancient microbial life',
    funFact: 'Perseverance landed in Jezero Crater in 2021, an ancient lake bed. It collects rock samples that will be returned to Earth by a future mission for detailed analysis.',
  },
  {
    question: 'What did the OSIRIS-REx mission accomplish?',
    options: ['Landed on Mars', 'Collected and returned a sample from asteroid Bennu', 'Orbited Jupiter', 'Photographed Pluto'],
    correct: 'Collected and returned a sample from asteroid Bennu',
    funFact: 'OSIRIS-REx returned about 121 grams of material from asteroid Bennu in September 2023 — the largest asteroid sample ever collected by a spacecraft.',
  },
  {
    question: 'What is the Parker Solar Probe studying?',
    options: ['Mars atmosphere', 'The Sun\'s outer corona', 'Jupiter\'s moons', 'Asteroids'],
    correct: 'The Sun\'s outer corona',
    funFact: 'Parker Solar Probe "touches" the Sun by flying through its corona at temperatures exceeding 1 million°C, protected by a carbon-composite heat shield.',
  },
  {
    question: 'How many people have walked on the Moon?',
    options: ['6', '8', '12', '14'],
    correct: '12',
    funFact: 'All 12 moonwalkers were American men who landed during Apollo missions 11, 12, 14, 15, 16, and 17 between 1969 and 1972. Apollo 13 never landed due to its accident.',
  },
  {
    question: 'What is Delta-v in spaceflight?',
    options: ['A rocket company', 'Change in velocity needed for a maneuver', 'A type of orbit', 'Speed of light fraction'],
    correct: 'Change in velocity needed for a maneuver',
    funFact: 'Delta-v is the fundamental measure of how "hard" a space maneuver is. Getting to low Earth orbit requires about 9.4 km/s of delta-v — most of a rocket\'s total capability.',
  },
  {
    question: 'What is the Tsiolkovsky rocket equation?',
    options: ['E=mc²', 'The relationship between delta-v, exhaust velocity, and mass ratio', 'How to calculate orbits', 'Fuel efficiency formula'],
    correct: 'The relationship between delta-v, exhaust velocity, and mass ratio',
    funFact: 'Published in 1903, this equation shows why rockets need so much fuel — the relationship is logarithmic, meaning doubling your speed requires exponentially more fuel.',
  },
  {
    question: 'What country launched the first space station crew that stayed over a year?',
    options: ['USA', 'China', 'Soviet Union/Russia', 'Japan'],
    correct: 'Soviet Union/Russia',
    funFact: 'Russia has dominated long-duration spaceflight records. Multiple Russian cosmonauts have spent over a year continuously in space, all aboard Mir or the ISS.',
  },
  {
    question: 'What is an ion thruster?',
    options: ['A fictional engine', 'A propulsion system using ionized gas for high-efficiency thrust', 'A nuclear engine', 'A chemical rocket'],
    correct: 'A propulsion system using ionized gas for high-efficiency thrust',
    funFact: 'Ion thrusters produce very small thrust but are incredibly fuel-efficient (high specific impulse). They accelerate gradually, making them ideal for long deep-space missions like Dawn.',
  },
  {
    question: 'What is Rocket Lab known for?',
    options: ['Mars missions', 'Small satellite launches with the Electron rocket', 'Space tourism', 'Building the ISS'],
    correct: 'Small satellite launches with the Electron rocket',
    funFact: 'New Zealand-based Rocket Lab offers affordable launches for small satellites. Their Electron rocket uses 3D-printed Rutherford engines and they\'re developing the larger Neutron rocket.',
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
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
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

// ─── Main Page ────────────────────────────────────────────
export default function SpaceQuizPage() {
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
    const saved = localStorage.getItem('space-quiz-best')
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

  // Timer
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
      const points = timeBonus ? 2 : 1
      setScore(prev => prev + points)
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
        localStorage.setItem('space-quiz-best', String(score))
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
    const text = `I scored ${correctCount}/10 on the DateAndTimezone Space Trivia quiz! Can you beat me? https://www.dateandtimezone.com/quiz/space`
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-6">
              <Rocket className="w-10 h-10 text-orange-400" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Space Trivia
            </h1>
            <p className="text-muted text-lg max-w-md mx-auto">
              How well do you know space? 15 questions about planets, missions, and astronauts.
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
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${timerMode === 'timed' ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300' : 'border border-card-border text-muted hover:text-white'}`}
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
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${timerSeconds === s ? 'bg-orange-500 text-white' : 'border border-card-border text-muted hover:text-white'}`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 font-heading font-semibold text-white text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Start Quiz (10 random questions)
          </button>

          <div className="mt-8 p-6 rounded-xl bg-card-bg border border-card-border">
            <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              How to Play
            </h3>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2"><span className="text-orange-400 font-bold">1.</span>Each question has 4 answer options</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 font-bold">2.</span>You have 10 seconds per question</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 font-bold">3.</span>Answer within 5 seconds for a speed bonus (+2 instead of +1)</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 font-bold">4.</span>Learn fun facts after each answer!</li>
            </ul>
          </div>

          <Link href="/quiz" className="flex items-center justify-center gap-2 mt-6 text-muted hover:text-[#E2E8F0] transition-colors font-heading font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
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
          {/* Header Stats */}
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

          {/* Question Card */}
          <div className="mt-8 p-8 rounded-2xl bg-card-bg border border-card-border text-center">
            <div className="text-muted text-sm uppercase tracking-wider mb-2">Question {currentQ + 1}</div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">{q.question}</h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {shuffledOptions.map((option, idx) => {
              let btnStyle = 'bg-card-bg border-card-border hover:border-orange-500/50 hover:bg-orange-500/10'
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

          {/* Feedback */}
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2">{correctCount}/10</h1>
          <p className="text-muted text-lg">
            {correctCount >= 9 ? 'Space Expert!' : correctCount >= 7 ? 'Great job!' : correctCount >= 5 ? 'Not bad!' : 'Keep exploring!'}
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
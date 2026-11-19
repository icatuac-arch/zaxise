"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Rocket,
  Calendar,
  Shuffle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  Satellite,
  Moon,
  Globe,
  Telescope,
  AlertTriangle,
  Award,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | "Moon"
  | "Mars"
  | "Space Station"
  | "Shuttle"
  | "Satellite"
  | "Discovery"
  | "Tragedy"
  | "First";

interface SpaceEvent {
  year: number;
  title: string;
  description: string;
  category: Category;
}

/* ------------------------------------------------------------------ */
/*  CATEGORY STYLING                                                   */
/* ------------------------------------------------------------------ */

const categoryConfig: Record<
  Category,
  { icon: typeof Rocket; color: string; bg: string }
> = {
  Moon: { icon: Moon, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  Mars: { icon: Flame, color: "text-red-400", bg: "bg-red-400/10" },
  "Space Station": { icon: Globe, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  Shuttle: { icon: Rocket, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  Satellite: {
    icon: Satellite,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  Discovery: {
    icon: Telescope,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  Tragedy: {
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  First: { icon: Award, color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

/* ------------------------------------------------------------------ */
/*  SPACE EVENTS DATABASE  (key = "MM-DD")                             */
/* ------------------------------------------------------------------ */

const spaceEvents: Record<string, SpaceEvent[]> = {
  // ── JANUARY ──
  "01-01": [
    { year: 2019, title: "New Horizons flies by Arrokoth", description: "NASA's New Horizons spacecraft performed the most distant flyby in history, passing the Kuiper Belt object Arrokoth (formerly Ultima Thule) at 6.5 billion km from Earth.", category: "Discovery" },
    { year: 1801, title: "Ceres discovered", description: "Giuseppe Piazzi discovered Ceres, the largest object in the asteroid belt. It was later reclassified as a dwarf planet in 2006.", category: "Discovery" },
  ],
  "01-02": [
    { year: 1959, title: "Luna 1 launched", description: "The Soviet Union launched Luna 1, the first spacecraft to reach the vicinity of the Moon. It passed within 5,995 km of the lunar surface.", category: "Moon" },
    { year: 2004, title: "Stardust encounters Comet Wild 2", description: "NASA's Stardust spacecraft flew through the coma of Comet Wild 2, collecting dust samples that were later returned to Earth.", category: "Discovery" },
  ],
  "01-03": [
    { year: 2004, title: "Spirit rover lands on Mars", description: "NASA's Spirit rover successfully landed on Mars in Gusev Crater. It operated for over six years, far exceeding its 90-day mission.", category: "Mars" },
    { year: 1999, title: "Mars Polar Lander launched", description: "NASA launched the Mars Polar Lander mission to study the Martian south pole. Unfortunately, contact was lost during landing.", category: "Mars" },
  ],
  "01-04": [
    { year: 2010, title: "Burj Khalifa opens — tallest structure on Earth", description: "While not a space event, the Burj Khalifa's 828m height brought humanity's structures closer to space than ever before. Astronauts on ISS can spot it easily.", category: "Discovery" },
    { year: 2004, title: "Spirit rover sends first images", description: "NASA's Spirit rover transmitted its first color images from the Martian surface, revealing the rocky landscape of Gusev Crater.", category: "Mars" },
  ],
  "01-05": [
    { year: 2005, title: "Eris discovered", description: "Astronomers announced the discovery of Eris, a dwarf planet more massive than Pluto. This discovery eventually led to Pluto's reclassification.", category: "Discovery" },
    { year: 1972, title: "Space Shuttle program announced", description: "President Nixon announced the development of the Space Shuttle, calling it a workhorse of space transportation.", category: "Shuttle" },
  ],
  "01-06": [
    { year: 1998, title: "Lunar Prospector launched", description: "NASA launched Lunar Prospector to orbit the Moon and map its surface composition. It detected hydrogen at the lunar poles, suggesting water ice.", category: "Moon" },
    { year: 2018, title: "Falcon Heavy static fire test", description: "SpaceX conducted a static fire test of all 27 Merlin engines on the Falcon Heavy at Kennedy Space Center, generating 5 million pounds of thrust.", category: "Satellite" },
  ],
  "01-07": [
    { year: 1610, title: "Galileo discovers Jupiter's moons", description: "Galileo Galilei observed three of Jupiter's four largest moons through his telescope. This was one of the most important astronomical discoveries in history.", category: "Discovery" },
    { year: 1968, title: "Surveyor 7 launched", description: "NASA launched Surveyor 7, the last of the Surveyor series to soft-land on the Moon, landing near the crater Tycho.", category: "Moon" },
  ],
  "01-08": [
    { year: 1973, title: "Luna 21 launched", description: "The Soviet Union launched Luna 21, which carried the Lunokhod 2 rover to the Moon. Lunokhod 2 traveled 39 km across the lunar surface.", category: "Moon" },
    { year: 1987, title: "Challenger crew honored", description: "The Challenger Center for Space Science Education was established to honor the crew of the Space Shuttle Challenger.", category: "Tragedy" },
  ],
  "01-09": [
    { year: 1990, title: "STS-32 launches", description: "Space Shuttle Columbia launched on STS-32 to deploy the Syncom IV-5 satellite and retrieve the Long Duration Exposure Facility from orbit.", category: "Shuttle" },
    { year: 2006, title: "New Horizons preparations", description: "Final preparations were underway for the launch of NASA's New Horizons mission to Pluto, scheduled for later in January.", category: "Discovery" },
  ],
  "01-10": [
    { year: 1946, title: "First radar contact with the Moon", description: "The U.S. Army Signal Corps bounced radar signals off the Moon and detected the return signal, proving radar could reach celestial bodies.", category: "Moon" },
    { year: 2015, title: "SpaceX CRS-5 landing attempt", description: "SpaceX attempted to land a Falcon 9 first stage on a drone ship for the first time. The rocket reached the ship but landed hard.", category: "Satellite" },
  ],
  "01-11": [
    { year: 1996, title: "STS-72 launches", description: "Space Shuttle Endeavour launched on STS-72 to retrieve the Japanese Space Flyer Unit and conduct spacewalks testing ISS assembly techniques.", category: "Shuttle" },
    { year: 2005, title: "Deep Impact launched", description: "NASA launched the Deep Impact mission to study comet Tempel 1 by firing a copper impactor into its surface.", category: "Discovery" },
  ],
  "01-12": [
    { year: 2005, title: "Deep Impact launched to comet", description: "NASA's Deep Impact spacecraft launched to intercept comet Tempel 1. It later impacted the comet's nucleus on July 4, 2005.", category: "Discovery" },
    { year: 1997, title: "STS-81 launches", description: "Space Shuttle Atlantis launched on STS-81, the fifth Shuttle-Mir docking mission, transferring crew and supplies.", category: "Shuttle" },
  ],
  "01-13": [
    { year: 1993, title: "STS-54 launches", description: "Space Shuttle Endeavour launched on STS-54, deploying a TDRS satellite and conducting a spacewalk.", category: "Shuttle" },
    { year: 1978, title: "NASA selects first female astronauts", description: "NASA announced its first class of astronaut candidates to include women, with Sally Ride, Judith Resnik, and four others selected.", category: "First" },
  ],
  "01-14": [
    { year: 2005, title: "Huygens lands on Titan", description: "ESA's Huygens probe successfully landed on Saturn's moon Titan, becoming the first spacecraft to land in the outer Solar System. It transmitted data for 72 minutes.", category: "First" },
    { year: 2008, title: "MESSENGER flies by Mercury", description: "NASA's MESSENGER spacecraft made its first flyby of Mercury, capturing close-up images of previously unseen terrain.", category: "Discovery" },
  ],
  "01-15": [
    { year: 2006, title: "Stardust returns comet samples", description: "NASA's Stardust spacecraft returned samples of comet Wild 2 to Earth in a capsule that landed in Utah. It was the first comet sample return mission.", category: "First" },
    { year: 2017, title: "SpaceX returns to flight", description: "SpaceX launched a Falcon 9 from Vandenberg Air Force Base carrying Iridium satellites, the first mission after the September 2016 launchpad explosion.", category: "Satellite" },
  ],
  "01-16": [
    { year: 2003, title: "Space Shuttle Columbia's final launch", description: "Space Shuttle Columbia launched on STS-107 for a 16-day science mission. Tragically, it would break apart during reentry on February 1.", category: "Shuttle" },
    { year: 1969, title: "Soyuz 4 and 5 dock", description: "Soviet spacecraft Soyuz 4 and Soyuz 5 performed the first docking of two crewed spacecraft, with cosmonauts transferring between them via spacewalk.", category: "First" },
  ],
  "01-17": [
    { year: 2016, title: "SpaceX barge landing attempt", description: "SpaceX attempted another ocean drone ship landing of the Falcon 9 first stage during the Jason-3 mission. A landing leg failed to lock.", category: "Satellite" },
    { year: 2002, title: "Last Delta II launches GPS satellite", description: "A Delta II rocket launched the final Block IIR GPS satellite, continuing the modernization of the Global Positioning System constellation.", category: "Satellite" },
  ],
  "01-18": [
    { year: 2005, title: "ESA's SMART-1 enters Moon orbit", description: "ESA's SMART-1 lunar orbiter completed its journey using ion propulsion, entering lunar orbit to study the Moon's composition.", category: "Moon" },
    { year: 1990, title: "Chinese Long March 3 failure", description: "A Chinese Long March 3 rocket failed to place the AsiaSat 1 communications satellite into orbit, highlighting the challenges of early Chinese space launches.", category: "Satellite" },
  ],
  "01-19": [
    { year: 2006, title: "New Horizons launched to Pluto", description: "NASA launched New Horizons, the fastest spacecraft ever launched, on a 9.5-year journey to Pluto. It would arrive in July 2015.", category: "Discovery" },
    { year: 1965, title: "Gemini 2 test flight", description: "NASA conducted the unmanned Gemini 2 suborbital test flight to verify the spacecraft's heat shield design.", category: "First" },
  ],
  "01-20": [
    { year: 1966, title: "First rocket launch from Kourou", description: "The first rocket was launched from the Guiana Space Centre in Kourou, French Guiana, which would become ESA's primary launch site.", category: "Satellite" },
    { year: 2014, title: "Rosetta wakes up", description: "ESA's Rosetta spacecraft woke from a 31-month hibernation as it approached comet 67P/Churyumov-Gerasimenko.", category: "Discovery" },
  ],
  "01-21": [
    { year: 1960, title: "First Mercury-Redstone test", description: "NASA conducted the first test launch of the Mercury-Redstone combination at Cape Canaveral, an early step toward human spaceflight.", category: "First" },
    { year: 2019, title: "Total lunar eclipse — Super Blood Wolf Moon", description: "A total lunar eclipse visible from the Americas produced a dramatic red-colored Moon, popularly called the Super Blood Wolf Moon.", category: "Moon" },
  ],
  "01-22": [
    { year: 2003, title: "Last signal from Pioneer 10", description: "NASA received the last successful telemetry from Pioneer 10, the first spacecraft to traverse the asteroid belt and fly by Jupiter. It was 12 billion km away.", category: "Discovery" },
    { year: 1992, title: "STS-42 launches", description: "Space Shuttle Discovery launched on STS-42 carrying the International Microgravity Laboratory, performing over 50 experiments.", category: "Shuttle" },
  ],
  "01-23": [
    { year: 2003, title: "Pioneer 10 final signal confirmed", description: "Scientists confirmed Pioneer 10's final weak signal, ending over 30 years of communication with the probe now heading toward Aldebaran.", category: "Discovery" },
    { year: 1986, title: "Voyager 2 Uranus flyby", description: "Voyager 2 made its closest approach to Uranus, discovering 10 new moons and two new rings. It remains the only spacecraft to visit Uranus.", category: "First" },
  ],
  "01-24": [
    { year: 1986, title: "Voyager 2 closest to Uranus", description: "Voyager 2 came within 81,500 km of Uranus's cloud tops, revealing a magnetic field tilted 60 degrees from the planet's rotation axis.", category: "Discovery" },
    { year: 1985, title: "STS-51-C first DoD Shuttle mission", description: "Space Shuttle Discovery launched on STS-51-C, the first dedicated Department of Defense Space Shuttle mission.", category: "Shuttle" },
  ],
  "01-25": [
    { year: 2004, title: "Opportunity lands on Mars", description: "NASA's Opportunity rover landed in Eagle Crater on Mars, beginning a mission that would last nearly 15 years — far beyond its 90-day plan.", category: "Mars" },
    { year: 1994, title: "Clementine launched", description: "The Clementine spacecraft launched to orbit the Moon, producing the first detailed global topographic map and finding evidence of ice at the south pole.", category: "Moon" },
  ],
  "01-26": [
    { year: 1962, title: "Ranger 3 launched to Moon", description: "NASA launched Ranger 3 to impact the Moon and send back close-up photos. A guidance error caused it to miss the Moon by 36,000 km.", category: "Moon" },
    { year: 1978, title: "IUE satellite launched", description: "The International Ultraviolet Explorer satellite launched, becoming one of the most productive space observatories, operating for 18 years.", category: "Satellite" },
  ],
  "01-27": [
    { year: 1967, title: "Apollo 1 fire", description: "Astronauts Gus Grissom, Ed White, and Roger Chaffee perished in a fire during a launch pad test of the Apollo 1 spacecraft at Cape Kennedy. The tragedy led to major safety redesigns.", category: "Tragedy" },
    { year: 2020, title: "SpaceX Starlink launch", description: "SpaceX launched another batch of 60 Starlink satellites, continuing the build-out of its global internet constellation.", category: "Satellite" },
  ],
  "01-28": [
    { year: 1986, title: "Space Shuttle Challenger disaster", description: "Space Shuttle Challenger broke apart 73 seconds after launch, killing all seven crew members including teacher Christa McAuliffe. The cause was an O-ring failure in a solid rocket booster.", category: "Tragedy" },
    { year: 1958, title: "LEGO brick patented", description: "While not a space event, LEGO has since produced hundreds of space-themed sets inspiring future astronauts and engineers worldwide.", category: "Discovery" },
  ],
  "01-29": [
    { year: 1998, title: "AERCam Sprint tested", description: "Astronauts tested the AERCam Sprint, a free-flying robotic camera, during STS-87 — a prototype for future autonomous inspection systems.", category: "Space Station" },
    { year: 1964, title: "Saturn SA-5 launched", description: "NASA launched the Saturn I SA-5 rocket, the first to carry a live second stage. It was the heaviest object placed in orbit at that time.", category: "Satellite" },
  ],
  "01-30": [
    { year: 1964, title: "Ranger 6 launched", description: "NASA launched Ranger 6 to photograph the Moon before impact. Unfortunately, the cameras failed and no images were returned.", category: "Moon" },
    { year: 2005, title: "Cosmos 1 solar sail announced", description: "The Planetary Society announced plans to launch Cosmos 1, the first solar sail spacecraft, demonstrating light-pressure propulsion.", category: "Satellite" },
  ],
  "01-31": [
    { year: 1958, title: "Explorer 1 — first US satellite", description: "The United States launched Explorer 1 aboard a Juno I rocket, its first successful satellite. It discovered the Van Allen radiation belts surrounding Earth.", category: "First" },
    { year: 1971, title: "Apollo 14 launches", description: "Apollo 14 launched with Alan Shepard, Stuart Roosa, and Edgar Mitchell. Shepard would famously hit golf balls on the Moon.", category: "Moon" },
  ],

  // ── FEBRUARY ──
  "02-01": [
    { year: 2003, title: "Space Shuttle Columbia disaster", description: "Space Shuttle Columbia broke apart during reentry over Texas, killing all seven crew members. Damage to the thermal protection system from foam debris during launch was the cause.", category: "Tragedy" },
    { year: 2023, title: "Virgin Orbit final mission", description: "Virgin Orbit's LauncherOne rocket failed during a launch from Cornwall, UK, leading to the eventual end of the company's operations.", category: "Satellite" },
  ],
  "02-02": [
    { year: 1970, title: "First Titan IIIC success", description: "A Titan IIIC rocket launched NATO's first military communications satellite into orbit from Cape Canaveral.", category: "Satellite" },
    { year: 2002, title: "Envisat environmental satellite", description: "ESA prepared for the launch of Envisat, the largest civilian Earth observation satellite ever built at 8 tonnes.", category: "Satellite" },
  ],
  "02-03": [
    { year: 1966, title: "Luna 9 lands on Moon", description: "The Soviet Luna 9 became the first spacecraft to achieve a soft landing on the Moon and transmit photos from the surface. It proved the surface could support a lander.", category: "First" },
    { year: 1995, title: "STS-63 first female Shuttle pilot", description: "Eileen Collins became the first woman to pilot a Space Shuttle on STS-63, which also performed the first Shuttle-Mir rendezvous.", category: "First" },
  ],
  "02-04": [
    { year: 1998, title: "AsiaSat 3 stranded in orbit", description: "A Proton rocket stranded the AsiaSat 3 satellite in a useless orbit. It was later rescued by an innovative gravity-assist maneuver using the Moon.", category: "Satellite" },
    { year: 2021, title: "Perseverance Mars approach", description: "NASA's Perseverance rover performed final course corrections as it approached Mars, just weeks before its February 18 landing.", category: "Mars" },
  ],
  "02-05": [
    { year: 1971, title: "Apollo 14 Moon landing", description: "Alan Shepard and Edgar Mitchell landed on the Moon in the Fra Mauro highlands. Shepard became the oldest person to walk on the Moon at age 47.", category: "Moon" },
    { year: 1974, title: "Mariner 10 flies by Venus", description: "Mariner 10 used Venus's gravity to alter its course toward Mercury, taking stunning ultraviolet photos of Venus's cloud patterns.", category: "Discovery" },
  ],
  "02-06": [
    { year: 1971, title: "Alan Shepard hits golf ball on Moon", description: "During the Apollo 14 EVA, Alan Shepard attached a 6-iron head to a tool handle and hit two golf balls, calling it 'miles and miles and miles.'", category: "Moon" },
    { year: 2018, title: "Falcon Heavy maiden flight", description: "SpaceX launched the Falcon Heavy for the first time from Kennedy Space Center, sending Elon Musk's Tesla Roadster into a heliocentric orbit.", category: "First" },
  ],
  "02-07": [
    { year: 1984, title: "First untethered spacewalk", description: "Astronaut Bruce McCandless II performed the first untethered spacewalk using the Manned Maneuvering Unit during STS-41-B, floating freely 100 meters from the shuttle.", category: "First" },
    { year: 2001, title: "STS-98 Destiny lab module", description: "Space Shuttle Atlantis launched on STS-98 to deliver the Destiny laboratory module to the International Space Station.", category: "Space Station" },
  ],
  "02-08": [
    { year: 1974, title: "Skylab crew returns", description: "The final Skylab crew splashed down after 84 days in orbit, setting a new American space endurance record.", category: "Space Station" },
    { year: 2010, title: "STS-130 Tranquility module", description: "Space Shuttle Endeavour launched carrying the Tranquility module and the Cupola observation dome to the ISS.", category: "Space Station" },
  ],
  "02-09": [
    { year: 1986, title: "Halley's Comet perihelion", description: "Halley's Comet reached its closest approach to the Sun during its 1986 apparition. Multiple spacecraft were sent to study it.", category: "Discovery" },
    { year: 2020, title: "Solar Orbiter launched", description: "ESA and NASA launched Solar Orbiter to study the Sun's polar regions and the heliosphere from close range.", category: "Satellite" },
  ],
  "02-10": [
    { year: 2009, title: "First satellite collision in orbit", description: "The active Iridium 33 and defunct Cosmos 2251 satellites collided at 42,000 km/h over Siberia, creating thousands of debris fragments.", category: "Satellite" },
    { year: 1996, title: "NEAR spacecraft launched", description: "NASA launched the NEAR Shoemaker spacecraft, which would later become the first to orbit and land on an asteroid (433 Eros).", category: "First" },
  ],
  "02-11": [
    { year: 2010, title: "STS-130 Cupola delivered to ISS", description: "Space Shuttle Endeavour docked with the ISS to install the Cupola, the seven-windowed observation dome that provides stunning views of Earth.", category: "Space Station" },
    { year: 1997, title: "STS-82 services Hubble", description: "Space Shuttle Discovery launched on the second Hubble Space Telescope servicing mission, installing two new instruments.", category: "Shuttle" },
  ],
  "02-12": [
    { year: 2001, title: "NEAR Shoemaker lands on Eros", description: "NASA's NEAR Shoemaker became the first spacecraft to orbit and land on an asteroid, touching down on 433 Eros after a year in orbit.", category: "First" },
    { year: 1947, title: "Sikhote-Alin meteorite falls", description: "One of the largest meteorite showers in modern history rained iron fragments over eastern Siberia, leaving over 120 craters.", category: "Discovery" },
  ],
  "02-13": [
    { year: 2004, title: "Opportunity finds cross-bedding on Mars", description: "NASA's Opportunity rover discovered cross-bedded rock patterns in Eagle Crater, suggesting the area was once covered by flowing water.", category: "Mars" },
    { year: 2012, title: "Vega rocket maiden flight", description: "ESA's small Vega rocket successfully completed its maiden flight from French Guiana, carrying nine satellites.", category: "Satellite" },
  ],
  "02-14": [
    { year: 1990, title: "Voyager 1 Pale Blue Dot photo", description: "Voyager 1 turned its camera back toward Earth and captured the famous 'Pale Blue Dot' image from 6 billion km away, at Carl Sagan's request.", category: "Discovery" },
    { year: 2000, title: "NEAR enters Eros orbit", description: "The NEAR Shoemaker spacecraft entered orbit around asteroid 433 Eros, becoming the first spacecraft to orbit an asteroid.", category: "First" },
  ],
  "02-15": [
    { year: 2013, title: "Chelyabinsk meteor", description: "A 20-meter asteroid exploded over Chelyabinsk, Russia with 30 times the energy of the Hiroshima bomb. Over 1,600 people were injured by the shockwave.", category: "Discovery" },
    { year: 1999, title: "Stardust launched", description: "NASA launched Stardust to collect dust samples from comet Wild 2's coma and return them to Earth.", category: "Discovery" },
  ],
  "02-16": [
    { year: 1965, title: "Saturn SA-9 launched", description: "NASA launched the Saturn I SA-9 carrying the Pegasus 1 micrometeoroid detection satellite to study the space environment.", category: "Satellite" },
    { year: 2005, title: "Kyoto Protocol takes effect", description: "The Kyoto Protocol entered into force. Space-based Earth observation satellites play a critical role in monitoring climate change covered by the treaty.", category: "Satellite" },
  ],
  "02-17": [
    { year: 1996, title: "NEAR Shoemaker launched", description: "NASA launched NEAR Shoemaker, the first Discovery-class deep space mission, toward the asteroid 433 Eros.", category: "Discovery" },
    { year: 2007, title: "ISS Expedition 14 spacewalk", description: "ISS astronauts performed a spacewalk to retract a solar array and prepare for new modules arriving later that year.", category: "Space Station" },
  ],
  "02-18": [
    { year: 2021, title: "Perseverance lands on Mars", description: "NASA's Perseverance rover landed in Jezero Crater on Mars, beginning its mission to search for ancient microbial life and collect samples.", category: "Mars" },
    { year: 1930, title: "Pluto discovered", description: "Clyde Tombaugh discovered Pluto at Lowell Observatory. It was considered the ninth planet until 2006 when it was reclassified as a dwarf planet.", category: "Discovery" },
  ],
  "02-19": [
    { year: 1986, title: "Mir space station launched", description: "The Soviet Union launched the core module of the Mir space station, which would operate for 15 years and host international crews.", category: "Space Station" },
    { year: 2002, title: "Mars Odyssey begins science mission", description: "NASA's Mars Odyssey spacecraft began its primary science mapping mission after completing aerobraking to its final orbit.", category: "Mars" },
  ],
  "02-20": [
    { year: 1962, title: "John Glenn orbits Earth", description: "John Glenn became the first American to orbit Earth aboard Friendship 7, completing three orbits in nearly five hours. He became a national hero.", category: "First" },
    { year: 1965, title: "Ranger 8 impacts the Moon", description: "Ranger 8 transmitted over 7,000 close-up images of the Moon before impacting in the Sea of Tranquility, the future Apollo 11 landing area.", category: "Moon" },
  ],
  "02-21": [
    { year: 1995, title: "STS-63 Mir rendezvous", description: "Space Shuttle Discovery approached within 11 meters of Russia's Mir space station, the first Shuttle-Mir rendezvous.", category: "Shuttle" },
    { year: 2002, title: "HESSI solar observatory launched", description: "NASA launched the HESSI (later RHESSI) satellite to study solar flares using X-ray and gamma-ray imaging.", category: "Satellite" },
  ],
  "02-22": [
    { year: 1966, title: "Cosmos 110 — dogs in orbit", description: "The Soviet Union launched Cosmos 110 carrying dogs Veterok and Ugolyok, who spent 22 days in orbit — a record for living creatures in space at the time.", category: "First" },
    { year: 2017, title: "TRAPPIST-1 planets announced", description: "NASA announced the discovery of seven Earth-sized exoplanets orbiting the ultracool dwarf star TRAPPIST-1, with three in the habitable zone.", category: "Discovery" },
  ],
  "02-23": [
    { year: 1987, title: "Supernova 1987A observed", description: "Astronomers detected light from Supernova 1987A in the Large Magellanic Cloud, the closest observed supernova since 1604 and visible to the naked eye.", category: "Discovery" },
    { year: 1990, title: "Pioneer Venus Orbiter deorbits", description: "NASA's Pioneer Venus Orbiter ended its 14-year mission by burning up in Venus's atmosphere after mapping the planet's surface with radar.", category: "Discovery" },
  ],
  "02-24": [
    { year: 2007, title: "Rosetta flies by Mars", description: "ESA's Rosetta spacecraft performed a gravity-assist flyby of Mars on its way to comet 67P/Churyumov-Gerasimenko.", category: "Discovery" },
    { year: 2011, title: "STS-133 Discovery's final launch", description: "Space Shuttle Discovery launched on its final mission STS-133, delivering the Permanent Multipurpose Module to the ISS.", category: "Shuttle" },
  ],
  "02-25": [
    { year: 1991, title: "STS-39 launches (DoD mission)", description: "Space Shuttle Discovery launched on STS-39, the first unclassified Department of Defense mission studying the space environment.", category: "Shuttle" },
    { year: 2009, title: "OCO satellite launch failure", description: "NASA's Orbiting Carbon Observatory failed to reach orbit when its payload fairing didn't separate. A replacement, OCO-2, launched in 2014.", category: "Satellite" },
  ],
  "02-26": [
    { year: 1966, title: "First Saturn IB launch (AS-201)", description: "NASA conducted the first launch of the Saturn IB rocket, an unmanned suborbital test of the Apollo Command/Service Module.", category: "First" },
    { year: 2004, title: "Hubble Ultra Deep Field released", description: "NASA released the Hubble Ultra Deep Field image, showing approximately 10,000 galaxies in a tiny patch of sky in the constellation Fornax.", category: "Discovery" },
  ],
  "02-27": [
    { year: 2008, title: "Columbus module activated on ISS", description: "ESA's Columbus laboratory module was fully activated on the ISS, giving Europe a permanent research facility in space.", category: "Space Station" },
    { year: 1997, title: "GRB 970228 detected", description: "An Italian-Dutch satellite detected the first gamma-ray burst whose afterglow was observed, proving GRBs originated in distant galaxies.", category: "Discovery" },
  ],
  "02-28": [
    { year: 1959, title: "Discoverer 1 launched", description: "The US launched Discoverer 1, officially a science satellite but actually the first Corona spy satellite. It failed to achieve orbit properly.", category: "Satellite" },
    { year: 2007, title: "New Horizons Jupiter flyby", description: "NASA's New Horizons spacecraft flew by Jupiter, gaining a gravity boost that increased its speed by 14,000 km/h on the way to Pluto.", category: "Discovery" },
  ],
  "02-29": [
    { year: 1996, title: "Leap day in space", description: "Leap days in space have seen various missions continue their journeys. Astronauts aboard space stations have celebrated this rare calendar event in orbit.", category: "Space Station" },
    { year: 2020, title: "ISS Expedition on leap day", description: "ISS crew members marked the leap day with science experiments and a special acknowledgment of the rare date from 400 km above Earth.", category: "Space Station" },
  ],

  // ── MARCH ──
  "03-01": [
    { year: 1966, title: "Venera 3 impacts Venus", description: "The Soviet Venera 3 became the first spacecraft to reach another planet's surface, crashing into Venus. Communication was lost before landing.", category: "First" },
    { year: 1982, title: "Venera 13 lands on Venus", description: "The Soviet Venera 13 landed on Venus and survived 127 minutes in the extreme conditions, transmitting the first color photos of the Venusian surface.", category: "First" },
  ],
  "03-02": [
    { year: 1972, title: "Pioneer 10 launched", description: "NASA launched Pioneer 10, the first spacecraft to travel through the asteroid belt and make a direct observation of Jupiter.", category: "First" },
    { year: 2004, title: "Rosetta launched", description: "ESA launched the Rosetta spacecraft to rendezvous with and land on comet 67P/Churyumov-Gerasimenko, arriving 10 years later.", category: "Discovery" },
  ],
  "03-03": [
    { year: 1969, title: "Apollo 9 launches", description: "Apollo 9 launched on the first crewed test of the Lunar Module in Earth orbit, with astronauts McDivitt, Scott, and Schweickart.", category: "Moon" },
    { year: 2011, title: "Glory satellite launch failure", description: "NASA's Glory climate research satellite was lost when the Taurus XL rocket's fairing failed to separate during launch.", category: "Satellite" },
  ],
  "03-04": [
    { year: 2018, title: "SpaceX Hispansat launch", description: "SpaceX launched the Hispasat 30W-6 communications satellite aboard a Falcon 9 rocket from Cape Canaveral.", category: "Satellite" },
    { year: 1979, title: "Voyager 1 discovers Jupiter's rings", description: "Voyager 1 discovered Jupiter's faint ring system during its flyby. The rings are made of small, dark particles.", category: "Discovery" },
  ],
  "03-05": [
    { year: 1979, title: "Voyager 1 closest to Jupiter", description: "Voyager 1 made its closest approach to Jupiter at 349,000 km, discovering active volcanoes on Io and studying the Great Red Spot.", category: "Discovery" },
    { year: 1982, title: "Venera 14 lands on Venus", description: "The Soviet Venera 14 landed on Venus and survived 57 minutes, transmitting images and soil analysis data from the surface.", category: "First" },
  ],
  "03-06": [
    { year: 2009, title: "Kepler telescope launched", description: "NASA launched the Kepler Space Telescope to search for Earth-like exoplanets. It discovered over 2,600 confirmed planets during its mission.", category: "Discovery" },
    { year: 1986, title: "Vega 1 encounters Halley's Comet", description: "The Soviet Vega 1 spacecraft flew within 8,890 km of Halley's Comet, returning the first close-up images of a comet nucleus.", category: "Discovery" },
  ],
  "03-07": [
    { year: 1962, title: "OSO-1 launched", description: "NASA launched the first Orbiting Solar Observatory, beginning a series of satellites dedicated to studying the Sun from space.", category: "Satellite" },
    { year: 2009, title: "Kepler begins planet search", description: "Just a day after launch, the Kepler space telescope opened its dust cover and began calibrating to search for exoplanet transits.", category: "Discovery" },
  ],
  "03-08": [
    { year: 2001, title: "STS-102 Discovery to ISS", description: "Space Shuttle Discovery launched on STS-102, delivering the Expedition 2 crew and a Multi-Purpose Logistics Module to the ISS.", category: "Space Station" },
    { year: 1979, title: "Voyager 1 images Io volcanoes", description: "Voyager 1 captured images revealing active volcanic eruptions on Jupiter's moon Io, the first such discovery beyond Earth.", category: "Discovery" },
  ],
  "03-09": [
    { year: 1961, title: "Sputnik 9 carries space dog", description: "The Soviet Union launched Korabl-Sputnik 4 (Sputnik 9) carrying the dog Chernushka, who successfully returned to Earth.", category: "First" },
    { year: 2011, title: "Space Shuttle Discovery retires", description: "Space Shuttle Discovery landed for the final time after STS-133, ending a career of 39 missions spanning 27 years.", category: "Shuttle" },
  ],
  "03-10": [
    { year: 2006, title: "Mars Reconnaissance Orbiter arrives", description: "NASA's Mars Reconnaissance Orbiter entered Mars orbit to study the planet's atmosphere, surface, and subsurface with high-resolution cameras.", category: "Mars" },
    { year: 1977, title: "Rings of Uranus discovered", description: "Astronomers discovered rings around Uranus during a stellar occultation observation, the first ring system found since Saturn's.", category: "Discovery" },
  ],
  "03-11": [
    { year: 2008, title: "STS-123 delivers Kibo module", description: "Space Shuttle Endeavour launched on STS-123, delivering the first section of JAXA's Kibo laboratory and the Canadian Dextre robot to the ISS.", category: "Space Station" },
    { year: 2020, title: "WHO declares COVID pandemic", description: "The pandemic significantly impacted space operations worldwide, with launches delayed and ISS crew operations modified for quarantine.", category: "Discovery" },
  ],
  "03-12": [
    { year: 2015, title: "Dawn enters Ceres orbit", description: "NASA's Dawn spacecraft became the first to orbit a dwarf planet when it entered orbit around Ceres, revealing bright spots and a possible cryo-volcano.", category: "First" },
    { year: 1981, title: "Cosmos 1267 docked with Salyut 6", description: "The Soviet TKS spacecraft Cosmos 1267 docked with the Salyut 6 space station, testing docking systems for future station resupply.", category: "Space Station" },
  ],
  "03-13": [
    { year: 1986, title: "Giotto encounters Halley's Comet", description: "ESA's Giotto probe flew within 596 km of Halley's Comet nucleus, capturing the first close-up images showing jets of gas and dust.", category: "Discovery" },
    { year: 1989, title: "STS-29 Discovery launches TDRS", description: "Space Shuttle Discovery launched the fourth Tracking and Data Relay Satellite, expanding NASA's communication network.", category: "Shuttle" },
  ],
  "03-14": [
    { year: 2016, title: "ExoMars 2016 launched", description: "ESA and Roscosmos launched ExoMars 2016, carrying the Trace Gas Orbiter and Schiaparelli lander to study methane in Mars's atmosphere.", category: "Mars" },
    { year: 1879, title: "Albert Einstein born", description: "The birth of Albert Einstein, whose theories of special and general relativity revolutionized our understanding of space, time, and gravity.", category: "Discovery" },
  ],
  "03-15": [
    { year: 2004, title: "Sedna announced", description: "NASA announced the discovery of Sedna, one of the most distant known objects in the Solar System at roughly 13 billion km from the Sun.", category: "Discovery" },
    { year: 2009, title: "STS-119 delivers solar arrays to ISS", description: "Space Shuttle Discovery launched on STS-119, delivering the final set of solar arrays to complete the ISS's power grid.", category: "Space Station" },
  ],
  "03-16": [
    { year: 1966, title: "Gemini 8 docks in space", description: "Gemini 8 performed the first docking of two spacecraft in orbit when it linked with an Agena target vehicle. A thruster malfunction forced an emergency return.", category: "First" },
    { year: 1975, title: "Mariner 10 third Mercury flyby", description: "Mariner 10 made its third and final flyby of Mercury, mapping about 45% of the planet's surface.", category: "Discovery" },
  ],
  "03-17": [
    { year: 1958, title: "Vanguard 1 launched", description: "The US Navy launched Vanguard 1, the fourth artificial satellite in orbit. It is the oldest satellite still in orbit today.", category: "Satellite" },
    { year: 2011, title: "MESSENGER enters Mercury orbit", description: "NASA's MESSENGER became the first spacecraft to orbit Mercury, beginning a mission to map the entire planet.", category: "First" },
  ],
  "03-18": [
    { year: 1965, title: "First spacewalk — Alexei Leonov", description: "Soviet cosmonaut Alexei Leonov performed the first spacewalk (EVA), floating outside Voskhod 2 for 12 minutes. His suit inflated dangerously and he struggled to reenter.", category: "First" },
    { year: 2011, title: "MESSENGER begins Mercury orbit science", description: "MESSENGER began its primary science phase in Mercury orbit, revealing volcanic plains and a surprisingly active magnetic field.", category: "Discovery" },
  ],
  "03-19": [
    { year: 2008, title: "Arthur C. Clarke dies", description: "Science fiction legend Arthur C. Clarke, who predicted geostationary communication satellites and co-wrote 2001: A Space Odyssey, passed away at 90.", category: "Discovery" },
    { year: 2020, title: "Beidou constellation nears completion", description: "China prepared to launch the final satellites of its Beidou-3 navigation constellation, rivaling GPS in global coverage.", category: "Satellite" },
  ],
  "03-20": [
    { year: 2014, title: "BICEP2 gravitational wave claim", description: "Scientists announced the detection of primordial gravitational waves using BICEP2. The result was later attributed to cosmic dust, but spurred important research.", category: "Discovery" },
    { year: 1993, title: "Comet Shoemaker-Levy 9 discovered", description: "Carolyn and Eugene Shoemaker and David Levy discovered a fragmented comet orbiting Jupiter, which would spectacularly impact the planet in July 1994.", category: "Discovery" },
  ],
  "03-21": [
    { year: 1965, title: "Ranger 9 launched", description: "NASA launched Ranger 9, which returned over 5,800 high-quality photos of the Moon's surface before impacting in the crater Alphonsus.", category: "Moon" },
    { year: 2006, title: "First Twitter message from space", description: "While early social media experiments occurred from orbit, the era of astronaut tweeting was beginning, connecting space to everyday life.", category: "Space Station" },
  ],
  "03-22": [
    { year: 1982, title: "STS-3 Columbia launches", description: "Space Shuttle Columbia launched on its third test flight, STS-3, carrying scientific payloads and testing the shuttle's systems.", category: "Shuttle" },
    { year: 2016, title: "ISS crew returns after record stay", description: "Scott Kelly and Mikhail Kornienko returned to Earth after 340 days on the ISS, the longest continuous stay at the time for an American.", category: "Space Station" },
  ],
  "03-23": [
    { year: 2001, title: "Mir space station deorbited", description: "Russia deliberately deorbited the Mir space station after 15 years of service. Its fragments fell safely into the South Pacific Ocean.", category: "Space Station" },
    { year: 1965, title: "Gemini 3 — first crewed Gemini", description: "Gemini 3 launched with Gus Grissom and John Young, the first crewed mission of the Gemini program. Young smuggled a corned beef sandwich aboard.", category: "First" },
  ],
  "03-24": [
    { year: 2015, title: "One-year ISS mission begins", description: "Astronaut Scott Kelly and cosmonaut Mikhail Kornienko arrived at the ISS for a record-setting one-year mission.", category: "Space Station" },
    { year: 1992, title: "STS-45 Atmospheric Lab", description: "Space Shuttle Atlantis launched on STS-45 carrying the ATLAS-1 atmospheric science laboratory.", category: "Shuttle" },
  ],
  "03-25": [
    { year: 1655, title: "Titan discovered", description: "Dutch astronomer Christiaan Huygens discovered Titan, Saturn's largest moon. It's the only moon in the Solar System with a thick atmosphere.", category: "Discovery" },
    { year: 2014, title: "Rings of asteroid Chariklo discovered", description: "Astronomers announced the discovery of two rings around the asteroid Chariklo, the first ring system found around a minor planet.", category: "Discovery" },
  ],
  "03-26": [
    { year: 1993, title: "STS-55 German Spacelab mission", description: "Space Shuttle Columbia launched on STS-55, carrying the German-funded D-2 Spacelab mission with 88 experiments.", category: "Shuttle" },
    { year: 2009, title: "Soyuz TMA-14 launches space tourist", description: "Soyuz TMA-14 launched carrying spaceflight participant Charles Simonyi on his second trip to the ISS.", category: "Space Station" },
  ],
  "03-27": [
    { year: 1969, title: "Mariner 7 launched to Mars", description: "NASA launched Mariner 7 to fly by Mars, joining Mariner 6 in the first dual-spacecraft mission to the Red Planet.", category: "Mars" },
    { year: 2015, title: "One-year crew arrives at ISS", description: "Scott Kelly, Mikhail Kornienko, and Gennady Padalka arrived at the ISS after launching on March 27 from Baikonur.", category: "Space Station" },
  ],
  "03-28": [
    { year: 1802, title: "Pallas asteroid discovered", description: "Heinrich Olbers discovered Pallas, the second asteroid ever found. It is one of the largest objects in the asteroid belt.", category: "Discovery" },
    { year: 2013, title: "Soyuz fast-track to ISS", description: "A Soyuz spacecraft reached the ISS in just 6 hours using a fast-rendezvous profile, down from the usual two-day trip.", category: "Space Station" },
  ],
  "03-29": [
    { year: 1974, title: "Mariner 10 first Mercury flyby", description: "Mariner 10 became the first spacecraft to fly by Mercury, passing within 703 km and photographing about 45% of the surface.", category: "First" },
    { year: 2006, title: "Total solar eclipse", description: "A total solar eclipse was visible across parts of Brazil, Africa, and Turkey. Space-based satellites recorded the Moon's shadow crossing Earth.", category: "Discovery" },
  ],
  "03-30": [
    { year: 2010, title: "LHC achieves record energy", description: "CERN's Large Hadron Collider achieved proton collisions at 7 TeV, helping unravel the fundamental structure of the universe.", category: "Discovery" },
    { year: 2017, title: "SpaceX reuses an orbital rocket", description: "SpaceX successfully launched and landed a previously-flown Falcon 9 first stage for the first time, a milestone in rocket reusability.", category: "First" },
  ],
  "03-31": [
    { year: 1997, title: "Comet Hale-Bopp closest to Earth", description: "Comet Hale-Bopp made its closest approach to Earth at 197 million km, becoming one of the most observed comets of the 20th century.", category: "Discovery" },
    { year: 2005, title: "STS-114 return to flight preparations", description: "NASA prepared for the first Space Shuttle flight after the Columbia disaster, with extensive safety upgrades.", category: "Shuttle" },
  ],

  // ── APRIL ──
  "04-01": [
    { year: 1960, title: "TIROS-1 weather satellite launched", description: "NASA launched TIROS-1, the first successful weather satellite, which transmitted TV images of Earth's cloud cover and revolutionized meteorology.", category: "First" },
    { year: 2006, title: "Venus Express enters orbit", description: "ESA's Venus Express entered orbit around Venus to study its dense atmosphere and extreme greenhouse effect.", category: "Discovery" },
  ],
  "04-02": [
    { year: 1845, title: "First photograph of the Sun", description: "French physicists Fizeau and Foucault captured the first detailed photograph of the Sun, beginning the era of solar photography.", category: "First" },
    { year: 2018, title: "Tiangong-1 reentry", description: "China's prototype space station Tiangong-1 reentered Earth's atmosphere over the South Pacific after two years of uncontrolled orbit decay.", category: "Space Station" },
  ],
  "04-03": [
    { year: 2014, title: "Mars Curiosity sees Earth from Mars", description: "NASA released an image from the Curiosity rover showing Earth and the Moon as tiny specks in the Martian twilight sky.", category: "Mars" },
    { year: 1966, title: "Luna 10 enters Moon orbit", description: "The Soviet Luna 10 became the first spacecraft to orbit the Moon, studying its gravitational field and radiation environment.", category: "First" },
  ],
  "04-04": [
    { year: 2000, title: "Commercial space legislation", description: "Progress in US commercial space legislation paved the way for companies like SpaceX and Blue Origin to eventually transform spaceflight.", category: "Discovery" },
    { year: 1983, title: "STS-6 first Shuttle EVA", description: "Astronauts Story Musgrave and Don Peterson performed the first spacewalk from the Space Shuttle during STS-6.", category: "First" },
  ],
  "04-05": [
    { year: 2010, title: "STS-131 Discovery to ISS", description: "Space Shuttle Discovery launched on STS-131, delivering a Multi-Purpose Logistics Module packed with supplies and equipment to the ISS.", category: "Shuttle" },
    { year: 1991, title: "Compton Gamma Ray Observatory launched", description: "Space Shuttle Atlantis deployed the Compton Gamma Ray Observatory, one of NASA's Great Observatories, to study gamma-ray sources.", category: "Discovery" },
  ],
  "04-06": [
    { year: 1965, title: "Intelsat 1 (Early Bird) launched", description: "The world's first commercial communications satellite was launched into geostationary orbit, revolutionizing international telecommunications.", category: "First" },
    { year: 1984, title: "STS-41-C captures Solar Max", description: "Space Shuttle Challenger captured and repaired the Solar Maximum Mission satellite in orbit — the first in-orbit satellite repair.", category: "Shuttle" },
  ],
  "04-07": [
    { year: 2001, title: "Mars Odyssey launched", description: "NASA launched the Mars Odyssey orbiter, which would become the longest-serving spacecraft in orbit around Mars.", category: "Mars" },
    { year: 1991, title: "Compton Observatory deployed", description: "The Compton Gamma Ray Observatory was deployed from Space Shuttle Atlantis, beginning nine years of gamma-ray astronomy.", category: "Discovery" },
  ],
  "04-08": [
    { year: 2016, title: "SpaceX lands on drone ship", description: "SpaceX successfully landed a Falcon 9 first stage on the drone ship 'Of Course I Still Love You' for the first time during the CRS-8 mission.", category: "First" },
    { year: 1993, title: "STS-56 Atmospheric Lab", description: "Space Shuttle Discovery launched on STS-56 carrying the second ATLAS atmospheric science payload.", category: "Shuttle" },
  ],
  "04-09": [
    { year: 2003, title: "STS-113 returns from ISS", description: "Space Shuttle Endeavour returned from the ISS after delivering the P1 truss segment and rotating the Expedition crew.", category: "Space Station" },
    { year: 1959, title: "Mercury Seven announced", description: "NASA introduced its first seven astronauts — the Mercury Seven — at a press conference, selecting them from military test pilots.", category: "First" },
  ],
  "04-10": [
    { year: 2019, title: "First black hole image released", description: "The Event Horizon Telescope collaboration released the first-ever image of a black hole, showing the shadow of M87's supermassive black hole 55 million light-years away.", category: "Discovery" },
    { year: 1981, title: "STS-1 preparations", description: "Final preparations were underway for the first Space Shuttle launch, with Columbia on the pad at Kennedy Space Center.", category: "Shuttle" },
  ],
  "04-11": [
    { year: 1970, title: "Apollo 13 launches", description: "Apollo 13 launched with astronauts Lovell, Swigert, and Haise. An oxygen tank explosion two days later turned it into a dramatic survival mission.", category: "Moon" },
    { year: 2006, title: "Venus Express enters Venus orbit", description: "ESA's Venus Express spacecraft completed its orbit insertion around Venus to begin studying the planet's dense atmosphere.", category: "Discovery" },
  ],
  "04-12": [
    { year: 1961, title: "Yuri Gagarin — first human in space", description: "Soviet cosmonaut Yuri Gagarin became the first human to travel to space aboard Vostok 1, completing one orbit of Earth in 108 minutes. This date is celebrated as Cosmonautics Day.", category: "First" },
    { year: 1981, title: "Space Shuttle Columbia first launch", description: "Space Shuttle Columbia launched on STS-1 with John Young and Robert Crippen, the first orbital flight of the Space Shuttle program. It was the first crewed maiden flight of a new spacecraft system.", category: "Shuttle" },
    { year: 1985, title: "STS-51-D launches", description: "Space Shuttle Discovery launched on STS-51-D carrying Senator Jake Garn, the first sitting member of Congress to fly in space.", category: "Shuttle" },
  ],
  "04-13": [
    { year: 1970, title: "Apollo 13 — 'Houston, we've had a problem'", description: "An oxygen tank exploded aboard Apollo 13 en route to the Moon. The crew used the Lunar Module as a lifeboat for the return journey to Earth.", category: "Moon" },
    { year: 2029, title: "Apophis close approach predicted", description: "Asteroid 99942 Apophis is predicted to pass within 31,000 km of Earth — closer than geostationary satellites. Astronomers prepare to study it.", category: "Discovery" },
  ],
  "04-14": [
    { year: 1981, title: "Columbia lands after first mission", description: "Space Shuttle Columbia landed at Edwards Air Force Base, completing the first orbital shuttle mission STS-1 after a 54-hour flight.", category: "Shuttle" },
    { year: 1972, title: "Apollo 16 preparations", description: "Final preparations were underway for the Apollo 16 mission, the penultimate crewed Moon landing.", category: "Moon" },
  ],
  "04-15": [
    { year: 2020, title: "Voyager anniversary celebrations", description: "Scientists celebrated the ongoing missions of both Voyager spacecraft, still communicating from interstellar space after over 40 years.", category: "Discovery" },
    { year: 1999, title: "Landsat 7 launched", description: "NASA and USGS launched Landsat 7, continuing the longest continuous satellite record of Earth's surface.", category: "Satellite" },
  ],
  "04-16": [
    { year: 1972, title: "Apollo 16 launches", description: "Apollo 16 launched with John Young, Ken Mattingly, and Charles Duke. Young and Duke explored the Descartes Highlands on the Moon.", category: "Moon" },
    { year: 2005, title: "DART spacecraft launched", description: "NASA launched the first Demonstration of Autonomous Rendezvous Technology spacecraft, testing automated docking procedures.", category: "Satellite" },
  ],
  "04-17": [
    { year: 1970, title: "Apollo 13 returns safely", description: "The crew of Apollo 13 splashed down safely in the Pacific Ocean after their harrowing journey, demonstrating incredible problem-solving under pressure.", category: "Moon" },
    { year: 1998, title: "TRACE solar observatory launched", description: "NASA launched the Transition Region and Coronal Explorer to study the Sun's corona and transition region in ultraviolet.", category: "Satellite" },
  ],
  "04-18": [
    { year: 2014, title: "SpaceX CRS-3 first drone ship attempt", description: "SpaceX completed CRS-3 and attempted a controlled water landing of the Falcon 9 first stage, a precursor to drone ship landings.", category: "Satellite" },
    { year: 2018, title: "TESS planet hunter launched", description: "NASA launched the Transiting Exoplanet Survey Satellite (TESS) to search for exoplanets around the nearest and brightest stars.", category: "Discovery" },
  ],
  "04-19": [
    { year: 1971, title: "Salyut 1 — first space station", description: "The Soviet Union launched Salyut 1, the world's first space station, into orbit. It was crewed by the Soyuz 11 crew, who tragically died during return.", category: "First" },
    { year: 1975, title: "India's first satellite launched", description: "India launched its first satellite, Aryabhata, aboard a Soviet Cosmos-3M rocket from Kapustin Yar.", category: "Satellite" },
  ],
  "04-20": [
    { year: 1972, title: "Apollo 16 Moon landing", description: "John Young and Charles Duke landed in the Descartes Highlands, spending 71 hours on the surface and collecting 95 kg of samples.", category: "Moon" },
    { year: 1964, title: "SNAP-10A reactor launched", description: "The US launched SNAP-10A, the only nuclear fission reactor to operate in space. It provided 500 watts for 43 days.", category: "First" },
  ],
  "04-21": [
    { year: 1997, title: "Ashes launched into space", description: "Celestis conducted the first space burial, launching a small portion of the cremated remains of 24 people, including Gene Roddenberry and Timothy Leary.", category: "First" },
    { year: 2010, title: "SpaceShipTwo first flight", description: "Virgin Galactic's SpaceShipTwo completed its first captive-carry flight attached to the WhiteKnightTwo carrier aircraft.", category: "Discovery" },
  ],
  "04-22": [
    { year: 1970, title: "First Earth Day observed", description: "The first Earth Day was celebrated worldwide. Since then, space-based Earth observation has transformed our understanding of environmental change.", category: "Discovery" },
    { year: 2010, title: "X-37B first launch", description: "The US Air Force launched the first Boeing X-37B robotic space plane on its maiden mission, beginning a series of secretive long-duration flights.", category: "First" },
  ],
  "04-23": [
    { year: 1967, title: "Soyuz 1 launches", description: "Soviet cosmonaut Vladimir Komarov launched aboard Soyuz 1. The mission suffered multiple malfunctions and Komarov died when the parachute failed during reentry.", category: "Tragedy" },
    { year: 2021, title: "Crew Dragon Endeavour launches Crew-2", description: "SpaceX launched its Crew Dragon Endeavour on the Crew-2 mission to the ISS, carrying astronauts from NASA, ESA, and JAXA.", category: "Space Station" },
  ],
  "04-24": [
    { year: 1990, title: "Hubble Space Telescope launched", description: "Space Shuttle Discovery deployed the Hubble Space Telescope on STS-31. Despite an initial mirror flaw, it became one of the most important scientific instruments ever built.", category: "Discovery" },
    { year: 1967, title: "Soyuz 1 crash — Komarov dies", description: "Cosmonaut Vladimir Komarov died when Soyuz 1's parachute failed during reentry, becoming the first in-flight spaceflight fatality.", category: "Tragedy" },
  ],
  "04-25": [
    { year: 1990, title: "Hubble deployed from shuttle", description: "Astronauts aboard Space Shuttle Discovery successfully deployed the Hubble Space Telescope into its 340-mile orbit using the robot arm.", category: "Discovery" },
    { year: 2003, title: "GPS constellation modernization", description: "The US launched a modernized Block IIR-M GPS satellite, improving accuracy and adding a new civilian signal.", category: "Satellite" },
  ],
  "04-26": [
    { year: 1993, title: "STS-55 launches", description: "Space Shuttle Columbia launched on the D-2 Spacelab mission, the second German-funded laboratory mission.", category: "Shuttle" },
    { year: 2019, title: "Beresheet Moon crash", description: "Israel's SpaceIL Beresheet lunar lander experienced an engine failure and crashed on the Moon, narrowly missing the first private Moon landing.", category: "Moon" },
  ],
  "04-27": [
    { year: 2002, title: "Soyuz TM-34 space tourist", description: "South African Mark Shuttleworth launched to the ISS aboard Soyuz TM-34, becoming the second space tourist and first African in space.", category: "Space Station" },
    { year: 1971, title: "Salyut 1 operations continue", description: "The first space station Salyut 1 continued orbital operations as crews prepared for the first visit aboard Soyuz 10.", category: "Space Station" },
  ],
  "04-28": [
    { year: 2001, title: "Dennis Tito — first space tourist", description: "American businessman Dennis Tito launched to the ISS aboard a Russian Soyuz, becoming the first paying space tourist at a cost of $20 million.", category: "First" },
    { year: 2008, title: "ATV-1 Jules Verne docks with ISS", description: "ESA's first Automated Transfer Vehicle docked autonomously with the ISS, delivering 7.5 tonnes of supplies.", category: "Space Station" },
  ],
  "04-29": [
    { year: 1985, title: "STS-51-B Spacelab 3", description: "Space Shuttle Challenger launched on STS-51-B carrying Spacelab 3, performing materials science and life sciences research.", category: "Shuttle" },
    { year: 2021, title: "China launches Tianhe core module", description: "China launched the Tianhe core module of its Tiangong space station on a Long March 5B rocket, beginning construction of its permanent station.", category: "Space Station" },
  ],
  "04-30": [
    { year: 2019, title: "Cygnus NG-11 launches to ISS", description: "Northrop Grumman launched Cygnus NG-11 to resupply the ISS, carrying nearly 3,500 kg of cargo including science experiments.", category: "Space Station" },
    { year: 2008, title: "GLAST Fermi observatory preparations", description: "NASA prepared for the launch of the Gamma-ray Large Area Space Telescope (later renamed Fermi), to study the gamma-ray sky.", category: "Discovery" },
  ],

  // ── MAY ──
  "05-01": [
    { year: 2003, title: "ISS Expedition 7 begins", description: "Expedition 7 began aboard the ISS with a two-person crew after the Columbia disaster reduced shuttle flights and crew rotation capability.", category: "Space Station" },
    { year: 1949, title: "Gerard Kuiper discovers Nereid", description: "Astronomer Gerard Kuiper discovered Nereid, Neptune's third-largest moon, through ground-based telescope observations.", category: "Discovery" },
  ],
  "05-02": [
    { year: 2000, title: "First ISS crew to use Zvezda", description: "The Zvezda service module preparations continued, providing the living quarters that would support permanent habitation of the ISS.", category: "Space Station" },
    { year: 1989, title: "STS-30 Magellan to Venus", description: "Space Shuttle Atlantis launched on STS-30, deploying the Magellan spacecraft to map Venus's surface using radar.", category: "Discovery" },
  ],
  "05-03": [
    { year: 1999, title: "STS-96 Discovery to ISS", description: "Space Shuttle Discovery launched on STS-96, the first shuttle docking with the International Space Station.", category: "Space Station" },
    { year: 2018, title: "InSight launches to Mars", description: "NASA's InSight lander launched toward Mars to study the planet's interior using a seismometer and heat probe.", category: "Mars" },
  ],
  "05-04": [
    { year: 1989, title: "Magellan launched to Venus", description: "The Magellan spacecraft was deployed from Space Shuttle Atlantis to begin its journey to Venus, where it mapped 98% of the surface with radar.", category: "Discovery" },
    { year: 2002, title: "Aqua Earth-observing satellite launched", description: "NASA launched the Aqua satellite to study Earth's water cycle, including evaporation, oceans, sea ice, and snow.", category: "Satellite" },
  ],
  "05-05": [
    { year: 1961, title: "Alan Shepard — first American in space", description: "Alan Shepard became the first American in space aboard Freedom 7, making a 15-minute suborbital flight reaching an altitude of 187 km.", category: "First" },
    { year: 2018, title: "InSight Mars lander in transit", description: "NASA's InSight Mars lander was en route to Mars following its May 5 launch, carrying instruments to study the Martian interior.", category: "Mars" },
  ],
  "05-06": [
    { year: 2018, title: "InSight en route to Mars", description: "NASA's InSight spacecraft continued its cruise toward Mars after launching the previous day from Vandenberg Air Force Base.", category: "Mars" },
    { year: 2001, title: "Dennis Tito returns from ISS", description: "Space tourist Dennis Tito returned to Earth after spending nearly 8 days on the ISS, having paid $20 million for the trip.", category: "Space Station" },
  ],
  "05-07": [
    { year: 1992, title: "STS-49 captures Intelsat", description: "Space Shuttle Endeavour's maiden flight featured the first three-person spacewalk, manually capturing the stranded Intelsat VI satellite.", category: "Shuttle" },
    { year: 1992, title: "Endeavour maiden voyage", description: "Space Shuttle Endeavour launched on its first mission, STS-49, as the replacement orbiter built after the Challenger disaster.", category: "Shuttle" },
  ],
  "05-08": [
    { year: 2003, title: "Hayabusa launched to asteroid", description: "JAXA launched the Hayabusa spacecraft to asteroid Itokawa, where it would attempt to collect samples and return them to Earth.", category: "Discovery" },
    { year: 1996, title: "STS-77 Endeavour launches", description: "Space Shuttle Endeavour launched carrying the Spacehab module and deploying four small satellites.", category: "Shuttle" },
  ],
  "05-09": [
    { year: 2003, title: "Hayabusa leaves Earth orbit", description: "JAXA's Hayabusa spacecraft departed Earth orbit using ion engines, beginning its two-year journey to asteroid Itokawa.", category: "Discovery" },
    { year: 2016, title: "Mercury transit observed", description: "Mercury transited across the face of the Sun, visible from Earth. Space telescopes and ground observatories captured detailed images.", category: "Discovery" },
  ],
  "05-10": [
    { year: 1990, title: "Magellan enters Venus orbit", description: "NASA's Magellan spacecraft entered orbit around Venus and began radar mapping the planet's surface through the thick clouds.", category: "Discovery" },
    { year: 2018, title: "Rocket Lab Electron second launch", description: "Rocket Lab launched its Electron rocket on its second mission 'Still Testing,' successfully reaching orbit from New Zealand.", category: "Satellite" },
  ],
  "05-11": [
    { year: 2009, title: "Hubble Servicing Mission 4", description: "Space Shuttle Atlantis launched on STS-125 for the final Hubble servicing mission, installing new instruments that extended its life by decades.", category: "Shuttle" },
    { year: 1916, title: "Einstein publishes general relativity", description: "Einstein formally published his general theory of relativity, fundamentally changing our understanding of gravity, space, and time.", category: "Discovery" },
  ],
  "05-12": [
    { year: 2009, title: "Astronauts service Hubble", description: "STS-125 astronauts began a series of five spacewalks to upgrade and repair the Hubble Space Telescope for the final time.", category: "Shuttle" },
    { year: 2010, title: "STS-132 Atlantis launches", description: "Space Shuttle Atlantis launched on STS-132, one of its final missions, delivering a Russian Mini-Research Module to the ISS.", category: "Shuttle" },
  ],
  "05-13": [
    { year: 2009, title: "Herschel and Planck launched", description: "ESA launched the Herschel infrared space observatory and the Planck cosmic microwave background surveyor on a single Ariane 5.", category: "Discovery" },
    { year: 2005, title: "STS-114 crew announcement", description: "NASA finalized the crew for STS-114, the Return to Flight mission after the Columbia disaster.", category: "Shuttle" },
  ],
  "05-14": [
    { year: 1973, title: "Skylab launched", description: "NASA launched Skylab, America's first space station, on the last Saturn V rocket. A micrometeoroid shield ripped off during launch, requiring repairs.", category: "Space Station" },
    { year: 2009, title: "Hubble servicing continues", description: "STS-125 astronauts continued servicing Hubble, replacing gyroscopes, batteries, and installing the Wide Field Camera 3.", category: "Shuttle" },
  ],
  "05-15": [
    { year: 1958, title: "Sputnik 3 launched", description: "The Soviet Union launched Sputnik 3, a geophysical research satellite that studied Earth's upper atmosphere and radiation belts.", category: "Satellite" },
    { year: 1963, title: "Mercury-Atlas 9 — Faith 7", description: "Astronaut Gordon Cooper orbited Earth 22 times aboard Faith 7, the final mission of Project Mercury. He was the last American to fly solo in orbit.", category: "First" },
  ],
  "05-16": [
    { year: 1969, title: "Venera 5 enters Venus atmosphere", description: "The Soviet Venera 5 entered Venus's atmosphere and transmitted data for 53 minutes before being crushed by the intense pressure.", category: "Discovery" },
    { year: 2011, title: "STS-134 Endeavour's final launch", description: "Space Shuttle Endeavour launched on its final mission, STS-134, delivering the Alpha Magnetic Spectrometer to the ISS.", category: "Shuttle" },
  ],
  "05-17": [
    { year: 1969, title: "Venera 6 enters Venus atmosphere", description: "The Soviet Venera 6 followed Venera 5 into Venus's atmosphere, transmitting data about temperature and pressure before being crushed.", category: "Discovery" },
    { year: 1985, title: "Spacelab 3 experiments complete", description: "STS-51-B crew completed Spacelab 3 experiments in microgravity, including crystal growth and fluid dynamics studies.", category: "Shuttle" },
  ],
  "05-18": [
    { year: 1969, title: "Apollo 10 launches", description: "Apollo 10 launched as a full dress rehearsal for the Moon landing, with the Lunar Module descending to within 15 km of the surface.", category: "Moon" },
    { year: 1991, title: "Helen Sharman — first Briton in space", description: "Helen Sharman launched aboard Soyuz TM-12 to visit the Mir space station, becoming the first British astronaut in space.", category: "First" },
  ],
  "05-19": [
    { year: 1971, title: "Mars 2 launched", description: "The Soviet Union launched Mars 2, which would become the first spacecraft to reach the surface of Mars (crash landing) in November 1971.", category: "Mars" },
    { year: 2000, title: "STS-101 ISS supply mission", description: "Space Shuttle Atlantis launched on STS-101 to bring supplies and make repairs to the ISS in preparation for permanent habitation.", category: "Space Station" },
  ],
  "05-20": [
    { year: 1978, title: "Pioneer Venus Orbiter launched", description: "NASA launched Pioneer Venus 1 to orbit Venus and study its atmosphere and surface using radar mapping.", category: "Discovery" },
    { year: 2005, title: "NOAA-18 weather satellite launched", description: "NASA launched NOAA-18 aboard a Delta II rocket to monitor Earth's weather patterns from a polar orbit.", category: "Satellite" },
  ],
  "05-21": [
    { year: 2010, title: "JAXA launches Akatsuki to Venus", description: "Japan's JAXA launched the Akatsuki spacecraft to study Venus's atmosphere. It missed orbit insertion but succeeded on a second attempt in 2015.", category: "Discovery" },
    { year: 2010, title: "IKAROS solar sail launched", description: "JAXA launched IKAROS, the first spacecraft to successfully demonstrate interplanetary travel using a solar sail.", category: "First" },
  ],
  "05-22": [
    { year: 2012, title: "SpaceX Dragon docks with ISS", description: "SpaceX's Dragon became the first commercial spacecraft to dock with the International Space Station during the COTS Demo 2 mission.", category: "First" },
    { year: 1969, title: "Apollo 10 Lunar Module descent", description: "The Apollo 10 Lunar Module 'Snoopy' descended to within 15.6 km of the Moon's surface — the closest approach before Apollo 11's landing.", category: "Moon" },
  ],
  "05-23": [
    { year: 2009, title: "Hubble final servicing complete", description: "STS-125 astronauts completed the fifth and final Hubble servicing mission, leaving the telescope more capable than ever.", category: "Shuttle" },
    { year: 2001, title: "Mars Odyssey trajectory correction", description: "NASA's Mars Odyssey performed a trajectory correction maneuver during its cruise phase en route to Mars orbit.", category: "Mars" },
  ],
  "05-24": [
    { year: 1962, title: "Mercury-Atlas 7 — Aurora 7", description: "Astronaut Scott Carpenter orbited Earth three times aboard Aurora 7, the second American orbital flight.", category: "First" },
    { year: 1972, title: "SALT I signed — limits ABMs", description: "The Strategic Arms Limitation Talks limited anti-ballistic missile systems. Space-based surveillance was crucial for verification.", category: "Satellite" },
  ],
  "05-25": [
    { year: 1961, title: "JFK's Moon speech", description: "President Kennedy declared before Congress that the US should commit to 'landing a man on the Moon and returning him safely to the Earth' before the decade was out.", category: "Moon" },
    { year: 1973, title: "Skylab 2 crew launches", description: "The first Skylab crew launched aboard an Apollo spacecraft to repair damage sustained during the station's launch 11 days earlier.", category: "Space Station" },
    { year: 2008, title: "Phoenix lands on Mars", description: "NASA's Phoenix lander touched down near Mars's north pole to study the Martian arctic environment and search for water ice.", category: "Mars" },
  ],
  "05-26": [
    { year: 1973, title: "Skylab repairs begin", description: "Skylab 2 astronauts deployed a replacement sunshade and freed a stuck solar panel, saving the space station.", category: "Space Station" },
    { year: 1999, title: "STS-96 docks with ISS", description: "Space Shuttle Discovery docked with the ISS, delivering over 1,500 kg of supplies during the first shuttle visit to the station.", category: "Space Station" },
  ],
  "05-27": [
    { year: 1999, title: "STS-96 ISS operations", description: "Astronauts aboard Discovery continued transferring supplies and equipment into the International Space Station modules.", category: "Space Station" },
    { year: 2020, title: "Crew Dragon Demo-2 preparations", description: "Final preparations were underway for SpaceX's first crewed launch to the ISS, initially scheduled for this date but delayed by weather.", category: "Space Station" },
  ],
  "05-28": [
    { year: 1959, title: "Monkeys in space — Able and Baker", description: "Monkeys Able and Baker survived a suborbital spaceflight aboard a Jupiter AM-18 rocket, reaching an altitude of 483 km and experiencing 38g.", category: "First" },
    { year: 1964, title: "Saturn SA-6 launched", description: "NASA launched Saturn SA-6, the first Saturn I vehicle to carry a boilerplate Apollo command and service module.", category: "Moon" },
  ],
  "05-29": [
    { year: 1999, title: "STS-96 first shuttle-ISS docking", description: "Space Shuttle Discovery completed the first docking between a shuttle and the ISS, opening the hatch to deliver supplies.", category: "Space Station" },
    { year: 2020, title: "Crew Dragon Demo-2 scrubbed", description: "SpaceX's first crewed mission was scrubbed due to weather conditions at Kennedy Space Center, rescheduled for May 30.", category: "Space Station" },
  ],
  "05-30": [
    { year: 2020, title: "SpaceX Crew Dragon Demo-2 launch", description: "SpaceX launched astronauts Doug Hurley and Bob Behnken to the ISS aboard Crew Dragon, the first crewed orbital flight from US soil since 2011.", category: "First" },
    { year: 1971, title: "Mariner 9 launched to Mars", description: "NASA launched Mariner 9, which became the first spacecraft to orbit another planet, arriving at Mars in November.", category: "First" },
  ],
  "05-31": [
    { year: 2008, title: "Kibo lab installed on ISS", description: "JAXA's Kibo Pressurized Module was attached to the ISS during STS-124, giving Japan its own laboratory in space.", category: "Space Station" },
    { year: 1975, title: "ESA founded", description: "The European Space Agency was formally established, unifying European space efforts and launching programs like Ariane and Columbus.", category: "First" },
  ],

  // ── JUNE ──
  "06-01": [
    { year: 2008, title: "STS-124 Kibo module installation", description: "Space Shuttle Discovery's STS-124 crew completed installation of JAXA's Kibo laboratory pressurized module on the ISS.", category: "Space Station" },
    { year: 1990, title: "ROSAT X-ray observatory launched", description: "Germany's ROSAT X-ray telescope was launched, performing the first all-sky survey with an imaging X-ray telescope.", category: "Discovery" },
  ],
  "06-02": [
    { year: 1966, title: "Surveyor 1 lands on Moon", description: "NASA's Surveyor 1 became the first American spacecraft to soft-land on the Moon, proving the surface could support a crewed lander.", category: "Moon" },
    { year: 2003, title: "Mars Express launched", description: "ESA launched Mars Express with the Beagle 2 lander. The orbiter became highly successful; the lander was lost during touchdown.", category: "Mars" },
  ],
  "06-03": [
    { year: 1965, title: "Gemini 4 — first American EVA", description: "Astronaut Ed White performed the first American spacewalk during Gemini 4, floating outside for 23 minutes. He called it the saddest moment to come back in.", category: "First" },
    { year: 2017, title: "SpaceX CRS-11 with reused Dragon", description: "SpaceX launched the CRS-11 mission to the ISS using a previously flown Dragon capsule for the first time.", category: "Space Station" },
  ],
  "06-04": [
    { year: 1965, title: "Ed White's EVA photos published", description: "Stunning photos of Ed White's spacewalk during Gemini 4 were published, becoming iconic images of the Space Age.", category: "First" },
    { year: 2010, title: "Falcon 9 first flight", description: "SpaceX successfully launched the Falcon 9 rocket for the first time from Cape Canaveral, carrying a Dragon qualification unit.", category: "First" },
  ],
  "06-05": [
    { year: 2002, title: "Mars Odyssey finds water ice", description: "NASA's Mars Odyssey detected large amounts of hydrogen near Mars's south pole, indicating significant deposits of water ice.", category: "Mars" },
    { year: 1989, title: "Tiananmen Square and satellites", description: "Space-based imagery played a growing role in monitoring world events as commercial satellite imagery capabilities expanded.", category: "Satellite" },
  ],
  "06-06": [
    { year: 1971, title: "Soyuz 11 launches to Salyut 1", description: "Soyuz 11 launched to dock with Salyut 1, the world's first space station. The crew became the first to live aboard a space station.", category: "Space Station" },
    { year: 2022, title: "China launches Shenzhou-14", description: "China launched the Shenzhou-14 crew to the Tiangong space station to oversee the arrival of two new modules.", category: "Space Station" },
  ],
  "06-07": [
    { year: 1983, title: "Venera 15 launched", description: "The Soviet Union launched Venera 15, which would use radar to map the northern hemisphere of Venus with unprecedented detail.", category: "Discovery" },
    { year: 2019, title: "NASA opens ISS to tourists", description: "NASA announced plans to open the International Space Station to private astronauts and commercial activities.", category: "Space Station" },
  ],
  "06-08": [
    { year: 1975, title: "Venera 9 launched to Venus", description: "The Soviet Union launched Venera 9, which would become the first spacecraft to return images from the surface of another planet.", category: "First" },
    { year: 2004, title: "Venus transit observed", description: "Astronomers observed the transit of Venus across the Sun, the first since 1882. The next pair won't occur until 2117.", category: "Discovery" },
  ],
  "06-09": [
    { year: 1985, title: "Vega 1 drops balloon on Venus", description: "The Soviet Vega 1 spacecraft deployed a balloon probe and lander into Venus's atmosphere before continuing on to Halley's Comet.", category: "Discovery" },
    { year: 2018, title: "Curiosity finds organic molecules on Mars", description: "NASA announced that the Curiosity rover found ancient organic molecules preserved in Martian rocks, a key building block for life.", category: "Mars" },
  ],
  "06-10": [
    { year: 2003, title: "Spirit rover launched to Mars", description: "NASA launched the Spirit rover (MER-A) on a Delta II rocket, beginning its seven-month journey to Gusev Crater on Mars.", category: "Mars" },
    { year: 1999, title: "Mars Polar Lander preparations", description: "NASA prepared the Mars Polar Lander for its January 1999 launch to study Mars's south polar region.", category: "Mars" },
  ],
  "06-11": [
    { year: 2008, title: "Fermi Gamma-ray Telescope launched", description: "NASA launched the Fermi Gamma-ray Space Telescope (formerly GLAST) to study high-energy gamma-ray sources across the universe.", category: "Discovery" },
    { year: 1985, title: "Vega 2 Venus encounter", description: "The Soviet Vega 2 deployed its balloon and lander at Venus before continuing to its encounter with Halley's Comet.", category: "Discovery" },
  ],
  "06-12": [
    { year: 1967, title: "Venera 4 launched", description: "The Soviet Union launched Venera 4, which would become the first probe to transmit data from within another planet's atmosphere.", category: "First" },
    { year: 2010, title: "Hayabusa returns asteroid samples", description: "JAXA's Hayabusa spacecraft returned to Earth with samples from asteroid Itokawa, the first asteroid sample return mission.", category: "First" },
  ],
  "06-13": [
    { year: 1983, title: "Pioneer 10 passes Neptune's orbit", description: "Pioneer 10 crossed the orbit of Neptune, becoming the first human-made object to travel beyond all known planets at the time.", category: "Discovery" },
    { year: 2010, title: "Hayabusa capsule recovered", description: "JAXA successfully recovered the Hayabusa sample return capsule in the Australian outback, containing precious asteroid grains.", category: "Discovery" },
  ],
  "06-14": [
    { year: 1967, title: "Mariner 5 launched to Venus", description: "NASA launched Mariner 5 to fly by Venus and study its atmosphere with radio occultation and UV photometry experiments.", category: "Discovery" },
    { year: 2012, title: "NuSTAR X-ray telescope launched", description: "NASA launched the Nuclear Spectroscopic Telescope Array to study high-energy X-ray sources like black holes and neutron stars.", category: "Discovery" },
  ],
  "06-15": [
    { year: 2010, title: "Soyuz TMA-19 launches to ISS", description: "Soyuz TMA-19 launched with three crew members to join Expedition 24 aboard the International Space Station.", category: "Space Station" },
    { year: 1985, title: "Vega 2 Venus encounter complete", description: "Vega 2's lander transmitted data from the Venus surface for 57 minutes, measuring temperature, pressure, and soil composition.", category: "Discovery" },
  ],
  "06-16": [
    { year: 1963, title: "Valentina Tereshkova — first woman in space", description: "Soviet cosmonaut Valentina Tereshkova became the first woman in space aboard Vostok 6, orbiting Earth 48 times over nearly three days.", category: "First" },
    { year: 2012, title: "Shenzhou-9 docking with Tiangong-1", description: "China launched Shenzhou-9, carrying Liu Yang — the first Chinese woman in space — to dock with the Tiangong-1 laboratory.", category: "First" },
  ],
  "06-17": [
    { year: 1985, title: "STS-51-G deploys satellites", description: "Space Shuttle Discovery launched on STS-51-G with Sultan Salman Al Saud, the first Arab and first Muslim in space.", category: "First" },
    { year: 2017, title: "China launches X-ray telescope HXMT", description: "China launched the Hard X-ray Modulation Telescope (Insight-HXMT) to study black holes, neutron stars, and gamma-ray bursts.", category: "Satellite" },
  ],
  "06-18": [
    { year: 1983, title: "Sally Ride — first American woman in space", description: "Sally Ride became the first American woman in space aboard Space Shuttle Challenger on STS-7. She operated the shuttle's robotic arm to deploy satellites.", category: "First" },
    { year: 2009, title: "LRO and LCROSS launched to Moon", description: "NASA launched the Lunar Reconnaissance Orbiter and LCROSS impactor to map the Moon and search for water ice at the south pole.", category: "Moon" },
  ],
  "06-19": [
    { year: 2013, title: "Shenzhou-10 docks with Tiangong-1", description: "China's Shenzhou-10 spacecraft docked with the Tiangong-1 laboratory for the country's longest crewed mission at that time.", category: "Space Station" },
    { year: 1963, title: "Tereshkova returns to Earth", description: "Valentina Tereshkova landed safely after spending almost three days in space, having orbited Earth 48 times.", category: "First" },
  ],
  "06-20": [
    { year: 2019, title: "ISS commercial docking port installed", description: "Astronauts installed the IDA-3 docking adapter on the ISS, preparing a second port for commercial crew spacecraft.", category: "Space Station" },
    { year: 1996, title: "STS-78 Columbia launches", description: "Space Shuttle Columbia launched on STS-78 for the longest shuttle mission at that time — 16 days — carrying the Life and Microgravity Spacelab.", category: "Shuttle" },
  ],
  "06-21": [
    { year: 2004, title: "SpaceShipOne reaches space", description: "SpaceShipOne became the first privately funded crewed spacecraft to reach space, piloted by Mike Melvill to an altitude of 100.1 km.", category: "First" },
    { year: 1993, title: "STS-57 captures EURECA", description: "Space Shuttle Endeavour retrieved the European Retrievable Carrier from orbit, returning European microgravity experiments.", category: "Shuttle" },
  ],
  "06-22": [
    { year: 1978, title: "Charon discovered", description: "Astronomer James Christy discovered Pluto's largest moon Charon while studying photographic plates at the US Naval Observatory.", category: "Discovery" },
    { year: 2019, title: "SpaceX Falcon Heavy night launch", description: "SpaceX launched the Falcon Heavy on the STP-2 mission at night, deploying 24 satellites for the US Air Force and research groups.", category: "Satellite" },
  ],
  "06-23": [
    { year: 1999, title: "XMM-Newton preparations", description: "ESA prepared for the launch of XMM-Newton, the most powerful X-ray telescope ever placed in orbit.", category: "Discovery" },
    { year: 2020, title: "GPS III satellite launched", description: "SpaceX launched its third GPS III satellite aboard a Falcon 9, modernizing the Global Positioning System constellation.", category: "Satellite" },
  ],
  "06-24": [
    { year: 2014, title: "Rosetta arrives at comet", description: "ESA's Rosetta spacecraft arrived at comet 67P/Churyumov-Gerasimenko after a 10-year journey, beginning close-up observations.", category: "Discovery" },
    { year: 1982, title: "Jean-Loup Chretien — first Western European in space", description: "French spationaut Jean-Loup Chretien launched to the Salyut 7 station aboard Soyuz T-6, the first Western European in space.", category: "First" },
  ],
  "06-25": [
    { year: 1992, title: "STS-50 microgravity research", description: "Space Shuttle Columbia launched on STS-50, carrying the US Microgravity Laboratory for materials and fluid physics research.", category: "Shuttle" },
    { year: 2014, title: "Rosetta observes comet activity", description: "Rosetta began detecting increasing activity from comet 67P as it approached the Sun, with jets of dust and gas becoming visible.", category: "Discovery" },
  ],
  "06-26": [
    { year: 1984, title: "Soyuz T-12 launches", description: "Soyuz T-12 launched carrying Svetlana Savitskaya, who became the first woman to perform a spacewalk on July 25.", category: "First" },
    { year: 1995, title: "STS-71 Shuttle-Mir first docking", description: "Space Shuttle Atlantis docked with Mir for the first time, marking the beginning of the Shuttle-Mir program.", category: "Shuttle" },
  ],
  "06-27": [
    { year: 1995, title: "Shuttle-Mir crew exchange", description: "During STS-71, Atlantis exchanged crew members with Mir, bringing home Norman Thagard after 115 days on the Russian station.", category: "Space Station" },
    { year: 2018, title: "Hayabusa2 arrives at Ryugu", description: "JAXA's Hayabusa2 spacecraft arrived at asteroid Ryugu after a 3.5-year journey, beginning detailed observations.", category: "Discovery" },
  ],
  "06-28": [
    { year: 1971, title: "Soyuz 11 crew dies during reentry", description: "The three cosmonauts of Soyuz 11 — Dobrovolsky, Volkov, and Patsayev — died when their capsule depressurized during reentry. They were the first crew of a space station.", category: "Tragedy" },
    { year: 2015, title: "SpaceX CRS-7 failure", description: "A Falcon 9 rocket carrying the CRS-7 Dragon capsule broke apart 139 seconds after launch due to a strut failure in the second stage.", category: "Satellite" },
  ],
  "06-29": [
    { year: 1971, title: "Soyuz 11 investigation begins", description: "Soviet officials began investigating the Soyuz 11 disaster, which killed three cosmonauts. The cause was a ventilation valve that opened during reentry.", category: "Tragedy" },
    { year: 1995, title: "STS-71 Shuttle-Mir undocking", description: "Space Shuttle Atlantis undocked from Mir, completing the first Shuttle-Mir docking mission after delivering fresh crew.", category: "Shuttle" },
  ],
  "06-30": [
    { year: 1908, title: "Tunguska event", description: "A massive explosion over Tunguska, Siberia flattened 2,000 sq km of forest. Likely caused by an airburst of a small asteroid or comet fragment.", category: "Discovery" },
    { year: 2001, title: "WMAP launched", description: "NASA launched the Wilkinson Microwave Anisotropy Probe to map the cosmic microwave background radiation with unprecedented detail.", category: "Discovery" },
  ],

  // ── JULY ──
  "07-01": [
    { year: 2004, title: "Cassini enters Saturn orbit", description: "NASA's Cassini spacecraft entered orbit around Saturn after a seven-year journey, beginning 13 years of groundbreaking discoveries about the ringed planet.", category: "Discovery" },
    { year: 2002, title: "World's first space tourist agreement", description: "Roscosmos formalized agreements for space tourism flights to the ISS, opening the door for more civilian space travelers.", category: "Space Station" },
  ],
  "07-02": [
    { year: 1985, title: "Giotto launched to Halley's Comet", description: "ESA launched the Giotto spacecraft to fly through the coma of Halley's Comet, making the closest approach to a comet at that time.", category: "Discovery" },
    { year: 2019, title: "Total solar eclipse in Chile", description: "A total solar eclipse crossed Chile and Argentina. Space-based observatories tracked the Moon's shadow from orbit.", category: "Discovery" },
  ],
  "07-03": [
    { year: 1969, title: "Soviet N1 rocket explosion", description: "The Soviet N1 Moon rocket exploded seconds after launch, creating one of the largest non-nuclear explosions in history and destroying the launch pad.", category: "Tragedy" },
    { year: 2018, title: "Hayabusa2 begins asteroid survey", description: "JAXA's Hayabusa2 began detailed observation of asteroid Ryugu from a home position altitude of 20 km.", category: "Discovery" },
  ],
  "07-04": [
    { year: 2005, title: "Deep Impact hits Comet Tempel 1", description: "NASA's Deep Impact probe slammed a copper impactor into Comet Tempel 1 at 37,000 km/h, creating a crater and revealing subsurface material.", category: "Discovery" },
    { year: 1997, title: "Mars Pathfinder/Sojourner lands", description: "NASA's Mars Pathfinder landed on Mars using airbags, deploying the Sojourner rover — the first rover to operate on another planet.", category: "Mars" },
  ],
  "07-05": [
    { year: 1966, title: "Gemini 9A returns", description: "Gemini 9A returned to Earth after Gene Cernan's challenging EVA, where his visor fogged up and he struggled to return to the capsule.", category: "First" },
    { year: 2016, title: "Juno arrives at Jupiter", description: "NASA's Juno spacecraft entered orbit around Jupiter after a five-year journey to study the gas giant's interior and magnetic field.", category: "Discovery" },
  ],
  "07-06": [
    { year: 2016, title: "Juno begins Jupiter science", description: "Juno began its primary science mission at Jupiter, using microwave and infrared instruments to peer beneath the cloud tops.", category: "Discovery" },
    { year: 1998, title: "ISS Node 1 preparations", description: "NASA prepared the Unity Node 1 module for integration into the ISS, which would serve as the connecting hub.", category: "Space Station" },
  ],
  "07-07": [
    { year: 1998, title: "Japan launches Nozomi to Mars", description: "Japan launched the Nozomi spacecraft toward Mars to study its upper atmosphere. Thruster problems prevented it from entering orbit.", category: "Mars" },
    { year: 2003, title: "Opportunity launched to Mars", description: "NASA launched the Opportunity rover (MER-B) on a Delta II rocket toward Mars, where it would operate for nearly 15 years.", category: "Mars" },
  ],
  "07-08": [
    { year: 2011, title: "Space Shuttle Atlantis final launch", description: "Space Shuttle Atlantis launched on STS-135, the final mission of the Space Shuttle program, delivering supplies to the ISS.", category: "Shuttle" },
    { year: 1994, title: "Comet Shoemaker-Levy 9 approaches Jupiter", description: "Comet Shoemaker-Levy 9 fragments continued their approach to Jupiter, days before their spectacular impact.", category: "Discovery" },
  ],
  "07-09": [
    { year: 1979, title: "Voyager 2 flies by Jupiter", description: "Voyager 2 made its closest approach to Jupiter at 570,000 km, studying the planet's moons and discovering volcanic eruptions on Io.", category: "Discovery" },
    { year: 2003, title: "Opportunity en route to Mars", description: "The Opportunity rover was in cruise phase toward Mars following its July 7 launch, performing course corrections.", category: "Mars" },
  ],
  "07-10": [
    { year: 1962, title: "Telstar 1 launched", description: "AT&T's Telstar 1 became the first active communications satellite, relaying the first transatlantic television signal between the US and Europe.", category: "First" },
    { year: 1992, title: "Giotto encounters Comet Grigg-Skjellerup", description: "ESA's Giotto spacecraft flew past Comet Grigg-Skjellerup at just 200 km, its second cometary encounter after Halley.", category: "Discovery" },
  ],
  "07-11": [
    { year: 1979, title: "Skylab deorbits", description: "Skylab, America's first space station, reentered Earth's atmosphere. Debris fell across Western Australia, and the town of Esperance fined NASA for littering.", category: "Space Station" },
    { year: 2010, title: "Total solar eclipse from space", description: "A total solar eclipse over the South Pacific was observed by multiple satellites, providing unique views of the Moon's shadow on Earth.", category: "Discovery" },
  ],
  "07-12": [
    { year: 2000, title: "Zvezda ISS module launched", description: "Russia launched the Zvezda service module to the ISS, providing living quarters, life support, and propulsion for the station.", category: "Space Station" },
    { year: 1966, title: "Gemini 10 preparations", description: "NASA prepared Gemini 10 for its mission to dock with two different Agena target vehicles and perform high-altitude EVAs.", category: "First" },
  ],
  "07-13": [
    { year: 2015, title: "New Horizons Pluto approach", description: "New Horizons was in its final approach to Pluto, just one day before making history with the first ever Pluto flyby.", category: "Discovery" },
    { year: 2022, title: "James Webb first images preview", description: "NASA previewed the first full-color images from the James Webb Space Telescope, ahead of the public release the next day.", category: "Discovery" },
  ],
  "07-14": [
    { year: 2015, title: "New Horizons flies by Pluto", description: "NASA's New Horizons made its closest approach to Pluto at 12,500 km, revealing a heart-shaped nitrogen ice plain and mountain ranges.", category: "Discovery" },
    { year: 1965, title: "Mariner 4 first Mars flyby", description: "Mariner 4 became the first spacecraft to fly by Mars, returning 22 close-up photos showing a cratered, barren world.", category: "First" },
  ],
  "07-15": [
    { year: 2015, title: "New Horizons data download begins", description: "New Horizons began transmitting its treasure trove of Pluto data back to Earth, a process that would take over 16 months.", category: "Discovery" },
    { year: 2009, title: "STS-127 Endeavour launches", description: "Space Shuttle Endeavour launched on STS-127 to deliver the final piece of JAXA's Kibo laboratory complex to the ISS.", category: "Space Station" },
  ],
  "07-16": [
    { year: 1969, title: "Apollo 11 launches to the Moon", description: "Apollo 11 launched from Kennedy Space Center with Armstrong, Aldrin, and Collins aboard, beginning humanity's first Moon landing mission.", category: "Moon" },
    { year: 1994, title: "Comet Shoemaker-Levy 9 impacts Jupiter", description: "The first fragment of Comet Shoemaker-Levy 9 struck Jupiter, beginning six days of impacts that left dark scars larger than Earth.", category: "Discovery" },
  ],
  "07-17": [
    { year: 1975, title: "Apollo-Soyuz docking", description: "The American Apollo and Soviet Soyuz spacecraft docked in orbit, marking the first international crewed space mission and a symbol of detente.", category: "First" },
    { year: 1994, title: "Shoemaker-Levy 9 impacts continue", description: "Multiple fragments of Comet Shoemaker-Levy 9 continued slamming into Jupiter, with Fragment G creating the largest impact scar.", category: "Discovery" },
  ],
  "07-18": [
    { year: 1966, title: "Gemini 10 launches", description: "Gemini 10 launched with John Young and Michael Collins. They docked with an Agena and used its engine to reach a record altitude of 764 km.", category: "First" },
    { year: 1980, title: "India launches Rohini 1B", description: "India successfully launched the Rohini 1B satellite using its own SLV-3 rocket, becoming the seventh nation to achieve orbital launch.", category: "Satellite" },
  ],
  "07-19": [
    { year: 1969, title: "Apollo 11 enters lunar orbit", description: "Apollo 11 entered orbit around the Moon after a three-day journey from Earth. Armstrong and Aldrin prepared the Lunar Module for descent.", category: "Moon" },
    { year: 2016, title: "Soyuz MS-01 launches", description: "Russia launched the upgraded Soyuz MS-01 spacecraft to the ISS, the first of the modernized MS series.", category: "Space Station" },
  ],
  "07-20": [
    { year: 1969, title: "Apollo 11 Moon landing", description: "Neil Armstrong and Buzz Aldrin landed on the Moon in the Sea of Tranquility. Armstrong's 'one small step' became one of the most famous moments in human history.", category: "Moon" },
    { year: 1976, title: "Viking 1 lands on Mars", description: "NASA's Viking 1 became the first spacecraft to successfully land on Mars and transmit images from the surface, searching for signs of life.", category: "Mars" },
    { year: 1969, title: "First moonwalk", description: "Neil Armstrong took the first steps on the Moon at 10:56 PM EDT, followed by Buzz Aldrin. They spent 2 hours 31 minutes outside the Lunar Module.", category: "First" },
  ],
  "07-21": [
    { year: 2011, title: "Space Shuttle Atlantis lands — final shuttle", description: "Space Shuttle Atlantis landed at Kennedy Space Center, completing STS-135 and ending the 30-year Space Shuttle program.", category: "Shuttle" },
    { year: 1969, title: "Apollo 11 departs the Moon", description: "The Apollo 11 Lunar Module ascent stage launched from the Moon to rejoin Columbia in lunar orbit, beginning the journey home.", category: "Moon" },
  ],
  "07-22": [
    { year: 2019, title: "Chandrayaan-2 launched", description: "India's ISRO launched Chandrayaan-2 to study the Moon's south pole. The orbiter succeeded but the Vikram lander was lost during descent.", category: "Moon" },
    { year: 2009, title: "Total solar eclipse — longest of century", description: "A total solar eclipse lasting 6 minutes 39 seconds crossed Asia and the Pacific, the longest total eclipse of the 21st century.", category: "Discovery" },
  ],
  "07-23": [
    { year: 1999, title: "Chandra X-ray Observatory launched", description: "Space Shuttle Columbia deployed NASA's Chandra X-ray Observatory, one of the Great Observatories, to study X-ray sources in the universe.", category: "Discovery" },
    { year: 2020, title: "Tianwen-1 launched to Mars", description: "China launched its first Mars mission Tianwen-1, which included an orbiter, lander, and rover named Zhurong.", category: "Mars" },
  ],
  "07-24": [
    { year: 1969, title: "Apollo 11 splashdown", description: "The Apollo 11 crew splashed down safely in the Pacific Ocean, completing the first crewed Moon landing mission. They entered quarantine as a precaution.", category: "Moon" },
    { year: 2020, title: "Hope Mars orbiter launched", description: "The UAE launched the Hope Mars orbiter, making it the first Arab nation to send a mission to Mars.", category: "Mars" },
  ],
  "07-25": [
    { year: 1984, title: "Savitskaya — first woman spacewalker", description: "Cosmonaut Svetlana Savitskaya became the first woman to perform a spacewalk during her visit to the Salyut 7 space station.", category: "First" },
    { year: 2001, title: "STS-104 Quest airlock installed", description: "Space Shuttle Atlantis delivered the Quest airlock to the ISS, giving American astronauts independent EVA capability.", category: "Space Station" },
  ],
  "07-26": [
    { year: 2005, title: "STS-114 Return to Flight", description: "Space Shuttle Discovery launched on STS-114, the first shuttle mission after the Columbia disaster, with new safety cameras and procedures.", category: "Shuttle" },
    { year: 1971, title: "Apollo 15 launches", description: "Apollo 15 launched as the first 'J-mission' with an extended lunar stay and the Lunar Roving Vehicle for greater surface exploration.", category: "Moon" },
  ],
  "07-27": [
    { year: 2018, title: "Longest lunar eclipse of century", description: "A total lunar eclipse lasting 1 hour 43 minutes was visible from Africa, the Middle East, and Asia — the longest of the 21st century.", category: "Moon" },
    { year: 2005, title: "STS-114 foam debris observed", description: "Cameras on STS-114 captured foam debris falling from the external tank, leading to the grounding of the shuttle fleet again.", category: "Shuttle" },
  ],
  "07-28": [
    { year: 1973, title: "Skylab 3 launches", description: "The second crewed Skylab mission launched with a crew of three to continue science experiments and maintain the station.", category: "Space Station" },
    { year: 1964, title: "Ranger 7 photographs Moon", description: "Ranger 7 transmitted over 4,300 images before impacting the Moon, the first US mission to return close-up lunar photos.", category: "Moon" },
  ],
  "07-29": [
    { year: 1958, title: "NASA established", description: "President Eisenhower signed the National Aeronautics and Space Act, creating NASA. The agency began operations on October 1, 1958.", category: "First" },
    { year: 2005, title: "Eris (dwarf planet) announced", description: "The discovery of Eris was officially announced, a body larger than Pluto in the Kuiper Belt that would trigger the planet definition debate.", category: "Discovery" },
  ],
  "07-30": [
    { year: 1971, title: "Apollo 15 Moon landing", description: "David Scott and James Irwin landed at Hadley Rille on the Moon, using the Lunar Roving Vehicle to explore further than ever before.", category: "Moon" },
    { year: 2020, title: "Perseverance launches to Mars", description: "NASA launched the Perseverance rover and Ingenuity helicopter to Mars from Cape Canaveral atop an Atlas V rocket.", category: "Mars" },
  ],
  "07-31": [
    { year: 1999, title: "Lunar Prospector impacts Moon", description: "NASA deliberately crashed Lunar Prospector into a crater near the Moon's south pole to search for water ice in the debris plume.", category: "Moon" },
    { year: 1971, title: "Apollo 15 astronauts drive on Moon", description: "Scott and Irwin drove the Lunar Roving Vehicle for the first time on the Moon, reaching speeds of 12 km/h on the surface.", category: "Moon" },
  ],

  // ── AUGUST ──
  "08-01": [
    { year: 1968, title: "Surveyor 5 soil analysis results", description: "NASA published results from Surveyor 5's alpha particle experiment, revealing the Moon's soil composition was similar to basalt.", category: "Moon" },
    { year: 2017, title: "ISS Expedition 52 science operations", description: "ISS crew conducted hundreds of science experiments including studies on bone density loss, fluid dynamics, and plant growth in space.", category: "Space Station" },
  ],
  "08-02": [
    { year: 1971, title: "Apollo 15 drives on Moon", description: "Scott and Irwin explored the Hadley Rille area using the Lunar Rover, finding the 'Genesis Rock' believed to be part of the Moon's original crust.", category: "Moon" },
    { year: 2014, title: "Rosetta enters comet orbit", description: "ESA's Rosetta spacecraft entered orbit around comet 67P/Churyumov-Gerasimenko after a 10-year chase through the solar system.", category: "Discovery" },
  ],
  "08-03": [
    { year: 2004, title: "MESSENGER launched to Mercury", description: "NASA launched MESSENGER to orbit Mercury, the first spacecraft to do so. It would reveal ice in permanently shadowed craters.", category: "Discovery" },
    { year: 1970, title: "Viking program approved", description: "NASA received approval for the Viking program to land on Mars, leading to the first successful Mars landings in 1976.", category: "Mars" },
  ],
  "08-04": [
    { year: 2007, title: "Phoenix launched to Mars", description: "NASA launched the Phoenix Mars lander to study water ice at the Martian north pole. It confirmed the presence of water ice on Mars.", category: "Mars" },
    { year: 1967, title: "Lunar Orbiter 5 launched", description: "NASA launched the fifth and final Lunar Orbiter to photograph potential Apollo landing sites and complete the Moon's photographic survey.", category: "Moon" },
  ],
  "08-05": [
    { year: 2011, title: "Juno launched to Jupiter", description: "NASA launched the Juno spacecraft on an Atlas V rocket, beginning a five-year journey to study Jupiter's composition and magnetic field.", category: "Discovery" },
    { year: 2019, title: "SpaceX Starhopper test flight", description: "SpaceX conducted a 150-meter hover test of the Starhopper prototype, an early step in developing the Starship vehicle.", category: "First" },
  ],
  "08-06": [
    { year: 2012, title: "Curiosity rover lands on Mars", description: "NASA's Curiosity rover landed in Gale Crater using the revolutionary sky crane system. It has been exploring Mars for over a decade.", category: "Mars" },
    { year: 2001, title: "Expedition 3 arrives at ISS", description: "The Expedition 3 crew arrived at the ISS aboard Space Shuttle Discovery, continuing the permanent human presence in orbit.", category: "Space Station" },
  ],
  "08-07": [
    { year: 1971, title: "Apollo 15 returns to Earth", description: "Apollo 15 splashed down in the Pacific. The mission brought back 77 kg of lunar samples including the famous Genesis Rock.", category: "Moon" },
    { year: 2012, title: "Curiosity sends first Mars images", description: "The Curiosity rover transmitted its first images from Gale Crater, showing the Martian landscape and Mount Sharp in the distance.", category: "Mars" },
  ],
  "08-08": [
    { year: 1989, title: "STS-28 classified DoD mission", description: "Space Shuttle Columbia launched on STS-28, a classified Department of Defense mission believed to have deployed a reconnaissance satellite.", category: "Shuttle" },
    { year: 2001, title: "Genesis solar wind sample mission", description: "NASA launched the Genesis spacecraft to collect solar wind particles and return them to Earth for analysis.", category: "Discovery" },
  ],
  "08-09": [
    { year: 2005, title: "STS-114 Return to Flight lands", description: "Space Shuttle Discovery landed safely after the STS-114 Return to Flight mission, though foam shedding concerns would delay future flights.", category: "Shuttle" },
    { year: 1973, title: "Mars 7 launched", description: "The Soviet Union launched Mars 7 to land on Mars, but the lander missed the planet due to a premature separation.", category: "Mars" },
  ],
  "08-10": [
    { year: 1966, title: "Lunar Orbiter 1 enters Moon orbit", description: "Lunar Orbiter 1 became the first US spacecraft to orbit the Moon, photographing potential Apollo landing sites.", category: "Moon" },
    { year: 2009, title: "ISS Japanese logistics module arrives", description: "The Japanese H-II Transfer Vehicle (HTV) made its first flight to the ISS, bringing supplies and equipment.", category: "Space Station" },
  ],
  "08-11": [
    { year: 2018, title: "Parker Solar Probe launched", description: "NASA launched the Parker Solar Probe to study the Sun's corona up close, eventually coming within 6.1 million km of the solar surface.", category: "Discovery" },
    { year: 1962, title: "Vostok 3 launches", description: "The Soviet Union launched Vostok 3 with Andriyan Nikolayev for a dual spaceflight with Vostok 4, the first time two crewed spacecraft were in orbit simultaneously.", category: "First" },
  ],
  "08-12": [
    { year: 1977, title: "Space Shuttle Enterprise free flight", description: "The Space Shuttle Enterprise was released from a Boeing 747 for its first free flight, gliding to a landing at Edwards Air Force Base.", category: "Shuttle" },
    { year: 2018, title: "Parker Solar Probe begins journey", description: "The Parker Solar Probe began its journey toward the Sun after launching the previous day, planning multiple Venus gravity assists.", category: "Discovery" },
  ],
  "08-13": [
    { year: 2004, title: "ISS Expedition 9 spacewalk", description: "ISS crew members performed a spacewalk to replace a failed gyroscope, maintaining the station's attitude control capability.", category: "Space Station" },
    { year: 1961, title: "Construction of Berlin Wall begins", description: "Space reconnaissance satellites would soon provide invaluable intelligence about military activities along the Iron Curtain.", category: "Satellite" },
  ],
  "08-14": [
    { year: 2016, title: "China launches quantum satellite", description: "China launched the Micius quantum science satellite, conducting experiments in quantum entanglement over record distances.", category: "Satellite" },
    { year: 2003, title: "Northeast blackout and satellites", description: "The massive Northeast blackout in the US and Canada was visible from space, highlighting satellites' ability to monitor human activity.", category: "Satellite" },
  ],
  "08-15": [
    { year: 1977, title: "Wow! signal detected", description: "Astronomer Jerry Ehman detected a strong narrowband radio signal at SETI's Big Ear telescope, writing 'Wow!' on the printout. Its origin remains unexplained.", category: "Discovery" },
    { year: 2019, title: "India launches Chandrayaan-2 update", description: "Chandrayaan-2 continued its journey to the Moon, performing orbit-raising maneuvers to reach the translunar injection point.", category: "Moon" },
  ],
  "08-16": [
    { year: 2005, title: "Canary Islands Astrophysics Institute work", description: "Major observatories continued studying the cosmos, contributing to exoplanet discoveries and deep space observations.", category: "Discovery" },
    { year: 2007, title: "STS-118 ISS truss expansion", description: "Space Shuttle Endeavour's STS-118 crew installed a new truss segment on the ISS, expanding its structural backbone.", category: "Space Station" },
  ],
  "08-17": [
    { year: 2017, title: "LIGO detects neutron star merger", description: "LIGO and Virgo detected gravitational waves from two neutron stars merging, the first such event observed in both gravitational waves and light.", category: "Discovery" },
    { year: 1970, title: "Venera 7 launched", description: "The Soviet Union launched Venera 7, which would become the first spacecraft to successfully transmit data from the surface of Venus.", category: "First" },
  ],
  "08-18": [
    { year: 1868, title: "Helium discovered during eclipse", description: "During a total solar eclipse, astronomers Pierre Janssen and Joseph Lockyer independently discovered helium in the Sun's spectrum.", category: "Discovery" },
    { year: 1999, title: "Cassini Earth flyby", description: "The Cassini spacecraft flew by Earth to gain a gravity boost on its way to Saturn, coming within 1,171 km.", category: "Discovery" },
  ],
  "08-19": [
    { year: 1960, title: "Sputnik 5 — dogs in orbit return safely", description: "The Soviet Union launched Sputnik 5 carrying dogs Belka and Strelka, who became the first animals to orbit Earth and return alive.", category: "First" },
    { year: 2004, title: "ISS Expedition 9 experiments", description: "The ISS crew continued a packed schedule of science experiments in materials science, biology, and Earth observation.", category: "Space Station" },
  ],
  "08-20": [
    { year: 1975, title: "Viking 1 launched to Mars", description: "NASA launched Viking 1, which would become the first spacecraft to successfully land on Mars and return images from the surface.", category: "Mars" },
    { year: 1977, title: "Voyager 2 launched", description: "Voyager 2 launched from Cape Canaveral, beginning its grand tour of the outer Solar System visiting Jupiter, Saturn, Uranus, and Neptune.", category: "Discovery" },
  ],
  "08-21": [
    { year: 2017, title: "Great American Solar Eclipse", description: "A total solar eclipse crossed the continental US from coast to coast for the first time since 1918, observed by millions.", category: "Discovery" },
    { year: 1965, title: "Gemini 5 launches", description: "Gemini 5 launched with Gordon Cooper and Pete Conrad for an 8-day mission, proving humans could endure weightlessness long enough for a Moon trip.", category: "First" },
  ],
  "08-22": [
    { year: 1989, title: "Voyager 2 closest to Neptune's moon Triton", description: "Voyager 2 flew past Neptune's moon Triton, revealing geysers of nitrogen gas and one of the coldest surfaces in the Solar System.", category: "Discovery" },
    { year: 2014, title: "ISS 3D printer activated", description: "The first 3D printer on the ISS was prepared for testing, demonstrating manufacturing in microgravity.", category: "Space Station" },
  ],
  "08-23": [
    { year: 1966, title: "Lunar Orbiter 1 photographs Earth", description: "Lunar Orbiter 1 captured the first photograph of Earth as seen from the Moon's vicinity, a precursor to the famous Earthrise photo.", category: "Moon" },
    { year: 2006, title: "IAU redefines 'planet' — Pluto demoted", description: "The International Astronomical Union voted to reclassify Pluto as a 'dwarf planet,' reducing the Solar System's planet count to eight.", category: "Discovery" },
  ],
  "08-24": [
    { year: 2006, title: "Pluto officially demoted", description: "Following the IAU vote, Pluto's reclassification as a dwarf planet was formalized, sparking public debate and scientific discussion.", category: "Discovery" },
    { year: 2016, title: "Proxima Centauri b announced", description: "Astronomers announced the discovery of Proxima Centauri b, an Earth-sized exoplanet in the habitable zone of the nearest star.", category: "Discovery" },
  ],
  "08-25": [
    { year: 1989, title: "Voyager 2 Neptune flyby", description: "Voyager 2 made its closest approach to Neptune at 4,951 km, discovering the Great Dark Spot, rings, and six new moons. It remains the only spacecraft to visit Neptune.", category: "Discovery" },
    { year: 2003, title: "Spitzer Space Telescope launched", description: "NASA launched the Spitzer Space Telescope, the last of the Great Observatories, to observe the universe in infrared light.", category: "Discovery" },
  ],
  "08-26": [
    { year: 1981, title: "Voyager 2 Saturn flyby", description: "Voyager 2 flew past Saturn, studying the planet's rings and moons before heading toward Uranus and Neptune.", category: "Discovery" },
    { year: 1999, title: "ISS Zarya power system upgrade", description: "Engineers prepared upgrades for the ISS Zarya module's power system to support the growing station.", category: "Space Station" },
  ],
  "08-27": [
    { year: 2003, title: "Mars closest approach in 60,000 years", description: "Mars came within 55.76 million km of Earth, its closest approach in nearly 60,000 years. Amateur astronomers enjoyed spectacular views.", category: "Mars" },
    { year: 1962, title: "Mariner 2 launched to Venus", description: "NASA launched Mariner 2, which became the first spacecraft to successfully fly by another planet, passing Venus in December.", category: "First" },
  ],
  "08-28": [
    { year: 1993, title: "Galileo flies by asteroid Ida", description: "NASA's Galileo spacecraft flew past asteroid 243 Ida, discovering its tiny moon Dactyl — the first confirmed asteroid moon.", category: "Discovery" },
    { year: 2009, title: "STS-128 Discovery launches", description: "Space Shuttle Discovery launched on STS-128, carrying Leonardo MPLM full of supplies and science equipment to the ISS.", category: "Shuttle" },
  ],
  "08-29": [
    { year: 1965, title: "Gemini 5 returns", description: "Gemini 5 splashed down after 8 days in orbit, proving that astronauts could function in space long enough for a lunar mission.", category: "First" },
    { year: 2009, title: "Japan launches HTV-1 to ISS", description: "JAXA launched its first H-II Transfer Vehicle to resupply the ISS, delivering over 3,500 kg of cargo.", category: "Space Station" },
  ],
  "08-30": [
    { year: 1983, title: "First African American in space", description: "Guion Bluford became the first African American in space aboard Space Shuttle Challenger on STS-8.", category: "First" },
    { year: 1984, title: "STS-41-D Discovery maiden flight", description: "Space Shuttle Discovery launched on its maiden voyage, STS-41-D, deploying three communications satellites.", category: "Shuttle" },
  ],
  "08-31": [
    { year: 2012, title: "Voyager 1 in interstellar space", description: "Although not confirmed until 2013, Voyager 1 crossed into interstellar space around this date, becoming the first human-made object to do so.", category: "First" },
    { year: 1979, title: "Comet Howard-Koomen-Michels hits Sun", description: "A comet was observed plunging into the Sun by the SOLWIND satellite, one of the first sun-grazing comets detected from space.", category: "Discovery" },
  ],

  // ── SEPTEMBER ──
  "09-01": [
    { year: 1979, title: "Pioneer 11 flies by Saturn", description: "Pioneer 11 became the first spacecraft to fly by Saturn, discovering a new ring and measuring the planet's magnetic field.", category: "First" },
    { year: 2020, title: "ISS minor air leak investigation", description: "ISS crew investigated a slow air leak in the Zvezda module, using tea bags to track air flow and find the source.", category: "Space Station" },
  ],
  "09-02": [
    { year: 1993, title: "US-Russia space station agreement", description: "The US and Russia signed an agreement to merge their space station programs, leading to Russia joining the ISS project.", category: "Space Station" },
    { year: 2012, title: "Curiosity begins driving on Mars", description: "The Curiosity rover began driving across Mars, heading toward Mount Sharp to study layers of geological history.", category: "Mars" },
  ],
  "09-03": [
    { year: 1976, title: "Viking 2 lands on Mars", description: "NASA's Viking 2 lander touched down on Mars at Utopia Planitia, conducting soil experiments to search for signs of microbial life.", category: "Mars" },
    { year: 2004, title: "Genesis sample return crash", description: "NASA's Genesis spacecraft's sample return capsule crashed in Utah when its parachute failed, but scientists still recovered solar wind samples.", category: "Discovery" },
  ],
  "09-04": [
    { year: 2016, title: "Rosetta finds Philae lander", description: "Rosetta's camera spotted the Philae lander wedged in a crack on comet 67P, solving the mystery of where it came to rest.", category: "Discovery" },
    { year: 2015, title: "Japan launches HTV-5", description: "JAXA launched the fifth H-II Transfer Vehicle to deliver supplies to the ISS, including experiments and crew provisions.", category: "Space Station" },
  ],
  "09-05": [
    { year: 1977, title: "Voyager 1 launched", description: "Voyager 1 launched from Cape Canaveral on a mission to study Jupiter and Saturn. It is now the most distant human-made object, over 24 billion km from Earth.", category: "Discovery" },
    { year: 2008, title: "Rosetta flies by asteroid Steins", description: "ESA's Rosetta spacecraft flew past asteroid 2867 Steins at 800 km, taking detailed images of the diamond-shaped body.", category: "Discovery" },
  ],
  "09-06": [
    { year: 2018, title: "Japan's Hayabusa2 deploys rovers on Ryugu", description: "Hayabusa2 deployed the MINERVA-II rovers onto asteroid Ryugu, the first mobile exploration of an asteroid surface.", category: "First" },
    { year: 2007, title: "Japan launches SELENE/Kaguya to Moon", description: "JAXA launched the SELENE (Kaguya) lunar orbiter, which returned stunning high-definition video of the Moon.", category: "Moon" },
  ],
  "09-07": [
    { year: 2008, title: "India's Chandrayaan-1 preparations", description: "ISRO made final preparations for the launch of Chandrayaan-1, India's first lunar mission.", category: "Moon" },
    { year: 1995, title: "STS-69 Endeavour launches", description: "Space Shuttle Endeavour launched on STS-69, deploying and retrieving two satellites during the mission.", category: "Shuttle" },
  ],
  "09-08": [
    { year: 2016, title: "OSIRIS-REx launched to asteroid Bennu", description: "NASA launched OSIRIS-REx to collect samples from asteroid Bennu and return them to Earth, arriving at Bennu in December 2018.", category: "Discovery" },
    { year: 1967, title: "Surveyor 5 lands on Moon", description: "NASA's Surveyor 5 soft-landed on the Moon in the Sea of Tranquility, performing the first chemical analysis of lunar soil.", category: "Moon" },
  ],
  "09-09": [
    { year: 1975, title: "Viking 2 launched to Mars", description: "NASA launched Viking 2 aboard a Titan IIIE rocket, the second of two spacecraft to land on and study the surface of Mars.", category: "Mars" },
    { year: 2006, title: "STS-115 Atlantis resumes ISS construction", description: "Space Shuttle Atlantis launched on STS-115, resuming ISS construction after a year-long hiatus by delivering new solar arrays.", category: "Space Station" },
  ],
  "09-10": [
    { year: 2011, title: "GRAIL launched to Moon", description: "NASA launched the twin GRAIL spacecraft to map the Moon's gravitational field in unprecedented detail.", category: "Moon" },
    { year: 1857, title: "James Keeler born", description: "Astronomer James Keeler was born. He would confirm that Saturn's rings are composed of individual particles orbiting the planet.", category: "Discovery" },
  ],
  "09-11": [
    { year: 2007, title: "ISS crew watches from orbit", description: "ISS crew members had a unique perspective on 9/11 anniversary observances, photographing memorials from orbit.", category: "Space Station" },
    { year: 1985, title: "ICE comet encounter", description: "The International Cometary Explorer passed through the tail of Comet Giacobini-Zinner, the first comet encounter by a spacecraft.", category: "First" },
  ],
  "09-12": [
    { year: 1959, title: "Luna 2 launched — first to reach Moon", description: "The Soviet Union launched Luna 2, which became the first human-made object to reach the Moon, impacting on September 14.", category: "First" },
    { year: 1966, title: "Gemini 11 launches to record altitude", description: "Gemini 11 launched and set an altitude record of 1,374 km, still the highest ever reached by a crewed spacecraft in Earth orbit.", category: "First" },
  ],
  "09-13": [
    { year: 1959, title: "Luna 2 on course to Moon", description: "Luna 2 continued its trajectory toward the Moon, carrying Soviet pennants that would become the first human artifacts on another world.", category: "Moon" },
    { year: 2007, title: "Kaguya enters Moon orbit", description: "Japan's Kaguya spacecraft entered lunar orbit and began returning high-definition imagery of the Moon's surface.", category: "Moon" },
  ],
  "09-14": [
    { year: 1959, title: "Luna 2 impacts the Moon", description: "Luna 2 became the first human-made object to reach the Moon, impacting in the Palus Putredinis region. It proved spacecraft could reach other worlds.", category: "First" },
    { year: 2015, title: "LIGO detects gravitational waves", description: "LIGO detected gravitational waves for the first time from the merger of two black holes, confirming Einstein's prediction. Announced in February 2016.", category: "Discovery" },
  ],
  "09-15": [
    { year: 2017, title: "Cassini Grand Finale", description: "NASA's Cassini spacecraft plunged into Saturn's atmosphere after 13 years of orbiting the planet, ending one of the most successful missions ever.", category: "Discovery" },
    { year: 1965, title: "Gemini 5 results published", description: "NASA published results from the Gemini 5 mission, confirming humans could handle the duration needed for a Moon trip.", category: "First" },
  ],
  "09-16": [
    { year: 2021, title: "Inspiration4 civilian mission", description: "SpaceX launched the Inspiration4 mission, the first all-civilian orbital spaceflight, with four private citizens orbiting for three days.", category: "First" },
    { year: 2016, title: "Tiangong-2 launched", description: "China launched the Tiangong-2 space laboratory, its second orbital station, for crew visits and experiments.", category: "Space Station" },
  ],
  "09-17": [
    { year: 1857, title: "Tsiolkovsky born", description: "Konstantin Tsiolkovsky, the father of theoretical astronautics, was born. He derived the rocket equation and envisioned space stations.", category: "Discovery" },
    { year: 1976, title: "Space Shuttle Enterprise unveiled", description: "NASA unveiled the first Space Shuttle orbiter, Enterprise, in a ceremony at Palmdale, California attended by the Star Trek cast.", category: "Shuttle" },
  ],
  "09-18": [
    { year: 2006, title: "Anousheh Ansari — first female space tourist", description: "Iranian-American Anousheh Ansari launched to the ISS, becoming the first female space tourist and the first Iranian in space.", category: "First" },
    { year: 2013, title: "Cygnus spacecraft first ISS docking", description: "Orbital Sciences' Cygnus spacecraft docked with the ISS for the first time during a demonstration mission.", category: "Space Station" },
  ],
  "09-19": [
    { year: 1988, title: "Israel launches first satellite", description: "Israel launched its first satellite, Ofeq 1, from the Palmachim airbase, becoming the eighth nation to achieve orbital launch.", category: "Satellite" },
    { year: 2013, title: "Cygnus CRS Orb-D1 docking complete", description: "The Cygnus demonstration mission completed berthing with the ISS, paving the way for regular commercial resupply missions.", category: "Space Station" },
  ],
  "09-20": [
    { year: 1966, title: "Surveyor 2 crashes on Moon", description: "NASA's Surveyor 2 tumbled out of control and crashed on the Moon when one of its vernier engines failed to ignite during a course correction.", category: "Moon" },
    { year: 2017, title: "Cassini data analysis begins", description: "Scientists began analyzing the final trove of data from Cassini's Grand Finale plunge through Saturn's rings.", category: "Discovery" },
  ],
  "09-21": [
    { year: 2003, title: "Galileo plunges into Jupiter", description: "NASA intentionally crashed the Galileo spacecraft into Jupiter's atmosphere to prevent contamination of Europa. It had orbited Jupiter for eight years.", category: "Discovery" },
    { year: 2021, title: "Inspiration4 returns to Earth", description: "SpaceX's all-civilian Inspiration4 crew splashed down in the Atlantic after three days in orbit, advancing commercial spaceflight.", category: "First" },
  ],
  "09-22": [
    { year: 2006, title: "Hinode solar observatory launched", description: "JAXA launched Hinode (Solar-B) to study the Sun's magnetic field and corona in unprecedented detail.", category: "Satellite" },
    { year: 2014, title: "MAVEN enters Mars orbit", description: "NASA's MAVEN spacecraft entered Mars orbit to study how the planet lost its atmosphere over billions of years.", category: "Mars" },
  ],
  "09-23": [
    { year: 1846, title: "Neptune discovered", description: "Johann Galle and Heinrich d'Arrest discovered Neptune at the Berlin Observatory, guided by calculations from Urbain Le Verrier.", category: "Discovery" },
    { year: 2014, title: "India's Mangalyaan enters Mars orbit", description: "India's Mars Orbiter Mission (Mangalyaan) entered Mars orbit, making ISRO the first Asian agency to reach Mars.", category: "Mars" },
  ],
  "09-24": [
    { year: 2014, title: "Mangalyaan begins Mars science", description: "India's Mars Orbiter Mission began its science phase, studying Mars's atmosphere and surface mineralogy.", category: "Mars" },
    { year: 2023, title: "OSIRIS-REx returns Bennu samples", description: "NASA's OSIRIS-REx mission returned samples from asteroid Bennu to Earth, landing the capsule in Utah.", category: "Discovery" },
  ],
  "09-25": [
    { year: 1992, title: "Mars Observer launched", description: "NASA launched Mars Observer to study Mars's surface and atmosphere. Contact was lost three days before orbit insertion in 1993.", category: "Mars" },
    { year: 2008, title: "Shenzhou-7 first Chinese EVA", description: "Taikonaut Zhai Zhigang performed China's first spacewalk during the Shenzhou-7 mission, wearing a Chinese-made spacesuit.", category: "First" },
  ],
  "09-26": [
    { year: 2011, title: "Tiangong-1 launched", description: "China launched the Tiangong-1 prototype space laboratory, designed for short-term crewed missions and docking practice.", category: "Space Station" },
    { year: 2014, title: "ISS Expedition 41 science", description: "ISS crew conducted over 250 science experiments including human research, Earth observation, and technology demonstrations.", category: "Space Station" },
  ],
  "09-27": [
    { year: 2003, title: "SMART-1 launched to Moon", description: "ESA launched SMART-1, which used ion propulsion to reach the Moon — the first European mission to the Moon.", category: "Moon" },
    { year: 2021, title: "Lucy launched to Jupiter trojans", description: "NASA launched the Lucy mission to study the Trojan asteroids that share Jupiter's orbit, beginning a 12-year journey.", category: "Discovery" },
  ],
  "09-28": [
    { year: 2008, title: "SpaceX Falcon 1 reaches orbit", description: "SpaceX's Falcon 1 became the first privately developed liquid-fueled rocket to reach orbit, on its fourth attempt.", category: "First" },
    { year: 2015, title: "Water on Mars confirmed", description: "NASA announced strong evidence of liquid water flowing on present-day Mars, based on seasonal dark streaks observed by MRO.", category: "Mars" },
  ],
  "09-29": [
    { year: 1988, title: "STS-26 Return to Flight after Challenger", description: "Space Shuttle Discovery launched on STS-26, the first shuttle mission after the Challenger disaster, carrying a TDRS satellite.", category: "Shuttle" },
    { year: 1962, title: "Alouette 1 — first Canadian satellite", description: "Canada became the third nation to operate a satellite with the launch of Alouette 1 to study the ionosphere.", category: "Satellite" },
  ],
  "09-30": [
    { year: 2016, title: "Rosetta ends mission on comet", description: "ESA intentionally crashed Rosetta into comet 67P, ending its remarkable 12-year mission with one last burst of close-up science data.", category: "Discovery" },
    { year: 2005, title: "Mars Reconnaissance Orbiter en route", description: "NASA's MRO continued its cruise toward Mars, preparing for orbit insertion in March 2006.", category: "Mars" },
  ],

  // ── OCTOBER ──
  "10-01": [
    { year: 1958, title: "NASA begins operations", description: "NASA officially opened for business, absorbing NACA and taking charge of the US civilian space program.", category: "First" },
    { year: 2009, title: "Ares I-X test flight", description: "NASA launched the Ares I-X test rocket, a prototype for the Constellation program's crew launch vehicle.", category: "Satellite" },
  ],
  "10-02": [
    { year: 2019, title: "Starship design update", description: "SpaceX revealed the Starship Mk1 prototype, outlining plans for the fully reusable launch system to carry humans to Mars.", category: "Mars" },
    { year: 1984, title: "Longest crewed spaceflight (at time)", description: "Soviet cosmonauts Kizim, Solovyov, and Atkov returned from Salyut 7 after 237 days, setting a new endurance record.", category: "Space Station" },
  ],
  "10-03": [
    { year: 1962, title: "Mercury-Atlas 8 — Sigma 7", description: "Astronaut Wally Schirra orbited Earth six times aboard Sigma 7 in a textbook Mercury flight lasting over 9 hours.", category: "First" },
    { year: 1942, title: "First V-2 rocket reaches space", description: "Germany launched a V-2 rocket that reached an altitude of 84.5 km, becoming the first human-made object to reach the boundary of space.", category: "First" },
  ],
  "10-04": [
    { year: 1957, title: "Sputnik 1 — first artificial satellite", description: "The Soviet Union launched Sputnik 1, the first artificial satellite, aboard an R-7 rocket. Its radio beeps were picked up worldwide and shocked the West.", category: "First" },
    { year: 2004, title: "SpaceShipOne wins Ansari X Prize", description: "SpaceShipOne completed its second flight above 100 km in two weeks, winning the $10 million Ansari X Prize for private spaceflight.", category: "First" },
  ],
  "10-05": [
    { year: 1984, title: "STS-41-G first crew with two women", description: "Space Shuttle Challenger launched on STS-41-G with Sally Ride and Kathryn Sullivan, the first shuttle crew with two women.", category: "First" },
    { year: 2018, title: "Europe's BepiColombo launched to Mercury", description: "ESA and JAXA launched BepiColombo to study Mercury, carrying two orbiters on a seven-year journey.", category: "Discovery" },
  ],
  "10-06": [
    { year: 1990, title: "Ulysses solar probe launched", description: "Space Shuttle Discovery deployed the ESA/NASA Ulysses spacecraft to study the Sun's poles, using Jupiter's gravity to leave the ecliptic plane.", category: "Discovery" },
    { year: 2004, title: "Burt Rutan awarded X Prize", description: "Burt Rutan and Paul Allen were formally awarded the Ansari X Prize for SpaceShipOne's back-to-back flights to space.", category: "First" },
  ],
  "10-07": [
    { year: 1959, title: "Luna 3 photographs far side of Moon", description: "The Soviet Luna 3 captured the first images of the Moon's far side, revealing it looks dramatically different from the near side.", category: "First" },
    { year: 2008, title: "MESSENGER second Mercury flyby", description: "NASA's MESSENGER spacecraft completed its second flyby of Mercury, imaging previously unseen portions of the surface.", category: "Discovery" },
  ],
  "10-08": [
    { year: 2009, title: "LCROSS impacts Moon", description: "NASA's LCROSS mission crashed into a permanently shadowed crater near the Moon's south pole and confirmed the presence of water ice.", category: "Moon" },
    { year: 2003, title: "China announces Shenzhou-5 crew", description: "China announced Yang Liwei as the taikonaut for the Shenzhou-5 mission, which would make China the third nation to launch humans to space.", category: "First" },
  ],
  "10-09": [
    { year: 2009, title: "LCROSS water ice confirmed", description: "NASA confirmed that LCROSS detected significant amounts of water ice in the debris plume from its lunar impact.", category: "Moon" },
    { year: 2013, title: "Juno Earth flyby", description: "NASA's Juno spacecraft flew by Earth for a gravity assist boost on its way to Jupiter.", category: "Discovery" },
  ],
  "10-10": [
    { year: 1967, title: "Outer Space Treaty takes effect", description: "The Outer Space Treaty entered into force, establishing that space shall be free for exploration by all nations and banning weapons of mass destruction in orbit.", category: "First" },
    { year: 2007, title: "STS-120 ISS assembly", description: "Space Shuttle Discovery launched on STS-120, delivering the Harmony connecting module to the ISS.", category: "Space Station" },
  ],
  "10-11": [
    { year: 1968, title: "Apollo 7 — first crewed Apollo", description: "Apollo 7 launched with Schirra, Eisele, and Cunningham on the first crewed Apollo mission, testing the Command Module in Earth orbit.", category: "Moon" },
    { year: 1984, title: "Kathryn Sullivan — first American EVA (woman)", description: "Kathryn Sullivan became the first American woman to walk in space during STS-41-G.", category: "First" },
  ],
  "10-12": [
    { year: 1964, title: "Voskhod 1 — first multi-person crew", description: "The Soviet Union launched Voskhod 1 with three cosmonauts, the first multi-person spaceflight. They flew without spacesuits due to limited space.", category: "First" },
    { year: 2005, title: "Shenzhou-6 launches", description: "China launched Shenzhou-6 with two taikonauts for a five-day mission, its second crewed spaceflight.", category: "Space Station" },
  ],
  "10-13": [
    { year: 2016, title: "Schiaparelli Mars lander preparations", description: "ESA's Schiaparelli Mars lander separated from the ExoMars Trace Gas Orbiter in preparation for its landing attempt.", category: "Mars" },
    { year: 2006, title: "ISS Expedition 14 begins", description: "Expedition 14 began aboard the ISS with crew from the US and Russia continuing the station's science program.", category: "Space Station" },
  ],
  "10-14": [
    { year: 2012, title: "Felix Baumgartner's space jump", description: "Felix Baumgartner jumped from a balloon at 39 km altitude, breaking the sound barrier during freefall and setting several records.", category: "First" },
    { year: 1947, title: "Chuck Yeager breaks sound barrier", description: "Chuck Yeager became the first person to fly faster than the speed of sound in the Bell X-1, paving the way for supersonic flight and spaceflight.", category: "First" },
  ],
  "10-15": [
    { year: 2003, title: "Shenzhou-5 — first Chinese in space", description: "Yang Liwei became the first Chinese person in space aboard Shenzhou-5, making China the third nation to independently launch humans into orbit.", category: "First" },
    { year: 1997, title: "Cassini launched to Saturn", description: "NASA launched the Cassini-Huygens mission to study Saturn and its moons, beginning a seven-year journey to the ringed planet.", category: "Discovery" },
  ],
  "10-16": [
    { year: 2003, title: "Yang Liwei returns from orbit", description: "Shenzhou-5 landed safely in Inner Mongolia after 21 hours in space, cementing China's place as a spacefaring nation.", category: "First" },
    { year: 1975, title: "GOES-1 weather satellite launched", description: "NASA launched GOES-1, the first Geostationary Operational Environmental Satellite, revolutionizing weather forecasting.", category: "Satellite" },
  ],
  "10-17": [
    { year: 2016, title: "Shenzhou-11 launches", description: "China launched Shenzhou-11 with two taikonauts for a 30-day mission to the Tiangong-2 space laboratory.", category: "Space Station" },
    { year: 1989, title: "Galileo launched to Jupiter", description: "Space Shuttle Atlantis deployed the Galileo spacecraft on STS-34, beginning its six-year journey to orbit Jupiter.", category: "Discovery" },
  ],
  "10-18": [
    { year: 1989, title: "Galileo begins Jupiter journey", description: "Following deployment from Atlantis, Galileo began its complex gravity-assist trajectory using Venus and Earth to reach Jupiter.", category: "Discovery" },
    { year: 1967, title: "Venera 4 enters Venus atmosphere", description: "The Soviet Venera 4 became the first probe to transmit data from within another planet's atmosphere during its descent through Venus's clouds.", category: "First" },
  ],
  "10-19": [
    { year: 2016, title: "Schiaparelli Mars landing failure", description: "ESA's Schiaparelli lander crashed on Mars after its thrusters shut off prematurely during descent, though the ExoMars orbiter succeeded.", category: "Mars" },
    { year: 1967, title: "Mariner 5 flies by Venus", description: "Mariner 5 passed within 3,990 km of Venus, measuring its atmospheric pressure and confirming temperatures above 400C.", category: "Discovery" },
  ],
  "10-20": [
    { year: 2018, title: "BepiColombo launched to Mercury", description: "ESA and JAXA launched BepiColombo, carrying two Mercury orbiters on a seven-year journey to the innermost planet.", category: "Discovery" },
    { year: 1968, title: "Apollo 7 splashes down", description: "Apollo 7 splashed down after an 11-day mission that successfully tested the Apollo Command Module in Earth orbit.", category: "Moon" },
  ],
  "10-21": [
    { year: 2013, title: "Cygnus CRS Orb-1 launches to ISS", description: "Orbital Sciences launched the first operational Cygnus resupply mission to the ISS aboard an Antares rocket.", category: "Space Station" },
    { year: 2021, title: "Lucy asteroid mission trajectory correction", description: "NASA's Lucy spacecraft performed course corrections on its 12-year journey to study Jupiter's Trojan asteroids.", category: "Discovery" },
  ],
  "10-22": [
    { year: 1966, title: "Luna 12 enters Moon orbit", description: "The Soviet Luna 12 entered orbit around the Moon, photographing the surface from altitudes as low as 100 km.", category: "Moon" },
    { year: 2008, title: "Chandrayaan-1 launched", description: "India launched its first lunar mission, Chandrayaan-1, which discovered water molecules on the Moon's surface.", category: "Moon" },
  ],
  "10-23": [
    { year: 2007, title: "STS-120 Harmony node delivered", description: "Space Shuttle Discovery delivered the Harmony Node 2 module to the ISS, enabling attachment of European and Japanese laboratories.", category: "Space Station" },
    { year: 2014, title: "Partial solar eclipse visible from North America", description: "A partial solar eclipse was visible across much of North America, observed by ground telescopes and space-based solar observatories.", category: "Discovery" },
  ],
  "10-24": [
    { year: 1998, title: "Deep Space 1 launched", description: "NASA launched Deep Space 1, the first spacecraft to use ion propulsion as its primary propulsion system.", category: "First" },
    { year: 2007, title: "Chang'e-1 launched", description: "China launched its first lunar orbiter, Chang'e-1, to map the Moon's surface. It orbited for 16 months before impact.", category: "Moon" },
  ],
  "10-25": [
    { year: 2006, title: "STEREO mission launched", description: "NASA launched the twin STEREO spacecraft to study the Sun from two vantage points, providing the first 3D views of solar activity.", category: "Satellite" },
    { year: 2019, title: "Starship prototype testing", description: "SpaceX continued testing Starship prototypes at Boca Chica, Texas, developing the fully reusable launch system.", category: "First" },
  ],
  "10-26": [
    { year: 2004, title: "Cassini Titan flyby", description: "Cassini made its first close flyby of Saturn's moon Titan at just 1,200 km, peering through the haze with radar and infrared cameras.", category: "Discovery" },
    { year: 1977, title: "Soviet nuclear satellite incident preparations", description: "Military and space agencies tracked Cosmos 954, a nuclear-powered Soviet satellite that would later crash in Canada.", category: "Satellite" },
  ],
  "10-27": [
    { year: 1961, title: "Saturn I first launch", description: "NASA launched the Saturn I rocket (SA-1) on its maiden flight from Cape Canaveral, the first in the Saturn family that would carry humans to the Moon.", category: "Moon" },
    { year: 2003, title: "ISS solar array concerns", description: "Engineers investigated electrical issues with the ISS solar arrays, part of ongoing maintenance of the growing station.", category: "Space Station" },
  ],
  "10-28": [
    { year: 1971, title: "Prospero — UK's only satellite launch", description: "The UK launched its only satellite using a domestic rocket (Black Arrow) from Woomera, Australia. Prospero is still in orbit.", category: "Satellite" },
    { year: 2009, title: "Ares I-X test flight preparations", description: "NASA made final preparations for the Ares I-X test flight at Kennedy Space Center.", category: "Satellite" },
  ],
  "10-29": [
    { year: 1998, title: "ISS Zarya module launched", description: "The first ISS module, Zarya (FGB), was launched aboard a Russian Proton rocket from Baikonur Cosmodrome, beginning the assembly of the International Space Station.", category: "Space Station" },
    { year: 1998, title: "John Glenn returns to space at 77", description: "John Glenn launched aboard Space Shuttle Discovery on STS-95 at age 77, becoming the oldest person to fly in space at that time.", category: "First" },
  ],
  "10-30": [
    { year: 1967, title: "First automated docking in space", description: "Soviet Cosmos 186 and Cosmos 188 performed the first automated (unmanned) docking of two spacecraft in orbit.", category: "First" },
    { year: 2017, title: "ISS Expedition 53 operations", description: "ISS crew conducted research on combustion, fluid dynamics, and materials science in the microgravity environment.", category: "Space Station" },
  ],
  "10-31": [
    { year: 2000, title: "ISS Expedition 1 launches", description: "The Soyuz TM-31 launched carrying the first permanent crew of the ISS — Bill Shepherd, Yuri Gidzenko, and Sergei Krikalev.", category: "Space Station" },
    { year: 2005, title: "Hubble discovers Pluto's moons Nix and Hydra", description: "Astronomers using Hubble discovered two small moons orbiting Pluto, later named Nix and Hydra.", category: "Discovery" },
  ],

  // ── NOVEMBER ──
  "11-01": [
    { year: 1962, title: "Mars 1 launched", description: "The Soviet Union launched Mars 1, the first spacecraft intended to fly by Mars. Communication was lost en route, but it flew by at 193,000 km.", category: "Mars" },
    { year: 2018, title: "Dawn mission ends at Ceres", description: "NASA's Dawn spacecraft ran out of fuel while orbiting dwarf planet Ceres, ending its groundbreaking mission.", category: "Discovery" },
  ],
  "11-02": [
    { year: 2000, title: "ISS Expedition 1 arrives", description: "The first permanent crew entered the ISS, beginning an unbroken chain of human presence in space that continues to this day.", category: "Space Station" },
    { year: 1985, title: "STS-61-A German Spacelab mission", description: "Space Shuttle Challenger launched on STS-61-A carrying the German D-1 Spacelab with a record eight crew members.", category: "Shuttle" },
  ],
  "11-03": [
    { year: 1957, title: "Laika — first animal in orbit", description: "The Soviet Union launched Sputnik 2 carrying Laika, a stray dog from Moscow. She became the first animal to orbit Earth, though she did not survive the flight.", category: "First" },
    { year: 1973, title: "Mariner 10 launched", description: "NASA launched Mariner 10, which would become the first spacecraft to fly by Mercury after using Venus for a gravity assist.", category: "First" },
  ],
  "11-04": [
    { year: 2003, title: "Largest solar flare recorded", description: "The Sun produced the most powerful solar flare ever recorded, an X28+ event that saturated NASA's monitoring instruments.", category: "Discovery" },
    { year: 2015, title: "First Orbital ATK Cygnus from Wallops", description: "Orbital ATK launched a Cygnus spacecraft from Wallops Flight Facility, the first successful launch from the pad after the 2014 Antares explosion.", category: "Space Station" },
  ],
  "11-05": [
    { year: 2013, title: "India launches Mangalyaan to Mars", description: "ISRO launched the Mars Orbiter Mission (Mangalyaan) aboard a PSLV rocket, making India the first Asian nation to reach Mars orbit.", category: "Mars" },
    { year: 2007, title: "Chang'e-1 enters Moon orbit", description: "China's first lunar orbiter Chang'e-1 entered orbit around the Moon, beginning a 16-month mapping mission.", category: "Moon" },
  ],
  "11-06": [
    { year: 2018, title: "ICON ionosphere mission launched", description: "NASA launched the ICON spacecraft to study Earth's ionosphere and its interactions with space weather.", category: "Satellite" },
    { year: 1998, title: "ISS assembly preparations", description: "NASA and international partners prepared for the historic launch of the first ISS module scheduled for later that month.", category: "Space Station" },
  ],
  "11-07": [
    { year: 1996, title: "Mars Global Surveyor launched", description: "NASA launched Mars Global Surveyor, which became the first successful Mars mission since Viking and operated until 2006.", category: "Mars" },
    { year: 2005, title: "Venus Express launched", description: "ESA launched Venus Express to study the planet's atmosphere, becoming the first Venus orbiter in over a decade.", category: "Discovery" },
  ],
  "11-08": [
    { year: 2011, title: "Phobos-Grunt failure", description: "Russia launched Phobos-Grunt to return soil samples from Mars's moon Phobos, but the spacecraft failed to leave Earth orbit.", category: "Mars" },
    { year: 2005, title: "ISS Expedition 12 science operations", description: "The ISS crew continued a busy schedule of microgravity experiments and station maintenance.", category: "Space Station" },
  ],
  "11-09": [
    { year: 1967, title: "Apollo 4 first Saturn V launch", description: "NASA launched the massive Saturn V rocket for the first time on an unmanned test flight, generating 7.5 million pounds of thrust.", category: "Moon" },
    { year: 2022, title: "Total lunar eclipse visible worldwide", description: "A total lunar eclipse was visible from the Americas, Asia, and the Pacific, producing a dramatic Blood Moon.", category: "Moon" },
  ],
  "11-10": [
    { year: 2008, title: "STS-126 Endeavour ISS resupply", description: "Space Shuttle Endeavour launched on STS-126, carrying equipment to expand the ISS crew capacity from three to six.", category: "Space Station" },
    { year: 2014, title: "Philae lander descent begins", description: "ESA's Philae lander separated from Rosetta and began its 7-hour descent to the surface of comet 67P.", category: "Discovery" },
  ],
  "11-11": [
    { year: 1966, title: "Gemini 12 — final Gemini mission", description: "Gemini 12 launched with Jim Lovell and Buzz Aldrin. Aldrin's successful EVAs solved the spacewalking problems that had plagued the program.", category: "First" },
    { year: 1982, title: "STS-5 first operational shuttle mission", description: "Space Shuttle Columbia launched on STS-5, the first operational shuttle mission, deploying two commercial communications satellites.", category: "Shuttle" },
  ],
  "11-12": [
    { year: 2014, title: "Philae lands on comet 67P", description: "ESA's Philae became the first spacecraft to land on a comet, touching down on 67P/Churyumov-Gerasimenko. It bounced twice before settling in a shadowed crevice.", category: "First" },
    { year: 1981, title: "STS-2 Columbia second launch", description: "Space Shuttle Columbia launched on STS-2, the first reuse of a crewed orbital spacecraft. The mission was cut short due to a fuel cell failure.", category: "Shuttle" },
  ],
  "11-13": [
    { year: 1971, title: "Mariner 9 enters Mars orbit", description: "Mariner 9 became the first spacecraft to orbit another planet, arriving at Mars during a planet-wide dust storm.", category: "First" },
    { year: 2014, title: "Philae sends data from comet", description: "Philae transmitted data from the comet's surface including photos, chemical analysis, and sound recordings of the landing.", category: "Discovery" },
  ],
  "11-14": [
    { year: 1969, title: "Apollo 12 launches", description: "Apollo 12 launched during a thunderstorm — the Saturn V was struck by lightning twice. Pete Conrad and Alan Bean landed near Surveyor 3.", category: "Moon" },
    { year: 2014, title: "Philae hibernates on comet", description: "Philae entered hibernation mode after its batteries drained. Its shaded landing spot prevented solar panel recharging.", category: "Discovery" },
  ],
  "11-15": [
    { year: 1988, title: "Buran space shuttle flight", description: "The Soviet Buran space shuttle completed its only flight — an unmanned orbital mission and automatic landing, the only one in history.", category: "First" },
    { year: 1990, title: "STS-38 secret DoD mission", description: "Space Shuttle Atlantis launched on STS-38, a classified Department of Defense mission.", category: "Shuttle" },
  ],
  "11-16": [
    { year: 1973, title: "Skylab 4 launches", description: "The third and final Skylab crew launched for an 84-day mission, the longest crewed spaceflight at that time.", category: "Space Station" },
    { year: 1974, title: "Arecibo message sent", description: "The Arecibo radio telescope transmitted an interstellar message toward star cluster M13, containing information about humanity.", category: "Discovery" },
  ],
  "11-17": [
    { year: 1970, title: "Lunokhod 1 begins lunar traverse", description: "The Soviet Lunokhod 1 became the first remote-controlled rover on the Moon, eventually traveling 10.5 km over 11 months.", category: "Moon" },
    { year: 1998, title: "Leonid meteor storm observed", description: "A spectacular Leonid meteor storm was observed worldwide, with rates reaching thousands of meteors per hour.", category: "Discovery" },
  ],
  "11-18": [
    { year: 2013, title: "MAVEN launched to Mars", description: "NASA launched MAVEN to study how Mars lost its atmosphere, investigating the role of the solar wind in stripping away Martian air.", category: "Mars" },
    { year: 1989, title: "COBE launched", description: "NASA launched the Cosmic Background Explorer to study the cosmic microwave background, confirming the Big Bang theory.", category: "Discovery" },
  ],
  "11-19": [
    { year: 1969, title: "Apollo 12 Moon landing", description: "Pete Conrad and Alan Bean landed within walking distance of Surveyor 3, achieving the first precision Moon landing.", category: "Moon" },
    { year: 1996, title: "STS-80 Columbia long mission", description: "Space Shuttle Columbia launched on STS-80 for a 17-day mission, the longest shuttle flight, though a stuck hatch prevented planned EVAs.", category: "Shuttle" },
  ],
  "11-20": [
    { year: 2000, title: "ISS first permanent crew arrives", description: "Expedition 1 crew members Shepherd, Gidzenko, and Krikalev entered the ISS, beginning an unbroken human presence in space that continues today.", category: "Space Station" },
    { year: 1998, title: "Zarya (ISS) in orbit", description: "The Zarya module continued orbital operations following its November launch, awaiting the arrival of the Unity node.", category: "Space Station" },
  ],
  "11-21": [
    { year: 2002, title: "STS-113 Endeavour to ISS", description: "Space Shuttle Endeavour launched on STS-113, delivering the P1 truss segment and rotating the ISS crew.", category: "Space Station" },
    { year: 1964, title: "Mariner 4 launched to Mars", description: "NASA launched Mariner 4, which would become the first spacecraft to return close-up images of Mars.", category: "Mars" },
  ],
  "11-22": [
    { year: 2005, title: "Hayabusa touches asteroid Itokawa", description: "JAXA's Hayabusa briefly touched down on asteroid Itokawa, though it was initially unclear if samples were collected.", category: "Discovery" },
    { year: 2014, title: "SpaceX Dragon CRS-5 preparations", description: "SpaceX prepared the Dragon capsule and Falcon 9 rocket for the CRS-5 resupply mission to the ISS.", category: "Space Station" },
  ],
  "11-23": [
    { year: 2015, title: "Blue Origin New Shepard lands vertically", description: "Blue Origin's New Shepard rocket made the first successful vertical landing of a rocket booster after reaching space.", category: "First" },
    { year: 1977, title: "Meteosat 1 launched", description: "ESA launched its first weather satellite, Meteosat 1, into geostationary orbit to monitor European weather patterns.", category: "Satellite" },
  ],
  "11-24": [
    { year: 2015, title: "SpaceX lands orbital rocket booster", description: "SpaceX successfully landed the Falcon 9 first stage after an orbital mission for the first time at Landing Zone 1.", category: "First" },
    { year: 1969, title: "Apollo 12 returns to Earth", description: "Apollo 12 splashed down in the Pacific, bringing back pieces of Surveyor 3 for study along with 34 kg of lunar samples.", category: "Moon" },
  ],
  "11-25": [
    { year: 2013, title: "Shenzhou-10 mission review", description: "China completed the review of the Shenzhou-10 mission results, advancing plans for its permanent space station.", category: "Space Station" },
    { year: 1998, title: "Unity node preparations", description: "NASA prepared the Unity connecting node for launch to the ISS aboard Space Shuttle Endeavour.", category: "Space Station" },
  ],
  "11-26": [
    { year: 2011, title: "Mars Science Laboratory launched", description: "NASA launched the Curiosity rover aboard an Atlas V rocket, beginning its 254-day journey to Gale Crater on Mars.", category: "Mars" },
    { year: 2018, title: "InSight lands on Mars", description: "NASA's InSight lander touched down on Mars to study the planet's interior, deploying a seismometer that detected Marsquakes.", category: "Mars" },
  ],
  "11-27": [
    { year: 1963, title: "Atlas-Centaur first successful launch", description: "The Atlas-Centaur rocket completed its first successful flight, pioneering the use of liquid hydrogen as rocket fuel.", category: "Satellite" },
    { year: 2001, title: "Hubble detects atmosphere on exoplanet", description: "Hubble detected sodium in the atmosphere of exoplanet HD 209458b, the first detection of an atmosphere on a planet outside our Solar System.", category: "Discovery" },
  ],
  "11-28": [
    { year: 1964, title: "Mariner 4 en route to Mars", description: "Mariner 4 continued its cruise to Mars following its November 28 launch, performing trajectory corrections.", category: "Mars" },
    { year: 1983, title: "STS-9 Spacelab first flight", description: "Space Shuttle Columbia launched on STS-9 carrying the first Spacelab module, Europe's contribution to the Shuttle program.", category: "Shuttle" },
  ],
  "11-29": [
    { year: 1967, title: "Australia launches WRESAT", description: "Australia launched WRESAT from Woomera, becoming the fourth nation to launch a satellite from its own territory.", category: "Satellite" },
    { year: 2019, title: "SpaceX Dragon CRS-19 launches", description: "SpaceX launched the CRS-19 Dragon capsule to resupply the ISS with science experiments and supplies.", category: "Space Station" },
  ],
  "11-30": [
    { year: 1954, title: "Hodges meteorite hits person", description: "A meteorite crashed through a roof in Sylacauga, Alabama and struck Ann Hodges, the only confirmed case of a person hit by a meteorite.", category: "Discovery" },
    { year: 2020, title: "Arecibo Observatory collapses", description: "The 305-meter Arecibo radio telescope in Puerto Rico collapsed when support cables failed, ending 57 years of astronomical discoveries.", category: "Discovery" },
  ],

  // ── DECEMBER ──
  "12-01": [
    { year: 2018, title: "OSIRIS-REx arrives at asteroid Bennu", description: "NASA's OSIRIS-REx spacecraft arrived at asteroid Bennu after a two-year journey, beginning a detailed survey before collecting samples.", category: "Discovery" },
    { year: 1997, title: "Galileo flies by Europa", description: "NASA's Galileo spacecraft made a close flyby of Jupiter's moon Europa, providing evidence of a subsurface ocean.", category: "Discovery" },
  ],
  "12-02": [
    { year: 1995, title: "SOHO solar observatory launched", description: "ESA and NASA launched the Solar and Heliospheric Observatory, which has monitored the Sun continuously for over 25 years.", category: "Satellite" },
    { year: 1998, title: "STS-88 Unity Node attached to ISS", description: "Space Shuttle Endeavour launched on STS-88 to attach the Unity connecting node to Zarya, the first ISS assembly mission.", category: "Space Station" },
  ],
  "12-03": [
    { year: 1999, title: "Mars Polar Lander lost", description: "NASA lost contact with the Mars Polar Lander during its descent to the Martian surface. The cause was likely a software error.", category: "Mars" },
    { year: 1973, title: "Pioneer 10 flies by Jupiter", description: "Pioneer 10 made its closest approach to Jupiter at 132,000 km, returning the first close-up images of the gas giant.", category: "First" },
  ],
  "12-04": [
    { year: 1998, title: "Unity attached to ISS", description: "STS-88 astronauts successfully connected the Unity node to the Zarya module, forming the foundation of the International Space Station.", category: "Space Station" },
    { year: 1996, title: "Mars Pathfinder launched", description: "NASA launched Mars Pathfinder, which would make a dramatic airbag-assisted landing and deploy the first Mars rover, Sojourner.", category: "Mars" },
  ],
  "12-05": [
    { year: 2014, title: "Orion EFT-1 test flight", description: "NASA launched the Orion spacecraft on its first test flight atop a Delta IV Heavy, testing the heat shield at lunar return speeds.", category: "First" },
    { year: 2001, title: "ISS Expedition 4 begins", description: "The fourth permanent crew arrived at the ISS aboard Space Shuttle Endeavour.", category: "Space Station" },
  ],
  "12-06": [
    { year: 1998, title: "ISS Unity module hatch opened", description: "Astronauts opened the hatches between Unity and Zarya for the first time, floating through the new International Space Station.", category: "Space Station" },
    { year: 2015, title: "Akatsuki enters Venus orbit", description: "Japan's Akatsuki spacecraft successfully entered Venus orbit on its second attempt, five years after its first try failed.", category: "Discovery" },
  ],
  "12-07": [
    { year: 1995, title: "Galileo enters Jupiter orbit", description: "NASA's Galileo spacecraft entered orbit around Jupiter and deployed an atmospheric probe, beginning eight years of groundbreaking discoveries.", category: "Discovery" },
    { year: 2001, title: "Mars Odyssey begins mapping", description: "NASA's Mars Odyssey began its primary science mission, mapping the distribution of minerals and ice on Mars.", category: "Mars" },
  ],
  "12-08": [
    { year: 2010, title: "SpaceX Dragon first orbital return", description: "SpaceX's Dragon capsule returned from orbit, becoming the first commercially developed spacecraft to be recovered from orbit.", category: "First" },
    { year: 1990, title: "Galileo Earth flyby", description: "The Galileo spacecraft flew by Earth for a gravity boost on its way to Jupiter, testing its instruments by studying our planet.", category: "Discovery" },
  ],
  "12-09": [
    { year: 1968, title: "First computer mouse demonstrated", description: "Douglas Engelbart demonstrated the first computer mouse, a technology that would eventually be used in spacecraft and mission control.", category: "Discovery" },
    { year: 2006, title: "STS-116 Discovery ISS rewiring", description: "Space Shuttle Discovery launched on STS-116 to rewire the ISS electrical system and install a new truss segment.", category: "Space Station" },
  ],
  "12-10": [
    { year: 1999, title: "XMM-Newton launched", description: "ESA launched XMM-Newton, the most powerful X-ray telescope ever placed in orbit, to study X-ray emissions from astronomical objects.", category: "Discovery" },
    { year: 2005, title: "ASTRO-F preparations", description: "JAXA prepared the ASTRO-F (Akari) infrared astronomy satellite for its upcoming launch to survey the entire sky.", category: "Satellite" },
  ],
  "12-11": [
    { year: 1972, title: "Apollo 17 Moon landing", description: "Eugene Cernan and Harrison Schmitt landed in the Taurus-Littrow valley, the last crewed Moon landing to date.", category: "Moon" },
    { year: 1998, title: "Mars Climate Orbiter launched", description: "NASA launched the Mars Climate Orbiter, which would be lost due to a metric-imperial unit conversion error.", category: "Mars" },
  ],
  "12-12": [
    { year: 1961, title: "OSCAR-1 first amateur radio satellite", description: "The first amateur radio satellite, OSCAR-1, was launched as a secondary payload, pioneering citizen access to space.", category: "Satellite" },
    { year: 2012, title: "North Korea's first successful orbital launch", description: "North Korea placed the Kwangmyongsong-3 satellite in orbit using an Unha-3 rocket, though the satellite appeared to tumble.", category: "Satellite" },
  ],
  "12-13": [
    { year: 1972, title: "Apollo 17 third and final EVA", description: "Cernan and Schmitt completed their third moonwalk, the longest surface expedition, collecting 110 kg of lunar samples.", category: "Moon" },
    { year: 1978, title: "Pioneer Venus 2 probes enter Venus atmosphere", description: "Four Pioneer Venus 2 probes entered Venus's atmosphere simultaneously, each measuring conditions at different locations.", category: "Discovery" },
  ],
  "12-14": [
    { year: 1972, title: "Eugene Cernan — last human on the Moon", description: "As he prepared to ascend from the Moon, Gene Cernan became the last person to walk on the lunar surface. His final footprints remain undisturbed.", category: "Moon" },
    { year: 1962, title: "Mariner 2 flies by Venus", description: "Mariner 2 became the first spacecraft to fly by another planet, scanning Venus and confirming its extremely high surface temperature.", category: "First" },
  ],
  "12-15": [
    { year: 1970, title: "Venera 7 lands on Venus", description: "The Soviet Venera 7 became the first spacecraft to successfully transmit data from the surface of another planet, surviving 23 minutes on Venus.", category: "First" },
    { year: 1984, title: "Vega 1 launched to Venus and Halley", description: "The Soviet Union launched Vega 1 on a dual mission to drop a lander and balloon at Venus, then fly on to Halley's Comet.", category: "Discovery" },
  ],
  "12-16": [
    { year: 1965, title: "Pioneer 6 launched", description: "NASA launched Pioneer 6, which monitored the solar wind and cosmic rays. Contact was made as late as 2000, making it one of the longest-operating spacecraft.", category: "Satellite" },
    { year: 2017, title: "SpaceX reuses Dragon and Falcon 9", description: "SpaceX launched CRS-13 using both a previously-flown Dragon capsule and Falcon 9 booster for the first time.", category: "Space Station" },
  ],
  "12-17": [
    { year: 1903, title: "Wright Brothers first flight", description: "Orville and Wilbur Wright achieved the first powered, controlled, heavier-than-air flight at Kitty Hawk, beginning the path to spaceflight.", category: "First" },
    { year: 2017, title: "Expedition 54 begins on ISS", description: "Expedition 54 began aboard the ISS with a crew of three, continuing the station's science and maintenance operations.", category: "Space Station" },
  ],
  "12-18": [
    { year: 1958, title: "SCORE satellite launched", description: "Project SCORE launched the first communications satellite, broadcasting President Eisenhower's Christmas message from orbit.", category: "First" },
    { year: 2018, title: "New Horizons approaches Arrokoth", description: "New Horizons was in final approach to the Kuiper Belt object Arrokoth, preparing for its New Year's Day flyby.", category: "Discovery" },
  ],
  "12-19": [
    { year: 1972, title: "Apollo 17 splashdown", description: "Apollo 17 splashed down in the Pacific Ocean, ending the final Moon landing mission and the Apollo program's lunar exploration.", category: "Moon" },
    { year: 1999, title: "Mars lander investigations", description: "NASA convened investigation boards to determine what went wrong with the Mars Polar Lander and the earlier Mars Climate Orbiter.", category: "Mars" },
  ],
  "12-20": [
    { year: 1996, title: "Carl Sagan dies", description: "Astronomer and science communicator Carl Sagan passed away. His work inspired millions to look up at the stars through Cosmos and Pale Blue Dot.", category: "Discovery" },
    { year: 2019, title: "Starliner OFT-1 test flight", description: "Boeing's Starliner spacecraft launched on its first orbital flight test, though a timing error prevented ISS docking.", category: "First" },
  ],
  "12-21": [
    { year: 1968, title: "Apollo 8 launches — first humans to orbit the Moon", description: "Apollo 8 launched with Frank Borman, Jim Lovell, and Bill Anders, becoming the first humans to leave Earth orbit and travel to the Moon.", category: "Moon" },
    { year: 1988, title: "Cosmic Background Explorer early results", description: "COBE began returning data showing the cosmic microwave background matched a perfect blackbody spectrum, supporting the Big Bang.", category: "Discovery" },
  ],
  "12-22": [
    { year: 1966, title: "Luna 13 lands on Moon", description: "The Soviet Luna 13 soft-landed on the Moon and measured the soil's density and radiation levels using mechanical probes.", category: "Moon" },
    { year: 1989, title: "STS-32 preparations", description: "NASA prepared Space Shuttle Columbia for STS-32, which would deploy a satellite and retrieve the Long Duration Exposure Facility.", category: "Shuttle" },
  ],
  "12-23": [
    { year: 1968, title: "Apollo 8 enters lunar orbit", description: "Apollo 8 entered orbit around the Moon on Christmas Eve. The crew read from Genesis during a live TV broadcast watched by millions.", category: "Moon" },
    { year: 2015, title: "SpaceX Falcon 9 first landing", description: "SpaceX made history by landing the Falcon 9 first stage at Landing Zone 1 after delivering 11 ORBCOMM satellites to orbit.", category: "First" },
  ],
  "12-24": [
    { year: 1968, title: "Earthrise photograph taken", description: "Apollo 8 astronaut Bill Anders captured the iconic Earthrise photo showing Earth rising above the Moon's horizon, credited with sparking the environmental movement.", category: "Moon" },
    { year: 1979, title: "First Ariane 1 launch", description: "The European Space Agency launched its first Ariane 1 rocket from French Guiana, establishing Europe's independent access to space.", category: "First" },
  ],
  "12-25": [
    { year: 2021, title: "James Webb Space Telescope launched", description: "NASA, ESA, and CSA launched the James Webb Space Telescope aboard an Ariane 5 rocket, the most powerful space telescope ever built. It would revolutionize astronomy.", category: "Discovery" },
    { year: 1968, title: "Apollo 8 heads home", description: "After 10 orbits of the Moon, Apollo 8 fired its engine to return to Earth, completing the first crewed voyage to the Moon.", category: "Moon" },
  ],
  "12-26": [
    { year: 2004, title: "Indian Ocean tsunami observed from space", description: "Satellites provided crucial imagery of the devastating Indian Ocean tsunami, aiding rescue efforts and scientific analysis.", category: "Satellite" },
    { year: 2021, title: "JWST deploys solar array", description: "The James Webb Space Telescope deployed its solar array just minutes after separating from the Ariane 5 upper stage.", category: "Discovery" },
  ],
  "12-27": [
    { year: 1968, title: "Apollo 8 splashdown", description: "Apollo 8 splashed down in the Pacific after the first crewed flight to the Moon. The crew was named Time Magazine's 'Men of the Year.'", category: "Moon" },
    { year: 2021, title: "JWST sunshield deployment begins", description: "The James Webb Space Telescope began deploying its complex five-layer sunshield, a critical step in reaching operating temperature.", category: "Discovery" },
  ],
  "12-28": [
    { year: 1973, title: "Kohoutek comet observations from Skylab", description: "Skylab 4 astronauts observed Comet Kohoutek from orbit, providing unique data despite the comet being dimmer than expected.", category: "Discovery" },
    { year: 2021, title: "JWST continues deployment", description: "The James Webb Space Telescope continued its complex deployment sequence while coasting toward the L2 Lagrange point.", category: "Discovery" },
  ],
  "12-29": [
    { year: 2020, title: "SpaceX Starship SN8 high-altitude test reviewed", description: "Engineers analyzed data from Starship SN8's dramatic high-altitude test flight that ended in a landing explosion but proved key technologies.", category: "First" },
    { year: 1989, title: "Voyager 2 Neptune data analysis", description: "Scientists continued analyzing the rich data returned by Voyager 2 from its August flyby of Neptune and its moon Triton.", category: "Discovery" },
  ],
  "12-30": [
    { year: 2021, title: "JWST mirror deployment begins", description: "The James Webb Space Telescope began unfolding its primary mirror segments as it continued its journey to L2.", category: "Discovery" },
    { year: 1958, title: "Project Mercury astronaut selection begins", description: "NASA began the process of selecting its first astronauts for Project Mercury, screening military test pilots.", category: "First" },
  ],
  "12-31": [
    { year: 2018, title: "New Horizons final approach to Arrokoth", description: "New Horizons made its final approach to Kuiper Belt object Arrokoth, just hours before its historic January 1 flyby.", category: "Discovery" },
    { year: 2004, title: "Cassini Titan discoveries reviewed", description: "Scientists reviewed stunning data from Cassini's close Titan flybys, including evidence of hydrocarbon lakes and a thick atmosphere.", category: "Discovery" },
  ],
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getKey(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(month: number): number {
  const map: Record<number, number> = {
    1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
    7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
  };
  return map[month] ?? 30;
}

const allKeys = Object.keys(spaceEvents);

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function ThisDayInSpacePage() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [randomEvent, setRandomEvent] = useState<SpaceEvent | null>(null);
  const [randomDate, setRandomDate] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const key = getKey(selectedMonth, selectedDay);
  const events = spaceEvents[key] ?? [];
  const hasEvents = events.length > 0;

  const dayLabel = `${monthNames[selectedMonth - 1]} ${selectedDay}`;

  const isToday =
    selectedMonth === today.getMonth() + 1 && selectedDay === today.getDate();

  /* date nav */
  const goDay = useCallback(
    (delta: number) => {
      const d = new Date(2024, selectedMonth - 1, selectedDay + delta);
      setSelectedMonth(d.getMonth() + 1);
      setSelectedDay(d.getDate());
      setRandomEvent(null);
    },
    [selectedMonth, selectedDay],
  );

  /* random */
  const showRandom = useCallback(() => {
    const rk = allKeys[Math.floor(Math.random() * allKeys.length)];
    const list = spaceEvents[rk];
    const ev = list[Math.floor(Math.random() * list.length)];
    setRandomEvent(ev);
    const [m, d] = rk.split("-").map(Number);
    setRandomDate(`${monthNames[m - 1]} ${d}`);
  }, []);

  /* share */
  const handleShare = useCallback(() => {
    const ev = events[0];
    if (!ev) return;
    const text = `On ${dayLabel}, ${ev.year}: ${ev.title} — ${ev.description}\n\nvia DateAndTimezone.com/this-day-in-space`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [events, dayLabel]);

  /* available days for dropdown */
  const daysAvailable = useMemo(
    () => Array.from({ length: daysInMonth(selectedMonth) }, (_, i) => i + 1),
    [selectedMonth],
  );

  return (
    <section className="relative min-h-screen bg-dark-bg pt-10 sm:pt-12 pb-8">
      {/* starfield bg */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-40 right-1/4 h-64 w-64 rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* ── HERO ── */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg/60 px-4 py-1.5 text-sm text-muted backdrop-blur">
            <Rocket className="h-4 w-4 text-primary" />
            Space History Explorer
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
            This Day in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Space History
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            {isToday ? "Today is " : "Showing "}
            <span className="font-semibold text-slate-200">{dayLabel}</span>
            {isToday && " — discover what happened on this date in the history of space exploration."}
          </p>
        </div>

        {/* ── DATE NAVIGATOR ── */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => goDay(-1)}
            className="rounded-lg border border-card-border bg-card-bg p-2.5 text-muted transition hover:border-primary/50 hover:text-slate-200"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => {
                const m = Number(e.target.value);
                setSelectedMonth(m);
                if (selectedDay > daysInMonth(m)) setSelectedDay(daysInMonth(m));
                setRandomEvent(null);
              }}
              className="rounded-lg border border-card-border bg-card-bg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-primary"
            >
              {monthNames.map((n, i) => (
                <option key={i} value={i + 1}>
                  {n}
                </option>
              ))}
            </select>
            <select
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(Number(e.target.value));
                setRandomEvent(null);
              }}
              className="rounded-lg border border-card-border bg-card-bg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-primary"
            >
              {daysAvailable.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => goDay(1)}
            className="rounded-lg border border-card-border bg-card-bg p-2.5 text-muted transition hover:border-primary/50 hover:text-slate-200"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {!isToday && (
            <button
              onClick={() => {
                setSelectedMonth(today.getMonth() + 1);
                setSelectedDay(today.getDate());
                setRandomEvent(null);
              }}
              className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm text-primary transition hover:bg-primary/20"
            >
              Today
            </button>
          )}
        </div>

        <AdBanner />

        {/* ── EVENTS ── */}
        <div className="mb-10 space-y-4">
          {hasEvents ? (
            events.map((ev, i) => {
              const cfg = categoryConfig[ev.category];
              const Icon = cfg.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-card-border bg-card-bg/80 p-5 backdrop-blur transition hover:border-primary/30"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="font-heading text-2xl font-bold text-slate-100">
                      {ev.year}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {ev.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-slate-100">
                    {ev.title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-muted">
                    {ev.description}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-card-border bg-card-bg/60 p-8 text-center backdrop-blur">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-muted" />
              <p className="text-muted">
                No major events recorded for this date. Try browsing nearby
                dates!
              </p>
            </div>
          )}
        </div>

        {/* ── ACTIONS ── */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={showRandom}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition hover:shadow-primary/40"
          >
            <Shuffle className="h-4 w-4" />
            Random Space Fact
          </button>

          {hasEvents && (
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card-bg px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-primary/50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-muted" />
                  Share today&apos;s space fact
                </>
              )}
            </button>
          )}
        </div>

        {/* ── RANDOM FACT CARD ── */}
        {randomEvent && (
          <div className="mx-auto mb-12 max-w-2xl rounded-xl border border-secondary/30 bg-secondary/5 p-5 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-sm text-secondary">
              <Star className="h-4 w-4" />
              Random Fact — {randomDate}
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="font-heading text-xl font-bold text-slate-100">
                {randomEvent.year}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${categoryConfig[randomEvent.category].bg} ${categoryConfig[randomEvent.category].color}`}
              >
                {randomEvent.category}
              </span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-slate-100">
              {randomEvent.title}
            </h3>
            <p className="mt-1 leading-relaxed text-muted">
              {randomEvent.description}
            </p>
          </div>
        )}

        {/* ── FOOTER NOTE ── */}
        <p className="text-center text-sm text-muted-dark">
          Data sourced from NASA, ESA, and other space agencies. Events are
          curated highlights — not exhaustive.
        </p>
      </div>
    </section>
  );
}

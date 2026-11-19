'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Calendar, Sparkles,
} from 'lucide-react'

/* ─── 365 "On This Day" entries ─── */
interface DayEntry {
  month: number
  day: number
  events: { year: string; text: string; category: string }[]
}

const DAYS: DayEntry[] = [
  { month: 1, day: 1, events: [
    { year: "1801", text: "Giuseppe Piazzi discovered Ceres, the first known asteroid, from Palermo, Sicily.", category: "Space" },
    { year: "1804", text: "Haiti declared independence, becoming the first Black-led republic and second independent nation in the Americas.", category: "History" },
    { year: "1983", text: "ARPANET officially switched to TCP/IP, the protocol that would become the foundation of the modern internet.", category: "Technology" },
  ]},
  { month: 1, day: 2, events: [
    { year: "1839", text: "Louis Daguerre took the first photograph of the Moon, pioneering astrophotography.", category: "Science" },
    { year: "1959", text: "The Soviet Union launched Luna 1, the first spacecraft to reach the vicinity of the Moon.", category: "Space" },
  ]},
  { month: 1, day: 3, events: [
    { year: "1961", text: "The United States severed diplomatic relations with Cuba, beginning decades of tension.", category: "History" },
    { year: "2004", text: "NASA's Spirit rover landed on Mars, beginning exploration of Gusev Crater.", category: "Space" },
  ]},
  { month: 1, day: 4, events: [
    { year: "1643", text: "Isaac Newton was born in Woolsthorpe, England, going on to transform physics and mathematics.", category: "Science" },
    { year: "2004", text: "The Stardust spacecraft flew through the coma of comet Wild 2, collecting samples to return to Earth.", category: "Space" },
  ]},
  { month: 1, day: 5, events: [
    { year: "1477", text: "The Battle of Nancy ended the Burgundian Wars, reshaping the map of Western Europe.", category: "History" },
    { year: "2005", text: "Eris, the dwarf planet that led to Pluto's reclassification, was first observed from Palomar Observatory.", category: "Space" },
  ]},
  { month: 1, day: 6, events: [
    { year: "1838", text: "Samuel Morse first demonstrated the telegraph, revolutionizing long-distance communication.", category: "Technology" },
    { year: "2018", text: "A massive iceberg (B-46) calved from Pine Island Glacier in Antarctica, about 185 sq km.", category: "Nature" },
  ]},
  { month: 1, day: 7, events: [
    { year: "1610", text: "Galileo Galilei observed three of Jupiter's moons, providing evidence for the Copernican model.", category: "Space" },
    { year: "1927", text: "The first transatlantic telephone call was made between New York and London.", category: "Technology" },
  ]},
  { month: 1, day: 8, events: [
    { year: "1790", text: "George Washington delivered the first State of the Union address in New York City.", category: "History" },
    { year: "1942", text: "Stephen Hawking was born in Oxford, England.", category: "Science" },
  ]},
  { month: 1, day: 9, events: [
    { year: "2007", text: "Steve Jobs unveiled the first iPhone at Macworld, transforming mobile computing forever.", category: "Technology" },
    { year: "1799", text: "The first income tax in history was introduced in Britain to fund wars against Napoleon.", category: "Economics" },
  ]},
  { month: 1, day: 10, events: [
    { year: "49 BCE", text: "Julius Caesar crossed the Rubicon river, triggering a civil war that ended the Roman Republic.", category: "History" },
    { year: "1946", text: "The first radar signal was bounced off the Moon by the US Army, proving radar could reach space.", category: "Science" },
  ]},
  { month: 1, day: 11, events: [
    { year: "1787", text: "William Herschel discovered Titania and Oberon, two moons of Uranus.", category: "Space" },
    { year: "2020", text: "China shared the genetic sequence of COVID-19, enabling global vaccine development.", category: "Medicine" },
  ]},
  { month: 1, day: 12, events: [
    { year: "1966", text: "President Lyndon B. Johnson stated in his State of the Union that the US should stay in Vietnam.", category: "History" },
    { year: "2005", text: "NASA's Deep Impact spacecraft was launched to study comet Tempel 1.", category: "Space" },
  ]},
  { month: 1, day: 13, events: [
    { year: "1610", text: "Galileo discovered Callisto, Jupiter's second largest moon.", category: "Space" },
    { year: "1893", text: "The Independent Labour Party was founded in Bradford, England, a milestone in British politics.", category: "History" },
  ]},
  { month: 1, day: 14, events: [
    { year: "1690", text: "The clarinet was invented by Johann Christoph Denner in Nuremberg, Germany.", category: "Music" },
    { year: "2005", text: "The Huygens probe landed on Saturn's moon Titan --- the most distant landing ever achieved.", category: "Space" },
  ]},
  { month: 1, day: 15, events: [
    { year: "1929", text: "Martin Luther King Jr. was born in Atlanta, Georgia.", category: "History" },
    { year: "2001", text: "Wikipedia was launched, becoming the largest encyclopedia in history.", category: "Technology" },
  ]},
  { month: 1, day: 16, events: [
    { year: "1547", text: "Ivan IV ('Ivan the Terrible') was crowned the first Tsar of Russia.", category: "History" },
    { year: "2003", text: "Space Shuttle Columbia launched on its final mission (STS-107).", category: "Space" },
  ]},
  { month: 1, day: 17, events: [
    { year: "1773", text: "Captain James Cook's HMS Resolution became the first ship to cross the Antarctic Circle.", category: "Geography" },
    { year: "1995", text: "A magnitude 6.9 earthquake struck Kobe, Japan, killing over 6,000 people.", category: "Nature" },
  ]},
  { month: 1, day: 18, events: [
    { year: "1778", text: "Captain James Cook became the first European to visit the Hawaiian Islands.", category: "Geography" },
    { year: "1896", text: "An X-ray machine was first displayed publicly at Totzka's Casino in New York.", category: "Science" },
  ]},
  { month: 1, day: 19, events: [
    { year: "1809", text: "Edgar Allan Poe was born in Boston, later pioneering the detective fiction genre.", category: "Culture" },
    { year: "2006", text: "NASA launched New Horizons, the first spacecraft to visit Pluto (arriving 2015).", category: "Space" },
  ]},
  { month: 1, day: 20, events: [
    { year: "1942", text: "The Wannsee Conference in Berlin formalized plans for the Holocaust.", category: "History" },
    { year: "2009", text: "Barack Obama was inaugurated as the 44th US President, the first African American to hold the office.", category: "History" },
  ]},
  { month: 1, day: 21, events: [
    { year: "1976", text: "Concorde began commercial supersonic passenger flights between London-Bahrain and Paris-Rio.", category: "Technology" },
    { year: "2021", text: "The James Webb Space Telescope passed its final thermal vacuum tests.", category: "Space" },
  ]},
  { month: 1, day: 22, events: [
    { year: "1506", text: "The Swiss Guard arrived in Vatican City for the first time to protect the Pope.", category: "History" },
    { year: "1992", text: "Roberta Bondar became the first Canadian woman in space aboard Discovery.", category: "Space" },
  ]},
  { month: 1, day: 23, events: [
    { year: "1849", text: "Elizabeth Blackwell became the first woman to receive a medical degree in the US.", category: "Medicine" },
    { year: "1960", text: "The Trieste bathyscaphe reached the bottom of the Mariana Trench (10,916 m) with two crew.", category: "Ocean" },
  ]},
  { month: 1, day: 24, events: [
    { year: "1848", text: "James Marshall discovered gold at Sutter's Mill in California, sparking the Gold Rush.", category: "History" },
    { year: "1986", text: "Voyager 2 made its closest approach to Uranus, the first (and only) spacecraft to visit.", category: "Space" },
  ]},
  { month: 1, day: 25, events: [
    { year: "1787", text: "Shays' Rebellion: 1,200 rebels attacked the Springfield Armory, a catalyst for the US Constitution.", category: "History" },
    { year: "2004", text: "Mars rover Opportunity landed successfully in Meridiani Planum, finding evidence of past water.", category: "Space" },
  ]},
  { month: 1, day: 26, events: [
    { year: "1950", text: "India became a republic, adopting the world's longest written constitution.", category: "History" },
    { year: "1788", text: "The First Fleet arrived at Port Jackson, beginning European colonization of Australia.", category: "History" },
  ]},
  { month: 1, day: 27, events: [
    { year: "1880", text: "Thomas Edison received a patent for the incandescent electric lamp.", category: "Technology" },
    { year: "1945", text: "Soviet troops liberated Auschwitz-Birkenau, now commemorated as International Holocaust Remembrance Day.", category: "History" },
  ]},
  { month: 1, day: 28, events: [
    { year: "1986", text: "The Space Shuttle Challenger broke apart 73 seconds after launch, killing all 7 crew members.", category: "Space" },
    { year: "1807", text: "London's Pall Mall became the first street in the world to be lit by gaslight.", category: "Technology" },
  ]},
  { month: 1, day: 29, events: [
    { year: "1845", text: "Edgar Allan Poe's 'The Raven' was first published in the New York Evening Mirror.", category: "Culture" },
    { year: "1886", text: "Karl Benz patented the Motorwagen, widely considered the first true automobile.", category: "Technology" },
  ]},
  { month: 1, day: 30, events: [
    { year: "1948", text: "Mahatma Gandhi was assassinated in New Delhi, India.", category: "History" },
    { year: "1969", text: "The Beatles performed their last public concert on the roof of Apple Corps in London.", category: "Music" },
  ]},
  { month: 1, day: 31, events: [
    { year: "1958", text: "Explorer 1, the first US satellite, was launched and discovered the Van Allen radiation belts.", category: "Space" },
    { year: "1961", text: "Ham the chimpanzee was launched into space aboard Mercury-Redstone 2.", category: "Space" },
  ]},
  // ── February ──
  { month: 2, day: 1, events: [
    { year: "2003", text: "Space Shuttle Columbia disintegrated during re-entry, killing all 7 crew members.", category: "Space" },
    { year: "1884", text: "The first volume of the Oxford English Dictionary was published, taking 50 years to complete.", category: "Language" },
  ]},
  { month: 2, day: 2, events: [
    { year: "1709", text: "Alexander Selkirk was rescued after 4 years alone on a Pacific island, inspiring Robinson Crusoe.", category: "History" },
    { year: "1935", text: "The polygraph (lie detector) was used for the first time in a criminal case.", category: "Science" },
  ]},
  { month: 2, day: 3, events: [
    { year: "1966", text: "The Soviet Luna 9 became the first spacecraft to achieve a soft landing on the Moon.", category: "Space" },
    { year: "1959", text: "A plane crash near Clear Lake, Iowa, killed Buddy Holly, Ritchie Valens, and The Big Bopper --- 'The Day the Music Died.'", category: "Music" },
  ]},
  { month: 2, day: 4, events: [
    { year: "2004", text: "Mark Zuckerberg launched Facebook from his Harvard dorm room.", category: "Technology" },
    { year: "1948", text: "Ceylon (now Sri Lanka) gained independence from the United Kingdom.", category: "History" },
  ]},
  { month: 2, day: 5, events: [
    { year: "1919", text: "Charlie Chaplin, Douglas Fairbanks, Mary Pickford, and D.W. Griffith founded United Artists.", category: "Art" },
    { year: "1971", text: "Apollo 14 astronauts landed on the Moon; Alan Shepard later hit two golf balls on the lunar surface.", category: "Space" },
  ]},
  { month: 2, day: 6, events: [
    { year: "1952", text: "Queen Elizabeth II acceded to the throne following the death of her father, King George VI.", category: "History" },
    { year: "2018", text: "SpaceX's Falcon Heavy launched its first flight, sending a Tesla Roadster into orbit around the Sun.", category: "Space" },
  ]},
  { month: 2, day: 7, events: [
    { year: "1812", text: "The most powerful of a series of earthquakes centered near New Madrid, Missouri, caused the Mississippi River to flow backward.", category: "Nature" },
    { year: "1979", text: "Pluto moved inside Neptune's orbit, where it stayed until 1999 --- making Neptune temporarily the farthest planet.", category: "Space" },
  ]},
  { month: 2, day: 8, events: [
    { year: "1828", text: "Jules Verne was born in Nantes, France, later pioneering science fiction.", category: "Culture" },
    { year: "1969", text: "The Allende meteorite fell in Mexico --- the largest carbonaceous chondrite ever found, containing pre-solar grains.", category: "Space" },
  ]},
  { month: 2, day: 9, events: [
    { year: "1950", text: "Senator Joseph McCarthy claimed to have a list of communists in the State Department, launching the 'Red Scare.'", category: "History" },
    { year: "2001", text: "The submarine USS Greeneville accidentally struck and sank a Japanese fishing vessel near Hawaii.", category: "Ocean" },
  ]},
  { month: 2, day: 10, events: [
    { year: "1863", text: "Alanson Crane patented the fire extinguisher, improving building safety.", category: "Technology" },
    { year: "1996", text: "IBM's Deep Blue defeated chess champion Garry Kasparov in the first game of a six-game match.", category: "Technology" },
  ]},
  { month: 2, day: 11, events: [
    { year: "1990", text: "Nelson Mandela was released from prison after 27 years, a turning point in South African history.", category: "History" },
    { year: "2016", text: "The LIGO team announced the first detection of gravitational waves, confirming Einstein's 1915 prediction.", category: "Science" },
  ]},
  { month: 2, day: 12, events: [
    { year: "1809", text: "Both Abraham Lincoln and Charles Darwin were born on this day.", category: "History" },
    { year: "2001", text: "NEAR Shoemaker became the first spacecraft to orbit and land on an asteroid (433 Eros).", category: "Space" },
  ]},
  { month: 2, day: 13, events: [
    { year: "1633", text: "Galileo arrived in Rome for his trial before the Inquisition for advocating heliocentrism.", category: "Science" },
    { year: "2019", text: "NASA declared the Mars Opportunity rover's mission complete after 15 years (planned for 90 days).", category: "Space" },
  ]},
  { month: 2, day: 14, events: [
    { year: "1876", text: "Alexander Graham Bell and Elisha Gray both filed patents for the telephone on the same day.", category: "Technology" },
    { year: "1990", text: "Voyager 1 took the 'Pale Blue Dot' photograph of Earth from 6 billion km away.", category: "Space" },
  ]},
  { month: 2, day: 15, events: [
    { year: "1564", text: "Galileo Galilei was born in Pisa, Italy.", category: "Science" },
    { year: "2013", text: "A meteor exploded over Chelyabinsk, Russia, injuring 1,500 people --- the largest since 1908.", category: "Space" },
  ]},
  { month: 2, day: 16, events: [
    { year: "1923", text: "Howard Carter opened the burial chamber of Tutankhamun's tomb in Egypt.", category: "History" },
    { year: "1978", text: "The first computer bulletin board system (BBS) went online in Chicago.", category: "Technology" },
  ]},
  { month: 2, day: 17, events: [
    { year: "1600", text: "Giordano Bruno was burned at the stake for heresy, including his belief in an infinite universe.", category: "Science" },
    { year: "1869", text: "Dmitri Mendeleev organized the first periodic table of elements.", category: "Science" },
  ]},
  { month: 2, day: 18, events: [
    { year: "1930", text: "Clyde Tombaugh discovered Pluto at Lowell Observatory in Arizona.", category: "Space" },
    { year: "1979", text: "Snow fell in the Sahara Desert for the only recorded time in modern history.", category: "Nature" },
  ]},
  { month: 2, day: 19, events: [
    { year: "1473", text: "Nicolaus Copernicus was born in Torun, Poland --- he later proposed the heliocentric model.", category: "Science" },
    { year: "1986", text: "The Soviet Union launched the Mir space station, which orbited for 15 years.", category: "Space" },
  ]},
  { month: 2, day: 20, events: [
    { year: "1962", text: "John Glenn orbited Earth three times aboard Friendship 7, the first American in orbit.", category: "Space" },
    { year: "1872", text: "The Metropolitan Museum of Art opened in New York City.", category: "Art" },
  ]},
  { month: 2, day: 21, events: [
    { year: "1804", text: "The first steam locomotive, built by Richard Trevithick, made its maiden journey in Wales.", category: "Technology" },
    { year: "1953", text: "James Watson and Francis Crick determined the double-helix structure of DNA.", category: "Science" },
  ]},
  { month: 2, day: 22, events: [
    { year: "1997", text: "Scientists in Scotland announced the birth of Dolly the Sheep, the first mammal cloned from an adult cell.", category: "Science" },
    { year: "1879", text: "Frank Woolworth opened his first five-cent store in Utica, New York.", category: "Economics" },
  ]},
  { month: 2, day: 23, events: [
    { year: "1455", text: "The Gutenberg Bible, the first major book printed with movable type in Europe, was published.", category: "Technology" },
    { year: "1987", text: "Supernova 1987A was observed in the Large Magellanic Cloud --- the closest supernova since 1604.", category: "Space" },
  ]},
  { month: 2, day: 24, events: [
    { year: "1582", text: "Pope Gregory XIII issued the Gregorian calendar, which most of the world uses today.", category: "History" },
    { year: "2011", text: "Space Shuttle Discovery launched on its final mission (STS-133).", category: "Space" },
  ]},
  { month: 2, day: 25, events: [
    { year: "1836", text: "Samuel Colt patented the first revolver firearm.", category: "Technology" },
    { year: "1991", text: "Tim Berners-Lee released the first web browser, WorldWideWeb, at CERN.", category: "Technology" },
  ]},
  { month: 2, day: 26, events: [
    { year: "1616", text: "Galileo Galilei was formally banned by the Catholic Church from teaching heliocentrism.", category: "Science" },
    { year: "1935", text: "Robert Watson-Watt demonstrated radar for the first time to the British military.", category: "Technology" },
  ]},
  { month: 2, day: 27, events: [
    { year: "1812", text: "Lord Byron delivered his first speech in the House of Lords, advocating for workers' rights.", category: "Culture" },
    { year: "1940", text: "Carbon-14 was discovered by Martin Kamen and Sam Ruben, enabling radiocarbon dating.", category: "Science" },
  ]},
  { month: 2, day: 28, events: [
    { year: "1953", text: "Watson and Crick announced to friends in a pub that they had 'discovered the secret of life' (DNA).", category: "Science" },
    { year: "1991", text: "The Gulf War ended with a ceasefire after 100 hours of ground combat.", category: "History" },
  ]},
  { month: 2, day: 29, events: [
    { year: "1504", text: "Christopher Columbus used a lunar eclipse to convince Jamaicans to continue supplying his crew.", category: "History" },
    { year: "1940", text: "Hattie McDaniel became the first African American to win an Academy Award, for Gone with the Wind.", category: "Culture" },
  ]},
  // ── March ──
  { month: 3, day: 1, events: [
    { year: "1872", text: "Yellowstone became the world's first national park.", category: "Nature" },
    { year: "1966", text: "Venera 3 became the first spacecraft to reach another planet, crash-landing on Venus.", category: "Space" },
  ]},
  { month: 3, day: 2, events: [
    { year: "1969", text: "Concorde made its first test flight from Toulouse, France.", category: "Technology" },
    { year: "1995", text: "Yahoo! was incorporated, becoming one of the first major internet companies.", category: "Technology" },
  ]},
  { month: 3, day: 3, events: [
    { year: "1847", text: "Alexander Graham Bell was born in Edinburgh, Scotland.", category: "Technology" },
    { year: "2005", text: "Steve Fossett completed the first solo nonstop unrefueled flight around the world.", category: "History" },
  ]},
  { month: 3, day: 4, events: [
    { year: "1877", text: "Emile Berliner invented the microphone, transforming communication.", category: "Technology" },
    { year: "2018", text: "Former Russian spy Sergei Skripal was poisoned with a nerve agent in Salisbury, England.", category: "History" },
  ]},
  { month: 3, day: 5, events: [
    { year: "1616", text: "Copernicus's De revolutionibus was banned by the Catholic Church.", category: "Science" },
    { year: "1979", text: "Voyager 1 made its closest approach to Jupiter, discovering its ring system.", category: "Space" },
  ]},
  { month: 3, day: 6, events: [
    { year: "1869", text: "Dmitri Mendeleev presented the first periodic table to the Russian Chemical Society.", category: "Science" },
    { year: "1899", text: "Bayer registered Aspirin as a trademark, one of the first blockbuster drugs.", category: "Medicine" },
  ]},
  { month: 3, day: 7, events: [
    { year: "322 BCE", text: "Aristotle died in Chalcis, Euboea, after shaping Western philosophy for millennia.", category: "History" },
    { year: "1876", text: "Alexander Graham Bell was granted a patent for the telephone.", category: "Technology" },
  ]},
  { month: 3, day: 8, events: [
    { year: "1911", text: "International Women's Day was observed for the first time, in Austria, Denmark, Germany, and Switzerland.", category: "History" },
    { year: "2014", text: "Malaysia Airlines Flight 370 disappeared with 239 people aboard, becoming aviation's greatest mystery.", category: "History" },
  ]},
  { month: 3, day: 9, events: [
    { year: "1959", text: "The Barbie doll debuted at the American International Toy Fair in New York.", category: "Culture" },
    { year: "2011", text: "Space Shuttle Discovery made its final landing, ending a 27-year career with 39 missions.", category: "Space" },
  ]},
  { month: 3, day: 10, events: [
    { year: "1876", text: "Alexander Graham Bell made the first successful telephone call, saying 'Mr. Watson, come here.'", category: "Technology" },
    { year: "2006", text: "NASA's Mars Reconnaissance Orbiter entered Mars orbit, becoming the most powerful camera ever sent to another planet.", category: "Space" },
  ]},
  { month: 3, day: 11, events: [
    { year: "2011", text: "A magnitude 9.1 earthquake and tsunami struck Japan, triggering the Fukushima nuclear disaster.", category: "Nature" },
    { year: "2020", text: "WHO declared COVID-19 a pandemic, affecting virtually every country on Earth.", category: "Medicine" },
  ]},
  { month: 3, day: 12, events: [
    { year: "1894", text: "Coca-Cola was first sold in bottles (previously only at soda fountains).", category: "Food" },
    { year: "2015", text: "Scientists announced that Saturn's moon Enceladus has a global subsurface ocean.", category: "Space" },
  ]},
  { month: 3, day: 13, events: [
    { year: "1781", text: "William Herschel discovered Uranus, the first planet found using a telescope.", category: "Space" },
    { year: "1930", text: "The discovery of Pluto was officially announced by Lowell Observatory.", category: "Space" },
  ]},
  { month: 3, day: 14, events: [
    { year: "1879", text: "Albert Einstein was born in Ulm, Germany.", category: "Science" },
    { year: "2019", text: "The first all-female spacewalk was planned but postponed due to spacesuit sizing.", category: "Space" },
  ]},
  { month: 3, day: 15, events: [
    { year: "44 BCE", text: "Julius Caesar was assassinated in the Roman Senate on the Ides of March.", category: "History" },
    { year: "2011", text: "The Syrian Civil War began with protests in the city of Daraa.", category: "History" },
  ]},
  { month: 3, day: 16, events: [
    { year: "1926", text: "Robert Goddard launched the first liquid-fueled rocket in Auburn, Massachusetts.", category: "Space" },
    { year: "1995", text: "Mississippi became the last US state to ratify the 13th Amendment abolishing slavery (symbolically).", category: "History" },
  ]},
  { month: 3, day: 17, events: [
    { year: "461", text: "Saint Patrick, patron saint of Ireland, died --- now celebrated worldwide on this day.", category: "Culture" },
    { year: "1958", text: "Vanguard 1, the oldest satellite still in orbit, was launched.", category: "Space" },
  ]},
  { month: 3, day: 18, events: [
    { year: "1965", text: "Alexei Leonov performed the first spacewalk, spending 12 minutes outside the Voskhod 2 spacecraft.", category: "Space" },
    { year: "1850", text: "American Express was founded by Henry Wells and William Fargo.", category: "Economics" },
  ]},
  { month: 3, day: 19, events: [
    { year: "2008", text: "Arthur C. Clarke, author of 2001: A Space Odyssey, died in Colombo, Sri Lanka.", category: "Culture" },
    { year: "1474", text: "Venice enacted the first patent law in history, protecting inventors' rights.", category: "Economics" },
  ]},
  { month: 3, day: 20, events: [
    { year: "1916", text: "Albert Einstein published his general theory of relativity.", category: "Science" },
    { year: "2015", text: "A total solar eclipse crossed the North Atlantic and Arctic, the last total eclipse visible from Europe until 2026.", category: "Space" },
  ]},
  { month: 3, day: 21, events: [
    { year: "1685", text: "Johann Sebastian Bach was born in Eisenach, Germany.", category: "Music" },
    { year: "2006", text: "Twitter was founded by Jack Dorsey, Noah Glass, Biz Stone, and Evan Williams.", category: "Technology" },
  ]},
  { month: 3, day: 22, events: [
    { year: "1895", text: "The Lumiere brothers held the first private screening of a motion picture in Paris.", category: "Art" },
    { year: "1993", text: "Intel shipped the first Pentium processor chips.", category: "Technology" },
  ]},
  { month: 3, day: 23, events: [
    { year: "1857", text: "Elisha Otis installed the first passenger elevator in a New York department store.", category: "Technology" },
    { year: "2001", text: "Russia's Mir space station was intentionally deorbited, burning up over the Pacific after 15 years.", category: "Space" },
  ]},
  { month: 3, day: 24, events: [
    { year: "1882", text: "Robert Koch announced the discovery of Mycobacterium tuberculosis, now World Tuberculosis Day.", category: "Medicine" },
    { year: "1989", text: "The Exxon Valdez oil tanker struck a reef in Alaska, spilling 41 million liters of crude oil.", category: "Nature" },
  ]},
  { month: 3, day: 25, events: [
    { year: "1655", text: "Christiaan Huygens discovered Titan, Saturn's largest moon.", category: "Space" },
    { year: "1957", text: "The Treaty of Rome established the European Economic Community, predecessor of the EU.", category: "Economics" },
  ]},
  { month: 3, day: 26, events: [
    { year: "1827", text: "Ludwig van Beethoven died in Vienna, Austria.", category: "Music" },
    { year: "1953", text: "Jonas Salk announced his polio vaccine, tested on himself, his wife, and his children.", category: "Medicine" },
  ]},
  { month: 3, day: 27, events: [
    { year: "1513", text: "Spanish explorer Juan Ponce de Leon sighted Florida, claiming it for Spain.", category: "Geography" },
    { year: "1998", text: "The FDA approved Viagra, which became the fastest-selling drug in history.", category: "Medicine" },
  ]},
  { month: 3, day: 28, events: [
    { year: "1979", text: "The Three Mile Island nuclear power plant in Pennsylvania suffered a partial meltdown.", category: "Technology" },
    { year: "1930", text: "Constantinople was officially renamed Istanbul.", category: "History" },
  ]},
  { month: 3, day: 29, events: [
    { year: "1974", text: "The Terracotta Army was discovered by farmers digging a well near Xi'an, China.", category: "Art" },
    { year: "2004", text: "Bulgaria, Estonia, Latvia, Lithuania, Romania, Slovakia, and Slovenia joined NATO.", category: "History" },
  ]},
  { month: 3, day: 30, events: [
    { year: "1842", text: "Anesthesia was used for the first time in surgery, by Crawford Long in Georgia.", category: "Medicine" },
    { year: "2017", text: "SpaceX achieved the first re-flight of an orbital class rocket booster.", category: "Space" },
  ]},
  { month: 3, day: 31, events: [
    { year: "1889", text: "The Eiffel Tower was officially opened in Paris, France.", category: "Art" },
    { year: "1596", text: "Rene Descartes was born --- he later wrote 'I think, therefore I am.'", category: "Science" },
  ]},
  // ── April ──
  { month: 4, day: 1, events: [
    { year: "1976", text: "Steve Wozniak and Steve Jobs founded Apple Computer Company.", category: "Technology" },
    { year: "2001", text: "The Netherlands became the first country to legalize same-sex marriage.", category: "History" },
  ]},
  { month: 4, day: 2, events: [
    { year: "1513", text: "Spanish explorer Juan Ponce de Leon landed in Florida.", category: "Geography" },
    { year: "2014", text: "India's Mars Orbiter Mission (Mangalyaan) completed 6 months in Mars orbit on a shoestring budget.", category: "Space" },
  ]},
  { month: 4, day: 3, events: [
    { year: "1973", text: "Martin Cooper of Motorola made the first handheld mobile phone call.", category: "Technology" },
    { year: "1860", text: "The Pony Express began its first run, delivering mail from Missouri to California in 10 days.", category: "History" },
  ]},
  { month: 4, day: 4, events: [
    { year: "1968", text: "Martin Luther King Jr. was assassinated in Memphis, Tennessee.", category: "History" },
    { year: "1975", text: "Microsoft was founded by Bill Gates and Paul Allen.", category: "Technology" },
  ]},
  { month: 4, day: 5, events: [
    { year: "1722", text: "Dutch explorer Jacob Roggeveen became the first European to visit Easter Island.", category: "Geography" },
    { year: "1998", text: "Japan's Akashi Kaikyo Bridge opened as the longest suspension bridge in the world (3,911 m).", category: "Technology" },
  ]},
  { month: 4, day: 6, events: [
    { year: "1896", text: "The first modern Olympic Games opened in Athens, Greece.", category: "Sports" },
    { year: "1909", text: "Robert Peary claimed to have reached the North Pole (though disputed).", category: "Geography" },
  ]},
  { month: 4, day: 7, events: [
    { year: "1948", text: "The World Health Organization was established.", category: "Medicine" },
    { year: "2001", text: "Mars Odyssey was launched, later becoming the longest-serving spacecraft at Mars.", category: "Space" },
  ]},
  { month: 4, day: 8, events: [
    { year: "563 BCE", text: "Siddhartha Gautama (the Buddha) was born in Lumbini, Nepal, according to tradition.", category: "Culture" },
    { year: "1820", text: "The Venus de Milo was discovered on the Greek island of Milos.", category: "Art" },
  ]},
  { month: 4, day: 9, events: [
    { year: "1865", text: "General Robert E. Lee surrendered at Appomattox, effectively ending the US Civil War.", category: "History" },
    { year: "2003", text: "The Human Genome Project was completed, mapping all human genes.", category: "Science" },
  ]},
  { month: 4, day: 10, events: [
    { year: "1912", text: "The Titanic departed Southampton on its maiden (and only) voyage.", category: "History" },
    { year: "2019", text: "The first image of a black hole (M87*) was released by the Event Horizon Telescope team.", category: "Space" },
  ]},
  { month: 4, day: 11, events: [
    { year: "1970", text: "Apollo 13 launched; an oxygen tank explosion would make it NASA's 'successful failure.'", category: "Space" },
    { year: "1981", text: "Space Shuttle Columbia launched on STS-1, the first orbital test flight of the shuttle.", category: "Space" },
  ]},
  { month: 4, day: 12, events: [
    { year: "1961", text: "Yuri Gagarin became the first human in space aboard Vostok 1.", category: "Space" },
    { year: "1981", text: "The first Space Shuttle mission (Columbia STS-1) landed successfully.", category: "Space" },
  ]},
  { month: 4, day: 13, events: [
    { year: "1743", text: "Thomas Jefferson was born in Shadwell, Virginia.", category: "History" },
    { year: "2029", text: "Asteroid Apophis will pass closer to Earth than geostationary satellites (predicted).", category: "Space" },
  ]},
  { month: 4, day: 14, events: [
    { year: "1912", text: "The Titanic struck an iceberg at 11:40 PM; it sank in under 3 hours.", category: "History" },
    { year: "1828", text: "The first edition of Noah Webster's American Dictionary was published.", category: "Language" },
  ]},
  { month: 4, day: 15, events: [
    { year: "1452", text: "Leonardo da Vinci was born in Vinci, Italy --- painter, inventor, anatomist, and polymath.", category: "Art" },
    { year: "2019", text: "Notre-Dame de Paris suffered a devastating fire, destroying its medieval roof and spire.", category: "History" },
  ]},
  { month: 4, day: 16, events: [
    { year: "1943", text: "Albert Hofmann accidentally discovered the psychedelic effects of LSD.", category: "Science" },
    { year: "2003", text: "The Treaty of Accession was signed, allowing 10 new countries to join the European Union.", category: "History" },
  ]},
  { month: 4, day: 17, events: [
    { year: "1970", text: "Apollo 13 splashed down safely in the Pacific after a harrowing mission.", category: "Space" },
    { year: "1790", text: "Benjamin Franklin died in Philadelphia at age 84.", category: "History" },
  ]},
  { month: 4, day: 18, events: [
    { year: "1906", text: "A massive earthquake struck San Francisco, followed by fires that destroyed 80% of the city.", category: "Nature" },
    { year: "1955", text: "Albert Einstein died in Princeton, New Jersey.", category: "Science" },
  ]},
  { month: 4, day: 19, events: [
    { year: "1775", text: "The Battles of Lexington and Concord began the American Revolutionary War.", category: "History" },
    { year: "2021", text: "NASA's Ingenuity helicopter made the first powered flight on another planet (Mars).", category: "Space" },
  ]},
  { month: 4, day: 20, events: [
    { year: "1902", text: "Marie and Pierre Curie isolated radium chloride, advancing our understanding of radioactivity.", category: "Science" },
    { year: "2010", text: "The Deepwater Horizon oil rig exploded in the Gulf of Mexico, causing the largest marine oil spill in history.", category: "Ocean" },
  ]},
  { month: 4, day: 21, events: [
    { year: "753 BCE", text: "Rome was traditionally believed to have been founded by Romulus and Remus.", category: "History" },
    { year: "1934", text: "The 'Surgeon's Photograph' of the Loch Ness Monster was published (later revealed as a hoax).", category: "Culture" },
  ]},
  { month: 4, day: 22, events: [
    { year: "1970", text: "The first Earth Day was celebrated, launching the modern environmental movement.", category: "Nature" },
    { year: "1500", text: "Portuguese navigator Pedro Alvares Cabral became the first European to reach Brazil.", category: "Geography" },
  ]},
  { month: 4, day: 23, events: [
    { year: "1564", text: "William Shakespeare was born (and died on this same date in 1616) in Stratford-upon-Avon.", category: "Language" },
    { year: "2005", text: "The first YouTube video, 'Me at the zoo,' was uploaded by co-founder Jawed Karim.", category: "Technology" },
  ]},
  { month: 4, day: 24, events: [
    { year: "1990", text: "The Hubble Space Telescope was launched aboard Space Shuttle Discovery.", category: "Space" },
    { year: "2013", text: "A garment factory collapsed in Dhaka, Bangladesh, killing 1,134 --- exposing fast fashion's costs.", category: "Economics" },
  ]},
  { month: 4, day: 25, events: [
    { year: "1953", text: "Watson and Crick's paper on the structure of DNA was published in Nature.", category: "Science" },
    { year: "1990", text: "The Hubble Space Telescope was deployed in orbit from the shuttle Discovery.", category: "Space" },
  ]},
  { month: 4, day: 26, events: [
    { year: "1986", text: "The Chernobyl nuclear power plant in Ukraine suffered a catastrophic meltdown.", category: "Technology" },
    { year: "1803", text: "Thousands of meteorite fragments fell near L'Aigle, France, proving that rocks do fall from the sky.", category: "Space" },
  ]},
  { month: 4, day: 27, events: [
    { year: "1994", text: "South Africa held its first multiracial elections, and Nelson Mandela was elected president.", category: "History" },
    { year: "4977 BCE", text: "The universe was created according to Johannes Kepler's biblical calculations (obviously incorrect).", category: "Science" },
  ]},
  { month: 4, day: 28, events: [
    { year: "2001", text: "Dennis Tito became the first space tourist, paying $20 million to visit the ISS.", category: "Space" },
    { year: "1789", text: "The mutiny on the Bounty occurred in the South Pacific.", category: "History" },
  ]},
  { month: 4, day: 29, events: [
    { year: "1770", text: "Captain James Cook landed at Botany Bay, making first European contact with eastern Australia.", category: "Geography" },
    { year: "2011", text: "The wedding of Prince William and Catherine Middleton was watched by 2 billion people.", category: "Culture" },
  ]},
  { month: 4, day: 30, events: [
    { year: "1803", text: "The Louisiana Purchase doubled the size of the United States for $15 million.", category: "History" },
    { year: "1993", text: "CERN announced that the World Wide Web would be free to use, launching the internet era.", category: "Technology" },
  ]},
  // ── May ──
  { month: 5, day: 1, events: [
    { year: "1884", text: "Construction of the first skyscraper began in Chicago (Home Insurance Building, 10 stories).", category: "Technology" },
    { year: "1931", text: "The Empire State Building was officially opened, standing as the world's tallest for 40 years.", category: "Art" },
  ]},
  { month: 5, day: 2, events: [
    { year: "1519", text: "Leonardo da Vinci died in Amboise, France.", category: "Art" },
    { year: "2011", text: "Osama bin Laden was killed by US Navy SEALs in Abbottabad, Pakistan.", category: "History" },
  ]},
  { month: 5, day: 3, events: [
    { year: "1469", text: "Niccolo Machiavelli was born in Florence, Italy.", category: "History" },
    { year: "1978", text: "The first unsolicited bulk email (spam) was sent via ARPANET.", category: "Technology" },
  ]},
  { month: 5, day: 4, events: [
    { year: "1979", text: "Margaret Thatcher became the first female Prime Minister of the United Kingdom.", category: "History" },
    { year: "2007", text: "A massive tornado (EF5) destroyed 95% of Greensburg, Kansas --- the town later rebuilt entirely green.", category: "Nature" },
  ]},
  { month: 5, day: 5, events: [
    { year: "1961", text: "Alan Shepard became the first American in space on a 15-minute suborbital flight.", category: "Space" },
    { year: "1862", text: "The Battle of Puebla occurred --- the origin of Cinco de Mayo celebrations.", category: "History" },
  ]},
  { month: 5, day: 6, events: [
    { year: "1937", text: "The Hindenburg airship caught fire while landing in New Jersey, killing 36.", category: "Technology" },
    { year: "1954", text: "Roger Bannister ran the first sub-four-minute mile (3:59.4) in Oxford.", category: "Sports" },
  ]},
  { month: 5, day: 7, events: [
    { year: "1824", text: "Beethoven's 9th Symphony premiered in Vienna --- he was almost completely deaf.", category: "Music" },
    { year: "1998", text: "Mercedes-Benz and Chrysler announced their merger (later reversed).", category: "Economics" },
  ]},
  { month: 5, day: 8, events: [
    { year: "1945", text: "V-E Day: Nazi Germany surrendered unconditionally, ending WWII in Europe.", category: "History" },
    { year: "1980", text: "The WHO declared smallpox officially eradicated worldwide.", category: "Medicine" },
  ]},
  { month: 5, day: 9, events: [
    { year: "1502", text: "Christopher Columbus departed on his fourth and final voyage to the Americas.", category: "Geography" },
    { year: "2018", text: "NASA launched the InSight lander to study the deep interior of Mars.", category: "Space" },
  ]},
  { month: 5, day: 10, events: [
    { year: "1869", text: "The Transcontinental Railroad was completed at Promontory Summit, Utah.", category: "Technology" },
    { year: "1994", text: "Nelson Mandela was inaugurated as South Africa's first Black president.", category: "History" },
  ]},
  { month: 5, day: 11, events: [
    { year: "868", text: "The Diamond Sutra was printed in China --- the world's oldest dated printed book.", category: "Culture" },
    { year: "1997", text: "IBM's Deep Blue defeated Garry Kasparov in a chess match --- first AI victory over a world champion.", category: "Technology" },
  ]},
  { month: 5, day: 12, events: [
    { year: "1820", text: "Florence Nightingale was born --- she later founded modern nursing.", category: "Medicine" },
    { year: "2008", text: "A magnitude 7.9 earthquake struck Sichuan, China, killing nearly 70,000 people.", category: "Nature" },
  ]},
  { month: 5, day: 13, events: [
    { year: "1950", text: "The first Formula One World Championship race was held at Silverstone, England.", category: "Sports" },
    { year: "1846", text: "The US declared war on Mexico, beginning the Mexican-American War.", category: "History" },
  ]},
  { month: 5, day: 14, events: [
    { year: "1796", text: "Edward Jenner administered the first smallpox vaccination to an 8-year-old boy.", category: "Medicine" },
    { year: "1973", text: "Skylab, the first US space station, was launched.", category: "Space" },
  ]},
  { month: 5, day: 15, events: [
    { year: "1718", text: "James Puckle patented the first machine gun, called the Defence Gun.", category: "Technology" },
    { year: "1957", text: "Britain detonated its first hydrogen bomb over Christmas Island in the Pacific.", category: "Science" },
  ]},
  { month: 5, day: 16, events: [
    { year: "1960", text: "Theodore Maiman operated the first laser at Hughes Research Laboratories.", category: "Science" },
    { year: "1975", text: "Junko Tabei of Japan became the first woman to summit Mount Everest.", category: "Sports" },
  ]},
  { month: 5, day: 17, events: [
    { year: "1954", text: "The US Supreme Court ruled in Brown v. Board of Education, declaring school segregation unconstitutional.", category: "History" },
    { year: "2004", text: "Massachusetts became the first US state to legalize same-sex marriage.", category: "History" },
  ]},
  { month: 5, day: 18, events: [
    { year: "1980", text: "Mount St. Helens erupted in Washington State, the deadliest volcanic event in US history.", category: "Nature" },
    { year: "1910", text: "Earth passed through the tail of Halley's Comet, causing widespread panic (unfounded).", category: "Space" },
  ]},
  { month: 5, day: 19, events: [
    { year: "1536", text: "Anne Boleyn, second wife of Henry VIII, was beheaded at the Tower of London.", category: "History" },
    { year: "2018", text: "Prince Harry and Meghan Markle married at Windsor Castle.", category: "Culture" },
  ]},
  { month: 5, day: 20, events: [
    { year: "1873", text: "Levi Strauss and Jacob Davis patented blue jeans (riveted denim pants).", category: "Culture" },
    { year: "1932", text: "Amelia Earhart became the first woman to fly solo across the Atlantic Ocean.", category: "History" },
  ]},
  { month: 5, day: 21, events: [
    { year: "1927", text: "Charles Lindbergh completed the first solo nonstop transatlantic flight.", category: "Technology" },
    { year: "2010", text: "Scientists at the Craig Venter Institute created the first synthetic bacterial cell.", category: "Science" },
  ]},
  { month: 5, day: 22, events: [
    { year: "1906", text: "The Wright Brothers received US patent 821,393 for their flying machine.", category: "Technology" },
    { year: "2017", text: "A suicide bomber attacked the Manchester Arena after an Ariana Grande concert, killing 22.", category: "History" },
  ]},
  { month: 5, day: 23, events: [
    { year: "1618", text: "The Defenestration of Prague occurred --- officials were thrown from windows, sparking the Thirty Years' War.", category: "History" },
    { year: "2008", text: "India's Chandrayaan-1 rocket components passed critical pre-launch tests.", category: "Space" },
  ]},
  { month: 5, day: 24, events: [
    { year: "1844", text: "Samuel Morse transmitted the first telegraph message: 'What hath God wrought.'", category: "Technology" },
    { year: "1962", text: "Scott Carpenter orbited Earth three times in Aurora 7, the second American orbital flight.", category: "Space" },
  ]},
  { month: 5, day: 25, events: [
    { year: "1961", text: "President Kennedy announced the goal of landing a man on the Moon by the end of the decade.", category: "Space" },
    { year: "2008", text: "NASA's Phoenix spacecraft landed near Mars's north pole, later confirming water ice.", category: "Space" },
  ]},
  { month: 5, day: 26, events: [
    { year: "1896", text: "The Dow Jones Industrial Average was first published.", category: "Economics" },
    { year: "2021", text: "A total lunar eclipse (Super Blood Moon) was visible across the Pacific.", category: "Space" },
  ]},
  { month: 5, day: 27, events: [
    { year: "1937", text: "The Golden Gate Bridge opened to pedestrians in San Francisco.", category: "Technology" },
    { year: "1199", text: "King John was crowned King of England, later forced to sign the Magna Carta.", category: "History" },
  ]},
  { month: 5, day: 28, events: [
    { year: "585 BCE", text: "A solar eclipse was predicted by Thales of Miletus --- the first recorded scientific prediction.", category: "Science" },
    { year: "1953", text: "Edmund Hillary and Tenzing Norgay became the first to summit Mount Everest.", category: "Sports" },
  ]},
  { month: 5, day: 29, events: [
    { year: "1453", text: "Constantinople fell to the Ottoman Turks, ending the Byzantine Empire after 1,100 years.", category: "History" },
    { year: "1919", text: "Arthur Eddington's solar eclipse observations confirmed Einstein's general relativity.", category: "Science" },
  ]},
  { month: 5, day: 30, events: [
    { year: "1431", text: "Joan of Arc was burned at the stake in Rouen, France, at age 19.", category: "History" },
    { year: "2020", text: "SpaceX Crew Dragon Demo-2 launched, the first crewed orbital flight by a private company.", category: "Space" },
  ]},
  { month: 5, day: 31, events: [
    { year: "1859", text: "Big Ben's clock tower in London first began keeping time.", category: "Technology" },
    { year: "2008", text: "USAF retired the F-117 Nighthawk, the first operational stealth aircraft.", category: "Technology" },
  ]},
  // ── June ──
  { month: 6, day: 1, events: [
    { year: "1792", text: "Kentucky became the 15th US state.", category: "History" },
    { year: "2009", text: "General Motors filed for bankruptcy, the largest industrial bankruptcy in US history.", category: "Economics" },
  ]},
  { month: 6, day: 2, events: [
    { year: "1953", text: "Queen Elizabeth II was crowned in Westminster Abbey --- the first coronation broadcast on television.", category: "History" },
    { year: "1966", text: "Surveyor 1 made the first US soft landing on the Moon.", category: "Space" },
  ]},
  { month: 6, day: 3, events: [
    { year: "1965", text: "Ed White performed the first American spacewalk during Gemini 4.", category: "Space" },
    { year: "1769", text: "Captain Cook observed the transit of Venus from Tahiti.", category: "Space" },
  ]},
  { month: 6, day: 4, events: [
    { year: "1783", text: "The Montgolfier brothers demonstrated the first hot air balloon in Annonay, France.", category: "Technology" },
    { year: "1989", text: "The Chinese government sent troops to Tiananmen Square, ending pro-democracy protests.", category: "History" },
  ]},
  { month: 6, day: 5, events: [
    { year: "1981", text: "The CDC published its first report on what would later be identified as AIDS.", category: "Medicine" },
    { year: "2012", text: "The last transit of Venus in the 21st century was visible from much of the world.", category: "Space" },
  ]},
  { month: 6, day: 6, events: [
    { year: "1944", text: "D-Day: Allied forces landed on the beaches of Normandy, beginning the liberation of Europe.", category: "History" },
    { year: "1984", text: "Tetris, one of the most popular video games ever, was created by Alexey Pajitnov in Moscow.", category: "Technology" },
  ]},
  { month: 6, day: 7, events: [
    { year: "1893", text: "Mahatma Gandhi committed his first act of civil disobedience in South Africa.", category: "History" },
    { year: "1975", text: "Sony introduced the Betamax home video recorder in Japan.", category: "Technology" },
  ]},
  { month: 6, day: 8, events: [
    { year: "632", text: "Prophet Muhammad died in Medina, the founder of Islam.", category: "Culture" },
    { year: "2004", text: "Venus transited the Sun for the first time in 122 years.", category: "Space" },
  ]},
  { month: 6, day: 9, events: [
    { year: "1934", text: "Donald Duck made his first appearance in the Walt Disney cartoon 'The Wise Little Hen.'", category: "Culture" },
    { year: "2015", text: "China completed construction on the world's longest sea bridge (55 km), the Hong Kong-Zhuhai-Macau Bridge.", category: "Technology" },
  ]},
  { month: 6, day: 10, events: [
    { year: "1752", text: "Benjamin Franklin flew a kite in a thunderstorm, demonstrating that lightning is electrical.", category: "Science" },
    { year: "2003", text: "NASA launched the Spirit Mars rover.", category: "Space" },
  ]},
  { month: 6, day: 11, events: [
    { year: "1184 BCE", text: "The traditional date for the fall of Troy to the Greek army.", category: "History" },
    { year: "2008", text: "Apple announced the iPhone 3G, making smartphones affordable worldwide.", category: "Technology" },
  ]},
  { month: 6, day: 12, events: [
    { year: "1942", text: "Anne Frank received her diary as a 13th birthday present.", category: "History" },
    { year: "1991", text: "Boris Yeltsin was elected president of Russia in the country's first free election.", category: "History" },
  ]},
  { month: 6, day: 13, events: [
    { year: "1983", text: "Pioneer 10 became the first spacecraft to travel beyond all the planets of the solar system.", category: "Space" },
    { year: "323 BCE", text: "Alexander the Great died in Babylon at age 32.", category: "History" },
  ]},
  { month: 6, day: 14, events: [
    { year: "1951", text: "UNIVAC I, the first commercial computer, was delivered to the US Census Bureau.", category: "Technology" },
    { year: "1777", text: "The Continental Congress adopted the Stars and Stripes as the US flag.", category: "History" },
  ]},
  { month: 6, day: 15, events: [
    { year: "1215", text: "King John of England sealed the Magna Carta, a foundation of constitutional law.", category: "History" },
    { year: "2012", text: "Nik Wallenda walked across Niagara Falls on a tightrope, the first to do so.", category: "Sports" },
  ]},
  { month: 6, day: 16, events: [
    { year: "1963", text: "Valentina Tereshkova became the first woman in space aboard Vostok 6.", category: "Space" },
    { year: "1903", text: "Pepsi-Cola was officially trademarked.", category: "Economics" },
  ]},
  { month: 6, day: 17, events: [
    { year: "1885", text: "The Statue of Liberty arrived in New York Harbor from France.", category: "Art" },
    { year: "1972", text: "Five men were arrested for breaking into the Watergate complex, beginning the Watergate scandal.", category: "History" },
  ]},
  { month: 6, day: 18, events: [
    { year: "1815", text: "The Battle of Waterloo ended Napoleon's rule and reshaped Europe.", category: "History" },
    { year: "1983", text: "Sally Ride became the first American woman in space aboard Challenger.", category: "Space" },
  ]},
  { month: 6, day: 19, events: [
    { year: "1865", text: "Enslaved people in Galveston, Texas, learned of their freedom, now celebrated as Juneteenth.", category: "History" },
    { year: "240 BCE", text: "Eratosthenes estimated Earth's circumference with remarkable accuracy using shadows.", category: "Science" },
  ]},
  { month: 6, day: 20, events: [
    { year: "1782", text: "The US Congress adopted the Great Seal of the United States.", category: "History" },
    { year: "2003", text: "Wikimedia Foundation was established to support Wikipedia and sister projects.", category: "Technology" },
  ]},
  { month: 6, day: 21, events: [
    { year: "1948", text: "The LP (long-playing) vinyl record was introduced by Columbia Records.", category: "Music" },
    { year: "2004", text: "SpaceShipOne became the first privately funded spacecraft to reach space.", category: "Space" },
  ]},
  { month: 6, day: 22, events: [
    { year: "1633", text: "Galileo was forced to recant his support for heliocentrism before the Inquisition.", category: "Science" },
    { year: "2009", text: "Eastman Kodak discontinued Kodachrome film after 74 years of production.", category: "Technology" },
  ]},
  { month: 6, day: 23, events: [
    { year: "1868", text: "Christopher Latham Sholes patented the QWERTY keyboard typewriter.", category: "Technology" },
    { year: "2016", text: "The UK voted to leave the European Union in the Brexit referendum.", category: "History" },
  ]},
  { month: 6, day: 24, events: [
    { year: "1497", text: "John Cabot landed in North America, claiming it for King Henry VII of England.", category: "Geography" },
    { year: "1947", text: "Kenneth Arnold reported seeing nine 'flying saucers' near Mount Rainier, coining the term.", category: "Culture" },
  ]},
  { month: 6, day: 25, events: [
    { year: "1876", text: "The Battle of the Little Bighorn: Lakota, Northern Cheyenne, and Arapaho forces defeated General Custer.", category: "History" },
    { year: "1997", text: "An unmanned Progress cargo ship collided with Russia's Mir space station.", category: "Space" },
  ]},
  { month: 6, day: 26, events: [
    { year: "1284", text: "The Pied Piper allegedly lured 130 children from Hamelin, Germany --- a legend still debated.", category: "Culture" },
    { year: "2000", text: "The Human Genome Project and Celera Genomics jointly announced the first draft of the human genome.", category: "Science" },
  ]},
  { month: 6, day: 27, events: [
    { year: "1898", text: "Joshua Slocum completed the first solo circumnavigation of the world by sailboat.", category: "Ocean" },
    { year: "2013", text: "NASA's Voyager 1 was confirmed to have entered interstellar space.", category: "Space" },
  ]},
  { month: 6, day: 28, events: [
    { year: "1914", text: "Archduke Franz Ferdinand was assassinated in Sarajevo, triggering World War I.", category: "History" },
    { year: "1997", text: "Mike Tyson bit Evander Holyfield's ear during a boxing match.", category: "Sports" },
  ]},
  { month: 6, day: 29, events: [
    { year: "2007", text: "Apple released the original iPhone, beginning the smartphone revolution.", category: "Technology" },
    { year: "1888", text: "The earliest known audio recording of music was made on a Thomas Edison phonograph.", category: "Music" },
  ]},
  { month: 6, day: 30, events: [
    { year: "1908", text: "The Tunguska event: a massive explosion in Siberia flattened 2,000 sq km of forest.", category: "Space" },
    { year: "1971", text: "The Soviet Soyuz 11 crew tragically died during re-entry, the only deaths in space.", category: "Space" },
  ]},
  // ── July ──
  { month: 7, day: 1, events: [
    { year: "1867", text: "Canada became a self-governing dominion within the British Empire (Canada Day).", category: "History" },
    { year: "1979", text: "Sony introduced the Walkman portable cassette player in Japan.", category: "Technology" },
  ]},
  { month: 7, day: 2, events: [
    { year: "1937", text: "Amelia Earhart and navigator Fred Noonan disappeared over the Pacific Ocean.", category: "History" },
    { year: "2019", text: "A total solar eclipse crossed Chile and Argentina.", category: "Space" },
  ]},
  { month: 7, day: 3, events: [
    { year: "1886", text: "Karl Benz officially unveiled the Benz Patent-Motorwagen, the first automobile.", category: "Technology" },
    { year: "1996", text: "The first DVD players were released in Japan.", category: "Technology" },
  ]},
  { month: 7, day: 4, events: [
    { year: "1776", text: "The United States Declaration of Independence was adopted.", category: "History" },
    { year: "2005", text: "NASA's Deep Impact probe collided with comet Tempel 1 to study its composition.", category: "Space" },
  ]},
  { month: 7, day: 5, events: [
    { year: "1996", text: "Dolly the Sheep was born, the first mammal cloned from an adult somatic cell.", category: "Science" },
    { year: "1946", text: "The bikini swimsuit debuted at a fashion show in Paris.", category: "Culture" },
  ]},
  { month: 7, day: 6, events: [
    { year: "1885", text: "Louis Pasteur successfully tested his rabies vaccine on a 9-year-old boy.", category: "Medicine" },
    { year: "1957", text: "Althea Gibson won Wimbledon, becoming the first Black athlete to win a Grand Slam.", category: "Sports" },
  ]},
  { month: 7, day: 7, events: [
    { year: "1550", text: "Chocolate was introduced to Europe when it was brought back from the Americas.", category: "Food" },
    { year: "2007", text: "The New Seven Wonders of the World were announced.", category: "Culture" },
  ]},
  { month: 7, day: 8, events: [
    { year: "1497", text: "Vasco da Gama departed Lisbon on the first direct European voyage to India.", category: "Geography" },
    { year: "2011", text: "Space Shuttle Atlantis launched on STS-135, the final shuttle mission.", category: "Space" },
  ]},
  { month: 7, day: 9, events: [
    { year: "1877", text: "The first Wimbledon tennis championship was held in London.", category: "Sports" },
    { year: "2006", text: "Italy defeated France on penalties to win the FIFA World Cup in Berlin.", category: "Sports" },
  ]},
  { month: 7, day: 10, events: [
    { year: "1856", text: "Nikola Tesla was born in Smiljan, Croatia.", category: "Science" },
    { year: "1962", text: "Telstar 1, the first active communications satellite, was launched.", category: "Technology" },
  ]},
  { month: 7, day: 11, events: [
    { year: "1979", text: "Skylab re-entered Earth's atmosphere, scattering debris across Australia.", category: "Space" },
    { year: "2010", text: "A total solar eclipse crossed the South Pacific and parts of South America.", category: "Space" },
  ]},
  { month: 7, day: 12, events: [
    { year: "100 BCE", text: "Julius Caesar was born (traditional date).", category: "History" },
    { year: "1962", text: "The Rolling Stones played their first concert at the Marquee Club in London.", category: "Music" },
  ]},
  { month: 7, day: 13, events: [
    { year: "1930", text: "The first FIFA World Cup began in Uruguay.", category: "Sports" },
    { year: "2015", text: "NASA's New Horizons made its closest approach to Pluto.", category: "Space" },
  ]},
  { month: 7, day: 14, events: [
    { year: "1789", text: "The storming of the Bastille in Paris began the French Revolution.", category: "History" },
    { year: "1965", text: "Mariner 4 flew by Mars, taking the first close-up photos of another planet.", category: "Space" },
  ]},
  { month: 7, day: 15, events: [
    { year: "1799", text: "The Rosetta Stone was found by French soldiers in Egypt, enabling the decipherment of hieroglyphs.", category: "Language" },
    { year: "2015", text: "New Horizons sent back the first detailed images of Pluto's surface.", category: "Space" },
  ]},
  { month: 7, day: 16, events: [
    { year: "1969", text: "Apollo 11 launched from Kennedy Space Center, carrying the first Moon-landing crew.", category: "Space" },
    { year: "1945", text: "The Trinity nuclear test was conducted in New Mexico, the first detonation of a nuclear weapon.", category: "Science" },
  ]},
  { month: 7, day: 17, events: [
    { year: "1955", text: "Disneyland opened in Anaheim, California.", category: "Culture" },
    { year: "1975", text: "The Apollo-Soyuz mission: American and Soviet spacecraft docked in orbit for the first time.", category: "Space" },
  ]},
  { month: 7, day: 18, events: [
    { year: "64", text: "The Great Fire of Rome began during Emperor Nero's reign.", category: "History" },
    { year: "2013", text: "Detroit filed for bankruptcy, the largest US city to do so.", category: "Economics" },
  ]},
  { month: 7, day: 19, events: [
    { year: "1799", text: "The Rosetta Stone was officially deciphered by Jean-Francois Champollion.", category: "Language" },
    { year: "2005", text: "Google Maps launched publicly, transforming how people navigate.", category: "Technology" },
  ]},
  { month: 7, day: 20, events: [
    { year: "1969", text: "Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.", category: "Space" },
    { year: "1976", text: "Viking 1 became the first spacecraft to successfully land on Mars.", category: "Space" },
  ]},
  { month: 7, day: 21, events: [
    { year: "1969", text: "Neil Armstrong spoke the famous words: 'That's one small step for man, one giant leap for mankind.'", category: "Space" },
    { year: "365", text: "A massive tsunami struck Alexandria, Egypt, killing thousands.", category: "Ocean" },
  ]},
  { month: 7, day: 22, events: [
    { year: "1934", text: "FBI agents shot and killed John Dillinger outside a Chicago cinema.", category: "History" },
    { year: "2009", text: "The longest total solar eclipse of the 21st century (6 min 39 sec) crossed Asia.", category: "Space" },
  ]},
  { month: 7, day: 23, events: [
    { year: "1829", text: "William Austin Burt patented the typographer, a precursor to the typewriter.", category: "Technology" },
    { year: "1995", text: "Comet Hale-Bopp was discovered, becoming one of the most observed comets in history.", category: "Space" },
  ]},
  { month: 7, day: 24, events: [
    { year: "1911", text: "Hiram Bingham rediscovered the Inca city of Machu Picchu in Peru.", category: "History" },
    { year: "1969", text: "The Apollo 11 crew splashed down safely in the Pacific Ocean.", category: "Space" },
  ]},
  { month: 7, day: 25, events: [
    { year: "1978", text: "Louise Brown was born in England, the world's first baby conceived by IVF.", category: "Medicine" },
    { year: "2000", text: "Air France Concorde Flight 4590 crashed after takeoff, killing 113, hastening the end of Concorde.", category: "Technology" },
  ]},
  { month: 7, day: 26, events: [
    { year: "1775", text: "The US Postal Service was established by the Continental Congress.", category: "History" },
    { year: "2005", text: "Space Shuttle Discovery launched on STS-114, the first shuttle flight after the Columbia disaster.", category: "Space" },
  ]},
  { month: 7, day: 27, events: [
    { year: "1866", text: "The first transatlantic telegraph cable was successfully completed.", category: "Technology" },
    { year: "2012", text: "The London Olympics opening ceremony celebrated British history from the Industrial Revolution.", category: "Sports" },
  ]},
  { month: 7, day: 28, events: [
    { year: "1914", text: "Austria-Hungary declared war on Serbia, beginning World War I.", category: "History" },
    { year: "2005", text: "The IRA announced the end of its armed campaign in Northern Ireland.", category: "History" },
  ]},
  { month: 7, day: 29, events: [
    { year: "1958", text: "NASA was established by an act of the US Congress.", category: "Space" },
    { year: "1981", text: "29 million people worldwide watched Prince Charles marry Lady Diana Spencer.", category: "Culture" },
  ]},
  { month: 7, day: 30, events: [
    { year: "1619", text: "The first representative assembly in America met at Jamestown, Virginia.", category: "History" },
    { year: "2003", text: "The last old-style Volkswagen Beetle rolled off the assembly line in Mexico.", category: "Technology" },
  ]},
  { month: 7, day: 31, events: [
    { year: "1790", text: "The first US patent was issued --- for a potash production process.", category: "Technology" },
    { year: "1999", text: "NASA deliberately crashed the Lunar Prospector into the Moon, searching for water ice.", category: "Space" },
  ]},
  // ── August ──
  { month: 8, day: 1, events: [{ year: "1774", text: "Joseph Priestley discovered oxygen, calling it 'dephlogisticated air.'", category: "Science" }, { year: "1981", text: "MTV launched with the first music video: 'Video Killed the Radio Star.'", category: "Music" }] },
  { month: 8, day: 2, events: [{ year: "1922", text: "Alexander Graham Bell died in Nova Scotia at age 75.", category: "Technology" }, { year: "1990", text: "Iraq invaded Kuwait, leading to the Gulf War.", category: "History" }] },
  { month: 8, day: 3, events: [{ year: "1492", text: "Christopher Columbus set sail from Spain with the Nina, Pinta, and Santa Maria.", category: "Geography" }, { year: "2004", text: "NASA's MESSENGER spacecraft was launched to Mercury.", category: "Space" }] },
  { month: 8, day: 4, events: [{ year: "1693", text: "The champagne-making process is traditionally attributed to Dom Perignon around this time.", category: "Food" }, { year: "2007", text: "NASA's Phoenix Mars lander was launched.", category: "Space" }] },
  { month: 8, day: 5, events: [{ year: "1858", text: "The first transatlantic telegraph cable was completed, connecting Europe and North America.", category: "Technology" }, { year: "2012", text: "NASA's Curiosity rover landed on Mars in Gale Crater.", category: "Space" }] },
  { month: 8, day: 6, events: [{ year: "1945", text: "The atomic bomb was dropped on Hiroshima, Japan, killing over 80,000 instantly.", category: "History" }, { year: "2012", text: "Curiosity rover sent its first images from Mars.", category: "Space" }] },
  { month: 8, day: 7, events: [{ year: "1942", text: "US Marines landed at Guadalcanal, the first major Allied offensive in the Pacific.", category: "History" }, { year: "2020", text: "Air India Flight IX-1344 skidded off the runway in Kerala, killing 21.", category: "History" }] },
  { month: 8, day: 8, events: [{ year: "1908", text: "Wilbur Wright flew publicly for the first time at Le Mans, France, stunning spectators.", category: "Technology" }, { year: "2008", text: "The Beijing Olympics opening ceremony showcased 5,000 years of Chinese history.", category: "Sports" }] },
  { month: 8, day: 9, events: [{ year: "1945", text: "A second atomic bomb was dropped on Nagasaki, Japan.", category: "History" }, { year: "1995", text: "Netscape went public at $28/share and closed at $75, marking the internet boom.", category: "Technology" }] },
  { month: 8, day: 10, events: [{ year: "1675", text: "The Royal Greenwich Observatory was founded by King Charles II.", category: "Science" }, { year: "1990", text: "The Magellan spacecraft began mapping Venus with radar.", category: "Space" }] },
  { month: 8, day: 11, events: [{ year: "1999", text: "The last total solar eclipse of the 20th century crossed Europe and Asia.", category: "Space" }, { year: "3114 BCE", text: "The Mayan calendar's mythological start date (Long Count).", category: "History" }] },
  { month: 8, day: 12, events: [{ year: "1877", text: "Thomas Edison invented the phonograph, allowing sound to be recorded and played back.", category: "Technology" }, { year: "2018", text: "NASA launched the Parker Solar Probe, the fastest human-made object, to study the Sun.", category: "Space" }] },
  { month: 8, day: 13, events: [{ year: "1889", text: "William Gray patented the coin-operated telephone.", category: "Technology" }, { year: "2004", text: "The Summer Olympics opened in Athens, returning to its birthplace.", category: "Sports" }] },
  { month: 8, day: 14, events: [{ year: "1947", text: "Pakistan gained independence from British rule (Pakistan Independence Day).", category: "History" }, { year: "2013", text: "Egypt declared a state of emergency during political unrest.", category: "History" }] },
  { month: 8, day: 15, events: [{ year: "1947", text: "India gained independence from British rule (Indian Independence Day).", category: "History" }, { year: "1977", text: "The 'Wow!' signal was detected by SETI --- a still-unexplained 72-second radio burst from space.", category: "Space" }] },
  { month: 8, day: 16, events: [{ year: "1858", text: "The first message was transmitted across the transatlantic telegraph cable.", category: "Technology" }, { year: "1977", text: "Elvis Presley died in Memphis, Tennessee, at age 42.", category: "Music" }] },
  { month: 8, day: 17, events: [{ year: "1945", text: "Indonesia declared independence from the Netherlands.", category: "History" }, { year: "1807", text: "Robert Fulton's Clermont began the first commercially successful steamboat voyage.", category: "Technology" }] },
  { month: 8, day: 18, events: [{ year: "1868", text: "French astronomer Pierre Janssen discovered helium in the Sun's spectrum during an eclipse.", category: "Science" }, { year: "1920", text: "The 19th Amendment was ratified, giving American women the right to vote.", category: "History" }] },
  { month: 8, day: 19, events: [{ year: "1839", text: "The daguerreotype process was presented to the French Academy of Sciences.", category: "Technology" }, { year: "2004", text: "Google went public at $85 per share.", category: "Economics" }] },
  { month: 8, day: 20, events: [{ year: "1977", text: "Voyager 2 was launched, eventually visiting Jupiter, Saturn, Uranus, and Neptune.", category: "Space" }, { year: "1968", text: "Soviet troops invaded Czechoslovakia, ending the Prague Spring.", category: "History" }] },
  { month: 8, day: 21, events: [{ year: "1959", text: "Hawaii became the 50th US state.", category: "History" }, { year: "2017", text: "A total solar eclipse crossed the entire continental US for the first time since 1918.", category: "Space" }] },
  { month: 8, day: 22, events: [{ year: "1902", text: "Cadillac was founded in Detroit, Michigan.", category: "Economics" }, { year: "2007", text: "The Tropical Storm Dean made landfall in Mexico as a Category 5 hurricane.", category: "Nature" }] },
  { month: 8, day: 23, events: [{ year: "1966", text: "Lunar Orbiter 1 took the first photograph of Earth from the Moon's orbit.", category: "Space" }, { year: "79", text: "Mount Vesuvius began erupting, burying Pompeii and Herculaneum.", category: "Nature" }] },
  { month: 8, day: 24, events: [{ year: "79", text: "Pompeii was buried under volcanic ash from Vesuvius, preserving the city for millennia.", category: "History" }, { year: "2006", text: "The International Astronomical Union reclassified Pluto as a dwarf planet.", category: "Space" }] },
  { month: 8, day: 25, events: [{ year: "1609", text: "Galileo Galilei demonstrated his first telescope to Venetian lawmakers.", category: "Science" }, { year: "1989", text: "Voyager 2 made its closest approach to Neptune, discovering 6 new moons.", category: "Space" }] },
  { month: 8, day: 26, events: [{ year: "1789", text: "The French National Assembly adopted the Declaration of the Rights of Man.", category: "History" }, { year: "1743", text: "Antoine Lavoisier, 'the father of modern chemistry,' was born.", category: "Science" }] },
  { month: 8, day: 27, events: [{ year: "1883", text: "Krakatoa erupted in Indonesia, one of the most violent volcanic events in history.", category: "Nature" }, { year: "2003", text: "Mars made its closest approach to Earth in 60,000 years.", category: "Space" }] },
  { month: 8, day: 28, events: [{ year: "1963", text: "Martin Luther King Jr. delivered his 'I Have a Dream' speech in Washington, D.C.", category: "History" }, { year: "1749", text: "Johann Wolfgang von Goethe was born in Frankfurt, Germany.", category: "Culture" }] },
  { month: 8, day: 29, events: [{ year: "1831", text: "Michael Faraday demonstrated the first electrical transformer.", category: "Science" }, { year: "2005", text: "Hurricane Katrina made landfall near New Orleans, causing catastrophic flooding.", category: "Nature" }] },
  { month: 8, day: 30, events: [{ year: "1871", text: "Ernest Rutherford was born in New Zealand --- he later discovered the atomic nucleus.", category: "Science" }, { year: "1999", text: "East Timor voted for independence from Indonesia.", category: "History" }] },
  { month: 8, day: 31, events: [{ year: "1888", text: "Mary Ann Nichols was found murdered --- the first victim attributed to Jack the Ripper.", category: "History" }, { year: "2012", text: "Voyager 1 crossed into interstellar space (confirmed later by NASA).", category: "Space" }] },
  // ── September ──
  { month: 9, day: 1, events: [{ year: "1939", text: "Germany invaded Poland, beginning World War II.", category: "History" }, { year: "1985", text: "The wreck of the Titanic was found on the Atlantic Ocean floor at 3,800 m depth.", category: "Ocean" }] },
  { month: 9, day: 2, events: [{ year: "1945", text: "Japan formally surrendered aboard the USS Missouri, ending World War II.", category: "History" }, { year: "1752", text: "Britain adopted the Gregorian calendar, 'losing' 11 days.", category: "History" }] },
  { month: 9, day: 3, events: [{ year: "1189", text: "Richard I (the Lionheart) was crowned King of England.", category: "History" }, { year: "1976", text: "Viking 2 landed on Mars at Utopia Planitia.", category: "Space" }] },
  { month: 9, day: 4, events: [{ year: "1998", text: "Google was founded by Larry Page and Sergey Brin in a garage in Menlo Park.", category: "Technology" }, { year: "476", text: "The Western Roman Empire fell when Romulus Augustulus was deposed.", category: "History" }] },
  { month: 9, day: 5, events: [{ year: "1977", text: "Voyager 1 was launched, now the most distant human-made object from Earth.", category: "Space" }, { year: "1882", text: "The first Labor Day parade was held in New York City.", category: "History" }] },
  { month: 9, day: 6, events: [{ year: "1522", text: "Ferdinand Magellan's crew completed the first circumnavigation of the globe (Magellan died en route).", category: "Geography" }, { year: "2018", text: "India's Supreme Court decriminalized homosexuality, overturning a colonial-era law.", category: "History" }] },
  { month: 9, day: 7, events: [{ year: "1940", text: "The Blitz began: Nazi Germany started bombing London.", category: "History" }, { year: "2014", text: "The Rosetta spacecraft began orbiting comet 67P/Churyumov-Gerasimenko.", category: "Space" }] },
  { month: 9, day: 8, events: [{ year: "1504", text: "Michelangelo's David was unveiled in Florence, Italy.", category: "Art" }, { year: "1966", text: "Star Trek premiered on NBC, launching one of the most influential franchises in sci-fi.", category: "Culture" }] },
  { month: 9, day: 9, events: [{ year: "1947", text: "The first computer bug was documented --- a moth in the Harvard Mark II.", category: "Technology" }, { year: "2015", text: "Queen Elizabeth II became the longest-reigning British monarch.", category: "History" }] },
  { month: 9, day: 10, events: [{ year: "2008", text: "CERN activated the Large Hadron Collider for the first time.", category: "Science" }, { year: "1846", text: "Elias Howe patented the first practical sewing machine.", category: "Technology" }] },
  { month: 9, day: 11, events: [{ year: "2001", text: "Terrorist attacks on the World Trade Center and Pentagon killed nearly 3,000 people.", category: "History" }, { year: "1609", text: "Henry Hudson reached Manhattan Island.", category: "Geography" }] },
  { month: 9, day: 12, events: [{ year: "1962", text: "President Kennedy delivered his 'We choose to go to the Moon' speech at Rice University.", category: "Space" }, { year: "1940", text: "The Lascaux cave paintings were discovered by teenagers in France.", category: "Art" }] },
  { month: 9, day: 13, events: [{ year: "1906", text: "The first fixed-wing aircraft flight in Europe was made by Alberto Santos-Dumont.", category: "Technology" }, { year: "2015", text: "NASA's New Horizons team published detailed results from the Pluto flyby.", category: "Space" }] },
  { month: 9, day: 14, events: [{ year: "1752", text: "Britain and colonies skipped 11 days to align with the Gregorian calendar.", category: "History" }, { year: "2015", text: "LIGO detected gravitational waves for the first time (announced Feb 2016).", category: "Science" }] },
  { month: 9, day: 15, events: [{ year: "1835", text: "Charles Darwin arrived at the Galapagos Islands aboard HMS Beagle.", category: "Science" }, { year: "2017", text: "NASA's Cassini spacecraft plunged into Saturn's atmosphere, ending a 20-year mission.", category: "Space" }] },
  { month: 9, day: 16, events: [{ year: "1810", text: "Mexico declared independence from Spain (Mexican Independence Day).", category: "History" }, { year: "1987", text: "The Montreal Protocol was signed, protecting the ozone layer.", category: "Nature" }] },
  { month: 9, day: 17, events: [{ year: "1787", text: "The US Constitution was signed at the Constitutional Convention in Philadelphia.", category: "History" }, { year: "2011", text: "Occupy Wall Street protests began in New York City.", category: "Economics" }] },
  { month: 9, day: 18, events: [{ year: "1977", text: "Voyager 1 took the first photograph showing Earth and the Moon together.", category: "Space" }, { year: "1502", text: "Christopher Columbus landed in Costa Rica during his fourth voyage.", category: "Geography" }] },
  { month: 9, day: 19, events: [{ year: "1893", text: "New Zealand became the first country to grant women the right to vote in national elections.", category: "History" }, { year: "2017", text: "A magnitude 7.1 earthquake struck central Mexico, killing 370.", category: "Nature" }] },
  { month: 9, day: 20, events: [{ year: "1519", text: "Ferdinand Magellan departed Spain with 5 ships to circumnavigate the globe.", category: "Geography" }, { year: "2017", text: "Hurricane Maria devastated Puerto Rico as a Category 4 storm.", category: "Nature" }] },
  { month: 9, day: 21, events: [{ year: "1937", text: "J.R.R. Tolkien's 'The Hobbit' was published.", category: "Culture" }, { year: "2003", text: "The Galileo spacecraft was deliberately crashed into Jupiter after 14 years.", category: "Space" }] },
  { month: 9, day: 22, events: [{ year: "1692", text: "The last hangings of the Salem witch trials took place in Massachusetts.", category: "History" }, { year: "2006", text: "The Space Shuttle Atlantis landed, concluding the ISS assembly mission.", category: "Space" }] },
  { month: 9, day: 23, events: [{ year: "1846", text: "Neptune was discovered by Johann Galle, based on predictions by Urbain Le Verrier.", category: "Space" }, { year: "63 BCE", text: "Augustus Caesar was born, becoming the first Roman Emperor.", category: "History" }] },
  { month: 9, day: 24, events: [{ year: "2014", text: "India's Mars Orbiter Mission (Mangalyaan) entered Mars orbit on its first attempt.", category: "Space" }, { year: "1789", text: "The US Congress passed the Judiciary Act, establishing the federal court system.", category: "History" }] },
  { month: 9, day: 25, events: [{ year: "1513", text: "Vasco Nunez de Balboa became the first European to see the Pacific Ocean from the Americas.", category: "Geography" }, { year: "2008", text: "China launched Shenzhou 7, its third crewed space mission.", category: "Space" }] },
  { month: 9, day: 26, events: [{ year: "1580", text: "Francis Drake completed the second circumnavigation of the globe aboard the Golden Hind.", category: "Geography" }, { year: "2016", text: "The first US presidential debate between Hillary Clinton and Donald Trump.", category: "History" }] },
  { month: 9, day: 27, events: [{ year: "1905", text: "Albert Einstein published E=mc2, the most famous equation in physics.", category: "Science" }, { year: "1998", text: "Google's search engine went live.", category: "Technology" }] },
  { month: 9, day: 28, events: [{ year: "551 BCE", text: "Confucius was born in the state of Lu, China.", category: "Culture" }, { year: "2015", text: "NASA announced evidence of liquid water flowing on Mars.", category: "Space" }] },
  { month: 9, day: 29, events: [{ year: "1829", text: "London's Metropolitan Police (Scotland Yard) was established.", category: "History" }, { year: "2006", text: "Brazil's Gol flight 1907 collided with an executive jet over the Amazon, killing 154.", category: "History" }] },
  { month: 9, day: 30, events: [{ year: "1846", text: "William Morton used ether anesthesia for a dental extraction --- a landmark in medicine.", category: "Medicine" }, { year: "1949", text: "The Berlin Airlift ended after 15 months and 278,000 flights.", category: "History" }] },
  // ── October ──
  { month: 10, day: 1, events: [{ year: "1949", text: "The People's Republic of China was proclaimed by Mao Zedong.", category: "History" }, { year: "1958", text: "NASA was officially established.", category: "Space" }] },
  { month: 10, day: 2, events: [{ year: "1869", text: "Mahatma Gandhi was born in Porbandar, India.", category: "History" }, { year: "1925", text: "John Logie Baird demonstrated the first working television system.", category: "Technology" }] },
  { month: 10, day: 3, events: [{ year: "1990", text: "Germany was officially reunified.", category: "History" }, { year: "1952", text: "The United Kingdom detonated its first nuclear weapon.", category: "Science" }] },
  { month: 10, day: 4, events: [{ year: "1957", text: "The Soviet Union launched Sputnik 1, the first artificial satellite.", category: "Space" }, { year: "2004", text: "SpaceShipOne won the Ansari X Prize by reaching space twice in two weeks.", category: "Space" }] },
  { month: 10, day: 5, events: [{ year: "1947", text: "The first televised presidential address was broadcast from the White House.", category: "Technology" }, { year: "2011", text: "Steve Jobs died in Palo Alto, California.", category: "Technology" }] },
  { month: 10, day: 6, events: [{ year: "1927", text: "'The Jazz Singer' premiered, the first feature-length 'talkie' motion picture.", category: "Art" }, { year: "1995", text: "The first exoplanet orbiting a Sun-like star (51 Pegasi b) was discovered.", category: "Space" }] },
  { month: 10, day: 7, events: [{ year: "3761 BCE", text: "The traditional starting date of the Hebrew calendar.", category: "Culture" }, { year: "2001", text: "The US began military operations in Afghanistan.", category: "History" }] },
  { month: 10, day: 8, events: [{ year: "1871", text: "The Great Chicago Fire began, destroying 17,000 structures.", category: "History" }, { year: "2018", text: "The IPCC released a landmark climate report warning of 1.5 degrees C threshold.", category: "Nature" }] },
  { month: 10, day: 9, events: [{ year: "1874", text: "The Universal Postal Union was established, enabling worldwide mail.", category: "Economics" }, { year: "2009", text: "NASA's LCROSS mission confirmed water ice on the Moon by crashing into a lunar crater.", category: "Space" }] },
  { month: 10, day: 10, events: [{ year: "1913", text: "The Panama Canal was completed when the Gamboa Dike was destroyed.", category: "Technology" }, { year: "2018", text: "Hurricane Michael made landfall in Florida as a Category 5 storm.", category: "Nature" }] },
  { month: 10, day: 11, events: [{ year: "1968", text: "Apollo 7, the first crewed Apollo mission, was launched.", category: "Space" }, { year: "2000", text: "The 100th Space Shuttle mission was launched (STS-92 Discovery).", category: "Space" }] },
  { month: 10, day: 12, events: [{ year: "1492", text: "Christopher Columbus reached the Americas, landing in the Bahamas.", category: "Geography" }, { year: "1999", text: "The world population was estimated to have reached 6 billion.", category: "History" }] },
  { month: 10, day: 13, events: [{ year: "54", text: "Emperor Nero began his reign in Rome at age 16.", category: "History" }, { year: "2016", text: "Bob Dylan was awarded the Nobel Prize in Literature.", category: "Music" }] },
  { month: 10, day: 14, events: [{ year: "1947", text: "Chuck Yeager broke the sound barrier in the Bell X-1 aircraft.", category: "Technology" }, { year: "2012", text: "Felix Baumgartner skydived from 39 km, breaking the speed of sound in freefall.", category: "Sports" }] },
  { month: 10, day: 15, events: [{ year: "1917", text: "Mata Hari was executed by firing squad in Paris for espionage.", category: "History" }, { year: "1997", text: "The Cassini-Huygens spacecraft was launched to Saturn.", category: "Space" }] },
  { month: 10, day: 16, events: [{ year: "1846", text: "Ether anesthesia was publicly demonstrated for surgery at Massachusetts General Hospital.", category: "Medicine" }, { year: "1978", text: "Karol Wojtyla became Pope John Paul II, the first non-Italian pope in 455 years.", category: "Culture" }] },
  { month: 10, day: 17, events: [{ year: "1888", text: "Thomas Edison filed a patent for the Optical Phonograph (later the movie projector).", category: "Technology" }, { year: "2017", text: "Scientists observed the collision of two neutron stars for the first time.", category: "Science" }] },
  { month: 10, day: 18, events: [{ year: "1867", text: "The US took possession of Alaska from Russia for $7.2 million.", category: "History" }, { year: "1989", text: "The Galileo spacecraft was launched toward Jupiter from Space Shuttle Atlantis.", category: "Space" }] },
  { month: 10, day: 19, events: [{ year: "1987", text: "'Black Monday': Stock markets worldwide crashed, the Dow falling 22% in one day.", category: "Economics" }, { year: "1783", text: "The first untethered hot air balloon flight with humans took place in Paris.", category: "Technology" }] },
  { month: 10, day: 20, events: [{ year: "1803", text: "The US Senate ratified the Louisiana Purchase.", category: "History" }, { year: "2018", text: "The European-Japanese BepiColombo mission launched toward Mercury.", category: "Space" }] },
  { month: 10, day: 21, events: [{ year: "1879", text: "Thomas Edison successfully tested a carbonized bamboo filament lightbulb lasting 1,200 hours.", category: "Technology" }, { year: "2015", text: "The day Marty McFly traveled to the future in 'Back to the Future Part II.'", category: "Culture" }] },
  { month: 10, day: 22, events: [{ year: "1797", text: "Andre-Jacques Garnerin made the first parachute jump from 900 meters.", category: "Technology" }, { year: "2008", text: "India launched Chandrayaan-1, its first lunar mission.", category: "Space" }] },
  { month: 10, day: 23, events: [{ year: "4004 BCE", text: "Archbishop Ussher calculated this as the date of creation (obviously incorrect).", category: "Science" }, { year: "2018", text: "A 1.5 billion-dollar Mega Millions jackpot was won in South Carolina.", category: "Economics" }] },
  { month: 10, day: 24, events: [{ year: "1929", text: "'Black Thursday' triggered the Wall Street Crash and the Great Depression.", category: "Economics" }, { year: "2007", text: "China launched Chang'e 1, its first lunar probe.", category: "Space" }] },
  { month: 10, day: 25, events: [{ year: "1881", text: "Pablo Picasso was born in Malaga, Spain.", category: "Art" }, { year: "2001", text: "Microsoft released Windows XP.", category: "Technology" }] },
  { month: 10, day: 26, events: [{ year: "1861", text: "The Pony Express officially ceased operations after just 18 months.", category: "History" }, { year: "2018", text: "Japan's Hayabusa2 spacecraft deployed a rover on asteroid Ryugu.", category: "Space" }] },
  { month: 10, day: 27, events: [{ year: "1904", text: "The New York City subway opened with its first underground line.", category: "Technology" }, { year: "1962", text: "The Cuban Missile Crisis peaked; Kennedy and Khrushchev reached agreement.", category: "History" }] },
  { month: 10, day: 28, events: [{ year: "1886", text: "The Statue of Liberty was dedicated in New York Harbor.", category: "Art" }, { year: "1971", text: "Britain launched its first (and only) orbital satellite, Prospero.", category: "Space" }] },
  { month: 10, day: 29, events: [{ year: "1929", text: "'Black Tuesday': The stock market crashed, deepening the Great Depression.", category: "Economics" }, { year: "1969", text: "The first ARPANET message was sent between UCLA and Stanford (the internet's origin).", category: "Technology" }] },
  { month: 10, day: 30, events: [{ year: "1938", text: "Orson Welles broadcast 'War of the Worlds' on radio, causing widespread panic.", category: "Culture" }, { year: "2000", text: "The first crew arrived at the International Space Station for permanent habitation.", category: "Space" }] },
  { month: 10, day: 31, events: [{ year: "1517", text: "Martin Luther posted his 95 Theses, sparking the Protestant Reformation.", category: "History" }, { year: "2011", text: "The world population reached 7 billion.", category: "History" }] },
  // ── November ──
  { month: 11, day: 1, events: [{ year: "1952", text: "The US detonated the first hydrogen bomb (Ivy Mike) in the Pacific.", category: "Science" }, { year: "1993", text: "The European Union was formally established by the Maastricht Treaty.", category: "History" }] },
  { month: 11, day: 2, events: [{ year: "2000", text: "The first permanent crew arrived at the ISS, beginning 20+ years of continuous habitation.", category: "Space" }, { year: "1930", text: "Haile Selassie was crowned Emperor of Ethiopia.", category: "History" }] },
  { month: 11, day: 3, events: [{ year: "1957", text: "The Soviet Union launched Laika the dog into orbit aboard Sputnik 2.", category: "Space" }, { year: "1903", text: "Panama declared independence from Colombia, aided by US support.", category: "History" }] },
  { month: 11, day: 4, events: [{ year: "2008", text: "Barack Obama was elected the 44th President of the United States.", category: "History" }, { year: "1922", text: "Howard Carter discovered the entrance to Tutankhamun's tomb in Egypt.", category: "History" }] },
  { month: 11, day: 5, events: [{ year: "1605", text: "Guy Fawkes was arrested for plotting to blow up the English Parliament.", category: "History" }, { year: "2013", text: "India launched the Mars Orbiter Mission (Mangalyaan) on a budget less than the movie 'Gravity.'", category: "Space" }] },
  { month: 11, day: 6, events: [{ year: "1860", text: "Abraham Lincoln was elected the 16th President of the United States.", category: "History" }, { year: "1971", text: "The US conducted the Cannikin nuclear test on Amchitka Island, the largest underground test ever.", category: "Science" }] },
  { month: 11, day: 7, events: [{ year: "1867", text: "Marie Curie was born in Warsaw, Poland.", category: "Science" }, { year: "1996", text: "NASA launched the Mars Global Surveyor, which mapped the Red Planet for 9 years.", category: "Space" }] },
  { month: 11, day: 8, events: [{ year: "1895", text: "Wilhelm Rontgen discovered X-rays, transforming medical imaging.", category: "Science" }, { year: "2016", text: "Donald Trump was elected the 45th President of the United States.", category: "History" }] },
  { month: 11, day: 9, events: [{ year: "1989", text: "The Berlin Wall fell, symbolizing the end of the Cold War.", category: "History" }, { year: "1967", text: "The first unmanned Apollo mission (Apollo 4) launched successfully.", category: "Space" }] },
  { month: 11, day: 10, events: [{ year: "1871", text: "Henry Morton Stanley found David Livingstone in Tanzania: 'Dr. Livingstone, I presume?'", category: "Geography" }, { year: "1969", text: "Sesame Street premiered on PBS, becoming the most-watched children's show in history.", category: "Culture" }] },
  { month: 11, day: 11, events: [{ year: "1918", text: "World War I ended with the signing of the armistice at 11 AM on the 11th day of the 11th month.", category: "History" }, { year: "2014", text: "ESA's Philae lander touched down on comet 67P, the first landing on a comet.", category: "Space" }] },
  { month: 11, day: 12, events: [{ year: "1927", text: "Leon Trotsky was expelled from the Soviet Communist Party by Joseph Stalin.", category: "History" }, { year: "2014", text: "The Philae lander sent back the first images from a comet's surface.", category: "Space" }] },
  { month: 11, day: 13, events: [{ year: "1971", text: "Mariner 9 became the first spacecraft to orbit another planet (Mars).", category: "Space" }, { year: "2015", text: "Terrorist attacks in Paris killed 130 people.", category: "History" }] },
  { month: 11, day: 14, events: [{ year: "1889", text: "Nellie Bly began her attempt to travel around the world in under 80 days (she did it in 72).", category: "History" }, { year: "1971", text: "Mariner 9 entered Mars orbit and began revealing the planet's volcanoes and canyons.", category: "Space" }] },
  { month: 11, day: 15, events: [{ year: "1971", text: "Intel released the 4004, the world's first commercial microprocessor.", category: "Technology" }, { year: "1920", text: "The League of Nations held its first general assembly in Geneva.", category: "History" }] },
  { month: 11, day: 16, events: [{ year: "1945", text: "UNESCO was founded to promote peace through education, science, and culture.", category: "Culture" }, { year: "1974", text: "The Arecibo message was beamed into space, the first deliberate interstellar radio message.", category: "Space" }] },
  { month: 11, day: 17, events: [{ year: "1869", text: "The Suez Canal opened, connecting the Mediterranean and Red Seas.", category: "Geography" }, { year: "1970", text: "The Soviet Lunokhod 1 became the first remote-controlled rover on another world.", category: "Space" }] },
  { month: 11, day: 18, events: [{ year: "1928", text: "Mickey Mouse debuted in 'Steamboat Willie,' the first synchronized-sound cartoon.", category: "Culture" }, { year: "2013", text: "NASA launched the MAVEN spacecraft to study Mars's atmosphere.", category: "Space" }] },
  { month: 11, day: 19, events: [{ year: "1863", text: "Abraham Lincoln delivered the Gettysburg Address.", category: "History" }, { year: "1998", text: "The first module of the International Space Station was launched.", category: "Space" }] },
  { month: 11, day: 20, events: [{ year: "1945", text: "The Nuremberg trials began, prosecuting Nazi war criminals.", category: "History" }, { year: "1998", text: "Russia launched the Zarya module, the first component of the ISS.", category: "Space" }] },
  { month: 11, day: 21, events: [{ year: "1877", text: "Thomas Edison announced the phonograph, his favorite invention.", category: "Technology" }, { year: "1953", text: "The Piltdown Man was exposed as a hoax after 41 years.", category: "Science" }] },
  { month: 11, day: 22, events: [{ year: "1963", text: "President John F. Kennedy was assassinated in Dallas, Texas.", category: "History" }, { year: "1943", text: "The Cairo Conference began, with Roosevelt, Churchill, and Chiang Kai-shek planning post-war Asia.", category: "History" }] },
  { month: 11, day: 23, events: [{ year: "1924", text: "Edwin Hubble proved that galaxies exist beyond the Milky Way.", category: "Space" }, { year: "1644", text: "John Milton published 'Areopagitica,' a landmark defense of freedom of speech.", category: "Culture" }] },
  { month: 11, day: 24, events: [{ year: "1859", text: "Charles Darwin published 'On the Origin of Species.'", category: "Science" }, { year: "1969", text: "Apollo 12 splashed down safely, completing the second lunar landing mission.", category: "Space" }] },
  { month: 11, day: 25, events: [{ year: "1915", text: "Einstein presented the field equations of general relativity to the Prussian Academy.", category: "Science" }, { year: "1974", text: "U Thant, the first non-European UN Secretary-General (from Burma/Myanmar), died.", category: "History" }] },
  { month: 11, day: 26, events: [{ year: "1922", text: "Howard Carter and Lord Carnarvon entered Tutankhamun's tomb for the first time.", category: "History" }, { year: "2011", text: "NASA launched the Curiosity rover toward Mars.", category: "Space" }] },
  { month: 11, day: 27, events: [{ year: "1895", text: "Alfred Nobel signed his will, establishing the Nobel Prizes.", category: "Science" }, { year: "2005", text: "The first partial face transplant was performed in France.", category: "Medicine" }] },
  { month: 11, day: 28, events: [{ year: "1520", text: "Ferdinand Magellan's fleet entered the Pacific Ocean through the strait now named after him.", category: "Geography" }, { year: "1964", text: "Mariner 4 was launched on the first successful flyby of Mars.", category: "Space" }] },
  { month: 11, day: 29, events: [{ year: "1877", text: "Thomas Edison demonstrated the phonograph for the first time.", category: "Technology" }, { year: "1961", text: "Enos the chimpanzee orbited Earth twice in a Mercury-Atlas spacecraft.", category: "Space" }] },
  { month: 11, day: 30, events: [{ year: "1872", text: "The first international football match was played: Scotland vs England (0-0 draw).", category: "Sports" }, { year: "1954", text: "A meteorite struck a woman in Sylacauga, Alabama --- the only confirmed injury from a meteorite.", category: "Space" }] },
  // ── December ──
  { month: 12, day: 1, events: [{ year: "1913", text: "The first moving assembly line was installed at Ford's Highland Park plant, revolutionizing manufacturing.", category: "Technology" }, { year: "1959", text: "The Antarctic Treaty was signed, dedicating the continent to peace and science.", category: "Geography" }] },
  { month: 12, day: 2, events: [{ year: "1942", text: "Enrico Fermi achieved the first self-sustaining nuclear chain reaction in Chicago.", category: "Science" }, { year: "2015", text: "Climate change: 195 nations adopted the Paris Agreement to limit global warming.", category: "Nature" }] },
  { month: 12, day: 3, events: [{ year: "1984", text: "The Bhopal gas disaster in India killed thousands, the world's worst industrial disaster.", category: "History" }, { year: "1999", text: "NASA lost contact with Mars Polar Lander, which crashed during landing.", category: "Space" }] },
  { month: 12, day: 4, events: [{ year: "1872", text: "The crew of the Mary Celeste was found missing in the Atlantic, one of the sea's great mysteries.", category: "Ocean" }, { year: "1996", text: "NASA launched the Mars Pathfinder with the Sojourner rover.", category: "Space" }] },
  { month: 12, day: 5, events: [{ year: "1901", text: "Walt Disney was born in Chicago, Illinois.", category: "Culture" }, { year: "2017", text: "Russia was banned from the 2018 Winter Olympics for state-sponsored doping.", category: "Sports" }] },
  { month: 12, day: 6, events: [{ year: "1768", text: "The first edition of Encyclopaedia Britannica was published in Edinburgh.", category: "Culture" }, { year: "2017", text: "President Trump recognized Jerusalem as the capital of Israel.", category: "History" }] },
  { month: 12, day: 7, events: [{ year: "1941", text: "Japan attacked Pearl Harbor, bringing the US into World War II.", category: "History" }, { year: "1972", text: "Apollo 17 launched, the last crewed mission to the Moon.", category: "Space" }] },
  { month: 12, day: 8, events: [{ year: "1980", text: "John Lennon was assassinated in New York City.", category: "Music" }, { year: "1995", text: "The Galileo spacecraft arrived at Jupiter and deployed its atmospheric probe.", category: "Space" }] },
  { month: 12, day: 9, events: [{ year: "1979", text: "The WHO certified the global eradication of smallpox.", category: "Medicine" }, { year: "2006", text: "The space shuttle Discovery was launched at night for the ISS assembly.", category: "Space" }] },
  { month: 12, day: 10, events: [{ year: "1901", text: "The first Nobel Prizes were awarded in Stockholm and Oslo.", category: "Science" }, { year: "1968", text: "Japan's Shinkansen (bullet train) began service on the Tokaido line.", category: "Technology" }] },
  { month: 12, day: 11, events: [{ year: "1946", text: "UNICEF was founded to provide aid to children worldwide.", category: "History" }, { year: "1998", text: "The Mars Climate Orbiter was launched (later lost due to a metric/imperial unit error).", category: "Space" }] },
  { month: 12, day: 12, events: [{ year: "1901", text: "Guglielmo Marconi received the first transatlantic radio signal.", category: "Technology" }, { year: "2015", text: "The Paris Climate Agreement was adopted by 196 nations.", category: "Nature" }] },
  { month: 12, day: 13, events: [{ year: "2003", text: "Saddam Hussein was captured by US forces in Tikrit, Iraq.", category: "History" }, { year: "1577", text: "Sir Francis Drake set sail from Plymouth on his circumnavigation of the globe.", category: "Geography" }] },
  { month: 12, day: 14, events: [{ year: "1911", text: "Roald Amundsen's team became the first to reach the South Pole.", category: "Geography" }, { year: "1972", text: "Apollo 17 astronauts left the Moon --- no human has returned since.", category: "Space" }] },
  { month: 12, day: 15, events: [{ year: "1791", text: "The US Bill of Rights was ratified.", category: "History" }, { year: "2009", text: "SpaceX completed its first successful commercial launch (Falcon 9 demo).", category: "Space" }] },
  { month: 12, day: 16, events: [{ year: "1773", text: "The Boston Tea Party: colonists dumped tea into Boston Harbor to protest British taxation.", category: "History" }, { year: "1770", text: "Ludwig van Beethoven was baptized in Bonn, Germany (likely born Dec 16 or 17).", category: "Music" }] },
  { month: 12, day: 17, events: [{ year: "1903", text: "The Wright Brothers achieved the first powered, controlled flight at Kitty Hawk, North Carolina.", category: "Technology" }, { year: "2017", text: "The last Ringling Bros. circus performed, ending a 146-year run.", category: "Culture" }] },
  { month: 12, day: 18, events: [{ year: "1865", text: "The 13th Amendment to the US Constitution was ratified, abolishing slavery.", category: "History" }, { year: "1958", text: "The first communications satellite, Project SCORE, was launched.", category: "Space" }] },
  { month: 12, day: 19, events: [{ year: "1843", text: "Charles Dickens published 'A Christmas Carol.'", category: "Culture" }, { year: "2013", text: "ESA launched Gaia, a space observatory mapping a billion stars in the Milky Way.", category: "Space" }] },
  { month: 12, day: 20, events: [{ year: "1860", text: "South Carolina became the first state to secede from the Union, leading to the Civil War.", category: "History" }, { year: "2019", text: "The US Space Force was established as the sixth branch of the military.", category: "Space" }] },
  { month: 12, day: 21, events: [{ year: "1968", text: "Apollo 8 launched, the first crewed mission to orbit the Moon.", category: "Space" }, { year: "1898", text: "Marie and Pierre Curie discovered radium.", category: "Science" }] },
  { month: 12, day: 22, events: [{ year: "1938", text: "A coelacanth was caught off South Africa --- a 'living fossil' thought extinct for 65 million years.", category: "Animals" }, { year: "1894", text: "Captain Alfred Dreyfus was convicted in France, sparking the Dreyfus Affair.", category: "History" }] },
  { month: 12, day: 23, events: [{ year: "1947", text: "The transistor was demonstrated for the first time at Bell Labs.", category: "Technology" }, { year: "1888", text: "Vincent van Gogh cut off part of his own ear in Arles, France.", category: "Art" }] },
  { month: 12, day: 24, events: [{ year: "1968", text: "Apollo 8 astronauts took the 'Earthrise' photo from lunar orbit.", category: "Space" }, { year: "1814", text: "The Treaty of Ghent ended the War of 1812 between the US and Britain.", category: "History" }] },
  { month: 12, day: 25, events: [{ year: "1642", text: "Isaac Newton was born (under the Julian calendar) in Woolsthorpe, England.", category: "Science" }, { year: "2021", text: "The James Webb Space Telescope launched from French Guiana.", category: "Space" }] },
  { month: 12, day: 26, events: [{ year: "1898", text: "Marie and Pierre Curie announced the discovery of radium.", category: "Science" }, { year: "2004", text: "A magnitude 9.1 earthquake triggered a devastating tsunami across the Indian Ocean, killing 230,000.", category: "Nature" }] },
  { month: 12, day: 27, events: [{ year: "1831", text: "Charles Darwin embarked on HMS Beagle for a 5-year voyage that inspired evolution theory.", category: "Science" }, { year: "1968", text: "Apollo 8 astronauts returned safely after the first crewed lunar orbit.", category: "Space" }] },
  { month: 12, day: 28, events: [{ year: "1895", text: "The Lumiere brothers held the first public film screening in Paris.", category: "Art" }, { year: "1612", text: "Galileo first observed Neptune, though he mistook it for a star.", category: "Space" }] },
  { month: 12, day: 29, events: [{ year: "1170", text: "Thomas Becket, Archbishop of Canterbury, was murdered in Canterbury Cathedral.", category: "History" }, { year: "1989", text: "Vaclav Havel was elected president of Czechoslovakia during the Velvet Revolution.", category: "History" }] },
  { month: 12, day: 30, events: [{ year: "1922", text: "The Soviet Union was officially established.", category: "History" }, { year: "2006", text: "Saddam Hussein was executed in Baghdad.", category: "History" }] },
  { month: 12, day: 31, events: [{ year: "1879", text: "Thomas Edison publicly demonstrated the incandescent lightbulb for the first time.", category: "Technology" }, { year: "1999", text: "Boris Yeltsin resigned as President of Russia; Vladimir Putin became acting president.", category: "History" }] },
]

/* ─── Helpers ─── */
function getDayEntry(month: number, day: number): DayEntry | undefined {
  return DAYS.find(d => d.month === month && d.day === day)
}

function formatDate(month: number, day: number, year?: number): string {
  const d = new Date(year || 2024, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function adjacentDay(month: number, day: number, delta: number): { month: number; day: number } {
  const d = new Date(2024, month - 1, day + delta) // 2024 is a leap year
  return { month: d.getMonth() + 1, day: d.getDate() }
}

export default function TodayPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [day, setDay] = useState(now.getDate())

  const entry = getDayEntry(month, day)
  const prev = adjacentDay(month, day, -1)
  const next = adjacentDay(month, day, 1)
  const isToday = month === now.getMonth() + 1 && day === now.getDate()

  const navigate = (m: number, d: number) => {
    setMonth(m)
    setDay(d)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="font-mono text-xs uppercase tracking-wide hover:text-tomato transition-colors mb-8 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Back
      </Link>

      <div className="text-center mb-12">
        <Calendar size={32} strokeWidth={1.5} className="mx-auto mb-4" />
        <p className="font-mono text-xs uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--ink-soft)' }}>
          {isToday ? 'Today in History' : 'On This Day'}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          {formatDate(month, day)}
        </h1>
      </div>

      {entry ? (
        <div className="space-y-6 mb-12">
          {entry.events.map((event, i) => (
            <article
              key={i}
              className="p-6 flex gap-5"
              style={{ border: '1.5px solid var(--ink)', animation: `fadeIn ${300 + i * 150}ms ease both` }}
            >
              <div className="flex-shrink-0 text-center" style={{ minWidth: '70px' }}>
                <div className="font-display text-2xl font-bold leading-none" style={{ color: 'var(--tomato)' }}>
                  {event.year}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-display text-lg leading-relaxed">{event.text}</p>
                <span className="stamp mt-3 inline-block" style={{ borderRadius: '999px', fontSize: '0.6rem' }}>{event.category}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Sparkles size={32} className="mx-auto mb-4" style={{ color: 'var(--ink-soft)' }} />
          <p className="font-display italic text-xl" style={{ color: 'var(--ink-soft)' }}>
            No events recorded for this date yet.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button className="btn" onClick={() => navigate(prev.month, prev.day)}>
          <ChevronLeft size={14} /> Previous
        </button>
        {!isToday && (
          <button className="btn" onClick={() => { setMonth(now.getMonth() + 1); setDay(now.getDate()) }}>
            Today
          </button>
        )}
        <button className="btn" onClick={() => navigate(next.month, next.day)}>
          Next <ChevronRight size={14} />
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

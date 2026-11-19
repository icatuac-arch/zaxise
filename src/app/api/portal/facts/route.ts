import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Serve random facts from didyouknow's content files if available,
// otherwise use a built-in set
const BUILT_IN_FACTS = [
  { id: '1', text: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.', category: 'Food', source: 'National Geographic' },
  { id: '2', text: 'Octopuses have three hearts, nine brains, and blue blood.', category: 'Animals', source: 'Smithsonian' },
  { id: '3', text: 'A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once but only 225 to orbit the Sun.', category: 'Space', source: 'NASA' },
  { id: '4', text: 'The shortest war in history lasted 38 to 45 minutes between Britain and Zanzibar on August 27, 1896.', category: 'History', source: 'Britannica' },
  { id: '5', text: 'Bananas are berries, but strawberries are not.', category: 'Science', source: 'Stanford' },
  { id: '6', text: 'The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the iron.', category: 'Science', source: 'Tour Eiffel' },
  { id: '7', text: 'A group of flamingos is called a "flamboyance."', category: 'Animals', source: 'Audubon Society' },
  { id: '8', text: 'The speed of light would allow you to circle the Earth 7.5 times in one second.', category: 'Physics', source: 'NASA' },
  { id: '9', text: 'There are more possible iterations of a game of chess than there are atoms in the observable universe.', category: 'Math', source: 'Shannon Number' },
  { id: '10', text: 'The Great Wall of China is not visible from space with the naked eye, contrary to popular belief.', category: 'Geography', source: 'NASA' },
  { id: '11', text: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.', category: 'History', source: 'History.com' },
  { id: '12', text: 'Water can boil and freeze at the same time — it\'s called the triple point.', category: 'Physics', source: 'APS Physics' },
]

export async function GET() {
  // Try to load from didyouknow content files
  const contentDir = path.join(process.env.HOME || '', 'didyouknow', 'content', 'facts')
  let facts = BUILT_IN_FACTS

  try {
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'))
      if (files.length > 0) {
        const randomFile = files[Math.floor(Math.random() * files.length)]
        const content = JSON.parse(fs.readFileSync(path.join(contentDir, randomFile), 'utf-8'))
        if (Array.isArray(content) && content.length > 0) {
          // Pick 6 random facts from this category
          const shuffled = content.sort(() => 0.5 - Math.random())
          facts = shuffled.slice(0, 6).map((f: any) => ({
            id: f.id || String(Math.random()),
            text: f.text || f.fact || '',
            category: f.category || randomFile.replace('.json', ''),
            source: f.source?.name || f.source || '',
          }))
        }
      }
    }
  } catch {
    // Fall back to built-in
  }

  // Pick random subset
  const shuffled = [...facts].sort(() => 0.5 - Math.random())
  return NextResponse.json({ facts: shuffled.slice(0, 6) })
}

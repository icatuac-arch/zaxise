// Portal configuration — data sources and metro detection

export const METRO_AREAS = [
  'Bay Area', 'New York', 'LA', 'Chicago', 'Dallas', 'Houston',
  'DC', 'Atlanta', 'Seattle', 'Phoenix', 'Philadelphia', 'Boston',
  'San Diego', 'Denver', 'Austin', 'NJ', 'Orlando', 'Tampa',
  'Research Triangle', 'Detroit', 'Minneapolis', 'Portland',
  'Sacramento', 'Charlotte', 'Nashville', 'Columbus', 'Indianapolis',
] as const

export type Metro = typeof METRO_AREAS[number]

// NASA APOD API
export const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'

// Space news
export const SPACE_NEWS_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=6'

// ISS position
export const ISS_POSITION_URL = 'http://api.open-notify.org/iss-now.json'

// Astronauts in space
export const ASTROS_URL = 'http://api.open-notify.org/astros.json'

// Space launches
export const LAUNCHES_URL = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=4&mode=detailed'

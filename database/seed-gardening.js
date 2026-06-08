import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

const formatDate = date => date.toISOString().split('T')[0]

const metadataPatterns = [
  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
  /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i,
  /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+itemprop=["']image["'][^>]*>/i
]

const addDays = (date, days) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

const seedVendors = [
  'Baker Creek',
  'Johnny\'s Selected Seeds',
  'Seed Savers Exchange',
  'Southern Exposure Seed Exchange',
  'Botanical Interests',
  'Burpee'
]

const seedImages = [
  'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e',
  'https://images.unsplash.com/photo-1598512752271-33f913a5af13',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2'
]

const seedPageUrls = [
  'https://www.botanicalinterests.com/products/arugula-rocket?variant=43922604458237',
  'https://www.botanicalinterests.com/products/san-marzano-pole-tomato-seeds?variant=43922580603133',
  'https://www.botanicalinterests.com/products/beefy-purple-bush-tomato-seeds?variant=43922580603133',
  'https://www.johnnyseeds.com/vegetables/tomatoes/beefsteak-tomatoes/firebird-f1-tomato-seed-5226.html',
  'https://www.johnnyseeds.com/flowers/sunflowers/tall-sunflowers/procut-white-nite-f1-sunflower-seed-3305.html',
  'https://www.johnnyseeds.com/flowers/sunflowers/tall-sunflowers/autumn-beauty-sunflower-seed-1305.html'
]

const seedCatalog = [
  { type: 'tomato', varieties: ['Black Krim', 'Cherokee Purple', 'Sungold', 'San Marzano'] },
  { type: 'pepper', varieties: ['Jalapeno', 'Shishito', 'California Wonder', 'Sweet Banana'] },
  { type: 'lettuce', varieties: ['Buttercrunch', 'Romaine', 'Black Seeded Simpson', 'Oak Leaf'] },
  { type: 'bean', varieties: ['Provider', 'Kentucky Wonder', 'Dragon Tongue', 'Contender'] },
  { type: 'cucumber', varieties: ['Marketmore', 'Boston Pickling', 'Lemon', 'Straight Eight'] },
  { type: 'carrot', varieties: ['Danvers', 'Nantes', 'Little Finger', 'Purple Haze'] },
  { type: 'basil', varieties: ['Genovese', 'Thai', 'Lemon', 'Purple Opal'] },
  { type: 'zinnia', varieties: ['Benary\'s Giant', 'Cut and Come Again', 'State Fair', 'Queen Lime'] }
]

const sunTypes = ['full_sun', 'partial_sun', 'partial_shade', 'shade', 'unknown']
const sowMethods = ['inside', 'outside', 'either']
const seedDepths = ['0', '0.125', '0.25', '0.5', '0.75', '1']

const decodeHtmlEntities = value => value
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, '\'')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')

const findPreviewImage = (html) => {
  for (const pattern of metadataPatterns) {
    const match = html.match(pattern)

    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim())
    }
  }

  return null
}

const fetchPreviewImage = async (sourcePageUrl) => {
  const pageUrl = new URL(sourcePageUrl)
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 10000)

  try {
    const response = await fetch(pageUrl, {
      signal: abortController.signal,
      headers: {
        'User-Agent': 'Home OS gardening seed seeder'
      }
    })

    if (!response.ok) {
      console.warn(`Could not fetch preview image for ${sourcePageUrl}: ${response.status}`)
      return null
    }

    const previewImage = findPreviewImage(await response.text())

    if (!previewImage) {
      console.warn(`No preview image metadata found for ${sourcePageUrl}`)
      return null
    }

    return new URL(previewImage, pageUrl).toString()
  } catch (error) {
    console.warn(`Could not fetch preview image for ${sourcePageUrl}: ${error.message}`)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

const buildPreviewImageCache = async () => {
  console.log('Fetching seed source preview images...')

  const entries = await Promise.all(seedPageUrls.map(async (sourcePageUrl) => {
    const sourceImageUrl = await fetchPreviewImage(sourcePageUrl)

    return [sourcePageUrl, sourceImageUrl]
  }))

  return new Map(entries)
}

const buildSeed = (index, previewImageCache) => {
  const catalogItem = faker.helpers.arrayElement(seedCatalog)
  const isSuccessionPlanted = faker.datatype.boolean({ probability: 0.35 })
  const sourcePageUrl = faker.helpers.arrayElement(seedPageUrls)

  return {
    location_number: `S-${String(index + 1).padStart(3, '0')}`,
    type: catalogItem.type,
    variety: faker.helpers.arrayElement(catalogItem.varieties),
    recommended_sow_method: faker.helpers.arrayElement(sowMethods),
    is_succession_planted: isSuccessionPlanted,
    succession_interval_days: isSuccessionPlanted ? faker.number.int({ min: 7, max: 21 }) : null,
    days_to_emerge: faker.number.int({ min: 3, max: 21 }),
    days_to_maturity: faker.number.int({ min: 35, max: 110 }),
    seed_depth_inches: faker.helpers.arrayElement(seedDepths),
    row_spacing_inches: faker.number.int({ min: 6, max: 36 }),
    is_deer_resistant: faker.datatype.boolean(),
    sun_type: faker.helpers.arrayElement(sunTypes),
    purchased_from: faker.helpers.arrayElement(seedVendors),
    source_page_url: sourcePageUrl,
    source_image_url: previewImageCache.get(sourcePageUrl) ?? faker.helpers.arrayElement(seedImages),
    overall_rating: faker.number.int({ min: 1, max: 5 }),
    notes: faker.lorem.sentence()
  }
}

const buildSowingWindows = (seedId) => {
  const windowCount = faker.number.int({ min: 1, max: 2 })
  const windows = []

  for (let i = 0; i < windowCount; i++) {
    const sowStartWeeks = faker.number.int({ min: 0, max: 10 })
    const sowEndWeeks = sowStartWeeks + faker.number.int({ min: 0, max: 3 })

    windows.push({
      seed_id: seedId,
      sow_method: i === 0 ? 'inside' : 'outside',
      sow_reference: faker.helpers.arrayElement(['last_frost', 'first_frost']),
      sow_direction: faker.helpers.arrayElement(['before', 'after']),
      sow_start_weeks: sowStartWeeks,
      sow_end_weeks: sowEndWeeks,
      notes: faker.datatype.boolean({ probability: 0.25 }) ? faker.lorem.sentence() : null
    })
  }

  return windows
}

const buildTasks = (seeds) => {
  const today = new Date()
  const buildTaskStatus = () => faker.helpers.weightedArrayElement([
    { weight: 6, value: 'pending' },
    { weight: 2, value: 'completed' },
    { weight: 1, value: 'skipped' },
    { weight: 1, value: 'canceled' }
  ])
  const buildCompletedAt = (status, dueDate) => {
    if (status !== 'completed') return null

    return addDays(new Date(dueDate), faker.number.int({ min: 0, max: 5 })).toISOString()
  }

  return seeds.flatMap((seed) => {
    const status = buildTaskStatus()
    const dueDate = formatDate(addDays(today, faker.number.int({ min: 1, max: 45 })))
    const tasks = [{
      seed_id: seed.id,
      title: `Start ${seed.variety} ${seed.type}`,
      due_date: dueDate,
      status,
      completed_at: buildCompletedAt(status, dueDate),
      notes: faker.lorem.sentence()
    }]

    if (seed.is_succession_planted) {
      const successionStatus = buildTaskStatus()
      const successionDueDate = formatDate(addDays(today, seed.succession_interval_days ?? 14))

      tasks.push({
        seed_id: seed.id,
        title: `Succession plant ${seed.variety} ${seed.type}`,
        due_date: successionDueDate,
        status: successionStatus,
        completed_at: buildCompletedAt(successionStatus, successionDueDate),
        notes: 'Generated from succession planting interval.'
      })
    }

    return tasks
  })
}

const clearGardeningData = async () => {
  console.log('Clearing existing gardening seed data...')

  await supabase.from('garden_seed_tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('garden_seed_sowing_windows').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('garden_seeds').delete().neq('id', '00000000-0000-0000-0000-000000000000')
}

const seedGardening = async (numEntries) => {
  console.log(`Seeding ${numEntries} garden seeds...`)

  const previewImageCache = await buildPreviewImageCache()
  const seeds = Array.from({ length: numEntries }, (_, index) => buildSeed(index, previewImageCache))
  const { data: insertedSeeds, error: seedError } = await supabase
    .from('garden_seeds')
    .insert(seeds)
    .select('id, type, variety, is_succession_planted, succession_interval_days')

  if (seedError) {
    console.error('Error inserting garden seeds:', seedError)
    return
  }

  const sowingWindows = insertedSeeds.flatMap(seed => buildSowingWindows(seed.id))
  const { error: sowingWindowError } = await supabase
    .from('garden_seed_sowing_windows')
    .insert(sowingWindows)

  if (sowingWindowError) {
    console.error('Error inserting garden seed sowing windows:', sowingWindowError)
    return
  }

  const tasks = buildTasks(insertedSeeds)
  const { error: taskError } = await supabase
    .from('garden_seed_tasks')
    .insert(tasks)

  if (taskError) {
    console.error('Error inserting garden seed tasks:', taskError)
    return
  }

  console.log('Gardening seeding completed.')
}

await clearGardeningData()
await seedGardening(24)

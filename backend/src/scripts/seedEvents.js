const { supabaseAdmin } = require('../config/supabase');
const events = require('../models/EventCatalog');

async function seed() {
  console.log('Seeding events...');
  if (!supabaseAdmin) {
    console.log('No supabase admin client configured, skipping remote seed.');
    return;
  }
  
  try {
    const { data, error } = await supabaseAdmin.from('events').upsert(events);
    if (error) throw error;
    console.log(`Seeded ${events.length} events successfully.`);
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import translate from 'google-translate-api-x';

dotenv.config({ path: '.env' }); // Or .env depending on your setup

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Define the schema inline for the script
const PriceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHi: { type: String, default: '' },
  price: { type: Number, required: true },
  qty: { type: Number, default: 1 },
  unit: { type: String, default: 'pcs' },
  isVisible: { type: Boolean, default: true },
  organizationId: { type: String, required: true },
}, { timestamps: true });

const PriceItem = mongoose.models.PriceItem || mongoose.model('PriceItem', PriceItemSchema);

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function transliterate(text: string): Promise<string> {
  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data[0] === 'SUCCESS') {
      return data[1][0][1][0];
    }
  } catch (e) {
    console.error('Transliteration failed', e);
  }
  return text;
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const items = await PriceItem.find({});
    console.log(`Found ${items.length} items in the database.`);

    for (const item of items) {
      const isHindi = /[\u0900-\u097F]/.test(item.name);

      let needsUpdate = false;

      if (isHindi && !item.nameHi) {
        // Name is in Hindi, but nameHi is empty. Let's make nameHi = name, and translate name to English.
        console.log(`Translating Hindi name to English for item: ${item.name}`);
        try {
          const res = await translate(item.name, { from: 'hi', to: 'en' });
          item.nameHi = item.name;
          item.name = res.text;
          needsUpdate = true;
        } catch (e: any) {
          console.error(`Failed to translate ${item.name}: ${e.message}`);
        }
      } else if (!isHindi && (!item.nameHi || item.nameHi.trim() === '')) {
        // Name is in English, nameHi is empty. Transliterate name to Hindi script.
        console.log(`Transliterating English name to Hindi for item: ${item.name}`);
        const nameHi = await transliterate(item.name);
        if (nameHi !== item.name) {
          item.nameHi = nameHi;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await item.save();
        console.log(`Updated item ID: ${item._id} (name: ${item.name}, nameHi: ${item.nameHi})`);

        // Add a delay to avoid rate limiting from the free translation API
        await delay(1000);
      }
    }

    console.log('Finished translating all items.');
  } catch (error) {
    console.error('Error in translation script:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("No MONGODB_URI");
    return;
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const items = await db.collection('priceitems').find().sort({createdAt: -1}).limit(5).toArray();
  console.log(items.map(i => ({ name: i.name, nameHi: i.nameHi })));
  await client.close();
}

check();

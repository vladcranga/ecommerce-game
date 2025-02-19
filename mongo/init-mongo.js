// Switch to the target database
db = db.getSiblingDB('fantasy-game-store');

try {
  // Read items from JSON file
  const fs = require('fs');
  const items = JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/items.json', 'utf8'));

  if (!Array.isArray(items)) {
    throw new Error('Items data is not an array');
  }

  // Transform ObjectId strings to actual ObjectIds
  const transformedItems = items.map(item => {
    if (item._id && item._id.$oid) {
      item._id = ObjectId(item._id.$oid);
    }
    return item;
  });

  // Insert items if collection is empty
  if (db.items.countDocuments() === 0) {
    db.items.insertMany(transformedItems);
  }

  // Create indexes
  // Sort in ascending order
  db.items.createIndex({ name: 1 });
  db.items.createIndex({ category: 1 });
  db.items.createIndex({ "reviews.user": 1 });

} catch (error) {
  throw error;
}

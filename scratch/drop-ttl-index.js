require("dotenv").config();
const mongoose = require("mongoose");

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to database...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    const collection = mongoose.connection.collection("lastknownlocations");
    
    // List indexes
    console.log("Listing current indexes:");
    const indexes = await collection.indexes();
    console.log(indexes);

    // Look for the updatedAt_1 index (or whichever index has expireAfterSeconds)
    const ttlIndex = indexes.find(idx => idx.expireAfterSeconds !== undefined);

    if (ttlIndex) {
      console.log(`Found TTL Index: "${ttlIndex.name}". Dropping it...`);
      await collection.dropIndex(ttlIndex.name);
      console.log("TTL Index dropped successfully!");
    } else {
      console.log("No TTL index found in the database. It may have already been dropped or never created.");
    }

  } catch (error) {
    console.error("Error during index operations:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

run();

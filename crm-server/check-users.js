const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0gbjyme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);

async function checkUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    
    const database = client.db("CRMDB");
    const users = await database.collection("users").find({}).toArray();
    
    console.log("\n=== Current Users in Database ===");
    console.log(`Total users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Has Password: ${user.password ? 'YES' : 'NO'}`);
      console.log("");
    });
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

checkUsers(); 
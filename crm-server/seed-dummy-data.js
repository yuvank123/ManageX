const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// MongoDB URI
const uri = "mongodb+srv://asrvmishra123:ankit1234@cluster0.0gbjyme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to hash passwords
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Expanded dummyUsers to 20 (1 admin, 5 executives, 14 employees)
const dummyUsers = [
  { email: "admin@abc.com", name: "Admin Test", role: "admin", user_photo: null, uid: "admin123", password: "admin123", createdAt: new Date(), lastLogin: new Date() },
  { email: "executive1@company.com", name: "John Smith", role: "executives", user_photo: null, uid: "exec123", password: "exec123", createdAt: new Date(), lastLogin: new Date() },
  { email: "executive2@company.com", name: "Sarah Johnson", role: "executives", user_photo: null, uid: "exec124", password: "exec124", createdAt: new Date(), lastLogin: new Date() },
  { email: "executive3@company.com", name: "Mike Wilson", role: "executives", user_photo: null, uid: "exec125", password: "exec125", createdAt: new Date(), lastLogin: new Date() },
  { email: "executive4@company.com", name: "Emily Davis", role: "executives", user_photo: null, uid: "exec126", password: "exec126", createdAt: new Date(), lastLogin: new Date() },
  { email: "executive5@company.com", name: "David Brown", role: "executives", user_photo: null, uid: "exec127", password: "exec127", createdAt: new Date(), lastLogin: new Date() },
  ...Array.from({ length: 14 }, (_, i) => ({
    email: `employee${i + 1}@company.com`,
    name: `Employee ${i + 1}`,
    role: "employee",
    user_photo: null,
    uid: `emp${100 + i}`,
    password: `emp${100 + i}`,
    createdAt: new Date(),
    lastLogin: new Date()
  }))
];

// Added dummyEmployees array with 90 employees
const dummyEmployees = Array.from({ length: 90 }, (_, i) => ({
  email: `employee${i + 1}@company.com`,
  name: `Employee ${i + 1}`,
  role: "employee",
  user_photo: null,
  uid: `emp${200 + i}`,
  password: `emp${200 + i}`,
  createdAt: new Date(),
  lastLogin: new Date()
}));

// Expanded dummyLeads to 32, each with customerName, expectedDate, leadEmail, and notes
const dummyLeads = Array.from({ length: 32 }, (_, i) => ({
  customerName: `Customer ${i + 1}`,
  email: `customer${i + 1}@company.com`,
  phone: `+1-555-01${(i + 10).toString().padStart(2, '0')}`,
  company: `Company ${i + 1}`,
  product: ["CRM Software", "Cloud Services", "Analytics Platform", "Web Development", "Mobile Apps", "AI Platform", "IoT Solutions", "Database Solutions"][i % 8],
  status: ["New", "In Progress", "Closed"][i % 3],
  myEmail: `executive${(i % 5) + 1}@company.com`,
  leadEmail: `lead${i + 1}@company.com`,
  expectedDate: `2025-07-${(i % 28) + 1}`,
  notes: `Notes for lead ${i + 1}`,
  createdAt: new Date()
}));

// Expanded dummyTasks to 33, using 'deadline' instead of 'dueDate'
const dummyTasks = Array.from({ length: 33 }, (_, i) => ({
  title: `Task ${i + 1}`,
  description: `Description for task ${i + 1}`,
  email: `executive${(i % 5) + 1}@company.com`,
  priority: ["High", "Medium", "Low"][i % 3],
  status: ["Pending", "In Progress", "complete"][i % 3],
  deadline: `2024-03-${(i % 28) + 1}`,
  createdAt: new Date()
}));

// Expanded dummyFollowUps to include remarks and fill all fields
const dummyFollowUps = Array.from({ length: 20 }, (_, i) => ({
  customerName: `Customer ${i + 1}`,
  followUpDate: `2024-03-${(i % 28) + 1}`,
  time: `${(9 + (i % 9))}:00 ${i % 2 === 0 ? 'AM' : 'PM'}`,
  remarks: `Remarks for follow-up ${i + 1}`,
  myEmail: `executive${(i % 5) + 1}@company.com`,
  leadEmail: `lead${i + 1}@company.com`,
  status: ["Pending", "Completed", "In Progress"][i % 3],
  createdAt: new Date()
}));

// Expanded dummyTickets to include category and message
const dummyTickets = Array.from({ length: 10 }, (_, i) => ({
  title: `Ticket ${i + 1}`,
  description: `Description for ticket ${i + 1}`,
  executiveEmail: `executive${(i % 5) + 1}@company.com`,
  customerEmail: `customer${i + 1}@company.com`,
  priority: ["High", "Medium", "Low", "Critical"][i % 4],
  status: ["Open", "In Progress", "Resolved"][i % 3],
  category: `Category ${i + 1}`,
  message: `Message for ticket ${i + 1}`,
  createdAt: new Date()
}));

const dummyReviews = [
  { name: "John Smith", email: "executive1@company.com", rating: 5, description: "Excellent CRM system, very user-friendly", recommend: "Yes", createdAt: new Date() },
  { name: "Sarah Johnson", email: "executive2@company.com", rating: 4, description: "Great features, minor UI improvements needed", recommend: "Yes", createdAt: new Date() },
  { name: "Mike Wilson", email: "executive3@company.com", rating: 5, description: "Outstanding performance and reliability", recommend: "Yes", createdAt: new Date() },
  { name: "Emily Davis", email: "executive4@company.com", rating: 4, description: "Good system, analytics could be better", recommend: "Yes", createdAt: new Date() },
  { name: "David Brown", email: "executive5@company.com", rating: 5, description: "Perfect for our business needs", recommend: "Yes", createdAt: new Date() }
];

const dummyNotifications = [
  { title: "New Lead Assigned", message: "You have been assigned a new lead: TechCorp Solutions", email: "executive1@company.com", type: "lead", read: false, createdAt: new Date() },
  { title: "Task Due Soon", message: "Task 'Follow up with TechCorp' is due in 2 days", email: "executive1@company.com", type: "task", read: true, createdAt: new Date() },
  { title: "Follow-up Reminder", message: "Follow-up with Global Industries is overdue", email: "executive2@company.com", type: "followup", read: false, createdAt: new Date() },
  { title: "Ticket Updated", message: "Ticket 'CRM Login Issue' status changed to In Progress", email: "executive1@company.com", type: "ticket", read: true, createdAt: new Date() },
  { title: "New Task Assigned", message: "New task 'Prepare Global Industries proposal' assigned to you", email: "executive2@company.com", type: "task", read: false, createdAt: new Date() }
];

const dummyActivityLogs = [
  { userEmail: "admin@abc.com", action: "User Login", details: { ipAddress: "192.168.1.1" }, timestamp: new Date() },
  { userEmail: "executive1@company.com", action: "Lead Added", details: { leadName: "TechCorp Solutions" }, timestamp: new Date() },
  { userEmail: "executive2@company.com", action: "Task Completed", details: { taskTitle: "Prepare proposal" }, timestamp: new Date() },
  { userEmail: "executive3@company.com", action: "Follow-up Created", details: { customerName: "DataFlow Systems" }, timestamp: new Date() },
  { userEmail: "executive4@company.com", action: "Ticket Resolved", details: { ticketTitle: "Database Backup Issue" }, timestamp: new Date() }
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const database = client.db("CRMDB");
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await database.collection("users").deleteMany({});
    await database.collection("leads").deleteMany({});
    await database.collection("task").deleteMany({});
    await database.collection("followup").deleteMany({});
    await database.collection("ticket").deleteMany({});
    await database.collection("reviews").deleteMany({});
    await database.collection("notifications").deleteMany({});
    await database.collection("activityLogs").deleteMany({});

    // Hash passwords for users
    console.log("Hashing passwords...");
    const usersWithHashedPasswords = [];
    for (const user of dummyUsers) {
      const hashedPassword = await hashPassword(user.password);
      usersWithHashedPasswords.push({
        ...user,
        password: hashedPassword
      });
    }

    // Insert dummy data
    console.log("Inserting dummy users with hashed passwords...");
    const userResult = await database.collection("users").insertMany(usersWithHashedPasswords);
    console.log(`Inserted ${userResult.insertedCount} users`);

    // Insert dummy employees
    console.log("Inserting dummy employees...");
    const employeeResult = await database.collection("employees").insertMany(dummyEmployees);
    console.log(`Inserted ${employeeResult.insertedCount} employees`);

    console.log("Inserting dummy leads...");
    const leadResult = await database.collection("leads").insertMany(dummyLeads);
    console.log(`Inserted ${leadResult.insertedCount} leads`);

    console.log("Inserting dummy tasks...");
    const taskResult = await database.collection("task").insertMany(dummyTasks);
    console.log(`Inserted ${taskResult.insertedCount} tasks`);

    console.log("Inserting dummy follow-ups...");
    const followUpResult = await database.collection("followup").insertMany(dummyFollowUps);
    console.log(`Inserted ${followUpResult.insertedCount} follow-ups`);

    console.log("Inserting dummy tickets...");
    const ticketResult = await database.collection("ticket").insertMany(dummyTickets);
    console.log(`Inserted ${ticketResult.insertedCount} tickets`);

    console.log("Inserting dummy reviews...");
    const reviewResult = await database.collection("reviews").insertMany(dummyReviews);
    console.log(`Inserted ${reviewResult.insertedCount} reviews`);

    console.log("Inserting dummy notifications...");
    const notificationResult = await database.collection("notifications").insertMany(dummyNotifications);
    console.log(`Inserted ${notificationResult.insertedCount} notifications`);

    console.log("Inserting dummy activity logs...");
    const activityLogResult = await database.collection("activityLogs").insertMany(dummyActivityLogs);
    console.log(`Inserted ${activityLogResult.insertedCount} activity logs`);

    console.log("✅ Database seeded successfully!");
    console.log(`Total records inserted: ${userResult.insertedCount + leadResult.insertedCount + taskResult.insertedCount + followUpResult.insertedCount + ticketResult.insertedCount + reviewResult.insertedCount + notificationResult.insertedCount + activityLogResult.insertedCount}`);

    // Display login credentials (only for users, not employees)
    console.log("\n🔐 LOGIN CREDENTIALS:");
    console.log("=====================");
    dummyUsers.forEach(user => {
      console.log(`\n👤 ${user.name} (${user.role})`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password: ${user.password}`);
    });

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
    console.log("\nDatabase connection closed.");
  }
}

// Run the seeding function
seedDatabase(); 
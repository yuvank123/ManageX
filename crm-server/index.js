const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const stripe = process.env.PAYMENT_KEY ? require("stripe")(process.env.PAYMENT_KEY) : null;
const bcrypt = require("bcryptjs");

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0gbjyme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Declare collection variables globally
let userCollection;
let taskCollection;
let leadCollection;
let followUpCollection;
let ticketCollection;
let reviewCollection;
let notificationCollection;
let activityLogCollection;

// Mapping functions to ensure all required fields are present
const mapLead = lead => ({
  ...lead,
  customerName: lead.customerName || lead.name || '',
  name: lead.customerName || lead.name || '',
  leadEmail: lead.leadEmail || lead.email || '',
  email: lead.leadEmail || lead.email || '',
  phone: lead.phone || '',
  product: lead.product || '',
  status: lead.status || 'New',
  expectedDate: lead.expectedDate || '',
  notes: lead.notes || '',
  myEmail: lead.myEmail || ''
});
const mapTicket = ticket => ({
  ...ticket,
  customerEmail: ticket.customerEmail || ticket.executiveEmail || ticket.email || '',
  category: ticket.category || ticket.title || '',
  message: ticket.message || ticket.description || '',
  priority: ticket.priority || '',
  status: ticket.status || '',
});
const mapFollowup = fu => ({
  ...fu,
  leadEmail: fu.leadEmail || fu.email || '',
  email: fu.leadEmail || fu.email || '',
  customerName: fu.customerName || '',
  followUpDate: fu.followUpDate || '',
  time: fu.time || '',
  remarks: fu.remarks || '',
  status: fu.status || 'Pending',
  myEmail: fu.myEmail || ''
});
const mapTask = task => ({
  ...task,
  title: task.title || '',
  description: task.description || '',
  deadline: task.deadline || '',
  status: task.status || '',
});

// --- Database Connection Function ---
async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    try {
      console.log("Attempting to connect to MongoDB with URI:", uri.replace(/:[^:@]*@/, ':****@'));
      await client.connect();
      console.log("Connected to MongoDB!");
      const database = client.db("CRMDB");
      userCollection = database.collection("users");
      taskCollection = database.collection("task");
      leadCollection = database.collection("leads");
      followUpCollection = database.collection("followup");
      ticketCollection = database.collection("ticket");
      reviewCollection = database.collection("reviews");
      notificationCollection = database.collection("notifications");
      activityLogCollection = database.collection("activityLogs");
      console.log("All collections initialized successfully!");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      console.error("Connection details:", {
        host: uri.split('@')[1]?.split('/')[0],
        database: "CRMDB",
        collections: ["users", "task", "leads", "followup", "ticket", "reviews", "notifications", "activityLogs"]
      });
      throw error;
    }
  }
}

// Call connectDB once when the module loads
connectDB().catch((error) => {
  console.error("Initial MongoDB connection failed:", error);
});

// Helper function to log activities
const logActivity = async (userEmail, action, details = {}) => {
  try {
    // Ensure activityLogCollection is initialized before use
    if (!activityLogCollection) {
      await connectDB(); // Attempt to connect if not already
    }
    if (activityLogCollection) {
      await activityLogCollection.insertOne({
        timestamp: new Date(),
        userEmail,
        action,
        details,
      });
    } else {
      console.warn("activityLogCollection not initialized. Skipping activity log.");
    }
  } catch (logError) {
    console.error("Failed to log activity:", logError);
  }
};

// --- Robust CORS Setup for Development and Production ---
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser());
app.use(express.json());

// JWT Verification Middleware
let varifyToken = (req, res, next) => {
  let token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized token" });
  }
  jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized token" });
    }
    req.user = decoded;
    next();
  });
};

// Middleware to verify Admin role
let verifyAdmin = async (req, res, next) => {
  try {
    if (!userCollection) {
      await connectDB(); // Ensure collection is initialized
    }
    const email = req.user.email;
    const user = await userCollection.findOne({ email });
    const isAdmin = user?.role === 'admin';
    if (!isAdmin) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    logActivity(email, 'Admin Access', { path: req.originalUrl });
    next();
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    res.status(500).send({ message: "Internal server error during admin verification" });
  }
};

// Middleware to verify Executive role
let verifyExecutive = async (req, res, next) => {
  try {
    if (!userCollection) {
      await connectDB(); // Ensure collection is initialized
    }
    const email = req.user.email;
    const user = await userCollection.findOne({ email });
    const isExecutive = user?.role === 'executives';
    if (!isExecutive) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    logActivity(email, 'Executive Access', { path: req.originalUrl });
    next();
  } catch (error) {
    console.error("Error in verifyExecutive middleware:", error);
    res.status(500).send({ message: "Internal server error during executive verification" });
  }
};

// --- API Endpoints ---

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", async (req, res) => {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await connectDB();
    }
    const database = client.db("CRMDB");
    const collections = await database.listCollections().toArray();
    res.json({
      status: "healthy",
      database: "connected",
      collections: collections.map(c => c.name),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

app.post("/jwt", async (req, res) => {
  try {
    let userData = req.body;
    let token = jwt.sign(userData, process.env.JWT_Secret, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
      .send({ success: true });
    logActivity(userData.email, 'User Login', { ipAddress: req.ip });
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).send({ message: "Failed to generate token" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  })
    .send({ success: true });
});

app.post("/api/users/google", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    const { email, name, photoURL, uid } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      await userCollection.updateOne(
        { email },
        {
          $set: {
            name: name || existingUser.name,
            user_photo: photoURL || existingUser.user_photo,
            uid: uid,
            lastLogin: new Date()
          }
        }
      );
      console.log('Google user updated:', email);
    } else {
      const newUser = {
        email,
        name: name || email,
        user_photo: photoURL || null,
        uid: uid,
        role: 'executives',
        createdAt: new Date(),
        lastLogin: new Date()
      };
      await userCollection.insertOne(newUser);
      console.log('New Google user created:', email);
    }
    res.send({ success: true, message: "User processed successfully" });
  } catch (error) {
    console.error("Error processing Google user:", error);
    res.status(500).send({ message: "Error processing user" });
  }
});

app.get("/users/admin/:email", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    let email = req.params.email;
    let user = await userCollection.findOne({ email });
    let admin = user?.role === "admin";
    res.send({ admin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/users/executive/:email", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    let email = req.params.email;
    let user = await userCollection.findOne({ email });
    let executive = user?.role === "executives";
    res.send({ executive });
  } catch (error) {
    console.error("Error checking executive status:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/userCount", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    let result = await userCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/resolveTicket", async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    let filter = { status: "Resolved" };
    let result = await ticketCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching resolved tickets:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/myreview/:email", async (req, res) => {
  try {
    if (!reviewCollection) await connectDB();
    let email = req.params.email;
    let filter = { email };
    let result = await reviewCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/myfollowup/:email", async (req, res) => {
  try {
    if (!followUpCollection) await connectDB();
    let myEmail = req.params.email;
    let filter = { myEmail };
    let result = await followUpCollection.find(filter).toArray();
    res.send(result.map(mapFollowup));
  } catch (error) {
    console.error("Error fetching user followups:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/myLead/:email", async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    let myEmail = req.params.email;
    let filter = { myEmail };
    let result = await leadCollection.find(filter).toArray();
    res.send(result.map(mapLead));
  } catch (error) {
    console.error("Error fetching user leads:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/myTask/:email", async (req, res) => {
  try {
    if (!taskCollection) await connectDB();
    let email = req.params.email;
    let filter = { email };
    let result = await taskCollection.find(filter).toArray();
    res.send(result.map(mapTask));
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    if (!taskCollection) await connectDB();
    let result = await taskCollection.find().toArray();
    res.send(result.map(mapTask));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    if (!taskCollection) await connectDB();
    const newTask = req.body;
    const result = await taskCollection.insertOne(newTask);
    res.send({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});


app.get("/manageLead", async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    const result = await leadCollection.find().toArray();
    res.send(result.map(mapLead));
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    let result = await leadCollection.find().toArray();
    res.send(result.map(mapLead));
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/executive/followup-reminders", async (req, res) => {
  try {
    if (!followUpCollection) await connectDB();
    const today = new Date().toISOString().split('T')[0];
    const pending = await followUpCollection.find({
      followUpDate: { $lte: today },
      status: { $ne: 'Completed' }
    }).toArray();
    const mappedPending = pending.map(fu => ({
      ...fu,
      email: fu.leadEmail || fu.email || '',
    }));
    res.send({ pending: mappedPending });
  } catch (error) {
    console.error("Error fetching followup reminders:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    let data = req.body;
    let result = await leadCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    console.error("Error adding lead:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/adminCount", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    let query = { role: "admin" };
    let result = await userCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching admin count:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/employeeCount", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    let query = { role: "executives" };
    let result = await userCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching employee count:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/paymentDetails", async (req, res) => {
  try {
    res.send([]);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/api/review", async (req, res) => {
  try {
    if (!reviewCollection) await connectDB();
    let result = await reviewCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    if (!reviewCollection) await connectDB();
    let formData = req.body;
    let result = await reviewCollection.insertOne(formData);
    res.send(result);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/alltickets", async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    let result = await ticketCollection.find().toArray();
    res.send(result.map(mapTicket));
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.patch("/api/tickets/:id", async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    const ticketId = req.params.id;
    const { status } = req.body;
    const validStatuses = ['Open', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ error: "Invalid status value" });
    }
    const result = await ticketCollection.updateOne(
      { _id: new ObjectId(ticketId) },
      { $set: { status } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Task not found or already has this status" });
    }
    res.send({ message: "Status updated successfully!", result });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.get("/manageFollowup", async (req, res) => {
  try {
    if (!followUpCollection) await connectDB();
    const result = await followUpCollection.find().toArray();
    res.send(result.map(mapFollowup));
  } catch (error) {
    console.error("Error fetching followups:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/api/followups", async (req, res) => {
  try {
    if (!followUpCollection) await connectDB(); // connect if not already

    const followUpData = req.body;

    // Optional: Basic validation
    if (!followUpData.email || !followUpData.followUpDate || !followUpData.time) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    // Insert into DB
    const result = await followUpCollection.insertOne({
      ...followUpData,
      createdAt: new Date(),
    });

    res.status(201).send({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding follow-up:", error);
    res.status(500).send({ error: "Internal server error" });
  }
})

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    if (!taskCollection) await connectDB();
    let idx = req.params.id;
    let filter = { _id: new ObjectId(idx) };
    const result = await taskCollection.deleteOne(filter);
    res.send(result);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/myaddedticket/:email", async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    let executiveEmail = req.params.email;
    let filter = { executiveEmail };
    let result = await ticketCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching added tickets:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.delete("/api/tickets/:id", async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await ticketCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/api/tickets", async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    let data = req.body;
    let result = await ticketCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    console.error("Error adding ticket:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/api/dashboard/followups", async (req, res) => {
  try {
    const followUp = req.body;

    // Validation (optional but helpful)
    if (!followUp.email || !followUp.time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await db.collection("followups").insertOne(followUp); // change `db` accordingly

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding follow-up:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.delete("/api/followups/:id", async (req, res) => {
  try {
    if (!followUpCollection) await connectDB();
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await followUpCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting follow-up:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.patch("/api/leads/:id", async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    const { id } = req.params;
    const { status } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: { status },
      $currentDate: { updatedAt: true },
    };
    const result = await leadCollection.updateOne(filter, updateDoc);
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Lead not found or status is same" });
    }
    res.send({ message: "Lead status updated successfully", result });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await leadCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    // Ensure DB connection
    if (!taskCollection) await connectDB();

    const { id } = req.params;
    const { status } = req.body;

    // Validate inputs
    if (!id || !status) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: { status },
      $currentDate: { updatedAt: true },
    };

    const result = await taskCollection.updateOne(filter, updateDoc);

    if (result.modifiedCount === 0) {
      return res.status(404).send({
        message: "Task not found or already has this status",
        modifiedCount: 0,
      });
    }

    // ✅ Return modifiedCount directly for frontend to handle it
    res.send({
      message: "Task status updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    if (!taskCollection) await connectDB();
    const { id } = req.params;
    const updatedTask = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: updatedTask };
    const result = await taskCollection.updateOne(filter, updateDoc);
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Task not found or no changes made" });
    }
    res.send({ message: "Task updated successfully", result });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.get("/specificTask/:id", async (req, res) => {
  try {
    if (!taskCollection) await connectDB();
    const { id } = req.params;
    const task = await taskCollection.findOne({ _id: new ObjectId(id) });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.send(task);
  } catch (error) {
    console.error("Error fetching specific task:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// ADMIN ROUTES
app.get("/admin/leads", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    const { executiveEmail, product, status, minExpectedClosureDate, maxExpectedClosureDate } = req.query;

    let filter = {};
    if (executiveEmail) filter.myEmail = executiveEmail;
    if (product) filter.product = product;
    if (status) filter.status = status;
    if (minExpectedClosureDate || maxExpectedClosureDate) {
      filter.expectedDate = {};
      if (minExpectedClosureDate) filter.expectedDate.$gte = minExpectedClosureDate;
      if (maxExpectedClosureDate) filter.expectedDate.$lte = maxExpectedClosureDate;
    }

    const result = await leadCollection.find(filter).toArray();
    res.send(result.map(mapLead));
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/admin/performance-metrics", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!userCollection || !leadCollection || !taskCollection || !reviewCollection) await connectDB();
    const totalUsers = await userCollection.countDocuments();
    const totalAdmins = await userCollection.countDocuments({ role: 'admin' });
    const totalExecutives = await userCollection.countDocuments({ role: 'executives' });
    const totalEmployeesUsers = await userCollection.countDocuments({ role: 'employee' });
    const employeeCollection = client.db("CRMDB").collection("employees");
    const totalEmployeesCollection = await employeeCollection.countDocuments();
    // Set total employees to 90 as per requirement
    const totalEmployees = 90;
    const totalLeads = await leadCollection.countDocuments();
    const closedLeads = await leadCollection.countDocuments({ status: 'Closed' });
    const totalTasks = await taskCollection.countDocuments();
    const completedTasks = await taskCollection.countDocuments({ status: 'complete' });
    const totalReviews = await reviewCollection.countDocuments();
    const metrics = {
      users: {
        total: totalUsers,
        admins: totalAdmins,
        executives: totalExecutives,
        employees: totalEmployees,
      },
      leads: {
        total: totalLeads,
        closed: closedLeads,
        conversionRate: totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(2) : 0,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
      },
      reviews: {
        total: totalReviews,
      },
    };
    res.send(metrics);
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    res.status(500).send({ message: "Failed to fetch performance metrics", error: error.message });
  }
});

app.get("/admin/lead-analytics", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    const { period } = req.query;
    let startDate;
    const endDate = new Date();
    switch (period) {
      case 'week':
        startDate = new Date(endDate.setDate(endDate.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(endDate.setMonth(endDate.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(endDate.setFullYear(endDate.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }
    const leads = await leadCollection.find({
      createdAt: { $gte: startDate }
    }).toArray();
    const statusDistribution = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    const productDistribution = leads.reduce((acc, lead) => {
      acc[lead.product] = (acc[lead.product] || 0) + 1;
      return acc;
    }, {});
    res.send({ statusDistribution, productDistribution });
  } catch (error) {
    console.error("Error fetching lead analytics:", error);
    res.status(500).send({ message: "Failed to fetch lead analytics", error: error.message });
  }
});

app.get("/admin/dashboard-summary", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!leadCollection || !followUpCollection || !ticketCollection) await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const todayLeads = await leadCollection.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    const todayFollowUps = await followUpCollection.countDocuments({
      followUpDate: { $gte: today.toISOString().split('T')[0], $lt: tomorrow.toISOString().split('T')[0] }
    });
    const openTickets = await ticketCollection.countDocuments({
      status: { $in: ['Open', 'In Progress'] }
    });
    const overdueLeads = await leadCollection.countDocuments({
      expectedDate: { $lt: today.toISOString().split('T')[0] },
      status: { $nin: ['Closed'] }
    });
    const recentActivities = {
      leads: await leadCollection.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
      followUps: await followUpCollection.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
      tickets: await ticketCollection.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    };
    res.send({
      today: {
        leads: todayLeads,
        followUps: todayFollowUps,
        openTickets: openTickets,
        overdueLeads: overdueLeads,
      },
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).send({ message: "Failed to fetch dashboard summary", error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    const users = await userCollection.find({}).toArray();
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Failed to fetch users", error: error.message });
  }
});

app.get("/users/:email", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    const email = req.params.email;
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).send({ message: "Failed to fetch user", error: error.message });
  }
});

app.put("/users/:email", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    const email = req.params.email;
    const updatedUser = req.body;
    const result = await userCollection.updateOne(
      { email },
      { $set: updatedUser }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'User not found or no changes made' });
    }
    res.send({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Failed to update user", error: error.message });
  }
});

app.delete("/users/:email", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    const email = req.params.email;
    const result = await userCollection.deleteOne({ email });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Failed to delete user", error: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    const newUser = req.body;
    // Upsert user by email, but do not overwrite admin role
    const existingUser = await userCollection.findOne({ email: newUser.email });
    if (existingUser) {
      // If user is already admin, do not overwrite role
      if (existingUser.role === 'admin') {
        return res.status(200).send({ message: 'User is already admin, not overwritten.' });
      }
      // Otherwise, update user info and role
      await userCollection.updateOne(
        { email: newUser.email },
        { $set: { ...newUser } }
      );
      return res.status(200).send({ message: 'User updated successfully' });
    } else {
      // Insert new user
      const result = await userCollection.insertOne(newUser);
      return res.status(201).send({ message: 'User added successfully', userId: result.insertedId });
    }
  } catch (error) {
    console.error("Error adding/updating user:", error);
    res.status(500).send({ message: "Failed to add/update user", error: error.message });
  }
});

app.post("/admin/add-user", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!userCollection) await connectDB();
    const userData = req.body;
    const { email, password, role } = userData;
    if (!email || !password || !role) {
      return res.status(400).send({ message: 'Email, password, and role are required.' });
    }
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: 'User with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userCollection.insertOne({
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).send({ message: 'User added successfully', userId: result.insertedId });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send({ message: "Failed to add user", error: error.message });
  }
});

// Admin specific APIs
app.get("/admin/overdue-followups", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!followUpCollection) await connectDB();
    const today = new Date().toISOString().split('T')[0];
    const overdueFollowups = await followUpCollection.find({
      followUpDate: { $lt: today },
      status: { $ne: 'Completed' }
    }).toArray();
    res.send(overdueFollowups);
  } catch (error) {
    console.error("Error fetching overdue followups:", error);
    res.status(500).send({ message: "Failed to fetch overdue followups", error: error.message });
  }
});

app.get("/admin/overdue-leads", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!leadCollection) await connectDB();
    const today = new Date().toISOString().split('T')[0];
    const overdue = await leadCollection.find({
      expectedDate: { $lt: today },
      status: { $nin: ['Closed', 'Converted'] }
    }).toArray();
    const stagnantThreshold = new Date();
    stagnantThreshold.setDate(stagnantThreshold.getDate() - 30);
    const stagnant = await leadCollection.find({
      updatedAt: { $lt: stagnantThreshold },
      status: { $nin: ['Closed', 'Converted'] }
    }).toArray();
    res.send({ overdue, stagnant });
  } catch (error) {
    console.error("Error fetching overdue/stagnant leads:", error);
    res.status(500).send({ message: "Failed to fetch overdue/stagnant leads", error: error.message });
  }
});

app.patch("/admin/tickets/:id/assign", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    const ticketId = req.params.id;
    const { assignedToEmail } = req.body;
    if (!assignedToEmail) {
      return res.status(400).send({ message: "assignedToEmail is required" });
    }
    const result = await ticketCollection.updateOne(
      { _id: new ObjectId(ticketId) },
      { $set: { assignedToEmail, status: 'In Progress', assignedAt: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Ticket not found or already assigned to this user" });
    }
    res.send({ message: "Ticket assigned successfully", result });
  } catch (error) {
    console.error("Error assigning ticket:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.get("/admin/ticket-tat", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    const tickets = await ticketCollection.find({ status: 'Resolved' }).toArray();
    let totalTAT = 0;
    let count = 0;
    tickets.forEach(ticket => {
      if (ticket.createdAt && ticket.resolvedAt) {
        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.resolvedAt);
        const tatMs = resolved.getTime() - created.getTime();
        totalTAT += tatMs;
        count++;
      }
    });
    const averageTATMs = count > 0 ? totalTAT / count : 0;
    const averageTATDays = averageTATMs / (1000 * 60 * 60 * 24);
    res.send({ averageTATDays: averageTATDays.toFixed(2) });
  } catch (error) {
    console.error("Error calculating average TAT:", error);
    res.status(500).send({ message: "Failed to calculate average TAT", error: error.message });
  }
});

app.get("/admin/high-priority-tickets", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!ticketCollection) await connectDB();
    const highPriorityTickets = await ticketCollection.find({
      priority: 'High',
      status: { $in: ['Open', 'In Progress'] }
    }).toArray();
    res.send(highPriorityTickets);
  } catch (error) {
    console.error("Error fetching high priority tickets:", error);
    res.status(500).send({ message: "Failed to fetch high priority tickets", error: error.message });
  }
});

// EXECUTIVE ROUTES
app.get("/executive/performance-metrics", varifyToken, verifyExecutive, async (req, res) => {
  try {
    if (!userCollection) await connectDB();

    // Get employee count from both collections
    const employeeUsers = await userCollection.countDocuments({ role: "employee" });
    const employeesCount = await client.db("CRMDB").collection("employees").countDocuments();
    const totalEmployees = 90; // Set to 90 as per requirement

    // Get task metrics
    const totalTasks = await taskCollection.countDocuments({ assignedTo: req.user.email });
    const completedTasks = await taskCollection.countDocuments({ assignedTo: req.user.email, status: 'complete' });

    // Get lead metrics
    const totalLeads = await leadCollection.countDocuments({ assignedTo: req.user.email });
    const closedLeads = await leadCollection.countDocuments({ assignedTo: req.user.email, status: 'Closed' });

    const metrics = {
      users: {
        employees: totalEmployees
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0
      },
      leads: {
        total: totalLeads,
        closed: closedLeads,
        conversionRate: totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(2) : 0
      }
    };

    res.send(metrics);
  } catch (error) {
    console.error("Error fetching executive metrics:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Notification System: Create notification
app.post("/api/notifications", varifyToken, async (req, res) => {
  try {
    if (!notificationCollection) await connectDB();
    const { recipientEmail, type, title, message, relatedId, priority } = req.body;
    const senderEmail = req.user.email;
    const notification = {
      recipientEmail,
      senderEmail,
      type,
      title,
      message,
      relatedId,
      priority: priority || 'normal',
      status: 'unread',
      createdAt: new Date(),
      readAt: null
    };
    const result = await notificationCollection.insertOne(notification);
    res.status(201).send({ message: "Notification created successfully", notificationId: result.insertedId });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).send({ message: "Failed to create notification", error: error.message });
  }
});

// Notification System: Get user notifications
app.get("/api/notifications", varifyToken, async (req, res) => {
  try {
    if (!notificationCollection) await connectDB();
    const userEmail = req.user.email;
    const { status, type, limit = 50 } = req.query;
    let query = { recipientEmail: userEmail };
    if (status) query.status = status;
    if (type) query.type = type;
    const notifications = await notificationCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .toArray();
    res.send(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({ message: "Failed to fetch notifications", error: error.message });
  }
});

// Notification System: Mark notification as read
app.patch("/api/notifications/:id/read", varifyToken, async (req, res) => {
  try {
    if (!notificationCollection) await connectDB();
    const notificationId = req.params.id;
    const userEmail = req.user.email;
    const result = await notificationCollection.updateOne(
      { _id: new ObjectId(notificationId), recipientEmail: userEmail },
      { $set: { status: 'read', readAt: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Notification not found" });
    }
    res.send({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ message: "Failed to mark notification as read", error: error.message });
  }
});

// Notification System: Mark all notifications as read
app.patch("/api/notifications/read-all", varifyToken, async (req, res) => {
  try {
    if (!notificationCollection) await connectDB();
    const userEmail = req.user.email;
    const result = await notificationCollection.updateMany(
      { recipientEmail: userEmail, status: 'unread' },
      { $set: { status: 'read', readAt: new Date() } }
    );
    res.send({ message: `${result.modifiedCount} notifications marked as read` });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).send({ message: "Failed to mark notifications as read", error: error.message });
  }
});

// Notification System: Get unread count
app.get("/api/notifications/unread-count", varifyToken, async (req, res) => {
  try {
    if (!notificationCollection) await connectDB();
    const userEmail = req.user.email;
    const count = await notificationCollection.countDocuments({
      recipientEmail: userEmail,
      status: 'unread'
    });
    res.send({ unreadCount: count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).send({ message: "Failed to fetch unread count", error: error.message });
  }
});

// Admin: Get all notifications (for admin dashboard)
app.get("/admin/notifications", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!notificationCollection) await connectDB();
    const { recipientEmail, type, status, limit = 100 } = req.query;
    let query = {};
    if (recipientEmail) query.recipientEmail = recipientEmail;
    if (type) query.type = type;
    if (status) query.status = status;
    const notifications = await notificationCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .toArray();
    res.send(notifications);
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    res.status(500).send({ message: "Failed to fetch notifications", error: error.message });
  }
});

// Admin: Get all activity logs
app.get("/admin/activity-logs", varifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!activityLogCollection) await connectDB();
    const logs = await activityLogCollection.find({}).sort({ timestamp: -1 }).toArray();
    res.send(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).send({ message: "Failed to fetch activity logs", error: error.message });
  }
});

// --- 404 Handler ---
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;

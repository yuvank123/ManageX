const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const stripe = require("stripe")(process.env.PAYMENT_KEY);
const bcrypt = require("bcryptjs");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
// app.use(cors());

// console.log(process.env.Sending_API_Key)

// CRSWebsite
// OeJDkYxtKe4CKQiE

// payroll
// jtNyh3mXohIlorwR

let varifyToken = (req, res, next) => {
  // console.log("middleware running")

  let token = req.cookies?.token;
  // console.log(token)
  // console.log(token)

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

// Middleware to verify Admin role - will be defined inside run() function
let verifyAdmin;

// Middleware to verify Executive role - already defined inside run() function
let verifyExecutive;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "CRM Server is running", 
    timestamp: new Date().toISOString() 
  });
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0gbjyme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("CRMDB");
    const userCollection = database.collection("users");
    const taskCollection = database.collection("task");
    const leadCollection = database.collection("leads");
    const followUpCollection = database.collection("followup");
    const ticketCollection = database.collection("ticket");
    const reviewCollection = database.collection("reviews");
    const notificationCollection = database.collection("notifications");
    const activityLogCollection = database.collection("activityLogs");
    
    // Helper function to log activities
    const logActivity = async (userEmail, action, details = {}) => {
      try {
        await activityLogCollection.insertOne({
          timestamp: new Date(),
          userEmail,
          action,
          details,
        });
      } catch (logError) {
        console.error("Failed to log activity:", logError);
      }
    };

    // Define verifyAdmin middleware now that userCollection is available
    verifyAdmin = async (req, res, next) => {
      const email = req.user.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === 'admin';
      if (!isAdmin) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      // Log admin access to activity logs
      logActivity(email, 'Admin Access', { path: req.originalUrl });
      next();
    };

    // Define verifyExecutive middleware now that userCollection is available
    verifyExecutive = async (req, res, next) => {
      const email = req.user.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isExecutive = user?.role === 'executives';
      if (!isExecutive) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      // Log executive access to activity logs
      logActivity(email, 'Executive Access', { path: req.originalUrl });
      next();
    };

    app.post("/jwt", async (req, res) => {
      let userData = req.body;

      let token = jwt.sign(userData, process.env.JWT_Secret, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          // secure:false  ,    // Prevent JavaScript access to the cookie
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Send cookie over HTTPS only
        })
        .send({ success: true });

        // Log user login activity
        logActivity(userData.email, 'User Login', { ipAddress: req.ip });
    });

    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          // secure:false,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Use true in production with HTTPS
        })
        .send({ success: true });
    });

    app.get("/adminCount",async(req,res)=>{

      let query={role:"admin"}
      let result=await userCollection.find(query).toArray()
      res.send(result)
    })
    app.get("/employeeCount",async(req,res)=>{

      let query={role:"executives"}
      let result=await userCollection.find(query).toArray()
      res.send(result)
    })
    app.get("/userCount",async(req,res)=>{

      
      let result=await userCollection.find().toArray()
      res.send(result)
    })

      app.get("/resolveTicket",async(req,res)=>{

      

      let filter={status:"Resolved"}

      let result=await ticketCollection.find(filter).toArray()

      res.send(result)
    })

       app.get("/myreview/:email",async(req,res)=>{

      let email=req.params.email

      let filter={email}

      let result=await reviewCollection.find(filter).toArray()

      res.send(result)
    })


     app.get("/myfollowup/:email",async(req,res)=>{

      let myEmail=req.params.email

      let filter={myEmail}

      let result=await followUpCollection.find(filter).toArray()

      res.send(result)
    })


     app.get("/myLead/:email",async(req,res)=>{

      let myEmail=req.params.email

      let filter={myEmail}

      let result=await leadCollection.find(filter).toArray()

      res.send(result)
    })

    app.get("/api/review",async(req,res)=>{

     let result=await reviewCollection.find().toArray()
     res.send(result)
    })


    app.post("/api/reviews",async(req,res)=>{


      let formData=req.body

      //  console.log(formData)
      let result= await reviewCollection.insertOne(formData)

      res.send(result)



    })

     app.get("/alltickets",async(req,res)=>{

    let result=await ticketCollection.find().toArray()
    res.send(result)
  })

  app.patch("/api/tickets/:id", async (req, res) => {
  try {
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

    res.send({ message: "Status updated successfully", result });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});


    app.get("/manageFollowup",async(req,res)=>{

    let result=await followUpCollection.find().toArray()
    res.send(result)
  })




  app.get("/manageLead",async(req,res)=>{

    let result=await leadCollection.find().toArray()
    res.send(result)
  })

    app.delete("/api/tasks/:id", async (req, res) => {
      let idx = req.params.id;

      let filter = { _id: new ObjectId(idx) };

      const result = await taskCollection.deleteOne(filter);
      res.send(result);
    });

    app.get("/mytask/:email", async (req, res) => {
      let email = req.params.email;

      let filter = { email };

      let result = await taskCollection.find(filter).toArray();
      res.send(result);
    });

    app.patch("/api/tasks/:id", async (req, res) => {
      const { status } = req.body;
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status } }
      );
      res.send(result);
    });

      app.get("/myaddedticket/:email", async (req, res) => {
      let executiveEmail = req.params.email;

      let filter = { executiveEmail };

      let result = await ticketCollection.find(filter).toArray();
      res.send(result);
    });

     app.delete("/api/tickets/:id", async (req, res) => {
      const { id } = req.params;

    
        const query = { _id: new ObjectId(id) };
        const result = await ticketCollection.deleteOne(query);
        res.send(result);
      
    });

     app.post("/api/tickets", async (req, res) => {
      let data = req.body;

      let result = await ticketCollection.insertOne(data);
      res.send(result);
    });
   
    app.patch("/api/followups/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status },
        };

        const result = await followUpCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating follow-up status:", error);
        res.status(500).send({ error: "Failed to update status" });
      }
    });

   
    app.delete("/api/followups/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const query = { _id: new ObjectId(id) };
        const result = await followUpCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting follow-up:", error);
        res.status(500).send({ error: "Failed to delete follow-up" });
      }
    });

    app.get("/myfollowUp/:email", async (req, res) => {
      let myEmail = req.params.email;

      let filter = { myEmail };

      let result = await followUpCollection.find(filter).toArray();
      res.send(result);
    });

    app.post("/api/followups", async (req, res) => {
      let data = req.body;

      let result = await followUpCollection.insertOne(data);
      res.send(result);
    });

    app.patch("/api/leads/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const result = await leadCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      res.send(result);
    });

    app.delete("/api/leads/:id", async (req, res) => {
      const id = req.params.id;
      const result = await leadCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/myleads/:email", async (req, res) => {
      let myEmail = req.params.email;

      let filter = { myEmail };

      let result = await leadCollection.find(filter).toArray();
      res.send(result);
    });

    // Admin only: Get all leads with filters
    app.get("/admin/leads", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const { executiveEmail, product, status, minExpectedClosureDate, maxExpectedClosureDate } = req.query;
        let query = {};

        if (executiveEmail) {
          query.myEmail = executiveEmail;
        }
        if (product) {
          query.product = product;
        }
        if (status) {
          query.status = status;
        }

        if (minExpectedClosureDate || maxExpectedClosureDate) {
          query.expectedDate = {};
          if (minExpectedClosureDate) {
            query.expectedDate.$gte = minExpectedClosureDate;
          }
          if (maxExpectedClosureDate) {
            query.expectedDate.$lte = maxExpectedClosureDate;
          }
        }

        const result = await leadCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching filtered leads:", error);
        res.status(500).send({ message: "Failed to fetch leads", error: error.message });
      }
    });

    // Admin only: Get executive performance metrics
    app.get("/admin/performance-metrics", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const { executiveEmail, startDate, endDate } = req.query;
        
        // Get all executives
        const executives = await userCollection.find({ role: 'executives' }).toArray();
        
        const metrics = [];
        
        for (const executive of executives) {
          if (executiveEmail && executive.email !== executiveEmail) continue;
          
          // Get leads for this executive
          const leadQuery = { myEmail: executive.email };
          if (startDate || endDate) {
            leadQuery.createdAt = {};
            if (startDate) leadQuery.createdAt.$gte = new Date(startDate);
            if (endDate) leadQuery.createdAt.$lte = new Date(endDate);
          }
          
          const leads = await leadCollection.find(leadQuery).toArray();
          
          // Calculate metrics
          const totalLeads = leads.length;
          const closedLeads = leads.filter(lead => lead.status === 'Closed').length;
          const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(2) : 0;
          
          // Calculate average time to close (for closed leads)
          let avgTimeToClose = 0;
          if (closedLeads > 0) {
            const closedLeadTimes = leads
              .filter(lead => lead.status === 'Closed' && lead.closedAt && lead.createdAt)
              .map(lead => {
                const created = new Date(lead.createdAt);
                const closed = new Date(lead.closedAt);
                return (closed - created) / (1000 * 60 * 60 * 24); // Days
              });
            
            if (closedLeadTimes.length > 0) {
              avgTimeToClose = (closedLeadTimes.reduce((a, b) => a + b, 0) / closedLeadTimes.length).toFixed(1);
            }
          }
          
          // Get follow-ups for this executive
          const followUps = await followUpCollection.find({ myEmail: executive.email }).toArray();
          const completedFollowUps = followUps.filter(fu => fu.status === 'Completed').length;
          const totalFollowUps = followUps.length;
          
          // Get tickets for this executive
          const tickets = await ticketCollection.find({ executiveEmail: executive.email }).toArray();
          const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved').length;
          const totalTickets = tickets.length;
          
          metrics.push({
            executive: {
              email: executive.email,
              name: executive.name,
              phone: executive.phone
            },
            leads: {
              total: totalLeads,
              closed: closedLeads,
              conversionRate: parseFloat(conversionRate),
              avgTimeToClose: parseFloat(avgTimeToClose)
            },
            followUps: {
              total: totalFollowUps,
              completed: completedFollowUps,
              completionRate: totalFollowUps > 0 ? ((completedFollowUps / totalFollowUps) * 100).toFixed(2) : 0
            },
            tickets: {
              total: totalTickets,
              resolved: resolvedTickets,
              resolutionRate: totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(2) : 0
            }
          });
        }
        
        res.send(metrics);
      } catch (error) {
        console.error("Error fetching performance metrics:", error);
        res.status(500).send({ message: "Failed to fetch performance metrics", error: error.message });
      }
    });

    // Admin only: Get lead analytics and trends
    app.get("/admin/lead-analytics", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const { period = '30' } = req.query; // Default to last 30 days
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(period));
        
        // Get all leads created in the period
        const leads = await leadCollection.find({
          createdAt: { $gte: daysAgo }
        }).toArray();
        
        // Lead status distribution
        const statusDistribution = {};
        leads.forEach(lead => {
          statusDistribution[lead.status] = (statusDistribution[lead.status] || 0) + 1;
        });
        
        // Product-wise distribution
        const productDistribution = {};
        leads.forEach(lead => {
          productDistribution[lead.product] = (productDistribution[lead.product] || 0) + 1;
        });
        
        // Executive-wise distribution
        const executiveDistribution = {};
        leads.forEach(lead => {
          executiveDistribution[lead.myEmail] = (executiveDistribution[lead.myEmail] || 0) + 1;
        });
        
        // Daily lead creation trend
        const dailyTrend = {};
        leads.forEach(lead => {
          const date = new Date(lead.createdAt).toISOString().split('T')[0];
          dailyTrend[date] = (dailyTrend[date] || 0) + 1;
        });
        
        // Lead aging analysis
        const now = new Date();
        const leadAging = {
          '0-7 days': 0,
          '8-15 days': 0,
          '16-30 days': 0,
          '31+ days': 0
        };
        
        leads.forEach(lead => {
          if (lead.status !== 'Closed') {
            const daysSinceCreation = Math.floor((now - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24));
            if (daysSinceCreation <= 7) leadAging['0-7 days']++;
            else if (daysSinceCreation <= 15) leadAging['8-15 days']++;
            else if (daysSinceCreation <= 30) leadAging['16-30 days']++;
            else leadAging['31+ days']++;
          }
        });
        
        res.send({
          period: parseInt(period),
          totalLeads: leads.length,
          statusDistribution,
          productDistribution,
          executiveDistribution,
          dailyTrend,
          leadAging
        });
      } catch (error) {
        console.error("Error fetching lead analytics:", error);
        res.status(500).send({ message: "Failed to fetch lead analytics", error: error.message });
      }
    });

    // Admin only: Get dashboard summary
    app.get("/admin/dashboard-summary", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Today's leads
        const todayLeads = await leadCollection.countDocuments({
          createdAt: { $gte: today }
        });
        
        // Today's follow-ups
        const todayFollowUps = await followUpCollection.countDocuments({
          followUpDate: {
            $gte: today.toISOString().split('T')[0]
          }
        });
        
        // Open tickets
        const openTickets = await ticketCollection.countDocuments({
          status: { $in: ['Open', 'In Progress'] }
        });
        
        // Overdue leads (past expected closure date)
        const overdueLeads = await leadCollection.countDocuments({
          status: { $ne: 'Closed' },
          expectedDate: { $lt: today.toISOString().split('T')[0] }
        });
        
        // Recent activities (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const recentLeads = await leadCollection.find({
          createdAt: { $gte: weekAgo }
        }).sort({ createdAt: -1 }).limit(5).toArray();
        
        const recentFollowUps = await followUpCollection.find({
          createdAt: { $gte: weekAgo }
        }).sort({ createdAt: -1 }).limit(5).toArray();
        
        const recentTickets = await ticketCollection.find({
          createdAt: { $gte: weekAgo }
        }).sort({ createdAt: -1 }).limit(5).toArray();
        
        res.send({
          today: {
            leads: todayLeads,
            followUps: todayFollowUps,
            openTickets: openTickets,
            overdueLeads: overdueLeads
          },
          recentActivities: {
            leads: recentLeads,
            followUps: recentFollowUps,
            tickets: recentTickets
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        res.status(500).send({ message: "Failed to fetch dashboard summary", error: error.message });
      }
    });

    app.put("/api/tasks/:id", async (req, res) => {
      let idx = req.params.id;

      let updateData = req.body;

      email = updateData.email;
      title = updateData.title;
      description = updateData.description;
      deadline = updateData.deadline;

      let filter = { _id: new ObjectId(idx) };

      const update = {
        $set: { email, title, description, deadline },
      };
      const options = { upsert: true };

      let result = await taskCollection.updateOne(filter, update, options);

      res.send(result);
    });

    app.get("/specificTask/:id", async (req, res) => {
      let idx = req.params.id;

      let filter = { _id: new ObjectId(idx) };

      let result = await taskCollection.findOne(filter);
      res.send(result);
    });

    app.get("/api/tasks", async (req, res) => {
      let result = await taskCollection.find().toArray();
      res.send(result);
    });

    app.post("/api/leads", async (req, res) => {
      let data = req.body;

      let result = await leadCollection.insertOne(data);
      res.send(result);
    });

    app.post("/api/tasks", async (req, res) => {
      let data = req.body;

      let result = await taskCollection.insertOne(data);
      res.send(result);
    });

    app.get("/users/employee/:email", async (req, res) => {
      let email = req.params.email;

      let query = { email };
      let user = await userCollection.findOne(query);

      let executives = false;
      if (user) {
        executives = user?.role === "executives";
      }

      res.send({ executives });
    });

    app.get("/users/admin/:email", async (req, res) => {
      let email = req.params.email;

      let query = { email };
      let user = await userCollection.findOne(query);

      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }

      res.send({ admin });
    });

    app.get("/users/executive/:email", async (req, res) => {
      let email = req.params.email;

      let query = { email };
      let user = await userCollection.findOne(query);

      let executive = false;
      if (user) {
        executive = user?.role === "executives";
      }

      res.send({ executive });
    });

    app.get("/users",async(req,res)=>{

      let result=await userCollection.find().toArray()

      res.send(result)
    })

    
app.patch("/api/users/:id", varifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, name, phone } = req.body;
    const requestingUserEmail = req.user.email;

    const requestingUser = await userCollection.findOne({ email: requestingUserEmail });

    let updateDoc = {};

    if (requestingUser?.role === 'admin') {
      // Admin can update role, name, and phone for any user
      if (role) updateDoc.role = role;
      if (name) updateDoc.name = name;
      if (phone) updateDoc.phone = phone;
    } else {
      // Non-admin users can only update their own name and phone
      // Ensure they are trying to update their own profile
      const userToUpdate = await userCollection.findOne({ _id: new ObjectId(userId) });
      if (!userToUpdate || userToUpdate.email !== requestingUserEmail) {
        return res.status(403).send({ message: "Forbidden access: You can only update your own profile." });
      }
      if (name) updateDoc.name = name;
      if (phone) updateDoc.phone = phone;
      // Explicitly prevent non-admins from changing roles
      if (role && userToUpdate.role !== role) {
        return res.status(403).send({ message: "Forbidden access: You cannot change your role." });
      }
    }

    if (Object.keys(updateDoc).length === 0) {
      return res.status(400).send({ message: "No valid fields provided for update." });
    }

    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateDoc }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "User not found or no changes made." });
    }

    res.send({ message: "User updated successfully", result });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({ error: "Something went wrong during profile update." });
  }
});


    app.post("/users", async (req, res) => {
      let users = req.body;
      // console.log(users)
      let email = users?.email;
      let query = { email };

      let existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.status(404).send({ message: "Users already existed" });
      }

      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    // Admin only: Add new user (Executive or Admin)
    app.post("/admin/add-user", varifyToken, verifyAdmin, async (req, res) => {
      const { email, password, role, name, phone } = req.body;

      if (!email || !password || !role || !name || !phone) {
        return res.status(400).send({ message: "All fields are required: email, password, role, name, phone" });
      }

      try {
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res.status(409).send({ message: "User with this email already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          email,
          password: hashedPassword,
          role,
          name,
          phone,
          createdAt: new Date(),
        };

        const result = await userCollection.insertOne(newUser);
        // TODO: Integrate nodemailer or similar for sending welcome message/credentials
        res.status(201).send({ message: "User added successfully", userId: result.insertedId });
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send({ message: "Failed to add user", error: error.message });
      }
    });

    // Executive: Get pending/missed follow-up reminders
    app.get("/executive/followup-reminders", varifyToken, verifyExecutive, async (req, res) => {
      try {
        const email = req.user.email;
        const today = new Date().toISOString().split('T')[0];
        // Pending: follow-ups scheduled for today or earlier, not completed
        const pending = await followUpCollection.find({
          myEmail: email,
          followUpDate: { $lte: today },
          status: { $ne: 'Completed' }
        }).toArray();
        res.send({ pending });
      } catch (error) {
        console.error("Error fetching follow-up reminders:", error);
        res.status(500).send({ message: "Failed to fetch follow-up reminders", error: error.message });
      }
    });

    // Admin: Get all overdue/missed follow-ups by executive
    app.get("/admin/overdue-followups", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const overdue = await followUpCollection.find({
          followUpDate: { $lt: today },
          status: { $ne: 'Completed' }
        }).toArray();
        res.send({ overdue });
      } catch (error) {
        console.error("Error fetching overdue follow-ups:", error);
        res.status(500).send({ message: "Failed to fetch overdue follow-ups", error: error.message });
      }
    });

    // Admin: Get overdue or stagnant leads
    app.get("/admin/overdue-leads", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        // Overdue: expected closure date < today and not closed
        const overdue = await leadCollection.find({
          status: { $ne: 'Closed' },
          expectedDate: { $lt: today }
        }).toArray();
        // Stagnant: not updated in last 14 days
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const stagnant = await leadCollection.find({
          status: { $ne: 'Closed' },
          updatedAt: { $lt: fourteenDaysAgo }
        }).toArray();
        res.send({ overdue, stagnant });
      } catch (error) {
        console.error("Error fetching overdue/stagnant leads:", error);
        res.status(500).send({ message: "Failed to fetch overdue/stagnant leads", error: error.message });
      }
    });

    // Admin: Assign ticket to department
    app.patch("/admin/tickets/:id/assign", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const ticketId = req.params.id;
        const { assignedTo, priority, department } = req.body;

        const updateDoc = {};
        if (assignedTo) updateDoc.assignedTo = assignedTo;
        if (priority) updateDoc.priority = priority;
        if (department) updateDoc.department = department;
        updateDoc.assignedAt = new Date();

        const result = await ticketCollection.updateOne(
          { _id: new ObjectId(ticketId) },
          { $set: updateDoc }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "Ticket not found" });
        }

        res.send({ message: "Ticket assigned successfully", result });
      } catch (error) {
        console.error("Error assigning ticket:", error);
        res.status(500).send({ message: "Failed to assign ticket", error: error.message });
      }
    });

    // Admin: Get ticket TAT (Turnaround Time) analytics
    app.get("/admin/ticket-tat", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const tickets = await ticketCollection.find({}).toArray();
        
        const tatAnalytics = {
          totalTickets: tickets.length,
          resolvedTickets: tickets.filter(t => t.status === 'Resolved').length,
          avgTAT: 0,
          priorityBreakdown: {
            'High': 0,
            'Medium': 0,
            'Low': 0
          },
          departmentBreakdown: {},
          overdueTickets: 0
        };

        let totalTAT = 0;
        let resolvedCount = 0;

        tickets.forEach(ticket => {
          // Priority breakdown
          if (ticket.priority) {
            tatAnalytics.priorityBreakdown[ticket.priority] = (tatAnalytics.priorityBreakdown[ticket.priority] || 0) + 1;
          }

          // Department breakdown
          if (ticket.department) {
            tatAnalytics.departmentBreakdown[ticket.department] = (tatAnalytics.departmentBreakdown[ticket.department] || 0) + 1;
          }

          // Calculate TAT for resolved tickets
          if (ticket.status === 'Resolved' && ticket.createdAt && ticket.resolvedAt) {
            const created = new Date(ticket.createdAt);
            const resolved = new Date(ticket.resolvedAt);
            const tat = (resolved - created) / (1000 * 60 * 60 * 24); // Days
            totalTAT += tat;
            resolvedCount++;
          }

          // Check for overdue tickets (open for more than 3 days)
          if (ticket.status !== 'Resolved' && ticket.createdAt) {
            const created = new Date(ticket.createdAt);
            const now = new Date();
            const daysOpen = (now - created) / (1000 * 60 * 60 * 24);
            if (daysOpen > 3) {
              tatAnalytics.overdueTickets++;
            }
          }
        });

        if (resolvedCount > 0) {
          tatAnalytics.avgTAT = (totalTAT / resolvedCount).toFixed(1);
        }

        res.send(tatAnalytics);
      } catch (error) {
        console.error("Error fetching ticket TAT analytics:", error);
        res.status(500).send({ message: "Failed to fetch ticket TAT analytics", error: error.message });
      }
    });

    // Admin: Get high priority tickets
    app.get("/admin/high-priority-tickets", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const highPriorityTickets = await ticketCollection.find({
          priority: 'High',
          status: { $ne: 'Resolved' }
        }).toArray();
        res.send(highPriorityTickets);
      } catch (error) {
        console.error("Error fetching high priority tickets:", error);
        res.status(500).send({ message: "Failed to fetch high priority tickets", error: error.message });
      }
    });

    // Executive: Get own performance metrics
    app.get("/executive/performance-metrics", varifyToken, verifyExecutive, async (req, res) => {
      try {
        const executiveEmail = req.user.email; // Get email from authenticated user

        // Get leads for this executive
        const leads = await leadCollection.find({ myEmail: executiveEmail }).toArray();
        const totalLeads = leads.length;
        const closedLeads = leads.filter(lead => lead.status === 'Closed').length;
        const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(2) : 0;

        let avgTimeToClose = 0;
        const closedLeadTimes = leads
          .filter(lead => lead.status === 'Closed' && lead.closedAt && lead.createdAt)
          .map(lead => {
            const created = new Date(lead.createdAt);
            const closed = new Date(lead.closedAt);
            return (closed - created) / (1000 * 60 * 60 * 24); // Days
          });
        
        if (closedLeadTimes.length > 0) {
          avgTimeToClose = (closedLeadTimes.reduce((a, b) => a + b, 0) / closedLeadTimes.length).toFixed(1);
        }

        // Get follow-ups for this executive
        const followUps = await followUpCollection.find({ myEmail: executiveEmail }).toArray();
        const completedFollowUps = followUps.filter(fu => fu.status === 'Completed').length;
        const totalFollowUps = followUps.length;

        // Get tickets for this executive
        const tickets = await ticketCollection.find({ executiveEmail: executiveEmail }).toArray();
        const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved').length;
        const totalTickets = tickets.length;

        // Get tasks for this executive
        const tasks = await taskCollection.find({ email: executiveEmail }).toArray();
        const completedTasks = tasks.filter(task => task.status === 'Completed').length;
        const totalTasks = tasks.length;

        const metrics = {
          executive: {
            email: executiveEmail,
            // name: req.user.name, // Assuming name is in token or can be fetched from user collection
            // phone: req.user.phone
          },
          leads: {
            total: totalLeads,
            closed: closedLeads,
            conversionRate: parseFloat(conversionRate),
            avgTimeToClose: parseFloat(avgTimeToClose)
          },
          followUps: {
            total: totalFollowUps,
            completed: completedFollowUps,
            completionRate: totalFollowUps > 0 ? ((completedFollowUps / totalFollowUps) * 100).toFixed(2) : 0
          },
          tickets: {
            total: totalTickets,
            resolved: resolvedTickets,
            resolutionRate: totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(2) : 0
          },
          tasks: {
            total: totalTasks,
            completed: completedTasks,
            completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0
          }
        };
        
        res.send(metrics);
      } catch (error) {
        console.error("Error fetching executive performance metrics:", error);
        res.status(500).send({ message: "Failed to fetch executive performance metrics", error: error.message });
      }
    });

    // Notification System: Create notification
    app.post("/api/notifications", varifyToken, async (req, res) => {
      try {
        const { recipientEmail, type, title, message, relatedId, priority } = req.body;
        const senderEmail = req.user.email;

        const notification = {
          recipientEmail,
          senderEmail,
          type, // 'lead', 'followup', 'ticket', 'task', 'system'
          title,
          message,
          relatedId,
          priority: priority || 'normal', // 'low', 'normal', 'high', 'urgent'
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
        const logs = await activityLogCollection.find({}).sort({ timestamp: -1 }).toArray();
        res.send(logs);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        res.status(500).send({ message: "Failed to fetch activity logs", error: error.message });
      }
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch((error) => {
  console.error("MongoDB connection error:", error);
  console.error("Error details:", {
    message: error.message,
    code: error.code,
    codeName: error.codeName
  });
  
  // Log environment variables (without sensitive data)
  console.log("Environment check:");
  console.log("DB_USER exists:", !!process.env.DB_USER);
  console.log("DB_PASSWORD exists:", !!process.env.DB_PASSWORD);
  console.log("JWT_Secret exists:", !!process.env.JWT_Secret);
  
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

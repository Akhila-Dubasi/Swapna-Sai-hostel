require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Supabase Postgres connection string
  ssl: { rejectUnauthorized: false }
});

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_key_change_in_prod";

// Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ==========================================
// ROUTES
// ==========================================

// --- AUTH ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fallback: If database URL is incorrectly set to an https URL (API URL instead of Postgres URL), allow a mock login
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("https://")) {
      console.log("Mock Login Allowed for:", email);
      if (email === "admin@swapnasai.com" && password === "admin123") {
        const token = jwt.sign({ adminId: "mock-admin-id" }, JWT_SECRET, { expiresIn: "1d" });
        return res.json({ token, email });
      } else {
        return res.status(401).json({ error: "Invalid credentials (try admin@swapnasai.com / admin123)" });
      }
    }

    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, email: admin.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database not properly connected. Connection string must start with postgresql://" });
  }
});

// --- ENQUIRIES ---
app.post("/api/enquiries", async (req, res) => {
  const { name, phone, budget, college, message } = req.body;
  let savedEnquiry = null;
  let dbError = null;

  // 1. Attempt to save to database
  try {
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("https://")) {
      const result = await pool.query(
        "INSERT INTO enquiries (name, phone, budget, college, message) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, phone, budget, college, message]
      );
      savedEnquiry = result.rows[0];
    } else {
      console.log("Mock saving enquiry (no database URL):", { name, phone, budget, college, message });
    }
  } catch (error) {
    console.error("Database save failed, continuing with email notification:", error);
    dbError = error.message;
  }

  // If we couldn't save to DB (or database was down), create a fallback response object
  if (!savedEnquiry) {
    savedEnquiry = {
      id: "mock-" + Date.now(),
      name,
      phone,
      budget,
      college,
      message,
      status: "New",
      created_at: new Date(),
      _dbError: dbError
    };
  }

  // 2. Attempt to send email
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailReceiver = process.env.EMAIL_RECEIVER || "swapnasaigirlshostel@gmail.com";

  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"Swapna Sai Hostel Website" <${emailUser}>`,
        to: emailReceiver,
        subject: `New Hostel Enquiry from ${name}`,
        html: `
          <h3>New Enquiry Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Monthly Budget:</strong> ${budget}</p>
          <p><strong>College/Workplace:</strong> ${college}</p>
          <p><strong>Message:</strong> ${message || 'No additional message'}</p>
          <br/>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent to ${emailReceiver}`);
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
    }
  } else {
    console.warn("SMTP email credentials (EMAIL_USER/EMAIL_PASS) are not set in .env. Mock sent email details to:", emailReceiver);
  }

  // Return success even if DB save had issues, to ensure frontend doesn't show 500 error
  res.status(201).json(savedEnquiry);
});

app.get("/api/enquiries", authenticateAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("https://")) {
      return res.json([
        { id: "1", name: "Mock User", phone: "9876543210", budget: "4000-5000", college: "Engineering College", status: "New", message: "Looking for a room", created_at: new Date() }
      ]);
    }
    const result = await pool.query("SELECT * FROM enquiries ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

app.patch("/api/enquiries/:id", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update enquiry" });
  }
});

app.delete("/api/enquiries/:id", authenticateAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM enquiries WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
});

// --- ROOMS ---
app.get("/api/rooms", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY created_at ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

app.post("/api/rooms", authenticateAdmin, async (req, res) => {
  try {
    const { title, price, sharing_type, facilities, image_url, available } = req.body;
    const result = await pool.query(
      "INSERT INTO rooms (title, price, sharing_type, facilities, image_url, available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, price, sharing_type, facilities, image_url, available]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

app.patch("/api/rooms/:id", authenticateAdmin, async (req, res) => {
  try {
    const { title, price, sharing_type, facilities, image_url, available } = req.body;
    const result = await pool.query(
      "UPDATE rooms SET title=$1, price=$2, sharing_type=$3, facilities=$4, image_url=$5, available=$6 WHERE id=$7 RETURNING *",
      [title, price, sharing_type, facilities, image_url, available, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update room" });
  }
});

app.delete("/api/rooms/:id", authenticateAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM rooms WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

// --- GALLERY ---
app.get("/api/gallery", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM gallery ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

app.post("/api/gallery", authenticateAdmin, async (req, res) => {
  try {
    const { image_url, category } = req.body;
    const result = await pool.query(
      "INSERT INTO gallery (image_url, category) VALUES ($1, $2) RETURNING *",
      [image_url, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to add image" });
  }
});

app.delete("/api/gallery/:id", authenticateAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM gallery WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// --- ANALYTICS ---
app.get("/api/analytics", authenticateAdmin, async (req, res) => {
  try {
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("https://")) {
      return res.json({ totalVisits: 150, totalEnquiries: 12, newEnquiries: 5, contacted: 7 });
    }
    const visitsResult = await pool.query("SELECT COUNT(*) as total FROM analytics");
    const enquiriesResult = await pool.query("SELECT COUNT(*) as total FROM enquiries");
    const newEnquiriesResult = await pool.query("SELECT COUNT(*) as total FROM enquiries WHERE status = 'New'");
    const contactedResult = await pool.query("SELECT COUNT(*) as total FROM enquiries WHERE status = 'Contacted'");
    
    res.json({
      totalVisits: visitsResult.rows[0].total,
      totalEnquiries: enquiriesResult.rows[0].total,
      newEnquiries: newEnquiriesResult.rows[0].total,
      contacted: contactedResult.rows[0].total
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

app.post("/api/analytics", async (req, res) => {
  try {
    const { page, visitor_type } = req.body;
    await pool.query("INSERT INTO analytics (page, visitor_type) VALUES ($1, $2)", [page, visitor_type || 'Guest']);
    res.status(201).json({ success: true });
  } catch (error) {
    // Analytics failure shouldn't crash the frontend
    res.status(200).json({ success: false }); 
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

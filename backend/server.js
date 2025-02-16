require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator
const { Pool } = require("pg");
const OpenAI = require("openai");

// Initialize Express App
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));  // Allow up to 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use(cors());

// Twilio Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// 🔹 Initialize Firebase Admin SDK
const serviceAccount = require("./finderskeepers-f1d08-firebase-adminsdk-fbsvc-b32fa9d322.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// 🔹 Initialize PostgreSQL Connection
// PostgreSQL Connection Pool
const pool = new Pool({
    user: process.env.PG_USER,          // Your PostgreSQL username
    host: process.env.PG_HOST,          // Usually 'localhost' or remote host
    database: process.env.PG_DATABASE,  // Database name (lost_and_found)
    password: process.env.PG_PASSWORD,  // Your PostgreSQL password
    port: process.env.PG_PORT || 5432,  // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false, // For self-signed certificates
    },
});



// 🔹 Step 1: Send OTP
app.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try {
        // Check if user already exists in Firestore
        const userRef = db.collection("users").doc(phoneNumber);
        const user = await userRef.get();

        // Send OTP via Twilio
        const verification = await client.verify.v2.services(verifyServiceSid).verifications.create({
            to: `+1${phoneNumber}`,
            channel: "sms",
        });

        res.status(200).json({
            message: "OTP sent successfully",
            status: verification.status,
            isNewUser: !user.exists,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
});

// 🔹 Step 2: Verify OTP & Store User in Firestore with UID
app.post("/verify-otp", async (req, res) => {
    const { phoneNumber, code, name } = req.body;

    if (!phoneNumber || !code) {
        return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    try {
        // Verify OTP with Twilio
        const verificationCheck = await client.verify.v2.services(verifyServiceSid).verificationChecks.create({
            to: `+1${phoneNumber}`,
            code,
        });

        if (verificationCheck.status !== "approved") {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Check if user exists in Firestore
        const userRef = db.collection("users").doc(phoneNumber);
        const user = await userRef.get();
        let userData;

        if (!user.exists) {
            // If user is new, ensure name is provided
            if (!name) return res.status(400).json({ error: "Name is required for new users" });

            // Generate UID for the user
            const uid = uuidv4();

            // Create new user in Firestore with UID
            userData = { uid, phoneNumber, name, createdAt: new Date() };
            await userRef.set(userData);
        } else {
            userData = user.data();
        }

        res.status(200).json({ message: "OTP verified successfully", user: userData });
    } catch (error) {
        res.status(500).json({ message: "Failed to verify OTP", error: error.message });
    }
});

// 🔹 Step 3: Add Found Item
app.post("/add-found-item", async (req, res) => {
    try {
        const { found_by, heading, description, tag, latitude, longitude, image, finding_description } = req.body;

        if (!found_by || !heading || !description || !tag || !latitude || !longitude || !finding_description) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const query = `
            INSERT INTO found_items (found_by, heading, description, tag, latitude, longitude, image, finding_description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;

        const values = [found_by, heading, description, tag, latitude, longitude, image, finding_description];

        const result = await pool.query(query, values);
        res.status(201).json({ message: "Item added successfully", item: result.rows[0] });

    } catch (error) {
        res.status(500).json({ error: "Error adding found item", details: error.message });
    }
});

// Get all unclaimed items
app.get("/unclaimed-items", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM found_items WHERE claimed = FALSE ORDER BY found_at DESC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching unclaimed items", details: error.message });
    }
});

// Claim an item
app.post("/claim-item", async (req, res) => {
    try {
        const { found_item_id, claimed_by } = req.body;

        if (!found_item_id || !claimed_by) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Step 1: Mark as claimed in found_items
        await pool.query("UPDATE found_items SET claimed = TRUE WHERE id = $1", [found_item_id]);

        // Step 2: Add to claimed_items table
        const query = `
            INSERT INTO claimed_items (found_item_id, claimed_by) 
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [found_item_id, claimed_by];

        const result = await pool.query(query, values);
        res.status(201).json({ message: "Item claimed successfully", claim: result.rows[0] });

    } catch (error) {
        res.status(500).json({ error: "Error claiming item", details: error.message });
    }
});

// Get all claimed items by user
app.get("/claimed-items/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        const query = `
            SELECT fi.*, ci.claimed_at
            FROM found_items fi
            JOIN claimed_items ci ON fi.id = ci.found_item_id
            WHERE ci.claimed_by = $1
            ORDER BY ci.claimed_at DESC;
        `;

        const result = await pool.query(query, [uid]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching claimed items", details: error.message });
    }
});

// Delete a found item by id
app.delete("/delete-found-item/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const query = "DELETE FROM found_items WHERE id = $1 RETURNING *;";
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted successfully", item: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error deleting item", details: error.message });
    }
});


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure your .env contains the API key
  });


// 🔹 **New Route: Generate Item Description from Image**
app.post("/generate-description", async (req, res) => {
    try {
      const { base64Image } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: "Image is required" });
      }
  
      console.log("Processing image with OpenAI...");
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
                { 
                    type: "text", 
                    text: "Describe this lost item. Provide a short and clear title without the words 'Title:' or 'Lost Item'. Then, write a description in first-person as if you are the person who found it. Mention any unique identifiers." 
                  }
                  ,
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "low", // Use "high" if needed for detailed analysis
                },
              },
            ],
          },
        ],
      });
  
      console.log("🔍 OpenAI Full Response:", response);

    const ai_response = response.choices[0].message.content;

    // Extract and format response
    const lines = ai_response.split("\n").map((line) => line.trim());
    let title = lines[0].replace(/^\*\*Title:\*\*\s*/, ""); // Remove "**Title:**"
    let description = lines.slice(1).join(" "); // Merge remaining lines

    // Ensure first-person formatting in description
    if (!description.includes("I found") && !description.includes("Found this")) {
        description = `Found this item: ${description}`;
    }

    res.status(200).json({
      title: title || "Lost Item",
      description: description || "No description available.",
    });
  } catch (error) {
    console.error("🚨 OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate description", details: error.message });
  }
});




// 🔹 Start the Server
app.listen(port, () => {
    console.log(`🚀 Backend running at http://localhost:${port}`);
});

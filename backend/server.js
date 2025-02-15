require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator

// Initialize Express App
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
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

// 🔹 Start the Server
app.listen(port, () => {
    console.log(`🚀 Backend running at http://localhost:${port}`);
});

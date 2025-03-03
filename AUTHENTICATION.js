const express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const connectDB = require("./DATABASE CONNECTION");

const router = express.Router();

let usersCollection;

const initDB = async () => {
    const dbConnection = await connectDB();
    if (dbConnection && dbConnection.usersCollection) {
        usersCollection = dbConnection.usersCollection;
        console.log("Users Collection initialized");
    } else {
        console.error("Failed to initialize Users Collection");
    }
};
initDB();

// SIGNUP
router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    console.log("Received Signup Request:", { firstName, lastName, email, password });

    if (!firstName || !lastName || !email || !password) {
        console.log("Signup Failed: Missing Fields");
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
            console.log("Signup Failed: Email already registered");
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ firstName, lastName, email, password: hashedPassword });
        
        console.log("User Registered Successfully:", email);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("Login Request Received:", { email, password });

    try {
        const user = await usersCollection.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.user = { _id: user._id, email: user.email };
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    console.log("Logout Request Received");
    req.session.destroy(() => res.json({ message: "Logged out" }));
});

module.exports = router;
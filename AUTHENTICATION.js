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

        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            admin: false
        };

        await usersCollection.insertOne(newUser);
        
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

    console.log("Login request received (authentication.js):", email);

    if (!email || !password) {
        console.log("Login failed: Missing credentials (authentication.js)");
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const user = await usersCollection.findOne({ email });

        if (!user) {
            console.log("Login failed: User not found (authentication.js)");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Login failed: Incorrect password (authentication.js)");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        req.session.user = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            admin: user.admin,
        };

        req.session.save((err) => {
            if (err) {
                console.error("Session save error (authentication.js):", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            console.log("Login successful (authentication.js):", req.session.user);
            res.json({ message: "Login successful!", user: req.session.user });
        });
    } catch (error) {
        console.error("Login error (authentication.js):", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// SESSION CHECK
router.get("/session", async (req, res) => {
    console.log("Session request received (authentication.js)");
    console.log("req.session:", req.session);

    try {
        if (req.session && req.session.user) {
            console.log("Session and user found (authentication.js)");

            try {
                const user = await usersCollection.findOne({ _id: new ObjectId(req.session.user._id) });

                if (user) {
                    console.log("User found in database (authentication.js):", user);

                    res.json({
                        isLoggedIn: true,
                        user: {
                            _id: user._id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            admin: user.admin,
                        },
                    });
                } else {
                    console.log("User not found in database (authentication.js)");
                    res.status(401).json({ isLoggedIn: false });
                }
            } catch (dbError) {
                console.error("Database error (authentication.js):", dbError);
                res.status(500).json({ isLoggedIn: false });
            }
        } else {
            console.log("No session or user (authentication.js)");
            res.status(401).json({ isLoggedIn: false });
        }
    } catch (error) {
        console.error("Session error (authentication.js):", error);
        res.status(500).json({ isLoggedIn: false });
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    console.log("Logout Request Received");
    
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Logout failed." });
        }

        res.clearCookie("ITS122LsessionCookies");
        
        console.log("User successfully logged out.");
        return res.json({ message: "Logged out successfully", redirect: "LOGIN SIGNUP.html" });
    });
});

module.exports = router;
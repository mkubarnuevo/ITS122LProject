const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./DATABASE CONNECTION");
const authenticationRoute = require("./AUTHENTICATION");

const app = express();
const PORT = 5500;

app.use(cors({
    origin: "http://127.0.0.1:3000",
    credentials: true
}));
app.use(express.json());

app.use(
    session({
        secret: "ITS122L",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
        }
    })
);


const startServer = async () => {
    try {
        const db = await connectDB();
        if (!db.usersCollection) {
            throw new Error("Users Collection is not initialized");
        }

        console.log("Connected to MongoDB");

        app.use("/", authenticationRoute);

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};


startServer();
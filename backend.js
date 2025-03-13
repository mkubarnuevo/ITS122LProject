const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const path = require('path');
const connectDB = require("./DATABASE CONNECTION");
const authenticationRoute = require("./AUTHENTICATION");
const profileUpdateRoutes = require("./PROFILE UPDATE");
const adoptionRoute = require("./ADOPTION CONNECT");

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(
    session({
        secret: "ITS122L",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://mkubarnuevo:userpassword234@schoolproject.rhlaw.mongodb.net/ITS122L",
            collectionName: "sessions"
        }),
        cookie: {
            name: "ITS122LsessionCookies",
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
        }
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "HOMEPAGE.html"));
});

app.use(express.static(path.join(__dirname, '/')));

const startServer = async () => {
    try {
        const db = await connectDB();
        if (!db.usersCollection) {
            throw new Error("Users Collection is not initialized");
        }

        console.log("Connected to MongoDB");

        app.use("/", authenticationRoute);
        app.use("/", profileUpdateRoutes);
        app.use("/", adoptionRoute);

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

module.exports = app;

startServer();
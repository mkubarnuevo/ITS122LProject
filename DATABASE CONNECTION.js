const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://mkubarnuevo:userpassword234@schoolproject.rhlaw.mongodb.net/";
const DATABASE_NAME = "ITS122L";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoURI);

        console.log("MongoDB Connected from MONGODB DATABASE CONNECTION.js...");

        const db = connection.connection.useDb(DATABASE_NAME);
        const usersCollection = db.collection("users");
        const petCollection = db.collection("pet")
        const adoption_applicationsCollection = db.collection("adoption_applications");
        const support_requestsCollection = db.collection("support_requests")

        return { db, usersCollection, petCollection, adoption_applicationsCollection, support_requestsCollection };
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
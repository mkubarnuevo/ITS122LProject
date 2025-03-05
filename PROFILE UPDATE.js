const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const connectDB = require("./DATABASE CONNECTION");

let userAccountsCollection;

const initDB = async () => {
    const dbConnection = await connectDB();
    if (dbConnection && dbConnection.usersCollection) {
        userAccountsCollection = dbConnection.usersCollection;
        console.log("Users Collection initialized");
    } else {
        console.error("Failed to initialize Users Collection");
    }
};
initDB();

router.put("/update-profile/:id", async (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email } = req.body;

    console.log("Updating profile for user ID:", userId);
    console.log("Request body:", req.body);

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        if (!ObjectId.isValid(userId)) {
            console.error("Invalid user ID:", userId);
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const updatedUser = await userAccountsCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { firstName, lastName, email } },
            { returnDocument: "after" }
        );

        if (!updatedUser) {
            console.log("User not found during update.");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Profile updated successfully:", updatedUser);
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
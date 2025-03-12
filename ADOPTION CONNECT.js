const express = require('express');
const { ObjectId } = require('mongodb');
const connectDB = require('./DATABASE CONNECTION');
const router = express.Router();

router.post('/adoption_applications', async (req, res) => {
    try {
        const db = await connectDB();

        if (!db.adoption_applicationsCollection) {
            throw new Error("adoption_applicationsCollection is not initialized");
        }

        await db.adoption_applicationsCollection.insertOne(req.body);
        res.status(201).send('Application submitted successfully');
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).send('Failed to submit application: ' + error.message);
    }
});

router.get('/adoption_applications', async (req, res) => {
    try {
        const db = await connectDB();
        const applications = await db.adoption_applicationsCollection.find({}).toArray();
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).send('Failed to fetch applications');
    }
});

router.get('/adoption_applications/:id', async (req, res) => {
    try {
        const db = await connectDB();
        const applicationId = req.params.id;

        if (!ObjectId.isValid(applicationId)) {
            return res.status(400).send('Invalid application ID');
        }

        const application = await db.adoption_applicationsCollection.findOne({ _id: new ObjectId(applicationId) });

        if (!application) {
            return res.status(404).send('Application not found');
        }

        res.json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).send('Failed to fetch application');
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();

const Application = require("../models/Application");

// GET all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single application
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: "Invalid application ID" });
  }
});

// ADD application
router.post("/", async (req, res) => {
  try {
    const application = await Application.create(req.body);

    res.status(201).json({
      message: "Application added successfully",
      application,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE application
router.put("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE application
router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid application ID" });
  }
});

module.exports = router;
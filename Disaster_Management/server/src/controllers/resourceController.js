const Resource = require("../models/resource");

// Test Endpoint
const test = (req, res) => {
  res.json("test is working");
};

// Controller function to create a new resource
const createResource = async (req, res) => {
    try {
        const { disasterId, userId, resourceType, quantity, urgency, comments } = req.body;

        // Create resource in the database with isApproved set to false by default
        const newResource = await Resource.create({
            disasterId,
            userId,
            resourceType,
            quantity,
            urgency,
            comments,
            isApproved: false // Set isApproved to false by default
        });
         res.status(201).json({ message: 'Resource created successfully', resource: newResource });
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Controller function to fetch all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetch the resouces of certain user only
const getResourcesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const resources = await Resource.find({ userId });
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getResourcesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const resources = await Resource.find({ userId });
        if (!resources || resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for this user' });
        }
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources by user ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Controller function to update a resource
const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { resourceType, quantity, urgency, comments } = req.body;
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { resourceType, quantity, urgency, comments },
      { new: true }
    );
    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res
      .status(200)
      .json({
        message: "Resource updated successfully",
        resource: updatedResource,
      });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to delete a resource
const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const deletedResource = await Resource.findByIdAndDelete(resourceId);
    if (!deletedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to set flag in the resource table
const setFlagInDB = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const { isApproved } = req.body;

        // Update the flag in the database
        const result = await Resource.updateOne(
            { _id: resourceId }, // Query criteria
            { $set: { isApproved: isApproved } } // Update operation
        );

        if (result.n === 0) {
            console.error('Resource not found:', resourceId);
            return res.status(404).json({ error: 'Resource not found' });
        }

        console.log('Flag set in DB successfully');
        return res.status(200).json({ message: 'Flag set in DB successfully' });
    } catch (error) {
        console.error('Error setting flag in DB:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    test,
    createResource,
    getResources,
    getAllResources,
    getResourcesByUserId,
    updateResource,
    deleteResource,
    setFlagInDB
};

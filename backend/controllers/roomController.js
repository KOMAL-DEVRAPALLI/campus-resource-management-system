import Room from "../models/roomModel.js";

/* ================= ADD RESOURCE ================= */

export const addRoom = async (req, res) => {
  try {

    const { roomNumber, capacity, type } = req.body;

    if (!roomNumber || !capacity) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    if (capacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be greater than 0"
      });
    }

    const existing = await Room.findOne({ roomNumber });

    if (existing) {
      return res.status(400).json({
        message: "Resource already exists"
      });
    }

    const resource = await Room.create({
      roomNumber,
      capacity,
      type: type || "General",
      occupiedCount: 0,
      status: "active"
    });

    res.status(201).json({
      message: "Resource added successfully",
      data: resource
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/* ================= GET ALL RESOURCES ================= */

export const getAllRooms = async (req, res) => {
  try {

    const resources = await Room.find();

    // ✅ Add computed status (smart logic)
    const updated = resources.map(r => {

      let utilizationStatus = "available";

      if (r.occupiedCount === 0) {
        utilizationStatus = "available";
      } else if (r.occupiedCount < r.capacity) {
        utilizationStatus = "in-use";
      } else {
        utilizationStatus = "full";
      }

      return {
        ...r._doc,
        utilizationStatus
      };
    });

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching resources"
    });
  }
};


/* ================= UPDATE RESOURCE ================= */

export const updateRoom = async (req, res) => {
  try {

    const { id } = req.params;
    const { roomNumber, capacity, type } = req.body;

    const resource = await Room.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    // 🔁 Duplicate check
    if (roomNumber && roomNumber !== resource.roomNumber) {

      const duplicate = await Room.findOne({ roomNumber });

      if (duplicate) {
        return res.status(400).json({
          message: "Resource name already exists"
        });
      }

      resource.roomNumber = roomNumber;
    }

    // 🔁 Capacity validation
    if (capacity !== undefined) {

      if (capacity <= 0) {
        return res.status(400).json({
          message: "Capacity must be greater than 0"
        });
      }

      if (capacity < resource.occupiedCount) {
        return res.status(400).json({
          message: "Capacity cannot be less than usage"
        });
      }

      resource.capacity = capacity;
    }

    // 🔁 Update type
    if (type) {
      resource.type = type;
    }

    await resource.save();

    res.status(200).json({
      message: "Resource updated successfully",
      data: resource
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/* ================= DEACTIVATE RESOURCE ================= */

export const deactivateRoom = async (req, res) => {
  try {

    const { id } = req.params;

    const resource = await Room.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    if (resource.occupiedCount > 0) {
      return res.status(400).json({
        message: "Cannot deactivate resource in use"
      });
    }

    resource.status = "inactive";

    await resource.save();

    res.status(200).json({
      message: "Resource deactivated",
      data: resource
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
import { useEffect, useState } from "react";
import { apiRequest, apiGet } from "../services/api";
import { API } from "../services/apiRoutes";
import MainLayout from "../components/layout/MainLayout";
import {
  tableStyle,
  thStyle,
  tdStyle,
  buttonDanger,
  buttonPrimary,
  tableContainer
} from "../styles/uiStyles";

import toast from "react-hot-toast";
import ConfirmDialog from "../components/common/ConfirmDialog";

const ResourceManagement = () => {

  const [rooms, setRooms] = useState([]);

  const [resourceName, setResourceName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("General");

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ================= FETCH =================
  const fetchRooms = async () => {
    try {
      const data = await apiGet(API.ROOMS.ALL);
      setRooms(data);
    } catch (error) {
      toast.error("Failed to fetch resources");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ================= ADD =================
  const handleAdd = async () => {
    if (!resourceName || !capacity) {
      toast.error("All fields required");
      return;
    }

    if (Number(capacity) <= 0) {
      toast.error("Capacity must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      await apiRequest(API.ROOMS.ALL, "POST", {
        resourceName,
        capacity: Number(capacity),
        type
      });

      toast.success("Resource added");
         console.log("Data:",{
          resourceName,
          capacity,
          type
         });
         
      resetForm();
      fetchRooms();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (room) => {
    setResourceName(room.resourceName);
    setCapacity(room.capacity);
    setType(room.type || "General");
    setEditId(room._id);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await apiRequest(`${API.ROOMS.ALL}/${editId}`, "PUT", {
        resourceName,
        capacity,
        type
      });

      toast.success("Resource updated");

      resetForm();
      fetchRooms();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const openDeactivateDialog = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDeactivate = async () => {
    try {
      await apiRequest(
        `${API.ROOMS.ALL}/${selectedId}/deactivate`,
        "PATCH"
      );

      toast.success("Resource deactivated");
      fetchRooms();

    } catch (error) {
      toast.error(error.message);
    }

    setConfirmOpen(false);
  };

  // ================= RESET =================
  const resetForm = () => {
    setResourceName("");
    setCapacity("");
    setType("General");
    setEditId(null);
  };

  // ================= UI =================
  return (
    <MainLayout>

      <div style={tableContainer}>

        <h2>Available Resources</h2>
        <hr />

        {/* ===== TABLE ===== */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Capacity</th>
              <th style={thStyle}>In Use</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>

                <td style={tdStyle}>{room.resourceName}</td>

                <td style={tdStyle}>
                  {room.type || "General"}
                </td>

                <td style={tdStyle}>{room.capacity}</td>

                <td style={tdStyle}>{room.occupiedCount}</td>

                <td style={tdStyle}>
                  {room.status === "inactive" ? (
                    <span style={{ color: "gray" }}>Inactive</span>
                  ) : room.occupiedCount === room.capacity ? (
                    <span style={{ color: "red" }}>Full</span>
                  ) : (
                    <span style={{ color: "green" }}>Available</span>
                  )}
                </td>

                <td style={tdStyle}>
                  <button
                    style={buttonPrimary}
                    onClick={() => handleEdit(room)}
                  >
                    Edit
                  </button>

                  <button
                    style={buttonDanger}
                    onClick={() => openDeactivateDialog(room._id)}
                  >
                    Deactivate
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <hr style={{ margin: "20px 0", opacity: 0.2 }} />

        {/* ===== FORM ===== */}
        <h3>{editId ? "Update Resource" : "Add Resource"}</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

          <input
            placeholder="Resource Name"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Electronics</option>
            <option>Lab</option>
            <option>Hall</option>
            <option>General</option>
          </select>

        </div>

        <br />

        {editId ? (
          <button
            style={buttonPrimary}
            onClick={handleUpdate}
            disabled={loading}
          >
            Update Resource
          </button>
        ) : (
          <button
            style={buttonPrimary}
            onClick={handleAdd}
            disabled={loading}
          >
            Add Resource
          </button>
        )}

      </div>

      {/* ===== CONFIRM MODAL ===== */}
      <ConfirmDialog
        open={confirmOpen}
        title="Deactivate Resource"
        message="Are you sure you want to deactivate this resource?"
        onConfirm={confirmDeactivate}
        onCancel={() => setConfirmOpen(false)}
      />

    </MainLayout>
  );
};

export default ResourceManagement;
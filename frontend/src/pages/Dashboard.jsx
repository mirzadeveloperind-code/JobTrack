
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication as removeApplication,
} from "../services/applicationService";

function Dashboard() {
  const navigate = useNavigate();

  // Logged-in user information
  let currentUser = {};

  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    currentUser = {};
  }

  const userName = currentUser.name || currentUser.email || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Application states
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [form, setForm] = useState({
    company: "",
    position: "",
    date: "",
    status: "Applied",
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Load applications from MongoDB
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setError("");

      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error("Loading error:", err);

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError("Unable to load applications. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);

    setForm({
      company: "",
      position: "",
      date: "",
      status: "Applied",
    });
  };

  // Add application
  const addApplication = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const newApplication = await createApplication(form);

      setApplications((previous) => [
        newApplication,
        ...previous,
      ]);

      resetForm();

      alert("Application added successfully!");
    } catch (err) {
      console.error("Add error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to add application."
      );
    }
  };

  // Select application for editing
  const editApplication = (app) => {
    setEditingId(app._id);

    setForm({
      company: app.company,
      position: app.position,
      date: app.date
        ? new Date(app.date).toISOString().split("T")[0]
        : "",
      status: app.status,
    });

    document
      .getElementById("add-application")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Update application
  const handleUpdateApplication = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const updatedApplication = await updateApplication(
        editingId,
        form
      );

      setApplications((previous) =>
        previous.map((app) =>
          app._id === editingId
            ? updatedApplication
            : app
        )
      );

      resetForm();

      alert("Application updated successfully!");
    } catch (err) {
      console.error("Update error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update application."
      );
    }
  };

  // Delete application
  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      await removeApplication(id);

      setApplications((previous) =>
        previous.filter((app) => app._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      alert("Application deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete application."
      );
    }
  };

  // Count applications by status
  const countStatus = (status) => {
    return applications.filter(
      (app) => app.status === status
    ).length;
  };

  // Search and filter
  const filteredApplications = applications.filter((app) => {
    const company = (app.company || "").toLowerCase();
    const position = (app.position || "").toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      company.includes(searchText) ||
      position.includes(searchText);

    const matchesStatus =
      filter === "All" || app.status === filter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2 className="logo">💼 JobTrack</h2>

        <p className="menu-heading">MAIN MENU</p>

        <a className="nav-link active" href="#dashboard">
          ▦ Dashboard
        </a>

        <a className="nav-link" href="#applications">
          📋 Applications
        </a>

        <a className="nav-link" href="#add-application">
          ＋ Add Application
        </a>

        {/* SIDEBAR PROFILE */}
        <div className="sidebar-bottom">
          <div className="profile-avatar">
            {userInitial}
          </div>

          <div>
            <strong>{userName}</strong>
            <small>JobTrack Account</small>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">

          <div>
            <h3>Job Application Management</h3>
            <p>Track your career opportunities</p>
          </div>

          <div className="admin">
            <span className="avatar">
              {userInitial}
            </span>

            <span>{userName}</span>

            <button
              type="button"
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>

        </header>

        <section className="dashboard" id="dashboard">

          {/* WELCOME */}
          <div className="welcome">

            <div>
              <h1>Dashboard Overview</h1>

              <p>
                Welcome back, {userName}! Here's your job
                application summary.
              </p>
            </div>

            <a href="#add-application" className="primary-btn">
              + Add Application
            </a>

          </div>

          {/* STATISTICS */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon blue">📋</div>
              <p>Total Applications</p>
              <h2>{applications.length}</h2>
              <small>All applications</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">📅</div>
              <p>Interviews</p>
              <h2>{countStatus("Interview")}</h2>
              <small>Interview opportunities</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">🎉</div>
              <p>Offers</p>
              <h2>{countStatus("Offer")}</h2>
              <small>Job offers received</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">✕</div>
              <p>Rejections</p>
              <h2>{countStatus("Rejected")}</h2>
              <small>Applications rejected</small>
            </div>

          </div>

          {/* ADD / EDIT APPLICATION */}
          <section className="panel" id="add-application">

            <h2>
              {editingId
                ? "Edit Application"
                : "Add New Application"}
            </h2>

            <form
              onSubmit={
                editingId
                  ? handleUpdateApplication
                  : addApplication
              }
            >

              <div className="form-grid">

                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={form.company}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="position"
                  placeholder="Job Position"
                  value={form.position}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>

              </div>

              <button type="submit" className="primary-btn">
                {editingId
                  ? "Update Application"
                  : "+ Add Application"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="delete-btn"
                  onClick={resetForm}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              )}

            </form>

          </section>

          {/* APPLICATION RECORDS */}
          <section className="panel" id="applications">

            <h2>Recent Applications</h2>

            {/* SEARCH AND FILTER */}
            <div className="table-controls">

              <input
                type="text"
                placeholder="Search company or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>

            </div>

            {/* LOADING */}
            {loading && <p>Loading applications...</p>}

            {/* ERROR */}
            {error && (
              <p style={{ color: "red" }}>{error}</p>
            )}

            {/* TABLE */}
            {!loading && (
              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Position</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredApplications.map((app) => (

                      <tr key={app._id}>

                        <td>{app.company}</td>

                        <td>{app.position}</td>

                        <td>
                          {app.date
                            ? new Date(app.date).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          <span
                            className={`status ${(app.status || "applied").toLowerCase()}`}
                          >
                            {app.status}
                          </span>
                        </td>

                        <td>

                          <button
                            type="button"
                            className="primary-btn"
                            onClick={() => editApplication(app)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => deleteApplication(app._id)}
                            style={{ marginLeft: "8px" }}
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))}

                    {filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-message">
                          No applications found.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </section>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;

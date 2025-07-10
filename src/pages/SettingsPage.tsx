import { useState, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import "./SettingsPage.css";

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [name, setName] = useState("Rahma");
  const [email, setEmail] = useState("rahma@example.com");
  const [profilePic, setProfilePic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Updated Info:\nName: ${name}\nEmail: ${email}\nProfile Pic URL: ${profilePic}\nDark Mode: ${darkMode}`);
  };

  return (
    <div className={`settings-page ${darkMode ? "dark" : ""}`}>
      <h1 className="title">Settings</h1>

      <form onSubmit={handleSubmit} className="settings-form">

        <div className="form-group toggle-group">
          <label htmlFor="darkMode" className="label">Dark Mode</label>
          <label className="switch">
            <input
              id="darkMode"
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="name" className="label">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePic" className="label">Profile Picture URL</label>
          <input
            id="profilePic"
            type="url"
            value={profilePic}
            onChange={e => setProfilePic(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="input"
          />
          {profilePic && (
            <img
              src={profilePic}
              alt="Profile Preview"
              className="profile-preview"
            />
          )}
        </div>

        <button type="submit" className="btn-save">Save Changes</button>
      </form>
    </div>
  );
};

export default SettingsPage;

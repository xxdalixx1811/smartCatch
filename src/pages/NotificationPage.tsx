import { useState, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import "./NotificationPage.css";

const NotificationPage = () => {
  const { darkMode } = useContext(DarkModeContext);

  const [notifications] = useState([
    { id: 1, message: "Aziz sent you a new message" },
    { id: 2, message: "Samar replied in SmartCatch Team" },
    { id: 3, message: "Teamleader mentioned you in a comment" },
  ]);

  const [summaries] = useState([
    {
      id: 1,
      group: "SmartCatch Team",
      points: [
        "Discussed UI improvements",
        "Zizou is implementing backend API",
        "Rahma to review Figma design",
      ],
    },
  ]);

  const [calendarSuggestions, setCalendarSuggestions] = useState([
    {
      id: 1,
      text: "Meeting on Friday at 2 PM",
      approved: false,
    },
  ]);

  const handleAccept = (id: number) => {
    setCalendarSuggestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: true } : item
      )
    );
  };

  const handleDecline = (id: number) => {
    setCalendarSuggestions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className={`notification-page ${darkMode ? "dark" : ""}`}>
      <h1 className="page-title">🔔 Notifications</h1>

      <section className="notifications-section">
        <h3>Messages</h3>
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className="notification-item">{n.message}</li>
          ))}
        </ul>
      </section>

      <section className="summary-section">
        <h3>🧠 Smart Summary</h3>
        {summaries.map((s) => (
          <div key={s.id} className="summary-block">
            <h4>{s.group}</h4>
            <ul>
              {s.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="calendar-section">
        <h3>📅 Suggested Events</h3>
        {calendarSuggestions.length === 0 ? (
          <p>No new suggestions.</p>
        ) : (
          calendarSuggestions.map((event) => (
            <div key={event.id} className="calendar-suggestion">
              <p>{event.text}</p>
              {!event.approved ? (
                <div className="calendar-actions">
                  <button onClick={() => handleAccept(event.id)}>✅ Accept</button>
                  <button onClick={() => handleDecline(event.id)}>❌ Decline</button>
                </div>
              ) : (
                <p className="approved-label">✔️ Added to calendar</p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default NotificationPage;

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import "./CalendarPage.css";

const Card = ({ children }) => (
  <div className="card">{children}</div>
);
const CardContent = ({ children }) => <div className="card-content">{children}</div>;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [newEvent, setNewEvent] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const isToday = (day) =>
    day &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setNewEvent(events[day] || "");
  };

  const saveEvent = () => {
    if (selectedDay !== null) {
      setEvents((prev) => ({ ...prev, [selectedDay]: newEvent }));
      setSelectedDay(null);
      setNewEvent("");
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        <CalendarIcon className="icon" /> Calendar
      </h1>

      <Card>
        <CardContent>
          <div className="nav-buttons">
            <button onClick={prevMonth} className="nav-button">
              <ChevronLeft />
            </button>
            <h2 className="month-year">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button onClick={nextMonth} className="nav-button">
              <ChevronRight />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="weekdays">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="days-grid">
            {days.map((day, i) => {
              const dayClassNames = [
                "day-cell",
                day ? "" : "empty",
                isToday(day) ? "today" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={i}
                  onClick={() => day && handleDayClick(day)}
                  className={dayClassNames}
                >
                  <span>{day || ""}</span>
                  {events[day] && (
                    <small className="event-text">{events[day]}</small>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event editor */}
          {selectedDay !== null && (
            <div className="event-editor">
              <h3>
                Event for {selectedDay}{" "}
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <textarea
                className="event-textarea"
                rows={3}
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
              />
              <div className="buttons-row">
                <button
                  onClick={() => {
                    setSelectedDay(null);
                    setNewEvent("");
                  }}
                  className="button-cancel"
                >
                  Cancel
                </button>
                <button onClick={saveEvent} className="button-save">
                  Save
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

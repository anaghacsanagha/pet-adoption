
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  showConfirm,
  showSuccess,
  showError,
  showWarning,
} from "../utils/sweetAlert";

function VaccinationCalendar() {
  const user = JSON.parse(localStorage.getItem("pawhavenUser"));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDark, setIsDark] = useState(
    () =>
      document.querySelector(".pawhaven-app")
        ?.classList.contains("dark-mode") || false
  );

  const [formData, setFormData] = useState({
    petName: "",
    vaccineName: "",
    time: "",
    notes: "",
  });

  // Detect dark mode changes
  useEffect(() => {
    const app = document.querySelector(".pawhaven-app");
    if (!app) return;

    const observer = new MutationObserver(() => {
      setIsDark(app.classList.contains("dark-mode"));
    });

    observer.observe(app, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const theme = {
    background: isDark ? "#242424" : "#fffaf5",
    card: isDark ? "#303030" : "#ffffff",
    text: isDark ? "#f5eee7" : "#493b35",
    muted: isDark ? "#c0b5aa" : "#81736b",
    border: isDark ? "#4a4a4a" : "#e8d5c4",
    input: isDark ? "#252525" : "#ffffff",
    appointment: isDark ? "#292929" : "#ffffff",
    calendar: isDark ? "#303030" : "#ffffff",
    calendarText: isDark ? "#f5eee7" : "#493b35",
    today: isDark ? "#51443d" : "#e8d5c4",
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedDateString = formatDate(selectedDate);

  useEffect(() => {
    if (!user?.id) return;

    fetch("https://pawhaven-server.onrender.com/vaccinationAppointments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load appointments");
        return res.json();
      })
      .then((data) => {
        setAppointments(
          data.filter(
            (item) => String(item.userId) === String(user.id)
          )
        );
      })
      .catch((error) => console.error(error));
  }, [user?.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addAppointment = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      await showWarning("Please login first.");
      return;
    }

    setLoading(true);

    const newAppointment = {
      userId: user.id,
      petName: formData.petName,
      vaccineName: formData.vaccineName,
      date: selectedDateString,
      time: formData.time,
      notes: formData.notes,
      status: "Scheduled",
    };

    try {
      const response = await fetch(
        "https://pawhaven-server.onrender.com/vaccinationAppointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAppointment),
        }
      );

      if (!response.ok) {
        throw new Error("Could not save appointment");
      }

      const savedAppointment = await response.json();

      setAppointments((prev) => [...prev, savedAppointment]);

      setFormData({
        petName: "",
        vaccineName: "",
        time: "",
        notes: "",
      });

      await showSuccess(
        "Appointment Scheduled!",
        "Vaccination appointment scheduled successfully."
      );
    } catch (error) {
      console.error(error);
      await showError(
        "Unable to Schedule",
        "Unable to schedule appointment. Check your server."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    const result = await showConfirm(
      "Cancel Appointment?",
      "Are you sure you want to cancel this appointment?"
    );

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `https://pawhaven-server.onrender.com/vaccinationAppointments/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to cancel");
      }

      setAppointments((prev) =>
        prev.filter((item) => String(item.id) !== String(id))
      );

      await showSuccess(
        "Appointment Cancelled",
        "Your appointment has been cancelled."
      );
    } catch (error) {
      console.error(error);
      await showError(
        "Cancellation Failed",
        "Could not cancel appointment."
      );
    }
  };

  const selectedAppointments = appointments.filter(
    (item) => item.date === selectedDateString
  );

  const upcomingAppointments = [...appointments]
    .filter((item) => item.date >= formatDate(new Date()))
    .sort((a, b) => a.date.localeCompare(b.date));

  const inputStyle = {
    background: theme.input,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    padding: "11px",
    marginBottom: "15px",
    width: "100%",
    outline: "none",
    colorScheme: isDark ? "dark" : "light",
  };

  return (
    <div
      className={`vaccination-page ${isDark ? "vaccination-dark" : ""}`}
      style={{
        background: theme.background,
        minHeight: "100vh",
        padding: "45px 6%",
        color: theme.text,
        transition: "all 0.3s ease",
      }}
    >
      <style>{`
        .vaccination-heading {
          text-align: center;
          margin-bottom: 35px;
        }

        .vaccination-heading h2 {
          color: ${theme.text};
          font-weight: 700;
        }

        .vaccination-heading p {
          color: ${theme.muted};
        }

        .vaccination-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          max-width: 1100px;
          margin: auto;
        }

        .vaccination-card {
          background: ${theme.card};
          color: ${theme.text};
          padding: 25px;
          border-radius: 16px;
          border: 1px solid ${theme.border};
          box-shadow: ${isDark
            ? "0 4px 18px rgba(0,0,0,.25)"
            : "0 4px 18px rgba(0,0,0,.07)"};
          transition: all .3s ease;
        }

        .vaccination-card h4 {
          color: #789477;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .vaccination-card h5 {
          color: ${theme.text};
        }

        .vaccination-page .react-calendar {
          width: 100%;
          background: ${theme.calendar};
          color: ${theme.calendarText};
          border: 1px solid ${theme.border};
          border-radius: 12px;
          font-family: inherit;
          overflow: hidden;
        }

        .vaccination-page .react-calendar button {
          color: ${theme.calendarText};
        }

        .vaccination-page .react-calendar__navigation button {
          background: ${theme.calendar};
          color: ${theme.calendarText};
        }

        .vaccination-page .react-calendar__navigation button:enabled:hover,
        .vaccination-page .react-calendar__navigation button:enabled:focus {
          background: ${theme.today};
        }

        .vaccination-page .react-calendar__month-view__weekdays {
          color: ${theme.muted};
        }

        .vaccination-page .react-calendar__month-view__days__day--neighboringMonth {
          color: ${isDark ? "#777777" : "#b9aaa0"} !important;
        }

        .vaccination-page .react-calendar__tile {
          padding: 14px 5px;
          background: transparent;
          border-radius: 8px;
        }

        .vaccination-page .react-calendar__tile:enabled:hover,
        .vaccination-page .react-calendar__tile:enabled:focus {
          background: ${theme.today};
        }

        .vaccination-page .react-calendar__tile--active {
          background: #789477 !important;
          color: white !important;
          border-radius: 8px;
        }

        .vaccination-page .react-calendar__tile--now {
          background: ${theme.today};
          border-radius: 8px;
        }

        .vaccination-page label {
          color: ${theme.text};
          display: block;
          margin-bottom: 7px;
          font-weight: 500;
        }

        .vaccination-page .submit-btn {
          background: #789477;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          width: 100%;
          font-weight: 600;
        }

        .vaccination-page .submit-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .appointment-item {
          background: ${theme.appointment};
          color: ${theme.text};
          border: 1px solid ${theme.border};
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 12px;
        }

        .appointment-item p {
          color: ${theme.muted};
        }

        .appointment-item button {
          background: #c16e68;
          border: none;
          color: white;
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
        }

        .appointment-item button:hover {
          background: #a95752;
        }

        @media(max-width: 750px) {
          .vaccination-layout {
            grid-template-columns: 1fr;
          }

          .vaccination-page {
            padding: 30px 4% !important;
          }
        }
      `}</style>

      <div className="vaccination-heading">
        <h2>Vaccination Calendar</h2>
        <p>Keep your pets healthy and up to date</p>
      </div>

      <div className="vaccination-layout">
        <div className="vaccination-card">
          <h4>Select Appointment Date</h4>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
          />

          <h5 className="mt-4">
            Appointments on {selectedDateString}
          </h5>

          {selectedAppointments.length === 0 ? (
            <p style={{ color: theme.muted }}>
              No appointments on this date.
            </p>
          ) : (
            selectedAppointments.map((item) => (
              <div className="appointment-item" key={item.id}>
                <strong>{item.petName}</strong>
                <p className="mb-1">{item.vaccineName}</p>
                <p>{item.time}</p>
                <button onClick={() => cancelAppointment(item.id)}>
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>

        <div className="vaccination-card">
          <h4>Schedule Vaccination</h4>

          <form onSubmit={addAppointment}>
            <label>Pet Name</label>
            <input
              style={inputStyle}
              name="petName"
              placeholder="Enter pet name"
              value={formData.petName}
              onChange={handleChange}
              required
            />

            <label>Vaccine Name</label>
            <input
              style={inputStyle}
              name="vaccineName"
              placeholder="Enter vaccine name"
              value={formData.vaccineName}
              onChange={handleChange}
              required
            />

            <label>Appointment Date</label>
            <input
              style={inputStyle}
              type="date"
              value={selectedDateString}
              min={formatDate(new Date())}
              onChange={(e) => {
                if (!e.target.value) return;

                const [year, month, day] = e.target.value.split("-");
                setSelectedDate(
                  new Date(
                    Number(year),
                    Number(month) - 1,
                    Number(day)
                  )
                );
              }}
              required
            />

            <label>Appointment Time</label>
            <input
              style={inputStyle}
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <label>Additional Notes</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              name="notes"
              placeholder="Enter notes (optional)"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Schedule Appointment"}
            </button>
          </form>
        </div>
      </div>

      <div
        className="vaccination-card mt-4"
        style={{ maxWidth: 1100, margin: "25px auto" }}
      >
        <h4>Upcoming Appointments</h4>

        {upcomingAppointments.length === 0 ? (
          <p style={{ color: theme.muted }}>
            No upcoming appointments.
          </p>
        ) : (
          upcomingAppointments.map((item) => (
            <div className="appointment-item" key={item.id}>
              <strong>{item.petName}</strong>
              <p>
                {item.vaccineName} · {item.date} · {item.time}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VaccinationCalendar;

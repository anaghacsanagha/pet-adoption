
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

  const [formData, setFormData] = useState({
    petName: "",
    vaccineName: "",
    time: "",
    notes: "",
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedDateString = formatDate(selectedDate);

  useEffect(() => {
    if (!user?.id) return;

    fetch("http://localhost:3000/vaccinationAppointments")
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
        "http://localhost:3000/vaccinationAppointments",
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
        `http://localhost:3000/vaccinationAppointments/${id}`,
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

  return (
    <div className="vaccination-page">
      <style>{`
        .vaccination-page {
          background: #fffaf5;
          min-height: 100vh;
          padding: 45px 6%;
          color: #493b35;
        }
        .vaccination-heading {
          text-align: center;
          margin-bottom: 35px;
        }
        .vaccination-heading h2 {
          color: #493b35;
          font-weight: 700;
        }
        .vaccination-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          max-width: 1100px;
          margin: auto;
        }
        .vaccination-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(0,0,0,.07);
        }
        .vaccination-card h4 {
          color: #789477;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .vaccination-page .react-calendar {
          width: 100%;
          border: none;
          border-radius: 12px;
          font-family: inherit;
        }
        .vaccination-page .react-calendar__tile--active {
          background: #789477 !important;
          color: white !important;
          border-radius: 8px;
        }
        .vaccination-page .react-calendar__tile--now {
          background: #e8d5c4;
          border-radius: 8px;
        }
        .vaccination-page .react-calendar__tile {
          padding: 14px 5px;
        }
        .vaccination-page .form-control {
          margin-bottom: 15px;
          padding: 11px;
          border: 1px solid #e8d5c4;
          border-radius: 8px;
        }
        .vaccination-page .submit-btn {
          background: #789477;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          width: 100%;
        }
        .appointment-item {
          border: 1px solid #e8d5c4;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 12px;
        }
        .appointment-item button {
          background: #d9a6a0;
          border: none;
          color: white;
          border-radius: 6px;
          padding: 6px 12px;
        }
        @media(max-width: 750px) {
          .vaccination-layout {
            grid-template-columns: 1fr;
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
            <p>No appointments on this date.</p>
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
              className="form-control"
              name="petName"
              placeholder="Enter pet name"
              value={formData.petName}
              onChange={handleChange}
              required
            />

            <label>Vaccine Name</label>
            <input
              className="form-control"
              name="vaccineName"
              placeholder="Enter vaccine name"
              value={formData.vaccineName}
              onChange={handleChange}
              required
            />

            <label>Appointment Date</label>
            <input
              className="form-control"
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
              className="form-control"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <label>Additional Notes</label>
            <textarea
              className="form-control"
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
          <p>No upcoming appointments.</p>
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

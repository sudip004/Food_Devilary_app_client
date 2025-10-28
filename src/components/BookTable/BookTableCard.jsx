import React, { useState } from "react";
import "./BookTableCard.css";


const timeSlots = [
  "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM",
  "06:00 PM", "06:30 PM", "07:00 PM",
  "07:30 PM", "08:00 PM", "08:30 PM",
];

const BookTableCard = ({ onSubmit }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const minDate = new Date().toISOString().split("T")[0]; // today

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) return setError("Please select a date.");
    if (!time) return setError("Please pick a time slot.");
    if (!people || people < 1) return setError("Please select number of people.");

    const payload = {
      date,
      time,
      people,
      notes,
    };

    try {
      setSubmitting(true);
      // If you have backend, call it here (example commented)
      // await axios.post("/api/book-table", payload);
      if (onSubmit) await onSubmit(payload);
      console.log("tabbbleee",payload);
      
      // reset or keep as needed
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-card">
      <div className="book-image">
        <img src={'https://cdn.mos.cms.futurecdn.net/bCoPusuftCjcU9F8HiybQg.jpg'} alt="Restaurant interior" />
      </div>

      <form className="book-form" onSubmit={handleSubmit}>
        <h3>Book Your Table</h3>
        <p className="muted">Reserve a table quickly — we'll confirm availability.</p>

        <div className="row">
          <label>
            <span className="label">Date</span>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label>
            <span className="label">Time slot</span>
            <select value={time} onChange={(e) => setTime(e.target.value)} required>
              <option value="">Select time</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="row">
          <label>
            <span className="label">People</span>
            <div className="people-control">
              <button
                type="button"
                aria-label="Decrease"
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value || 1, 10))}
              />
              <button
                type="button"
                aria-label="Increase"
                onClick={() => setPeople((p) => Math.min(20, p + 1))}
              >
                +
              </button>
            </div>
          </label>

          <label className="label-full">
            <span className="label">Special requests</span>
            <input
              type="text"
              placeholder="e.g. high-chair, window seat"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="actions">
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Requesting..." : "Request Table"}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setDate("");
              setTime("");
              setPeople(2);
              setNotes("");
              setError("");
            }}
          >
            Reset
          </button>
        </div>

        <p className="help">
          Need immediate help? Call <strong>+91 1800-123-4567</strong>
        </p>
      </form>
    </div>
  );
};

export default BookTableCard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [name, setName] = useState("");
  const [mentors, setMentors] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [price, setPrice] = useState(0);
  const [mentorId, setMentorId] = useState("");
  const [initialMentorId, setInitialMentorId] = useState("");
  const [hasMentorChanged, setHasMentorChanged] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  // Define the time range for valid time selections
  const minTime = new Date();
  minTime.setHours(18, 0, 0); // 6 PM

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0); // 10 PM

  useEffect(() => {
    if (startTime) {
      const durationInMinutes = parseInt(duration, 10);
      const maxEndTime = new Date(startTime.getTime() + 60 * 60000); // 60 minutes max range
      const newEndTime = new Date(
        startTime.getTime() + durationInMinutes * 60000
      ); // Duration-based end time
      setEndTime(newEndTime > maxEndTime ? maxEndTime : newEndTime);
    }
    fetchMentors();
  }, [startTime, duration]);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    const randomIndex = Math.floor(Math.random() * mentors.length);
    const assignedMentorId = mentors[randomIndex].id;
    setMentorId(assignedMentorId);
    setInitialMentorId(assignedMentorId); // Set the initial mentor ID
  };

  const fetchMentors = () => {
    axios
      .get("https://stud-mentor-slot-booking-backend.onrender.com/mentors")
      .then((response) => {
        setMentors(response.data); // Update state with fetched data
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleMentorChange = (e) => {
    const selectedMentorId = e.target.value;
    setMentorId(selectedMentorId);

    if (!hasMentorChanged) {
      setPrice(price + 1000);
      setHasMentorChanged(true);
    }
  };

  const handleEndTimeChange = (date) => {
    if (date && startTime) {
      const timeDifference = (date - startTime) / 60000; // Difference in minutes
      if (timeDifference <= 60) {
        setEndTime(date);
      }
    }
  };

  const handleDurationChange = (e) => {
    const selectedDuration = e.target.value;
    setDuration(selectedDuration);

    // Update price based on duration
    switch (selectedDuration) {
      case "30":
        setPrice(2000);
        break;
      case "45":
        setPrice(3000);
        break;
      case "60":
        setPrice(4000);
        break;
      default:
        setPrice(0);
        break;
    }
  };

  const handleAreaOfInterestChange = (e) => {
    setAreaOfInterest(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the required fields
    if (
      !name ||
      !email ||
      !selectedDate ||
      !startTime ||
      !endTime ||
      !areaOfInterest ||
      !mentorId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = {
      name,
      email,
      selectedDate: selectedDate.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: parseInt(duration, 10), // Ensure duration is an integer
      areaOfInterest,
      price,
      mentorId,
    };

    try {
      const response = await axios.post(
        "https://stud-mentor-slot-booking-backend.onrender.com/bookings",
        formData
      );
      console.log("Appointment booked successfully", response.data);
      const selectedMentor = mentors.find((mentor) => mentor.id === mentorId);

      // Redirect to the payment page
      navigate("/payment", {
        state: { ...formData, mentorName: selectedMentor?.mentor_name },
      });
    } catch (error) {
      console.error(
        "There was an error booking the appointment!",
        error.response?.data || error.message
      );
      alert("There was an error booking the appointment. Please try again.");
    }
  };

  return (
    <div className="container">
      <div id="body_header">
        <h3>
          Book <span>1X1</span>
        </h3>
        <p>From resume to final interview prep</p>
        <p>Get ready for your MBA campus placements</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name*:</label>
        <input
          type="text"
          id="name"
          name="user_name"
          placeholder="Enter Name"
          required
          pattern="[a-zA-Z0-9]+"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="mail">Email*:</label>
        <input
          type="email"
          id="mail"
          name="user_email"
          placeholder="Enter Your mail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="appointment_for">Area of interest*:</label>
        <select
          id="appointment_for"
          name="appointment_for"
          value={areaOfInterest}
          onChange={handleAreaOfInterestChange}
          required
        >
          <option value="">--</option>
          <option value="FMCG Sales">FMCG Sales</option>
          <option value="Equity Research">Equity Research</option>
          <option value="Corporate Finance">Corporate Finance</option>
          <option value="Supply Chain Management">
            Supply Chain Management
          </option>
        </select>

        <label htmlFor="duration">Duration*:</label>
        <select
          id="duration"
          name="duration"
          value={duration}
          onChange={handleDurationChange}
          required
        >
          <option value="">--</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>

        <label htmlFor="date">Date*:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MM/dd/yyyy"
          placeholderText="Select date"
          required
        />

        <label htmlFor="startTime">Start Time*:</label>
        <DatePicker
          selected={startTime}
          onChange={handleStartTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          minTime={minTime}
          maxTime={maxTime}
          dateFormat="h:mm aa"
          placeholderText="Choose start time"
          required
        />

        <label htmlFor="endTime">End Time*:</label>
        <DatePicker
          selected={endTime}
          onChange={handleEndTimeChange}
          placeholderText="End time"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          minTime={startTime || minTime}
          maxTime={maxTime}
          dateFormat="h:mm aa"
          required
          readOnly
        />
        {duration !== "" && startTime && areaOfInterest !== "" ? (
          <div>
            <label htmlFor="mentor">{`Assigned mentor for ${areaOfInterest}`}</label>
            <select value={mentorId} onChange={handleMentorChange} required>
              {mentors
                .filter(
                  (mentor) => mentor.areas_of_expertise === areaOfInterest
                )
                .map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.mentor_name}
                  </option>
                ))}
            </select>
            <p className="price">
              price : <span>{`Rs ${price}/-`}</span>
            </p>
          </div>
        ) : (
          <div></div>
        )}
        <div className="submit-btn-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Home;

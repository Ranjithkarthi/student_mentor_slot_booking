const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

// Define database path
const dbPath = (__dirname, "careercarve.db");

let db = null;

// Initialize database and server
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.error(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/mentors", async (req, res) => {
  const dbQuery = "SELECT * from mentors";
  const dbResponse = await db.all(dbQuery);
  res.send(dbResponse);
});

app.post("/students", async (req, res) => {
  const { studentName, availability, areaOfInterest } = req.body;

  try {
    const dbQuery = `
      INSERT INTO students (student_name, availability, area_of_interest)
      VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(dbQuery, [
      id,
      studentName,
      availability,
      areaOfInterest,
    ]);
    console.log(dbResponse);
  } catch (error) {
    console.error(`Error inserting record: ${error.message}`);
    res.status(500).send("Error adding record");
  }
});

app.post("/bookings", async (req, res) => {
  const {
    name,
    email,
    selectedDate,
    startTime,
    endTime,
    duration,
    areaOfInterest,
    price,
    mentorId,
  } = req.body;

  if (!name || !email || !selectedDate || !startTime || !endTime || !areaOfInterest || !mentorId) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const dbQuery = `
      INSERT INTO bookings (name, email, selected_date, start_time, end_time, duration, area_of_interest, price, mentor_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const dbResponse = await db.run(dbQuery, [
      name,
      email,
      selectedDate,
      startTime,
      endTime,
      duration,
      areaOfInterest,
      price,
      mentorId,
    ]);

    res.status(200).send({ bookingId: dbResponse.lastID });
  } catch (error) {
    console.error(`Error creating booking: ${error.message}`);
    res.status(500).send("Error creating booking");
  }
});


app.get("/bookings", async (req, res) => {
  try {
    const dbQuery = "SELECT * FROM bookings";
    const dbResponse = await db.all(dbQuery);
    res.status(200).json(dbResponse);
  } catch (error) {
    console.error(`Error fetching bookings: ${error.message}`);
    res.status(500).send("Error fetching bookings");
  }
});

const { google } = require("googleapis");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const tz = require("dayjs/plugin/timezone");
const { auth } = require("../auth/auth");
require("dotenv").config();

dayjs.extend(utc);
dayjs.extend(tz);
const sheets = google.sheets({ version: "v4", auth });

const submitResponse = async (req, res) => {
  try {
    const { name, companyName, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const newRow = [
      [
        name,
        companyName,
        email,
        message,
        dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm"),
      ],
    ];

    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: { values: newRow },
    });

    res.json({ message: "Data saved successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error.", details: error.message });
  }
};

module.exports = { submitResponse };

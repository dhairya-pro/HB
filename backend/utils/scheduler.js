import { google } from "googleapis";
import auth from "./auth.js";
import moment from "moment-timezone";

const calendar = google.calendar({ version: "v3", auth });


export async function createGoogleMeetEvent(doctorEmail, patientEmail, date, time) {
    const startDateTime = moment(date)
    .tz("UTC")
    .set({
      hour: moment(time, "hh:mm A").hour(),
      minute: moment(time, "hh:mm A").minute(),
      second: 0,
    })
    .toISOString();
  console.log(patientEmail,doctorEmail)
  const endDateTime = moment(startDateTime).add(30, "minutes").toISOString();
  if (!patientEmail || !doctorEmail) {
    console.error("❌ Error: One or both attendee emails are missing!");
    throw new Error("Attendee email addresses are required.");
  }

    const event = {
        summary: "Doctor Appointment",
        start: { dateTime: startDateTime, timeZone: "UTC" },
        end: { dateTime: endDateTime, timeZone: "UTC" },
        attendees: [{ email: doctorEmail }, { email: patientEmail }],
        conferenceData: {
            createRequest: { requestId: `${Date.now()}`, conferenceSolutionKey: { type: "hangoutsMeet" } }
        }
    };

    const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1
    });

    return response.data.hangoutLink;
}


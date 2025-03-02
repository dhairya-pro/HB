import { google } from "googleapis";
import { readFileSync } from "fs";


// const credentials = JSON.parse(readFileSync('/backend/centering-rider-452311-b7-3ef94849b398.json'))

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/calendar"],
});

export default auth;

import 'dotenv/config';
import http from 'http';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server




server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import http from 'http';
import app from './App.js'; // Importam motorul facut mai sus
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Serverul a pornit pe portul ${PORT} si incearca sa creeze Baza de Date...`);
});
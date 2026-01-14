import express from 'express';
import db from '../dbConfig.js';

let createDBRouter = express.Router();

createDBRouter.route('/create').get(async (req, res) => {
  try {
    // db.sync este comanda care creeaza tabelele
    // force: true  => STERGE tabelele vechi si le creeaza de la zero (pierzi datele)
    // force: false => Nu sterge nimic, doar incearca sa creeze daca nu exista
    
    await db.sync({ force: true }); 
    
    res.status(201).json({ message: "Db created" });
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default createDBRouter;
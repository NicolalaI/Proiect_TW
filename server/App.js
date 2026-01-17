import express from 'express';
import cors from 'cors';
import DB_Init from './entities/DB_init.js';
import createDBRouter from './routes/createDBRouter.js';
import userRouter from './routes/UserRouter.js';
import projectRouter from './routes/ProjectRouter.js';
import bugRouter from './routes/BugRouter.js';
import authRouter from './routes/auth-router.js';
import genericErrorHandler from './middleware/generic-error-middleware.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- AICI ESTE CHEIA ---
// Aceasta functie va verifica daca exista tabelele in MySQL.
// Daca nu, le creeaza.
DB_Init();

app.use((req, res, next) => {
    console.log(`📢 Cineva a accesat ruta: ${req.url} la ora ${new Date().toLocaleTimeString()}`);
    
    // FOARTE IMPORTANT: Trebuie sa apelam next()!
    // Altfel cererea ramane blocata aici si nu ajunge niciodata la baza de date.
    next(); 
});

// Momentan nu punem rutele (app.use('/api'...)) pentru ca nu le-ai creat inca.
// Le vom adauga dupa ce vedem ca merge baza de date.
app.use('/api', createDBRouter);
app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/api', bugRouter);
app.use('/api/auth', authRouter);

// Middleware pentru prinderea erorilor neprevazute
app.use(genericErrorHandler);

export default app;
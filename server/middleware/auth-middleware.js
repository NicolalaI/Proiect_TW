import jwt from 'jsonwebtoken';

// Aceeasi cheie ca in auth-controller! (Ideal ar fi in .env, dar pt examen e ok aici)
const JWT_SECRET = "cheia_mea_secreta_pentru_examen";

const verifyToken = (req, res, next) => {
    // 1. Cautam token-ul in header-ul cererii
    // Clientul trimite header-ul: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: "Nu ai oferit un token de acces!" });
    }

    // Luam doar token-ul, fara cuvantul "Bearer"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Format token invalid!" });
    }

    // 2. Verificam daca token-ul e valid
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token expirat sau invalid!" });
        }

        // 3. Daca e valid, salvam ID-ul userului in cerere (req)
        // Astfel, in pasul urmator vom sti EXACT cine a facut cererea
        req.userId = decoded.id;
        
        next(); // Permitem accesul mai departe
    });
};

export default verifyToken;
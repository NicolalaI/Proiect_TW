import User from '../entities/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Cheia secreta pentru token (In realitate se tine in .env, dar pt examen e ok aici)
const JWT_SECRET = "cheia_mea_secreta_pentru_examen";

// 1. REGISTER (Inlocuieste create user-ul simplu)
const register = async (req, res) => {
    try {
        // Userul trimite: Nume, Email, Password
        // Modelul User are deja hook-ul 'beforeCreate' care va cripta parola!
        const newUser = await User.create(req.body);
        
        return res.status(201).json({
            message: "User creat cu succes!",
            user: {
                id: newUser.UserId,
                email: newUser.Email,
                nume: newUser.Nume
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Eroare la inregistrare. Verifica daca emailul e unic." });
    }
};

// 2. LOGIN (Verifica parola si da Token-ul)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // a) Cautam userul dupa email
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: "Userul nu exista." });
        }

        // b) Verificam parola (Criptata din baza vs Parola primita)
        const isValid = await bcrypt.compare(password, user.Password);
        if (!isValid) {
            return res.status(401).json({ message: "Parola incorecta." });
        }

        // c) Generam Token-ul (Legitimatia)
        // In token punem ID-ul userului ca sa stim cine e la urmatoarele cereri
        const token = jwt.sign({ id: user.UserId }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: "Autentificare reusita!",
            token: token,
            userId: user.UserId,
            nume: user.Nume
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Eroare server" });
    }
};

export { register, login };
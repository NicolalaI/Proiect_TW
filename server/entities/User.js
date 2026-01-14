import db from '../dbConfig.js';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

const User = db.define("User", {
    UserId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Nume: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    Password: {
        type: Sequelize.STRING,
      allowNull: false
    }
}, {
    hooks: {
        // Inainte sa salvam userul, criptam parola
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.Password = await bcrypt.hash(user.Password, salt);
        }
    }
});

export default User;
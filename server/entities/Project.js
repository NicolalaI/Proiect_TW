import db from '../dbConfig.js';
import { Sequelize } from 'sequelize';

const Project = db.define("Project", {
    ProjectId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    NumeProiect: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Repository: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Descriere: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

export default Project;
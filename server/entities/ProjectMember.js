import db from '../dbConfig.js';
import { Sequelize } from 'sequelize';

const ProjectMember = db.define("ProjectMember", {
  Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ProjectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // AICI E CHEIA: 'MP' (Membru Proiect) sau 'TST' (Tester)
    Role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'TST' 
    }
});

export default ProjectMember;
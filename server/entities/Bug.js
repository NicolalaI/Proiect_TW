import db from '../dbConfig.js';
import { Sequelize } from 'sequelize';

const Bug = db.define("Bug", {
    BugId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Severity: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Priority: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Descriere: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Subject: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Status: {
        type: Sequelize.STRING,
        defaultValue: "Open" // Open, In Progress, Resolved
    },
    // Link catre commit-ul care a CAUZAT bug-ul (cerinta TST)
    CommitLink: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // Link catre commit-ul care a REZOLVAT bug-ul (cerinta MP)
    ResolutionCommitLink: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ProjectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ReporterId: { // Cine a gasit bug-ul (TST sau MP)
        type: Sequelize.INTEGER,
        allowNull: false
    },
    AssigneeId: { // Cine il rezolva (Doar MP)
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

export default Bug;
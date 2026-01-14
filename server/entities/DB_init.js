import mysql from 'mysql2/promise';
import env from 'dotenv';
import User from './User.js';
import Project from './Project.js';
import Bug from './Bug.js';
import ProjectMember from './ProjectMember.js';

env.config();

function Create_DB() {
    let conn;

    mysql.createConnection({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    })
    .then((connection) => {
        conn = connection;
        return connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
    })
    .then(() => {
        return conn.end();
    })
    .catch((err) => {
        console.warn(err.stack);
    });
}

function FK_Config() {
    //Relatia User-Project(Many-to-Many prin ProjectMember)
    User.belongsToMany(Project, { through: ProjectMember, foreignKey: "UserId", as: "Projects", onDelete: 'CASCADE' });
    Project.belongsToMany(User, { through: ProjectMember, foreignKey: "ProjectId", as: "Members", onDelete: 'CASCADE' });

    //Relatiile Bug-urilor(One-to-Many)
    Project.hasMany(Bug, { foreignKey: 'ProjectId', as: 'Bugs', onDelete: 'CASCADE' });
    Bug.belongsTo(Project, { foreignKey: 'ProjectId', as: 'Project', onDelete: 'CASCADE' });

    // Bug raportat de User(Tester)
    User.hasMany(Bug, { foreignKey: 'ReporterId', as: 'ReportedBugs' });
    Bug.belongsTo(User, { foreignKey: 'ReporterId', as: 'Reporter' });

    // Bug alocat unui User(MP)
    User.hasMany(Bug, { foreignKey: 'AssigneeId', as: 'AssignedBugs' });
    Bug.belongsTo(User, { foreignKey: 'AssigneeId', as: 'Assignee' });
}

function DB_Init() {
    Create_DB();
    FK_Config();
}

export default DB_Init;
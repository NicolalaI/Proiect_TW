import db from '../dbConfig.js';
import User from './User.js';
import Project from './Project.js';
import Bug from './Bug.js';
import ProjectMember from './ProjectMember.js';

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

async function DB_Init() {
    try {
        FK_Config();
        await db.authenticate();
        console.log('Connection has been established successfully.');
        await db.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default DB_Init;
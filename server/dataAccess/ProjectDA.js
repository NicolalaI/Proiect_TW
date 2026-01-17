import Project from '../entities/Project.js';
import Bug from '../entities/Bug.js';
import User from '../entities/User.js';
import LikeOp from './Operators.js';

// 1. Creare Proiect
async function createProject(project) {
    let newProject = await Project.create(project);

    // Daca avem CreatorId (trimis din frontend), il facem automat MP
    if (project.CreatorId) {
        let user = await User.findByPk(project.CreatorId);
        if (user) {
            await newProject.addMember(user, { through: { Role: 'MP' } });
        }
    }

    return newProject;
}

// 2. Gasire toate proiectele
async function getProjects() {
    return await Project.findAll({ include: ['Bugs'] });
}

// 3. MODIFICAT: Aducem si bug-urile
async function getProjectById(id) {
    return await Project.findByPk(id, {
        include: [
            { model: Bug, as: 'Bugs' },       // Aducem Bug-urile
            { model: User, as: 'Members' }    // <--- 2. Aducem Membrii (Echipa)
        ]
    });
}

// 4. Stergere Proiect
async function deleteProject(id) {
    let elem = await Project.findByPk(id);
    if (!elem) {
        console.log("Proiectul nu exista");
        return;
    }
    return await elem.destroy();
}

// 5. Update Proiect
async function updateProject(id, project) {
    let elem = await Project.findByPk(id);
    if (!elem) {
        console.log("Proiectul nu exista");
        return null;
    }
    return await elem.update(project);
}

async function getProjectsWithFilterAndPagination(filter) {
    if (!filter.take) filter.take = 10;
    if (!filter.skip) filter.skip = 1;

    let whereClause = {};
    if (filter.numeProiect) whereClause.NumeProiect = { [LikeOp]: `%${filter.numeProiect}%` };
    if (filter.repo) whereClause.Repository = { [LikeOp]: `%${filter.repo}%` };

    // SORTARE (Nou)
    // Default: Dupa ID
    let orderClause = [['ProjectId', 'ASC']];

    // Ex: ?sortBy=NumeProiect&sortOrder=ASC
    if (filter.sortBy && filter.sortOrder) {
        orderClause = [[filter.sortBy, filter.sortOrder.toUpperCase()]];
    }

    return await Project.findAndCountAll({
        distinct: true,
        include: ['Bugs', 'Members'], // Pastram include-ul de care vorbeam (sa vedem bug-urile)
        where: whereClause,
        order: orderClause, // <--- Aplicam sortarea
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take),
    });
}

// Adauga membru in echipa
async function addTeamMember(projectId, userId, role) {
    let project = await Project.findByPk(projectId);
    if (!project) return { error: "Project not found" };

    let user = await User.findByPk(userId);
    if (!user) return { error: "User not found" };

    // Validam rolul (sa fie doar MP sau TST)
    if (role !== 'MP' && role !== 'TST') {
        return { error: "Invalid role. Must be 'MP' or 'TST'" };
    }

    // through: { Role: role } este modul prin care setam valoarea in tabela de legatura
    return await project.addMember(user, { through: { Role: role } });
}

export {
    createProject,
    getProjects,
    getProjectById,
    deleteProject,
    updateProject,
    getProjectsWithFilterAndPagination,
    addTeamMember
};
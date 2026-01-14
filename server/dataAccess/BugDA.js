import Bug from '../entities/Bug.js';
import User from '../entities/User.js';
import Project from '../entities/Project.js';
import LikeOp from './Operators.js';

// 1. Creare Bug
async function createBug(bug) {
    return await Bug.create(bug);
}

// 2. Gasire toate bug-urile
async function getBugs() {
    return await Bug.findAll({
        include: [
            { model: Project, as: 'Project' },
            { model: User, as: 'Assignee' },  
            { model: User, as: 'Reporter' }
        ]
    });
}

// 3. Gasire dupa ID
async function getBugById(id) {
    return await Bug.findByPk(id, {
        include: [
            { model: Project, as: 'Project' },    // Vad din ce proiect face parte
            { model: User, as: 'Assignee' },      // Vad cine il repara (Nume, Email)
            { model: User, as: 'Reporter' }       // Vad cine l-a raportat
        ]
    });
}

// 4. Update Bug
async function updateBug(id, bug) {
    let elem = await Bug.findByPk(id);
    if (!elem) {
        console.log("Bug-ul nu exista");
        return null;
    }
    return await elem.update(bug);
}

// 5. Stergere Bug
async function deleteBug(id) {
    let elem = await Bug.findByPk(id);
    if (!elem) {
        console.log("Bug-ul nu exista");
        return;
    }
    return await elem.destroy();
}

// 6. FILTRARE AVANSATA (Useri, Proiecte, Prioritate)
async function getBugsWithFilterAndPagination(filter) {
    // Valori default pentru paginare
    if (!filter.take) filter.take = 10;
    if (!filter.skip) filter.skip = 1;

    let whereClause = {};

    // --- Filtre Text (Like) ---
    if (filter.subject)
        whereClause.Subject = { [LikeOp]: `%${filter.subject}%` };
    
    if (filter.status)
        whereClause.Status = { [LikeOp]: `%${filter.status}%` };

    if (filter.priority)
        whereClause.Priority = { [LikeOp]: `%${filter.priority}%` };

    // --- Filtre Exacte (ID-uri) ---
    // Aici rezolvam cerinta ta: "Bug-urile pe care le testeaza un user"
    if (filter.assigneeId)
        whereClause.AssigneeId = filter.assigneeId;

    // "Bug-urile raportate de un user"
    if (filter.reporterId)
        whereClause.ReporterId = filter.reporterId;

    // "Bug-urile dintr-un anumit proiect"
    if (filter.projectId)
        whereClause.ProjectId = filter.projectId;

    return await Bug.findAndCountAll({
        distinct: true,
        where: whereClause,
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take),
    });
}

export {
    createBug,
    getBugs,
    getBugById,
    updateBug,
    deleteBug,
    getBugsWithFilterAndPagination
};
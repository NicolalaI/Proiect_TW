import Bug from '../entities/Bug.js';
import User from '../entities/User.js';
import Project from '../entities/Project.js';
import LikeOp from './Operators.js';
import Sequelize from 'sequelize';

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
    // 1. Paginare (Default: Pagina 1, cate 10 pe pagina)
    if (!filter.take) filter.take = 10;
    if (!filter.skip) filter.skip = 1;

    // 2. Filtrare (Where)
    let whereClause = {};

    // --- Filtre Text (Like) ---
    if (filter.subject)
        whereClause.Subject = { [LikeOp]: `%${filter.subject}%` };
    
    if (filter.status)
        whereClause.Status = { [LikeOp]: `%${filter.status}%` };

    if (filter.priority)
        whereClause.Priority = { [LikeOp]: `%${filter.priority}%` };

    // --- Filtre Exacte (ID-uri) ---
    if (filter.assigneeId)
        whereClause.AssigneeId = filter.assigneeId;

    if (filter.reporterId)
        whereClause.ReporterId = filter.reporterId;

    if (filter.projectId)
        whereClause.ProjectId = filter.projectId;

    // 3. SORTARE (Adaptat dupa modelul User)
    // Default: Sortam dupa BugId crescator (sau poti pune 'createdAt' 'DESC')
    let orderClause = [['BugId', 'DESC']]; 

    // Daca primim parametri de sortare, ii folosim
    // Ex: ?sortBy=Priority&sortOrder=DESC
    if (filter.sortBy === 'Priority') {
    // Aici facem magia. Construim o regula custom de sortare.
    const customOrder = Sequelize.literal(`
        CASE Priority
            WHEN 'Critical' THEN 1
            WHEN 'High' THEN 2
            WHEN 'Medium' THEN 3
            WHEN 'Low' THEN 4
            ELSE 5
        END
    `);
    
    // Setam directia (ASC = Critical primul, DESC = Low primul)
    orderClause = [[customOrder, filter.sortOrder || 'ASC']];
} 
else if (filter.sortBy && filter.sortOrder) {
    // Pentru orice alt camp (Status, Subject, etc) ramane sortarea standard
    orderClause = [[filter.sortBy, filter.sortOrder.toUpperCase()]];
}

    return await Bug.findAndCountAll({
        distinct: true,
        // Poti decomenta include-urile daca vrei sa primesti si detaliile (Proiect, Useri)
        include: [
           'Project', 
           'Reporter', 
           'Assignee'
        ], 
        where: whereClause,
        order: orderClause, // <--- Aici aplicam sortarea dinamica
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
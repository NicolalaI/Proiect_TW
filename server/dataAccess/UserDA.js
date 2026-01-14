import User from '../entities/User.js';
import Project from '../entities/Project.js';
import LikeOp from './Operators.js'; // Asigura-te ca ai fisierul Operators.js creat anterior

// 1. Creare User (Register)
async function createUser(user) {
    return await User.create(user);
}

// 2. Gasire toti userii
async function getUsers() {
    return await User.findAll();
}

// 3. Gasire dupa ID
async function getUserById(id) {
    return await User.findByPk(id, {
        include: [{ model: Project, as: 'Projects' }]
    });
}

// 4. Stergere
async function deleteUser(id) {
    let elem = await User.findByPk(id);
    if (!elem) {
        console.log("Acest user nu exista");
        return;
    }
    return await elem.destroy();
}

// 5. Update
async function updateUser(id, user) {
    let elem = await User.findByPk(id);
    if (!elem) {
        console.log("Acest user nu exista");
        return null;
    }
    return await elem.update(user);
}

// 6. Filtrare avansata 
// URL Ex: /api/usersFilter?email=test&take=5
async function getUserWithFilterAndPagination(filter) {
    // 1. Paginare
    if (!filter.take) filter.take = 10;
    if (!filter.skip) filter.skip = 1;

    // 2. Filtrare (Where)
    let whereClause = {};
    if (filter.nume) whereClause.Nume = { [LikeOp]: `%${filter.nume}%` };
    if (filter.email) whereClause.Email = { [LikeOp]: `%${filter.email}%` };

    // Filtrare pe Proiecte (Join)
    let whereIncludeClause = {};
    if (filter.projectName) {
        whereIncludeClause.NumeProiect = { [LikeOp]: `%${filter.projectName}%` };
    }

    // 3. SORTARE (Codul NOU)
    // Default: Sortam dupa ID crescator daca nu se cere altceva
    let orderClause = [['UserId', 'ASC']]; 
    
    // Daca userul trimite parametrii, ii folosim
    // Ex: ?sortBy=Nume&sortOrder=DESC
    if (filter.sortBy && filter.sortOrder) {
        orderClause = [[filter.sortBy, filter.sortOrder.toUpperCase()]];
    }

    return await User.findAndCountAll({
        distinct: true,
        include: [
            {
                model: Project,
                as: 'Projects',
                where: whereIncludeClause,
                required: false
            }
        ],
        where: whereClause,
        order: orderClause, // <--- Aici aplicam sortarea
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take),
    });
}

 
export {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    getUserWithFilterAndPagination
};
import express from 'express';
import { 
    createUser, 
    getUserById, 
    getUsers, 
    deleteUser, 
    updateUser, 
    getUserWithFilterAndPagination 
} from "../dataAccess/UserDA.js";

let userRouter = express.Router();

// POST /users -> Creeaza un user
userRouter.route('/users').post(async (req, res) => {
    try {
        return res.status(201).json(await createUser(req.body));
    } catch (err) {
        return res.status(500).json({ message: "Eroare la creare user", error: err.message });
    }
});

// GET /users -> Primeste toti userii
userRouter.route('/users').get(async (req, res) => {
    return res.json(await getUsers());
});

// GET /usersFilter -> Filtrare
userRouter.route('/usersFilter').get(async (req, res) => {
    return res.json(await getUserWithFilterAndPagination(req.query));
});

// Operatii pe ID
userRouter.route('/users/:id').get(async (req, res) => {
    return res.json(await getUserById(req.params.id));
});

userRouter.route('/users/:id').delete(async (req, res) => {
    return res.json(await deleteUser(req.params.id));
});

userRouter.route('/users/:id').put(async (req, res) => {
    let ret = await updateUser(req.params.id, req.body);
    
    if (!ret) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json(ret);
});

export default userRouter;
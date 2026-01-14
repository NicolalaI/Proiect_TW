import express from 'express';
import { 
    createBug, 
    getBugs, 
    getBugById, 
    updateBug, 
    deleteBug,
    getBugsWithFilterAndPagination 
} from "../dataAccess/BugDA.js";

let bugRouter = express.Router();

// POST /bugs -> Adaugare
bugRouter.route('/bugs').post(async (req, res) => {
    return res.status(201).json(await createBug(req.body));
});

// GET /bugs -> Lista simpla
bugRouter.route('/bugs').get(async (req, res) => {
    return res.json(await getBugs());
});

// GET /bugsFilter -> Filtrare complexa
// Ex: /api/bugsFilter?assigneeId=2&priority=High
bugRouter.route('/bugsFilter').get(async (req, res) => {
    return res.json(await getBugsWithFilterAndPagination(req.query));
});

// GET /bugs/:id -> Detalii
bugRouter.route('/bugs/:id').get(async (req, res) => {
    return res.json(await getBugById(req.params.id));
});

// PUT /bugs/:id -> Update
bugRouter.route('/bugs/:id').put(async (req, res) => {
    let ret = await updateBug(req.params.id, req.body);
    if (!ret) {
        return res.status(404).json({ message: "Bug not found" });
    }
    return res.json(ret);
});

// DELETE /bugs/:id -> Stergere
bugRouter.route('/bugs/:id').delete(async (req, res) => {
    return res.json(await deleteBug(req.params.id));
});

export default bugRouter;
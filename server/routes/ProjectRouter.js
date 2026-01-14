import express from 'express';
import { 
    createProject, 
    getProjects, 
    getProjectById, 
    deleteProject, 
    updateProject,
    getProjectsWithFilterAndPagination,
    addTeamMember
} from "../dataAccess/ProjectDA.js";

let projectRouter = express.Router();

// POST /projects
projectRouter.route('/projects').post(async (req, res) => {
    return res.status(201).json(await createProject(req.body));
});

// GET /projects
projectRouter.route('/projects').get(async (req, res) => {
    return res.json(await getProjects());
});

// GET /projectsFilter?take=2&skip=1
projectRouter.route('/projectsFilter').get(async (req, res) => {
    return res.json(await getProjectsWithFilterAndPagination(req.query));
});

// GET /projects/:id
projectRouter.route('/projects/:id').get(async (req, res) => {
    return res.json(await getProjectById(req.params.id));
});



// PUT /projects/:id (Update)
projectRouter.route('/projects/:id').put(async (req, res) => {
    let ret = await updateProject(req.params.id, req.body);
    if (!ret) {
        return res.status(404).json({ message: "Project not found" });
    }
    return res.json(ret);
});

// DELETE /projects/:id
projectRouter.route('/projects/:id').delete(async (req, res) => {
    return res.json(await deleteProject(req.params.id));
});

// POST /api/projects/:id/members
// Body: { "userId": 2, "role": "TST"}
projectRouter.route('/projects/:id/members').post(async (req, res) => {
    // Luam role din body, sau punem default 'TST' daca nu e specificat
    let role = req.body.role || 'TST';

    let ret = await addTeamMember(req.params.id, req.body.userId, role);

    if (ret && ret.error) {
        return res.status(404).json({ message: ret.error });
    }
    return res.status(201).json({ message: `User added to project as ${role}!` });
});

export default projectRouter;
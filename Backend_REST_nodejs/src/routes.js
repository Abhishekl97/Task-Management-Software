const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/users', controller.getUsers);
router.get("/users/:id", controller.getUsersByID);
router.post("/users", controller.addUser);
router.put("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.removeUser);

router.get('/projects', controller.getProjects);
router.get('/projects/:id', controller.getProjectsByID);
router.post("/projects", controller.addProject);
router.put("/projects/:id/name", controller.updateProjectName);
router.put("/projects/:id/description", controller.updateProjectDescription);
router.delete("/projects/:id", controller.removeProject);

router.get('/tasks', controller.getTasks);
router.get("/tasks/:id", controller.getTasksByID);
router.post("/tasks", controller.addTask);
router.put("/tasks/:id/name", controller.updateTaskName);
router.put("/tasks/:id/description", controller.updateTaskDescription);
router.put("/tasks/:id/status", controller.updateTaskStatus);
router.put("/tasks/:id/deadline", controller.updateTaskDeadline);
router.delete("/tasks/:id", controller.removeTask);

module.exports = router;
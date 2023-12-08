const pool = require('../../src/db');
const queries = require('./queries');

// TODO => If a User/Project/Task is not found the server connection should remain ON. Add a check for that!


//  Controllers for users
// TODO => reset the auto increment for tasks table -> ALTER SEQUENCE users_user_id_seq RESTART WITH 1; or ALTER TABLE users AUTO_INCREMENT = 1;
const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error, results) => {
        if (error) {
            console.error("Error getting users: ", error);
            return res.status(500).send("Error getting users.");
        }
        else {
            res.status(200).json(results.rows);
        }
    })
};

const getUsersByID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUsersByID, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (error) {
            console.error("Error getting user:", error);
            return res.status(500).send("Error getting user.");
        }
        else if (noUserFound) {
            res.status(404).send("User does not exist in the database.");
        }
        else {
            res.status(200).json(results.rows);
        }
    });
};

const addUser = (req, res) => {
    const {email_id, password} = req.body;
    if (!email_id || !password) {
        return res.status(400).send('Email id or Password is missing.');
    }
    else{
        // check if email_id exists
        pool.query(queries.checkEmailExists, [email_id], (error, results) => {
            if (error) {
                console.error("Error checking users existence: ", error);
                return res.status(500).send("Error checking users existence.");
            }
            else if (results.rows.length) {
                res.send("Email id already exists.");
            }
            else {
                // add user to db
                pool.query(queries.addUser, [email_id, password], (error, results) => {
                    if (error) {
                        console.error("Error adding user:", error);
                        return res.status(500).send("Error adding user.");
                    }
                    else {
                        res.status(201).send("User Created Successfully!");
                    }
                });
            }
        });
    }
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { password } = req.body;
    if (!password) {
        return res.status(400).send('Password is required.');
    }
    else{    
        pool.query(queries.getUsersByID, [id], (error, results) => {
            const noUserFound = !results.rows.length;
            if (error) {
                console.error("Error getting user id: ", error);
                return res.status(500).send("Error getting user id.");
            }
            else if (noUserFound) {
                res.status(404).send("User does not exist in the database.");
            }
            else {
                pool.query(queries.updateUser, [password, id], (error, results) => {
                    if (error) {
                        console.error("Error updating password:", error);
                        return res.status(500).send("Error updating password.");
                    }
                    else {
                        res.status(200).send("Password updated successfully!");
                    }
                });
            }
        });
    }
};

const removeUser = (req, res) => {
    const id  = parseInt(req.params.id);

    pool.query(queries.getUsersByID, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (error) {
            console.error("Error getting user id:", error);
            return res.status(500).send("Error getting user id.");
        }
        else if(noUserFound) {
            res.status(404).send("User does not exist in the database.");
        }
        else {
            pool.query(queries.removeUser, [id], (error, results) => {
                if (error) {
                    console.error("Error deleting user:", error);
                    return res.status(500).send("Error deleting user.");
                }
                else {
                    res.status(200).send("User deleted successfully!")
                }
            });
        }
    });
};


// Controllers for projects
// TODO => Check how to use the referencing key in this case the user_id form users table
// TODO => Rebuild the database to make sure that user_id is NOT NULL
// TODO => reset the auto increment for tasks table -> ALTER SEQUENCE projects_project_id_seq RESTART WITH 1; or ALTER TABLE projects AUTO_INCREMENT = 1;
const getProjects = (req, res) => {
    pool.query(queries.getProjects, (error, results) => {
        if (error) {
            console.error("Error getting projects:", error);
            return res.status(500).send("Error getting projects.");
        }
        else {
            res.status(200).json(results.rows);
        }
    })
};

const getProjectsByID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getProjectsByID, [id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (error) {
            console.error("Error getting project:", error);
            return res.status(500).send("Error getting project.");
        }
        else if (noProjectFound) {
            res.status(404).send("Project does not exist in the database.");
        }
        else {
            res.status(200).json(results.rows);
        }
    });
};


const addProject = (req, res) => {
    const { project_name, project_description, user_id } = req.body;
    const id = parseInt(req.params.id);

    if (!project_name || !project_description || !user_id) {
        return res.status(400).send('Project Name or Description or User id is missing.');
    }
    else{
        pool.query(queries.checkProjectExists, [project_name], (error, results) => {
            if (error) {
                console.error("Error checking project existence:", error);
                return res.status(500).send("Error checking project existence.");
            }
            else if (results.rows.length) {
                res.send("Project already exists.");
            }
            else {
                pool.query(queries.getUsersByID, [user_id], (error, results) => {
                    const noUserFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting user id:", error);
                        return res.status(500).send("Error getting user id.");
                    }
                    else if (noUserFound) {
                        res.status(404).send("User does not exist in the database.");
                    }
                    else {
                        pool.query(queries.addProject, [project_name, project_description, user_id], (error, results) => {
                            if (error) {
                                console.error("Error adding project:", error);
                                return res.status(500).send("Error adding project.");
                            }
                            else {
                                res.status(201).send('Project added Successfully!');
                            }
                        });
                    }
                });
            }
        });
    }
};

const updateProjectName = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_name } = req.body;
    if (!project_name) {
        return res.status(400).send('Project name is required.');
    }
    else{
        pool.query(queries.getProjectsByID, [id], (error, results) => {
            const noProjectFound = !results.rows.length;
            if (error) {
                console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else if (noProjectFound) {
                res.status(404).send("Project does not exist in the database.");
            }
            else {
                pool.query(queries.checkProjectExists, [project_name], (error, results) => {
                    if (error) {
                        console.error("Error checking project existence:", error);
                        return res.status(500).send("Error checking project existence.");
                    }
                    else if (results.rows.length) {
                        res.send("Project name already exists for another project.");
                    }
                    else {
                        pool.query(queries.updateProjectName, [project_name, id], (error, results) => {
                            if (error) {
                                console.error("Error updating project name:", error);
                                return res.status(500).send("Error updating project name.");
                            }
                            else {
                                res.status(200).send("Project name updated successfully!");
                            }
                        });
                    }
                });
            }
        });
    }
};

const updateProjectDescription = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_description } = req.body;

    if (!project_description) {
        return res.status(400).send('Project description is required.');
    }
    else{
        pool.query(queries.getProjectsByID, [id], (error, results) => {
            const noProjectFound = !results.rows.length;
            if (error) {
                console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else if (noProjectFound) {
                res.status(404).send("Project does not exist in the database.");
            }
            else {
                pool.query(queries.updateProjectDescription, [project_description, id], (error, results) => {
                    if (error) {
                        console.error("Error updaing project description:", error);
                        return res.status(500).send("Error updating project description.");
                    }
                    else {
                        res.status(200).send("Project description updated successfully!");
                    }
                });
            }
        });
    }
};

const removeProject = (req, res) => {
    const id  = parseInt(req.params.id);

    pool.query(queries.getProjectsByID, [id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (error) {
            console.error("Error getting project id:", error);
            return res.status(500).send("Error getting project id.");
        }
        else if(noProjectFound) {
            res.status(404).send("Project does not exist in the database.");
        }
        else {
            pool.query(queries.removeProject, [id], (error, results) => {
                if (error) {
                    console.error("Error deleting project:", error);
                    return res.status(500).send("Error deleting project.");
                }
                else {
                    res.status(200).send("Project deleted successfully!")
                }
            });
        }
    });
};

// Controllers for Tasks
// TODO => reset the auto increment for tasks table -> ALTER SEQUENCE tasks_task_id_seq RESTART WITH 1; or ALTER TABLE tasks AUTO_INCREMENT = 1;
const getTasks = (req, res) => {
    const { project_id } = req.body;
    
    if(!project_id){
        return res.status(400).send('Project id is required.');
    }
    else {
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            if (error){
                console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else {
                const noProjectFound = !results.rows.length;
                if (noProjectFound) {
                    res.status(404).send("Project does not exist in the database.");
                }
                else {
                    pool.query(queries.getTasks, [project_id], (error, results) => {
                        if (error) {
                            console.error("Error getting tasks:", error);
                            return res.status(500).send("Error getting tasks.");
                        }
                        else {
                            res.status(200).json(results.rows);
                        }
                    })
                }
            }
        })
    }
};

const getTasksByID = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id } = req.body;

    if(!project_id){
        return res.status(400).send('Project id is required.');
    }
    else {
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            if (error){
                console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else {
                const noProjectFound = !results.rows.length;
                if (noProjectFound) {
                    res.status(404).send("Project does not exist in the database.");
                }
                else {
                    pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                        const noTaskFound = !results.rows.length;
                        if (error) {
                            console.error("Error getting task:", error);
                            return res.status(500).send("Error getting task.");
                        }
                        else if (noTaskFound) {
                            res.status(404).send("Task does not exist for the given project in the database.");
                        }
                        else {
                            res.status(200).json(results.rows);
                        }
                    });
                }
            }
        });
    }
};

const addTask = (req, res) => {
    const { project_id, task_name, task_description, user_id, status, deadline} = req.body;
    const id = parseInt(req.params.id);
    const created_at = new Date();
    const updated_at = new Date();
    
    if (!task_name || !task_description || !user_id || !status || !deadline || !project_id) {
        return res.status(400).send('One of inputs is missing.');
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            if (error){
                console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else {
                const noProjectFound = !results.rows.length;
                if (noProjectFound) {
                    res.status(404).send("Project does not exist in the database.");
                }
                else {
                    pool.query(queries.checkTaskExists, [task_name, project_id], (error, results) => {
                        if (error) {
                            console.error("Error checking task existence:", error);
                            return res.status(500).send("Error checking task existence.");
                        }
                        else if (results.rows.length) {
                            res.send("Task already exists.");
                        }
                        else {
                            pool.query(queries.getUsersByID, [user_id], (error, results) => {
                                const noUserFound = !results.rows.length;
                                if (error) {
                                    console.error("Error getting user id:", error);
                                    return res.status(500).send("Error getting user id.");
                                }
                                if (noUserFound) {
                                    res.status(404).send("User does not exist in the database.");
                                }
                                else {
                                    pool.query(queries.addTask, [task_name, task_description, user_id, status, deadline, created_at, updated_at, project_id], (error, results) => {
                                        if (error) {
                                            console.error("Error adding task:", error);
                                            return res.status(500).send("Error adding task.");
                                        }
                                        else {
                                            res.status(201).send('Task added Successfully!');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};

const updateTaskName = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, task_name} = req.body;
    
    if(!task_name || !project_id){
        return res.status(400).send('Task name or project id or user id is missing.');
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	        const noProjectFound = !results.rows.length;
            if (error) {
	            console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else if (noProjectFound) {
                res.status(404).send("Project does not exist in the database.");
            }
            else {
		        pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).send("Error getting task id.");
                    }
                    else if (noTaskFound) {
                        res.status(404).send("Task does not exist for the given project in the database.");
                    }
                    else {
                        pool.query(queries.checkTaskExists, [task_name, project_id], (error, results) => {
                            if (error) {
                                console.error("Error checking task existence:", error);
                                return res.status(500).send("Error checking task existence.");
                            }
                            else if (results.rows.length) {
                                res.send("Task name already exists for another task in the given project.");
                            }
                            else {
                                pool.query(queries.updateTaskName, [task_name, id, project_id], (error, results) => {
                                    if (error) {
                                        console.error("Error updating task:", error);
                                        return res.status(500).send("Error updating task.");
                                    }
                                    else {
                                        res.status(200).send("Task name updated successfully!");
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

const updateTaskDescription = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, task_description } = req.body;
    
    if(!task_description || !project_id){
        return res.status(400).send('Task description or project id or user id is missing.');
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	    const noProjectFound = !results.rows.length;
            if (error) {
	        console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else if (noProjectFound) {
                res.status(404).send("Project does not exist in the database.");
            }
            else {
		        pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).send("Error getting task id.");
                    }
                    else if (noTaskFound) {
                        res.status(404).send("Task does not exist for the given project in the database.");
                    }
                    else {
                        pool.query(queries.updateTaskDescription, [task_description, id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error updating task description:", error);
                                return res.status(500).send("Error updating task description.");
                            }
                            else {
                                res.status(200).send("Task description updated successfully!");
                            }
                        });
                    }
                });
            }
        });
    }
};

const updateTaskStatus = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, status } = req.body;
    
    if(!status || !project_id){
        return res.status(400).send('Status or project id or user id is missing.');
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	    const noProjectFound = !results.rows.length;
            if (error) {
	        console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else if (noProjectFound) {
                res.status(404).send("Project does not exist in the database.");
            }
            else {
                pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).send("Error getting task id.");
                    }
                    else if (noTaskFound) {
                        res.status(404).send("Task does not exist for the given project in the database.");
                    }
                    else {
                        pool.query(queries.updateTaskStatus, [status, id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error updating task status:", error);
                                return res.status(500).send("Error updating task status.");
                            }
                            else {
                                res.status(200).send("Task status updated successfully!");
                            }
                        });
                    }
                });
            }
        });
    }
};

const updateTaskDeadline = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, deadline } = req.body;
    
    if(!deadline || !project_id){
        return res.status(400).send('Deadline or project id or user id is missing.');
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	    const noProjectFound = !results.rows.length;
            if (error) {
	        console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else if (noProjectFound) {
                res.status(404).send("Project does not exist in the database.");
            }
            else {
                pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).send("Error getting task id.");
                    }
                    else if (noTaskFound) {
                        res.status(404).send("Task does not exist for the given project in the database.");
                    }
                    else {
                        pool.query(queries.updateTaskDeadline, [deadline, id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error updating task deadline:", error);
                                return res.status(500).send("Error updating task deadline.");
                            }
                            else {
                                res.status(200).send("Task deadline updated successfully!");
                            }
                        });
                    }
                });
            }
        });
    }
};

const removeTask = (req, res) => {
    const id  = parseInt(req.params.id);
    const { project_id } = req.body;
    
    if(!project_id){
        return res.status(400).send('Project id is required.');
    }
    else {
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            const noProjectFound = !results.rows.length;
            if (error) {
                console.error("Error getting project id:", error);
                return res.status(500).send("Error getting project id.");
            }
            else if(noProjectFound) {
                res.status(404).send("Project does not exist in the database.");
            }
            else {
                pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).send("Error getting task id.");
                    }
                    else if (noTaskFound) {
                        res.status(404).send("Task does not exist for the given project in the database.");
                    }
                    else {
                        pool.query(queries.removeTask, [id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error deleting project:", error);
                                return res.status(500).send("Error deleting project.");
                            }
                            else {
                                res.status(200).send("Project deleted successfully!")
                            }
                        });
                    }
                });
            }
        });
    }
};

module.exports = {
    getUsers,
    getUsersByID,
    addUser,
    updateUser,
    removeUser,
    getProjects,
    getProjectsByID,
    addProject,
    updateProjectName,
    updateProjectDescription,
    removeProject,
    getTasks,
    getTasksByID,
    addTask,
    updateTaskName,
    updateTaskDescription,
    updateTaskStatus,
    updateTaskDeadline,
    removeTask
};
const pool = require('../../src/db');
const queries = require('./queries');

// TODO => If a User/Project/Task is not found the server connection should remain ON. Add a check for that!


//  Controllers for users
// TODO => reset the auto increment for tasks table -> ALTER SEQUENCE users_user_id_seq RESTART WITH 1; or ALTER TABLE users AUTO_INCREMENT = 1;
const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUsersByID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUsersByID, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const addUser = (req, res) => {
    const {email, password} = req.body;
    // check if email exists
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (results.rows.length) {
            res.send("Email already exists.");
        }

        // add user to db
        pool.query(queries.addUser, [email, password], (error, results) => {
            if (error) throw error;
            res.status(201).send("User Created Successfully!");
        });
    });
};

const removeUser = (req, res) => {
    const id  = parseInt(req.params.id);

    pool.query(queries.getUsersByID, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if(noUserFound) {
            res.send("User does not exist in the database");
        }

        pool.query(queries.removeUser, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("User removed successfully!")
        });
    });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { email } = req.body;

    pool.query(queries.getUsersByID, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound) {
            res.send("User does not exist in the database");
        }

        pool.query(queries.updateUser, [email, id], (error, results) => {
            if (error) throw error;
            res.status(200).send("User updated successfully");
        });
    });
};

// Controllers for projects
// TODO => Check how to use the referencing key in this case the user_id form users table
// TODO => Rebuild the database to make sure that user_id is NOT NULL
// TODO => reset the auto increment for tasks table -> ALTER SEQUENCE projects_project_id_seq RESTART WITH 1; or ALTER TABLE projects AUTO_INCREMENT = 1;
const getProjects = (req, res) => {
    pool.query(queries.getProjects, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getProjectsByID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getProjectsByID, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};


const addProject = (req, res) => {
    const { project_name, project_description, user_id } = req.body;
    const id = parseInt(req.params.id);

    if (!project_name) {
        return res.status(400).send('Project name is required.');
    }

    pool.query(queries.checkProjectExists, [project_name], (error, results) => {
        if (error) {
            console.error("Error checking project existence:", error);
            return res.status(500).send("Error checking project existence.");
        }
        if (results.rows.length) {
            res.send("Project already exists.");
        }
        else {
            pool.query(queries.getUsersByID, [user_id], (error, results) => {
                const noUserFound = !results.rows.length;
                if (error) {
                    console.error("Error checking user existence:", error);
                    return res.status(500).send("Error checking user existence.");
                }
                if (noUserFound) {
                    res.send("User does not exist in the database");
                }
                else {
                    pool.query(queries.addProject, [project_name, project_description, user_id], (error, results) => {
                        if (error) throw error;
                        res.send('Project added Successfully!!');
                        });
                }
            });

        }
    });
};

const updateProjectName = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_name } = req.body;

    pool.query(queries.getProjectsByID, [id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (noProjectFound) {
            res.send("Project does not exist in the database");
        }

        pool.query(queries.updateProjectName, [project_name, id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Project name updated successfully");
        });
    });
};

const updateProjectDescription = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_description } = req.body;

    if (!project_description) {
        return res.status(400).send('Project description is required.');
    }

    pool.query(queries.getProjectsByID, [id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (noProjectFound) {
            res.send("Project does not exist in the database");
        }

        pool.query(queries.updateProjectDescription, [project_description, id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Project description updated successfully");
        });
    });
};

const removeProject = (req, res) => {
    const id  = parseInt(req.params.id);

    pool.query(queries.getProjectsByID, [id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if(noProjectFound) {
            res.send("Project does not exist in the database");
        }

        pool.query(queries.removeProject, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Project removed successfully!")
        });
    });
};

// Controllers for Tasks
// TODO => reset the auto increment for tasks table -> ALTER SEQUENCE tasks_task_id_seq RESTART WITH 1; or ALTER TABLE tasks AUTO_INCREMENT = 1;
const getTasks = (req, res) => {
    pool.query(queries.getTasks, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getTasksByID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getTasksByID, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const addTask = (req, res) => {
    const { project_name, task_name, description, user_id, status, deadline, project_id} = req.body;
    const id = parseInt(req.params.id);
    const created_at = new Date();
    const updated_at = new Date();

    pool.query(queries.checkProjectExists, [project_name], (error, results) => {
        if (error) {
            console.error("Error checking project existence:", error);
            return res.status(500).send("Error checking project existence.");
        }
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            const noProjectFound = !results.rows.length;
            if (noProjectFound) {
                res.send("Project does not exist in the database");
        }
        else {
            pool.query(queries.getUsersByID, [user_id], (error, results) => {
                const noUserFound = !results.rows.length;
                if (error) {
                    console.error("Error checking user existence:", error);
                    return res.status(500).send("Error checking user existence.");
                }
                if (noUserFound) {
                    res.send("User does not exist in the database");
                }
                else {
                    pool.query(queries.addTask, [task_name, description, user_id, status, deadline, created_at, updated_at, project_id], (error, results) => {
                        if (error) throw error;
                        res.send('Task added Successfully!!');
                        });
                }
                
            });

        }
    });
});
};

const updateTaskName = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, user_id, task_name } = req.body;

    pool.query(queries.getUsersByID, [user_id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (error) {
            console.error("Error checking user existence:", error);
            return res.status(500).send("Error checking user existence.");
        }
        if (noUserFound) {
            res.send("User does not exist in the database");
        }
    pool.query(queries.getProjectsByID, [project_id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (noProjectFound) {
            res.send("Project does not exist in the database");
        }
        else {
            pool.query(queries.updateTaskName, [task_name, id, user_id, project_id], (error, results) => {
                if (error) {
                    console.error("Error updating task:", error);
                    return res.status(500).send("Error updating task.");
                }
                res.status(200).send("Task name updated successfully");
            });
        }

    });
});
};

const updateTaskDescription = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, user_id, description } = req.body;

    pool.query(queries.getUsersByID, [user_id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (error) {
            console.error("Error checking user existence:", error);
            return res.status(500).send("Error checking user existence.");
        }
        if (noUserFound) {
            res.send("User does not exist in the database");
        }
    pool.query(queries.getProjectsByID, [project_id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (noProjectFound) {
            res.send("Project does not exist in the database");
        }
        else {
            pool.query(queries.updateTaskDescription, [description, id, user_id, project_id], (error, results) => {
                if (error) {
                    console.error("Error updating task description:", error);
                    return res.status(500).send("Error updating task description.");
                }
                res.status(200).send("Task description updated successfully");
            });
        }

    });
});
};

const updateTaskStatus = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, user_id, status } = req.body;

    pool.query(queries.getUsersByID, [user_id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (error) {
            console.error("Error checking user existence:", error);
            return res.status(500).send("Error checking user existence.");
        }
        if (noUserFound) {
            res.send("User does not exist in the database");
        }
    pool.query(queries.getProjectsByID, [project_id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (noProjectFound) {
            res.send("Project does not exist in the database");
        }
        else {
            pool.query(queries.updateTaskStatus, [status, id, user_id, project_id], (error, results) => {
                if (error) {
                    console.error("Error updating task status:", error);
                    return res.status(500).send("Error updating task status.");
                }
                res.status(200).send("Task status updated successfully");
            });
        }

    });
});
};

const updateTaskDeadline = (req, res) => {
    const id = parseInt(req.params.id);
    const { project_id, user_id, deadline } = req.body;

    pool.query(queries.getUsersByID, [user_id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (error) {
            console.error("Error checking user existence:", error);
            return res.status(500).send("Error checking user existence.");
        }
        if (noUserFound) {
            res.send("User does not exist in the database");
        }
    pool.query(queries.getProjectsByID, [project_id], (error, results) => {
        const noProjectFound = !results.rows.length;
        if (noProjectFound) {
            res.send("Project does not exist in the database");
        }
        else {
            pool.query(queries.updateTaskDeadline, [deadline, id, user_id, project_id], (error, results) => {
                if (error) {
                    console.error("Error updating task deadline:", error);
                    return res.status(500).send("Error updating task deadline.");
                }
                res.status(200).send("Task deadline updated successfully");
            });
        }

    });
});
};

module.exports = {
    getUsers,
    getUsersByID,
    addUser,
    removeUser,
    updateUser,
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
}; 



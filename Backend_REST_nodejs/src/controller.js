const NodeCache = require('node-cache');
const cache = new NodeCache();

const pool = require('./db');
const queries = require('./queries');

const cacheOptions = {
    stdTTL: 3600, // Cache for 1 hr
    checkperiod: 120, // Check for expired keys every 2 minutes
  };

//  Controllers for users
    const getUsers = async (req, res) => {
    const startTime = performance.now();
    const cachedUsers = cache.get('users');

    if (cachedUsers) {
        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        console.log(`Returning data from cache. Time taken: ${timeTaken} ms`);
        // console.log('Returning data from cache');
        return res.status(200).json({ timeTaken, data: cachedUsers });
    }

    pool.query(queries.getUsers, (error, results) => {
        if (error) {
            console.error("Error getting users: ", error);
            return res.status(500).json({error: "Error getting users."});
        }
        else {
            cache.set('users', results.rows, cacheOptions.stdTTL);
            const endTime = performance.now(); // Record end time
            const timeTaken = endTime - startTime;
            console.log(`Fetched data from the database. Time taken: ${timeTaken} ms`);
            res.status(200).json({ timeTaken, data: results.rows });
        }
    })
};

const getUsersByEmailID = async (req, res) => {
    const startTime = performance.now();
    const {email_id} = req.body;
    if (!email_id) {
        return res.status(400).json({error: 'Email id is missing.'});
    }
    else{
        const cacheKey = `user-${email_id}`;
        const cachedUser = cache.get(cacheKey);
        if (cachedUser) {
            
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            console.log(`Returning data from cache. Time taken: ${timeTaken} ms`);
            return res.status(200).json({ timeTaken, data: cachedUser });
        }
        else {
            pool.query(queries.getUsersByEmailID, [email_id], (error, results) => {
                const noUserFound = !results.rows.length;
                if (error) {
                    console.error("Error getting user:", error);
                    return res.status(500).json({error: "Error getting user."});
                }
                else if (noUserFound) {
                    res.status(404).json({error: "User cannot be found. Please try again."});
                }
                else {
                    // Cache the fetched data
                    cache.set(cacheKey, results.rows, cacheOptions.stdTTL);

                    const endTime = performance.now(); // Record end time
                    const timeTaken = endTime - startTime;
                    console.log(`Fetched user from the database. Time taken: ${timeTaken} ms`);
                    res.status(200).json(results.rows);
                }
            });
        }
    }
};

const addUser = (req, res) => {
    const {email_id, password} = req.body;
    if (!email_id || !password) {
        return res.status(400).json({error: 'Email id or Password is missing.'});
    }
    else{
        // check if email_id exists
        pool.query(queries.checkEmailExists, [email_id], (error, results) => {
            if (error) {
                console.error("Error checking users existence: ", error);
                return res.status(500).json({error: 'Error checking users existence.'});
            }
            else if (results.rows.length) {
                res.json({error: 'Email id already exists.'});
            }
            else {
                // add user to db
                pool.query(queries.addUser, [email_id, password], (error, results) => {
                    if (error) {
                        console.error("Error adding user:", error);
                        return res.status(500).json({error:"Error adding user."});
                    }
                    else {
                        //update the cache
                        cache.del('users');
                        pool.query(queries.getUsers, (error, results) => {
                            if (error) { }
                            else {
                                cache.set('users', results.rows, cacheOptions.stdTTL);
                            }
                        });
                        res.status(201).json({message: 'User registered Successfully!'});
                    }
                });
            }
        });
    }
};

const updateUserbyEmailID = (req, res) => {
    const { email_id,password } = req.body;
    if (!password || !email_id) {
        return res.status(400).json({error: 'Email id and new Password are required.'});
    }
    else{    
        pool.query(queries.getUsersByEmailID, [email_id], (error, results) => {
            const noUserFound = !results.rows.length;
            if (error) {
                console.error("Error getting user: ", error);
                return res.status(500).json({error: "Error getting user."});
            }
            else if (noUserFound) {
                res.status(404).json({error: "User cannot be found. Please try again."});
            }
            else {
                pool.query(queries.updateUserbyEmailID, [password, email_id], (error, results) => {
                    if (error) {
                        console.error("Error updating password:", error);
                        return res.status(500).json({error: "Error updating password."});
                    }
                    else {
                        //update the cache
                        cache.del('users');
                        pool.query(queries.getUsers, (error, results) => {
                            if (error) { }
                            else {
                                cache.set('users', results.rows, cacheOptions.stdTTL);
                            }
                        });
                        res.status(200).json({message: "Password updated successfully!"});
                    }
                });
            }
        });
    }
};

const removeUser = (req, res) => {
    const { email_id} = req.body;
    if (!email_id) {
        return res.status(400).json({error: 'Email id is required.'});
    }
    else{ 
        pool.query(queries.getUsersByEmailID, [email_id], (error, results) => {
            const noUserFound = !results.rows.length;
            if (error) {
                console.error("Error getting user id:", error);
                return res.status(500).json({error: "Error getting user id."});
            }
            else if(noUserFound) {
                res.status(404).json({error: "User cannot be found. Please try again."});
            }
            else {
                pool.query(queries.removeUser, [email_id], (error, results) => {
                    if (error) {
                        console.error("Error deleting user:", error);
                        return res.status(500).json({error: "Error deleting user."});
                    }
                    else {
                        //update the cache
                        cache.del('users');
                        pool.query(queries.getUsers, (error, results) => {
                            if (error) { }
                            else {
                                cache.set('users', results.rows, cacheOptions.stdTTL);
                            }
                        });
                        res.status(200).json({message: "User deleted successfully!"})
                    }
                });
            }
        });
    }
};

const userLogin = (req, res) => {
    const { email_id,password } = req.body;
    if (!password || !email_id) {
        return res.status(400).json({error: 'Email id or Password is missing.'});
    }
    else{    
        pool.query(queries.getUsersByEmailID, [email_id], (error, results) => {
            const noUserFound = !results.rows.length;
            if (error) {
                console.error("Error getting user:", error);
                return res.status(500).json({error: "Error getting user."});
            }
            else if (noUserFound) {
                res.status(404).json({error: "User cannot be found. Please try again."});
            }
            else {
                const pwd = results.rows[0].password;
                if (pwd === password) {
                    res.status(200).json({ message: "Login successful" });
                } else {
                    res.status(401).json({ error: "Incorrect password" });
                }
            }
        });   
    }
};


// Controllers for projects
const getProjects = (req, res) => {
    const startTime = performance.now();
    const cachedProjects = cache.get('projects');

    if (cachedProjects) {
        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        console.log(`Returning data from cache. Time taken: ${timeTaken} ms`);
        // console.log('Returning data from cache');
        return res.status(200).json({ timeTaken, data: cachedProjects });
    }
    pool.query(queries.getProjects, (error, results) => {
        if (error) {
            console.error("Error getting projects:", error);
            return res.status(500).json({error: "Error getting projects."});
        }
        else {
            cache.set('projects', results.rows, cacheOptions.stdTTL);
            const endTime = performance.now(); // Record end time
            const timeTaken = endTime - startTime;
            console.log(`Fetched data from the database. Time taken: ${timeTaken} ms`);
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
            return res.status(500).json({error: "Error getting project."});
        }
        else if (noProjectFound) {
            res.status(404).json({error: "Project does not exist in the database."});
        }
        else {
            res.status(200).json(results.rows);
        }
    });
};


const addProject = (req, res) => {
    const { project_name, project_description, email_id } = req.body;
    const id = parseInt(req.params.id);

    if (!project_name || !project_description || !email_id) {
        return res.status(400).json({error: 'Project Name or Description or email id is missing.'});
    }
    else{
        pool.query(queries.checkProjectExists, [project_name], (error, results) => {
            if (error) {
                console.error("Error checking project existence:", error);
                return res.status(500).json({error: "Error checking project existence."});
            }
            else if (results.rows.length) {
                res.json({error: "Project already exists."});
            }
            else {
                pool.query(queries.getUsersByEmailID, [email_id], (error, results) => {
                    const noUserFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting user id:", error);
                        return res.status(500).json({error: "Error getting user id."});
                    }
                    else if (noUserFound) {
                        res.status(404).json({error: "User does not exist in the database."});
                    }
                    else {
                        user_id = results.rows[0].user_id;
                        pool.query(queries.addProject, [project_name, project_description, user_id], (error, results) => {
                            if (error) {
                                console.error("Error adding project:", error);
                                return res.status(500).json({error: "Error adding project."});
                            }
                            else {
                                //update the cache
                                cache.del('projects');
                                pool.query(queries.getProjects, (error, results) => {
                                    if (error) { }
                                    else {
                                        cache.set('projects', results.rows, cacheOptions.stdTTL);
                                    }
                                });
                                res.status(201).json({message: 'Project added Successfully!'});
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
        return res.status(400).json({error: 'Project name is required.'});
    }
    else{
        pool.query(queries.getProjectsByID, [id], (error, results) => {
            const noProjectFound = !results.rows.length;
            if (error) {
                console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else if (noProjectFound) {
                res.status(404).json({error: "Project does not exist in the database."});
            }
            else {
                pool.query(queries.checkProjectExists, [project_name], (error, results) => {
                    if (error) {
                        console.error("Error checking project existence:", error);
                        return res.status(500).json({error: "Error checking project existence."});
                    }
                    else if (results.rows.length) {
                        res.json({error: "Project name already exists for another project."});
                    }
                    else {
                        pool.query(queries.updateProjectName, [project_name, id], (error, results) => {
                            if (error) {
                                console.error("Error updating project name:", error);
                                return res.status(500).json({error: "Error updating project name."});
                            }
                            else {
                                //update the cache
                                cache.del('projects');
                                pool.query(queries.getProjects, (error, results) => {
                                    if (error) { }
                                    else {
                                        cache.set('projects', results.rows, cacheOptions.stdTTL);
                                    }
                                });
                                res.status(200).json({message: "Project name updated successfully!"});
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
        return res.status(400).json({error: 'Project description is required.'});
    }
    else{
        pool.query(queries.getProjectsByID, [id], (error, results) => {
            const noProjectFound = !results.rows.length;
            if (error) {
                console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else if (noProjectFound) {
                res.status(404).json({error: "Project does not exist in the database."});
            }
            else {
                pool.query(queries.updateProjectDescription, [project_description, id], (error, results) => {
                    if (error) {
                        console.error("Error updaing project description:", error);
                        return res.status(500).json({error: "Error updating project description."});
                    }
                    else {
                        //update the cache
                        cache.del('projects');
                        pool.query(queries.getProjects, (error, results) => {
                            if (error) { }
                            else {
                                cache.set('projects', results.rows, cacheOptions.stdTTL);
                            }
                        });
                        res.status(200).json({message: "Project description updated successfully!"});
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
            return res.status(500).json({error: "Error getting project id."});
        }
        else if(noProjectFound) {
            res.status(404).json({error: "Project does not exist in the database."});
        }
        else {
            pool.query(queries.removeProject, [id], (error, results) => {
                if (error) {
                    console.error("Error deleting project:", error);
                    return res.status(500).json({error: "Error deleting project."});
                }
                else {
                    //update the cache
                    cache.del('projects');
                    pool.query(queries.getProjects, (error, results) => {
                        if (error) { }
                        else {
                            cache.set('projects', results.rows, cacheOptions.stdTTL);
                        }
                    });
                    res.status(200).json({message: "Project deleted successfully!"})
                }
            });
        }
    });
};

// Controllers for Tasks
const getTasks = (req, res) => {
    const { project_id } = req.body;
    
    if(!project_id){
        return res.status(400).json({error: 'Project id is required.'});
    }
    else {
        const startTime = performance.now();
        const cacheKey = `tasks-${project_id}`;
        const cachedTasks = cache.get(cacheKey);

        if (cachedTasks) {
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            console.log(`Returning data from cache. Time taken: ${timeTaken} ms`);
            return res.status(200).json({ timeTaken, data: cachedTasks });
        }
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            if (error){
                console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else {
                const noProjectFound = !results.rows.length;
                if (noProjectFound) {
                    res.status(404).json({error: "Project does not exist in the database."});
                }
                else {
                    pool.query(queries.getTasks, [project_id], (error, results) => {
                        if (error) {
                            console.error("Error getting tasks:", error);
                            return res.status(500).json({error: "Error getting tasks."});
                        }
                        else {
                            cache.set(cacheKey, results.rows, cacheOptions.stdTTL);
                            const endTime = performance.now();
                            const timeTaken = endTime - startTime;
                            console.log(`Fetched tasks from the database. Time taken: ${timeTaken} ms`);
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
        return res.status(400).json({error: 'Project id is required.'});
    }
    else {
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            if (error){
                console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else {
                const noProjectFound = !results.rows.length;
                if (noProjectFound) {
                    res.status(404).json({error: "Project does not exist in the database."});
                }
                else {
                    pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                        const noTaskFound = !results.rows.length;
                        if (error) {
                            console.error("Error getting task:", error);
                            return res.status(500).json({error: "Error getting task."});
                        }
                        else if (noTaskFound) {
                            res.status(404).json({error: "Task does not exist for the given project in the database."});
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
    const { task_name, task_description, email_id, deadline} = req.body;
    // const id = parseInt(req.params.id);
    const created_at = new Date();
    const updated_at = new Date();
    const status = "Backlog";
    const project_id = 1;
    
    if (!task_name || !task_description || !email_id || !status || !deadline || !project_id) {
        return res.status(400).json({error: 'One of inputs is missing.'});
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            if (error){
                console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else {
                const noProjectFound = !results.rows.length;
                if (noProjectFound) {
                    res.status(404).json({error: "Project does not exist in the database."});
                }
                else {
                    pool.query(queries.checkTaskExists, [task_name, project_id], (error, results) => {
                        if (error) {
                            console.error("Error checking task existence:", error);
                            return res.status(500).json({error: "Error checking task existence."});
                        }
                        else if (results.rows.length) {
                            res.json({error: "Task already exists."});
                        }
                        else {
                            pool.query(queries.getUsersByEmailID, [email_id], (error, results) => {
                                const noUserFound = !results.rows.length;
                                if (error) {
                                    console.error("Error getting user id:", error);
                                    return res.status(500).json({error: "Error getting user id."});
                                }
                                if (noUserFound) {
                                    res.status(404).json({error: "User does not exist in the database."});
                                }
                                else {
                                    user_id = results.rows[0].user_id;
                                    pool.query(queries.addTask, [task_name, task_description, user_id, status, deadline, created_at, updated_at, project_id], (error, results) => {
                                        if (error) {
                                            console.error("Error adding task:", error);
                                            return res.status(500).json({error: "Error adding task."});
                                        }
                                        else {
                                            res.status(201).json({message: 'Task added Successfully!'});
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
        return res.status(400).json({error: 'Task name or project id or user id is missing.'});
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	        const noProjectFound = !results.rows.length;
            if (error) {
	            console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else if (noProjectFound) {
                res.status(404).json({error: "Project does not exist in the database."});
            }
            else {
		        pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).json({error: "Error getting task id."});
                    }
                    else if (noTaskFound) {
                        res.status(404).json({error: "Task does not exist for the given project in the database."});
                    }
                    else {
                        pool.query(queries.checkTaskExists, [task_name, project_id], (error, results) => {
                            if (error) {
                                console.error("Error checking task existence:", error);
                                return res.status(500).json({error: "Error checking task existence."});
                            }
                            else if (results.rows.length) {
                                res.json({error: "Task name already exists for another task in the given project."});
                            }
                            else {
                                pool.query(queries.updateTaskName, [task_name, id, project_id], (error, results) => {
                                    if (error) {
                                        console.error("Error updating task:", error);
                                        return res.status(500).json({error: "Error updating task."});
                                    }
                                    else {
                                        res.status(200).json({message: "Task name updated successfully!"});
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
        return res.status(400).json({error: 'Task description or project id or user id is missing.'});
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	    const noProjectFound = !results.rows.length;
            if (error) {
	        console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else if (noProjectFound) {
                res.status(404).json({error: "Project does not exist in the database."});
            }
            else {
		        pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).json({error: "Error getting task id."});
                    }
                    else if (noTaskFound) {
                        res.status(404).json({error: "Task does not exist for the given project in the database."});
                    }
                    else {
                        pool.query(queries.updateTaskDescription, [task_description, id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error updating task description:", error);
                                return res.status(500).json({error: "Error updating task description."});
                            }
                            else {
                                res.status(200).json({error: "Task description updated successfully!"});
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
        return res.status(400).json({error: 'Status or project id or user id is missing.'});
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	    const noProjectFound = !results.rows.length;
            if (error) {
	        console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else if (noProjectFound) {
                res.status(404).json({error: "Project does not exist in the database."});
            }
            else {
                pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).json({error: "Error getting task id."});
                    }
                    else if (noTaskFound) {
                        res.status(404).json({error: "Task does not exist for the given project in the database."});
                    }
                    else {
                        pool.query(queries.updateTaskStatus, [status, id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error updating task status:", error);
                                return res.status(500).json({error: "Error updating task status."});
                            }
                            else {
                                res.status(200).json({message: "Task status updated successfully!"});
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
        return res.status(400).json({error: 'Deadline or project id or user id is missing.'});
    }
    else{
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
	    const noProjectFound = !results.rows.length;
            if (error) {
	        console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else if (noProjectFound) {
                res.status(404).json({error: "Project does not exist in the database."});
            }
            else {
                pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).json({error: "Error getting task id."});
                    }
                    else if (noTaskFound) {
                        res.status(404).json({error: "Task does not exist for the given project in the database."});
                    }
                    else {
                        pool.query(queries.updateTaskDeadline, [deadline, id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error updating task deadline:", error);
                                return res.status(500).json({error: "Error updating task deadline."});
                            }
                            else {
                                res.status(200).json({message: "Task deadline updated successfully!"});
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
        return res.status(400).json({error: 'Project id is required.'});
    }
    else {
        pool.query(queries.getProjectsByID, [project_id], (error, results) => {
            const noProjectFound = !results.rows.length;
            if (error) {
                console.error("Error getting project id:", error);
                return res.status(500).json({error: "Error getting project id."});
            }
            else if(noProjectFound) {
                res.status(404).json({error: "Project does not exist in the database."});
            }
            else {
                pool.query(queries.getTasksByID, [id, project_id], (error, results) => {
                    const noTaskFound = !results.rows.length;
                    if (error) {
                        console.error("Error getting task id:", error);
                        return res.status(500).json({error: "Error getting task id."});
                    }
                    else if (noTaskFound) {
                        res.status(404).json({error: "Task does not exist for the given project in the database."});
                    }
                    else {
                        pool.query(queries.removeTask, [id, project_id], (error, results) => {
                            if (error) {
                                console.error("Error deleting project:", error);
                                return res.status(500).json({error: "Error deleting task."});
                            }
                            else {
                                res.status(200).json({message: "Task deleted successfully!"})
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
    getUsersByEmailID,
    addUser,
    updateUserbyEmailID,
    removeUser,
    userLogin,
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
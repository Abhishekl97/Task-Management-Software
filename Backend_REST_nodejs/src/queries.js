const getUsers = "SELECT * FROM users";
const getUsersByEmailID = "SELECT * FROM users WHERE email_id = $1";
const addUser = "INSERT INTO users (email_id, password) VALUES ($1, $2)";
const updateUserbyEmailID = "UPDATE users SET password = $1 WHERE email_id = $2";
const removeUser = "DELETE FROM users WHERE email_id = $1";
const checkEmailExists = "SELECT * FROM users WHERE email_id = $1";
const getProjects = "SELECT * FROM projects";
const getProjectsByID = "SELECT * FROM projects WHERE project_id = $1";
const addProject = "INSERT INTO projects (project_name, project_description, user_id) VALUES ($1, $2, $3)"; // TODO => Check user_id from users table
const updateProjectName = "UPDATE projects SET project_name = $1 WHERE project_id = $2";
const updateProjectDescription = "UPDATE projects SET project_description = $1 WHERE project_id = $2";
const removeProject = "DELETE FROM projects WHERE project_id = $1";
const checkProjectExists = "SELECT * FROM projects WHERE project_name = $1";
const getTasks = "SELECT * FROM tasks WHERE project_id = $1";
const getTasksByID = "SELECT * FROM tasks WHERE task_id = $1 AND project_id = $2";
const addTask = "INSERT INTO tasks (task_name, task_description, user_id, status, deadline, created_at, updated_at, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"; 
const updateTaskName = "UPDATE tasks SET task_name = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2 AND project_id = $3";
const updateTaskDescription = "UPDATE tasks SET task_description = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2 AND project_id = $3";
const updateTaskStatus = "UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2 AND project_id = $3";
const updateTaskDeadline = "UPDATE tasks SET deadline = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2 AND project_id = $3";
const removeTask = "DELETE FROM tasks WHERE task_id = $1 AND project_id = $2";
const checkTaskExists = "SELECT * FROM tasks WHERE task_name = $1 AND project_id = $2";

module.exports = {
    getUsers,
    // getUsersByID,
    getUsersByEmailID,
    addUser,
    // updateUser,
    updateUserbyEmailID,
    removeUser,
    checkEmailExists,
    getProjects,
    getProjectsByID,
    addProject,
    updateProjectName,
    updateProjectDescription,
    removeProject,
    checkProjectExists,
    getTasks,
    getTasksByID,
    addTask,
    updateTaskName,
    updateTaskDescription,
    updateTaskStatus,
    updateTaskDeadline,
    removeTask,
    checkTaskExists
};
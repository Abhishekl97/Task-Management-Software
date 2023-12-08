const getUsers = "SELECT * FROM users";
const getProjects = "SELECT * FROM projects";
const getUsersByID = "SELECT * FROM users WHERE user_id = $1";
const getProjectsByID = "SELECT * FROM projects WHERE project_id = $1";
const checkEmailExists = "SELECT u FROM users u WHERE u.email = $1";
const addUser = "INSERT INTO users (email, password) VALUES ($1, $2)";
const removeUser = "DELETE FROM users WHERE user_id = $1";
const updateUser = "UPDATE users SET email = $1 WHERE user_id = $2";
const checkProjectExists = "SELECT * FROM projects WHERE project_name = $1";
const addProject = "INSERT INTO projects (project_name, project_description, user_id) VALUES ($1, $2, $3)"; // TODO => Check user_id from users table
const updateProjectName = "UPDATE projects SET project_name = $1 WHERE project_id = $2"
const updateProjectDescription = "UPDATE projects SET project_description = $1 WHERE project_id = $2"
const removeProject = "DELETE FROM projects WHERE project_id = $1";
const getTasks = "SELECT * FROM tasks";
const getTasksByID = "SELECT * FROM tasks WHERE task_id = $1";
const addTask = "INSERT INTO tasks (task_name, description, user_id, status, deadline, created_at, updated_at, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"; 
const updateTaskName = "UPDATE tasks SET task_name = $1 WHERE task_id = $2 AND user_id = $3 AND project_id = $4 AND updated_at = $5";
const updateTaskDescription = "UPDATE tasks SET description = $1 WHERE task_id = $2 AND user_id = $3 AND project_id = $4 AND updated_at = $5";
const updateTaskStatus = "UPDATE tasks SET status = $1 WHERE task_id = $2 AND user_id = $3 AND project_id = $4";
const updateTaskDeadline = "UPDATE tasks SET deadline = $1 WHERE task_id = $2 AND user_id = $3 AND project_id = $4";

module.exports = {
    getUsers,
    getUsersByID,
    checkEmailExists,
    addUser,
    removeUser,
    updateUser,
    checkProjectExists,
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
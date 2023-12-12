const express = require('express');
const task_management_routes = require('./routes');

const app = express();
const port = 3300; // ##### PORT CHANGED FROM 3000 to 3300

// Will allow us to get json from our endpoints 
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use('/api/v1/tm', task_management_routes);

app.listen(port, () => console.log(`app listening on port ${port}`));
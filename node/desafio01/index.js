const express = require("express");

const server = express();

server.use(express.json());

let requests = 0;
const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

function numberRequests(req, res, next) {
  requests++;

  console.log(`Number requests ${requests}`);

  return next();
}

server.use(numberRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:index", (req, res) => {
  const index = req.params.index;

  return res.json(projects[index]);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send("Removed!");
});

server.listen(3000);

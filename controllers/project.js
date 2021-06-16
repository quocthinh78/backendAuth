const User = require('../models/Users')
const Deck = require('../models/Deck')
const Project = require('../models/Project')
const Task = require('../models/Task')


const getProject = async(req, res) => {
    const p = await Project.find({}).populate("owner").populate('tasks');
    res.json(p)
}
createProject = async(req, res) => {
    const { id, name } = req.body;
    const newProject = new Project({ name });
    newProject.owner.push(id);
    await newProject.save();
    const owner = await User.findOne({ _id: id });
    owner.projects.push(newProject.id);
    owner.save();
    const p = await Project.findOne({ _id: newProject.id }).populate("owner").populate('tasks');
    res.json(p)
}
deleteProject = async(req, res, next) => {
    const projectId = req.params.id;
    const project = await Project.findOne({ _id: projectId });
    ownerId = project.owner[0];
    await project.remove();
    const owner = await User.findById(ownerId);
    await owner.projects.pull(project);
    await owner.save();
    res.json(project);
}
module.exports = {
    getProject,
    createProject,
    deleteProject
}
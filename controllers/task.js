const User = require('../models/Users')
const Deck = require('../models/Deck')
const Project = require('../models/Project')
const Task = require('../models/Task')


const getTask = async(req, res, next) => {
    const allTask = await Task.find({}).populate("owner").populate("project");
    res.json(allTask);
}
createTask = async(req, res, next) => {
    var { authorId, projectId, taskName, taskDesCription } = req.body;
    const newTask = await new Task({
        name: taskName,
        description: taskDesCription
    })
    newTask.owner = authorId;
    newTask.project = projectId;
    await newTask.save();
    const user = await User.findById(authorId);
    user.tasks.push(newTask._id);
    user.save();
    const project = await Project.findById(projectId);
    project.tasks.push(newTask._id);
    project.save();
}
deleteTask = async(req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.remove();
    const user = await User.findById(task.owner);
    const project = await Project.findById(task.project);
    user.tasks.pull(task);
    project.tasks.pull(task);
    user.save();
    project.save();
    res.json(task);
}
getAuthor = async(req, res, next) => {
    const author = await User.find({});
    res.json(author)
}
getProject = async(req, res, next) => {
    const project = await Project.find({});
    res.json(project)
}
getFirstData = async(req, res) => {
    var { id } = req.params
    const data = await Task.find({ _id: id })
    res.json(data)
}
updateTask = async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const newTask = {
        name: req.body.taskName,
        description: req.body.taskDesCription,
        owner: req.body.authorId,
        project: req.body.projectId
    }
    const task = await Task.findOneAndUpdate({ _id: id }, newTask);
    task.save();
    const user = await User.findOne({ tasks: id });
    console.log(user)
    console.log(task._id);
    user.tasks.pull(task._id);
    user.save();
    userChange = await User.findById(req.body.authorId);
    userChange.tasks.push(task._id);
    await userChange.save();
    const project = await Project.findOne({ tasks: id })
    project.tasks.pull(id)
    project.save();
    const projectChange = await Project.findById(req.body.projectId)
    projectChange.tasks.push(task._id)
    await projectChange.save();

}
module.exports = {
    getTask,
    createTask,
    getAuthor,
    getProject,
    deleteTask,
    getFirstData,
    updateTask

}
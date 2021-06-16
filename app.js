const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

// environment
require('dotenv').config();
//connect mongoose
mongoose.connect("mongodb://localhost:27017/nodephr", { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).
then(() => console.log("ok")).catch(() => console.log("err"))
mongoose.set('useFindAndModify', false);
// middleware
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json())
    //Routes
const userRouter = require('./routes/users')
const deckRouter = require('./routes/decks')
const taskRouter = require('./routes/tasks')
const projectRouter = require('./routes/project')

// Routes
app.use("/users", userRouter);
app.use("/decks", deckRouter);
app.use("/tasks", taskRouter);
app.use("/project", projectRouter);
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "server is sok"
    })
});
// catch 404 error and forward them to error handlers
app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404
    next(err)
});
//error handlers functions
app.use((err, req, res, next) => {
    const error = app.get('env') === "development" ? err : {}
    const status = err.status || 500

    // respose to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
});

//start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`server is listen port ${port}`));
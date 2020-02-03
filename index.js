const express= require("express");
const bodyParser = require("body-parser");

//Connection Part
const mongoose = require("mongoose");

var url ="";
mongoose.connect("mongodb+srv://gaurav:gaurav@clusterns-hjydj.mongodb.net/test",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
/*
(err) => {
    if(!err) { console.log('Connection Successful')}
    else { console.log('Error in DB connection:' + err)}
});
*/
const app=express();
const TodoTask = require("./models/TodoTask");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
app.route("/edit/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    }).post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

var port= process.env.PORT || 3000;
app.listen(port,()=> { 
    console.log("Server Up & Running: "+ port);
})
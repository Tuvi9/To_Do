const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Reads the file
const readFile =(filename) => {
    return new Promise((resolve, reject) => {
        // if there is no error, then return file (data)
        fs.readFile('./tasks.json', 'utf8', (err, data) => {
            // Checks if there is an error
            if (err) {
                console.log(err);
                return;
            }
            // Split's the (data) if there was no error
            const tasks = JSON.parse(data)
            resolve(tasks)
        });
    });
}
// Converts updated tasks into JSON
const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile('./tasks.json', data, 'utf-8', err => {
            if (err) {
                console.log(err);
                return;
            }
            resolve(true)
        })
    }) 
}

app.get('/', (req, res) => {
     // Calls readFile function to read the .txt file
    readFile('./tasks.json')
        .then(tasks => {
            // <% tasks.forEach((task) => { %>
            res.render('index', {tasks:tasks, error:null})
    });
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/', (req, res) => {
    let error = null
    // Checks if the input is empty
    if (req.body.task.trim().length == 0) {
        error = 'Please insert correct task'
        readFile('./tasks.json')
        .then(tasks => {
            res.render('index', {
                tasks: tasks,
                error: error
            })
        })
    // If the input is not empty
    } else {
    // Calls readFile function to read the .txt file
    readFile('.tasks.json')
     .then(tasks => {
        // Defines index variable === 0
        let index
        // Checks if the array is empty
        if(tasks.length === 0) {
            index = 0
        } else {
            // Calculate the index of the last task in the array.
            index = tasks[tasks.length - 1].id + 1;
        }
        // Formats input into a new task
        const newTask = {
            "id": index,
            "task": req.body.task,
        }

        // Pushes input into task list reformatted as newTask
        tasks.push(newTask)
        // Converts updated tasks into JSON
        data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json', data)
            // If there is no error refresh the page with new info.
            res.redirect('/')
        })
     }
})

// Delete buttons
// Connects to the ID of the delete item in the index.ejs page
app.get('/delete-task/:taskId', (req, res) => {
    // Assigns our deletable task to a variable 
    let deletedTaskID = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        // Loops through the tasks array and deletes the task with the matching ID
        tasks.forEach((task, index) => {
            // Checks if the task ID matches the deletedTaskID
            if (task.id === deletedTaskID) {
                // Deletes the task with the matching ID
                tasks.splice(index, 1)
            }
        })
    // Converts updated tasks into JSON
    data = JSON.stringify(tasks, null, 2)
    // Writes updated tasks.json file
    writeFile('./tasks.json', data)
        // If there is no error refresh the page with new info.
        res.redirect('/')
    })
})

// Clear all button
app.post('/clear-tasks', (req, res) => {
    // Write an empty array to the file
    fs.writeFile('./tasks.json', JSON.stringify([], null, 2), 'utf8', (err) => {
      if (err) {
        console.log(err);
        return;
      }
      // Redirect to the homepage
      res.redirect('/');
    });
  });

app.listen(3001)

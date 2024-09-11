// importing all required modules 
const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt  = require('bcrypt');

// initialising the modules and ports 
const app = express();
const port = 4000;

// initialising the middleware for our server 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setting up the sqlite database for our server 
const database = new sqlite.Database('./tasks.db',(err)=>{
    if(err){
        console.log(err);
    }

    else{
        // creating the table in databse after sucessfull database creation 
        let query = `CREATE TABLE IF NOT EXISTS tasks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        title TEXT,
                        description TEXT,
                        status TEXT DEFAULT 'pending',
                        FOREIGN KEY (user_id) REFERENCES users(id)
                        );
                         `;
        database.run(query);
        // confirmation message for databse creation 
        console.log('tasks database is deplaoyed !...');

        query = `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT ,
                password TEXT
                );
                `;
        database.run(query);
        // confirmation message for databse creation 
        console.log('users database is deplaoyed !...');
    }
});

// insertion logic for data entry 
app.post('/api/add', (req, res) => {
    console.log('api acll is sucesss')
    const { tittle, description } = req.body;
    console.log(tittle);
    // creating insert logic query 
    const query = `INSERT INTO tasks(title,description) VALUES(?,?)`;
    // filtering the tittle and description value 
    if (!tittle || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
     }
    database.run(query,[tittle,description],function (err){
        // checking if the data is inerted or not ? 
        if(err){
            return res.status(500).json({ error: 'Failed to add task' });
        }

        else{
            res.json({ success: 'Task added', taskId: this.lastID });
        }
    });
});

// server logic for getting data from database 
app.get('/api/getdata',(req,res)=>{
    console.log('api acll is sucesss')
    const query = 'SELECT * FROM tasks';
    database.all(query,(err,rows)=>{
        if(err){
            return res.status(500).json({error:'Error while retriving the data '});
        }
        res.json(rows);
    })
});

// server logic for update database 
app.post('/api/update-status', (req, res) => {
    const { id, status } = req.body;
    console.log(`Updating task ${id} to status ${status}`);
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    database.run(query, [status, id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update status' });
      }
      res.json({ success: 'Task status updated' });
    });
  });

//   server side logic for registering a user 
app.post('/api/signin',async (req,res)=>{
    // getting the credentials from the client end 
    const {username,password} = req.body;
    
    // valiadating the credentials 
    if(!username || !password){
        return res.status(500).json({error:'username or password is empty'});
        
    }
    // password hasing 
    const hashingPassword = await bcrypt.hash(password,10);
    console.log(username);
    const query = `INSERT INTO users(username,password) VALUES(?,?)`;
    // going to execute this query in database 
    database.run(query,[username,hashingPassword],function (rows,err){
        // checking for error
        if(err){
            console.error(err);
            return res.status(500).json({error:'error while inserting data into the table'});
        }
            res.status(500).json({sucess:'Data Inserted Sucessfully'});
        
    });
});

// server logic for logging into the application using the database
app.post('/api/login',async (req,res)=>{
    console.log('login api callled ')
    const {user,pass} = req.body;

    if(!user || !pass){
        return res.status(500).json({error:'the user or pass is empty'});
    }

    const query = `SELECT password FROM users WHERE users.username = ?`;

    database.get(query,user,async function (err,row){
        if(err){
            return res.status(500).json({error:'error while inserting the data'});
        }
        console.log('selected')
        // Check if row exists (i.e., user was found)
        if (!row) {
            console.log('user not found')
            return res.status(404).json({ error: 'User not found' });
        }
        else{
            const logpass =  row.password;
            console.log(logpass);
            const hashedPassword = await bcrypt.hash(logpass,10);
            // compare the password 
            const result = await bcrypt.compare(pass,row.password);
            console.log(result)
            if(result){
                console.log('Password Match Sucess');
                return res.json({ success: 'Login successful' });
            }

            else{
                return res.status(500).json({error:'Password is wrong !..'});
            }
        }
    });
});
// app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body;
//     console.log('login api called ')
//     if (!username || !password) {
//         return res.status(400).json({ error: 'Username or password is empty' });
//     }

//     const query = `SELECT password FROM users WHERE users.username = ?`;
//     database.get(query, [username], async (err, row) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error while retrieving data' });
//         }
//         console.log('select completed sucessfully')
//         // Check if row exists (i.e., user was found)
//         if (!row) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Compare the hashed password
//         console.log('compaaring value')
//         const match = await bcrypt.compare(password, row.password);
//         console.log(match);
//         if (match) {
//             return res.json({ success: 'Login successful'});
//         } else {
//             return res.status(400).json({ error: 'Incorrect password' });
//         }
//     });
// });

// starting the server at port 4000
app.listen(port,()=>{
    console.log('Server is sucessfully launched on Port 4000');
});
const express = require('express');
const mysql = require('mysql');
const path = require('path');



// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'ticket-system',
    password: 'ticket-system',
    database: 'ticket-system'
});

// Connect
db.connect((err) => {
    if(err){
      console.log(err)
    } else {
      console.log('MySql is Connected')
    }
})

const app = express(); 


// Puts css files into a static folder for files
app.use('/css', express.static(__dirname + '/public/css'));

app.use(express.static('cellphonerepair-ticket-system'), express.urlencoded({
    extended:true
    })
);

// the route '/' is routed to the login.html page. 
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

// Routes to the register page
app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/register.html'));
});

/*Route to register the user checks for verification of password 
If username, password and verify matches corectly the info is inserted into the Database*/
app.post('/registerUser', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let verify = req.body.verify;
    let user;
    if(password == verify){
        user = {username: username, password: password};
    }
    else{
        return "Passwords didn't match"
    }
    let sql = 'INSERT INTO user SET ?';
    let query = db.query(sql, user, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('User Added');
    });
    return "user added";
});

// Routes to the login page which routes to the views/login.html page 
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

/* Takes the login and password information checks the database to see if the login and password info is stored.
If so, then it grants access to app, if not then console.log not logged in.*/
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let user;
    let sql = 'SELECT * FROM user AS u WHERE username = ?';
    let query = db.query(sql, username, (err, result) => {
        if(err) throw err;
        // res.send('User Added');
        user = JSON.parse(JSON.stringify(result));
        console.log(user);
        console.log(user[0].password);
        if(user[0].password == password){
            // sessionStorage.setItem("user", user[0]);
            let user1 = {id:user[0].id, username:user[0].username};
            res.cookie('user', user1);
            console.log("Logged In");
            res.redirect('/');
        }
        else{
            console.log("Not logged In");
        }
    });
});

app.get('/logout', function (req, res) {
    res.clearCookie('user');
    res.redirect('views/login');
});
// Create table
app.get('/createpoststable', (req, res) => {
    let sql = 'CREATE TABLE tickets(id int AUTO_INCREMENT, owner_id int, title VARCHAR(255), cellphone VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('TICKETS table created...');
    });
    return "it worked";
});

// // Insert post 1
// app.get('/addpost1', (req, res) => {
//     let post = {title:'Post One', body:'This is post number one'};
//     let sql = 'INSERT INTO posts SET ?';
//     let query = db.query(sql, post, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Post 1 added...');
//     });
// });

// function createTable(){
//     app.get('/createpoststable', (req, res) => {
//         let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
//         db.query(sql, (err, result) => {
//             if(err) throw err;
//             console.log(result);
//             res.send('Posts table created...');
//         });
//     });
// }

// // Insert post 2
app.post('/addpost2', (req, res) => {
    let post = {title:req.body.title, body:req.body.body};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post 2 added...');
    });
    return "post added";
});

// // Select posts
// app.get('/getposts', (req, res) => {
//     let sql = 'SELECT * FROM posts';
//     let query = db.query(sql, (err, results) => {
//         if(err) throw err;
//         console.log(results);
//         res.send('Posts fetched...');
//     });
// });

// // Select single post
// app.get('/getpost/:id', (req, res) => {
//     let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Post fetched...');
//     });
// });

// // Update post
// app.get('/updatepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
//     let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Post updated...');
//     });
// });

// // Delete post
// app.get('/deletepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
//     let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Post deleted...');
//     });
// });

app.listen('3000', () => {
    console.log('Server started on port 3000');
});
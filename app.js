const express = require('express');
const mysql = require('mysql');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();


// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'ticket-system',
    password: 'ticket-system',
    database: 'ticket-system'
});

// Connect Database
db.connect((err) => {
    if(err){
      console.log(err)
    } else {
      console.log('MySql is Connected')
    }
})


//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 

// Puts css files into a static folder for files
app.use('/css', express.static(__dirname + '/public/css'));

// Puts img files into a static folder for files
app.use('/img', express.static(__dirname + '/public/img'));



app.use(express.static('cellphonerepair-ticket-system'), express.urlencoded({
    extended:true
    })
);

// the route '/' is routed to the login.html page.
/* 
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

// Routes to the register page
app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/register.html'));
});

// Routes to the login page which routes to the views/login.html page 
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});
*/


// page routes to login
app.get('/login', function(req, res) {
    res.render('login');
});

// page routes to register
app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/dashboard',(req, res) => {
    let sql = "SELECT * FROM tickets";
    let query = db.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('dashboard', {
            title : 'Repair Ticket List',
            tickets : rows
        });
    });
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
        res.redirect('/login');
    });
    return "user added";
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
            res.redirect('/dashboard');
        }
        else{
            console.log("Not logged In");
            res.redirect('/login');
        }
    });
});

app.get('/logout', function (req, res) {
    res.clearCookie('user');
    console.log("logged out");
    res.redirect('login');
});
// Create ticket
app.post('/addticket', (req, res) => {
    let name = req.body.name;
    let phone_number = req.body.phone_number;
    let cellphone = req.body.cellphone;
    let problem = req.body.problem;
    let user = {name: name, phone_number: phone_number, cellphone: cellphone, problem: problem};
    
    let sql = 'INSERT INTO tickets SET ?';
    let query = db.query(sql, user, (err, result) => {
        if(err) throw err;
        console.log("ticket added");
        res.redirect('/dashboard');
    });
});

app.get('/edit/:id', (req, res) => {
        let newTitle = 'Updated Title';
        let sql = `UPDATE tickets SET name = '${newTitle}' WHERE id = ${req.params.id}`;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Post updated...');
        });
    });



// Delete ticket
app.get('/delete/:id', (req, res) => {
    let sql = `DELETE FROM tickets WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('ticket deleted...');
    });
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
/*app.post('/addticket', (req, res) => {
    let data = {name:req.body.name, body:req.body.body};
    let sql = 'INSERT INTO ticket SET ?';
    let query = db.query(sql, data, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post 2 added...');
    });
    return "post added";
}); */

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
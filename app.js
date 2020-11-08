const express = require('express');
const mysql = require('mysql');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
var PORT = process.env.PORT || '3000';


/*
const db = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'ticket-system',
    password: 'ticket-system',
    database: 'ticket-system'
});
*/


// Create connection
const db = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b43bc934692437',
    password: 'd0bfc8b6',
    database: 'heroku_ce5c9338aca33a6'
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

app.get('/', function(req, res) {
    res.render('login');
});

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
        let sql = `SELECT * FROM tickets WHERE id = ${req.params.id}`;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            // console.log(result);
            // res.send('Post updated...');
            res.render('editForm', {
                title : 'Update Repair Ticket List',
                tickets : result
            });
        });
        // res.render('editForm');
    });

app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "UPDATE tickets SET name='"+req.body.name+"',  phone_number='"+req.body.phone_number+"',  cellphone='"+req.body.cellphone+"', problem='"+req.body.problem+"' where id ="+userId;
    let query = db.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/dashboard');
    });
});


// Delete ticket
app.get('/delete/:id', (req, res) => {
    let sql = `DELETE FROM tickets WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.redirect('/dashboard');
    });
});


app.listen(PORT, () => {
    console.log('Server started');
});
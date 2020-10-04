const express = require("express");
const mysql = require("mysql");

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nodejs-login-db'
});

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MYSQL is Connected")
    }
} )

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>")
}); 

app.listen(5002, () => {
    console.log("Server started on Port 5002");
})
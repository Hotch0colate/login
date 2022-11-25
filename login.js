const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { response } = require('express');
const { request } = require('http');

var connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'root',
    database:'account'
});

var app = express();

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});
/*
app.post('/auth', function(request, response){
    var username = request.body.username;
    var password = request.body.password;
    if(username && password){
        connection.query('SELECT * FROM account WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
            if(results.length > 0){
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            }else{
                response.send('Incorrect username and/or password');
            }
            response.end();
        });
    }else{
        response.send('Please enter username and password');
        response.end();
    }
});

*/
app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if(username && password){
        connection.query('SELECT * FROM account WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
            if (results?.length !== 0){
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and password');
        response.end();
    }
});

app.get('/home', function(request, response){
    if(request.session.loggedin){
        response.send('Welcome back, ' + request.session.username +  '!');
    }
    else{
        response.send('Please login to view this page');
    }
});

app.listen(8080);


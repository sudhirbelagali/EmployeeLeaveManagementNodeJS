//nodemon server.js -e js,hbs
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// const path = require('path');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');



const port = process.env.PORT || 3000;

var app = express();

//Create connection
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'sudhir',
    database: 'nodeleave'
});

//connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});


hbs.registerPartials(__dirname + '/views/partials');
//app.use('view engine', 'hbs');
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
//app.use('/assets',express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

//set public folder as static folder for static file
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFileSync('server.log', log + '\n', (err) => {
        if (err) {
            console.log('unable to append to server log');

        }
    });
    next();
});

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
    //return 'test';
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//route for homepage
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Employee Leave Management System',
        currentYear: new Date().getFullYear(),
        welcomeMessage: 'Employee Leave Management System using NodeJS and MySql'

    });
});
//route for display employees
app.get('/employees', (req, res) => {
    let sql = "SELECT * FROM employee";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('displayemployees.hbs', {
            results: results,
            pageTitle: 'List of all the employees',
            randomid: id = Math.ceil(Math.random(0, 99999) * (0 - 99999) + 99999)
        });
    });
});

//route for saving the employee details
app.post('/save', (req, res) => {
    //id =Math.ceil(Math.random(0, 99999)*(0-99999)+99999);
    let data = {
        id: req.body.txt_id,
        name: req.body.txt_name,
        password: req.body.txt_password,
        mobile: req.body.txt_mobile,
        email: req.body.txt_email,
        aadhaar: req.body.txt_aadhaar,
        department: req.body.txt_department,
        dob: req.body.txt_dob,
        salary: req.body.txt_salary,
        doj: req.body.txt_doj
    };
    let sql = "INSERT INTO employee SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route for saving the leave details
app.get('/applyleave', (req, res) => {
    res.render('applyleave.hbs', {
        pageTitle: 'Apply Leave',
    });
});
//app for saving the leave details
app.post('/applyleaveaction', (req, res) => {
    let data = {
        typeofleave: req.body.txt_typeofleave,
        startdate: req.body.txt_startdate,
        enddate: req.body.txt_enddate,
        reason: req.body.txt_reason
    };
    let sql = "INSERT INTO leaves SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route for update data
app.post('/update', (req, res) => {
    let sql = "UPDATE employee SET name = '" + req.body.txt_name + "', password = '" + req.body.txt_password + "', mobile = '" + req.body.txt_mobile + "', email = '" + req.body.txt_email + "', aadhaar = '" + req.body.txt_aadhaar + "', department = '" + req.body.txt_department + "', dob = '" + req.body.txt_dob + "', salary = '" + req.body.salary + "', doj = '" + req.body.doj + "' WHERE id = '" + req.body.id + "'";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route for delete data
app.post('/delete', (req, res) => {
    let sql = "DELETE FROM employee WHERE id=" + req.body.id + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.get('/about', (req, res) => {
    //res.send('About us Page');
    res.render('about.hbs', {
        pageTitle: 'About Page - Employee Leave Management',
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'unable to handle the request'
    });
});
app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});
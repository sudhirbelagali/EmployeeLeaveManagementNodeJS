const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
//app.use('view engine', 'hbs');
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
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
    //return 'test';
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Employee Leave Management System',
        currentYear: new Date().getFullYear(),
        welcomeMessage: 'Employee Leave Management System using NodeJS and MySql'

    });
    // res.send('Hello Express!');
    //Sending html content to client 
    //res.send('<h1>Hello Express!</h1>');
    //Send JSON 
    // res.send({
    //     name: 'Sudhir',
    //     likes: [
    //         'biking',
    //         'movies',
    //         'Mr.Robot'
    //     ]
    // });
});

app.get('/about', (req, res) => {
    //res.send('About us Page');
    res.render('about.hbs', {
        pageTitle: 'About Page - Employee Leave Management',
        currentYear: new Date().getFullYear()
    });
});
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'unable to handle the request'
    });
});
app.listen(3000, () => {
    console.log('server is up on port 3000');
});
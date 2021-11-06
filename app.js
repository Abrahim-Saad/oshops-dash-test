<<<<<<< HEAD
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// app.use(express.json)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'))
})


=======
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// app.use(express.json)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'))
})


>>>>>>> 0b4fc1ab1c59a613acfeff94060bf36b7b5009b4
app.listen(port, () => console.log("The Server is Up and Running!!"))
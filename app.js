const express = require('express');
const app = express();
let cors = require('cors');
let path = require("path");
// const upload = require("./helpers/upload")
const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  // uri: "mongodb://localhost:27017/doBuy",
  uri: "mongodb+srv://admin:admin@apptestingcluster.vnr36.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  collection: "mySessions",
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store,
  })
);


// Parse form data coming from template-engine
let bodyParser = require("body-parser")
require('dotenv').config();
app.use(express.json());
app.use(cors());
const connection = require("./config/db.config");
connection();
// const upload = require('express-fileupload');
const upload = require('./node_modules/express-fileupload/lib/index');

app.use(upload());
app.use('/uploads', express.static('uploads'));
let staticFiles = path.join(__dirname, 'public');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(staticFiles)); // static files
app.set("view-engine", "ejs"); // for html response

app.use(require("./modules/admins/routes/admins.routes"));
app.use(require("./modules/admins/routes/dashboard.routes"));
app.use(require("./modules/categories/routes/categories.routes"));
app.use(require('./modules/products/routes/products.routes'));
app.use(require('./modules/stores/routes/stores.routes'));
app.use(require("./modules/users/routes/users.routes"));
app.use(require("./modules/advertisment/routes/advertisment.routes"));

let port = 8080 || process.env.PORT

app.listen(port, console.log(`Server is up and running on port ${port}!`));
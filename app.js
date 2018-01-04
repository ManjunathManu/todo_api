require('./config/config');

const path = require('path');
const  bcrypt = require('bcryptjs');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {authenticate} = require('./middleware/authenticate');
const publicPath = path.join(__dirname,'./public');
const port = process.env.PORT;


const formidable = require('express-formidable');

let app = express();

app.use(bodyParser.json())
app.use(require('./controllers'));
app.use(express.static(publicPath));


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

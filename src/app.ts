import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
// import {  } from 'express-fileupload';
const fileUpload = require('express-fileupload');
import { Extension } from './shared';
import { fileRouter } from './routes';
import { errorHandler } from './middleware';

new Extension();

const app = express();

let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');

  next();
};

dotenv.load({ path: '.env' });

app.set('port', (process.env.DEFAULT_PORT || 3000));
app.set('baseUrl', '/api');

app.use(fileUpload());
app.use(allowCrossDomain);

// express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

// for database
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
const db = mongoose.connection;

(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    app.use(`${app.get('baseUrl')}/file/`, fileRouter);

    // middleware error handler
    app.use(errorHandler);


    // start server
    app.listen(app.get('port'), () => console.log(`Server is listening on port ${app.get('port')}`));
});


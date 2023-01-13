var createError = require('http-errors');
var express = require('express');

const pathConfig = require('./path');
const rateLimit = require('express-rate-limit')
var morgan = require('morgan');
var colors = require('colors');
var helmet = require('helmet');
var xss = require('xss-clean');
var cookieParser = require('cookie-parser');
var errorHandler = require('./app/middleware/error')
var cors = require('cors');


var app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(cookieParser())
app.use(helmet())
app.use(xss())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);

global.__base = __dirname + '/';
global.__path_app = __base + pathConfig.folder_app + '/';

global.__path_schemas = __path_app + pathConfig.folder_schemas + '/';
global.__path_models = __path_app + pathConfig.folder_models + '/';
global.__path_routers = __path_app + pathConfig.folder_routes + '/';
global.__path_configs = __path_app + pathConfig.folder_configs + '/';
global.__path_validates = __path_app + pathConfig.folder_validates + '/';
global.__path_middleware = __path_app + pathConfig.folder_middleware + '/';
global.__path_utils = __path_app + pathConfig.folder_utils + '/';

const mongoose = require('mongoose');
const systemConfig = require(__path_configs + 'system');
const databaseConfig = require(__path_configs + 'database');




mongoose.set('strictQuery', true);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.database}.so6n0gl.mongodb.net/?retryWrites=true&w=majority`);
  console.log('connected'.magenta);

}


// Local variable
app.locals.systemConfig = systemConfig;


// Setup router
app.use('/api/v1/', require(__path_routers + 'index'));

app.use(errorHandler);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.end('Error App');
// });

module.exports = app;



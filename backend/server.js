const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileupload = require('express-fileupload');
const path = require('path');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const skills = require('./routes/skills');
const locations = require('./routes/locations');
const tasks = require('./routes/tasks');
const connections = require('./routes/connections');
const transactions = require('./routes/transactions');
const reviews = require('./routes/reviews');
const search = require('./routes/search');
const upload = require('./routes/upload');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/skills', skills);
app.use('/api/v1/locations', locations);
app.use('/api/v1/tasks', tasks);
app.use('/api/v1/connections', connections);
app.use('/api/v1/transactions', transactions);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/search', search);
app.use('/api/v1/upload', upload);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
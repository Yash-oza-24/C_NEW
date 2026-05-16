// Main server entry (CommonJS)
const express = require('express');
require('dotenv').config();
require('./config/db');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());
// Serve uploaded files
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// Root route
app.get('/', (req, res) => res.send('Server is running!'));

// Start server
app.listen(port, () => console.log('Server started on port ' + port));

// server.js
require('dotenv').config({ path: './../config.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Adjust according to your React app's URL
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use(csurf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' } }));

// Route to send CSRF token
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use(errorHandler);

// CSP configuration example
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"], // Only allow scripts from the domain itself
    scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts and scripts from the domain
    styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"], // Styles from the domain and Google Fonts
    fontSrc: ["'self'", 'https://fonts.gstatic.com'], // Fonts from the domain and Google Fonts
    imgSrc: ["'self'", 'data:', 'https://your-image-source.com'], // Images from the domain, data URIs, and a specific source
    // Add other directives as needed
  },
};

app.use(helmet.contentSecurityPolicy(cspConfig));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

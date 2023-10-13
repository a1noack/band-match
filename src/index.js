import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signup from './App';
import reportWebVitals from './reportWebVitals';

//
//
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const app = express();
//
// app.use(cors());  // Enable CORS for all routes
//
// app.post('/generate-image', express.json(), async (req, res) => {
//     const prompt = req.body.prompt;
//
//     try {
//         const response = await axios.post('https://api.openai.com/v1/images/generations', {
//             prompt: prompt,
//             n: 1,
//             size: '1024x1024'
//         }, {
//             headers: {
//                 'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         const image = response.data.generated_image_url;
//         res.json({ image });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });
//
// exports.app = functions.https.onRequest(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Signup />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

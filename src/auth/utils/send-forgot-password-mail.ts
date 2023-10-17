import axios from 'axios';

import FormData = require('form-data');

import { v4 as uuidv4 } from 'uuid';

export const forgotPasswordStore = {};

export const generateForgotPasswordCode = (email: string) => {
  const code = generateRandom5DigitNumber();
  forgotPasswordStore[email] = {
    code,
    validToken: null,
  };
  return code;
};

export const validateForgotPasswordCode = (email: string, code: string) => {
  const isMatch = forgotPasswordStore[email].code === code;
  if (!isMatch) return null;
  const validToken = uuidv4();
  forgotPasswordStore[email] = {
    code: null,
    validToken,
  };
  return validToken;
};

export const isValidForgotPasswordToken = (email: string, token: string) => {
  const validToken = forgotPasswordStore[email].validToken;
  if (!validToken) return false;
  return validToken === token;
};

const generateRandom5DigitNumber = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const sendForgotPasswordMail = async (email: string, code: string) => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM;
  const to = email;
  const subject = 'Forgot Password';
  const html = emailTemplate(code);

  const formData = new FormData();
  formData.append('from', from);
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('html', html);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Basic ${apiKey}`,
    },
  };

  axios
    .post(`https://api.mailgun.net/v3/${domain}/messages`, formData, config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error.response);
    });
};

// email template for forgot password mail fancy beautiful
const emailTemplate = (code: string) => `
        <html>
            <head>
                <style>
                    /* Add your custom styles here */
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .message {
                        margin-bottom: 20px;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .message h1 {
                        margin-top: 0;
                        margin-bottom: 10px;
                        font-size: 24px;
                        font-weight: bold;
                        text-align: center;
                    }
                    .message h2 {
                        text-align: center;
                    }
                    .message p {
                        margin-top: 0;
                        margin-bottom: 10px;
                        font-size: 16px;
                        line-height: 1.5;
                        text-align: center;
                    }
                    .cta {
                        text-align: center;
                    }
                    .cta a {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        transition: background-color 0.2s ease-in-out;
                    }
                    .cta a:hover {
                        background-color: #0062cc;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="message">
                        <h1>Forgot Your Password?</h1>
                        <p>No worries! We've got you covered.</p>
                        <p>Use the following code to reset your password:</p>
                        <h2>${code}</h2>
                    </div>
                </div>
            </body>
        </html>
    `;

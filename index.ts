import express from 'express';
import morgan from 'morgan'
import actions from './actions';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(morgan('combined'));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === "OPTIONS") return res.status(200).end();
    next();
});

actions.get.forEach((action) => app.get(action.path, action.controller))
actions.post.forEach((action) => app.post(action.path, action.controller))

app.use(express.static('static'));

app.listen(8008, () => {
    console.log('gpteer listening on port 8008');
});
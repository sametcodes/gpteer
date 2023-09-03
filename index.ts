import express from 'express';
import * as controller from './controller';
import morgan from 'morgan'

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

app.get("/visit", controller.visit);
app.get("/click", controller.click);
app.get("/search", controller.observe);
app.get("/router", controller.router);
app.get("/type", controller.type);
app.get("/wait", controller.wait);
app.get("/exit", controller.exit);

app.use(express.static('static'));

app.listen(8008, () => {
    console.log('PuppeteerGPT listening on port 8008');
});
import { Request, Response } from 'express';
import puppeteer, { Browser, Page } from 'puppeteer';

import fs from 'fs';

var browser: Browser;
var page: Page;

export const visit = async (req: Request, res: Response) => {
    const url = req.query.url as string;

    if (!url) {
        res.status(400).send('Missing site parameter');
        return;
    }

    if (!page) {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
        page = await browser.newPage();
    }

    const preloadFile = fs.readFileSync('./scripts/index.js', 'utf8');
    await page.evaluateOnNewDocument(preloadFile);

    await page.goto(url, { waitUntil: 'networkidle2' });

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return JSON.stringify(parseDocument(document));
    });
    return res.status(200).json(mapObject);
}

export const click = async (req: Request, res: Response) => {
    const selector = req.query.selector as string;

    if (!selector) {
        res.status(400).send('Missing selector parameter');
        return;
    }

    await page.waitForSelector(selector);
    await page.click(selector);
    return res.status(200).send('OK');
}

export const type = async (req: Request, res: Response) => {
    const selector = req.query.selector as string;
    const text = req.query.text as string;

    if (!selector) {
        res.status(400).send('Missing selector parameter');
        return;
    }

    if (!text) {
        res.status(400).send('Missing text parameter');
        return;
    }

    console.log("Type: ", { selector, text });
    await page.waitForSelector(selector);
    await page.type(selector, text, { delay: 100 });
    return res.status(200).send('OK');
}

export const exit = async (req: Request, res: Response) => {
    await page.close();
    await browser.close();
    return res.status(200).send('OK');
}
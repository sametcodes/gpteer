import { Request, Response } from 'express';

import puppeteer, { Browser, Page } from 'puppeteer';

var browser: Browser;
let page: Page;

export const visit = async (req: Request, res: Response) => {
    console.log(req.query)
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

    await page.goto(url, { waitUntil: 'networkidle2' });
    const source = await page.content();
    res.status(200).send(source);
}

export const click = async (req: Request, res: Response) => {
    const selector = req.query.selector as string;

    if (!selector) {
        res.status(400).send('Missing selector parameter');
        return;
    }

    await page.waitForSelector(selector);
    await page.click(selector);
    res.status(200).send('OK');
}
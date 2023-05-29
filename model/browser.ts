import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';

let browser: Browser | null;
let page: Page | null;

export const launchPage = async () => {
    browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });
    page = await browser.newPage();

    const preloadFile = fs.readFileSync('./scripts/index.js', 'utf8');
    await page.evaluateOnNewDocument(preloadFile);

    return page;
}

export const getPage = async () => {
    if (!page) return launchPage();

    return page;
}

export const closePage = async () => {
    await page?.close();
    await browser?.close();

    page = null;
    browser = null;
}
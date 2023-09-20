import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';

let browser: Browser | null;
let page: Page | null;

export const launchPage = async () => {
    browser = await puppeteer.connect({ browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT })
    page = await browser.newPage();
    page.setViewport({ width: 1680, height: 1050 });

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
    page = null;
}
import { Request, Response } from 'express';
import { closePage, getPage } from '../model/browser';

type VisitRequestQuery = { url: string, }
export const visit = async (req: Request, res: Response) => {
    const page = await getPage();
    const { url } = req.query as VisitRequestQuery;

    if (!url) return res.status(400).send('Missing site parameter');

    await page.goto(url, { waitUntil: 'networkidle2' });

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return parseDocument(document)
    });
    return res.status(200).json(mapObject);
}

type ClickRequestQuery = { selector: string, }
export const click = async (req: Request, res: Response) => {
    const page = await getPage();
    const { selector } = req.query as ClickRequestQuery;

    if (!selector) {
        res.status(400).send('Missing selector parameter');
        return;
    }

    await page.waitForSelector(selector);
    await page.click(selector);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return parseDocument(document)
    });

    return res.status(200).json(mapObject);
}

type TypeRequestQuery = { selector: string, text: string, pressEnter?: string }
export const type = async (req: Request, res: Response) => {
    const page = await getPage();
    const { selector, text, pressEnter = "true" } = req.query as TypeRequestQuery;

    if (!selector) {
        res.status(400).send('Missing selector parameter');
        return;
    }

    if (!text) {
        res.status(400).send('Missing text parameter');
        return;
    }

    await page.waitForSelector(selector);
    await page.type(selector, text, { delay: 100 });

    if (pressEnter === "true") await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return parseDocument(document)
    });
    return res.status(200).json(mapObject);
}

export const exit = async (req: Request, res: Response) => {
    await closePage();
    return res.status(200).send('OK');
}
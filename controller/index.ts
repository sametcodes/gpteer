import { Request, Response } from 'express';
import { closePage, getPage } from '../model/browser';
import { waitForTimeout } from '../utils';

type VisitRequestQuery = { url: string, }
export const visit = async (req: Request, res: Response) => {
    const page = await getPage();
    const { url } = req.query as VisitRequestQuery;

    if (!url) return res.status(400).send('Missing site parameter');

    await page.goto(url, { waitUntil: 'networkidle2' });
    await waitForTimeout(2000);

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return parseDocument(document)
    });
    return res.status(200).json(mapObject);
}

type ClickRequestQuery = { selector: string, xpath?: boolean }
export const click = async (req: Request, res: Response) => {
    const page = await getPage();
    const { selector, xpath = false } = req.query as unknown as ClickRequestQuery;

    if (!selector) {
        res.status(400).send('Missing selector parameter');
        return;
    }

    let element;
    if (xpath) element = await page.waitForXPath(selector);
    else element = await page.waitForSelector(selector);

    await element?.click();
    await waitForTimeout(2000);

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return parseDocument(document)
    });

    return res.status(200).json(mapObject);
}

type TypeRequestQuery = { selector: string, text: string, xpath?: boolean, pressEnter?: string }
export const type = async (req: Request, res: Response) => {
    const page = await getPage();
    const { selector, text, xpath = false, pressEnter = "true" } = req.query as unknown as TypeRequestQuery;

    if (!selector) {
        res.status(400).send('Missing selector parameter');
        return;
    }

    if (!text) {
        res.status(400).send('Missing text parameter');
        return;
    }

    let element;
    if (xpath) element = await page.waitForXPath(selector);
    else element = await page.waitForSelector(selector);

    await element?.type(text, { delay: 100 });
    if (pressEnter === "true") await page.keyboard.press('Enter');
    await waitForTimeout(2000);

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return parseDocument(document)
    });
    return res.status(200).json(mapObject);
}

export const wait = async (req: Request, res: Response) => {
    const page = await getPage();
    const { time } = req.query;

    if (!time) {
        res.status(400).send('Missing time parameter');
        return;
    }

    await waitForTimeout(2000);

    return res.status(200).send('OK');
}

export const observe = async (req: Request, res: Response) => {
    const xpath = req.query.xpath as string;
    const page = await getPage();

    if (!xpath) {
        res.status(400).send('Missing xpath parameter');
        return;
    }

    const mapObject = await page.evaluate(() => {
        // @ts-ignore
        return parseDocument(document)
    });
    return res.status(200).json(mapObject);
}

export const router = async (req: Request, res: Response) => {
    const action = req.query.action as string;
    const page = await getPage();

    const actions = ['back', 'forward', 'reload'];

    if(!actions.includes(action)) {
        res.status(400).send(`Invalid action parameter. Must be one of ${actions.join(', ')}.`);
        return;
    }

    if(action === 'back') await page.goBack();
    if(action === 'forward') await page.goForward();
    if(action === 'reload') await page.reload();

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
import { Request, Response } from 'express';
import { closePage, getPage } from '../model/browser';
import { waitForTimeout } from '../utils';

type VisitRequestQuery = { url: string, }
export const visit = async (req: Request, res: Response) => {
    try {
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
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                error: true,
                name: err.name,
                message: err.message
            })
        }
    }
}

type ClickRequestQuery = { selector: string, xpath?: "true" | "false" }
export const click = async (req: Request, res: Response) => {
    try {

        const page = await getPage();
        const { selector, xpath = true } = req.query as unknown as ClickRequestQuery;

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        let element;
        if (xpath === "true") element = await page.waitForXPath(selector);
        else element = await page.waitForSelector(selector);
        if (!element) return res.status(400).send('Element not found');

        await element.click();
        await waitForTimeout(2000);

        const mapObject = await page.evaluate(() => {
            // @ts-ignore
            return parseDocument(document)
        });

        return res.status(200).json(mapObject);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                error: true,
                name: err.name,
                message: err.message
            })
        }
    }
}

type TypeRequestQuery = { selector: string, text: string, xpath?: "true" | "false", pressEnter?: string }
export const type = async (req: Request, res: Response) => {
    try {
        const page = await getPage();
        const { selector, text, xpath = true, pressEnter = "true" } = req.query as unknown as TypeRequestQuery;

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        if (!text) {
            res.status(400).send('Missing text parameter');
            return;
        }

        let element;
        if (xpath === "true") element = await page.waitForXPath(selector);
        else element = await page.waitForSelector(selector);
        if (!element) return res.status(400).send('Element not found');

        await element.type(text, { delay: 100 });
        if (pressEnter === "true") await page.keyboard.press('Enter');
        await waitForTimeout(2000);

        const mapObject = await page.evaluate(() => {
            // @ts-ignore
            return parseDocument(document)
        });
        return res.status(200).json(mapObject);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                error: true,
                name: err.name,
                message: err.message
            })
        }
    }
}

type WaitRequestQuery = { time: string };
export const wait = async (req: Request, res: Response) => {
    const { time } = req.query as unknown as WaitRequestQuery;

    if (!time) {
        res.status(400).send('Missing time parameter');
        return;
    }

    await waitForTimeout(2000);
    return res.status(200).send('OK');
}

type ObserveRequestQuery = { selector: string, xpath?: "true" | false }
export const observe = async (req: Request, res: Response) => {
    try {
        const { selector, xpath } = req.query as unknown as ObserveRequestQuery;
        const page = await getPage();

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        let element;
        if (xpath === "true") element = await page.waitForXPath(selector);
        else element = await page.waitForSelector(selector);
        if (!element) return res.status(400).send('Element not found');

        return res.status(200).json({
            selector: selector,
            exists: true,
            clickable: await element.isIntersectingViewport(),
            visible: await element.isIntersectingViewport()
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                error: true,
                title: err.name,
                message: err.message
            })
        }
    }
}
type RouterRequestQuery = { action: "back" | "forward" | "reload"; }
export const router = async (req: Request, res: Response) => {
    try {
        const { action } = req.query.action as unknown as RouterRequestQuery;
        const page = await getPage();

        const actions = ['back', 'forward', 'reload'];

        if (!actions.includes(action)) {
            res.status(400).send(`Invalid action parameter. Must be one of ${actions.join(', ')}.`);
            return;
        }

        if (action === 'back') await page.goBack();
        if (action === 'forward') await page.goForward();
        if (action === 'reload') await page.reload();

        const mapObject = await page.evaluate(() => {
            // @ts-ignore
            return parseDocument(document)
        });
        return res.status(200).json(mapObject);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                error: true,
                title: err.name,
                message: err.message
            })
        }
    }
}

export const exit = async (req: Request, res: Response) => {
    await closePage();
    return res.status(200).send('OK');
}
import { Request, Response } from 'express';
import { closePage, getPage } from '../model/browser';
import { waitForTimeout } from '../utils';
import fs from 'fs';
import fetch from 'node-fetch';

import * as actions from '../actions/get';

type VisitRequestQuery = { action: "visit", url: string; }
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

type ClickRequestQuery = { action: "click", selector: string, xpath?: "true" | "false" }
export const click = async (req: Request, res: Response) => {
    try{
        const page = await getPage();
        const { selector, xpath = "true" } = req.query as unknown as ClickRequestQuery;

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

type TypeRequestQuery = { action: "type", selector: string, text: string, xpath?: "true" | "false", pressEnter?: string }
export const type = async (req: Request, res: Response) => {
    try {
        const page = await getPage();
        const { selector, text, xpath = "true", pressEnter = "true" } = req.query as unknown as TypeRequestQuery;

        console.log({
            selector,
            text,
            xpath,
            pressEnter
        })

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        if (!text) {
            res.status(400).send('Missing text parameter');
            return;
        }

        let element;
        if (xpath === "true") { element = await page.waitForXPath(selector); }
        else { element = await page.waitForSelector(selector); }

        if (!element) { return res.status(400).send('Element not found'); }

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

type WaitRequestQuery = { action: "wait", time: string };
export const wait = async (req: Request, res: Response) => {
    const { time } = req.query as unknown as WaitRequestQuery;

    if (!time) {
        res.status(400).send('Missing time parameter');
        return;
    }

    await waitForTimeout(2000);
    return res.status(200).send('OK');
}

type ObserveRequestQuery = { action: "observe", selector: string, xpath?: "true" | "false" }
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
type RouterRequestQuery = { action: "router", payload: "back" | "forward" | "reload"; }
export const router = async (req: Request, res: Response) => {
    try {
        const { payload } = req.query as unknown as RouterRequestQuery;
        const page = await getPage();

        const actions = ['back', 'forward', 'reload'];

        if (!actions.includes(payload)) {
            res.status(400).send(`Invalid payload parameter. Must be one of ${actions.join(', ')}.`);
            return;
        }

        if (payload === 'back') await page.goBack();
        if (payload === 'forward') await page.goForward();
        if (payload === 'reload') await page.reload();

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

type SaveTaskRequestQuery = { action: "save" }
export const savetask = async (req: Request, res: Response) => {
    const { name, tasks } = req.body;

    if (!name) {
        res.status(400).send('Missing name parameter');
        return;
    }

    const timestamp = Date.now();
    const macro = { name: name, tasks: tasks, timestamp: timestamp }
    fs.writeFileSync(`./tasks/${name}_${timestamp}.json`, JSON.stringify(macro, null, 2));

    return res.status(200).send('OK');
}

type ExitRequestQuery = { action: "exit" }
export const exit = async (req: Request, res: Response) => {
    await closePage();
    return res.status(200).send('OK');
}

type MacroTaskType = VisitRequestQuery | ClickRequestQuery | TypeRequestQuery | WaitRequestQuery | ObserveRequestQuery | RouterRequestQuery;
type ReplayRequestQuery = { action: "replay", name: string }
export const replay = async (req: Request, res: Response) => {
    const { name } = req.query as unknown as ReplayRequestQuery;

    const taskOverriden = req.body;

    if (!name) return res.status(400).send('Missing name parameter');
    if (!fs.existsSync(`./tasks/${name}.json`)) return res.status(400).send('Task not found');

    const macro = JSON.parse(fs.readFileSync(`./tasks/${name}.json`, 'utf8')) as { name: string, tasks: MacroTaskType[], timestamp: number }

    for (let task of macro.tasks) {
        const { action, ...params } = task;
        const searchParams = new URLSearchParams(params as any)
        const url = new URL("http://localhost:8008" + actions[action].path + "?" + searchParams);
        console.log("[TASK]", action, url.toString())
        await fetch(url, { method: actions[action].method }).then(res => res.text())
        await waitForTimeout(2000);
    }

    return res.status(200).send("OK");
}
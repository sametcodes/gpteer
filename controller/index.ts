import { Request, Response } from 'express';
import { closePage, getPage } from '../model/browser';
import { waitForTimeout } from '../utils';
import fs from 'fs';
import fetch, { BodyInit, HeaderInit } from 'node-fetch';

import { actions } from '../actions';
import { MouseClickOptions, MouseMoveOptions, MouseOptions, Point, Protocol } from 'puppeteer';

type VisitRequestQuery = { action: "visit", url: string; }
export const visit = async (req: Request, res: Response) => {
    try {
        const page = await getPage();
        const { url } = req.query as VisitRequestQuery;

        if (!url) return res.status(400).send('Missing site parameter');

        await page.goto(url, { waitUntil: 'networkidle2' });
        await waitForTimeout(2000);

        return res.status(200).json({
            success: true,
            message: "Page visited"
        });
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

type MouseMethods = {
    move?: { x: number, y: number, options?: MouseMoveOptions },
    down?: { options: MouseOptions },
    up?: { options: MouseOptions },
    click?: { x: number, y: number, options?: MouseClickOptions },
    wheel?: { deltaX: number, deltaY: number },
    drag?: { start: Point, target: Point },
    dragAndDrop?: { source: Point, target: Point, options?: { delay: number } }
}
type MouseRequestQuery = { action: "mouse" }
export const mouse = async (req: Request, res: Response) => {
    try {
        const page = await getPage();

        const mouseEvent = req.body as MouseMethods;
        if (!mouseEvent) return res.status(400).send('Missing method parameter');

        let eventResponse = [];

        if (mouseEvent.move) {
            console.log("[MOVE]:", JSON.stringify(mouseEvent.move))
            await page.mouse.move(mouseEvent.move.x, mouseEvent.move.y, mouseEvent.move.options);
            eventResponse.push({ message: "Mouse move triggered", data: mouseEvent.move })
        }
        if (mouseEvent.down) {
            console.log("[DOWN]:", JSON.stringify(mouseEvent.down))
            await page.mouse.down(mouseEvent.down.options);
            eventResponse.push({ message: "Mouse down triggered", data: mouseEvent.down })
        }
        if (mouseEvent.up) {
            console.log("[UP]:", JSON.stringify(mouseEvent.up))
            await page.mouse.up(mouseEvent.up.options);
            eventResponse.push({ message: "Mouse up triggered", data: mouseEvent.up })
        }
        if (mouseEvent.click) {
            console.log("[CLICK]:", JSON.stringify(mouseEvent.click))
            await page.mouse.click(mouseEvent.click.x, mouseEvent.click.y, mouseEvent.click.options);
            eventResponse.push({ message: "Mouse click triggered", data: mouseEvent.click })
        }
        if (mouseEvent.wheel) {
            console.log("[WHEEL]:", JSON.stringify(mouseEvent.wheel))
            await page.mouse.wheel(mouseEvent.wheel);
            eventResponse.push({ message: "Mouse wheel triggered", data: mouseEvent.wheel })
        }
        if (mouseEvent.drag) {
            console.log("[DRAG]:", JSON.stringify(mouseEvent.drag))
            await page.mouse.drag(mouseEvent.drag.start, mouseEvent.drag.target);
            eventResponse.push({ message: "Mouse drag triggered", data: mouseEvent.drag })
        }
        if (mouseEvent.dragAndDrop) {
            console.log("[DRAG'N'DROP:]", JSON.stringify(mouseEvent.dragAndDrop))
            await page.mouse.dragAndDrop(mouseEvent.dragAndDrop.source, mouseEvent.dragAndDrop.target, mouseEvent.dragAndDrop.options);
            eventResponse.push({ message: "Mouse dragAndDrop triggered", data: mouseEvent.dragAndDrop })
        }

        return res.status(200).json({
            success: true,
            message: "Mouse event triggered",
            response: eventResponse
        });
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
    try {
        const page = await getPage();
        const { selector, xpath = "true" } = req.query as unknown as ClickRequestQuery;

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        let element;
        if (xpath.toLowerCase() === "true") { [element] = await page.$x(selector); }
        else { [element] = await page.$$(selector); }

        if (!element) return res.status(400).send('Element not found');

        const isIntersecting = await element.isIntersectingViewport();
        if (!isIntersecting) await element.scrollIntoView();
        await element.click();

        return res.status(200).json({
            success: true,
            message: "Element clicked"
        });
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

type HoverRequestQuery = { action: "hover", selector: string, xpath?: "true" | "false" }
export const hover = async (req: Request, res: Response) => {
    try {
        const page = await getPage();
        const { selector, xpath = "true" } = req.query as unknown as ClickRequestQuery;

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        let element;
        if (xpath.toLowerCase() === "true") { [element] = await page.$x(selector); }
        else { [element] = await page.$$(selector); }

        if (!element) return res.status(400).send('Element not found');

        const isIntersecting = await element.isIntersectingViewport();
        if (!isIntersecting) await element.scrollIntoView();
        await element.hover();


        return res.status(200).json({
            success: true,
            message: "Element hovered"
        });
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

type SelectRequestQuery = { action: "select", selector: string, option: string }
export const select = async (req: Request, res: Response) => {
    try {
        const page = await getPage();
        const { selector, option } = req.query as unknown as SelectRequestQuery;

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        const element = await page.$(selector);
        if (!element) return res.status(400).send('Element not found');

        const isIntersecting = await element.isIntersectingViewport();
        if (!isIntersecting) await element.scrollIntoView();

        await page.select(selector, option);

        return res.status(200).json({
            success: true,
            message: "Dropdown option selected"
        });
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

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        if (!text) {
            res.status(400).send('Missing text parameter');
            return;
        }

        let element;
        if (xpath.toLowerCase() === "true") { element = await page.waitForXPath(selector); }
        else { element = await page.waitForSelector(selector); }

        if (!element) { return res.status(400).send('Element not found'); }

        await element.type(text, { delay: 100 });
        if (pressEnter?.toLowerCase() === "true") await page.keyboard.press('Enter');

        return res.status(200).json({
            success: true,
            message: "Text typed.",
        });
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

    await waitForTimeout(Number(time));
    return res.status(200).json({
        success: true,
        message: "Waited for " + time + "ms"
    });
}

type ObserveRequestQuery = { action: "observe", selector: string, xpath?: "true" | "false" }
export const observe = async (req: Request, res: Response) => {
    try {
        const { selector, xpath = "true" } = req.query as unknown as ObserveRequestQuery;
        const page = await getPage();

        if (!selector) {
            res.status(400).send('Missing selector parameter');
            return;
        }

        let element;
        if (xpath.toLowerCase() === "true") element = await page.waitForXPath(selector);
        else element = await page.waitForSelector(selector);
        if (!element) return res.status(400).send('Element not found');

        return res.status(200).json({
            success: true,
            message: "Element found",
            data: {
                selector: selector,
                exists: true,
                clickable: await element.isIntersectingViewport(),
                visible: await element.isIntersectingViewport()
            }
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

        return res.status(200).json({
            success: true,
            message: "Page router action taken: " + payload
        });
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

type EvaluateRequestQuery = { action: "evaluate", code: string }
export const evaluate = async (req: Request, res: Response) => {
    try {
        const { code } = req.body as EvaluateRequestQuery;
        const page = await getPage();

        if (!code) {
            res.status(400).send('Missing expression parameter');
            return;
        }

        const evaluateResponse = await page.evaluate(code);
        if (!evaluateResponse) return res.status(400).json({
            success: false,
            message: "Expression failed",
            response: evaluateResponse
        });

        return res.status(200).json({
            success: true,
            message: "Evaluated expression",
            response: evaluateResponse
        });
    } catch (err) {
        if (err instanceof Error) {
            console.log(err)
            return res.status(400).json({
                error: true,
                title: err.name,
                message: err.message
            })
        }
    }
}

type ExitRequestQuery = { action: "exit" }
export const exit = async (req: Request, res: Response) => {
    await closePage();
    return res.status(200).json({
        success: true,
        message: "Browser closed"
    });
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

    return res.status(200).json({
        success: true,
        message: "Task saved"
    });
}

type MacroTaskType = VisitRequestQuery | ClickRequestQuery | TypeRequestQuery | WaitRequestQuery | ObserveRequestQuery | RouterRequestQuery;
type ReplayRequestQuery = { action: "replay", name: string }
export const replay = async (req: Request, res: Response) => {
    const { name } = req.query as unknown as ReplayRequestQuery;

    const taskOverriden = req.body;

    if (!name) return res.status(400).send('Missing name parameter');
    if (!fs.existsSync(`./tasks/${name}.json`)) return res.status(400).send('Task not found');

    const macro = JSON.parse(fs.readFileSync(`./tasks/${name}.json`, 'utf8')) as { name: string, tasks: MacroTaskType[], timestamp: number }

    let steps = [];
    for (let task of macro.tasks) {
        const { action, ...params } = task;
        const method = actions[action].method;

        let url: URL | null = null;
        let body: BodyInit | undefined = undefined;
        let headers: HeaderInit | undefined = undefined;

        if (method.toUpperCase() === "GET") {
            const searchParams = new URLSearchParams(params as any)
            url = new URL("http://localhost:8008" + actions[action].path + "?" + searchParams);
        }

        if (method.toUpperCase() === "POST") {
            url = new URL("http://localhost:8008" + actions[action].path);
            body = JSON.stringify(params);
            headers = { 'Content-Type': 'application/json' };
        }

        if (!url) continue;
        try {
            const response = await fetch(url, { method, headers, body }).then(res => {
                if (res.headers.get("content-type")?.includes("application/json")) return res.json();
                return res.text();
            })
            steps.push({ action, response });
        } catch (err) {
            console.log(err)
            steps.push({ action, response: err });
        }
    }

    return res.status(200).json({
        success: true,
        message: "Task replayed",
        steps
    });
}
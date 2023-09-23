import * as controller from '../controller';
import { resolveRaw, resolveJSON } from './middlewares';

export const mouse = {
    method: "post",
    action: "mouse",
    path: "/mouse",
    middlewares: [resolveJSON],
    controller: controller.mouse
}

export const evaluate = {
    method: "post",
    action: "evaluate",
    path: "/evaluate",
    middlewares: [resolveJSON],
    controller: controller.evaluate
}

const savetask = {
    method: "post",
    action: "savetask",
    path: "/savetask",
    middlewares: [resolveJSON],
    controller: controller.savetask
}

const replay = {
    method: "get",
    action: "replay",
    path: "/replay",
    middlewares: [],
    controller: controller.replay
}

export default [
    mouse,
    evaluate,
    savetask,
    replay
]
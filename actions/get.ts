import * as controller from '../controller';

export const visit = {
    method: "get",
    action: "visit",
    path: "/visit",
    controller: controller.visit
}

export const click = {
    method: "get",
    action: "click",
    path: "/click",
    controller: controller.click
}

export const observe = {
    method: "get",
    action: "observe",
    path: "/observe",
    controller: controller.observe
}

export const router = {
    method: "get",
    action: "router",
    path: "/router",
    controller: controller.router
}

export const type = {
    method: "get",
    action: "type",
    path: "/type",
    controller: controller.type
}

export const evaluate = {
    method: "get",
    action: "evaluate",
    path: "/evaluate",
    controller: controller.evaluate
}

export const wait = {
    method: "get",
    action: "wait",
    path: "/wait",
    controller: controller.wait
}

export const exit = {
    method: "get",
    action: "exit",
    path: "/exit",
    controller: controller.exit
}

export default [
    visit,
    click,
    observe,
    router,
    type,
    wait,
    evaluate,
    exit
]
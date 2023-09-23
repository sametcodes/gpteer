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

export const hover = {
    method: "get",
    action: "hover",
    path: "/hover",
    controller: controller.hover
}

export const select = {
    method: "get",
    action: "select",
    path: "/select",
    controller: controller.select
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
    hover,
    select,
    observe,
    router,
    type,
    wait,
    exit
]
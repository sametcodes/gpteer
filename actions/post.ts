import * as controller from '../controller';

export const mouse = {
    method: "post",
    action: "mouse",
    path: "/mouse",
    controller: controller.mouse
}

const savetask = {
    method: "post",
    action: "savetask",
    path: "/savetask",
    controller: controller.savetask
}

const replay = {
    method: "get",
    action: "replay",
    path: "/replay",
    controller: controller.replay
}


export default [
    mouse,
    savetask,
    replay
]
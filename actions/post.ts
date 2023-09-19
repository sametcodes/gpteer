import * as controller from '../controller';

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
    savetask,
    replay
]
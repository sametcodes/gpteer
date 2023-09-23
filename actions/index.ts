import get from './get';
import post from './post';

import {
    visit, click, hover, observe, router,
    type, wait, exit
} from './get';
import { mouse, evaluate } from './post'

export const actions = {
    visit, click, hover, observe, router,
    type, evaluate, wait, exit, mouse
}

export default {
    get,
    post
}
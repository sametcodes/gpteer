import get from './get';
import post from './post';

import {
    visit, click, hover, observe, router,
    type, evaluate, wait, exit
} from './get';
import { mouse } from './post'

export const actions = {
    visit, click, hover, observe, router,
    type, evaluate, wait, exit, mouse
}

export default {
    get,
    post
}
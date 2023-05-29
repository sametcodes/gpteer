function parseDocument(document, lookingFor = ["button", "input"]) {
    let result = {};

    let allElements = document.getElementsByTagName('*');

    for (let i = 0; i < allElements.length; i++) {
        let element = allElements[i];

        if (lookingFor.includes(element.tagName.toLowerCase()) === false) {
            continue;
        }

        if (element.id) {
            addToResult(result, element.tagName.toLowerCase(), `${element.tagName.toLowerCase()}#${element.id}`);
        } else if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(' ').join('.');
            addToResult(result, element.tagName.toLowerCase(), `${element.tagName.toLowerCase()}.${classes}`);
        } else {
            const path = getPathTo(element);
            addToResult(result, element.tagName.toLowerCase(), path);
        }
    }

    return result;
}

function addToResult(result, tagName, selector) {
    if (!result[tagName]) {
        result[tagName] = [];
    }

    result[tagName].push(selector)
}

function getPathTo(element) {
    if (element.id !== '')
        return 'id("' + element.id + '")';
    if (element === document.body)
        return element.tagName;

    let ix = 0;
    let siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element)
            return getPathTo(element.parentNode) + ' > ' + element.tagName.toLowerCase() + ':nth-child(' + (ix + 1) + ')';
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}
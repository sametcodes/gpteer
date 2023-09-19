function parseDocument(document, lookingFor = ["input", "form", "button"]) {
    let result = {};

    let allElements = document.getElementsByTagName('*');

    for (let i = 0; i < allElements.length; i++) {
        let element = allElements[i];

        if (lookingFor.includes(element.tagName.toLowerCase()) === false) {
            continue;
        }

        if (element.id) {
            addToResult(result, element.tagName.toLowerCase(), `${element.tagName.toLowerCase()}#${element.id}`, element);
        } else if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(' ').filter(cl => cl.includes(":") === false).join('.');
            addToResult(result, element.tagName.toLowerCase(), `${element.tagName.toLowerCase()}.${classes}`, element);
        } else {
            const path = getPathTo(element);
            addToResult(result, element.tagName.toLowerCase(), path, element);
        }
    }

    return result;
}

function addToResult(result, tagName, selector, element) {
    if (!result[tagName]) {
        result[tagName] = [];
    }

    result[tagName].push({
        selector: selector,
        name: element.name,
        text: element.innerText
    })
}

function getPathTo(element) {
    if (element.id !== '')
        return '#' + element.id;
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
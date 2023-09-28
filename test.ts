import puppeteer, { Browser, Page } from 'puppeteer';

const main = async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] })
    const page = await browser.newPage();

    await page.exposeFunction('handleEvent', (eventData: any) => {
        console.log('Event Data:', eventData);
    });

    await page.evaluateOnNewDocument(() => {
        const events = ['click', 'keydown', 'keyup', 'keypress'];
        events.forEach(event => {
            // @ts-ignore
            window.addEventListener(event, e => {
                const eventData = { target: e.target, type: e.type }
                // @ts-ignore
                window.handleEvent(eventData);
            });
        });
    });

    await page.goto('http://twitter.com');
}

main();
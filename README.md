
## gpteer

A ChatGPT plugin to drive Puppeteer browser. The aim of the project to provide a simple way to automate browser actions using ChatGPT.

> It's a work in progress, and experimental. Follow me on [Twitter](https://twitter.com/sametcodes) to get updates.

<a href="https://www.loom.com/share/4eea6da77830460797d9ac3661ba2897">
  <img width="400" src="https://cdn.loom.com/sessions/thumbnails/4eea6da77830460797d9ac3661ba2897-1685397857570-with-play.gif" />
</a>

### How it works?

It takes the actions step by step, and each step returns a map object of elements like input and buttons from document. The idea here is helping ChatGPT to read the document without exceeding the limit of the input size, and we don't have to struggle with parsing documents. And it helps to keep the context of the document and it will be aware which button to click on or which input to type on.

Eventually, users will be able to do basic web automations by writing directives like:

```
1 - go to duckduckgo.com
2 - type "hello world" into main text input
3 - click on the submit button
4 - exit
```

### Installation

Clone it, then install dependencies.

```bash
npm install
```

### Usage

```bash
npm run start
```

And load `localhost:8008` on ChatGPT plugings.

It is currently able to:

- Navigate to a URL
- Click on a selector
- Type text on a selector
- Exit the browser

### How to contribute?

I'm open to any contribution. Please feel free to open an issue or send a pull request.

### License

MIT

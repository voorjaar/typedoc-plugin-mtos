# typedoc-plugin-mtos

A plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that turns your typedoc into a single page application.

[![npm](https://img.shields.io/npm/v/typedoc-plugin-mtos.svg)](https://www.npmjs.com/package/typedoc-plugin-mtos)

## What it does?

The plugin add [mtos](https://github.com/voorjaar/mtos) to your docs. You can confgure a CDN or serve static script.

You still serve the static html files, but the user experience is the same as SPA witth incremental requests via fetch on the client side. And you can also add transition animations, progress bar, etc.

## Installation

```bash
npm install --save-dev typedoc typedoc-plugin-mtos
```

## Usage

Usage is the same as documented at [TypeDoc](https://typedoc.org/guides/installation/#command-line-interface).

```bash
typedoc --plugin typedoc-plugin-mtos --out docs src/index.ts
```

## Options

The following options can be used in addition to relevant [TypeDoc options](https://typedoc.org/guides/options/).

- `--cdn<boolean>`<br>
  Using a CDN instead of static script. Defaults to `false`.
- `--cdnLink<string>`<br>
  The CDN link of [mtos](https://github.com/voorjaar/mtos). Defaults to `https://cdn.jsdelivr.net/npm/mtos@${mtos.version}/dist/mtos-iife.min.js`.
- `--customJs<string>`<br>
  Path to a custom JS file to for the script to import.
- `--customStyle<string>`<br>
  Add custom css content to document head.
- `--customScript<string>`<br>
  Add custom script content to document head.

## Advanced

By using `--customJs<string>` and `--customCss<string>` options, you can implement some SPA features, such as adding page transition animation and page loading progress bar.

Create a css file named `assets/custom.css`, then add the following css:

```css
.animated {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

.progress {
  height: 2px;
  width: 100%;
  background-color: #abb8c6;
}

.progress-bar {
  width: 0%;
  height: 100%;
  background-color: #1aa4f4;
  transition: width 0.4s ease;
}
```

Create a js file named `assets/custom.js`, add the following script:

```js
function updateProgress(n) {
  const bar = document.querySelector(".progress-bar");
  if (!bar) return;
  bar.style.width = n + "%";
}

function loadProgress(n = 0) {
  const header = document.querySelector("header");
  if (!header) return;
  const bar = document.createElement("div");
  bar.classList.add("progress");

  const p = document.createElement("div");
  p.classList.add("progress-bar")
  p.style.width = n + "%";

  bar.appendChild(p);
  header.appendChild(bar);

  setTimeout(() => {
    updateProgress(100);
  }, 150)
}

window.addEventListener("load", loadProgress);

mtos.setup({
  onBeforeElUpdated(fromEl, toEl) {
    if (toEl.tagName === "DIV" && toEl.classList.contains("col-content")) {
      toEl.classList.add("animated", "fadeIn");
    }
  },
  onElUpdated(el) {
    if (el.tagName === "DIV" && el.classList.contains("col-content")) {
      setTimeout(() => {
        el.classList.remove("animated", "fadeIn");
      }, 250)
    }
  },
  onFetchStart() {
    updateProgress(0);
  },
  onFetchEnd() {
    updateProgress(30);
  },
  onPageRendered() {
    loadProgress(30);
  }
})
```

Then we can load the animation and progress:

```bash
typedoc --plugin typedoc-plugin-mtos --customCss assets/custom.css --customJs assets/custom.js --out docs src/index.ts
```

> The above steps are just examples, you can define your own animation and progress bar as needed.

## License

[MIT](https://github.com/voorjaar/typedoc-plugin-mtos/blob/main/LICENSE)

Copyright (c) 2022, Raven Satir

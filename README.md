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

## License

[MIT](https://github.com/voorjaar/typedoc-plugin-mtos/blob/main/LICENSE)

Copyright (c) 2022, Raven Satir

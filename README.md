## About

Lightweight module for fetching basic meta information from livestreams

## Installing

Add to your project

```bash
npm install node-livestream-metainfo
// or
yarn add node-livestream-metainfo
```

## Example

```javascript
const parser = require("node-livestream-metainfo");

const station = await parser("https://....");
console.log(station);
```
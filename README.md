# Progressive Web App starter
## React, MobX, React-Router 4, Webpack 2 and Express.js

A starter for progressive web apps.
It contains push messaging, cache api, indexedDB, background sync and server sent events (not really anything to do with PWA's).
Built as a universal app on react, mobx and express.js. It also uses react-router 4 which is still in alpha
and the release-candidate of webpack 2

## How to run
```
npm install OR yarn install
npm run buildProd
npm start
```

To use push messages you need to generate a set of vapid keys to use during subscription
and sending pushmessages. Don't use the ones provided... they are just for testing...

```
npm i web-push -g
web-push generate-vapid-keys [--json]
```

# Progressive-Web-App
A starter for progressive web apps
Contains push messaging, cache api, indexedDB, server sent events and background sync.
Buildt as a universal app on react, mobx and express.js

```
yarn install
npm run buildProd
npm start
```

To use push messages you need to generate a set of vapid keys to use during subscription
and sending pushmessages. Don't use the ones provided... they are just for testing...

```
npm i web-push -g
web-push generate-vapid-keys [--json]
```

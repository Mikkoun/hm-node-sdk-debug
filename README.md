# HM Node SDK debug app

## Configuration

Configuration is at the start of `index.js` file.
**DELAY** - delay in milliseconds between sending commands
**COUNT** - How many commands to send
**APPS** - Apps configuration. If you add multiple apps then they will be used one by one.

## Running the app

First install hmkit dependency

```
npm install
```

Then run the app

```
node index.js
```

## HMKit

By default this app works against staging server. You can change it to run against production server by removing `.staging()` after new hmkit constructor:

```
const hmkit = new HMKit(clientCertificate, clientPrivateKey);
```

If you want to use your local `hm-node-sdk` project, then you have to first uninstall the existing `0.5.2-beta5` version and add a new dependency that uses path to your local repo:

```
npm uninstall hmkit
```

add hmkit with path to **package.json** dependencies and run install command:

```
"dependencies": {
    "hmkit": "../path-to-node-sdk-folder/"
}
```

```
npm install
```

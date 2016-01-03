Redux Import Export Monitor
==============================

A simple monitor for [Redux DevTools](https://github.com/gaearon/redux-devtools) that enables exporting, then importing the serialized state of a Redux application. It looks like a ```prompt()``` modal, but without the character limit (from what I've tested).

### Installation

```
npm install --save-dev redux-import-export-monitor
```

### Usage

Include the monitor while setting up the DevTools:

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from 'redux-devtools';
import ImportExportMonitor from 'redux-import-export-monitor';

export default createDevTools(<ImportExportMonitor />);
```

Use ```cmd-shift-e``` (or your preferred key-binding) to open the monitor, which provides the current serialized app state. Paste in the app state from a different DevTools session to "import" the state and actions of that session into the current session.

### Props

Name                  | Description
-------------         | -------------
`openModalKey`        | A string (see [parse-key](https://github.com/thlorenz/parse-key)) to be used to open the monitor.

### License

MIT

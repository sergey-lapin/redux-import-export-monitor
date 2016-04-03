[![npm version](https://badge.fury.io/js/redux-import-export-monitor.svg)](http://badge.fury.io/js/redux-import-export-monitor)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Build Status](https://travis-ci.org/lapanoid/redux-import-export-monitor.svg)](https://travis-ci.org/lapanoid/redux-import-export-monitor)

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

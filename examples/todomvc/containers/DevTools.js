import React from 'react';
import { createDevTools } from 'redux-devtools';
import ImportExportMonitor from 'redux-import-export-monitor';

export default createDevTools(<ImportExportMonitor openModalKey="alt-shift-e" />);

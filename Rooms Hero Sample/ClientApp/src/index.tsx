// © Microsoft Corporation. All rights reserved.
import React from 'react';
import './index.css';
import App from './App';
import { Provider } from '@fluentui/react-northstar';
import { svgIconStyles } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/es/themes/teams/siteVariables';
import { createRoot } from 'react-dom/client';

const iconTheme = {
    componentStyles: {
        SvgIcon: svgIconStyles
    },
    componentVariables: {
        SvgIcon: svgIconVariables
    },
    siteVariables
};


const container = document.getElementById('root');
const root = createRoot(container!);
const html = <Provider theme={iconTheme} className="wrapper">
    < App />
</Provider >;
root.render(html);

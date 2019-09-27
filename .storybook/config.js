import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';
import { withInfo } from '@storybook/addon-info';
import ReavizLogo from './assets/reaviz.svg';
import 'rdk/dist/index.css';

addParameters({
  options: {
    showPanel: false,
    panelPosition: 'right',
    theme: {
      ...themes.dark,
      animation: true,
      brandImage: ReavizLogo,
      brandTitle: 'REAVIZ',
      url: 'https://jask-oss.github.io/reaviz/'
    }
  },
});

const CenterDecorator = storyFn => (
  <div style={{
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }} className="container">
    {storyFn()}
  </div>
);

addDecorator(withInfo);
addDecorator(withKnobs);
addDecorator(CenterDecorator);

// Grep src for .story file extensions
const req = require.context('../src', true, /\.story\.tsx/);
const loadStories = () => req.keys().forEach(filename => req(filename));

configure(loadStories, module);

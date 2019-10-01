import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';
import { withInfo } from '@storybook/addon-info';
import ReavizLogo from './assets/reaviz.svg';

// Customize the UI a bit
addParameters({
  options: {
    showPanel: false,
    panelPosition: 'right',
    theme: {
      ...themes.dark,
      brandImage: ReavizLogo,
      brandTitle: 'REAVIZ',
      url: 'https://reaviz.io'
    }
  },
});

// Custom center decorator that supports docs extensions
const CenterDecorator = storyFn => (
  <div className="container">
    {storyFn()}
  </div>
);

// Add all our decorators
addDecorator(withInfo);
addDecorator(withKnobs);
addDecorator(CenterDecorator);

// Grep src for .story file extensions
const req = require.context('../src', true, /\.story\.tsx/);
const loadStories = () => req.keys().forEach(filename => req(filename));

configure(loadStories, module);

import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';
import { withInfo } from '@storybook/addon-info';
import { DocsPage } from '@storybook/addon-docs/blocks';
import centered from '@storybook/addon-centered/react';
import ReavizLogo from './assets/reaviz.svg';

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
  docs: DocsPage
});

addDecorator(withKnobs);
addDecorator(storyFn => (
  <div style={{ width: 500, height: 400 }}>{storyFn()}</div>
));

// Grep src for .story file extensions
const req = require.context('../src', true, /\.story\.tsx/);
const loadStories = () => req.keys().forEach(filename => req(filename));

configure(loadStories, module);

import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';
import { withInfo } from '@storybook/addon-info';
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
});

addDecorator(centered);
addDecorator(withInfo);
addDecorator(withKnobs);

// Grep src for .story file extensions
const req = require.context('../src', true, /\.story\.tsx/);
const loadStories = () => req.keys().forEach(filename => req(filename));

configure(loadStories, module);

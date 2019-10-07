import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';
import { withInfo } from '@storybook/addon-info';
import ReavizLogo from './assets/reaviz.svg';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

// Customize the UI a bit
addParameters({
  options: {
    showPanel: false,
    panelPosition: 'right',
    storySort: (a, b) => {
      if (a[0].includes('docs-')) {
        if (a[0].includes('intro-')) {
          return -1;
        }

        return 1;
      }

      return 0;
    },
    theme: {
      ...themes.dark,
      brandImage: ReavizLogo,
      brandTitle: 'REAVIZ',
      url: 'https://reaviz.io'
    }
  },
});

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage
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

const loadStories = () => {
  return [
    // Ensure we load Welcome First
    require.context('../docs', true, /Intro.story.mdx/),
    require.context('../docs', true, /GettingStarted.story.mdx/),
    require.context('../docs/charts', true, /\.story.mdx/),
    require.context('../docs/advanced', true, /\.story.mdx/),
    require.context('../src', true, /\.story\.(js|jsx|ts|tsx|mdx)$/)
  ];
}

configure(loadStories(), module);

import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Docs|Welcome', module)
  .add('About', () => (
    <div style={{ margin: '0 auto', maxWidth: '600px', color: 'white', textAlign: 'center' }}>
      <img
        style={{ width: '75%', margin: '0 auto 2em auto' }}
        src="https://github.com/jask-oss/reaviz/raw/master/docs/assets/logo.png"
      />
      <p style={{ fontSize: '16px' }}>
        REAVIZ is a modular chart component library that leverages React natively for rendering the components while
        using D3js under the hood for calculations. The library provides an easy way to get started creating
        charts without sacrificing customization ability.
      </p>
    </div>
  ));


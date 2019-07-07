import React from 'react';
import chroma from 'chroma-js';
import { storiesOf } from '@storybook/react';
import { Sankey } from './Sankey';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';
import {
  sankeyNodes,
  sankeyLinks,
  simpleSankeyNodes,
  simpleSankeyLinks
} from '../common/demo';
import { select } from '@storybook/addon-knobs';

const colorScheme = chroma
  .scale([
    '2b908f',
    '90ee7e',
    'f45b5b',
    '7798BF',
    'aaeeee',
    'ff0066',
    'eeaaee',
    '55BF3B',
    'DF5353',
    '7798BF',
    'aaeeee'
  ])
  .mode('lch')
  .colors(sankeyNodes.length);

const onNodeClick = (title: string) => window.alert(`${title} is clicked`);

storiesOf('Charts/Sankey', module)
  .addParameters({
    component: Sankey
  })
  .add('Simple', () => (
    <Sankey
      colorScheme={colorScheme}
      height={300}
      width={500}
      nodes={simpleSankeyNodes.map((node, i) => (
        <SankeyNode
          key={`node-${i}`}
          {...node}
          onClick={() => onNodeClick(node.title)}
        />
      ))}
      links={simpleSankeyLinks.map((link, i) => (
        <SankeyLink key={`link-${i}`} {...link} />
      ))}
    />
  ))
  .add('Multilevels', () => (
    <Sankey
      colorScheme={colorScheme}
      height={600}
      width={964}
      nodes={sankeyNodes.map((node, i) => (
        <SankeyNode key={`node-${i}`} {...node} />
      ))}
      links={sankeyLinks.map((link, i) => (
        <SankeyLink key={`link-${i}`} {...link} />
      ))}
    />
  ))
  .add('Autosize', () => (
    <div style={{ width: '80vw', height: '65vh', border: 'solid 1px red' }}>
      <Sankey
        colorScheme={colorScheme}
        nodes={sankeyNodes.map((node, i) => (
          <SankeyNode key={`node-${i}`} {...node} />
        ))}
        links={sankeyLinks.map((link, i) => (
          <SankeyLink key={`link-${i}`} {...link} />
        ))}
      />
    </div>
  ))
  .add(
    'Justification',
    () => {
      const justification = select(
        'Alignments',
        {
          Left: 'left',
          Center: 'center',
          Right: 'right',
          Justified: 'justify'
        },
        'left',
        1
      );

      return (
        <Sankey
          colorScheme={colorScheme}
          height={600}
          width={964}
          justification={justification}
          nodes={sankeyNodes.map((node, i) => (
            <SankeyNode key={`node-${i}`} {...node} />
          ))}
          links={sankeyLinks.map((link, i) => (
            <SankeyLink key={`link-${i}`} {...link} />
          ))}
        />
      );
    },
    { options: { showAddonPanel: true } }
  );

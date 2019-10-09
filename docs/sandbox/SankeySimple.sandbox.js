import React from 'react';
import { Sankey, SankeyNode, SankeyLink } from 'reaviz';

export default () => (
  <div style={{ margin: '55px', textAlign: 'center' }}>
    <Sankey
      height={300}
      width={500}
      nodes={[
        <SankeyNode title="A1" id="1" />,
        <SankeyNode title="A2" id="2" />,
        <SankeyNode title="B1" id="3" />,
        <SankeyNode title="B2" id="4" />
      ]}
      links={[
        <SankeyLink source="1" target="3" value="8" gradient={false} />,
        <SankeyLink source="2" target="4" value="4" gradient={false} />,
        <SankeyLink source="1" target="4" value="2" gradient={false} />
      ]}
    />
  </div>
);

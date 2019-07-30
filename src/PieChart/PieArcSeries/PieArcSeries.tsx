import React, { Component } from 'react';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../../common/utils/animations';
import { PieArc, PieArcProps } from './PieArc';
import { arc } from 'd3-shape';
import { PieArcLabel, PieArcLabelProps } from './PieArcLabel';
import { CloneElement } from '../../common/utils/children';
import { sequentialScheme, getColor } from '../../common/utils/color';

export interface PieArcSeriesProps {
  animated: boolean;
  outerRadius: number;
  innerRadius: number;
  data: any;
  arcWidth: number;
  doughnut: boolean;
  height: number;
  width: number;
  label: JSX.Element;
  arc: JSX.Element;
  colorScheme: ((data, index: number) => string) | string[];
}

const factor = 1.2;
const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;
const labelVisible = (arc) => arc.endAngle - arc.startAngle > Math.PI / 30;

export class PieArcSeries extends Component<PieArcSeriesProps> {
  static defaultProps: Partial<PieArcSeriesProps> = {
    animated: true,
    colorScheme: sequentialScheme,
    innerRadius: 0,
    arcWidth: 0.25,
    label: <PieArcLabel />,
    arc: <PieArc />
  };

  calculateRadius() {
    const { doughnut, arcWidth, label, width, height } = this.props;

    const outerRadius = Math.min(width, height) / (label.props.show ? 3 : 2);
    const innerRadius = doughnut ? outerRadius * (1 - arcWidth) : 0;

    return {
      outerRadius,
      innerRadius
    };
  }

  calculateLabelPositions(outerArc, outerRadius) {
    const { label, data } = this.props;

    const positions = data.map(d => {
      const pos = outerArc.centroid(d);
      pos[0] = factor * outerRadius * (midAngle(d) < Math.PI ? 1 : -1);
      return pos;
    });

    if (label.props.show) {
      const minDistance = 15;

      for (let i = 0; i < data.length - 1; i++) {
        const a = data[i];
        if (!labelVisible(a)) {
          continue;
        }

        const [aPosX, aPosY] = positions[i];

        for (let j = i + 1; j < data.length; j++) {
          const b = data[j];
          if (!labelVisible(b)) {
            continue;
          }

          // if they're on the same side
          const [bPosX, bPosY] = positions[j];
          if (bPosX * aPosX > 0) {
            // if they're overlapping
            const o = minDistance - Math.abs(bPosY - aPosY);
            if (o > 0) {
              // push the second up or down
              positions[j][1] += Math.sign(bPosX) * o;
            }
          }
        }
      }
    }

    return positions;
  }

  getColor(point, index) {
    const { colorScheme, data } = this.props;

    return Array.isArray(colorScheme)
      ? getColor(colorScheme, data)(index)
      : colorScheme(point, index);
  }

  innerArc(innerRadius: number, outerRadius: number) {
    return arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
  }

  outerArc(outerRadius: number) {
    return arc()
      .innerRadius(outerRadius * factor)
      .outerRadius(outerRadius * factor);
  }

  render() {
    const { animated, label, arc, data } = this.props;

    const { outerRadius, innerRadius } = this.calculateRadius();
    const innerArc = this.innerArc(innerRadius, outerRadius);
    const outerArc = this.outerArc(outerRadius);
    const positions = this.calculateLabelPositions(outerArc, outerRadius);

    return (
      <PoseGroup animateOnMount={animated}>
        {data.map((arcData: any, index: number) => (
          <PoseSVGGElement key={arcData.data.key.toString()}>
            {label.props.show && labelVisible(arcData) && (
              <CloneElement<PieArcLabelProps>
                element={label}
                data={arcData}
                innerArc={innerArc}
                outerArc={outerArc}
                position={positions[index]}
              />
            )}
            <CloneElement<PieArcProps>
              element={arc}
              data={arcData}
              animated={animated}
              innerArc={innerArc}
              color={this.getColor(arcData, index)}
            />
          </PoseSVGGElement>
        ))}
      </PoseGroup>
    );
  }
}

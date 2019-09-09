import React, { Component, cloneElement } from 'react';
import { Tooltip, TooltipProps } from './Tooltip';
import { TooltipTemplate } from './TooltipTemplate';
import { isFunction } from 'lodash-es';

export interface ChartTooltipProps extends TooltipProps {
  content: any;
  value: any;
  color: any;
  data: any;
}

export class ChartTooltip extends Component<ChartTooltipProps> {
  static defaultProps: Partial<ChartTooltipProps> = {
    content: <TooltipTemplate />
  };

  renderContent() {
    const { content, value, data, color } = this.props;

    if (!value && !data) {
      return null;
    }

    return isFunction(content)
      ? content(data || value, color)
      : cloneElement(content, {
          ...content.props,
          value,
          color
        });
  }

  render() {
    const { content, value, data, color, ...rest } = this.props;
    return <Tooltip {...rest} content={this.renderContent.bind(this)} />;
  }
}

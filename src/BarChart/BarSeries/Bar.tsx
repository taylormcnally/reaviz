import React, { Fragment, Component, createRef, ReactElement } from 'react';
import chroma from 'chroma-js';
import { ChartTooltip, ChartTooltipProps } from '../../common/Tooltip';
import { Gradient, GradientProps } from '../../common/Gradient';
import classNames from 'classnames';
import { ChartInternalShallowDataShape, Direction } from '../../common/data';
import { RangeLinesProps, RangeLines } from './RangeLines';
import bind from 'memoize-bind';
import css from './Bar.module.scss';
import { CloneElement } from '../../common/utils/children';
import { Mask, MaskProps } from '../../common/Mask';
import {
  constructFunctionProps,
  PropFunctionTypes
} from '../../common/utils/functions';
import { motion } from 'framer-motion';
import { DEFAULT_TRANSITION } from '../../common/Motion';
import { BarLabelProps, BarLabel } from './BarLabel';
import { formatValue } from '../../common/utils/formatting';

export type BarType =
  | 'standard'
  | 'grouped'
  | 'stacked'
  | 'stackedNormalized'
  | 'stackedDiverging'
  | 'marimekko'
  | 'waterfall';

export type BarProps = {
  /**
   * D3 scale for X Axis. Set internally by `BarChart`.
   */
  xScale: any;

  /**
   * D3 scale for Y Axis. Set internally by `BarChart`.
   */
  yScale: any;

  /**
   * D3 scale for X Multi-Group Axis. Set internally by `BarChart`.
   */
  xScale1: any;

  /**
   * Parsed data shape. Set internally by `BarChart`.
   */
  data: ChartInternalShallowDataShape;

  /**
   * Id set internally by `BarChart`.
   */
  id: string;

  /**
   * Gradient shades for the bar.
   */
  gradient: ReactElement<GradientProps, typeof Gradient> | null;

  /**
   * SVG rx attribute for the bar.
   */
  rx: number;

  /**
   * SVG ry attribute for the bar.
   */
  ry: number;

  /**
   * Width of the bar. Set internally by `BarSeries`.
   */
  width: number;

  /**
   * Padding for the bar groups.
   */
  padding: number;

  /**
   * Total number of bars used for animation. Set internally by `BarSeries`.
   */
  barCount: number;

  /**
   * Color callback for the bar.
   */
  color: any;

  /**
   * Whether the bar is rounded or not.
   */
  rounded: boolean;

  /**
   * Cursor for the bar element.
   */
  cursor: string;

  /**
   * Index of the bar. Set internally by `BarSeries`.
   */
  barIndex: number;

  /**
   * Index of the group. Set internally by `BarSeries`.
   */
  groupIndex?: number;

  /**
   * Whether to animate the enter/update/exit. Set internally by `BarSeries`.
   */
  animated: boolean;

  /**
   * Whether this is categorical chart or not. Set internally by `BarSeries`.
   */
  isCategorical: boolean;

  /**
   * Rangelines element. for the bar.
   */
  rangeLines: ReactElement<RangeLinesProps, typeof RangeLines> | null;

  /**
   * Mask element for the bar.
   */
  mask: ReactElement<MaskProps, typeof Mask> | null;

  /**
   * Tooltip element.
   */
  tooltip: ReactElement<ChartTooltipProps, typeof ChartTooltip> | null;

  /**
   * Direction of the chart. Set internally by `BarSeries`.
   */
  layout: Direction;

  /**
   * Type of bar chart. Set internally by `BarSeries`.
   */
  type: BarType;

  /**
   * Label element.
   */
  label: ReactElement<BarLabelProps, typeof BarLabel> | null;

  /**
   * Event for when the bar is clicked.
   */
  onClick: (event) => void;

  /**
   * Event for when the bar has mouse enter.
   */
  onMouseEnter: (event) => void;

  /**
   * Event for when the bar has mouse leave.
   */
  onMouseLeave: (event) => void;
} & PropFunctionTypes;

interface BarState {
  active?: boolean;
}

interface BarCoordinates {
  width: number;
  height: number;
  x: number;
  y: number;
}

// Set padding modifier for the tooltips
const modifiers = {
  offset: {
    offset: '0, 5px'
  }
};

export class Bar extends Component<BarProps, BarState> {
  static defaultProps: Partial<BarProps> = {
    rounded: true,
    rx: 0,
    ry: 0,
    cursor: 'auto',
    tooltip: <ChartTooltip />,
    rangeLines: null,
    label: null,
    gradient: <Gradient />,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined,
    layout: 'vertical'
  };

  rect = createRef<SVGGElement>();
  state: BarState = {};

  getExit({ x, y, width, height }: BarCoordinates) {
    const { yScale, xScale, type } = this.props;

    const isVertical = this.getIsVertical();
    let newX = isVertical ? x : Math.min(...xScale.range());
    let newY = isVertical ? Math.max(...yScale.range()) : y;
    const newHeight = isVertical ? 0 : height;
    const newWidth = isVertical ? width : 0;

    if (type === 'stackedDiverging') {
      if (isVertical) {
        newY = newY / 2;
      } else {
        newX = newX / 2;
      }
    }

    return {
      x: newX,
      y: newY,
      height: newHeight,
      width: newWidth
    };
  }

  getKeyCoords(
    v,
    v0,
    v1,
    scale,
    sizeOverride: number,
    isCategorical: boolean,
    padding: number
  ) {
    let offset;
    let size;

    if (isCategorical) {
      if (scale.bandwidth) {
        offset = scale(v);
        size = scale.bandwidth();

        if (sizeOverride) {
          if (offset) {
            offset = offset + size / 2 - sizeOverride / 2;
          } else {
            // Stacked bar charts don't have offsets...
            offset = size / 2 - sizeOverride / 2;
          }

          size = sizeOverride;
        }
      } else {
        if (sizeOverride) {
          throw new Error('Not a valid option for this scale type');
        }

        offset = scale(v0);
        size = scale((v1 as any) - (v0 as any));

        if (padding) {
          const calc = this.calculateLinearScalePadding(scale, offset, size);
          offset = calc.offset;
          size = calc.size;
        }
      }
    } else {
      if (sizeOverride) {
        throw new Error('Not a valid option for this scale type');
      }

      const c0 = scale(v0);
      const c1 = scale(v1);
      const delta = c1 - c0;
      offset = c0;
      size = Math.max(delta - 1, 0);
    }

    return { offset, size };
  }

  getValueCoords(v0, v1, scale) {
    const c0 = scale(v0);
    const c1 = scale(v1);
    const size = Math.abs(c0 - c1);

    return { offset: Math.min(c0, c1), size };
  }

  getIsVertical() {
    return this.props.layout === 'vertical';
  }

  getCoords(): BarCoordinates {
    const { isCategorical, data, width, padding, xScale1 } = this.props;

    const isVertical = this.getIsVertical();
    let yScale = this.props.yScale;
    let xScale = this.props.xScale;

    if (xScale1) {
      if (isVertical) {
        xScale = xScale1;
      } else {
        yScale = xScale1;
      }
    }

    if (isVertical) {
      const xCoords = this.getKeyCoords(
        data.x,
        data.x0,
        data.x1,
        xScale,
        width,
        isCategorical,
        padding
      );
      const yCoords = this.getValueCoords(data.y0, data.y1, yScale);

      return {
        x: xCoords.offset,
        width: xCoords.size,
        y: yCoords.offset,
        height: yCoords.size
      };
    } else {
      const yCoords = this.getKeyCoords(
        data.y,
        data.y0,
        data.y1,
        yScale,
        width,
        isCategorical,
        padding
      );
      const xCoords = this.getValueCoords(data.x0, data.x1, xScale);

      return {
        x: xCoords.offset,
        width: xCoords.size,
        y: yCoords.offset,
        height: yCoords.size
      };
    }
  }

  /**
   * This function calculates the padding on a linear scale used by the marimekko chart.
   */
  calculateLinearScalePadding(scale, offset: number, size: number) {
    const { barCount, groupIndex, padding } = this.props;

    const totalSize = scale.range()[1];
    const sizeMinusPadding = totalSize - padding * (barCount - 1);
    const multiplier = sizeMinusPadding / totalSize;
    offset = offset * multiplier + groupIndex! * padding;
    size = size * multiplier;

    return { size, offset };
  }

  onMouseEnter(event: MouseEvent) {
    this.setState({ active: true });

    const { onMouseEnter, data } = this.props;
    onMouseEnter({
      value: data,
      nativeEvent: event
    });
  }

  onMouseLeave(event: MouseEvent) {
    this.setState({ active: false });

    const { onMouseLeave, data } = this.props;
    onMouseLeave({
      value: data,
      nativeEvent: event
    });
  }

  onMouseClick(event: MouseEvent) {
    const { onClick, data } = this.props;
    onClick({
      value: data,
      nativeEvent: event
    });
  }

  getFill(color: string) {
    const { mask, id, gradient } = this.props;

    if (mask) {
      return `url(#mask-pattern-${id})`;
    } else {
      if (gradient) {
        return `url(#gradient-${id})`;
      }

      return color;
    }
  }

  getTooltipData() {
    const { data, isCategorical } = this.props;

    const isVertical = this.getIsVertical();
    const xAttr = isCategorical ? 'x' : 'x0';
    let x = data[xAttr]!;

    // Stacked diverging negative numbers
    // in horizontal layouts need to pull x0
    if (data.x0 < 0) {
      x = data.x0;
    }

    const matches = isVertical
      ? data.key && data.key !== x
      : data.key && data.key !== data.y;

    if (matches) {
      x = `${data.key} ∙ ${x}`;
    }

    return {
      y: data.y,
      x
    };
  }

  getTransition(index: number) {
    const { animated, barCount, layout } = this.props;

    if (animated) {
      let delay = 0;
      if (layout === 'vertical') {
        delay = (index / barCount) * 0.5;
      } else {
        delay = ((barCount - index) / barCount) * 0.5;
      }

      return {
        ...DEFAULT_TRANSITION,
        delay: delay
      };
    } else {
      return {
        type: false,
        delay: 0
      };
    }
  }

  renderBar(currentColorShade: string, coords: BarCoordinates, index: number) {
    const { rounded, cursor, mask, id, data, rx, ry } = this.props;
    const maskPath = mask ? `url(#mask-${id})` : '';
    const fill = this.getFill(currentColorShade);
    const initialExit = this.getExit(coords);
    const isVertical = this.getIsVertical();
    const extras = constructFunctionProps(this.props, data);
    const transition = this.getTransition(index);

    return (
      <g ref={this.rect}>
        <motion.rect
          className={classNames(
            {
              [css.rounded]: rounded,
              [css.vertical]: isVertical,
              [css.horizontal]: !isVertical
            },
            extras.className
          )}
          style={{ ...extras.style, cursor }}
          mask={maskPath}
          rx={rx}
          ry={ry}
          initial={{ ...initialExit, fill }}
          animate={{ ...coords, fill }}
          exit={{ ...initialExit, fill }}
          transition={transition}
          onMouseEnter={bind(this.onMouseEnter, this)}
          onMouseLeave={bind(this.onMouseLeave, this)}
          onClick={bind(this.onMouseClick, this)}
        />
      </g>
    );
  }

  render() {
    const {
      id,
      gradient,
      data,
      barIndex,
      color,
      yScale,
      barCount,
      tooltip,
      xScale,
      groupIndex,
      rangeLines,
      animated,
      type,
      layout,
      mask,
      label
    } = this.props;
    const { active } = this.state;
    const stroke = color(data, barIndex);
    const coords = this.getCoords();
    const currentColorShade = active ? chroma(stroke).brighten(0.5) : stroke;
    const rangeLineColor = (rangeLines && rangeLines.props.color) || stroke;
    const rangeLineColorShade = active
      ? chroma(rangeLineColor).brighten(0.5)
      : rangeLineColor;
    const index = groupIndex !== undefined ? groupIndex : barIndex;
    const placement = layout === 'vertical' ? 'top' : 'right';
    const isVertical = this.getIsVertical();
    const scale = isVertical ? yScale : xScale;
    const tooltipData = this.getTooltipData();
    const barLabel = isVertical ? tooltipData.y : tooltipData.x;

    return (
      <Fragment>
        {this.renderBar(currentColorShade, coords, index)}
        {rangeLines && (
          <CloneElement<RangeLinesProps>
            element={rangeLines}
            {...coords}
            index={index}
            data={data}
            scale={scale}
            color={rangeLineColorShade}
            barCount={barCount}
            animated={animated}
            layout={layout}
            type={type}
          />
        )}
        {tooltip && !tooltip.props.disabled && (
          <CloneElement<ChartTooltipProps>
            element={tooltip}
            visible={!!active}
            modifiers={tooltip.props.modifiers || modifiers}
            reference={this.rect}
            color={color}
            value={tooltipData}
            placement={placement}
            data={data}
          />
        )}
        {mask && (
          <Fragment>
            <Mask id={`mask-${id}`} fill={`url(#gradient-${id})`} />
            <CloneElement<MaskProps>
              element={mask}
              id={`mask-pattern-${id}`}
              fill={stroke}
            />
          </Fragment>
        )}
        {gradient && (
          <CloneElement<GradientProps>
            element={gradient}
            id={`gradient-${id}`}
            direction={layout}
            color={currentColorShade}
          />
        )}
        {label && (
          <CloneElement<BarLabelProps>
            element={label}
            {...coords}
            text={formatValue(barLabel)}
            index={index}
            data={data}
            scale={scale}
            fill={label.props.fill || currentColorShade}
            barCount={barCount}
            animated={animated}
            layout={layout}
            type={type}
          />
        )}
      </Fragment>
    );
  }
}

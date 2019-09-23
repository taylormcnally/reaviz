import React, { Component, Fragment } from 'react';
import { geoMercator, geoPath, GeoProjection, GeoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import {
  ChartProps,
  ChartContainer,
  ChartContainerChildProps
} from '../common/containers/ChartContainer';
import classNames from 'classnames';
import { CloneElement } from '../common/utils/children';
import { MapMarkerProps } from './MapMarker';
import { motion } from 'framer-motion';
import css from './Map.module.scss';

interface MapProps extends ChartProps {
  markers?: JSX.Element[];
}

interface MapState {
  worldData?: any;
}

export class Map extends Component<MapProps, MapState> {
  state: MapState = {};

  componentDidMount() {
    import('world-atlas/countries-110m.json').then(geojson => {
      // Using 'countries' is less performant than 'land' but we want to be able
      // to filter and disect on specific shapes
      const worldData = feature(geojson, geojson.objects.countries);

      this.setState({
        worldData
      });
    });
  }

  getProjection({ chartWidth, chartHeight }: ChartContainerChildProps) {
    return geoMercator()
      .fitSize([chartWidth, chartHeight], this.state.worldData)
      .center([0, 35]);
  }

  renderMarker(marker: JSX.Element, index: number, projection: GeoProjection) {
    const position = projection(marker.props.coordinates);

    if (!position) {
      console.warn(
        `Position for ${marker.props.coordinates.toString()} not found.`
      );
      return null;
    }

    return (
      <CloneElement<MapMarkerProps>
        element={marker}
        cx={position[0]}
        cy={position[1]}
        index={index}
      />
    );
  }

  renderCountry(point, index: number, path: GeoPath) {
    // Exclude ATA
    if (point.id === '010') {
      return null;
    }

    return (
      <path key={`path-${index}`} d={path(point)!} className={css.country} />
    );
  }

  renderChart(containerProps: ChartContainerChildProps) {
    const { markers } = this.props;
    const { worldData } = this.state;

    if (!worldData) {
      return null;
    }

    const projection = this.getProjection(containerProps);
    const path = geoPath().projection(projection);

    return (
      <motion.g
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
      >
        {worldData.features.map((point, index) =>
          this.renderCountry(point, index, path)
        )}
        {markers &&
          markers.map((marker, index) => (
            <Fragment key={`marker-${index}`}>
              {this.renderMarker(marker, index, projection)}
            </Fragment>
          ))}
      </motion.g>
    );
  }

  render() {
    const { id, width, height, margins, className } = this.props;

    return (
      <ChartContainer
        id={id}
        width={width}
        height={height}
        margins={margins}
        xAxisVisible={false}
        yAxisVisible={false}
        className={classNames(className)}
      >
        {props => this.renderChart(props)}
      </ChartContainer>
    );
  }
}

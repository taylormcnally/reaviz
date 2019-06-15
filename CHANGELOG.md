# 2.4.0
- [Feature] Add ability to require modifier before using mouse wheel for zoom
- [Fix] Fix touch memory leak
- [Fix] Fix passive event errors on wheel

# 2.3.1
- [Fix] Fix tooltip flicker

# 2.3.0
- [Feature] Expose pan/zoom events from  `ZoomPan`
- [Chore] Bump depedencies due to security

# 2.2.3
- [Fix] Fix `getParentSVG` blowing up when mouse goes outside of SVG element

# 2.2.2
- [Fix] Fix `zoomStep` not being passed down in `ZoomPan`

# 2.2.1
- [Fix] Fix decay not working w/ y values
- [Fix] Fix area chart points showing tooltip on hover

# 2.2.0
- [Fix] Fix containing not working when set false
- [Fix] Completely refactor zoom/panning
- [Fix] Fix tooltip hiding when clicking
- [Fix] Update RDK for tooltip fixes

# 2.1.0
- [Feature] Add ability to pan and zoom on x/y
- [Feature] Add ability to pass min zoom
- [Feature] Expose event type from pan/zoom
- [Feature] Add ability to pan outside of a pan area
- [Fix] Fix gauge label alignment

# 2.0.1
- [Feature] Add a new duration axis type which calculates better ticks #49
- [Fix] Export radial charts from root #51
- [Fix] Fix sankey `onClick` wrong element #53
- [Fix] Fix radial bars not updating sometimes
- [Fix] Ensure pass down options to arc label
- [Fix] Add click events to radial gauge label
- [Fix] Remove tooltip from radial area point

# 2.0.0
- [Feature] Radial Gauge Chart
- [Feature] Horizontal Bar Charts
- [Feature] Add waterfall bar charts
- [Feature] Adds ability to specify tick values and intervals in radial axis
- [Feature] Add ability to pass masks to bar charts
- [Feature] Add ability to change legend label orientation
- [Feature] Add non-zero offset data for bar charts
- [Feature] Add non-zero offset data for area charts
- [BREAKING] Add `grouped` type to Bar/Area chart types for multi-series data points - [Migration](https://github.com/jask-oss/reaviz/pull/48)
- [BREAKING] Refactor Gradient API - [Migration](https://github.com/jask-oss/reaviz/pull/39)
- [BREAKING] Refactor Pattern API to Masks - [Migration](https://github.com/jask-oss/reaviz/pull/47)
- [Fix] Fix a bug with gradient LinearAxisLines not working in Firefox #40
- [Fix] Implements custom tweening for radial bar chart because of errors
- [Fix] Abstracts tick methods and uses in radial axis
- [Fix] Updates radial bar to use start domain vs 0
- [Fix] Updates radial line/area to use start domain vs 0
- [Fix] Updates radial scatter to use start domain vs 0
- [Fix] Updates linear to use start domain vs 0
- [Fix] Remove legend font/svg formatting
- [Fix] Fix Tooltip not passing `className` downwards
- [Fix] Remove unused `formatter` prop from `TooltipArea`
- [Fix] Fix scatter point not passing `className` downward
- [Fix] Fix modifiers getting overidden in bar props

# 1.2.0
- [Feature] Refactored Circle Series on Line/Area to use Scatter
- [Fix] Fixed stacked area circles not having correct colors
- [Chore] Improved Docs
- [Chore] Bumped RDK version

# 1.1.0
- [Feature] Radial Bar Chart
- [Feature] Radial Line Chart
- [Feature] Radial Area Chart
- [Feature] Radial Scatter Chart
- [Feature] Tooltip Area supports Radial Configuration
- [Feature] Radial Gradient
- [Feature] Radial Circle Series
- [Improvement] Various Radial Axis Improvements
- [Fix] Fixed SankeyNode/Link to use opacity instead of color when disabled
- [Chore] TypeScript config tweaks
- [Chore] Adds story source support

# 1.0.2
- [Fix] Sankey Chart Fix Negative node height: When the chart is resized to smaller than the original chart size, the node height gets negative, which is then passed to <rect> and causes an error.
- [Fix] Sankey Chart Increased node width: When the node is hovered multiple times, the react-pose's rect translates the x position wrongly and causes the node wider.
- [Fix] Sankey Chart Fix Sankey chart's non-visible links #3
- [Chore] Add jsnext and module entry points #5
  
# 1.0.1
- Bump docs

# 1.0.0
- Initial Release!!

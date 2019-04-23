# Master
- [Feature] Radial Gauge Chart
- [BREAKING] Refactor Gradient API
- [Fix] Fix a bug with gradient LinearAxisLines not working in Firefox #40

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

import * as d3 from 'd3'

let margin = { top: 100, left: 50, right: 150, bottom: 30 }

let height = 700 - margin.top - margin.bottom

let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let parseTime = d3.timeParse('%B-%y')

let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#b0aad6',
    '#fb8072',
    '#80b1d3',
    '#ffa743',
    '#b3de69',
    '#fccde5',
    '#ccc9c9',
    '#bc80bd'
  ])

let line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('./data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  let dates = datapoints.map(d => d.datetime)
  let prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  let nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  let rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  let xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  d3.select('#graph-2').on('stepin', () => {
    console.log('show-blank-graph')
    svg
      .selectAll('.highlight-all')
      .attr('fill', 'none')
      .attr('stroke', 'none')
  })

  d3.select('#drawlines').on('stepin', () => {
    console.log('step price lines')
    // draw lines here
    svg
      .selectAll('.price-line')
      .data(nested)
      .enter()
      .append('path')
      .transition()
      .attr('class', 'price-line')
      .attr('d', function(d) {
        return line(d.values)
      })
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
    // draw circles here
    svg
      .selectAll('.price-circle')
      .data(nested)
      .enter()
      .append('circle')
      .attr('class', 'price-circle')
      .transition()
      .attr('fill', function(d) {
        return colorScale(d.key)
      })
      .attr('r', 4)
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
    // write text here
    svg
      .selectAll('.region-text')
      .data(nested)
      .enter()
      .append('text')
      .attr('class', 'region-text')
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
      .text(function(d) {
        return d.key
      })
      .attr('dx', 6)
      .attr('dy', 4)
      .attr('font-size', '12')
  })

  d3.select('#highlightUS').on('stepin', () => {
    console.log('highligh-us')
    svg.selectAll('.price-circle').attr('fill', d => {
      if (d.key === 'U.S.') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
    svg.selectAll('.price-line').attr('stroke', d => {
      if (d.key === 'U.S.') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
  })

  d3.select('#highlightRegions').on('stepin', () => {
    console.log('highlight-region')
    var upperRegions = [
      'Mountain',
      'Pacific',
      'West South Central',
      'South Atlantic'
    ]
    svg.selectAll('.price-circle').attr('fill', d => {
      if (upperRegions.indexOf(d.key) !== -1) {
        return 'lightblue'
      } else if (d.key === 'U.S.') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
    svg
      .selectAll('.region-text')
      .attr('fill', d => {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .style('font-weight', 800)

    svg.selectAll('.price-line').attr('stroke', d => {
      if (upperRegions.indexOf(d.key) !== -1) {
        return 'lightblue'
      } else if (d.key === 'U.S.') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
  })

  d3.select('#drawRectangle').on('stepin', () => {
    console.log('draw-rectangle')
    svg
      .append('rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('y', 0)
      .attr('width', rectWidth)
      .attr('height', height)
      .attr('fill', '#d0e1f4')
      .lower()
  })
}

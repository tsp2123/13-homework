import * as d3 from 'd3'

var margin = { top: 10, left: 10, right: 10, bottom: 10 }

var height = 480 - margin.top - margin.bottom

var width = 480 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

var radius = 200

var radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

var angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

let colorScale = d3
  .scaleLinear()
  .range(['#5c7bec', '#e54b5e'])
  .domain([33, 110])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })

  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  // Building a temperature store for our cities.
  var temperatureStore = d3.map()
  temperatureStore.set('NYC', nested[0].values)
  temperatureStore.set('Lima', nested[1].values)
  temperatureStore.set('Tuscon', nested[2].values)
  temperatureStore.set('Beijing', nested[3].values)
  temperatureStore.set('Melbourne', nested[4].values)
  temperatureStore.set('Stockholm', nested[5].values)

  var circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  var textBands = [30, 50, 70, 90]

  // Drawing the bands
  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', d => radiusScale(d))
    .lower()

  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 6)

  d3.select('#nyc-step').on('stepin', () => {
    console.log('nyc step starts here')
    let cityDatapoints = temperatureStore.get('NYC')
    let cityHighTempMean = cityDatapoints.map(d => d.high_temp)
    cityDatapoints.push(cityDatapoints[0])

    container
      .append('path')
      .attr('class', 'temp')
      .datum(cityDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(d3.mean(cityHighTempMean)))
      .attr('opacity', 0.6)

    container
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'city-name')
      .text(cityDatapoints[0].city)
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
      .transition()

    d3.selectAll('.label-NYC')
      .transition()
      .style('background', d => colorScale(d3.mean(cityHighTempMean)))
  })

  // beijing-step
  d3.select('#beijing-step').on('stepin', () => {
    console.log('beijing step starts here')
    let cityDatapoints = temperatureStore.get('Beijing')
    let cityHighTempMean = cityDatapoints.map(d => d.high_temp)
    cityDatapoints.push(cityDatapoints[0])

    container
      .selectAll('.temp')
      .datum(cityDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(d3.mean(cityHighTempMean)))

    container
      .selectAll('.city-name')
      .text(cityDatapoints[0].city)
      .transition()

    d3.selectAll('.label-Beijing')
      .transition()
      .style('background', d => colorScale(d3.mean(cityHighTempMean)))
  })

  // Stockholm-step
  d3.select('#stockholm-step').on('stepin', () => {
    console.log('stockholm step starts here')
    let cityDatapoints = temperatureStore.get('Stockholm')
    let cityHighTempMean = cityDatapoints.map(d => d.high_temp)
    cityDatapoints.push(cityDatapoints[0])

    container
      .selectAll('.temp')
      .datum(cityDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(d3.mean(cityHighTempMean)))

    container
      .selectAll('.city-name')
      .text(cityDatapoints[0].city)
      .transition()

    d3.selectAll('.label-Stockholm')
      .transition()
      .style('background', d => colorScale(d3.mean(cityHighTempMean)))
  })

  // Lima
  d3.select('#lima-step').on('stepin', () => {
    console.log('lima step starts here')
    let cityDatapoints = temperatureStore.get('Lima')
    let cityHighTempMean = cityDatapoints.map(d => d.high_temp)
    cityDatapoints.push(cityDatapoints[0])

    container
      .selectAll('.temp')
      .datum(cityDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(d3.mean(cityHighTempMean)))

    container
      .selectAll('.city-name')
      .text(cityDatapoints[0].city)
      .transition()

    d3.selectAll('.label-Lima')
      .transition()
      .style('background', d => colorScale(d3.mean(cityHighTempMean)))
  })

  // Tuscon
  d3.select('#tuscon-step').on('stepin', () => {
    console.log('tuscon step starts here')
    let cityDatapoints = temperatureStore.get('Tuscon')
    let cityHighTempMean = cityDatapoints.map(d => d.high_temp)
    cityDatapoints.push(cityDatapoints[0])

    container
      .selectAll('.temp')
      .datum(cityDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(d3.mean(cityHighTempMean)))

    container
      .selectAll('.city-name')
      .text(cityDatapoints[0].city)
      .transition()

    d3.selectAll('.label-Tuscon')
      .transition()
      .style('background', d => colorScale(d3.mean(cityHighTempMean)))
  })
}

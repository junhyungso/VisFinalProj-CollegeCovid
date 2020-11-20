
Promise.all([d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
d3.csv('College-Covid.csv', d3.autoType)]).then(([map, covid])=>{


 const filteredCovid = covid.filter(d=>d.openStatus!==null);

  const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
  // Now I can use this dataset:
    // Add X axis --> it is a date format

    const xScale = d3.scaleLinear()
    .domain([0, d3.max(filteredCovid, d=>d.cases)])
    .range([0, width])

    const yScale = d3.scaleOrdinal()
        .range([height/2, 0])
        .domain(["yes", "no"])

    const xAxis = d3.axisBottom().scale(xScale)
        .ticks(10, "s");
    

    const yAxis = d3.axisLeft().scale(yScale)

    svg.append("g")
        .attr("class", "x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .attr("transform", `translate(0 , 0)`);
      

    svg.selectAll('.my_dataviz')
        .append("circle")
        .data(filteredCovid)
        .enter()
        .append('circle')
        // .attr('fill', d=>colorScale(d.Region))
        .attr('stroke', 'blue')
        .attr('opacity', 0.5)
      .attr('r', d=>5)
      .attr('cx', d=> xScale(d.cases))
      .attr('cy', d=> yScale(d.stateRestrictionsMasksRequired))




})
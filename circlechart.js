
Promise.all([d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
d3.csv('College-Covid.csv', d3.autoType)]).then(([map, covid])=>{


 const filteredCovid = covid.filter(d=>d.openStatus!==null);

  const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1150 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#circle-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleSqrt()
    .domain([0, d3.max(filteredCovid, d=>d.cases)])
    .range([margin.left+100, width])
    const yScale = d3.scaleBand()
      .domain(d3.map(filteredCovid, d=>d.openStatus))
      .range([height/2, 0])

    const xAxis = d3.axisBottom().scale(xScale)
        .ticks(12, "s");
    

    const yAxis = d3.axisLeft().scale(yScale)

    svg.append("g")
        .attr("class", "x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height/2})`);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .attr("transform", `translate(${margin.left+100} , 0)`);
      

    svg.selectAll('.circle-chart')
      .data(filteredCovid)
      .enter()
      .append('rect')
      // .attr('fill', d=>colorScale(d.Region))
      .attr('stroke', 'blue')
      .attr('fill', 'blue')
      .attr('opacity', 0.5)
      // .attr('r', d=>5)
      .attr('x', d=> xScale(d.cases))
      .attr('y', d=> yScale(d.openStatus)+17)
      .attr("width", "10")
      .attr("height", "10")
      .on("mouseenter", (event, d) => {
        const pos = d3.pointer(event, window);

        d3.select("#statetooltip")
        .style("left", pos[0] + "px")
        .style("top", pos[1] + "px")
        .html(
            d.college + " " +
            "cases: " + d.cases
        )
        d3.select("#statetooltip").classed("hidden", false);
      })
      .on("mouseleave", (event, d) => {
        d3.select("#statetooltip").classed("hidden", true);

      })




})
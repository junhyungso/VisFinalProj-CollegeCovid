export default function BarChart(state){
    Promise.all([ 
      d3.csv('Top-100-Colleges.csv'),
      d3.csv('College-Covid.csv')
    ]).then(data=>{ 
      let colleges = data[0];
      let covid = data[1]; 
    let margin = {top: 20, right: 20, bottom: 70, left: 75},
      width = 1000 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
  
    d3.select('#chart-area').remove(); 
    let svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("id", "chartAges")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  
    let x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1);
  
    let y = d3.scaleLinear().range([height, 0]);
  
    let xAxis = d3
      .axisBottom()
      .ticks(5)
      .scale(x)
  
    let yAxis = d3.axisLeft().scale(y);
  
    let xAxisGroup = svg.append("g").attr("class", "x-axis axis");
  
    let yAxisGroup = svg.append("g").attr("class", "y-axis axis");
  
  
  filterData();
  
  function filterData() {
    let filteredCovid = [];
    for(let j =0; j<colleges.length; j++){
      for (let i = 0; i<covid.length; i++){
        if (covid[i].college === colleges[j].College){
            filteredCovid.push(covid[i])
                    }
                }
            }
  console.log(filteredCovid)
  filteredCovid.sort(function(a, b){return b.cases-a.cases});
  var dataFilter = filteredCovid.filter(d=> d.state === state)
  renderBarChart(dataFilter);
  }
  
  function renderBarChart(data) {
    x.domain( data.map(function(d) { return d.college; }))
    y.domain([ 0, d3.max(data, function(d) { return d.cases;  })]);
    let bars = svg
      .selectAll(".bar")
      .attr("class", "bar")
      .remove()
      .exit()
      .data(data);
  
    bars.enter()
      .append("rect")
      .attr("class", "bar") 
      .attr("x", function(d) { 
        return x(d.college);
      })
      .attr("y", function(d) {
        return y(d.cases);
      })
      .attr("height", function(d) {
        return (height - y(d.cases));
      })
      .attr("width", x.bandwidth())
      .on("mouseover", function(event, d) {
        
        let xPosition = margin.left + width / 2 + parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 2;
        let yPosition = margin.top + parseFloat(d3.select(this).attr("y")) / 2 + height;
  
        d3.select("#tooltip")
          .style("left", xPosition + -600 + "px")
          .style("top", yPosition + 200 + "px")
          .select("#value")
          .text(d.college + " is located in " + d.city + ", " + d.state + ". " + "This College/University has" + " " + d.cases + " cases as of November 5th, 2020.")
  
        d3.select("#tooltip").classed("hidden", false);
      })
      .on("mouseout", function(d) {
        d3.select("#tooltip").classed("hidden", true);
      });
  
    // ---- DRAW AXIS	----
    xAxisGroup = svg
      .select(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    yAxisGroup = svg.select(".y-axis").call(yAxis);
  
      svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .transition()
      .duration(1000) 
      .text("Colleges");
  
  // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 5)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Cumulative Cases");   
        
  }
  })}
  
  BarChart("Massachusetts")
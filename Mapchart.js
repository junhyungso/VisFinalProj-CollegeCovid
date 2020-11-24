import BarChart from './barchart.js';

Promise.all([d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
d3.csv('College-Covid.csv', d3.autoType)]).then(([map, covid])=>{
    
    window.scrollTo(0, 0)

 const topology = topojson.feature(map, map.objects.states);
 const features = topojson.feature(map, map.objects.states).features;
 const filteredCovid = covid.filter(d=>d.openStatus!==null);

  for(let i =0; i<features.length; i++){
      for (let j = 0; j<covid.length; j++){
          if(features[i].properties.name === covid[j].state){
              features[i].properties.cumulativeCases = covid[j].cumulativeCases;
          }
      }
    }

  const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1150 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    const projection = d3.geoAlbersUsa()
    .fitExtent([[0,0], [width, height]], topology);

    
    const path = d3.geoPath().projection(projection);
    
  const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(covid,d=>d.cumulativeCases)]);

const mask=d3.scaleOrdinal()
    .domain(["State Mask Mandate", "No Mask Mandate"])
    .range(["red","green"]);

  const svg = d3.select(".mapchart").append("svg")
    .attr("viewBox", [0,0,width,height]);
  
  svg.selectAll("path")
    .data(features)
    .join("path")
    .attr("d", path)
    .attr("fill", d=>{
        return color(d.properties.cumulativeCases)
    })
    .on("mouseenter", (event, d) => {
        const pos = d3.pointer(event, window);

        d3.select("#statetooltip")
        .style("left", pos[0] + "px")
        .style("top", pos[1] + "px")
        .select("#map")
        .html(
            "Total State Cases: " + d.properties.cumulativeCases
        )
        d3.select("#statetooltip").classed("hidden", false);
      })
      .on("mouseleave", (event, d) => {
        d3.select("#statetooltip").classed("hidden", true);

      })
    .on("click", (event,d )=> {
        const state = d.properties.name;
        const dataFilter = filteredCovid.filter(d=> d.state === state);
        const sortedDataFilter = dataFilter.sort(function(a, b){return b.cases-a.cases});
        if (sortedDataFilter.length !== 0)
            BarChart(sortedDataFilter);
    });
  
  svg.append("path")
    .datum(topojson.mesh(map, map.objects.states))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

svg.selectAll(".circle")
    .data(filteredCovid)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) {
        return projection([d.longitude , d.latitude])[0];
    })
    .attr("cy", function(d) {
        return projection([d.longitude , d.latitude])[1];
        })
    .attr("r", function(d) {
        return Math.sqrt(d.cases/10);
    })
    .attr("fill", d=>{
        if (d.stateRestrictionsMasksRequired === "yes") return "green"
        else return "red"
    })
    .style("opacity", 0.75);

    svg.selectAll('.statelegend')
        .data(["State Mask Mandate", "No Mask Mandate"])
        .enter()
        .append("rect")
        .attr("class","statelegend")
        .attr("width", 20)
        .attr("height",20)
        .attr("x", 850)
        .attr("y", (d,i)=> 100+ i*25 )
        .attr("fill",d=>mask(d));

    svg.selectAll('.label')
        .data(["State Mask Mandate", "No Mask Mandate"])
        .enter()
        .append('text').attr("class","label")
        .attr("x", 880)
        .attr("y", (d,i)=> 110+ i*25 )
        .text((d)=> d)
        .attr("text-anchor", "left")
        .attr("font-size",15)
        .style("alignment-baseline", "middle");

d3.selectAll("#map").on("change", event=>{
    const visType = event.target.value;// selected button
    if (visType === "States") {
        d3.selectAll(".circle").remove();
    }
    else {
        svg.selectAll(".circle")
            .data(filteredCovid)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function(d) {
                return projection([d.longitude , d.latitude])[0];
            })
            .attr("cy", function(d) {
                return projection([d.longitude , d.latitude])[1];
                })
            .attr("r", function(d) {
                return Math.sqrt(d.cases/10);
            })
            .attr("fill", d=>{
                if (d.stateRestrictionsMasksRequired === "yes") return "green"
                else return "red"
            })
            .style("opacity", 0.75);
    } 
});

})
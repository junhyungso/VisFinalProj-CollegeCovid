
Promise.all([d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
d3.csv('College-Covid.csv', d3.autoType)]).then(([map, covid])=>{

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
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    const projection = d3.geoAlbersUsa()
    .fitExtent([[0,0], [width, height]], topology);

    
    const path = d3.geoPath().projection(projection);
    
  const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(covid,d=>d.cumulativeCases)]);



  const svg = d3.select("body").append("svg")
    .attr("viewBox", [0,0,width,height]);
  
  svg.selectAll("path")
    .data(features)
    .join("path")
    .attr("d", path)
    .attr("fill", d=>{
        return color(d.properties.cumulativeCases)
  });
  
  svg.append("path")
    .datum(topojson.mesh(map, map.objects.states))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);



svg.selectAll("circle")
	.data(filteredCovid)
	.enter()
	.append("circle")
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
		.style("opacity", 0.85)
})
Promise.all([
    d3.csv("College-Covid.csv", d3.autoType),
    d3.csv("Top-100-Colleges.csv", d3.autoType)
  ])
  .then(data=>{
    let colleges= data[0];
    let top=data[1];
    console.log("c", colleges);
    console.log("top", top);

    let topCovid = colleges.filter(d=>d.openStatus!==null);

    console.log("topcovid",topCovid);
    const width = 500;
    const height =300;
    const rad=15;
/*
    const margin = 30;
    const width = 500 - margin * 2;
    const height = width;
    const radius = width / 2;
    const strokeWidth = 4;
    const hyp2 = Math.pow(radius, 2);
    const nodeBaseRad = 5;
*/

    const svg = d3.select("#bubble").append("svg")
    .attr("viewBox",  [-width/2,-height/2, width*2, height*2]);

    const size=d3.scaleLinear()
    .domain(d3.extent(topCovid,d=>d.cases))
    .range([.5,3]);


    const color = d3.scaleQuantize(d3.extent(topCovid,d=>d.cases), d3.schemeGreens[9]);


    const open=d3.scaleOrdinal()
    .domain(d3.extent(topCovid,d=>d.openStatus))
    .range(["#C3615E","#FBC668","#9EB774"]);



    const closed=d3.scaleOrdinal()
    .domain(d3.extent(topCovid,d=>d.closingStatus))
    .range(["#72CBEB",  "#FFB270", "#B42D4D"]);




    topCovid.forEach(d=>{
        d.r = size(d.cases);
    })

    const force = d3.forceSimulation(topCovid)
    //.velocityDecay(0.2)
    .force("charge", d3.forceManyBody().strength([-50]))
    .force('collide', d3.forceCollide().radius(function(d) {
        //console.log("d",d.r);
        return d.r+10
    }))
    .force("x", d3.forceX().strength(.3))
   .force("y", d3.forceY().strength(.3))
   ;




    let drag= (force) => {
        function startdrag(e){
          if(!e.active) force.alphaTarget(0.3).restart();
          e.subject.fx=e.subject.x;
          e.subject.fy=e.subject.y;
        }
        function dragged(e){
          e.subject.fx=e.x;
          e.subject.fy=e.y;
        }
        function enddrag(e){
          if(!e.active) force.alphaTarget(0);
          e.subject.fx=null;
          e.subject.fy=null;
        }


        return d3.drag()
          .on("start",startdrag)
          .on("drag",dragged)
          .on("end",enddrag)
          //.filter( t === "force")
          ;

      };


  /*
  const nodes = svg.selectAll("circle")
  .data(topCovid)
  .join("circle")
  .attr("fill",d=>color(d.cases))
  .attr("stroke","black")
  .attr("stroke-opacity",.2)
  .attr("r", d=>size( d.cases))
  ;
*/

const ovals= _.uniq(_.pluck(topCovid, 'openStatus'));
const cvals= _.uniq(_.pluck(topCovid, 'closingStatus'));






svg.append("circle")
.attr("fill","lightslategrey")
.attr("stroke","black")
.attr("cx", 15 )
.attr("cy", 15 )
.attr("r", 150);

  const nodes= svg.append('g')
  .selectAll("path")
  .data(topCovid)
  .enter()
  .append("path")
  .attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ") scale("+size( d.cases) +")"; })
  .attr("d","M20.763 10.377c-.694.519-1.537.801-2.403.801-1.607 0-2.415-1.963-1.282-3.095.614-.615 1.406-1.009 2.266-1.133 1.621-.233 2.334-2.244 1.142-3.437s-3.203-.479-3.437 1.142c-.123.857-.52 1.653-1.132 2.266-1.138 1.138-3.095.329-3.095-1.282 0-.869.28-1.708.801-2.403.983-1.312.061-3.236-1.623-3.236-1.683 0-2.606 1.923-1.623 3.237.519.693.801 1.537.801 2.403 0 1.61-1.956 2.421-3.095 1.282-.614-.614-1.008-1.405-1.132-2.266-.233-1.621-2.243-2.334-3.436-1.141s-.48 3.203 1.141 3.436c.857.123 1.653.52 2.266 1.132 1.138 1.139.329 3.095-1.282 3.095-.869 0-1.707-.28-2.403-.801-1.313-.983-3.237-.061-3.237 1.623 0 1.683 1.923 2.606 3.237 1.623.693-.519 1.537-.801 2.403-.801 1.61 0 2.421 1.956 1.282 3.095-.614.615-1.406 1.009-2.266 1.133-1.621.233-2.334 2.244-1.142 3.437s3.203.479 3.437-1.142c.123-.857.52-1.653 1.132-2.266 1.139-1.138 3.095-.329 3.095 1.282 0 .869-.28 1.708-.801 2.404-.981 1.308-.064 3.235 1.623 3.235 1.677 0 2.611-1.919 1.621-3.24-.518-.689-.799-1.528-.799-2.39 0-1.615 1.957-2.432 3.095-1.293.615.615 1.009 1.406 1.133 2.267.233 1.621 2.244 2.334 3.437 1.142 1.19-1.19.483-3.206-1.146-3.437-.854-.121-1.646-.515-2.255-1.125-1.143-1.141-.337-3.102 1.274-3.102.87 0 1.708.28 2.404.801 1.309.981 3.236.064 3.236-1.623 0-1.686-1.926-2.605-3.237-1.623zm-10.728 4.296c-.547 0-.99-.443-.99-.99s.443-.99.99-.99.99.443.99.99-.443.99-.99.99zm1.262-3.143c-.858 0-1.553-.695-1.553-1.553s.695-1.553 1.553-1.553 1.553.695 1.553 1.553-.695 1.553-1.553 1.553zm2.928 2.969c-.727 0-1.315-.589-1.315-1.315s.589-1.315 1.315-1.315 1.315.589 1.315 1.315-.589 1.315-1.315 1.315z")
  //.style("fill", function(d) { return color(d.cases); })
  .call(drag(force))
  ;



  force.on("tick", function() {
    nodes.attr("transform", function(d) {
      return "translate(" + (d.x) + "," + (d.y) + ") scale("+size( d.cases) +")"; });
  });





  nodes.on("mouseover", (e,d)=>{
    const pos = d3.pointer(e, window);
    d3.select("#bubbletooltip")
    .style("left", pos[0] + "px")
    .style("top", pos[1] + "px")
    .select("#value")
    .html(
       d.college +"<br>"+
       "Cases: " +d.cases +"<br>"+
       "Open Status: "  +d.openStatus+"<br>"+
       "Closing Status: "+d.closingStatus
     )
    d3.select("#bubbletooltip").classed("hidden", false);
})
.on("mouseleave",(event, d) => {
   d3.select("#bubbletooltip").classed("hidden", true);

 });



 function switchColor(visType) {
  if (visType === "cases") {
      nodes.transition()
      .duration(1000)
      .style("fill", function(d) { return color(d.cases); });
      d3.selectAll(".legend").remove();
      d3.selectAll(".label").remove();
   }

   if (visType === "closing") {
    nodes.transition()
    .duration(1000)
    //.style("fill",(d)=>{ return closed(d.closingStatus);

      .style("fill",(d)=>
      {
        if(d.closingStatus=="Post Finals")
        {
          return "#72CBEB";
        }
        if (d.closingStatus=="Thanksgiving")
        {
          return "#FFB270";
        }
        if(d.closingStatus=="Fully Remote")
        {
          return "#B42D4D";
        }

      });
      d3.selectAll(".legend").remove();
      svg.selectAll('.legend')
      .data(cvals)
      .enter()
      .append("rect").attr("class","legend")
      .attr("width", 20)
      .attr("height",20)
      .attr("x", 350)
      .attr("y", (d,i)=> 10+ i*25 )
      .attr("fill",(d)=>closed(d));

      d3.selectAll(".label").remove();
      svg.selectAll('.label')
      .data(cvals)
      .enter()
      .append('text').attr("class","label")
            .attr("x", 380)
            .attr("y", (d,i)=> 21 + i*25)
            .text((d)=> d)
            .attr("text-anchor", "left")
            .attr("font-size",15)
            .style("alignment-baseline", "middle")
            ;
  }

  if (visType === "opening") {
    nodes.transition()
    .duration(1000)
   // .style("fill",(d)=>{ return open(d.openStatus);

    .style("fill",(d)=>{
    if(d.openStatus=="Completely Closed")
    {
      return "#C3615E";
    }
    if(d.openStatus=="Completely Open")
    {
    return "#9EB774" ;
    }
    if(d.openStatus=="Hybrid"){
      return "#FBC668";
    }

  });
  d3.selectAll(".legend").remove();
  svg.selectAll('.legend')
  .data(ovals)
  .enter()
  .append("rect").attr("class","legend")
  .attr("width", 20)
  .attr("height",20)
  .attr("x", 350)
  .attr("y", (d,i)=> 10+ i*25 )
  .attr("fill",(d)=>open(d));

  d3.selectAll(".label").remove();
  svg.selectAll('.label')
  .data(ovals)
  .enter()
  .append('text').attr("class","label")
        .attr("x", 380)
        .attr("y", (d,i)=> 21 + i*25)
        .text((d)=> d)
        .attr("text-anchor", "left")
        .attr("font-size",15)
        .style("alignment-baseline", "middle")
        ;
      }




}

 d3.selectAll("#emoji").on("change", event=>{
  const visType = event.target.value;// selected button
  console.log("vis",visType);


  switchColor(visType);

});

  })

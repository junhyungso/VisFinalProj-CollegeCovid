import Barchart from './barchart.js';

export default function stateCases(data) {
    document.getElementById("stateText").innerHTML = "Total " + data.properties.name + " Cases as of 11/05/2020: " + data.properties.cumulativeCases
}

d3.csv('College-Covid.csv', d3.autoType).then((covid)=>{
    const stateSelect = document.getElementById('states-choice');
    stateSelect.onchange = function(){
        console.log(stateSelect)
        const filteredState = covid.filter(d=> d.state===stateSelect.value);
        const filteredCovid = covid.filter(d=>d.openStatus!==null);

        const dataFilter = filteredCovid.filter(d=> d.state === stateSelect.value);
        const sortedDataFilter = dataFilter.sort(function(a, b){return b.cases-a.cases});

        document.getElementById("stateText").innerHTML = "Total " + filteredState[0].state + " Cases as of 11/05/2020: " + filteredState[0].cumulativeCases
        Barchart(sortedDataFilter)
    }
});




// const mySelect = document.getElementById('states-choice');
// mySelect.onchange = function() {
//     let state = mySelect.value;
//     document.getElementById("stateText").innerHTML = "Total Cases as of 11/05/2020: "
//       const ans = document.getElementById("stateText").value;
//       let p = document.getElementById("answerHTML").innerHTML
//       p = p + " " + ans;
//       document.getElementById("answerHTML").innerHTML = p;
//       p = null;
// }

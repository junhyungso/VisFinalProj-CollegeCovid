Promise.all([ // load multiple files
    d3.csv('College-Covid.csv'),d3.csv('Top-100-Colleges',d3.autoType)])
.then(([covid, colleges])=>{ })
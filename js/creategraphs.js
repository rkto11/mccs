/////////////////////////
// shared code
/////////////////////////
function formatDate(date) {
    d = new Date(date),
    month = '' + d.getMonth(),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function sortby(a,b){
	return a.dx -b.dx;
}

function removeEmpty(input) {
    var data= input;
    var arr = [];
    for (var i=0; i<data.length; i++){
        var checker = data[i];
        if (checker.dx !== null)  {
            arr.push(data[i]);
        }   
    }
    return arr;
}

function accumulmateData(input) {
    var arr = [], v= 0;
    for (var i=0; i<input.length; i++){
        v += parseFloat(input[i].value);
        arr.push({"dx": (input[i].dx),"value": v});
    }
    return arr;
}

function groupdata(input, stg){
    result =[];
    var key = stg;
    var col=[];
    col.push(...new Set(input.map(item => item[key])));
    for(var i=0; i<col.length; i++) {
        var totalvalue = 0;
        var counter = 0;
        for(var j=0; j<input.length; j++){
            if(input[j][key] === col[i]) {
                totalvalue += parseFloat(input[j].value);
                counter++;
            }
        }
        result.push({"dx": col[i], "value": totalvalue});
    }
    return result;
}

const margin = {top: 10, right: 30, bottom: 70, left: 60},
width = 800 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;


////////////////////////
//line graph
////////////////////////

const svg = d3.select("div#firstvisual")
        .classed("svg-ccontainer",true)
        .append("svg")
        .attr("preserveAspectRatio","XMidYMid meet")
        .attr("viewBox","0 0 800 300")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
d3.csv("https://raw.githubusercontent.com/rkto11/mccs/main/data/df_final.csv",
function(d){
        return {dx: d3.timeParse("%Y-%m-%d")(formatDate(d.build_dt)), inst: d.installation, reg: d.region, category: d.naf_cat, value : d.total_measure }
}).then(
    function(data) {
        data=removeEmpty(data);
        data=data.sort(sortby);
        data = accumulmateData(data);

        const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.dx; }))
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));

        svg.append("path")
        .datum(data)
        .attr("stroke", "#72deff")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line()
            .x(function(d) {return x(d.dx)})
            .y(function(d) {return y(d.value)})
            )
    }
)

////////////////////////////
// Bar Chart
////////////////////////////
const svg2 = d3.select("div#barchart")
.classed("svg-ccontainer",true)
.append("svg")
.attr("preserveAspectRatio","XMidYMid meet")
.attr("viewBox","0 0 800 300")
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand()
    .range([0,width])
    .padding(0.2);
const xAxis = svg2.append("g")
    .attr("transform", `translate(0,${height})`)

const y = d3.scaleLinear()
    .range([height,0]);
const yAxis = svg2.append("g")
    .attr("class","myYaxis")

updatebar('catdata');

function updatebar(inputstring) {

    // fetch/process data
    d3.csv("https://raw.githubusercontent.com/rkto11/mccs/main/data/df_final.csv",
    function process(d){
        return {inst: d.installation, reg: d.region, category: d.naf_cat, value: d.total_measure}
    }
    ).then(
        function(data){
            const instdata = groupdata(data, "inst");
            const regdata = groupdata(data, "reg");
            const catdata = groupdata(data, "category");

            if (inputstring === "instdata"){
                var outdata  = instdata;
            }
            if (inputstring === "regdata"){
                var outdata = regdata;
            }
            if (inputstring === "catdata"){
                var outdata = catdata;
            }

    // Update the X axis
    x.domain(outdata.map(d => d.dx));
    xAxis.transition().duration(1000)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-35)")
            .style('text-anchor',"end");
    
    // Update the Y axis
    y.domain([0, d3.max(outdata, d => d.value) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));
    
    // Create the u variable
    var u = svg2.selectAll("rect")
        .data(outdata)
    
    u
        .join("rect") // Add a new rect for each new elements
        .transition()
        .duration(1000)
        .attr("x", d => x(d.dx))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#69b3a2")
    })
}


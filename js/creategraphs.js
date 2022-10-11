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

function groupsumdata(input, stg){
    result =[];
    var key = stg;
    var col=[];
    col.push(...new Set(input.map(item => item[key])));
    for(var i=0; i<col.length; i++) {
        var totalvalue = 0;
        for(var j=0; j<input.length; j++){
            if(input[j][key] === col[i]) {
                totalvalue += parseFloat(input[j].value);
            }
        }
        result.push({"dx": col[i], "value": totalvalue});
    }
    return result;
}

function qrfromfci (input){
    if(input >= 90){
        return 'Q1';
    }
    if(input < 90 && input >= 80){
        return 'Q2';
    }
    if(input < 80 && input >= 60){
        return 'Q3';
    }
    if(input < 60){
        return 'Q4';
    }
}

const margin = {top: 10, right: 30, bottom: 70, left: 60},
width = 800 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;


////////////////////////
//line graph
////////////////////////

const svg = d3.select("div#sqftovertime")
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
        .attr("stroke", "#69b3a2")
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
const svg2 = d3.select("div#groupedsqft")
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
            const instdata = groupsumdata(data, "inst");
            const regdata = groupsumdata(data, "reg");
            const catdata = groupsumdata(data, "category");

            if (inputstring === "instdata"){
                var outdata  = instdata.slice().sort((a,b) => d3.descending(a.value,b.value));
            }
            if (inputstring === "regdata"){
                var outdata = regdata.slice().sort((a,b) => d3.descending(a.value,b.value));
            }
            if (inputstring === "catdata"){
                var outdata = catdata.slice().sort((a,b) => d3.descending(a.value,b.value));
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
boxplot('QRating', 'div#qBox');
boxplot('Category', 'div#catBox');
boxplot('Region', 'div#regBox');
boxplot('Installation', 'div#insBox');
boxplot('Program', 'div#proBox');
boxplot('Use_Category', 'div#CCNBox');

////////////////////////////
// Box and Whiskers Charts
////////////////////////////
function boxplot (grouping, destination){ //'Category', 'div#catBox'
    const svg3 = d3.select(destination)
    .classed("svg-ccontainer",true)
    .append("svg")
    .attr("preserveAspectRatio","XMidYMid meet")
    .attr("viewBox","0 0 800 400")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("https://raw.githubusercontent.com/rkto11/mccs/main/data/df_final.csv",
    function process(d){
        return {Installation: d.installation, Region: d.region, Category: d.naf_cat, Program: d.op_activity, Use_Category: d.use_desc, QRating: qrfromfci(d.fci), Age: getAge(d.build_dt)}
    }
    ).then(
        function(data){
            var outdata = pusher(data, grouping);
            var domain = [];
            const sortAlphaNum = (a, b) => b.localeCompare(a, 'en', { numeric: true })
            domain.push(...new Set(data.map(item => item[grouping])));
            domain.sort(sortAlphaNum);


            var bins = createbins(outdata, domain);
            
            var y = d3.scaleBand()
                .range([height,0])
                .domain(domain)
                .padding(.4);
            
            svg3.append("g")
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain").remove(0)

            var x = d3.scaleLinear()
                .domain([bins[0].x0, bins[0].x1])
                .range([0,width])

            svg3.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(Math.round(bins[0].x1/10)))

            svg3.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height + margin.top + 30)
                .text(grouping + " Age")
                .style("stroke", "white");

            //draws the range line
            svg3.selectAll("vertLines")
                .data(bins[1])
                .enter()
                .append("line")
                    .attr("x1", function(d){return(x((d.Range[0])))})
                    .attr("x2", function(d){return(x((d.Range[1])))})
                    .attr("y1", function(d){return(y(d.Dom) + y.bandwidth()/2)})
                    .attr("y2", function(d){return(y(d.Dom) + y.bandwidth()/2)})
                    .attr("stroke", "white")
                    .style("width",40)

            //draws the box
            svg3.selectAll("boxes")
                .data(bins[1])
                .enter()
                .append("rect")
                    .attr("x", function(d){return(x(d.Quartiles[0]))})
                    .attr("width", function(d){ ;  return(x(d.Quartiles[2])-x(d.Quartiles[0]))})
                    .attr("y", function(d){return y(d.Dom); })
                    .attr("height", y.bandwidth())
                    .attr("stroke", "white")
                    .style("fill", "#69b3a2")
                    .style("opacity", 1.0)

            //draws median
            svg3.selectAll("medianLines")
                .data(bins[1])
                .enter()
                .append("line")
                    .attr("y1", function(d){return(y(d.Dom))})
                    .attr("y2", function(d){return(y(d.Dom) + y.bandwidth())})
                    .attr("x1", function(d){return(x(d.Quartiles[1]))})
                    .attr("x2", function(d){return(x(d.Quartiles[1]))})
                    .attr("stroke", "white")
                    .style("width" , 80)

            
            //draws outliers
            var outlierdata = mapoutliers(bins[1]);
            svg3.selectAll("indPoints")
                .data(outlierdata)
                .enter()
                .append("circle")
                    .attr("cx", function(d){return (x(d.Age))})
                    .attr("cy", function(d){return (y(d.Dom) + y.bandwidth()/2)})
                    .attr("r", 2)
                    .style("fill", "white")
                    .attr("stroke", "white")

            function mapoutliers (input) {
                var arr= [];
                for (i=0; i<input.length; i++){
                    if (input[i].Outliers.length> 0){
                        for (j=0;j<input[i].Outliers.length; j++){
                        arr.push({Dom: input[i].Dom, Age: input[i].Outliers[j]})
                        }
                    }
                }
                return arr;
            }

            function createbins(inputdata, dom) {
                var result = [];
                var prevmax = 0;
                for (i=0;i<dom.length;i++) {
                    var arr = [];
                    for(j=0;j<inputdata.length; j++) {
                        if (inputdata[j].Group === dom[i]){
                            arr.push(inputdata[j].Age);
                        }
                    }
                    var values = arr.sort((a,b) => a - b);
                    var min = values[0];
                    var max = values[values.length - 1];
                    if (prevmax < max) prevmax = max;
                    var q1 = d3.quantile(values, 0.25);
                    var q2 = d3.quantile(values, 0.50);
                    var q3 = d3.quantile(values, 0.75);
                    var iqr = q3- q1;
                    var r0 = Math.max(min, q1 - iqr * 1.5);
                    var r1 = Math.min(max, q3 + iqr * 1.5);
                    var quartiles = [q1, q2, q3];
                    var range =  [r0, r1];
                    var outliers =values.filter(v => v < r0 || v > r1);

                    result.push({Dom: dom[i], Min: min, Max: max, Quartiles: quartiles, Range: range, Outliers: outliers});
                }
                var output = [];
                output.push({x0: 0, x1: prevmax + 1}, result);
                return output;
            }
        }
    )
}

function pusher (input, group){
    var output = []
    for(i=0; i<input.length; i++){
        if(input[i].Age > 0){
        output.push({"Group": input[i][group],'Age': input[i].Age})}
    }
    return output;
}

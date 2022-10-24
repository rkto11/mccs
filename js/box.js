////////////////////////////
// Box and Whiskers Charts
////////////////////////////
const margin2 = {top: 10, right: 30, bottom: 70, left: 60},
width2 = 800 - margin2.left - margin2.right,
height2 = 300 - margin2.top - margin2.bottom;

const svg3 = d3.select('div#allBox')
    .classed("svg-ccontainer",true)
    .append("svg")
    .attr("preserveAspectRatio","XMidYMid meet")
    .attr("viewBox","0 0 800 400")
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

const y3 = d3.scaleBand()
    .range([height2,0])
    .padding(.4);
const yAxis3 = svg3.append('g')
    .attr('class','myYaxis3');

const x3 = d3.scaleLinear()
    .range([0,width2]);
const xAxis3 = svg3.append("g")
    .attr("transform", "translate(0," + height2 + ")");

function boxplot (grouping){ //'Category'


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
            
            //Clear data
            svg3.selectAll("line").remove();
            svg3.selectAll("rect").remove();
            svg3.selectAll("circle").remove();

            //Update Axes
            y3.domain(domain);
            yAxis3
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y3));

            x3.domain([bins[0].x0, bins[0].x1]);
            xAxis3.call(d3.axisBottom(x3).ticks(Math.round(bins[0].x1/10)));

            
            //draws the range line
            var rnglines = svg3.selectAll("vertLines")
                .data(bins[1])
            
            rnglines
                   .join("line")
                   .transition()
                   .duration(1000)
                    .attr("x1", d => x3(d.Range[0]))
                    .attr("x2", d => x3(d.Range[1]))
                    .attr("y1", d => y3(d.Dom) + y3.bandwidth()/2)
                    .attr("y2", d => y3(d.Dom) + y3.bandwidth()/2)
                    .attr("stroke", "white")
                    .style("width",40);

            //draws the box
            var box = svg3.selectAll("boxes")
                .data(bins[1])
            box
                .join("rect")
                .transition()
                .duration(1000)
                    .attr("x", function(d){return(x3(d.Quartiles[0]))})
                    .attr("width", function(d){ ;  return(x3(d.Quartiles[2])-x3(d.Quartiles[0]))})
                    .attr("y", function(d){return y3(d.Dom); })
                    .attr("height", y3.bandwidth())
                    .attr("stroke", "white")
                    .style("fill", "#69b3a2")
                    .style("opacity", 1.0);

            //draws median
            var medlines = svg3.selectAll("medianLines")
                .data(bins[1])
            medlines
                .join("line")
                .transition()
                .duration(1000)
                    .attr("y1", function(d){return(y3(d.Dom))})
                    .attr("y2", function(d){return(y3(d.Dom) + y3.bandwidth())})
                    .attr("x1", function(d){return(x3(d.Quartiles[1]))})
                    .attr("x2", function(d){return(x3(d.Quartiles[1]))})
                    .attr("stroke", "white")
                    .style("width" , 80);

            
            //draws outliers
            var outlierdata = mapoutliers(bins[1]);
            var out = svg3.selectAll("indPoints")
                .data(outlierdata)
            out.remove()
            
            out
                .join("circle")
                .transition()
                .duration(1000)
                    .attr("cx", function(d){return (x3(d.Age))})
                    .attr("cy", function(d){return (y3(d.Dom) + y3.bandwidth()/2)})
                    .attr("r", 1.5)
                    .style("fill", "white")
                    .attr("stroke", "white");

            function mapoutliers (input) {
                var arr= [];
                for (i=0; i<input.length; i++){
                    if (input[i].Outliers.length> 0){
                        for (j=0;j<input[i].Outliers.length; j++){
                        arr.push({Dom: input[i].Dom, Age: input[i].Outliers[j]});
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
            
            
            function pusher (input, group){
                var output = []
                for(i=0; i<input.length; i++){
                    if(input[i].Age > 0){
                    output.push({"Group": input[i][group],'Age': input[i].Age})}
                }
                return output;
            }

            
            
        }
    )
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
}


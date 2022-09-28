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

function sortbyDate(a,b){
	return a.date -b.date;
}

function removeEmpty(input) {
    var data= input;
    var arr = [];
    for (var i=0; i<data.length; i++){
        var checker = data[i];
        if (checker.date !== null)  {
            arr.push(data[i]);
        }   
    }
    return arr;
}

function accumulmateData(input) {
    var arr = [], v= 0;
    for (var i=0; i<input.length; i++){
        v += parseFloat(input[i].value);
        arr.push({"date": (input[i].date),"value": v});
    }
    console.log(arr);
    return arr;
}

function  graph1(){

    const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#firstvisual")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //Read the data
        d3.csv("https://raw.githubusercontent.com/rkto11/mccs/main/data/df_final.csv",
        // When reading the csv, I must format variables:
        function(d){
            return { date : d3.timeParse("%Y-%m-%d")(formatDate(d.build_dt)), value : d.total_measure }
        }).then(

        // Now I can use this dataset:
        function(data) {
            data=removeEmpty(data);
            date=data.sort(sortbyDate);
            data = accumulmateData(data);
            
            // Add X axis --> it is a date format
            const x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);
            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

            // Add Y axis
            const y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([ height, 0 ]);
            svg.append("g")
            .call(d3.axisLeft(y));

            // Add the line
            svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )
            
    })	
}
function createGroupTables(input){
    var data = input;
    var CatC = filter(data, {naf_cat: 'C'});
    var Category = ['Category', 'naf_cat'];
    var Region = ['Region', 'region'];
    var RegionC = ['Region', 'region'];
    var Program = ['Program', 'op_activity'];
    var CCNDesc = ['Use Category', 'use_desc'];
    var Asset = groupSumCount(data, ['op_activity','fac_use','facility_desc', 'asset_name']);

    Category.push([...new Set(data.map(item => item.naf_cat))]);
    Region.push([...new Set(data.map(item => item.region))]);
    RegionC.push([...new Set(data.map(item => item.region))]);
    Program.push([...new Set(data.map(item => item.op_activity))]);
    CCNDesc.push([...new Set(data.map(item => item.use_desc))]);
    
    
    var CategoryData = createFSRM(data, Category);
    var RegionData =  createFSRM(data, Region);
    var RegionCData =  createFSRM(CatC, RegionC);
    var ProgramData = createFSRM(data, Program);
    var CCNDescData = createFSRM(data, CCNDesc);

    var CategoryTable = createTable(CategoryData);
    var RegionTable = createTable(RegionData);
    var RegionCTable = createTable(RegionCData);
    var ProgramTable = createTable(ProgramData);
    var CCNDescTable = createTable(CCNDescData);

    var numFormat = $.fn.dataTable.render.number('\,', '.', 0, '$' ).display;
    var numFormat2 = $.fn.dataTable.render.number('\,', '.', 0).display;
    var numFormat3 = $.fn.dataTable.render.number('\,', '.', 2, '$' ).display;

    $('#tabCat').html(CategoryTable);
    $(document).ready(function () {
        $('#tabCat').dataTable({
            data: CategoryData,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'Category'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                

                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabRegion').html(RegionTable);
    $(document).ready(function () {
        $('#tabRegion').dataTable({
            data: RegionData,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabRegionC').html(RegionTable);
    $(document).ready(function () {
        $('#tabRegionC').dataTable({
            data: RegionCData,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});

                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabProgram').html(ProgramTable);
    $(document).ready(function () {
        $('#tabProgram').dataTable({
            data: ProgramData,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Program'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabCCN').html(CCNDescTable);
    $(document).ready(function () {
        $('#tabCCN').dataTable({
            data: CCNDescData,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Use Category'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                var numFormat = $.fn.dataTable.render.number('\,', '.', 0, '$' ).display;
                var numFormat2 = $.fn.dataTable.render.number('\,', '.', 0).display;

                
                $(api.column(0).footer()).html('Total FSRM (Current Page)');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
            
        
        });
    });
}

function createQratingTables(input){
    var data = input;

    var totalQ = totalQcalc(data);
    function totalQcalc(dataset){    
    var counter1=0, counter2=0, counter3=0, counter4=0;
        var QRating=[];
            for(var i=0; i<dataset.length; i++){
                if(dataset[i].fci >= 90){
                        counter1++;
                    }
                if(dataset[i].fci < 90 && dataset[i].fci >= 80){
                        counter2++;
                    }
                if(dataset[i].fci < 80 && dataset[i].fci >= 60){
                        counter3++;
                    }
                if(dataset[i].fci < 60){
                        counter4++;
                    }
            }
            QRating = [counter1, counter2, counter3, counter4];
            return QRating;
    }
    document.getElementById('pq1').innerHTML = "<ul> <li>Q1: " + totalQ[0] + "</li><li> Q2: " + totalQ[1] + "</li><li>Q3: " + totalQ[2]+ "</li><li>Q4: " + totalQ[3] + "</li><ul>";

    var Category = ['Category', 'naf_cat'];
    var Region = ['Region', 'region'];
    var Program = ['Program', 'op_activity']; //Seperate by Category
    var Installation = ['Installation', 'installation'];

    Category.push([...new Set(data.map(item => item.naf_cat))]);
    Region.push([...new Set(data.map(item => item.region))]);
    Program.push([...new Set(data.map(item => item.op_activity))]);
    Installation.push([...new Set(data.map(item => item.installation))]);

    var CatQ = qfromfci(data,Category);
    var RegQ = qfromfci(data,Region);
    var ProQ = qfromfci(data,Program);
    var InsQ = qfromfci(data,Installation);

    var tableCatQ = createTablenf(CatQ);
    var tableRegQ = createTablenf(RegQ);
    var tableProQ = createTablenf(ProQ);
    var tableInsQ = createTablenf(InsQ);

    $('#tabCatQ').html(tableCatQ);
    $(document).ready(function () {
        $('#tabCatQ').dataTable({
            data: CatQ,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'Category'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });

    $('#tabRegQ').html(tableRegQ);
    $(document).ready(function () {
        $('#tabRegQ').dataTable({
            data: RegQ,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Region'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });


    //Have to seperate by Category
    $('#tabProQ').html(tableProQ);   
    $(document).ready(function () {
        $('#tabProQ').dataTable({
            data: ProQ,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Program'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });

    $('#tabInsQ').html(tableInsQ);
    $(document).ready(function () {
        $('#tabInsQ').dataTable({
            data: InsQ,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Installation'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });
}

function createFSRM(input, groupdata){	
    var data = input;
    var HN = groupdata[0];
    var k = groupdata[1];
    var arr = groupdata[2];
    function calcTotals (dataset, headerName, key, value){ //e.g. data, "Category", "naf_cat", {"A", "B", "C"}
        var result = [];
        for (var  j =0; j<value.length; j++){
            var SusTotal = 0;
            var RMTotal = 0;
            var TotalCost = 0;
            var FacSqFt =  0;
            var counter = 0;
            for (var i=0; i < dataset.length ; i++){
                if(dataset[i][key]=== value[j]){
                    SusTotal += parseFloat(dataset[i].sus);
                    RMTotal += parseFloat(dataset[i].RM_corrected);
                    FacSqFt += parseFloat(dataset[i].total_measure);
                    counter++;
                }
            }

            var Sus = Math.round(SusTotal);
            var RMT = Math.round(RMTotal);
            var TSF = Math.round(FacSqFt);
            TotalCost = Sus + RMT;
            var PPSF = 0;
            if (TSF>0){
                PPSF = TotalCost/TSF;
            }
            result.push({[headerName]: value[j], Sustainment: Sus, RM: RMT, Total: TotalCost,SqFt: TSF, 'Price per SqFt': PPSF});
        }
        return result;
    }
    var Output = calcTotals(data,HN,k,arr);
    
    return Output;
}

function filter(arr, criteria) { //e.g. data,{ "naf_cat", "C"}
    return arr.filter(function(obj) {
        return Object.keys(criteria).every(function(c) {
            return obj[c] == criteria[c];
        });
    });
}


function groupSumCount(input, filters) { //include summation of utilization and monetary values
    var data = input;
    const result = [...data.reduce((r,o)   =>{
        var key = o[filters[0]];
        for(var i=1; i<filters.length; i++) {
        key += '-' + o[filters[i]];
        }

        const item = r.get(key) || Object.assign ({},o,{});

        return r.set(key,item);
    }, new Map).values()];





    /*var k1 = filters[0];
    var k2 = filters[1];
    var k3 = filters[2];
    var k4 = filters[3];

    const result = [...data.reduce((r,o) =>{
        const key = o[k1] + '-' +o[k2]+ '-' +o[k3]+'-' +o[k4];

        const item = r.get(key) ||  Object.assign ({},o,{
        });


    return r.set(key,item);
    }, new Map).values()];
    console.log(result);*/
}

function qfromfci(data, filters){
    var output = [];
    var HN = filters[0];
    var k = filters[1];
    var arr =  filters[2];
   for(var j=0; j<arr.length; j++){
    var counter=0, counter1=0, counter2=0, counter3=0, counter4=0;
    var per1 = 0, per2=0, per3=0, per4=0;
        for(var i=0; i<data.length; i++){
            if(data[i][k] === arr[j]){
                if(data[i].fci >= 90){
                    counter1++;
                }
                if(data[i].fci < 90 && data[i].fci >= 80){
                    counter2++;
                }
                if(data[i].fci < 80 && data[i].fci >= 60){
                    counter3++;
                }
                if(data[i].fci < 60){
                    counter4++;
                }
                counter++;
            }
        }
        per1 = counter1/counter*100;
        per2 = counter2/counter*100;
        per3 = counter3/counter*100;
        per4 = counter4/counter*100;

        output.push({[HN]: arr[j], "QRating": "Q1", Count: counter1, Percentage: per1});
        output.push({[HN]: arr[j], "QRating": "Q2", Count: counter2, Percentage: per2});
        output.push({[HN]: arr[j], "QRating": "Q3", Count: counter3, Percentage: per3});
        output.push({[HN]: arr[j], "QRating": "Q4", Count: counter4, Percentage: per4});
    }
    return output;
}



function createTable(data) {
    var html = '';

    if (data[0].constructor === Object) {
        var t = 0;
        html += '<thead>\r\n';
        html += '<tr>\r\n';
        for (var item in data[0]) {
            html += '<th>' + item + '</th>\r\n';
            t++;	
        }
        html += '</tr>\r\n';
        html += '</thead>\r\n';
        html += '<tfoot>\r\n';
        html += '<tr>\r\n';
        html += '<th></th>\r\n'
        for (var i=1; i<t; i++) {
            html += '<th></th>\r\n';
        }
        html += '</tr>\r\n';
        html += '</tfoot>\r\n';
    }
    return html;
}
function createTablenf(data) {
    var html = '';

    if (data[0].constructor === Object) {
        html += '<thead>\r\n';
        html += '<tr>\r\n';
        for (var item in data[0]) {
            html += '<th>' + item + '</th>\r\n';
        }
        html += '</tr>\r\n';
        html += '</thead>\r\n';
    }
    return html;
}


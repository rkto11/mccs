function pulldata (input) {
    const recapfac = [17523,21500,19298,40138,43717,47782,39926,39445,625295,39463,39452,39432,31888,32001,39223,32121,1101691,47757,35398,37271,47783,22306,21412,24899,48350,45599,19746,26331,26184,21052,25157,69807,69806,69802,118401,35266,35328,27562,52674,26734,21927,26609,26728,25482,24770,25976,26628,25977,56970,49360,56394,39532,36341,32415,36342,36338,23122,28369,28984,30496,29387,29388,25341,26424,30529,34510,27156,23036,27095,29520,30928,33482,32790,42675];
    
    //Matches FY24 Planned Recap list to general list via RPUID, outputs raw result
    var c = 0;
    var output = [];
    for (i=0;i<input.length; i++){
        for (j=0;j<recapfac.length;j++){
            var value = input[i].RPUID;
            if (recapfac[j] == value){
                output.push(input[i]);
            }
        }
    }

    //Checks for installations with recaps, outputs array list
    var In = []; 
    In.push(...new Set(output.map(item => item.installation)));

    //Categorizes facilities as sub arrays 
    var categorized = [];
    for (i=0;i<In.length;i++){
        var set = [];
        var rp = [];
        for (j=0;j<output.length;j++){
            if (output[j].installation == In[i]){
                set.push(output[j]);
            }
        }
        rp.push(...new Set(set.map(item=>item.RPUID)))
        var details = [];
        for (l=0;l<rp.length;l++){
            
            var subset = [];
            var asset = "";
            var FCI = 0;
            var Q = "";
            var FCIDate = "";
            var BuildDate = "";
            var totalmeasure = 0;
            var totalsus = 0;
            var totalRM = 0;
            var totalFSRM = 0;
            var facmeasure = 0;

            for (k=0;k<set.length;k++){
                if(set[k].RPUID == rp[l]){
                    asset  = set[k].asset_name;
                    FCI = set[k].fci;
                    Q = set[k].q_rating;
                    FCIDate =  set[k].fci_dt;
                    BuildDate = set[k].build_dt;
                    totalmeasure += parseFloat(set[k].total_measure);
                    facmeasure = parseFloat(set[k].fac_area_measure);
                    totalRM += parseFloat(set[k].RM_corrected);
                    totalsus += parseFloat(set[k].sus);
                    subset.push({"Facility_Description": set[k].facility_desc, "Activity": set[k].op_activity, "RM": parseFloat(set[k].RM_corrected), "Sustainment": parseFloat(set[k].sus), "FSRM": parseFloat(set[k].RM_corrected) + parseFloat(set[k].sus), "Measure":parseFloat(set[k].total_measure), "Usage_Percentage": parseFloat(set[k].total_measure)/facmeasure*100 +"%"});
                }
            }
            totalFSRM = totalsus + totalRM;
            var totalusage = totalmeasure/facmeasure*100;
            details.push({"Asset_Name": asset, "RPUID": rp[l], "FCI":FCI, "FCI_Date": FCIDate, "Build_Date": BuildDate, "Total_RM": totalRM, "Total_Sustainment": totalsus, "Total_FSRM": totalFSRM, "Total_Usage_Measure": totalmeasure, "Total_Usage_Percentage": totalusage, "Facility_Measure": facmeasure, "Facility_Usage": subset});
        }

        categorized.push({'Installation': In[i],"Count": rp.length,"Details":details});
    }
   
    var sorted = categorized.slice().sort((a,b) => d3.descending(a.Count, b.Count));
    console.log(sorted);     
    var recapTable = recapTableGen(sorted);
    $('#tabFY24Recap').html(recapTable);

    $(document).ready(function(){
        var table = $('#tabFY24Recap').DataTable({
            data: sorted,
            paging:false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            order: [[2, 'desc']],
            columns: [
                {
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '',
                },
                {data: 'Installation'},
                {data: 'Count'}
            ],

            "footerCallback": function (row, data, start, end, display) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var c = api.column(2).data().reduce(function(a,b){return intVal(a) + intVal(b);});

                $(api.column(1).footer()).html('Total Count');
                $(api.column(2).footer()).html(c);
            }
        });

        $('#tabFY24Recap tbody').on('click', 'td.dt-control', function(){
            var tr = $(this).closest('tr');
            var row = table.row( tr );
 
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
            // Open this row
            row.child(sub(row.data())).show();
            tr.addClass('shown');
        }
        });
    });

    $('#tabFY24Recap').on('requestChild.dt', function(e, row) {
        row.child(format(row.data())).show();
    })
 
}

//Table generator for recap
function recapTableGen(data){
    var html = '';
    html += '<thead>\r\n';
    html += '<tr>\r\n';
    html += '<th></th>\r\n';
    html += '<th>Installation</th>\r\n';
    html += '<th>Count</th>\r\n';
    html += '</tr>\r\n';
    html += '</thead>\r\n';
    
    html += '<tfoot>\r\n';
    html += '<tr>\r\n';
    html += '<th></th>\r\n';
    html += '<th>Installation</th>\r\n';
    html += '<th>Count</th>\r\n';
    html += '</tr>\r\n';
    html += '</tfoot>\r\n';
    return html;
}

function sub(d) {
        let tab = '<table id="subtable">' +
            '<thead>' +
               '<th class="CellWithComment">Asset Name<span class="CellComment">Name of facility in iNFADS</span></th>'+
               '<th class="CellWithComment">RPUID<span class="CellComment">The real property unique identifier (RPUID) is a non-intelligent code used to permanently and uniquely identify a real property asset. (Primary Key to connect facilities with utilization).</span></th>' +
               '<th class="CellWithComment">RM<span class="CellComment">Restoration and Modernization Cost, calculated by the facility&#39s Plant Replacement Value (PRV) x Usage Percentage x 1.025^number of years to FY</span></th>' +
               '<th class="CellWithComment">Sustainment<span class="CellComment">Projected cost of sustainment over the life cycle (50 years) of the facility according to iNFADS</span></th>' +
               '<th class="CellWithComment">FSRM<span class="CellComment">Facility Sustainment, Restoration, and Modernization Cost of the facility, Sustainment + R&M</span></th>' +
               '<th class="CellWithComment">Facility SqFt<span class="CellComment">Net sqaure footage of the Facility according to iNFADS</span></th>' +
               '<th class="CellWithComment">Usage SqFt<span class="CellComment">Square footage used by MCCS of the facility</span></th>' +
               '<th class="CellWithComment">Usage %<span class="CellComment">Usage SqFt/Facility SqFt</span></th>' +
               '<th class="CellWithComment">Build Date<span class="CellComment">Date that the facility contruction was completed</span></th>' +
               '<th class="CellWithComment">FCI<span class="CellComment">Facility Condition Index</span></th>' +
               '<th class="CellWithComment">FCI Date<span class="CellComment">Most recent FCI entry by the RPAO of the installation into iNFADS</span></th>' +
            '</thead>';
            for (i=0; i<d.Details.length; i++){
                var det = d.Details[i];
                tab +='<tr>' + 
                '<td>' + det.Asset_Name + '</td>' + 
                '<td>' + det.RPUID + '</td>' +
                '<td>' + '$' + numberWithCommas(Math.round(det.Total_RM*100)/100) + '</td>' + 
                '<td>' + '$' + numberWithCommas(Math.round(det.Total_Sustainment *100)/100) + '</td>' + 
                '<td>' + '$' + numberWithCommas(Math.round(det.Total_FSRM*100)/100) + '</td>' + 
                '<td>' + numberWithCommas(det.Facility_Measure) + '</td>' +
                '<td>' + numberWithCommas(det.Total_Usage_Measure) + '</td>' +
                '<td>' + Math.round(det.Total_Usage_Percentage*100)/100 + '%' + '</td>' +
                '<td>' + det.Build_Date + '</td>' +
                '<td>' + det.FCI + '</td>' +
                '<td>' + det.FCI_Date + '</td>' +
                '</tr>';
            }
        tab += '</table>';
        return tab;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
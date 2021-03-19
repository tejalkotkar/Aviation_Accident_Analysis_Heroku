// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 700;

var margin = {
    top: 40,
    right: 50,
    bottom: 300,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#injury")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read data from CSV
d3.csv("static/Data/Final_Clean_AviationData_US.csv").then(function(Aviationdata) {
    
    // Parse data
    Aviationdata.forEach(event => {
        event.Total_Fatal_Injuries = +event.Total_Fatal_Injuries,
        event.Total_Serious_Injuries = +event.Total_Serious_Injuries,
        event.Total_Minor_Injuries = +event.Total_Minor_Injuries,
        event.Total_Uninjured = +event.Total_Uninjured
    });

    // Get the accident data
    var accident_data = [];

    // Calculate total injuries
    Aviationdata.forEach(event => {
        var totalInjury = event.Total_Fatal_Injuries + event.Total_Serious_Injuries + event.Total_Minor_Injuries;

        // Create a temp dict
        var dict = {
            "Accident_Number": event.Accident_Number,
            "Event_Date": event.Event_Date,
            "Location": event.Location,
            "State": event.State,
            "Investigation_Type": event.Investigation_Type,
            "Injury_Severity": event.Injury_Severity,
            "Total_Injured": totalInjury,
            "Total_Uninjured": event.Total_Uninjured
        }

        // Push the dict to array
        accident_data.push(dict);
        
    });

    // Sort array in descending order based on Total Injuries
    accident_data.sort((a,b) => b.Total_Injured - a.Total_Injured);

    // Get top 10 records
    var filtered_accidents = accident_data.slice(0,10);
    

    // Scales
    var xScale = d3.scaleBand()
        .domain(filtered_accidents.map(a => a.Location))
        .range([0, width])
        .padding(0.5);

    var yLinearScale1 = d3.scaleLinear()
        .domain([d3.min(filtered_accidents, a => a.Total_Injured) - 10, d3.max(filtered_accidents, a => a.Total_Injured) + 10])
        .range([height, 0]);

    var yLinearScale2 = d3.scaleLinear()
        .domain([d3.min(filtered_accidents, a => a.Total_Uninjured) - 10, d3.max(filtered_accidents, a => a.Total_Uninjured) + 10])
        .range([height, 0]);
    
    // axes
    var bottomAxis = d3.axisBottom(xScale)
    var leftAxis = d3.axisLeft(yLinearScale1);
    var rightAxis = d3.axisRight(yLinearScale2);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
        .attr("stroke", "red") // NEW!
        .call(leftAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .attr("stroke", "green") // NEW!
        .call(rightAxis);

    var line1 = d3.line()
        .x(d => xScale(d.Location))
        .y(d => yLinearScale1(d.Total_Injured));

    var line2 = d3.line()
        .x(d => xScale(d.Location))
        .y(d => yLinearScale2(d.Total_Uninjured));


    // Append a path for line1
    chartGroup.append("path")
        .data([filtered_accidents])
        .attr("d", line1)
        .classed("line red", true);

    // Append a path for line2
    chartGroup.append("path")
        .data([filtered_accidents])
        .attr("d", line2)
        .classed("line green", true);
    
    //Circles
    var selectCircle = chartGroup.selectAll("circle").data(filtered_accidents);

    // Add circles to the injured line
    var iCircle = selectCircle.enter().append("circle")
    .attr("class", "circle")
    .attr("r", 3.5)
    .attr("cx", d => xScale(d.Location))
    .attr("cy", d => yLinearScale1(d.Total_Injured));
        
    // circle for UnInjured
    var uCircle = selectCircle.enter().append("circle")
        .attr("class", "circle")
        .attr("r", 4)
        .attr("cx", d => xScale(d.Location))
        .attr("cy", d => yLinearScale2(d.Total_Uninjured));

    // Creating tooltip for injured
    var tip1 = d3.tip()
        .attr("class","d3-tip")
        .offset([80, -60])
        .html(function(d){
            return(`${d.Accident_Number}<br>Date : ${d.Event_Date}<br>Total Injured : ${d.Total_Injured}<br>State : ${d.State}`);
        });
    
    // Call tooltip
    iCircle.call(tip1);

    iCircle.on("mouseover", function(data){
        tip1.show(data);
    }).on("mouseout",function(data){
        tip1.hide(data);
    });

    // Create tooltip for uninjured
    var tip2 = d3.tip()
        .attr("class","d3-tip")
        .offset([40, -60])
        .html(function(d){
            return(`Total Uninjured : ${d.Total_Uninjured}`);
        });
    
    // call tooltip
    uCircle.call(tip2);

    uCircle.on("mouseover", function(data){
        tip2.show(data);
    }).on("mouseout",function(data){
        tip2.hide(data);
     });    
    
    // Adding X-axis Labels
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 130})`)
        .classed("accidentActive atext", true)
        .text("Location");
    
    // Adding left Axis Y lable
    chartGroup.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2))
        .classed("injuredActive atext", true)
        .text("Total Injured");

    // Adding right Axis Y lable
    chartGroup.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - margin.left + width + margin.right + 100)
        .attr("x", 0 - (height / 2))
        .classed("uninjuredActive atext", true)
        .text("Total Uninjured");
    
    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform",`translate(0,${height})`)
        .call(bottomAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)");
});
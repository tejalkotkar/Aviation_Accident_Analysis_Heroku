// Define SVG area dimensions
width = 960;
height = 660;

// Define the chart's margins as an object
var margin = {top: 30, right: 30, bottom: 90, left: 100};

// Define chart parameter
var chartHeight = height - margin.top - margin.bottom;
var chartWidth = width - margin.left - margin.right;

// Create svg area
var svg = d3.select("#damage")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Creating a chartGroup
var chartGroup = svg.append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// ======================== FUNCTIONS START =================
// Function to get Xscale
getXscale=(data, chosenXAxis)=>{
    var bandScale = d3.scaleBand()
            .domain(data.map(d => d[chosenXAxis]))
            .range([0, chartWidth])
            .padding(0.1);
    
    return bandScale;
}

// Function to get Yscale
getYscale=(data)=>{
    var min = d3.min(data, d => d.Accident_count);
    var max = d3.max(data, d => d.Accident_count);
    var buffer = (max-min)/20;
    
    var LinearScale = d3.scaleLinear()
            .domain([min-buffer, max+buffer])
            .range([chartHeight, 0]);
            
    return LinearScale;
}

// Render axis according to new scale
renderAxis=(xAxis, yAxis, xScale, yScale)=>{
    bottom_Axis = d3.axisBottom(xScale);
    left_Axis = d3.axisLeft(yScale);
    
    xAxis.transition()
        .duration(1000)
        .call(bottom_Axis);
    
    yAxis.transition()
        .duration(1000)
        .call(left_Axis);
    
    return xAxis,yAxis;       
}

renderBars=(data, chosenXAxis, xScale, yScale)=>{
    // Create the barGroup variable
    var barGroup = chartGroup.selectAll("rect")
        .data(data)
    
    barGroup
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(barGroup) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(1000)
        .attr("class", "bar")
        .attr("x", d => xScale(d[chosenXAxis]))
        .attr("y", d => yScale(d.Accident_count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.Accident_count))
        .attr("fill", "#320E4A");  
                        
    // If less group in the new dataset, I delete the ones not in use anymore
    barGroup
        .exit()
        .remove()
}

// ======================== FUNCTIONS END ===================

d3.csv("static/Data/Final_Clean_AviationData_US.csv").then(function(Aviationdata, err) {
    if(err) throw err;

    // ========= DATA PREPARE =========
    
    // AIRCRAFT DAMAGE
    // Get unique values of the damage

    var Air_damage = [...new Set(Aviationdata.map(event => event.Aircraft_Damage))];

    // count of events/accidents with specific damage
    var DamageData = [];

    Air_damage.forEach(damage => {
        if(damage != "Unknown"){
            var damage_spec_array = Aviationdata.filter(data => data.Aircraft_Damage == damage);

            dict = {
                "Damage" : damage,
                "Accident_count" : damage_spec_array.length
            }
            DamageData.push(dict)
        }
    });

    // Sort array in descending order by count of accidents
    DamageData.sort((a,b) => b.Accident_count - a.Accident_count);
    console.log(DamageData);
    // Filter data according to board phase of flight
    // BOARD PHASE OF FLIGHT data prepare
    // Get unique values of the damage
    var flight_phase = [...new Set(Aviationdata.map(event => event.Broad_Phase_of_Flight))];
    
    // count of events/accidents with specific damage
    PhaseData = []
    
    flight_phase.forEach(phase => {
        if((phase != "UNKNOWN") && (phase != "Unknown")){
            var phase_spec_array = Aviationdata.filter(data => data.Broad_Phase_of_Flight == phase)
            dict = {
                "Phase" : phase,
                "Accident_count" : phase_spec_array.length
            }
            PhaseData.push(dict)
        }
    });
    
    // Sort array in descending order by count of accidents
    PhaseData.sort((a,b) => b.Accident_count - a.Accident_count);    

    // ========= PLOT =========
    // Defining Initial params and data
    var chosenXAxis = "Damage";
    var data = DamageData;

    // get scales
    xScale = getXscale(data, chosenXAxis);
    yScale = getYscale(data);

    // Create initial axis function
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Append Axis
    var xAxis = chartGroup.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")

    var yAxis = chartGroup.append("g")

    xAxis.call(bottomAxis);
    yAxis.call(leftAxis);

    // Create Y-Axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "active aText")
        .text("Accident Count");

    // Create X-Axis labels
    var xLabelGroup = chartGroup.append("g")
        .attr("transform",`translate(${chartWidth/2}, ${chartHeight+margin.top})`);

    const damegeLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "Damage")
        .classed("active aText", true)
        .text("Aircraft Damage");

    const phaseLabel = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "Phase")
        .classed("inactive aText", true)
        .text("Board Phase of Flight");
    
    // Plot Bar
    renderBars(data, chosenXAxis, xScale, yScale);

    // X-label event listener
    xLabelGroup.selectAll("text").on("click", function(){
        var selected_X_Axis = d3.select(this).attr("value");
        if(selected_X_Axis != chosenXAxis){
            chosenXAxis = selected_X_Axis;
            chosenXAxis == "Damage" ? data = DamageData : data = PhaseData;
            
            // Get new scales for x & y axis
            xScale = getXscale(data, chosenXAxis);
            yScale = getYscale(data);

            // chart2_yAxis = renderAxis("y", chart2_new_Yscale, chart2_yAxis);
            xAxis, yAxis = renderAxis(xAxis, yAxis, xScale, yScale);
           
            // Plot Bar
            renderBars(data, chosenXAxis, xScale, yScale);
            
            // Update label formatting:
            switch(chosenXAxis){
                case "Damage":
                    damegeLabel.classed("active aText", true).classed("inactive", false);
                    phaseLabel.classed("inactive aText", true).classed("active", false);
                    break;
                case "Phase":
                    phaseLabel.classed("active aText", true).classed("inactive", false);
                    damegeLabel.classed("inactive aText", true).classed("active", false);
                    break;
            }
        }
    });
});
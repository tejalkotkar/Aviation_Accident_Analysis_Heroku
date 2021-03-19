
// set the dimensions and margins of the graph
var margin = {top: 30, right: 110, bottom: 60, left: 120},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".purpose_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// tooltip
 var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// Parse the Data
d3.csv("static/Data/Final_Clean_AviationData_US.csv", function(data) {


 // Add X axis
 var x = d3.scaleLinear()
 .domain([0, 70])
 .range([ 0, width]);
svg.append("g")
 .attr("transform", "translate(0," + height + ")")
 .call(d3.axisBottom(x))
 .selectAll("text")
   .attr("transform", "translate(-10,0)rotate(-45)")
   .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
 .range([ 0, height ])
 .domain((data.map(function(d) { return d.Purpose_of_Flight; })))
 .padding(.5);
svg.append("g")
 .call(d3.axisLeft(y))

//Bars
svg.selectAll("myRect")
 .data(data)
 .enter()
 .append("rect")
 .attr("x", x(0) )
 .attr("y", function(d) { return y(d.Purpose_of_Flight); })
 .attr("width", function(d) { return x(d.Total_Serious_Injuries); })
 .attr("height", y.bandwidth() )
 .attr("fill", "#69a2b3")
 .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.Location) + ','+ (d.State) +"<br>"  + (d.Event_Date) + "<br>"  + (d.Investigation_Type )+ ',' +(d.Total_Serious_Injuries));
        }).on("mouseout", (d) => { tooltip.style("display", "display", 'display'); });

        svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .classed("Active1 atext", true)
        .text("Purpose Of Flight");


        svg.append("text")
         .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
          .classed("Active2 atext", true)
            .text("Total Serious Injuries");

})


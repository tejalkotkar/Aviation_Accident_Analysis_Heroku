// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;  

// append the svg object to the body of the page
var svg = d3.select(".distribution_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// Parse the Data
d3.csv("../static/Data/Final_Clean_AviationData_US.csv", function(data) {
console.log(data)

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.State; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 55])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.State); })
    .attr("y", function(d) { return y(d.Total_Fatal_Injuries); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.Total_Fatal_Injuries); })
    .attr("fill", "#69b3a2")
    .on("mousemove", function(d){
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html((d.Location) + "<br>"  + (d.Total_Fatal_Injuries) + '<br>' + (d.Investigation_Type));
    })
    .on("mouseout", (d) => { tooltip.style("display", "none"); });
    svg.append("text")
    .attr("transform","rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - (height / 2))
    .classed("Active1 atext", true)
    .text("Total Fatal Injuries");


    svg.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
      .classed("Active2 atext", true)
        .text("States");

})

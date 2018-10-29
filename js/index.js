 /*
              https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
              
              {"baseTemperature": 8.66, "monthlyVariance": [{"year": 1753, "month": 1, "variance": -1.366}, ...]}
              */

var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url, function (error, response) {
  if (error) console.log(error);else
  {
    var data = response.monthlyVariance;
    var baseTemp = response.baseTemperature;
    var width = 1500;
    var height = 500;
    var paddingHor = 150;
    var paddingVert = 120;

    var svg = d3.select("#graph").
    append("svg").
    attr("width", width).
    attr("height", height);

    var xTimeFormat = d3.timeFormat("%Y");
    var yTimeFormat = d3.timeFormat("%B");

    // console.log("min:", d3.min(data, e => e.variance), "max:", d3.max(data, e => e.variance));

    var xScale = d3.scaleTime().
    domain([d3.min(data, function (e) {return Date.parse(e.year);}), d3.max(data, function (e) {return Date.parse(e.year);})]).
    range([paddingHor, width - paddingHor]);

    var yScale = d3.scaleTime().
    domain([d3.min(data, function (e) {return Date.parse(e.month);}), d3.max(data, function (e) {return Date.parse(e.month);})]).
    range([height - paddingVert, paddingVert]);

    var xAxis = d3.axisBottom(xScale).tickFormat(xTimeFormat);
    var yAxis = d3.axisLeft(yScale).tickFormat(yTimeFormat);

    var tooltip = d3.select("#graph").
    append("div").
    attr("id", "tooltip").
    style("opacity", 0);

    svg.append("g").
    attr("transform", "translate(2," + (height - paddingVert + 1) + ")").
    attr("id", "x-axis").
    style("font-size", 15).
    call(xAxis);

    svg.append("g").
    attr("transform", "translate(" + (paddingHor - 1) + ", " + -12 + ")").
    attr("id", "y-axis").
    style("font-size", 15).
    call(yAxis);

    svg.selectAll("rect").
    data(data).
    enter().
    append("rect").
    attr("x", function (e) {return xScale(Date.parse(e.year));}).
    attr("y", function (e) {return yScale(Date.parse(e.month)) - 24;}).
    attr("width", 5).
    attr("height", 25).
    attr("class", "cell").
    attr("data-month", function (e) {return e.month - 1;}).
    attr("data-year", function (e) {return e.year;}).
    attr("data-temp", function (e) {return e.variance;}).
    style("fill", function (e) {
      switch (Math.round(e.variance)) {
        case -7:
          return "rgb(0,0,255)";
        case -6:
          return "rgb(0,255,255)";
        case -5:
          return "rgb(0,255,170)";
        case -4:
          return "rgb(0,255,85)";
        case -3:
          return "rgb(0,255,0)";
        case -2:
          return "rgb(75,255,0)";
        case -1:
          return "rgb(150,255,0)";
        case 0:
          return "rgb(255,255,0)";
        case 1:
          return "rgb(255,180,0)";
        case 2:
          return "rgb(255,120,0)";
        case 3:
          return "rgb(255,60,0)";
        case 4:
          return "rgb(255,0,0)";}

    }).
    on("mouseover", function (e) {
      tooltip.transition().
      duration(200).
      style("opacity", .9);
      tooltip.html("<span class='legendSpan'>Date: </span>" + e.month + " / " + e.year + "<br>" +
      "<span class='legendSpan'>Variance: </span>" + e.variance + "°C<br>").
      attr("data-year", e.year).
      style("left", d3.event.pageX + "px").
      style("top", d3.event.pageY - 45 + "px");
    }).
    on("mouseout", function (e) {
      tooltip.transition().
      duration(500).
      style("opacity", 0);
    });

    svg.append("text").
    attr("x", width / 2).
    attr("y", height - paddingVert / 2 + 10).
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato").
    style("font-weight", "bold").
    text("Year");

    svg.append("text").
    attr("transform", "translate(" + (paddingHor / 2 - 30) + ", " + height / 2 + ") rotate(-90)").
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato").
    style("font-weight", "bold").
    text("Month");

    svg.append("text").
    text("Monthly Global Land-Surface Temperature").
    attr("x", width / 2).
    attr("y", paddingVert / 2 - 18).
    attr("id", "title").
    style("font-size", 25).
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato").
    attr("id", "title");

    svg.append("text").
    text("1753 - 2015: base temperature 8.66℃").
    attr("x", width / 2).
    attr("y", paddingVert / 2 + 14).
    attr("id", "title").
    style("font-size", 20).
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato").
    attr("id", "description");

    var legend = svg.append("g").
    attr("id", "legend");

    legend.append("rect").
    attr("x", width - paddingHor / 2).
    attr("y", height / 2 - 70).
    attr("width", 30).
    attr("height", 30).
    style("fill", "rgb(75,255,0)"); // -2

    legend.append("rect").
    attr("x", width - paddingHor / 2).
    attr("y", height / 2 - 35).
    attr("width", 30).
    attr("height", 30).
    style("fill", "rgb(150,255,0)"); // -1

    legend.append("rect").
    attr("x", width - paddingHor / 2).
    attr("y", height / 2).
    attr("width", 30).
    attr("height", 30).
    style("fill", "rgb(255,255,0)"); // 0

    legend.append("rect").
    attr("x", width - paddingHor / 2).
    attr("y", height / 2 + 35).
    attr("width", 30).
    attr("height", 30).
    style("fill", "rgb(255,180,0)"); // 1

    legend.append("text").
    text("-2°C:").
    attr("x", width - paddingHor / 2 - 35).
    attr("y", height / 2 - 70 + 16).
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato");

    legend.append("text").
    text("-1°C:").
    attr("x", width - paddingHor / 2 - 35).
    attr("y", height / 2 - 35 + 16).
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato");

    legend.append("text").
    text("0°C:").
    attr("x", width - paddingHor / 2 - 33).
    attr("y", height / 2 - 0 + 16).
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato");

    legend.append("text").
    text("+1°C:").
    attr("x", width - paddingHor / 2 - 35).
    attr("y", height / 2 + 35 + 16).
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-family", "Lato");
  }
});
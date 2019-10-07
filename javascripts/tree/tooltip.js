tooltip = d3.select("#sideTooltip").append("div").attr("id", "tooltip");
tooltip.style("width", "390px");
tooltip.style("margin-left", "0px");
tooltip.style("margin", "20px");
tooltip.style("opacity", 0)
    .append("img")
    .attr("src", "")
    .attr("alt", "")
    // .attr("height","60px")
    // .attr("width","45px")
    .attr("class", "cimg")
    .attr("style", "float:right")
    ;
tooltip.style("opacity", 0)
    .append("div")
    .attr("class", "titre_nom")
    .attr("id", "id_ptool")
    .attr("style", "float:left")
    ;
tooltip.style("opacity", 0)
    .append("div")
    .attr("class", "value")
    .attr("id", "id_ptool")
    .attr("style", "float:left")
    ;
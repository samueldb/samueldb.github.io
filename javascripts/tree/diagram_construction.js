var svg, tooltip, biHiSankey, path, defs, colorScale, highlightColorScale, isTransitioning;

var OPACITY = {
    NODE_DEFAULT: 0.9,
    NODE_FADED: 0.1,
    NODE_HIGHLIGHT: 0.8,
    LINK_DEFAULT: 0.6,
    LINK_FADED: 0.05,
    LINK_HIGHLIGHT: 0.9
},
    TYPES = ["M", "couple", "F", "highlighted"],
    TYPE_COLORS = ["#77B5FE", "#d95f02", "#FD3F92", "#3366FF"],
    TYPE_HIGHLIGHT_COLORS = ["#66c2a5", "#fc8d62", "#8da0cb", "#4050A0"],
    LINK_COLOR = "#b3b3b3",
    INFLOW_COLOR = "#2E86D1",
    OUTFLOW_COLOR = "#D63028",
    NODE_WIDTH = 20,
    COLLAPSER = {
        RADIUS: NODE_WIDTH / 2,
        SPACING: 1
    },
    OUTER_MARGIN = 65,
    MARGIN = {
        TOP: 2.5,
        RIGHT: 2.5,
        BOTTOM: 2.5,
        LEFT: 2.5

    },
    TRANSITION_DURATION = 400,
    HEIGHT = 900 - MARGIN.TOP - MARGIN.BOTTOM,
    WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT,
    LAYOUT_INTERATIONS = 0,
    REFRESH_INTERVAL = 3500;

colorScale = d3.scale.ordinal().domain(TYPES).range(TYPE_COLORS),
    highlightColorScale = d3.scale.ordinal().domain(TYPES).range(TYPE_HIGHLIGHT_COLORS),

    svg = d3.select("#chart_sankey").append("svg")
        .attr("id", "id_svg")
        .attr("width", "100%")
        .attr("height", "900px")
        //.attr("viewBox","0 -100 1450 1600") //cadre sur l'ensemble des noeuds 
        .attr("viewBox", "0 -100 3000 5400") //cadre sur l'ensemble des noeuds 
        .attr("style", function () {
            return "transform:rotate(90deg);";
        }) // tourne la map de haut en bas // overflow: visible
        // .call(zoom)
        .call(d3.behavior.zoom().on("zoom", function () {       // Permet de gérer le zoom et le déplacement
            console.log("on zoom !");
            var x = d3.event.translate[0];
            var y = d3.event.translate[1];
            // console.log("transform", "translate(" + x + "," + y + ")" + " scale(" + d3.event.scale + ")")
            svg.attr("transform", "translate(" + x + "," + y + ")" + " scale(" + d3.event.scale + ")")
        }))
        .append("g");
//.attr("transform", "translate(" + -100 + "," + 100 + ") scale(0.17)");
svg.append("g").attr("id", "path_time");
svg.append("g").attr("id", "links");
svg.append("g").attr("id", "nodes");
svg.append("g").attr("id", "collapsers");

biHiSankey = d3.biHiSankey();

// Set the biHiSankey diagram properties
biHiSankey
    .nodeWidth(NODE_WIDTH)
    .nodeSpacing(24)
    .linkSpacing(1)
    .arrowheadScaleFactor(0.5) // Specifies that 0.5 of the link's stroke WIDTH should be allowed for the marker at the end of the link.
    .size([WIDTH, HEIGHT]);

def_arrow(svg, biHiSankey, LINK_COLOR, OUTFLOW_COLOR, INFLOW_COLOR);
var res = new Object;
res = populateNode();
console.log("now going to res in diagram construction")
biHiSankey
    .nodes(res["nodes"])
    .links(res["links"])
    .initializeNodes(function (node) {
        //node.state = node.parent ? "contained" : "collapsed";
        node.state = "collapsed";
        //node.id = node.id;
    })
    .layout(LAYOUT_INTERATIONS);

disableUserInterractions(2 * TRANSITION_DURATION);

update();

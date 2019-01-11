function init() {
    var svg, tooltip, biHiSankey, path, defs, colorScale, highlightColorScale, isTransitioning;

    var config = {
        OPACITY: {
            NODE_DEFAULT: 0.9,
            NODE_FADED: 0.1,
            NODE_HIGHLIGHT: 0.8,
            LINK_DEFAULT: 0.6,
            LINK_FADED: 0.05,
            LINK_HIGHLIGHT: 0.9
        },
        TYPES: ["M", "couple", "F", "highlighted"],
        TYPE_COLORS: ["#77B5FE", "#d95f02", "#FD3F92", "#3366FF"],
        TYPE_HIGHLIGHT_COLORS: ["#66c2a5", "#fc8d62", "#8da0cb", "#4050A0"],
        LINK_COLOR: "#b3b3b3",
        INFLOW_COLOR: "#2E86D1",
        OUTFLOW_COLOR: "#D63028",
        NODE_WIDTH: 20,
        COLLAPSER: {
            RADIUS: 10, // config.NODE_WIDTH / 2
            SPACING: 1
        },
        OUTER_MARGIN: 65,
        MARGIN: {
            TOP: 2.5,
            RIGHT: 2.5,
            BOTTOM: 2.5,
            LEFT: 2.5

        },
        TRANSITION_DURATION: 400
    }
    config.HEIGHT = 900 - config.MARGIN.TOP - config.MARGIN.BOTTOM;
    config.WIDTH = 600 - config.MARGIN.LEFT - config.MARGIN.RIGHT;
    config.LAYOUT_INTERATIONS = 0;
    config.REFRESH_INTERVAL = 3500;

    res = initTree(config);
    biHiSankey = res[0];
    svg = res[1];
    loadsearchBar(svg, biHiSankey);
    // initView()

}

function initTree(config) {
    biHiSankey = biHiSankey();
    // Set the biHiSankey diagram properties
    biHiSankey
        .nodeWidth(config.NODE_WIDTH)
        .nodeSpacing(24)
        .linkSpacing(1)
        .arrowheadScaleFactor(0.5) // Specifies that 0.5 of the link's stroke WIDTH should be allowed for the marker at the end of the link.
        .size([config.WIDTH, config.HEIGHT]);

    colorScale = d3.scale.ordinal().domain(config.TYPES).range(config.TYPE_COLORS);
    highlightColorScale = d3.scale.ordinal().domain(config.TYPES).range(config.TYPE_HIGHLIGHT_COLORS);
    svg = d3.select("#chart").append("svg")
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
            console.log("transform", "translate(" + x + "," + y + ")" + " scale(" + d3.event.scale + ")")
            svg.attr("transform", "translate(" + x + "," + y + ")" + " scale(" + d3.event.scale + ")")
        }))
        .append("g");

    //.attr("transform", "translate(" + -100 + "," + 100 + ") scale(0.17)");
    svg.append("g").attr("id", "path_time");
    svg.append("g").attr("id", "links");
    svg.append("g").attr("id", "nodes");
    svg.append("g").attr("id", "collapsers");


    initToolTip();

    initArrow();

    nodAndTree = initNodes();
    nodesTree = nodAndTree[0];
    linksTree = nodAndTree[1];

    // Définition de la flêche 
    function initArrow() {
        path = biHiSankey.link().curvature(0.5);
        defs = svg.append("defs");
        defs.append("marker")
            .style("fill", config.LINK_COLOR)
            .attr("id", "arrowHead")
            .attr("viewBox", "0 0 6 10")
            .attr("refX", "1")
            .attr("refY", "5")
            .attr("markerUnits", "strokeWidth")
            .attr("strokeWidth", "20px")
            .attr("markerWidth", "1")
            .attr("markerHeight", "5")
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");
        defs.append("marker")
            .style("fill", config.OUTFLOW_COLOR)
            .attr("id", "arrowHeadInflow")
            .attr("viewBox", "0 0 6 10")
            .attr("refX", "1")
            .attr("refY", "5")
            .attr("markerUnits", "strokeWidth")
            .attr("strokeWidth", "20px")
            .attr("markerWidth", "1")
            .attr("markerHeight", "1")
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");
        defs.append("marker")
            .style("fill", config.INFLOW_COLOR)
            .attr("id", "arrowHeadOutlow")
            .attr("viewBox", "0 0 6 10")
            .attr("refX", "1")
            .attr("refY", "5")
            .attr("markerUnits", "strokeWidth")
            .attr("strokeWidth", "20px")
            .attr("markerWidth", "1")
            .attr("markerHeight", "1")
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");
    }

    // Définition du tooltip
    function initToolTip() {
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
            .attr("style", "float:right");
        tooltip.style("opacity", 0)
            .append("div")
            .attr("class", "titre_nom")
            .attr("id", "id_ptool")
            .attr("style", "float:left");
        tooltip.style("opacity", 0)
            .append("div")
            .attr("class", "value")
            .attr("id", "id_ptool")
            .attr("style", "float:left");
    }

    drawTree(nodesTree, linksTree, config)
    return [biHiSankey, svg]
}

function initView() {
}


function drawTree(nodesTree, linksTree, config) {
    biHiSankey
        .nodes(nodesTree)
        .links(linksTree)
        .initializeNodes(function (node) {
            //node.state = node.parent ? "contained" : "collapsed";
            node.state = "collapsed";
            //node.id = node.id;
        })
        .layout(config.LAYOUT_INTERATIONS);

    disableUserInterractions(2 * config.TRANSITION_DURATION);

    update(config, biHiSankey);
}

function initNodes() {
    NoeudsBase = trouverNodes(0, []);
    CheckNoeuds = NoeudsBase;
    var links = [];

    for (var node of CheckNoeuds) {
        ComputeCouple(node, NoeudsBase, links);
        ComputeLinks(node, NoeudsBase, links);
    }
    
    function ComputeCouple(r, NoeudsBase, links) {
        var liste_couple = [];
        if ((r.couple_id != null && r.couple_id != "null")) {
            var isinliste = 0;
            for (var lc of liste_couple) {
                if (lc.id_c == r.own_id) {
                    // Si l'id est déjà dans cette liste, on ne l'ajoute pas
                    isinliste = 1;
                }
            }
            if (isinliste == 0) {
                //var Pere = NoeudsBase.find(function(a){return a.id == r.father_id});
                var homme = NoeudsBase.find(function (a) { return a.id == r.own_id && r.genre == "M" });
                var saFemme;
                if (homme) {
                    CheckNoeuds.push({ "type": "couple", "id": "c_" + r.couple_id, "parent": null, "name": homme.nom, "prenom": homme.prenom, "id_homme": r.own_id, "id_femme": r.couple_id, "dMar": r.date_mariage, "arbre": r.arbre });
                    liste_couple.push({ "id_c": r.couple_id, "id_homme": r.own_id });
                    links.push({ "source": homme.id, "target": "c_" + r.couple_id, "value": 1 });
                    links.push({ "source": r.couple_id, "target": "c_" + r.couple_id, "value": 1 });
                }
            }
        }
        for (var p of CheckNoeuds){
            for (var lc of liste_couple) {
                if (p.id == lc.id_c || p.id == lc.id_homme) {
                    p.parent = "c_" + lc.id_c;
                }
            }
        }
    }

    function ComputeLinks(r, NoeudsBase, links) {
        // On calcul les liens 
        var pereExiste = NoeudsBase.find(function (a) { return a.id == r.father_id });
        var mereExiste = NoeudsBase.find(function (a) { return a.id == r.mother_id });
    
        if (r.father_id == null || r.father_id == " " || r.father_id == "null" || typeof (pereExiste) == 'undefined') { }
        else {
            links.push({ "source": r.father_id, "target": r.own_id, "value": 1 });
        }
        if (r.mother_id == null || r.mother_id == " " || r.mother_id == "null" || typeof (mereExiste) == 'undefined') { }
        else {
            links.push({ "source": r.mother_id, "target": r.own_id, "value": 1 });
        }
        return links
    }

    return [CheckNoeuds, links]
}




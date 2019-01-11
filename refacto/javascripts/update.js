function update(config, biHiSankey) {
    var link, linkEnter, node, nodeEnter, collapser, collapserEnter;

    function dragmove(node) {
        node.x = Math.max(0, Math.min(config.WIDTH - node.width, d3.event.x));           // On supprime cette ligne pour ne garder que le déplacement vertical. 
        //node.y = Math.max(0, Math.min(HEIGHT - node.height, d3.event.y));
        //d3.select(this).attr("transform", "translate(" + node.x + "," + node.y + ")");
        //biHiSankey.relayout();
        svg.selectAll(".node").selectAll("circle").attr("height", function (d) { return d.height; });
        link.attr("d", path);
    }

    function containChildren(node) {

        node.children.forEach(function (child) {
            child.state = "contained";
            child.parent = this;
            child._parent = null;
            containChildren(child);
        }, node);
    }

    function expand(node) {
        node.state = "expanded";
        node.children.forEach(function (child) {
            child.state = "collapsed";
            child._parent = this;
            child.parent = null;
            containChildren(child);
        }, node);
    }

    function collapse(node) {
        node.state = "collapsed";
        containChildren(node);
    }

    function restoreLinksAndNodes() {
        link
            .style("stroke", config.LINK_COLOR)
            .style("marker-end", function () { return 'url(#arrowHead)'; })
            .transition()
            .duration(config.TRANSITION_DURATION)
            .style("opacity", function (d) {
                return d.id.includes("c_") || isParentCelib(d) ? 1 : 0
            });

        //node
        //.selectAll("circle")
        //.style("fill", function (d) {
        //  d.color = colorScale(d.type.replace(/ .*/, ""));
        //  return d.color;
        //})
        //.style("fill","url(#mImg)")
        //.style("stroke", function (d) {
        //  return d3.rgb(colorScale(d.type.replace(/ .*/, ""))).darker(0.1);
        //})
        //.style("fill-opacity", OPACITY.NODE_DEFAULT);

        node.filter(function (n) { return !n.id.includes("c_"); })
            .transition()
            .duration(config.TRANSITION_DURATION)
            .style("opacity", 1);
    }

    function showHideChildren(node) {
        disableUserInterractions(2 * config.TRANSITION_DURATION);
        hideTooltip();
        if (node.state === "collapsed") { expand(node); }
        else { collapse(node); }

        biHiSankey.relayout();
        update();
        link.attr("d", path);
        restoreLinksAndNodes();
    }

    function hide(node) {
        disableUserInterractions(2 * config.TRANSITION_DURATION);
        hideTooltip();
        if (typeof (node.state) != 'undefined') {
            if (node.state === "collapsed") { expand(node); }
            else if (node.state === "contained") {
                expand(node);
                var him = noeudsExistants.find(function (a) { a.id == node.id });
                var her = noeudsExistants.find(function (a) { a.c_id == node.id });
                //collapse(him);
                //expand(her);
            }
            else { /*collapse(node);*/ }
        }
        biHiSankey.relayout();
        update();
        link.attr("d", path);
        restoreLinksAndNodes();
    }

    function highlightConnected(g) {
        link.filter(function (d) {
            if (d.source === g) {
                console.log("source : " + d.source.id);
                return true;
            }
            if ((d.source != null || d.target != null)) {           // On récupère les enfants et le conjoint
                if (!isParentCelib(d) && g.parent != null) {
                    if (d.target.id == g.parent.id || d.source.id == g.parent.id) {
                        console.log("source : " + d.source.id + " - " + d.target.id);
                        return true;
                    }
                    else if (g.parent == null) {
                        return (d.target === g || d.target.id == g.id)
                    }
                }
                else {
                    return false;
                }
            }
            return false;
        })
            .style("marker-end", function () { return 'url(#arrowHeadInflow)'; })
            .style("stroke", config.OUTFLOW_COLOR) // rouge
            .style("opacity", 1);

        link.filter(function (d) {
            if (d.target != null) {
                if (!isParentCelib(d) && g.parent != null) {
                    if (d.target === g || d.target.id == g.parent.id) { console.log("target : " + d.target === g + " - " + d.target.id + " - " + d.target.id); }
                    return (d.target === g || d.target.id == "c_" + g.f_id || d.target.id == "c_" + g.m_id || d.target.id == g.parent.id);
                }
                else if (g.parent == null) {
                    return (d.target === g || d.target.id == g.id || d.target.id == "c_" + g.f_id || d.target.id == "c_" + g.m_id)
                }
            }
        })     // On récupère les parents
            .style("marker-end", function () { return 'url(#arrowHeadOutlow)'; })
            .style("stroke", config.INFLOW_COLOR)
            .style("opacity", 1);
    }

    function fadeUnconnected(g) { // Il manque le cas des personnes célibataires
        link.filter(function (d) {
            if (d.source != null && d.target != null && g.parent != null) {
                return d.source !== g && d.source.id != g.parent.id && d.target !== g && d.target.id != g.parent.id && d.target.id != "c_" + g.f_id && d.target.id != "c_" + g.m_id;
            }
        })
            .style("marker-end", function () { return 'url(#arrowHead)'; })
            .transition()
            .duration(TRANSITION_DURATION)
            .style("opacity", OPACITY.LINK_FADED);

        node.filter(function (d) {
            return !biHiSankey.connected(d, g) && !d.id.includes("c_") && d !== g;    // On fade les non-reliés
        }).transition()
            .duration(TRANSITION_DURATION)
            .style("opacity", OPACITY.NODE_FADED);
    }

    link = svg.select("#links").selectAll("path.link")
        .data(biHiSankey.visibleLinks(), function (d) { return d.id; });


    link.transition()
        .duration(config.TRANSITION_DURATION)
        .style("stroke-WIDTH", function (d) { return Math.max(1, d.thickness); })
        .attr("d", path)
        .style("opacity", function (d) { return d.id.includes("c_") || isParentCelib(d) ? 1 : 0 });
    link.exit().remove();
    linkEnter = link.enter().append("path")
        .attr("class", "link")
        .style("fill", "none");

    linkEnter.on('mouseenter', function (d) {
        if (!isTransitioning) {
            showTooltip().select(".value").text(function () {
                if (d.direction > 0) {
                    // return d.source.id + "--" + d.source.prenom + " -> " + d.target.prenom + " " + d.target.name + "\n";
                    return "direction " + d.direction + "-" + d.source.id + "--> " + d.target.id + "\n";
                }
                // return d.target.id + "--" + d.target.name + " <- " + d.source.name + d.source.prenom + "\n";
                return "direction " + d.direction + "-" + d.source.id + "--> " + d.target.id + "\n";
            });

            d3.select(this)
                .style("stroke", config.LINK_COLOR)
                .transition()
                .duration(config.TRANSITION_DURATION / 2)
                .style("opacity", function (d) { return d.id.includes("c_") || isParentCelib(d) ? 1 : 0 });
        }
    });

    linkEnter.sort(function (a, b) { return b.thickness - a.thickness; })
        .classed("leftToRight", function (d) {
            return d.direction > 0;
        })
        .classed("rightToLeft", function (d) {
            return d.direction < 0;
        })
        .style("marker-end", function () {
            return 'url(#arrowHead)';
        })
        .style("stroke", config.LINK_COLOR)
        .style("opacity", 0)
        .transition()
        .delay(config.TRANSITION_DURATION)
        .duration(config.TRANSITION_DURATION)
        .attr("d", path)
        .style("stroke-WIDTH", function (d) { return Math.max(1, d.thickness); })
        .style("opacity", function (d) { return d.id.includes("c_") || isParentCelib(d) ? 1 : 0 });


    node = svg.select("#nodes").selectAll(".node")
        .data(biHiSankey.collapsedNodes(), function (d) { return d.id; });

    node.transition()
        .duration(config.TRANSITION_DURATION)
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style("opacity", function (d) { return d.id.includes("c_") ? 1 : 0 })
        .select("circle")
        .style("fill", function (d) {
            d.color = colorScale(d.type.replace(/ .*/, ""));
            return d.color;
        })
        .style("fill", function (d) { return "url(#mImg_" + d.id + ")" })
        // < !-- .style("stroke", function (d) { return d3.rgb(colorScale(d.type.replace(/ .*/, ""))).darker(0.1); }) -->
        .style("stroke-WIDTH", "1px")
        .attr("height", function (d) { return d.height; })
        .attr("width", biHiSankey.nodeWidth());


    node.exit()
        .transition()
        .duration(config.TRANSITION_DURATION)
        .attr("transform", function (d) {
            var collapsedAncestor, endX, endY;
            collapsedAncestor = d.ancestors.filter(function (a) {
                return a.state === "collapsed";
            })[0];
            endX = collapsedAncestor ? collapsedAncestor.x : d.x;
            endY = collapsedAncestor ? collapsedAncestor.y : d.y;
            return "translate(" + endX + "," + endY + ")";
        })
        .remove();


    nodeEnter = node.enter().append("g").attr("class", "node");

    // Ne sont concerné ici que les noeuds uniques visible au départ
    nodeEnter
        .attr("transform", function (d) {
            var sX = 0;
            var sY = 0;
            if (d._parent) {
                sX = d._parent.x;
            }
            else if (d.children.length > 1) {
                sX = Math.max(d.children[0].x, d.children[1].x);
                sY = Math.max(d.children[0].y, d.children[1].y);
            }
            else {
                sX = d.x;
                sY = d.y;
            }
            return "translate(" + sX + "," + sY + ")";
        })
        .style("opacity", function (d) { return d.id.includes("c_") ? 0 : 1 })
        .transition()
        .duration(config.TRANSITION_DURATION)
        .style("opacity", function (d) { return d.id.includes("c_") ? 0 : 1 })
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    addImage(nodeEnter);

    var circle = nodeEnter.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 24)
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("transform", "rotate(-90deg)")
        .style("fill", function (d) { return "url(#mImg_" + d.id + ")" });

    nodeEnter.append("text");

    node.on("click", function (g) {
        console.log("click sur " + g.prenom);
        //alert('on a tiré sur : '+g.prenom);
    });
    node.on("mouseover", function (g) {
        console.log("mouseoever sur " + g.id + " : " + g.prenom);
        if (!isTransitioning && !g.id.includes("c_")) {
            // restoreLinksAndNodes();
            highlightConnected(g);
            fadeUnconnected(g);
            addImage(node);

            tooltip
                .transition()
                .duration(config.TRANSITION_DURATION)
                .style("opacity", 1).select(".titre_nom")
                .text(function () {
                    var info = g.name + "\n " + g.prenom;
                    return info;
                });
            // On ajoute l'image récupérée sur github :     
            tooltip.transition().style("opacity", 1).select(".cimg").attr("src", 'https://raw.githubusercontent.com/samueldb/samueldb.github.io/master/images/portraits/' + g.id + '.jpg');


            tooltip
                .transition()
                .duration(config.TRANSITION_DURATION)
                .style("opacity", 1).select(".value")
                .text(function () {
                    var nomsCouples = '';
                    var additionalInstructions = g.children.length ? "\n " + g.dMar ? "\n Date de mariage : " + formatDate(g.dMar) : "" + "(Double clic pour ouvrir)" : ("\n Date de naissance : " + (g.dBirth ? formatDate(g.dBirth) : "non renseignée") + (g.dDie ? ("\n Date de décès : " + formatDate(g.dDie)) : "") + "\n Profession : " + (g.job ? g.job : "non renseignée") + "\n " + (g.comm ? g.comm : " - "));
                    if (g.children.length) {
                        var nomC1 = g.children[0].name + ' ' + g.children[0].prenom;
                        var nomC2 = g.children[1].name + ' ' + g.children[1].prenom;
                        nomsCouples = nomC1 + '\n' + nomC2;
                    }
                    else {
                        nomsCouples = g.name + ' ' + g.prenom;
                    }
                    return additionalInstructions;
                });

        }
    });

    /**
                Gestion des images affichées sur les noeuds
                */
    function addImage(noeud) {
        if (noeud.length > 1) {
            noeud = noeud.find(function (g) { return g.id == noeud.id });
        }

        var pat = noeud
            .append("defs")
            .append("pattern")
            .attr("id", function (d) { return "mImg_" + d.id })
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "48px")
            .attr("height", "48px")
            .style("fill", "transparent")
            .style("stroke", "back")
            .style("stroke-width", "0.25");

        pat.append("image")
            .attr("xlink:href", function (d) {
                var image = 'https://raw.githubusercontent.com/samueldb/samueldb.github.io/master/images/portraits/' + d.id + '.jpg';
                if (d.type == 'couple') {
                    image = 'https://raw.githubusercontent.com/samueldb/samueldb.github.io/master/images/image_couple.png';
                }
                else if (d.adr_photo != null) {
                    image = d.adr_photo;
                }
                else if (d.adr_photo == null) {
                    image = 'https://raw.githubusercontent.com/samueldb/samueldb.github.io/master/images/no_photo.png';
                }
                return image;
            })
            .attr("x", "-0")
            .attr("y", "-0")
            .attr("width", "48px")
            .attr("height", "48px");

    }

    node.call(d3.behavior.drag()
        .origin(function (d) { return d; })
        .on("dragstart", function () { this.parentNode.appendChild(this); })
        .on("drag", dragmove));

    // Ajouter du texte sur les noeuds
    node.filter(function (d) {
        return d.value > -1;
        //return true;
    }) // ici, on peut filter les noms des noeuds auxquels seront ajouté les textes
        .select("text")
        .attr("x", function (d) { return d.width; })
        .attr("y", function (d) { return d.height; })
        .attr("dy", ".35em")
        .attr("text-anchor", "bottom")
        .attr("transform", "rotate(225) translate(5,-15)") //function (d) { return d.height; }+");")
        .text(function (d) {
            var txt = "";
            if (d.nom.includes(" ") || d.nom.includes("-")) {
                var index = d.nom.indexOf(" ");
                if (index == -1) {
                    index = d.nom.indexOf("-");
                }
                txt = d.prenom + " " + d.nom[0] + "." + d.nom[index + 1] + ".";
            }

            else {
                txt = d.prenom + " " + d.nom[0] + ".";
            }
            return txt;
        })
        .filter(function (d) { return d.x < WIDTH / 2; })
        .attr("x", 6 + biHiSankey.nodeWidth())
        .attr("text-anchor", "start");



    //node.attr("rotateZ","90deg");
    node.attr("id", function (d) { return d.id; });
    collapser = svg.select("#collapsers").selectAll(".collapser")
        .data(biHiSankey.expandedNodes(), function (d) { return d.id; });


    collapserEnter = collapser.enter().append("g").attr("class", "collapser");

    collapserEnter.append("circle")
        .attr("r", config.COLLAPSER.RADIUS)
    // .style("fill", function (d) {
    //   d.color = colorScale(d.type.replace(/ .*/, ""));
    //   return d.color;
    // });

    collapserEnter
        .style("opacity", function (d) { return d.id.includes("c_") ? 0 : 1 })
        .attr("transform", function (d) {
            return "translate(" + (d.x + d.width / 2) + "," + (d.y + config.COLLAPSER.RADIUS) + ")";

        });

    //collapserEnter.on("dblclick", showHideChildren);

    collapser.select("circle")
        .attr("r", config.COLLAPSER.RADIUS);

    collapser.transition()
        .delay(config.TRANSITION_DURATION)
        .duration(config.TRANSITION_DURATION)
        .attr("transform", function (d, i) {
            return "translate("
                + (config.COLLAPSER.RADIUS + i * 2 * (config.COLLAPSER.RADIUS + config.COLLAPSER.SPACING))
                + ","
                + (-config.COLLAPSER.RADIUS - config.OUTER_MARGIN)
                + ")";
        });

    collapser.on("mouseenter", function (g) {
        if (!isTransitioning) {
            showTooltip().select(".value")
                .text(function () {
                    var nomsCouples = '';
                    if (g.children.length) {
                        var nomC1 = g.children[0].name + ' ' + g.children[0].prenom;
                        var nomC2 = g.children[1].name + ' ' + g.children[1].prenom;
                        nomsCouples = nomC1 + '\n' + nomC2;
                    }
                    else {
                        nomsCouples = g.name + ' ' + g.prenom;
                    }
                    return nomsCouples + "\n(Double clic pour refermer)";
                });

            var highlightColor = highlightColorScale(g.type.replace(/ .*/, ""));

            node.filter(function (d) {
                return (d.arbre != '1' || d.arbre != '2')
            }).style("opacity", function (d) { return d.id.includes("c_") ? 0 : 1 });
            //                .select("rect")
            //                  .style("fill", "url(#mImg)");
        }
    });

    collapser.on("mouseleave", function (g) {
        if (!isTransitioning) {
            hideTooltip();
            addImage(collapser);
        }
    });

    collapser.exit().remove();

    link.on("click", function (g) {
        if (!isTransitioning) {
            //alert('on vient de cliquer !');
            var gSource = g.source;
            // On récupère tous les enfants : 
            var Noeuds = biHiSankey.nodes();
            var nodeD = Noeuds.find(function (a) { return a.id == gSource.id || 'c_' + a.id == gSource.id });
            var e1 = getEnfants(nodeD, Noeuds);
            for (var e of e1) {
                if (e.c_id != "null" && e.c_id != "" && e.c_id != null) {
                    // Si l'enfant a un conjoint, on cache le couple
                    var noeudCouple = Noeuds.find(function (a) { return a.id == 'c_' + e.id || a.id == 'c_' + e.c_id; });
                    hide(noeudCouple);
                    var conj = Noeuds.find(function (a) { return a.c_id == e.id; });
                    // Si le conjoint n'a pas d'ancetre, on le cache aussi :
                    if (conj.nbAncetre == 0) {
                        hide(conj);
                        // On cherche les enfants de l'enfant :
                        var e2 = getEnfants(e, Noeuds);
                        for (var e2e of e2) {
                            e1.push(e2e);
                        }
                    }
                    else {

                    }
                }
                else {
                    // On cherche les enfants de l'enfant sans conjoint :
                    var e2 = getEnfants(e, Noeuds);
                    for (var e2e of e2) {
                        e1.push(e2e);
                    }
                }
                hide(e);

            }
        }
    });
}
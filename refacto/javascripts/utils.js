/*
trouverNodes 
permet de récupérer tout ou une partie des noeuds depuis le serveur
::flagRecherche : 0 : tout récupérer, 1: ne récupérer que les id du tableau elementsRecherches
::elementsRecherches : tableau d'id 
::returnName : booleen permettant d'acceder à une liste des noms de familles du tableau
returnName permet de simuler l'ancienne fonction trouverNodesAll()
*/
function trouverNodes(flagRecherche, elementsRecherches, returnName = false) {
    var noeuds = [];
    var aNames = [];
    var sql_statement = "SELECT * FROM nodes";
    if (flagRecherche == 1) {
        // Dans ce cas, on ajoute une clause WHERE à la recherche
        sql_statement += " WHERE ";
        for (var el of elementsRecherches) {
            sql_statement += "own_id = '" + el.id + "' OR ";
        }
        sql_statement = sql_statement.substring(0, sql_statement.length - 4);
        //alert("flag-- " + sql_statement);
    }
    $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q=' + sql_statement, function (data_json) {
        if (data_json.rows.length == 0) {
            // Il n'y a personne dans la table
            alert("Il n'y a pas encore de personne dans cet arbre !");
        }
        else if (data_json.rows.length > 0) {
            // Pour chaque ligne, on vérifie
            for (var r of data_json.rows) {
                noeuds.push({ "id": r.own_id, "parent": null, "nom": r.nom, "prenom": r.prenom, "mere": r.mother_id, "pere": r.father_id, "genre": r.genre, "couple": r.couple_id, "job": r.profession, "date_birth": formatDate(r.date_naissance), "date_die": formatDate(r.date_deces), "date_mariage": formatDate(r.date_mariage), "geom": r.the_geom, "arbre": r.arbre });
                if (aNames.find(function (a) { return a == r.nom; })) { }
                else { aNames.push(r.nom); }
            }
        }
    });
    if (returnName) {
        return [noeuds, aNames]
    }
    else {
        return noeuds;
    }
}

function formatDate(date) {
    var dateFormatee = "";
    if (date == null || date == "null" || date == "") return "null";
    else {
        dateFormatee = date.substring(8, 10) + "-" + date.substring(5, 7) + "-" + date.substring(0, 4);
        return dateFormatee;
    }
}

function formatNumber(d) {
    var numberFormat = d3.format(",.0f"); // zero decimal places
    return " - " + numberFormat(d);
}

function formatFlow(d) {
    var flowFormat = d3.format(",.0f"); // zero decimal places with sign
    return flowFormat(Math.abs(d));
}


function getMonth(mm) {
    switch (mm) {
        case "01": return "Janvier";
        case "02": return "Fevrier";
        case "03": return "Mars";
        case "04": return "Avril";
        case "05": return "Mai";
        case "06": return "Juin";
        case "07": return "Juillet";
        case "08": return "Aout";
        case "09": return "Septembre";
        case "10": return "Octobre";
        case "11": return "Novembre";
        case "12": return "Decembre";
    }
}

function isParentCelib(bihiSankeyGraph, node) {
    var isInCouple = 0;
    var isParent = 0;
    bihiSankeyGraph.nodes().forEach(function (n) {
        if (n.c_id == node.source.id) {
            isInCouple += 1; // Si la personne est en couple avec le noeud, c'est mort
        }
        if (n.f_id == node.source.id || n.m_id == node.source.id) {
            isParent += 1;
        }
    });
    if (isInCouple == 0 && isParent > 0) { return true; }
    else { return false; }
}

function ascendingXPosition(a, b) {
    return a.x - b.x;
}

function ascendingYPosition(a, b) {
    return a.y - b.y;
}

function center(node) {
    return node.y + node.height / 5;
    // return 0;
}

function hideObject(obj) {
    $(obj).css('visibility', 'hidden');
    $(obj).css('display', 'none');
}

function showObject(obj) {
    $(obj).css('visibility', 'visible');
    $(obj).css('display', 'initial');
}

function disableUserInterractions(time) {
    isTransitioning = true;
    setTimeout(function () {
        isTransitioning = false;
    }, time);
}

function hideTooltip(tooltip) {
    tooltip.transition().style("opacity", 0).select(".cimg").attr("src", "");
    return tooltip.transition()
        .duration(TRANSITION_DURATION)
        .style("opacity", 0);
}

function showTooltip(tooltip) {
    return tooltip
        // .style("left", d3.event.layerX + "px")
        // .style("left", "0 px")
        // .style("top", d3.event.layerY + 15 + "px")
        // .style("float", "15 px")
        .transition()
        .duration(TRANSITION_DURATION)
        .style("opacity", 1);
};
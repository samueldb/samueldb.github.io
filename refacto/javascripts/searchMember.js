

// Barre de recherche de personne : 
function loadsearchBar(svg, biHiSankey) {
    $.getScript("utils.js", function () { console.log("Script utils loaded..."); });

    var globalNodes = trouverNodes(0, [], true);
    var noeudsExistants = globalNodes[0];
    var availableNames = globalNodes[1];
    $('#RecherchePersonne').append(
        '<fieldset style="border:solid 1px black;width:390px">' +
        '<legend>Recherche</legend>' +
        '<div id="recherche" style="margin:10px;">Nom de la personne : <input type="text" class="txt_ajt" name="txt_old_nom" id="txt_old_nom_auto" value="" autocomplete="on">' +
        '<FORM NAME="Choix_genre_search" style="display: initial;margin-left: 10px;">' +
        '<SELECT id="genres_search" NAME="genre" onchange="remplirFamille($(\'#txt_old_nom_auto\').val(), noeudsExistants)">' +
        '<option value="M">Homme</option><option value="F">Femme</option>' +
        '</SELECT>' +
        '</FORM>' +
        '<FORM NAME="Choix_old_prenom" style="display: initial;margin-left: 10px;">' +
        '<SELECT id="liste_old_prenom" NAME="liste_old_prenom" style="margin-top:20px;margin-left:120px;">' +
        '</SELECT>' +
        '</FORM>' +
        '<a id="focus_p" class="button_small" onclick="focusPersonne(svg, $(liste_old_prenom).val(), biHiSankey);";>Centrer</a>' +
        '<a id="reinit" class="button_small" style="display:none;" onclick="hideObject(reinit);showObject(focus_p);reinitialiser(svg, biHiSankey);";>Réinitialiser</a>' +
        '</div>' +
        '</fieldset>');

    $('#txt_old_nom_auto').autocomplete({
        source: availableNames,
        minChars: 2,
        select: function (event, ui) {
            var value = ui.item.value;
            remplirFamille(value, noeudsExistants);
        }
    });
}

function remplirFamille(nomFamille, noeudsExistants) {
    //showObject(liste_old_prenom);
    viderListe(liste_old_prenom);
    var select = document.getElementById("liste_old_prenom");
    var genre_sel = $(genres_search).val();
    var el = document.createElement("option");
    el.textContent = " ";
    el.value = " ";
    select.appendChild(el);
    for (var p of noeudsExistants.filter(function (a) { return a.nom == nomFamille && a.genre == genre_sel })) {
        var select = document.getElementById("liste_old_prenom");
        var el = document.createElement("option");
        el.textContent = p.prenom;
        el.value = p.id;
        select.appendChild(el);
    }
}

function viderListe(liste) {
    liste.options.length = 0;
}

/**
    Focus du graph sur une personne en particulier
*/
function focusPersonne(svg, value, biHiSankey) {
    console.log("on focus sur " + value);
    hideObject(focus_p);
    showObject(reinit);
    var personne = value;

    // On met en surbrillance la personne concernée
    var selNodes = svg.select("#nodes").selectAll(".node").data(biHiSankey.nodes());
    selNodes.filter(function (d) { return d.id != personne; }).style("opacity", function (d) { return d.id.includes("c_") ? 0 : 0.1 });
    selNodes.filter(function (d) { return d.id == personne; }).attr("selected", "true");
    var link = svg.select("#links").selectAll("path.link").data(biHiSankey.visibleLinks(), function (d) { return d.id; });
    link.style("opacity", 0);
    var node = biHiSankey.nodes().find(function (d) { return d.id == personne; });
    var centreX = biHiSankey.size()[0] / 2;
    var centreY = biHiSankey.size()[1] / 2;
    var dx = centreX - node.x;
    var dy = centreY - node.y;
    svg.attr("transform", "translate(" + dx + "," + dy + ")");
    selNodes.filter(function (d) { return d.id == personne; }).mouseover();
}

function reinitialiser(svg, biHiSankey) {
    var selNodes = svg.select("#nodes").selectAll(".node").data(biHiSankey.nodes().filter(function (a) { return a.id; }));
    selNodes.filter(function (d) { return d.selected != "true" && !d.id.includes("c_"); }).style("opacity", 1);
    var link = svg.select("#links").selectAll("path.link").data(biHiSankey.visibleLinks(), function (d) { return d.id; });
    link.style("opacity", 1);
}
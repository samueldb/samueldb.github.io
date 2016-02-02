import main.js;
var globalNodes = trouverNodesAll();
var noeudsExistants = globalNodes[0];
// Barre de recherche de personne : 
$(RecherchePersonne).append('<fieldset style="border:solid 1px black;width:420px"><legend>Recherche</legend><div id="recherche" style="margin:10px;">Nom de la personne : <input type="text" class="txt_ajt" name="txt_old_nom" id="txt_old_nom" value="" onblur="remplirFamille(value);"><FORM NAME="Choix_genre_search" style="display: initial;margin-left: 10px;"><SELECT id="genres_search" NAME="genre" onchange="remplirFamille($(txt_old_nom).val())"><option value="M">Homme</option><option value="F">Femme</option></SELECT></FORM><FORM NAME="Choix_old_prenom" style="display: initial;margin-left: 10px;"><SELECT id="liste_old_prenom" NAME="liste_old_prenom" style="margin-top:20px;margin-left:120px;"></SELECT></FORM><a id="focus_p" class="btn" onclick="focusPersonne($(liste_old_prenom).val());";>Centrer</a><a id="reinit" class="btn" style="display:none;" onclick="hideObject(reinit);showObject(focus_p);populateNode();";>Réinitialiser</a></div></fieldset>');

var availableNames = globalNodes[1];
//if (noeudsExistants.length > 0){
//    for (var n of noeudsExistants){
//        if (availableNames.find(function(a){return a == n.nom;})){}
//        else {availableNames.push(n.nom);}
//    }
//}
$( "#txt_old_nom" ).autocomplete({
  source: availableNames,
  minChars: 1,
  select: function (event, ui) {
        var value = ui.item.value;
        remplirFamille(value);
}
});

function trouverNodesAll(){
    var noeuds = [];
    var aNames = [];
    var sql_statement = "SELECT * FROM nodes";
    $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_statement, function(data_json) {
        if (data_json.rows.length == 0){
            // Il n'y a personne dans la table
            alert("Il n'y a pas encore de personne dans cet arbre !");
        }
        else if (data_json.rows.length > 0){
                // Pour chaque ligne, on vérifie
                for (var r of data_json.rows){
                    noeuds.push({"id":r.own_id,"parent":null,"nom":r.nom,"prenom":r.prenom,"mere":r.mother_id,"pere":r.father_id,"genre":r.genre,"couple":r.couple_id,"job":r.profession,"date_birth":formatDate(r.date_naissance),"date_die":formatDate(r.date_deces),"geom":r.the_geom});
                    if (aNames.find(function(a){return a == r.nom;})){}
                    else {aNames.push(r.nom);}
                }
        }
    });
    return [noeuds,aNames];
}
    
function remplirFamille(nomFamille){
    //showObject(liste_old_prenom);
    viderListe(liste_old_prenom);
    var select = document.getElementById("liste_old_prenom"); 
    var genre_sel = $(genres_search).val(); 
    var el = document.createElement("option");
    el.textContent = " ";
    el.value = " ";
    select.appendChild(el);
    for (var p of noeudsExistants.filter(function (a){return a.nom == nomFamille && a.genre == genre_sel})){
        var select = document.getElementById("liste_old_prenom"); 
        var el = document.createElement("option");
        el.textContent = p.prenom;
        el.value = p.id;
        select.appendChild(el);
    }
}

function hideObject(obj){
    $(obj).css('visibility','hidden');
    $(obj).css('display','none');
}

function showObject(obj){
    $(obj).css('visibility','visible');
    $(obj).css('display','initial');
}

function viderListe(liste){
    liste.options.length=0;
}

function formatDate(date){
    var dateFormatee = "";
    if (date == null ||date == "null" || date == "") return "null";
    else {dateFormatee = date.substring(8,10) + " " + getMonth(date.substring(5,7)) + " " + date.substring(0,4);
    return dateFormatee;
    }
}

function getMonth(mm){
    switch(mm)
    {
        case "01":return "Janvier";
        case "02":return "Fevrier";
        case "03":return "Mars";
        case "04":return "Avril";
        case "05":return "Mai";
        case "06":return "Juin";
        case "07":return "Juillet";
        case "08":return "Aout";
        case "09":return "Septembre";
        case "10":return "Octobre";
        case "11":return "Novembre";
        case "12":return "Decembre";
    }
}

function focusPersonne(value){
    hideObject(focus_p);
    showObject(reinit);
    var personne = value;
    //1. On récupère tous les noeuds du graph :
    var Noeuds =biHiSankey.nodes();
    //var Liens = biHiSankey.links();
    var noeudFocus = Noeuds.find(function(a){return a.id == personne;});
    var allParents = [];
    // On remonte tous les parents du focus : 
    //1ère génération : 
    var p1 = getParents(noeudFocus,Noeuds);
    for (p of p1){
        allParents.push(p);
    }
    var thereisStillParents = true;
    // Autres générations :
    while (thereisStillParents){
        // Pour tous les parents déjà dans le tableau, on récupère leurs propres parents :
        var tabPparents = [];
        for (p of allParents){
            var px = getParents(p,Noeuds);
            for (p of px){
                // On check si le parent est déjà dans le tableau : 
                var isInTabA = allParents.filter(function(a){return a.id == p.id;});
                if (typeof(isInTabA != 'undefined')){
                    if (isInTabA.length > 0){}
                    else {tabPparents.push(p);}
                }
            }
        }
        if (tabPparents.length == 0){thereisStillParents = false;}
        else {
            // Pour tous les parents trouvés, on n'ajoute que les nouveaux et leurs conjoints
            for (p of tabPparents){
                var isInTab = allParents.filter(function(a){return a.id == p.id;});
                if (typeof(isInTab != 'undefined')){
                    if (isInTab.length > 0){
                        // ça veut dire que le parent est déjà dans le tableau
                    }
                    else {
                        allParents.push(p);
                        //if (p.c_id != "null" && p.c_id != "" && p.c_id != null){
                        //    // Si le parent a un conjoint, on l'ajoute également
                        //    var conj = Noeuds.find(function(a){return a.c_id == p.id;});
                        //    allParents.push(conj);
                        //}
                    }
                }
            }
        }
    }
    // Reste à ajouter la personne même et son possible conjoint
    allParents.push(noeudFocus);
    if (noeudFocus.c_id != "null" && noeudFocus.c_id != "" && noeudFocus.c_id != null){
        // Si la pers a un conjoint, on l'ajoute également
        var conj = Noeuds.find(function(a){return a.c_id == noeudFocus.id;});
        allParents.push(conj);
    }
    // A ce niveau, allParents contient tous les ancètres du focus. 
    // Maintenant, on cherche tous les enfants de cet ancètre commun
    
    // On descend tous les enfants du plus grand ancetre : 
    var plusGrandAncetre = allParents.sort(ascendingXPosition)[0];
    var allEnfants = [];
    //1ère génération : 
    var e1 = getEnfants(plusGrandAncetre,Noeuds);
    for (e of e1){
        allEnfants.push(e);
        if (e.c_id != "null" && e.c_id != "" && e.c_id != null){
            // Si l'enfant a un conjoint, on l'ajoute également - uniquement dans le sens descendant donc
            var conj = Noeuds.find(function(a){return a.c_id == e.id;});
            allEnfants.push(conj);
        }
    }
    var thereisStillEnfants = true;
    // Autres générations :
    while (thereisStillEnfants){
        // Pour tous les enfants déjà dans le tableau, on récupère leurs propres enfants :
        var tabPenfants = [];
        for (e of allEnfants){
            var ex = getEnfants(e,Noeuds);
            for (e of ex){
                // On check si l'enfant est déjà dans le tableau : 
                var isInTabA = allEnfants.filter(function(a){return a.id == e.id;});
                if (typeof(isInTabA != 'undefined')){
                    if (isInTabA.length > 0){}
                    else {tabPenfants.push(e);}
                }
            }
        }
        if (tabPenfants.length == 0){thereisStillEnfants = false;}
        else {
            // Pour tous les enfants trouvés, on n'ajoute que les nouveaux et leur conjoint
            for (e of tabPenfants){
                var isInTab = allEnfants.filter(function(a){return a.id == e.id;});
                if (typeof(isInTab != 'undefined')){
                    if (isInTab.length > 0){
                        // ça veut dire que l'enfant est déjà dans le tableau
                    }
                    else {
                        allEnfants.push(e);
                        if (e.c_id != "null" && e.c_id != "" && e.c_id != null){
                            // Si l'enfant a un conjoint, on l'ajoute également - uniquement dans le sens descendant donc
                            var conj = Noeuds.find(function(a){return a.c_id == e.id;});
                            allEnfants.push(conj);
                        }
                    }
                }
            }
        }
    }
    // On combine les 2 tableaux :
    for (var e of allEnfants){
        var isInTab = allParents.filter(function(a){return a.id == e.id;});
        if (typeof(isInTab != 'undefined')){
            if (isInTab.length > 0){
                // ça veut dire que l'enfant est déjà dans le tableau global
            }
            else {
                allParents.push(e);
            }
        }
    }
    if (noeudFocus.c_id != "null" && noeudFocus.c_id != "" && noeudFocus.c_id != null){
        // Si la pers a un conjoint, on l'ajoute également
        var conj = Noeuds.find(function(a){return a.c_id == noeudFocus.id;});
        allParents.push(conj);
    }
    // Fin récup
    populateNode(1,allParents);
    
    // On met en surbrillance la personne concernée
    svg.select("#nodes").selectAll(".node").data(biHiSankey.nodes().filter(function(a){return a.id == noeudFocus.id;}))
        .attr("style", "fill: \"#3366FF\"; outline: 2px solid red;font-weight: 900;outline-offset: 2px;");
    
        
}

function getParents(val,Noeuds){
    try{
        var parents = Noeuds.filter(function(a){
            return a.id == val.f_id || a.id == val.m_id;
            });
            return parents;
        }
    catch(Err){
        console.log('erreur lors de la récupération des parents (normale)');
    }
}    
function getEnfants(val,Noeuds){
    try{
        var enfants = Noeuds.filter(function(a){
            return a.f_id == val.id || a.m_id == val.id;
            });
            return enfants;
        }
    catch(Err){
        console.log('erreur lors de la récupération des enfants (normale)');
    }
}
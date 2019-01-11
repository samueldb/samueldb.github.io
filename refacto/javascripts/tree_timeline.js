function init(){
    $.getScript("utils.js", function() {console.log("Script utils loaded...");});
    $.getScript("timeline.js", function() {console.log("Script timeline loaded...");});
    populateNode()
}

function populateNode(flagRecherche,elementsRecherches){
    var nodes, links, liste_couple;
    nodes = [];
    links = [];
    var sql_statement = "SELECT * FROM nodes WHERE arbre = '1' OR arbre = '2'";
    if (flagRecherche == 1 && elementsRecherches.length > 0){
        // Dans ce cas, on ajoute une clause WHERE à la recherche
        sql_statement += " AND WHERE ";
        for (var el of elementsRecherches){
            sql_statement += "own_id = '" + el.id + "' OR ";
        }
        sql_statement = sql_statement.substring(0,sql_statement.length - 4);
        //alert("flag-- " + sql_statement);
    }
    var NoeudsBase = [];
    if (flagRecherche == 1 && elementsRecherches.length > 0){
        NoeudsBase = trouverNodes(flagRecherche,elementsRecherches);}
    else {
        NoeudsBase = trouverNodes(0,[]);
    }
    $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_statement, function(data_json) {
        if (data_json.rows.length == 0){
            // Il n'y a personne dans la table
            document.getElementById('titre').innerHTML = "Il n'y a pas encore de personne dans cet arbre !";
            hideObject(table_carnet);
        }
        else if (data_json.rows.length > 0){
                // Pour chaque ligne, on l'ajoute au tableau des noeuds. 
                // Et on formatte le tableau pour qu'il soit exploitable par D3
                
                for (var r of data_json.rows){
                    // On remplit les personnes
                    //nodes.push({"type":r.genre,"id":r.own_id,"parent":null,"name":r.nom,"prenom":r.prenom,"f_id":r.father_id,"m_id":r.mother_id,"c_id":r.couple_id,"dBirth":r.date_naissance,"dDie":r.date_deces,"dMar":r.date_mariage,"job":r.profession,"comm":r.commentaire,"arbre":r.arbre,"adr_photo":r.adr_photo});
                    if (r.date_naissance !=null && r.date_naissance != "null" && typeof(r.date_naissance) != 'undefined' ){
                        var datedeces = formatDate(r.date_deces);
                        if ((r.date_deces == null || r.date_deces == 'null') && r.date_naissance.substring(0,4) > 1920){
                            datedeces = "";
                        }
                        nodes.push({"start":formatDate(r.date_naissance),"end":datedeces,"label":r.prenom + ' ' + r.nom});
                    }
                }
        }
        
        // Fin du traitement des données, création du graph :
         timeline("#timeline")
                .data(nodes)
                .band("mainBand", 0.82)
                .band("naviBand", 0.08)
                //.xAxis("mainBand")
                .tooltips("mainBand")
                .xAxis("naviBand")
                //.labels("mainBand")
                .labels("naviBand")
                .brush("naviBand", ["mainBand"])
                .redraw();

        });
        
}

function trouverNodes(flagRecherche,elementsRecherches){
    var noeuds = [];
    var sql_statement = "SELECT * FROM nodes";
    if (flagRecherche == 1){
        // Dans ce cas, on ajoute une clause WHERE à la recherche
        sql_statement += " WHERE ";
        for (var el of elementsRecherches){
            sql_statement += "own_id = '" + el.id + "' OR ";
        }
        sql_statement = sql_statement.substring(0,sql_statement.length - 4);
        //alert("flag-- " + sql_statement);
    }
    $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_statement, function(data_json) {
        if (data_json.rows.length == 0){
            // Il n'y a personne dans la table
            alert("Il n'y a pas encore de personne dans cet arbre !");
        }
        else if (data_json.rows.length > 0){
                // Pour chaque ligne, on vérifie
                for (var r of data_json.rows){
                    noeuds.push({"id":r.own_id,"parent":null,"nom":r.nom,"prenom":r.prenom,"mere":r.mother_id,"pere":r.father_id,"genre":r.genre});
                }
        }
    });
    return noeuds;
}


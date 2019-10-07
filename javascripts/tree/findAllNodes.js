function findAllNodes() {
    var noeuds = [];
    var aNames = [];
    var sql_statement = "SELECT * FROM nodes WHERE arbre = '1' OR arbre = '2'";
    $.ajaxSetup({
        async: false
    });
    $.ajax({
        url: 'https://samueldeschampsberger.cartodb.com/api/v2/sql/?q=' + sql_statement,
        dataType: 'json',
        async: false,
        success: function (data_json) {
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
        }
    });
    console.log("got all nodes i need")
    return [noeuds, aNames];
}

function populateNode() {
    var res = new Object();
    var sql_statement = "SELECT * FROM nodes WHERE arbre = '1' OR arbre = '2'";
    var NoeudsBase = [];
    NoeudsBase = findAllNodes()[0];
    $.ajaxSetup({
        async: false
    });
    $.ajax({
        url: 'https://samueldeschampsberger.cartodb.com/api/v2/sql/?q=' + sql_statement,
        dataType: 'json',
        async: false,
        success: function (data_json) {
            console.log("now finishing getJSON call")
            if (data_json.rows.length == 0) {
                // Il n'y a personne dans la table
                document.getElementById('titre').innerHTML = "Il n'y a pas encore de personne dans cet arbre !";
                hideObject(table_carnet);
            }
            else if (data_json.rows.length > 0) {
                // Pour chaque ligne, on l'ajoute au tableau des noeuds. 
                // Et on formatte le tableau pour qu'il soit exploitable par D3
                var nodes, links, liste_couple;
                nodes = [];
                links = [];
                liste_couple = [];
                for (var r of data_json.rows) {
                    // On remplit les personnes
                    nodes.push({ "type": r.genre, "id": r.own_id, "parent": null, "name": r.nom, "prenom": r.prenom, "f_id": r.father_id, "m_id": r.mother_id, "c_id": r.couple_id, "dBirth": r.date_naissance, "dDie": r.date_deces, "dMar": r.date_mariage, "job": r.profession, "comm": r.commentaire, "arbre": r.arbre, "adr_photo": r.adr_photo, "x": r.x, "y": r.y });
                    // Si 1 des 2 parents est en couple, on ajoute un noeud
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
                                nodes.push({ "type": "couple", "id": "c_" + r.couple_id, "parent": null, "name": homme.nom, "prenom": homme.prenom, "id_homme": r.own_id, "id_femme": r.couple_id, "dMar": r.date_mariage, "arbre": r.arbre });
                                liste_couple.push({ "id_c": r.couple_id, "id_homme": r.own_id });
                                links.push({ "source": homme.id, "target": "c_" + r.couple_id, "value": 1 });
                                links.push({ "source": r.couple_id, "target": "c_" + r.couple_id, "value": 1 });
                            }
                        }
                    }
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
                }
                // Une fois les nodes remplis, on ajoute "parent" des noeuds des personnes en couple : 
                for (var p of nodes) {
                    for (var lc of liste_couple) {
                        if (p.id == lc.id_c || p.id == lc.id_homme) {
                            p.parent = "c_" + lc.id_c;
                        }
                    }
                }

            }
            res['nodes'] = nodes;
            res['links'] = links;
        }
    });
    return res;
}

function update() {
    var link, linkEnter, node, nodeEnter, collapser, collapserEnter;

    // function containChildren(node) {
    //     node.children.forEach(function (child) {
    //         child.state = "contained";
    //         child.parent = this;
    //         child._parent = null;
    //         containChildren(child);
    //     }, node);
    // }

    dealWithLinks();
    dealWithNodes();

}
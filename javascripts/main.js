var map;
    var apikey = "261bbc94c8266573016ba9454127b905b931b0a6";
    var user = 'samuel';
    var noeudsExistants;
    //
    //      Attention : pb lors de la mise en base d'une date non renseignée
    //
    function init() {
        var testMap;
        var editor;
        
             $.datepicker.regional['fr'] = {clearText: 'Effacer', clearStatus: '',
                closeText: 'Fermer', closeStatus: 'Fermer sans modifier',
                prevText: '<Préc', prevStatus: 'Voir le mois précédent',
                nextText: 'Suiv>', nextStatus: 'Voir le mois suivant',
                currentText: 'Courant', currentStatus: 'Voir le mois courant',
                monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
                'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
                monthNamesShort: ['Jan','Fév','Mar','Avr','Mai','Jun',
                'Jul','Aoû','Sep','Oct','Nov','Déc'],
                monthStatus: 'Voir un autre mois', yearStatus: 'Voir un autre année',
                weekHeader: 'Sm', weekStatus: '',
                dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
                dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
                dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
                dayStatus: 'Utiliser DD comme premier jour de la semaine', dateStatus: 'Choisir le DD, MM d',
                dateFormat: 'dd/mm/yy', firstDay: 1, 
                initStatus: 'Choisir la date', isRTL: false};
             $.datepicker.setDefaults($.datepicker.regional['fr']);
        noeudsExistants = trouverNodes()[0];
        var create_pers = document.getElementById('create_p');
        create_pers.addEventListener('click', function(e) {
            $(remplissage).append('<div id=\'remplissage_new_personne\'>');
                nouvellePersonne("sam");
            });
            
        var modify_pers = document.getElementById('modify_p');
        modify_pers.addEventListener('click', function(e) {
            $(remplissage).append('<div id=\'remplissage_old_personne\'>');
                ModifierPersonne("sam");
            });
        
           // Wix.currentMember(function(member){
           //     res = member.id;
           //     localStorage.setItem("user", res);
           //     
           //     $(remplissage).append('<div id=\'remplissage_new_personne\'>');
           //     nouvellePersonne(res);
           //     
           //     });
          
    }
     
    function hideObject(obj){
        $(obj).css('visibility','hidden');
        $(obj).css('display','none');
    }

    function showObject(obj){
        $(obj).css('visibility','visible');
        $(obj).css('display','initial');
    }
     
    function nouvellePersonne(user){
        $('#remplissage_new_personne').length > 0 ? $(remplissage_new_personne).remove():true;
        $('#remplissage_old_personne').length > 0 ? $(remplissage_old_personne).remove():true;
        $('#btn_create_pers').length > 0 ? $(btn_create_pers).remove():true;
        $('#btn_maj_pers').length > 0 ? $(btn_maj_pers).remove():true;
        $('#mod_pbis').length > 0 ? $(mod_pbis).remove():true;
        $('#recherche').length > 0 ? $(recherche).remove():true;
        $('#create_pbis').length > 0 ? $(create_pbis).remove():true;
        $('#cocher').length > 0 ? $(chkbAdr).remove():true;
        showObject(remplissage);
        noeudsExistants = trouverNodes()[0];
        //$(remplissage).prepend('<div id=\'remplissage_new_personne\'>');
        if (document.getElementById('remplissage_new_personne') == null){
            $(remplissage).append('<div id=\'remplissage_new_personne\'>');
        }
        $(remplissage_new_personne).empty();
        $(remplissage_new_personne).append('<fieldset style="border:solid 1px black;width:420px"><legend>Etat civil</legend><p><input type="text" class="txt_ajt" name="txt_new_nom" id="id_txt_new_nom" value="NOM" onblur="searchPeres(value);searchMeres(value);searchEnfants(value);searchCouple(value);"><input type="text" class="txt_ajt" name="txt_new_prenom" id="id_txt_new_prenom" value="Prénom"> <FORM NAME="Choix_genre" style="display: initial;margin-left: 10px;"><SELECT id="genres" NAME="genre"><option value="M">Homme</option><option value="F">Femme</option></SELECT></FORM></p></fieldset>');
        $(remplissage_new_personne).append('</p>');
        $(remplissage_new_personne).append('<fieldset style="border:solid 1px black;width:420px"><legend>Adresse</legend><div id="nouv_adr" style="background-color:aliceblue;width:420px"><p style="margin-left:40px;"><input type="text" class="txt_ajt" name="txt_new_adr" id="id_txt_new_adr" value="adresse"></p>'+
                                            '<p style="margin-left:40px;"><input type="text" class="txt_ajt" name="txt_new_cp" id="id_txt_new_cp" value="code postal"><input type="text" class="txt_ajt" name="txt_new_ville" id="id_txt_new_ville" value="ville"></p>'+
                                            '<p style="margin-left:40px;"><input type="text" class="txt_ajt" name="txt_new_pays" id="id_txt_new_pays" value="pays"></p></div></fieldset>');
        
        $(remplissage_new_personne).append('</p><fieldset style="border:solid 1px black;width:420px"><legend>Liens familiaux</legend><div id="nouv_lien" style="margin-left: 40px;">Prénom du père : <FORM NAME="Choix_père" style="display: initial;margin-left: 10px;"><SELECT id="liste_pères" NAME="liste_pères" style="display:none;"></SELECT></FORM></p>'+
                                            'Prénom de la mère : <FORM NAME="Choix_mère" style="display: initial;margin-left: 10px;"><SELECT id="liste_mères" NAME="liste_mères" style="display:none;"></SELECT></FORM></p>'+
                                            'Prénom d\'un enfant : <FORM NAME="Choix_enfant" style="display: initial;margin-left: 10px;"><SELECT id="liste_enfants" NAME="liste_enfants" style="display:none;"></SELECT></FORM></p>'+
                                            'En couple ? : <FORM NAME="Choix_couple" style="display: initial;margin-left: 10px;"><SELECT id="liste_couple" NAME="liste_couple" style="display:none;"></SELECT></FORM></p></div></fieldset></p>');
        
        $(remplissage_new_personne).append('</p><fieldset style="border:solid 1px black;width:420px"><legend>Info diverses</legend><p style="margin-left:40px;">profession : <input type="text" class="txt_ajt" name="txt_new_job" id="id_txt_new_job" value=""></p>'+
                                            '<p style="margin-left:40px;">Date de naissance : <input type="text" id="datepicker_new_dn" style="width:100px;margin-left:20px;"></p>'+
                                            '<p style="margin-left:40px;">Date de décès : <input type="text" id="datepicker_new_dd" style="width:100px;margin-left:20px;"></p></fieldset>');
        $( "#datepicker_new_dn" ).datepicker();
        $( "#datepicker_new_dd" ).datepicker();
        //$(remplissage_new_personne).append('</p><fieldset style="border:solid 1px black;width:420px"><legend>Photo</legend>Ajouter une photo : <form id="my_form" method="post" enctype="multipart/form-data">'+
        //                                                                                                                                        '<input type="file" id="input_img" accept="image/*">'+
        //                                                                                                                                        '<button type="submit" onclick="javascript:add_Pict()">Ajouter</button>'+
        //                                                                                                                                        '</form></fieldset>');       
        $(remplissage_new_personne).append('</p><fieldset style="border:solid 1px black;width:420px"><legend>Photo</legend>Ajouter une photo : <form id="form_add_pictures" method="POST">'+
                                                                                                                                                '<input name="file" type="file" id="file" accept="image/*">'+
                                                                                                                                                '<button type="submit">Ajouter</button>'+
                                                                                                                                                '</form></fieldset>');                                                                                                                                 
       //$.getScript("dist.js", function(){});
       
        
        $(remplissage_new_personne).append('<script src="javascripts/dist.js" defer async></script>');
        //$(remplissage_new_personne).append('<a style="margin-left: 200px;" id="btn_create_pict" class="btn" style="width:100px;height:10px;" onclick="javascript:add_pict();">importer la photo</a>');
        $(remplissage_new_personne).append('<a style="margin-left: 200px;margin-top:2px;" id="create_carnet" class="button" onclick="javascript:add_Personne(\''+user+'\');">Valider les informations</a>');
        $(remplissage).append("</div></div>");
        
    }

    function ModifierPersonne(user){
        showObject(remplissage);
        $('#remplissage_new_personne').length > 0 ? $(remplissage_new_personne).remove():true;
        $('#remplissage_old_personne').length ? $(remplissage_old_personne).remove():true;
        $('#btn_create_pers').length > 0 ? $(btn_create_pers).remove():true;
        $('#btn_maj_pers').length > 0 ? $(btn_maj_pers).remove():true;
        $('#mod_pbis').length > 0 ? $(mod_pbis).remove():true;
        $('#recherche').length > 0 ? $(recherche).remove():true;
        $('#create_pbis').length > 0 ? $(create_pbis).remove():true;
        $('#cocher').length > 0 ? $(cocher).remove():true;
        $('#fsA').length > 0 ? $(fsA).remove():true;
        $('#fsR').length > 0 ? $(fsR).remove():true;
        $('#fsI').length > 0 ? $(fsI).remove():true;
        var aNames = trouverNodes()[1];
        if (document.getElementById('remplissage_old_personne') == null){
            $(remplissage).append('<div id=\'remplissage_old_personne\'>');
        }
        $(remplissage_old_personne).append('<fieldset style="border:solid 1px black;width:420px"><legend>Recherche</legend><div id="recherche" style="margin:10px;">Nom de la personne : <input type="text" class="txt_ajt" name="txt_old_nom" id="txt_old_nom" value="" onblur="remplirFamille(value);"><FORM NAME="Choix_genre_search" style="display: initial;margin-left: 10px;"><SELECT id="genres_search" NAME="genre" onchange="remplirFamille($(txt_old_nom).val())"><option value="M">Homme</option><option value="F">Femme</option></SELECT></FORM><FORM NAME="Choix_old_prenom" style="display: initial;margin-left: 10px;"><SELECT id="liste_old_prenom" NAME="liste_old_prenom" style="display:none;margin-top:20px;margin-left:120px;" onchange="visualiserPersonne(value)"></SELECT></FORM></div></fieldset>');
        $(remplissage_old_personne).append('</p>');
        
        $( "#txt_old_nom" ).autocomplete({
          source: aNames,
          minChars: 1,
          select: function (event, ui) {
                var value = ui.item.value;
                remplirFamille(value);
        }
        });
    }

    function add_Personne(user){
        var nom = checkValiditeInsert($(id_txt_new_nom).val(),'string');
        var prenom = checkValiditeInsert($(id_txt_new_prenom).val(),'string');
        var genre = checkValiditeInsert($(genres).val(),'string');
        var adr = $(id_txt_new_adr).val();
        var cp = checkValiditeInsert($(id_txt_new_cp).val(),'cp');
        var ville = $(id_txt_new_ville).val();
        var pays = checkValiditeInsert($(id_txt_new_pays).val(),'string');
        var pere = checkValiditeInsert($(liste_pères).val(),'id');
        var mere = checkValiditeInsert($(liste_mères).val(),'id');
        var enfant = checkValiditeInsert($(liste_enfants).val(),'id');
        var couple = checkValiditeInsert($(liste_couple).val(),'id');
        var job = checkValiditeInsert($(id_txt_new_job).val(),'string');
        var date_n = checkValiditeInsert($(datepicker_new_dn).val(),'date');
        var date_d = checkValiditeInsert($(datepicker_new_dd).val(),'date');
        
        var new_geom = "";
        new_geom = geocoder(adr,cp,ville);
        var new_id = trouverNodes().length + 1;
        if (new_geom != undefined && new_geom != ""){
            var sql_insert = "INSERT INTO nodes (own_id,nom,prenom,genre,father_id,mother_id,couple_id,profession,date_naissance,date_deces,the_geom) VALUES ('"+new_id+"','"+nom+"','"+prenom+"','"+genre+"','"+pere+"','"+mere+"','"+couple+"','"+job+"',to_timestamp('"+date_n+"', 'DD/MM/YYYY'),to_timestamp('"+date_d+"', 'DD/MM/YYYY'),"+new_geom+")&api_key="+apikey+"";
            $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_insert, function(res) {
                document.getElementById('remplissage').innerHTML = "<h4>Personne bien ajoutée à l'arbre !</h4>";
                $(remplissage).append('<a id="create_pbis" class="button" onclick="javascript:nouvellePersonne(\''+user+'\');">Créer une autre personne ?</a>');
            });
        }
        else {
            alert('erreur lors de l\'insert en base');
        }
        // Gestion des enfants : 
        //
        if (enfant != null && enfant != " " && enfant != "null"){
            // On update l'enfant avec l'id du parent :
            var sql_update; 
            if (genre === "M"){
                sql_update = "UPDATE nodes SET father_id = "+new_id+" WHERE own_id = '"+enfant+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                document.getElementById('remplissage').innerHTML = "<h4>Personne bien ajoutée à l'arbre !</h4>";
                $(remplissage).append('<a id="create_pbis" class="button" onclick="javascript:nouvellePersonne(\''+user+'\');">Créer une autre personne ?</a>');
            });
            }
            if (genre === "F"){
                sql_update = "UPDATE nodes SET mother_id = "+new_id+" WHERE own_id = '"+enfant+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                document.getElementById('remplissage').innerHTML = "<h4>Personne bien ajoutée à l'arbre !</h4>";
                $(remplissage).append('<a id="create_pbis" class="button" onclick="javascript:nouvellePersonne(\''+user+'\');">Créer une autre personne ?</a>');
            });
            }
        }
        // Gestion des couples : 
        //
        if (couple != null && couple != " " && couple != "null"){
            var sql_update; 
            sql_update = "UPDATE nodes SET couple_id = "+new_id+" WHERE own_id = '"+couple+"';&api_key="+apikey+"";
            $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                document.getElementById('remplissage').innerHTML = "<h4>Personne bien ajoutée à l'arbre !</h4>";
                $(remplissage).append('<a id="create_pbis" class="button" onclick="javascript:nouvellePersonne(\''+user+'\');">Créer une autre personne ?</a>');
            });
        }
    }

    function checkValiditeInsert(insert,type){
        var res = insert;
        if (type=='string'){
            if (insert.indexOf("'")>0){
                res=insert.replace("'","''");
            }
            if (insert.indexOf("&")>0){
                res=insert.replace("&","%26");
            }
        }
        if (type=='id'){
            if (insert === " "){
                res = "null";
            }
        }
        if (type=='date'){
            if (insert === " "){
                res = "null";
            }
        }
        return res;
    }

    function geocoder(adr,cp,ville) {
        var res = "";
        getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q='+adr+' '+cp+' '+ville).success(function(data){
            // s'il n'y a pas de data, 
            if (data.length > 0){
                if (data[0].lon != undefined && data[0].lat != undefined){
                    res = 'ST_SetSRID(ST_Point('+data[0].lon+', '+data[0].lat+'),4326)';
                }
                else if (data.responseJSON[0].lat != undefined && data.responseJSON[0].lon != undefined){
                    res = 'ST_SetSRID(ST_Point('+data.responseJSON[0].lon+', '+data.responseJSON[0].lat+'),4326)';
                }
            }
        });
        if (res == ""){
            // On essaie sans le numéro de l'adresse
            adr2 = adr;
            while (adr2.match(/\d/) != null){
                adr2 = adr2.replace(/(\d)/,"");
            }
            getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q='+adr2+' '+cp+' '+ville).success(function(dataAdr){
                if (dataAdr.length > 0){
                    if (dataAdr[0].lon != undefined && dataAdr[0].lat != undefined){
                        res = 'ST_SetSRID(ST_Point('+dataAdr[0].lon+', '+dataAdr[0].lat+'),4326)';
                    }
                    else if (dataAdr.responseJSON[0].lat != undefined && dataAdr.responseJSON[0].lon != undefined){
                        res = 'ST_SetSRID(ST_Point('+dataAdr.responseJSON[0].lon+', '+dataAdr.responseJSON[0].lat+'),4326)';
                    }
                }
            });
        }
        if (res == ""){
            getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q='+ville).success(function(dataVille){
                if (dataVille.length > 0){
                    alert('l\'adresse n\'a pu être géocodée, seule la ville sera ajoutée');
                    res = 'ST_SetSRID(ST_Point('+dataVille[0].lon+', '+dataVille[0].lat+'),4326)';
                }
            });
        }
        return res;
    }
        
    function getJSON(req){
        $.ajaxSetup( { "async": false } );
        return $.getJSON(req);
    }

    function trouverNodes(){
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

    function searchPeres(nomFamille){
       showObject(liste_pères);
       viderListe(liste_pères);
       // On ajoute un prénom vide si la personne n'existe pas
        var select = document.getElementById("liste_pères"); 
        var el = document.createElement("option");
        el.textContent = " ";
        el.value = "null";
        select.appendChild(el);
       noeudsMasc = noeudsExistants.filter(function (a){return a.genre == "M"});
        for (var p of noeudsMasc.filter(function (a){return a.nom == nomFamille})){
            var select = document.getElementById("liste_pères"); 
            var el = document.createElement("option");
            el.textContent = p.prenom;
            el.value = p.id;
            select.appendChild(el);
        }
    }
    function searchMeres(nomFamille){
        showObject(liste_mères);
        viderListe(liste_mères);
        var select = document.getElementById("liste_mères"); 
        var el = document.createElement("option");
        el.textContent = " ";
        el.value = " ";
        select.appendChild(el);
       noeudsFem = noeudsExistants.filter(function (a){return a.genre == "F"});
        for (var p of noeudsFem.filter(function (a){return a.nom == nomFamille})){
            var select = document.getElementById("liste_mères"); 
            var el = document.createElement("option");
            el.textContent = p.prenom;
            el.value = p.id;
            select.appendChild(el);
        }
    }
    function searchEnfants(nomFamille){
        showObject(liste_enfants);
        viderListe(liste_enfants);
        var select = document.getElementById("liste_enfants"); 
        var el = document.createElement("option");
        el.textContent = " ";
        el.value = " ";
        select.appendChild(el);
        for (var p of noeudsExistants.filter(function (a){return a.nom == nomFamille})){
            var select = document.getElementById("liste_enfants"); 
            var el = document.createElement("option");
            el.textContent = p.prenom;
            el.value = p.id;
            select.appendChild(el);
        }
    }
    function searchCouple(nomFamille){
        showObject(liste_couple);
        viderListe(liste_couple);
        var select = document.getElementById("liste_couple"); 
        var el = document.createElement("option");
        el.textContent = " ";
        el.value = " ";
        select.appendChild(el);
        for (var p of noeudsExistants.filter(function (a){return a.couple == null})){
            var select = document.getElementById("liste_couple"); 
            var el = document.createElement("option");
            el.textContent = p.prenom;
            el.value = p.id;
            select.appendChild(el);
        }
    }
    function remplirFamille(nomFamille){
        showObject(liste_old_prenom);
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

    function viderListe(liste){
        liste.options.length=0
    }

    function visualiserPersonne(personne){
    //    $('#remplissage_old_personne').length > 0 ? $(chkbAdr).remove():true;
        $('#id_changt_adr').length > 0 ? $(id_changt_adr).empty():true;
        $('#id_changt_relation').length > 0 ? $(id_changt_relation).empty():true;
        $('#btn_create_pers').length > 0 ? $(btn_create_pers).remove():true;
        $('#btn_maj_pers').length > 0 ? $(btn_maj_pers).remove():true;
        $('#id_changt_info').length > 0 ? $(id_changt_info).empty():true;
        $('#chkbAdr').length > 0 ? $(chkbAdr).empty():true;
        $('#cocher').length > 0 ? $(cocher).remove():true;
        $('#fsA').length > 0 ? $(fsA).remove():true;
        $('#fsR').length > 0 ? $(fsR).remove():true;
        $('#fsI').length > 0 ? $(fsI).remove():true;
        var pers = noeudsExistants.find(function (a){return a.id == personne});
        //alert(pers.prenom);
        $(remplissage_old_personne).append('</p><p id="cocher">Cocher les cases à modifier : </p>' + 
                                            '<fieldset id="fsA" style="border:solid 1px black;width:420px"><legend>Adresse</legend><div id="chkbAdr"><input type="checkbox" name="checkbox" id="chkbox_chgt_adr" onclick="javascript:changeAdresse(value);">  Adresse</div>'+
                                            '<div id="id_changt_adr"><p style="margin-left:40px;"><input type="text" class="txt_ajt" style="display: none;" name="txt__adr" id="id_txt__adr" value="adresse"></p>'+
                                            '<p style="margin-left:40px;"><input type="text" class="txt_ajt" style="display: none;" name="txt__cp" id="id_txt__cp" value="code postal"><input type="text" style="display: none;" class="txt_ajt" name="txt__ville" id="id_txt__ville" value="ville"></p>'+
                                            '<p style="margin-left:40px;"><input type="text" class="txt_ajt" style="display: none;" name="txt__pays" id="id_txt__pays" value="pays"></p></div></fieldset></p>');
        
        var pere = noeudsExistants.find(function (a){return a.id == pers.pere});
        var mere = noeudsExistants.find(function (a){return a.id == pers.mere});
        var couple = noeudsExistants.find(function (a){return a.id == pers.couple});
        var enfants = noeudsExistants.filter(function (a){return a.pere == pers.id || a.mere == pers.id});
        var job = pers.job;
        var date_naissance = pers.date_birth;
        var date_deces = pers.date_die;
        var p_prenom, m_prenom, c_prenom,enfants_prenoms;
        var p_nom, m_nom, c_nom,enfants_nom;
        enfants_prenoms = "";
        if (typeof(pere)=="undefined"){p_prenom = "pas de parent trouvé"}
        else{
            p_prenom = ""+pere.prenom;
            p_nom = ""+pere.nom;
            }
        if (typeof(mere)=="undefined"){m_prenom = "pas de parent trouvé"}
        else {
            m_prenom = ""+mere.prenom;
            m_nom = ""+mere.nom;
            }
        if (typeof(couple)=="undefined"){c_prenom = "pas de parent trouvé"}
        else {  
            c_prenom = ""+couple.prenom;
            c_nom = ""+couple.nom;
            }
        if (enfants.length == 0){enfants_prenoms = "pas d\'enfant trouvé"}
        else {
            for (var e of enfants){enfants_prenoms += e.prenom+","} 
            enfants_prenoms = enfants_prenoms.substring(0,enfants_prenoms.length-1);
            enfants_nom = enfants[0].nom;
        }
        if (job == "null" || job == null || job == ""){job = "non renseignée"}
        if (date_naissance == "null" || date_naissance == null || date_naissance == ""){date_naissance = "non renseignée"}
        if (date_deces == "null" || date_deces == null || date_deces == ""){date_deces = "non renseignée"}
        
        $(remplissage_old_personne).append('<fieldset id="fsR" style="border:solid 1px black;width:420px"><legend>Relations</legend><div id="id_changt_relation" style="width=100%;"><input type="checkbox" name="chgt_pere" id="checkbox_p" onclick="clickPere(\''+$(txt_old_nom).val()+'\');"/>  Père : '+p_prenom+' <FORM NAME="Choix_père" style="display: initial;margin-left: 10px;"><SELECT id="m_liste_pères" NAME="liste_pères" style="display:none;"></SELECT></FORM></p>'+
                                                                     '<input type="checkbox" name="chgt_mere" id="checkbox_m" onclick="clickMere();"/>  Mère : '+m_prenom+' <FORM NAME="Choix_mère" style="display: initial;margin-left: 10px;"><SELECT id="m_liste_mères" NAME="liste_mères" style="display:none;"></SELECT></FORM></p>'+
                                                                     '<input type="checkbox" name="chgt_mere" id="checkbox_c" onclick="clickConjoint(\''+c_nom+'\');"/>  Conjoint : '+c_prenom+' <FORM NAME="Choix_couple" style="display: initial;margin-left: 10px;"><SELECT id="m_liste_couple" NAME="liste_couple" style="display:none;"></SELECT></FORM></p>'+
                                                                     '<input type="checkbox" name="chgt_mere" id="checkbox_e" onclick="clickEnfants(\''+$(txt_old_nom).val()+'\');"/>  Enfant(s) : '+enfants_prenoms+'<FORM NAME="Choix_enfant" style="display: initial;margin-left: 10px;"><SELECT id="m_liste_enfants" NAME="liste_enfants" style="display:none;"></SELECT></FORM></p></fieldset></p>');
                                                                    
        //$(remplissage).append("</div></div>");
        $(remplissage_old_personne).append('<fieldset id="fsI" style="border:solid 1px black;width:420px"><legend>Info diverses</legend><div id="id_changt_info" style="width=100%;"><input type="checkbox" name="chgt_job" id="checkbox_j" onclick="clickJob();"/> Profession : '+job+' <input type="text" class="m_txt_new_job" name="m_txt_job" id="m_txt_job" value="nouvelle profession" style="display:none;width:150px;margin-left:20px;"></p>'+
                                                                     '<input type="checkbox" name="chgt_date_n" id="checkbox_dn" onclick="clickDateN();"/>  Date de naissance : '+date_naissance+' <input type="text" id="datepicker_n" style="display:none;width:100px;margin-left:20px;"></p>'+
                                                                     '<input type="checkbox" name="chgt_date_d" id="checkbox_dd" onclick="clickDateD();"/>  Date du décès : '+date_deces+' <input type="text" id="datepicker_d" style="display:none;width:100px;margin-left:20px;"></p></fieldset>'+
                                                                     '<p><div id="" style="width:600px;margin-left: 110px;"><a style="" id="btn_maj_pers" class="button" onclick="javascript:maj_Personne(\''+personne+'\');">Valider les informations</a></p></div></div>');
    }

    function changeAdresse(value){
        if (document.getElementById("chkbox_chgt_adr").checked){
            showObject(id_txt__adr);
            showObject(id_txt__cp);
            showObject(id_txt__ville);
            showObject(id_txt__pays);
        }
        else{
            hideObject(id_txt__adr);
            hideObject(id_txt__cp);
            hideObject(id_txt__ville);
            hideObject(id_txt__pays);
        }
    }

    function clickPere(nomFamille){
        if (document.getElementById("checkbox_p").checked){
            showObject(m_liste_pères);
            viderListe(m_liste_pères);
            // On ajoute un prénom vide si la personne n'existe pas
            var select = document.getElementById("m_liste_pères"); 
            var el = document.createElement("option");
            el.textContent = " ";
            el.value = "null";
            select.appendChild(el);
            noeudsMasc = noeudsExistants.filter(function (a){return a.genre == "M"});
            for (var p of noeudsMasc.filter(function (a){return a.nom == nomFamille})){
                var select = document.getElementById("m_liste_pères"); 
                var el = document.createElement("option");
                el.textContent = p.prenom;
                el.value = p.id;
                select.appendChild(el);
            }
        }
        else {
            hideObject(m_liste_pères);
            viderListe(m_liste_pères);        
        }
    }
    function clickMere(){
        if (document.getElementById("checkbox_m").checked){
            showObject(m_liste_mères);
            viderListe(m_liste_mères);
            // On ajoute un prénom vide si la personne n'existe pas
            var select = document.getElementById("m_liste_mères"); 
            var el = document.createElement("option");
            el.textContent = " ";
            el.value = "null";
            select.appendChild(el);
            noeudsFem = noeudsExistants.filter(function (a){return a.genre == "F"});
            for (var p of noeudsFem){
                var select = document.getElementById("m_liste_mères"); 
                var el = document.createElement("option");
                el.textContent = p.prenom;
                el.value = p.id;
                select.appendChild(el);
            }
        }
        else {
            hideObject(m_liste_mères);
            viderListe(m_liste_mères);        
        }
    }
    function clickConjoint(){
        if (document.getElementById("checkbox_c").checked){
            showObject(m_liste_couple);
            viderListe(m_liste_couple);
           // On ajoute un prénom vide si la personne n'existe pas
            var select = document.getElementById("m_liste_couple"); 
            var el = document.createElement("option");
            el.textContent = " ";
            el.value = "null";
            select.appendChild(el);
            for (var p of noeudsExistants.filter(function (a){return a.couple == null})){
                var select = document.getElementById("m_liste_couple"); 
                var el = document.createElement("option");
                el.textContent = p.prenom;
                el.value = p.id;
                select.appendChild(el);
            }
        }
        else {
            hideObject(m_liste_couple);
            viderListe(m_liste_couple);        
        }
    }
    function clickEnfants(nomFamille){
        if (document.getElementById("checkbox_e").checked){
            showObject(m_liste_enfants);
            viderListe(m_liste_enfants);
            var select = document.getElementById("m_liste_enfants"); 
            var el = document.createElement("option");
            el.textContent = " ";
            el.value = " ";
            select.appendChild(el);
            for (var p of noeudsExistants.filter(function (a){return a.mere == null || a.mere == "null" || a.pere == null || a.pere == "null"})){
                var select = document.getElementById("m_liste_enfants"); 
                var el = document.createElement("option");
                el.textContent = p.prenom;
                el.value = p.id;
                select.appendChild(el);
            }
        }
        else {
            hideObject(m_liste_enfants);
            viderListe(m_liste_enfants);        
        }
    }
    function clickJob(){
        if (document.getElementById("checkbox_j").checked){
            showObject(m_txt_job);
        }
        else {
            hideObject(m_txt_job);       
        }
    }
    function clickDateN(){
        if (document.getElementById("checkbox_dn").checked){
            showObject(datepicker_n);
            $( "#datepicker_n" ).datepicker();
        }
        else {
            hideObject(datepicker_n);  
        }
    }
    function clickDateD(){
        if (document.getElementById("checkbox_dd").checked){
            showObject(datepicker_d);
            $( "#datepicker_d" ).datepicker();
        }
        else {
            hideObject(datepicker_d);       
        }
    }
    function maj_Personne(personne){
        var chgt_adr = false,chgt_p = false,chgt_m = false,chgt_c = false,chgt_e = false;
        var adr,cp,ville,pays;
        var pere,mere,couple,enfant;
        var job,date_dn,date_dd;
        chgt_adr = document.getElementById('chkbox_chgt_adr').checked;
        chgt_p = document.getElementById('checkbox_p').checked;
        chgt_m = document.getElementById('checkbox_m').checked;
        chgt_c = document.getElementById('checkbox_c').checked;
        chgt_e = document.getElementById('checkbox_e').checked;
        chgt_j = document.getElementById('checkbox_j').checked;
        chgt_dn = document.getElementById('checkbox_dn').checked;
        chgt_dd = document.getElementById('checkbox_dd').checked;
        
        //if (document.getElementById('chkbox_chgt_adr').checked){chgt_adr=true;}
        //if (document.getElementById('checkbox_m').checked){chgt_p=}
        //if (document.getElementById('chkbox_chgt_adr').checked){}
        
        // Générique : 
        var nom = checkValiditeInsert($(txt_old_nom).val(),'string');
        var prenom = checkValiditeInsert($(liste_old_prenom).val(),'string');
        
        // Changement d'adresse : 
        if (chgt_adr){
            adr = $(id_txt__adr).val();
            cp = checkValiditeInsert($(id_txt__cp).val(),'cp');
            ville = $(id_txt__ville).val();
            pays = checkValiditeInsert($(id_txt__pays).val(),'string');
            var new_geom = "";
            new_geom = geocoder(adr,cp,ville);
            if (new_geom != undefined && new_geom != ""){
                var sql_update = "UPDATE nodes SET the_geom = "+new_geom+" WHERE own_id = '"+personne+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(fsA).append("<div id='aa'>Attribut modifié</div>");
                    $(aa).css("color", "green");
                    $(aa).css("float", "right");
                });
            }
            else {
                alert('erreur lors de l\'insert en base');
            }
        }
        // Changement de relations :
        if (chgt_p){
            pere = checkValiditeInsert($(m_liste_pères).val(),'id');
            var sql_update = "UPDATE nodes SET father_id = "+pere+" WHERE own_id = '"+personne+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(fsR).append("<div id='mp'>père modifié</div>");
                    $(mp).css("color", "green");
                    $(mp).css("float", "right");
            });
        }
        if (chgt_m){
            mere = checkValiditeInsert($(m_liste_mères).val(),'id');
            var sql_update = "UPDATE nodes SET mother_id = "+mere+" WHERE own_id = '"+personne+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(fsR).append("<div id='mm'>mère modifiée</div>");
                    $(mm).css("color", "green");
                    $(mm).css("float", "right");
            });
        }
        if (chgt_c){
            couple = checkValiditeInsert($(m_liste_couple).val(),'id');
            var sql_update = "UPDATE nodes SET couple_id = "+couple+" WHERE own_id = '"+personne+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(fsR).append("<div id='mr'>relation modifiée</div>");
                    $(mr).css("color", "green");
                    $(mr).css("float", "right");
            });
        }
        if (chgt_e){
            enfant = checkValiditeInsert($(m_liste_enfants).val(),'id');
            var sql_update; 
            var genre = $(genres_search).val();
            if (genre === "M"){
                sql_update = "UPDATE nodes SET father_id = "+personne+" WHERE own_id = '"+enfant+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(fsR).append("<div id='me'>enfants modifiés</div>");
                    $(me).css("color", "green");
                    $(me).css("float", "right");
                });
            }
            if (genre === "F"){
                sql_update = "UPDATE nodes SET mother_id = "+personne+" WHERE own_id = '"+enfant+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(fsR).append("<div id='me'>enfants modifiés</div>");
                    $(me).css("color", "green");
                    $(me).css("float", "right");
                });
            }
        }
        // Changement d'info :
        if (chgt_j){
            job = checkValiditeInsert($(m_txt_job).val(),'string');
            var sql_update = "UPDATE nodes SET profession = '"+job+"' WHERE own_id = '"+personne+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(m_txt_job).val("Attribut modifié");
                    $(m_txt_job).css("color", "green");
            });
        }
        if (chgt_dn){
            date_dn = checkValiditeInsert($(datepicker_n).val(),'string');
            var sql_update = "UPDATE nodes SET date_naissance = to_timestamp('"+date_dn+"','DD/MM/YYYY') WHERE own_id = '"+personne+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(datepicker_n).val("Attribut modifié");
                    $(datepicker_n).css("color", "green");
            });
        }
        if (chgt_dd){
            date_dd = checkValiditeInsert($(datepicker_d).val(),'string');
            var sql_update = "UPDATE nodes SET date_deces = to_timestamp('"+date_dd+"','DD/MM/YYYY') WHERE own_id = '"+personne+"';&api_key="+apikey+"";
                $.getJSON('https://samueldeschampsberger.cartodb.com/api/v2/sql/?q='+sql_update, function(res) {
                    $(datepicker_d).val("Attribut modifié");
                    $(datepicker_d).css("color", "green");
            });
        }
        $(remplissage).append('<div id="btnB""><a id="mod_pbis" class="button" style="margin-left: 110px;" onclick="javascript:ModifierPersonne(\''+user+'\');">Modifier une autre personne ?</a></div>');
        $(btn_maj_pers).remove();
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
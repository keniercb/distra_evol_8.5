/**
 * Created by Ristian on 8/22/14.
 */
projectNombre = "";
projectToRename = "";
selectItemParent = "";
selectItemMenu = "";
flagMenuEvent ="";
flagOldNode ="";
selectNode = "";
selectUri ="";
banderaIndice = false;
onProgress = false;

function listarProyecto(){
    tinymce.activeEditor.setContent('');
    var resp = "";
    //tinymce.activeEditor.setProgressState(true);
    tinymce.activeEditor.windowManager.progressBar.show();

    $.ajax({
        url:   'index.php/Ayuda/listarProjecto',
        type:  'post',
        success:  function (response) {
            var items=[];
            items=JSON.parse(response);
            var x ="";
            for(x in items.workspaces){
                resp +=  items.workspaces[x].li;
            }
            for(x in items.framework){
                resp += items.framework[x].li;
            }
            $("#menuIndice").html(resp);
            //tinymce.activeEditor.setProgressState(false);
            tinymce.activeEditor.windowManager.progressBar.hide();
        }
    });
}

function sortableList(){
    $('ul.sortable-list').sortable({

        //containment: 'parent',
        forceHelperSize: true,
        forcePlaceholderSize: true,
        opacity: 0.8,
        connectWith: ".ui-sortable",
        revert: 200,
        cursorAt: { left: 5 },
        tolerance: "pointer",

        stop: function(a, b){

            var idIndex = $(b.item[0]).attr('id');
            var posIndes = $(b.item[0]).index();
            var parent = $(b.item[0]).parents()[1];
            var parentId = $(parent).attr('id');//.children()[0].text)

            var textItem = $(b.item[0]).children()[0].text;

            var ulParent = $(parent).children()[1];
            var cont = 0;

            $(ulParent).find('a').each(function(a,b){
                if(b.text == textItem && $(b).parents()[1] === ulParent){
                    cont++;
                }
            });

            if(cont == 2){
                $('ul.sortable-list').sortable( "cancel" );
                tinymce.activeEditor.windowManager.MsgFlotante(3, 'Ya existe un índice con ese mismo nombre.');
            }else{

                tinymce.activeEditor.windowManager.confirm("¿Está seguro que mover el índice seleccionado?", function(s) {
                    if (s){
                        $.ajax({
                            data: {
                                idIndex:idIndex,
                                posIndes:posIndes,
                                parentId:parentId,
                                name: projectNombre,
                                uri: selectUri
                            },
                            url: 'index.php/Ayuda/sortMenu',
                            type: 'post',
                            success: function(response) {
                                var data =  JSON.parse(response);
                                tinymce.activeEditor.windowManager.MsgFlotante(1,data.msg);
                                cargarProyecto();

                            }
                        });
                    }else{
                       // $('ul.sortable-list').sortable( "refreshPositions" );
                        $('ul.sortable-list').sortable( "cancel" );
                    }
                });
            }
        }
    }).disableSelection();
    //$('ul.sortable-list').sortable( "disable" );

}

function cargarProyecto(){

    $.ajax({
        data: parametro,
        url: 'index.php/Ayuda/cargarProjecto',
        type: 'post',
        success: function(response) {
            var resp = JSON.parse(response);
            projectNombre = resp.project;
            var prue = resp.menu.replace(/nav/g, "proyectos sortable-list ui-sortable");
            $('#menuIndice').html(prue);
            $('.proyectos').find('ul').addClass( "sortable-list ui-sortable" );

            $('.proyectos').find('li').css({
               'list-style-type': 'none',
               'margin-left': '-25px',
               'padding': '5px'
            });

            $('.proyectos').find('a').each(function(){
                if($(this).parent().children("ul").length && $(this).parent().children("ul").children().length > 0)
                    //$(this).prepend('<span class="glyphicon glyphicon-folder-close" style="font-size:85%;padding-right: 4px;"></span>&nbsp;');
                    $(this).addClass("glyphicon glyphicon-folder-close nodo-tree size85");
                else
                    //$(this).prepend('<span class="glyphicon glyphicon-stop" style="font-size:45%;padding-right: 4px;"></span>');
                    $(this).addClass("glyphicon glyphicon-stop nodo-tree");
                    $(this).css( "font-size", "0.97em");
            });            
            $('.proyectos').find('ul').hide();
            sortableList();
            $('.nodeSelect').removeClass('nodeSelect');
            //$('#'+idNode+' a:first').addClass('nodeSelect');

        }
    });
}

function getContenido(){
    tinymce.activeEditor.setProgressState(true);
    $.ajax({
        type: "POST",
        url: "index.php/Ayuda/getContenido",
        data: {
            idNodo: idNode,
            name : projectNombre,
            uri: selectUri

        },
        success : function(data){
            var obj = JSON.parse(data);
            tinymce.activeEditor.setContent(obj.data);
            tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
            tinymce.activeEditor.setProgressState(false);

            $('.nodeSelect').removeClass('nodeSelect');
            $('#'+idNode+' a:first').addClass('nodeSelect');

        }
    });

}

$(document).delegate('.proyectos a', 'click', function(){
    if($(this).parent().children('ul').css('display') == "none" && $(this).parent().children("ul").children().length > 0){
        $(this).parent().children('ul').show();
        $(this).removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
    }
    else if($(this).parent().children('ul').css('display') == "block" && $(this).parent().children("ul").children().length > 0){
        $(this).parent().children('ul').hide();
        $(this).removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
    }
});

$( window ).resize(function() {
    $("#content_ifr").height($( window ).height()-110);
    $('#contextInde').height($( window ).height()-60);
});

$(document).on("click", function(e){
    $('#xmenuActionProyect').hide();
    $('#xmenuAction').hide();
});

$(document).on("contextmenu", function(e){
    var n = e.target.nodeName;
    var eid = e.target.parentNode.id;
    selectItemParent = '#'+ eid;
    selectItemMenu = '#'+ n;
    selectNode = eid;
    var temp = $(eid);
    e.preventDefault();
    // selectUri =  $(e.target).attr("uri");
    //console.log('selectUri',selectUri);
    if(e.target.nodeName =='A'){
        e.preventDefault();
        if($(e.target.parentNode).hasClass("active xinitProyect")){

            $('#xmenuAction').css({'display':'none'});
            e.pageY + $('#xmenuActionProyect').height() > $(document).height() ? $('#xmenuActionProyect').css({'display':'block', 'left':e.pageX, 'top':e.pageY - $('#xmenuActionProyect').height()}) : $('#xmenuActionProyect').css({'display':'block', 'left':e.pageX, 'top':e.pageY});
            //$('#addNodeProyect').hide();
            selectUri =  $(e.target).attr("uri");
            if(selectUri !='workspaces'){
                $('#renameNodeProy').hide();
                // $('#deleteNodeProy').hide();
            }else{
                $('#renameNodeProy').show();
                // $('#deleteNodeProy').show();
            }
            projectNombre =  $(e.target).text();
            projectToRename = projectNombre;

        }
        else if(!$(e.target.parentNode).hasClass("xActionMenuHelp")){
            if($(e.target.parentNode)[0].id !== ''){
                $('#xmenuActionProyect').css({'display':'none'});
                e.pageY + $('#xmenuAction').height() > $(document).height() ? $('#xmenuAction').css({'display':'block', 'left':e.pageX, 'top':e.pageY - $('#xmenuAction').height()}) : $('#xmenuAction').css({'display':'block', 'left':e.pageX, 'top':e.pageY});
            }
        }
        /*else{
            cancelEvent(e);
            stopEvent(e);    
        }*/

        changeNodeMenu(eid,selectUri);
    }
    else{
        $('#xmenuAction').css({'display':'none'});
    }
});

function createId(prefix) {
    var map = {};
    prefix = prefix || 'generated';
    map[prefix] = map[prefix] || 0;

    var id = prefix + '-' + map[prefix]++;

    // Valida que no exista un elemento con
    // el mismo id
    if(document.getElementById(id)) {
        return createId(prefix);
    }
    return id;
}

function randomInterval(){
    var id;
    var numPosibilidades = 10000 - 1;
    var aleat = Math.random() * numPosibilidades;
    aleat = Math.round(aleat);
    id = 'index_'+parseInt(1) + aleat;

    if($('.'+id).length != 0) {
        return randomInterval();
    }
    return id;
}

//controlamos ocultado de menu cuando esta activo
function generateID() {
    var random = randomInterval();
     /*var temp = selectItemParent.split('#')[1];
    var contchildren =  $(selectItemParent + '> ul ').children().length;
    var log = createId(temp);
    console.log('generic ID',log);
    return temp +"_"+contchildren;*/
    return random;
}

function clearForm() {
    // 1 Informativo - 2 Confirmacion - 3 Insertar
    $('#xetidWindows div.modal-body h5').remove();


}
function addProperty(id,propiedad,valor) {
    // 1 Informativo - 2 Confirmacion - 3 Insertar
    $('#xetidWindows div.modal-body h5').remove();


}

function actionModal(win) {
    var contchildren =  $(selectItemParent).children().length;
    var idgenerate =  generateID();
    var idContextGenerate =  idgenerate+'_context';

    var name = $("#nombreIndice").val();
    var nameAdd = $("#nombreAddIndice").val();
    var valor =  $("#inputNombre").val();
    var reference =  $("#accionAddIndice").val();
    switch(flagMenuEvent){
        case "renameProyecto":
           // $('li'+selectItemParent+' > a').append('<span style="padding-right: 4px;" class="glyphicon glyphicon-folder-close"></span>')

            if(typeof(projectNombre) == "undefined"){
                projectNombre = projectToRename;
            }
            onProgress = true;

            $.ajax({
                type: "POST",
                url: "index.php/Ayuda/reNameProject",
                data: {
                    idNodo: selectItemParent,
                    newname: name,
                    name:projectNombre,
                    uri: selectUri,
                    reference:reference
                },
                success : function(response){
                    var data =  JSON.parse(response);
                    projectNombre = data.project;
                    onProgress = false;

                    if(data.succes){
                        $('li'+selectItemParent).attr("title",reference);
                        $('li' + selectItemParent + ' > a').text(name);
                        //tinymce.activeEditor.windowManager.alert(data.mensaje);
                        projectToRename = '';
                        win.close();
                        tinymce.activeEditor.windowManager.MsgFlotante(1,data.mensaje);
                    }else{
                        tinymce.activeEditor.windowManager.MsgFlotante(3, data.mensaje);
                    }
                }
            });
            clearForm();
            break;
        case "deleteProyecto":
            $(selectItemParent).remove();
            tinymce.activeEditor.setProgressState(true);
            $.ajax({

                type: "POST",
                url: "index.php/Ayuda/deleteProject",
                data: {
                    idNodo: selectItemParent,
                    name:projectNombre,
                    uri: selectUri
                },
                success : function(data){
                    var request =  JSON.parse(data);
                    if(request.succes){
                        tinymce.activeEditor.setProgressState(false);
                        tinymce.activeEditor.setContent('');                    
                        //tinymce.activeEditor.windowManager.alert(request.mensaje);
                        tinymce.activeEditor.windowManager.MsgFlotante(1,request.mensaje);
                        tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
                        listarProyecto();
                    }

                }
            });

            clearForm();
            break;

        case "add":
            tinymce.activeEditor.setProgressState(true);
           /* onProgress = true;
            var wbr = nameAdd.length;
            var split = nameAdd.split(' ');
            var string = '';

            if(split.length != 0){
                split.forEach(function(a){
                    if(a.length > 20){
                        var t = a.substr(0, 20);
                        var r = a.substr(20, a.length);
                        var res = t.concat('<wbr>',r);
                        a=res;

                    }
                    string = string.concat(a);

                });
                nameAdd= string;
            }else if(wbr > 20){
                for (i = 0; i < wbr; i+20) {
                    string = stringt.substr(i,i+20);
                }
                var t = a.substr(0, 20);
                var r = a.substr(20, a.length);
            }


            console.log('wbr', nameAdd);*/
            $.ajax({
                type: "POST",
                url: "index.php/Ayuda/addIndice",
                data: {
                    idNodo: idgenerate,
                    nameindice: nameAdd,
                    name : projectNombre,
                    uri: selectUri,
                    idpadre:selectItemParent,
                    reference:reference
                },
                success : function(data,textstatus){
                    var request = JSON.parse(data);
                    tinymce.activeEditor.setProgressState(false);
                    onProgress = false;
                    if(request.success == true){
                        if (selectItemParent != '#undefined' || selectItemParent != '#') {

                            $(selectItemParent).append(
                                '<ul class="sortable-list ui-sortable">' +
                                ' <li style="list-style-type:none; margin-left:-25px" id=' + idgenerate + ' title="' + reference + '"><a class="glyphicon glyphicon-chevron-right" style="font-size:0.96em" href=' + '"#' + idContextGenerate + '">' + nameAdd +
                                '</a></li>' +
                                '</ul>');

                            sortableList();

                        }
                        else {

                            $('#menu-indice').append(
                                '<li id=' + name.toLowerCase() + '>' +
                                '<a href="">' + name + '</a>' +
                                '</li>');

                        }
                        tinymce.activeEditor.setNodeSelected(idgenerate, selectUri);
                        tinymce.activeEditor.setContent('Nuevo contenido');
                        tinymce.activeEditor.windowManager.MsgFlotante(1, 'El índice ha sido adicionado satisfactorimente.');
                        clearForm();
                        win.close();
                    }else{
                        tinymce.activeEditor.windowManager.MsgFlotante(3, request.mensaje);
                    }



		    //$('.margen').find('li').css( "font-size", "0.96em"); 
                    //$('.margen').find('li').css( "margin-left", "-25px");
                    //console.log('cojne',$('.proyectos').find('li'));
                    //$('.proyectos').find('a').css( "font-size", "0.96em");
                    //  $('li'+idgenerate).attr("title",reference);


                }
            });




            break;
        case "rename":

            //console.log(selectItemParent);
            tinymce.activeEditor.setProgressState(true);
            onProgress = true;
            $.ajax({
                type: "POST",
                url: "index.php/Ayuda/reNameIndice",
                data: {
                    idNodo: selectItemParent,
                    newname: name,
                    name:projectNombre,
                    uri: selectUri,
                    reference:reference
                },
                success : function(response){
                    onProgress = false;
                    tinymce.activeEditor.setProgressState(false);
                    var data =  JSON.parse(response);
                    if(data.success == true){
                        tinymce.activeEditor.windowManager.MsgFlotante(1, 'El índice ha sido modificado satisfactorimente.');
                        $('li' + selectItemParent + ' > a').text(name);
                        $('li' + selectItemParent).attr("title", reference);
                        //projectNombre = data.project;
                        clearForm();
                        win.close();
                    }else{
                        tinymce.activeEditor.windowManager.MsgFlotante(3, data.mensaje);
                    }

                }
            });
            break;
        case "delete":
            var name = $(selectItemParent)[0].innerText;
            tinymce.activeEditor.setProgressState(true);
            $.ajax({

                type: "POST",
                url: "index.php/Ayuda/deleteIndice",
                data: {
                    idNodo: selectItemParent,
                    name:projectNombre,
                    uri: selectUri
                },
                success : function(data,textstatus){
                    $(selectItemParent).remove();
                    tinymce.activeEditor.setContent('');
                    tinymce.activeEditor.setProgressState(false);
                    tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
                    tinymce.activeEditor.windowManager.MsgFlotante(1, 'El índice ha sido eliminado satisfactoriamente.');
                    
                }
            });
            clearForm();
            break;


    }
}

/**
 @method showVentanaIndice
 @param {String} args Optional title: titulo de la ventana.
 **/
function changeNodeMenu(select,uri){
    if(!uri){
        var uriN = selectUri;
    }
    else{ var uriN = uri;}
    if( tinymce.activeEditor.getNodeSelected() != select){
        flagOldNode = tinymce.activeEditor.getNodeSelected();
        tinymce.activeEditor.setNodeSelected(select,uriN);
        // return true
    }
}
function showVentanaAddIndice(title){

    tinymce.activeEditor.windowManager.open({
        //url: 'file.htm',
        title:title,
        id: 'winAddIndice',
        width: 520,
        height: 160,
        closeOnSubmit : false,
        body:[{
            type:'textbox',
            name:'nombreAddIndice',
            id:'nombreAddIndice',
            label:'Nombre:',
            placeholder:'Denominación del índice',
            vtype:'index',
            allowBlank:false,
            maxLength: 150

        },{
            type:'textbox',
            name:'accionAddIndice',
            id:'accionAddIndice',
            label:'Referencia:',
            vtype:'reference',
            placeholder:'Referencia del índice'
            //pattern:'[0-9]'
        },
            {
                type:'textbox',
                name:'referenciaAddIndice',
                id:'referenceAddIndice',
                disabled:true,
                label:'Identificador:',
                placeholder:'Identificador del índice'
            }
        ],
        onsubmit: function(e) {
            var form = this.find('form')[0];
           if(!onProgress){
               if(form.validateForm(true)){//TODO:
                   actionModal(this);
               }
           }

        },onpostRender:function(e){
            $('.mce-primary',$('#'+e.control._id)).addClass('mce-disabled');
            $('#'+e.control._id).keydown(function (a){
                if (a.keyCode > 46) {
                    $('.mce-primary',$('#'+e.control._id)).removeClass('mce-disabled');
                }
            });

        }
    }, {
        custom_param: {
          msgActive: true
        }
    });

    //tinymce.activeEditor.setProgressState(true, 5000);
    // $('#accionAddIndice').attr('placeholder','acción/id del botón');
    //$('#accionAddIndice').attr('tooltip','Referencia de la APP al índice');


}
function showVentanaIndice(title){
    var bodyIndice = [{
        type: 'textbox',
        name: 'nombreIndice',
        id: 'nombreIndice',
        label: 'Nombre:',
        vtype: 'index',
        placeholder: 'Denominación del índice',//'Nombre del índice a insertar',
        allowBlank:false,
        maxLength: 150
    }, {
        type: 'textbox',
        name: 'accionAddIndice',
        id: 'accionAddIndice',
        label: 'Referencia:',
        vtype: 'reference',
        placeholder: 'Referencia del índice'
    },
        {
            type: 'textbox',
            name: 'referenciaIndice',
            id: 'referenciaIndice',
            disabled: true,
            label: 'Identificador:'
        }
    ];

    var bodyProyect = [{
        type: 'textbox',
        name: 'nombreIndice',
        id: 'nombreIndice',
        label: 'Nombre:',
        vtype: 'nameproyect',
        placeholder: 'Denominación del proyecto',
        allowBlank:false,
        maxLength: 150
    }];
    tinymce.activeEditor.windowManager.open({
        //url: 'file.htm',
        title:title,
        width:  520,
        height: (title == 'Modificar proyecto') ? 70 :150,
        body: (title == 'Modificar proyecto') ? bodyProyect : bodyIndice,
        closeOnSubmit : false,
        onsubmit: function(e) {
            var form = this.find('form')[0];
            if(!$('.mce-primary',$('#'+this._id)).hasClass('mce-disabled')){

                if(!onProgress){
                if(form.validateForm(true)){
                    actionModal(this);
                }}
            }
        },
        onpostRender:function(e){
            $('.mce-primary',$('#'+e.control._id)).addClass('mce-disabled');
            $('#'+e.control._id).keydown(function (a){
                if (a.keyCode != 13) {
                    $('.mce-primary',$('#'+e.control._id)).removeClass('mce-disabled');
                }
            });

        }
    }, {
        custom_param: 1
    });
    $('#referenciaIndice').val(selectNode);
    $('#nombreIndice').val( $('li'+selectItemParent+' > a').text());
    $('li'+selectItemParent).attr("placeholder",'acción/id del botón de la App')
    $('#accionAddIndice').val($('li'+selectItemParent).attr("title"));

}

$(document).click(function(e){
    //varElemnt.indexOf(valor) === -1
   var tinyIDs = e.target.id;

   if(tinyIDs.indexOf('mceu') === -1){

    if(e.target.parentNode != null && e.which !== 3){

        idNode = e.target.parentNode.id;
        // $('#xmenuAction').css("display", "none");
        //console.log($('div.xActionMenuHelp'));
        //
        if(e.which==1){

         $('div.xActionMenuHelp').css("display", "none");
         var link =  e.target.parentNode.id;
         if(e.target.parentNode.className  =="active xinitProyect"){
         type = "";
         nombreProy =  e.target.textContent;
         uri =  $(e.target).attr("uri");
         var span = $(e.target).children('span');

         if(uri != 'workspaces'){
         type = 'framework';
         }
         else{
         type = 'workspaces'
         }

         parametro = {
         "nameproject": nombreProy,
         "type":type,
         "uri":uri,
         "idNodo": idNode
         };

         cargarProyecto();

         }
         if(e.target.nodeName =='A' && e.target.parentNode.nodeName =='LI'){


         // $(e.target).css("font-weight","bold");
         if(projectNombre == ""){
         projectNombre = $(e.target).text();

         }
         if(selectUri == "" || selectUri == "undefined" ){
         selectUri = $(e.target).attr("uri");
         }


         var btnSave = $('.mce-i-save').parents()[1];
         if(!$(btnSave).hasClass('mce-disabled')){

         tinymce.activeEditor.windowManager.confirm("¿Desea guardar los cambios realizados?", function(s) {

         if (s){
         tinymce.activeEditor.execCommand('mceSave');
         tinymce.activeEditor.setNodeSelected(idNode, $(e.target).attr("uri"));  //@todo gurdar el contenido en el  nodo anterior
         getContenido();

         }else{
         tinymce.activeEditor.setNodeSelected(idNode, $(e.target).attr("uri")); //@todo gurdar el contenido en el  nodo anterior
         getContenido();
         tinymce.activeEditor.execCommand('mceDisabledSave');
         }

         });

         }else{
         getContenido();
         tinymce.activeEditor.setNodeSelected(idNode, $(e.target).attr("uri"));
         }

         }
         }

        var acttionClick = e.target.id != '' ? e.target.id : $(e.target).parent()[0].id;

        switch(acttionClick){
            case "btn_cancelIndice":
                clearForm();
                break;
            case "btn_addIndice":
                //actionModal();
                break;
            case "addNode":
                flagMenuEvent = 'add';
                var title = 'Adicionar índice';
                if(tinymce.activeEditor.isDirty()){
                    tinymce.activeEditor.windowManager.confirm("¿Desea guardar los cambios realizados?", function(s) {
                        if (s){

                            changeNodeMenu(flagOldNode);
                            tinymce.activeEditor.execCommand('mceSave');
                            changeNodeMenu(idNode)
                            showVentanaAddIndice(title);
                        }
                        else{
                            showVentanaAddIndice(title);
                        }
                    });
                }
                else{
                    showVentanaAddIndice(title);
                }
                break;
            case "renameNode":
                flagMenuEvent = 'rename';
                var title = 'Modificar índice';
                showVentanaIndice(title);
                break;
            case "deleteNode":
                flagMenuEvent = 'delete';
                tinymce.activeEditor.windowManager.confirm("¿Está seguro que quiere eliminar el índice seleccionado?", function(s) {
                    if (s){
                        actionModal(null);
                        clearForm();
                    }
                });
                break;
            case "addNodeProyect":
                flagMenuEvent = 'add';
                var title = 'Adicionar índice';
                if(tinymce.activeEditor.isDirty()){
                    tinymce.activeEditor.windowManager.confirm("¿Desea guardar los cambios realizados?", function(s) {
                        if (s){
                            changeNodeMenu(flagOldNode);
                            tinymce.activeEditor.execCommand('mceSave');
                            changeNodeMenu(idNode)
                            showVentanaAddIndice(title);
                        }
                        else{
                            showVentanaAddIndice(title);
                        }
                    });
                }
                else{
                    showVentanaAddIndice(title);
                }
                break;
            case "renameNodeProy":
                flagMenuEvent = 'renameProyecto';
                var title = 'Modificar proyecto';
                showVentanaIndice(title);
                break;
            case "deleteNodeProy":
                flagMenuEvent = 'deleteProyecto';
                tinymce.activeEditor.windowManager.confirm("¿Está seguro que quiere eliminar el proyecto seleccionado?", function(s) {
                    if (s){
                        actionModal(null);
                        clearForm();
                    }
                });
                break;
            case "exportNodeProy":
                tinymce.activeEditor.setProgressState(true);
                $.ajax({
                    data: {
                        "name": projectNombre,
                        "uri": selectUri
                    },
                    url: 'index.php/Ayuda/exportarProyecto',
                    type: 'post',
                    success: function(response) {
                        tinymce.activeEditor.setProgressState(false);
                        var urlzip = JSON.parse(response).data;
                        window.open(('https:' == document.location.protocol ? 'https://' : 'http://') + urlzip, 'target');
                    }
                });
                break;
            case "exportSubIndiceProy":
            case "exportProyIndice":
                tinymce.activeEditor.setProgressState(true);
                $.ajax({
                    data: {
                        "name": projectNombre,
                        "uri": selectUri,
                        "idNodo": selectItemParent
                    },
                    url: 'index.php/Ayuda/exportarIndice',
                    type: 'post',
                    success: function(response) {
                        tinymce.activeEditor.setProgressState(false);
                        var urlzip = JSON.parse(response).location;
                        window.open(('https:' == document.location.protocol ? 'https://' : 'http://') + urlzip, 'target');
                        //tinymce.activeEditor.windowManager.alert('El indice fue exportado  satisfactoriamente.');
                        //tinymce.activeEditor.windowManager.flotante('Test');
                    }
                });
                break;
            case "importSubIndiceProy":
            case "importProyIndice":
                banderaIndice = true;
                tinymce.activeEditor.execCommand('Ximport_file');
                banderaIndice = false;
                break;
        }

    }}

});
$(document).keydown(function(e){
    if(e.keyCode == 27){
        $('#xmenuAction').css("display", "none");
    }
});
$(document).ready(function(){
 $("#contextInde").height($( window ).height()-50);
  var winss = $(window);
  $(winss[0].parent.frameElement).css('background-color', 'rgba(66, 139, 202, 0.11)');

 });
function filterShowItems (event){
    var valor = document.getElementById('inputbuscar').value;
    $('ul#menuIndice li').each(function (index, element) {
        valor = valor.toLowerCase();
        varElemnt = $(element).text().toLowerCase();
        if (varElemnt.indexOf(valor) === -1) {
            $(element).hide("slow");
        }
        else {
            $(element).show();
        }

    });
}

function validarCampoBuscar(event){
    var patron=new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_.,¿?¡!]+$');
    if(event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39){
        return true;
    }
    if(event.key == "v" && event.ctrlKey){
        return false;
    }
    return patron.test(event.key);
}

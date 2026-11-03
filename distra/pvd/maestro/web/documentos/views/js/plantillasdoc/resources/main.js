
projectNombre = "";
selectItemParent = "";
selectItemMenu = "";
flagMenuEvent ="";
flagOldNode ="";
selectNode = "";
selectUri ="";
idplantilla ="";
banderaIndice = false;

function getContenido(id){
    idplantilla = id;
    $.ajax({
        type: "POST",
        url: "getContenidoByIdDocumento",
        data: {
            idplantilla: id
        },
        success : function(data){
            var obj = JSON.parse(data);
            if(obj.contenido==1) {
                tinymce.activeEditor.setContent(obj.data);
            } else {
                tinymce.activeEditor.setContent('');
            }
            //console.info($('#concepto'));
            tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
            tinymce.activeEditor.setProgressState(false);
        }
    });
}

$( window ).resize(function() {
    $("#framee").height($( window ).height()-140);
});
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();

objci = {};
objci.acciones = [];
var treesel, winAddPlan, tbarBasePlan;
var rectora, entidadID, nodo, objci, idejerc, termine_cargar = false;
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas
UCID.portal.cargarEtiquetas('gestplanes', cargarAccionesP);

//********CARGANDO LAS ACCIONES*************
function cargarAccionesP() {

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        termine_cargar = true;
        if (!objci.acciones.rector)
        {
            cbaccionesDWH.hide();
        }
        cargarInterfaz();
    })

}

// function CargarInterfaz
function cargarInterfaz() {

    //Máscara para visualizar indistintamente
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });

    mymask.show();
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function(options, success, response) {
            var params = Ext.decode(response.responseText);
            entidadID = params.data;
            idejerc = params.idejercicio;
            mymask.hide();

        }
    });
    configuraTreePanel();
    crearIUComentario();
    crearBasePlan();

}// Endof cargarInterfaz

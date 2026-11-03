var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('gestpersonadel711', cargarInterfaz);
var btnAdicionar, btnModificar, btnEliminar, btnAyuda;
var stGpPersonas711, smGpPersonas711, gpGestPersonas711, empvalue, empdestino, tp,offset = 0,
            idempim,
            uc,
            cp,
            nombre,
            apell,
            correo,
            telf,
            idempimp;
function cargarInterfaz() {
    dominio = perfil.iddominio;
    console.log(perfil);
    // if(perfil.iddominio==1){
    //     denomestructuracomun = null;
    // }
    
    btnAdicionar = new Ext.Button({
        handler: function () {
            accionventana = 1;
            winFp(accionventana);
        },
        tooltip: perfil.etiquetas.lbTtbtnAdd,
        disabled: false,
        id: 'btnAdd',
        iconCls: 'adicionar'
    });
    btnModificar = new Ext.Button({
        handler: function () {
            accionventana = 2;
            winFp(accionventana);
        },
        tooltip: perfil.etiquetas.lbTtbtnMod,
        disabled: true,
        id: 'btnMod',
        iconCls: 'modificar'
    });
    btnDesactivar = new Ext.Button({
        handler: function () {
            InhabilitarPersona();
        },
        tooltip: 'Inhabilitar persona',
        disabled: true,
        id: 'btnDesactivar',
        iconCls: 'desaprobar'
    });
    btnHabilitar = new Ext.Button({
        handler: function () {
            HabilitarPersona();
        },
        tooltip: 'Habilitar persona',
        disabled: true,
        id: 'btnHabilitar',
        iconCls: 'aprobar'
    });
    btnEliminar = new Ext.Button({
        handler: function () {
            EliminarPersona();
        },
        tooltip: perfil.etiquetas.lbTtbtnDel,
        disabled: true,
        id: 'btnEli',
        iconCls: 'eliminar'
    });
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
        id: 'btnAyudaPersona711',
        iconCls: 'ayuda'
    });    

    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrospersonas711.clearFilters();
        }
    });
    
    agregarmodificarpersona();

    aux = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                aux.baseParams.uri = 4;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    // Store grid stGpPersonas711
    stGpPersonas711 = new Ext.data.Store({
        url: 'listarPersonas711',
        listeners: {
            beforeload: function () {
                stGpPersonas711.removeAll();
                stGpPersonas711.baseParams.start = offset;
                stGpPersonas711.baseParams.dominio = dominio;
                //cambiarTituloFiltrar(gpGestPersonas711, filtrospersonas711, perfil.etiquetas.lbFiltradoPor);
            },
            load: function () {
                btnModificar.disable();
                btnEliminar.disable();
                btnDesactivar.disable();
                btnHabilitar.disable();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idpersonadel711'
            }, {
                name: 'nombreapellidos'
            }, {
                name: 'nombre'
            }, {
                name: 'apellidos'
            }, {
                name: 'idtipopersona'
            }, {
                name: 'iddatostp'
            }, {
                name: 'identidad'
            }, {
                name: 'iddatosempimp'
            }, {
                name: 'importadora'
            }, {
                name: 'iddatoscategoria'
            }, {
                name: 'categoria'
            }, {
                name: 'correoelec'
            }, {
                name: 'telefono'
            }, {
                name: 'iddatosuc'
            }, {
                name: 'telefono'
            }, {
                name: 'datosuc'
            }, {
                name: 'activo'
            }, {
                name: 'nombrepertenece'
            }]
                )
    });

    // Selection Model grid smGpPersonas711
    smGpPersonas711 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            beforerowselect: function (sm, y, z, record) {
                btnModificar.enable();
                btnEliminar.enable();
                btnDesactivar.enable();
                btnHabilitar.enable();
            }
        }
    });

    // Filtros para cada columna de tipo de modelo
    filtrospersonas711 = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'nombreapellidos'
            }, {
                type: 'string',
                dataIndex: 'iddatostp'
            }, {
                type: 'boolean',
                dataIndex: 'activo'
            }, {
                type: 'string',
                dataIndex: 'nombrepertenece'
            }]
    });

    // Grid gestion gpGestPersonas711
    gpGestPersonas711 = new Ext.grid.GridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        region: 'center',
        layout: 'fit',
        store: stGpPersonas711,
        sm: smGpPersonas711,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idpersonadel711'
            }, {
                id: 'expandir',
                header: 'Nombre y apellidos',
                tooltip: 'Nombre y apellidos',
                sortable: true,
                dataIndex: 'nombreapellidos',
                renderer: crearToolTip
            }, {
                header: 'Tipo persona',
                tooltip: 'Tipo persona',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'iddatostp',
                renderer: crearToolTip
            }, {
                header: 'Activo',
                tooltip: 'Activo',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'activo',
                renderer: renderEstActual
            }, {
                header: 'Entidad',
                tooltip: 'Entidad',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'nombrepertenece',
                renderer: crearToolTip
            }],
        //md: menuConfigAtributo,
        loadMask: {
            store: stGpPersonas711
        },
        bbar: new Ext.PagingToolbar({
            store: stGpPersonas711,
            displayInfo: true,
            items: [btnLimpiar],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrospersonas711
    });

   panelGeneral = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'border',
        id: 'panelGeneral',
        autoWidth: true,
        height: 50,
        items: [gpGestPersonas711],
        tbar: [btnAdicionar, btnModificar, btnDesactivar, btnHabilitar, btnEliminar, '->', btnAyuda]
    });

    // viewport de la plantilla
    vpPlanes711 = new Ext.Viewport({
        layout: 'fit',
        id: 'idvpPlanes711',
        items: [panelGeneral]
    });

    //panelGeneral.focus(true, 500);

    stGpPersonas711.reload();

}// Endof cargarInterfaz

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderEstActual(val, m) {
    if (val == 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } 
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + ' - <i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function InhabilitarPersona(){
    mostrarMensaje(2, 'Está seguro que desea inhabilitar a la persona seleccionada?', function (btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'InhabilitarPersona',
                params: {            
                    idpersonadel711: smGpPersonas711.getSelected().data.idpersonadel711
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La persona se ha inhabilitado satisfactoriamente');
                        stGpPersonas711.reload();
                    }else {                
                        mostrarMensaje(2, responseData.mensaje);
                    }
                }
            });
        }
    });
}

function EliminarPersona(){
    mostrarMensaje(2, 'Está seguro que desea eliminar a la persona seleccionada?', function (btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'EliminarPersona',
                params: {            
                    idpersonadel711: smGpPersonas711.getSelected().data.idpersonadel711
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La persona se ha eliminado satisfactoriamente');
                        stGpPersonas711.reload();
                    }else {                
                        mostrarMensaje(2, responseData.mensaje);
                    }
                }
            });
        }
    }); 
}
function HabilitarPersona(){
    Ext.Ajax.request({
        url: 'HabilitarPersona',
        params: {            
            idpersonadel711: smGpPersonas711.getSelected().data.idpersonadel711
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, 'La persona se ha habilitado satisfactoriamente');
                stGpPersonas711.reload();
            }else {                
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });
}
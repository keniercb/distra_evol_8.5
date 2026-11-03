perfil.etiquetas = {};
function iniciarEncabesado() {

    stGpEncabesado = new Ext.data.Store({
        url: 'cargarEncabezado',
        listeners: {beforeload: function() {
                stGpEncabesado.removeAll();
            }},
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idencabesado"
        }, [{name: 'idcampo'}, {name: 'denominacion'}, {name: 'idtipodato'}, {name: 'denomtipodato'}, {name: 'etiqueta'}])
    });

    smGpEncabesado = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    // Grid gestion gpAtributos
    gpEncabesado = new Ext.grid.GridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        loadMask: {msg: perfil.etiquetas.lbCargando},
        store: stGpEncabesado,
        height: 250,
        sm: smGpEncabesado,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idcampo'
            }, {
                header: perfil.etiquetas.lbCampo,
                id: 'expandir',
                width: 120,
                dataIndex: 'denominacion'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idtipodato'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'etiqueta'
            }, {
                header: perfil.etiquetas.lbTipoDato,
                width: 120,
                dataIndex: 'denomtipodato'
            }],
        tbar: [{icon: perfil.dirImg + 'adicionar.png', iconCls: 'btn',
                text: perfil.etiquetas.lbBtnAdicionar, handler: function() {
                    encabezado = true;
                    if (winAddCampos == undefined) {
                        importarJS('../../views/js/gesttipomodelo/gestattrtipomodelo.js');
                    }
                    else
                        winFpCampos('Enc');
                }},
            {icon: perfil.dirImg + 'eliminar.png', iconCls: 'btn', text: perfil.etiquetas.lbBtnEliminar,
                handler: function() {
                    Ext.getBody().mask(perfil.etiquetas.lbEspere);
                    Ext.Ajax.request({
                        url: 'eliminarAtributosdeEcabezadoATipoModelo',
                        params: {idcampo: gpEncabesado.getSelectionModel().getSelected().data.idcampo},
                        callback: function(options, success, response) {
                            Ext.getBody().unmask();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgEncEliminado);
                            } else
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                            gpEncabesado.getStore().reload();
                        }
                    });

                }}]
    });
}

function gestionarEncabesado() {
    winGestEncabesado = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
        title: perfil.etiquetas.lbDefinirEncabezado, width: 550, height: 300,
        constrain: true,
        items: gpEncabesado,
        buttons: [{
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbCerrar,
                handler: function() {
                    winGestEncabesado.hide();
                }}]
    });
    stGpEncabesado.load({params: {idtipomodelo: smGpGestTipoModelo.getSelected().data.idtipomodelo}});
    winGestEncabesado.show();
    winGestEncabesado.doLayout();
}

function importarEncabezado()
{
    var stGestTipoModelo, smGestTipoModelo, gpTModelo, vpTModelo, gpAtribt;

    stGestTipoModelo = new Ext.data.Store({
        url: 'listarTiposModelo',
        listeners: {
            beforeload: function() {
                stGestTipoModelo.baseParams.codigo = Ext.getCmp('tbcodigo').getValue();
                stGestTipoModelo.baseParams.denominacion = Ext.getCmp('tbdenominacion').getValue();
                stGestTipoModelo.baseParams.estado = Ext.getCmp('tbestado').getValue();
                stGestTipoModelo.baseParams.direction = 'ASC';
                stGestTipoModelo.baseParams.field = 'denominacion';
            },
            'load': function() {
                smGpGestTipoModelo.selectFirstRow();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idtipomodelo"
        }, [{
                name: 'idtipomodelo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idtabla'
            }, {
                name: 'codigo'
            }, {
                name: 'estado'
            }]
                )
    });

    // Selection Model grid smGpGestTipoModelo
    smGestTipoModelo = new Ext.grid.RowSelectionModel({singleSelect: true});


    // Grid gestion gpTipoModelo
    gpTModelo = new Ext.grid.GridPanel({
        frame: true,
        title: "Tipos de Modelos",
        height: 300,
        autoWidth: true,
        autoExpandColumn: 'expandir',
        region: 'center',
        store: stGestTipoModelo,
        sm: smGestTipoModelo,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idtabla'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idtipomodelo'
            },
            {
                header: "Código",
                width: 100,
                sortable: false,
                dataIndex: 'codigo'
            },
            {
                id: 'expandir',
                header: "Denominación",
                sortable: true,
                dataIndex: 'denominacion'
            }],
        loadMask: {
            store: stGestTipoModelo
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stGestTipoModelo,
            displayInfo: true
        })
    });

    stGestAtributos = new Ext.data.Store({
        url: 'listarColumnasEncabezado',
        listeners: {
            'load': function(st, recordArray, opt) {
                if (st.getCount() > 0) {
                    smGpGestAtributos.selectFirstRow();
                    btnDelAtributos.enable();
                } else {
                    btnDelAtributos.disable();
                }

            }, beforeload: function(st, opt) {
                stGestAtributos.removeAll();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idcampo"
        },
        [{name: 'idcampo'}, {name: 'denominacion'}, {name: 'etiqueta'},
            {name: 'idtipodato'}, {name: 'denomtipodato'},
            {name: 'formato'}
        ]
                )
    });

// Selection Model grid smGpGestAtributos
    smGestAtributos = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

// Grid gestion gpAtributos
    gpAtribt = new Ext.grid.GridPanel({
        frame: true,
        title: "Campos del encabezado",
        loadMask: {msg: perfil.etiquetas.lbCargando},
        store: stGestAtributos,
        root_title: perfil.etiquetas.lbColumnas,
        region: 'south',
        height: 250,
        titleCollapse: true,
        split: true,
        sm: smGestAtributos,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idcampo'
            },
            {
                id: 'expandir',
                header: "Denominación",
                width: 100,
                dataIndex: 'etiqueta'
            },
            {
                header: "Tipo dato",
                width: 120,
                dataIndex: 'denomtipodato'
            },
            {
                header: "UM",
                width: 70,
                dataIndex: 'formato', renderer: conFormato
            }]
    });

    var panel1 = new Ext.Panel({
        frame: true,
        autoWidth: true,
        height: 300,
        items: gpTModelo,
        layout: 'fit'
    });
    var panel2 = new Ext.Panel({
        frame: true,
        autoWidth: true,
        height: 200,
        items: gpAtribt,
        layout: 'form'
    });

// viewport de la plantilla
    vpTModelo = new Ext.Window({modal: true, closeAction: 'hide', layout: 'form',
        title: "Importar encabezado", width: 800, height: 600,
        constrain: true,
        items: [panel1, gpAtribt],
        buttons: [
            {
                iconCls: 'importar', text: 'Importar',
                handler: function() {
                    Ext.Ajax.request({
                        url: 'importarEncabezado',
                        params: {idtipomodelo: gpTModelo.getSelectionModel().getSelected().data.idtipomodelo},
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, "Se ha importado satisfactoriamente.");
                                vpTModelo.close();
                                gpEncabesado.getStore().reload();
                            } else
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                        }
                    });
                }},
            {
                iconCls: 'cancelar', text: 'Cerrar',
                handler: function() {
                    vpTModelo.close();
                }}]
    });

// Evento Selection Model grid rowselect
    gpTModelo.getSelectionModel().on('rowselect', function(smodel, rowIndex, record) {
        gpAtribt.expand();
        gpAtribt.getStore().reload({params: {idtipomodelo: record.data.idtipomodelo}});
    }, this);

    stGestTipoModelo.load({
        params: {
            start: 0,
            limit: 10
        }
    });
    vpTModelo.show();
}

importarEncabezado();

